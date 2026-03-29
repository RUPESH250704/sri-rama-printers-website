const mongoose = require('mongoose');

const serviceOrderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  serviceType: { 
    type: String, 
    enum: ['billbooks', 'visiting-cards', 'rubber-stamps', 'bookbinding'],
    required: true
  },
  name: { type: String },
  phoneNo: { type: String, required: true },
  quantity: { type: Number },
  totalAmount: { type: Number },
  paidAdvance: { type: Number },
  advanceAmount: { type: Number },
  size: { type: String },
  type: { type: String },
  typeOfStamp: { type: String },
  description: { type: String },
  status: { 
    type: String, 
    enum: ['pending', 'confirmed', 'processing', 'completed', 'cancelled'],
    default: 'pending'
  }
}, { timestamps: true });

module.exports = mongoose.model('ServiceOrder', serviceOrderSchema);