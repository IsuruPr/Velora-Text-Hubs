
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('../models/Product');

// Load environment variables
dotenv.config({ path: '../.env' });

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB for seeding'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Sample product data (matches the frontend data)
const products = [
  {
    name: 'Tailored Cotton Shirt',
    price: 89.99,
    image: 'https://images.unsplash.com/photo-1594938291221-94f18cbb5660?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1160&q=80',
    category: 'Men',
    description: 'Premium cotton shirt with a tailored fit for comfort and style.',
    inventory: 25
  },
  {
    name: 'Wool Blend Coat',
    price: 199.99,
    image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1036&q=80',
    category: 'Women',
    description: 'Elegant wool blend coat perfect for cold weather.',
    inventory: 15
  },
  {
    name: 'Classic Denim Jacket',
    price: 129.99,
    image: 'https://images.unsplash.com/photo-1548126032-079a0fb0099d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=987&q=80',
    category: 'Men',
    description: 'Timeless denim jacket that never goes out of style.',
    inventory: 30
  },
  {
    name: 'Silk Blouse',
    price: 119.99,
    image: 'https://images.unsplash.com/photo-1552874869-5c39ec9288dc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=987&q=80',
    category: 'Women',
    description: 'Luxurious silk blouse with elegant design.',
    inventory: 20
  },
  {
    name: 'Casual Linen Shirt',
    price: 79.99,
    image: 'https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1365&q=80',
    category: 'Men',
    description: 'Comfortable linen shirt for everyday wear.',
    inventory: 35
  },
  {
    name: 'Structured Blazer',
    price: 149.99,
    image: 'https://images.unsplash.com/photo-1580651214613-f4692d6d138f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1169&q=80',
    category: 'Women',
    description: 'Professional blazer for a sharp look at work or events.',
    inventory: 18
  },
  {
    name: 'Premium Jeans',
    price: 109.99,
    image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=987&q=80',
    category: 'Men',
    description: 'High-quality denim jeans with perfect fit.',
    inventory: 40
  },
  {
    name: 'Pleated Maxi Skirt',
    price: 89.99,
    image: 'https://images.unsplash.com/photo-1583846783214-7229a91b20ed?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1035&q=80',
    category: 'Women',
    description: 'Elegant pleated maxi skirt for a sophisticated look.',
    inventory: 22
  }
];

// Seed function
const seedProducts = async () => {
  try {
    // Delete existing products
    await Product.deleteMany({});
    console.log('Products cleared');
    
    // Insert new products
    await Product.insertMany(products);
    console.log('Products seeded successfully');
    
    // Disconnect from MongoDB
    mongoose.disconnect();
  } catch (error) {
    console.error('Error seeding products:', error);
    process.exit(1);
  }
};

// Run the seed function
seedProducts();
