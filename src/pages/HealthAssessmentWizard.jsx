import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Radio, Select, Steps, Card, Progress, Typography, Divider, Tag, Row, Col, InputNumber, Statistic } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useHealth } from '../context/HealthContext';
import { calculateBMI } from '../utils/healthLogic';
import MedicalDisclaimer from '../components/MedicalDisclaimer';
import { User, Activity, Utensils, Brain, ShieldAlert, Sparkles, ClipboardList, ChevronRight, ChevronLeft, Check } from 'lucide-react';
import './HealthAssessmentWizard.css';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

const steps = [
  { title: 'Basics', icon: <User size={16} /> },
  { title: 'Lifestyle', icon: <Activity size={16} /> },
  { title: 'Nutrition', icon: <Utensils size={16} /> },
  { title: 'Mind', icon: <Brain size={16} /> },
  { title: 'Review', icon: <ShieldAlert size={16} /> }
];

const stepLabels = [
  { icon: <User size={15} />, text: 'Step 1 — Basic Info' },
  { icon: <Activity size={15} />, text: 'Step 2 — Lifestyle' },
  { icon: <Utensils size={15} />, text: 'Step 3 — Nutrition' },
  { icon: <Brain size={15} />, text: 'Step 4 — Mental Health' },
  { icon: <ShieldAlert size={15} />, text: 'Step 5 — Final Review' },
];

