import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Statistic, Table, Tag, Typography, Button } from 'antd';
import { 
  UserOutlined, 
  CheckCircleOutlined, 
  ClockCircleOutlined, 
  FileOutlined 
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import { getUsers } from '../services/api';
import { User } from '../types/auth.types';
import axios from '../utils/axiosConfig';


const { Title } = Typography;

interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
}

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    activeUsers: 0,
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0
  });
  const [recentUsers, setRecentUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch users
        const usersResponse = await getUsers();
        const users = usersResponse.data;
        console.log('Fetched users:', users);

          // Fetch tasks
          const tasksResponse = await axios.get('/tasks');
          const tasks = tasksResponse.data.data || [];
        
        // Calculate stats
        const activeUsers = users.filter(user => user.isActive).length;
        const completedTasks = tasks.filter((task: { isCompleted: any; }) => task.isCompleted).length;

        
        setStats({
          totalUsers: users.length,
          activeUsers,
          totalTasks: tasks.length,
          completedTasks, // Placeholder
          pendingTasks: 9 // Placeholder
        });
        
        // Get most recent users (limit to 5)
        setRecentUsers(users.slice(0, 5));
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Columns for recent users table
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
  ];

  return (
    <MainLayout>
      <Title level={2}>Admin Dashboard</Title>
      
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card>
            <Statistic
              title="Total Users"
              value={stats.totalUsers}
              prefix={<UserOutlined />}
              loading={loading}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card>
            <Statistic
              title="Active Users"
              value={stats.activeUsers}
              prefix={<UserOutlined />}
              loading={loading}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card>
            <Statistic
              title="Total Tasks"
              value={stats.totalTasks}
              prefix={<FileOutlined />}
              loading={loading}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card>
            <Statistic
              title="Completed Tasks"
              value={stats.completedTasks}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#3f8600' }}
              loading={loading}
            />
          </Card>
        </Col>
      </Row>

      <Card 
        title="Recent Users" 
        extra={<Button type="link" onClick={() => navigate('/users')}>View All</Button>}
        style={{ marginBottom: 24 }}
      >
        <Table 
          columns={columns} 
          dataSource={recentUsers} 
          rowKey="id" 
          loading={loading}
          pagination={false}
        />
      </Card>
      
      <Card title="Recent Tasks">
        <div style={{ textAlign: 'center', padding: 24 }}>
          <Button 
            type="primary" 
            icon={<FileOutlined />}
            onClick={() => navigate('/tasks')}
          >
            Manage Tasks
          </Button>
        </div>
      </Card>
    </MainLayout>
  );
};

export default AdminDashboard;