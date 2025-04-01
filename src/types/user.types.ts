import { Address, User } from './auth.types';

export interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  mobileNumber?: string;
  address?: Address;
  isActive?: boolean;
}

export interface UpdateUserResponse {
  success: boolean;
  message: string;
  data: User;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface ChangePasswordResponse {
  success: boolean;
  message: string;
}

export interface GetUsersResponse {
  success: boolean;
  count: number;
  data: User[];
}

export interface GetUserResponse {
  success: boolean;
  data: User;
}

export interface CreateUserResponse {
  success: boolean;
  message: string;
  data: User;
}

export interface DeleteUserResponse {
  success: boolean;
  message: string;
}