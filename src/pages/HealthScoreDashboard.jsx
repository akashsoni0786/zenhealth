import { Card, Row, Col, Typography, Progress, List, Button, Tag, Statistic } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useHealth } from '../context/HealthContext';
import { PremiumGate } from '../components/SubscriptionModal';
import {
  Sparkles,
  ChevronRight,
  Brain,
  Crown,
  HeartPulse,
  Lightbulb,
  CheckCircle,
  AlertTriangle,
  Lock,
  Activity,
  Target
} from 'lucide-react';
import './HealthScoreDashboard.css';

const { Title, Text } = Typography;

const HealthScoreDashboard = () => {
  const { healthData, planLevel } = useHealth();
  const navigate = useNavigate();

  if (!healthData) {
    return (
      <div className="hsd-page">
        <Card variant="borderless" className="hsd-empty-card">
          <div className="hsd-empty-icon">
            <HeartPulse size={36} color="#2d6a4f" />
          </div>
          <Title level={3} style={{ color: '#1b4332' }}>No Health Data Yet</Title>
          <Text type="secondary" style={{ fontSize: '15px' }}>
            Complete the health assessment to get your personalized score and insights
          </Text>
          <br />
          <Button type="primary" size="large" onClick={() => navigate('/assessment')} className="hsd-empty-btn">
            <Activity size={18} /> Start Health Quiz
          </Button>
        </Card>
      </div>
    );
  }

  const { bmi, healthScore, insights, rootCauses } = healthData;
  const isPremium = planLevel !== 'basic';

  return (
    <div className="hsd-page">
      {/* ─── Header Banner ─── */}
      <div className="hsd-header">
        <div className="hsd-header-content">
          <div className="hsd-header-left">
            <div className="hsd-header-icon">
              <HeartPulse size={30} color="#fff" />
            </div>
            <div>
              <Title level={2}>Health Analysis Report</Title>
              <Text className="hsd-header-subtitle">
                Your personalized wellness insights powered by FitAI
              </Text>
            </div>
          </div>
          <div className="hsd-header-right">
            <Tag
              color={planLevel === 'total' ? 'purple' : planLevel === 'active' ? 'blue' : 'default'}
              className="hsd-plan-tag"
            >
              {planLevel.toUpperCase()} PLAN
            </Tag>
            {!isPremium && (
              <Button type="primary" size="small" icon={<Crown size={12} />} onClick={() => navigate('/pricing')}>
                Upgrade
              </Button>
            )}
          </div>
        </div>
      </div>

      <Row gutter={[24, 24]}>
        {/* Health Score Card */}
        <Col xs={24} md={8}>
          <Card variant="borderless" className="hsd-score-card hsd-score-card-main">
            <span className="hsd-score-label">Overall Health Score</span>
            <Progress
              type="dashboard"
              percent={healthScore}
              strokeColor={{ '0%': '#1b4332', '100%': '#52c41a' }}
              strokeWidth={8}
              size={170}
            />
            <div className={`hsd-score-status ${healthScore >= 70 ? 'hsd-score-status-good' : 'hsd-score-status-warn'}`}>
              {healthScore >= 70 ? <CheckCircle size={16} /> : <AlertTriangle size={16} />}
              {healthScore >= 70 ? 'Optimal' : 'Needs Optimization'}
            </div>
          </Card>
        </Col>

        {/* BMI Card */}
        <Col xs={24} md={8}>
          <Card variant="borderless" className="hsd-score-card">
            <span className="hsd-score-label">Body Mass Index</span>
            <span className="hsd-bmi-value" style={{ color: bmi?.color }}>{bmi?.value}</span>
            <Tag color={bmi?.color} className="hsd-bmi-category">{bmi?.category}</Tag>
            <span className="hsd-bmi-note">
              BMI calibrates your plan intensity based on height/weight ratio
            </span>
          </Card>
        </Col>

        {/* Insights Card */}
        <Col xs={24} md={8}>
          <Card variant="borderless" className="hsd-score-card hsd-insights-card">
            <Title level={4} className="hsd-insights-title">
              <span className="hsd-insights-title-icon">
                <Lightbulb size={18} color="#fff" />
              </span>
              FitAI Insights
            </Title>
            <List
              dataSource={insights}
              renderItem={item => (
                <List.Item className="hsd-insight-item">
                  <span className="hsd-insight-text">
                    <Sparkles size={14} className="hsd-insight-icon" />
                    {item}
                  </span>
                </List.Item>
              )}
            />
            {!isPremium && (
              <Button ghost block className="hsd-insights-unlock-btn" onClick={() => navigate('/pricing')}>
                <Lock size={14} /> Unlock Deep Analysis
              </Button>
            )}
          </Card>
        </Col>

        {/* Root Cause Section */}
        <Col span={24}>
          <div className="hsd-root-section">
            <Title level={4} className="hsd-root-title">
              <span className="hsd-root-title-icon">
                <Brain size={20} />
              </span>
              Root-Cause Engine
            </Title>
            <PremiumGate level="active">
              <Row gutter={[16, 16]}>
                {rootCauses?.map(rc => (
                  <Col xs={24} sm={12} md={8} key={rc.factor}>
                    <Card
                      variant="borderless"
                      className={`hsd-root-card ${rc.impact === 'Critical' ? 'hsd-root-card-critical' : 'hsd-root-card-normal'}`}
                    >
                      <Statistic
                        title={rc.factor}
                        value={rc.impact}
                        valueStyle={{ color: rc.impact === 'Critical' ? '#ff4d4f' : '#2d6a4f' }}
                      />
                    </Card>
                  </Col>
                ))}
              </Row>
            </PremiumGate>
          </div>
        </Col>

        {/* CTA */}
        <Col span={24}>
          <div className="hsd-cta-section">
            <Target size={24} color="#2d6a4f" style={{ marginBottom: '12px' }} />
            <span className="hsd-cta-text">Ready to take action? View your personalized health plan</span>
            <br />
            <Button
              type="primary"
              size="large"
              onClick={() => navigate('/health-plan')}
              className="hsd-cta-btn"
            >
              View My Plan <ChevronRight size={20} />
            </Button>
          </div>
        </Col>
      </Row>

    </div>
  );
};

export default HealthScoreDashboard;
