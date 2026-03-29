const mongoose = require('mongoose');

const shopReportSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  shopId: { type: String, required: true },
  reportDate: { type: Date, required: true },
  bwCopies: { type: Number, required: true },
  colorCopies: { type: Number, required: true },
  cashCollected: { type: Number, required: true },
  upiCollection: { type: Number, required: true },
  paperOpeningStock: { type: Number, required: true },
  paperClosingStock: { type: Number, required: true },
  incharge: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('ShopReport', shopReportSchema);