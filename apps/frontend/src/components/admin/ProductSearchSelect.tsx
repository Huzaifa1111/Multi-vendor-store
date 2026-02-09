'use client';

import { useState, useEffect } from 'react';
import { Search, Check, Loader2, X } from 'lucide-react';

interface Product {
    id: number;
    name: string;
    category?: string;
}

interface Props {
    label: string;
    selectedIds: number[];
    onChange: (ids: number[]) => void;
}

export default function ProductSearchSelect({ label, selectedIds, onChange }: Props) {
    const [query, setQuery] = useState('');
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);

    useEffect(() => {
        const fetchProducts = async () => {
            // If we have selected IDs but no search query, we should ideally still fetch names.
            // For this implementation, we'll fetch products when searching.
            if (query.trim() === '' && selectedIds.length === 0) {
                setProducts([]);
                return;
            }

            setLoading(true);
            try {
                const url = query.trim()
                    ? `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/products?search=${query}&limit=10`
                    : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/products?limit=50`; // Default list

                const res = await fetch(url);
                if (res.ok) {
                    const data = await res.json();
                    setProducts(data);
                }
            } catch (err) {
                console.error('Failed to fetch products', err);
            } finally {
                setLoading(false);
            }
        };

        const timer = setTimeout(fetchProducts, 300);
        return () => clearTimeout(timer);
    }, [query]);

    const toggleProduct = (id: number) => {
        if (selectedIds.includes(id)) {
            onChange(selectedIds.filter(i => i !== id));
        } else {
            onChange([...selectedIds, id]);
        }
    };

    return (
        <div className="space-y-3">
            <label className="block text-sm font-bold text-gray-700">{label}</label>

            <div className="relative">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => {
                            setQuery(e.target.value);
                            setShowDropdown(true);
                        }}
                        onFocus={() => setShowDropdown(true)}
                        placeholder="Search products to add..."
                        className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all text-sm"
                    />
                </div>

                {showDropdown && (products.length > 0 || loading) && (
                    <div className="absolute z-20 w-full mt-2 bg-white border border-gray-100 shadow-xl rounded-2xl overflow-hidden max-h-60 overflow-y-auto">
                        {loading && <div className="p-4 text-center"><Loader2 className="animate-spin mx-auto text-blue-500" /></div>}
                        {!loading && products.map(p => (
                            <div
                                key={p.id}
                                className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0 cursor-pointer"
                                onClick={() => toggleProduct(p.id)}
                            >
                                <input
                                    type="checkbox"
                                    checked={selectedIds.includes(p.id)}
                                    onChange={() => { }} // Controlled by parent div click
                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <div className="flex-1">
                                    <div className="text-sm font-bold text-gray-900">{p.name}</div>
                                    <div className="text-xs text-gray-500">{p.category || 'No category'}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="flex flex-wrap gap-2 min-h-[32px]">
                {selectedIds.length > 0 && products.filter(p => selectedIds.includes(p.id)).map(p => (
                    <span key={p.id} className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-xs font-bold border border-blue-100">
                        {p.name}
                        <button type="button" onClick={() => toggleProduct(p.id)} className="hover:text-blue-900">
                            <X size={14} />
                        </button>
                    </span>
                ))}
                {selectedIds.length > 0 && products.filter(p => selectedIds.includes(p.id)).length === 0 && (
                    <span className="text-xs text-gray-400 italic">{selectedIds.length} items selected (search to see names)</span>
                )}
            </div>

            {showDropdown && (
                <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowDropdown(false)}
                />
            )}
        </div>
    );
}
