const express = require('express');
const ShopReport = require('../models/ShopReport');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Create shop report
router.post('/report', auth, async (req, res) => {
  try {
    const shopReport = new ShopReport({
      user: req.user._id,
      ...req.body
    });

    await shopReport.save();
    
    res.status(201).json({ 
      message: 'Report submitted successfully',
      report: shopReport 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all shop reports
router.get('/reports', auth, async (req, res) => {
  try {
    const reports = await ShopReport.find().populate('user', 'name email').sort({ createdAt: -1 });
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get reported dates for a shop
router.get('/reported-dates/:shopId', auth, async (req, res) => {
  try {
    const reports = await ShopReport.find({ shopId: req.params.shopId })
      .select('reportDate')
      .sort({ reportDate: -1 });
    
    const dates = reports.map(report => {
      const date = new Date(report.reportDate);
      const day = String(date.getUTCDate()).padStart(2, '0');
      const month = String(date.getUTCMonth() + 1).padStart(2, '0');
      const year = date.getUTCFullYear();
      return `${day}-${month}-${year}`;
    });
    
    console.log('Reported dates for shop', req.params.shopId, ':', dates);
    res.json({ dates });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Check if report exists for date
router.get('/check-report', auth, async (req, res) => {
  try {
    const { shopId, date } = req.query;
    const checkDate = new Date(date);
    
    const existingReport = await ShopReport.findOne({
      shopId,
      reportDate: {
        $gte: new Date(checkDate.getFullYear(), checkDate.getMonth(), checkDate.getDate()),
        $lt: new Date(checkDate.getFullYear(), checkDate.getMonth(), checkDate.getDate() + 1)
      }
    });
    
    res.json({ exists: !!existingReport });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get entries for a given month/year for a shop
router.get('/entries/:shopId', auth, async (req, res) => {
  try {
    const now = new Date();
    const requestedMonth = Number(req.query.month || now.getMonth() + 1);
    const requestedYear = Number(req.query.year || now.getFullYear());

    const month = Math.min(Math.max(requestedMonth, 1), 12);
    const year = Number.isNaN(requestedYear) ? now.getFullYear() : requestedYear;

    const startOfMonth = new Date(year, month - 1, 1);
    const endOfMonth = new Date(year, month, 0, 23, 59, 59, 999);

    const reports = await ShopReport.find({
      shopId: req.params.shopId,
      reportDate: {
        $gte: startOfMonth,
        $lte: endOfMonth
      }
    })
      .select('reportDate incharge')
      .sort({ reportDate: 1 });

    const entries = reports.map((report) => {
      const date = new Date(report.reportDate);
      return {
        date: date.getDate(),
        fullDate: date.toISOString().split('T')[0],
        incharge: report.incharge
      };
    });

    res.json({ entries, month, year });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get this month's entries for a shop
router.get('/this-month-entries/:shopId', auth, async (req, res) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    
    const reports = await ShopReport.find({ 
      shopId: req.params.shopId,
      reportDate: {
        $gte: startOfMonth,
        $lte: endOfMonth
      }
    })
    .select('reportDate incharge')
    .sort({ reportDate: 1 });
    
    const entries = reports.map(report => {
      const date = new Date(report.reportDate);
      return {
        date: date.getDate(),
        fullDate: date.toISOString().split('T')[0],
        incharge: report.incharge
      };
    });
    
    res.json({ entries, month: now.getMonth() + 1, year: now.getFullYear() });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get latest closing stock for a shop
router.get('/latest-stock/:shopId', auth, async (req, res) => {
  try {
    const latestReport = await ShopReport.findOne({ shopId: req.params.shopId })
      .sort({ createdAt: -1 })
      .select('paperClosingStock createdAt');
    
    res.json(latestReport || { paperClosingStock: 0 });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;