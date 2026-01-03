import React, { useState } from 'react';
import { Card, Form, Input, Button, Radio, Typography, Space, Alert, Row, Col, List } from 'antd';
import { Calculator, Info } from 'lucide-react';
import { yogaData } from '../data/mockData';

const { Title, Text } = Typography;

const BMICalculator = () => {
  const [bmi, setBmi] = useState(null);
  const [category, setCategory] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  const onFinish = (values) => {
    const { height, weight } = values;
    const heightInMeters = height / 100;
    const bmiValue = (weight / (heightInMeters * heightInMeters)).toFixed(1);
    setBmi(bmiValue);

    let cat = '';
    if (bmiValue < 18.5) cat = 'Underweight';
    else if (bmiValue < 25) cat = 'Normal';
    else if (bmiValue < 30) cat = 'Overweight';
    else cat = 'Obese';
    setCategory(cat);

    // Filter yoga poses based on category
    const filteredYoga = yogaData.filter(pose => 
      pose.category.includes(cat.toLowerCase()) || pose.category.includes('normal')
    );
    setSuggestions(filteredYoga);
  };

  const getAlertColor = () => {
    switch (category) {
      case 'Normal': return 'success';
      case 'Underweight': return 'warning';
      case 'Overweight': return 'warning';
      case 'Obese': return 'error';
      default: return 'info';
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      <Title level={2}>BMI Calculator</Title>
      <Row gutter={[24, 24]}>
        <Col xs={24} md={12}>
          <Card hoverable>
            <Form layout="vertical" onFinish={onFinish}>
              <Form.Item label="Gender" name="gender" rules={[{ required: true }]}>
                <Radio.Group>
                  <Radio value="male">Male</Radio>
                  <Radio value="female">Female</Radio>
                </Radio.Group>
              </Form.Item>
              <Form.Item label="Age" name="age" rules={[{ required: true }]}>
                <Input type="number" placeholder="Enter age" />
              </Form.Item>
              <Form.Item label="Height (cm)" name="height" rules={[{ required: true }]}>
                <Input type="number" placeholder="Enter height in cm" />
              </Form.Item>
              <Form.Item label="Weight (kg)" name="weight" rules={[{ required: true }]}>
                <Input type="number" placeholder="Enter weight in kg" />
              </Form.Item>
              <Button type="primary" htmlType="submit" icon={<Calculator size={16} />} block>
                Calculate BMI
              </Button>
            </Form>
          </Card>
        </Col>

        <Col xs={24} md={12}>
          {bmi && (
            <Space direction="vertical" style={{ width: '100%' }}>
              <Alert
                message={`Your BMI: ${bmi}`}
                description={`Category: ${category}`}
                type={getAlertColor()}
                showIcon
                icon={<Info />}
              />
              
              <Card title="Suggested Yoga Poses" size="small">
                <List
                  dataSource={suggestions}
                  renderItem={(item) => (
                    <List.Item>
                      <List.Item.Meta
                        title={item.name}
                        description={item.benefits}
                      />
                    </List.Item>
                  )}
                />
              </Card>

              <Text type="secondary" style={{ fontSize: '12px' }}>
                Note: BMI is a general indicator and may not account for muscle mass or overall body composition.
              </Text>
            </Space>
          )}
          {!bmi && (
            <Card style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Text type="secondary">Enter your details to see results</Text>
            </Card>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default BMICalculator;
