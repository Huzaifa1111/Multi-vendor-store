export interface User {
  id: number;
  name: string;
  email: string;
  role: 'user' | 'admin';
  phone?: string;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}