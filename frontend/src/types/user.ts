export type UserResponse = {
  id: string;
  username: string;
  email: string;
  role: string;
};

export type UserCreateRequest = {
  username: string;
  email: string;
  password: string;
  role?: string;
};

export type UserUpdateRequest = {
  username: string;
  email: string;
  role: string;
};
