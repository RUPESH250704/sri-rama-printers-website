const express = require('express');
const Employee = require('../models/Employee');
const Attendance = require('../models/Attendance');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Get all employees
router.get('/employees', auth, async (req, res) => {
  try {
    const employees = await Employee.find({ isActive: { $ne: false } }).sort({ name: 1 });
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add new employee
router.post('/employees', auth, async (req, res) => {
  try {
    const employee = new Employee(req.body);
    await employee.save();
    res.status(201).json(employee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete employee
router.delete('/employees/:id', auth, async (req, res) => {
  try {
    await Employee.findByIdAndDelete(req.params.id);
    res.json({ message: 'Employee deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Submit attendance
router.post('/attendance', auth, async (req, res) => {
  try {
    const { date, attendanceRecords } = req.body;
    
    // Check if attendance already exists for this date
    const existingAttendance = await Attendance.findOne({ date: new Date(date) });
    
    if (existingAttendance) {
      existingAttendance.attendanceRecords = attendanceRecords;
      existingAttendance.submittedBy = req.user._id;
      await existingAttendance.save();
      return res.json({ message: 'Attendance updated successfully', attendance: existingAttendance });
    }
    
    const attendance = new Attendance({
      date: new Date(date),
      attendanceRecords,
      submittedBy: req.user._id
    });
    
    await attendance.save();
    res.status(201).json({ message: 'Attendance submitted successfully', attendance });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get attendance for a specific date
router.get('/attendance/:date', auth, async (req, res) => {
  try {
    const inputDate = new Date(req.params.date);
    const startOfDay = new Date(inputDate.getFullYear(), inputDate.getMonth(), inputDate.getDate());
    const endOfDay = new Date(inputDate.getFullYear(), inputDate.getMonth(), inputDate.getDate() + 1);

    const attendance = await Attendance.findOne({
      date: {
        $gte: startOfDay,
        $lt: endOfDay
      }
    })
      .populate('attendanceRecords.employee')
      .populate('submittedBy', 'name');
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get attendance reports (date range)
router.get('/attendance-reports', auth, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const query = {};
    
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const startOfDay = new Date(start.getFullYear(), start.getMonth(), start.getDate());
      const endOfDay = new Date(end.getFullYear(), end.getMonth(), end.getDate() + 1);

      query.date = {
        $gte: startOfDay,
        $lt: endOfDay
      };
    }
    
    const attendances = await Attendance.find(query)
      .populate('attendanceRecords.employee')
      .populate('submittedBy', 'name')
      .sort({ date: -1 });
    
    res.json(attendances);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
