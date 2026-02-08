import React, { useMemo, useState, useEffect } from 'react';
import { Card, Typography, Row, Col, Tag, Button, Avatar, Spin } from 'antd';
import { useHealth } from '../context/HealthContext';
import { useAuth } from '../context/AuthContext';
import { useSearch } from '../context/SearchContext';
import { bookingAPI } from '../utils/api';
import { useNavigate } from 'react-router-dom';
import MedicalDisclaimer from '../components/MedicalDisclaimer';
import {
  Activity,
  Leaf,
  Utensils,
  Moon,
  Zap,
  Clock,
  CircleCheck,
  Stethoscope,
  Crown,
  ArrowRight,
  Heart,
  Brain,
  Sparkles,
  Shield,
  Dumbbell,
  Sun,
  Target,
  TrendingUp,
  CalendarCheck,
  RotateCcw,
  Users,
  LogIn,
  Video,
  MapPin,
  CalendarDays,
  IndianRupee,
  User
} from 'lucide-react';

const { Title, Text, Paragraph } = Typography;

// ─── Section metadata for icons & colors ───
const SECTION_META = {
  yoga: { icon: Activity, color: '#2d6a4f', bg: '#e8f5e9', gradient: 'linear-gradient(135deg, #2d6a4f, #52b788)', label: 'Yoga & Mindfulness' },
  exercise: { icon: Zap, color: '#1565c0', bg: '#e3f2fd', gradient: 'linear-gradient(135deg, #1565c0, #42a5f5)', label: 'Physical Exercise' },
  diet: { icon: Utensils, color: '#e65100', bg: '#fff3e0', gradient: 'linear-gradient(135deg, #e65100, #ff9800)', label: 'Nutritional Strategy' },
  consultations: { icon: Stethoscope, color: '#6a1b9a', bg: '#f3e5f5', gradient: 'linear-gradient(135deg, #6a1b9a, #ab47bc)', label: 'Expert Consultations' },
  ayurveda: { icon: Leaf, color: '#1b5e20', bg: '#e8f5e9', gradient: 'linear-gradient(135deg, #1b5e20, #4caf50)', label: 'Advanced Ayurvedic Remedies' },
};

// ─── Feature cards for empty state ───
const PLAN_FEATURES = [
  { icon: Activity, title: 'Yoga & Meditation', desc: 'Personalized yoga routines and mindfulness practices for inner balance', color: '#2d6a4f', bg: '#e8f5e9' },
  { icon: Utensils, title: 'Nutrition Strategy', desc: 'Customized diet plans based on your body type and health goals', color: '#e65100', bg: '#fff3e0' },
  { icon: Leaf, title: 'Ayurvedic Remedies', desc: 'Traditional herbal recommendations tailored to your dosha', color: '#1b5e20', bg: '#e8f5e9' },
  { icon: Brain, title: 'Mental Wellness', desc: 'Stress management techniques and cognitive wellness strategies', color: '#4a148c', bg: '#f3e5f5' },
  { icon: Dumbbell, title: 'Exercise Plans', desc: 'Strength, cardio and flexibility routines matched to your fitness level', color: '#1565c0', bg: '#e3f2fd' },
  { icon: Moon, title: 'Sleep Optimization', desc: 'Improve your sleep quality with proven Ayurvedic sleep hygiene tips', color: '#283593', bg: '#e8eaf6' },
];

const STEPS = [
  { num: '1', title: 'Take Health Quiz', desc: 'Answer simple questions about your lifestyle & health', icon: CircleCheck },
  { num: '2', title: 'AI Analyzes', desc: 'Our AI creates a personalized wellness profile', icon: Sparkles },
  { num: '3', title: 'Get Your Plan', desc: 'Receive holistic recommendations tailored for you', icon: Shield },
];

