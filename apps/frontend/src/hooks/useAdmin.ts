import { useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';

export const useAdmin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuthStore();

  const adminRequest = async (endpoint: string, options: RequestInit = {}) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/admin/${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          ...options.headers,
        },
      });

      if (!response.ok) {
        throw new Error('Admin request failed');
      }

      const data = await response.json();
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getDashboardStats = () => adminRequest('dashboard');
  
  const getUsers = () => adminRequest('users');
  
  const updateUserRole = (userId: number, role: string) =>
    adminRequest(`users/${userId}/role`, {
      method: 'PUT',
      body: JSON.stringify({ role }),
    });

  const deleteUser = (userId: number) =>
    adminRequest(`users/${userId}`, {
      method: 'DELETE',
    });

  return {
    loading,
    error,
    getDashboardStats,
    getUsers,
    updateUserRole,
    deleteUser,
  };
};