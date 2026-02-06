import { useState, useEffect } from 'react';
import {
  Card,
  Typography,
  Switch,
  Select,
  Button,
  Divider,
  Avatar,
  Input,
  Form,
  Row,
  Col,
  Space,
  message,
  Modal,
  Tabs,
  Alert
} from 'antd';
import {
  User,
  Bell,
  Shield,
  Palette,
  Globe,
  Heart,
  Smartphone,
  Mail,
  Lock,
  Trash2,
  Camera,
  Save,
  ChevronRight,
  Moon,
  Sun,
  Volume2,
  Eye,
  EyeOff,
  LogOut,
  HelpCircle,
  FileText,
  MessageSquare,
  RotateCcw,
  Check,
  Ruler,
  BarChart3
} from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const { Title, Text, Paragraph } = Typography;

const SettingsPage = () => {
  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [resetModalVisible, setResetModalVisible] = useState(false);
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [twoFactorModalVisible, setTwoFactorModalVisible] = useState(false);
  const [feedbackModalVisible, setFeedbackModalVisible] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');

  // Use global settings and auth context
  const { settings, updateSetting, resetSettings, isDarkMode, languageLabels } = useSettings();
  const { user, isAuthenticated, logout, updateProfile } = useAuth();
  const navigate = useNavigate();

  // Load user data into form when component mounts or user changes
  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        fullName: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        gender: user.gender || 'prefer_not'
      });
    }
  }, [user, form]);

  const handleSettingChange = (key, value) => {
    updateSetting(key, value);

    // Show specific messages for certain settings
    if (key === 'theme') {
      const themeNames = { light: 'Light', dark: 'Dark', system: 'System' };
      message.success(`Theme changed to ${themeNames[value]}`);
    } else if (key === 'language') {
      message.success(`Language changed to ${languageLabels[value]}`);
    } else if (key === 'measurementUnit') {
      const unitNames = { metric: 'Metric (kg, cm)', imperial: 'Imperial (lb, ft)' };
      message.success(`Measurement unit changed to ${unitNames[value]}`);
    } else {
      message.success('Setting updated');
    }
  };

  const handleSaveProfile = async (values) => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Update user profile in AuthContext
    if (updateProfile) {
      updateProfile({
        name: values.fullName,
        email: values.email,
        phone: values.phone,
        gender: values.gender
      });
    }

    setLoading(false);
    message.success('Profile updated successfully');
  };

  const handleDeleteAccount = () => {
    setDeleteModalVisible(false);
    // Clear all user data
    logout();
    resetSettings();
    localStorage.clear();
    message.success('Account deleted successfully');
    navigate('/');
  };

  const handleResetSettings = () => {
    resetSettings();
    setResetModalVisible(false);
    message.success('All settings have been reset to defaults');
  };

  const handleSignOut = () => {
    logout();
    message.success('You have been signed out');
    navigate('/');
  };

  const handleChangePassword = async (values) => {
    // Simulate password change
    await new Promise(resolve => setTimeout(resolve, 1000));
    setPasswordModalVisible(false);
    passwordForm.resetFields();
    message.success('Password changed successfully');
  };

  const handleEnable2FA = () => {
    setTwoFactorModalVisible(false);
    updateSetting('twoFactorEnabled', true);
    message.success('Two-Factor Authentication enabled');
  };

  const handleSubmitFeedback = () => {
    if (!feedbackText.trim()) {
      message.warning('Please enter your feedback');
      return;
    }
    // Simulate sending feedback
    setFeedbackModalVisible(false);
    setFeedbackText('');
    message.success('Thank you for your feedback!');
  };

  const SettingItem = ({ icon, title, description, children, onClick, highlight }) => (
    <div
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px 0',
        borderBottom: '1px solid #f0f0f0',
        cursor: onClick ? 'pointer' : 'default',
        background: highlight ? 'rgba(45, 106, 79, 0.05)' : 'transparent',
        margin: highlight ? '0 -28px' : 0,
        padding: highlight ? '16px 28px' : '16px 0',
        borderRadius: highlight ? 8 : 0
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, flex: 1 }}>
        <div className="setting-item-icon" style={{
          width: 44,
          height: 44,
          borderRadius: 12,
          background: '#e8f0ed',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {icon}
        </div>
        <div style={{ flex: 1 }}>
          <Text strong style={{ display: 'block', fontSize: 15, color: '#1b4332' }}>{title}</Text>
          {description && (
            <Text type="secondary" style={{ fontSize: 13 }}>{description}</Text>
          )}
        </div>
      </div>
      <div style={{ marginLeft: 16 }}>
        {children || (onClick && <ChevronRight size={20} color="#999" />)}
      </div>
    </div>
  );

  const SectionCard = ({ title, icon, children, extra }) => (
    <Card
      style={{
        borderRadius: 20,
        marginBottom: 24,
        boxShadow: '0 4px 20px rgba(0,0,0,0.06)'
      }}
      styles={{ body: { padding: '24px 28px' } }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 40,
            height: 40,
            borderRadius: 10,
            background: 'linear-gradient(135deg, #1b4332 0%, #2d6a4f 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {icon}
          </div>
          <Title level={4} style={{ margin: 0, color: '#1b4332' }}>{title}</Title>
        </div>
        {extra}
      </div>
      {children}
    </Card>
  );

  // Current theme indicator
  const getCurrentThemeIcon = () => {
    if (settings.theme === 'dark' || (settings.theme === 'system' && isDarkMode)) {
      return <Moon size={20} color="#1b4332" />;
    }
    return <Sun size={20} color="#1b4332" />;
  };

  const tabItems = [
    {
      key: 'profile',
      label: (
        <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <User size={18} /> Profile
        </span>
      ),
      children: (
        <>
          {/* Profile Section */}
          <SectionCard title="Personal Information" icon={<User size={20} color="#fff" />}>
            <div style={{ textAlign: 'center', marginBottom: 32 }}>
              <div style={{ position: 'relative', display: 'inline-block' }}>
                <Avatar
                  size={120}
                  style={{
                    background: 'linear-gradient(135deg, #1b4332 0%, #2d6a4f 100%)',
                    fontSize: 48
                  }}
                >
                  {user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'U'}
                </Avatar>
                <Button
                  type="primary"
                  shape="circle"
                  icon={<Camera size={16} />}
                  size="small"
                  style={{
                    position: 'absolute',
                    bottom: 4,
                    right: 4,
                    background: '#fff',
                    color: '#1b4332',
                    border: '2px solid #1b4332'
                  }}
                />
              </div>
              <Text type="secondary" style={{ display: 'block', marginTop: 12 }}>
                Click to change profile photo
              </Text>
            </div>

            <Form
              form={form}
              layout="vertical"
              onFinish={handleSaveProfile}
            >
              <Row gutter={24}>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="fullName"
                    label="Full Name"
                    rules={[{ required: true, message: 'Please enter your name' }]}
                  >
                    <Input
                      prefix={<User size={16} color="#999" />}
                      size="large"
                      placeholder="Enter your full name"
                      style={{ borderRadius: 10 }}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="email"
                    label="Email Address"
                    rules={[{ required: true, type: 'email', message: 'Please enter valid email' }]}
                  >
                    <Input
                      prefix={<Mail size={16} color="#999" />}
                      size="large"
                      placeholder="Enter your email"
                      style={{ borderRadius: 10 }}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item name="phone" label="Phone Number">
                    <Input
                      prefix={<Smartphone size={16} color="#999" />}
                      size="large"
                      placeholder="Enter phone number"
                      style={{ borderRadius: 10 }}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item name="gender" label="Gender">
                    <Select
                      size="large"
                      style={{ borderRadius: 10 }}
                      options={[
                        { value: 'male', label: 'Male' },
                        { value: 'female', label: 'Female' },
                        { value: 'other', label: 'Other' },
                        { value: 'prefer_not', label: 'Prefer not to say' }
                      ]}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                icon={<Save size={18} />}
                size="large"
                style={{
                  borderRadius: 12,
                  height: 48,
                  padding: '0 32px',
                  background: 'linear-gradient(135deg, #1b4332 0%, #2d6a4f 100%)'
                }}
              >
                Save Changes
              </Button>
            </Form>
          </SectionCard>
        </>
      )
    },
    {
      key: 'notifications',
      label: (
        <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Bell size={18} /> Notifications
        </span>
      ),
      children: (
        <SectionCard title="Notification Preferences" icon={<Bell size={20} color="#fff" />}>
          <SettingItem
            icon={<Mail size={20} color="#1b4332" />}
            title="Email Notifications"
            description="Receive updates and alerts via email"
          >
            <Switch
              checked={settings.emailNotifications}
              onChange={(val) => handleSettingChange('emailNotifications', val)}
            />
          </SettingItem>

          <SettingItem
            icon={<Smartphone size={20} color="#1b4332" />}
            title="Push Notifications"
            description="Get instant notifications on your device"
          >
            <Switch
              checked={settings.pushNotifications}
              onChange={(val) => handleSettingChange('pushNotifications', val)}
            />
          </SettingItem>

          <SettingItem
            icon={<Bell size={20} color="#1b4332" />}
            title="Session Reminders"
            description="Remind me before scheduled consultations"
          >
            <Switch
              checked={settings.sessionReminders}
              onChange={(val) => handleSettingChange('sessionReminders', val)}
            />
          </SettingItem>

          <SettingItem
            icon={<Heart size={20} color="#1b4332" />}
            title="Health Tips"
            description="Daily wellness tips and recommendations"
          >
            <Switch
              checked={settings.healthTips}
              onChange={(val) => handleSettingChange('healthTips', val)}
            />
          </SettingItem>

          <SettingItem
            icon={<Volume2 size={20} color="#1b4332" />}
            title="Promotional Emails"
            description="Receive offers and promotional content"
          >
            <Switch
              checked={settings.promotionalEmails}
              onChange={(val) => handleSettingChange('promotionalEmails', val)}
            />
          </SettingItem>
        </SectionCard>
      )
    },
    {
      key: 'privacy',
      label: (
        <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Shield size={18} /> Privacy
        </span>
      ),
      children: (
        <SectionCard title="Privacy & Security" icon={<Shield size={20} color="#fff" />}>
          <SettingItem
            icon={<Eye size={20} color="#1b4332" />}
            title="Profile Visibility"
            description="Control who can see your profile"
          >
            <Select
              value={settings.profileVisibility}
              onChange={(val) => handleSettingChange('profileVisibility', val)}
              style={{ width: 140 }}
              options={[
                { value: 'public', label: 'Public' },
                { value: 'private', label: 'Private' },
                { value: 'friends', label: 'Friends Only' }
              ]}
            />
          </SettingItem>

          <SettingItem
            icon={<EyeOff size={20} color="#1b4332" />}
            title="Activity Status"
            description="Show when you're online"
          >
            <Switch
              checked={settings.showActivityStatus}
              onChange={(val) => handleSettingChange('showActivityStatus', val)}
            />
          </SettingItem>

          <SettingItem
            icon={<Heart size={20} color="#1b4332" />}
            title="Share Health Data"
            description="Share anonymized data to improve services"
          >
            <Switch
              checked={settings.shareHealthData}
              onChange={(val) => handleSettingChange('shareHealthData', val)}
            />
          </SettingItem>

          <SettingItem
            icon={<BarChart3 size={20} color="#1b4332" />}
            title="Allow Analytics"
            description="Help us improve with anonymous usage data"
          >
            <Switch
              checked={settings.allowAnalytics}
              onChange={(val) => handleSettingChange('allowAnalytics', val)}
            />
          </SettingItem>

          <SettingItem
            icon={<Lock size={20} color="#1b4332" />}
            title="Change Password"
            description="Update your account password"
            onClick={() => setPasswordModalVisible(true)}
          />

          <SettingItem
            icon={<Shield size={20} color="#1b4332" />}
            title="Two-Factor Authentication"
            description={settings.twoFactorEnabled ? 'Enabled - Extra security active' : 'Add an extra layer of security'}
            onClick={() => setTwoFactorModalVisible(true)}
          />
        </SectionCard>
      )
    },
    {
      key: 'preferences',
      label: (
        <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Palette size={18} /> Preferences
        </span>
      ),
      children: (
        <>
          {/* Current Settings Alert */}
          <Alert
            message="Your preferences are saved automatically"
            description={
              <Space direction="vertical" size={4}>
                <Text>
                  <Check size={14} style={{ marginRight: 6, color: '#52c41a' }} />
                  Theme: <strong>{settings.theme === 'light' ? 'Light' : settings.theme === 'dark' ? 'Dark' : 'System'}</strong>
                  {settings.theme === 'system' && <Text type="secondary"> (Currently {isDarkMode ? 'Dark' : 'Light'})</Text>}
                </Text>
                <Text>
                  <Check size={14} style={{ marginRight: 6, color: '#52c41a' }} />
                  Language: <strong>{languageLabels[settings.language]}</strong>
                </Text>
                <Text>
                  <Check size={14} style={{ marginRight: 6, color: '#52c41a' }} />
                  Units: <strong>{settings.measurementUnit === 'metric' ? 'Metric (kg, cm)' : 'Imperial (lb, ft)'}</strong>
                </Text>
              </Space>
            }
            type="success"
            showIcon
            style={{ marginBottom: 24, borderRadius: 12 }}
          />

          <SectionCard
            title="App Preferences"
            icon={<Palette size={20} color="#fff" />}
            extra={
              <Button
                type="text"
                icon={<RotateCcw size={16} />}
                onClick={() => setResetModalVisible(true)}
                style={{ color: '#ff4d4f' }}
              >
                Reset All
              </Button>
            }
          >
            <SettingItem
              icon={getCurrentThemeIcon()}
              title="Theme"
              description={`Currently: ${isDarkMode ? 'Dark mode active' : 'Light mode active'}`}
              highlight={true}
            >
              <Select
                value={settings.theme}
                onChange={(val) => handleSettingChange('theme', val)}
                style={{ width: 140 }}
                options={[
                  { value: 'light', label: '☀️ Light' },
                  { value: 'dark', label: '🌙 Dark' },
                  { value: 'system', label: '💻 System' }
                ]}
              />
            </SettingItem>

            <SettingItem
              icon={<Globe size={20} color="#1b4332" />}
              title="Language"
              description={`Display language: ${languageLabels[settings.language]}`}
              highlight={true}
            >
              <Select
                value={settings.language}
                onChange={(val) => handleSettingChange('language', val)}
                style={{ width: 140 }}
                options={[
                  { value: 'en', label: '🇺🇸 English' },
                  { value: 'hi', label: '🇮🇳 हिंदी' },
                  { value: 'es', label: '🇪🇸 Español' },
                  { value: 'fr', label: '🇫🇷 Français' }
                ]}
              />
            </SettingItem>

            <SettingItem
              icon={<Ruler size={20} color="#1b4332" />}
              title="Measurement Units"
              description={settings.measurementUnit === 'metric' ? 'Using kilograms and centimeters' : 'Using pounds and feet/inches'}
              highlight={true}
            >
              <Select
                value={settings.measurementUnit}
                onChange={(val) => handleSettingChange('measurementUnit', val)}
                style={{ width: 140 }}
                options={[
                  { value: 'metric', label: '📏 Metric' },
                  { value: 'imperial', label: '📐 Imperial' }
                ]}
              />
            </SettingItem>
          </SectionCard>

          <SectionCard title="Health Tracking" icon={<Heart size={20} color="#fff" />}>
            <SettingItem
              icon={<Bell size={20} color="#1b4332" />}
              title="Daily Goal Reminders"
              description="Get reminded about your daily health goals"
            >
              <Switch
                checked={settings.dailyGoalReminders}
                onChange={(val) => handleSettingChange('dailyGoalReminders', val)}
              />
            </SettingItem>

            <SettingItem
              icon={<FileText size={20} color="#1b4332" />}
              title="Weekly Reports"
              description="Receive weekly health progress reports"
            >
              <Switch
                checked={settings.weeklyReports}
                onChange={(val) => handleSettingChange('weeklyReports', val)}
              />
            </SettingItem>

            <SettingItem
              icon={<Heart size={20} color="#1b4332" />}
              title="Achievement Alerts"
              description="Celebrate when you hit milestones"
            >
              <Switch
                checked={settings.achievementAlerts}
                onChange={(val) => handleSettingChange('achievementAlerts', val)}
              />
            </SettingItem>
          </SectionCard>
        </>
      )
    },
    {
      key: 'account',
      label: (
        <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Lock size={18} /> Account
        </span>
      ),
      children: (
        <SectionCard title="Account Management" icon={<Lock size={20} color="#fff" />}>
          <SettingItem
            icon={<HelpCircle size={20} color="#1b4332" />}
            title="Help & Support"
            description="Get help with your account"
            onClick={() => message.info('Help center would open')}
          />

          <SettingItem
            icon={<FileText size={20} color="#1b4332" />}
            title="Terms of Service"
            description="Read our terms and conditions"
            onClick={() => message.info('Terms would open')}
          />

          <SettingItem
            icon={<Shield size={20} color="#1b4332" />}
            title="Privacy Policy"
            description="Learn how we protect your data"
            onClick={() => message.info('Privacy policy would open')}
          />

          <SettingItem
            icon={<MessageSquare size={20} color="#1b4332" />}
            title="Send Feedback"
            description="Help us improve StayFit"
            onClick={() => setFeedbackModalVisible(true)}
          />

          <Divider />

          {isAuthenticated && (
            <SettingItem
              icon={<LogOut size={20} color="#ff4d4f" />}
              title="Sign Out"
              description="Log out of your account"
              onClick={handleSignOut}
            />
          )}

          {isAuthenticated && (
            <div style={{ marginTop: 24 }}>
              <Button
                danger
                icon={<Trash2 size={18} />}
                size="large"
                onClick={() => setDeleteModalVisible(true)}
                style={{ borderRadius: 12, height: 48 }}
              >
                Delete Account
              </Button>
              <Text type="secondary" style={{ display: 'block', marginTop: 8, fontSize: 13 }}>
                This action cannot be undone. All your data will be permanently deleted.
              </Text>
            </div>
          )}
        </SectionCard>
      )
    }
  ];

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 24px' }}>
      {/* Page Header */}
      <div style={{ marginBottom: 32 }}>
        <Title level={2} style={{ color: '#1b4332', marginBottom: 8 }}>Settings</Title>
        <Text type="secondary" style={{ fontSize: 16 }}>
          Manage your account settings and preferences
        </Text>
      </div>

      {/* Settings Tabs */}
      <Tabs
        items={tabItems}
        tabPosition="left"
        style={{ minHeight: 600 }}
        tabBarStyle={{
          width: 180,
          background: '#fff',
          borderRadius: 16,
          padding: '16px 8px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.06)'
        }}
      />

      {/* Delete Account Modal */}
      <Modal
        title={
          <Space>
            <Trash2 size={20} color="#ff4d4f" />
            <span>Delete Account</span>
          </Space>
        }
        open={deleteModalVisible}
        onCancel={() => setDeleteModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setDeleteModalVisible(false)}>
            Cancel
          </Button>,
          <Button key="delete" danger onClick={handleDeleteAccount}>
            Yes, Delete My Account
          </Button>
        ]}
      >
        <Paragraph>
          Are you sure you want to delete your account? This action is permanent and cannot be undone.
        </Paragraph>
        <Paragraph type="secondary">
          All your health data, consultation history, and preferences will be permanently removed.
        </Paragraph>
      </Modal>

      {/* Reset Settings Modal */}
      <Modal
        title={
          <Space>
            <RotateCcw size={20} color="#faad14" />
            <span>Reset All Settings</span>
          </Space>
        }
        open={resetModalVisible}
        onCancel={() => setResetModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setResetModalVisible(false)}>
            Cancel
          </Button>,
          <Button key="reset" type="primary" danger onClick={handleResetSettings}>
            Yes, Reset All
          </Button>
        ]}
      >
        <Paragraph>
          Are you sure you want to reset all settings to their default values?
        </Paragraph>
        <Paragraph type="secondary">
          This will reset theme, language, measurement units, and all notification preferences.
        </Paragraph>
      </Modal>

      {/* Change Password Modal */}
      <Modal
        title={
          <Space>
            <Lock size={20} color="#1b4332" />
            <span>Change Password</span>
          </Space>
        }
        open={passwordModalVisible}
        onCancel={() => {
          setPasswordModalVisible(false);
          passwordForm.resetFields();
        }}
        footer={null}
      >
        <Form
          form={passwordForm}
          layout="vertical"
          onFinish={handleChangePassword}
          style={{ marginTop: 16 }}
        >
          <Form.Item
            name="currentPassword"
            label="Current Password"
            rules={[{ required: true, message: 'Please enter current password' }]}
          >
            <Input.Password
              prefix={<Lock size={16} color="#999" />}
              placeholder="Enter current password"
              style={{ borderRadius: 8 }}
            />
          </Form.Item>
          <Form.Item
            name="newPassword"
            label="New Password"
            rules={[
              { required: true, message: 'Please enter new password' },
              { min: 8, message: 'Password must be at least 8 characters' }
            ]}
          >
            <Input.Password
              prefix={<Lock size={16} color="#999" />}
              placeholder="Enter new password"
              style={{ borderRadius: 8 }}
            />
          </Form.Item>
          <Form.Item
            name="confirmPassword"
            label="Confirm New Password"
            dependencies={['newPassword']}
            rules={[
              { required: true, message: 'Please confirm new password' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Passwords do not match'));
                }
              })
            ]}
          >
            <Input.Password
              prefix={<Lock size={16} color="#999" />}
              placeholder="Confirm new password"
              style={{ borderRadius: 8 }}
            />
          </Form.Item>
          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={() => {
                setPasswordModalVisible(false);
                passwordForm.resetFields();
              }}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit">
                Change Password
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Two-Factor Authentication Modal */}
      <Modal
        title={
          <Space>
            <Shield size={20} color="#1b4332" />
            <span>Two-Factor Authentication</span>
          </Space>
        }
        open={twoFactorModalVisible}
        onCancel={() => setTwoFactorModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setTwoFactorModalVisible(false)}>
            Cancel
          </Button>,
          <Button
            key="enable"
            type="primary"
            onClick={handleEnable2FA}
            disabled={settings.twoFactorEnabled}
          >
            {settings.twoFactorEnabled ? 'Already Enabled' : 'Enable 2FA'}
          </Button>
        ]}
      >
        {settings.twoFactorEnabled ? (
          <>
            <Alert
              message="2FA is Active"
              description="Your account is protected with two-factor authentication."
              type="success"
              showIcon
              style={{ marginBottom: 16 }}
            />
            <Paragraph type="secondary">
              To disable two-factor authentication, please contact support.
            </Paragraph>
          </>
        ) : (
          <>
            <Paragraph>
              Two-factor authentication adds an extra layer of security to your account.
              Once enabled, you'll need to enter a code from your authenticator app
              when signing in.
            </Paragraph>
            <Alert
              message="Recommended"
              description="We strongly recommend enabling 2FA to protect your health data and account."
              type="info"
              showIcon
              style={{ marginTop: 16 }}
            />
          </>
        )}
      </Modal>

      {/* Feedback Modal */}
      <Modal
        title={
          <Space>
            <MessageSquare size={20} color="#1b4332" />
            <span>Send Feedback</span>
          </Space>
        }
        open={feedbackModalVisible}
        onCancel={() => {
          setFeedbackModalVisible(false);
          setFeedbackText('');
        }}
        footer={[
          <Button key="cancel" onClick={() => {
            setFeedbackModalVisible(false);
            setFeedbackText('');
          }}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={handleSubmitFeedback}>
            Submit Feedback
          </Button>
        ]}
      >
        <Paragraph>
          We'd love to hear your thoughts! Share your feedback to help us improve StayFit.
        </Paragraph>
        <Input.TextArea
          rows={4}
          placeholder="Tell us what you think about StayFit..."
          value={feedbackText}
          onChange={(e) => setFeedbackText(e.target.value)}
          style={{ borderRadius: 8, marginTop: 8 }}
        />
        <Text type="secondary" style={{ display: 'block', marginTop: 8, fontSize: 12 }}>
          Your feedback is anonymous unless you include your contact information.
        </Text>
      </Modal>

      <style>{`
        .ant-tabs-tab {
          padding: 12px 16px !important;
          margin: 4px 0 !important;
          border-radius: 10px !important;
          justify-content: flex-start !important;
        }
        .ant-tabs-tab-active {
          background: #e8f0ed !important;
        }
        .ant-tabs-tab-active .ant-tabs-tab-btn {
          color: #1b4332 !important;
          font-weight: 600 !important;
        }
        .ant-tabs-ink-bar {
          display: none !important;
        }
        .ant-tabs-content-holder {
          padding-left: 24px;
        }
        @media (max-width: 768px) {
          .ant-tabs {
            flex-direction: column !important;
          }
          .ant-tabs-nav {
            width: 100% !important;
            margin-bottom: 24px;
          }
          .ant-tabs-nav-list {
            flex-direction: row !important;
            overflow-x: auto;
            flex-wrap: nowrap;
          }
          .ant-tabs-tab {
            flex-shrink: 0;
          }
          .ant-tabs-content-holder {
            padding-left: 0 !important;
          }
        }
      `}</style>
    </div>
  );
};

export default SettingsPage;
