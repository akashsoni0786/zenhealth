import React, { useState } from 'react';
import { Card, Form, Input, Button, Typography, Space, Alert, Row, Col, List, Tag } from 'antd';
import { Activity, Heart, Info } from 'lucide-react';

const { Title, Text, Paragraph } = Typography;

const BPChecker = () => {
  const [result, setResult] = useState(null);

  const onFinish = (values) => {
    const { systolic, diastolic } = values;
    let category = '';
    let color = '';
    let advice = [];

    if (systolic < 120 && diastolic < 80) {
      category = 'Normal';
      color = 'success';
      advice = [
        "Maintain a healthy diet rich in fruits and vegetables.",
        "Engage in regular physical activity (30 mins a day).",
        "Practice deep breathing (Pranayama) like Anulom Vilom."
      ];
    } else if (systolic <= 129 && diastolic < 80) {
      category = 'Elevated';
      color = 'warning';
      advice = [
        "Reduce sodium intake.",
        "Practice stress-reducing yoga like Savasana.",
        "Monitor your BP regularly."
      ];
    } else if (systolic <= 139 || diastolic <= 89) {
      category = 'Hypertension Stage 1';
      color = 'orange';
      advice = [
        "Adopt a HEART-healthy lifestyle.",
        "Avoid intense exercises; prefer light yoga.",
        "Consult a healthcare professional."
      ];
    } else {
      category = 'Hypertension Stage 2 / Crisis';
      color = 'error';
      advice = [
        "Seek medical attention immediately.",
        "Strictly follow prescribed medications.",
        "Practice very gentle breathing exercises only under guidance."
      ];
    }

    setResult({ systolic, diastolic, category, color, advice });
  };

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      <Title level={2}>Blood Pressure Checker</Title>
      <Row gutter={[24, 24]}>
        <Col xs={24} md={12}>
          <Card hoverable>
            <Form layout="vertical" onFinish={onFinish}>
              <Form.Item 
                label="Systolic (Upper value)" 
                name="systolic" 
                rules={[{ required: true, message: 'Please input systolic value' }]}
              >
                <Input type="number" placeholder="e.g. 120" suffix="mmHg" />
              </Form.Item>
              <Form.Item 
                label="Diastolic (Lower value)" 
                name="diastolic" 
                rules={[{ required: true, message: 'Please input diastolic value' }]}
              >
                <Input type="number" placeholder="e.g. 80" suffix="mmHg" />
              </Form.Item>
              <Button type="primary" htmlType="submit" icon={<Activity size={16} />} block>
                Check Category
              </Button>
            </Form>
          </Card>
        </Col>

        <Col xs={24} md={12}>
          {result && (
            <Space direction="vertical" style={{ width: '100%' }}>
              <Alert
                message={`Category: ${result.category}`}
                description={`Values: ${result.systolic}/${result.diastolic} mmHg`}
                type={result.color === 'orange' ? 'warning' : result.color}
                showIcon
                icon={<Heart />}
              />
              
              <Card title="Lifestyle & Yoga Suggestions" size="small">
                <List
                  size="small"
                  dataSource={result.advice}
                  renderItem={(item) => (
                    <List.Item>
                      <Text><Tag color="green">✓</Tag> {item}</Text>
                    </List.Item>
                  )}
                />
              </Card>

              <Alert
                message="Disclaimer"
                description="This tool is for informational purposes only and does not replace professional medical advice."
                type="info"
                showIcon
                style={{ fontSize: '12px' }}
              />
            </Space>
          )}
          {!result && (
            <Card style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Text type="secondary">Enter your BP readings to get a personalized report</Text>
            </Card>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default BPChecker;
