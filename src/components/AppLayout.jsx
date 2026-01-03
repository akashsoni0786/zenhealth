import React from 'react';
import { Layout, Menu, Button, Drawer, Typography, Space } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  ClipboardList, 
  LayoutDashboard, 
  Map, 
  LineChart, 
  MessageSquare, 
  Menu as MenuIcon,
  User,
  Crown
} from 'lucide-react';

const { Header, Content, Footer, Sider } = Layout;
const { Title, Text } = Typography;

const AppLayout = ({ children }) => {
  const location = useLocation();
  const [visible, setVisible] = React.useState(false);

  const menuItems = [
    { key: '/', icon: <Home size={18} />, label: <Link to="/">Home</Link> },
    { key: '/assessment', icon: <ClipboardList size={18} />, label: <Link to="/assessment">Health Quiz</Link> },
    { key: '/score-dashboard', icon: <LayoutDashboard size={18} />, label: <Link to="/score-dashboard">Health Score</Link> },
    { key: '/health-plan', icon: <Map size={18} />, label: <Link to="/health-plan">My Plan</Link> },
    { key: '/tracker', icon: <LineChart size={18} />, label: <Link to="/tracker">Progress</Link> },
    { key: '/chat', icon: <MessageSquare size={18} />, label: <Link to="/chat">Health AI</Link> },
    // { key: '/pricing', icon: <Crown size={18} />, label: <Link to="/pricing">Plans</Link> },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        breakpoint="lg"
        collapsedWidth="0"
        width={250}
        style={{
          background: '#fff',
          position: 'fixed',
          height: '100vh',
          left: 0,
          zIndex: 100,
          boxShadow: '2px 0 8px rgba(0,0,0,0.05)'
        }}
        trigger={null}
      >
        <div style={{ height: 64, margin: '16px 0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Title level={3} style={{ color: '#2d6a4f', margin: 0, fontFamily: 'serif' }}>ZenHealth</Title>
        </div>
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          style={{ borderRight: 0 }}
        />
      </Sider>

      <Layout className="site-layout" style={{ transition: 'margin-left 0.2s', background: '#fdfbf7' }}>
        <Header style={{ 
          background: '#fff', 
          padding: '0 24px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 99,
          boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Button
              type="text"
              icon={<MenuIcon />}
              onClick={() => setVisible(true)}
              className="mobile-toggle"
              style={{ display: 'none' }}
            />
            <Title level={4} style={{ margin: 0, color: '#2d6a4f' }}>Personalized Wellness</Title>
          </div>
          <Space size="large">
             <div className="disclaimer-header">
              <Text type="danger" strong style={{ fontSize: '10px' }}>
                ⚠️ NOT FOR MEDICAL DIAGNOSIS
              </Text>
            </div>
            <Button type="text" icon={<User size={20} />} />
          </Space>
        </Header>

        <Content style={{ margin: '24px 16px', minHeight: 280 }}>
          {children}
        </Content>

        <Footer style={{ textAlign: 'center', background: 'transparent' }}>
          ZenHealth ©2026 | Ayurvedic & Modern Health Strategy
        </Footer>
      </Layout>

      <Drawer
        title="ZenHealth Menu"
        placement="left"
        onClose={() => setVisible(false)}
        open={visible}
        styles={{ body: { padding: 0 } }}
      >
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={() => setVisible(false)}
        />
      </Drawer>

      <style>{`
        .site-layout { margin-left: 250px; }
        @media (max-width: 992px) {
          .site-layout { margin-left: 0 !important; }
          .mobile-toggle { display: block !important; }
          .disclaimer-header { display: none; }
        }
      `}</style>
    </Layout>
  );
};

export default AppLayout;
