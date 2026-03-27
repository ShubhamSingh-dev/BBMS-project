const jwt = require('jsonwebtoken');

// Middleware to verify JWT token
const auth = (req, res, next) => {
    // Get token from header
    const token = req.header('x-auth-token') || req.header('Authorization');

    // Check if no token
    if (!token) {
        return res.status(401).json({ 
            success: false,
            message: 'No token, authorization denied' 
        });
    }

    try {
        // Remove 'Bearer ' prefix if present
        let tokenValue = token;
        if (token.startsWith('Bearer ')) {
            tokenValue = token.slice(7, token.length);
        }

        // Verify token
        const decoded = jwt.verify(tokenValue, process.env.JWT_SECRET || 'your-secret-key');
        
        // Add user info to request
        req.user = decoded.user || decoded;
        
        next();
    } catch (err) {
        res.status(401).json({ 
            success: false,
            message: 'Token is not valid' 
        });
    }
};

module.exports = auth;