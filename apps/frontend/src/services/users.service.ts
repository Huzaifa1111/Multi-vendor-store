import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export interface UpdateUserDto {
    name?: string;
    email?: string;
    phone?: string;
    password?: string;
}

export const usersService = {
    async updateProfile(id: number, data: UpdateUserDto) {
        const response = await api.put(`/users/${id}`, data);
        return response.data;
    },
};
