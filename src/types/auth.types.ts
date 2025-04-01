export interface LoginRequest {
    email: string;
    password: string;
  }
  
  export interface LoginResponse {
    success: boolean;
    token: string;
    user: User;
    message?: string;
  }
  
  export interface OTPVerificationRequest {
    email: string;
    otp: string;
  }
  
  export interface OTPVerificationResponse {
    success: boolean;
    message: string;
    userId: string;
  }
  
  export interface PasswordSetupRequest {
    userId: string;
    password: string;
  }
  
  export interface PasswordSetupResponse {
    success: boolean;
    message: string;
    token: string;
  }
  
  export interface InviteUserRequest {
    email: string;
    firstName?: string;
    lastName?: string;
    mobileNumber?: string;
    address?: Address;
  }
  
  export interface Address {
    location: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  }
  
  export interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    mobileNumber?: string;
    address?: Address;
    role: 'admin' | 'user';
    isActive: boolean;
  }
  
  export interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
  }
  
  export interface AuthContextType extends AuthState {
    login: (credentials: LoginRequest) => Promise<void>;
    logout: () => void;
    verifyOTP: (data: OTPVerificationRequest) => Promise<string>;
    setupPassword: (data: PasswordSetupRequest) => Promise<void>;
    inviteUser: (data: InviteUserRequest) => Promise<void>;
  }