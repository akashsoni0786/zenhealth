import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  // ─── Who is paying ───
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  // ─── Order Reference ───
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  },

  // ─── Transaction Info ───
  transactionId: {
    type: String,
    unique: true,
    required: true
  },

  // ─── Payment Method ───
  method: {
    type: String,
    enum: ['card', 'upi', 'netbanking'],
    required: true
  },

  // ─── Card Details (masked) ───
  cardDetails: {
    last4: String,          // Last 4 digits only
    brand: String,          // VISA, MasterCard, RuPay, Amex
    cardholderName: String,
    expiryMonth: String,
    expiryYear: String,
    saved: { type: Boolean, default: false }
  },

  // ─── UPI Details ───
  upiDetails: {
    upiId: String,          // user@upi
    app: String,            // gpay, phonepe, paytm, bhim, amazonpay
    vpa: String             // Virtual Payment Address
  },

  // ─── Net Banking Details ───
  netBankingDetails: {
    bankId: String,         // Bank code (sbi, hdfc, etc.)
    bankName: String,       // Full bank name
    isCustomBank: { type: Boolean, default: false }
  },

  // ─── Amounts ───
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'INR'
  },
  basePrice: { type: Number, default: 0 },
  homeVisitFee: { type: Number, default: 0 },
  subtotal: { type: Number, default: 0 },
  gstAmount: { type: Number, default: 0 },

  // ─── Status ───
  status: {
    type: String,
    enum: ['initiated', 'processing', 'success', 'failed', 'refunded', 'cancelled'],
    default: 'initiated'
  },

  // ─── Gateway Response (simulated) ───
  gatewayResponse: {
    gatewayId: String,
    gatewayStatus: String,
    bankRefNumber: String,
    responseCode: String,
    responseMessage: String,
  },

  // ─── Failure Info ───
  failureReason: {
    type: String,
    default: null
  },

  // ─── Refund Info ───
  refund: {
    refundId: String,
    refundAmount: Number,
    refundDate: Date,
    refundReason: String,
    refundStatus: { type: String, enum: ['initiated', 'processing', 'completed', 'failed'], default: null }
  },

  // ─── Timestamps ───
  paidAt: Date,
  failedAt: Date,
}, {
  timestamps: true
});

// Index for quick lookups
paymentSchema.index({ userId: 1, createdAt: -1 });
paymentSchema.index({ transactionId: 1 });
paymentSchema.index({ orderId: 1 });
paymentSchema.index({ status: 1 });

const Payment = mongoose.model('Payment', paymentSchema);

export default Payment;
