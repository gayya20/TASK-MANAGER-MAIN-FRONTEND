import React, { useState } from 'react';
import { Layout, Menu } from 'antd';
import {
  DashboardOutlined,
  ScheduleOutlined,
  UserOutlined,
  SettingOutlined
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const { Sider } = Layout;

const Sidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const isAdmin = user?.role === 'admin';

  const getSelectedKey = () => {
    const path = location.pathname;
    if (path.includes('/tasks')) return 'tasks';
    if (path.includes('/users')) return 'users';
    if (path.includes('/settings')) return 'settings';
    return 'dashboard';
  };

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={setCollapsed}
      style={{
        overflow: 'auto',
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 64, // Height of the header
        zIndex: 10
      }}
    >
      <div style={{ height: 32, margin: 16,color:"white",fontSize:"17px" }} ></div>
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[getSelectedKey()]}
      >
        <Menu.Item 
          key="dashboard" 
          icon={<DashboardOutlined />}
          onClick={() => navigate('/')}
        >
          Dashboard
        </Menu.Item>
        
        <Menu.Item 
          key="tasks" 
          icon={<ScheduleOutlined />}
          onClick={() => navigate('/tasks')}
        >
          Tasks
        </Menu.Item>
        
        {isAdmin && (
          <Menu.Item 
            key="users" 
            icon={<UserOutlined />}
            onClick={() => navigate('/users')}
          >
            Users
          </Menu.Item>
        )}
        
        <Menu.Item 
          key="settings" 
          icon={<SettingOutlined />}
          onClick={() => navigate('/settings')}
        >
          Settings
        </Menu.Item>
      </Menu>
    </Sider>
  );
};

export default Sidebar;