// ─── Empty State View ───
const EmptyPlanView = () => {
  const navigate = useNavigate();

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '20px' }}>
      <div style={{
        textAlign: 'center',
        padding: '60px 24px 50px',
        background: 'linear-gradient(160deg, #e8f5e9 0%, #f1f8e9 30%, #fff8e1 60%, #fce4ec 100%)',
        borderRadius: 28, marginBottom: 40, position: 'relative', overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', top: 20, left: '8%', opacity: 0.15 }}><Leaf size={60} color="#2d6a4f" /></div>
        <div style={{ position: 'absolute', top: 40, right: '10%', opacity: 0.12 }}><Heart size={48} color="#e91e63" /></div>
        <div style={{ position: 'absolute', bottom: 30, left: '15%', opacity: 0.1 }}><Sun size={52} color="#ff9800" /></div>
        <div style={{ position: 'absolute', bottom: 20, right: '12%', opacity: 0.12 }}><Activity size={50} color="#2d6a4f" /></div>
        <div style={{
          width: 100, height: 100, borderRadius: 28,
          background: 'linear-gradient(135deg, #2d6a4f 0%, #40916c 50%, #52b788 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 24px', boxShadow: '0 12px 40px rgba(45, 106, 79, 0.3)',
          position: 'relative', zIndex: 1
        }}><Leaf size={48} color="#fff" /></div>
        <Title level={1} style={{ color: '#1b4332', margin: '0 0 12px', fontSize: 36, fontWeight: 800, position: 'relative', zIndex: 1 }}>
          Your Wellness Journey Starts Here
        </Title>
        <Paragraph style={{ fontSize: 17, color: '#555', maxWidth: 600, margin: '0 auto 32px', lineHeight: 1.7, position: 'relative', zIndex: 1 }}>
          Get a personalized health plan combining <strong>Ayurveda</strong>, <strong>Yoga</strong>,
          <strong> Modern Nutrition</strong> & <strong>Lifestyle</strong> strategies —
          all crafted by AI based on your unique health profile.
        </Paragraph>
        <Button type="primary" size="large" onClick={() => navigate('/assessment')} style={{
          height: 56, padding: '0 40px', fontSize: 17, fontWeight: 700, borderRadius: 16,
          background: 'linear-gradient(135deg, #2d6a4f 0%, #40916c 100%)', border: 'none',
          boxShadow: '0 8px 24px rgba(45, 106, 79, 0.35)', display: 'inline-flex', alignItems: 'center', gap: 10,
          position: 'relative', zIndex: 1
        }}>Start Health Quiz <ArrowRight size={20} /></Button>
      </div>

      <div style={{ marginBottom: 48 }}>
        <Title level={3} style={{ textAlign: 'center', color: '#2d6a4f', marginBottom: 32, fontWeight: 700 }}>How It Works</Title>
        <Row gutter={[24, 24]} justify="center">
          {STEPS.map((step, i) => (
            <Col xs={24} sm={8} key={i}>
              <div style={{ textAlign: 'center', padding: '32px 20px', background: '#fff', borderRadius: 20, boxShadow: '0 4px 20px rgba(0,0,0,0.04)', height: '100%' }}>
                <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'linear-gradient(135deg, #2d6a4f, #52b788)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', boxShadow: '0 6px 16px rgba(45,106,79,0.25)' }}>
                  <span style={{ color: '#fff', fontSize: 22, fontWeight: 800 }}>{step.num}</span>
                </div>
                <Text strong style={{ fontSize: 16, display: 'block', marginBottom: 8, color: '#1b4332' }}>{step.title}</Text>
                <Text type="secondary" style={{ fontSize: 13.5, lineHeight: 1.6 }}>{step.desc}</Text>
              </div>
            </Col>
          ))}
        </Row>
      </div>

      <div style={{ marginBottom: 48 }}>
        <Title level={3} style={{ textAlign: 'center', color: '#2d6a4f', marginBottom: 8, fontWeight: 700 }}>What Your Plan Includes</Title>
        <Paragraph style={{ textAlign: 'center', color: '#888', marginBottom: 32, fontSize: 15 }}>A complete holistic wellness blueprint designed just for you</Paragraph>
        <Row gutter={[20, 20]}>
          {PLAN_FEATURES.map((f, i) => (
            <Col xs={24} sm={12} md={8} key={i}>
              <Card variant="borderless" style={{ borderRadius: 18, height: '100%', boxShadow: '0 2px 16px rgba(0,0,0,0.04)', transition: 'transform 0.3s ease, box-shadow 0.3s ease', cursor: 'default' }} styles={{ body: { padding: '28px 22px' } }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.08)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 16px rgba(0,0,0,0.04)'; }}>
                <div style={{ width: 50, height: 50, borderRadius: 14, background: f.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                  <f.icon size={26} color={f.color} />
                </div>
                <Text strong style={{ fontSize: 15, display: 'block', marginBottom: 6, color: '#1b4332' }}>{f.title}</Text>
                <Text type="secondary" style={{ fontSize: 13, lineHeight: 1.6 }}>{f.desc}</Text>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/* ─── Trainer Subscriptions ─── */}
      <SubscriptionSection />

      <div style={{ textAlign: 'center', padding: '44px 24px', background: 'linear-gradient(135deg, #1b4332 0%, #2d6a4f 50%, #40916c 100%)', borderRadius: 24, marginBottom: 20 }}>
        <Sparkles size={36} color="#b7e4c7" style={{ marginBottom: 16 }} />
        <Title level={3} style={{ color: '#fff', margin: '0 0 10px', fontWeight: 700 }}>Ready to Transform Your Health?</Title>
        <Paragraph style={{ color: '#b7e4c7', fontSize: 15, maxWidth: 500, margin: '0 auto 28px' }}>It takes just 2 minutes to complete the quiz and unlock your personalized wellness plan.</Paragraph>
        <Button size="large" onClick={() => navigate('/assessment')} style={{
          height: 52, padding: '0 36px', fontSize: 16, fontWeight: 700, borderRadius: 14,
          background: '#fff', color: '#2d6a4f', border: 'none', boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
          display: 'inline-flex', alignItems: 'center', gap: 10
        }}>Take the Quiz Now <ArrowRight size={18} /></Button>
      </div>
    </div>
  );
};

// ─── Beautiful Recommendation Card ───
const RecommendationItem = ({ item, index, color, bg }) => (
  <div style={{
    display: 'flex', gap: 16, padding: '20px',
    background: '#fff', borderRadius: 16,
    border: '1px solid #f0f0f0',
    marginBottom: 12,
    transition: 'all 0.3s ease',
    cursor: 'default'
  }}
    onMouseEnter={e => { e.currentTarget.style.borderColor = color; e.currentTarget.style.boxShadow = `0 4px 20px ${color}15`; }}
    onMouseLeave={e => { e.currentTarget.style.borderColor = '#f0f0f0'; e.currentTarget.style.boxShadow = 'none'; }}
  >
    <div style={{
      width: 44, height: 44, borderRadius: 12, background: bg,
      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      fontSize: 18, fontWeight: 800, color: color
    }}>
      {index + 1}
    </div>
    <div style={{ flex: 1, minWidth: 0 }}>
      <Text strong style={{ fontSize: 15, color: '#1b4332', display: 'block', marginBottom: 4 }}>{item.name}</Text>
      <Text style={{ fontSize: 13.5, color: '#666', lineHeight: 1.6, display: 'block', marginBottom: 8 }}>{item.reason}</Text>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <Tag style={{ borderRadius: 8, padding: '2px 10px', fontSize: 12, border: 'none', background: bg, color: color, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
          <Clock size={12} /> {item.duration}
        </Tag>
        <Tag style={{ borderRadius: 8, padding: '2px 10px', fontSize: 11, border: 'none', background: '#f0fdf4', color: '#16a34a', fontWeight: 600 }}>
          RECOMMENDED
        </Tag>
      </div>
    </div>
  </div>
);

// ─── Plan Section Card ───
const PlanSection = ({ sectionKey, data }) => {
  const meta = SECTION_META[sectionKey];
  if (!meta || !data || data.length === 0) return null;
  const Icon = meta.icon;

  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{
        background: '#fff', borderRadius: 20, overflow: 'hidden',
        boxShadow: '0 2px 16px rgba(0,0,0,0.04)',
        border: '1px solid #f0f0f0'
      }}>
        {/* Section Header */}
        <div style={{
          padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 14,
          borderBottom: '1px solid #f5f5f5',
          background: `linear-gradient(135deg, ${meta.bg} 0%, #fff 100%)`
        }}>
          <div style={{
            width: 46, height: 46, borderRadius: 14, background: meta.gradient,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: `0 4px 14px ${meta.color}30`
          }}>
            <Icon size={24} color="#fff" />
          </div>
          <div>
            <Text strong style={{ fontSize: 17, color: '#1b4332', display: 'block' }}>{meta.label}</Text>
            <Text type="secondary" style={{ fontSize: 12.5 }}>{data.length} recommendation{data.length > 1 ? 's' : ''}</Text>
          </div>
          <Tag style={{
            marginLeft: 'auto', borderRadius: 10, padding: '3px 12px', fontSize: 11,
            border: 'none', background: meta.bg, color: meta.color, fontWeight: 700
          }}>
            {data.length} {data.length === 1 ? 'ITEM' : 'ITEMS'}
          </Tag>
        </div>

        {/* Recommendation Items */}
        <div style={{ padding: '16px 20px' }}>
          {data.map((item, i) => (
            <RecommendationItem key={i} item={item} index={i} color={meta.color} bg={meta.bg} />
          ))}
        </div>
      </div>
    </div>
  );
};

// ─── Stat Card ───
const StatCard = ({ icon: Icon, label, value, color, bg }) => (
  <div style={{
    background: '#fff', borderRadius: 16, padding: '20px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.04)', border: '1px solid #f0f0f0',
    display: 'flex', alignItems: 'center', gap: 14, height: '100%'
  }}>
    <div style={{
      width: 48, height: 48, borderRadius: 14, background: bg,
      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
    }}>
      <Icon size={24} color={color} />
    </div>
    <div>
      <Text style={{ fontSize: 12, color: '#999', display: 'block' }}>{label}</Text>
      <Text strong style={{ fontSize: 18, color: '#1b4332' }}>{value}</Text>
    </div>
  </div>
);

// ─── Subscription Section ───
const SubscriptionSection = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { allTrainers } = useSearch();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) { setLoading(false); return; }
    // Try localStorage cache first
    const cached = localStorage.getItem('stayfit_user_bookings');
    if (cached) {
      try { setBookings(JSON.parse(cached)); } catch {}
    }
    // Fetch from API
    bookingAPI.getMyBookings().then(res => {
      if (res.success && res.data) {
        const mapped = res.data.map(b => ({
          id: b._id,
          trainerId: b.trainerId?._id || b.trainerId,
          trainerName: b.trainerId?.name || 'Trainer',
          trainerImage: b.trainerId?.avatar || null,
          trainerCategory: b.trainerId?.category || '',
          trainerSpec: b.trainerId?.specialization || '',
          consultationType: b.consultationType || 'video',
          date: b.date,
          timeSlot: b.timeSlot || {},
          duration: b.duration || 60,
          status: b.status,
          amount: b.amount || 0
        }));
        setBookings(mapped);
        localStorage.setItem('stayfit_user_bookings', JSON.stringify(mapped));
      }
    }).catch(() => {}).finally(() => setLoading(false));
  }, [isAuthenticated]);

  // Resolve trainer info from allTrainers for local bookings
  const resolveTrainer = (booking) => {
    if (booking.trainerName && booking.trainerName !== 'Trainer') return booking;
    const t = allTrainers.find(tr => String(tr.id) === String(booking.trainerId));
    if (t) return { ...booking, trainerName: t.name, trainerImage: t.image, trainerCategory: t.category };
    return booking;
  };

  const getStatusConfig = (status) => {
    const configs = {
      pending: { color: 'orange', label: 'Pending' },
      confirmed: { color: 'blue', label: 'Confirmed' },
      completed: { color: 'green', label: 'Completed' },
      cancelled: { color: 'red', label: 'Cancelled' },
      'in-progress': { color: 'processing', label: 'In Progress' },
      expired: { color: 'default', label: 'Expired' }
    };
    return configs[status] || configs.pending;
  };

  // Derive effective status — mark as expired if date+time has passed and not already completed/cancelled
  const getEffectiveStatus = (booking) => {
    if (booking.status === 'completed' || booking.status === 'cancelled') return booking.status;
    try {
      const bookingDate = new Date(booking.date);
      if (isNaN(bookingDate.getTime())) return booking.status;
      // Parse time slot (e.g. "10:00", "14:30")
      const timeStr = booking.timeSlot?.start || '23:59';
      const [hours, minutes] = timeStr.split(':').map(Number);
      bookingDate.setHours(hours || 0, minutes || 0, 0, 0);
      // Add duration to get session end time
      const endTime = new Date(bookingDate.getTime() + (booking.duration || 60) * 60 * 1000);
      if (endTime < new Date()) return 'expired';
    } catch {}
    return booking.status;
  };

  const getTypeConfig = (type) => {
    const configs = {
      video: { icon: <Video size={13} />, label: 'Video Call', color: '#1890ff' },
      'in-person': { icon: <MapPin size={13} />, label: 'In-Person', color: '#52c41a' },
      'home-visit': { icon: <MapPin size={13} />, label: 'Home Visit', color: '#fa8c16' }
    };
    return configs[type] || configs.video;
  };

  // Not logged in → Login prompt
  if (!isAuthenticated) {
    return (
      <div style={{
        background: '#fff', borderRadius: 20, padding: '40px 28px',
        boxShadow: '0 2px 16px rgba(0,0,0,0.04)', border: '1px solid #f0f0f0',
        textAlign: 'center', marginBottom: 28
      }}>
        <div style={{
          width: 64, height: 64, borderRadius: 18,
          background: 'linear-gradient(135deg, #fff3e0, #ffe0b2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 20px'
        }}>
          <LogIn size={30} color="#e65100" />
        </div>
        <Title level={4} style={{ color: '#1b4332', margin: '0 0 8px' }}>
          Login to View Your Subscriptions
        </Title>
        <Paragraph style={{ color: '#888', fontSize: 14, maxWidth: 420, margin: '0 auto 24px' }}>
          Track your trainer bookings, session status, and upcoming consultations — all in one place.
        </Paragraph>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <Button type="primary" size="large" icon={<LogIn size={16} />}
            onClick={() => navigate('/login')}
            style={{
              height: 46, borderRadius: 12, fontWeight: 600, fontSize: 15,
              background: 'linear-gradient(135deg, #2d6a4f, #40916c)', border: 'none',
              padding: '0 28px'
            }}>
            Login
          </Button>
          <Button size="large"
            onClick={() => navigate('/signup')}
            style={{ height: 46, borderRadius: 12, fontWeight: 600, fontSize: 15, padding: '0 28px' }}>
            Sign Up
          </Button>
        </div>
      </div>
    );
  }

  // Loading
  if (loading) {
    return (
      <div style={{
        background: '#fff', borderRadius: 20, padding: '48px 28px',
        boxShadow: '0 2px 16px rgba(0,0,0,0.04)', border: '1px solid #f0f0f0',
        textAlign: 'center', marginBottom: 28
      }}>
        <Spin size="large" />
        <Text style={{ display: 'block', marginTop: 16, color: '#888' }}>Loading your subscriptions...</Text>
      </div>
    );
  }

  // Empty state
  if (bookings.length === 0) {
    return (
      <div style={{
        background: '#fff', borderRadius: 20, padding: '40px 28px',
        boxShadow: '0 2px 16px rgba(0,0,0,0.04)', border: '1px solid #f0f0f0',
        textAlign: 'center', marginBottom: 28
      }}>
        <div style={{
          width: 64, height: 64, borderRadius: 18,
          background: 'linear-gradient(135deg, #e8f5e9, #c8e6c9)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 20px'
        }}>
          <CalendarDays size={30} color="#2d6a4f" />
        </div>
        <Title level={4} style={{ color: '#1b4332', margin: '0 0 8px' }}>No Subscriptions Yet</Title>
        <Paragraph style={{ color: '#888', fontSize: 14, maxWidth: 400, margin: '0 auto 24px' }}>
          Browse our expert trainers and book your first consultation to start your fitness journey.
        </Paragraph>
        <Button type="primary" size="large" icon={<ArrowRight size={16} />}
          onClick={() => navigate('/experts/all')}
          style={{
            height: 46, borderRadius: 12, fontWeight: 600, fontSize: 15,
            background: 'linear-gradient(135deg, #2d6a4f, #40916c)', border: 'none',
            padding: '0 28px'
          }}>
          Browse Trainers
        </Button>
      </div>
    );
  }

  // Bookings list
  return (
    <div style={{
      background: '#fff', borderRadius: 20, overflow: 'hidden',
      boxShadow: '0 2px 16px rgba(0,0,0,0.04)', border: '1px solid #f0f0f0',
      marginBottom: 28
    }}>
      <div style={{
        padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 14,
        borderBottom: '1px solid #f5f5f5',
        background: 'linear-gradient(135deg, #e8f5e9 0%, #fff 100%)'
      }}>
        <div style={{
          width: 46, height: 46, borderRadius: 14,
          background: 'linear-gradient(135deg, #2d6a4f, #52b788)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 14px rgba(45,106,79,0.3)'
        }}>
          <CalendarCheck size={24} color="#fff" />
        </div>
        <div style={{ flex: 1 }}>
          <Text strong style={{ fontSize: 17, color: '#1b4332', display: 'block' }}>My Trainer Subscriptions</Text>
          <Text type="secondary" style={{ fontSize: 12.5 }}>{bookings.length} booking{bookings.length > 1 ? 's' : ''}</Text>
        </div>
        <Button type="primary" size="small" icon={<ArrowRight size={14} />}
          onClick={() => navigate('/experts/all')}
          style={{ borderRadius: 10, background: '#2d6a4f', border: 'none', fontWeight: 600 }}>
          Book More
        </Button>
      </div>

      <div style={{ padding: '12px 20px' }}>
        {bookings.map(rawBooking => {
          const booking = resolveTrainer(rawBooking);
          const effectiveStatus = getEffectiveStatus(booking);
          const statusCfg = getStatusConfig(effectiveStatus);
          const typeCfg = getTypeConfig(booking.consultationType);
          const dateStr = booking.date ? new Date(booking.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';
          const timeStr = booking.timeSlot?.start || '—';

          return (
            <div key={booking.id} style={{
              display: 'flex', gap: 16, padding: '18px 16px',
              background: '#fff', borderRadius: 16, border: '1px solid #f0f0f0',
              marginBottom: 10, transition: 'all 0.3s ease', alignItems: 'center',
              cursor: 'pointer'
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#2d6a4f'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(45,106,79,0.08)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#f0f0f0'; e.currentTarget.style.boxShadow = 'none'; }}
              onClick={() => navigate(`/trainer/${booking.trainerId}`)}
            >
              <Avatar size={52} src={booking.trainerImage} icon={<User size={24} />}
                style={{ background: '#2d6a4f', flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 6 }}>
                  <Text strong style={{ fontSize: 15, color: '#1b4332' }}>{booking.trainerName}</Text>
                  {booking.trainerCategory && (
                    <Tag style={{ borderRadius: 8, fontSize: 11, margin: 0, fontWeight: 600 }} color="green">
                      {booking.trainerCategory}
                    </Tag>
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, color: '#666' }}>
                    <CalendarDays size={13} /> {dateStr}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, color: '#666' }}>
                    <Clock size={13} /> {timeStr}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, color: typeCfg.color }}>
                    {typeCfg.icon} {typeCfg.label}
                  </span>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6, flexShrink: 0 }}>
                <Tag color={statusCfg.color} style={{ borderRadius: 8, fontWeight: 600, fontSize: 12, margin: 0 }}>
                  {statusCfg.label}
                </Tag>
                <Text strong style={{ fontSize: 15, color: '#1b4332' }}>
                  <IndianRupee size={13} style={{ verticalAlign: 'middle' }} />{booking.amount.toLocaleString()}
                </Text>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ─── Main Component ───
const HealthPlanPage = () => {
  const { healthData, userAnswers, planLevel } = useHealth();
  const navigate = useNavigate();

  const totalRecs = useMemo(() => {
    if (!healthData?.recommendations) return 0;
    const r = healthData.recommendations;
    return (r.yoga?.length || 0) + (r.exercise?.length || 0) + (r.diet?.length || 0) +
      (r.ayurveda?.length || 0) + (r.consultations?.length || 0);
  }, [healthData]);

  const planColors = {
    basic: { color: '#2d6a4f', bg: '#e8f5e9', label: 'Basic' },
    active: { color: '#e65100', bg: '#fff3e0', label: 'Active' },
    total: { color: '#6a1b9a', bg: '#f3e5f5', label: 'Total Care' }
  };
  const currentPlan = planColors[planLevel] || planColors.basic;

  if (!healthData || !healthData.recommendations) {
    return <EmptyPlanView />;
  }

  const { recommendations } = healthData;

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '20px' }}>
      {/* ─── Hero Banner ─── */}
      <div style={{
        padding: '40px 32px 36px',
        background: 'linear-gradient(160deg, #e8f5e9 0%, #f1f8e9 30%, #fff8e1 60%, #e8f5e9 100%)',
        borderRadius: 24, marginBottom: 28, position: 'relative', overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', top: 15, right: '6%', opacity: 0.1 }}><Leaf size={80} color="#2d6a4f" /></div>
        <div style={{ position: 'absolute', bottom: 10, left: '5%', opacity: 0.08 }}><Heart size={60} color="#e91e63" /></div>
        <div style={{ position: 'absolute', top: '50%', right: '20%', opacity: 0.06, transform: 'translateY(-50%)' }}><Activity size={100} color="#2d6a4f" /></div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap', position: 'relative', zIndex: 1 }}>
          <div style={{
            width: 72, height: 72, borderRadius: 20,
            background: 'linear-gradient(135deg, #2d6a4f, #52b788)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 8px 28px rgba(45,106,79,0.3)', flexShrink: 0
          }}>
            <Sparkles size={36} color="#fff" />
          </div>
          <div style={{ flex: 1 }}>
            <Title level={2} style={{ color: '#1b4332', margin: '0 0 6px', fontWeight: 800, fontSize: 28 }}>
              Your Holistic Transformation Plan
            </Title>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <Text style={{ fontSize: 15, color: '#555' }}>
                Optimized for <strong style={{ color: '#2d6a4f' }}>{userAnswers?.primaryConcern || 'wellness'}</strong> management
              </Text>
              <span style={{ color: '#ccc' }}>|</span>
              <Tag style={{
                borderRadius: 10, padding: '2px 14px', fontSize: 12, fontWeight: 700,
                border: 'none', background: currentPlan.bg, color: currentPlan.color
              }}>
                <Crown size={12} style={{ marginRight: 4, verticalAlign: 'middle' }} />
                {currentPlan.label.toUpperCase()} PLAN
              </Tag>
            </div>
          </div>
          <Button
            onClick={() => navigate('/assessment')}
            style={{
              borderRadius: 12, height: 42, padding: '0 20px', fontWeight: 600,
              display: 'flex', alignItems: 'center', gap: 6, fontSize: 13,
              background: '#fff', border: '1px solid #d5ead9', color: '#2d6a4f'
            }}
          >
            <RotateCcw size={15} /> Retake Quiz
          </Button>
        </div>

        {/* Tags */}
        <div style={{ display: 'flex', gap: 8, marginTop: 20, flexWrap: 'wrap', position: 'relative', zIndex: 1 }}>
          {[
            { label: 'Ayurveda', color: '#2d6a4f', bg: '#e8f5e9' },
            { label: 'Yoga', color: '#1565c0', bg: '#e3f2fd' },
            { label: 'Diet', color: '#e65100', bg: '#fff3e0' },
            { label: 'Lifestyle', color: '#6a1b9a', bg: '#f3e5f5' },
          ].map(t => (
            <Tag key={t.label} style={{ borderRadius: 10, padding: '4px 14px', fontSize: 12, fontWeight: 600, border: 'none', background: t.bg, color: t.color }}>
              {t.label}
            </Tag>
          ))}
        </div>
      </div>

      {/* ─── Trainer Subscriptions ─── */}
      <SubscriptionSection />

      {/* ─── Stats Row ─── */}
      <Row gutter={[16, 16]} style={{ marginBottom: 28 }}>
        <Col xs={12} sm={6}>
          <StatCard icon={Target} label="Focus Area" value={userAnswers?.primaryConcern || 'Wellness'} color="#2d6a4f" bg="#e8f5e9" />
        </Col>
        <Col xs={12} sm={6}>
          <StatCard icon={CalendarCheck} label="Total Actions" value={`${totalRecs} Items`} color="#1565c0" bg="#e3f2fd" />
        </Col>
        <Col xs={12} sm={6}>
          <StatCard icon={Crown} label="Plan Level" value={currentPlan.label} color={currentPlan.color} bg={currentPlan.bg} />
        </Col>
        <Col xs={12} sm={6}>
          <StatCard icon={TrendingUp} label="Progress" value="Just Started" color="#e65100" bg="#fff3e0" />
        </Col>
      </Row>

      {/* ─── Main Content ─── */}
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={16}>
          <PlanSection sectionKey="yoga" data={recommendations.yoga} />
          <PlanSection sectionKey="exercise" data={recommendations.exercise} />
          <PlanSection sectionKey="diet" data={recommendations.diet} />
          {recommendations.consultations && <PlanSection sectionKey="consultations" data={recommendations.consultations} />}
          {recommendations.ayurveda && <PlanSection sectionKey="ayurveda" data={recommendations.ayurveda} />}
        </Col>

        {/* ─── Sidebar ─── */}
        <Col xs={24} lg={8}>
          <div style={{
            position: 'sticky', top: 90, display: 'flex', flexDirection: 'column', gap: 20
          }}>
            {/* Medical Note Card */}
            <div style={{
              background: '#fff', borderRadius: 20, overflow: 'hidden',
              boxShadow: '0 2px 16px rgba(0,0,0,0.04)', border: '1px solid #f0f0f0'
            }}>
              <div style={{
                padding: '18px 22px', display: 'flex', alignItems: 'center', gap: 12,
                background: 'linear-gradient(135deg, #e8f5e9, #fff)'
              }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 12,
                  background: 'linear-gradient(135deg, #2d6a4f, #52b788)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <Stethoscope size={20} color="#fff" />
                </div>
                <Text strong style={{ fontSize: 16, color: '#1b4332' }}>Medical Note</Text>
              </div>
              <div style={{ padding: '18px 22px' }}>
                <Paragraph style={{ fontSize: 13.5, marginBottom: 12, color: '#555' }}>
                  Your plan is optimized for <strong style={{ color: '#2d6a4f' }}>{userAnswers?.primaryConcern}</strong> management
                  with {totalRecs} personalized recommendations.
                </Paragraph>
                <div style={{ background: '#f8faf9', borderRadius: 12, padding: '12px 14px', marginBottom: 0 }}>
                  <MedicalDisclaimer />
                </div>
              </div>
            </div>

            {/* Quick Tips Card */}
            <div style={{
              background: '#fff', borderRadius: 20, padding: '22px',
              boxShadow: '0 2px 16px rgba(0,0,0,0.04)', border: '1px solid #f0f0f0'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: '#fff3e0', display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <Sun size={18} color="#e65100" />
                </div>
                <Text strong style={{ fontSize: 15, color: '#1b4332' }}>Daily Tips</Text>
              </div>
              {[
                { text: 'Start your day with warm lemon water', icon: '🌅' },
                { text: 'Practice 10 min meditation daily', icon: '🧘' },
                { text: 'Walk 30 mins after dinner', icon: '🚶' },
                { text: 'Sleep by 10:30 PM for best recovery', icon: '🌙' },
              ].map((tip, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '10px 0', borderBottom: i < 3 ? '1px solid #f5f5f5' : 'none'
                }}>
                  <span style={{ fontSize: 18, flexShrink: 0 }}>{tip.icon}</span>
                  <Text style={{ fontSize: 13, color: '#555' }}>{tip.text}</Text>
                </div>
              ))}
            </div>
          </div>
        </Col>
      </Row>

      {/* ─── Bottom CTA — Consult a Trainer ─── */}
      <div style={{
        textAlign: 'center', padding: '44px 24px', marginTop: 32,
        background: 'linear-gradient(135deg, #1b4332 0%, #2d6a4f 50%, #40916c 100%)',
        borderRadius: 24, position: 'relative', overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', top: 15, left: '8%', opacity: 0.08 }}><Activity size={70} color="#fff" /></div>
        <div style={{ position: 'absolute', bottom: 10, right: '6%', opacity: 0.08 }}><Heart size={60} color="#fff" /></div>
        <Users size={40} color="#b7e4c7" style={{ marginBottom: 16, position: 'relative', zIndex: 1 }} />
        <Title level={3} style={{ color: '#fff', margin: '0 0 10px', fontWeight: 700, position: 'relative', zIndex: 1 }}>
          Want a Personalized Plan from an Expert?
        </Title>
        <Paragraph style={{ color: '#b7e4c7', fontSize: 15, maxWidth: 520, margin: '0 auto 28px', position: 'relative', zIndex: 1 }}>
          Connect with certified trainers, nutritionists & wellness experts who can create a customized plan tailored to your goals.
        </Paragraph>
        <Button size="large" onClick={() => navigate('/experts/all')} style={{
          height: 54, padding: '0 40px', fontSize: 17, fontWeight: 700, borderRadius: 16,
          background: '#fff', color: '#2d6a4f', border: 'none',
          boxShadow: '0 6px 24px rgba(0,0,0,0.2)',
          display: 'inline-flex', alignItems: 'center', gap: 10,
          position: 'relative', zIndex: 1
        }}>
          Browse All Trainers <ArrowRight size={20} />
        </Button>
      </div>
    </div>
  );
};

export default HealthPlanPage;
