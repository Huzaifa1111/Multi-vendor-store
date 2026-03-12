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
import { usePriceFormatter } from '@/store/useCurrencyStore';

const SOCKET_URL = process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:4000/admin';

export default function AnalyticsPage() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isLive, setIsLive] = useState(false);
    const { formatPrice } = usePriceFormatter();

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

                <div className="flex items-center space-x-4">
                    <button
                        onClick={fetchInitialData}
                        className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                        title="Refresh Data"
                    >
                        <RefreshCw className="w-5 h-5" />
                    </button>
                    <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-full text-sm font-medium ${isLive ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}>
                        <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
                        <span>{isLive ? 'Live Feed' : 'Disconnected'}</span>
                    </div>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                    title="Total Revenue"
                    value={formatPrice(data.summary.totalRevenue)}
                    trend={data.summary.revenueGrowth}
                    icon={<DollarSign className="text-blue-600" />}
                    color="bg-blue-50"
                />
                <StatsCard
                    title="Total Orders"
                    value={data.summary.totalOrders}
                    trend={data.summary.orderGrowth}
                    icon={<ShoppingBag className="text-green-600" />}
                    color="bg-green-50"
                />
                <StatsCard
                    title="Avg Order Value"
                    value={formatPrice(data.summary.currentAOV)}
                    trend={data.summary.aovGrowth}
                    icon={<TrendingUp className="text-purple-600" />}
                    color="bg-purple-50"
                />
                <StatsCard
                    title="New Customers"
                    value={data.summary.newCustomers}
                    description="Last 30 days"
                    icon={<Users className="text-orange-600" />}
                    color="bg-orange-50"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 grid grid-cols-1 gap-8">
                    <SalesTrendChart data={data.salesTrend} />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <CategoryDistributionChart data={data.categoryData} />
                        <OrderStatusChart data={data.statusData} />
                    </div>
                </div>

                <div className="space-y-8">
                    <TopProductsChart data={data.topProducts} />

                    {/* Low Stock Alerts */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                            <RefreshCw className="w-5 h-5 mr-2 text-orange-500" />
                            Stock Alerts
                        </h3>
                        {data.lowStockAlerts.length > 0 ? (
                            <div className="space-y-4">
                                {data.lowStockAlerts.map((item: any) => (
                                    <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                                        <div className="min-w-0 flex-1">
                                            <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                                            <p className="text-xs text-gray-500">SKU: {item.sku || 'N/A'}</p>
                                        </div>
                                        <div className="ml-4 text-right">
                                            <p className={`text-sm font-bold ${item.stock <= 2 ? 'text-red-600' : 'text-orange-600'}`}>
                                                {item.stock} left
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-gray-500 text-center py-4">All products are well stocked.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatsCard({ title, value, trend, icon, color, description }: {
    title: string,
    value: any,
    trend?: number,
    icon: React.ReactNode,
    color: string,
    description?: string
}) {
    const isPositive = trend !== undefined && trend >= 0;

    return (
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between">
            <div className="flex items-start justify-between">
                <div className={`p-3 rounded-lg ${color}`}>
                    {icon}
                </div>
                {trend !== undefined && (
                    <div className={`flex items-center text-xs font-bold px-2 py-1 rounded-full ${isPositive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {isPositive ? '+' : ''}{trend.toFixed(1)}%
                    </div>
                )}
            </div>
            <div className="mt-4">
                <p className="text-sm font-medium text-gray-500">{title}</p>
                <div className="flex items-baseline space-x-2">
                    <p className="text-2xl font-bold text-gray-900">{value}</p>
                    {description && <span className="text-xs text-gray-400 font-normal">{description}</span>}
                </div>
            </div>
        </div>
    );
}
