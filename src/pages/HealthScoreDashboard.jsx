import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Typography, Progress, List, Button, Empty, Tag, Modal, Divider, Statistic, Space } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useHealth } from '../context/HealthContext';
import SubscriptionModal, { PremiumGate } from '../components/SubscriptionModal';
import { 
  Sparkles, 
  ChevronRight,
  Info,
  ShieldCheck,
  TrendingUp,
  Brain,
  Crown
} from 'lucide-react';

const { Title, Text, Paragraph } = Typography;

const HealthScoreDashboard = () => {
  const { healthData, userAnswers, planLevel } = useHealth();
  const [isSubModalOpen, setIsSubModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleOpen = () => setIsSubModalOpen(true);
    window.addEventListener('openSubModal', handleOpen);
    return () => window.removeEventListener('openSubModal', handleOpen);
  }, []);

  if (!healthData) {
    return (
      <Card variant="borderless" style={{ textAlign: 'center', padding: '60px' }}>
        <Empty description="Analysis missing" />
        <Button type="primary" onClick={() => navigate('/assessment')}>Start Health Quiz</Button>
      </Card>
    );
  }

  const { bmi, healthScore, insights, rootCauses } = healthData;
  const isPremium = planLevel !== 'basic';

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <Title level={2} style={{ color: '#2d6a4f', margin: 0 }}>Health Analysis Report</Title>
        <Space>
           <Tag color={planLevel === 'total' ? 'purple' : planLevel === 'active' ? 'blue' : 'default'} style={{ padding: '4px 12px', borderRadius: '12px' }}>
            {planLevel.toUpperCase()} PLAN
          </Tag>
          {!isPremium && <Button type="primary" size="small" icon={<Crown size={12} />} onClick={() => setIsSubModalOpen(true)}>Upgrade</Button>}
        </Space>
      </div>
      
      <Row gutter={[24, 24]}>
        <Col xs={24} md={8}>
          <Card variant="borderless" className="soft-shadow" style={{ borderRadius: '24px', textAlign: 'center', height: '100%' }}>
            <Title level={5} type="secondary">Health Score</Title>
            <Progress
              type="dashboard"
              percent={healthScore}
              strokeColor="#2d6a4f"
              strokeWidth={8}
              size={180}
            />
            <div style={{ marginTop: '12px' }}>
              <Text strong style={{ fontSize: '18px' }}>
                {healthScore >= 70 ? 'Optimal' : 'Needs Optimization'}
              </Text>
            </div>
          </Card>
        </Col>

        <Col xs={24} md={8}>
          <Card variant="borderless" className="soft-shadow" style={{ borderRadius: '24px', textAlign: 'center', height: '100%' }}>
            <Title level={5} type="secondary">Your BMI</Title>
            <div style={{ margin: '20px 0' }}>
               <span style={{ fontSize: '48px', fontWeight: 800, color: bmi?.color }}>{bmi?.value}</span>
            </div>
            <Tag color={bmi?.color} style={{ fontSize: '16px', padding: '4px 16px', borderRadius: '20px' }}>{bmi?.category}</Tag>
            <Divider />
            <Text type="secondary" style={{ fontSize: '12px' }}>BMI interprets your height/weight ratio for plan intensity.</Text>
          </Card>
        </Col>

        <Col xs={24} md={8}>
          <Card variant="borderless" className="soft-shadow" style={{ borderRadius: '24px', background: '#2d6a4f', color: '#fff', height: '100%' }}>
             <Title level={4} style={{ color: '#fff' }}>ZenAI Insights</Title>
             <List
                dataSource={insights}
                renderItem={item => (
                  <List.Item style={{ border: 'none', padding: '8px 0' }}>
                    <Text style={{ color: '#e8f5e9' }}><Sparkles size={12} /> {item}</Text>
                  </List.Item>
                )}
             />
             {!isPremium && (
               <Button ghost block style={{ marginTop: '20px' }} onClick={() => setIsSubModalOpen(true)}>Unlock Deep Analysis</Button>
             )}
          </Card>
        </Col>

        <Col span={24}>
           <Title level={4} style={{ marginBottom: '16px' }}><Brain size={20} /> Root-Cause Engine</Title>
           <PremiumGate level="active">
              <Row gutter={16}>
                {rootCauses?.map(rc => (
                  <Col xs={24} md={8} key={rc.factor}>
                    <Card variant="borderless" style={{ borderRadius: '16px', background: '#fdfbf7', border: '1px solid #d8f3dc' }}>
                       <Statistic title={rc.factor} value={rc.impact} valueStyle={{ color: rc.impact === 'Critical' ? '#ff4d4f' : '#2d6a4f' }} />
                    </Card>
                  </Col>
                ))}
              </Row>
           </PremiumGate>
        </Col>

        <Col span={24}>
          <div style={{ textAlign: 'center', marginTop: '32px' }}>
            <Button 
              type="primary" 
              size="large" 
              icon={<ChevronRight size={20} />} 
              onClick={() => navigate('/health-plan')}
              style={{ height: '56px', padding: '0 40px', borderRadius: '12px' }}
            >
              View My Plan
            </Button>
          </div>
        </Col>
      </Row>

      <Modal open={isSubModalOpen} onCancel={() => setIsSubModalOpen(false)} footer={null} width={1000} styles={{ body: { padding: 0 } }}>
        <SubscriptionModal onUpgrade={() => setIsSubModalOpen(false)} />
      </Modal>
    </div>
  );
};

export default HealthScoreDashboard;
