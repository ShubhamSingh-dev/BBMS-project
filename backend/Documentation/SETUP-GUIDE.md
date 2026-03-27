# BBMS Backend - Complete Setup & Deployment Guide

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Local Development Setup](#local-development-setup)
3. [Database Setup](#database-setup)
4. [Running the Backend](#running-the-backend)
5. [Connecting Frontend](#connecting-frontend)
6. [Testing](#testing)
7. [Deployment](#deployment)
8. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Software
- **Node.js** v14 or higher (download from https://nodejs.org/)
- **npm** (comes with Node.js)
- **MongoDB** (local or MongoDB Atlas account)
- **Postman** (optional, for API testing)
- **Git** (optional, for version control)

### System Requirements
- Minimum 2GB RAM
- 500MB disk space
- Internet connection

---

## Local Development Setup

### Step 1: Extract/Clone Project
```bash
# If downloaded as ZIP
unzip BBMS-Backend.zip
cd BBMS-Backend

# Or if cloning from GitHub
git clone <repository-url>
cd BBMS-Backend
```

### Step 2: Install Dependencies
```bash
npm install
```

This will install:
- `express` - Web framework
- `mongoose` - MongoDB ODM
- `bcryptjs` - Password hashing
- `jsonwebtoken` - JWT authentication
- `cors` - Cross-origin support
- `dotenv` - Environment variables
- `morgan` - Logging
- `nodemon` - Auto-restart (dev only)

### Step 3: Create Environment File
Create `.env` file in root directory:

```
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/bbms

# Security
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_12345678
```

### For MongoDB Atlas (Cloud Database)
```
MONGODB_URI=mongodb+srv://username:password@cluster0.mongodb.net/bbms?retryWrites=true&w=majority
```

---

## Database Setup

### Option 1: Local MongoDB

**macOS (using Homebrew):**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Windows:**
1. Download from https://www.mongodb.com/try/download/community
2. Run installer and follow instructions
3. MongoDB runs as a service

**Linux (Ubuntu/Debian):**
```bash
wget -qO - https://www.mongodb.org/static/pgp/server-5.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/5.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-5.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
```

**Verify installation:**
```bash
mongosh
# Type: exit
```

### Option 2: MongoDB Atlas (Recommended)

1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create new cluster (free tier available)
4. Add IP address to whitelist
5. Create database user
6. Get connection string
7. Update `.env` with connection string

---

## Running the Backend

### Development Mode (with auto-restart)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

### Expected Output
```
✅ MongoDB Connected: localhost
🚀 Server running on port 5000
📍 Environment: development
🔗 API: http://localhost:5000/api
```

### Test Server is Running
```bash
# Open in browser or curl
http://localhost:5000

# Response:
{
  "message": "Welcome to BBMS Backend API",
  "version": "1.0.0",
  "status": "Server is running",
  "endpoints": {
    "auth": "/api/auth",
    "donors": "/api/donors",
    ...
  }
}
```

---

## Connecting Frontend

### Step 1: Update Frontend API Base URL

In your frontend project, create `js/config.js`:

```javascript
// js/config.js
const API_BASE_URL = 'http://localhost:5000/api';

export const API_ENDPOINTS = {
  // Auth
  LOGIN: `${API_BASE_URL}/auth/login`,
  REGISTER: `${API_BASE_URL}/auth/register`,
  LOGOUT: `${API_BASE_URL}/auth/logout`,
  
  // Donors
  GET_DONORS: `${API_BASE_URL}/donors`,
  CREATE_DONOR: `${API_BASE_URL}/donors`,
  
  // Requests
  GET_REQUESTS: `${API_BASE_URL}/requests`,
  CREATE_REQUEST: `${API_BASE_URL}/requests`,
  
  // Inventory
  GET_INVENTORY: `${API_BASE_URL}/inventory`,
  GET_AVAILABLE: `${API_BASE_URL}/inventory/available`,
  
  // Other endpoints...
};
```

### Step 2: Create API Helper Function

In your frontend project, create `js/api.js`:

```javascript
// js/api.js
import { API_ENDPOINTS } from './config.js';

export async function apiCall(endpoint, options = {}) {
  const token = localStorage.getItem('token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  try {
    const response = await fetch(endpoint, {
      ...options,
      headers,
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'API Error');
    }
    
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}
```

### Step 3: Update HTML Forms

**Example: Login Form**

```html
<!-- login.html -->
<form id="loginForm">
  <input type="email" id="email" placeholder="Email" required>
  <input type="password" id="password" placeholder="Password" required>
  <button type="submit">Login</button>
</form>

<script type="module">
  import { apiCall } from './js/api.js';
  import { API_ENDPOINTS } from './js/config.js';

  document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    try {
      const response = await apiCall(API_ENDPOINTS.LOGIN, {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      
      if (response.success) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        window.location.href = '/dashboard.html';
      } else {
        alert('Login failed: ' + response.message);
      }
    } catch (error) {
      alert('Error: ' + error.message);
    }
  });
</script>
```

**Example: Display Donors**

```html
<!-- donors.html -->
<table id="donorsTable">
  <thead>
    <tr>
      <th>Name</th>
      <th>Blood Type</th>
      <th>Donations</th>
      <th>Status</th>
    </tr>
  </thead>
  <tbody></tbody>
</table>

<script type="module">
  import { apiCall } from './js/api.js';
  import { API_ENDPOINTS } from './js/config.js';

  async function loadDonors() {
    try {
      const response = await apiCall(
        `${API_ENDPOINTS.GET_DONORS}?limit=20&page=1`
      );
      
      if (response.success) {
        const tbody = document.querySelector('#donorsTable tbody');
        tbody.innerHTML = response.data.map(donor => `
          <tr>
            <td>${donor.userId.name}</td>
            <td>${donor.bloodType}</td>
            <td>${donor.donationHistory.totalDonations}</td>
            <td>${donor.status}</td>
          </tr>
        `).join('');
      }
    } catch (error) {
      console.error('Error loading donors:', error);
      alert('Failed to load donors');
    }
  }

  // Load data when page loads
  loadDonors();
</script>
```

---

## Testing

### Using Postman

1. **Import Collection**
   - Open Postman
   - Create new collection "BBMS"
   - Add requests

2. **Test Authentication**
   ```
   POST http://localhost:5000/api/auth/register
   Body (JSON):
   {
     "name": "Test User",
     "email": "test@example.com",
     "password": "password123",
     "phone": "9876543210",
     "role": "donor"
   }
   ```

3. **Copy Token**
   - From response, copy `token`
   - Use in subsequent requests

4. **Add Token to Headers**
   - Authorization tab
   - Type: Bearer Token
   - Paste token

### Using cURL

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name":"John",
    "email":"john@test.com",
    "password":"123456",
    "phone":"9876543210"
  }'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@test.com","password":"123456"}'

# Get Donors (with token)
curl -X GET http://localhost:5000/api/donors \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## Deployment

### Deploy to Heroku

**Step 1: Create Heroku App**
```bash
heroku login
heroku create your-app-name
```

**Step 2: Update .env for Production**
```
NODE_ENV=production
JWT_SECRET=your_production_secret_key_very_long_random_string
MONGODB_URI=your_mongodb_atlas_connection_string
```

**Step 3: Push to Heroku**
```bash
git push heroku main
```

**Step 4: Check Logs**
```bash
heroku logs --tail
```

### Deploy to AWS (EC2)

1. Create EC2 instance
2. SSH into instance
3. Install Node.js and MongoDB
4. Clone repository
5. Install dependencies: `npm install`
6. Set environment variables
7. Run: `npm start`
8. Use PM2 for process management

### Deploy to DigitalOcean

1. Create Droplet
2. SSH into Droplet
3. Install Node.js: `curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -`
4. `sudo apt-get install -y nodejs`
5. Clone repository
6. `npm install`
7. `npm start`

### Production Checklist

- [ ] Set NODE_ENV=production
- [ ] Use strong JWT_SECRET
- [ ] Enable HTTPS
- [ ] Use MongoDB Atlas (not local)
- [ ] Set up firewall rules
- [ ] Enable CORS for frontend domain
- [ ] Set up logging
- [ ] Add rate limiting
- [ ] Configure backups
- [ ] Set up monitoring
- [ ] Use reverse proxy (nginx)
- [ ] Enable gzip compression

---

## Troubleshooting

### Issue: Cannot Connect to MongoDB

**Error:** `Error: connect ECONNREFUSED 127.0.0.1:27017`

**Solutions:**
1. Ensure MongoDB is running: `sudo systemctl start mongod`
2. Check connection string in .env
3. Verify database name is correct
4. For Atlas, check IP whitelist

### Issue: Port Already in Use

**Error:** `Error: listen EADDRINUSE: address already in use :::5000`

**Solution:**
```bash
# Find and kill process
lsof -ti:5000 | xargs kill -9

# Or change port in .env
PORT=5001
```

### Issue: JWT Token Invalid

**Error:** `Not authorized to access this route`

**Solutions:**
1. Ensure token is in localStorage
2. Check token format: `Authorization: Bearer TOKEN`
3. Login again to get new token
4. Check JWT_SECRET matches between login and verification

### Issue: CORS Error

**Error:** `Access to XMLHttpRequest blocked by CORS policy`

**Solution:** CORS is enabled in server.js. If still issues:
- Check frontend URL matches allowed origins
- Clear browser cache
- Check browser console for details

### Issue: Dependencies Not Installing

**Error:** `npm ERR! code ERESOLVE`

**Solution:**
```bash
npm install --legacy-peer-deps
```

### Issue: Environment Variables Not Loading

**Error:** `undefined is not defined` (for PORT, etc.)

**Solution:**
1. Ensure .env file exists in root
2. Restart server after creating .env
3. Don't quote values: `PORT=5000` (not `PORT="5000"`)
4. Check for .env in .gitignore

### Issue: MongoDB Connection Timeout

**Error:** `MongoServerError: connection timed out`

**Solutions:**
1. Check MongoDB Atlas IP whitelist
2. Verify connection string syntax
3. Check internet connection
4. Verify credentials are correct

---

## File Structure After Setup

```
BBMS-Backend/
├── models/
│   ├── User.js
│   ├── Donor.js
│   ├── BloodInventory.js
│   ├── BloodRequest.js
│   └── BloodBank.js
├── controllers/
│   ├── authController.js
│   ├── donorController.js
│   ├── inventoryController.js
│   ├── requestController.js
│   ├── bloodbankController.js
│   └── reportController.js
├── routes/
│   ├── auth.js
│   ├── donors.js
│   ├── inventory.js
│   ├── requests.js
│   ├── bloodbank.js
│   └── reports.js
├── middleware/
│   └── auth.js
├── node_modules/  (created after npm install)
├── .env
├── .gitignore
├── package.json
├── server.js
├── QUICKSTART.md
├── API-REFERENCE.md
├── FRONTEND-INTEGRATION.js
└── BBMS-Backend-README.md
```

---

## Next Steps

1. **Start Development**
   ```bash
   npm run dev
   ```

2. **Test API** using Postman or curl

3. **Connect Frontend** following the integration guide

4. **Add Sample Data** (optional)
   - Create admin user via register endpoint
   - Create blood bank info via PUT endpoint

5. **Deploy** when ready

---

## Resources

- **Express.js Docs:** https://expressjs.com/
- **MongoDB Docs:** https://docs.mongodb.com/
- **Mongoose Docs:** https://mongoosejs.com/
- **JWT Guide:** https://jwt.io/
- **Node.js Best Practices:** https://nodejs.org/en/docs/guides/nodejs-performance-best-practices/

---

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review API Reference documentation
3. Check MongoDB logs
4. Use browser DevTools (Network tab)
5. Check server console for errors

---

**Ready to build! Good luck! 🚀**
