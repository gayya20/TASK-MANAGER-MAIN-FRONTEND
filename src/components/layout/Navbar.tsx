import React from 'react';
import { Layout, Menu, Typography, Avatar, Dropdown, Button } from 'antd';
import { UserOutlined, LogoutOutlined, BellOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { CheckCircleOutlined } from "@ant-design/icons";


const { Header } = Layout;
const { Title } = Typography;

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const userMenu = (
    <Menu>
      <Menu.Item 
        key="profile" 
        icon={<UserOutlined />}
        onClick={() => navigate('/profile')}
      >
        Profile
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item 
        key="logout" 
        icon={<LogoutOutlined />}
        onClick={handleLogout}
      >
        Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <Header style={{ 
      padding: '0 20px', 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      backgroundColor: '#fff',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
      position: 'fixed',
      zIndex: 1,
      width: '100%'
    }}>
      <div>
      <Title level={3} style={{ margin: 0 }}>
  ta
  <span style={{ color: "#1777ff" }}>sky</span> <CheckCircleOutlined style={{ color: "#1777ff" }} />
</Title></div>
      
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Button 
          type="text" 
          icon={<BellOutlined />}
          shape="circle"
          style={{ fontSize: '16px', marginRight: 16 }}
        />
        
        {user ? (
          <Dropdown overlay={userMenu} placement="bottomRight">
            <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
              <Avatar icon={<UserOutlined />} />
              <span style={{ marginLeft: 8 }}>
                {user.firstName} {user.lastName}
              </span>
            </div>
          </Dropdown>
        ) : (
          <Button type="primary" onClick={() => navigate('/login')}>
            Login
          </Button>
        )}
      </div>
    </Header>
  );
};

export default Navbar;