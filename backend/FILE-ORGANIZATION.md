# BBMS Backend - Complete File Organization Guide

## 📦 FILES PROVIDED (28 Total)

All files are available in the outputs folder. Follow this guide to organize them.

---

## 🗂️ DIRECTORY STRUCTURE TO CREATE

```
BBMS-Backend/
│
├── 📁 models/
│   ├── User.js
│   ├── Donor.js
│   ├── BloodInventory.js
│   ├── BloodRequest.js
│   └── BloodBank.js
│
├── 📁 controllers/
│   ├── authController.js
│   ├── donorController.js
│   ├── inventoryController.js
│   ├── requestController.js
│   ├── bloodbankController.js
│   └── reportController.js
│
├── 📁 routes/
│   ├── auth.js
│   ├── donors.js
│   ├── inventory.js
│   ├── requests.js
│   ├── bloodbank.js
│   └── reports.js
│
├── 📁 middleware/
│   └── auth.js (rename from authMiddleware.js)
│
├── 📄 server.js
├── 📄 package.json
├── 📄 .env
├── 📄 .gitignore
│
├── 📖 PROJECT-SUMMARY.md
├── 📖 BBMS-Backend-README.md
├── 📖 QUICKSTART.md
├── 📖 SETUP-GUIDE.md
├── 📖 API-REFERENCE.md
└── 📄 FRONTEND-INTEGRATION.js
```

---

## 📋 STEP-BY-STEP SETUP

### Step 1: Create Project Structure
```bash
# Create main directory
mkdir BBMS-Backend
cd BBMS-Backend

# Create subdirectories
mkdir models
mkdir controllers
mkdir routes
mkdir middleware
```

### Step 2: Copy Configuration Files
Copy these to the **root** of BBMS-Backend/:
- `server.js` (or `1-server.js` from outputs)
- `package.json` (or `2-package.json` from outputs)
- `.env`
- `.gitignore`

### Step 3: Copy Model Files
Copy to `models/` folder:
- `User.js`
- `Donor.js`
- `BloodInventory.js`
- `BloodRequest.js`
- `BloodBank.js`

### Step 4: Copy Controller Files
Copy to `controllers/` folder:
- `authController.js`
- `donorController.js`
- `inventoryController.js`
- `requestController.js`
- `bloodbankController.js`
- `reportController.js`

### Step 5: Copy Route Files
Copy to `routes/` folder:
- `auth.js`
- `donors.js`
- `inventory.js`
- `requests.js`
- `bloodbank.js`
- `reports.js`

### Step 6: Copy Middleware
Copy to `middleware/` folder:
- `auth.js`

### Step 7: Copy Documentation
Copy to **root** folder:
- `PROJECT-SUMMARY.md`
- `BBMS-Backend-README.md`
- `QUICKSTART.md`
- `SETUP-GUIDE.md`
- `API-REFERENCE.md`
- `FRONTEND-INTEGRATION.js`

---

## ✅ VERIFICATION CHECKLIST

After copying all files, verify your structure:

```bash
# From BBMS-Backend directory
ls -la                          # Should show: server.js, package.json, .env, models/, controllers/, routes/, middleware/
ls models/                      # Should show 5 files
ls controllers/                 # Should show 6 files
ls routes/                      # Should show 6 files
ls middleware/                  # Should show auth.js
```

---

## 🚀 NEXT STEPS AFTER SETUP

### 1. Install Dependencies
```bash
npm install
```

### 2. Update .env File
Edit `.env` and change JWT_SECRET to something random:
```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/bbms
JWT_SECRET=your_super_secret_key_change_me_to_random_string_12345
```

### 3. Start MongoDB
```bash
# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Windows - if installed as service
# It should start automatically

# Or test connection
mongosh
```

### 4. Start Backend Server
```bash
npm run dev
```

You should see:
```
✅ MongoDB Connected: localhost
🚀 Server running on port 5000
📍 Environment: development
🔗 API: http://localhost:5000/api
```

### 5. Test Backend
```bash
# In browser or curl
http://localhost:5000

# Should return JSON with welcome message
```

---

## 📁 FILE DESCRIPTIONS

### Configuration Files
- **server.js** - Main server entry point with Express setup
- **package.json** - Project dependencies and npm scripts
- **.env** - Environment variables (API keys, database URL)
- **.gitignore** - Git ignore patterns

### Models (Database Schemas)
- **User.js** - User authentication & profile (Admin, Donor, Recipient, Staff)
- **Donor.js** - Donor registration, medical history, donation tracking
- **BloodInventory.js** - Blood stock management with test results
- **BloodRequest.js** - Blood request tracking and fulfillment
- **BloodBank.js** - Blood bank information and statistics

### Controllers (Business Logic)
- **authController.js** - Registration, login, profile management
- **donorController.js** - Donor CRUD, status updates, history
- **inventoryController.js** - Add/update blood units, manage stock
- **requestController.js** - Create/manage requests, allocate units
- **bloodbankController.js** - Bank info, statistics, dashboard
- **reportController.js** - Analytics and reporting

### Routes (API Endpoints)
- **auth.js** - /api/auth/* endpoints
- **donors.js** - /api/donors/* endpoints
- **inventory.js** - /api/inventory/* endpoints
- **requests.js** - /api/requests/* endpoints
- **bloodbank.js** - /api/bloodbank/* endpoints
- **reports.js** - /api/reports/* endpoints

### Middleware
- **auth.js** - JWT verification and role-based authorization

### Documentation
- **PROJECT-SUMMARY.md** - Complete project overview
- **BBMS-Backend-README.md** - Features and structure
- **QUICKSTART.md** - 5-minute setup guide
- **SETUP-GUIDE.md** - Complete setup and deployment
- **API-REFERENCE.md** - Detailed API documentation
- **FRONTEND-INTEGRATION.js** - Frontend code examples

---

## 🔧 COMMON ISSUES WHILE ORGANIZING

### Issue: File Not Found
**Solution:** Make sure you're copying from the outputs folder, not looking for files that haven't been created yet.

### Issue: Wrong Folder Structure
**Solution:** Use the tree structure above as a reference. Double-check folder names are lowercase.

### Issue: Git Ignoring Node Modules
**Solution:** That's correct! Run `npm install` after copying package.json.

---

## 📚 READING ORDER

After setup, read documentation in this order:

1. **PROJECT-SUMMARY.md** - Get overview (5 min)
2. **QUICKSTART.md** - Setup guide (10 min)
3. **API-REFERENCE.md** - Understand API (20 min)
4. **FRONTEND-INTEGRATION.js** - Connect frontend (15 min)
5. **SETUP-GUIDE.md** - Full details as needed

---

## 🎯 WHAT YOU HAVE

✅ Complete Express.js Backend
✅ MongoDB Integration
✅ JWT Authentication
✅ 38 API Endpoints
✅ 5 Database Models
✅ Role-Based Access Control
✅ Complete Documentation
✅ Frontend Integration Examples
✅ Production-Ready Code
✅ Best Practices Implemented

---

## ⚡ QUICK START COMMANDS

```bash
# After organizing files:
cd BBMS-Backend
npm install
# Edit .env file with your settings
npm run dev
# Server runs on http://localhost:5000
```

---

## 📞 NEED HELP?

- **Setup Issues?** → Read SETUP-GUIDE.md > Troubleshooting
- **API Questions?** → Check API-REFERENCE.md
- **Frontend Help?** → See FRONTEND-INTEGRATION.js
- **Quick Questions?** → Read QUICKSTART.md

---

**You now have everything needed to run the complete BBMS Backend! 🚀**
