import React, { useState } from 'react';
import { Card, Row, Col, Typography, Button, Space, Tag, List, Divider, Avatar, Collapse, Badge, Tabs } from 'antd';
import { useNavigate } from 'react-router-dom';
import {
  CheckCircle2,
  Star,
  Heart,
  Brain,
  Dumbbell,
  Salad,
  LineChart,
  MessageSquare,
  Stethoscope,
  Apple,
  FileText,
  Shield,
  Award,
  ArrowLeft,
  Users,
  Crown,
  Clock,
  Video,
  Download,
  HeartPulse,
  Pill
} from 'lucide-react';
import { useHealth } from '../context/HealthContext';
import './TotalCarePlanPage.css';

const { Title, Text, Paragraph } = Typography;

const TotalCarePlanPage = () => {
  const navigate = useNavigate();
  const { upgradePlan } = useHealth();
  const [activeTab, setActiveTab] = useState('overview');

  const handleUpgrade = () => {
    upgradePlan('total');
    navigate('/assessment');
  };

  const expertTeam = [
    {
      name: 'Dr. Arun Mehta',
      role: 'Medical Director',
      specialty: 'Internal Medicine',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=doctor1',
      experience: '15+ years'
    },
    {
      name: 'Dr. Priya Sharma',
      role: 'Wellness Expert',
      specialty: 'Ayurvedic Medicine',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=doctor2',
      experience: '12+ years'
    },
    {
      name: 'Neha Gupta',
      role: 'Chief Nutritionist',
      specialty: 'Clinical Nutrition',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=nutritionist1',
      experience: '10+ years'
    },
    {
      name: 'Rohit Kumar',
      role: 'Fitness Director',
      specialty: 'Sports Medicine',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=trainer1',
      experience: '8+ years'
    }
  ];

  const premiumFeatures = [
    {
      icon: <Stethoscope size={32} color="#1b4332" />,
      title: 'Doctor Consultations',
      description: 'Get 1-2 video consultations per month with our certified doctors.',
      highlights: ['Video consultations', 'Follow-up support', 'Medical guidance', 'Prescription support']
    },
    {
      icon: <Apple size={32} color="#1b4332" />,
      title: 'Nutritionist Access',
      description: 'Personalized nutrition guidance from certified nutritionists.',
      highlights: ['Diet planning', 'Meal customization', 'Supplement advice', 'Dietary restrictions']
    },
    {
      icon: <HeartPulse size={32} color="#1b4332" />,
      title: 'Condition-Specific Plans',
      description: 'Specialized yoga and workout plans for specific health conditions.',
      highlights: ['Diabetes management', 'PCOS/PCOD support', 'Thyroid care', 'Heart health']
    },
    {
      icon: <Pill size={32} color="#1b4332" />,
      title: 'Supplement Guidance',
      description: 'Expert recommendations for supplements and medicines.',
      highlights: ['Vitamin assessment', 'Supplement timing', 'Interaction checks', 'Natural alternatives']
    },
    {
      icon: <LineChart size={32} color="#1b4332" />,
      title: 'Weekly Progress Review',
      description: 'Detailed weekly analysis of your health journey.',
      highlights: ['Weekly check-ins', 'Progress reports', 'Plan adjustments', 'Goal tracking']
    },
    {
      icon: <FileText size={32} color="#1b4332" />,
      title: 'Downloadable Reports',
      description: 'Get comprehensive PDF health reports for your records.',
      highlights: ['Health summaries', 'Progress charts', 'Medical history', 'Share with doctors']
    }
  ];

  const conditions = [
    { name: 'Diabetes Management', icon: '🩸', users: '2,500+' },
    { name: 'Weight Management', icon: '⚖️', users: '5,000+' },
    { name: 'PCOS/PCOD', icon: '🌸', users: '1,800+' },
    { name: 'Thyroid Care', icon: '🦋', users: '2,200+' },
    { name: 'Heart Health', icon: '❤️', users: '1,500+' },
    { name: 'Stress & Anxiety', icon: '🧘', users: '3,000+' },
    { name: 'Back Pain', icon: '🦴', users: '2,800+' },
    { name: 'Digestive Health', icon: '🌿', users: '1,900+' }
  ];

  const testimonials = [
    {
      name: 'Sunita Verma',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sunita',
      rating: 5,
      condition: 'Diabetes Management',
      text: 'My HbA1c dropped from 8.5 to 6.8 in 4 months. The doctor consultations and personalized diet plan made all the difference!',
      achievement: 'HbA1c: 8.5 → 6.8'
    },
    {
      name: 'Vikram Singh',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=vikram',
      rating: 5,
      condition: 'Weight Loss',
      text: 'Lost 25 kgs with the complete support of doctors and nutritionists. The weekly reviews kept me accountable.',
      achievement: 'Lost 25 kg'
    },
    {
      name: 'Meera Reddy',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=meera',
      rating: 5,
      condition: 'PCOS Management',
      text: 'Finally found a holistic approach to managing my PCOS. The condition-specific yoga and diet plans worked wonders!',
      achievement: 'PCOS symptoms reduced 80%'
    }
  ];

  const faqItems = [
    {
      key: '1',
      label: 'How do doctor consultations work?',
      children: 'You get 1-2 video consultations per month with our certified doctors. Appointments can be booked through the app, and you can choose from available time slots. Follow-up queries are addressed through the AI coach or scheduled follow-ups.'
    },
    {
      key: '2',
      label: 'What conditions do you support?',
      children: 'We provide specialized plans for diabetes, PCOS/PCOD, thyroid disorders, heart health, weight management, stress & anxiety, back pain, digestive issues, and more. Our experts create condition-specific workout, yoga, and nutrition plans.'
    },
    {
      key: '3',
      label: 'Can I download my health reports?',
      children: 'Yes! Total Care members can download comprehensive PDF reports including health summaries, progress charts, and medical history. These reports can be shared with your personal doctor or kept for your records.'
    },
    {
      key: '4',
      label: 'How often will my plan be reviewed?',
      children: 'Your plan is reviewed weekly by our AI system and monthly by our expert team. You\'ll receive progress reports every week, and your workout/nutrition plans are adjusted based on your progress and feedback.'
    },
    {
      key: '5',
      label: 'Is supplement guidance included?',
      children: 'Yes, our doctors and nutritionists provide personalized supplement recommendations based on your health assessment and blood work (if available). We also check for interactions and suggest natural alternatives when possible.'
    }
  ];

  const comparisonData = [
    { feature: 'Health Assessment', active: 'Full Multi-level', total: 'Advanced + Medical' },
    { feature: 'AI Health Analysis', active: true, total: 'Advanced Reports' },
    { feature: 'Workout Plans', active: 'Home + Gym', total: 'Condition-specific' },
    { feature: 'Nutrition Plan', active: 'Personalized', total: 'Expert-guided' },
    { feature: 'Yoga Plans', active: 'Personalized', total: 'Condition-specific' },
    { feature: 'Progress Tracking', active: 'Monthly', total: 'Weekly' },
    { feature: 'AI Health Coach', active: 'Standard', total: 'Priority Access' },
    { feature: 'Doctor Consultation', active: false, total: '1-2/month' },
    { feature: 'Nutritionist Access', active: false, total: true },
    { feature: 'Supplement Guidance', active: false, total: true },
    { feature: 'Downloadable Reports', active: false, total: true }
  ];

  return (
    <div className="total-plan-page">
      {/* Hero Section */}
      <div className="plan-hero premium">
        <Button
          type="text"
          icon={<ArrowLeft size={20} />}
          onClick={() => navigate('/pricing')}
          className="back-btn"
        >
          Back to Plans
        </Button>

        <div className="hero-content">
          <Tag className="plan-badge premium-badge">
            <Crown size={14} /> PREMIUM PLAN
          </Tag>
          <Title level={1} className="hero-title">
            Total Care Plan
          </Title>
          <Paragraph className="hero-subtitle">
            Complete medical and holistic wellness support with doctor consultations,
            nutritionist access, and condition-specific care plans.
          </Paragraph>

          <div className="price-section">
            <div className="price">
              <span className="currency">₹</span>
              <span className="amount">2499</span>
              <span className="period">/month</span>
            </div>
            <Text style={{ color: 'rgba(255,255,255,0.7)' }}>Includes doctor & nutritionist consultations</Text>
          </div>

          <Space size="middle" className="hero-actions">
            <Button type="primary" size="large" onClick={handleUpgrade} className="cta-btn premium">
              <Crown size={16} /> Upgrade to Total Care
            </Button>
            <Button size="large" onClick={() => setActiveTab('features')}>
              Explore Features
            </Button>
          </Space>

          <div className="trust-badges">
            <div className="badge">
              <Stethoscope size={16} />
              <span>Certified Doctors</span>
            </div>
            <div className="badge">
              <Users size={16} />
              <span>5,000+ Premium Members</span>
            </div>
            <div className="badge">
              <Star size={16} fill="#faad14" color="#faad14" />
              <span>4.9 Rating</span>
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
            { key: 'features', label: 'Premium Features' },
            { key: 'experts', label: 'Expert Team' },
            { key: 'conditions', label: 'Conditions We Support' },
            { key: 'comparison', label: 'Compare with Active' },
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
                <Card className="overview-card premium-card">
                  <Badge.Ribbon text="Premium" color="#1b4332">
                    <div style={{ padding: '8px 0' }}>
                      <Title level={3}>Everything in Active Health, Plus...</Title>
                      <Paragraph type="secondary">
                        Total Care is our most comprehensive plan, combining AI-powered fitness with
                        human expert guidance for complete health transformation.
                      </Paragraph>
                    </div>
                  </Badge.Ribbon>

                  <List
                    className="premium-list"
                    dataSource={[
                      { text: 'Doctor consultations (1-2/month)', premium: true },
                      { text: 'Nutritionist consultations', premium: true },
                      { text: 'Condition-specific yoga & workouts', premium: true },
                      { text: 'Supplement & medicine guidance', premium: true },
                      { text: 'Weekly progress review', premium: true },
                      { text: 'Priority AI health coach', premium: true },
                      { text: 'Downloadable health reports (PDF)', premium: true },
                      { text: 'Advanced AI health analysis', premium: false },
                      { text: 'Personalized workout & nutrition plans', premium: false }
                    ]}
                    renderItem={(item) => (
                      <List.Item>
                        <Space>
                          <CheckCircle2 size={20} color="#52c41a" />
                          <Text>{item.text}</Text>
                          {item.premium && <Tag color="gold">Premium</Tag>}
                        </Space>
                      </List.Item>
                    )}
                  />
                </Card>

                <Card className="stats-card">
                  <Title level={4}>Total Care Impact</Title>
                  <Row gutter={[24, 24]}>
                    <Col xs={12} md={6}>
                      <div className="stat-item">
                        <div className="stat-value premium">94%</div>
                        <Text type="secondary">Goal Achievement</Text>
                      </div>
                    </Col>
                    <Col xs={12} md={6}>
                      <div className="stat-item">
                        <div className="stat-value premium">6.2kg</div>
                        <Text type="secondary">Avg. Weight Loss/mo</Text>
                      </div>
                    </Col>
                    <Col xs={12} md={6}>
                      <div className="stat-item">
                        <div className="stat-value premium">97%</div>
                        <Text type="secondary">User Satisfaction</Text>
                      </div>
                    </Col>
                    <Col xs={12} md={6}>
                      <div className="stat-item">
                        <div className="stat-value premium">89%</div>
                        <Text type="secondary">Condition Improvement</Text>
                      </div>
                    </Col>
                  </Row>
                </Card>
              </Col>

              <Col xs={24} lg={8}>
                <Card className="consultation-card">
                  <Title level={4}><Video size={20} /> Consultation Includes</Title>
                  <List
                    dataSource={[
                      '1-2 doctor video calls/month',
                      'Nutritionist sessions',
                      'Follow-up support',
                      'Prescription guidance',
                      'Lab test recommendations'
                    ]}
                    renderItem={(item) => (
                      <List.Item style={{ border: 'none', padding: '8px 0' }}>
                        <Space>
                          <CheckCircle2 size={16} color="#52c41a" />
                          <Text>{item}</Text>
                        </Space>
                      </List.Item>
                    )}
                  />
                  <Divider />
                  <Title level={4}><Download size={20} /> Reports Include</Title>
                  <List
                    dataSource={[
                      'Weekly progress reports',
                      'Monthly health summaries',
                      'Downloadable PDFs',
                      'Shareable with doctors'
                    ]}
                    renderItem={(item) => (
                      <List.Item style={{ border: 'none', padding: '8px 0' }}>
                        <Space>
                          <CheckCircle2 size={16} color="#52c41a" />
                          <Text>{item}</Text>
                        </Space>
                      </List.Item>
                    )}
                  />
                  <Button type="primary" block size="large" onClick={handleUpgrade} style={{ marginTop: 24, background: '#1b4332' }}>
                    <Crown size={16} /> Get Total Care
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
              {premiumFeatures.map((feature, index) => (
                <Col xs={24} md={12} lg={8} key={index}>
                  <Card className="feature-card premium-feature" hoverable>
                    <div className="feature-icon premium">{feature.icon}</div>
                    <Title level={4}>{feature.title}</Title>
                    <Paragraph type="secondary">{feature.description}</Paragraph>
                    <Divider />
                    <List
                      size="small"
                      dataSource={feature.highlights}
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

        {/* Expert Team Tab */}
        {activeTab === 'experts' && (
          <div className="experts-section">
            <Title level={3} style={{ textAlign: 'center', marginBottom: 40 }}>
              Meet Your Health Team
            </Title>
            <Row gutter={[24, 24]} justify="center">
              {expertTeam.map((expert, index) => (
                <Col xs={24} sm={12} md={6} key={index}>
                  <Card className="expert-card" hoverable>
                    <Avatar size={100} src={expert.image} />
                    <Title level={5} style={{ marginTop: 16, marginBottom: 4 }}>{expert.name}</Title>
                    <Tag color="#1b4332">{expert.role}</Tag>
                    <Text type="secondary" style={{ display: 'block', marginTop: 8 }}>{expert.specialty}</Text>
                    <Text style={{ fontSize: 12, color: '#52c41a' }}>{expert.experience} experience</Text>
                  </Card>
                </Col>
              ))}
            </Row>
            <Card className="team-cta-card">
              <Row align="middle" gutter={[24, 24]}>
                <Col xs={24} md={16}>
                  <Title level={4} style={{ margin: 0 }}>Get Personal Access to Our Expert Team</Title>
                  <Text type="secondary">
                    Total Care members get direct access to doctors and nutritionists for personalized guidance.
                  </Text>
                </Col>
                <Col xs={24} md={8} style={{ textAlign: 'right' }}>
                  <Button type="primary" size="large" onClick={handleUpgrade} style={{ background: '#1b4332' }}>
                    Upgrade Now
                  </Button>
                </Col>
              </Row>
            </Card>
          </div>
        )}

        {/* Conditions Tab */}
        {activeTab === 'conditions' && (
          <div className="conditions-section">
            <Title level={3} style={{ textAlign: 'center', marginBottom: 16 }}>
              Conditions We Support
            </Title>
            <Paragraph style={{ textAlign: 'center', maxWidth: 600, margin: '0 auto 40px' }} type="secondary">
              Our experts create specialized plans for various health conditions, combining modern medicine with holistic wellness.
            </Paragraph>
            <Row gutter={[20, 20]}>
              {conditions.map((condition, index) => (
                <Col xs={12} md={6} key={index}>
                  <Card className="condition-card" hoverable>
                    <div className="condition-icon">{condition.icon}</div>
                    <Title level={5}>{condition.name}</Title>
                    <Text type="secondary">{condition.users} users</Text>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        )}

        {/* Comparison Tab */}
        {activeTab === 'comparison' && (
          <div className="comparison-section">
            <Card className="comparison-card premium">
              <div className="comparison-table">
                <div className="comparison-header">
                  <div className="feature-col">Features</div>
                  <div className="plan-col">Active Health</div>
                  <div className="plan-col premium-col">Total Care</div>
                </div>
                {comparisonData.map((row, index) => (
                  <div className="comparison-row" key={index}>
                    <div className="feature-col">{row.feature}</div>
                    <div className="plan-col">
                      {typeof row.active === 'boolean' ? (
                        row.active ? <CheckCircle2 size={18} color="#52c41a" /> : <span className="not-included">-</span>
                      ) : row.active}
                    </div>
                    <div className="plan-col premium-col">
                      {typeof row.total === 'boolean' ? (
                        row.total ? <CheckCircle2 size={18} color="#52c41a" /> : <span className="not-included">-</span>
                      ) : <strong>{row.total}</strong>}
                    </div>
                  </div>
                ))}
              </div>

              <div className="comparison-footer">
                <div className="price-compare">
                  <div className="price-item">
                    <Text type="secondary">Active Health</Text>
                    <Text strong>₹799/mo</Text>
                  </div>
                  <div className="price-item premium">
                    <Text>Total Care</Text>
                    <Text strong style={{ fontSize: 24, color: '#1b4332' }}>₹2499/mo</Text>
                    <Tag color="gold"><Crown size={12} /> Best for Medical Support</Tag>
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
                  <Card className="testimonial-card premium">
                    <Tag color="blue" style={{ marginBottom: 16 }}>{testimonial.condition}</Tag>
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

            <Card className="cta-card premium">
              <Crown size={40} color="#1b4332" />
              <Title level={3}>Ready for Complete Health Transformation?</Title>
              <Paragraph>Join thousands who have achieved their health goals with Total Care's expert support.</Paragraph>
              <Button type="primary" size="large" onClick={handleUpgrade} style={{ background: '#1b4332' }}>
                <Crown size={16} /> Start Total Care Journey
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
        <Card className="cta-banner premium">
          <Row align="middle" gutter={[24, 24]}>
            <Col xs={24} md={16}>
              <Title level={3} style={{ margin: 0, color: '#fff' }}>
                <Crown size={24} /> Get Complete Health Support
              </Title>
              <Text style={{ color: 'rgba(255,255,255,0.85)' }}>
                Doctor consultations, nutritionist access, and personalized care for ₹2499/month
              </Text>
            </Col>
            <Col xs={24} md={8} style={{ textAlign: 'right' }}>
              <Button size="large" onClick={handleUpgrade} style={{ background: '#fff', color: '#1b4332', fontWeight: 600 }}>
                Upgrade to Total Care
              </Button>
            </Col>
          </Row>
        </Card>
      </div>
    </div>
  );
};

export default TotalCarePlanPage;
