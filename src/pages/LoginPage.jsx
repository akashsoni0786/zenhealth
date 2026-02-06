import React, { useState } from 'react';
import { Card, Form, Input, Button, Typography, Divider, Space, message, Modal } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn, Chrome } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const { Title, Text, Paragraph } = Typography;

// Simulated Google accounts for demo
const mockGoogleAccounts = [
  { id: 'g1', email: 'user@gmail.com', name: 'Demo User', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user1' },
  { id: 'g2', email: 'john.doe@gmail.com', name: 'John Doe', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john' },
];

const LoginPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [googleModalVisible, setGoogleModalVisible] = useState(false);
  const { login } = useAuth();

  const onFinish = (values) => {
    setLoading(true);
    // Simulate login - in real app, this would call an API
    setTimeout(() => {
      setLoading(false);
      login({ email: values.email });
      message.success('Login successful! Welcome back.');
      navigate('/');
    }, 1000);
  };

  const handleGoogleLogin = () => {
    setGoogleModalVisible(true);
  };

  const selectGoogleAccount = (account) => {
    setGoogleModalVisible(false);
    setGoogleLoading(true);

    // Simulate Google OAuth flow
    setTimeout(() => {
      setGoogleLoading(false);
      login({
        id: account.id,
        email: account.email,
        name: account.name,
        avatar: account.avatar,
        provider: 'google'
      });
      message.success(`Welcome back, ${account.name}!`);
      navigate('/');
    }, 1500);
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
            <LogIn size={32} color="#fff" />
          </div>
          <Title level={2} style={{ margin: 0, color: '#2d6a4f' }}>Welcome Back</Title>
          <Paragraph type="secondary" style={{ marginTop: 8 }}>
            Sign in to continue your wellness journey
          </Paragraph>
        </div>

        <Form
          name="login"
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
          size="large"
        >
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
              { required: true, message: 'Please enter your password' },
            ]}
          >
            <Input.Password
              prefix={<Lock size={18} color="#999" />}
              placeholder="Password"
              style={{ borderRadius: '12px', height: '50px' }}
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Link to="/forgot-password" style={{ color: '#2d6a4f' }}>
                Forgot password?
              </Link>
            </div>
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
              Sign In
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
            onClick={handleGoogleLogin}
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
            {googleLoading ? 'Signing in...' : 'Continue with Google'}
          </Button>
        </Space>

        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <Text type="secondary">
            Don't have an account?{' '}
            <Link to="/signup" style={{ color: '#2d6a4f', fontWeight: 600 }}>
              Sign up
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

export default LoginPage;
