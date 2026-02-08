import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const trainerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters'],
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true
  },
  // ─── Trainer-specific fields ───
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['yoga', 'fitness', 'nutrition', 'physiotherapy', 'mental_health', 'ayurveda']
  },
  specialization: {
    type: String,
    required: [true, 'Specialization is required'],
    trim: true,
    maxlength: [200, 'Specialization cannot exceed 200 characters']
  },
  experience: {
    type: Number,
    required: [true, 'Experience is required'],
    min: [0, 'Experience cannot be negative'],
    max: [50, 'Experience seems too high']
  },
  price: {
    type: Number,
    required: [true, 'Price per session is required'],
    min: [100, 'Minimum price is ₹100'],
    max: [50000, 'Maximum price is ₹50,000']
  },
  bio: {
    type: String,
    trim: true,
    maxlength: [1000, 'Bio cannot exceed 1000 characters'],
    default: ''
  },
  certifications: [{
    type: String,
    trim: true
  }],
  languages: [{
    type: String,
    trim: true,
    default: ['Hindi', 'English']
  }],
  sessionModes: [{
    type: String,
    enum: ['video', 'in-person', 'home-visit'],
    default: ['video']
  }],
  avatar: {
    type: String,
    default: ''
  },
  // ─── Verification & Status ───
  status: {
    type: String,
    enum: ['pending', 'pending_review', 'verified', 'rejected', 'resubmit', 'suspended'],
    default: 'pending'
  },
  verifiedAt: {
    type: Date,
    default: null
  },
  rejectionReason: {
    type: String,
    default: ''
  },
  adminRemarks: {
    type: String,
    default: ''
  },
  statusHistory: [{
    status: String,
    date: { type: Date, default: Date.now },
    note: String
  }],
  notifications: [{
    type: { type: String, enum: ['success', 'error', 'warning', 'info'] },
    message: String,
    date: { type: Date, default: Date.now },
    read: { type: Boolean, default: false }
  }],
  hiddenFromPlatform: {
    type: Boolean,
    default: false
  },
  // ─── Bank Details ───
  bankDetails: {
    accountHolderName: { type: String, default: '' },
    accountNumber: { type: String, default: '' },
    ifscCode: { type: String, default: '' },
    bankName: { type: String, default: '' },
    upiId: { type: String, default: '' }
  },
  bankStatus: {
    type: String,
    enum: ['not_submitted', 'pending', 'verified', 'rejected'],
    default: 'not_submitted'
  },
  bankRejectReason: {
    type: String,
    default: ''
  },
  // ─── Documents ───
  documents: [{
    docType: { type: String, enum: ['id_proof', 'certificate', 'education', 'other'] },
    name: String,
    url: String,
    uploadedAt: { type: Date, default: Date.now },
    verified: { type: Boolean, default: false }
  }],
  // ─── Stats ───
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  totalClients: {
    type: Number,
    default: 0
  },
  totalSessions: {
    type: Number,
    default: 0
  },
  // ─── Availability ───
  isAcceptingClients: {
    type: Boolean,
    default: true
  },
  workingHours: {
    start: { type: String, default: '09:00' },
    end: { type: String, default: '18:00' }
  },
  weeklySchedule: [{
    day: { type: String, enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] },
    isAvailable: { type: Boolean, default: true },
    startTime: { type: String, default: '09:00' },
    endTime: { type: String, default: '18:00' },
    breakStart: { type: String, default: '' },
    breakEnd: { type: String, default: '' }
  }],
  blockedDates: [{
    date: Date,
    reason: { type: String, default: '' }
  }],
  // ─── OTP Login ───
  otp: {
    type: String,
    select: false
  },
  otpExpiry: {
    type: Date,
    select: false
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Hash password before saving
trainerSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare entered password with hashed password
trainerSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const Trainer = mongoose.model('Trainer', trainerSchema);

export default Trainer;
