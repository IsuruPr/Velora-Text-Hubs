
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

// Get admin dashboard summary
router.get('/summary', [auth, admin], async (req, res) => {
  try {
    console.log('Admin request received for dashboard summary');
    
    // Get counts
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    
    // Calculate total revenue
    const orders = await Order.find();
    const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
    
    // Get product categories distribution
    const products = await Product.find();
    const productsByCategory = products.reduce((acc, product) => {
      if (!acc[product.category]) {
        acc[product.category] = 0;
      }
      acc[product.category]++;
      return acc;
    }, {});
    
    // Get monthly orders for the last 6 months
    const monthlyOrders = await getMonthlyOrders();
    
    res.json({
      totalUsers,
      totalProducts,
      totalOrders,
      totalRevenue,
      productsByCategory,
      monthlyOrders
    });
  } catch (error) {
    console.error('Error in GET /admin/summary:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Helper function to get monthly orders for the last 6 months
async function getMonthlyOrders() {
  const months = [];
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  
  // Get current date
  const now = new Date();
  
  // Loop through last 6 months
  for (let i = 5; i >= 0; i--) {
    const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const nextMonth = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
    
    // Find orders for this month
    const ordersCount = await Order.countDocuments({
      createdAt: {
        $gte: month,
        $lt: nextMonth
      }
    });
    
    // Get month name
    const monthName = monthNames[month.getMonth()];
    
    months.push({
      month: monthName,
      orders: ordersCount
    });
  }
  
  return months;
}

module.exports = router;
