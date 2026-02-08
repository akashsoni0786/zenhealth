import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  // ─── Parties ───
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

  // ─── Session Details ───
  consultationType: {
    type: String,
    enum: ['video', 'in-person', 'home-visit'],
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  timeSlot: {
    start: { type: String, required: true }, // "10:00"
    end: { type: String, required: true }    // "11:00"
  },
  duration: {
    type: Number,
    default: 60, // minutes
    min: 15,
    max: 180
  },

  // ─── Status ───
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'in-progress', 'completed', 'cancelled', 'no-show'],
    default: 'pending'
  },
  confirmedAt: Date,
  completedAt: Date,
  cancelledAt: Date,
  cancelReason: {
    type: String,
    default: ''
  },
  cancelledBy: {
    type: String,
    enum: ['user', 'trainer', 'admin', ''],
    default: ''
  },

  // ─── Pricing ───
  amount: {
    type: Number,
    required: true,
    min: 0
  },

  // ─── Payment Link ───
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'refunded'],
    default: 'pending'
  },

  // ─── Notes ───
  userNotes: {
    type: String,
    default: '',
    maxlength: 500
  },
  trainerNotes: {
    type: String,
    default: '',
    maxlength: 500
  },

  // ─── Meeting Link (for video) ───
  meetingLink: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

bookingSchema.index({ userId: 1, createdAt: -1 });
bookingSchema.index({ trainerId: 1, date: 1 });
bookingSchema.index({ status: 1 });
bookingSchema.index({ date: 1, status: 1 });

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;
