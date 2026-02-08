import express from 'express';
import { body, validationResult } from 'express-validator';
import { protect } from '../middleware/auth.js';
import Payment from '../models/Payment.js';
import Order from '../models/Order.js';

const router = express.Router();

// ─── Helper: Generate unique transaction ID ───
const generateTransactionId = () => {
  const timestamp = Date.now().toString().slice(-10);
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `TXN${timestamp}${random}`;
};

// ─── Helper: Generate gateway reference ───
const generateGatewayRef = (method) => {
  const prefix = method === 'card' ? 'CRD' : method === 'upi' ? 'UPI' : 'NB';
  return `${prefix}${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
};

// ─── Helper: Detect card brand from number ───
const detectCardBrand = (cardNumber) => {
  const num = cardNumber.replace(/\s/g, '');
  if (/^4/.test(num)) return 'VISA';
  if (/^5[1-5]/.test(num)) return 'MasterCard';
  if (/^6[0-9]/.test(num)) return 'RuPay';
  if (/^3[47]/.test(num)) return 'Amex';
  return 'Unknown';
};

// ─── Helper: Simulate payment processing (95% success rate) ───
const simulateGatewayProcessing = () => {
  return new Promise((resolve) => {
    const delay = 1500 + Math.random() * 2000; // 1.5-3.5 sec
    setTimeout(() => {
      const isSuccess = Math.random() > 0.05;
      resolve({
        success: isSuccess,
        responseCode: isSuccess ? '00' : 'E01',
        responseMessage: isSuccess ? 'Transaction approved' : 'Transaction declined by bank',
      });
    }, delay);
  });
};


// ═══════════════════════════════════════════════
//  POST /api/payment/create-order — Create a new order
// ═══════════════════════════════════════════════
router.post('/create-order', protect, [
  body('trainerId').trim().notEmpty().withMessage('Trainer ID is required'),
  body('consultationType').isIn(['video', 'in-person', 'home-visit']).withMessage('Invalid consultation type'),
  body('date').trim().notEmpty().withMessage('Date is required'),
  body('timeSlot').trim().notEmpty().withMessage('Time slot is required'),
  body('basePrice').isFloat({ min: 0 }).withMessage('Base price must be a positive number'),
  body('totalAmount').isFloat({ min: 1 }).withMessage('Total amount must be greater than 0'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array().map(e => e.msg)
      });
    }

    const {
      trainerId, trainerName, trainerSpecialization, trainerImage,
      consultationType, date, timeSlot, duration,
      basePrice, homeVisitFee, subtotal, gstAmount, totalAmount,
      userNotes
    } = req.body;

    const order = await Order.create({
      userId: req.user._id,
      trainerId,
      trainerName: trainerName || '',
      trainerSpecialization: trainerSpecialization || '',
      trainerImage: trainerImage || '',
      consultationType,
      date,
      timeSlot,
      duration: duration || 30,
      basePrice,
      homeVisitFee: homeVisitFee || 0,
      subtotal: subtotal || basePrice + (homeVisitFee || 0),
      gstAmount: gstAmount || 0,
      totalAmount,
      userNotes: userNotes || '',
      status: 'created',
      paymentStatus: 'pending'
    });

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: {
        orderId: order._id,
        totalAmount: order.totalAmount,
        status: order.status
      }
    });
  } catch (error) {
    console.error('Create Order Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});


// ═══════════════════════════════════════════════
//  POST /api/payment/pay/card — Pay via Credit/Debit Card
// ═══════════════════════════════════════════════
router.post('/pay/card', protect, [
  body('orderId').trim().notEmpty().withMessage('Order ID is required'),
  body('cardNumber').trim().notEmpty().withMessage('Card number is required')
    .matches(/^\d{4}\s?\d{4}\s?\d{4}\s?\d{4}$/).withMessage('Invalid card number'),
  body('expiryMonth').trim().notEmpty().withMessage('Expiry month is required'),
  body('expiryYear').trim().notEmpty().withMessage('Expiry year is required'),
  body('cvv').trim().isLength({ min: 3, max: 4 }).withMessage('CVV must be 3-4 digits'),
  body('cardholderName').trim().notEmpty().withMessage('Cardholder name is required'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array().map(e => e.msg)
      });
    }

    const { orderId, cardNumber, expiryMonth, expiryYear, cvv, cardholderName, saveCard } = req.body;

    // Verify order exists and belongs to this user
    const order = await Order.findOne({ _id: orderId, userId: req.user._id });
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    if (order.paymentStatus === 'paid') {
      return res.status(400).json({ success: false, message: 'Order is already paid' });
    }

    const transactionId = generateTransactionId();
    const cleanCardNumber = cardNumber.replace(/\s/g, '');
    const brand = detectCardBrand(cleanCardNumber);

    // Create payment record (initiated)
    const payment = await Payment.create({
      userId: req.user._id,
      orderId: order._id,
      transactionId,
      method: 'card',
      cardDetails: {
        last4: cleanCardNumber.slice(-4),
        brand,
        cardholderName,
        expiryMonth,
        expiryYear,
        saved: saveCard || false
      },
      amount: order.totalAmount,
      basePrice: order.basePrice,
      homeVisitFee: order.homeVisitFee,
      subtotal: order.subtotal,
      gstAmount: order.gstAmount,
      status: 'processing'
    });

    // ─── Simulate Gateway Processing ───
    const gatewayResult = await simulateGatewayProcessing();

    const gatewayId = generateGatewayRef('card');

    if (gatewayResult.success) {
      // Payment Success
      payment.status = 'success';
      payment.paidAt = new Date();
      payment.gatewayResponse = {
        gatewayId,
        gatewayStatus: 'CAPTURED',
        bankRefNumber: `BRN${Date.now().toString().slice(-8)}`,
        responseCode: gatewayResult.responseCode,
        responseMessage: gatewayResult.responseMessage,
      };
      await payment.save();

      // Update order
      order.paymentId = payment._id;
      order.paymentStatus = 'paid';
      order.status = 'confirmed';
      await order.save();

      return res.json({
        success: true,
        message: 'Payment successful',
        data: {
          transactionId: payment.transactionId,
          amount: payment.amount,
          method: 'card',
          cardBrand: brand,
          cardLast4: cleanCardNumber.slice(-4),
          status: 'success',
          paidAt: payment.paidAt,
          gatewayRef: gatewayId,
          orderId: order._id,
          orderStatus: 'confirmed'
        }
      });
    } else {
      // Payment Failed
      payment.status = 'failed';
      payment.failedAt = new Date();
      payment.failureReason = gatewayResult.responseMessage;
      payment.gatewayResponse = {
        gatewayId,
        gatewayStatus: 'FAILED',
        responseCode: gatewayResult.responseCode,
        responseMessage: gatewayResult.responseMessage,
      };
      await payment.save();

      order.paymentStatus = 'failed';
      await order.save();

      return res.status(402).json({
        success: false,
        message: 'Payment declined',
        data: {
          transactionId: payment.transactionId,
          status: 'failed',
          reason: gatewayResult.responseMessage,
          orderId: order._id
        }
      });
    }
  } catch (error) {
    console.error('Card Payment Error:', error);
    res.status(500).json({ success: false, message: 'Payment processing failed' });
  }
});


// ═══════════════════════════════════════════════
//  POST /api/payment/pay/upi — Pay via UPI
// ═══════════════════════════════════════════════
router.post('/pay/upi', protect, [
  body('orderId').trim().notEmpty().withMessage('Order ID is required'),
  body('upiId').optional().trim(),
  body('upiApp').optional().trim(),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array().map(e => e.msg)
      });
    }

    const { orderId, upiId, upiApp } = req.body;

    if (!upiId && !upiApp) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a UPI ID or select a UPI app'
      });
    }

    // Verify order
    const order = await Order.findOne({ _id: orderId, userId: req.user._id });
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    if (order.paymentStatus === 'paid') {
      return res.status(400).json({ success: false, message: 'Order is already paid' });
    }

    // Validate UPI ID format if provided
    if (upiId && !/^[\w.\-]+@[\w]+$/.test(upiId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid UPI ID format. Example: name@upi'
      });
    }

    const transactionId = generateTransactionId();

    // Create payment record
    const payment = await Payment.create({
      userId: req.user._id,
      orderId: order._id,
      transactionId,
      method: 'upi',
      upiDetails: {
        upiId: upiId || null,
        app: upiApp || null,
        vpa: upiId || `stayfit_${upiApp}@upi`
      },
      amount: order.totalAmount,
      basePrice: order.basePrice,
      homeVisitFee: order.homeVisitFee,
      subtotal: order.subtotal,
      gstAmount: order.gstAmount,
      status: 'processing'
    });

    // ─── Simulate UPI Gateway Processing ───
    const gatewayResult = await simulateGatewayProcessing();
    const gatewayId = generateGatewayRef('upi');

    if (gatewayResult.success) {
      payment.status = 'success';
      payment.paidAt = new Date();
      payment.gatewayResponse = {
        gatewayId,
        gatewayStatus: 'SUCCESS',
        bankRefNumber: `UPI${Date.now().toString().slice(-10)}`,
        responseCode: gatewayResult.responseCode,
        responseMessage: gatewayResult.responseMessage,
      };
      await payment.save();

      order.paymentId = payment._id;
      order.paymentStatus = 'paid';
      order.status = 'confirmed';
      await order.save();

      return res.json({
        success: true,
        message: 'UPI payment successful',
        data: {
          transactionId: payment.transactionId,
          amount: payment.amount,
          method: 'upi',
          upiId: upiId || null,
          upiApp: upiApp || null,
          status: 'success',
          paidAt: payment.paidAt,
          gatewayRef: gatewayId,
          orderId: order._id,
          orderStatus: 'confirmed'
        }
      });
    } else {
      payment.status = 'failed';
      payment.failedAt = new Date();
      payment.failureReason = gatewayResult.responseMessage;
      payment.gatewayResponse = {
        gatewayId,
        gatewayStatus: 'FAILED',
        responseCode: gatewayResult.responseCode,
        responseMessage: gatewayResult.responseMessage,
      };
      await payment.save();

      order.paymentStatus = 'failed';
      await order.save();

      return res.status(402).json({
        success: false,
        message: 'UPI payment failed',
        data: {
          transactionId: payment.transactionId,
          status: 'failed',
          reason: gatewayResult.responseMessage,
          orderId: order._id
        }
      });
    }
  } catch (error) {
    console.error('UPI Payment Error:', error);
    res.status(500).json({ success: false, message: 'Payment processing failed' });
  }
});


// ═══════════════════════════════════════════════
//  POST /api/payment/pay/netbanking — Pay via Net Banking
// ═══════════════════════════════════════════════
router.post('/pay/netbanking', protect, [
  body('orderId').trim().notEmpty().withMessage('Order ID is required'),
  body('bankId').trim().notEmpty().withMessage('Bank selection is required'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array().map(e => e.msg)
      });
    }

    const { orderId, bankId, bankName, isCustomBank } = req.body;

    // If custom bank, bankName is required
    if (bankId === 'other' && (!bankName || !bankName.trim())) {
      return res.status(400).json({
        success: false,
        message: 'Please enter your bank name'
      });
    }

    // Verify order
    const order = await Order.findOne({ _id: orderId, userId: req.user._id });
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    if (order.paymentStatus === 'paid') {
      return res.status(400).json({ success: false, message: 'Order is already paid' });
    }

    const transactionId = generateTransactionId();

    // Create payment record
    const payment = await Payment.create({
      userId: req.user._id,
      orderId: order._id,
      transactionId,
      method: 'netbanking',
      netBankingDetails: {
        bankId: bankId === 'other' ? 'other' : bankId,
        bankName: bankName || bankId.toUpperCase(),
        isCustomBank: isCustomBank || bankId === 'other'
      },
      amount: order.totalAmount,
      basePrice: order.basePrice,
      homeVisitFee: order.homeVisitFee,
      subtotal: order.subtotal,
      gstAmount: order.gstAmount,
      status: 'processing'
    });

    // ─── Simulate Net Banking Gateway Processing ───
    const gatewayResult = await simulateGatewayProcessing();
    const gatewayId = generateGatewayRef('netbanking');

    if (gatewayResult.success) {
      payment.status = 'success';
      payment.paidAt = new Date();
      payment.gatewayResponse = {
        gatewayId,
        gatewayStatus: 'SUCCESS',
        bankRefNumber: `NB${bankId.toUpperCase()}${Date.now().toString().slice(-8)}`,
        responseCode: gatewayResult.responseCode,
        responseMessage: gatewayResult.responseMessage,
      };
      await payment.save();

      order.paymentId = payment._id;
      order.paymentStatus = 'paid';
      order.status = 'confirmed';
      await order.save();

      return res.json({
        success: true,
        message: 'Net banking payment successful',
        data: {
          transactionId: payment.transactionId,
          amount: payment.amount,
          method: 'netbanking',
          bankId,
          bankName: payment.netBankingDetails.bankName,
          status: 'success',
          paidAt: payment.paidAt,
          gatewayRef: gatewayId,
          orderId: order._id,
          orderStatus: 'confirmed'
        }
      });
    } else {
      payment.status = 'failed';
      payment.failedAt = new Date();
      payment.failureReason = gatewayResult.responseMessage;
      payment.gatewayResponse = {
        gatewayId,
        gatewayStatus: 'FAILED',
        responseCode: gatewayResult.responseCode,
        responseMessage: gatewayResult.responseMessage,
      };
      await payment.save();

      order.paymentStatus = 'failed';
      await order.save();

      return res.status(402).json({
        success: false,
        message: 'Net banking payment failed',
        data: {
          transactionId: payment.transactionId,
          status: 'failed',
          reason: gatewayResult.responseMessage,
          orderId: order._id
        }
      });
    }
  } catch (error) {
    console.error('Net Banking Payment Error:', error);
    res.status(500).json({ success: false, message: 'Payment processing failed' });
  }
});


// ═══════════════════════════════════════════════
//  GET /api/payment/status/:transactionId — Check payment status
// ═══════════════════════════════════════════════
router.get('/status/:transactionId', protect, async (req, res) => {
  try {
    const payment = await Payment.findOne({
      transactionId: req.params.transactionId,
      userId: req.user._id
    });

    if (!payment) {
      return res.status(404).json({ success: false, message: 'Payment not found' });
    }

    res.json({
      success: true,
      data: {
        transactionId: payment.transactionId,
        method: payment.method,
        amount: payment.amount,
        status: payment.status,
        paidAt: payment.paidAt,
        failureReason: payment.failureReason,
        gatewayRef: payment.gatewayResponse?.gatewayId || null
      }
    });
  } catch (error) {
    console.error('Payment Status Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});


// ═══════════════════════════════════════════════
//  GET /api/payment/history — User's payment history
// ═══════════════════════════════════════════════
router.get('/history', protect, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const payments = await Payment.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('orderId', 'trainerName consultationType date timeSlot status');

    const total = await Payment.countDocuments({ userId: req.user._id });

    res.json({
      success: true,
      data: {
        payments: payments.map(p => ({
          transactionId: p.transactionId,
          method: p.method,
          amount: p.amount,
          status: p.status,
          paidAt: p.paidAt,
          createdAt: p.createdAt,
          cardLast4: p.cardDetails?.last4 || null,
          cardBrand: p.cardDetails?.brand || null,
          upiId: p.upiDetails?.upiId || null,
          upiApp: p.upiDetails?.app || null,
          bankName: p.netBankingDetails?.bankName || null,
          order: p.orderId ? {
            trainerName: p.orderId.trainerName,
            type: p.orderId.consultationType,
            date: p.orderId.date,
            timeSlot: p.orderId.timeSlot,
            orderStatus: p.orderId.status
          } : null
        })),
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Payment History Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});


// ═══════════════════════════════════════════════
//  POST /api/payment/refund/:transactionId — Initiate refund
// ═══════════════════════════════════════════════
router.post('/refund/:transactionId', protect, [
  body('reason').trim().notEmpty().withMessage('Refund reason is required'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array().map(e => e.msg)
      });
    }

    const payment = await Payment.findOne({
      transactionId: req.params.transactionId,
      userId: req.user._id
    });

    if (!payment) {
      return res.status(404).json({ success: false, message: 'Payment not found' });
    }

    if (payment.status !== 'success') {
      return res.status(400).json({
        success: false,
        message: 'Only successful payments can be refunded'
      });
    }

    if (payment.refund?.refundStatus) {
      return res.status(400).json({
        success: false,
        message: `Refund already ${payment.refund.refundStatus}`
      });
    }

    const { reason } = req.body;

    // Initiate refund
    payment.status = 'refunded';
    payment.refund = {
      refundId: `RFD${Date.now().toString().slice(-10)}`,
      refundAmount: payment.amount,
      refundDate: new Date(),
      refundReason: reason,
      refundStatus: 'completed'
    };
    await payment.save();

    // Update order
    const order = await Order.findById(payment.orderId);
    if (order) {
      order.paymentStatus = 'refunded';
      order.status = 'cancelled';
      order.cancelReason = reason;
      order.cancelledAt = new Date();
      await order.save();
    }

    res.json({
      success: true,
      message: 'Refund initiated successfully',
      data: {
        refundId: payment.refund.refundId,
        refundAmount: payment.refund.refundAmount,
        transactionId: payment.transactionId,
        status: 'completed'
      }
    });
  } catch (error) {
    console.error('Refund Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});


// ═══════════════════════════════════════════════
//  GET /api/payment/order/:orderId — Get order details
// ═══════════════════════════════════════════════
router.get('/order/:orderId', protect, async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.orderId,
      userId: req.user._id
    }).populate('paymentId');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.json({
      success: true,
      data: {
        order: {
          id: order._id,
          trainerName: order.trainerName,
          trainerSpecialization: order.trainerSpecialization,
          consultationType: order.consultationType,
          date: order.date,
          timeSlot: order.timeSlot,
          duration: order.duration,
          basePrice: order.basePrice,
          homeVisitFee: order.homeVisitFee,
          subtotal: order.subtotal,
          gstAmount: order.gstAmount,
          totalAmount: order.totalAmount,
          status: order.status,
          paymentStatus: order.paymentStatus,
          createdAt: order.createdAt,
        },
        payment: order.paymentId ? {
          transactionId: order.paymentId.transactionId,
          method: order.paymentId.method,
          status: order.paymentId.status,
          paidAt: order.paymentId.paidAt,
        } : null
      }
    });
  } catch (error) {
    console.error('Get Order Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});


// ═══════════════════════════════════════════════
//  GET /api/payment/orders — User's order history
// ═══════════════════════════════════════════════
router.get('/orders', protect, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const orders = await Order.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Order.countDocuments({ userId: req.user._id });

    res.json({
      success: true,
      data: {
        orders: orders.map(o => ({
          id: o._id,
          trainerName: o.trainerName,
          trainerSpecialization: o.trainerSpecialization,
          consultationType: o.consultationType,
          date: o.date,
          timeSlot: o.timeSlot,
          duration: o.duration,
          totalAmount: o.totalAmount,
          status: o.status,
          paymentStatus: o.paymentStatus,
          createdAt: o.createdAt,
        })),
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Orders Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

export default router;
