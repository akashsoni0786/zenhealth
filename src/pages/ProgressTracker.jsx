import React, { useState, useEffect } from 'react';
import { Card, Typography, Row, Col, Progress, Button, InputNumber, Space, Empty, Form, Modal, Tag, message } from 'antd';
import {
  ResponsiveContainer,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  AreaChart,
  Area,
  BarChart,
  Bar,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  PieChart,
  Pie,
  Cell,
  ComposedChart
} from 'recharts';
import {
  Trophy,
  Flame,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Activity,
  Droplets,
  Moon,
  Brain,
  Heart,
  Target,
  TrendingUp,
  Zap,
  Award,
  Sparkles,
  Scale,
  Eye,
  Utensils,
  Clock
} from 'lucide-react';
import { useHealth } from '../context/HealthContext';
import { Link } from 'react-router-dom';
import './ProgressTracker.css';

const { Title, Text, Paragraph } = Typography;

const ProgressTracker = () => {
  const { userAnswers, healthData } = useHealth();

  const [trackingLogs, setTrackingLogs] = useState(() => {
    const saved = localStorage.getItem('stayfit_tracking_logs');
    return saved ? JSON.parse(saved) : [];
  });

  const [logModalOpen, setLogModalOpen] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    localStorage.setItem('stayfit_tracking_logs', JSON.stringify(trackingLogs));
  }, [trackingLogs]);

  // If no health assessment data, show prompt
  if (!userAnswers) {
    return (
      <div className="pt-page">
        <div className="pt-empty-state">
          <div className="pt-empty-icon">
            <TrendingUp size={48} color="#2d6a4f" />
          </div>
          <Title level={2} style={{ color: '#2d6a4f' }}>Progress Tracker</Title>
          <Empty description={false} />
          <Paragraph type="secondary" style={{ marginTop: 16, fontSize: 16 }}>
            Complete your health assessment first to unlock your personalized tracking dashboard.
          </Paragraph>
          <Link to="/assessment">
            <Button type="primary" size="large" className="pt-cta-btn">
              <Sparkles size={18} /> Take Health Assessment
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Base values from assessment
  const baseWeight = parseFloat(userAnswers.weight) || 70;
  const baseStress = userAnswers.stressLevel === 'high' ? 8 : userAnswers.stressLevel === 'moderate' ? 5 : 3;
  const baseWater = parseFloat(userAnswers.waterIntake) || 2;
  const baseSleep = parseFloat(userAnswers.sleepDuration) || 7;

  // Chart data
  const getChartData = () => {
    if (trackingLogs.length === 0) {
      return [{ day: 'Baseline', weight: baseWeight, stress: baseStress, water: baseWater, sleep: baseSleep }];
    }
    return trackingLogs.slice(-7).map((log) => ({
      day: new Date(log.date).toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' }),
      weight: log.weight,
      stress: log.stress,
      water: log.water,
      sleep: log.sleep || baseSleep
    }));
  };

  const chartData = getChartData();

  // Current stats
  const currentWeight = trackingLogs.length > 0 ? trackingLogs[trackingLogs.length - 1].weight : baseWeight;
  const currentStress = trackingLogs.length > 0 ? trackingLogs[trackingLogs.length - 1].stress : baseStress;
  const currentWater = trackingLogs.length > 0 ? trackingLogs[trackingLogs.length - 1].water : baseWater;
  const currentSleep = trackingLogs.length > 0 ? (trackingLogs[trackingLogs.length - 1].sleep || baseSleep) : baseSleep;
  const weightChange = (currentWeight - baseWeight).toFixed(1);
  const streak = trackingLogs.length;

  const stressLabel = userAnswers.stressLevel === 'high' ? 'High' : userAnswers.stressLevel === 'moderate' ? 'Moderate' : 'Low';
  const sleepLabel = userAnswers.sleepQuality === 'poor' ? 'Poor' : userAnswers.sleepQuality === 'good' ? 'Good' : 'Average';
  const activityLabel = userAnswers.activityLevel === 'active' ? 'Very Active' : userAnswers.activityLevel === 'moderate' ? 'Moderate' : 'Sedentary';

  // Radar chart data for health dimensions
  const healthScore = healthData?.healthScore || 50;
  const radarData = [
    { dimension: 'Fitness', value: userAnswers.activityLevel === 'active' ? 90 : userAnswers.activityLevel === 'moderate' ? 60 : 30, fullMark: 100 },
    { dimension: 'Nutrition', value: userAnswers.dietType === 'veg' || userAnswers.dietType === 'vegan' ? 80 : 60, fullMark: 100 },
    { dimension: 'Sleep', value: userAnswers.sleepQuality === 'good' ? 90 : userAnswers.sleepQuality === 'average' ? 60 : 30, fullMark: 100 },
    { dimension: 'Mental', value: userAnswers.stressLevel === 'low' ? 90 : userAnswers.stressLevel === 'moderate' ? 60 : 25, fullMark: 100 },
    { dimension: 'Hydration', value: Math.min(Math.round((baseWater / 3.5) * 100), 100), fullMark: 100 },
    { dimension: 'BMI', value: healthData?.bmi?.category === 'Normal' ? 95 : healthData?.bmi?.category === 'Overweight' ? 55 : 35, fullMark: 100 },
  ];

  // BMI donut chart
  const bmiValue = healthData?.bmi?.value || 22;
  const bmiMax = 40;
  const bmiPieData = [
    { name: 'BMI', value: Math.min(bmiValue, bmiMax) },
    { name: 'Remaining', value: bmiMax - Math.min(bmiValue, bmiMax) }
  ];
  const bmiColor = healthData?.bmi?.color || '#52c41a';

  // Achievements
  const achievements = [
    { icon: <Flame size={18} />, label: 'First Log', unlocked: streak >= 1, color: '#ff4d4f' },
    { icon: <Zap size={18} />, label: '3-Day Streak', unlocked: streak >= 3, color: '#faad14' },
    { icon: <Award size={18} />, label: 'Week Warrior', unlocked: streak >= 7, color: '#1890ff' },
    { icon: <Trophy size={18} />, label: 'Fortnight Hero', unlocked: streak >= 14, color: '#722ed1' },
    { icon: <Sparkles size={18} />, label: 'Month Master', unlocked: streak >= 30, color: '#2d6a4f' },
  ];

  // Avg calculations
  const avgStress = trackingLogs.length > 0
    ? (trackingLogs.reduce((s, l) => s + l.stress, 0) / trackingLogs.length).toFixed(1)
    : baseStress;
  const avgWater = trackingLogs.length > 0
    ? (trackingLogs.reduce((s, l) => s + l.water, 0) / trackingLogs.length).toFixed(1)
    : baseWater;
  const avgSleep = trackingLogs.length > 0
    ? (trackingLogs.reduce((s, l) => s + (l.sleep || baseSleep), 0) / trackingLogs.length).toFixed(1)
    : baseSleep;

  const handleLogSubmit = (values) => {
    const newLog = {
      date: new Date().toISOString(),
      weight: values.weight,
      stress: values.stress,
      water: values.water,
      sleep: values.sleep
    };
    setTrackingLogs(prev => [...prev, newLog]);
    setLogModalOpen(false);
    form.resetFields();
    message.success('Daily log saved!');
  };

  const CustomTooltipContent = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="pt-custom-tooltip">
        <p className="pt-tooltip-label">{label}</p>
        {payload.map((entry, idx) => (
          <p key={idx} style={{ color: entry.color, margin: '2px 0', fontSize: 13 }}>
            {entry.name}: <strong>{entry.value}</strong>
          </p>
        ))}
      </div>
    );
  };

  return (
    <div className="pt-page">
      {/* Hero Header */}
      <div className="pt-hero">
        <div className="pt-hero-content">
          <div className="pt-hero-left">
            <Title level={2} className="pt-hero-title">Progress Tracker</Title>
            <Text className="pt-hero-subtitle">
              Your health journey at a glance
            </Text>
            <Space style={{ marginTop: 12 }}>
              <Tag color="green" className="pt-tag-lg">{trackingLogs.length} Logs Recorded</Tag>
              <Tag color={healthScore >= 70 ? 'green' : healthScore >= 50 ? 'orange' : 'red'} className="pt-tag-lg">
                Score: {healthScore}/100
              </Tag>
            </Space>
          </div>
          <div className="pt-hero-right">
            <div className="pt-hero-score">
              <Progress
                type="dashboard"
                percent={healthScore}
                strokeColor={{ '0%': '#40916c', '100%': '#2d6a4f' }}
                strokeWidth={10}
                size={140}
                format={(p) => <span className="pt-score-text">{p}</span>}
              />
              <Text className="pt-score-label">Health Score</Text>
            </div>
            <Button type="primary" size="large" icon={<Plus size={18} />} className="pt-log-btn" onClick={() => setLogModalOpen(true)}>
              Log Today
            </Button>
          </div>
        </div>
      </div>

      <Row gutter={[20, 20]}>
        {/* Quick Stats Row */}
        <Col xs={12} sm={12} md={6}>
          <div className="pt-stat-card pt-stat-weight">
            <div className="pt-stat-icon-wrap" style={{ background: 'rgba(45, 106, 79, 0.1)' }}>
              <Scale size={22} color="#2d6a4f" />
            </div>
            <div className="pt-stat-info">
              <span className="pt-stat-value">{currentWeight}<small>kg</small></span>
              <span className="pt-stat-label">Current Weight</span>
            </div>
            <div className={`pt-stat-badge ${parseFloat(weightChange) <= 0 ? 'positive' : 'negative'}`}>
              {parseFloat(weightChange) <= 0 ? <ArrowDownRight size={14} /> : <ArrowUpRight size={14} />}
              {Math.abs(parseFloat(weightChange))}kg
            </div>
          </div>
        </Col>

        <Col xs={12} sm={12} md={6}>
          <div className="pt-stat-card pt-stat-stress">
            <div className="pt-stat-icon-wrap" style={{ background: 'rgba(255, 77, 79, 0.1)' }}>
              <Brain size={22} color="#ff4d4f" />
            </div>
            <div className="pt-stat-info">
              <span className="pt-stat-value">{currentStress}<small>/10</small></span>
              <span className="pt-stat-label">Stress Level</span>
            </div>
            <Tag color={currentStress <= 3 ? 'green' : currentStress <= 6 ? 'orange' : 'red'} style={{ borderRadius: 20 }}>
              {currentStress <= 3 ? 'Low' : currentStress <= 6 ? 'Medium' : 'High'}
            </Tag>
          </div>
        </Col>

        <Col xs={12} sm={12} md={6}>
          <div className="pt-stat-card pt-stat-water">
            <div className="pt-stat-icon-wrap" style={{ background: 'rgba(24, 144, 255, 0.1)' }}>
              <Droplets size={22} color="#1890ff" />
            </div>
            <div className="pt-stat-info">
              <span className="pt-stat-value">{currentWater}<small>L</small></span>
              <span className="pt-stat-label">Water Intake</span>
            </div>
            <Progress
              type="circle"
              percent={Math.min(Math.round((currentWater / 3.5) * 100), 100)}
              size={40}
              strokeColor="#1890ff"
              strokeWidth={8}
              format={(p) => <span style={{ fontSize: 10 }}>{p}%</span>}
            />
          </div>
        </Col>

        <Col xs={12} sm={12} md={6}>
          <div className="pt-stat-card pt-stat-sleep">
            <div className="pt-stat-icon-wrap" style={{ background: 'rgba(114, 46, 209, 0.1)' }}>
              <Moon size={22} color="#722ed1" />
            </div>
            <div className="pt-stat-info">
              <span className="pt-stat-value">{currentSleep}<small>hrs</small></span>
              <span className="pt-stat-label">Sleep</span>
            </div>
            <Progress
              type="circle"
              percent={Math.min(Math.round((currentSleep / 8) * 100), 100)}
              size={40}
              strokeColor="#722ed1"
              strokeWidth={8}
              format={(p) => <span style={{ fontSize: 10 }}>{p}%</span>}
            />
          </div>
        </Col>

        {/* Radar Chart + BMI Donut */}
        <Col xs={24} lg={14}>
          <Card className="pt-chart-card">
            <div className="pt-chart-header">
              <Target size={20} color="#2d6a4f" />
              <Title level={5} style={{ margin: 0 }}>Health Dimensions</Title>
            </div>
            <div style={{ height: 320, width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData} outerRadius="75%">
                  <PolarGrid stroke="#e8efe9" />
                  <PolarAngleAxis dataKey="dimension" tick={{ fill: '#555', fontSize: 13 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                  <Radar name="Your Health" dataKey="value" stroke="#2d6a4f" fill="#2d6a4f" fillOpacity={0.2} strokeWidth={2} dot={{ r: 4, fill: '#2d6a4f' }} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={10}>
          <Card className="pt-chart-card" style={{ height: '100%' }}>
            <div className="pt-chart-header">
              <Heart size={20} color="#ff4d4f" />
              <Title level={5} style={{ margin: 0 }}>BMI Analysis</Title>
            </div>
            <div style={{ height: 200, width: '100%', position: 'relative' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={bmiPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    startAngle={90}
                    endAngle={-270}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    <Cell fill={bmiColor} />
                    <Cell fill="#f0f0f0" />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="pt-bmi-center">
                <span className="pt-bmi-value" style={{ color: bmiColor }}>{bmiValue}</span>
                <span className="pt-bmi-label">BMI</span>
              </div>
            </div>
            <div className="pt-bmi-details">
              <Tag color={bmiColor} className="pt-bmi-tag">{healthData?.bmi?.category || 'Normal'}</Tag>
              <div className="pt-bmi-meta">
                <Text type="secondary">Height: {userAnswers.height}cm</Text>
                <Text type="secondary">Weight: {currentWeight}kg</Text>
              </div>
              <div className="pt-bmi-scale">
                <div className="pt-bmi-bar">
                  <div className="pt-bmi-segment" style={{ background: '#1890ff', flex: 1 }} />
                  <div className="pt-bmi-segment" style={{ background: '#52c41a', flex: 1 }} />
                  <div className="pt-bmi-segment" style={{ background: '#faad14', flex: 1 }} />
                  <div className="pt-bmi-segment" style={{ background: '#ff4d4f', flex: 1 }} />
                </div>
                <div className="pt-bmi-pointer" style={{ left: `${Math.min(Math.max(((bmiValue - 15) / 25) * 100, 0), 100)}%` }} />
                <div className="pt-bmi-labels">
                  <span>15</span><span>18.5</span><span>25</span><span>30</span><span>40</span>
                </div>
              </div>
            </div>
          </Card>
        </Col>

        {/* Weight + Stress Charts */}
        <Col xs={24} md={12}>
          <Card className="pt-chart-card">
            <div className="pt-chart-header">
              <Scale size={20} color="#2d6a4f" />
              <Title level={5} style={{ margin: 0 }}>Weight Progress</Title>
              <Tag color="green" style={{ marginLeft: 'auto' }}>{weightChange}kg</Tag>
            </div>
            <div style={{ height: 260, width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="gradWeight" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#2d6a4f" stopOpacity={0.25} />
                      <stop offset="100%" stopColor="#2d6a4f" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} />
                  <YAxis hide domain={['dataMin - 2', 'dataMax + 2']} />
                  <Tooltip content={<CustomTooltipContent />} />
                  <Area type="monotone" dataKey="weight" name="Weight (kg)" stroke="#2d6a4f" fillOpacity={1} fill="url(#gradWeight)" strokeWidth={3} dot={{ r: 5, fill: '#fff', stroke: '#2d6a4f', strokeWidth: 2 }} activeDot={{ r: 7, fill: '#2d6a4f' }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card className="pt-chart-card">
            <div className="pt-chart-header">
              <Brain size={20} color="#ff4d4f" />
              <Title level={5} style={{ margin: 0 }}>Stress Tracker</Title>
              <Tag color={avgStress <= 4 ? 'green' : avgStress <= 6 ? 'orange' : 'red'} style={{ marginLeft: 'auto' }}>Avg: {avgStress}</Tag>
            </div>
            <div style={{ height: 260, width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="gradStress" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#ff4d4f" stopOpacity={0.2} />
                      <stop offset="100%" stopColor="#ff4d4f" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} />
                  <YAxis hide domain={[0, 10]} />
                  <Tooltip content={<CustomTooltipContent />} />
                  <Area type="monotone" dataKey="stress" name="Stress" stroke="#ff4d4f" fill="url(#gradStress)" strokeWidth={3} dot={{ r: 5, fill: '#fff', stroke: '#ff4d4f', strokeWidth: 2 }} activeDot={{ r: 7, fill: '#ff4d4f' }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>

        {/* Water Intake Bar + Sleep Composed */}
        <Col xs={24} md={12}>
          <Card className="pt-chart-card">
            <div className="pt-chart-header">
              <Droplets size={20} color="#1890ff" />
              <Title level={5} style={{ margin: 0 }}>Water Intake</Title>
              <Tag color="blue" style={{ marginLeft: 'auto' }}>Avg: {avgWater}L</Tag>
            </div>
            <div style={{ height: 260, width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} barSize={32}>
                  <defs>
                    <linearGradient id="gradWater" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#1890ff" stopOpacity={0.9} />
                      <stop offset="100%" stopColor="#69c0ff" stopOpacity={0.6} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} />
                  <YAxis hide domain={[0, 5]} />
                  <Tooltip content={<CustomTooltipContent />} />
                  <Bar dataKey="water" name="Water (L)" fill="url(#gradWater)" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card className="pt-chart-card">
            <div className="pt-chart-header">
              <Moon size={20} color="#722ed1" />
              <Title level={5} style={{ margin: 0 }}>Sleep Pattern</Title>
              <Tag color="purple" style={{ marginLeft: 'auto' }}>Avg: {avgSleep}hrs</Tag>
            </div>
            <div style={{ height: 260, width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={chartData}>
                  <defs>
                    <linearGradient id="gradSleep" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#722ed1" stopOpacity={0.2} />
                      <stop offset="100%" stopColor="#722ed1" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} />
                  <YAxis hide domain={[0, 12]} />
                  <Tooltip content={<CustomTooltipContent />} />
                  <Area type="monotone" dataKey="sleep" name="Sleep (hrs)" fill="url(#gradSleep)" stroke="none" />
                  <Line type="monotone" dataKey="sleep" name="Sleep (hrs)" stroke="#722ed1" strokeWidth={3} dot={{ r: 5, fill: '#fff', stroke: '#722ed1', strokeWidth: 2 }} activeDot={{ r: 7, fill: '#722ed1' }} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>

        {/* Streak & Achievements */}
        <Col xs={24} md={8}>
          <Card className="pt-chart-card pt-streak-card">
            <div className="pt-streak-top">
              <div className="pt-streak-flame">
                <Flame size={36} color="#ff4d4f" fill="#ff4d4f" />
              </div>
              <div className="pt-streak-count">{streak}</div>
              <Text className="pt-streak-label">Day Streak</Text>
            </div>
            <Progress
              percent={Math.min(streak * 14, 100)}
              strokeColor={{ '0%': '#ff4d4f', '100%': '#faad14' }}
              strokeWidth={12}
              showInfo={false}
              style={{ marginTop: 16 }}
            />
            <Text type="secondary" style={{ fontSize: 12, marginTop: 8, display: 'block', textAlign: 'center' }}>
              {streak >= 7 ? 'Amazing consistency!' : `${Math.max(7 - streak, 0)} more for weekly badge`}
            </Text>
          </Card>
        </Col>

        <Col xs={24} md={16}>
          <Card className="pt-chart-card">
            <div className="pt-chart-header">
              <Award size={20} color="#faad14" />
              <Title level={5} style={{ margin: 0 }}>Achievements</Title>
            </div>
            <div className="pt-achievements-grid">
              {achievements.map((ach, idx) => (
                <div key={idx} className={`pt-achievement ${ach.unlocked ? 'unlocked' : 'locked'}`}>
                  <div className="pt-ach-icon" style={{ background: ach.unlocked ? `${ach.color}15` : '#f5f5f5', color: ach.unlocked ? ach.color : '#ccc' }}>
                    {ach.icon}
                  </div>
                  <span className="pt-ach-label">{ach.label}</span>
                  {ach.unlocked && <span className="pt-ach-check">&#10003;</span>}
                </div>
              ))}
            </div>
          </Card>
        </Col>

        {/* Health Profile Summary */}
        <Col span={24}>
          <Card className="pt-chart-card pt-profile-card">
            <div className="pt-chart-header">
              <Eye size={20} color="#2d6a4f" />
              <Title level={5} style={{ margin: 0 }}>Assessment Summary</Title>
            </div>
            <div className="pt-profile-grid">
              <div className="pt-profile-item">
                <div className="pt-profile-icon" style={{ background: '#e8f5e9' }}><Activity size={18} color="#2d6a4f" /></div>
                <div><Text type="secondary" className="pt-profile-label">Activity</Text><br /><Text strong>{activityLabel}</Text></div>
              </div>
              <div className="pt-profile-item">
                <div className="pt-profile-icon" style={{ background: '#fff1f0' }}><Brain size={18} color="#ff4d4f" /></div>
                <div><Text type="secondary" className="pt-profile-label">Stress</Text><br /><Text strong>{stressLabel}</Text></div>
              </div>
              <div className="pt-profile-item">
                <div className="pt-profile-icon" style={{ background: '#f0f5ff' }}><Moon size={18} color="#1890ff" /></div>
                <div><Text type="secondary" className="pt-profile-label">Sleep</Text><br /><Text strong>{sleepLabel} ({baseSleep}hrs)</Text></div>
              </div>
              <div className="pt-profile-item">
                <div className="pt-profile-icon" style={{ background: '#e6fffb' }}><Droplets size={18} color="#13c2c2" /></div>
                <div><Text type="secondary" className="pt-profile-label">Water</Text><br /><Text strong>{baseWater}L / day</Text></div>
              </div>
              <div className="pt-profile-item">
                <div className="pt-profile-icon" style={{ background: '#fff7e6' }}><Utensils size={18} color="#faad14" /></div>
                <div><Text type="secondary" className="pt-profile-label">Diet</Text><br /><Text strong style={{ textTransform: 'capitalize' }}>{userAnswers.dietType || 'Balanced'}</Text></div>
              </div>
              <div className="pt-profile-item">
                <div className="pt-profile-icon" style={{ background: '#f9f0ff' }}><Target size={18} color="#722ed1" /></div>
                <div><Text type="secondary" className="pt-profile-label">Goal</Text><br /><Text strong style={{ textTransform: 'capitalize' }}>{(userAnswers.primaryGoal || '').replace('_', ' ')}</Text></div>
              </div>
            </div>
          </Card>
        </Col>

        {/* AI Health Insights */}
        {healthData?.insights && (
          <Col span={24}>
            <div className="pt-insights-card">
              <div className="pt-insights-header">
                <Sparkles size={22} color="#fff" />
                <Title level={4} style={{ margin: 0, color: '#fff' }}>AI Health Insights</Title>
              </div>
              <div className="pt-insights-body">
                {healthData.insights.map((insight, idx) => (
                  <div key={idx} className="pt-insight-item">
                    <div className="pt-insight-dot" />
                    <Text style={{ color: '#e8f5e9', fontSize: 14 }}>{insight}</Text>
                  </div>
                ))}
              </div>
            </div>
          </Col>
        )}

        {/* Recent Logs Timeline */}
        {trackingLogs.length > 0 && (
          <Col span={24}>
            <Card className="pt-chart-card">
              <div className="pt-chart-header">
                <Clock size={20} color="#2d6a4f" />
                <Title level={5} style={{ margin: 0 }}>Recent Logs</Title>
                <Tag color="green" style={{ marginLeft: 'auto' }}>{trackingLogs.length} Total</Tag>
              </div>
              <div className="pt-logs-timeline">
                {trackingLogs.slice(-5).reverse().map((log, idx) => (
                  <div key={idx} className="pt-log-entry">
                    <div className="pt-log-date">
                      <span className="pt-log-day">{new Date(log.date).toLocaleDateString('en-US', { weekday: 'short' })}</span>
                      <span className="pt-log-full-date">{new Date(log.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                    </div>
                    <div className="pt-log-connector"><div className="pt-log-dot" /></div>
                    <div className="pt-log-data">
                      <span><Scale size={14} /> {log.weight}kg</span>
                      <span><Brain size={14} /> Stress: {log.stress}/10</span>
                      <span><Droplets size={14} /> {log.water}L</span>
                      <span><Moon size={14} /> {log.sleep || '-'}hrs</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </Col>
        )}
      </Row>

      {/* Log Daily Data Modal */}
      <Modal
        title={<Space><Plus size={18} color="#2d6a4f" /> Log Today's Data</Space>}
        open={logModalOpen}
        onCancel={() => setLogModalOpen(false)}
        footer={null}
        className="pt-log-modal"
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleLogSubmit}
          initialValues={{
            weight: currentWeight,
            stress: 5,
            water: parseFloat(userAnswers.waterIntake) || 2,
            sleep: parseFloat(userAnswers.sleepDuration) || 7
          }}
        >
          <div className="pt-modal-grid">
            <Form.Item label={<Space><Scale size={14} /> Weight (kg)</Space>} name="weight" rules={[{ required: true, message: 'Required' }]}>
              <InputNumber min={30} max={200} step={0.1} style={{ width: '100%' }} size="large" />
            </Form.Item>
            <Form.Item label={<Space><Brain size={14} /> Stress (1-10)</Space>} name="stress" rules={[{ required: true, message: 'Required' }]}>
              <InputNumber min={1} max={10} style={{ width: '100%' }} size="large" />
            </Form.Item>
            <Form.Item label={<Space><Droplets size={14} /> Water (L)</Space>} name="water" rules={[{ required: true, message: 'Required' }]}>
              <InputNumber min={0} max={10} step={0.5} style={{ width: '100%' }} size="large" />
            </Form.Item>
            <Form.Item label={<Space><Moon size={14} /> Sleep (hrs)</Space>} name="sleep" rules={[{ required: true, message: 'Required' }]}>
              <InputNumber min={0} max={24} step={0.5} style={{ width: '100%' }} size="large" />
            </Form.Item>
          </div>
          <Button type="primary" htmlType="submit" block size="large" className="pt-submit-btn">
            <Sparkles size={16} /> Save Log
          </Button>
        </Form>
      </Modal>
    </div>
  );
};

export default ProgressTracker;
