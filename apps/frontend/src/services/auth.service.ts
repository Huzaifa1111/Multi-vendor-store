import api from '@/lib/api';

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

interface AuthResponse {
  access_token: string;
  user: {
    id: number;
    email: string;
    name: string;
    role: string;
  };
}

export const login = async (data: LoginData): Promise<AuthResponse> => {
  // For now, simulate successful login
  const mockResponse: AuthResponse = {
    access_token: 'mock-jwt-token',
    user: {
      id: 1,
      email: data.email,
      name: 'Test User',
      role: 'user',
    },
  };
  
  if (mockResponse.access_token) {
    localStorage.setItem('token', mockResponse.access_token);
    api.defaults.headers.common['Authorization'] = `Bearer ${mockResponse.access_token}`;
  }
  
  return mockResponse;
  
  // Uncomment when backend is ready:
  // const response = await api.post<AuthResponse>('/auth/login', data);
  // if (response.data.access_token) {
  //   localStorage.setItem('token', response.data.access_token);
  //   api.defaults.headers.common['Authorization'] = `Bearer ${response.data.access_token}`;
  // }
  // return response.data;
};

export const register = async (data: RegisterData): Promise<AuthResponse> => {
  // For now, simulate successful registration
  const mockResponse: AuthResponse = {
    access_token: 'mock-jwt-token',
    user: {
      id: 1,
      email: data.email,
      name: data.name,
      role: 'user',
    },
  };
  
  if (mockResponse.access_token) {
    localStorage.setItem('token', mockResponse.access_token);
    api.defaults.headers.common['Authorization'] = `Bearer ${mockResponse.access_token}`;
  }
  
  return mockResponse;
  
  // Uncomment when backend is ready:
  // const response = await api.post<AuthResponse>('/auth/register', data);
  // if (response.data.access_token) {
  //   localStorage.setItem('token', response.data.access_token);
  //   api.defaults.headers.common['Authorization'] = `Bearer ${response.data.access_token}`;
  // }
  // return response.data;
};

export const getCurrentUser = async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No token found');
  }

  // For now, return mock user
  return {
    id: 1,
    email: 'test@example.com',
    name: 'Test User',
    role: 'user',
  };
  
  // Uncomment when backend is ready:
  // api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  // const response = await api.get('/auth/me');
  // return response.data;
};

export const logout = () => {
  localStorage.removeItem('token');
  delete api.defaults.headers.common['Authorization'];
};