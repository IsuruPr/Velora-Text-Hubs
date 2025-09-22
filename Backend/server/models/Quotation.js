const mongoose = require('mongoose');

const quotationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  phoneNumber: {
    type: String,
    required: true,
    trim: true
  },
  businessAddress: {
    type: String,
    required: true,
    trim: true
  },
  companyName: {
    type: String,
    required: true,
    trim: true
  },
  industrialExperience: {
    type: String,
    required: true,
    trim: true
  },
  qualification: {
    type: String,
    required: true,
    trim: true
  },
  productDetails: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['PENDING', 'APPROVED', 'REJECTED'],
    default: 'PENDING'
  },
  adminNotes: {
    type: String,
    trim: true
  },
  approvedAt: {
    type: Date
  },
  approvedBy: {
    type: String
  },
  rejectedAt: {
    type: Date
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Quotation', quotationSchema);