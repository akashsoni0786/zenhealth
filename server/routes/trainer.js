import express from 'express';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import Trainer from '../models/Trainer.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Generate JWT Token (trainer-specific with role embedded)
const generateToken = (id) => {
  return jwt.sign({ id, role: 'trainer' }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

// Generate Refresh Token
const generateRefreshToken = (id) => {
  return jwt.sign({ id, role: 'trainer' }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: '30d'
  });
};

// Protect trainer routes - verify JWT and load trainer
const protectTrainer = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== 'trainer') {
      return res.status(403).json({ success: false, message: 'Not authorized as trainer' });
    }

    req.trainer = await Trainer.findById(decoded.id);

    if (!req.trainer) {
      return res.status(401).json({ success: false, message: 'Trainer not found' });
    }

    if (!req.trainer.isActive) {
      return res.status(401).json({ success: false, message: 'Account is deactivated' });
    }

    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Not authorized, token invalid' });
  }
};

// ═══════════════════════════════════════════════
//  POST /api/trainer/signup — Register as Trainer
// ═══════════════════════════════════════════════
router.post('/signup', [
  body('name').trim().notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 50 }).withMessage('Name must be 2-50 characters'),
  body('email').isEmail().withMessage('Please enter a valid email').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('phone').trim().notEmpty().withMessage('Phone number is required'),
  body('category').notEmpty().withMessage('Category is required')
    .isIn(['yoga', 'fitness', 'nutrition', 'physiotherapy', 'mental_health', 'ayurveda'])
    .withMessage('Invalid category'),
  body('specialization').trim().notEmpty().withMessage('Specialization is required')
    .isLength({ max: 200 }).withMessage('Specialization max 200 characters'),
  body('experience').isInt({ min: 0, max: 50 }).withMessage('Experience must be 0-50 years'),
  body('price').isInt({ min: 100, max: 50000 }).withMessage('Price must be ₹100 - ₹50,000'),
  body('bio').optional().trim().isLength({ max: 1000 }),
  body('certifications').optional().isArray(),
  body('languages').optional().isArray(),
  body('sessionModes').optional().isArray()
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
      name, email, password, phone,
      category, specialization, experience, price,
      bio, certifications, languages, sessionModes
    } = req.body;

    // Check if trainer already exists
    const existingTrainer = await Trainer.findOne({ email });
    if (existingTrainer) {
      return res.status(400).json({
        success: false,
        message: 'Trainer already registered with this email'
      });
    }

    // Create trainer (status defaults to 'pending')
    const trainer = await Trainer.create({
      name, email, password, phone,
      category, specialization, experience, price,
      bio: bio || '',
      certifications: certifications || [],
      languages: languages || ['Hindi', 'English'],
      sessionModes: sessionModes || ['video']
    });

    // Generate tokens
    const token = generateToken(trainer._id);
    const refreshToken = generateRefreshToken(trainer._id);

    res.status(201).json({
      success: true,
      message: 'Trainer registered successfully. Awaiting admin verification.',
      data: {
        trainer: {
          id: trainer._id,
          name: trainer.name,
          email: trainer.email,
          phone: trainer.phone,
          category: trainer.category,
          specialization: trainer.specialization,
          experience: trainer.experience,
          price: trainer.price,
          status: trainer.status,
          bio: trainer.bio,
          certifications: trainer.certifications,
          languages: trainer.languages,
          sessionModes: trainer.sessionModes
        },
        token,
        refreshToken
      }
    });
  } catch (error) {
    console.error('Trainer Signup Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ═══════════════════════════════════════════════
//  POST /api/trainer/login — Trainer Login
// ═══════════════════════════════════════════════
router.post('/login', [
  body('email').isEmail().withMessage('Please enter a valid email').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required')
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

    const { email, password } = req.body;

    // Find trainer with password
    const trainer = await Trainer.findOne({ email }).select('+password');
    if (!trainer) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check if account is active
    if (!trainer.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated. Contact support.'
      });
    }

    // Check if suspended
    if (trainer.status === 'suspended') {
      return res.status(403).json({
        success: false,
        message: 'Account is suspended. Contact admin for details.'
      });
    }

    // Verify password
    const isMatch = await trainer.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Generate tokens
    const token = generateToken(trainer._id);
    const refreshToken = generateRefreshToken(trainer._id);

    res.json({
      success: true,
      message: trainer.status === 'verified'
        ? 'Login successful'
        : `Login successful (Status: ${trainer.status})`,
      data: {
        trainer: {
          id: trainer._id,
          name: trainer.name,
          email: trainer.email,
          phone: trainer.phone,
          category: trainer.category,
          specialization: trainer.specialization,
          experience: trainer.experience,
          price: trainer.price,
          status: trainer.status,
          bio: trainer.bio,
          certifications: trainer.certifications,
          languages: trainer.languages,
          sessionModes: trainer.sessionModes,
          rating: trainer.rating,
          reviewCount: trainer.reviewCount,
          totalClients: trainer.totalClients,
          totalSessions: trainer.totalSessions,
          isAcceptingClients: trainer.isAcceptingClients,
          avatar: trainer.avatar
        },
        token,
        refreshToken
      }
    });
  } catch (error) {
    console.error('Trainer Login Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ═══════════════════════════════════════════════
//  POST /api/trainer/send-otp — Send OTP to email/phone
// ═══════════════════════════════════════════════
router.post('/send-otp', [
  body('contact').trim().notEmpty().withMessage('Email or phone is required')
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

    const { contact } = req.body;

    // Find trainer by email or phone
    const trainer = await Trainer.findOne({
      $or: [{ email: contact }, { phone: contact }]
    });

    if (!trainer) {
      return res.status(404).json({
        success: false,
        message: 'No account found with this email/phone'
      });
    }

    if (!trainer.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated. Contact support.'
      });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 min expiry

    // Save OTP to trainer record
    await Trainer.findByIdAndUpdate(trainer._id, { otp, otpExpiry });

    // In production, send OTP via SMS/email service here
    // For demo, we return it in the response
    console.log(`OTP for ${contact}: ${otp}`);

    res.json({
      success: true,
      message: 'OTP sent successfully',
      data: {
        trainerId: trainer._id,
        // Include OTP in response for demo/dev only — remove in production!
        otp: otp
      }
    });
  } catch (error) {
    console.error('Send OTP Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ═══════════════════════════════════════════════
//  POST /api/trainer/verify-otp — Verify OTP and login
// ═══════════════════════════════════════════════
router.post('/verify-otp', [
  body('trainerId').trim().notEmpty().withMessage('Trainer ID is required'),
  body('otp').trim().isLength({ min: 6, max: 6 }).withMessage('OTP must be 6 digits')
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

    const { trainerId, otp } = req.body;

    // Find trainer with OTP fields
    const trainer = await Trainer.findById(trainerId).select('+otp +otpExpiry');

    if (!trainer) {
      return res.status(404).json({
        success: false,
        message: 'Trainer not found'
      });
    }

    if (!trainer.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated'
      });
    }

    // Check OTP match
    if (!trainer.otp || trainer.otp !== otp) {
      return res.status(401).json({
        success: false,
        message: 'Invalid OTP'
      });
    }

    // Check OTP expiry
    if (!trainer.otpExpiry || new Date() > trainer.otpExpiry) {
      return res.status(401).json({
        success: false,
        message: 'OTP has expired. Please request a new one.'
      });
    }

    // Clear OTP after successful verification
    await Trainer.findByIdAndUpdate(trainerId, { otp: null, otpExpiry: null });

    // Generate tokens
    const token = generateToken(trainer._id);
    const refreshToken = generateRefreshToken(trainer._id);

    res.json({
      success: true,
      message: 'OTP verified successfully',
      data: {
        trainer: {
          id: trainer._id,
          name: trainer.name,
          email: trainer.email,
          phone: trainer.phone,
          category: trainer.category,
          specialization: trainer.specialization,
          experience: trainer.experience,
          price: trainer.price,
          status: trainer.status,
          bio: trainer.bio,
          avatar: trainer.avatar
        },
        token,
        refreshToken
      }
    });
  } catch (error) {
    console.error('Verify OTP Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ═══════════════════════════════════════════════
//  POST /api/trainer/refresh-token
// ═══════════════════════════════════════════════
router.post('/refresh-token', async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ success: false, message: 'Refresh token is required' });
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    if (decoded.role !== 'trainer') {
      return res.status(403).json({ success: false, message: 'Invalid trainer token' });
    }

    const trainer = await Trainer.findById(decoded.id);
    if (!trainer || !trainer.isActive) {
      return res.status(401).json({ success: false, message: 'Invalid refresh token' });
    }

    const newToken = generateToken(trainer._id);

    res.json({
      success: true,
      data: { token: newToken }
    });
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid or expired refresh token' });
  }
});

// ═══════════════════════════════════════════════
//  GET /api/trainer/me — Get trainer profile (Protected)
// ═══════════════════════════════════════════════
router.get('/me', protectTrainer, async (req, res) => {
  res.json({
    success: true,
    data: {
      trainer: {
        id: req.trainer._id,
        name: req.trainer.name,
        email: req.trainer.email,
        phone: req.trainer.phone,
        category: req.trainer.category,
        specialization: req.trainer.specialization,
        experience: req.trainer.experience,
        price: req.trainer.price,
        status: req.trainer.status,
        bio: req.trainer.bio,
        certifications: req.trainer.certifications,
        languages: req.trainer.languages,
        sessionModes: req.trainer.sessionModes,
        rating: req.trainer.rating,
        reviewCount: req.trainer.reviewCount,
        totalClients: req.trainer.totalClients,
        totalSessions: req.trainer.totalSessions,
        isAcceptingClients: req.trainer.isAcceptingClients,
        workingHours: req.trainer.workingHours,
        avatar: req.trainer.avatar,
        createdAt: req.trainer.createdAt
      }
    }
  });
});

// ═══════════════════════════════════════════════
//  PUT /api/trainer/update-profile (Protected)
// ═══════════════════════════════════════════════
router.put('/update-profile', protectTrainer, [
  body('name').optional().trim().isLength({ min: 2, max: 50 }),
  body('phone').optional().trim(),
  body('specialization').optional().trim().isLength({ max: 200 }),
  body('price').optional().isInt({ min: 100, max: 50000 }),
  body('bio').optional().trim().isLength({ max: 1000 }),
  body('experience').optional().isInt({ min: 0, max: 50 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array().map(e => e.msg)
      });
    }

    const allowedFields = [
      'name', 'phone', 'specialization', 'price', 'bio',
      'experience', 'certifications', 'languages', 'sessionModes',
      'avatar', 'isAcceptingClients', 'workingHours'
    ];

    const updateFields = {};
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updateFields[field] = req.body[field];
      }
    }

    const trainer = await Trainer.findByIdAndUpdate(req.trainer._id, updateFields, {
      new: true,
      runValidators: true
    });

    res.json({
      success: true,
      message: 'Profile updated',
      data: {
        trainer: {
          id: trainer._id,
          name: trainer.name,
          email: trainer.email,
          phone: trainer.phone,
          category: trainer.category,
          specialization: trainer.specialization,
          experience: trainer.experience,
          price: trainer.price,
          status: trainer.status,
          bio: trainer.bio,
          certifications: trainer.certifications,
          languages: trainer.languages,
          sessionModes: trainer.sessionModes,
          isAcceptingClients: trainer.isAcceptingClients,
          workingHours: trainer.workingHours,
          avatar: trainer.avatar
        }
      }
    });
  } catch (error) {
    console.error('Update Trainer Profile Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ═══════════════════════════════════════════════
//  PUT /api/trainer/change-password (Protected)
// ═══════════════════════════════════════════════
router.put('/change-password', protectTrainer, [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array().map(e => e.msg)
      });
    }

    const { currentPassword, newPassword } = req.body;

    const trainer = await Trainer.findById(req.trainer._id).select('+password');
    const isMatch = await trainer.matchPassword(currentPassword);

    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Current password is incorrect' });
    }

    trainer.password = newPassword;
    await trainer.save();

    const token = generateToken(trainer._id);

    res.json({
      success: true,
      message: 'Password changed successfully',
      data: { token }
    });
  } catch (error) {
    console.error('Change Trainer Password Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ═══════════════════════════════════════════════
//  GET /api/trainer/list — Public: Get verified trainers
// ═══════════════════════════════════════════════
router.get('/list', async (req, res) => {
  try {
    const { category, sort, page = 1, limit = 20 } = req.query;

    const query = { status: 'verified', isActive: true };
    if (category) query.category = category;

    let sortOption = { rating: -1 };
    if (sort === 'price_low') sortOption = { price: 1 };
    else if (sort === 'price_high') sortOption = { price: -1 };
    else if (sort === 'experience') sortOption = { experience: -1 };
    else if (sort === 'newest') sortOption = { createdAt: -1 };

    const trainers = await Trainer.find(query)
      .sort(sortOption)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .select('-password');

    const total = await Trainer.countDocuments(query);

    res.json({
      success: true,
      data: {
        trainers: trainers.map(t => ({
          id: t._id,
          name: t.name,
          category: t.category,
          specialization: t.specialization,
          experience: t.experience,
          price: t.price,
          rating: t.rating,
          reviewCount: t.reviewCount,
          totalClients: t.totalClients,
          sessionModes: t.sessionModes,
          avatar: t.avatar,
          isAcceptingClients: t.isAcceptingClients
        })),
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('List Trainers Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ═══════════════════════════════════════════════
//  GET /api/trainer/:id — Public: Get single trainer
// ═══════════════════════════════════════════════
router.get('/:id', async (req, res) => {
  try {
    const trainer = await Trainer.findById(req.params.id).select('-password');

    if (!trainer) {
      return res.status(404).json({ success: false, message: 'Trainer not found' });
    }

    res.json({
      success: true,
      data: {
        trainer: {
          id: trainer._id,
          name: trainer.name,
          email: trainer.status === 'verified' ? trainer.email : undefined,
          phone: trainer.status === 'verified' ? trainer.phone : undefined,
          category: trainer.category,
          specialization: trainer.specialization,
          experience: trainer.experience,
          price: trainer.price,
          status: trainer.status,
          bio: trainer.bio,
          certifications: trainer.certifications,
          languages: trainer.languages,
          sessionModes: trainer.sessionModes,
          rating: trainer.rating,
          reviewCount: trainer.reviewCount,
          totalClients: trainer.totalClients,
          totalSessions: trainer.totalSessions,
          isAcceptingClients: trainer.isAcceptingClients,
          workingHours: trainer.workingHours,
          avatar: trainer.avatar,
          createdAt: trainer.createdAt
        }
      }
    });
  } catch (error) {
    console.error('Get Trainer Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ════════════════════════════════════════════════════════
// AVAILABILITY MANAGEMENT
// ════════════════════════════════════════════════════════

// GET /api/trainer/availability/:id — Get trainer's availability
router.get('/availability/:id', async (req, res) => {
  try {
    const trainer = await Trainer.findById(req.params.id)
      .select('workingHours weeklySchedule blockedDates isAcceptingClients');

    if (!trainer) {
      return res.status(404).json({ success: false, message: 'Trainer not found' });
    }

    res.json({
      success: true,
      data: {
        workingHours: trainer.workingHours,
        weeklySchedule: trainer.weeklySchedule,
        blockedDates: trainer.blockedDates,
        isAcceptingClients: trainer.isAcceptingClients
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT /api/trainer/availability — Update availability (protected)
router.put('/availability', protectTrainer, async (req, res) => {
  try {
    const { workingHours, weeklySchedule, blockedDates, isAcceptingClients } = req.body;

    const updates = {};
    if (workingHours) updates.workingHours = workingHours;
    if (weeklySchedule) updates.weeklySchedule = weeklySchedule;
    if (blockedDates) updates.blockedDates = blockedDates;
    if (isAcceptingClients !== undefined) updates.isAcceptingClients = isAcceptingClients;

    const trainer = await Trainer.findByIdAndUpdate(
      req.trainer._id,
      { $set: updates },
      { new: true }
    ).select('workingHours weeklySchedule blockedDates isAcceptingClients');

    res.json({
      success: true,
      message: 'Availability updated',
      data: trainer
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT /api/trainer/block-date — Block a specific date (protected)
router.put('/block-date', protectTrainer, async (req, res) => {
  try {
    const { date, reason } = req.body;
    if (!date) {
      return res.status(400).json({ success: false, message: 'Date is required' });
    }

    await Trainer.findByIdAndUpdate(req.trainer._id, {
      $push: { blockedDates: { date: new Date(date), reason: reason || '' } }
    });

    res.json({ success: true, message: 'Date blocked' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT /api/trainer/unblock-date — Unblock a date (protected)
router.put('/unblock-date', protectTrainer, async (req, res) => {
  try {
    const { date } = req.body;
    if (!date) {
      return res.status(400).json({ success: false, message: 'Date is required' });
    }

    const targetDate = new Date(date).toDateString();
    await Trainer.findByIdAndUpdate(req.trainer._id, {
      $pull: { blockedDates: { date: { $gte: new Date(targetDate), $lt: new Date(new Date(targetDate).getTime() + 86400000) } } }
    });

    res.json({ success: true, message: 'Date unblocked' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ════════════════════════════════════════════════════════
// DOCUMENT UPLOAD
// ════════════════════════════════════════════════════════

// POST /api/trainer/documents — Upload document metadata (protected)
// Note: Actual file upload would use multer + cloud storage in production.
// This stores document metadata (name, type, URL) for now.
router.post('/documents', protectTrainer, async (req, res) => {
  try {
    const { docType, name, url } = req.body;

    if (!docType || !name || !url) {
      return res.status(400).json({ success: false, message: 'Document type, name, and URL are required' });
    }

    const validTypes = ['id_proof', 'certificate', 'education', 'other'];
    if (!validTypes.includes(docType)) {
      return res.status(400).json({ success: false, message: `Document type must be one of: ${validTypes.join(', ')}` });
    }

    await Trainer.findByIdAndUpdate(req.trainer._id, {
      $push: {
        documents: {
          docType,
          name,
          url,
          uploadedAt: new Date(),
          verified: false
        }
      }
    });

    const trainer = await Trainer.findById(req.trainer._id).select('documents');

    res.status(201).json({
      success: true,
      message: 'Document uploaded',
      data: trainer.documents
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/trainer/documents — Get trainer's documents (protected)
router.get('/documents', protectTrainer, async (req, res) => {
  try {
    const trainer = await Trainer.findById(req.trainer._id).select('documents');

    res.json({
      success: true,
      data: trainer.documents || []
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE /api/trainer/documents/:docId — Remove a document (protected)
router.delete('/documents/:docId', protectTrainer, async (req, res) => {
  try {
    await Trainer.findByIdAndUpdate(req.trainer._id, {
      $pull: { documents: { _id: req.params.docId } }
    });

    res.json({ success: true, message: 'Document removed' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT /api/trainer/bank-details — Submit/update bank details (protected)
router.put('/bank-details', protectTrainer, async (req, res) => {
  try {
    const { accountHolderName, accountNumber, ifscCode, bankName, upiId } = req.body;

    if (!accountHolderName || !accountNumber || !ifscCode || !bankName) {
      return res.status(400).json({ success: false, message: 'Account holder name, account number, IFSC code, and bank name are required' });
    }

    await Trainer.findByIdAndUpdate(req.trainer._id, {
      $set: {
        bankDetails: { accountHolderName, accountNumber, ifscCode, bankName, upiId: upiId || '' },
        bankStatus: 'pending',
        bankRejectReason: ''
      }
    });

    res.json({
      success: true,
      message: 'Bank details submitted for verification'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/trainer/bank-details — Get bank details (protected)
router.get('/bank-details', protectTrainer, async (req, res) => {
  try {
    const trainer = await Trainer.findById(req.trainer._id)
      .select('bankDetails bankStatus bankRejectReason');

    res.json({
      success: true,
      data: {
        bankDetails: trainer.bankDetails,
        bankStatus: trainer.bankStatus,
        bankRejectReason: trainer.bankRejectReason
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/trainer/notifications — Get trainer notifications (protected)
router.get('/notifications', protectTrainer, async (req, res) => {
  try {
    const trainer = await Trainer.findById(req.trainer._id).select('notifications');

    res.json({
      success: true,
      data: (trainer.notifications || []).sort((a, b) => new Date(b.date) - new Date(a.date))
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT /api/trainer/notifications/:notifId/read — Mark notification as read (protected)
router.put('/notifications/:notifId/read', protectTrainer, async (req, res) => {
  try {
    await Trainer.updateOne(
      { _id: req.trainer._id, 'notifications._id': req.params.notifId },
      { $set: { 'notifications.$.read': true } }
    );

    res.json({ success: true, message: 'Notification marked as read' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
