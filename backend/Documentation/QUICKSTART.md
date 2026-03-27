# BBMS Backend - Quick Start Guide

## 5-Minute Setup

### Step 1: Install Node.js Dependencies
```bash
cd BBMS-Backend
npm install
```

### Step 2: Configure Environment
Create `.env` file in root directory:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/bbms
JWT_SECRET=your_super_secret_jwt_key_12345
NODE_ENV=development
```

**For MongoDB Atlas (Cloud):**
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/bbms?retryWrites=true&w=majority
```

### Step 3: Start Backend Server
```bash
# Development mode (auto-restart on changes)
npm run dev

# Production mode
npm start
```

Server will run on: **http://localhost:5000**

---

## Directory Structure Explained

```
BBMS-Backend/
├── models/                 # Database schemas
│   ├── User.js            # User (Admin, Donor, Recipient, Staff)
│   ├── Donor.js           # Donor profile & history
│   ├── BloodInventory.js  # Blood stock management
│   ├── BloodRequest.js    # Blood requests
│   └── BloodBank.js       # Blood bank info
│
├── controllers/           # Business logic
│   ├── authController.js      # Login/Register
│   ├── donorController.js     # Donor management
│   ├── inventoryController.js # Inventory management
│   ├── requestController.js   # Request handling
│   ├── bloodbankController.js # Bank operations
│   └── reportController.js    # Analytics & reports
│
├── routes/               # API endpoints
│   ├── auth.js          # Auth endpoints
│   ├── donors.js        # Donor endpoints
│   ├── inventory.js     # Inventory endpoints
│   ├── requests.js      # Request endpoints
│   ├── bloodbank.js     # Bank endpoints
│   └── reports.js       # Report endpoints
│
├── middleware/          # Custom middleware
│   └── auth.js         # JWT authentication
│
├── server.js           # Main server file
├── package.json        # Dependencies
├── .env               # Environment config
└── .gitignore         # Git ignore rules
```

---

## API Endpoints Summary

### Authentication
```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
GET    /api/auth/me
PUT    /api/auth/updateProfile
```

### Donors
```
GET    /api/donors
GET    /api/donors/:id
POST   /api/donors
PUT    /api/donors/:id
DELETE /api/donors/:id
GET    /api/donors/:id/history
PUT    /api/donors/:id/status
```

### Inventory
```
GET    /api/inventory
GET    /api/inventory/:bloodType
GET    /api/inventory/available
POST   /api/inventory
PUT    /api/inventory/:id
DELETE /api/inventory/:id
GET    /api/inventory/expiry/check
```

### Requests
```
GET    /api/requests
GET    /api/requests/:id
GET    /api/requests/status/:status
POST   /api/requests
PUT    /api/requests/:id
PUT    /api/requests/:id/allocate
DELETE /api/requests/:id
```

### Blood Bank
```
GET    /api/bloodbank/info
PUT    /api/bloodbank/info
GET    /api/bloodbank/stats
GET    /api/bloodbank/capacity
GET    /api/bloodbank/dashboard
```

### Reports
```
GET    /api/reports/donors
GET    /api/reports/inventory
GET    /api/reports/requests
GET    /api/reports/expiry
```

---

## Frontend Integration

### 1. Set Base API URL
Create `js/api-config.js` in frontend:

```javascript
const API_BASE_URL = 'http://localhost:5000/api';

export default API_BASE_URL;
```

### 2. Helper Function for API Calls

```javascript
// api.js
const API_BASE_URL = 'http://localhost:5000/api';

export async function apiCall(endpoint, options = {}) {
  const token = localStorage.getItem('token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });
  
  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }
  
  return response.json();
}
```

### 3. Example: Login Implementation

```javascript
// In your login.js or auth.js
import { apiCall } from './api.js';

async function handleLogin(email, password) {
  try {
    const response = await apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    if (response.success) {
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      // Redirect to dashboard
      window.location.href = '/dashboard.html';
    } else {
      alert('Login failed: ' + response.message);
    }
  } catch (error) {
    console.error('Login error:', error);
    alert('Login error: ' + error.message);
  }
}
```

### 4. Example: Get Donors List

```javascript
async function loadDonors() {
  try {
    const response = await apiCall('/donors?limit=10&page=1');
    
    if (response.success) {
      displayDonors(response.data);
    }
  } catch (error) {
    console.error('Error loading donors:', error);
  }
}

function displayDonors(donors) {
  const table = document.getElementById('donorsTable');
  table.innerHTML = donors.map(donor => `
    <tr>
      <td>${donor.bloodType}</td>
      <td>${donor.donationHistory.totalDonations}</td>
      <td>${donor.status}</td>
      <td>${new Date(donor.donationHistory.lastDonationDate).toLocaleDateString()}</td>
    </tr>
  `).join('');
}
```

