const express = require('express');
const router = express.Router();
const Quotation = require('../models/Quotation');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

// Create a new quotation (public route)
router.post('/', async (req, res) => {
  try {
    const {
      name,
      email,
      phoneNumber,
      businessAddress,
      companyName,
      industrialExperience,
      qualification,
      productDetails
    } = req.body;

    // Validate required fields
    if (!name || !email || !phoneNumber || !businessAddress || !companyName || !industrialExperience || !qualification || !productDetails) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Please provide a valid email address' });
    }

    const quotation = new Quotation({
      name,
      email,
      phoneNumber,
      businessAddress,
      companyName,
      industrialExperience,
      qualification,
      productDetails,
      status: 'PENDING'
    });

    await quotation.save();
    
    console.log('New quotation created:', quotation._id);
    res.status(201).json({ message: 'Quotation submitted successfully', quotation });
  } catch (error) {
    console.error('Error creating quotation:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all quotations (admin only)
router.get('/', [auth, admin], async (req, res) => {
  try {
    const { includeRejected } = req.query;
    
    let filter = {};
    if (includeRejected !== 'true') {
      filter.status = { $ne: 'REJECTED' };
    }

    const quotations = await Quotation.find(filter)
      .sort({ createdAt: -1 })
      .select('-__v');
    
    res.json(quotations);
  } catch (error) {
    console.error('Error fetching quotations:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get single quotation (admin only)
router.get('/:id', [auth, admin], async (req, res) => {
  try {
    const quotation = await Quotation.findById(req.params.id);
    
    if (!quotation) {
      return res.status(404).json({ message: 'Quotation not found' });
    }
    
    res.json(quotation);
  } catch (error) {
    console.error('Error fetching quotation:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Approve quotation (admin only)
router.put('/:id/approve', [auth, admin], async (req, res) => {
  try {
    const quotation = await Quotation.findById(req.params.id);
    
    if (!quotation) {
      return res.status(404).json({ message: 'Quotation not found' });
    }
    
    quotation.status = 'APPROVED';
    quotation.approvedAt = new Date();
    quotation.approvedBy = req.user.email || req.user.id;
    
    await quotation.save();
    
    console.log('Quotation approved:', quotation._id);
    res.json({ message: 'Quotation approved successfully', quotation });
  } catch (error) {
    console.error('Error approving quotation:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Reject quotation (admin only) - soft delete by default
router.put('/:id/reject', [auth, admin], async (req, res) => {
  try {
    const quotation = await Quotation.findById(req.params.id);
    
    if (!quotation) {
      return res.status(404).json({ message: 'Quotation not found' });
    }
    
    quotation.status = 'REJECTED';
    quotation.rejectedAt = new Date();
    
    await quotation.save();
    
    console.log('Quotation rejected:', quotation._id);
    res.json({ message: 'Quotation rejected successfully' });
  } catch (error) {
    console.error('Error rejecting quotation:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update quotation (admin only)
router.put('/:id', [auth, admin], async (req, res) => {
  try {
    const {
      name,
      email,
      phoneNumber,
      businessAddress,
      companyName,
      industrialExperience,
      qualification,
      productDetails,
      adminNotes
    } = req.body;

    const quotation = await Quotation.findById(req.params.id);
    
    if (!quotation) {
      return res.status(404).json({ message: 'Quotation not found' });
    }

    // Update fields
    if (name !== undefined) quotation.name = name;
    if (email !== undefined) quotation.email = email;
    if (phoneNumber !== undefined) quotation.phoneNumber = phoneNumber;
    if (businessAddress !== undefined) quotation.businessAddress = businessAddress;
    if (companyName !== undefined) quotation.companyName = companyName;
    if (industrialExperience !== undefined) quotation.industrialExperience = industrialExperience;
    if (qualification !== undefined) quotation.qualification = qualification;
    if (productDetails !== undefined) quotation.productDetails = productDetails;
    if (adminNotes !== undefined) quotation.adminNotes = adminNotes;

    await quotation.save();
    
    console.log('Quotation updated:', quotation._id);
    res.json({ message: 'Quotation updated successfully', quotation });
  } catch (error) {
    console.error('Error updating quotation:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;