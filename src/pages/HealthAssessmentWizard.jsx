import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Radio, Select, Steps, Card, Progress, Typography, Space, Divider, Tag, Row, Col, InputNumber, Statistic } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useHealth } from '../context/HealthContext';
import { calculateBMI } from '../utils/healthLogic';
import MedicalDisclaimer from '../components/MedicalDisclaimer';
import { User, Activity, Utensils, Brain, ShieldAlert, Sparkles } from 'lucide-react';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

const steps = [
  { title: 'Basics', icon: <User size={16} /> },
  { title: 'Lifestyle', icon: <Activity size={16} /> },
  { title: 'Nutrition', icon: <Utensils size={16} /> },
  { title: 'Mind', icon: <Brain size={16} /> },
  { title: 'Review', icon: <ShieldAlert size={16} /> }
];

const HealthAssessmentWizard = () => {
  const [current, setCurrent] = useState(0);
  const [bmiData, setBmiData] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { saveAnswers } = useHealth();

  const weight = Form.useWatch('weight', form);
  const height = Form.useWatch('height', form);

  useEffect(() => {
    if (weight && height) {
      const bmi = calculateBMI(height, weight);
      setBmiData(bmi);
    }
  }, [weight, height]);

  const next = async () => {
    try {
      await form.validateFields();
      setCurrent(current + 1);
    } catch (error) {
      console.log('Validation failed:', error);
    }
  };

  const prev = () => setCurrent(current - 1);

  const onFinish = (values) => {
    setIsAnalyzing(true);
    // Simulate AI deep analysis
    setTimeout(() => {
      saveAnswers(values);
      navigate('/score-dashboard');
    }, 2500);
  };

  if (isAnalyzing) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 20px' }}>
        <Sparkles size={48} className="typing-indicator" color="#2d6a4f" style={{ marginBottom: '24px' }} />
        <Title level={3}>ZenAI is Analyzing Your Health Profile</Title>
        <Paragraph>Correlating BMI with lifestyle factors, sleep cycles, and dietary patterns...</Paragraph>
        <Progress percent={90} status="active" strokeColor="#2d6a4f" style={{ maxWidth: 400 }} />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 700, margin: '0 auto', padding: '20px' }}>
      <Card variant="borderless" className="soft-shadow" style={{ borderRadius: '24px', background: '#fff' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <Title level={2} style={{ color: '#2d6a4f', margin: 0 }}>Health Assessment</Title>
          <Text type="secondary">Multi-level holistic diagnosis</Text>
        </div>

        <Steps 
          current={current} 
          size="small"
          items={steps.map(s => ({ title: s.title, icon: s.icon }))}
          style={{ marginBottom: '40px' }}
        />

        {bmiData && (
          <div style={{ marginBottom: '24px', padding: '16px', background: '#f0f7f4', borderRadius: '12px', textAlign: 'center' }}>
            <Space size="large">
              <Statistic title="Current BMI" value={bmiData.value} valueStyle={{ color: bmiData.color }} />
              <Divider type="vertical" style={{ height: '40px' }} />
              <div style={{ textAlign: 'left' }}>
                <Text strong>Category: </Text>
                <Tag color={bmiData.color}>{bmiData.category}</Tag>
                <br />
                <Text type="secondary" style={{ fontSize: '12px' }}>Used to calibrate your personalized plan</Text>
              </div>
            </Space>
          </div>
        )}

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            gender: 'female',
            sleepQuality: 'average',
            stressLevel: 'moderate',
            activityLevel: 'moderate',
            dietType: 'balanced',
            waterIntake: 2
          }}
        >
          {/* Level 1: Basics */}
          {current === 0 && (
            <div className="step-content">
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="Age" name="age" rules={[{ required: true }]}>
                    <Input type="number" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Gender" name="gender" rules={[{ required: true }]}>
                    <Select>
                      <Option value="male">Male</Option>
                      <Option value="female">Female</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="Height (cm)" name="height" rules={[{ required: true }]}>
                    <Input type="number" placeholder="170" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Weight (kg)" name="weight" rules={[{ required: true }]}>
                    <Input type="number" placeholder="65" />
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item label="Primary Health Goal" name="primaryGoal" rules={[{ required: true }]}>
                <Select placeholder="Choose one">
                  <Option value="weight_loss">Weight Loss</Option>
                  <Option value="stress_reduction">Stress Management</Option>
                  <Option value="gut_health">Gut Health</Option>
                  <Option value="immunity">Immunity Boost</Option>
                </Select>
              </Form.Item>
            </div>
          )}

          {/* Level 2: Lifestyle */}
          {current === 1 && (
            <div className="step-content">
              <Form.Item label="Sleep Duration (Hours)" name="sleepDuration" rules={[{ required: true }]}>
                <InputNumber min={1} max={24} style={{ width: '100%' }} />
              </Form.Item>
              <Form.Item label="Sleep Quality" name="sleepQuality" rules={[{ required: true }]}>
                <Radio.Group buttonStyle="solid">
                  <Radio.Button value="poor">Poor</Radio.Button>
                  <Radio.Button value="average">Average</Radio.Button>
                  <Radio.Button value="good">Good</Radio.Button>
                </Radio.Group>
              </Form.Item>
              <Form.Item label="Daily Activity Level" name="activityLevel" rules={[{ required: true }]}>
                <Select>
                  <Option value="sedentary">Sedentary (Little to no exercise)</Option>
                  <Option value="moderate">Moderate (Walking/Light exercise)</Option>
                  <Option value="active">Very Active (Regular workout)</Option>
                </Select>
              </Form.Item>
              <Form.Item label="Daily Water Intake (Liters)" name="waterIntake">
                <InputNumber min={0} step={0.5} style={{ width: '100%' }} />
              </Form.Item>
            </div>
          )}

          {/* Level 3: Nutrition */}
          {current === 2 && (
            <div className="step-content">
              <Form.Item label="Dietary Preference" name="dietType" rules={[{ required: true }]}>
                <Radio.Group>
                  <Radio value="veg">Vegetarian</Radio>
                  <Radio value="non-veg">Non-Vegetarian</Radio>
                  <Radio value="vegan">Vegan</Radio>
                </Radio.Group>
              </Form.Item>
              <Form.Item label="How often do you eat junk food?" name="junkFrequency" rules={[{ required: true }]}>
                <Select>
                  <Option value="rarely">Rarely</Option>
                  <Option value="weekly">1-2 times a week</Option>
                  <Option value="daily">Daily</Option>
                </Select>
              </Form.Item>
              <Form.Item label="Sugar Intake Level" name="sugarLevel" rules={[{ required: true }]}>
                <Select>
                  <Option value="low">Low</Option>
                  <Option value="moderate">Moderate</Option>
                  <Option value="high">High</Option>
                </Select>
              </Form.Item>
            </div>
          )}

          {/* Level 4: Stress */}
          {current === 3 && (
            <div className="step-content">
              <Form.Item label="How often do you feel stressed?" name="stressLevel" rules={[{ required: true }]}>
                <Select>
                  <Option value="low">Rarely</Option>
                  <Option value="moderate">Sometimes</Option>
                  <Option value="high">Frequently</Option>
                </Select>
              </Form.Item>
              <Form.Item label="Work-Life Balance Satisfaction" name="workLifeBalance">
                <Progress percent={50} steps={5} strokeColor="#2d6a4f" />
                <Radio.Group style={{ marginTop: '12px' }}>
                  <Radio value={1}>1</Radio>
                  <Radio value={2}>2</Radio>
                  <Radio value={3}>3</Radio>
                  <Radio value={4}>4</Radio>
                  <Radio value={5}>5</Radio>
                </Radio.Group>
              </Form.Item>
              <Form.Item label="Do you practice breathing exercises?" name="breathingPractice">
                <Radio.Group>
                  <Radio value="yes">Yes, regularly</Radio>
                  <Radio value="no">No</Radio>
                </Radio.Group>
              </Form.Item>
            </div>
          )}

          {/* Level 5: Review */}
          {current === 4 && (
            <div className="step-content">
              <Form.Item label="Primary Concern (For Root-Cause Analysis)" name="primaryConcern" rules={[{ required: true }]}>
                <Select>
                  <Option value="weight">Weight Management</Option>
                  <Option value="stress">Stress & Anxiety</Option>
                  <Option value="digestion">Digestion</Option>
                  <Option value="skin">Skin & Hair</Option>
                </Select>
              </Form.Item>
              <Form.Item label="Family Medical History" name="familyHistory">
                <Input.TextArea placeholder="Any hereditary conditions?" />
              </Form.Item>
              
              <MedicalDisclaimer style={{ marginBottom: '24px' }} />
              
              <Card size="small" style={{ background: '#fff7e6', border: '1px solid #ffe58f' }}>
                <Text type="warning" strong><ShieldAlert size={14} style={{ marginRight: 6 }} /> Note:</Text>
                <br />
                <Text style={{ fontSize: '12px' }}>Our AI uses your BMI ({bmiData?.value}) to adjust the intensity of recommended yoga and exercise plans.</Text>
              </Card>
            </div>
          )}

          <div style={{ marginTop: '32px', display: 'flex', justifyContent: 'space-between' }}>
            {current > 0 && (
              <Button size="large" onClick={prev} style={{ borderRadius: '12px' }}>
                Previous
              </Button>
            )}
            {current < steps.length - 1 ? (
              <Button type="primary" size="large" onClick={next} block={current === 0} style={{ borderRadius: '12px' }}>
                Continue to Level {current + 2}
              </Button>
            ) : (
              <Button type="primary" size="large" htmlType="submit" icon={<Sparkles size={18} />} style={{ borderRadius: '12px' }}>
                Run AI Analysis
              </Button>
            )}
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default HealthAssessmentWizard;
