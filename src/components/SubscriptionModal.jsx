import React from 'react';
import { Card, Button, Typography, Space, Row, Col, List, Tag, Result, Table, Divider } from 'antd';
import { Crown, CheckCircle2, XCircle, Zap, Star } from 'lucide-react';
import { getSubscriptionTiers } from '../utils/healthLogic';
import { useHealth } from '../context/HealthContext';

const { Title, Text, Paragraph } = Typography;

const SubscriptionModal = ({ onUpgrade }) => {
  const tiers = getSubscriptionTiers();
  const { upgradePlan, planLevel } = useHealth();

  const handleUpgrade = (level) => {
    upgradePlan(level);
    if (onUpgrade) onUpgrade();
  };

  const comparisonData = [
    { feature: 'BMI Tracking', basic: true, active: true, total: true },
    { feature: 'AI Analysis', basic: false, active: true, total: true },
    { feature: 'Yoga Plans', basic: 'Basic', active: 'Personalized', total: 'Advanced' },
    { feature: 'Gym Workouts', basic: false, active: true, total: true },
    { feature: 'Nutrition Plan', basic: 'Tips', active: 'Custom', total: 'Expert' },
    { feature: 'Doctor Consult', basic: false, active: false, total: true },
    { feature: 'Progress Reports', basic: false, active: true, total: true },
  ];

  const columns = [
    { title: 'Feature', dataKey: 'feature', key: 'feature', render: (t) => <Text strong>{t}</Text> },
    { title: 'Basic', dataKey: 'basic', key: 'basic', align: 'center', render: (val) => renderVal(val) },
    { title: 'Active', dataKey: 'active', key: 'active', align: 'center', render: (val) => renderVal(val, '#1890ff') },
    { title: 'Total Care', dataKey: 'total', key: 'total', align: 'center', render: (val) => renderVal(val, '#722ed1') },
  ];

  const renderVal = (val, color) => {
    if (val === true) return <CheckCircle2 size={18} color={color || "#52c41a"} />;
    if (val === false) return <XCircle size={18} color="#ff4d4f" opacity={0.3} />;
    return <Tag color={color}>{val}</Tag>;
  };

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <Title level={2} style={{ color: '#2d6a4f' }}>Choose Your Wellness Path</Title>
        <Paragraph>Upgrade to unlock deep AI insights and expert consultations.</Paragraph>
      </div>

      <Row gutter={[24, 24]} justify="center">
        {tiers.map((tier) => (
          <Col xs={24} md={8} key={tier.key}>
            <Card 
              hoverable 
              variant="borderless"
              style={{ 
                height: '100%', 
                borderRadius: '24px', 
                border: planLevel === tier.key ? `2px solid ${tier.color}` : '1px solid #f0f0f0',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: tier.recommended ? '0 10px 30px rgba(0,0,0,0.1)' : 'none'
              }}
            >
              {tier.recommended && (
                <div style={{ 
                  position: 'absolute', top: '15px', right: '-35px', background: tier.color, 
                  color: '#fff', padding: '5px 40px', transform: 'rotate(45deg)',
                  fontSize: '10px', fontWeight: 'bold'
                }}>
                  MOST POPULAR
                </div>
              )}
              
              <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <Text strong style={{ color: tier.color }}>{tier.name.toUpperCase()}</Text>
                <div style={{ margin: '12px 0' }}>
                  <span style={{ fontSize: '32px', fontWeight: 'bold' }}>₹{tier.price}</span>
                  <Text type="secondary">/mo</Text>
                </div>
                <Text type="secondary" style={{ fontSize: '12px' }}>{tier.bestFor}</Text>
              </div>

              <Divider style={{ margin: '12px 0' }} />

              <List
                dataSource={tier.features}
                renderItem={(item) => (
                  <List.Item style={{ border: 'none', padding: '6px 0' }}>
                    <Space>
                      {item.included ? <CheckCircle2 size={14} color={tier.color} /> : <XCircle size={14} color="#d9d9d9" />}
                      <Text style={{ fontSize: '13px', color: item.included ? 'inherit' : '#bfbfbf' }}>{item.text}</Text>
                    </Space>
                  </List.Item>
                )}
              />

              <Button 
                type={tier.recommended || tier.key === 'total' ? 'primary' : 'default'} 
                size="large" 
                block 
                onClick={() => handleUpgrade(tier.key)}
                disabled={planLevel === tier.key}
                style={{ 
                  marginTop: '24px', borderRadius: '12px', height: '48px',
                  background: tier.key === 'total' ? tier.color : undefined,
                  borderColor: tier.key === 'total' ? tier.color : undefined
                }}
              >
                {planLevel === tier.key ? 'Current Plan' : tier.buttonText}
              </Button>
            </Card>
          </Col>
        ))}
      </Row>

      <div style={{ marginTop: '50px' }}>
        <Title level={4} style={{ textAlign: 'center', marginBottom: '24px' }}>Feature Comparison</Title>
        <Table 
          dataSource={comparisonData} 
          columns={columns} 
          pagination={false} 
          size="small" 
          bordered={false}
          style={{ background: '#fff', borderRadius: '16px', overflow: 'hidden' }}
        />
      </div>

      <div style={{ marginTop: '32px', textAlign: 'center' }}>
        <Space>
          <Star size={16} color="#faad14" fill="#faad14" />
          <Text type="secondary">Secure payment via Stripe & Razorpay. Cancel anytime.</Text>
        </Space>
      </div>
    </div>
  );
};

export const PremiumGate = ({ children, plan, level = 'active' }) => {
  const { planLevel } = useHealth();

  const hasAccess = (current, required) => {
    if (required === 'active') return current === 'active' || current === 'total';
    if (required === 'total') return current === 'total';
    return true;
  };

  if (hasAccess(planLevel, level)) return children;

  const handleUpgradeClick = () => {
    window.location.href = '/pricing';
  };

  return (
    <Card
      variant="borderless"
      style={{
        textAlign: 'center', padding: '30px 20px',
        background: 'linear-gradient(135deg, #fdfbf7 0%, #f5f5f5 100%)',
        borderRadius: '24px', border: '1px dashed #d9d9d9'
      }}
    >
      <Result
        icon={<Crown size={48} color={level === 'total' ? '#722ed1' : '#faad14'} />}
        title={`${level.toUpperCase()} Feature`}
        subTitle={`This advanced insight is available on the ${level} plan.`}
        extra={[
          <Button type="primary" key="upgrade" onClick={handleUpgradeClick}>
            Upgrade Plan
          </Button>
        ]}
      />
    </Card>
  );
};

export default SubscriptionModal;
