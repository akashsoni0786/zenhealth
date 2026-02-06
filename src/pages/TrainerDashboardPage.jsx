import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Tabs,
  Tag,
  Badge,
  Modal,
  Switch,
  message,
  Avatar
} from 'antd';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Award,
  IndianRupee,
  Clock,
  Calendar,
  Star,
  Video,
  Home,
  LogOut,
  Edit3,
  Save,
  CheckCircle,
  Bell,
  TrendingUp,
  Users,
  FileText,
  Settings,
  ShieldCheck,
  BarChart3,
  Wallet,
  CalendarDays
} from 'lucide-react';
import { useTrainerAuth } from '../context/TrainerAuthContext';
import './TrainerDashboardPage.css';

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const defaultAvailability = DAYS_OF_WEEK.map((day, i) => ({
  day,
  enabled: i < 5,
  start: '09:00 AM',
  end: '06:00 PM'
}));

const TrainerDashboardPage = () => {
  const navigate = useNavigate();
  const { currentTrainer, trainerLogout, updateTrainerProfile, markNotificationRead } = useTrainerAuth();

  // ─── Auth guards ───
  useEffect(() => {
    if (!currentTrainer) {
      navigate('/trainer-login');
    } else if (currentTrainer.status !== 'verified') {
      navigate('/trainer-profile-setup');
    }
  }, [currentTrainer, navigate]);

  // ─── Active tab ───
  const [activeTab, setActiveTab] = useState('overview');

  // ─── Edit profile modal ───
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    phone: '',
    specialization: '',
    price: '',
    location: '',
    workingHours: '',
    bio: '',
    imageUrl: ''
  });

  // ─── Availability ───
  const [availability, setAvailability] = useState(() => {
    const saved = localStorage.getItem('td_availability');
    return saved ? JSON.parse(saved) : defaultAvailability;
  });

  useEffect(() => {
    localStorage.setItem('td_availability', JSON.stringify(availability));
  }, [availability]);

  // ─── Bookings ───
  const [bookings, setBookings] = useState(() => {
    const saved = localStorage.getItem('td_bookings');
    if (saved) return JSON.parse(saved);
    const price = currentTrainer?.profile?.price || currentTrainer?.profile?.fee || 1500;
    return [
      { id: 1, client: 'Rahul Sharma', type: 'video', date: '2026-02-10', time: '10:00 AM', status: 'upcoming', amount: price || 1500 },
      { id: 2, client: 'Priya Patel', type: 'in-person', date: '2026-02-08', time: '2:00 PM', status: 'completed', amount: price || 1500 },
      { id: 3, client: 'Amit Kumar', type: 'video', date: '2026-02-07', time: '11:00 AM', status: 'completed', amount: price || 1500 },
      { id: 4, client: 'Sneha Reddy', type: 'home-visit', date: '2026-02-12', time: '4:00 PM', status: 'upcoming', amount: (price || 1500) + 500 }
    ];
  });

  useEffect(() => {
    localStorage.setItem('td_bookings', JSON.stringify(bookings));
  }, [bookings]);

  // ─── Derived data ───
  const profile = currentTrainer?.profile || {};
  const firstName = (currentTrainer?.name || 'Trainer').split(' ')[0];
  const specialization = profile.specialization || profile.category || currentTrainer?.category || 'Fitness';
  const notifications = currentTrainer?.notifications || [];
  const unreadCount = notifications.filter(n => !n.read).length;

  const stats = useMemo(() => {
    const total = bookings.length;
    const upcoming = bookings.filter(b => b.status === 'upcoming').length;
    const completed = bookings.filter(b => b.status === 'completed').length;
    const earnings = bookings.filter(b => b.status === 'completed').reduce((sum, b) => sum + b.amount, 0);
    return { total, upcoming, completed, earnings };
  }, [bookings]);

  // ─── Handlers ───
  const handleLogout = () => {
    trainerLogout();
    navigate('/trainer-login');
  };

  const openEditModal = () => {
    setEditForm({
      name: currentTrainer?.name || '',
      phone: currentTrainer?.phone || '',
      specialization: profile.specialization || '',
      price: profile.price || profile.fee || '',
      location: profile.location || '',
      workingHours: profile.workingHours || '',
      bio: profile.bio || '',
      imageUrl: profile.imageUrl || profile.image || ''
    });
    setEditModalOpen(true);
  };

  const handleEditSave = () => {
    updateTrainerProfile({
      name: editForm.name,
      phone: editForm.phone,
      specialization: editForm.specialization,
      price: Number(editForm.price) || 0,
      fee: Number(editForm.price) || 0,
      location: editForm.location,
      workingHours: editForm.workingHours,
      bio: editForm.bio,
      imageUrl: editForm.imageUrl,
      image: editForm.imageUrl
    });
    setEditModalOpen(false);
    message.success('Profile updated successfully!');
  };

  const handleDismissNotification = (notifId) => {
    markNotificationRead(notifId);
  };

  const toggleAvailability = (index) => {
    setAvailability(prev => prev.map((item, i) => i === index ? { ...item, enabled: !item.enabled } : item));
  };

  // ─── Type/Status helpers ───
  const getTypeTag = (type) => {
    const configs = {
      'video': { color: 'blue', icon: <Video size={12} />, label: 'Video Call' },
      'in-person': { color: 'green', icon: <Users size={12} />, label: 'In-Person' },
      'home-visit': { color: 'orange', icon: <Home size={12} />, label: 'Home Visit' }
    };
    const cfg = configs[type] || configs['video'];
    return <Tag color={cfg.color} icon={cfg.icon}>{cfg.label}</Tag>;
  };

  const getStatusTag = (status) => {
    const configs = {
      'upcoming': { color: 'blue', label: 'Upcoming' },
      'completed': { color: 'green', label: 'Completed' },
      'cancelled': { color: 'red', label: 'Cancelled' }
    };
    const cfg = configs[status] || configs['upcoming'];
    return <Tag color={cfg.color}>{cfg.label}</Tag>;
  };

  const getAvatarUrl = (name) => {
    const seed = name.split('').reduce((a, c) => a + c.charCodeAt(0), 0) % 70;
    return `https://i.pravatar.cc/40?img=${seed}`;
  };

  if (!currentTrainer || currentTrainer.status !== 'verified') return null;

  // ─── Tab: Overview ───
  const OverviewTab = (
    <div className="td-tab-content">
      <div className="td-stats-row">
        <div className="td-stat-card">
          <div className="td-stat-icon" style={{ background: 'rgba(45,106,79,0.1)' }}>
            <CalendarDays size={20} color="#2d6a4f" />
          </div>
          <div className="td-stat-info">
            <span className="td-stat-label">Total Bookings</span>
            <span className="td-stat-value">{stats.total}</span>
          </div>
        </div>
        <div className="td-stat-card">
          <div className="td-stat-icon" style={{ background: 'rgba(24,144,255,0.1)' }}>
            <Clock size={20} color="#1890ff" />
          </div>
          <div className="td-stat-info">
            <span className="td-stat-label">Upcoming</span>
            <span className="td-stat-value">{stats.upcoming}</span>
          </div>
        </div>
        <div className="td-stat-card">
          <div className="td-stat-icon" style={{ background: 'rgba(82,196,26,0.1)' }}>
            <CheckCircle size={20} color="#52c41a" />
          </div>
          <div className="td-stat-info">
            <span className="td-stat-label">Completed</span>
            <span className="td-stat-value">{stats.completed}</span>
          </div>
        </div>
        <div className="td-stat-card">
          <div className="td-stat-icon" style={{ background: 'rgba(45,106,79,0.12)' }}>
            <IndianRupee size={20} color="#2d6a4f" />
          </div>
          <div className="td-stat-info">
            <span className="td-stat-label">Earnings</span>
            <span className="td-stat-value td-earnings-value">{'\u20B9'}{stats.earnings.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className="td-section-card">
        <h3 className="td-section-title">Recent Bookings</h3>
        {bookings.slice(0, 3).map(booking => (
          <div className="td-booking-item" key={booking.id}>
            <div className="td-booking-left">
              <Avatar src={getAvatarUrl(booking.client)} size={40} />
              <div className="td-booking-info">
                <span className="td-booking-client">{booking.client}</span>
                <span className="td-booking-datetime">
                  <Calendar size={12} /> {booking.date} at {booking.time}
                </span>
              </div>
            </div>
            <div className="td-booking-right">
              {getTypeTag(booking.type)}
              {getStatusTag(booking.status)}
              <span className="td-booking-amount">{'\u20B9'}{booking.amount.toLocaleString()}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="td-section-card">
        <h3 className="td-section-title">
          Notifications
          {unreadCount > 0 && <Badge count={unreadCount} style={{ marginLeft: 8 }} />}
        </h3>
        {notifications.length === 0 && (
          <p className="td-empty-text">No notifications yet.</p>
        )}
        {notifications.map(notif => (
          <div className={`td-notification-item ${notif.read ? 'read' : 'unread'}`} key={notif.id}>
            <div className="td-notif-left">
              <Bell size={16} color={notif.read ? '#aaa' : '#2d6a4f'} />
              <div className="td-notif-content">
                <span className="td-notif-message">{notif.message}</span>
                <span className="td-notif-date">{new Date(notif.date).toLocaleDateString()}</span>
              </div>
            </div>
            {!notif.read && (
              <button className="td-notif-dismiss" onClick={() => handleDismissNotification(notif.id)}>
                Dismiss
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  // ─── Tab: Profile ───
  const ProfileTab = (
    <div className="td-tab-content">
      <div className="td-section-card td-profile-hero">
        <div className="td-profile-hero-top">
          <Avatar
            size={80}
            src={profile.imageUrl || profile.image}
            icon={<User size={36} />}
            style={{ background: '#2d6a4f' }}
          />
          <div className="td-profile-hero-info">
            <h2 className="td-profile-name">{currentTrainer.name}</h2>
            <span className="td-profile-spec">{specialization}</span>
            <div className="td-profile-tags">
              <Tag color="green" icon={<ShieldCheck size={12} />}>Verified</Tag>
              <span className="td-profile-rating">
                <Star size={14} fill="#faad14" color="#faad14" /> 4.7
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="td-profile-grid">
        <div className="td-section-card">
          <h3 className="td-section-title"><User size={16} /> Personal Information</h3>
          <div className="td-info-row">
            <Mail size={14} color="#888" />
            <span className="td-info-label">Email</span>
            <span className="td-info-value">{currentTrainer.email}</span>
          </div>
          <div className="td-info-row">
            <Phone size={14} color="#888" />
            <span className="td-info-label">Phone</span>
            <span className="td-info-value">{currentTrainer.phone || 'Not provided'}</span>
          </div>
          <div className="td-info-row">
            <MapPin size={14} color="#888" />
            <span className="td-info-label">Location</span>
            <span className="td-info-value">{profile.location || 'Not provided'}</span>
          </div>
          <div className="td-info-row">
            <Users size={14} color="#888" />
            <span className="td-info-label">Gender / Age</span>
            <span className="td-info-value">{profile.gender || '—'} / {profile.age || '—'}</span>
          </div>
        </div>

        <div className="td-section-card">
          <h3 className="td-section-title"><Briefcase size={16} /> Professional Information</h3>
          <div className="td-info-row">
            <Award size={14} color="#888" />
            <span className="td-info-label">Specialization</span>
            <span className="td-info-value">{specialization}</span>
          </div>
          <div className="td-info-row">
            <FileText size={14} color="#888" />
            <span className="td-info-label">Qualification</span>
            <span className="td-info-value">{profile.qualification || 'Not provided'}</span>
          </div>
          <div className="td-info-row">
            <Clock size={14} color="#888" />
            <span className="td-info-label">Experience</span>
            <span className="td-info-value">{profile.experience || '—'} years</span>
          </div>
          <div className="td-info-row">
            <IndianRupee size={14} color="#888" />
            <span className="td-info-label">Fee</span>
            <span className="td-info-value">{'\u20B9'}{profile.price || profile.fee || '—'} / session</span>
          </div>
        </div>
      </div>

      {profile.bio && (
        <div className="td-section-card">
          <h3 className="td-section-title"><FileText size={16} /> Bio</h3>
          <p className="td-bio-text">{profile.bio}</p>
        </div>
      )}

      <div className="td-section-card">
        <h3 className="td-section-title"><Award size={16} /> Certifications</h3>
        <div className="td-cert-tags">
          {(profile.certifications && profile.certifications.length > 0) ? (
            profile.certifications.map((cert, i) => (
              <Tag key={i} color="green">{cert}</Tag>
            ))
          ) : (
            <span className="td-empty-text">No certifications added yet.</span>
          )}
        </div>
      </div>

      <div className="td-section-card">
        <h3 className="td-section-title"><FileText size={16} /> Documents Status</h3>
        <div className="td-docs-status">
          <div className="td-doc-item">
            <span>ID Proof</span>
            {currentTrainer.documents?.idProof ? (
              <Tag color="green" icon={<CheckCircle size={12} />}>Uploaded</Tag>
            ) : (
              <Tag color="default">Not Uploaded</Tag>
            )}
          </div>
          <div className="td-doc-item">
            <span>Certificates</span>
            {currentTrainer.documents?.certificates?.length > 0 ? (
              <Tag color="green" icon={<CheckCircle size={12} />}>{currentTrainer.documents.certificates.length} Uploaded</Tag>
            ) : (
              <Tag color="default">Not Uploaded</Tag>
            )}
          </div>
        </div>
      </div>

      <div className="td-profile-actions">
        <button className="td-btn td-btn-primary" onClick={openEditModal}>
          <Edit3 size={16} /> Edit Profile
        </button>
        <button className="td-btn td-btn-outline" onClick={() => navigate('/trainer-profile-setup')}>
          <FileText size={16} /> Update Documents
        </button>
      </div>
    </div>
  );

  // ─── Tab: Bookings ───
  const BookingsTab = (
    <div className="td-tab-content">
      <div className="td-stats-row td-stats-row-small">
        <div className="td-stat-card td-stat-card-compact">
          <span className="td-stat-label">Total</span>
          <span className="td-stat-value">{stats.total}</span>
        </div>
        <div className="td-stat-card td-stat-card-compact">
          <span className="td-stat-label">Upcoming</span>
          <span className="td-stat-value" style={{ color: '#1890ff' }}>{stats.upcoming}</span>
        </div>
        <div className="td-stat-card td-stat-card-compact">
          <span className="td-stat-label">Completed</span>
          <span className="td-stat-value" style={{ color: '#52c41a' }}>{stats.completed}</span>
        </div>
      </div>

      <div className="td-section-card">
        <h3 className="td-section-title">All Bookings</h3>
        {bookings.map(booking => (
          <div className="td-booking-item" key={booking.id}>
            <div className="td-booking-left">
              <Avatar src={getAvatarUrl(booking.client)} size={44} />
              <div className="td-booking-info">
                <span className="td-booking-client">{booking.client}</span>
                <span className="td-booking-datetime">
                  <Calendar size={12} /> {booking.date} at {booking.time}
                </span>
              </div>
            </div>
            <div className="td-booking-right">
              {getTypeTag(booking.type)}
              {getStatusTag(booking.status)}
              <span className="td-booking-amount">{'\u20B9'}{booking.amount.toLocaleString()}</span>
            </div>
          </div>
        ))}
        {bookings.length === 0 && <p className="td-empty-text">No bookings yet.</p>}
      </div>
    </div>
  );

  // ─── Tab: Availability ───
  const AvailabilityTab = (
    <div className="td-tab-content">
      <div className="td-section-card">
        <h3 className="td-section-title"><CalendarDays size={16} /> Weekly Schedule</h3>
        {availability.map((slot, index) => (
          <div className={`td-availability-row ${slot.enabled ? 'enabled' : 'disabled'}`} key={slot.day}>
            <div className="td-avail-day">
              <span className="td-avail-day-name">{slot.day}</span>
            </div>
            <div className="td-avail-toggle">
              <Switch
                checked={slot.enabled}
                onChange={() => toggleAvailability(index)}
                style={{ background: slot.enabled ? '#2d6a4f' : undefined }}
              />
            </div>
            <div className="td-avail-time">
              {slot.enabled ? (
                <span className="td-avail-range">
                  <Clock size={13} /> {slot.start} - {slot.end}
                </span>
              ) : (
                <span className="td-avail-off">Day Off</span>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="td-profile-grid">
        <div className="td-section-card">
          <h3 className="td-section-title"><Clock size={16} /> Working Hours</h3>
          <p className="td-info-text">{profile.workingHours || '9:00 AM - 6:00 PM'}</p>
        </div>
        <div className="td-section-card">
          <h3 className="td-section-title"><MapPin size={16} /> Service Area</h3>
          <p className="td-info-text">{profile.location || 'Not specified'}</p>
        </div>
      </div>
    </div>
  );

  // ─── Tab: Earnings ───
  const completedBookings = bookings.filter(b => b.status === 'completed');
  const avgPerSession = completedBookings.length > 0
    ? Math.round(stats.earnings / completedBookings.length)
    : 0;

  const EarningsTab = (
    <div className="td-tab-content">
      <div className="td-stats-row">
        <div className="td-stat-card">
          <div className="td-stat-icon" style={{ background: 'rgba(45,106,79,0.1)' }}>
            <Wallet size={20} color="#2d6a4f" />
          </div>
          <div className="td-stat-info">
            <span className="td-stat-label">Total Earnings</span>
            <span className="td-stat-value td-earnings-value">{'\u20B9'}{stats.earnings.toLocaleString()}</span>
          </div>
        </div>
        <div className="td-stat-card">
          <div className="td-stat-icon" style={{ background: 'rgba(82,196,26,0.1)' }}>
            <TrendingUp size={20} color="#52c41a" />
          </div>
          <div className="td-stat-info">
            <span className="td-stat-label">Per Session Avg</span>
            <span className="td-stat-value">{'\u20B9'}{avgPerSession.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className="td-section-card">
        <h3 className="td-section-title"><BarChart3 size={16} /> Earning History</h3>
        {completedBookings.length === 0 && <p className="td-empty-text">No completed sessions yet.</p>}
        {completedBookings.map(booking => (
          <div className="td-earning-item" key={booking.id}>
            <div className="td-earning-left">
              <CheckCircle size={18} color="#52c41a" />
              <div className="td-earning-info">
                <span className="td-earning-client">{booking.client}</span>
                <span className="td-earning-date">
                  <Calendar size={12} /> {booking.date} at {booking.time}
                </span>
              </div>
            </div>
            <span className="td-earning-amount">+{'\u20B9'}{booking.amount.toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  );

  // ─── Tab items ───
  const tabItems = [
    {
      key: 'overview',
      label: <span className="td-tab-label"><BarChart3 size={15} /> Overview</span>,
      children: OverviewTab
    },
    {
      key: 'profile',
      label: <span className="td-tab-label"><User size={15} /> Profile</span>,
      children: ProfileTab
    },
    {
      key: 'bookings',
      label: <span className="td-tab-label"><Calendar size={15} /> Bookings</span>,
      children: BookingsTab
    },
    {
      key: 'availability',
      label: <span className="td-tab-label"><CalendarDays size={15} /> Availability</span>,
      children: AvailabilityTab
    },
    {
      key: 'earnings',
      label: <span className="td-tab-label"><Wallet size={15} /> Earnings</span>,
      children: EarningsTab
    }
  ];

  return (
    <div className="trainer-dashboard-page">
      <div className="trainer-dashboard-container">
        {/* ─── Header ─── */}
        <div className="td-header">
          <div className="td-header-left">
            <Avatar
              size={52}
              src={profile.imageUrl || profile.image}
              icon={<User size={24} />}
              style={{ background: '#2d6a4f' }}
            />
            <div className="td-header-info">
              <h2 className="td-header-welcome">Welcome, {firstName}!</h2>
              <div className="td-header-meta">
                <Tag color="green" icon={<ShieldCheck size={12} />}>Verified</Tag>
                <span className="td-header-spec">{specialization}</span>
              </div>
            </div>
          </div>
          <div className="td-header-right">
            <button className="td-icon-btn" onClick={() => {}} title="Notifications">
              <Badge count={unreadCount} size="small">
                <Bell size={20} color="#2d6a4f" />
              </Badge>
            </button>
            <button className="td-icon-btn" onClick={() => navigate('/trainer-profile-setup')} title="Settings">
              <Settings size={20} color="#2d6a4f" />
            </button>
            <button className="td-btn td-btn-logout" onClick={handleLogout}>
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>

        {/* ─── Tabs ─── */}
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={tabItems}
          className="td-tabs"
        />
      </div>

      {/* ─── Edit Profile Modal ─── */}
      <Modal
        title="Edit Profile"
        open={editModalOpen}
        onCancel={() => setEditModalOpen(false)}
        footer={null}
        width={540}
        className="td-edit-modal"
      >
        <div className="td-edit-form">
          <div className="td-form-group">
            <label>Full Name</label>
            <input
              type="text"
              value={editForm.name}
              onChange={e => setEditForm(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter full name"
            />
          </div>
          <div className="td-form-group">
            <label>Phone</label>
            <input
              type="text"
              value={editForm.phone}
              onChange={e => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
              placeholder="Enter phone number"
            />
          </div>
          <div className="td-form-group">
            <label>Specialization</label>
            <input
              type="text"
              value={editForm.specialization}
              onChange={e => setEditForm(prev => ({ ...prev, specialization: e.target.value }))}
              placeholder="e.g. Yoga, Fitness, Nutrition"
            />
          </div>
          <div className="td-form-group">
            <label>Price per Session ({'\u20B9'})</label>
            <input
              type="number"
              value={editForm.price}
              onChange={e => setEditForm(prev => ({ ...prev, price: e.target.value }))}
              placeholder="e.g. 1500"
            />
          </div>
          <div className="td-form-group">
            <label>Location</label>
            <input
              type="text"
              value={editForm.location}
              onChange={e => setEditForm(prev => ({ ...prev, location: e.target.value }))}
              placeholder="e.g. Mumbai, Maharashtra"
            />
          </div>
          <div className="td-form-group">
            <label>Working Hours</label>
            <input
              type="text"
              value={editForm.workingHours}
              onChange={e => setEditForm(prev => ({ ...prev, workingHours: e.target.value }))}
              placeholder="e.g. 9:00 AM - 6:00 PM"
            />
          </div>
          <div className="td-form-group">
            <label>Bio</label>
            <textarea
              value={editForm.bio}
              onChange={e => setEditForm(prev => ({ ...prev, bio: e.target.value }))}
              placeholder="Write a short bio about yourself..."
              rows={3}
            />
          </div>
          <div className="td-form-group">
            <label>Profile Image URL</label>
            <input
              type="text"
              value={editForm.imageUrl}
              onChange={e => setEditForm(prev => ({ ...prev, imageUrl: e.target.value }))}
              placeholder="https://example.com/photo.jpg"
            />
          </div>
          <button className="td-btn td-btn-primary td-btn-full" onClick={handleEditSave}>
            <Save size={16} /> Save Changes
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default TrainerDashboardPage;
