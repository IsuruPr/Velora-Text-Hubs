
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  // Get token from header
  const token = req.header('x-auth-token');
  
  // Check if no token
  if (!token) {
    console.log('Auth middleware: No token provided');
    return res.status(401).json({ message: 'No token, authorization denied' });
  }
  
  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Add user from token to request object
    req.user = decoded;
    console.log('Auth middleware: Token verified, user ID:', decoded.id);
    next();
  } catch (error) {
    console.error('Auth middleware: Invalid token', error.message);
    res.status(401).json({ message: 'Token is not valid' });
  }
};
