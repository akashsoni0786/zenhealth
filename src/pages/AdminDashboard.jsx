import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Card,
  Row,
  Col,
  Typography,
  Button,
  Input,
  Form,
  Tag,
  Tabs,
  Badge,
  Statistic,
  Modal,
  Alert,
  Empty,
  Timeline,
  Space,
  Divider,
  Select,
  InputNumber,
  Switch,
  message
} from 'antd';
import {
  ShieldCheck,
  Mail,
  Lock,
  LogOut,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  User,
  Phone,
  Briefcase,
  Award,
  IndianRupee,
  CalendarDays,
  FileText,
  Eye,
  MapPin,
  RotateCcw,
  AlertTriangle,
  ExternalLink,
  Star,
  EyeOff,
  Edit3,
  Undo2,
  ImageIcon,
  Landmark,
  CreditCard
} from 'lucide-react';
import { useTrainerAuth } from '../context/TrainerAuthContext';
import { TRAINER_DATA, getCategoryColor, getCategoryLabel } from '../data/trainerData';
import './AdminDashboard.css';

const { Title, Text } = Typography;
const { TextArea } = Input;

// ─── Status Configuration ───
const STATUS_COLORS = {
  pending: 'orange',
  pending_review: 'blue',
  verified: 'green',
  rejected: 'red',
  resubmit: 'gold'
};

