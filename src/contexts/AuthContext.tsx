import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { message } from 'antd';
import {
  AuthContextType,
  User,
  LoginRequest,
  OTPVerificationRequest,
  PasswordSetupRequest,
  InviteUserRequest
} from '../types/auth.types';
import * as authService from '../services/authService';

// Create the Auth Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Local storage keys
const TOKEN_KEY = 'token';
const USER_KEY = 'user';

// Context Provider Component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Load user from localStorage on component mount
  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedToken = localStorage.getItem(TOKEN_KEY);
        const storedUser = localStorage.getItem(USER_KEY);

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
          setIsAuthenticated(true);
        }
      } catch (err) {
        console.error('Error loading user from localStorage', err);
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  // Login function
  const login = async (credentials: LoginRequest) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await authService.login(credentials);
      
      if (response.success) {
        // Save to localStorage
        localStorage.setItem(TOKEN_KEY, response.token);
        localStorage.setItem(USER_KEY, JSON.stringify(response.user));
        
        // Update state
        setToken(response.token);
        setUser(response.user);
        setIsAuthenticated(true);
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed. Please try again.');
      throw err; // Rethrow so the component can catch it
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    // Clear localStorage
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    
    // Update state
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    
    message.success('Logged out successfully');
  };

  // Verify OTP function
  const verifyOTP = async (data: OTPVerificationRequest) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await authService.verifyOTP(data);
      
      if (response.success) {
        message.success(response.message);
        return response.userId;
      } else {
        throw new Error(response.message || 'OTP verification failed');
      }
    } catch (err) {
      console.error('OTP verification error:', err);
      const errorMessage = err instanceof Error ? err.message : 'OTP verification failed. Please try again.';
      setError(errorMessage);
      message.error(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Setup password function
  const setupPassword = async (data: PasswordSetupRequest) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await authService.setupPassword(data);
      
      if (response.success) {
        // Will need to login after setting up password
        message.success(response.message);
      } else {
        throw new Error(response.message || 'Password setup failed');
      }
    } catch (err) {
      console.error('Password setup error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Password setup failed. Please try again.';
      setError(errorMessage);
      message.error(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Invite user function (admin only)
  const inviteUser = async (data: InviteUserRequest) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await authService.inviteUser(data);
      
      if (response.success) {
        message.success(response.message || 'User invited successfully');
      } else {
        throw new Error(response.message || 'Failed to invite user');
      }
    } catch (err) {
      console.error('Invite user error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to invite user. Please try again.';
      setError(errorMessage);
      message.error(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Context value
  const contextValue: AuthContextType = {
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    verifyOTP,
    setupPassword,
    inviteUser
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the Auth Context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};