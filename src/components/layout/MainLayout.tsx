import React, { ReactNode } from 'react';
import { Layout } from 'antd';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const { Content } = Layout;

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Navbar />
      <Layout>
        <Sidebar />
        <Layout style={{ marginLeft: 200, marginTop: 64 }}>
          <Content style={{ margin: '24px 16px', padding: 24, minHeight: 280 }}>
            {children}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default MainLayout;