const STATUS_LABELS = {
  pending: 'Pending',
  pending_review: 'Under Review',
  verified: 'Verified',
  rejected: 'Rejected',
  resubmit: 'Resubmission'
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const {
    registeredTrainers,
    adminLoggedIn,
    adminLogin,
    adminLogout,
    verifyTrainer,
    rejectTrainer,
    requestResubmission,
    verifyBankDetails,
    rejectBankDetails,
    hiddenTrainers,
    hideTrainer,
    restoreTrainer,
    updateRegisteredTrainer,
    trainerEdits,
    updateStaticTrainer,
    resetStaticTrainer
  } = useTrainerAuth();

  // ─── Local State ───
  const [loginForm] = Form.useForm();
  const [editForm] = Form.useForm();
  const [loginLoading, setLoginLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [resubmitModalOpen, setResubmitModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingTrainer, setEditingTrainer] = useState(null);
  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [resubmitRemarks, setResubmitRemarks] = useState('');
  const [bankRejectModalOpen, setBankRejectModalOpen] = useState(false);
  const [bankRejectReason, setBankRejectReason] = useState('');

  // ─── Stats ───
  const stats = useMemo(() => {
    const total = registeredTrainers.length;
    const pending = registeredTrainers.filter(t => t.status === 'pending' || t.status === 'pending_review').length;
    const verified = registeredTrainers.filter(t => t.status === 'verified').length;
    const rejected = registeredTrainers.filter(t => t.status === 'rejected').length;
    const resubmit = registeredTrainers.filter(t => t.status === 'resubmit').length;
    return { total, pending, verified, rejected, resubmit };
  }, [registeredTrainers]);

  // ─── Filtered Trainers ───
  const filteredTrainers = useMemo(() => {
    if (activeFilter === 'all') return registeredTrainers;
    if (activeFilter === 'pending') return registeredTrainers.filter(t => t.status === 'pending' || t.status === 'pending_review');
    return registeredTrainers.filter(t => t.status === activeFilter);
  }, [registeredTrainers, activeFilter]);

  // ─── Login Handler ───
  const handleLogin = async (values) => {
    setLoginLoading(true);
    setTimeout(() => {
      const result = adminLogin(values.email, values.password);
      if (result.error) {
        message.error(result.error);
      } else {
        message.success('Welcome to Admin Dashboard!');
      }
      setLoginLoading(false);
    }, 600);
  };

  // ─── Logout Handler ───
  const handleLogout = () => {
    adminLogout();
    message.info('Logged out successfully');
  };

  // ─── Approve Trainer ───
  const handleApprove = (trainer) => {
    Modal.confirm({
      title: 'Approve Trainer',
      content: `Are you sure you want to verify "${trainer.name}"? They will be visible on the platform.`,
      okText: 'Yes, Approve',
      okButtonProps: { style: { background: '#2d6a4f', borderColor: '#2d6a4f' } },
      onOk: () => {
        verifyTrainer(trainer.id);
        message.success(`${trainer.name} has been verified successfully!`);
      }
    });
  };

  // ─── Open Reject Modal ───
  const openRejectModal = (trainer) => {
    setSelectedTrainer(trainer);
    setRejectReason('');
    setRejectModalOpen(true);
  };

  // ─── Confirm Reject ───
  const handleConfirmReject = () => {
    if (!rejectReason.trim()) {
      message.warning('Please provide a reason for rejection');
      return;
    }
    rejectTrainer(selectedTrainer.id, rejectReason.trim());
    message.success(`${selectedTrainer.name} has been rejected`);
    setRejectModalOpen(false);
    setSelectedTrainer(null);
    setRejectReason('');
  };

  // ─── Open Resubmit Modal ───
  const openResubmitModal = (trainer) => {
    setSelectedTrainer(trainer);
    setResubmitRemarks('');
    setResubmitModalOpen(true);
  };

  // ─── Confirm Resubmit ───
  const handleConfirmResubmit = () => {
    if (!resubmitRemarks.trim()) {
      message.warning('Please provide remarks for the trainer');
      return;
    }
    requestResubmission(selectedTrainer.id, resubmitRemarks.trim());
    message.success(`Resubmission request sent to ${selectedTrainer.name}`);
    setResubmitModalOpen(false);
    setSelectedTrainer(null);
    setResubmitRemarks('');
  };

  // ─── Open Detail Modal ───
  const openDetailModal = (trainer) => {
    setSelectedTrainer(trainer);
    setDetailModalOpen(true);
  };

  // ─── Open Edit Modal for Static or Registered Trainer ───
  const openEditModal = (trainer, isRegistered = false) => {
    if (isRegistered) {
      const profile = trainer.profile || {};
      setEditingTrainer({ ...trainer, _isRegistered: true });
      editForm.setFieldsValue({
        name: trainer.name,
        specialization: profile.specialization || '',
        experience: profile.experience ? Number(profile.experience) : undefined,
        price: profile.consultationFee ? Number(profile.consultationFee) : undefined,
        rating: 4.5,
        bio: profile.bio || '',
        category: trainer.category,
        reviewCount: 0,
        availability: 'available',
        image: profile.photoUrl || '',
        isTopRated: false,
        certifications: (profile.certifications || []).join(', '),
        phone: trainer.phone || profile.phone || '',
        location: profile.location || '',
        qualification: profile.qualification || ''
      });
    } else {
      const edits = trainerEdits[trainer.id] || {};
      const merged = { ...trainer, ...edits };
      setEditingTrainer({ ...trainer, _isRegistered: false });
      editForm.setFieldsValue({
        name: merged.name,
        specialization: merged.specialization,
        experience: merged.experience,
        price: merged.price,
        rating: merged.rating,
        bio: merged.bio,
        category: merged.category,
        reviewCount: merged.reviewCount,
        availability: merged.availability,
        image: merged.image,
        isTopRated: merged.isTopRated,
        certifications: (merged.certifications || []).join(', ')
      });
    }
    setEditModalOpen(true);
  };

  // ─── Save Edit ───
  const handleEditSave = () => {
    editForm.validateFields().then(values => {
      const saveData = { ...values };
      // Convert certifications string to array
      if (typeof saveData.certifications === 'string') {
        saveData.certifications = saveData.certifications
          .split(',')
          .map(c => c.trim())
          .filter(Boolean);
      }

      if (editingTrainer._isRegistered) {
        // Save registered trainer edits
        updateRegisteredTrainer(editingTrainer.id, {
          name: saveData.name,
          category: saveData.category,
          phone: saveData.phone,
          profile: {
            name: saveData.name,
            specialization: saveData.specialization,
            experience: saveData.experience,
            consultationFee: saveData.price,
            bio: saveData.bio,
            photoUrl: saveData.image,
            certifications: saveData.certifications,
            location: saveData.location,
            qualification: saveData.qualification,
            phone: saveData.phone
          }
        });
      } else {
        updateStaticTrainer(editingTrainer.id, saveData);
      }
      message.success(`${values.name || editingTrainer.name} updated successfully!`);
      setEditModalOpen(false);
      setEditingTrainer(null);
    });
  };

  // ─── Format Date ───
  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // ═══════════════════════════════════════════════════════════
  // LOGIN GATE
  // ═══════════════════════════════════════════════════════════
  if (!adminLoggedIn) {
    return (
      <div className="admin-page">
        <div className="admin-container">
          <div className="admin-login-wrapper">
            <Card className="admin-login-card">
              <div className="admin-login-header">
                <div className="admin-login-icon">
                  <ShieldCheck size={36} color="#fff" />
                </div>
                <Title level={3}>Admin Panel</Title>
                <Text type="secondary">Sign in to manage trainer applications</Text>
              </div>

              <Alert
                message="Demo Credentials"
                description={
                  <span>
                    Email: <Text code>admin@stayfit.com</Text> | Password: <Text code>admin</Text>
                  </span>
                }
                type="info"
                showIcon
                style={{ marginBottom: 24, borderRadius: 10 }}
              />

              <Form
                form={loginForm}
                layout="vertical"
                onFinish={handleLogin}
                requiredMark={false}
              >
                <Form.Item
                  name="email"
                  label="Email"
                  rules={[{ required: true, message: 'Please enter your email' }]}
                >
                  <Input
                    prefix={<Mail size={16} color="#722ed1" />}
                    placeholder="admin@stayfit.com"
                    size="large"
                  />
                </Form.Item>

                <Form.Item
                  name="password"
                  label="Password"
                  rules={[{ required: true, message: 'Please enter your password' }]}
                >
                  <Input.Password
                    prefix={<Lock size={16} color="#722ed1" />}
                    placeholder="Enter password"
                    size="large"
                  />
                </Form.Item>

                <Form.Item style={{ marginBottom: 0 }}>
                  <Button
                    type="primary"
                    htmlType="submit"
                    block
                    loading={loginLoading}
                  >
                    Sign In
                  </Button>
                </Form.Item>
              </Form>

              <div className="admin-login-footer">
                <Text type="secondary">Are you a trainer? </Text>
                <Link to="/trainer-login">
                  <Button type="link" style={{ padding: 0, color: '#2d6a4f' }}>
                    Trainer Login
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════
  // DASHBOARD
  // ═══════════════════════════════════════════════════════════

  // ─── Filter Tab Items ───
  const filterTabs = [
    { key: 'all', label: <span className="filter-tab-label">All <Badge count={stats.total} style={{ backgroundColor: '#722ed1' }} /></span> },
    { key: 'pending', label: <span className="filter-tab-label">Pending <Badge count={stats.pending} style={{ backgroundColor: '#fa8c16' }} /></span> },
    { key: 'resubmit', label: <span className="filter-tab-label">Resubmit <Badge count={stats.resubmit} style={{ backgroundColor: '#faad14' }} /></span> },
    { key: 'verified', label: <span className="filter-tab-label">Verified <Badge count={stats.verified} style={{ backgroundColor: '#52c41a' }} /></span> },
    { key: 'rejected', label: <span className="filter-tab-label">Rejected <Badge count={stats.rejected} style={{ backgroundColor: '#f5222d' }} /></span> }
  ];

  // ─── Render Trainer Card ───
  const renderTrainerCard = (trainer) => {
    const initials = (trainer.name || 'T').charAt(0).toUpperCase();
    const profile = trainer.profile || {};
    const isRegHidden = hiddenTrainers.includes(`reg_${trainer.id}`);

    return (
      <Col xs={24} md={12} lg={8} key={trainer.id}>
        <Card className="trainer-app-card" style={isRegHidden ? { opacity: 0.5, background: '#fafafa' } : {}}>
          {isRegHidden && (
            <div style={{ background: '#ff4d4f', color: '#fff', textAlign: 'center', padding: '2px 0', borderRadius: '8px 8px 0 0', fontSize: 11, fontWeight: 600, marginBottom: 8 }}>
              REMOVED FROM PLATFORM
            </div>
          )}
          {/* Header: Avatar + Name + Status */}
          <div className="trainer-app-header">
            {profile.profilePhoto ? (
              <img src={profile.profilePhoto} alt={trainer.name} className="trainer-app-avatar" />
            ) : (
              <div className="trainer-app-avatar-placeholder">{initials}</div>
            )}
            <div className="trainer-app-name-block">
              <Title level={5}>{trainer.name}</Title>
              <Text className="trainer-app-email">{trainer.email}</Text>
              <div className="trainer-app-tags">
                <Tag color={STATUS_COLORS[trainer.status] || 'default'}>
                  {STATUS_LABELS[trainer.status] || trainer.status}
                </Tag>
                {trainer.category && (
                  <Tag color="purple">{trainer.category}</Tag>
                )}
                {trainer.bankStatus && trainer.bankStatus !== 'not_submitted' && (
                  <Tag color={trainer.bankStatus === 'verified' ? 'green' : trainer.bankStatus === 'rejected' ? 'red' : 'blue'}>
                    {trainer.bankStatus === 'verified' ? '🏦 Bank ✓' : trainer.bankStatus === 'rejected' ? '🏦 Bank ✗' : '🏦 Bank Pending'}
                  </Tag>
                )}
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="trainer-app-details">
            {profile.specialization && (
              <div className="trainer-app-detail-row">
                <Award size={14} />
                <span>{profile.specialization}</span>
              </div>
            )}
            {profile.experience && (
              <div className="trainer-app-detail-row">
                <Briefcase size={14} />
                <span>{profile.experience} years experience</span>
              </div>
            )}
            {profile.price && (
              <div className="trainer-app-detail-row">
                <IndianRupee size={14} />
                <span>&#8377;{Number(profile.price).toLocaleString()} / session</span>
              </div>
            )}
            {(profile.location || profile.city) && (
              <div className="trainer-app-detail-row">
                <MapPin size={14} />
                <span>{profile.location || profile.city}</span>
              </div>
            )}
          </div>

          {/* Admin Remarks / Rejection Reason */}
          {trainer.adminRemarks && (
            <div className="trainer-app-remarks">
              <Alert
                message="Admin Remarks"
                description={trainer.adminRemarks}
                type="warning"
                showIcon
                icon={<AlertTriangle size={16} />}
                style={{ borderRadius: 10, fontSize: 12 }}
              />
            </div>
          )}
          {trainer.rejectionReason && (
            <div className="trainer-app-remarks">
              <Alert
                message="Rejection Reason"
                description={trainer.rejectionReason}
                type="error"
                showIcon
                icon={<XCircle size={16} />}
                style={{ borderRadius: 10, fontSize: 12 }}
              />
            </div>
          )}

          {/* Register Date */}
          <div className="trainer-app-date">
            <CalendarDays size={13} />
            <span>Registered: {formatDate(trainer.registeredAt)}</span>
          </div>

          {/* Action Buttons */}
          <div className="trainer-app-actions">
            <Button
              size="small"
              icon={<Eye size={14} />}
              onClick={() => openDetailModal(trainer)}
            >
              Details
            </Button>
            <Button
              size="small"
              icon={<ExternalLink size={14} />}
              onClick={() => navigate(`/trainer-dashboard/reg_${trainer.id}`)}
            >
              View Profile
            </Button>
            <Button
              size="small"
              icon={<Edit3 size={14} />}
              onClick={() => openEditModal(trainer, true)}
            >
              Edit
            </Button>

            {(trainer.status === 'pending' || trainer.status === 'pending_review' || trainer.status === 'resubmit') && (
              <>
                <Button
                  size="small"
                  type="primary"
                  icon={<CheckCircle size={14} />}
                  style={{ background: '#2d6a4f', borderColor: '#2d6a4f' }}
                  onClick={() => handleApprove(trainer)}
                >
                  Approve
                </Button>
                <Button
                  size="small"
                  icon={<RotateCcw size={14} />}
                  style={{ color: '#fa8c16', borderColor: '#fa8c16' }}
                  onClick={() => openResubmitModal(trainer)}
                >
                  Resubmit
                </Button>
                <Button
                  size="small"
                  danger
                  icon={<XCircle size={14} />}
                  onClick={() => openRejectModal(trainer)}
                >
                  Reject
                </Button>
              </>
            )}

            {trainer.status === 'rejected' && (
              <Button
                size="small"
                type="primary"
                icon={<RotateCcw size={14} />}
                style={{ background: '#722ed1', borderColor: '#722ed1' }}
                onClick={() => handleApprove(trainer)}
              >
                Re-verify
              </Button>
            )}

            {/* Remove / Restore registered trainer */}
            {hiddenTrainers.includes(`reg_${trainer.id}`) ? (
              <Button
                size="small"
                type="primary"
                icon={<RotateCcw size={14} />}
                style={{ background: '#2d6a4f', borderColor: '#2d6a4f' }}
                onClick={() => {
                  restoreTrainer(`reg_${trainer.id}`);
                  message.success(`${trainer.name} restored to platform`);
                }}
              >
                Restore
              </Button>
            ) : (
              <Button
                size="small"
                danger
                icon={<EyeOff size={14} />}
                onClick={() => {
                  Modal.confirm({
                    title: 'Remove from Platform',
                    content: `Are you sure you want to remove "${trainer.name}" from the platform? They will no longer appear in search results.`,
                    okText: 'Yes, Remove',
                    okButtonProps: { danger: true },
                    onOk: () => {
                      hideTrainer(`reg_${trainer.id}`);
                      message.success(`${trainer.name} has been removed from the platform`);
                    }
                  });
                }}
              >
                Remove
              </Button>
            )}
          </div>
        </Card>
      </Col>
    );
  };

  return (
    <div className="admin-page">
      <div className="admin-container">
        {/* ─── Dashboard Header ─── */}
        <div className="admin-dashboard-header">
          <div className="admin-header-left">
            <Title level={3}>Admin Dashboard</Title>
            <Text>Manage trainer applications and verifications</Text>
          </div>
          <Button
            className="admin-logout-btn"
            icon={<LogOut size={16} />}
            onClick={handleLogout}
          >
            Logout
          </Button>
        </div>

        {/* ─── Stats Row ─── */}
        <Row gutter={[16, 16]} className="admin-stats-row">
          <Col xs={12} sm={6}>
            <Card className="admin-stat-card stat-card-green">
              <Statistic
                title="Total Trainers"
                value={stats.total}
                prefix={<Users size={20} color="#fff" />}
              />
            </Card>
          </Col>
          <Col xs={12} sm={6}>
            <Card className="admin-stat-card stat-card-orange">
              <Statistic
                title="Pending"
                value={stats.pending}
                prefix={<Clock size={20} color="#fff" />}
              />
            </Card>
          </Col>
          <Col xs={12} sm={6}>
            <Card className="admin-stat-card stat-card-emerald">
              <Statistic
                title="Verified"
                value={stats.verified}
                prefix={<CheckCircle size={20} color="#fff" />}
              />
            </Card>
          </Col>
          <Col xs={12} sm={6}>
            <Card className="admin-stat-card stat-card-red">
              <Statistic
                title="Rejected"
                value={stats.rejected}
                prefix={<XCircle size={20} color="#fff" />}
              />
            </Card>
          </Col>
        </Row>

        {/* ─── Filter Tabs ─── */}
        <Tabs
          activeKey={activeFilter}
          onChange={setActiveFilter}
          items={filterTabs}
          className="admin-filter-tabs"
        />

        {/* ─── Trainer Cards Grid ─── */}
        {filteredTrainers.length > 0 ? (
          <Row gutter={[16, 16]}>
            {filteredTrainers.map(renderTrainerCard)}
          </Row>
        ) : (
          <div className="admin-empty-state">
            <Empty
              description={
                <span>
                  No trainers found
                  {activeFilter !== 'all' && (
                    <span> with status "{STATUS_LABELS[activeFilter] || activeFilter}"</span>
                  )}
                </span>
              }
            />
          </div>
        )}

        {/* ─── Platform Trainers (Static/Dummy Data) ─── */}
        <Divider style={{ margin: '32px 0 16px' }} />
        <div className="admin-dashboard-header" style={{ marginBottom: 16 }}>
          <div className="admin-header-left">
            <Title level={4} style={{ margin: 0 }}>Platform Trainers</Title>
            <Text type="secondary">Pre-listed trainers on the platform ({TRAINER_DATA.length} total{hiddenTrainers.length > 0 ? `, ${hiddenTrainers.length} hidden` : ''})</Text>
          </div>
        </div>
        <Row gutter={[16, 16]}>
          {TRAINER_DATA.map(trainer => {
            const isHidden = hiddenTrainers.includes(trainer.id);
            const edits = trainerEdits[trainer.id] || {};
            const isEdited = Object.keys(edits).length > 0;
            const t = { ...trainer, ...edits };
            return (
              <Col xs={24} md={12} lg={8} key={`static-${trainer.id}`}>
                <Card className="trainer-app-card" style={isHidden ? { opacity: 0.5, background: '#fafafa' } : {}}>
                  {isHidden && (
                    <Tag color="red" style={{ position: 'absolute', top: 12, right: 12, zIndex: 1 }}>
                      <EyeOff size={12} style={{ marginRight: 4, verticalAlign: 'middle' }} />
                      Hidden
                    </Tag>
                  )}
                  {!isHidden && isEdited && (
                    <Tag color="blue" style={{ position: 'absolute', top: 12, right: 12, zIndex: 1 }}>
                      <Edit3 size={12} style={{ marginRight: 4, verticalAlign: 'middle' }} />
                      Edited
                    </Tag>
                  )}
                  <div className="trainer-app-header">
                    <img
                      src={t.image}
                      alt={t.name}
                      className="trainer-app-avatar"
                      style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover' }}
                    />
                    <div className="trainer-app-name-block">
                      <Title level={5}>{t.name}</Title>
                      <div className="trainer-app-tags">
                        <Tag color={isHidden ? 'default' : 'green'}>{isHidden ? 'Removed' : 'Platform Verified'}</Tag>
                        <Tag color={getCategoryColor(t.category)}>{getCategoryLabel(t.category)}</Tag>
                      </div>
                    </div>
                  </div>
                  <div className="trainer-app-details">
                    <div className="trainer-app-detail-row">
                      <Award size={14} />
                      <span>{t.specialization}</span>
                    </div>
                    <div className="trainer-app-detail-row">
                      <Briefcase size={14} />
                      <span>{t.experience} years experience</span>
                    </div>
                    <div className="trainer-app-detail-row">
                      <IndianRupee size={14} />
                      <span>&#8377;{t.price.toLocaleString()} / session</span>
                    </div>
                    <div className="trainer-app-detail-row">
                      <Star size={14} />
                      <span>{t.rating} ({t.reviewCount} reviews)</span>
                    </div>
                  </div>
                  <div className="trainer-app-actions">
                    <Button
                      size="small"
                      icon={<Edit3 size={14} />}
                      onClick={() => openEditModal(trainer)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="small"
                      icon={<ExternalLink size={14} />}
                      onClick={() => navigate(`/trainer-dashboard/${trainer.id}`)}
                    >
                      View Profile
                    </Button>
                    {isEdited && (
                      <Button
                        size="small"
                        icon={<Undo2 size={14} />}
                        onClick={() => {
                          resetStaticTrainer(trainer.id);
                          message.success(`${trainer.name} reset to original data`);
                        }}
                      >
                        Reset
                      </Button>
                    )}
                    {isHidden ? (
                      <Button
                        size="small"
                        type="primary"
                        icon={<RotateCcw size={14} />}
                        style={{ background: '#2d6a4f', borderColor: '#2d6a4f' }}
                        onClick={() => {
                          restoreTrainer(trainer.id);
                          message.success(`${trainer.name} restored to platform`);
                        }}
                      >
                        Restore
                      </Button>
                    ) : (
                      <Button
                        size="small"
                        danger
                        icon={<EyeOff size={14} />}
                        onClick={() => {
                          Modal.confirm({
                            title: 'Remove from Platform',
                            content: `Are you sure you want to hide "${trainer.name}" from the platform? They will no longer appear on the home page or search results.`,
                            okText: 'Yes, Remove',
                            okButtonProps: { danger: true },
                            onOk: () => {
                              hideTrainer(trainer.id);
                              message.success(`${trainer.name} has been removed from the platform`);
                            }
                          });
                        }}
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                </Card>
              </Col>
            );
          })}
        </Row>
      </div>

      {/* ═══════════════════════════════════════════════════════
          REJECT MODAL
          ═══════════════════════════════════════════════════════ */}
      <Modal
        title={
          <Space>
            <XCircle size={18} color="#f5222d" />
            <span>Reject Trainer</span>
          </Space>
        }
        open={rejectModalOpen}
        onCancel={() => {
          setRejectModalOpen(false);
          setSelectedTrainer(null);
          setRejectReason('');
        }}
        onOk={handleConfirmReject}
        okText="Confirm Reject"
        okButtonProps={{ danger: true }}
        className="admin-action-modal"
      >
        {selectedTrainer && (
          <>
            <Text>
              Rejecting <Text strong>{selectedTrainer.name}</Text> ({selectedTrainer.email})
            </Text>
            <div style={{ marginTop: 16 }}>
              <Text type="secondary" style={{ display: 'block', marginBottom: 8 }}>
                Reason for rejection <Text type="danger">*</Text>
              </Text>
              <TextArea
                rows={4}
                placeholder="Provide a detailed reason for rejection. The trainer will see this message..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                maxLength={500}
                showCount
              />
            </div>
          </>
        )}
      </Modal>

      {/* ═══════════════════════════════════════════════════════
          RESUBMIT MODAL
          ═══════════════════════════════════════════════════════ */}
      <Modal
        title={
          <Space>
            <RotateCcw size={18} color="#fa8c16" />
            <span>Request Resubmission</span>
          </Space>
        }
        open={resubmitModalOpen}
        onCancel={() => {
          setResubmitModalOpen(false);
          setSelectedTrainer(null);
          setResubmitRemarks('');
        }}
        onOk={handleConfirmResubmit}
        okText="Send Request"
        okButtonProps={{ style: { background: '#fa8c16', borderColor: '#fa8c16' } }}
        className="admin-action-modal"
      >
        {selectedTrainer && (
          <>
            <Alert
              message="The trainer will be notified to update and resubmit their profile with the corrections you specify below."
              type="info"
              showIcon
              style={{ marginBottom: 16, borderRadius: 10 }}
            />
            <Text>
              Requesting resubmission from <Text strong>{selectedTrainer.name}</Text>
            </Text>
            <div style={{ marginTop: 16 }}>
              <Text type="secondary" style={{ display: 'block', marginBottom: 8 }}>
                Remarks / Instructions <Text type="danger">*</Text>
              </Text>
              <TextArea
                rows={4}
                placeholder="Describe what needs to be corrected or updated..."
                value={resubmitRemarks}
                onChange={(e) => setResubmitRemarks(e.target.value)}
                maxLength={500}
                showCount
              />
            </div>
          </>
        )}
      </Modal>

      {/* ═══════════════════════════════════════════════════════
          DETAIL MODAL
          ═══════════════════════════════════════════════════════ */}
      <Modal
        title={
          <Space>
            <User size={18} color="#722ed1" />
            <span>Trainer Details</span>
          </Space>
        }
        open={detailModalOpen}
        onCancel={() => {
          setDetailModalOpen(false);
          setSelectedTrainer(null);
        }}
        footer={null}
        width={700}
        className="admin-detail-modal"
      >
        {selectedTrainer && (() => {
          const profile = selectedTrainer.profile || {};

          return (
            <div>
              {/* Personal Information */}
              <Card
                size="small"
                title="Personal Information"
                className="detail-section-card"
              >
                <div className="detail-info-row">
                  <User size={15} />
                  <span className="detail-info-label">Name</span>
                  <span className="detail-info-value">{selectedTrainer.name}</span>
                </div>
                <div className="detail-info-row">
                  <Mail size={15} />
                  <span className="detail-info-label">Email</span>
                  <span className="detail-info-value">{selectedTrainer.email}</span>
                </div>
                <div className="detail-info-row">
                  <Phone size={15} />
                  <span className="detail-info-label">Phone</span>
                  <span className="detail-info-value">{selectedTrainer.phone || 'Not provided'}</span>
                </div>
                <div className="detail-info-row">
                  <MapPin size={15} />
                  <span className="detail-info-label">Location</span>
                  <span className="detail-info-value">{profile.location || profile.city || 'Not provided'}</span>
                </div>
                <div className="detail-info-row">
                  <CalendarDays size={15} />
                  <span className="detail-info-label">Registered</span>
                  <span className="detail-info-value">{formatDate(selectedTrainer.registeredAt)}</span>
                </div>
                <div className="detail-info-row" style={{ marginTop: 4 }}>
                  <span className="detail-info-label" style={{ marginLeft: 25 }}>Status</span>
                  <Tag color={STATUS_COLORS[selectedTrainer.status] || 'default'}>
                    {STATUS_LABELS[selectedTrainer.status] || selectedTrainer.status}
                  </Tag>
                </div>
              </Card>

              {/* Professional Information */}
              <Card
                size="small"
                title="Professional Information"
                className="detail-section-card"
              >
                <div className="detail-info-row">
                  <Briefcase size={15} />
                  <span className="detail-info-label">Category</span>
                  <span className="detail-info-value">{selectedTrainer.category || 'Not specified'}</span>
                </div>
                <div className="detail-info-row">
                  <Award size={15} />
                  <span className="detail-info-label">Specialization</span>
                  <span className="detail-info-value">{profile.specialization || 'Not provided'}</span>
                </div>
                <div className="detail-info-row">
                  <Clock size={15} />
                  <span className="detail-info-label">Experience</span>
                  <span className="detail-info-value">{profile.experience ? `${profile.experience} years` : 'Not provided'}</span>
                </div>
                <div className="detail-info-row">
                  <IndianRupee size={15} />
                  <span className="detail-info-label">Price</span>
                  <span className="detail-info-value">{profile.price ? `\u20B9${Number(profile.price).toLocaleString()} / session` : 'Not set'}</span>
                </div>
                {profile.bio && (
                  <div style={{ marginTop: 10 }}>
                    <Text type="secondary" style={{ fontSize: 13 }}>Bio</Text>
                    <p style={{ margin: '4px 0 0', fontSize: 13, color: '#555' }}>{profile.bio}</p>
                  </div>
                )}
              </Card>

              {/* Documents */}
              <Card
                size="small"
                title="Documents"
                className="detail-section-card"
              >
                {selectedTrainer.documents?.idProof ? (
                  <div className="detail-info-row">
                    <FileText size={15} />
                    <span className="detail-info-label">ID Proof</span>
                    <Button
                      type="link"
                      size="small"
                      icon={<ExternalLink size={13} />}
                      onClick={() => {
                        if (selectedTrainer.documents.idProof.startsWith?.('data:') || selectedTrainer.documents.idProof.startsWith?.('http')) {
                          window.open(selectedTrainer.documents.idProof, '_blank');
                        } else {
                          message.info('Document preview not available');
                        }
                      }}
                    >
                      View
                    </Button>
                  </div>
                ) : (
                  <div className="detail-info-row">
                    <FileText size={15} />
                    <Text type="secondary">No ID proof uploaded</Text>
                  </div>
                )}

                {selectedTrainer.documents?.certificates?.length > 0 ? (
                  selectedTrainer.documents.certificates.map((cert, index) => (
                    <div className="detail-info-row" key={index}>
                      <Award size={15} />
                      <span className="detail-info-label">Certificate {index + 1}</span>
                      <Button
                        type="link"
                        size="small"
                        icon={<ExternalLink size={13} />}
                        onClick={() => {
                          if (typeof cert === 'string' && (cert.startsWith('data:') || cert.startsWith('http'))) {
                            window.open(cert, '_blank');
                          } else {
                            message.info('Document preview not available');
                          }
                        }}
                      >
                        View
                      </Button>
                    </div>
                  ))
                ) : (
                  <div className="detail-info-row">
                    <Award size={15} />
                    <Text type="secondary">No certificates uploaded</Text>
                  </div>
                )}
              </Card>

              {/* Bank Details */}
              <Card
                size="small"
                title={
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span>Bank Details</span>
                    {selectedTrainer.bankStatus && selectedTrainer.bankStatus !== 'not_submitted' && (
                      <Tag color={selectedTrainer.bankStatus === 'verified' ? 'green' : selectedTrainer.bankStatus === 'rejected' ? 'red' : 'orange'}>
                        {selectedTrainer.bankStatus === 'verified' ? 'Verified' : selectedTrainer.bankStatus === 'rejected' ? 'Rejected' : 'Pending'}
                      </Tag>
                    )}
                  </div>
                }
                className="detail-section-card"
              >
                {profile.bankDetails ? (
                  <>
                    <div className="detail-info-row">
                      <User size={15} />
                      <span className="detail-info-label">Account Holder</span>
                      <span className="detail-info-value">{profile.bankDetails.accountHolder}</span>
                    </div>
                    <div className="detail-info-row">
                      <Landmark size={15} />
                      <span className="detail-info-label">Bank Name</span>
                      <span className="detail-info-value">{profile.bankDetails.bankName}</span>
                    </div>
                    <div className="detail-info-row">
                      <CreditCard size={15} />
                      <span className="detail-info-label">Account Number</span>
                      <span className="detail-info-value">{profile.bankDetails.accountNumber}</span>
                    </div>
                    <div className="detail-info-row">
                      <CreditCard size={15} />
                      <span className="detail-info-label">IFSC Code</span>
                      <span className="detail-info-value">{profile.bankDetails.ifscCode}</span>
                    </div>
                    {profile.bankDetails.upiId && (
                      <div className="detail-info-row">
                        <IndianRupee size={15} />
                        <span className="detail-info-label">UPI ID</span>
                        <span className="detail-info-value">{profile.bankDetails.upiId}</span>
                      </div>
                    )}
                    {selectedTrainer.bankRejectReason && (
                      <Alert
                        message="Bank Rejection Reason"
                        description={selectedTrainer.bankRejectReason}
                        type="error"
                        showIcon
                        icon={<XCircle size={16} />}
                        style={{ borderRadius: 10, marginTop: 12 }}
                      />
                    )}
                    {selectedTrainer.bankStatus !== 'verified' && (
                      <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
                        <Button
                          size="small"
                          type="primary"
                          icon={<CheckCircle size={14} />}
                          style={{ background: '#52c41a', borderColor: '#52c41a' }}
                          onClick={() => {
                            verifyBankDetails(selectedTrainer.id);
                            message.success('Bank details verified!');
                            setDetailModalOpen(false);
                          }}
                        >
                          Verify Bank
                        </Button>
                        <Button
                          size="small"
                          danger
                          icon={<XCircle size={14} />}
                          onClick={() => {
                            setBankRejectReason('');
                            setBankRejectModalOpen(true);
                          }}
                        >
                          Reject Bank
                        </Button>
                      </div>
                    )}
                  </>
                ) : (
                  <Text type="secondary">Bank details not submitted yet</Text>
                )}
              </Card>

              {/* Rejection / Resubmission Info */}
              {selectedTrainer.rejectionReason && (
                <Alert
                  message="Rejection Reason"
                  description={selectedTrainer.rejectionReason}
                  type="error"
                  showIcon
                  icon={<XCircle size={16} />}
                  style={{ borderRadius: 12, marginBottom: 16 }}
                />
              )}

              {selectedTrainer.adminRemarks && (
                <Alert
                  message="Admin Remarks (Resubmission)"
                  description={selectedTrainer.adminRemarks}
                  type="warning"
                  showIcon
                  icon={<AlertTriangle size={16} />}
                  style={{ borderRadius: 12, marginBottom: 16 }}
                />
              )}

              {/* Status History Timeline */}
              {selectedTrainer.statusHistory?.length > 0 && (
                <Card
                  size="small"
                  title="Status History"
                  className="detail-section-card"
                >
                  <Timeline
                    items={selectedTrainer.statusHistory.map((entry, idx) => ({
                      color: STATUS_COLORS[entry.status] || 'gray',
                      children: (
                        <div key={idx}>
                          <Text strong>
                            <Tag color={STATUS_COLORS[entry.status] || 'default'} style={{ marginRight: 8 }}>
                              {STATUS_LABELS[entry.status] || entry.status}
                            </Tag>
                          </Text>
                          <br />
                          <Text type="secondary" style={{ fontSize: 12 }}>{formatDate(entry.date)}</Text>
                          {entry.note && (
                            <p style={{ margin: '4px 0 0', fontSize: 13, color: '#666' }}>{entry.note}</p>
                          )}
                        </div>
                      )
                    }))}
                  />
                </Card>
              )}

              {/* Action Buttons at Bottom */}
              <div className="detail-modal-actions">
                <Button
                  icon={<ExternalLink size={14} />}
                  onClick={() => {
                    setDetailModalOpen(false);
                    navigate(`/trainer-dashboard/reg_${selectedTrainer.id}`);
                  }}
                >
                  View Profile
                </Button>
                <Button
                  icon={<Edit3 size={14} />}
                  onClick={() => {
                    setDetailModalOpen(false);
                    openEditModal(selectedTrainer, true);
                  }}
                >
                  Edit Profile
                </Button>
                {(selectedTrainer.status === 'pending' || selectedTrainer.status === 'pending_review' || selectedTrainer.status === 'resubmit') && (
                  <>
                    <Button
                      type="primary"
                      icon={<CheckCircle size={14} />}
                      style={{ background: '#2d6a4f', borderColor: '#2d6a4f' }}
                      onClick={() => {
                        setDetailModalOpen(false);
                        handleApprove(selectedTrainer);
                      }}
                    >
                      Approve
                    </Button>
                    <Button
                      icon={<RotateCcw size={14} />}
                      style={{ color: '#fa8c16', borderColor: '#fa8c16' }}
                      onClick={() => {
                        setDetailModalOpen(false);
                        openResubmitModal(selectedTrainer);
                      }}
                    >
                      Request Resubmit
                    </Button>
                    <Button
                      danger
                      icon={<XCircle size={14} />}
                      onClick={() => {
                        setDetailModalOpen(false);
                        openRejectModal(selectedTrainer);
                      }}
                    >
                      Reject
                    </Button>
                  </>
                )}
                {selectedTrainer.status === 'rejected' && (
                  <Button
                    type="primary"
                    icon={<RotateCcw size={14} />}
                    style={{ background: '#722ed1', borderColor: '#722ed1' }}
                    onClick={() => {
                      setDetailModalOpen(false);
                      handleApprove(selectedTrainer);
                    }}
                  >
                    Re-verify
                  </Button>
                )}
                <Button onClick={() => setDetailModalOpen(false)}>
                  Close
                </Button>
              </div>
            </div>
          );
        })()}
      </Modal>

      {/* ═══════════════════════════════════════════════════════
          EDIT TRAINER MODAL (Static + Registered)
          ═══════════════════════════════════════════════════════ */}
      <Modal
        title={
          <Space>
            <Edit3 size={18} color="#2d6a4f" />
            <span>Edit Trainer - {editingTrainer?.name}</span>
          </Space>
        }
        open={editModalOpen}
        onCancel={() => {
          setEditModalOpen(false);
          setEditingTrainer(null);
          editForm.resetFields();
        }}
        onOk={handleEditSave}
        okText="Save Changes"
        okButtonProps={{ style: { background: '#2d6a4f', borderColor: '#2d6a4f' } }}
        width={700}
        className="admin-action-modal"
      >
        <Form form={editForm} layout="vertical" requiredMark={false}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="name" label="Name" rules={[{ required: true, message: 'Name is required' }]}>
                <Input prefix={<User size={14} />} placeholder="Trainer name" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="category" label="Category" rules={[{ required: true }]}>
                <Select>
                  <Select.Option value="yoga">Yoga</Select.Option>
                  <Select.Option value="gym">Gym / Fitness</Select.Option>
                  <Select.Option value="nutrition">Nutrition</Select.Option>
                  <Select.Option value="doctor">Doctor</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="specialization" label="Specialization" rules={[{ required: true }]}>
            <Input prefix={<Award size={14} />} placeholder="e.g. Hatha Yoga & Meditation" />
          </Form.Item>
          <Row gutter={16}>
            <Col span={6}>
              <Form.Item name="experience" label="Experience (yrs)" rules={[{ required: true }]}>
                <InputNumber min={0} max={50} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="price" label="Price (₹/session)" rules={[{ required: true }]}>
                <InputNumber min={0} max={50000} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="rating" label="Rating" rules={[{ required: true }]}>
                <InputNumber min={0} max={5} step={0.1} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="reviewCount" label="Reviews">
                <InputNumber min={0} max={99999} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="availability" label="Availability">
                <Select>
                  <Select.Option value="available">Available</Select.Option>
                  <Select.Option value="busy">Busy</Select.Option>
                  <Select.Option value="unavailable">Unavailable</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="isTopRated" label="Top Rated" valuePropName="checked">
                <Switch checkedChildren="Yes" unCheckedChildren="No" />
              </Form.Item>
            </Col>
          </Row>
          {editingTrainer?._isRegistered && (
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="phone" label="Phone">
                  <Input prefix={<Phone size={14} />} placeholder="Phone number" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="location" label="Location">
                  <Input prefix={<MapPin size={14} />} placeholder="City, State" />
                </Form.Item>
              </Col>
            </Row>
          )}
          {editingTrainer?._isRegistered && (
            <Form.Item name="qualification" label="Qualification">
              <Input prefix={<Award size={14} />} placeholder="e.g. MBBS, MSc Nutrition" />
            </Form.Item>
          )}
          <Form.Item name="image" label="Photo URL">
            <Input prefix={<ImageIcon size={14} />} placeholder="https://images.unsplash.com/..." />
          </Form.Item>
          <Form.Item name="certifications" label="Certifications (comma separated)">
            <Input prefix={<Award size={14} />} placeholder="e.g. RYT-500, Meditation Coach" />
          </Form.Item>
          <Form.Item name="bio" label="Bio">
            <Input.TextArea rows={3} placeholder="Short bio about the trainer..." maxLength={300} showCount />
          </Form.Item>
        </Form>
      </Modal>

      {/* ═══════════════════════════════════════════════════════
          BANK REJECT MODAL
          ═══════════════════════════════════════════════════════ */}
      <Modal
        title={
          <Space>
            <XCircle size={18} color="#f5222d" />
            <span>Reject Bank Details</span>
          </Space>
        }
        open={bankRejectModalOpen}
        onCancel={() => {
          setBankRejectModalOpen(false);
          setBankRejectReason('');
        }}
        onOk={() => {
          if (!bankRejectReason.trim()) {
            message.warning('Please provide a reason for rejecting bank details');
            return;
          }
          rejectBankDetails(selectedTrainer.id, bankRejectReason.trim());
          message.success('Bank details rejected');
          setBankRejectModalOpen(false);
          setBankRejectReason('');
          setDetailModalOpen(false);
        }}
        okText="Confirm Reject"
        okButtonProps={{ danger: true }}
        className="admin-action-modal"
      >
        {selectedTrainer && (
          <>
            <Text>
              Rejecting bank details for <Text strong>{selectedTrainer.name}</Text>
            </Text>
            <div style={{ marginTop: 16 }}>
              <Text type="secondary" style={{ display: 'block', marginBottom: 8 }}>
                Reason for rejection <Text type="danger">*</Text>
              </Text>
              <TextArea
                rows={3}
                placeholder="Explain why the bank details are being rejected..."
                value={bankRejectReason}
                onChange={(e) => setBankRejectReason(e.target.value)}
                maxLength={300}
                showCount
              />
            </div>
          </>
        )}
      </Modal>
    </div>
  );
};

export default AdminDashboard;
