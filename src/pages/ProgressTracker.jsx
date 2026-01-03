import React, { useState } from 'react';
import { Card, Typography, Row, Col, Progress, List, Button, InputNumber, Space, Statistic, Divider, Alert } from 'antd';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip,
  AreaChart,
  Area
} from 'recharts';
import { 
  Trophy, 
  Calendar, 
  Flame, 
  ArrowUpRight,
  Plus
} from 'lucide-react';

const { Title, Text, Paragraph } = Typography;

const initialData = [
  { day: 'Mon', weight: 72, stress: 4 },
  { day: 'Tue', weight: 71.8, stress: 3 },
  { day: 'Wed', weight: 71.9, stress: 5 },
  { day: 'Thu', weight: 71.5, stress: 2 },
  { day: 'Fri', weight: 71.2, stress: 3 },
  { day: 'Sat', weight: 71.0, stress: 1 },
  { day: 'Sun', weight: 70.8, stress: 2 },
];

const ProgressTracker = () => {
  const [data, setData] = useState(initialData);
  const [streak, setStreak] = useState(5);

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: '20px' }}>
      <Row gutter={[24, 24]}>
        {/* Weekly Summary */}
        <Col span={24}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <Title level={2} style={{ color: '#2d6a4f', margin: 0 }}>Progress Tracker</Title>
            <Space>
              <Button icon={<Calendar size={16} />}>Check-in History</Button>
              <Button type="primary" icon={<Plus size={16} />}>Log Today's Data</Button>
            </Space>
          </div>
        </Col>

        {/* Motivation Widgets */}
        <Col xs={24} md={8}>
          <Card bordered={false} style={{ borderRadius: '16px', background: '#fff' }}>
            <Statistic
              title="Current Streak"
              value={streak}
              prefix={<Flame size={20} color="#ff4d4f" fill="#ff4d4f" />}
              suffix="days"
            />
            <div style={{ marginTop: '16px' }}>
              <Progress percent={70} strokeColor="#2d6a4f" showInfo={false} />
              <Text type="secondary" style={{ fontSize: '12px' }}>2 days until next badge: "Mindful Warrior"</Text>
            </div>
          </Card>
        </Col>
        
        <Col xs={24} md={8}>
          <Card bordered={false} style={{ borderRadius: '16px', background: '#fff' }}>
            <Statistic
              title="Weight Trend"
              value={-1.2}
              precision={1}
              valueStyle={{ color: '#3f8600' }}
              prefix={<ArrowUpRight size={20} style={{ transform: 'rotate(90deg)' }} />}
              suffix="kg (this week)"
            />
            <Text type="secondary" style={{ fontSize: '12px' }}>Target: 68 kg</Text>
          </Card>
        </Col>

        <Col xs={24} md={8}>
          <Card bordered={false} style={{ borderRadius: '16px', background: '#fff' }}>
            <Statistic
              title="Yoga Consistency"
              value={92}
              suffix="%"
            />
            <Text type="secondary" style={{ fontSize: '12px' }}>Outstanding! Above 90% target.</Text>
          </Card>
        </Col>

        {/* Charts */}
        <Col xs={24} md={12}>
          <Card title="Weight Progress (kg)" bordered={false} style={{ borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
            <div style={{ height: 250, width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2d6a4f" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#2d6a4f" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} />
                  <YAxis hide domain={['dataMin - 1', 'dataMax + 1']} />
                  <Tooltip />
                  <Area type="monotone" dataKey="weight" stroke="#2d6a4f" fillOpacity={1} fill="url(#colorWeight)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card title="Stress Level Index (1-10)" bordered={false} style={{ borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
            <div style={{ height: 250, width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} />
                  <YAxis hide domain={[0, 10]} />
                  <Tooltip />
                  <Line type="monotone" dataKey="stress" stroke="#ff4d4f" strokeWidth={2} dot={{ r: 4, fill: '#ff4d4f' }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>

        <Col span={24}>
          <Alert
            message="Weekly Reflection"
            description="You were more stressed on Wednesday, but your yoga consistency helped you recover quickly by Friday. Great job sticking to the routine!"
            type="success"
            showIcon
            icon={<Trophy size={20} />}
          />
        </Col>
      </Row>
    </div>
  );
};

export default ProgressTracker;
