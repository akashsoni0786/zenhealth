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
  LogIn,
  Crown
} from 'lucide-react';
import AdvancedSearchBar from './AdvancedSearchBar';
import MobileFilterDrawer from './MobileFilterDrawer';

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
          <Title level={3} style={{ color: '#2d6a4f', margin: 0, fontFamily: 'serif' }}>StayFit</Title>
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
          boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
          gap: 16
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexShrink: 0 }}>
            <Button
              type="text"
              icon={<MenuIcon />}
              onClick={() => setVisible(true)}
              className="mobile-toggle"
              style={{ display: 'none' }}
            />
            <Title level={4} style={{ margin: 0, color: '#2d6a4f' }} className="header-title">StayFit</Title>
          </div>

          {/* Search Bar - Desktop */}
          <div className="header-search-wrapper">
            <AdvancedSearchBar variant="compact" />
          </div>

          <Space size="middle" style={{ flexShrink: 0 }}>
            <div className="disclaimer-header">
              <Text type="danger" strong style={{ fontSize: '10px' }}>
                ⚠️ NOT FOR MEDICAL DIAGNOSIS
              </Text>
            </div>
            <Link to="/login">
              <Button type="text" icon={<LogIn size={18} />} className="login-btn">
                Login
              </Button>
            </Link>
            <Link to="/signup">
              <Button type="primary" style={{ borderRadius: '8px' }} className="signup-btn">
                Sign Up
              </Button>
            </Link>
          </Space>
        </Header>

        <Content style={{ margin: '24px 16px', minHeight: 280 }}>
          {children}
        </Content>

        <Footer style={{ textAlign: 'center', background: 'transparent' }}>
          StayFit ©2026 | Ayurvedic & Modern Health Strategy
        </Footer>
      </Layout>

      <Drawer
        title="StayFit Menu"
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

      <MobileFilterDrawer />

      <style>{`
        .site-layout { margin-left: 250px; }
        .header-search-wrapper {
          flex: 1;
          max-width: 600px;
          margin: 0 16px;
        }
        @media (max-width: 992px) {
          .site-layout { margin-left: 0 !important; }
          .mobile-toggle { display: block !important; }
          .disclaimer-header { display: none; }
          .header-search-wrapper { max-width: 400px; }
        }
        @media (max-width: 768px) {
          .header-search-wrapper { display: none; }
          .header-title { font-size: 18px !important; }
          .login-btn span { display: none; }
          .signup-btn { padding: 0 12px !important; }
        }
      `}</style>
    </Layout>
  );
};

export default AppLayout;
