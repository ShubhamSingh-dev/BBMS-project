import express from 'express';
import {
  createDonation,
  getMyDonations,
  getAllDonations,
  updateDonationStatus,
} from '../controllers/donationController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// @route   POST /api/donations
// @desc    Create new donation record
router.post('/', protect, createDonation);

// @route   GET /api/donations/my
// @desc    Get donor's own donations
router.get('/my', protect, getMyDonations);

// @route   GET /api/donations
// @desc    Get all donations (Admin)
router.get('/', protect, authorize('admin', 'staff'), getAllDonations);

// @route   PUT /api/donations/:id/status
// @desc    Update donation status (Admin)
router.put('/:id/status', protect, authorize('admin', 'staff'), updateDonationStatus);

export default router;
