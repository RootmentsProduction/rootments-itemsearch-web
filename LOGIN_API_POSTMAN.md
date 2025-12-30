# Login API Documentation for Postman

## 🔐 Employee Login API

### Endpoint
```
POST https://itemsearch-1.onrender.com/api/auth/login
```

### Headers
```
Content-Type: application/json
```

### Request Body Schema
```json
{
  "employeeId": "string",
  "password": "string"
}
```

### Request Body Example (Test Data)
```json
{
  "employeeId": "12345",
  "password": "your_password_here"
}
```

### Success Response Schema (200 OK)
```json
{
  "status": "success",
  "data": {
    "employeeId": "string",
    "employeeName": "string",
    "Name": "string",
    "storeName": "string",
    "Store": "string",
    "locationId": "string",
    "phoneNumber": "string",
    "email": "string"
  }
}
```

### Success Response Example
```json
{
  "status": "success",
  "data": {
    "employeeId": "12345",
    "employeeName": "John Doe",
    "Name": "John Doe",
    "storeName": "Main Store",
    "Store": "Main Store",
    "locationId": "01",
    "phoneNumber": "1234567890",
    "email": "john.doe@example.com"
  }
}
```

### Error Response Schema (500 Internal Server Error)
```json
{
  "status": "error",
  "message": "Login failed.",
  "debug": {
    "message": "string",
    "status": "number",
    "data": {}
  }
}
```

### Error Response Example
```json
{
  "status": "error",
  "message": "Login failed.",
  "debug": {
    "message": "Request failed with status code 401",
    "status": 401,
    "data": {
      "error": "Invalid credentials"
    }
  }
}
```

---

## 📋 Postman Collection JSON

You can import this into Postman:

```json
{
  "info": {
    "name": "Item Search API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Employee Login",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"employeeId\": \"12345\",\n  \"password\": \"your_password_here\"\n}"
        },
        "url": {
          "raw": "https://itemsearch-1.onrender.com/api/auth/login",
          "protocol": "https",
          "host": ["itemsearch-1", "onrender", "com"],
          "path": ["api", "auth", "login"]
        }
      },
      "response": []
    }
  ]
}
```

---

## 🧪 Test Cases for Postman

### Test Case 1: Valid Login
```json
{
  "employeeId": "12345",
  "password": "valid_password"
}
```
**Expected:** Status 200, `status: "success"`

### Test Case 2: Invalid Employee ID
```json
{
  "employeeId": "99999",
  "password": "any_password"
}
```
**Expected:** Status 500, `status: "error"`

### Test Case 3: Invalid Password
```json
{
  "employeeId": "12345",
  "password": "wrong_password"
}
```
**Expected:** Status 500, `status: "error"`

### Test Case 4: Missing Fields
```json
{
  "employeeId": "12345"
}
```
**Expected:** Status 500, `status: "error"`

---

## 📝 Postman Tests Script

Add this to the "Tests" tab in Postman:

```javascript
// Test response status
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

// Test response structure
pm.test("Response has status field", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property('status');
});

// Test successful login
pm.test("Login successful", function () {
    var jsonData = pm.response.json();
    if (jsonData.status === 'success') {
        pm.expect(jsonData.data).to.have.property('employeeId');
        pm.expect(jsonData.data).to.have.property('employeeName');
    }
});

// Save token or employee data to environment
pm.test("Save employee data", function () {
    var jsonData = pm.response.json();
    if (jsonData.status === 'success') {
        pm.environment.set("employeeId", jsonData.data.employeeId);
        pm.environment.set("employeeName", jsonData.data.employeeName || jsonData.data.Name);
        pm.environment.set("storeName", jsonData.data.storeName || jsonData.data.Store);
        pm.environment.set("locationId", jsonData.data.locationId);
    }
});
```

---

## 🔗 Related Endpoints

- **Base URL:** `https://itemsearch-1.onrender.com/api`
- **Login Endpoint:** `/auth/login`
- **Scan Activity:** `/scan-activity` (POST)
- **Item Search:** `/item-search` (GET)
- **Item Report:** `/item-report` (POST)






