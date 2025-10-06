
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Product = require('../models/Product');
const auth = require('../middleware/auth');

// Get user cart
router.get('/', auth, async (req, res) => {
  try {
    // Get cart items for the current user
    const userId = req.user.id;
    
    // For simplicity, we're using session storage
    // In a real app, you would store this in the database
    if (!req.session.carts) {
      req.session.carts = {};
    }
    
    const userCart = req.session.carts[userId] || [];
    res.json({ items: userCart });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Add item to cart
router.post('/add', auth, async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user.id;
    
    // Validate product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Initialize carts object if it doesn't exist
    if (!req.session.carts) {
      req.session.carts = {};
    }
    
    // Initialize user's cart if it doesn't exist
    if (!req.session.carts[userId]) {
      req.session.carts[userId] = [];
    }
    
    // Check if product already exists in cart
    const existingItemIndex = req.session.carts[userId].findIndex(
      item => item.product._id.toString() === productId
    );
    
    if (existingItemIndex > -1) {
      // Update quantity if product already in cart
      req.session.carts[userId][existingItemIndex].quantity += quantity;
    } else {
      // Add new item to cart
      req.session.carts[userId].push({
        product,
        quantity
      });
    }
    
    res.json({ 
      message: 'Product added to cart',
      item: {
        product,
        quantity
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Remove item from cart
router.delete('/remove/:productId', auth, async (req, res) => {
  try {
    const productId = req.params.productId;
    const userId = req.user.id;
    
    // Check if session and user cart exist
    if (!req.session.carts || !req.session.carts[userId]) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    
    // Filter out the item to remove
    req.session.carts[userId] = req.session.carts[userId].filter(
      item => item.product._id.toString() !== productId
    );
    
    res.json({ message: 'Item removed from cart' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update cart item quantity
router.put('/update/:productId', auth, async (req, res) => {
  try {
    const productId = req.params.productId;
    const { quantity } = req.body;
    const userId = req.user.id;
    
    // Check if session and user cart exist
    if (!req.session.carts || !req.session.carts[userId]) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    
    // Find and update the item
    const itemIndex = req.session.carts[userId].findIndex(
      item => item.product._id.toString() === productId
    );
    
    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }
    
    req.session.carts[userId][itemIndex].quantity = quantity;
    
    res.json({ message: 'Cart updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Sync local cart with server
router.post('/sync', auth, async (req, res) => {
  try {
    const { items } = req.body;
    const userId = req.user.id;
    
    // Initialize carts object if it doesn't exist
    if (!req.session.carts) {
      req.session.carts = {};
    }
    
    // Process each item and fetch products
    const syncedItems = [];
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (product) {
        syncedItems.push({
          product,
          quantity: item.quantity
        });
      }
    }
    
    // Replace user's cart with synced items
    req.session.carts[userId] = syncedItems;
    
    res.json({ 
      message: 'Cart synchronized successfully',
      items: syncedItems
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
