import React from 'react';
import { Card, Row, Col, Typography, Button, Space, Tag, List, Divider } from 'antd';
import { useNavigate } from 'react-router-dom';
import { 
  ClipboardList, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight,
  UserCheck,
  Apple,
  Dumbbell
} from 'lucide-react';
import MedicalDisclaimer from '../components/MedicalDisclaimer';

const { Title, Paragraph, Text } = Typography;

const HomeDashboard = () => {
  const navigate = useNavigate();

  const mainPlans = [
    {
      title: "Yoga",
      icon: <Sparkles size={40} color="#2d6a4f" />,
      type: "yoga",
      desc: "Connect mind and body with expert-led yoga sessions.",
      color: "#f0f7f4"
    },
    {
      title: "Nutritionist",
      icon: <Apple size={40} color="#1890ff" />,
      type: "nutritionist",
      desc: "Get personalized diet plans from certified clinical nutritionists.",
      color: "#e6f7ff"
    },
    {
      title: "Gym",
      icon: <Dumbbell size={40} color="#722ed1" />,
      type: "gym",
      desc: "Reach your fitness goals with dedicated personal trainers.",
      color: "#f9f0ff"
    }
  ];

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px' }}>
      {/* Hero Section */}
      <div style={{ 
        padding: '60px 20px', 
        textAlign: 'center', 
        background: 'linear-gradient(135deg, #fdfbf7 0%, #e8f5e9 100%)', 
        borderRadius: '32px', 
        marginBottom: '60px',
        border: '1px solid #d8f3dc'
      }}>
        <Title level={1} style={{ color: '#1b5e20', fontSize: 'clamp(32px, 6vw, 56px)', fontWeight: 800 }}>
          Your Holistic Wellness Journey.
        </Title>
        <Paragraph style={{ fontSize: '18px', maxWidth: 700, margin: '0 auto 32px' }}>
          Select a goal-oriented plan and connect with top-tier professionals to transform your health.
        </Paragraph>
        <Button 
          type="primary" 
          size="large" 
          onClick={() => navigate('/assessment')}
          style={{ height: '56px', padding: '0 40px', borderRadius: '12px', fontSize: '18px' }}
        >
          Take Free Health Quiz
        </Button>
      </div>

      {/* Main Plans Section */}
      <div style={{ marginBottom: '80px' }}>
        <Title level={2} style={{ textAlign: 'center', marginBottom: '40px', color: '#2d6a4f' }}>Explore Our Specialized Plans</Title>
        <Row gutter={[24, 24]}>
          {mainPlans.map((plan) => (
            <Col xs={24} md={8} key={plan.type}>
              <Card 
                hoverable 
                variant="borderless"
                className="soft-shadow"
                style={{ 
                  height: '100%', 
                  textAlign: 'center', 
                  borderRadius: '24px', 
                  padding: '20px',
                  background: plan.color
                }}
              >
                <div style={{ marginBottom: '24px' }}>{plan.icon}</div>
                <Title level={3} style={{ marginBottom: '16px' }}>{plan.title}</Title>
                <Paragraph type="secondary" style={{ marginBottom: '32px', fontSize: '15px' }}>{plan.desc}</Paragraph>
                <Button 
                  type="primary" 
                  size="large" 
                  block 
                  onClick={() => navigate(`/experts/${plan.type}`)}
                  style={{ borderRadius: '12px', height: '50px', fontWeight: 600 }}
                >
                  Explore Experts <ArrowRight size={18} style={{ marginLeft: 8 }} />
                </Button>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/* Trust Factors */}
      <Row gutter={[32, 32]} style={{ marginBottom: '60px' }}>
        <Col span={24}>
           <Card variant="borderless" style={{ background: '#fff', borderRadius: '24px', padding: '20px' }}>
              <Row gutter={32} align="middle">
                 <Col xs={24} md={12}>
                    <Title level={2}>Why Choose ZenHealth Experts?</Title>
                    <List
                      dataSource={[
                        'Certified & Background Checked Professionals',
                        'Personalized 1-on-1 Consultation sessions',
                        'Integrated tracking with our AI Health Engine',
                        'Flexible scheduling to fit your busy life'
                      ]}
                      renderItem={item => (
                        <List.Item style={{ border: 'none', padding: '10px 0' }}>
                          <Space><CheckCircle2 size={20} color="#52c41a" /><Text style={{ fontSize: '16px' }}>{item}</Text></Space>
                        </List.Item>
                      )}
                    />
                 </Col>
                 <Col xs={24} md={12}>
                    <div style={{ textAlign: 'center' }}>
                       <UserCheck size={120} color="#2d6a4f" strokeWidth={1} />
                    </div>
                 </Col>
              </Row>
           </Card>
        </Col>
      </Row>

      <MedicalDisclaimer />
    </div>
  );
};

export default HomeDashboard;
