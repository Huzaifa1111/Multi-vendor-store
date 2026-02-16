'use client';

import React, { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { adminService } from '@/services/admin.service';
import {
    Save,
    Settings as SettingsIcon,
    Globe,
    Mail,
    Phone,
    MapPin,
    DollarSign,
    AlertCircle,
    Loader2,
    CheckCircle2
} from 'lucide-react';

const SOCKET_URL = process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:4000/admin';

export default function SettingsPage() {
    const [settings, setSettings] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [isLive, setIsLive] = useState(false);

    useEffect(() => {
        fetchSettings();

        const socket: Socket = io(SOCKET_URL, {
            withCredentials: true,
            transports: ['websocket'],
        });

        socket.on('connect', () => {
            setIsLive(true);
        });

        socket.on('disconnect', () => {
            setIsLive(false);
        });

        socket.on('settings-update', (updatedSettings: any) => {
            console.log('Real-time settings update received');
            setSettings(updatedSettings);
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    const fetchSettings = async () => {
        try {
            setLoading(true);
            const data = await adminService.getSettings();
            setSettings(data);
        } catch (err: any) {
            setError('Failed to load settings');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setSaving(true);
            setError(null);
            setSuccess(null);
            await adminService.updateSettings(settings);
            setSuccess('Settings updated successfully');
            setTimeout(() => setSuccess(null), 3000);
        } catch (err: any) {
            setError('Failed to save settings');
        } finally {
            setSaving(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
        setSettings({ ...settings, [name]: val });
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-4" />
                <p className="text-gray-500 font-medium">Loading settings...</p>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-8 bg-gray-50 min-h-screen">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                        <SettingsIcon className="w-8 h-8" />
                        Store Settings
                    </h1>
                    <p className="text-gray-500 mt-1">Configure your store details and preferences in real-time.</p>
                </div>

                <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-full text-sm font-medium ${isLive ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}>
                    <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
                    <span>{isLive ? 'Live Feed' : 'Disconnected'}</span>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* General Settings */}
                <Section title="General Information" icon={<Globe className="w-5 h-5 text-blue-500" />}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input
                            label="Store Name"
                            name="storeName"
                            value={settings.storeName}
                            onChange={handleChange}
                            placeholder="e.g. My Awesome Store"
                        />
                        <div className="flex items-center space-x-3 pt-8">
                            <input
                                type="checkbox"
                                id="maintenanceMode"
                                name="maintenanceMode"
                                checked={settings.maintenanceMode}
                                onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
                                className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                            />
                            <label htmlFor="maintenanceMode" className="text-sm font-medium text-gray-700">Enable Maintenance Mode</label>
                        </div>
                    </div>
                </Section>

                {/* Contact Information */}
                <Section title="Contact Details" icon={<Mail className="w-5 h-5 text-green-500" />}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input
                            label="Store Email"
                            name="storeEmail"
                            type="email"
                            value={settings.storeEmail}
                            onChange={handleChange}
                            icon={<Mail className="w-4 h-4" />}
                        />
                        <Input
                            label="Store Phone"
                            name="storePhone"
                            value={settings.storePhone}
                            onChange={handleChange}
                            icon={<Phone className="w-4 h-4" />}
                        />
                        <div className="md:col-span-2">
                            <label className="block text-sm font-bold text-gray-700 mb-2">Store Address</label>
                            <div className="relative">
                                <div className="absolute top-3 left-3 text-gray-400">
                                    <MapPin className="w-4 h-4" />
                                </div>
                                <textarea
                                    name="storeAddress"
                                    value={settings.storeAddress}
                                    onChange={handleChange}
                                    rows={3}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                    placeholder="Street, City, Country"
                                />
                            </div>
                        </div>
                    </div>
                </Section>

                {/* Localization & Finance */}
                <Section title="Localization & Finance" icon={<DollarSign className="w-5 h-5 text-purple-500" />}>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Input
                            label="Currency Code"
                            name="currency"
                            value={settings.currency}
                            onChange={handleChange}
                            placeholder="e.g. USD, EUR"
                        />
                        <Input
                            label="Tax Rate (%)"
                            name="taxRate"
                            type="number"
                            step="0.01"
                            value={settings.taxRate}
                            onChange={handleChange}
                        />
                        <Input
                            label="Base Shipping Fee"
                            name="shippingFee"
                            type="number"
                            step="0.01"
                            value={settings.shippingFee}
                            onChange={handleChange}
                        />
                    </div>
                </Section>

                {/* Notifications and Feedback */}
                {(error || success) && (
                    <div className={`p-4 rounded-lg flex items-center gap-3 ${error ? 'bg-red-50 text-red-700 border border-red-100' : 'bg-green-50 text-green-700 border border-green-100'}`}>
                        {error ? <AlertCircle className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
                        <p className="font-medium">{error || success}</p>
                    </div>
                )}

                <div className="flex justify-end pt-4 border-t border-gray-200">
                    <button
                        type="submit"
                        disabled={saving}
                        className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 shadow-lg shadow-blue-200 disabled:opacity-50 transition-all active:scale-95"
                    >
                        {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </form>
        </div>
    );
}

function Section({ title, icon, children }: { title: string, icon: React.ReactNode, children: React.ReactNode }) {
    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
            <div className="flex items-center gap-2 pb-4 border-b border-gray-50">
                {icon}
                <h2 className="text-xl font-bold text-gray-800">{title}</h2>
            </div>
            {children}
        </div>
    );
}

function Input({ label, icon, ...props }: any) {
    return (
        <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-700">{label}</label>
            <div className="relative">
                {icon && (
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                        {icon}
                    </div>
                )}
                <input
                    {...props}
                    className={`w-full ${icon ? 'pl-10' : 'pl-4'} pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition`}
                />
            </div>
        </div>
    );
}
