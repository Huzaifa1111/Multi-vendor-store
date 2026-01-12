export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

export interface AuthResponseDto {
  access_token: string;
  user: {
    id: number;
    email: string;
    name: string;
    role: string;
  };
}   