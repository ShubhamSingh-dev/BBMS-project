# BBMS Backend - Complete Setup Guide

## Project Overview
Blood Bank Management System (BBMS) - A comprehensive backend API for managing blood inventory, donors, recipients, and blood bank operations.

## Features Included

### Core Functionality
- ✅ User Management (Admin, Donor, Recipient, Staff)
- ✅ Authentication & Authorization (JWT)
- ✅ Blood Inventory Management
- ✅ Donor Registration & Profile Management
- ✅ Blood Donation Tracking
- ✅ Blood Request Management
- ✅ Blood Bank Details & Configuration
- ✅ Reports & Analytics
- ✅ Blood Expiry Management
- ✅ Availability Checking

---

## Project Structure
```
BBMS-Backend/
├── config/
│   └── db.js                 # MongoDB Connection
├── models/
│   ├── User.js              # User Schema
│   ├── Donor.js             # Donor Schema
│   ├── BloodInventory.js    # Blood Inventory Schema
│   ├── BloodRequest.js      # Blood Request Schema
│   └── BloodBank.js         # Blood Bank Info Schema
├── routes/
│   ├── auth.js              # Auth Routes
│   ├── donors.js            # Donor Routes
│   ├── inventory.js         # Inventory Routes
│   ├── requests.js          # Request Routes
│   ├── bloodbank.js         # Blood Bank Routes
│   └── reports.js           # Reports Routes
├── controllers/
│   ├── authController.js
│   ├── donorController.js
│   ├── inventoryController.js
│   ├── requestController.js
│   ├── bloodbankController.js
│   └── reportController.js
├── middleware/
│   ├── auth.js              # JWT Verification
│   └── roleCheck.js         # Role Authorization
├── .env                     # Environment Variables
├── .gitignore
├── package.json
└── server.js                # Main Server File
```

---

## Installation & Setup

### Step 1: Prerequisites
- Node.js (v14+)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Step 2: Clone & Install Dependencies
```bash
# Navigate to backend directory
cd BBMS-Backend

# Install dependencies
npm install
```

### Step 3: Configure Environment Variables
Create `.env` file:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/bbms
JWT_SECRET=your_super_secret_jwt_key_change_this
NODE_ENV=development
```

### Step 4: Start MongoDB
```bash
# If using local MongoDB
mongod
```

### Step 5: Run Backend Server
```bash
# Development mode (with nodemon)
npm run dev

# Production mode
npm start
```

Backend will run on: `http://localhost:5000`

---

## API Endpoints

### 1. Authentication Routes
```
POST   /api/auth/register       - Register new user
POST   /api/auth/login          - Login user
POST   /api/auth/logout         - Logout user
GET    /api/auth/me             - Get current user (Protected)
PUT    /api/auth/updateProfile  - Update user profile (Protected)
```

### 2. Donor Routes
```
GET    /api/donors              - Get all donors
GET    /api/donors/:id          - Get donor by ID
POST   /api/donors              - Create donor profile
PUT    /api/donors/:id          - Update donor profile
DELETE /api/donors/:id          - Delete donor
GET    /api/donors/:id/history  - Get donation history
```

### 3. Blood Inventory Routes
```
GET    /api/inventory           - Get all blood inventory
GET    /api/inventory/:bloodType - Get inventory for blood type
POST   /api/inventory           - Add blood unit (Admin)
PUT    /api/inventory/:id       - Update blood unit
DELETE /api/inventory/:id       - Remove blood unit (Admin)
GET    /api/inventory/available - Get available blood types
```

### 4. Blood Request Routes
```
GET    /api/requests            - Get all requests
GET    /api/requests/:id        - Get request by ID
POST   /api/requests            - Create new request
PUT    /api/requests/:id        - Update request status
DELETE /api/requests/:id        - Cancel request
GET    /api/requests/status/:status - Get requests by status
```

### 5. Blood Bank Routes
```
GET    /api/bloodbank/info      - Get blood bank info
PUT    /api/bloodbank/info      - Update blood bank info (Admin)
GET    /api/bloodbank/stats     - Get statistics
GET    /api/bloodbank/capacity  - Get storage capacity
```

### 6. Reports Routes
```
GET    /api/reports/donors      - Donor statistics
GET    /api/reports/inventory   - Inventory report
GET    /api/reports/requests    - Request report
GET    /api/reports/expiry      - Expiry report
```

---

## Frontend Integration

### Connecting Frontend to Backend

