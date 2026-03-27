const express = require('express');
const {
  getDonorReport,
  getInventoryReport,
  getRequestReport,
  getExpiryReport,
} = require('../controllers/reportController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/reports/donors
// @desc    Get donor statistics and report
router.get('/donors', protect, authorize('admin', 'staff'), getDonorReport);

// @route   GET /api/reports/inventory
// @desc    Get inventory report
router.get('/inventory', protect, authorize('admin', 'staff'), getInventoryReport);

// @route   GET /api/reports/requests
// @desc    Get blood request report
router.get('/requests', protect, authorize('admin', 'staff'), getRequestReport);

// @route   GET /api/reports/expiry
// @desc    Get blood expiry report
router.get('/expiry', protect, authorize('admin', 'staff'), getExpiryReport);

module.exports = router;
