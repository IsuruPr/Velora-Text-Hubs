
const User = require('../models/User');

module.exports = async (req, res, next) => {
  try {
    console.log('Admin middleware: Checking user ID:', req.user.id);
    const user = await User.findById(req.user.id);
    
    if (!user) {
      console.log('Admin middleware: User not found for ID:', req.user.id);
      return res.status(404).json({ message: 'User not found' });
    }
    
    console.log('Admin middleware: User email:', user.email);
    
    // Check if user is admin (for simplicity we're checking by email)
    // In a real app, you would have a role field in the user model
    if (user.email !== 'admin@example.com') {
      console.log('Admin middleware: Access denied for non-admin user:', user.email);
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }
    
    console.log('Admin middleware: Admin access granted for user:', user.email);
    next();
  } catch (error) {
    console.error('Admin middleware error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
