# BBMS Backend - Troubleshooting Guide

## Quick Reference

| Problem | Solution |
|---------|----------|
| MongoDB connection error | Ensure MongoDB is running: `mongod` |
| Port already in use | Kill process: `lsof -ti:5000 \| xargs kill -9` |
| Module not found | Run: `npm install` |
| JWT errors | Re-login to get new token |
| CORS errors | Check frontend URL in CORS config |
| Slow queries | Add database indexes |
| Memory leak | Check for unfinished connections |

---

## MongoDB Issues

### Issue 1: MongoDB Connection Failed
**Error:** `Error: connect ECONNREFUSED 127.0.0.1:27017`

**Causes & Solutions:**

```bash
# Solution 1: Start MongoDB
# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Windows (Command Prompt as Admin)
net start MongoDB

# Solution 2: Check if running
ps aux | grep mongod  # macOS/Linux
tasklist | find "mongod"  # Windows

# Solution 3: Check connection string
# In .env, verify:
MONGODB_URI=mongodb://localhost:27017/bbms

# Solution 4: Test connection manually
mongosh
# or
mongo
```

### Issue 2: MongoDB Atlas Connection Failed
**Error:** `MongoServerError: connection timed out`

**Causes & Solutions:**

```
✓ Check IP Whitelist in Atlas
  - Go to MongoDB Atlas Dashboard
  - Security > Network Access
  - Add your IP address or 0.0.0.0/0 for development

✓ Verify Connection String Format
  mongodb+srv://username:password@cluster0.mongodb.net/dbname?retryWrites=true&w=majority

✓ Check Username & Password
  - Ensure no special characters need escaping
  - If password has @, use %40
  - If password has :, use %3A

✓ Test Connection String
  mongosh "mongodb+srv://username:password@cluster.mongodb.net/test"
```

### Issue 3: Database Permissions Error
**Error:** `MongoAuthenticationError: authentication failed`

**Solutions:**

```bash
# Create database user in MongoDB
db.createUser({
  user: "bbms_user",
  pwd: "secure_password",
  roles: ["readWrite"]
})

# Update .env with credentials
MONGODB_URI=mongodb://bbms_user:secure_password@localhost:27017/bbms
```

### Issue 4: Database Quota Exceeded
**Error:** `Disk space limit exceeded`

**Solutions:**

```bash
# Check database size
mongosh
> db.stats()

# Clean up old data
> db.bloodInventory.deleteMany({ status: "expired" })

# Compact database
> db.runCommand( { compact: 'collectionName' } )

# Upgrade MongoDB Atlas tier
```

---

## Server & Port Issues

### Issue 5: Port Already in Use
**Error:** `Error: listen EADDRINUSE: address already in use :::5000`

**Solutions:**

```bash
# macOS/Linux - Find and kill process
lsof -ti:5000 | xargs kill -9

# Windows - Find and kill process
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Solution 2: Change port
# Edit .env
PORT=5001

# Solution 3: Use different tool
# Try port 3000, 8000, 8080, etc.
PORT=8000 npm run dev
```

### Issue 6: Server Crashes on Startup
**Error:** `Error: Cannot find module 'express'` or similar

**Solutions:**

```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Check Node version (should be v14+)
node --version

# Update npm
npm install -g npm

# Try clearing npm cache
npm cache clean --force
npm install
```

### Issue 7: Server Running but API Not Responding
**Error:** API timeouts or no response

**Solutions:**

```bash
# Check if server is actually running
curl http://localhost:5000

# Check server logs for errors
# Look for error messages in console

# Verify database connection
# Check MongoDB is running and accessible

# Check firewall
# Ensure port 5000 is not blocked

# Restart server
# Kill process and restart: npm run dev
```

---

## Authentication & JWT Issues

### Issue 8: JWT Token Invalid
**Error:** `Not authorized to access this route`

**Solutions:**

```javascript
// Check 1: Token is being sent
// In frontend, ensure:
const token = localStorage.getItem('token');
console.log('Token:', token); // Should not be null

// Check 2: Token format is correct
// Header should be:
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
// NOT:
Authorization: eyJhbGciOiJIUzI1NiIs... // Missing "Bearer"

// Check 3: Token not expired
// Tokens expire in 7 days
// Re-login to get new token

// Check 4: JWT_SECRET matches
// Ensure .env JWT_SECRET is same as in code
console.log('JWT_SECRET:', process.env.JWT_SECRET);
```

### Issue 9: Login Fails with Valid Credentials
**Error:** `Invalid credentials` even with correct email/password

**Solutions:**

```javascript
// Check 1: User exists
// In MongoDB compass, check Users collection

// Check 2: Password hashing
// Passwords should be hashed, not stored as plaintext
// Re-register user to hash password correctly

// Check 3: Email case sensitivity
// Email should be stored lowercase
// In User model, verify email normalization

// Check 4: Database connection
// Ensure MongoDB is connected before login attempt
```

### Issue 10: Token Expired Too Quickly
**Error:** Token expires before expected