### 5. Example: Create Blood Request

```javascript
async function submitBloodRequest(formData) {
  try {
    const response = await apiCall('/requests', {
      method: 'POST',
      body: JSON.stringify({
        bloodType: formData.bloodType,
        quantity: formData.quantity,
        reason: formData.reason,
        urgency: formData.urgency,
        requiredByDate: formData.requiredByDate,
        location: {
          hospital: formData.hospital,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
        },
      }),
    });
    
    if (response.success) {
      alert('Request created successfully!');
      // Refresh requests list
      loadRequests();
    }
  } catch (error) {
    console.error('Error creating request:', error);
    alert('Failed to create request');
  }
}
```

---

## Database Setup

### Option 1: Local MongoDB
```bash
# Install MongoDB Community Edition
# https://docs.mongodb.com/manual/installation/

# Start MongoDB server
mongod

# Or with Homebrew (macOS)
brew services start mongodb-community
```

### Option 2: MongoDB Atlas (Recommended)
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create cluster
4. Get connection string
5. Update `.env` MONGODB_URI

---

## Testing API with Postman

### 1. Import Collection
Create new Postman collection with these requests:

**Register User**
```
POST http://localhost:5000/api/auth/register
Body (JSON):
{
  "name": "John Donor",
  "email": "john@example.com",
  "password": "123456",
  "phone": "9876543210",
  "role": "donor"
}
```

**Login**
```
POST http://localhost:5000/api/auth/login
Body (JSON):
{
  "email": "john@example.com",
  "password": "123456"
}

Response: { token, user }
Copy token for next requests
```

**Get Donors** (with token)
```
GET http://localhost:5000/api/donors
Headers:
  Authorization: Bearer YOUR_TOKEN_HERE
```

**Create Donor Profile**
```
POST http://localhost:5000/api/donors
Headers:
  Authorization: Bearer YOUR_TOKEN
Body (JSON):
{
  "bloodType": "O+",
  "dateOfBirth": "1990-05-15",
  "weight": 70,
  "height": 180,
  "gender": "male",
  "availability": "weekends",
  "location": {
    "address": "123 Main St",
    "city": "Ahmedabad",
    "state": "Gujarat",
    "pincode": "380001"
  }
}
```

---

## Common Issues & Solutions

### Issue: MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution:**
- Ensure MongoDB is running
- Check connection string in .env
- Try local vs Atlas connection

### Issue: JWT Token Invalid
```
Error: Not authorized to access this route
```
**Solution:**
- Ensure token is sent in Authorization header
- Format: `Authorization: Bearer YOUR_TOKEN`
- Login again if token expired

### Issue: CORS Error
```
Access to XMLHttpRequest blocked by CORS policy
```
**Solution:**
- CORS is already enabled in server.js
- If still issues, add frontend URL to cors config

### Issue: Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Solution:**
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Or change port in .env
PORT=5001
```

### Issue: Missing Dependencies
```
Error: Cannot find module 'express'
```
**Solution:**
```bash
npm install
```

---

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| PORT | Server port | 5000 |
| MONGODB_URI | Database connection | mongodb://localhost:27017/bbms |
| JWT_SECRET | Secret key for tokens | your_secret_key_here |
| NODE_ENV | Environment mode | development/production |

---

## Database Initialization (Optional)

Create `scripts/seed.js` to add sample data:

```javascript
const mongoose = require('mongoose');
const User = require('../models/User');
const BloodBank = require('../models/BloodBank');

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    // Create admin user
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@bbms.com',
      password: 'admin123',
      phone: '9999999999',
      role: 'admin',
    });
    
    // Create blood bank
    const bloodBank = await BloodBank.create({
      name: 'Central Blood Bank',
      email: 'info@bloodbank.com',
      phone: '9876543210',
      address: {
        street: '123 Medical Road',
        city: 'Ahmedabad',
        state: 'Gujarat',
        pincode: '380001',
      },
    });
    
    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
}

seedDatabase();
```

Run with: `node scripts/seed.js`

---

## Deployment Checklist

- [ ] Set NODE_ENV=production in .env
- [ ] Use strong JWT_SECRET
- [ ] Deploy to MongoDB Atlas (not local)
- [ ] Deploy on Heroku/AWS/DigitalOcean
- [ ] Enable HTTPS
- [ ] Update CORS origins
- [ ] Set up logging
- [ ] Add rate limiting
- [ ] Set up backups

---

## Support & Resources

- **Express.js**: https://expressjs.com/
- **MongoDB**: https://docs.mongodb.com/
- **Mongoose**: https://mongoosejs.com/
- **JWT**: https://jwt.io/

---

**Ready to use! Start development now!** 🚀
