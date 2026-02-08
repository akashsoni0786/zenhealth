import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Card, Button, Typography, Tag, Tooltip, Dropdown, message } from 'antd';
import {
  Send,
  User,
  Bot,
  Sparkles,
  Trash2,
  RotateCcw,
  Heart,
  Dumbbell,
  Apple,
  Brain,
  Moon,
  Droplets,
  Shield,
  Stethoscope,
  Flower2,
  Activity,
  Eye,
  Smile,
  MoreVertical,
  Leaf,
} from 'lucide-react';
import { useHealth } from '../context/HealthContext';
import { useAuth } from '../context/AuthContext';
import { chatAPI } from '../utils/api';
import MedicalDisclaimer from '../components/MedicalDisclaimer';
import './AIChatAssistant.css';

const { Title, Text } = Typography;

// ─── Quick suggestion chips ───
const QUICK_SUGGESTIONS = [
  { icon: <Apple size={14} />, label: 'Diet Plan', query: 'balanced diet plan' },
  { icon: <Dumbbell size={14} />, label: 'Weight Loss', query: 'how to lose weight' },
  { icon: <Activity size={14} />, label: 'Workout Plan', query: 'beginner exercise plan' },
  { icon: <Moon size={14} />, label: 'Better Sleep', query: 'tips for better sleep' },
  { icon: <Brain size={14} />, label: 'Stress Relief', query: 'stress management tips' },
  { icon: <Flower2 size={14} />, label: 'Yoga Guide', query: 'yoga for beginners' },
  { icon: <Leaf size={14} />, label: 'Ayurveda', query: 'ayurvedic daily routine' },
  { icon: <Shield size={14} />, label: 'Immunity', query: 'boost immunity naturally' },
  { icon: <Heart size={14} />, label: 'Heart Health', query: 'heart health tips' },
  { icon: <Droplets size={14} />, label: 'Hydration', query: 'how much water daily' },
  { icon: <Stethoscope size={14} />, label: 'BP Guide', query: 'blood pressure control' },
  { icon: <Eye size={14} />, label: 'Eye Care', query: 'eye health screen time' },
];

// ─── Offline fallback knowledge ───
const OFFLINE_RESPONSES = [
  { keywords: ['hello', 'hi', 'hey', 'namaste'], response: 'Namaste! 🙏 I\'m FitAI Coach. Ask me about diet, exercise, sleep, stress, yoga, or any health topic!' },
  { keywords: ['diet', 'food', 'eat', 'nutrition', 'khana'], response: '🥗 **Balanced Diet Tips:**\n\n• Fill half plate with vegetables & fruits\n• 25% whole grains (roti, rice, oats)\n• 25% protein (dal, paneer, eggs, chicken)\n• Drink 3-4L water daily\n• Eat every 3-4 hours, don\'t skip meals\n\nConnect to backend for detailed plans!' },
  { keywords: ['exercise', 'workout', 'gym', 'fitness'], response: '🏃 **Exercise Guide:**\n\n• 150 min moderate cardio/week\n• Strength training 2-3x/week\n• Yoga/stretching for flexibility\n• Start with 20 min walks, increase gradually\n\nConnect to backend for full workout plans!' },
  { keywords: ['sleep', 'insomnia', 'neend'], response: '😴 **Sleep Tips:**\n\n• 7-9 hours for adults\n• Fixed bedtime schedule\n• No screens 1 hour before bed\n• Room: Cool, dark, quiet\n• Try 4-7-8 breathing technique' },
  { keywords: ['stress', 'anxiety', 'tension'], response: '🧠 **Stress Relief:**\n\n• Box breathing: 4s in → 4s hold → 4s out → 4s hold\n• Exercise 30 min daily\n• Meditation 10 min morning\n\n📞 Helpline: iCall 9152987821' },
  { keywords: ['yoga', 'asana', 'pranayam'], response: '🧘 **Yoga for Beginners:**\n\n• Start with Surya Namaskar (3 rounds)\n• Tadasana, Vrksasana, Virabhadrasana\n• Pranayama: Anulom-Vilom, Kapalbhati\n\nExplore our Yoga Library for guided poses!' },
  { keywords: ['weight', 'lose', 'fat', 'slim'], response: '💪 **Weight Loss:**\n\n• Caloric deficit (500 cal/day = 0.5 kg/week)\n• High protein: 1.6-2g per kg body weight\n• 150+ min cardio/week + strength training\n• Cut sugar & processed food\n\nHealthy rate: 0.5-1 kg per week.' },
];

