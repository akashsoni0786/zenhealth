import React, { useState, useEffect } from 'react';
import { Card, Tabs, List, Typography, Row, Col, Tag, Alert, Divider, Space, Button, Modal } from 'antd';
import { useHealth } from '../context/HealthContext';
import MedicalDisclaimer from '../components/MedicalDisclaimer';
import SubscriptionModal, { PremiumGate } from '../components/SubscriptionModal';
import { 
  Activity, 
  Leaf, 
  Utensils, 
  Moon, 
  Zap, 
  Clock,
  CircleCheck,
  Stethoscope,
  Crown
} from 'lucide-react';

const { Title, Text, Paragraph } = Typography;

const HealthPlanPage = () => {
  const { healthData, userAnswers, planLevel } = useHealth();
  const [isSubModalOpen, setIsSubModalOpen] = useState(false);

  useEffect(() => {
    const handleOpen = () => setIsSubModalOpen(true);
    window.addEventListener('openSubModal', handleOpen);
    return () => window.removeEventListener('openSubModal', handleOpen);
  }, []);

  if (!healthData || !healthData.recommendations) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <Alert title="No plan found" message="Please complete the health assessment to generate your plan." type="error" showIcon />
      </div>
    );
  }

  const { recommendations } = healthData;

  const PlanSection = ({ title, icon: Icon, data, color }) => (
    <Card 
      title={<Space><Icon size={20} color={color} /><Text strong>{title}</Text></Space>}
      variant="borderless"
      style={{ marginBottom: '20px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}
    >
      <List
        dataSource={data}
        renderItem={(item) => (
          <List.Item style={{ borderBottom: '1px solid #f0f0f0', padding: '16px 0' }}>
            <List.Item.Meta
              title={<Text strong style={{ color: '#2d6a4f' }}>{item.name}</Text>}
              description={
                <Space direction="vertical" style={{ width: '100%', gap: '4px' }}>
                  <Text style={{ fontSize: '14px' }}>{item.reason}</Text>
                  <Space split={<Divider type="vertical" />}>
                    <Text type="secondary" style={{ fontSize: '12px' }}><Clock size={12} style={{ verticalAlign: 'middle', marginRight: 4 }} /> {item.duration}</Text>
                    <Tag color="green" style={{ fontSize: '10px' }}>RECOMMENDED</Tag>
                  </Space>
                </Space>
              }
            />
          </List.Item>
        )}
      />
    </Card>
  );

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: '20px' }}>
      <div style={{ marginBottom: '32px', textAlign: 'center' }}>
        <Title level={2} style={{ color: '#2d6a4f' }}>Your Holistic Transformation Plan</Title>
        <Space wrap>
          <Tag color="green">Ayurveda</Tag>
          <Tag color="blue">Yoga</Tag>
          <Tag color="orange">Diet</Tag>
          <Tag color="purple">Lifestyle</Tag>
          <Tag color="gold" icon={<Crown size={12} />}>{planLevel.toUpperCase()} PLAN</Tag>
        </Space>
      </div>

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={16}>
          <PlanSection title="Yoga & Mindfulness" icon={Activity} data={recommendations.yoga} color="#2d6a4f" />
          
          <PremiumGate level="active">
             <PlanSection title="Physical Exercise" icon={Zap} data={recommendations.exercise || []} color="#1890ff" />
             <PlanSection title="Nutritional Strategy" icon={Utensils} data={recommendations.diet || []} color="#74c69d" />
          </PremiumGate>

          <PremiumGate level="total">
             {recommendations.consultations && (
               <PlanSection title="Expert Consultations" icon={Stethoscope} data={recommendations.consultations} color="#722ed1" />
             )}
             {recommendations.ayurveda && (
               <PlanSection title="Advanced Ayurvedic Remedies" icon={Leaf} data={recommendations.ayurveda} color="#2d6a4f" />
             )}
          </PremiumGate>
        </Col>

        <Col xs={24} lg={8}>
          <Card 
            title={<Space><Stethoscope size={18} /> <Text strong>Medical Note</Text></Space>}
            variant="borderless"
            style={{ position: 'sticky', top: 100, borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}
          >
            <Paragraph style={{ fontSize: '13px' }}>
              Your plan is optimized for <strong>{userAnswers?.primaryConcern}</strong> management.
            </Paragraph>
            <Divider style={{ margin: '12px 0' }} />
            <MedicalDisclaimer />
            {planLevel !== 'total' && (
              <Button 
                type="primary" 
                block 
                style={{ marginTop: 20, borderRadius: 10, background: '#722ed1', borderColor: '#722ed1' }}
                onClick={() => setIsSubModalOpen(true)}
              >
                Upgrade to Total Care
              </Button>
            )}
          </Card>
        </Col>
      </Row>

      <Modal open={isSubModalOpen} onCancel={() => setIsSubModalOpen(false)} footer={null} width={1000} styles={{ body: { padding: 0 } }}>
        <SubscriptionModal onUpgrade={() => setIsSubModalOpen(false)} />
      </Modal>
    </div>
  );
};

export default HealthPlanPage;
