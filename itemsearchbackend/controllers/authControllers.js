// ✅ backend/api/loginEmployee.js
const axios = require('axios');
const EmployeeActivity = require('../models/employeeActivity');
const { getDeviceInfo } = require('../utils/deviceDetector');

const loginEmployee = async (req, res) => {
  const { employeeId, password } = req.body;

  console.log('📥 Received from frontend:', req.body);

  try {
    const response = await axios.post(
      'https://rootments.in/api/verify_employee',
      { employeeId, password },
      {
        headers: {
          Authorization: 'Bearer RootX-production-9d17d9485eb772e79df8564004d4a4d4',
        },
      }
    );

    console.log('✅ API Response:', response.data);

    // ✅ Save employee activity to MongoDB
    if (response.data && response.data.status === 'success') {
      const userAgent = req.headers['user-agent'] || 'Unknown';
      const deviceInfo = getDeviceInfo(userAgent, req);
      
      console.log('📊 Login API Response Data:', JSON.stringify(response.data.data, null, 2));
      
      const activityData = {
        employeeId: response.data.data?.employeeId || employeeId,
        employeeName: response.data.data?.employeeName || response.data.data?.Name || 'Unknown',
        storeName: response.data.data?.storeName || response.data.data?.Store || '',
        locationId: response.data.data?.locationId || '',
        employeePhone: response.data.data?.phoneNumber || '',
        email: response.data.data?.email || '',
        activityType: 'login',
        activityDescription: 'Employee login',
        
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

      try {
        const activity = new EmployeeActivity(activityData);
        await activity.save();
        console.log('✅ Employee activity saved to MongoDB');
      } catch (dbError) {
        console.error('⚠️ Failed to save activity to MongoDB:', dbError.message);
        // Don't fail the login if DB save fails
      }
    }

    res.json(response.data);
  } catch (error) {
    console.error('❌ Login error:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });

    res.status(500).json({
      status: 'error',
      message: 'Login failed.',
      debug: {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      },
    });
  }
};

module.exports = { loginEmployee };

