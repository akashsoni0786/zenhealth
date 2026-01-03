import React, { useState } from 'react';
import { Card, Row, Col, Typography, Input, Tag, Button, Modal, List, Badge, Space } from 'antd';
import { Search, Clock, Award, PlayCircle } from 'lucide-react';
import { yogaData } from '../data/mockData';

const { Title, Text, Paragraph } = Typography;

const YogaLibrary = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPose, setSelectedPose] = useState(null);
  const [filter, setFilter] = useState('all');

  const filteredData = yogaData.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.benefits.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || item.category.includes(filter);
    return matchesSearch && matchesFilter;
  });

  const categories = ['all', 'weight loss', 'flexibility', 'mental health', 'back pain', 'stress'];

  return (
    <div>
      <div style={{ marginBottom: 32, textAlign: 'center' }}>
        <Title level={2}>Yoga & Exercise Library</Title>
        <Paragraph>Discover poses to improve your physical and mental well-being.</Paragraph>
        
        <Space direction="vertical" size="middle" style={{ width: '100%', maxWidth: 600 }}>
          <Input 
            prefix={<Search size={18} style={{ color: '#bfbfbf' }} />}
            placeholder="Search by name or benefit..." 
            size="large"
            onChange={e => setSearchTerm(e.target.value)}
          />
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
            {categories.map(cat => (
              <Tag.CheckableTag
                key={cat}
                checked={filter === cat}
                onChange={checked => checked && setFilter(cat)}
                style={{ fontSize: '14px', padding: '4px 12px', border: '1px solid #d9d9d9' }}
              >
                {cat.toUpperCase()}
              </Tag.CheckableTag>
            ))}
          </div>
        </Space>
      </div>

      <Row gutter={[24, 24]}>
        {filteredData.map(item => (
          <Col xs={24} sm={12} lg={8} key={item.id}>
            <Card
              hoverable
              cover={
                <div style={{ 
                  height: 180, 
                  background: 'linear-gradient(135deg, #d8f3dc 0%, #95d5b2 100%)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center' 
                }}>
                  <PlayCircle size={48} color="#2d6a4f" opacity={0.6} />
                </div>
              }
              actions={[
                <Button type="link" onClick={() => setSelectedPose(item)}>View Details</Button>
              ]}
            >
              <Badge.Ribbon text={item.difficulty} color={item.difficulty === 'Beginner' ? 'green' : 'orange'}>
                <Card.Meta
                  title={item.name}
                  description={
                    <div style={{ height: 60, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {item.benefits}
                    </div>
                  }
                />
              </Badge.Ribbon>
              <div style={{ marginTop: 16, display: 'flex', gap: 12 }}>
                <Text type="secondary" style={{ fontSize: '12px', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Clock size={14} /> {item.duration}
                </Text>
                <Text type="secondary" style={{ fontSize: '12px', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Award size={14} /> {item.difficulty}
                </Text>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      <Modal
        title={selectedPose?.name}
        open={!!selectedPose}
        onCancel={() => setSelectedPose(null)}
        footer={[
          <Button key="close" onClick={() => setSelectedPose(null)}>Close</Button>
        ]}
        width={800}
      >
        {selectedPose && (
          <div>
            {selectedPose.videoUrl && (
              <div style={{ marginBottom: 24, borderRadius: 12, overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                <iframe
                  width="100%"
                  height="400"
                  src={selectedPose.videoUrl}
                  title={selectedPose.name}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            )}

            <Title level={4}>Benefits</Title>
            <Paragraph>{selectedPose.benefits}</Paragraph>
            
            <Row gutter={16} style={{ marginBottom: 16 }}>
              <Col span={12}>
                <Card size="small" style={{ background: '#f6ffed' }}>
                  <Text strong>Duration:</Text> <Text>{selectedPose.duration}</Text>
                </Card>
              </Col>
              <Col span={12}>
                <Card size="small" style={{ background: '#f9f0ff' }}>
                  <Text strong>Difficulty:</Text> <Text>{selectedPose.difficulty}</Text>
                </Card>
              </Col>
            </Row>

            <Title level={4}>Step-by-Step Instructions</Title>
            <List
              dataSource={selectedPose.steps}
              renderItem={(step, index) => (
                <List.Item>
                  <Text strong style={{ marginRight: 8 }}>{index + 1}.</Text> {step}
                </List.Item>
              )}
            />
          </div>
        )}
      </Modal>
    </div>
  );
};

export default YogaLibrary;
