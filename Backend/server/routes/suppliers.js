const express = require('express');
const router = express.Router();
const Supplier = require('../models/Supplier');
const Quotation = require('../models/Quotation');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');


router.get('/', [auth, admin], async (req, res) => {
  try {
    const suppliers = await Supplier.find()
      .populate('quotationId', 'name email companyName')
      .sort({ createdAt: -1 })
      .select('-__v');
    
    res.json(suppliers);
  } catch (error) {
    console.error('Error fetching suppliers:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});



router.get('/approved-quotations', [auth, admin], async (req, res) => {
  try {
    const approvedQuotations = await Quotation.find({ status: 'APPROVED' })
      .select('_id name email companyName')
      .sort({ approvedAt: -1 });
    
    res.json(approvedQuotations);
  } catch (error) {
    console.error('Error fetching approved quotations:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


router.post('/', [auth, admin], async (req, res) => {
  try {
    const {
      quotationId,
      quantity,
      productName,
      productImage,
      productCode
    } = req.body;

   
    if (!quotationId || !quantity || !productName || !productImage || !productCode) {
      return res.status(400).json({ message: 'All fields are required' });
    }


    const quotation = await Quotation.findById(quotationId);
    if (!quotation) {
      return res.status(404).json({ message: 'Quotation not found' });
    }
    if (quotation.status !== 'APPROVED') {
      return res.status(400).json({ message: 'Quotation must be approved to create supplier' });
    }

    
    const existingSupplier = await Supplier.findOne({ productCode });
    if (existingSupplier) {
      return res.status(400).json({ message: 'Product code already exists' });
    }

    const supplier = new Supplier({
      name: quotation.name,
      email: quotation.email,
      quantity: Number(quantity),
      productName,
      productImage,
      productCode,
      quotationId,
      createdBy: req.user.email || req.user.id
    });

    await supplier.save();
    
    
    await supplier.populate('quotationId', 'name email companyName');
    
    console.log('New supplier created:', supplier._id);
    res.status(201).json({ message: 'Supplier created successfully', supplier });
  } catch (error) {
    console.error('Error creating supplier:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


router.put('/:id', [auth, admin], async (req, res) => {
  try {
    const {
      quantity,
      productName,
      productImage,
      productCode,
      status
    } = req.body;

    const supplier = await Supplier.findById(req.params.id);
    
    if (!supplier) {
      return res.status(404).json({ message: 'Supplier not found' });
    }

    
    if (productCode && productCode !== supplier.productCode) {
      const existingSupplier = await Supplier.findOne({ 
        productCode, 
        _id: { $ne: req.params.id } 
      });
      if (existingSupplier) {
        return res.status(400).json({ message: 'Product code already exists' });
      }
    }

    
    if (quantity !== undefined) supplier.quantity = Number(quantity);
    if (productName !== undefined) supplier.productName = productName;
    if (productImage !== undefined) supplier.productImage = productImage;
    if (productCode !== undefined) supplier.productCode = productCode;
    if (status !== undefined) supplier.status = status;

    await supplier.save();
    await supplier.populate('quotationId', 'name email companyName');
    
    console.log('Supplier updated:', supplier._id);
    res.json({ message: 'Supplier updated successfully', supplier });
  } catch (error) {
    console.error('Error updating supplier:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


router.delete('/:id', [auth, admin], async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id);
    
    if (!supplier) {
      return res.status(404).json({ message: 'Supplier not found' });
    }

    await Supplier.findByIdAndDelete(req.params.id);
    
    console.log('Supplier deleted:', req.params.id);
    res.json({ message: 'Supplier deleted successfully' });
  } catch (error) {
    console.error('Error deleting supplier:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


router.get('/:id', [auth, admin], async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id)
      .populate('quotationId', 'name email companyName businessAddress phoneNumber');
    
    if (!supplier) {
      return res.status(404).json({ message: 'Supplier not found' });
    }
    
    res.json(supplier);
  } catch (error) {
    console.error('Error fetching supplier:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;