const findOfflineResponse = (input) => {
  const lower = input.toLowerCase();
  for (const entry of OFFLINE_RESPONSES) {
    if (entry.keywords.some(kw => lower.includes(kw))) {
      return entry.response;
    }
  }
  return "I'm currently in offline mode. I can answer basic health questions about diet, exercise, sleep, stress, yoga, and more. Try asking about one of these topics!";
};

// ─── Render markdown-bold text ───
const renderText = (text) => {
  const parts = text.split(/(\*\*.*?\*\*|\n|• )/g);
  return parts.map((part, i) => {
    if (part === '\n') return <br key={i} />;
    if (part === '• ') return <span key={i} className="aic-bullet">• </span>;
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    return <span key={i}>{part}</span>;
  });
};

const AIChatAssistant = () => {
  const { healthData, userAnswers } = useHealth();
  const { user, isAuthenticated } = useAuth();
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`);
  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  // Build health context from HealthContext data
  const healthContext = {
    primaryConcern: userAnswers?.primaryConcern || null,
    bmi: healthData?.bmi?.value || null,
    bmiCategory: healthData?.bmi?.category || null,
    healthScore: healthData?.overallScore || null,
    userName: user?.name || null,
  };

  // Initial greeting
  useEffect(() => {
    const greeting = userAnswers
      ? `Namaste${user?.name ? ` ${user.name}` : ''}! 🙏 I've reviewed your health profile. ${userAnswers.primaryConcern ? `Your focus area is **${userAnswers.primaryConcern}** — I can give personalized advice on that!` : ''}\n\nI'm your **FitAI Coach** — ask me anything about:\n• 🥗 Diet & Nutrition\n• 🏃 Fitness & Exercise\n• 🧠 Mental Health & Sleep\n• 🌿 Ayurveda & Remedies\n• 🏥 Health Conditions\n\nWhat would you like to know?`
      : `Namaste${user?.name ? ` ${user.name}` : ''}! 🙏 I'm your **FitAI Coach** assistant.\n\nI can help you with:\n• 🥗 Diet plans & nutrition\n• 🏃 Workout routines & fitness\n• 🧠 Stress, sleep & mental wellness\n• 🌿 Ayurvedic remedies & herbs\n• 🏥 Health info (BP, diabetes, heart, etc.)\n\n💡 **Tip:** Take the Health Quiz first for personalized recommendations!\n\nWhat would you like to know?`;

    setMessages([{
      id: 1,
      role: 'bot',
      text: greeting,
      time: new Date(),
    }]);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  // Focus input on mount
  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 300);
  }, []);

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  const handleSend = useCallback(async (text = null) => {
    const msgText = (text || inputValue).trim();
    if (!msgText || isTyping) return;

    // Add user message
    const userMsg = {
      id: Date.now(),
      role: 'user',
      text: msgText,
      time: new Date(),
    };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    try {
      // Try backend API first
      const res = await chatAPI.sendMessage({
        message: msgText,
        sessionId,
        healthContext,
      });

      const botMsg = {
        id: Date.now() + 1,
        role: 'bot',
        text: res.data.response,
        category: res.data.category,
        time: new Date(res.data.timestamp),
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      // Offline fallback
      if (!err.status) {
        const fallbackText = findOfflineResponse(msgText);
        const botMsg = {
          id: Date.now() + 1,
          role: 'bot',
          text: fallbackText,
          time: new Date(),
          offline: true,
        };
        setMessages(prev => [...prev, botMsg]);
      } else {
        const botMsg = {
          id: Date.now() + 1,
          role: 'bot',
          text: "Sorry, I couldn't process that. Please try again!",
          time: new Date(),
        };
        setMessages(prev => [...prev, botMsg]);
      }
    } finally {
      setIsTyping(false);
    }
  }, [inputValue, isTyping, sessionId, healthContext]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const resetChat = () => {
    setMessages([{
      id: Date.now(),
      role: 'bot',
      text: 'Chat reset! 🔄\n\nHow can I help you? Ask me anything about health, fitness, diet, yoga, or wellness!',
      time: new Date(),
    }]);
    message.success('Chat cleared');
  };

  const showSuggestions = messages.length <= 2;

  const menuItems = [
    {
      key: 'reset',
      icon: <RotateCcw size={14} />,
      label: 'Reset Chat',
      onClick: resetChat,
    },
    ...(isAuthenticated ? [{
      key: 'clear-history',
      icon: <Trash2 size={14} />,
      label: 'Clear All History',
      danger: true,
      onClick: async () => {
        try {
          await chatAPI.clearHistory();
          message.success('Chat history cleared from server');
        } catch {
          message.info('History cleared locally');
        }
      },
    }] : []),
  ];

  return (
    <div className="aic-page">
      {/* ─── Header ─── */}
      <div className="aic-header">
        <div className="aic-header-content">
          <div className="aic-header-icon">
            <Sparkles size={28} color="#fff" />
          </div>
          <div>
            <Title level={2} className="aic-header-title">FitAI Coach</Title>
            <Text className="aic-header-subtitle">
              Your personal health & wellness assistant — powered by advanced health knowledge
            </Text>
          </div>
        </div>
        <div className="aic-header-badges">
          {healthData?.overallScore && (
            <Tag color="green" className="aic-score-tag">
              Health Score: {healthData.overallScore}/100
            </Tag>
          )}
          {healthData?.bmi?.value && (
            <Tag color="blue" className="aic-score-tag">
              BMI: {healthData.bmi.value} ({healthData.bmi.category})
            </Tag>
          )}
        </div>
      </div>

      {/* ─── Chat Container ─── */}
      <Card className="aic-chat-card" styles={{ body: { padding: 0 } }}>
        {/* Chat Header Bar */}
        <div className="aic-chat-bar">
          <div className="aic-chat-bar-left">
            <div className="aic-bot-avatar-sm">
              <Bot size={18} />
              <span className="aic-online-dot" />
            </div>
            <div>
              <span className="aic-chat-bar-name">FitAI Coach</span>
              <span className="aic-chat-bar-status">
                {isTyping ? 'Typing...' : 'Online — Ask anything'}
              </span>
            </div>
          </div>
          <Dropdown menu={{ items: menuItems }} placement="bottomRight" trigger={['click']}>
            <Button type="text" icon={<MoreVertical size={18} />} className="aic-more-btn" />
          </Dropdown>
        </div>

        {/* Messages */}
        <div className="aic-messages" ref={scrollRef}>
          {messages.map((msg) => (
            <div key={msg.id} className={`aic-msg aic-msg-${msg.role}`}>
              {msg.role === 'bot' && (
                <div className="aic-msg-avatar">
                  <Sparkles size={16} />
                </div>
              )}
              <div className="aic-msg-content">
                <div className="aic-msg-bubble">
                  {renderText(msg.text)}
                </div>
                <div className="aic-msg-meta">
                  <span className="aic-msg-time">{formatTime(msg.time)}</span>
                  {msg.category && (
                    <Tag size="small" className="aic-msg-category">{msg.category}</Tag>
                  )}
                  {msg.offline && (
                    <Tag color="orange" size="small">Offline</Tag>
                  )}
                </div>
              </div>
              {msg.role === 'user' && (
                <div className="aic-msg-avatar aic-msg-avatar-user">
                  <User size={16} />
                </div>
              )}
            </div>
          ))}

          {/* Typing indicator */}
          {isTyping && (
            <div className="aic-msg aic-msg-bot">
              <div className="aic-msg-avatar">
                <Sparkles size={16} />
              </div>
              <div className="aic-msg-content">
                <div className="aic-msg-bubble aic-typing">
                  <span className="aic-typing-dot" />
                  <span className="aic-typing-dot" />
                  <span className="aic-typing-dot" />
                </div>
              </div>
            </div>
          )}

          {/* Quick suggestions */}
          {showSuggestions && !isTyping && (
            <div className="aic-suggestions">
              <span className="aic-suggestions-label">
                <Smile size={14} /> Quick topics to explore:
              </span>
              <div className="aic-suggestions-grid">
                {QUICK_SUGGESTIONS.map((s, i) => (
                  <button
                    key={i}
                    className="aic-suggestion-chip"
                    onClick={() => handleSend(s.query)}
                  >
                    {s.icon}
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="aic-input-area">
          <div className="aic-input-wrap">
            <input
              ref={inputRef}
              type="text"
              className="aic-input"
              placeholder="Ask about diet, exercise, sleep, stress, yoga..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              maxLength={1000}
              disabled={isTyping}
            />
            <Tooltip title="Send message">
              <button
                className={`aic-send-btn ${inputValue.trim() && !isTyping ? 'active' : ''}`}
                onClick={() => handleSend()}
                disabled={!inputValue.trim() || isTyping}
              >
                <Send size={20} />
              </button>
            </Tooltip>
          </div>
          <div className="aic-input-footer">
            <MedicalDisclaimer style={{ padding: '4px 8px', fontSize: '11px' }} />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AIChatAssistant;
