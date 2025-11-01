# Employee Activity Analytics Summary

## What Data is Being Collected?

### 1. Employee Login Activity
**Tracked Automatically on every login:**

#### Employee Information
- Employee ID
- Employee Name  
- Store Name
- Location ID
- Phone Number
- Email

#### Device & Browser Information
- **Browser**: Chrome, Firefox, Safari, Edge, etc.
- **Browser Version**: e.g., 120.0.0
- **Operating System**: Windows, iOS, Android, macOS, etc.
- **OS Version**: e.g., 14.2, 10.0.26200
- **Device Type**: Desktop, Mobile, Tablet
- **Device Model**: e.g., "Samsung SM-G991B", "iPhone 15 Pro"
- **Screen Resolution**: Device screen size
- **CPU Architecture**: x64, ARM, etc.
- **Browser Engine**: Blink, WebKit, etc.

#### Network Information  
- **IP Address**: Employee's network IP
- **User Agent**: Full browser user agent string
- **Accept Language**: Preferred language settings
- **Session ID**: Unique session identifier

#### Login Details
- **Login Timestamp**: Exact time of login
- **Logout Timestamp**: Time when session ends (if tracked)
- **Activity Type**: "login"

---

### 2. Search/Scan Activity
**Tracked Automatically on every search or scan:**

#### All Login Data (Above)
Plus:

#### Search/Scan Specific Information
- **Search Method**: 
  - `manual` - **Manual typing** in search field
  - `qr_code` - Scanned using QR code scanner
  - `barcode` - Scanned using barcode scanner  
  - `unknown` - For unrecognized format
- **Scanned Code**: The actual code scanned
- **Scan Success**: true/false
- **Scan Error**: Error message if scan failed
- **Scan Duration**: Time taken in milliseconds

#### Example Search/Scan Data

**Manual Search:**
```javascript
{
  employeeId: "EMP123",
  employeeName: "John Doe",
  scannedCode: "3plx0925bz365ts9b6",
  scanType: "manual",
  scanSuccess: true,
  scanDuration: 850,
  browser: "Chrome",
  operatingSystem: "Windows",
  deviceType: "desktop"
}
```

**QR Code Scan:**
```javascript
{
  employeeId: "EMP123",
  employeeName: "John Doe",
  scannedCode: "3plx0925bz365ts9b6",
  scanType: "qr_code",
  scanSuccess: true,
  scanDuration: 1250,
  browser: "Chrome",
  operatingSystem: "Android",
  deviceType: "mobile"
}
```

**Barcode Scan:**
```javascript
{
  employeeId: "EMP123",
  employeeName: "John Doe",
  scannedCode: "123456789012",
  scanType: "barcode",
  scanSuccess: false,
  scanError: "No results found",
  scanDuration: 650,
  browser: "Safari",
  operatingSystem: "iOS",
  deviceType: "mobile"
}
```

---

## Analytics Available

### Login Analytics
1. **Total Logins**: Count of all login events
2. **Unique Employees**: Number of unique employee IDs
3. **Daily Login Stats**: Logins per day
4. **Time-based Patterns**: Peak login times
5. **Device Distribution**: Mobile vs Desktop usage
6. **Browser Statistics**: Most popular browsers
7. **OS Statistics**: Operating system distribution
8. **Store-wise Distribution**: Logins per store/location

### Search/Scan Analytics  
1. **Total Searches**: Count of all search/scan events
2. **Search Methods**: Manual vs QR vs Barcode distribution
3. **Success Rate**: Percentage of successful searches
4. **Average Duration**: Mean time per search
5. **Failed Search Reasons**: Common error patterns
6. **Most Searched Codes**: Popular item codes
7. **Employee Search Frequency**: Who searches most
8. **Device Performance**: Search speed by device type
9. **Method Preference**: Manual vs scanning preference

### Combined Analytics
1. **Employee Engagement**: Login frequency vs search activity
2. **Productivity Metrics**: Searches per session
3. **Device Efficiency**: Best performing devices
4. **Error Rate Trends**: Decreasing/increasing failure rates
5. **Geographic Patterns**: Activity by location/store
6. **Method Adoption**: Rate of scanner adoption vs manual entry

---

## Query Examples

### Get all searches/scans by an employee
```javascript
GET /api/auth/activities?activityType=scan&employeeId=EMP123
```

### Get only manual searches
```javascript
GET /api/auth/activities?activityType=scan&scanType=manual
```

### Get QR code scans only
```javascript
GET /api/auth/activities?activityType=scan&scanType=qr_code
```

### Get scans from last 7 days
```javascript
GET /api/auth/activities?startDate=2024-01-01&endDate=2024-01-07
```

### Get failure analysis
```javascript
GET /api/auth/activities?scanSuccess=false
```

### Get scan performance metrics
```javascript
// Returns all scans with duration > 5000ms (slow scans)
GET /api/auth/activities?scanDuration[$gte]=5000
```

### Get store-wise statistics
```javascript
GET /api/auth/activities/stats?storeName=SUITOR GUY KOTTAYAM
```

---

## Data Retention & Privacy

- **Data Retention**: All data stored indefinitely in MongoDB
- **Privacy Compliance**: IP addresses and user agents logged for analytics
- **Access Control**: Protected by API authentication
- **Data Export**: Can be exported via API endpoints

---

## Use Cases

1. **Performance Monitoring**: Track system usage and bottlenecks
2. **User Behavior**: Understand how employees use the system
3. **Bug Detection**: Identify scanning issues and errors
4. **Device Optimization**: Determine best devices for scanning
5. **Training Needs**: Find employees who need scanning training
6. **Inventory Analysis**: Most scanned items/codes
7. **Security**: Unusual activity detection
8. **Reporting**: Generate management reports

---

## Future Enhancements

Potential additions:
- Logout tracking with session duration
- Item view tracking (when items are displayed)
- Export functionality for reports
- Real-time dashboard
- Email alerts for unusual patterns
- Heat maps of search/scan activity
- Predictive analytics for popular codes
- Employee efficiency scoring

