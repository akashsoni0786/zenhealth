import React, { useState } from 'react';
import { Card, Form, Input, Button, Typography, Divider, Space, Checkbox, message } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, UserPlus } from 'lucide-react';

const { Title, Text, Paragraph } = Typography;

const SignUpPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = (values) => {
    setLoading(true);
    // Simulate signup - in real app, this would call an API
    setTimeout(() => {
      setLoading(false);
      message.success('Account created successfully! Welcome to StayFit.');
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userEmail', values.email);
      localStorage.setItem('userName', values.name);
      navigate('/assessment');
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
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#2d6a4f', fontWeight: 600 }}>
              Sign in
            </Link>
          </Text>
        </div>
      </Card>
    </div>
  );
};

export default SignUpPage;
