// apps/frontend/src/app/admin/users/page.tsx
'use client';

import { useState, useEffect } from 'react';
import {
  Users,
  UserPlus,
  Shield,
  Search,
  MoreVertical,
  CheckCircle,
  Filter,
  Loader2,
  Calendar
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { userService, User } from '@/services/user.service';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await userService.getAllUsers();

      // Transform data if needed (e.g., if backend doesn't return status, we might mock it or assume 'active' for now)
      // For this implementation, we'll assume the User interface matches what we need, 
      // or we handle optional fields gracefully in the UI.
      console.log('Fetched users:', data);

      setUsers(data);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch users:', err);
      setError('Failed to load users. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => {
    // Handle potential undefined fields safely
    const nameMatch = (user.name || '').toLowerCase().includes(searchTerm.toLowerCase());
    const emailMatch = (user.email || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSearch = nameMatch || emailMatch;

    // Role matching - backend role might be lowercase or uppercase
    const matchesRole = roleFilter === 'all' || (user.role && user.role.toLowerCase() === roleFilter.toLowerCase());

    return matchesSearch && matchesRole;
  });

  // Computed Stats
  const totalUsers = users.length;
  const newThisMonth = users.filter(u => {
    const joinedDate = new Date(u.createdAt);
    const now = new Date();
    return joinedDate.getMonth() === now.getMonth() && joinedDate.getFullYear() === now.getFullYear();
  }).length;
  // Assuming all users fetched are "active" in terms of account existence for this demo stats
  const activeUsers = users.length;

  const getRoleBadge = (role: string) => {
    const r = (role || 'customer').toLowerCase();
    switch (r) {
      case 'admin':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wide bg-purple-100 text-purple-700 border border-purple-200"><Shield size={10} className="mr-1" /> Admin</span>;
      case 'moderator':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wide bg-blue-100 text-blue-700 border border-blue-200"><Shield size={10} className="mr-1" /> Mod</span>;
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-gray-100 text-gray-600 border border-gray-200">Customer</span>;
    }
  };

  // Helper for status - since backend object in typical setups might not have 'status' yet, 
  // we'll default to Active or logic based on fields. 
  // If the backend User entity has isActive or similar, use that. 
  // For now, we'll visually show them as Active.
  const getStatusIndicator = () => {
    return <span className="flex items-center text-xs font-bold text-green-600"><div className="w-2 h-2 rounded-full bg-green-500 mr-2" /> Active</span>;
  };

  const getUserAvatar = (name: string) => {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'User')}&background=random&color=fff`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <motion.div
      className="space-y-8 pb-10"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-end justify-between gap-6 bg-white rounded-[2.5rem] p-8 md:p-10 shadow-sm border border-gray-100 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-pink-50 to-orange-50 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 opacity-70 pointer-events-none"></div>
        <div className="relative z-10">
          <h1 className="text-4xl font-black text-gray-900 mb-2 tracking-tight">Users & Accounts</h1>
          <p className="text-gray-500 text-lg">Manage system access and customer profiles.</p>
        </div>
        <div className="relative z-10">
          <button className="flex items-center space-x-2 px-6 py-4 rounded-xl bg-black hover:bg-gray-800 text-white font-bold shadow-lg shadow-gray-200 transition-all hover:-translate-y-0.5">
            <UserPlus className="w-5 h-5" />
            <span>Invite User</span>
          </button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div variants={itemVariants} whileHover={{ y: -5 }} className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 rounded-2xl bg-purple-50 text-purple-600">
              <Users size={24} />
            </div>
          </div>
          <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Total Users</p>
          <h3 className="text-3xl font-black text-gray-900 tracking-tight">{totalUsers}</h3>
        </motion.div>

        <motion.div variants={itemVariants} whileHover={{ y: -5 }} className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 rounded-2xl bg-green-50 text-green-600">
              <CheckCircle size={24} />
            </div>
          </div>
          <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Active Accounts</p>
          <h3 className="text-3xl font-black text-gray-900 tracking-tight">{activeUsers}</h3>
        </motion.div>

        <motion.div variants={itemVariants} whileHover={{ y: -5 }} className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 rounded-2xl bg-blue-50 text-blue-600">
              <UserPlus size={24} />
            </div>
          </div>
          <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">New this Month</p>
          <h3 className="text-3xl font-black text-gray-900 tracking-tight">{newThisMonth}</h3>
        </motion.div>
      </div>

      {/* Filters and Search */}
      <motion.div variants={itemVariants} className="bg-white p-4 rounded-[1.5rem] border border-gray-100 shadow-sm flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-gray-50/50 border border-gray-100 rounded-xl focus:bg-white focus:ring-2 focus:ring-purple-100 focus:border-purple-500 transition-all font-medium text-gray-900"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter size={20} className="text-gray-400 ml-2" />
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="py-3 px-4 bg-gray-50/50 border border-gray-100 rounded-xl focus:bg-white focus:ring-2 focus:ring-purple-100 focus:border-purple-500 font-bold text-sm text-gray-700 cursor-pointer"
          >
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="moderator">Moderator</option>
            <option value="customer">Customer</option>
          </select>
        </div>
      </motion.div>

      {/* Users List */}
      <motion.div variants={itemVariants} className="space-y-4">
        {error ? (
          <div className="text-center py-12 bg-white rounded-[2.5rem] border border-gray-100">
            <p className="text-red-500 font-medium mb-4">{error}</p>
            <button
              onClick={fetchUsers}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-bold text-gray-700 transition-colors"
            >
              Retry
            </button>
          </div>
        ) : (
          <>
            {/* Desktop View */}
            <div className="hidden md:block bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden min-w-0">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-100">
                  <thead className="bg-gray-50/50">
                    <tr>
                      <th className="px-8 py-5 text-left text-[11px] font-black uppercase tracking-[0.1em] text-gray-400">User</th>
                      <th className="px-6 py-5 text-left text-[11px] font-black uppercase tracking-[0.1em] text-gray-400">Role</th>
                      <th className="px-6 py-5 text-left text-[11px] font-black uppercase tracking-[0.1em] text-gray-400">Status</th>
                      <th className="px-6 py-5 text-left text-[11px] font-black uppercase tracking-[0.1em] text-gray-400">Joined</th>
                      <th className="px-8 py-5 text-right text-[11px] font-black uppercase tracking-[0.1em] text-gray-400">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 bg-white">
                    {filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-12 text-center text-sm text-gray-500">
                          <div className="flex flex-col items-center gap-2">
                            <Users size={40} className="text-gray-200" />
                            <span className="font-semibold text-gray-900">No users found</span>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      <AnimatePresence>
                        {filteredUsers.map((user, index) => (
                          <motion.tr
                            key={user.id}
                            className="hover:bg-gray-50/80 transition-colors group"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                          >
                            <td className="px-8 py-5">
                              <div className="flex items-center">
                                <img
                                  className="h-10 w-10 rounded-full object-cover border border-gray-200"
                                  src={getUserAvatar(user.name || user.email)}
                                  alt={user.name}
                                />
                                <div className="ml-4">
                                  <div className="text-sm font-bold text-gray-900">{user.name || 'No Name'}</div>
                                  <div className="text-xs text-gray-500">{user.email}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-5">
                              {getRoleBadge(user.role)}
                            </td>
                            <td className="px-6 py-5">
                              {getStatusIndicator()}
                            </td>
                            <td className="px-6 py-5 text-sm font-medium text-gray-500">
                              <div className="flex items-center gap-2">
                                <Calendar size={14} />
                                {new Date(user.createdAt).toLocaleDateString()}
                              </div>
                            </td>
                            <td className="px-8 py-5 text-right">
                              <button className="text-gray-400 hover:text-gray-600 transition-colors">
                                <MoreVertical size={18} />
                              </button>
                            </td>
                          </motion.tr>
                        ))}
                      </AnimatePresence>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile View */}
            <div className="md:hidden space-y-4">
              <AnimatePresence>
                {filteredUsers.map((user, index) => (
                  <motion.div
                    key={user.id}
                    className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center">
                        <img className="h-12 w-12 rounded-full object-cover border border-gray-200" src={getUserAvatar(user.name || user.email)} alt={user.name} />
                        <div className="ml-3">
                          <h3 className="font-bold text-gray-900">{user.name || 'No Name'}</h3>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                      </div>
                      <button className="text-gray-400 hover:text-gray-600">
                        <MoreVertical size={20} />
                      </button>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                      <div className="flex gap-2">
                        {getRoleBadge(user.role)}
                      </div>
                      {getStatusIndicator()}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </>
        )}
      </motion.div>
    </motion.div>
  );
}