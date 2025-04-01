import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, Divider, Space, Alert } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, LoginOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { LoginRequest } from '../../types/auth.types';
import * as authService from '../../services/authService';
import { CheckCircleOutlined } from "@ant-design/icons";

const { Title, Text, Link: AntLink } = Typography;

const LoginForm: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form] = Form.useForm();


const onFinish = async (values: LoginRequest) => {
  setLoading(true);
  setError(null); // Clear any previous errors
  
  try {
    const response = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(values),
    });
    
    const data = await response.json();
    
    if (response.ok && data.success) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      
      await login(values);
      
      // Navigate to dashboard
      navigate('/');
    } else {
      // Error - display message from API or default
      setError(data.message || 'Invalid email or password');
    }
  } catch (err) {
    console.error('Login error:', err);
    setError('Login failed. Please try again.');
  } finally {
    setLoading(false);
  }
};
  const handleInviteAdmin = async () => {
    const email = form.getFieldValue('email');
    if (!email) {
      form.setFields([
        {
          name: 'email',
          errors: ['Please enter your email address first'],
        },
      ]);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      await authService.inviteAdmin(email);
      navigate('/verify-otp', { state: { email } });
    } catch (err: any) {
      console.error('Invite admin error:', err);
      
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.message) {
        setError(err.message);
      } else {
        setError('Registration failed. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    navigate('/forgot-password');
  };

  return (
    <div className="login-container" style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
      <Card 
        style={{ 
          width: 420, 
          borderRadius: 12, 
          overflow: 'hidden',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
          border: 'none'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <Space direction="vertical" size={12}>
            <div className="logo" style={{ marginBottom: 8 }}>
              <Title level={2} style={{ margin: 0 }}>
                ta<span style={{ color: "#1777ff" }}>sky</span> 
                <CheckCircleOutlined style={{ color: "#1777ff", fontSize: "0.9em", marginLeft: 4 }} />
              </Title>
            </div>
            <Title level={3} style={{ margin: 0, fontWeight: 500 }}>Welcome Back!</Title>
            <Text type="secondary" style={{ fontSize: 16 }}>Login to manage your tasks</Text>
          </Space>
        </div>

        {error && (
          <Alert
            message="Login Error"
            description={error}
            type="error"
            showIcon
            closable
            onClose={() => setError(null)}
            style={{ marginBottom: 24 }}
          />
        )}

        <Form
          form={form}
          name="login"
          layout="vertical"
          onFinish={onFinish}
          onFinishFailed={(errorInfo) => {
            console.log('Form validation failed:', errorInfo);
          }}
          initialValues={{ remember: true }}
          size="large"
        >
          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Please input your email!' },
              { type: 'email', message: 'Please enter a valid email!' }
            ]}
          >
            <Input 
              prefix={<MailOutlined style={{ color: '#bfbfbf' }} />} 
              placeholder="Email" 
              style={{ height: 48, borderRadius: 8 }}
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: '#bfbfbf' }} />}
              placeholder="Password"
              style={{ height: 48, borderRadius: 8 }}
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 12 }}>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading}
              icon={<LoginOutlined />}
              block
              style={{ 
                height: 48, 
                borderRadius: 8, 
                fontSize: 16,
                fontWeight: 500,
                background: '#1777ff', 
                boxShadow: '0 2px 10px rgba(23, 119, 255, 0.3)'
              }}
            >
              Sign In
            </Button>
          </Form.Item>

          <div style={{ textAlign: 'center', marginBottom: 16 }}>
            <AntLink onClick={handleForgotPassword} style={{ fontSize: 14 }}>
              Forgot your password?
            </AntLink>
          </div>
        </Form>

        <Divider style={{ margin: '24px 0' }}>
          <Text type="secondary">New User?</Text>
        </Divider>

        <Button 
          block 
          onClick={handleInviteAdmin}
          loading={loading}
          icon={<UserOutlined />}
          style={{ 
            height: 48, 
            borderRadius: 8, 
            fontSize: 16,
            borderColor: '#1777ff',
            color: '#1777ff'
          }}
        >
          Register as Admin
        </Button>
      </Card>
    </div>
  );
};

export default LoginForm;