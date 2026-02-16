import api from '../lib/api';

export const categoryService = {
    getCategories: async () => {
        const response = await api.get('/categories/public');
        return response.data;
    }
};
