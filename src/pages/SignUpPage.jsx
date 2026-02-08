import React, { useState } from 'react';
import { Card, Form, Input, Button, Typography, Divider, Space, Checkbox, message, Modal } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, UserPlus, Chrome } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const { Title, Text, Paragraph } = Typography;

// Simulated Google accounts for demo
const mockGoogleAccounts = [
  { id: 'g1', email: 'user@gmail.com', name: 'Demo User', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user1' },
  { id: 'g2', email: 'john.doe@gmail.com', name: 'John Doe', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john' },
];

const SignUpPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [googleModalVisible, setGoogleModalVisible] = useState(false);
  const { signup } = useAuth();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const result = await signup({
        name: values.name,
        email: values.email,
        password: values.password,
      });
      if (result.error) {
        message.error(result.error);
      } else {
        if (result.offline) {
          message.success('Account created (offline mode). Welcome to StayFit!');
        } else {
          message.success('Account created successfully! Welcome to StayFit.');
        }
        navigate('/assessment');
      }
    } catch {
      message.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = () => {
    setGoogleModalVisible(true);
  };

  const selectGoogleAccount = async (account) => {
    setGoogleModalVisible(false);
    setGoogleLoading(true);

    try {
      const result = await signup({
        id: account.id,
        email: account.email,
        name: account.name,
        avatar: account.avatar,
        provider: 'google'
      });
      if (result.error) {
        message.error(result.error);
      } else {
        message.success(`Welcome to StayFit, ${account.name}!`);
        navigate('/assessment');
      }
    } catch {
      message.error('Google signup failed. Please try again.');
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '80vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <Card
        style={{
          maxWidth: 420,
          width: '100%',
          borderRadius: '24px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.08)'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: 64,
            height: 64,
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #2d6a4f 0%, #40916c 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px'
          }}>
            <UserPlus size={32} color="#fff" />
          </div>
          <Title level={2} style={{ margin: 0, color: '#2d6a4f' }}>Create Account</Title>
          <Paragraph type="secondary" style={{ marginTop: 8 }}>
            Start your personalized wellness journey today
          </Paragraph>
        </div>

        <Form
          name="signup"
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
          size="large"
        >
          <Form.Item
            name="name"
            rules={[
              { required: true, message: 'Please enter your name' },
              { min: 2, message: 'Name must be at least 2 characters' }
            ]}
          >
            <Input
              prefix={<User size={18} color="#999" />}
              placeholder="Full name"
              style={{ borderRadius: '12px', height: '50px' }}
            />
          </Form.Item>

          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Please enter your email' },
              { type: 'email', message: 'Please enter a valid email' }
            ]}
          >
            <Input
              prefix={<Mail size={18} color="#999" />}
              placeholder="Email address"
              style={{ borderRadius: '12px', height: '50px' }}
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: 'Please enter a password' },
              { min: 8, message: 'Password must be at least 8 characters' }
            ]}
          >
            <Input.Password
              prefix={<Lock size={18} color="#999" />}
              placeholder="Password (min 8 characters)"
              style={{ borderRadius: '12px', height: '50px' }}
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
              prefix={<Lock size={18} color="#999" />}
              placeholder="Confirm password"
              style={{ borderRadius: '12px', height: '50px' }}
            />
          </Form.Item>

          <Form.Item
            name="terms"
            valuePropName="checked"
            rules={[
              {
                validator: (_, value) =>
                  value ? Promise.resolve() : Promise.reject(new Error('Please accept the terms'))
              }
            ]}
          >
            <Checkbox>
              I agree to the{' '}
              <Link to="/terms" style={{ color: '#2d6a4f' }}>Terms of Service</Link>
              {' '}and{' '}
              <Link to="/privacy" style={{ color: '#2d6a4f' }}>Privacy Policy</Link>
            </Checkbox>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={loading}
              style={{
                height: '50px',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: 600
              }}
            >
              Create Account
            </Button>
          </Form.Item>
        </Form>

        <Divider plain>
          <Text type="secondary">or</Text>
        </Divider>

        <Space direction="vertical" style={{ width: '100%' }} size="middle">
          <Button
            block
            size="large"
            loading={googleLoading}
            onClick={handleGoogleSignup}
            style={{
              height: '50px',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            {!googleLoading && (
              <img
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                alt="Google"
                style={{ width: 20, height: 20 }}
              />
            )}
            {googleLoading ? 'Creating account...' : 'Continue with Google'}
          </Button>
        </Space>

        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <Text type="secondary">
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#2d6a4f', fontWeight: 600 }}>
              Sign in
            </Link>
          </Text>
        </div>
      </Card>

      {/* Google Account Selection Modal */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <img
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              alt="Google"
              style={{ width: 24, height: 24 }}
            />
            <span>Choose an account</span>
          </div>
        }
        open={googleModalVisible}
        onCancel={() => setGoogleModalVisible(false)}
        footer={null}
        centered
        width={400}
      >
        <Paragraph type="secondary" style={{ marginBottom: 16 }}>
          to continue to StayFit
        </Paragraph>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {mockGoogleAccounts.map((account) => (
            <div
              key={account.id}
              onClick={() => selectGoogleAccount(account)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '12px 16px',
                borderRadius: 8,
                cursor: 'pointer',
                border: '1px solid #e8e8e8',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#f5f5f5';
                e.currentTarget.style.borderColor = '#2d6a4f';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.borderColor = '#e8e8e8';
              }}
            >
              <img
                src={account.avatar}
                alt={account.name}
                style={{ width: 40, height: 40, borderRadius: '50%', background: '#f0f0f0' }}
              />
              <div>
                <Text strong style={{ display: 'block' }}>{account.name}</Text>
                <Text type="secondary" style={{ fontSize: 13 }}>{account.email}</Text>
              </div>
            </div>
          ))}
          <Divider style={{ margin: '12px 0' }} />
          <div
            onClick={() => {
              setGoogleModalVisible(false);
              message.info('In a real app, this would open Google\'s account picker');
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '12px 16px',
              borderRadius: 8,
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#f5f5f5'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
          >
            <div style={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              background: '#e8f0ed',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Chrome size={20} color="#2d6a4f" />
            </div>
            <Text style={{ color: '#2d6a4f' }}>Use another account</Text>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default SignUpPage;
