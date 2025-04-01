import React, { useState } from 'react';
import { Form, Input, Switch, Button, message } from 'antd';
import { PhoneOutlined, MailOutlined, UserOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { User } from '../types/auth.types';
import MapPicker from './MapPicker';


interface UserFormProps {
  user?: User | null;
  onSubmit: (values: any) => Promise<void>;
  onCancel: () => void;
  loading: boolean;
}

const UserForm: React.FC<UserFormProps> = ({ 
  user, 
  onSubmit, 
  onCancel,
  loading 
}) => {
  const [form] = Form.useForm();
  const isEditMode = !!user;

  const handleFinish = async (values: any) => {
    try {
      await onSubmit(values);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleSelectLocation = () => {
    message.info('Google Maps location picker would be implemented here');
    
  };

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={user ? {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        mobileNumber: user.mobileNumber || '',
        address: user.address?.location || '',
        isActive: user.isActive
      } : {
        isActive: true
      }}
      onFinish={handleFinish}
    >
      <Form.Item
        name="firstName"
        label="First Name"
        rules={[{ required: true, message: 'Please enter first name' }]}
      >
        <Input 
          prefix={<UserOutlined />} 
          placeholder="First Name" 
        />
      </Form.Item>
      
      <Form.Item
        name="lastName"
        label="Last Name"
        rules={[{ required: true, message: 'Please enter last name' }]}
      >
        <Input 
          prefix={<UserOutlined />} 
          placeholder="Last Name" 
        />
      </Form.Item>
      
      <Form.Item
        name="email"
        label="Email"
        rules={[
          { required: true, message: 'Please enter email' },
          { type: 'email', message: 'Please enter a valid email' }
        ]}
      >
        <Input 
          prefix={<MailOutlined />} 
          placeholder="Email Address" 
          disabled={isEditMode} // Cannot edit email for existing users
        />
      </Form.Item>
      
      <Form.Item
        name="mobileNumber"
        label="Mobile Number (with Country Code)"
        rules={[
          { required: true, message: 'Please enter mobile number with country code' },
          { 
            pattern: /^\+[1-9]\d{1,14}$/, 
            message: 'Please enter a valid mobile number with country code (e.g., +12345678901)' 
          }
        ]}
      >
        <Input 
          prefix={<PhoneOutlined />} 
          placeholder="+12345678901" 
        />
      </Form.Item>
      
      <Form.Item
  name="address"
  label="Address"
  rules={[{ required: true, message: 'Please select an address' }]}
>
  <Form.Item noStyle name={['address']}>
    <MapPicker />
  </Form.Item>
</Form.Item>
      
      <Form.Item
        name="isActive"
        label="Status"
        valuePropName="checked"
      >
        <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
      </Form.Item>
      
      <Form.Item style={{ marginBottom: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <Button onClick={onCancel}>
            Cancel
          </Button>
          <Button type="primary" htmlType="submit" loading={loading}>
            {isEditMode ? 'Update User' : 'Create User'}
          </Button>
        </div>
      </Form.Item>
    </Form>
  );
};

export default UserForm;