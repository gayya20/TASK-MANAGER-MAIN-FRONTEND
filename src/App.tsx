import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider, Spin } from 'antd';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import 'antd/dist/reset.css'; 
import MainLayout from './components/layout/MainLayout';
import UsersManagementPage from './pages/UsersManagementPage';


// Lazy loaded components
const LoginPage = lazy(() => import('./pages/LoginPage'));
const OTPVerificationPage = lazy(() => import('./pages/OTPVerificationPage'));
const PasswordSetupPage = lazy(() => import('./pages/PasswordSetupPage'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const UserDashboard = lazy(() => import('./pages/UserDashboard'));
const LayoutWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return <MainLayout>{children}</MainLayout>;
  };
// The TaskManagement loaded from micro-frontend
const TaskManagementModule = lazy(() => import('tasks/TaskManagement'));

// Loading component for suspense fallback
const LoadingComponent = () => (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    height: '100vh' 
  }}>
    <Spin size="large" tip="Loading..." />
  </div>
);

// Protected route component
const ProtectedRoute: React.FC<{ element: React.ReactNode }> = ({ element }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return <LoadingComponent />;
  }
  
  return isAuthenticated ? <>{element}</> : <Navigate to="/login" />;
};

// Admin route component
const AdminRoute: React.FC<{ element: React.ReactNode }> = ({ element }) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  
  if (isLoading) {
    return <LoadingComponent />;
  }
  
  const isAdmin = user?.role === 'admin';
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return isAdmin ? <>{element}</> : <Navigate to="/" />;
};

const AppRoutes = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  
  return (
    <Suspense fallback={<LoadingComponent />}>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/verify-otp" element={<OTPVerificationPage />} />
        <Route path="/setup-password" element={<PasswordSetupPage />} />
        
        {/* Protected Routes */}
        <Route 
          path="/" 
          element={
            <ProtectedRoute 
              element={isAdmin ? <AdminDashboard /> : <UserDashboard />} 
            />
          } 
        />
        
        {/* Task Management Routes */}
        <Route 
          path="/tasks" 
          element={
            
            <ProtectedRoute 
              element={
                <MainLayout> 
                <div style={{ padding: '24px' }}>
                  <Suspense fallback={<LoadingComponent />}>
                    <TaskManagementModule userRole={user?.role} userId={user?._id} />
                  </Suspense>
                </div>
                </MainLayout> 
              } 
            />
          } 
        />
        
        {/* Admin Routes */}
        <Route
  path="/users"
  element={
    <AdminRoute 
      element={<UsersManagementPage />}
    />
  }
/>
        <Route 
          path="/settings" 
          element={<ProtectedRoute element={<div>Settings Page</div>} />} 
        />
        
        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Suspense>
  );
};

const App: React.FC = () => {
  return (
    <ConfigProvider>
      <AuthProvider>
        <Router>
          <AppRoutes />
        </Router>
      </AuthProvider>
    </ConfigProvider>
  );
};

export default App;