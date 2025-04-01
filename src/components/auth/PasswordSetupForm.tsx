import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, Alert } from 'antd';
import { LockOutlined } from '@ant-design/icons';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

const { Title, Text } = Typography;

interface LocationState {
  userId?: string;
}

const PasswordSetupForm: React.FC = () => {
  const { setupPassword } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get userId from location state
  const { userId } = (location.state as LocationState) || {};

  if (!userId) {
    return (
      <Card style={{ maxWidth: 400, margin: '0 auto' }}>
        <Alert 
          message="Error" 
          description="User ID not provided. Please go back to the login page." 
          type="error" 
          showIcon 
        />
        <Button 
          type="primary" 
          style={{ marginTop: 16 }} 
          onClick={() => navigate('/login')}
        >
          Back to Login
        </Button>
      </Card>
    );
  }

  const onFinish = async (values: { password: string; confirmPassword: string }) => {
    setLoading(true);
    setError(null);
    
    try {
      await setupPassword({ 
        userId, 
        password: values.password 
      });
      
      // Navigate to login with success message
      navigate('/login', { 
        state: { 
          message: 'Password set successfully. You can now log in with your new password.' 
        } 
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Setup failed. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card style={{ maxWidth: 400, margin: '0 auto', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)' }}>
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <Title level={2}>Set Password</Title>
        <Text type="secondary">
          Create a secure password for your account
        </Text>
      </div>

      {error && (
        <Alert 
          message="Setup Error" 
          description={error} 
          type="error" 
          showIcon 
          style={{ marginBottom: 16 }}
        />
      )}

      <Form
        name="passwordSetup"
        layout="vertical"
        onFinish={onFinish}
      >
        <Form.Item
          name="password"
          rules={[
            { required: true, message: 'Please input your password!' },
            { min: 6, message: 'Password must be at least 6 characters long!' }
          ]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="Password"
            size="large"
          />
        </Form.Item>

        <Form.Item
          name="confirmPassword"
          dependencies={['password']}
          rules={[
            { required: true, message: 'Please confirm your password!' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('The two passwords do not match!'));
              },
            }),
          ]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="Confirm Password"
            size="large"
          />
        </Form.Item>

        <Form.Item>
          <Button 
            type="primary" 
            htmlType="submit" 
            loading={loading}
            size="large" 
            block
          >
            Set Password
          </Button>
        </Form.Item>
      </Form>

      <div style={{ textAlign: 'center' }}>
        <Button type="link" onClick={() => navigate('/login')}>
          Back to Login
        </Button>
      </div>
    </Card>
  );
};

export default PasswordSetupForm;