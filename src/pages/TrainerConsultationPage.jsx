import React, { useState, useMemo } from 'react';
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
  Space
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
  Wallet
} from 'lucide-react';
import { TRAINER_DATA, getCategoryColor, getCategoryLabel } from '../data/trainerData';
import dayjs from 'dayjs';
import './TrainerConsultationPage.css';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

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
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedConsultation, setSelectedConsultation] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  // Get trainer data
  const trainer = useMemo(() => {
    const id = parseInt(trainerId);
    return TRAINER_DATA.find(t => t.id === id) || TRAINER_DATA[0];
  }, [trainerId]);

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
