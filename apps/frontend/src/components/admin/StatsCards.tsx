import React from 'react';

interface StatsCardsProps {
  stats: {
    users: number;
    products: number;
    orders: number;
  };
}

const StatsCards: React.FC<StatsCardsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-blue-100 text-blue-600">
            👥
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-semibold">Total Users</h3>
            <p className="text-3xl font-bold">{stats.users}</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-green-100 text-green-600">
            🛍️
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-semibold">Total Products</h3>
            <p className="text-3xl font-bold">{stats.products}</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-purple-100 text-purple-600">
            📦
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-semibold">Total Orders</h3>
            <p className="text-3xl font-bold">{stats.orders}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsCards;