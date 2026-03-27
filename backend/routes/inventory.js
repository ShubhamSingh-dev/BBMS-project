const express = require('express');
const {
  getAllInventory,
  getInventoryByBloodType,
  addBloodUnit,
  updateBloodUnit,
  deleteBloodUnit,
  getAvailableBloodTypes,
  checkExpiryUnits,
} = require('../controllers/inventoryController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/inventory
// @desc    Get all blood inventory
router.get('/', protect, getAllInventory);

// @route   GET /api/inventory/available
// @desc    Get available blood types (must be before /:bloodType)
router.get('/available', getAvailableBloodTypes);

// @route   GET /api/inventory/:bloodType
// @desc    Get inventory by blood type
router.get('/:bloodType', protect, getInventoryByBloodType);

// @route   POST /api/inventory
// @desc    Add blood unit
router.post('/', protect, authorize('admin', 'staff'), addBloodUnit);

// @route   PUT /api/inventory/:id
// @desc    Update blood unit
router.put('/:id', protect, authorize('admin', 'staff'), updateBloodUnit);

// @route   DELETE /api/inventory/:id
// @desc    Delete blood unit
router.delete('/:id', protect, authorize('admin'), deleteBloodUnit);

// @route   GET /api/inventory/expiry/check
// @desc    Check and update expired units
router.get('/expiry/check', protect, authorize('admin', 'staff'), checkExpiryUnits);

module.exports = router;
