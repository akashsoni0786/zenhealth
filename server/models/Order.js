import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  // ─── Who booked ───
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  // ─── Which Trainer ───
  trainerId: {
    type: String,   // Can be ObjectId or static trainer ID (string/number)
    required: true
  },
  trainerName: { type: String, default: '' },
  trainerSpecialization: { type: String, default: '' },
  trainerImage: { type: String, default: '' },

  // ─── Booking Details ───
  consultationType: {
    type: String,
    enum: ['video', 'in-person', 'home-visit'],
    required: true
  },
  date: { type: String, required: true },
  timeSlot: { type: String, required: true },
  duration: { type: Number, default: 30 },   // minutes

  // ─── Pricing ───
  basePrice: { type: Number, required: true },
  homeVisitFee: { type: Number, default: 0 },
  subtotal: { type: Number, required: true },
  gstAmount: { type: Number, required: true },
  totalAmount: { type: Number, required: true },

  // ─── Payment Reference ───
  paymentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Payment',
    default: null
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },

  // ─── Order Status ───
  status: {
    type: String,
    enum: ['created', 'confirmed', 'in-progress', 'completed', 'cancelled'],
    default: 'created'
  },

  // ─── Notes ───
  userNotes: { type: String, default: '' },
  cancelReason: { type: String, default: null },
  cancelledAt: { type: Date, default: null },
}, {
  timestamps: true
});

// Index for quick lookups
orderSchema.index({ userId: 1, createdAt: -1 });
orderSchema.index({ trainerId: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ paymentStatus: 1 });

const Order = mongoose.model('Order', orderSchema);

export default Order;
