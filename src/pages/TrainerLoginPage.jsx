import React, { useState } from 'react';
import { Card, Form, Input, Button, Typography, Tabs, Select, message, Modal, Spin } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import {
  GraduationCap, Mail, Lock, User, Phone,
  ShieldCheck, Dumbbell, KeyRound, ArrowRight,
  CheckCircle, RefreshCw
} from 'lucide-react';
import { useTrainerAuth } from '../context/TrainerAuthContext';
import './TrainerLoginPage.css';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

const TrainerLoginPage = () => {
  const navigate = useNavigate();
  const { trainerRegister, trainerLogin, sendOtp, verifyOtp, resetPassword, adminLogin } = useTrainerAuth();

  // ─── Login State ───
  const [loginMethod, setLoginMethod] = useState('password'); // 'password' | 'otp'
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginForm] = Form.useForm();

  // ─── OTP State ───
  const [otpStep, setOtpStep] = useState('input'); // 'input' | 'verify'
  const [otpTrainerId, setOtpTrainerId] = useState(null);
  const [otpContact, setOtpContact] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);

  // ─── Register State ───
  const [registerLoading, setRegisterLoading] = useState(false);
  const [registerForm] = Form.useForm();

  // ─── Forgot Password State ───
  const [forgotOpen, setForgotOpen] = useState(false);
  const [forgotStep, setForgotStep] = useState(1); // 1 = enter email, 2 = set new password
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotForm] = Form.useForm();

  // ─── Admin Login State ───
  const [adminLoading, setAdminLoading] = useState(false);
  const [adminForm] = Form.useForm();

  // ─── Redirect Helper ───
  const redirectAfterLogin = (trainer) => {
    if (trainer.status === 'verified') {
      navigate('/trainer-dashboard');
    } else {
      navigate('/trainer-profile-setup');
    }
  };

  // ─── Password Login ───
  const handlePasswordLogin = async (values) => {
    setLoginLoading(true);
    try {
      const result = await trainerLogin(values.email, values.password);
      if (result.error) {
        message.error(result.error);
      } else {
        message.success('Login successful! Welcome back.');
        redirectAfterLogin(result.trainer);
      }
    } catch {
      message.error('Something went wrong. Please try again.');
    } finally {
      setLoginLoading(false);
    }
  };

  // ─── Send OTP ───
  const handleSendOtp = async () => {
    const contact = loginForm.getFieldValue('otpContact');
    if (!contact || contact.trim() === '') {
      message.warning('Please enter your email or phone number');
      return;
    }
    setOtpLoading(true);
    try {
      const result = await sendOtp(contact.trim());
      if (result.error) {
        message.error(result.error);
      } else {
        setOtpTrainerId(result.trainerId);
        setOtpContact(contact.trim());
        setOtpStep('verify');
        message.success(`OTP sent! (Demo OTP: ${result.otp})`);
      }
    } catch {
      message.error('Failed to send OTP. Please try again.');
    } finally {
      setOtpLoading(false);
    }
  };

  // ─── Verify OTP ───
  const handleVerifyOtp = async () => {
    const otp = loginForm.getFieldValue('otp');
    if (!otp || otp.length !== 6) {
      message.warning('Please enter the 6-digit OTP');
      return;
    }
    setOtpLoading(true);
    try {
      const result = await verifyOtp(otpTrainerId, otp);
      if (result.error) {
        message.error(result.error);
      } else {
        message.success('OTP verified! Welcome back.');
        redirectAfterLogin(result.trainer);
      }
    } catch {
      message.error('OTP verification failed. Please try again.');
    } finally {
      setOtpLoading(false);
    }
  };

  // ─── Resend OTP ───
  const handleResendOtp = async () => {
    setOtpLoading(true);
    try {
      const result = await sendOtp(otpContact);
      if (result.error) {
        message.error(result.error);
      } else {
        message.success(`OTP resent! (Demo OTP: ${result.otp})`);
      }
    } catch {
      message.error('Failed to resend OTP.');
    } finally {
      setOtpLoading(false);
    }
  };

  // ─── Register ───
  const handleRegister = async (values) => {
    setRegisterLoading(true);
    try {
      const result = await trainerRegister({
        name: values.name,
        email: values.email,
        phone: values.phone,
        category: values.category,
        password: values.password,
      });
      if (result.error) {
        message.error(result.error);
      } else {
        message.success('Registration successful! Complete your profile next.');
        navigate('/trainer-profile-setup');
      }
    } catch {
      message.error('Something went wrong. Please try again.');
    } finally {
      setRegisterLoading(false);
    }
  };

  // ─── Admin Login ───
  const handleAdminLogin = (values) => {
    setAdminLoading(true);
    setTimeout(() => {
      const result = adminLogin(values.adminEmail, values.adminPassword);
      setAdminLoading(false);
      if (result.error) {
        message.error(result.error);
      } else {
        message.success('Welcome to Admin Dashboard!');
        navigate('/admin');
      }
    }, 600);
  };

  // ─── Forgot Password Step 1: Verify Email ───
  const handleForgotEmailSubmit = () => {
    forgotForm.validateFields(['forgotEmail']).then((values) => {
      setForgotLoading(true);
      setTimeout(() => {
        setForgotEmail(values.forgotEmail);
        setForgotStep(2);
        setForgotLoading(false);
      }, 600);
    }).catch(() => {});
  };

  // ─── Forgot Password Step 2: Set New Password ───
  const handleForgotPasswordSubmit = () => {
    forgotForm.validateFields(['newPassword', 'confirmNewPassword']).then((values) => {
      setForgotLoading(true);
      setTimeout(() => {
        const result = resetPassword(forgotEmail, values.newPassword);
        setForgotLoading(false);
        if (result.error) {
          message.error(result.error);
        } else {
          message.success('Password reset successfully! You can now log in.');
          setForgotOpen(false);
          setForgotStep(1);
          setForgotEmail('');
          forgotForm.resetFields();
        }
      }, 800);
    }).catch(() => {});
  };

  // ─── Close Forgot Modal ───
  const closeForgotModal = () => {
    setForgotOpen(false);
    setForgotStep(1);
    setForgotEmail('');
    setForgotLoading(false);
    forgotForm.resetFields();
  };

  // ─── Reset Login Tab State ───
  const resetLoginState = () => {
    setOtpStep('input');
    setOtpTrainerId(null);
    setOtpContact('');
    loginForm.resetFields();
  };

  // ─── Workflow Steps Data ───
  const workflowSteps = [
    { number: 1, label: 'Register' },
    { number: 2, label: 'Fill Profile' },
    { number: 3, label: 'Upload Docs' },
    { number: 4, label: 'Admin Verifies' },
    { number: 5, label: 'Go Live' },
  ];

  // ─── Login Tab Content ───
  const renderLoginTab = () => (
    <div>
      {/* Method Toggle */}
      <div className="login-method-toggle">
        <button
          className={`login-method-btn ${loginMethod === 'password' ? 'active' : ''}`}
          onClick={() => { setLoginMethod('password'); resetLoginState(); }}
          type="button"
        >
          <Lock size={16} />
          Password
        </button>
        <button
          className={`login-method-btn ${loginMethod === 'otp' ? 'active' : ''}`}
          onClick={() => { setLoginMethod('otp'); resetLoginState(); }}
          type="button"
        >
          <KeyRound size={16} />
          OTP Login
        </button>
      </div>

      <Form
        form={loginForm}
        layout="vertical"
        onFinish={loginMethod === 'password' ? handlePasswordLogin : undefined}
        autoComplete="off"
        size="large"
      >
        {loginMethod === 'password' ? (
          <>
            <Form.Item
              name="email"
              rules={[
                { required: true, message: 'Please enter your email' },
                { type: 'email', message: 'Please enter a valid email' },
              ]}
            >
              <Input
                prefix={<Mail size={18} color="#999" />}
                placeholder="Email address"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                { required: true, message: 'Please enter your password' },
              ]}
            >
              <Input.Password
                prefix={<Lock size={18} color="#999" />}
                placeholder="Password"
              />
            </Form.Item>

            <div style={{ textAlign: 'right', marginBottom: 16 }}>
              <span
                className="forgot-link"
                onClick={() => setForgotOpen(true)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && setForgotOpen(true)}
              >
                Forgot password?
              </span>
            </div>

            <Form.Item style={{ marginBottom: 0 }}>
              <Button
                type="primary"
                htmlType="submit"
                block
                loading={loginLoading}
                className="trainer-submit-btn"
              >
                Sign In
              </Button>
            </Form.Item>
          </>
        ) : (
          <>
            {otpStep === 'input' ? (
              <>
                <Form.Item
                  name="otpContact"
                  rules={[{ required: true, message: 'Please enter your email or phone' }]}
                >
                  <Input
                    prefix={<Phone size={18} color="#999" />}
                    placeholder="Email or phone number"
                  />
                </Form.Item>

                <Button
                  type="primary"
                  block
                  loading={otpLoading}
                  className="trainer-submit-btn"
                  onClick={handleSendOtp}
                >
                  Send OTP
                  <ArrowRight size={18} style={{ marginLeft: 8 }} />
                </Button>
              </>
            ) : (
              <div className="otp-section">
                <p className="otp-info-text">
                  OTP sent to <strong>{otpContact}</strong>
                </p>

                <Form.Item
                  name="otp"
                  rules={[
                    { required: true, message: 'Please enter the OTP' },
                    { len: 6, message: 'OTP must be 6 digits' },
                  ]}
                >
                  <Input
                    placeholder="------"
                    maxLength={6}
                  />
                </Form.Item>

                <Button
                  type="primary"
                  block
                  loading={otpLoading}
                  className="trainer-submit-btn"
                  onClick={handleVerifyOtp}
                  style={{ marginBottom: 12 }}
                >
                  <CheckCircle size={18} style={{ marginRight: 8 }} />
                  Verify OTP
                </Button>

                <span
                  className="otp-resend-link"
                  onClick={handleResendOtp}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && handleResendOtp()}
                >
                  <RefreshCw size={13} style={{ marginRight: 4, verticalAlign: 'middle' }} />
                  Resend OTP
                </span>
              </div>
            )}
          </>
        )}
      </Form>
    </div>
  );

  // ─── Register Tab Content ───
  const renderRegisterTab = () => (
    <Form
      form={registerForm}
      layout="vertical"
      onFinish={handleRegister}
      autoComplete="off"
      size="large"
    >
      <Form.Item
        name="name"
        rules={[{ required: true, message: 'Please enter your full name' }]}
      >
        <Input
          prefix={<User size={18} color="#999" />}
          placeholder="Full name"
        />
      </Form.Item>

      <Form.Item
        name="email"
        rules={[
          { required: true, message: 'Please enter your email' },
          { type: 'email', message: 'Please enter a valid email' },
        ]}
      >
        <Input
          prefix={<Mail size={18} color="#999" />}
          placeholder="Email address"
        />
      </Form.Item>

      <Form.Item
        name="phone"
        rules={[
          { required: true, message: 'Please enter your phone number' },
          { pattern: /^\d{10}$/, message: 'Phone must be exactly 10 digits' },
        ]}
      >
        <Input
          prefix={<Phone size={18} color="#999" />}
          placeholder="Phone number (10 digits)"
          maxLength={10}
        />
      </Form.Item>

      <Form.Item
        name="category"
        rules={[{ required: true, message: 'Please select your category' }]}
      >
        <Select placeholder="Select your category" suffixIcon={<GraduationCap size={18} color="#999" />}>
          <Option value="yoga">Yoga Trainer</Option>
          <Option value="gym">Gym / Fitness Trainer</Option>
          <Option value="nutrition">Nutritionist / Dietitian</Option>
          <Option value="doctor">Doctor / Physiotherapist</Option>
        </Select>
      </Form.Item>

      <Form.Item
        name="password"
        rules={[
          { required: true, message: 'Please enter a password' },
          { min: 6, message: 'Password must be at least 6 characters' },
        ]}
      >
        <Input.Password
          prefix={<Lock size={18} color="#999" />}
          placeholder="Password"
        />
      </Form.Item>

      <Form.Item
        name="confirmPassword"
        dependencies={['password']}
        rules={[
          { required: true, message: 'Please confirm your password' },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('password') === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error('Passwords do not match'));
            },
          }),
        ]}
      >
        <Input.Password
          prefix={<ShieldCheck size={18} color="#999" />}
          placeholder="Confirm password"
        />
      </Form.Item>

      <Form.Item style={{ marginBottom: 0 }}>
        <Button
          type="primary"
          htmlType="submit"
          block
          loading={registerLoading}
          className="trainer-submit-btn"
        >
          Create Account
          <ArrowRight size={18} style={{ marginLeft: 8 }} />
        </Button>
      </Form.Item>
    </Form>
  );

  // ─── Admin Tab Content ───
  const renderAdminTab = () => (
    <Form
      form={adminForm}
      layout="vertical"
      onFinish={handleAdminLogin}
      autoComplete="off"
      size="large"
    >
      <div style={{
        textAlign: 'center',
        marginBottom: 20,
        padding: '16px',
        background: 'rgba(114, 46, 209, 0.06)',
        borderRadius: 12,
        border: '1px solid rgba(114, 46, 209, 0.15)'
      }}>
        <ShieldCheck size={28} color="#722ed1" style={{ marginBottom: 8 }} />
        <Text style={{ display: 'block', fontSize: 13, color: '#722ed1' }}>
          Admin access for managing trainer verifications
        </Text>
      </div>

      <Form.Item
        name="adminEmail"
        rules={[
          { required: true, message: 'Please enter admin email' },
          { type: 'email', message: 'Please enter a valid email' },
        ]}
      >
        <Input
          prefix={<Mail size={18} color="#999" />}
          placeholder="Admin email"
        />
      </Form.Item>

      <Form.Item
        name="adminPassword"
        rules={[
          { required: true, message: 'Please enter admin password' },
        ]}
      >
        <Input.Password
          prefix={<Lock size={18} color="#999" />}
          placeholder="Admin password"
        />
      </Form.Item>

      <Form.Item style={{ marginBottom: 0 }}>
        <Button
          type="primary"
          htmlType="submit"
          block
          loading={adminLoading}
          className="trainer-submit-btn"
          style={{ background: '#722ed1', borderColor: '#722ed1' }}
        >
          <ShieldCheck size={18} style={{ marginRight: 8 }} />
          Admin Sign In
        </Button>
      </Form.Item>
    </Form>
  );

  // ─── Tab Items ───
  const tabItems = [
    {
      key: 'login',
      label: (
        <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Lock size={16} /> Login
        </span>
      ),
      children: renderLoginTab(),
    },
    {
      key: 'register',
      label: (
        <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <User size={16} /> Register
        </span>
      ),
      children: renderRegisterTab(),
    },
    {
      key: 'admin',
      label: (
        <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <ShieldCheck size={16} /> Admin
        </span>
      ),
      children: renderAdminTab(),
    },
  ];

  return (
    <div className="trainer-auth-page">
      <Card className="trainer-auth-card">
        {/* Header */}
        <div className="trainer-auth-header">
          <div className="trainer-auth-icon">
            <Dumbbell size={40} color="#fff" />
          </div>
          <Title level={2}>Trainer Portal</Title>
          <Paragraph type="secondary">
            Join StayFit as a certified health &amp; fitness expert
          </Paragraph>
        </div>

        {/* Tabs */}
        <Tabs
          defaultActiveKey="login"
          items={tabItems}
          centered
          onChange={() => {
            resetLoginState();
            registerForm.resetFields();
            adminForm.resetFields();
          }}
        />

        {/* Workflow Steps */}
        <div className="workflow-steps">
          {workflowSteps.map((step, index) => (
            <React.Fragment key={step.number}>
              <div className="workflow-step">
                <div className="workflow-step-number">{step.number}</div>
                <span className="workflow-step-label">{step.label}</span>
              </div>
              {index < workflowSteps.length - 1 && (
                <ArrowRight size={16} className="workflow-step-arrow" />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Footer Links */}
        <div className="trainer-auth-footer">
          <Text type="secondary">
            Are you a customer?{' '}
            <Link to="/login">Customer Login</Link>
          </Text>
        </div>
      </Card>

      {/* ─── Forgot Password Modal ─── */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <KeyRound size={20} color="#2d6a4f" />
            <span>Reset Password</span>
          </div>
        }
        open={forgotOpen}
        onCancel={closeForgotModal}
        footer={null}
        centered
        width={420}
        className="forgot-modal"
        destroyOnClose
      >
        {forgotStep === 1 ? (
          <div className="forgot-modal-step">
            <div className="step-icon">
              <Mail size={28} color="#fff" />
            </div>
            <p>Enter the email associated with your trainer account</p>
            <Form form={forgotForm} layout="vertical" size="large">
              <Form.Item
                name="forgotEmail"
                rules={[
                  { required: true, message: 'Please enter your email' },
                  { type: 'email', message: 'Please enter a valid email' },
                ]}
              >
                <Input
                  prefix={<Mail size={18} color="#999" />}
                  placeholder="Email address"
                  style={{ borderRadius: 12 }}
                />
              </Form.Item>
              <Button
                type="primary"
                block
                loading={forgotLoading}
                className="trainer-submit-btn"
                onClick={handleForgotEmailSubmit}
              >
                Continue
                <ArrowRight size={18} style={{ marginLeft: 8 }} />
              </Button>
            </Form>
          </div>
        ) : (
          <div className="forgot-modal-step">
            <div className="step-icon">
              <Lock size={28} color="#fff" />
            </div>
            <p>Set a new password for <strong>{forgotEmail}</strong></p>
            <Form form={forgotForm} layout="vertical" size="large">
              <Form.Item
                name="newPassword"
                rules={[
                  { required: true, message: 'Please enter a new password' },
                  { min: 6, message: 'Password must be at least 6 characters' },
                ]}
              >
                <Input.Password
                  prefix={<Lock size={18} color="#999" />}
                  placeholder="New password"
                  style={{ borderRadius: 12 }}
                />
              </Form.Item>
              <Form.Item
                name="confirmNewPassword"
                dependencies={['newPassword']}
                rules={[
                  { required: true, message: 'Please confirm your new password' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('newPassword') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('Passwords do not match'));
                    },
                  }),
                ]}
              >
                <Input.Password
                  prefix={<ShieldCheck size={18} color="#999" />}
                  placeholder="Confirm new password"
                  style={{ borderRadius: 12 }}
                />
              </Form.Item>
              <Button
                type="primary"
                block
                loading={forgotLoading}
                className="trainer-submit-btn"
                onClick={handleForgotPasswordSubmit}
              >
                <CheckCircle size={18} style={{ marginRight: 8 }} />
                Reset Password
              </Button>
            </Form>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default TrainerLoginPage;
