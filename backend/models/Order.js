const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  card: { type: mongoose.Schema.Types.ObjectId, ref: 'Card', required: true },
  quantity: { type: Number, required: true, min: 1 },
  customPrice: { type: Number, required: true },
  customText: { type: String },
  totalAmount: { type: Number, required: true },
  advanceAmount: { type: Number, default: 0 },
  status: { 
    type: String, 
    enum: ['pending', 'confirmed', 'processing', 'completed', 'cancelled'],
    default: 'pending'
  },
  deliveryType: {
    type: String,
    enum: ['pickup', 'delivery'],
    default: 'delivery'
  },
  deliveryAddress: { type: String },
  phone: { type: String, required: true },
  serviceType: { 
    type: String, 
    enum: ['wedding-cards', 'billbooks', 'visiting-cards', 'rubber-stamps', 'bookbinding'],
    default: 'wedding-cards'
  }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);