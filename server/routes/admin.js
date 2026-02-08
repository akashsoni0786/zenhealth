import express from 'express';
import Trainer from '../models/Trainer.js';
import Booking from '../models/Booking.js';

const router = express.Router();

// ─── Simple admin auth middleware ───
// Uses hardcoded admin credentials (matches frontend: admin@stayfit.com / admin)
const protectAdmin = (req, res, next) => {
  const adminKey = req.headers['x-admin-key'];
  if (adminKey !== 'stayfit_admin_2024') {
    return res.status(403).json({ success: false, message: 'Admin access denied' });
  }
  next();
};

// Apply admin auth to all routes
router.use(protectAdmin);

// ════════════════════════════════════════════
// 1. GET /api/admin/trainers — List all trainers for admin
// ════════════════════════════════════════════
router.get('/trainers', async (req, res) => {
  try {
    const { status, category, search, page = 1, limit = 20 } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (category) filter.category = category;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const trainers = await Trainer.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Trainer.countDocuments(filter);

    // Count by status
    const statusCounts = {
      pending: await Trainer.countDocuments({ status: 'pending' }),
      verified: await Trainer.countDocuments({ status: 'verified' }),
      rejected: await Trainer.countDocuments({ status: 'rejected' }),
      suspended: await Trainer.countDocuments({ status: 'suspended' }),
      resubmit: await Trainer.countDocuments({ status: 'resubmit' }),
      hidden: await Trainer.countDocuments({ hiddenFromPlatform: true })
    };

    res.json({
      success: true,
      data: trainers,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      statusCounts
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ════════════════════════════════════════════
// 2. PUT /api/admin/trainers/:id/verify — Verify trainer
// ════════════════════════════════════════════
router.put('/trainers/:id/verify', async (req, res) => {
  try {
    const trainer = await Trainer.findById(req.params.id);
    if (!trainer) {
      return res.status(404).json({ success: false, message: 'Trainer not found' });
    }

    trainer.status = 'verified';
    trainer.verifiedAt = new Date();
    trainer.rejectionReason = '';
    trainer.adminRemarks = '';
    trainer.statusHistory.push({
      status: 'verified',
      date: new Date(),
      note: 'Profile verified by administrator'
    });
    trainer.notifications.push({
      type: 'success',
      message: 'Your profile has been verified! You are now live on the platform.',
      date: new Date(),
      read: false
    });

    await trainer.save();

    res.json({
      success: true,
      message: `${trainer.name} has been verified successfully`,
      data: trainer
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ════════════════════════════════════════════
// 3. PUT /api/admin/trainers/:id/reject — Reject trainer
// ════════════════════════════════════════════
router.put('/trainers/:id/reject', async (req, res) => {
  try {
    const { reason } = req.body;
    if (!reason || !reason.trim()) {
      return res.status(400).json({ success: false, message: 'Rejection reason is required' });
    }

    const trainer = await Trainer.findById(req.params.id);
    if (!trainer) {
      return res.status(404).json({ success: false, message: 'Trainer not found' });
    }

    trainer.status = 'rejected';
    trainer.rejectionReason = reason.trim();
    trainer.statusHistory.push({
      status: 'rejected',
      date: new Date(),
      note: reason.trim()
    });
    trainer.notifications.push({
      type: 'error',
      message: `Your profile was rejected: ${reason.trim()}`,
      date: new Date(),
      read: false
    });

    await trainer.save();

    res.json({
      success: true,
      message: `${trainer.name} has been rejected`,
      data: trainer
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ════════════════════════════════════════════
// 4. PUT /api/admin/trainers/:id/resubmit — Request resubmission
// ════════════════════════════════════════════
router.put('/trainers/:id/resubmit', async (req, res) => {
  try {
    const { remarks } = req.body;
    if (!remarks || !remarks.trim()) {
      return res.status(400).json({ success: false, message: 'Resubmission remarks are required' });
    }

    const trainer = await Trainer.findById(req.params.id);
    if (!trainer) {
      return res.status(404).json({ success: false, message: 'Trainer not found' });
    }

    trainer.status = 'resubmit';
    trainer.adminRemarks = remarks.trim();
    trainer.statusHistory.push({
      status: 'resubmit',
      date: new Date(),
      note: remarks.trim()
    });
    trainer.notifications.push({
      type: 'warning',
      message: `Resubmission requested: ${remarks.trim()}`,
      date: new Date(),
      read: false
    });

    await trainer.save();

    res.json({
      success: true,
      message: `Resubmission request sent to ${trainer.name}`,
      data: trainer
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ════════════════════════════════════════════
// 5. PUT /api/admin/trainers/:id/suspend — Suspend trainer
// ════════════════════════════════════════════
router.put('/trainers/:id/suspend', async (req, res) => {
  try {
    const { reason } = req.body;

    const trainer = await Trainer.findById(req.params.id);
    if (!trainer) {
      return res.status(404).json({ success: false, message: 'Trainer not found' });
    }

    trainer.status = 'suspended';
    trainer.isActive = false;
    trainer.statusHistory.push({
      status: 'suspended',
      date: new Date(),
      note: reason || 'Suspended by administrator'
    });
    trainer.notifications.push({
      type: 'error',
      message: `Your account has been suspended. ${reason || ''}`,
      date: new Date(),
      read: false
    });

    await trainer.save();

    res.json({
      success: true,
      message: `${trainer.name} has been suspended`,
      data: trainer
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ════════════════════════════════════════════
// 6. PUT /api/admin/trainers/:id/unsuspend — Reactivate trainer
// ════════════════════════════════════════════
router.put('/trainers/:id/unsuspend', async (req, res) => {
  try {
    const trainer = await Trainer.findById(req.params.id);
    if (!trainer) {
      return res.status(404).json({ success: false, message: 'Trainer not found' });
    }

    trainer.status = 'verified';
    trainer.isActive = true;
    trainer.statusHistory.push({
      status: 'verified',
      date: new Date(),
      note: 'Suspension lifted by administrator'
    });
    trainer.notifications.push({
      type: 'success',
      message: 'Your account has been reactivated!',
      date: new Date(),
      read: false
    });

    await trainer.save();

    res.json({
      success: true,
      message: `${trainer.name} has been reactivated`,
      data: trainer
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ════════════════════════════════════════════
// 7. PUT /api/admin/trainers/:id/hide — Hide from platform
// ════════════════════════════════════════════
router.put('/trainers/:id/hide', async (req, res) => {
  try {
    const trainer = await Trainer.findById(req.params.id);
    if (!trainer) {
      return res.status(404).json({ success: false, message: 'Trainer not found' });
    }

    trainer.hiddenFromPlatform = true;
    await trainer.save();

    res.json({
      success: true,
      message: `${trainer.name} hidden from platform`,
      data: trainer
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ════════════════════════════════════════════
// 8. PUT /api/admin/trainers/:id/restore — Restore to platform
// ════════════════════════════════════════════
router.put('/trainers/:id/restore', async (req, res) => {
  try {
    const trainer = await Trainer.findById(req.params.id);
    if (!trainer) {
      return res.status(404).json({ success: false, message: 'Trainer not found' });
    }

    trainer.hiddenFromPlatform = false;
    await trainer.save();

    res.json({
      success: true,
      message: `${trainer.name} restored to platform`,
      data: trainer
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ════════════════════════════════════════════
// 9. PUT /api/admin/trainers/:id/bank/verify — Verify bank details
// ════════════════════════════════════════════
router.put('/trainers/:id/bank/verify', async (req, res) => {
  try {
    const trainer = await Trainer.findById(req.params.id);
    if (!trainer) {
      return res.status(404).json({ success: false, message: 'Trainer not found' });
    }

    trainer.bankStatus = 'verified';
    trainer.bankRejectReason = '';
    trainer.notifications.push({
      type: 'success',
      message: 'Your bank details have been verified by the admin.',
      date: new Date(),
      read: false
    });

    await trainer.save();

    res.json({
      success: true,
      message: `Bank details verified for ${trainer.name}`,
      data: trainer
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ════════════════════════════════════════════
// 10. PUT /api/admin/trainers/:id/bank/reject — Reject bank details
// ════════════════════════════════════════════
router.put('/trainers/:id/bank/reject', async (req, res) => {
  try {
    const { reason } = req.body;
    if (!reason || !reason.trim()) {
      return res.status(400).json({ success: false, message: 'Rejection reason is required' });
    }

    const trainer = await Trainer.findById(req.params.id);
    if (!trainer) {
      return res.status(404).json({ success: false, message: 'Trainer not found' });
    }

    trainer.bankStatus = 'rejected';
    trainer.bankRejectReason = reason.trim();
    trainer.notifications.push({
      type: 'error',
      message: `Your bank details were rejected: ${reason.trim()}`,
      date: new Date(),
      read: false
    });

    await trainer.save();

    res.json({
      success: true,
      message: `Bank details rejected for ${trainer.name}`,
      data: trainer
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ════════════════════════════════════════════
// 11. PUT /api/admin/trainers/:id/edit — Admin edit trainer profile
// ════════════════════════════════════════════
router.put('/trainers/:id/edit', async (req, res) => {
  try {
    const allowedFields = ['name', 'email', 'phone', 'category', 'specialization', 'experience', 'price', 'bio', 'languages', 'sessionModes'];
    const updates = {};

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    const trainer = await Trainer.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!trainer) {
      return res.status(404).json({ success: false, message: 'Trainer not found' });
    }

    res.json({
      success: true,
      message: `${trainer.name}'s profile updated`,
      data: trainer
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ════════════════════════════════════════════
// 12. GET /api/admin/stats — Dashboard statistics
// ════════════════════════════════════════════
router.get('/stats', async (req, res) => {
  try {
    const trainerStats = {
      total: await Trainer.countDocuments(),
      pending: await Trainer.countDocuments({ status: 'pending' }),
      verified: await Trainer.countDocuments({ status: 'verified' }),
      rejected: await Trainer.countDocuments({ status: 'rejected' }),
      suspended: await Trainer.countDocuments({ status: 'suspended' }),
      hidden: await Trainer.countDocuments({ hiddenFromPlatform: true })
    };

    const bookingStats = {
      total: await Booking.countDocuments(),
      pending: await Booking.countDocuments({ status: 'pending' }),
      confirmed: await Booking.countDocuments({ status: 'confirmed' }),
      completed: await Booking.countDocuments({ status: 'completed' }),
      cancelled: await Booking.countDocuments({ status: 'cancelled' })
    };

    res.json({
      success: true,
      data: { trainerStats, bookingStats }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
