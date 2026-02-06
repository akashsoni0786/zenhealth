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
    <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 24px' }}>
      {/* Featured Trainers - Horizontal Cards (Top of Page) */}
      <FeaturedTrainers />

      {/* Hero Banner Section */}
      <div style={{
        padding: '48px 80px',
        background: 'linear-gradient(135deg, #1b4332 0%, #2d6a4f 50%, #40916c 100%)',
        borderRadius: '24px',
        marginBottom: '80px',
        marginTop: '20px',
        marginLeft: '-24px',
        marginRight: '-24px',
        boxShadow: '0 16px 48px rgba(27, 67, 50, 0.25)',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '60px',
        flexWrap: 'wrap'
      }}>
        {/* Decorative elements */}
        <div style={{
          position: 'absolute',
          top: '-80px',
          right: '10%',
          width: '200px',
          height: '200px',
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.05)',
          zIndex: 0
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-60px',
          left: '20%',
          width: '150px',
          height: '150px',
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.03)',
          zIndex: 0
        }} />

        {/* Left Content */}
        <div style={{ position: 'relative', zIndex: 1, flex: '1 1 400px' }}>
          <Text style={{
            fontSize: '12px',
            fontWeight: 700,
            color: 'rgba(255,255,255,0.7)',
            letterSpacing: '2px',
            textTransform: 'uppercase',
            marginBottom: '12px',
            display: 'block'
          }}>
            Start Your Journey
          </Text>
          <Title level={2} style={{
            color: '#fff',
            fontSize: 'clamp(28px, 4vw, 40px)',
            fontWeight: 700,
            marginBottom: '12px',
            lineHeight: 1.3
          }}>
            Discover Your Health Score
          </Title>
          <Paragraph style={{
            fontSize: '16px',
            margin: 0,
            color: 'rgba(255,255,255,0.85)',
            lineHeight: 1.6,
            maxWidth: '500px'
          }}>
            Take our free assessment and get personalized recommendations from certified experts.
          </Paragraph>
        </div>

        {/* Right Buttons */}
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <Button
            size="large"
            onClick={() => navigate('/assessment')}
            style={{
              height: '54px',
              padding: '0 40px',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: 700,
              background: '#fff',
              color: '#1b4332',
              border: 'none',
              boxShadow: '0 6px 20px rgba(0, 0, 0, 0.15)'
            }}
          >
            Take Free Health Quiz
          </Button>
          <Button
            size="large"
            onClick={() => navigate('/experts/all')}
            style={{
              height: '54px',
              padding: '0 32px',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: 600,
              background: 'transparent',
              borderColor: 'rgba(255,255,255,0.5)',
              color: '#fff'
            }}
          >
            Browse Experts
          </Button>
        </div>
      </div>

      {/* Main Plans Section */}
      <div style={{ marginBottom: '100px' }}>
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <Text style={{
            fontSize: '13px',
            fontWeight: 700,
            color: '#2d6a4f',
            letterSpacing: '2px',
            textTransform: 'uppercase',
            marginBottom: '12px',
            display: 'block'
          }}>
            Our Services
          </Text>
          <Title level={2} style={{ color: '#1b4332', marginBottom: '16px', fontSize: '36px' }}>
            Explore Our Specialized Plans
          </Title>
          <Paragraph style={{ fontSize: '17px', color: '#666', maxWidth: 600, margin: '0 auto' }}>
            Choose from our range of expert-led wellness programs tailored to your goals
          </Paragraph>
        </div>
        <Row gutter={[28, 28]}>
          {mainPlans.map((plan) => (
            <Col xs={24} sm={12} lg={6} key={plan.type}>
              <Card
                hoverable
                variant="borderless"
                className="soft-shadow"
                style={{
                  height: '100%',
                  textAlign: 'center',
                  borderRadius: '28px',
                  padding: '28px 24px',
                  background: plan.color,
                  border: plan.isGradient ? 'none' : '1px solid rgba(0,0,0,0.04)',
                  minHeight: '340px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{
                    marginBottom: '28px',
                    width: '80px',
                    height: '80px',
                    margin: '0 auto 28px',
                    borderRadius: '24px',
                    background: plan.isGradient ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.04)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {plan.icon}
                  </div>
                  <Title
                    level={3}
                    style={{
                      marginBottom: '16px',
                      fontSize: '24px',
                      color: plan.isGradient ? '#fff' : '#1b4332'
                    }}
                  >
                    {plan.title}
                  </Title>
                  <Paragraph
                    style={{
                      marginBottom: '32px',
                      fontSize: '15px',
                      lineHeight: 1.7,
                      color: plan.isGradient ? 'rgba(255,255,255,0.9)' : '#666'
                    }}
                  >
                    {plan.desc}
                  </Paragraph>
                </div>
                <div
                  className="explore-btn"
                  onClick={() => navigate(`/experts/${plan.type}`)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    padding: '16px 24px',
                    borderRadius: '14px',
                    cursor: 'pointer',
                    fontWeight: 600,
                    fontSize: '15px',
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
                    e.currentTarget.style.transform = 'translateY(-3px)';
                    e.currentTarget.style.boxShadow = `0 8px 24px ${plan.btnColor}40`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  {plan.btnText} <ChevronRight size={18} className="btn-arrow" />
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/* Top Trainers Slider */}
      <TopTrainersSlider />

      {/* Trust Factors */}
      <div style={{ marginBottom: '80px' }}>
        <Card
          variant="borderless"
          style={{
            background: 'linear-gradient(135deg, #1b4332 0%, #2d6a4f 100%)',
            borderRadius: '32px',
            padding: '40px',
            boxShadow: '0 16px 48px rgba(27, 67, 50, 0.25)',
            overflow: 'hidden',
            position: 'relative'
          }}
        >
          {/* Background decoration */}
          <div style={{
            position: 'absolute',
            top: '-100px',
            right: '-100px',
            width: '300px',
            height: '300px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.05)',
            zIndex: 0
          }} />

          <Row gutter={[48, 48]} align="middle" style={{ position: 'relative', zIndex: 1 }}>
            <Col xs={24} md={14}>
              <Text style={{
                fontSize: '13px',
                fontWeight: 700,
                color: 'rgba(255,255,255,0.7)',
                letterSpacing: '2px',
                textTransform: 'uppercase',
                marginBottom: '16px',
                display: 'block'
              }}>
                Why StayFit
              </Text>
              <Title level={2} style={{ color: '#fff', marginBottom: '32px', fontSize: '34px' }}>
                Why Choose StayFit Experts?
              </Title>
              <List
                dataSource={[
                  { text: 'Certified & Background Checked Professionals', desc: 'Every expert is verified for your safety' },
                  { text: 'Personalized 1-on-1 Consultation Sessions', desc: 'Tailored guidance just for you' },
                  { text: 'Integrated Tracking with AI Health Engine', desc: 'Smart insights to monitor your progress' },
                  { text: 'Flexible Scheduling for Your Busy Life', desc: 'Book sessions that fit your routine' }
                ]}
                renderItem={item => (
                  <List.Item style={{ border: 'none', padding: '14px 0' }}>
                    <Space align="start" size={16}>
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '10px',
                        background: 'rgba(144, 238, 144, 0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        <CheckCircle2 size={18} color="#90EE90" />
                      </div>
                      <div>
                        <Text style={{ fontSize: '17px', fontWeight: 600, color: '#fff', display: 'block' }}>
                          {item.text}
                        </Text>
                        <Text style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)' }}>
                          {item.desc}
                        </Text>
                      </div>
                    </Space>
                  </List.Item>
                )}
              />
            </Col>
            <Col xs={24} md={10}>
              <div style={{
                textAlign: 'center',
                padding: '40px',
                background: 'rgba(255,255,255,0.08)',
                borderRadius: '24px',
                backdropFilter: 'blur(10px)'
              }}>
                <UserCheck size={140} color="rgba(255,255,255,0.9)" strokeWidth={1} />
                <Title level={3} style={{ color: '#fff', marginTop: '24px', marginBottom: '8px' }}>
                  500+ Experts
                </Title>
                <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: '16px' }}>
                  Ready to guide your wellness journey
                </Text>
              </div>
            </Col>
          </Row>
        </Card>
      </div>

      <MedicalDisclaimer />
    </div>
  );
};

export default HomeDashboard;
