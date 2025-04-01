import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Statistic, Divider, Typography, Button } from 'antd';
import { 
  CheckCircleOutlined, 
  ClockCircleOutlined, 
  CalendarOutlined,
  FileOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';


const { Title, Text } = Typography;

interface TaskStats {
  totalAssigned: number;
  completed: number;
  pending: number;
  upcomingDeadlines: number;
}

const UserDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<TaskStats>({
    totalAssigned: 0,
    completed: 0,
    pending: 0,
    upcomingDeadlines: 0
  });

  // Fetch task statistics
  // Import axios or your API service

// In your UserDashboard component
useEffect(() => {
  const fetchTaskStats = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const API_URL = 'http://localhost:5000/api';
      
      // Get all tasks assigned to the current user
      const response = await axios.get(`${API_URL}/tasks`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (response.data.success) {
        const tasks = response.data.data;
        
        // Calculate statistics
        const totalAssigned = tasks.length;
        const completed = tasks.filter(task => task.isCompleted).length;
        const pending = tasks.filter(task => !task.isCompleted).length;
        
        // Calculate upcoming deadlines (tasks due in the next 7 days)
        const today = new Date();
        const nextWeek = new Date();
        nextWeek.setDate(today.getDate() + 7);
        
        const upcomingDeadlines = tasks.filter(task => {
          const endDate = new Date(task.endDate);
          return !task.isCompleted && 
                 endDate >= today && 
                 endDate <= nextWeek;
        }).length;
        
        // Update stats with real data
        setStats({
          totalAssigned,
          completed,
          pending,
          upcomingDeadlines
        });
      } else {
        console.error('Failed to fetch tasks:', response.data.message);
      }
    } catch (error) {
      console.error('Error fetching task stats:', error);
    } finally {
      setLoading(false);
    }
  };

  // Only fetch if user is logged in
  if (user?.id) {
    fetchTaskStats();
  }
}, [user]);

  return (
    <MainLayout>
      <Title level={2}>Welcome, {user?.firstName}!</Title>
      <Text type="secondary">Here's an overview of your tasks</Text>

      {/* Task Statistics */}
      <Row gutter={16} style={{ marginTop: 24, marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Assigned Tasks"
              value={stats.totalAssigned}
              prefix={<FileOutlined />}
              loading={loading}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Completed"
              value={stats.completed}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#3f8600' }}
              loading={loading}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Pending"
              value={stats.pending}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#cf1322' }}
              loading={loading}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Upcoming Deadlines"
              value={stats.upcomingDeadlines}
              prefix={<CalendarOutlined />}
              valueStyle={{ color: '#1890ff' }}
              loading={loading}
            />
          </Card>
        </Col>
      </Row>

      {/* Task Management placeholder */}
      <Card title="Your Tasks">
        <div style={{ textAlign: 'center', padding: 24 }}>
          <p>The Task Management module will be loaded here</p>
          <Button 
            type="primary" 
            icon={<FileOutlined />}
            onClick={() => navigate('/tasks')}
          >
            View All Tasks
          </Button>
        </div>
      </Card>
    </MainLayout>
  );
};

export default UserDashboard;