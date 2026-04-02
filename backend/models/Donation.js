import mongoose from 'mongoose';

const donationSchema = new mongoose.Schema(
  {
    donorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    bloodType: {
      type: String,
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
      required: true,
    },
    units: {
      type: Number,
      required: true,
      default: 1,
    },
    hospital: {
      type: String,
      default: '',
    },
    donationDate: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'cancelled', 'rejected'],
      default: 'pending',
    },
    weight: Number,
    pointsEarned: {
      type: Number,
      default: 10,
    },
    notes: String,
  },
  { timestamps: true }
);

donationSchema.index({ donorId: 1 });
donationSchema.index({ status: 1 });
donationSchema.index({ bloodType: 1 });

export default mongoose.model('Donation', donationSchema);
