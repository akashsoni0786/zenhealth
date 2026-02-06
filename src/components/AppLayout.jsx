import React from 'react';
import { Layout, Menu, Button, Drawer, Typography, Space, Avatar, Dropdown } from 'antd';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Home,
  ClipboardList,
  LayoutDashboard,
  Map,
  LineChart,
  MessageSquare,
  Menu as MenuIcon,
  LogIn,
  Settings,
  User,
  LogOut,
  Dumbbell,
  ShieldCheck
} from 'lucide-react';
import AdvancedSearchBar from './AdvancedSearchBar';
import MobileFilterDrawer from './MobileFilterDrawer';
import { useAuth } from '../context/AuthContext';
import { useTrainerAuth } from '../context/TrainerAuthContext';

const { Header, Content, Footer, Sider } = Layout;
const { Title, Text } = Typography;

const AppLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [visible, setVisible] = React.useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const { adminLoggedIn } = useTrainerAuth();

  const menuItems = [
    { key: '/', icon: <Home size={22} />, label: <Link to="/">Home</Link> },
    { key: '/assessment', icon: <ClipboardList size={22} />, label: <Link to="/assessment">Health Quiz</Link> },
    { key: '/score-dashboard', icon: <LayoutDashboard size={22} />, label: <Link to="/score-dashboard">Health Score</Link> },
    { key: '/health-plan', icon: <Map size={22} />, label: <Link to="/health-plan">My Plan</Link> },
    { key: '/tracker', icon: <LineChart size={22} />, label: <Link to="/tracker">Progress</Link> },
    { key: '/chat', icon: <MessageSquare size={22} />, label: <Link to="/chat">Health AI</Link> },
    { type: 'divider' },
    { key: '/trainer-login', icon: <Dumbbell size={22} />, label: <Link to="/trainer-login">Join as Trainer</Link> },
    ...(adminLoggedIn ? [{ key: '/admin', icon: <ShieldCheck size={22} />, label: <Link to="/admin">Admin Panel</Link> }] : []),
    { type: 'divider' },
    { key: '/settings', icon: <Settings size={22} />, label: <Link to="/settings">Settings</Link> },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        breakpoint="lg"
        collapsedWidth="0"
        width={280}
        style={{
          background: '#fff',
          position: 'fixed',
          height: '100vh',
          left: 0,
          zIndex: 100,
          boxShadow: '2px 0 8px rgba(0,0,0,0.08)'
        }}
        trigger={null}
      >
        <div style={{ height: 80, margin: '20px 0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Title level={2} style={{ color: '#2d6a4f', margin: 0, fontFamily: 'serif', fontSize: '28px' }}>StayFit</Title>
        </div>
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          style={{ borderRight: 0, fontSize: '16px' }}
        />
      </Sider>

      <Layout className="site-layout" style={{ transition: 'margin-left 0.2s', background: '#fdfbf7' }}>
        <Header style={{
          background: '#fff',
          padding: '0 32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 99,
          boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
          gap: 20,
          height: '72px',
          lineHeight: '72px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexShrink: 0 }}>
            <Button
              type="text"
              icon={<MenuIcon size={24} />}
              onClick={() => setVisible(true)}
              className="mobile-toggle"
              style={{ display: 'none' }}
            />
            <Title level={3} style={{ margin: 0, color: '#2d6a4f', fontSize: '24px' }} className="header-title">StayFit</Title>
          </div>

          {/* Search Bar - Desktop */}
          <div className="header-search-wrapper">
            <AdvancedSearchBar variant="compact" />
          </div>

          <Space size="large" style={{ flexShrink: 0 }}>
            <div className="disclaimer-header">
              <Text type="danger" strong style={{ fontSize: '11px' }}>
                ⚠️ NOT FOR MEDICAL DIAGNOSIS
              </Text>
            </div>
            {isAuthenticated ? (
              <Dropdown
                menu={{
                  items: [
                    {
                      key: 'settings',
                      icon: <Settings size={16} />,
                      label: 'Settings',
                      onClick: () => navigate('/settings')
                    },
                    { type: 'divider' },
                    {
                      key: 'logout',
                      icon: <LogOut size={16} />,
                      label: 'Logout',
                      onClick: () => {
                        logout();
                        navigate('/');
                      }
                    }
                  ]
                }}
                placement="bottomRight"
                trigger={['click']}
              >
                <Button
                  type="primary"
                  style={{
                    borderRadius: '10px',
                    fontSize: '15px',
                    height: '42px',
                    padding: '0 20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <Avatar
                    size={28}
                    style={{ backgroundColor: '#fff', color: '#2d6a4f' }}
                    icon={<User size={16} />}
                  />
                  <span className="account-name">{user?.name || 'Account'}</span>
                </Button>
              </Dropdown>
            ) : (
              <>
                <Link to="/login">
                  <Button type="text" icon={<LogIn size={20} />} className="login-btn" style={{ fontSize: '15px', height: '42px' }}>
                    Login
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button type="primary" style={{ borderRadius: '10px', fontSize: '15px', height: '42px', padding: '0 24px' }} className="signup-btn">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
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
        .site-layout { margin-left: 280px; }
        .header-search-wrapper {
          flex: 1;
          max-width: 600px;
          margin: 0 20px;
        }
        .ant-menu-item {
          height: 52px !important;
          line-height: 52px !important;
          margin: 4px 12px !important;
          border-radius: 10px !important;
        }
        .ant-menu-item a {
          font-size: 15px !important;
          font-weight: 500;
        }
        @media (max-width: 992px) {
          .site-layout { margin-left: 0 !important; }
          .mobile-toggle { display: block !important; }
          .disclaimer-header { display: none; }
          .header-search-wrapper { max-width: 400px; }
        }
        @media (max-width: 768px) {
          .header-search-wrapper { display: none; }
          .header-title { font-size: 20px !important; }
          .login-btn span { display: none; }
          .signup-btn { padding: 0 16px !important; }
          .account-name { display: none; }
        }
      `}</style>
    </Layout>
  );
};

export default AppLayout;
