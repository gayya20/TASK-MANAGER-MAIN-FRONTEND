import axios from '../utils/axiosConfig';
import {
  UpdateUserRequest,
  UpdateUserResponse,
  ChangePasswordRequest,
  ChangePasswordResponse,
  GetUsersResponse,
  GetUserResponse,
  DeleteUserResponse
} from '../types/user.types';

// User Management API
export const getUsers = async (): Promise<GetUsersResponse> => {
  const response = await axios.get<GetUsersResponse>('/users');
  return response.data;
};

export const getUser = async (id: string): Promise<GetUserResponse> => {
  const response = await axios.get<GetUserResponse>(`/users/${id}`);
  return response.data;
};

export const createUser = async (userData: any) => {
  const response = await axios.post('/users', userData);
  return response.data;
};

export const updateUser = async (id: string, userData: UpdateUserRequest): Promise<UpdateUserResponse> => {
  const response = await axios.put<UpdateUserResponse>(`/users/${id}`, userData);
  return response.data;
};

export const deleteUser = async (id: string): Promise<DeleteUserResponse> => {
  const response = await axios.delete<DeleteUserResponse>(`/users/${id}`);
  return response.data;
};

export const changePassword = async (data: ChangePasswordRequest): Promise<ChangePasswordResponse> => {
  const response = await axios.put<ChangePasswordResponse>('/users/change-password', data);
  return response.data;
};