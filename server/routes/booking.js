import express from 'express';
import Booking from '../models/Booking.js';
import Trainer from '../models/Trainer.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// ════════════════════════════════════════════
// 1. POST /api/booking — Create a new booking
// ════════════════════════════════════════════
router.post('/', protect, async (req, res) => {
  try {
    const { trainerId, consultationType, date, timeSlot, duration, amount, userNotes, orderId } = req.body;

    // Validate trainer exists and is verified
    const trainer = await Trainer.findById(trainerId);
    if (!trainer) {
      return res.status(404).json({ success: false, message: 'Trainer not found' });
    }
    if (trainer.status !== 'verified') {
      return res.status(400).json({ success: false, message: 'Trainer is not available for bookings' });
    }
    if (!trainer.isAcceptingClients) {
      return res.status(400).json({ success: false, message: 'Trainer is not accepting new clients' });
    }

    // Check for conflicting bookings
    const bookingDate = new Date(date);
    const existingBooking = await Booking.findOne({
      trainerId,
      date: bookingDate,
      'timeSlot.start': timeSlot.start,
      status: { $in: ['pending', 'confirmed'] }
    });

    if (existingBooking) {
      return res.status(409).json({ success: false, message: 'This time slot is already booked' });
    }

    const booking = await Booking.create({
      userId: req.user._id,
      trainerId,
      consultationType,
      date: bookingDate,
      timeSlot,
      duration: duration || 60,
      amount: amount || trainer.price,
      userNotes: userNotes || '',
      orderId: orderId || undefined,
      paymentStatus: orderId ? 'paid' : 'pending',
      status: 'pending'
    });

    // Increment trainer stats
    await Trainer.findByIdAndUpdate(trainerId, {
      $inc: { totalClients: 1, totalSessions: 1 }
    });

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: booking
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ════════════════════════════════════════════
// 2. GET /api/booking/my — User's bookings
// ════════════════════════════════════════════
router.get('/my', protect, async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    const filter = { userId: req.user._id };
    if (status) filter.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const bookings = await Booking.find(filter)
      .populate('trainerId', 'name email phone category specialization avatar price')
      .sort({ date: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Booking.countDocuments(filter);

    res.json({
      success: true,
      data: bookings,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit))
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ════════════════════════════════════════════
// 3. GET /api/booking/trainer — Trainer's bookings (uses trainer token)
// ════════════════════════════════════════════
router.get('/trainer/:trainerId', async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;

    const filter = { trainerId: req.params.trainerId };
    if (status) filter.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const bookings = await Booking.find(filter)
      .populate('userId', 'name email phone')
      .sort({ date: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Booking.countDocuments(filter);

    // Counts for trainer dashboard
    const counts = {
      pending: await Booking.countDocuments({ trainerId: req.params.trainerId, status: 'pending' }),
      confirmed: await Booking.countDocuments({ trainerId: req.params.trainerId, status: 'confirmed' }),
      completed: await Booking.countDocuments({ trainerId: req.params.trainerId, status: 'completed' }),
      cancelled: await Booking.countDocuments({ trainerId: req.params.trainerId, status: 'cancelled' })
    };

    res.json({
      success: true,
      data: bookings,
      total,
      counts,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit))
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ════════════════════════════════════════════
// 4. GET /api/booking/:id — Get single booking
// ════════════════════════════════════════════
router.get('/:id', protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('trainerId', 'name email phone category specialization avatar price sessionModes')
      .populate('userId', 'name email phone');

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // Verify ownership
    if (booking.userId._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this booking' });
    }

    res.json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ════════════════════════════════════════════
// 5. PUT /api/booking/:id/confirm — Trainer confirms booking
// ════════════════════════════════════════════
router.put('/:id/confirm', async (req, res) => {
  try {
    const { meetingLink } = req.body;

    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    if (booking.status !== 'pending') {
      return res.status(400).json({ success: false, message: `Cannot confirm a ${booking.status} booking` });
    }

    booking.status = 'confirmed';
    booking.confirmedAt = new Date();
    if (meetingLink) booking.meetingLink = meetingLink;

    await booking.save();

    res.json({
      success: true,
      message: 'Booking confirmed',
      data: booking
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ════════════════════════════════════════════
// 6. PUT /api/booking/:id/complete — Mark booking as completed
// ════════════════════════════════════════════
router.put('/:id/complete', async (req, res) => {
  try {
    const { trainerNotes } = req.body;

    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    if (!['confirmed', 'in-progress'].includes(booking.status)) {
      return res.status(400).json({ success: false, message: `Cannot complete a ${booking.status} booking` });
    }

    booking.status = 'completed';
    booking.completedAt = new Date();
    if (trainerNotes) booking.trainerNotes = trainerNotes;

    await booking.save();

    res.json({
      success: true,
      message: 'Booking completed',
      data: booking
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ════════════════════════════════════════════
// 7. PUT /api/booking/:id/cancel — Cancel booking
// ════════════════════════════════════════════
router.put('/:id/cancel', protect, async (req, res) => {
  try {
    const { reason, cancelledBy = 'user' } = req.body;

    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    if (['completed', 'cancelled'].includes(booking.status)) {
      return res.status(400).json({ success: false, message: `Cannot cancel a ${booking.status} booking` });
    }

    booking.status = 'cancelled';
    booking.cancelledAt = new Date();
    booking.cancelReason = reason || '';
    booking.cancelledBy = cancelledBy;

    await booking.save();

    res.json({
      success: true,
      message: 'Booking cancelled',
      data: booking
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ════════════════════════════════════════════
// 8. PUT /api/booking/:id/reschedule — Reschedule booking
// ════════════════════════════════════════════
router.put('/:id/reschedule', protect, async (req, res) => {
  try {
    const { date, timeSlot } = req.body;

    if (!date || !timeSlot) {
      return res.status(400).json({ success: false, message: 'New date and time slot are required' });
    }

    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    if (['completed', 'cancelled'].includes(booking.status)) {
      return res.status(400).json({ success: false, message: `Cannot reschedule a ${booking.status} booking` });
    }

    // Check for conflicts at new time
    const newDate = new Date(date);
    const conflict = await Booking.findOne({
      trainerId: booking.trainerId,
      date: newDate,
      'timeSlot.start': timeSlot.start,
      status: { $in: ['pending', 'confirmed'] },
      _id: { $ne: booking._id }
    });

    if (conflict) {
      return res.status(409).json({ success: false, message: 'New time slot is already booked' });
    }

    booking.date = newDate;
    booking.timeSlot = timeSlot;
    booking.status = 'pending'; // Reset to pending for re-confirmation

    await booking.save();

    res.json({
      success: true,
      message: 'Booking rescheduled',
      data: booking
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ════════════════════════════════════════════
// 9. GET /api/booking/slots/:trainerId/:date — Available slots for a trainer on a date
// ════════════════════════════════════════════
router.get('/slots/:trainerId/:date', async (req, res) => {
  try {
    const trainer = await Trainer.findById(req.params.trainerId);
    if (!trainer) {
      return res.status(404).json({ success: false, message: 'Trainer not found' });
    }

    const date = new Date(req.params.date);
    const dayName = date.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();

    // Get trainer's schedule for that day
    const daySchedule = trainer.weeklySchedule?.find(s => s.day === dayName);
    const startHour = parseInt((daySchedule?.startTime || trainer.workingHours?.start || '09:00').split(':')[0]);
    const endHour = parseInt((daySchedule?.endTime || trainer.workingHours?.end || '18:00').split(':')[0]);

    if (daySchedule && !daySchedule.isAvailable) {
      return res.json({ success: true, data: [], message: 'Trainer is not available on this day' });
    }

    // Check if date is blocked
    const isBlocked = trainer.blockedDates?.some(b =>
      new Date(b.date).toDateString() === date.toDateString()
    );
    if (isBlocked) {
      return res.json({ success: true, data: [], message: 'Trainer has blocked this date' });
    }

    // Generate hourly slots
    const allSlots = [];
    for (let h = startHour; h < endHour; h++) {
      const start = `${String(h).padStart(2, '0')}:00`;
      const end = `${String(h + 1).padStart(2, '0')}:00`;

      // Skip break time
      if (daySchedule?.breakStart && daySchedule?.breakEnd) {
        const breakH = parseInt(daySchedule.breakStart.split(':')[0]);
        if (h === breakH) continue;
      }

      allSlots.push({ start, end });
    }

    // Get booked slots for that date
    const bookedSlots = await Booking.find({
      trainerId: req.params.trainerId,
      date,
      status: { $in: ['pending', 'confirmed'] }
    }).select('timeSlot');

    const bookedStarts = bookedSlots.map(b => b.timeSlot.start);

    // Mark availability
    const slots = allSlots.map(slot => ({
      ...slot,
      available: !bookedStarts.includes(slot.start)
    }));

    res.json({ success: true, data: slots });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