#### 1. Update API Base URL
In your frontend JavaScript, create a `config.js`:
```javascript
// config.js
const API_BASE_URL = 'http://localhost:5000/api';

export const API = {
  AUTH: {
    LOGIN: `${API_BASE_URL}/auth/login`,
    REGISTER: `${API_BASE_URL}/auth/register`,
    LOGOUT: `${API_BASE_URL}/auth/logout`,
  },
  DONORS: {
    LIST: `${API_BASE_URL}/donors`,
    CREATE: `${API_BASE_URL}/donors`,
    UPDATE: (id) => `${API_BASE_URL}/donors/${id}`,
    DELETE: (id) => `${API_BASE_URL}/donors/${id}`,
  },
  INVENTORY: {
    LIST: `${API_BASE_URL}/inventory`,
    CREATE: `${API_BASE_URL}/inventory`,
    UPDATE: (id) => `${API_BASE_URL}/inventory/${id}`,
  },
  REQUESTS: {
    LIST: `${API_BASE_URL}/requests`,
    CREATE: `${API_BASE_URL}/requests`,
    UPDATE: (id) => `${API_BASE_URL}/requests/${id}`,
  },
};
```

#### 2. Example API Calls
```javascript
// Login Example
async function login(email, password) {
  try {
    const response = await fetch(API.AUTH.LOGIN, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    // Store token
    localStorage.setItem('token', data.token);
    return data;
  } catch (error) {
    console.error('Login failed:', error);
  }
}

// Get Donors Example
async function getDonors() {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(API.DONORS.LIST, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch donors:', error);
  }
}

// Create Donation Request Example
async function createRequest(bloodType, quantity, reason) {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(API.REQUESTS.CREATE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ bloodType, quantity, reason }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Request creation failed:', error);
  }
}
```

---

## Key Assumptions Made

1. **User Types**: Admin, Donor, Recipient, Staff (role-based access)
2. **Blood Types**: A+, A-, B+, B-, AB+, AB-, O+, O- (8 types)
3. **Authentication**: JWT-based (tokens in localStorage on frontend)
4. **Blood Expiry**: 42 days for standard blood units
5. **Request Status**: Pending, Approved, Rejected, Fulfilled, Expired
6. **Database**: MongoDB with Mongoose ODM
7. **CORS**: Enabled for localhost (configure as needed)
8. **Validation**: Input validation on backend
9. **Error Handling**: Structured error responses
10. **Security**: Password hashing, role-based authorization

---

## Environment Variables Explained
```
PORT              - Server port (default: 5000)
MONGODB_URI       - MongoDB connection string
JWT_SECRET        - Secret key for JWT signing
NODE_ENV          - Environment (development/production)
```

---

## Testing the API

### Using Postman/cURL

#### 1. Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@test.com","password":"123456","role":"donor"}'
```

#### 2. Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@test.com","password":"123456"}'
```

#### 3. Get Donors (use token from login)
```bash
curl -X GET http://localhost:5000/api/donors \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## Database Models Overview

### User Model
```
- id
- name
- email (unique)
- password (hashed)
- phone
- role (admin, donor, recipient, staff)
- createdAt
- updatedAt
```

### Donor Model
```
- id
- userId (reference)
- bloodType
- lastDonationDate
- donationCount
- medicalHistory
- address
- city
- state
- pincode
- status (eligible, not_eligible, suspended)
- createdAt
- updatedAt
```

### Blood Inventory Model
```
- id
- bloodType
- quantity
- collectionDate
- expiryDate
- donor (reference to Donor)
- status (available, used, expired, discarded)
- location/shelf
- createdAt
- updatedAt
```

### Blood Request Model
```
- id
- bloodType
- quantity
- requester (reference to User)
- reason
- status (pending, approved, rejected, fulfilled, expired)
- requestDate
- requiredByDate
- fulfillmentDate
- notes
- createdAt
- updatedAt
```

---

## Common Issues & Solutions

### Issue: MongoDB Connection Failed
**Solution**: Ensure MongoDB is running and connection string is correct
```bash
# Test connection
mongosh  # or mongo
```

### Issue: JWT Token Expired
**Solution**: Re-login to get new token

### Issue: CORS Error
**Solution**: Update CORS settings in `server.js` with your frontend URL

### Issue: Port Already in Use
**Solution**: 
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9
```

---

## Next Steps for Production

1. **Environment**: Set NODE_ENV=production
2. **Database**: Use MongoDB Atlas instead of local
3. **Security**: 
   - Use strong JWT_SECRET
   - Enable HTTPS
   - Add rate limiting
   - Implement input validation
4. **Deployment**: Deploy on Heroku, AWS, or DigitalOcean
5. **Logging**: Add Winston/Morgan for better logging
6. **Testing**: Add unit tests with Jest
7. **Documentation**: Generate API docs with Swagger

---

## Support
For issues, refer to individual file documentation included in the backend package.
