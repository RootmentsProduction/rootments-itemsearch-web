# Employee Activity Tracking System

## Overview
This system tracks all employee login activities and saves comprehensive data to MongoDB for analytics purposes.

## Tracked Data

### Employee Information
- Employee ID
- Employee Name
- Store Name
- Location ID
- Phone Number
- Email

### Device & Browser Information
- Browser Name & Version
- Operating System & Version
- Device Type (Desktop/Mobile/Tablet)
- Device Model & Vendor
- Screen Resolution
- CPU Architecture
- Browser Engine

### Network Information
- IP Address
- Full User Agent String
- Accept Language
- Session ID

### Activity Details
- Activity Type (login, logout, search, scan, etc.)
- Login Timestamp
- Logout Timestamp (if applicable)
- Duration (if available)

### Scan Activity Details (for QR/Barcode scans)
- Scan Type (qr_code, barcode, manual, unknown)
- Scanned Code
- Scan Success Status
- Scan Error (if any)
- Scan Duration (in milliseconds)

## Database Schema

Collection: `employeeactivities`

```javascript
{
  employeeId: String,
  employeeName: String,
  storeName: String,
  locationId: String,
  employeePhone: String,
  email: String,
  browser: String,
  browserVersion: String,
  operatingSystem: String,
  deviceType: String,
  deviceModel: String,
  screenResolution: String,
  ipAddress: String,
  userAgent: String,
  activityType: String,
  activityDescription: String,
  scanType: String,
  scannedCode: String,
  scanSuccess: Boolean,
  scanError: String,
  scanDuration: Number,
  sessionId: String,
  duration: Number,
  loginTime: Date,
  logoutTime: Date,
  createdAt: Date,
  updatedAt: Date
}
```

## API Endpoints

### 1. Get All Activities
```
GET /api/auth/activities
```

Query Parameters:
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 50)
- `employeeId` - Filter by employee ID
- `startDate` - Filter by start date
- `endDate` - Filter by end date

Example:
```
GET /api/auth/activities?page=1&limit=50&employeeId=1234
```

### 2. Get Activity Statistics
```
GET /api/auth/activities/stats
```

Returns:
- Total logins
- Unique employees
- Today's logins
- Browser statistics
- Device statistics

Example:
```json
{
  "status": "success",
  "data": {
    "totalLogins": 1250,
    "uniqueEmployees": 45,
    "todayLogins": 23,
    "browserStats": [
      { "_id": "Chrome", "count": 850 },
      { "_id": "Safari", "count": 300 }
    ],
    "deviceStats": [
      { "_id": "mobile", "count": 650 },
      { "_id": "desktop", "count": 600 }
    ]
  }
}
```

### 3. Get Employee Activities
```
GET /api/auth/activities/employee/:employeeId
```

Returns last 100 activities for a specific employee.

### 4. Save Scan Activity
```
POST /api/scan-activity
```

Save a QR/Barcode scan activity.

Request Body:
```json
{
  "employeeId": "1234",
  "employeeName": "John Doe",
  "storeName": "Store ABC",
  "locationId": "9",
  "scannedCode": "3plx0925bz365ts9b6",
  "scanSuccess": true,
  "error": null,
  "scanDuration": 1250
}
```

The system automatically detects if the code is a QR code or barcode based on the format.

## MongoDB Connection

Connection String:
```
mongodb+srv://abhiram:root@cluster0.niouvcp.mongodb.net/itemsearch
```

Database: `itemsearch`
Collection: `employeeactivities`

## How It Works

### Login Tracking
1. **Login Flow**: When an employee logs in through `/api/auth/login`
2. **Device Detection**: System extracts browser, OS, device info from User-Agent
3. **IP Capture**: Gets IP address from request headers
4. **Data Storage**: Saves all collected data to MongoDB
5. **Non-blocking**: MongoDB save failure won't affect login

### Scan Tracking
1. **Scan Event**: When employee scans a QR code or barcode
2. **Code Detection**: System automatically detects if code is QR or barcode
3. **Device Info**: Captures browser, device, IP information
4. **Success Tracking**: Records success/failure status
5. **Duration Tracking**: Records how long the scan took
6. **Data Storage**: Saves scan data to MongoDB
7. **Non-blocking**: MongoDB save failure won't affect search

## Technologies Used

- **MongoDB**: Database for storing activities
- **Mongoose**: ODM for MongoDB
- **UAParser.js**: Browser/Device detection
- **Express.js**: API framework

## Indexes

For optimized queries:
- `employeeId` + `loginTime` (compound index)
- `loginTime` (descending)
- `activityType` + `loginTime` (compound index)
- `scannedCode` (index for code lookup)

## Usage in Frontend

The system automatically tracks:
- **All logins** - No frontend changes needed
- **All searches** - Automatically tracks manual typing, QR scans, and barcode scans

Search/scan tracking happens in the background when employees:
- Type a code manually in the search field
- Scan a QR code
- Scan a barcode

To view analytics, create an admin dashboard that calls the API endpoints.

## Search Method Detection

The system tracks how employees search:
- **Manual**: When typing codes in the search field
- **QR Code**: When scanning QR codes (alphanumeric, 10+ characters)
- **Barcode**: When scanning barcodes (purely numeric)
- **Unknown**: Format doesn't match above patterns

