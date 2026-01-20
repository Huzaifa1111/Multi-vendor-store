
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

const api = axios.create({
    baseURL: API_URL,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const ordersService = {
    async getAllOrders() {
        const response = await api.get('/orders/admin');
        return response.data;
    },

    async getUserOrders() {
        const response = await api.get('/orders');
        return response.data;
    },

    async updateOrderStatus(id: number, status: string) {
        const response = await api.put(`/orders/${id}/status`, { status });
        return response.data;
    }
};
