import api from '@/lib/api';

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
