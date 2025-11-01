const mongoose = require('mongoose');

const employeeActivitySchema = new mongoose.Schema({
  // Employee Information
  employeeId: {
    type: String,
    required: true,
    index: true
  },
  employeeName: {
    type: String,
    required: true
  },
  storeName: {
    type: String
  },
  locationId: {
    type: String
  },
  
  // Contact Information
  employeePhone: {
    type: String
  },
  email: {
    type: String
  },
  
  // Device & Browser Information
  browser: {
    type: String
  },
  browserVersion: {
    type: String
  },
  operatingSystem: {
    type: String
  },
  deviceType: {
    type: String
  },
  deviceModel: {
    type: String
  },
  screenResolution: {
    type: String
  },
  
  // Network Information
  ipAddress: {
    type: String
  },
  userAgent: {
    type: String
  },
  
  // Activity Details
  activityType: {
    type: String,
    enum: ['login', 'logout', 'search', 'scan', 'view_item', 'other'],
    default: 'login'
  },
  activityDescription: {
    type: String
  },
  
  // Scan Details (for activityType: 'scan')
  scanType: {
    type: String,
    enum: ['qr_code', 'barcode', 'manual', 'unknown']
  },
  scannedCode: {
    type: String
  },
  scanSuccess: {
    type: Boolean,
    default: true
  },
  scanError: {
    type: String
  },
  scanDuration: {
    type: Number // milliseconds to scan
  },
  
  // Additional Metadata
  sessionId: {
    type: String
  },
  duration: {
    type: Number // in seconds
  },
  
  // Timestamps
  loginTime: {
    type: Date,
    default: Date.now,
    index: true
  },
  logoutTime: {
    type: Date
  }
}, {
  timestamps: true
});

// Index for faster queries
employeeActivitySchema.index({ employeeId: 1, loginTime: -1 });
employeeActivitySchema.index({ loginTime: -1 });
employeeActivitySchema.index({ activityType: 1, loginTime: -1 });
employeeActivitySchema.index({ scannedCode: 1 });

module.exports = mongoose.model('EmployeeActivity', employeeActivitySchema);

