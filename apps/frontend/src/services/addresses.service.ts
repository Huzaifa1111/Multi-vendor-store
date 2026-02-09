import api from '@/lib/api';

export interface Address {
    id: number;
    userId: number;
    type: 'home' | 'office';
    street: string;
    city: string;
    state?: string;
    zipCode: string;
    country: string;
    isDefault: boolean;
}

export const addressesService = {
    async getAll(): Promise<Address[]> {
        const response = await api.get('/users/addresses');
        return response.data;
    },

    async create(addressData: Partial<Address>): Promise<Address> {
        const response = await api.post('/users/addresses', addressData);
        return response.data;
    },

    async update(id: number, addressData: Partial<Address>): Promise<Address> {
        const response = await api.patch(`/users/addresses/${id}`, addressData);
        return response.data;
    },

    async delete(id: number): Promise<void> {
        await api.delete(`/users/addresses/${id}`);
    }
};