**Solutions:**

```javascript
// Check JWT_SECRET in .env
// If changed, all existing tokens become invalid

// Verify token expiry setting
// In User model method:
userSchema.methods.getSignedJwt = function () {
  const jwt = require('jsonwebtoken');
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: '7d', // Should be 7d or longer
  });
};

// Update token expiry if needed
expiresIn: '30d' // Change to longer period
```

---

## CORS Issues

### Issue 11: CORS Error
**Error:** `Access to XMLHttpRequest blocked by CORS policy`

**Solutions:**

```javascript
// Solution 1: Check CORS is enabled in server.js
const cors = require('cors');
app.use(cors());

// Solution 2: Configure specific origins
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'https://yourdomain.com',
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);

// Solution 3: Check frontend URL
// Frontend must be on allowed list
// If frontend is on localhost:3000, add to allowedOrigins

// Solution 4: Preflight requests
// Ensure OPTIONS requests are handled
app.options('*', cors());
```

### Issue 12: Credentials Not Sent with Request
**Error:** Token not sent with cross-origin request

**Solutions:**

```javascript
// Frontend: Add credentials
fetch('http://localhost:5000/api/donors', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  },
  credentials: 'include', // Add this
});

// Backend: Enable credentials
app.use(cors({
  credentials: true, // Add this
  origin: 'http://localhost:3000',
}));
```

---

## Database Query Issues

### Issue 13: Slow Database Queries
**Error:** API responses take more than 1 second

**Solutions:**

```javascript
// Solution 1: Add indexes
// In models, add:
userSchema.index({ email: 1 });
donorSchema.index({ bloodType: 1, status: 1 });
bloodInventorySchema.index({ expiryDate: 1 });

// Solution 2: Use .select() to limit fields
// Slow:
const donors = await Donor.find();

// Fast:
const donors = await Donor.find().select('bloodType status').lean();

// Solution 3: Use pagination
const page = req.query.page || 1;
const limit = 20;
const skip = (page - 1) * limit;
const donors = await Donor.find().skip(skip).limit(limit);

// Solution 4: Check MongoDB logs
// In MongoDB Compass, check profiler
// Or run: db.setProfilingLevel(1)
```

### Issue 14: Duplicate Key Error
**Error:** `E11000 duplicate key error`

**Causes:**

```javascript
// Usually happens with unique fields like email
// Solutions:

// 1. Delete duplicate documents
db.users.deleteMany({ email: 'test@example.com' })

// 2. Clear unique index
db.users.collection.dropIndex('email_1')

// 3. Drop and recreate collection
db.users.drop()

// 4. In model, ensure unique constraint
userSchema.index({ email: 1 }, { unique: true });
```

---

## Environment & Configuration Issues

### Issue 15: Environment Variables Not Loading
**Error:** `undefined is not defined` for process.env variables

**Solutions:**

```bash
# Check 1: .env file exists
ls -la .env  # macOS/Linux
dir .env     # Windows

# Check 2: .env is in root directory
# Should be at: BBMS-Backend/.env
# NOT at: BBMS-Backend/models/.env

# Check 3: .env format is correct
# Should be:
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/bbms

# NOT:
PORT = 5000 (no spaces)
"PORT"=5000 (no quotes)

# Check 4: Restart server after editing .env
# Changes only take effect on restart

# Check 5: .env is not in .gitignore
# If you're cloning, .env might not be included
# Copy from .env.example if provided
```

### Issue 16: .env File Committed to Git
**Solutions:**

```bash
# If .env is already committed:
git rm --cached .env
echo '.env' >> .gitignore
git commit -m "Remove .env from git"

# For future commits:
git config core.excludesfile ~/.gitignore_global
echo '.env' >> ~/.gitignore_global
```

---

## Frontend Integration Issues

### Issue 17: Frontend Can't Connect to Backend
**Error:** `fetch failed` or connection timeout

**Solutions:**

```javascript
// Check 1: Backend is running
// Terminal: npm run dev
// Should show: Server running on port 5000

// Check 2: API URL is correct
const API_BASE_URL = 'http://localhost:5000/api';
// NOT: 'http://localhost:3000/api'
// NOT: 'http://5000/api'

// Check 3: Firewall allows connection
// macOS: System Preferences > Security & Privacy
// Windows: Windows Defender > Firewall

// Check 4: Network is accessible
// Frontend and backend on same network
// If on different machines, use IP instead of localhost
const API_BASE_URL = 'http://192.168.1.100:5000/api';

// Check 5: CORS is configured
// Verify CORS is enabled in server.js
app.use(cors());
```

### Issue 18: Data Not Persisting in Database
**Error:** Data is created but lost after restart

**Solutions:**

```javascript
// Check 1: Database connection is successful
// Server should log: ✅ MongoDB Connected: localhost

// Check 2: Data is being saved
// Add console.log before save:
console.log('Saving data:', donorData);
await donor.save();
console.log('Data saved:', donor._id);

// Check 3: MongoDB is using the right database
// Default: mongodb://localhost:27017/bbms
// Database name: bbms
// Verify in MongoDB Compass

// Check 4: No errors during save
// Catch and log errors:
try {
  await donor.save();
} catch (error) {
  console.error('Save error:', error);
}
```

