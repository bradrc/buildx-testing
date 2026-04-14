export interface UserResponse {
  id: string;
  username: string;
  email: string;
  role: string;
}

export interface UserCreateRequest {
  username: string;
  email: string;
  password: string;
  role?: string;
}

export interface UserUpdateRequest {
  username: string;
  email: string;
  role: string;
}
