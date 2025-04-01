import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Tag, Modal, Form, Input, Switch, message, Popconfirm } from 'antd';
import { UserAddOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { getUsers, updateUser, deleteUser ,createUser} from '../services/api';
import { User } from '../types/auth.types';
import MainLayout from '../components/layout/MainLayout';
import UserForm from '../components/UserForm';


const UsersManagementPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [form] = Form.useForm();

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await getUsers();
      if (response.success) {
        setUsers(response.data);
      } else {
        message.error('Failed to fetch users');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      message.error('Error loading users. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  console.log('Users:', users);
  const handleFormSubmit = async (values: any) => {
    try {
      if (editingUser) {
        // Update existing user
        const response = await updateUser(editingUser._id, values);
        if (response.success) {
          message.success('User updated successfully');
          setModalVisible(false);
          fetchUsers(); // Refresh user list
        } else {
          message.error(response.message || 'Failed to update user');
        }
      } else {
        // Create new user
        const response = await createUser({
          ...values,
          role: 'user' // Default role for new users
        });
        if (response.success) {
          message.success('User created successfully');
          setModalVisible(false);
          fetchUsers(); // Refresh user list
        } else {
          message.error(response.message || 'Failed to create user');
        }
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      message.error('An error occurred. Please try again.');
    }
  };
  const handleEdit = (user: User) => {
    setEditingUser(user);
    form.setFieldsValue({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      mobileNumber: user.mobileNumber || '',
      isActive: user.isActive
    });
    setModalVisible(true);
  };

  const handleDelete = async (userId: string) => {
    try {
        console.log('Deleting user with ID:', userId);
      const response = await deleteUser(userId);
      if (response.success) {
        message.success('User deleted successfully');
        fetchUsers(); // Refresh user list
      } else {
        message.error(response.message || 'Failed to delete user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      message.error('Failed to delete user. Please try again.');
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      if (editingUser) {
        const response = await updateUser(editingUser._id, values);
        if (response.success) {
          message.success('User updated successfully');
          setModalVisible(false);
          fetchUsers(); // Refresh user list
        } else {
          message.error(response.message || 'Failed to update user');
        }
      }
    } catch (error) {
      console.error('Form validation error:', error);
    }
  };

  const handleModalCancel = () => {
    setModalVisible(false);
    setEditingUser(null);
    form.resetFields();
  };

  const handleInviteUser = () => {
    setEditingUser(null);
    form.resetFields();
    setModalVisible(true);
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'firstName',
      key: 'name',
      render: (_: string, record: User) => `${record.firstName} ${record.lastName}`,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Mobile',
      dataIndex: 'mobileNumber',
      key: 'mobileNumber',
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role: string) => (
        <Tag color={role === 'admin' ? 'blue' : 'green'}>
          {role.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'isActive',
      key: 'status',
      render: (isActive: boolean) => (
        <Tag color={isActive ? 'success' : 'error'}>
          {isActive ? 'ACTIVE' : 'INACTIVE'}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: User) => (
        <Space size="middle">
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          />
          <Popconfirm
            title="Are you sure you want to delete this user?"
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <MainLayout>
      <div style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
          <h1>User Management</h1>
          <Button
            type="primary"
            icon={<UserAddOutlined />}
            onClick={handleInviteUser}
          >
            Invite User
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={users}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10 }}
        />

<Modal
  title={editingUser ? "Edit User" : "Create User"}
  visible={modalVisible}
  onCancel={handleModalCancel}
  footer={null} 
  width={600}
>
  <UserForm
    user={editingUser}
    onSubmit={handleFormSubmit}
    onCancel={handleModalCancel}
    loading={loading}
  />
</Modal>
      </div>
    </MainLayout>
  );
};

export default UsersManagementPage;