---

## Performance Issues

### Issue 19: High Memory Usage
**Error:** Server uses too much RAM, crashes

**Solutions:**

```javascript
// Check 1: Close unused connections
// In controllers, close cursors:
const donors = await Donor.find().limit(1000); // Don't fetch too many

// Check 2: Use lean() for read queries
const donors = await Donor.find().lean(); // Returns plain objects, not Mongoose docs

// Check 3: Clear old logs
rm -rf logs/*.log

// Check 4: Monitor with PM2
npm install -g pm2
pm2 start server.js --name bbms
pm2 monit

// Check 5: Check for memory leaks
// Use clinic.js: npm install -g clinic
// clinic doctor -- node server.js
```

### Issue 20: CPU Usage High
**Error:** Server CPU usage at 100%

**Solutions:**

```javascript
// Check 1: Optimize queries
// Use indexes on frequently queried fields

// Check 2: Reduce processing
// Offload heavy computations to background jobs

// Check 3: Use caching
// Cache frequently accessed data

// Check 4: Monitor active connections
// Limit concurrent database connections

// Check 5: Load testing
// npm install -g artillery
// artillery quick --count 100 --num 10 http://localhost:5000/api/donors
```

---

## Development Tools Issues

### Issue 21: Nodemon Not Auto-Restarting
**Error:** Changes don't trigger server restart

**Solutions:**

```bash
# Check 1: Nodemon is installed
npm list nodemon

# Check 2: Using correct command
npm run dev  # Uses nodemon

# NOT:
node server.js  # Won't auto-restart

# Check 3: Check nodemon config
# Create nodemon.json in root:
{
  "watch": ["server.js", "routes", "controllers", "models"],
  "ignore": ["node_modules", "logs"],
  "ext": "js",
  "delay": 500
}

# Check 4: Restart nodemon
# Ctrl+C in terminal, then: npm run dev
```

### Issue 22: Debugging Not Working
**Error:** Can't set breakpoints or see debug info

**Solutions:**

```bash
# Use Node debug mode
node --inspect server.js

# Open Chrome DevTools at: chrome://inspect

# Or use VS Code debugger
# Create .vscode/launch.json:
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Launch Program",
      "program": "${workspaceFolder}/server.js",
      "restart": true,
      "console": "integratedTerminal"
    }
  ]
}
```

---

## API Testing Issues

### Issue 23: Postman Returns 404
**Error:** Endpoint not found

**Solutions:**

```
✓ Check URL format:
  http://localhost:5000/api/donors  ✓ Correct
  http://localhost:5000/donors       ✗ Missing /api
  http://localhost:5000/api/Donors   ✗ Wrong capitalization

✓ Check HTTP method:
  POST for creating
  GET for reading
  PUT for updating
  DELETE for deleting

✓ Check headers:
  Content-Type: application/json
  Authorization: Bearer TOKEN (for protected routes)

✓ Check request body:
  Must be valid JSON for POST/PUT requests
```

### Issue 24: Postman Returns 401 Unauthorized
**Error:** Token not accepted

**Solutions:**

```
✓ Check token is included:
  Header: Authorization
  Value: Bearer eyJhbGciOiJIUzI1NiIs...

✓ Check token is valid:
  Login first: POST /api/auth/login
  Copy token from response

✓ Check token not expired:
  Tokens last 7 days
  Login again to get new token

✓ Check JWT_SECRET:
  If changed, all tokens become invalid
  Get new token by logging in again
```

---

## Common Solutions Checklist

Before reporting issue, check:

- [ ] MongoDB is running
- [ ] Backend server is running (npm run dev)
- [ ] .env file is properly configured
- [ ] Dependencies installed (npm install)
- [ ] No typos in API URLs
- [ ] Token is included in Authorization header
- [ ] CORS is enabled
- [ ] Port 5000 is available
- [ ] Network connectivity is good
- [ ] Browser console shows actual error message

---

## Getting More Help

### Debugging Steps

1. **Check server logs** - Look at terminal output
2. **Check browser console** - F12 > Console tab
3. **Check MongoDB logs** - See if data is being saved
4. **Use Postman** - Test API directly without frontend
5. **Check .env** - Verify all variables are set
6. **Restart everything** - Kill server, restart MongoDB, restart server
7. **Clear cache** - Browser cache, npm cache, nodemon cache

### Resources

- **Express Docs:** https://expressjs.com/
- **MongoDB Docs:** https://docs.mongodb.com/
- **Mongoose Docs:** https://mongoosejs.com/
- **JWT Guide:** https://jwt.io/
- **Stack Overflow:** Search your error message
- **GitHub Issues:** Check project issues

---

**Remember: Most issues are configuration-related. Double-check .env, MongoDB, and server startup before diving deeper!**
