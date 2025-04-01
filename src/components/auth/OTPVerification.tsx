import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, Alert } from 'antd';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

const { Title, Text } = Typography;

interface LocationState {
  email?: string;
}

const OTPVerification: React.FC = () => {
  const { verifyOTP } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get email from location state
  const { email } = (location.state as LocationState) || {};

  if (!email) {
    return (
      <Card style={{ maxWidth: 400, margin: '0 auto' }}>
        <Alert 
          message="Error" 
          description="Email not provided. Please go back to the login page." 
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

  const onFinish = async (values: { otp: string }) => {
    setLoading(true);
    setError(null);
    
    try {
      const userId = await verifyOTP({ email, otp: values.otp });
      // Navigate to password setup with userId
      navigate('/setup-password', { state: { userId } });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Verification failed. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card style={{ maxWidth: 400, margin: '0 auto', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)' }}>
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <Title level={2}>Verify OTP</Title>
        <Text type="secondary">
          Please enter the verification code sent to {email}
        </Text>
      </div>

      {error && (
        <Alert 
          message="Verification Error" 
          description={error} 
          type="error" 
          showIcon 
          style={{ marginBottom: 16 }}
        />
      )}

      <Form
        name="otpVerification"
        layout="vertical"
        onFinish={onFinish}
      >
        <Form.Item
          name="otp"
          rules={[
            { required: true, message: 'Please input the OTP code!' },
            { len: 6, message: 'OTP must be 6 digits!' }
          ]}
        >
          <Input 
            placeholder="Enter 6-digit OTP" 
            size="large"
            maxLength={6}
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
            Verify
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

export default OTPVerification;