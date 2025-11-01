const EmployeeActivity = require('../models/employeeActivity');
const { getDeviceInfo } = require('../utils/deviceDetector');

/**
 * Detect if code is QR Code or Barcode based on format
 */
const detectCodeType = (code) => {
  // QR codes are typically alphanumeric and longer
  // Barcodes are usually numeric
  if (!code) return 'unknown';
  
  // Check if it's purely numeric (likely barcode)
  if (/^\d+$/.test(code)) {
    return 'barcode';
  }
  
  // Check if it contains alphanumeric with specific pattern (likely QR code)
  if (/^[a-zA-Z0-9]{10,}$/.test(code)) {
    return 'qr_code';
  }
  
  return 'unknown';
};

/**
 * Save scan activity to MongoDB
 */
const saveScanActivity = async (req, res) => {
  try {
    const { 
      employeeId, 
      employeeName, 
      scannedCode,
      scanSuccess = true,
      error = null,
      scanDuration = null
    } = req.body;

    console.log('📊 Received scan activity data:', {
      employeeId,
      employeeName,
      scannedCode,
      hasEmployeeId: !!employeeId,
      employeeIdType: typeof employeeId,
      employeeIdValue: JSON.stringify(employeeId)
    });

    // Strict validation - reject if employeeId is missing, undefined, null, or literal "undefined"
    if (!employeeId || employeeId === 'undefined' || employeeId === 'null' || !scannedCode) {
      console.warn('⚠️ Invalid scan activity data:', { 
        employeeId, 
        scannedCode,
        reason: !employeeId ? 'no employeeId' : 
                employeeId === 'undefined' ? 'literal undefined' :
                employeeId === 'null' ? 'literal null' :
                !scannedCode ? 'no scannedCode' : 'unknown'
      });
      return res.status(400).json({
        status: 'error',
        message: 'Employee ID and scanned code are required',
        debug: { employeeId, scannedCode }
      });
    }

    const userAgent = req.headers['user-agent'] || 'Unknown';
    const deviceInfo = getDeviceInfo(userAgent, req);
    
    // Determine scan type: if method is 'manual', use that, otherwise auto-detect
    const providedMethod = req.body.searchMethod || req.body.scanMethod || req.body.scanType;
    const scanType = providedMethod === 'manual' ? 'manual' : detectCodeType(scannedCode);

    // Generate activity description based on scan type
    let activityDescription = '';
    if (scanType === 'manual') {
      activityDescription = `Manually searched for code: ${scannedCode}`;
    } else if (scanType === 'barcode') {
      activityDescription = `Scanned Barcode: ${scannedCode}`;
    } else if (scanType === 'qr_code') {
      activityDescription = `Scanned QR Code: ${scannedCode}`;
    } else {
      activityDescription = `Searched for code: ${scannedCode}`;
    }

    const activityData = {
      employeeId,
      employeeName: employeeName || 'Unknown',
      storeName: req.body.storeName || '',
      locationId: req.body.locationId || '',
      employeePhone: req.body.employeePhone || '',
      email: req.body.email || '',
      activityType: 'scan',
      activityDescription,
      
      // Scan-specific fields
      scanType,
      scannedCode,
      scanSuccess,
      scanError: error,
      scanDuration,
      
      // Device & Browser Information
      browser: deviceInfo.browser,
      browserVersion: deviceInfo.browserVersion,
      operatingSystem: deviceInfo.operatingSystem,
      deviceType: deviceInfo.deviceType,
      deviceModel: `${deviceInfo.deviceVendor} ${deviceInfo.deviceModel}`,
      screenResolution: deviceInfo.screenResolution,
      
      // Network Information
      ipAddress: deviceInfo.ipAddress,
      userAgent: deviceInfo.userAgent,
      
      sessionId: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };

    const activity = new EmployeeActivity(activityData);
    await activity.save();
    
    console.log(`✅ Scan activity saved: ${scannedCode} by ${employeeId}`);
    
    res.json({
      status: 'success',
      message: 'Scan activity saved',
      data: activity
    });
  } catch (error) {
    console.error('❌ Error saving scan activity:', error);
    console.error('❌ Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    res.status(500).json({
      status: 'error',
      message: 'Failed to save scan activity',
      error: error.message
    });
  }
};

module.exports = {
  saveScanActivity,
  detectCodeType
};

