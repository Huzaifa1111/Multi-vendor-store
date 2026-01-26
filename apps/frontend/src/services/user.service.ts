// apps/frontend/src/services/user.service.ts
import api from '@/lib/api';

export interface User {
    id: number;
    email: string;
    name?: string;
    role: 'admin' | 'customer' | 'moderator';
    createdAt: string;
    updatedAt: string;
}

export const userService = {
    async getAllUsers(): Promise<User[]> {
        try {
            const response = await api.get('/users');
            return response.data;
        } catch (error) {
            console.error('Error fetching users:', error);
            throw error;
        }
    },

    async deleteUser(id: number): Promise<void> {
        try {
            await api.delete(`/users/${id}`);
        } catch (error) {
            console.error('Error deleting user:', error);
            throw error;
        }
    }
};
