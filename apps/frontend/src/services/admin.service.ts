import api from '../lib/api';

export const adminService = {
    getStats: async () => {
        const response = await api.get('/admin/stats');
        return response.data;
    },

    getAnalytics: async () => {
        const response = await api.get('/admin/analytics');
        return response.data;
    },

    getUsers: async () => {
        const response = await api.get('/admin/users');
        return response.data;
    },

    getOrders: async () => {
        const response = await api.get('/admin/orders');
        return response.data;
    },

    getProducts: async () => {
        const response = await api.get('/admin/products');
        return response.data;
    },

    getSettings: async () => {
        const response = await api.get('/admin/settings');
        return response.data;
    },

    updateSettings: async (data: any) => {
        const response = await api.patch('/admin/settings', data);
        return response.data;
    },

    getCategories: async () => {
        const response = await api.get('/categories');
        return response.data;
    },

    getCategory: async (id: number) => {
        const response = await api.get(`/categories/${id}`);
        return response.data;
    },

    createCategory: async (data: any) => {
        const response = await api.post('/categories', data);
        return response.data;
    },

    updateCategory: async (id: number, data: any) => {
        const response = await api.patch(`/categories/${id}`, data);
        return response.data;
    },

    deleteCategory: async (id: number) => {
        const response = await api.delete(`/categories/${id}`);
        return response.data;
    }
};
