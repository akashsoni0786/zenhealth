import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Card,
  Row,
  Col,
  Typography,
  Button,
  Avatar,
  Tag,
  Tabs,
  Table,
  Badge,
  Statistic,
  Calendar,
  Modal,
  Form,
  Input,
  TimePicker,
  Switch,
  Divider,
  List,
  Empty,
  message,
  Tooltip,
  Progress,
  Space,
  Rate
} from 'antd';
import {
  ArrowLeft,
  Star,
  Clock,
  Award,
  Calendar as CalendarIcon,
  Users,
  Video,
  MapPin,
  CheckCircle,
  XCircle,
  MessageSquare,
  TrendingUp,
  IndianRupee,
  Settings,
  Bell,
  Edit3,
  Eye,
  Phone,
  Mail,
  Sparkles,
  BarChart3,
  Target,
  Wallet,
  ShieldCheck,
  Heart,
  ThumbsUp,
  Send,
  GraduationCap,
  Briefcase,
  Globe,
  Zap
} from 'lucide-react';
import { getCategoryColor, getCategoryLabel } from '../data/trainerData';
import { useSearch } from '../context/SearchContext';
import { useTrainerAuth } from '../context/TrainerAuthContext';
import { useAuth } from '../context/AuthContext';
import { reviewAPI, bookingAPI } from '../utils/api';
import dayjs from 'dayjs';
import './TrainerConsultationPage.css';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

// Mock reviews data
const MOCK_REVIEWS = [
  {
    id: 1, name: 'Rahul Sharma', avatar: 'https://i.pravatar.cc/150?img=11',
    rating: 5, date: '2026-01-28', helpful: 12,
    comment: 'Absolutely amazing trainer! The personalized workout plan has transformed my fitness journey. Highly recommend for anyone looking to get serious about health.'
  },
  {
    id: 2, name: 'Priya Patel', avatar: 'https://i.pravatar.cc/150?img=5',
    rating: 4, date: '2026-01-22', helpful: 8,
    comment: 'Very knowledgeable and patient. Explained every exercise clearly and adjusted the plan based on my progress. Great experience overall.'
  },
  {
    id: 3, name: 'Amit Kumar', avatar: 'https://i.pravatar.cc/150?img=12',
    rating: 5, date: '2026-01-15', helpful: 15,
    comment: 'Best investment in my health! Lost 8kg in 3 months with the guided diet and exercise plan. The video consultations are very convenient.'
  },
  {
    id: 4, name: 'Sneha Gupta', avatar: 'https://i.pravatar.cc/150?img=9',
    rating: 4, date: '2026-01-10', helpful: 6,
    comment: 'Great trainer with deep knowledge of ayurvedic principles combined with modern fitness. The holistic approach really works.'
  },
  {
    id: 5, name: 'Vikram Singh', avatar: 'https://i.pravatar.cc/150?img=14',
    rating: 5, date: '2025-12-28', helpful: 10,
    comment: 'Been training for 6 months now and the results are incredible. Very professional and always on time for sessions. Keeps me motivated!'
  },
  {
    id: 6, name: 'Anita Desai', avatar: 'https://i.pravatar.cc/150?img=25',
    rating: 3, date: '2025-12-20', helpful: 3,
    comment: 'Good trainer overall. Sometimes sessions feel a bit rushed but the advice and plans provided are solid. Would recommend for beginners.'
  },
];

// Mock consultation data
const generateMockConsultations = (trainerId) => {
  const statuses = ['upcoming', 'completed', 'cancelled', 'pending'];
  const types = ['video', 'in-person'];
  const clients = [
    { name: 'Rahul Sharma', email: 'rahul@email.com', phone: '+91 98765 43210', image: 'https://i.pravatar.cc/150?img=1' },
    { name: 'Priya Patel', email: 'priya@email.com', phone: '+91 87654 32109', image: 'https://i.pravatar.cc/150?img=2' },
    { name: 'Amit Kumar', email: 'amit@email.com', phone: '+91 76543 21098', image: 'https://i.pravatar.cc/150?img=3' },
    { name: 'Sneha Gupta', email: 'sneha@email.com', phone: '+91 65432 10987', image: 'https://i.pravatar.cc/150?img=4' },
    { name: 'Vikram Singh', email: 'vikram@email.com', phone: '+91 54321 09876', image: 'https://i.pravatar.cc/150?img=5' },
    { name: 'Anita Desai', email: 'anita@email.com', phone: '+91 43210 98765', image: 'https://i.pravatar.cc/150?img=6' },
  ];

  return Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    client: clients[i % clients.length],
    date: dayjs().add(i - 3, 'day').format('YYYY-MM-DD'),
    time: ['09:00 AM', '10:30 AM', '02:00 PM', '04:30 PM', '06:00 PM'][i % 5],
    duration: [30, 45, 60][i % 3],
    type: types[i % 2],
    status: i < 3 ? 'upcoming' : i < 8 ? 'completed' : i < 10 ? 'pending' : 'cancelled',
    price: [1200, 1500, 1800][i % 3],
    concerns: 'Looking for guidance on improving overall fitness and maintaining a healthy lifestyle.',
    notes: i < 8 ? 'Client showed good progress. Recommended daily yoga routine.' : ''
  }));
};

