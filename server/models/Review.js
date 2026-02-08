import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  trainerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trainer',
    required: true
  },
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking'
  },

  // ─── Review Content ───
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: 1,
    max: 5
  },
  title: {
    type: String,
    trim: true,
    maxlength: 100,
    default: ''
  },
  comment: {
    type: String,
    trim: true,
    maxlength: 1000,
    default: ''
  },

  // ─── Moderation ───
  isApproved: {
    type: Boolean,
    default: true
  },
  isReported: {
    type: Boolean,
    default: false
  },
  reportReason: {
    type: String,
    default: ''
  },

  // ─── Trainer Response ───
  trainerReply: {
    type: String,
    default: '',
    maxlength: 500
  },
  trainerRepliedAt: Date
}, {
  timestamps: true
});

// One review per user per trainer
reviewSchema.index({ userId: 1, trainerId: 1 }, { unique: true });
reviewSchema.index({ trainerId: 1, createdAt: -1 });
reviewSchema.index({ rating: 1 });

const Review = mongoose.model('Review', reviewSchema);

export default Review;
