import express from 'express';
import Review from '../models/Review.js';
import Trainer from '../models/Trainer.js';
import Booking from '../models/Booking.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// ════════════════════════════════════════════
// 1. POST /api/review — Submit a review
// ════════════════════════════════════════════
router.post('/', protect, async (req, res) => {
  try {
    const { trainerId, bookingId, rating, title, comment } = req.body;

    if (!trainerId || !rating) {
      return res.status(400).json({ success: false, message: 'Trainer ID and rating are required' });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ success: false, message: 'Rating must be between 1 and 5' });
    }

    // Verify trainer exists
    const trainer = await Trainer.findById(trainerId);
    if (!trainer) {
      return res.status(404).json({ success: false, message: 'Trainer not found' });
    }

    // Check if user already reviewed this trainer
    const existingReview = await Review.findOne({ userId: req.user._id, trainerId });
    if (existingReview) {
      return res.status(400).json({ success: false, message: 'You have already reviewed this trainer. Use PUT to update.' });
    }

    // If bookingId provided, verify booking is completed
    if (bookingId) {
      const booking = await Booking.findById(bookingId);
      if (!booking || booking.status !== 'completed') {
        return res.status(400).json({ success: false, message: 'Can only review after a completed session' });
      }
    }

    const review = await Review.create({
      userId: req.user._id,
      trainerId,
      bookingId: bookingId || undefined,
      rating,
      title: title || '',
      comment: comment || ''
    });

    // Update trainer's average rating
    await updateTrainerRating(trainerId);

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully',
      data: review
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'You have already reviewed this trainer' });
    }
    res.status(500).json({ success: false, message: error.message });
  }
});

// ════════════════════════════════════════════
// 2. GET /api/review/trainer/:trainerId — Get reviews for a trainer
// ════════════════════════════════════════════
router.get('/trainer/:trainerId', async (req, res) => {
  try {
    const { page = 1, limit = 10, sort = 'newest' } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    let sortOrder = { createdAt: -1 };
    if (sort === 'oldest') sortOrder = { createdAt: 1 };
    if (sort === 'highest') sortOrder = { rating: -1 };
    if (sort === 'lowest') sortOrder = { rating: 1 };

    const reviews = await Review.find({
      trainerId: req.params.trainerId,
      isApproved: true
    })
      .populate('userId', 'name')
      .sort(sortOrder)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Review.countDocuments({
      trainerId: req.params.trainerId,
      isApproved: true
    });

    // Rating breakdown
    const ratingBreakdown = {};
    for (let i = 1; i <= 5; i++) {
      ratingBreakdown[i] = await Review.countDocuments({
        trainerId: req.params.trainerId,
        rating: i,
        isApproved: true
      });
    }

    // Average rating
    const avgResult = await Review.aggregate([
      { $match: { trainerId: req.params.trainerId, isApproved: true } },
      { $group: { _id: null, avgRating: { $avg: '$rating' } } }
    ]);
    const averageRating = avgResult.length > 0 ? Math.round(avgResult[0].avgRating * 10) / 10 : 0;

    res.json({
      success: true,
      data: reviews,
      total,
      averageRating,
      ratingBreakdown,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit))
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ════════════════════════════════════════════
// 3. PUT /api/review/:id — Update review
// ════════════════════════════════════════════
router.put('/:id', protect, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    if (review.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to edit this review' });
    }

    const { rating, title, comment } = req.body;
    if (rating) review.rating = rating;
    if (title !== undefined) review.title = title;
    if (comment !== undefined) review.comment = comment;

    await review.save();

    // Recalculate trainer rating
    await updateTrainerRating(review.trainerId);

    res.json({
      success: true,
      message: 'Review updated',
      data: review
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ════════════════════════════════════════════
// 4. DELETE /api/review/:id — Delete review
// ════════════════════════════════════════════
router.delete('/:id', protect, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    if (review.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this review' });
    }

    const trainerId = review.trainerId;
    await Review.findByIdAndDelete(req.params.id);

    // Recalculate trainer rating
    await updateTrainerRating(trainerId);

    res.json({ success: true, message: 'Review deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ════════════════════════════════════════════
// 5. PUT /api/review/:id/reply — Trainer replies to review
// ════════════════════════════════════════════
router.put('/:id/reply', async (req, res) => {
  try {
    const { reply } = req.body;
    if (!reply || !reply.trim()) {
      return res.status(400).json({ success: false, message: 'Reply text is required' });
    }

    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    review.trainerReply = reply.trim();
    review.trainerRepliedAt = new Date();
    await review.save();

    res.json({
      success: true,
      message: 'Reply added',
      data: review
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ════════════════════════════════════════════
// 6. POST /api/review/:id/report — Report a review
// ════════════════════════════════════════════
router.post('/:id/report', protect, async (req, res) => {
  try {
    const { reason } = req.body;

    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    review.isReported = true;
    review.reportReason = reason || 'Inappropriate content';
    await review.save();

    res.json({ success: true, message: 'Review reported for moderation' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ─── Helper: Recalculate trainer's average rating ───
async function updateTrainerRating(trainerId) {
  const result = await Review.aggregate([
    { $match: { trainerId, isApproved: true } },
    {
      $group: {
        _id: null,
        avgRating: { $avg: '$rating' },
        count: { $sum: 1 }
      }
    }
  ]);

  if (result.length > 0) {
    await Trainer.findByIdAndUpdate(trainerId, {
      rating: Math.round(result[0].avgRating * 10) / 10,
      reviewCount: result[0].count
    });
  } else {
    await Trainer.findByIdAndUpdate(trainerId, {
      rating: 0,
      reviewCount: 0
    });
  }
}

export default router;
