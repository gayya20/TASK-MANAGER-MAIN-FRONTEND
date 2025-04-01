import React, { useEffect } from 'react';
import { Layout, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import PasswordSetupForm from '../components/auth/PasswordSetupForm';
import { useAuth } from '../contexts/AuthContext';

const { Content } = Layout;
const { Title } = Typography;

const PasswordSetupPage: React.FC = () => {
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

        <PasswordSetupForm />
      </Content>
    </Layout>
  );
};

export default PasswordSetupPage;