const HealthAssessmentWizard = () => {
  const [current, setCurrent] = useState(0);
  const [bmiData, setBmiData] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(0);
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
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.log('Validation failed:', error);
    }
  };

  const prev = () => {
    setCurrent(current - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const onFinish = (values) => {
    setIsAnalyzing(true);
    setAnalysisStep(0);

    // Animate through analysis steps
    const stepTimers = [500, 1000, 1600, 2100];
    stepTimers.forEach((delay, i) => {
      setTimeout(() => setAnalysisStep(i + 1), delay);
    });

    setTimeout(() => {
      saveAnswers(values);
      navigate('/score-dashboard');
    }, 2800);
  };

  const progressPercent = ((current + 1) / steps.length) * 100;

  if (isAnalyzing) {
    const analysisSteps = [
      'Calculating BMI & body composition...',
      'Analyzing lifestyle & sleep patterns...',
      'Evaluating nutrition & dietary habits...',
      'Generating personalized health score...',
    ];

    return (
      <div className="haw-analyzing">
        <div className="haw-analyzing-icon">
          <Sparkles size={36} color="#2d6a4f" />
        </div>
        <Title level={3}>FitAI is Analyzing Your Profile</Title>
        <Paragraph type="secondary">
          Correlating BMI with lifestyle factors, sleep cycles, and dietary patterns...
        </Paragraph>
        <Progress
          percent={Math.min(analysisStep * 25 + 10, 95)}
          status="active"
          strokeColor={{ from: '#1b4332', to: '#40916c' }}
          showInfo={false}
        />
        <div className="haw-analyzing-steps">
          {analysisSteps.map((step, i) => (
            <div
              key={i}
              className={`haw-analyzing-step ${analysisStep > i ? 'done' : analysisStep === i ? 'active' : ''}`}
            >
              {analysisStep > i ? <Check size={16} color="#52c41a" /> : <Sparkles size={14} />}
              {step}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="haw-page">
      {/* ─── Header Banner ─── */}
      <div className="haw-header">
        <div className="haw-header-icon">
          <ClipboardList size={30} color="#fff" />
        </div>
        <Title level={2}>Health Assessment</Title>
        <Text className="haw-header-subtitle">
          Complete this 5-step holistic health quiz for your personalized wellness score
        </Text>
      </div>

      {/* ─── Main Card ─── */}
      <Card className="haw-card" variant="borderless">
        {/* Progress Bar */}
        <div className="haw-progress-bar">
          <div className="haw-progress-fill" style={{ width: `${progressPercent}%` }} />
        </div>

        {/* Steps */}
        <Steps
          current={current}
          size="small"
          className="haw-steps"
          items={steps.map(s => ({ title: s.title, icon: s.icon }))}
        />

        {/* BMI Banner */}
        {bmiData && (
          <div className="haw-bmi-banner">
            <Statistic title="Your BMI" value={bmiData.value} valueStyle={{ color: bmiData.color }} />
            <Divider type="vertical" style={{ height: '40px' }} className="haw-bmi-divider" />
            <div className="haw-bmi-info">
              <Text strong>Category: </Text>
              <Tag color={bmiData.color}>{bmiData.category}</Tag>
              <br />
              <Text type="secondary" style={{ fontSize: '12px' }}>Used to calibrate your personalized plan</Text>
            </div>
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
            <div className="haw-step-content">
              <div className="haw-step-label">
                {stepLabels[0].icon} {stepLabels[0].text}
              </div>
              <Row gutter={16}>
                <Col xs={24} sm={12}>
                  <Form.Item label="Age" name="age" rules={[{ required: true, message: 'Enter your age' }]}>
                    <InputNumber min={10} max={120} placeholder="25" style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item label="Gender" name="gender" rules={[{ required: true }]}>
                    <Select>
                      <Option value="male">Male</Option>
                      <Option value="female">Female</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col xs={24} sm={12}>
                  <Form.Item label="Height (cm)" name="height" rules={[{ required: true, message: 'Enter height' }]}>
                    <InputNumber min={100} max={250} placeholder="170" style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item label="Weight (kg)" name="weight" rules={[{ required: true, message: 'Enter weight' }]}>
                    <InputNumber min={20} max={300} placeholder="65" style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item label="Primary Health Goal" name="primaryGoal" rules={[{ required: true, message: 'Select a goal' }]}>
                <Select placeholder="Choose your main goal">
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
            <div className="haw-step-content">
              <div className="haw-step-label">
                {stepLabels[1].icon} {stepLabels[1].text}
              </div>
              <Form.Item label="Sleep Duration (Hours)" name="sleepDuration" rules={[{ required: true, message: 'Enter sleep hours' }]}>
                <InputNumber min={1} max={24} placeholder="7" style={{ width: '100%' }} />
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
                  <Option value="moderate">Moderate (Walking / Light exercise)</Option>
                  <Option value="active">Very Active (Regular workout)</Option>
                </Select>
              </Form.Item>
              <Form.Item label="Daily Water Intake (Liters)" name="waterIntake">
                <InputNumber min={0} max={10} step={0.5} placeholder="2" style={{ width: '100%' }} />
              </Form.Item>
            </div>
          )}

          {/* Level 3: Nutrition */}
          {current === 2 && (
            <div className="haw-step-content">
              <div className="haw-step-label">
                {stepLabels[2].icon} {stepLabels[2].text}
              </div>
              <Form.Item label="Dietary Preference" name="dietType" rules={[{ required: true }]}>
                <Radio.Group>
                  <Radio value="veg">Vegetarian</Radio>
                  <Radio value="non-veg">Non-Vegetarian</Radio>
                  <Radio value="vegan">Vegan</Radio>
                </Radio.Group>
              </Form.Item>
              <Form.Item label="How often do you eat junk food?" name="junkFrequency" rules={[{ required: true, message: 'Select frequency' }]}>
                <Select>
                  <Option value="rarely">Rarely</Option>
                  <Option value="weekly">1-2 times a week</Option>
                  <Option value="daily">Daily</Option>
                </Select>
              </Form.Item>
              <Form.Item label="Sugar Intake Level" name="sugarLevel" rules={[{ required: true, message: 'Select sugar level' }]}>
                <Select>
                  <Option value="low">Low</Option>
                  <Option value="moderate">Moderate</Option>
                  <Option value="high">High</Option>
                </Select>
              </Form.Item>
            </div>
          )}

          {/* Level 4: Mind */}
          {current === 3 && (
            <div className="haw-step-content">
              <div className="haw-step-label">
                {stepLabels[3].icon} {stepLabels[3].text}
              </div>
              <Form.Item label="How often do you feel stressed?" name="stressLevel" rules={[{ required: true }]}>
                <Select>
                  <Option value="low">Rarely</Option>
                  <Option value="moderate">Sometimes</Option>
                  <Option value="high">Frequently</Option>
                </Select>
              </Form.Item>
              <Form.Item label="Work-Life Balance Satisfaction (1-5)" name="workLifeBalance">
                <Radio.Group className="haw-rating-group">
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
            <div className="haw-step-content">
              <div className="haw-step-label">
                {stepLabels[4].icon} {stepLabels[4].text}
              </div>
              <Form.Item label="Primary Concern (For Root-Cause Analysis)" name="primaryConcern" rules={[{ required: true, message: 'Select your primary concern' }]}>
                <Select>
                  <Option value="weight">Weight Management</Option>
                  <Option value="stress">Stress & Anxiety</Option>
                  <Option value="digestion">Digestion</Option>
                  <Option value="skin">Skin & Hair</Option>
                </Select>
              </Form.Item>
              <Form.Item label="Family Medical History" name="familyHistory">
                <Input.TextArea placeholder="Any hereditary conditions? (e.g., diabetes, heart disease, BP)" rows={3} />
              </Form.Item>

              <MedicalDisclaimer style={{ marginBottom: '20px' }} />

              <Card size="small" className="haw-note-card">
                <Text type="warning" strong>
                  <ShieldAlert size={14} style={{ marginRight: 6, verticalAlign: 'middle' }} />
                  Note:
                </Text>
                <br />
                <Text style={{ fontSize: '12px' }}>
                  FitAI uses your BMI ({bmiData?.value || '—'}) to adjust the intensity of recommended yoga and exercise plans.
                </Text>
              </Card>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="haw-nav-buttons">
            {current > 0 && (
              <Button
                size="large"
                onClick={prev}
                className="haw-btn-prev"
                icon={<ChevronLeft size={18} />}
              >
                Previous
              </Button>
            )}
            {current < steps.length - 1 ? (
              <Button
                type="primary"
                size="large"
                onClick={next}
                block={current === 0}
                className="haw-btn-next"
              >
                Continue to Step {current + 2}
                <ChevronRight size={18} style={{ marginLeft: 6 }} />
              </Button>
            ) : (
              <Button
                type="primary"
                size="large"
                htmlType="submit"
                className="haw-btn-submit"
                icon={<Sparkles size={20} />}
              >
                Run FitAI Analysis
              </Button>
            )}
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default HealthAssessmentWizard;
