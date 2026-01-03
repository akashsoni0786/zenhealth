import React, { useState, useEffect, useRef } from 'react';
import { Card, Input, Button, List, Typography, Avatar, Space, Tag, Alert, Modal, Result } from 'antd';
import { Send, User, Bot, Sparkles, Crown, Lock } from 'lucide-react';
import { useHealth } from '../context/HealthContext';
import MedicalDisclaimer from '../components/MedicalDisclaimer';
import SubscriptionModal from '../components/SubscriptionModal';

const { Title, Text } = Typography;

const AIChatAssistant = () => {
  const { healthData, userAnswers, isPremium } = useHealth();
  const [isSubModalOpen, setIsSubModalOpen] = useState(false);
  const [messages, setMessages] = useState([
    { 
      role: 'bot', 
      text: userAnswers 
        ? `Namaste! I've reviewed your level 5 analysis. Since your focus is ${userAnswers.primaryConcern}, how can I help you today?` 
        : 'Namaste! I am your Zen AI Coach. Complete the assessment to get started!' 
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!isPremium && messages.length >= 3) {
      setIsSubModalOpen(true);
      return;
    }
    
    if (!inputValue.trim()) return;

    const userMsg = { role: 'user', text: inputValue };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    setTimeout(() => {
      let botResponse = "I'm processing that. Based on your health score and BMI, consistency is your greatest ally. Would you like a specific yoga routine for today?";
      
      const lowerInput = inputValue.toLowerCase();
      if (lowerInput.includes('bmi')) {
        botResponse = `Your current BMI is ${healthData?.bmi?.value || 'not calculated yet'}. For your category (${healthData?.bmi?.category}), we recommend focusing on moderate-intensity breathing exercises first.`;
      }

      setMessages(prev => [...prev, { role: 'bot', text: botResponse }]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', height: 'calc(100vh - 180px)', display: 'flex', flexDirection: 'column', padding: '0 10px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <Title level={3} style={{ color: '#2d6a4f', margin: 0 }}>ZenAI Coach</Title>
          <Text type="secondary">Holistic Health Guidance</Text>
        </div>
        {!isPremium && (
          <Button type="primary" ghost icon={<Crown size={14} />} onClick={() => setIsSubModalOpen(true)}>Upgrade</Button>
        )}
      </div>

      <Card 
        styles={{ body: { padding: 0 } }} 
        style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', borderRadius: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}
      >
        <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: '24px', background: '#fdfbf7' }}>
          <List
            dataSource={messages}
            renderItem={msg => (
              <List.Item style={{ justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start', border: 'none', padding: '12px 0' }}>
                <div style={{ display: 'flex', flexDirection: msg.role === 'user' ? 'row-reverse' : 'row', maxWidth: '85%', alignItems: 'flex-start', gap: 12 }}>
                  <Avatar icon={msg.role === 'user' ? <User size={16} /> : <Bot size={16} />} style={{ backgroundColor: msg.role === 'user' ? '#74c69d' : '#2d6a4f', flexShrink: 0 }} />
                  <div style={{ padding: '12px 18px', borderRadius: '18px', background: msg.role === 'user' ? '#2d6a4f' : '#fff', color: msg.role === 'user' ? '#fff' : 'inherit', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
                    <Text style={{ color: msg.role === 'user' ? '#fff' : 'inherit' }}>{msg.text}</Text>
                  </div>
                </div>
              </List.Item>
            )}
          />
          {!isPremium && messages.length >= 3 && (
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
               <Tag color="warning" style={{ padding: '8px 16px', borderRadius: '8px' }}>
                 <Lock size={12} style={{ marginRight: 8 }} />
                 Free message limit reached. Upgrade to continue.
               </Tag>
            </div>
          )}
        </div>

        <div style={{ padding: '24px', borderTop: '1px solid #f0f0f0', background: '#fff' }}>
          <Space.Compact style={{ width: '100%' }}>
            <Input 
              placeholder={isPremium || messages.length < 3 ? "Ask about your plan, BMI, or routines..." : "Subscribe to unlock unlimited chat"} 
              value={inputValue}
              size="large"
              onChange={e => setInputValue(e.target.value)}
              onPressEnter={handleSend}
              disabled={!isPremium && messages.length >= 3}
            />
            <Button type="primary" size="large" icon={<Send size={18} />} onClick={handleSend} disabled={!isPremium && messages.length >= 3}>
              Send
            </Button>
          </Space.Compact>
          <div style={{ marginTop: '16px' }}>
             <MedicalDisclaimer style={{ padding: '8px 12px' }} />
          </div>
        </div>
      </Card>

      <Modal open={isSubModalOpen} onCancel={() => setIsSubModalOpen(false)} footer={null} width={900} styles={{ body: { padding: 0 } }}>
        <SubscriptionModal onUpgrade={() => setIsSubModalOpen(false)} />
      </Modal>
    </div>
  );
};

export default AIChatAssistant;