const TrainerConsultationPage = () => {
  const { trainerId } = useParams();
  const navigate = useNavigate();
  const { allTrainers } = useSearch();
  const { adminLoggedIn, currentTrainer, registeredTrainers, verifyTrainer, rejectTrainer } = useTrainerAuth();
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedConsultation, setSelectedConsultation] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [reviews, setReviews] = useState(MOCK_REVIEWS);
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [helpfulIds, setHelpfulIds] = useState([]);

  // ─── Fetch reviews from backend ───
  useEffect(() => {
    if (!trainerId) return;
    reviewAPI.getTrainerReviews(trainerId).then(res => {
      if (res.success && res.data?.length > 0) {
        const mapped = res.data.map(r => ({
          id: r._id,
          name: r.userId?.name || 'User',
          avatar: `https://i.pravatar.cc/150?img=${Math.abs(r._id?.charCodeAt?.(0) || 0) % 70}`,
          rating: r.rating,
          date: r.createdAt?.split('T')[0] || dayjs().format('YYYY-MM-DD'),
          helpful: 0,
          comment: r.comment,
          trainerReply: r.trainerReply || null
        }));
        setReviews(mapped);
      }
    }).catch(() => {});
  }, [trainerId]);

  // Get trainer data - support both numeric and string IDs
  const trainer = useMemo(() => {
    const numId = parseInt(trainerId);
    return allTrainers.find(t => t.id === numId || t.id === trainerId || t.id === `reg_${trainerId}`) || allTrainers[0];
  }, [trainerId, allTrainers]);

  // Check if the current viewer is the trainer themselves or admin
  const isOwner = currentTrainer && (
    currentTrainer.id === trainer?.id ||
    `reg_${currentTrainer.id}` === trainer?.id ||
    currentTrainer.id === parseInt(trainerId)
  );
  const canSeePrivateData = isOwner || adminLoggedIn;

  // Mock consultations
  const consultations = useMemo(() => generateMockConsultations(trainerId), [trainerId]);

  // Statistics
  const stats = useMemo(() => {
    const completed = consultations.filter(c => c.status === 'completed').length;
    const upcoming = consultations.filter(c => c.status === 'upcoming').length;
    const pending = consultations.filter(c => c.status === 'pending').length;
    const totalEarnings = consultations
      .filter(c => c.status === 'completed')
      .reduce((sum, c) => sum + c.price, 0);

    return {
      totalConsultations: consultations.length,
      completed,
      upcoming,
      pending,
      cancelled: consultations.filter(c => c.status === 'cancelled').length,
      totalEarnings,
      completionRate: Math.round((completed / consultations.length) * 100),
      avgRating: trainer.rating
    };
  }, [consultations, trainer]);

  // Handle consultation actions
  const handleAccept = (consultation) => {
    message.success(`Consultation with ${consultation.client.name} accepted!`);
  };

  const handleDecline = (consultation) => {
    message.warning(`Consultation with ${consultation.client.name} declined.`);
  };

  const handleViewDetails = (consultation) => {
    setSelectedConsultation(consultation);
    setIsDetailModalOpen(true);
  };

  const handleStartCall = (consultation) => {
    message.info(`Starting video call with ${consultation.client.name}...`);
  };

  // Review handlers
  const handleSubmitReview = () => {
    if (!reviewText.trim()) {
      message.warning('Please write a review before submitting');
      return;
    }
    const newReview = {
      id: Date.now(),
      name: isAuthenticated ? (user?.name || 'Anonymous User') : 'Guest User',
      avatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`,
      rating: reviewRating,
      date: dayjs().format('YYYY-MM-DD'),
      helpful: 0,
      comment: reviewText.trim()
    };
    setReviews(prev => [newReview, ...prev]);
    setReviewText('');
    setReviewRating(5);
    message.success('Review submitted successfully!');
    // Sync to backend
    reviewAPI.submit({
      trainerId,
      rating: reviewRating,
      comment: reviewText.trim(),
      title: ''
    }).catch(() => {});
  };

  const handleHelpful = (reviewId) => {
    if (helpfulIds.includes(reviewId)) return;
    setHelpfulIds(prev => [...prev, reviewId]);
    setReviews(prev => prev.map(r => r.id === reviewId ? { ...r, helpful: r.helpful + 1 } : r));
  };

  // Derived review stats
  const reviewStats = useMemo(() => {
    const total = reviews.length;
    const avg = total > 0 ? (reviews.reduce((s, r) => s + r.rating, 0) / total).toFixed(1) : 0;
    const dist = [5, 4, 3, 2, 1].map(star => ({
      star,
      count: reviews.filter(r => r.rating === star).length,
      pct: total > 0 ? Math.round((reviews.filter(r => r.rating === star).length / total) * 100) : 0
    }));
    return { total, avg, dist };
  }, [reviews]);

  // Upcoming slots for customers
  const upcomingSlots = useMemo(() => {
    const slots = [];
    for (let i = 1; i <= 7; i++) {
      const date = dayjs().add(i, 'day');
      if (date.day() !== 0) {
        const times = ['09:00 AM', '10:30 AM', '02:00 PM', '04:30 PM', '06:00 PM'];
        const available = times.filter(() => Math.random() > 0.35);
        if (available.length > 0) {
          slots.push({ date: date.format('YYYY-MM-DD'), dayLabel: date.format('ddd, MMM D'), times: available });
        }
      }
    }
    return slots;
  }, []);

  // Get status config
  const getStatusConfig = (status) => {
    const configs = {
      upcoming: { color: 'blue', text: 'Upcoming', icon: <CalendarIcon size={12} /> },
      completed: { color: 'green', text: 'Completed', icon: <CheckCircle size={12} /> },
      pending: { color: 'orange', text: 'Pending', icon: <Clock size={12} /> },
      cancelled: { color: 'red', text: 'Cancelled', icon: <XCircle size={12} /> }
    };
    return configs[status] || configs.pending;
  };

  // Table columns
  const columns = [
    {
      title: 'Client',
      dataIndex: 'client',
      key: 'client',
      render: (client) => (
        <div className="client-cell">
          <Avatar src={client.image} size={40} />
          <div className="client-info">
            <Text strong>{client.name}</Text>
            <Text type="secondary" style={{ fontSize: 12 }}>{client.email}</Text>
          </div>
        </div>
      )
    },
    {
      title: 'Date & Time',
      key: 'datetime',
      render: (_, record) => (
        <div>
          <Text strong>{dayjs(record.date).format('MMM D, YYYY')}</Text>
          <br />
          <Text type="secondary">{record.time} ({record.duration} min)</Text>
        </div>
      )
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type) => (
        <Tag icon={type === 'video' ? <Video size={12} /> : <MapPin size={12} />}>
          {type === 'video' ? 'Video Call' : 'In-Person'}
        </Tag>
      )
    },
    {
      title: 'Amount',
      dataIndex: 'price',
      key: 'price',
      render: (price) => (
        <Text strong style={{ color: '#1b4332' }}>₹{price.toLocaleString()}</Text>
      )
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const config = getStatusConfig(status);
        return (
          <Tag color={config.color} icon={config.icon}>
            {config.text}
          </Tag>
        );
      }
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Tooltip title="View Details">
            <Button
              type="text"
              icon={<Eye size={16} />}
              onClick={() => handleViewDetails(record)}
            />
          </Tooltip>
          {record.status === 'pending' && (
            <>
              <Tooltip title="Accept">
                <Button
                  type="text"
                  icon={<CheckCircle size={16} color="#52c41a" />}
                  onClick={() => handleAccept(record)}
                />
              </Tooltip>
              <Tooltip title="Decline">
                <Button
                  type="text"
                  icon={<XCircle size={16} color="#ff4d4f" />}
                  onClick={() => handleDecline(record)}
                />
              </Tooltip>
            </>
          )}
          {record.status === 'upcoming' && record.type === 'video' && (
            <Tooltip title="Start Call">
              <Button
                type="primary"
                size="small"
                icon={<Video size={14} />}
                onClick={() => handleStartCall(record)}
              >
                Join
              </Button>
            </Tooltip>
          )}
        </Space>
      )
    }
  ];

  // Calendar date cell render
  const dateCellRender = (value) => {
    const dateStr = value.format('YYYY-MM-DD');
    const dayConsultations = consultations.filter(c => c.date === dateStr);

    if (dayConsultations.length === 0) return null;

    return (
      <div className="calendar-events">
        {dayConsultations.slice(0, 2).map((c, i) => (
          <div key={i} className={`calendar-event ${c.status}`}>
            {c.time.split(' ')[0]}
          </div>
        ))}
        {dayConsultations.length > 2 && (
          <div className="calendar-more">+{dayConsultations.length - 2} more</div>
        )}
      </div>
    );
  };

  // Tab items
  const tabItems = [
    {
      key: 'overview',
      label: (
        <span className="tab-label">
          <BarChart3 size={16} /> Overview
        </span>
      ),
      children: (
        <div className="overview-tab">
          {/* Stats Cards */}
          <Row gutter={[20, 20]} className="stats-row">
            <Col xs={12} sm={6}>
              <Card className="stat-card">
                <Statistic
                  title="Total Consultations"
                  value={stats.totalConsultations}
                  prefix={<Users size={20} color="#1b4332" />}
                />
              </Card>
            </Col>
            {canSeePrivateData && (
              <Col xs={12} sm={6}>
                <Card className="stat-card earnings">
                  <Statistic
                    title="Total Earnings"
                    value={stats.totalEarnings}
                    prefix={<Wallet size={20} color="#52c41a" />}
                    formatter={(value) => `₹${value.toLocaleString()}`}
                  />
                </Card>
              </Col>
            )}
            <Col xs={12} sm={6}>
              <Card className="stat-card">
                <Statistic
                  title="Upcoming"
                  value={stats.upcoming}
                  prefix={<CalendarIcon size={20} color="#1890ff" />}
                />
              </Card>
            </Col>
            <Col xs={12} sm={6}>
              <Card className="stat-card">
                <Statistic
                  title="Completion Rate"
                  value={stats.completionRate}
                  suffix="%"
                  prefix={<Target size={20} color="#faad14" />}
                />
              </Card>
            </Col>
          </Row>

          {/* Quick Actions & Upcoming */}
          <Row gutter={[20, 20]}>
            <Col xs={24} lg={16}>
              <Card title="Upcoming Consultations" className="upcoming-card">
                {consultations.filter(c => c.status === 'upcoming').length > 0 ? (
                  <List
                    dataSource={consultations.filter(c => c.status === 'upcoming').slice(0, 4)}
                    renderItem={(item) => (
                      <List.Item
                        actions={[
                          item.type === 'video' && (
                            <Button
                              type="primary"
                              size="small"
                              icon={<Video size={14} />}
                              onClick={() => handleStartCall(item)}
                            >
                              Join Call
                            </Button>
                          )
                        ]}
                      >
                        <List.Item.Meta
                          avatar={<Avatar src={item.client.image} size={48} />}
                          title={
                            <div className="list-title">
                              <Text strong>{item.client.name}</Text>
                              <Tag color={item.type === 'video' ? 'blue' : 'green'}>
                                {item.type === 'video' ? 'Video' : 'In-Person'}
                              </Tag>
                            </div>
                          }
                          description={
                            <Space>
                              <CalendarIcon size={14} />
                              <span>{dayjs(item.date).format('MMM D')} at {item.time}</span>
                              <span>• {item.duration} min</span>
                            </Space>
                          }
                        />
                      </List.Item>
                    )}
                  />
                ) : (
                  <Empty description="No upcoming consultations" />
                )}
              </Card>
            </Col>

            <Col xs={24} lg={8}>
              <Card title="Pending Requests" className="pending-card">
                <Badge count={stats.pending} offset={[10, 0]}>
                  <div className="pending-header" />
                </Badge>
                {consultations.filter(c => c.status === 'pending').length > 0 ? (
                  <List
                    size="small"
                    dataSource={consultations.filter(c => c.status === 'pending').slice(0, 3)}
                    renderItem={(item) => (
                      <List.Item
                        actions={[
                          <Button size="small" type="primary" onClick={() => handleAccept(item)}>
                            Accept
                          </Button>,
                          <Button size="small" onClick={() => handleDecline(item)}>
                            Decline
                          </Button>
                        ]}
                      >
                        <List.Item.Meta
                          avatar={<Avatar src={item.client.image} />}
                          title={item.client.name}
                          description={`${dayjs(item.date).format('MMM D')} • ${item.time}`}
                        />
                      </List.Item>
                    )}
                  />
                ) : (
                  <Empty description="No pending requests" image={Empty.PRESENTED_IMAGE_SIMPLE} />
                )}
              </Card>
            </Col>
          </Row>

          {/* Performance */}
          <Row gutter={[20, 20]} style={{ marginTop: 20 }}>
            <Col xs={24}>
              <Card title="Performance Overview" className="performance-card">
                <Row gutter={[40, 20]}>
                  <Col xs={24} md={8}>
                    <div className="performance-item">
                      <div className="performance-label">
                        <Star size={16} fill="#faad14" color="#faad14" />
                        <span>Average Rating</span>
                      </div>
                      <div className="performance-value">
                        <span className="big-number">{trainer.rating}</span>
                        <span className="small-text">/ 5.0</span>
                      </div>
                      <Progress
                        percent={trainer.rating * 20}
                        showInfo={false}
                        strokeColor="#faad14"
                      />
                    </div>
                  </Col>
                  <Col xs={24} md={8}>
                    <div className="performance-item">
                      <div className="performance-label">
                        <CheckCircle size={16} color="#52c41a" />
                        <span>Completion Rate</span>
                      </div>
                      <div className="performance-value">
                        <span className="big-number">{stats.completionRate}%</span>
                      </div>
                      <Progress
                        percent={stats.completionRate}
                        showInfo={false}
                        strokeColor="#52c41a"
                      />
                    </div>
                  </Col>
                  <Col xs={24} md={8}>
                    <div className="performance-item">
                      <div className="performance-label">
                        <TrendingUp size={16} color="#1890ff" />
                        <span>Response Rate</span>
                      </div>
                      <div className="performance-value">
                        <span className="big-number">95%</span>
                      </div>
                      <Progress
                        percent={95}
                        showInfo={false}
                        strokeColor="#1890ff"
                      />
                    </div>
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>
        </div>
      )
    },
    {
      key: 'consultations',
      label: (
        <span className="tab-label">
          <CalendarIcon size={16} /> Consultations
        </span>
      ),
      children: (
        <Card className="consultations-table-card">
          <Table
            columns={columns}
            dataSource={consultations}
            rowKey="id"
            pagination={{ pageSize: 8 }}
            className="consultations-table"
          />
        </Card>
      )
    },
    {
      key: 'calendar',
      label: (
        <span className="tab-label">
          <CalendarIcon size={16} /> Calendar
        </span>
      ),
      children: (
        <Card className="calendar-card">
          <Calendar cellRender={dateCellRender} />
        </Card>
      )
    },
    {
      key: 'clients',
      label: (
        <span className="tab-label">
          <Users size={16} /> Clients
        </span>
      ),
      children: (
        <Card className="clients-card">
          <Row gutter={[20, 20]}>
            {Array.from(new Set(consultations.map(c => c.client.email))).map((email, index) => {
              const client = consultations.find(c => c.client.email === email).client;
              const clientConsultations = consultations.filter(c => c.client.email === email);
              const completed = clientConsultations.filter(c => c.status === 'completed').length;

              return (
                <Col xs={24} sm={12} md={8} lg={6} key={email}>
                  <Card className="client-card" hoverable>
                    <div className="client-card-content">
                      <Avatar src={client.image} size={64} />
                      <Title level={5} style={{ marginTop: 12, marginBottom: 4 }}>
                        {client.name}
                      </Title>
                      <Text type="secondary" style={{ fontSize: 12 }}>{client.email}</Text>
                      <Divider style={{ margin: '12px 0' }} />
                      <div className="client-stats">
                        <div className="client-stat">
                          <Text type="secondary">Sessions</Text>
                          <Text strong>{clientConsultations.length}</Text>
                        </div>
                        <div className="client-stat">
                          <Text type="secondary">Completed</Text>
                          <Text strong style={{ color: '#52c41a' }}>{completed}</Text>
                        </div>
                      </div>
                      <Button
                        type="primary"
                        ghost
                        icon={<MessageSquare size={14} />}
                        style={{ marginTop: 12, width: '100%' }}
                      >
                        Message
                      </Button>
                    </div>
                  </Card>
                </Col>
              );
            })}
          </Row>
        </Card>
      )
    }
  ];

  // ─── CUSTOMER-FACING VIEW ───
  if (!canSeePrivateData) {
    return (
      <div className="trainer-consultation-page">
        <div className="trainer-dashboard-container">
          {/* Back Button */}
          <Button
            type="text"
            icon={<ArrowLeft size={20} />}
            onClick={() => navigate(-1)}
            className="back-btn"
            style={{ marginBottom: 16, color: '#1b4332' }}
          />

          {/* Hero Profile Card */}
          <div className="tc-hero-card">
            <div className="tc-hero-gradient" />
            <div className="tc-hero-content">
              <div className="tc-hero-left">
                <Avatar size={110} src={trainer.image} className="tc-hero-avatar" />
                <div className="tc-hero-info">
                  <div className="tc-hero-name-row">
                    <Title level={2} style={{ margin: 0, color: '#1b4332' }}>{trainer.name}</Title>
                    {trainer.isTopRated && (
                      <Tag color="gold" style={{ borderRadius: 20, fontWeight: 600, fontSize: 12 }}>
                        <Sparkles size={12} /> Top Rated
                      </Tag>
                    )}
                  </div>
                  <Tag color={getCategoryColor(trainer.category)} style={{ borderRadius: 20, fontSize: 13, padding: '2px 14px', marginTop: 4 }}>
                    {getCategoryLabel(trainer.category)}
                  </Tag>
                  <Text style={{ fontSize: 15, color: '#555', marginTop: 4, display: 'block' }}>
                    {trainer.specialization}
                  </Text>
                </div>
              </div>
              <div className="tc-hero-actions">
                <Button
                  type="primary"
                  size="large"
                  icon={<CalendarIcon size={18} />}
                  className="tc-book-btn"
                  onClick={() => navigate(`/book/${trainerId}`)}
                >
                  Book Consultation
                </Button>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <Row gutter={[16, 16]} style={{ marginBottom: 28 }}>
            <Col xs={12} sm={6}>
              <div className="tc-quick-stat">
                <div className="tc-qs-icon" style={{ background: 'linear-gradient(135deg, #fff7e6, #ffe0b2)' }}>
                  <Star size={22} fill="#faad14" color="#faad14" />
                </div>
                <div>
                  <Text className="tc-qs-value">{trainer.rating}</Text>
                  <Text className="tc-qs-label">Rating</Text>
                </div>
              </div>
            </Col>
            <Col xs={12} sm={6}>
              <div className="tc-quick-stat">
                <div className="tc-qs-icon" style={{ background: 'linear-gradient(135deg, #e6f7ff, #b3e0ff)' }}>
                  <MessageSquare size={22} color="#1890ff" />
                </div>
                <div>
                  <Text className="tc-qs-value">{reviewStats.total}</Text>
                  <Text className="tc-qs-label">Reviews</Text>
                </div>
              </div>
            </Col>
            <Col xs={12} sm={6}>
              <div className="tc-quick-stat">
                <div className="tc-qs-icon" style={{ background: 'linear-gradient(135deg, #f0fdf4, #bbf7d0)' }}>
                  <Briefcase size={22} color="#2d6a4f" />
                </div>
                <div>
                  <Text className="tc-qs-value">{trainer.experience}+</Text>
                  <Text className="tc-qs-label">Years Exp</Text>
                </div>
              </div>
            </Col>
            <Col xs={12} sm={6}>
              <div className="tc-quick-stat">
                <div className="tc-qs-icon" style={{ background: 'linear-gradient(135deg, #faf5ff, #e9d5ff)' }}>
                  <IndianRupee size={22} color="#7c3aed" />
                </div>
                <div>
                  <Text className="tc-qs-value">{trainer.price?.toLocaleString()}</Text>
                  <Text className="tc-qs-label">Per Session</Text>
                </div>
              </div>
            </Col>
          </Row>

          <Row gutter={[24, 24]}>
            {/* LEFT Column */}
            <Col xs={24} lg={16}>
              {/* About Section */}
              <Card className="tc-section-card" style={{ marginBottom: 24 }}>
                <div className="tc-section-header">
                  <GraduationCap size={22} color="#2d6a4f" />
                  <Title level={4} style={{ margin: 0, color: '#1b4332' }}>About the Trainer</Title>
                </div>
                <Paragraph style={{ fontSize: 15, lineHeight: 1.8, color: '#444', margin: 0 }}>
                  {trainer.name} is an experienced {getCategoryLabel(trainer.category)?.toLowerCase()} with {trainer.experience}+ years of expertise in {trainer.specialization?.toLowerCase() || 'health and wellness'}.
                  Dedicated to helping clients achieve their fitness goals through personalized plans, evidence-based methods, and consistent guidance.
                  Known for a supportive coaching style that motivates clients to push beyond their limits while maintaining safety and proper form.
                </Paragraph>
                <Divider style={{ margin: '16px 0' }} />
                <Row gutter={[16, 12]}>
                  <Col xs={24} sm={8}>
                    <div className="tc-detail-item">
                      <Globe size={16} color="#1890ff" />
                      <div>
                        <Text type="secondary" style={{ fontSize: 12 }}>Languages</Text>
                        <Text strong style={{ display: 'block', fontSize: 13 }}>Hindi, English</Text>
                      </div>
                    </div>
                  </Col>
                  <Col xs={24} sm={8}>
                    <div className="tc-detail-item">
                      <Video size={16} color="#52c41a" />
                      <div>
                        <Text type="secondary" style={{ fontSize: 12 }}>Session Mode</Text>
                        <Text strong style={{ display: 'block', fontSize: 13 }}>Video & In-Person</Text>
                      </div>
                    </div>
                  </Col>
                  <Col xs={24} sm={8}>
                    <div className="tc-detail-item">
                      <Clock size={16} color="#faad14" />
                      <div>
                        <Text type="secondary" style={{ fontSize: 12 }}>Session Duration</Text>
                        <Text strong style={{ display: 'block', fontSize: 13 }}>30 - 60 min</Text>
                      </div>
                    </div>
                  </Col>
                </Row>
              </Card>

              {/* Reviews Section */}
              <Card className="tc-section-card" style={{ marginBottom: 24 }}>
                <div className="tc-section-header">
                  <Star size={22} color="#faad14" fill="#faad14" />
                  <Title level={4} style={{ margin: 0, color: '#1b4332' }}>Reviews & Ratings</Title>
                </div>

                {/* Rating Summary */}
                <div className="tc-rating-summary">
                  <div className="tc-rating-big">
                    <Text className="tc-rating-number">{reviewStats.avg}</Text>
                    <Rate disabled value={parseFloat(reviewStats.avg)} allowHalf style={{ fontSize: 18 }} />
                    <Text type="secondary" style={{ fontSize: 13 }}>{reviewStats.total} reviews</Text>
                  </div>
                  <div className="tc-rating-bars">
                    {reviewStats.dist.map(d => (
                      <div key={d.star} className="tc-rating-bar-row">
                        <Text style={{ width: 18, fontSize: 13 }}>{d.star}</Text>
                        <Star size={13} fill="#faad14" color="#faad14" />
                        <div className="tc-bar-track">
                          <div className="tc-bar-fill" style={{ width: `${d.pct}%` }} />
                        </div>
                        <Text type="secondary" style={{ width: 30, textAlign: 'right', fontSize: 12 }}>{d.count}</Text>
                      </div>
                    ))}
                  </div>
                </div>

                <Divider />

                {/* Write Review */}
                <div className="tc-write-review">
                  <Title level={5} style={{ color: '#1b4332', margin: '0 0 12px 0' }}>
                    <Edit3 size={16} style={{ marginRight: 8 }} />
                    Write a Review
                  </Title>
                  <div className="tc-review-form">
                    <div className="tc-review-rating-select">
                      <Text style={{ marginRight: 8, fontSize: 14 }}>Your Rating:</Text>
                      <Rate value={reviewRating} onChange={setReviewRating} style={{ fontSize: 22 }} />
                    </div>
                    <TextArea
                      rows={3}
                      placeholder="Share your experience with this trainer..."
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      maxLength={500}
                      showCount
                      style={{ borderRadius: 12, fontSize: 14 }}
                    />
                    <Button
                      type="primary"
                      icon={<Send size={16} />}
                      onClick={handleSubmitReview}
                      style={{
                        background: '#2d6a4f',
                        borderColor: '#2d6a4f',
                        borderRadius: 10,
                        height: 42,
                        fontWeight: 600,
                        marginTop: 8
                      }}
                    >
                      Submit Review
                    </Button>
                  </div>
                </div>

                <Divider />

                {/* Review List */}
                <div className="tc-review-list">
                  {reviews.map(review => (
                    <div key={review.id} className="tc-review-item">
                      <div className="tc-review-header">
                        <Avatar src={review.avatar} size={44} />
                        <div className="tc-review-meta">
                          <Text strong style={{ fontSize: 15 }}>{review.name}</Text>
                          <div className="tc-review-meta-row">
                            <Rate disabled value={review.rating} style={{ fontSize: 13 }} />
                            <Text type="secondary" style={{ fontSize: 12 }}>
                              {dayjs(review.date).format('MMM D, YYYY')}
                            </Text>
                          </div>
                        </div>
                      </div>
                      <Paragraph style={{ margin: '10px 0 8px', fontSize: 14, color: '#444', lineHeight: 1.7 }}>
                        {review.comment}
                      </Paragraph>
                      <Button
                        type="text"
                        size="small"
                        icon={<ThumbsUp size={14} color={helpfulIds.includes(review.id) ? '#2d6a4f' : '#999'} />}
                        onClick={() => handleHelpful(review.id)}
                        style={{ color: helpfulIds.includes(review.id) ? '#2d6a4f' : '#999', fontSize: 12, padding: '0 8px' }}
                      >
                        Helpful ({review.helpful})
                      </Button>
                    </div>
                  ))}
                </div>
              </Card>
            </Col>

            {/* RIGHT Column - Sidebar */}
            <Col xs={24} lg={8}>
              {/* Upcoming Slots */}
              <Card className="tc-section-card tc-sidebar-card" style={{ marginBottom: 20 }}>
                <div className="tc-section-header">
                  <CalendarIcon size={22} color="#1890ff" />
                  <Title level={5} style={{ margin: 0, color: '#1b4332' }}>Available Slots</Title>
                </div>
                <div className="tc-slots-list">
                  {upcomingSlots.map((slot, idx) => (
                    <div key={idx} className="tc-slot-day">
                      <div className="tc-slot-date">
                        <CalendarIcon size={14} color="#2d6a4f" />
                        <Text strong style={{ fontSize: 13, color: '#1b4332' }}>{slot.dayLabel}</Text>
                      </div>
                      <div className="tc-slot-times">
                        {slot.times.map((time, ti) => (
                          <Tag
                            key={ti}
                            className="tc-slot-tag"
                            onClick={() => navigate(`/book/${trainerId}`)}
                          >
                            <Clock size={11} /> {time}
                          </Tag>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <Button
                  type="primary"
                  block
                  icon={<CalendarIcon size={16} />}
                  style={{
                    background: '#2d6a4f',
                    borderColor: '#2d6a4f',
                    borderRadius: 10,
                    height: 42,
                    fontWeight: 600,
                    marginTop: 12
                  }}
                  onClick={() => navigate(`/book/${trainerId}`)}
                >
                  Book a Slot
                </Button>
              </Card>

              {/* Specializations */}
              <Card className="tc-section-card tc-sidebar-card" style={{ marginBottom: 20 }}>
                <div className="tc-section-header">
                  <Zap size={20} color="#faad14" />
                  <Title level={5} style={{ margin: 0, color: '#1b4332' }}>Specializations</Title>
                </div>
                <div className="tc-spec-tags">
                  {(trainer.specialization || 'Fitness,Wellness').split(',').map((s, i) => (
                    <Tag key={i} className="tc-spec-tag">
                      {s.trim()}
                    </Tag>
                  ))}
                  <Tag className="tc-spec-tag">{getCategoryLabel(trainer.category)}</Tag>
                  <Tag className="tc-spec-tag">Weight Management</Tag>
                  <Tag className="tc-spec-tag">Lifestyle Coaching</Tag>
                </div>
              </Card>

              {/* Quick Contact */}
              <Card className="tc-section-card tc-sidebar-card">
                <div className="tc-section-header">
                  <Heart size={20} color="#ff4d6a" />
                  <Title level={5} style={{ margin: 0, color: '#1b4332' }}>Why Choose {trainer.name?.split(' ')[0]}?</Title>
                </div>
                <div className="tc-why-list">
                  <div className="tc-why-item">
                    <CheckCircle size={16} color="#52c41a" />
                    <Text style={{ fontSize: 13 }}>Personalized workout & diet plans</Text>
                  </div>
                  <div className="tc-why-item">
                    <CheckCircle size={16} color="#52c41a" />
                    <Text style={{ fontSize: 13 }}>Regular progress tracking</Text>
                  </div>
                  <div className="tc-why-item">
                    <CheckCircle size={16} color="#52c41a" />
                    <Text style={{ fontSize: 13 }}>Video & in-person sessions available</Text>
                  </div>
                  <div className="tc-why-item">
                    <CheckCircle size={16} color="#52c41a" />
                    <Text style={{ fontSize: 13 }}>Flexible scheduling</Text>
                  </div>
                  <div className="tc-why-item">
                    <CheckCircle size={16} color="#52c41a" />
                    <Text style={{ fontSize: 13 }}>{trainer.experience}+ years of experience</Text>
                  </div>
                </div>
              </Card>
            </Col>
          </Row>
        </div>
      </div>
    );
  }

  // ─── OWNER / ADMIN DASHBOARD VIEW ───
  return (
    <div className="trainer-consultation-page">
      <div className="trainer-dashboard-container">
        {/* Header */}
        <div className="dashboard-header">
          <Button
            type="text"
            icon={<ArrowLeft size={20} />}
            onClick={() => navigate(-1)}
            className="back-btn"
          />
          <div className="header-content">
            <Title level={3} style={{ margin: 0 }}>Consultation Dashboard</Title>
            <Text type="secondary">Manage your consultations and clients</Text>
          </div>
          <Space>
            <Button icon={<Bell size={18} />} className="notification-btn">
              <Badge count={stats.pending} size="small" />
            </Button>
            <Button
              icon={<Settings size={18} />}
              onClick={() => setIsSettingsModalOpen(true)}
            >
              Settings
            </Button>
          </Space>
        </div>

        {/* Trainer Profile Summary */}
        <Card className="trainer-profile-card">
          <Row gutter={[24, 16]} align="middle">
            <Col xs={24} md={8}>
              <div className="profile-left">
                <Avatar size={80} src={trainer.image} />
                <div className="profile-info">
                  <div className="name-row">
                    <Title level={4} style={{ margin: 0 }}>{trainer.name}</Title>
                    {trainer.isTopRated && (
                      <Tag color="gold"><Sparkles size={12} /> Top Rated</Tag>
                    )}
                  </div>
                  <Tag color={getCategoryColor(trainer.category)}>
                    {getCategoryLabel(trainer.category)}
                  </Tag>
                  <Text type="secondary">{trainer.specialization}</Text>
                </div>
              </div>
            </Col>
            <Col xs={24} md={16}>
              <Row gutter={[16, 16]}>
                <Col xs={8}>
                  <div className="profile-stat">
                    <Star size={18} fill="#faad14" color="#faad14" />
                    <div>
                      <Text strong style={{ fontSize: 18 }}>{trainer.rating}</Text>
                      <Text type="secondary" style={{ display: 'block', fontSize: 12 }}>
                        {trainer.reviewCount} reviews
                      </Text>
                    </div>
                  </div>
                </Col>
                <Col xs={8}>
                  <div className="profile-stat">
                    <Clock size={18} color="#1b4332" />
                    <div>
                      <Text strong style={{ fontSize: 18 }}>{trainer.experience}</Text>
                      <Text type="secondary" style={{ display: 'block', fontSize: 12 }}>
                        Years Exp
                      </Text>
                    </div>
                  </div>
                </Col>
                <Col xs={8}>
                  <div className="profile-stat">
                    <IndianRupee size={18} color="#52c41a" />
                    <div>
                      <Text strong style={{ fontSize: 18 }}>₹{trainer.price.toLocaleString()}</Text>
                      <Text type="secondary" style={{ display: 'block', fontSize: 12 }}>
                        per session
                      </Text>
                    </div>
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
        </Card>

        {/* Admin Controls for Registered Trainers */}
        {adminLoggedIn && trainer.isRegistered && (() => {
          const rawTrainer = registeredTrainers.find(t => `reg_${t.id}` === trainer.id);
          if (!rawTrainer) return null;
          return (
            <Card
              size="small"
              style={{
                marginBottom: 20,
                borderRadius: 16,
                background: rawTrainer.status === 'verified' ? '#f6ffed' : '#fff7e6',
                border: `1px solid ${rawTrainer.status === 'verified' ? '#b7eb8f' : '#ffd591'}`
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                <Space>
                  <ShieldCheck size={18} color="#cf1322" />
                  <Text strong>Admin Controls</Text>
                  <Tag color={rawTrainer.status === 'verified' ? 'green' : rawTrainer.status === 'rejected' ? 'red' : 'orange'}>
                    {rawTrainer.status === 'verified' ? 'Verified' : rawTrainer.status === 'rejected' ? 'Rejected' : 'Pending'}
                  </Tag>
                </Space>
                <Space>
                  {rawTrainer.status !== 'verified' && (
                    <Button
                      type="primary"
                      size="small"
                      icon={<CheckCircle size={14} />}
                      style={{ background: '#2d6a4f', borderColor: '#2d6a4f' }}
                      onClick={() => {
                        Modal.confirm({
                          title: 'Approve Trainer',
                          content: `Are you sure you want to verify "${trainer.name}"?`,
                          okText: 'Yes, Approve',
                          okButtonProps: { style: { background: '#2d6a4f', borderColor: '#2d6a4f' } },
                          onOk: () => {
                            verifyTrainer(rawTrainer.id);
                            message.success(`${trainer.name} has been verified!`);
                          }
                        });
                      }}
                    >
                      Approve
                    </Button>
                  )}
                  {rawTrainer.status !== 'rejected' && rawTrainer.status !== 'verified' && (
                    <Button
                      size="small"
                      danger
                      icon={<XCircle size={14} />}
                      onClick={() => {
                        Modal.confirm({
                          title: 'Reject Trainer',
                          content: `Are you sure you want to reject "${trainer.name}"?`,
                          okText: 'Yes, Reject',
                          okButtonProps: { danger: true },
                          onOk: () => {
                            rejectTrainer(rawTrainer.id, 'Rejected by admin from profile page');
                            message.success(`${trainer.name} has been rejected`);
                          }
                        });
                      }}
                    >
                      Reject
                    </Button>
                  )}
                  {rawTrainer.status === 'verified' && (
                    <Button
                      size="small"
                      danger
                      icon={<XCircle size={14} />}
                      onClick={() => {
                        Modal.confirm({
                          title: 'Revoke Verification',
                          content: `Are you sure you want to revoke verification for "${trainer.name}"?`,
                          okText: 'Yes, Revoke',
                          okButtonProps: { danger: true },
                          onOk: () => {
                            rejectTrainer(rawTrainer.id, 'Verification revoked by admin');
                            message.success(`${trainer.name}'s verification has been revoked`);
                          }
                        });
                      }}
                    >
                      Revoke
                    </Button>
                  )}
                  <Button
                    size="small"
                    icon={<ArrowLeft size={14} />}
                    onClick={() => navigate('/admin')}
                  >
                    Back to Admin
                  </Button>
                </Space>
              </div>
            </Card>
          );
        })()}

        {/* Tabs */}
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={tabItems}
          className="dashboard-tabs"
        />
      </div>

      {/* Consultation Detail Modal */}
      <Modal
        title="Consultation Details"
        open={isDetailModalOpen}
        onCancel={() => setIsDetailModalOpen(false)}
        footer={null}
        width={600}
        className="consultation-detail-modal"
      >
        {selectedConsultation && (
          <div className="detail-content">
            <div className="detail-client">
              <Avatar src={selectedConsultation.client.image} size={64} />
              <div>
                <Title level={4} style={{ margin: 0 }}>{selectedConsultation.client.name}</Title>
                <Space direction="vertical" size={2}>
                  <Text><Mail size={14} /> {selectedConsultation.client.email}</Text>
                  <Text><Phone size={14} /> {selectedConsultation.client.phone}</Text>
                </Space>
              </div>
            </div>

            <Divider />

            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Text type="secondary">Date</Text>
                <br />
                <Text strong>{dayjs(selectedConsultation.date).format('MMMM D, YYYY')}</Text>
              </Col>
              <Col span={12}>
                <Text type="secondary">Time</Text>
                <br />
                <Text strong>{selectedConsultation.time} ({selectedConsultation.duration} min)</Text>
              </Col>
              <Col span={12}>
                <Text type="secondary">Type</Text>
                <br />
                <Tag icon={selectedConsultation.type === 'video' ? <Video size={12} /> : <MapPin size={12} />}>
                  {selectedConsultation.type === 'video' ? 'Video Call' : 'In-Person'}
                </Tag>
              </Col>
              <Col span={12}>
                <Text type="secondary">Amount</Text>
                <br />
                <Text strong style={{ color: '#1b4332', fontSize: 18 }}>
                  ₹{selectedConsultation.price.toLocaleString()}
                </Text>
              </Col>
            </Row>

            <Divider />

            <div className="detail-section">
              <Text type="secondary">Client's Concerns</Text>
              <Paragraph style={{ marginTop: 8 }}>
                {selectedConsultation.concerns}
              </Paragraph>
            </div>

            {selectedConsultation.notes && (
              <div className="detail-section">
                <Text type="secondary">Session Notes</Text>
                <Paragraph style={{ marginTop: 8 }}>
                  {selectedConsultation.notes}
                </Paragraph>
              </div>
            )}

            <Divider />

            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              {selectedConsultation.status === 'upcoming' && selectedConsultation.type === 'video' && (
                <Button type="primary" icon={<Video size={16} />}>
                  Start Video Call
                </Button>
              )}
              <Button icon={<MessageSquare size={16} />}>
                Message Client
              </Button>
            </Space>
          </div>
        )}
      </Modal>

      {/* Settings Modal */}
      <Modal
        title="Availability Settings"
        open={isSettingsModalOpen}
        onCancel={() => setIsSettingsModalOpen(false)}
        onOk={() => {
          message.success('Settings saved!');
          setIsSettingsModalOpen(false);
        }}
        width={500}
      >
        <Form layout="vertical">
          <Form.Item label="Accepting New Consultations">
            <Switch defaultChecked />
          </Form.Item>
          <Form.Item label="Video Consultations">
            <Switch defaultChecked />
          </Form.Item>
          <Form.Item label="In-Person Consultations">
            <Switch defaultChecked />
          </Form.Item>
          <Divider />
          <Form.Item label="Working Hours">
            <Space>
              <TimePicker defaultValue={dayjs('09:00', 'HH:mm')} format="HH:mm" />
              <Text>to</Text>
              <TimePicker defaultValue={dayjs('18:00', 'HH:mm')} format="HH:mm" />
            </Space>
          </Form.Item>
          <Form.Item label="Session Duration Options">
            <Space>
              <Tag>30 min</Tag>
              <Tag>45 min</Tag>
              <Tag>60 min</Tag>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default TrainerConsultationPage;
