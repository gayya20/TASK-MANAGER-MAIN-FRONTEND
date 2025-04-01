import React, { useEffect } from 'react';
import { Layout, Typography, Alert } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import LoginForm from '../components/auth/LoginForm';
import { useAuth } from '../contexts/AuthContext';

const { Content } = Layout;
const { Title } = Typography;

interface LocationState {
  message?: string;
}

const LoginPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { message } = (location.state as LocationState) || {};

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Content 
        style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'center', 
          padding: 0 
        }}
      >
        {message && (
          <Alert
            message="Success"
            description={message}
            type="success"
            showIcon
            style={{ maxWidth: 600, margin: '0 auto 24px auto' }}
          />
        )}

        <LoginForm />
      </Content>
    </Layout>
  );
};

export default LoginPage;