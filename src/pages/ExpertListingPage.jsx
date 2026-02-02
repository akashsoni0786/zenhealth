import React from 'react';
import { Card, Row, Col, Typography, Avatar, Button, Space, Tag, Rate, Empty, Breadcrumb } from 'antd';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { EXPERT_DATA } from '../data/expertData';
import { ArrowLeft, Briefcase, Award, Zap } from 'lucide-react';

const { Title, Text, Paragraph } = Typography;

const ExpertListingPage = () => {
  const { type } = useParams();
  const navigate = useNavigate();

  // Get all experts or filter by type
  const getExperts = () => {
    if (type === 'all') {
      // Combine all experts from all categories
      return [
        ...EXPERT_DATA.yoga.map(e => ({ ...e, category: 'yoga' })),
        ...EXPERT_DATA.nutritionist.map(e => ({ ...e, category: 'nutritionist' })),
        ...EXPERT_DATA.gym.map(e => ({ ...e, category: 'gym' }))
      ];
    }
    return (EXPERT_DATA[type] || []).map(e => ({ ...e, category: type }));
  };

  const experts = getExperts();

  const getTitle = () => {
    switch (type) {
      case 'yoga': return 'Yoga Instructors';
      case 'nutritionist': return 'Certified Nutritionists';
      case 'gym': return 'Personal Gym Trainers';
      case 'all': return 'All Wellness Experts';
      default: return 'Our Experts';
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      yoga: 'green',
      nutritionist: 'blue',
      gym: 'purple'
    };
    return colors[category] || 'default';
  };

  const getCategoryLabel = (category) => {
    const labels = {
      yoga: 'Yoga',
      nutritionist: 'Nutrition',
      gym: 'Fitness'
    };
    return labels[category] || category;
  };

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 20px' }}>
      <Breadcrumb style={{ marginBottom: '24px' }}>
        <Breadcrumb.Item><Link to="/">Home</Link></Breadcrumb.Item>
        <Breadcrumb.Item>{getTitle()}</Breadcrumb.Item>
      </Breadcrumb>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '40px' }}>
        <Button 
          icon={<ArrowLeft size={18} />} 
          onClick={() => navigate('/')} 
          shape="circle" 
          size="large"
        />
        <Title level={2} style={{ margin: 0, color: '#2d6a4f' }}>{getTitle()}</Title>
      </div>

      {experts.length > 0 ? (
        <Row gutter={[24, 24]}>
          {experts.map((expert) => (
            <Col xs={24} md={12} lg={8} key={expert.id}>
              <Card 
                hoverable 
                variant="borderless"
                className="soft-shadow"
                style={{ borderRadius: '24px', overflow: 'hidden', height: '100%' }}
              >
                <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                  <Avatar
                    size={120}
                    src={expert.image}
                    style={{ border: '4px solid #f0f7f4', marginBottom: '16px' }}
                  />
                  <Title level={4} style={{ margin: '0 0 8px' }}>{expert.name}</Title>
                  <Space size={4} wrap style={{ justifyContent: 'center' }}>
                    {type === 'all' && (
                      <Tag color={getCategoryColor(expert.category)}>
                        {getCategoryLabel(expert.category)}
                      </Tag>
                    )}
                    <Tag color="green" icon={<Award size={12} style={{ marginRight: 4 }} />}>
                      {expert.expertise}
                    </Tag>
                  </Space>
                </div>

                <div style={{ background: '#fdfbf7', padding: '20px', borderRadius: '16px', marginBottom: '24px' }}>
                  <Space direction="vertical" style={{ width: '100%' }} size="small">
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Text type="secondary"><Briefcase size={14} style={{ marginRight: 8 }} /> Experience:</Text>
                      <Text strong>{expert.experience}</Text>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Text type="secondary"><Zap size={14} style={{ marginRight: 8 }} /> Sessions from:</Text>
                      <Text strong style={{ color: '#2d6a4f', fontSize: '18px' }}>₹{expert.price}/mo</Text>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
                      <Text type="secondary">Rating:</Text>
                      <Space size={4}>
                        <Rate disabled defaultValue={expert.rating} style={{ fontSize: '14px' }} />
                        <Text strong style={{ fontSize: '12px' }}>({expert.rating})</Text>
                      </Space>
                    </div>
                  </Space>
                </div>

                <Button type="primary" block size="large" style={{ borderRadius: '12px', height: '50px' }}>
                  Book a Consultation
                </Button>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <Empty description="No experts found in this category" />
      )}
    </div>
  );
};

export default ExpertListingPage;
