import { Card, Row, Col, Typography, Button, Space, List } from 'antd';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  CheckCircle2,
  UserCheck,
  Apple,
  Dumbbell,
  Users,
  ChevronRight
} from 'lucide-react';
import MedicalDisclaimer from '../components/MedicalDisclaimer';
import TopTrainersSlider from '../components/TopTrainersSlider';
import FeaturedTrainers from '../components/FeaturedTrainers';

const { Title, Paragraph, Text } = Typography;

const HomeDashboard = () => {
  const navigate = useNavigate();

  const mainPlans = [
    {
      title: "All Experts",
      icon: <Users size={40} color="#fff" />,
      type: "all",
      desc: "Browse our complete roster of certified wellness professionals across all specializations.",
      color: "linear-gradient(135deg, #1b4332 0%, #2d6a4f 100%)",
      isGradient: true,
      btnColor: '#1b4332',
      btnText: 'View All'
    },
    {
      title: "Yoga",
      icon: <Sparkles size={40} color="#1b4332" />,
      type: "yoga",
      desc: "Connect mind and body with expert-led yoga sessions.",
      color: "#e8f0ed",
      btnColor: '#1b4332',
      btnText: 'Find Instructor'
    },
    {
      title: "Nutritionist",
      icon: <Apple size={40} color="#0958d9" />,
      type: "nutritionist",
      desc: "Get personalized diet plans from certified clinical nutritionists.",
      color: "#dbeafe",
      btnColor: '#0958d9',
      btnText: 'Get Diet Plan'
    },
    {
      title: "Gym",
      icon: <Dumbbell size={40} color="#531dab" />,
      type: "gym",
      desc: "Reach your fitness goals with dedicated personal trainers.",
      color: "#f3e8ff",
      btnColor: '#531dab',
      btnText: 'Start Training'
    }
  ];

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px' }}>
      {/* Featured Trainers - Horizontal Cards (Top of Page) */}
      <FeaturedTrainers />

      {/* Hero Section */}
      <div style={{
        padding: '60px 20px',
        textAlign: 'center',
        background: 'linear-gradient(135deg, #f5f9f7 0%, #e0ebe5 100%)',
        borderRadius: '32px',
        marginBottom: '60px',
        border: '1px solid #c5d9d0',
        boxShadow: '0 8px 32px rgba(27, 67, 50, 0.1)'
      }}>
        <Title level={1} style={{ color: '#143728', fontSize: 'clamp(32px, 6vw, 56px)', fontWeight: 800 }}>
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
        <Title level={2} style={{ textAlign: 'center', marginBottom: '40px', color: '#1b4332' }}>Explore Our Specialized Plans</Title>
        <Row gutter={[24, 24]}>
          {mainPlans.map((plan) => (
            <Col xs={24} sm={12} md={6} key={plan.type}>
              <Card
                hoverable
                variant="borderless"
                className="soft-shadow"
                style={{
                  height: '100%',
                  textAlign: 'center',
                  borderRadius: '24px',
                  padding: '20px',
                  background: plan.color,
                  border: plan.isGradient ? 'none' : undefined
                }}
              >
                <div style={{ marginBottom: '24px' }}>{plan.icon}</div>
                <Title
                  level={3}
                  style={{
                    marginBottom: '16px',
                    color: plan.isGradient ? '#fff' : undefined
                  }}
                >
                  {plan.title}
                </Title>
                <Paragraph
                  style={{
                    marginBottom: '32px',
                    fontSize: '15px',
                    color: plan.isGradient ? 'rgba(255,255,255,0.85)' : undefined
                  }}
                >
                  {plan.desc}
                </Paragraph>
                <div
                  className="explore-btn"
                  onClick={() => navigate(`/experts/${plan.type}`)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    padding: '12px 20px',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    fontWeight: 600,
                    fontSize: '14px',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.25s ease',
                    width: '100%',
                    ...(plan.isGradient ? {
                      background: '#fff',
                      color: '#1b4332',
                      border: '2px solid transparent'
                    } : {
                      background: plan.btnColor,
                      color: '#fff',
                      border: '2px solid transparent'
                    })
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = `0 6px 20px ${plan.btnColor}35`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  {plan.btnText} <ChevronRight size={16} className="btn-arrow" />
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/* Top Trainers Slider */}
      <TopTrainersSlider />

      {/* Trust Factors */}
      <Row gutter={[32, 32]} style={{ marginBottom: '60px' }}>
        <Col span={24}>
           <Card variant="borderless" style={{ background: '#fff', borderRadius: '24px', padding: '20px', boxShadow: '0 8px 32px rgba(27, 67, 50, 0.1)' }}>
              <Row gutter={32} align="middle">
                 <Col xs={24} md={12}>
                    <Title level={2} style={{ color: '#1b4332' }}>Why Choose StayFit Experts?</Title>
                    <List
                      dataSource={[
                        'Certified & Background Checked Professionals',
                        'Personalized 1-on-1 Consultation sessions',
                        'Integrated tracking with our AI Health Engine',
                        'Flexible scheduling to fit your busy life'
                      ]}
                      renderItem={item => (
                        <List.Item style={{ border: 'none', padding: '10px 0' }}>
                          <Space><CheckCircle2 size={20} color="#389e0d" /><Text style={{ fontSize: '16px' }}>{item}</Text></Space>
                        </List.Item>
                      )}
                    />
                 </Col>
                 <Col xs={24} md={12}>
                    <div style={{ textAlign: 'center' }}>
                       <UserCheck size={120} color="#1b4332" strokeWidth={1} />
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
