'use client';

import React, { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { adminService } from '@/services/admin.service';
import {
    SalesTrendChart,
    TopProductsChart,
    CategoryDistributionChart,
    OrderStatusChart
} from './_components/AnalyticsCharts';
import {
    TrendingUp,
    Users,
    ShoppingBag,
    Star,
    DollarSign,
    Loader2,
    RefreshCw
} from 'lucide-react';

const SOCKET_URL = process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:4000/admin';

export default function AnalyticsPage() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isLive, setIsLive] = useState(false);

    useEffect(() => {
        fetchInitialData();

        const socket: Socket = io(SOCKET_URL, {
            withCredentials: true,
            transports: ['websocket'],
        });

        socket.on('connect', () => {
            console.log('Connected to analytics live feed');
            setIsLive(true);
        });

        socket.on('disconnect', () => {
            console.log('Disconnected from analytics live feed');
            setIsLive(false);
        });

        socket.on('analytics-update', (updatedData: any) => {
            console.log('Real-time analytics update received');
            setData(updatedData);
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    const fetchInitialData = async () => {
        try {
            setLoading(true);
            const analytics = await adminService.getAnalytics();
            setData(analytics);
            setError(null);
        } catch (err: any) {
            console.error('Failed to fetch initial analytics:', err);
            setError('Failed to load initial analytics data');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-4" />
                <p className="text-gray-500 font-medium">Loading store analytics...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-8 text-center bg-red-50 rounded-xl border border-red-100">
                <p className="text-red-600 font-medium">{error}</p>
                <button
                    onClick={fetchInitialData}
                    className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                >
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-8 bg-gray-50 min-h-screen">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Store Analytics</h1>
                    <p className="text-gray-500 mt-1">Real-time performance overview of your multi-vendor store.</p>
                </div>

                <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-full text-sm font-medium ${isLive ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}>
                    <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
                    <span>{isLive ? 'Live Feed' : 'Disconnected'}</span>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                <StatsCard
                    title="Total Revenue"
                    value={`$${data.summary.totalRevenue.toLocaleString()}`}
                    icon={<DollarSign className="text-blue-600" />}
                    color="bg-blue-50"
                />
                <StatsCard
                    title="Total Orders"
                    value={data.summary.totalOrders}
                    icon={<ShoppingBag className="text-green-600" />}
                    color="bg-green-50"
                />
                <StatsCard
                    title="Total Users"
                    value={data.summary.totalUsers}
                    icon={<Users className="text-purple-600" />}
                    color="bg-purple-50"
                />
                <StatsCard
                    title="Total Products"
                    value={data.summary.totalProducts}
                    icon={<TrendingUp className="text-orange-600" />}
                    color="bg-orange-50"
                />
                <StatsCard
                    title="Total Reviews"
                    value={data.summary.totalReviews}
                    icon={<Star className="text-yellow-600" />}
                    color="bg-yellow-50"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <SalesTrendChart data={data.salesTrend} />
                <TopProductsChart data={data.topProducts} />
                <CategoryDistributionChart data={data.categoryData} />
                <OrderStatusChart data={data.statusData} />
            </div>
        </div>
    );
}

function StatsCard({ title, value, icon, color }: { title: string, value: any, icon: React.ReactNode, color: string }) {
    return (
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
            <div className={`p-3 rounded-lg ${color}`}>
                {icon}
            </div>
            <div>
                <p className="text-sm font-medium text-gray-500">{title}</p>
                <p className="text-2xl font-bold text-gray-900">{value}</p>
            </div>
        </div>
    );
}
