const express = require('express');
const {
  getAllRequests,
  getRequestById,
  createRequest,
  updateRequestStatus,
  allocateBloodUnits,
  getRequestsByStatus,
  cancelRequest,
} = require('../controllers/requestController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/requests
// @desc    Get all blood requests
router.get('/', protect, getAllRequests);

// @route   GET /api/requests/status/:status
// @desc    Get requests by status
router.get('/status/:status', protect, getRequestsByStatus);

// @route   GET /api/requests/:id
// @desc    Get single request
router.get('/:id', protect, getRequestById);

// @route   POST /api/requests
// @desc    Create blood request
router.post('/', protect, createRequest);

// @route   PUT /api/requests/:id
// @desc    Update request status
router.put('/:id', protect, authorize('admin', 'staff'), updateRequestStatus);

// @route   PUT /api/requests/:id/allocate
// @desc    Allocate blood units to request
router.put('/:id/allocate', protect, authorize('admin', 'staff'), allocateBloodUnits);

// @route   DELETE /api/requests/:id
// @desc    Cancel request
router.delete('/:id', protect, cancelRequest);

module.exports = router;
