import React, { useState } from 'react';
import { Card, Select, Typography, Space, List, Tag, Alert, Divider, Row, Col } from 'antd';
import { Stethoscope, Leaf, Pill, Activity } from 'lucide-react';
import { healthAdvice } from '../data/mockData';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

const HealthAdvisor = () => {
  const [selectedIssue, setSelectedIssue] = useState(null);

  const handleChange = (value) => {
    setSelectedIssue(healthAdvice[value]);
  };

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      <Title level={2}>Health Problem Advisor</Title>
      <Paragraph>Select a health concern to get recommended yoga, exercises, and remedies.</Paragraph>

      <Card style={{ marginBottom: 24 }}>
        <Select
          showSearch
          style={{ width: '100%' }}
          placeholder="Select or type a health issue (e.g. back pain, stress...)"
          onChange={handleChange}
          optionFilterProp="children"
        >
          {Object.keys(healthAdvice).map(issue => (
            <Option key={issue} value={issue}>
              {issue.charAt(0).toUpperCase() + issue.slice(1)}
            </Option>
          ))}
        </Select>
      </Card>

      {selectedIssue && (
        <Row gutter={[24, 24]}>
          <Col xs={24} md={12}>
            <Card title={<><Activity size={18} style={{ marginRight: 8 }} /> Yoga & Exercises</>} hoverable>
              <Title level={5}>Recommended Yoga</Title>
              <Space wrap>
                {selectedIssue.yoga.map(item => (
                  <Tag color="blue" key={item}>{item}</Tag>
                ))}
              </Space>
              <Divider style={{ margin: '12px 0' }} />
              <Title level={5}>Exercises</Title>
              <List
                size="small"
                dataSource={selectedIssue.exercises}
                renderItem={item => <List.Item><Text>- {item}</Text></List.Item>}
              />
            </Card>
          </Col>

          <Col xs={24} md={12}>
            <Card title={<><Leaf size={18} style={{ marginRight: 8 }} /> Remedies & Medicines</>} hoverable>
              <Title level={5}>Home Remedies</Title>
              <List
                size="small"
                dataSource={selectedIssue.remedies}
                renderItem={item => <List.Item><Text>- {item}</Text></List.Item>}
              />
              <Divider style={{ margin: '12px 0' }} />
              <Title level={5}><Pill size={16} style={{ marginRight: 8 }} /> Medicines</Title>
              <List
                size="small"
                dataSource={selectedIssue.medicines}
                renderItem={item => <List.Item><Text type="danger">{item}</Text></List.Item>}
              />
            </Card>
          </Col>

          <Col span={24}>
            <Alert
              message="Important Medical Disclaimer"
              description="The information provided is for educational purposes. Always consult with a qualified healthcare professional before starting any new exercise program, yoga practice, or taking any herbal remedies or medications."
              type="warning"
              showIcon
              style={{ marginTop: 16 }}
            />
          </Col>
        </Row>
      )}
    </div>
  );
};

export default HealthAdvisor;
