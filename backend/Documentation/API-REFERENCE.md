# BBMS API Reference Documentation

## Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { /* response data */ }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message"
}
```

---

## Authentication Endpoints

### 1. Register User
**Endpoint:** `POST /api/auth/register`

**Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "9876543210",
  "role": "donor"
}
```

**Role Options:** `admin`, `donor`, `recipient`, `staff`

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "65a1b2c3d4e5f6g7h8i9j0k1",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "donor"
  }
}
```

---

### 2. Login
**Endpoint:** `POST /api/auth/login`

**Request:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "65a1b2c3d4e5f6g7h8i9j0k1",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "donor",
    "status": "active"
  }
}
```

**Error Response (Invalid credentials):**
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

---

### 3. Get Current User
**Endpoint:** `GET /api/auth/me`

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "9876543210",
    "role": "donor",
    "status": "active",
    "address": "123 Main St",
    "city": "Ahmedabad",
    "state": "Gujarat",
    "pincode": "380001",
    "isVerified": true,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

---

### 4. Update Profile
**Endpoint:** `PUT /api/auth/updateProfile`

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json
```

**Request:**
```json
{
  "name": "John Updated",
  "phone": "9999999999",
  "address": "456 New St",
  "city": "Ahmedabad",
  "state": "Gujarat",
  "pincode": "380002"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": { /* updated user data */ }
}
```

---

## Donor Endpoints

### 1. Get All Donors
**Endpoint:** `GET /api/donors`

**Query Parameters:**
```
?bloodType=O+&status=eligible&city=Ahmedabad&limit=10&page=1
```

**Response:**
```json
{
  "success": true,
  "count": 10,
  "total": 45,
  "page": 1,
  "pages": 5,
  "data": [
    {
      "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
      "userId": {
        "_id": "65a1b2c3d4e5f6g7h8i9j0k2",
        "name": "John Donor",
        "email": "john@example.com",
        "phone": "9876543210"
      },
      "bloodType": "O+",
      "dateOfBirth": "1990-05-15",
      "weight": 70,
      "height": 180,
      "gender": "male",
      "age": 33,
      "status": "eligible",
      "donationHistory": {
        "totalDonations": 5,
        "lastDonationDate": "2024-01-10T00:00:00.000Z",
        "nextEligibleDate": "2024-02-01T00:00:00.000Z"
      },
      "availability": "weekends",
      "rewardPoints": 250,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

---

### 2. Create Donor Profile
**Endpoint:** `POST /api/donors`

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json
```

**Request:**
```json
{
  "bloodType": "O+",
  "dateOfBirth": "1990-05-15",
  "weight": 70,
  "height": 180,
  "gender": "male",
  "medicalHistory": {
    "hasHighBloodPressure": false,
    "hasDiabetes": false,
    "hasHeartDisease": false,
    "medications": "None",
    "allergies": "None"
  },
  "availability": "weekends",
  "location": {
    "address": "123 Main St",
    "city": "Ahmedabad",
    "state": "Gujarat",
    "pincode": "380001"
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Donor profile created successfully",
  "data": { /* created donor data */ }
}
```

---

### 3. Get Donor by ID
**Endpoint:** `GET /api/donors/:id`

**Response:**
```json
{
  "success": true,
  "data": { /* donor details */ }
}
```

---

### 4. Update Donor
**Endpoint:** `PUT /api/donors/:id`

**Request:**
```json
{
  "bloodType": "O+",
  "weight": 72,
  "availability": "always"
}
```

---

### 5. Update Donor Status
**Endpoint:** `PUT /api/donors/:id/status`

**Request:**
```json
{
  "status": "not_eligible",
  "reason": "Medical condition"
}
```

**Status Options:** `eligible`, `not_eligible`, `suspended`, `inactive`

---

### 6. Get Donation History
**Endpoint:** `GET /api/donors/:id/history`

**Response:**
```json
{
  "success": true,
  "data": {
    "totalDonations": 5,
    "lastDonationDate": "2024-01-10T00:00:00.000Z",
    "nextEligibleDate": "2024-02-01T00:00:00.000Z",
    "status": "eligible",
    "reasonForIneligibility": null
  }
}
```

---

## Inventory Endpoints

### 1. Get All Inventory
**Endpoint:** `GET /api/inventory`

**Query Parameters:**
```
?bloodType=O+&status=available&limit=20&page=1
```

**Response:**
```json
{
  "success": true,
  "count": 20,
  "total": 150,
  "page": 1,
  "pages": 8,
  "data": [
    {
      "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
      "bloodType": "O+",
      "quantity": 10,
      "unit": "bags",
      "volume": 450,
      "collectionDate": "2024-01-10T00:00:00.000Z",
      "expiryDate": "2024-02-21T00:00:00.000Z",
      "status": "available",
      "isExpired": false,
      "daysUntilExpiry": 26,
      "testResults": {
        "hiv": "negative",
        "hepatitisB": "negative",
        "hepatitisC": "negative"
      },
      "donorId": { /* donor info */ },
      "storage": {
        "location": "Building A",
        "shelf": "A1",
        "temperature": 4
      }
    }
  ]
}
```

---

### 2. Get Available Blood Types
**Endpoint:** `GET /api/inventory/available`

**Response:**
```json
{
  "success": true,
  "data": [
    { "bloodType": "A+", "available": true, "quantity": 15 },
    { "bloodType": "A-", "available": false, "quantity": 0 },
    { "bloodType": "B+", "available": true, "quantity": 8 },
    { "bloodType": "B-", "available": true, "quantity": 3 },
    { "bloodType": "AB+", "available": false, "quantity": 0 },
    { "bloodType": "AB-", "available": false, "quantity": 0 },
    { "bloodType": "O+", "available": true, "quantity": 20 },
    { "bloodType": "O-", "available": true, "quantity": 12 }
  ]
}
```

---

### 3. Add Blood Unit
**Endpoint:** `POST /api/inventory`

**Headers:**
```
Authorization: Bearer ADMIN_OR_STAFF_TOKEN
```

**Request:**
```json
{
  "bloodType": "O+",
  "quantity": 10,
  "donorId": "65a1b2c3d4e5f6g7h8i9j0k1",
  "collectionDate": "2024-01-15",
  "testResults": {
    "bloodTyping": "O+",
    "rhesusFactor": "Positive",
    "hiv": "negative",
    "hepatitisB": "negative",
    "hepatitisC": "negative",
    "syphilis": "negative",
    "malaria": "negative"
  },
  "storage": {
    "location": "Building A",
    "shelf": "A1"
  }
}
```

---

### 4. Get Inventory by Blood Type
**Endpoint:** `GET /api/inventory/:bloodType`

**Response:**
```json
{
  "success": true,
  "count": 15,
  "bloodType": "O+",
  "status": "available",
  "data": [ /* inventory items */ ]
}
```

---

### 5. Check Expiry Units
**Endpoint:** `GET /api/inventory/expiry/check`

**Response:**
```json
{
  "success": true,
  "message": "3 units marked as expired",
  "data": [ /* expired units */ ]
}
```

---

## Blood Request Endpoints

### 1. Get All Requests
**Endpoint:** `GET /api/requests`

**Query Parameters:**
```
?status=pending&bloodType=O+&urgency=emergency&limit=20&page=1
```

**Response:**
```json
{
  "success": true,
  "count": 10,
  "total": 45,
  "page": 1,
  "pages": 5,
  "data": [
    {
      "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
      "requesterId": { /* requester info */ },
      "requesterName": "Hospital Admin",
      "requesterPhone": "9876543210",
      "requesterEmail": "hospital@example.com",
      "bloodType": "O+",
      "quantity": 5,
      "unit": "bags",
      "reason": "emergency",
      "description": "Critical surgery",
      "urgency": "emergency",
      "status": "pending",
      "requestDate": "2024-01-15T10:30:00.000Z",
      "requiredByDate": "2024-01-15T14:00:00.000Z",
      "recipientDetails": {
        "name": "Patient Name",
        "age": 45,
        "bloodType": "O+",
        "medicalReason": "Accident"
      },
      "location": {
        "hospital": "City Hospital",
        "address": "456 Hospital Road",
        "city": "Ahmedabad"
      },
      "allocatedInventoryIds": [],
      "notes": "Urgent request"
    }
  ]
}
```

---

### 2. Create Blood Request
**Endpoint:** `POST /api/requests`

**Request:**
```json
{
  "bloodType": "O+",
  "quantity": 5,
  "reason": "emergency",
  "urgency": "emergency",
  "requiredByDate": "2024-01-15T14:00:00.000Z",
  "recipientDetails": {
    "name": "Patient Name",
    "age": 45,
    "gender": "male",
    "bloodType": "O+",
    "hospitalName": "City Hospital",
    "doctorName": "Dr. Smith",
    "medicalReason": "Accident injury"
  },
  "location": {
    "hospital": "City Hospital",
    "address": "456 Hospital Road",
    "city": "Ahmedabad",
    "state": "Gujarat",
    "pincode": "380001"
  }
}
```

**Reason Options:** `surgery`, `accident`, `disease`, `blood_transfusion`, `emergency`, `general`

**Urgency Options:** `routine`, `urgent`, `emergency`

---

### 3. Update Request Status
**Endpoint:** `PUT /api/requests/:id`

**Request:**
```json
{
  "status": "approved",
  "approverNotes": "Approved by Dr. Admin"
}
```

**Status Options:** `pending`, `approved`, `rejected`, `fulfilled`, `expired`, `cancelled`

**For rejection:**
```json
{
  "status": "rejected",
  "rejectionReason": "Insufficient blood inventory"
}
```

---

### 4. Allocate Blood Units
**Endpoint:** `PUT /api/requests/:id/allocate`

**Request:**
```json
{
  "inventoryIds": [
    "65a1b2c3d4e5f6g7h8i9j0k1",
    "65a1b2c3d4e5f6g7h8i9j0k2",
    "65a1b2c3d4e5f6g7h8i9j0k3"
  ]
}
```

---

### 5. Get Requests by Status
**Endpoint:** `GET /api/requests/status/:status`

**Response:**
```json
{
  "success": true,
  "count": 10,
  "total": 35,
  "status": "pending",
  "data": [ /* requests with this status */ ]
}
```

---

### 6. Cancel Request
**Endpoint:** `DELETE /api/requests/:id`

**Response:**
```json
{
  "success": true,
  "message": "Request cancelled successfully",
  "data": { /* cancelled request */ }
}
```

---

## Blood Bank Endpoints

### 1. Get Blood Bank Info
**Endpoint:** `GET /api/bloodbank/info`

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
    "name": "Central Blood Bank",
    "email": "info@bloodbank.com",
    "phone": "9876543210",
    "registrationNumber": "REG123456",
    "address": {
      "street": "123 Medical Road",
      "city": "Ahmedabad",
      "state": "Gujarat",
      "pincode": "380001"
    },
    "operatingHours": { /* hours for each day */ },
    "capacity": {
      "maxStorage": 500,
      "currentUsage": 150,
      "storageTemperature": 4
    },
    "accreditation": {
      "isAccredited": true,
      "accreditationBody": "AABB",
      "validUntil": "2025-12-31"
    },
    "inventory": {
      "totalUnits": 150,
      "bloodTypes": {
        "A+": 15,
        "A-": 5,
        "B+": 10,
        "B-": 3,
        "AB+": 2,
        "AB-": 1,
        "O+": 85,
        "O-": 24
      }
    },
    "statistics": {
      "totalDonors": 256,
      "totalDonations": 489,
      "totalRequests": 123,
      "totalFulfilled": 115,
      "totalRejected": 8
    }
  }
}
```

---

### 2. Get Statistics
**Endpoint:** `GET /api/bloodbank/stats`

**Response:**
```json
{
  "success": true,
  "data": {
    "donors": {
      "total": 256,
      "byBloodType": [
        { "_id": "O+", "count": 85, "eligible": 80 },
        { "_id": "A+", "count": 45, "eligible": 42 }
      ]
    },
    "inventory": {
      "total": 150,
      "available": 140,
      "used": 8,
      "expired": 2,
      "byBloodType": [
        { "_id": "O+", "available": 85, "total": 87 }
      ]
    },
    "requests": {
      "total": 123,
      "pending": 5,
      "fulfilled": 115,
      "rejected": 8,
      "fulfillmentRate": "93.50"
    }
  }
}
```

---

### 3. Get Storage Capacity
**Endpoint:** `GET /api/bloodbank/capacity`

**Response:**
```json
{
  "success": true,
  "data": {
    "maxCapacity": 500,
    "currentUsage": 150,
    "availableSpace": 350,
    "usagePercentage": "30.00",
    "storageTemperature": 4,
    "status": "normal"
  }
}
```

---

### 4. Get Dashboard Summary
**Endpoint:** `GET /api/bloodbank/dashboard`

**Response:**
```json
{
  "success": true,
  "data": {
    "summary": {
      "availableUnits": 140,
      "pendingRequests": 5,
      "activeDonors": 200
    },
    "recentRequests": [ /* last 5 requests */ ],
    "expiringUnits": {
      "count": 3,
      "units": [ /* units expiring in next 7 days */ ]
    }
  }
}
```

---

## Reports Endpoints

### 1. Donor Report
**Endpoint:** `GET /api/reports/donors`

**Query Parameters:**
```
?startDate=2024-01-01&endDate=2024-01-31
```

**Response:**
```json
{
  "success": true,
  "data": {
    "summary": {
      "total": 256,
      "eligible": 200,
      "ineligible": 56,
      "conversionRate": "78.13"
    },
    "byBloodType": [
      { "_id": "O+", "total": 85, "eligible": 75 },
      { "_id": "A+", "total": 45, "eligible": 38 }
    ],
    "byGender": [
      { "_id": "male", "count": 150 },
      { "_id": "female", "count": 106 }
    ],
    "topDonors": [ /* top 10 donors */ ],
    "averageStats": {
      "avgDonations": 1.91,
      "maxDonations": 12
    }
  }
}
```

---

### 2. Inventory Report
**Endpoint:** `GET /api/reports/inventory`

**Response:**
```json
{
  "success": true,
  "data": {
    "summary": {
      "total": 150,
      "available": 140,
      "used": 8,
      "expired": 2,
      "utilizationRate": "6.67"
    },
    "byBloodType": [ /* breakdown by blood type */ ],
    "expiringUnits": {
      "count": 3,
      "details": [ /* units expiring in next 30 days */ ]
    },
    "collectionTrend": [ /* trend data */ ]
  }
}
```

---

### 3. Request Report
**Endpoint:** `GET /api/reports/requests`

**Response:**
```json
{
  "success": true,
  "data": {
    "summary": {
      "total": 123,
      "pending": 5,
      "approved": 10,
      "fulfilled": 115,
      "rejected": 8,
      "fulfillmentRate": "93.50",
      "avgResponseTime": "24 hours"
    },
    "byUrgency": [ /* breakdown by urgency */ ],
    "byBloodType": [ /* breakdown by blood type */ ],
    "byReason": [ /* breakdown by reason */ ],
    "trend": [ /* trend data */ ]
  }
}
```

---

### 4. Expiry Report
**Endpoint:** `GET /api/reports/expiry`

**Response:**
```json
{
  "success": true,
  "data": {
    "expiredUnits": {
      "count": 2,
      "details": [ /* expired units */ ]
    },
    "expiringSoon": {
      "count": 3,
      "details": [ /* expiring in next 7 days */ ]
    },
    "expiringInMonth": {
      "count": 8,
      "details": [ /* expiring in next 30 days */ ]
    },
    "statistics": [ /* statistics by blood type */ ]
  }
}
```

---

## Error Codes

| Code | Status | Message |
|------|--------|---------|
| 400 | Bad Request | Invalid input data |
| 401 | Unauthorized | Missing or invalid token |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource not found |
| 500 | Server Error | Internal server error |

---

## Common Error Responses

### Unauthorized
```json
{
  "success": false,
  "message": "Not authorized to access this route"
}
```

### Forbidden
```json
{
  "success": false,
  "message": "User role 'donor' is not authorized to access this route"
}
```

### Not Found
```json
{
  "success": false,
  "message": "Resource not found"
}
```

### Validation Error
```json
{
  "success": false,
  "errors": [
    {
      "param": "email",
      "msg": "Valid email is required"
    }
  ]
}
```

---

## Rate Limiting

Currently, no rate limiting is implemented. For production, implement rate limiting middleware.

---

## Pagination

Most list endpoints support pagination:

**Query Parameters:**
```
?limit=20&page=1
```

**Response:**
```json
{
  "success": true,
  "count": 20,
  "total": 150,
  "page": 1,
  "pages": 8,
  "data": [ /* items */ ]
}
```

---

## Filtering

List endpoints support various filters:

**Example:**
```
GET /api/donors?bloodType=O+&status=eligible&city=Ahmedabad&limit=10&page=1
GET /api/requests?status=pending&urgency=emergency
GET /api/inventory?bloodType=A+&status=available
```

---

## Date Format

All dates are in ISO 8601 format:
```
2024-01-15T10:30:00.000Z
```

---

## Token Format

JWT tokens are returned after login/register. Include in all protected requests:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Token expires in 7 days.

---

**End of API Reference**
