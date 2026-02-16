'use client';

import React from 'react';
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    PieChart,
    Pie,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Cell,
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

export const SalesTrendChart = ({ data }: { data: any[] }) => (
    <div className="h-[300px] w-full bg-white p-4 rounded-xl shadow-sm">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Sales Trend (Last 30 Days)</h3>
        <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                    dataKey="date"
                    tickFormatter={(val) => new Date(val).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}
                />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} dot={false} />
            </LineChart>
        </ResponsiveContainer>
    </div>
);

export const TopProductsChart = ({ data }: { data: any[] }) => (
    <div className="h-[300px] w-full bg-white p-4 rounded-xl shadow-sm">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Top Selling Products</h3>
        <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={100} />
                <Tooltip />
                <Bar dataKey="sales" fill="#10b981" radius={[0, 4, 4, 0]} />
            </BarChart>
        </ResponsiveContainer>
    </div>
);

export const CategoryDistributionChart = ({ data }: { data: any[] }) => (
    <div className="h-[300px] w-full bg-white p-4 rounded-xl shadow-sm">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Revenue by Category</h3>
        <ResponsiveContainer width="100%" height="100%">
            <PieChart>
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip />
                <Legend />
            </PieChart>
        </ResponsiveContainer>
    </div>
);

export const OrderStatusChart = ({ data }: { data: any[] }) => (
    <div className="h-[300px] w-full bg-white p-4 rounded-xl shadow-sm">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Order Status Distribution</h3>
        <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            </BarChart>
        </ResponsiveContainer>
    </div>
);
