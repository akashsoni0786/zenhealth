import React, { useState } from 'react';
import { Card, Row, Col, Typography, Button, Space, Tag, List, Divider, Progress, Tabs, Avatar, Collapse } from 'antd';
import { useNavigate } from 'react-router-dom';
import {
  CheckCircle2,
  Star,
  Zap,
  Heart,
  Brain,
  Dumbbell,
  Salad,
  LineChart,
  MessageSquare,
  Calendar,
  Clock,
  Target,
  TrendingUp,
  Award,
  ArrowLeft,
  Play,
  Users,
  Sparkles
} from 'lucide-react';
import { useHealth } from '../context/HealthContext';
import './ActivePlanPage.css';

const { Title, Text, Paragraph } = Typography;

const ActivePlanPage = () => {
  const navigate = useNavigate();
  const { upgradePlan } = useHealth();
  const [activeTab, setActiveTab] = useState('overview');

  const handleUpgrade = () => {
    upgradePlan('active');
    navigate('/assessment');
  };

  const features = [
    {
      icon: <Brain size={32} color="#2d6a4f" />,
      title: 'AI-Based Health Analysis',
      description: 'Advanced algorithms analyze your health data to provide personalized insights and recommendations.',
      details: ['Body composition analysis', 'Health risk assessment', 'Lifestyle pattern recognition', 'Smart goal setting']
    },
    {
      icon: <Dumbbell size={32} color="#2d6a4f" />,
      title: 'Personalized Workout Plans',
      description: 'Custom gym and home workouts designed for your fitness level and goals.',
      details: ['Home workouts (no equipment)', 'Gym workout routines', 'Progressive difficulty', 'Video demonstrations']
    },
    {
      icon: <Salad size={32} color="#2d6a4f" />,
      title: 'Customized Nutrition Plan',
      description: 'Balanced meal plans tailored to your dietary preferences and health goals.',
      details: ['Calorie-optimized meals', 'Macro tracking', 'Recipe suggestions', 'Grocery lists']
    },
    {
      icon: <Heart size={32} color="#2d6a4f" />,
      title: 'Personalized Yoga Plans',
      description: 'Yoga routines designed for your body type and wellness objectives.',
      details: ['Morning routines', 'Stress relief sessions', 'Flexibility programs', 'Meditation guides']
    },
    {
      icon: <LineChart size={32} color="#2d6a4f" />,
      title: 'Monthly Progress Tracking',
      description: 'Comprehensive tracking of your health journey with visual insights.',
      details: ['Weight & BMI tracking', 'Workout completion rates', 'Health score trends', 'Goal achievement metrics']
    },
    {
      icon: <MessageSquare size={32} color="#2d6a4f" />,
      title: 'AI Health Coach Chat',
      description: '24/7 access to our AI health assistant for instant guidance and support.',
      details: ['Instant health queries', 'Workout suggestions', 'Diet recommendations', 'Motivation & tips']
    }
  ];

  const testimonials = [
    {
      name: 'Rahul Sharma',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=rahul',
      rating: 5,
      text: 'Lost 12 kgs in 3 months with the personalized workout and nutrition plans!',
      achievement: 'Lost 12 kg'
    },
    {
      name: 'Priya Patel',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=priya',
      rating: 5,
      text: 'The AI coach helped me stay consistent with my fitness routine. Best investment!',
      achievement: 'Fitness Streak: 90 days'
    },
    {
      name: 'Amit Kumar',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=amit',
      rating: 5,
      text: 'Yoga plans helped me manage my back pain. Feeling healthier than ever!',
      achievement: 'Pain-free living'
    }
  ];

  const faqItems = [
    {
      key: '1',
      label: 'How does the AI health analysis work?',
      children: 'Our AI analyzes your health assessment responses, BMI, lifestyle factors, and progress data to create personalized recommendations. It continuously learns from your feedback to improve suggestions.'
    },
    {
      key: '2',
      label: 'Can I switch between home and gym workouts?',
      children: 'Yes! The Active Health plan includes both home workouts (requiring no equipment) and gym workouts. You can switch between them based on your preferences and availability.'
    },
    {
      key: '3',
      label: 'How often are nutrition plans updated?',
      children: 'Your nutrition plan is updated monthly based on your progress and changing goals. You can also request modifications anytime through the AI Health Coach.'
    },
    {
      key: '4',
      label: 'Is the AI Health Coach available 24/7?',
      children: 'Yes, our AI Health Coach is available round the clock to answer your health queries, provide workout suggestions, and offer motivation whenever you need it.'
    }
  ];

  const comparisonData = [
    { feature: 'Health Assessment', basic: 'Basic', active: 'Full Multi-level', total: 'Advanced' },
    { feature: 'AI Analysis', basic: false, active: true, total: true },
    { feature: 'Workout Plans', basic: 'Limited', active: 'Full (Home + Gym)', total: 'Full + Condition-specific' },
    { feature: 'Nutrition Plan', basic: 'General Tips', active: 'Personalized', total: 'Personalized + Expert' },
    { feature: 'Yoga Plans', basic: 'Beginner Only', active: 'Personalized', total: 'Condition-specific' },
    { feature: 'Progress Tracking', basic: false, active: 'Monthly', total: 'Weekly' },
    { feature: 'AI Health Coach', basic: false, active: true, total: 'Priority' },
    { feature: 'Expert Consultation', basic: false, active: false, total: 'Doctor + Nutritionist' }
  ];

  return (
    <div className="active-plan-page">
      {/* Hero Section */}
      <div className="plan-hero">
        <Button
          type="text"
          icon={<ArrowLeft size={20} />}
          onClick={() => navigate('/pricing')}
          className="back-btn"
        >
          Back to Plans
        </Button>

        <div className="hero-content">
          <Tag color="#2d6a4f" className="plan-badge">
            <Sparkles size={14} /> MOST POPULAR
          </Tag>
          <Title level={1} className="hero-title">
            Active Health Plan
          </Title>
          <Paragraph className="hero-subtitle">
            Transform your fitness journey with AI-powered personalization,
            custom workout plans, and nutrition guidance designed for your goals.
          </Paragraph>

          <div className="price-section">
            <div className="price">
              <span className="currency">₹</span>
              <span className="amount">799</span>
              <span className="period">/month</span>
            </div>
            <Text type="secondary">Billed monthly. Cancel anytime.</Text>
          </div>

          <Space size="middle" className="hero-actions">
            <Button type="primary" size="large" onClick={handleUpgrade} className="cta-btn">
              Start Your Journey
            </Button>
            <Button size="large" onClick={() => setActiveTab('features')}>
              Explore Features
            </Button>
          </Space>

          <div className="trust-badges">
            <div className="badge">
              <Users size={16} />
              <span>10,000+ Active Users</span>
            </div>
            <div className="badge">
              <Star size={16} fill="#faad14" color="#faad14" />
              <span>4.8 Rating</span>
            </div>
            <div className="badge">
              <Award size={16} />
              <span>Expert Designed</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="plan-tabs-container">
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          centered
          items={[
            { key: 'overview', label: 'Overview' },
            { key: 'features', label: 'All Features' },
            { key: 'comparison', label: 'Compare Plans' },
            { key: 'testimonials', label: 'Success Stories' },
            { key: 'faq', label: 'FAQ' }
          ]}
        />
      </div>

      <div className="plan-content">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="overview-section">
            <Row gutter={[32, 32]}>
              <Col xs={24} lg={16}>
                <Card className="overview-card">
                  <Title level={3}>What You Get</Title>
                  <Paragraph type="secondary">
                    The Active Health plan is designed for fitness enthusiasts who want a comprehensive,
                    AI-driven approach to health and wellness.
                  </Paragraph>

                  <List
                    className="included-list"
                    dataSource={[
                      'Full health assessment (multi-level)',
                      'AI-based health analysis',
                      'BMI tracking at every stage',
                      'Personalized yoga plans',
                      'Gym workouts (home + gym options)',
                      'Customized nutrition plan',
                      'Monthly progress tracking',
                      'AI Health Coach chat (24/7)'
                    ]}
                    renderItem={(item) => (
                      <List.Item>
                        <Space>
                          <CheckCircle2 size={20} color="#52c41a" />
                          <Text>{item}</Text>
                        </Space>
                      </List.Item>
                    )}
                  />
                </Card>

                <Card className="stats-card">
                  <Title level={4}>Plan Impact</Title>
                  <Row gutter={[24, 24]}>
                    <Col xs={12} md={6}>
                      <div className="stat-item">
                        <div className="stat-value">85%</div>
                        <Text type="secondary">Goal Achievement</Text>
                      </div>
                    </Col>
                    <Col xs={12} md={6}>
                      <div className="stat-item">
                        <div className="stat-value">4.2kg</div>
                        <Text type="secondary">Avg. Weight Loss/mo</Text>
                      </div>
                    </Col>
                    <Col xs={12} md={6}>
                      <div className="stat-item">
                        <div className="stat-value">92%</div>
                        <Text type="secondary">User Satisfaction</Text>
                      </div>
                    </Col>
                    <Col xs={12} md={6}>
                      <div className="stat-item">
                        <div className="stat-value">78%</div>
                        <Text type="secondary">Fitness Improvement</Text>
                      </div>
                    </Col>
                  </Row>
                </Card>
              </Col>

              <Col xs={24} lg={8}>
                <Card className="quick-start-card">
                  <Title level={4}>Quick Start Guide</Title>
                  <div className="steps-list">
                    <div className="step">
                      <div className="step-number">1</div>
                      <div className="step-content">
                        <Text strong>Complete Health Assessment</Text>
                        <Text type="secondary">Answer questions about your health</Text>
                      </div>
                    </div>
                    <div className="step">
                      <div className="step-number">2</div>
                      <div className="step-content">
                        <Text strong>Get Your Health Score</Text>
                        <Text type="secondary">AI analyzes your responses</Text>
                      </div>
                    </div>
                    <div className="step">
                      <div className="step-number">3</div>
                      <div className="step-content">
                        <Text strong>Receive Personalized Plan</Text>
                        <Text type="secondary">Custom workouts & nutrition</Text>
                      </div>
                    </div>
                    <div className="step">
                      <div className="step-number">4</div>
                      <div className="step-content">
                        <Text strong>Track & Improve</Text>
                        <Text type="secondary">Monitor progress monthly</Text>
                      </div>
                    </div>
                  </div>
                  <Button type="primary" block size="large" onClick={handleUpgrade} style={{ marginTop: 24 }}>
                    Get Started Now
                  </Button>
                </Card>
              </Col>
            </Row>
          </div>
        )}

        {/* Features Tab */}
        {activeTab === 'features' && (
          <div className="features-section">
            <Row gutter={[24, 24]}>
              {features.map((feature, index) => (
                <Col xs={24} md={12} lg={8} key={index}>
                  <Card className="feature-card" hoverable>
                    <div className="feature-icon">{feature.icon}</div>
                    <Title level={4}>{feature.title}</Title>
                    <Paragraph type="secondary">{feature.description}</Paragraph>
                    <Divider />
                    <List
                      size="small"
                      dataSource={feature.details}
                      renderItem={(item) => (
                        <List.Item style={{ border: 'none', padding: '4px 0' }}>
                          <Space>
                            <CheckCircle2 size={14} color="#52c41a" />
                            <Text style={{ fontSize: 13 }}>{item}</Text>
                          </Space>
                        </List.Item>
                      )}
                    />
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        )}

        {/* Comparison Tab */}
        {activeTab === 'comparison' && (
          <div className="comparison-section">
            <Card className="comparison-card">
              <div className="comparison-table">
                <div className="comparison-header">
                  <div className="feature-col">Features</div>
                  <div className="plan-col">Basic</div>
                  <div className="plan-col active-col">Active Health</div>
                  <div className="plan-col">Total Care</div>
                </div>
                {comparisonData.map((row, index) => (
                  <div className="comparison-row" key={index}>
                    <div className="feature-col">{row.feature}</div>
                    <div className="plan-col">
                      {typeof row.basic === 'boolean' ? (
                        row.basic ? <CheckCircle2 size={18} color="#52c41a" /> : <span className="not-included">-</span>
                      ) : row.basic}
                    </div>
                    <div className="plan-col active-col">
                      {typeof row.active === 'boolean' ? (
                        row.active ? <CheckCircle2 size={18} color="#52c41a" /> : <span className="not-included">-</span>
                      ) : <strong>{row.active}</strong>}
                    </div>
                    <div className="plan-col">
                      {typeof row.total === 'boolean' ? (
                        row.total ? <CheckCircle2 size={18} color="#52c41a" /> : <span className="not-included">-</span>
                      ) : row.total}
                    </div>
                  </div>
                ))}
              </div>

              <div className="comparison-footer">
                <div className="price-compare">
                  <div className="price-item">
                    <Text type="secondary">Basic</Text>
                    <Text strong>₹199/mo</Text>
                  </div>
                  <div className="price-item active">
                    <Text>Active Health</Text>
                    <Text strong style={{ fontSize: 20, color: '#2d6a4f' }}>₹799/mo</Text>
                    <Tag color="#2d6a4f">Best Value</Tag>
                  </div>
                  <div className="price-item">
                    <Text type="secondary">Total Care</Text>
                    <Text strong>₹2499/mo</Text>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Testimonials Tab */}
        {activeTab === 'testimonials' && (
          <div className="testimonials-section">
            <Row gutter={[24, 24]}>
              {testimonials.map((testimonial, index) => (
                <Col xs={24} md={8} key={index}>
                  <Card className="testimonial-card">
                    <div className="testimonial-header">
                      <Avatar size={56} src={testimonial.avatar} />
                      <div>
                        <Text strong>{testimonial.name}</Text>
                        <div className="rating">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <Star key={i} size={14} fill="#faad14" color="#faad14" />
                          ))}
                        </div>
                      </div>
                    </div>
                    <Paragraph className="testimonial-text">"{testimonial.text}"</Paragraph>
                    <Tag color="green" className="achievement-tag">
                      <Award size={12} /> {testimonial.achievement}
                    </Tag>
                  </Card>
                </Col>
              ))}
            </Row>

            <Card className="cta-card">
              <Title level={3}>Ready to Transform Your Health?</Title>
              <Paragraph>Join thousands of users who have achieved their fitness goals with Active Health.</Paragraph>
              <Button type="primary" size="large" onClick={handleUpgrade}>
                Start Your Journey Today
              </Button>
            </Card>
          </div>
        )}

        {/* FAQ Tab */}
        {activeTab === 'faq' && (
          <div className="faq-section">
            <Card className="faq-card">
              <Title level={3}>Frequently Asked Questions</Title>
              <Collapse
                items={faqItems}
                defaultActiveKey={['1']}
                expandIconPosition="end"
              />
            </Card>
          </div>
        )}
      </div>

      {/* Bottom CTA */}
      <div className="bottom-cta">
        <Card className="cta-banner">
          <Row align="middle" gutter={[24, 24]}>
            <Col xs={24} md={16}>
              <Title level={3} style={{ margin: 0, color: '#fff' }}>
                Start Your Active Health Journey Today
              </Title>
              <Text style={{ color: 'rgba(255,255,255,0.85)' }}>
                Get personalized workouts, nutrition plans, and AI coaching for just ₹799/month
              </Text>
            </Col>
            <Col xs={24} md={8} style={{ textAlign: 'right' }}>
              <Button size="large" onClick={handleUpgrade} style={{ background: '#fff', color: '#2d6a4f', fontWeight: 600 }}>
                Get Started Now
              </Button>
            </Col>
          </Row>
        </Card>
      </div>
    </div>
  );
};

export default ActivePlanPage;
