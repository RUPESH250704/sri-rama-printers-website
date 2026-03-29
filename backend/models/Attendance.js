const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  attendanceRecords: [{
    employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
    present: { type: Boolean, required: true }
  }],
  submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Attendance', attendanceSchema);
