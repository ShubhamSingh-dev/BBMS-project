const express = require('express');
const {
  getBloodBankInfo,
  updateBloodBankInfo,
  getBloodBankStats,
  getStorageCapacity,
  getDashboardSummary,
} = require('../controllers/bloodbankController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/bloodbank/info
// @desc    Get blood bank information
router.get('/info', getBloodBankInfo);

// @route   PUT /api/bloodbank/info
// @desc    Update blood bank information
router.put('/info', protect, authorize('admin'), updateBloodBankInfo);

// @route   GET /api/bloodbank/stats
// @desc    Get blood bank statistics
router.get('/stats', protect, getBloodBankStats);

// @route   GET /api/bloodbank/capacity
// @desc    Get storage capacity information
router.get('/capacity', protect, getStorageCapacity);

// @route   GET /api/bloodbank/dashboard
// @desc    Get dashboard summary
router.get('/dashboard', protect, getDashboardSummary);

module.exports = router;
