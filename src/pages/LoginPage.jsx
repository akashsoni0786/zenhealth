import React, { useState } from 'react';
import { Card, Form, Input, Button, Typography, Divider, Space, message } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn } from 'lucide-react';

const { Title, Text, Paragraph } = Typography;

const LoginPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = (values) => {
    setLoading(true);
    // Simulate login - in real app, this would call an API
    setTimeout(() => {
      setLoading(false);
      message.success('Login successful! Welcome back.');
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userEmail', values.email);
      navigate('/');
    }, 1000);
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
              { min: 6, message: 'Password must be at least 6 characters' }
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
            style={{
              height: '50px',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            <img
              src="https://www.google.com/favicon.ico"
              alt="Google"
              style={{ width: 20, height: 20 }}
            />
            Continue with Google
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
    </div>
  );
};

export default LoginPage;
