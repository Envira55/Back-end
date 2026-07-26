const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  patientId: {
    type: String,
    required: [true, 'Patient ID is required'],
    trim: true
  },
  patientName: {
    type: String,
    required: [true, 'Patient name is required'],
    trim: true
  },
  testName: {
    type: String,
    required: true
  },
  reportData: {
    type: String,
    required: [true, 'Report data is required']
  },
  status: {
    type: String,
    enum: ['Pending', 'Processing', 'Ready', 'Delivered'],
    default: 'Pending'
  },
  paymentStatus: {
    type: String,
    enum: ['Unpaid', 'Partial', 'Paid'],
    default: 'Unpaid'
  },
  amount: {
    type: Number,
    required: true
  },
  remarks: {
    type: String
  },
  uploadedBy: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

reportSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Report', reportSchema);