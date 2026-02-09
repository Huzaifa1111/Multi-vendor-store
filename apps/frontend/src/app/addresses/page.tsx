'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { addressesService, Address } from '@/services/addresses.service';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Briefcase, MapPin, Plus, Trash2, Edit2, Loader2, Save, X, Check } from 'lucide-react';
import { useRouter } from 'next/navigation';

const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.1 }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
};

export default function AddressesPage() {
    const { user, isAuthenticated, isLoading: authLoading } = useAuth();
    const router = useRouter();
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingAddress, setEditingAddress] = useState<Address | null>(null);
    const [formData, setFormData] = useState<{
        type: 'home' | 'office';
        street: string;
        city: string;
        state: string;
        zipCode: string;
        country: string;
        isDefault: boolean;
    }>({
        type: 'home',
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'Pakistan',
        isDefault: false
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push('/auth/login');
        } else if (user) {
            fetchAddresses();
        }
    }, [user, isAuthenticated, authLoading, router]);

    const fetchAddresses = async () => {
        console.log('Fetching addresses...');
        try {
            const data = await addressesService.getAll();
            console.log('Addresses fetched:', data);
            setAddresses(data);
        } catch (error) {
            console.error('Failed to fetch addresses:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
        setFormData(prev => ({ ...prev, [name]: val }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        console.log('Submitting address form:', formData);
        try {
            if (editingAddress) {
                console.log('Updating address:', editingAddress.id);
                await addressesService.update(editingAddress.id, formData);
            } else {
                console.log('Creating new address');
                await addressesService.create(formData);
            }
            console.log('Address saved successfully');
            setIsFormOpen(false);
            setEditingAddress(null);
            resetForm();
            fetchAddresses();
        } catch (error) {
            console.error('Failed to save address:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEdit = (address: Address) => {
        setEditingAddress(address);
        setFormData({
            type: address.type,
            street: address.street,
            city: address.city,
            state: address.state || '',
            zipCode: address.zipCode,
            country: address.country,
            isDefault: address.isDefault
        });
        setIsFormOpen(true);
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this address?')) return;
        try {
            await addressesService.delete(id);
            fetchAddresses();
        } catch (error) {
            console.error('Failed to delete address:', error);
        }
    };

    const resetForm = () => {
        setFormData({
            type: 'home',
            street: '',
            city: '',
            state: '',
            zipCode: '',
            country: 'Pakistan',
            isDefault: false
        });
    };

    if (authLoading || isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto px-4 py-12">
            <motion.div
                initial="hidden"
                animate="show"
                variants={containerVariants}
                className="space-y-8"
            >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-4xl font-black text-gray-900 tracking-tight">My Addresses</h1>
                        <p className="text-gray-500 mt-2">Manage your delivery locations for faster checkout.</p>
                    </div>
                    <button
                        onClick={() => {
                            resetForm();
                            setEditingAddress(null);
                            setIsFormOpen(true);
                        }}
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-black text-white rounded-2xl font-bold hover:bg-gray-800 transition-all transform hover:-translate-y-1 shadow-lg"
                    >
                        <Plus size={20} />
                        Add New Address
                    </button>
                </div>

                <AnimatePresence>
                    {isFormOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl overflow-hidden"
                        >
                            <form onSubmit={handleSubmit} className="p-8 space-y-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-xl font-bold text-gray-900">
                                        {editingAddress ? 'Edit Address' : 'New Address'}
                                    </h3>
                                    <button
                                        type="button"
                                        onClick={() => setIsFormOpen(false)}
                                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700 ml-1">Address Type</label>
                                        <div className="grid grid-cols-2 gap-4">
                                            <button
                                                type="button"
                                                onClick={() => setFormData(prev => ({ ...prev, type: 'home' }))}
                                                className={`flex items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all ${formData.type === 'home' ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-gray-100 text-gray-500 hover:border-gray-200'}`}
                                            >
                                                <Home size={18} />
                                                <span className="font-bold">Home</span>
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setFormData(prev => ({ ...prev, type: 'office' }))}
                                                className={`flex items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all ${formData.type === 'office' ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-gray-100 text-gray-500 hover:border-gray-200'}`}
                                            >
                                                <Briefcase size={18} />
                                                <span className="font-bold">Office</span>
                                            </button>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700 ml-1">Street Address</label>
                                        <input
                                            type="text"
                                            name="street"
                                            required
                                            value={formData.street}
                                            onChange={handleInputChange}
                                            placeholder="House #, Street Name"
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all bg-gray-50"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700 ml-1">City</label>
                                        <input
                                            type="text"
                                            name="city"
                                            required
                                            value={formData.city}
                                            onChange={handleInputChange}
                                            placeholder="City"
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all bg-gray-50"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700 ml-1">State / Province</label>
                                        <input
                                            type="text"
                                            name="state"
                                            value={formData.state}
                                            onChange={handleInputChange}
                                            placeholder="State"
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all bg-gray-50"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700 ml-1">Zip / Postal Code</label>
                                        <input
                                            type="text"
                                            name="zipCode"
                                            required
                                            value={formData.zipCode}
                                            onChange={handleInputChange}
                                            placeholder="Code"
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all bg-gray-50"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700 ml-1">Country</label>
                                        <input
                                            type="text"
                                            name="country"
                                            required
                                            value={formData.country}
                                            onChange={handleInputChange}
                                            placeholder="Country"
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all bg-gray-50"
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 py-2">
                                    <input
                                        type="checkbox"
                                        id="isDefault"
                                        name="isDefault"
                                        checked={formData.isDefault}
                                        onChange={handleInputChange}
                                        className="w-5 h-5 rounded text-blue-600 focus:ring-blue-500 border-gray-300 pointer-events-auto"
                                    />
                                    <label htmlFor="isDefault" className="text-sm font-medium text-gray-700">Set as default address</label>
                                </div>

                                <div className="flex justify-end gap-4 pt-4 border-t border-gray-100">
                                    <button
                                        type="button"
                                        onClick={() => setIsFormOpen(false)}
                                        className="px-6 py-3 text-gray-600 font-bold hover:text-gray-900 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all flex items-center gap-2 disabled:opacity-70 shadow-lg shadow-blue-100"
                                    >
                                        {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                                        {editingAddress ? 'Update Address' : 'Save Address'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {addresses.length === 0 ? (
                        <div className="col-span-full py-20 text-center bg-gray-50 rounded-[2.5rem] border-2 border-dashed border-gray-200">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <MapPin className="text-gray-400" size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900">No addresses saved</h3>
                            <p className="text-gray-500 mt-2">Add your first address to get started.</p>
                        </div>
                    ) : (
                        addresses.map((address) => (
                            <motion.div
                                key={address.id}
                                variants={itemVariants}
                                className={`relative group bg-white p-6 rounded-[2rem] border-2 transition-all ${address.isDefault ? 'border-blue-600 shadow-xl shadow-blue-50' : 'border-gray-100 hover:border-gray-200 shadow-sm'}`}
                            >
                                {address.isDefault && (
                                    <div className="absolute top-6 right-6 px-3 py-1 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full">
                                        Default
                                    </div>
                                )}

                                <div className="flex items-start gap-4">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${address.type === 'home' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'}`}>
                                        {address.type === 'home' ? <Home size={24} /> : <Briefcase size={24} />}
                                    </div>
                                    <div className="space-y-1">
                                        <h4 className="text-lg font-bold text-gray-900 capitalize">{address.type} Address</h4>
                                        <p className="text-gray-600 leading-relaxed">
                                            {address.street}<br />
                                            {address.city}, {address.state} {address.zipCode}<br />
                                            {address.country}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center justify-end gap-2 mt-6 pt-6 border-t border-gray-50 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => handleEdit(address)}
                                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                                        title="Edit"
                                    >
                                        <Edit2 size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(address.id)}
                                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                        title="Delete"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>
            </motion.div>
        </div>
    );
}
