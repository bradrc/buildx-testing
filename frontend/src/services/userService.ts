import axiosInstance from '../api/axiosInstance';
import type { UserResponse, UserCreateRequest, UserUpdateRequest } from '../types/user';

class UserService {
  private readonly endpoint = '/users';

  async getAll(): Promise<UserResponse[]> {
    try {
      const response = await axiosInstance.get<UserResponse[]>(this.endpoint);
      return response.data;
    } catch (error: any) {
      this.handleError(error);
      throw error;
    }
  }

  async getById(id: string): Promise<UserResponse> {
    try {
      const response = await axiosInstance.get<UserResponse>(`${this.endpoint}/${id}`);
      return response.data;
    } catch (error: any) {
      this.handleError(error);
      throw error;
    }
  }

  async create(userData: UserCreateRequest): Promise<UserResponse> {
    try {
      const response = await axiosInstance.post<UserResponse>(this.endpoint, userData);
      return response.data;
    } catch (error: any) {
      this.handleError(error);
      throw error;
    }
  }

  async update(id: string, userData: UserUpdateRequest): Promise<UserResponse> {
    try {
      const response = await axiosInstance.put<UserResponse>(`${this.endpoint}/${id}`, userData);
      return response.data;
    } catch (error: any) {
      this.handleError(error);
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await axiosInstance.delete(`${this.endpoint}/${id}`);
    } catch (error: any) {
      this.handleError(error);
      throw error;
    }
  }

  private handleError(error: any): void {
    if (error.response) {
      // O servidor respondeu com um status fora do range 2xx
      console.error('API Error:', error.response.data);
    } else if (error.request) {
      // A requisição foi feita mas não houve resposta
      console.error('Network Error: No response received from server');
    } else {
      // Algo aconteceu ao configurar a requisição
      console.error('Error:', error.message);
    }
  }
}

export const userService = new UserService();
