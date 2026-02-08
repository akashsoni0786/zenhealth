import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['user', 'bot'],
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    default: null, // e.g. 'nutrition', 'fitness', 'mental_health', 'ayurveda', etc.
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const chatHistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  sessionId: {
    type: String,
    required: true,
    index: true,
  },
  messages: [messageSchema],
  healthContext: {
    primaryConcern: String,
    bmi: Number,
    bmiCategory: String,
    healthScore: Number,
    planLevel: String,
  },
  messageCount: {
    type: Number,
    default: 0,
  },
  lastActivity: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

chatHistorySchema.index({ userId: 1, lastActivity: -1 });

export default mongoose.model('ChatHistory', chatHistorySchema);
