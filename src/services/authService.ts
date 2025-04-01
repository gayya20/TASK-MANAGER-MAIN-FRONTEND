import axios from '../utils/axiosConfig';
import {
  LoginRequest,
  LoginResponse,
  OTPVerificationRequest,
  OTPVerificationResponse,
  PasswordSetupRequest,
  PasswordSetupResponse,
  InviteUserRequest
} from '../types/auth.types';

export const login = async (credentials: LoginRequest): Promise<LoginResponse> => {
  try {
    console.log("AuthService: Sending login request");
    const response = await axios.post<LoginResponse>('/auth/login', credentials);
    console.log("AuthService: Login response received", response.data);
    return response.data;
  } catch (error) {
    console.error("AuthService: Login request failed", error);
    throw error;
  }
};

export const verifyOTP = async (data: OTPVerificationRequest): Promise<OTPVerificationResponse> => {
  const response = await axios.post<OTPVerificationResponse>('/auth/verify-otp', data);
  return response.data;
};

export const setupPassword = async (data: PasswordSetupRequest): Promise<PasswordSetupResponse> => {
  const response = await axios.post<PasswordSetupResponse>('/auth/setup-password', data);
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await axios.get('/auth/me');
  return response.data;
};

export const inviteAdmin = async (email: string) => {
  const response = await axios.post('/auth/invite-admin', { email });
  return response.data;
};

export const inviteUser = async (userData: InviteUserRequest) => {
  const response = await axios.post('/auth/invite-user', userData);
  return response.data;
};

export const forgotPassword = async (email: string) => {
  const response = await axios.post('/auth/forgot-password', { email });
  return response.data;
};

export const resetPassword = async (resetToken: string, password: string) => {
  const response = await axios.put(`/auth/reset-password/${resetToken}`, { password });
  return response.data;
};