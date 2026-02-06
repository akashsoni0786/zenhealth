import React from 'react';
import { Card, Row, Col, Typography, Button, Space, Tag, List, Divider } from 'antd';
import { CheckCircle2, XCircle, Sparkles, ChevronRight, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useHealth } from '../context/HealthContext';

const { Title, Text, Paragraph } = Typography;

const PricingPage = () => {
  const navigate = useNavigate();
  const { upgradePlan } = useHealth();

  const handleUpgrade = (level) => {
    upgradePlan(level);
    navigate('/assessment');
  };

  const plans = [
    {
      key: 'basic',
      title: "BASIC WELLNESS",
      subtitle: "Best for: Beginners & exploration users",
      price: "199",
      color: "#2d6a4f", // Main Theme Green
      bgColor: "#f0f7f4",
      included: [
        "Basic health assessment",
        "BMI calculation & interpretation",
        "Limited yoga routines (beginner level)",
        "Basic home workouts (no equipment)",
        "General diet tips (non-personalized)",
        "Lifestyle recommendations"
      ],
      notIncluded: [
        "Nutritionist access",
        "Doctor consultation",
        "AI deep analysis"
      ],
      support: "Self-guided only",
      btnText: "Get Started"
    },
    {
      key: 'active',
      title: "ACTIVE HEALTH",
      subtitle: "Best for: Fitness & lifestyle focused",
      price: "799",
      color: "#2d6a4f",
      bgColor: "#ffffff",
      recommended: true,
      included: [
        "Full health assessment (multi-level)",
        "AI-based health analysis",
        "BMI usage at every stage",
        "Personalized yoga plans",
        "Gym workouts (home + gym)",
        "Customized nutrition plan",
        "Monthly progress tracking",
        "AI Health Coach chat"
      ],
      notIncluded: [
        "Doctor consultation"
      ],
      support: "AI + Expert-designed programs",
      btnText: "Join Most Popular"
    },
    {
      key: 'total',
      title: "TOTAL CARE",
      subtitle: "Best for: Medical + Holistic support",
      price: "2499",
      color: "#1b4332", // Darker Theme Green
      bgColor: "#f0f7f4",
      included: [
        "Everything in Active Health",
        "Advanced AI health reports",
        "Doctor consultation (1–2/month)",
        "Nutritionist consultation",
        "Condition-specific yoga & workouts",
        "Supplement & medicine guidance",
        "Weekly progress review",
        "Priority AI health coach",
        "Downloadable health reports (PDF)"
      ],
      notIncluded: [],
      support: "AI + Human experts (Doctor & Nutritionist)",
      btnText: "Choose Total Care"
    }
  ];

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 20px' }}>
      <div style={{ textAlign: 'center', marginBottom: '60px' }}>
        <Title level={1} style={{ color: '#2d6a4f', fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 800 }}>
          Personalized Wellness <span style={{ color: '#74c69d' }}>Plans</span>
        </Title>
        <Paragraph style={{ fontSize: '18px', color: '#666', maxWidth: 600, margin: '0 auto' }}>
          Choose a plan that fits your health journey. Rooted in Ayurveda, powered by Science.
        </Paragraph>
      </div>

      <Row gutter={[24, 24]} justify="center" align="middle">
        {plans.map((plan) => (
          <Col xs={24} lg={plan.recommended ? 9 : 7} key={plan.title}>
            <Card 
              variant="borderless"
              className="soft-shadow"
              style={{ 
                height: '100%', 
                borderRadius: '32px', 
                background: plan.bgColor,
                border: plan.recommended ? '2px solid #2d6a4f' : '1px solid #e8f5e9',
                position: 'relative',
                transition: 'transform 0.3s ease',
                padding: '10px'
              }}
            >
              {plan.recommended && (
                <div style={{ 
                  position: 'absolute', top: '20px', right: '20px'
                }}>
                  <Tag color="#2d6a4f" style={{ borderRadius: '12px', padding: '4px 12px' }}>
                    <Sparkles size={12} style={{ marginRight: 4 }} /> MOST POPULAR
                  </Tag>
                </div>
              )}

              <div style={{ padding: '20px' }}>
                <Text strong style={{ color: '#2d6a4f', letterSpacing: '1px' }}>{plan.title}</Text>
                <div style={{ margin: '20px 0' }}>
                  <span style={{ fontSize: '40px', fontWeight: 800, color: '#1a1a1a' }}>₹{plan.price}</span>
                  <Text type="secondary">/month</Text>
                </div>
                <Paragraph type="secondary" style={{ fontSize: '13px', minHeight: '40px' }}>{plan.subtitle}</Paragraph>

                <Space direction="vertical" style={{ width: '100%', marginBottom: '32px' }} size={12}>
                  <Button
                    type={plan.recommended ? 'primary' : 'default'}
                    size="large"
                    block
                    onClick={() => handleUpgrade(plan.key)}
                    style={{
                      height: '50px',
                      borderRadius: '12px',
                      fontWeight: 600,
                      background: plan.recommended ? '#2d6a4f' : 'transparent',
                      borderColor: '#2d6a4f',
                      color: plan.recommended ? '#fff' : '#2d6a4f'
                    }}
                  >
                    {plan.btnText}
                  </Button>
                  {(plan.key === 'active' || plan.key === 'total') && (
                    <Button
                      type="text"
                      block
                      icon={<Eye size={16} />}
                      onClick={() => navigate(`/pricing/${plan.key}`)}
                      style={{
                        height: '40px',
                        borderRadius: '10px',
                        color: '#2d6a4f'
                      }}
                    >
                      View All Features
                    </Button>
                  )}
                </Space>

                <Title level={5} style={{ marginBottom: '16px', fontSize: '12px', color: '#8c8c8c' }}>WHAT'S INCLUDED:</Title>
                <List
                  dataSource={plan.included}
                  renderItem={(item) => (
                    <List.Item style={{ border: 'none', padding: '6px 0' }}>
                      <Space align="start">
                        <CheckCircle2 size={16} color="#2d6a4f" style={{ marginTop: 4 }} />
                        <Text style={{ fontSize: '14px' }}>{item}</Text>
                      </Space>
                    </List.Item>
                  )}
                />

                {plan.notIncluded.length > 0 && (
                  <List
                    dataSource={plan.notIncluded}
                    renderItem={(item) => (
                      <List.Item style={{ border: 'none', padding: '6px 0', opacity: 0.4 }}>
                        <Space align="start">
                          <XCircle size={16} color="#ff4d4f" style={{ marginTop: 4 }} />
                          <Text delete style={{ fontSize: '14px' }}>{item}</Text>
                        </Space>
                      </List.Item>
                    )}
                  />
                )}
                
                <Divider style={{ margin: '24px 0' }} />
                
                <div>
                  <Text strong style={{ fontSize: '12px' }}>SUPPORT: </Text>
                  <Text type="secondary" style={{ fontSize: '12px' }}>{plan.support}</Text>
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      <div style={{ marginTop: '80px', textAlign: 'center' }}>
        <Card variant="borderless" style={{ background: '#fdfbf7', borderRadius: '24px', padding: '20px' }}>
          <Title level={4}>Secure Health Journey</Title>
          <Paragraph type="secondary">Payments are processed securely. Cancel or upgrade your plan anytime from your profile.</Paragraph>
          <Space>
            <Tag color="green">SSL Secure</Tag>
            <Tag color="green">Encrypted Data</Tag>
            <Tag color="green">Private Coaching</Tag>
          </Space>
        </Card>
      </div>
    </div>
  );
};

export default PricingPage;
