import React, { useEffect } from 'react';
import { Layout, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import OTPVerification from '../components/auth/OTPVerification';
import { useAuth } from '../contexts/AuthContext';

const { Content } = Layout;
const { Title } = Typography;

const OTPVerificationPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Content style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 24 }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <Title>Task Management System</Title>
        </div>

        <OTPVerification />
      </Content>
    </Layout>
  );
};

export default OTPVerificationPage;