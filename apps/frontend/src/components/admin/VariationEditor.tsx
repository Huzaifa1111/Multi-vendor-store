import { useState, useRef } from 'react';
import { Package, DollarSign, Image as ImageIcon, Trash2, Calendar, Maximize, Check, X, Plus, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/lib/api';

interface AttributeValue {
    id: number;
    value: string;
    attribute: { name: string };
}

interface Variation {
    id?: string;
    sku: string;
    price: number;
    salePrice?: number;
    saleStartDate?: string;
    saleEndDate?: string;
    stock: number;
    inStock: boolean;
    images: string[];
    weight?: number;
    length?: number;
    width?: number;
    height?: number;
    isDefault: boolean;
    attributeValues: any[]; // Full objects for display
    attributeValueIds: number[]; // For backend
}

interface Props {
    variation: Variation;
    onUpdate: (updated: Variation) => void;
    onRemove: () => void;
    isSingle: boolean;
}

export default function VariationEditor({ variation, onUpdate, onRemove, isSingle }: Props) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleChange = (field: keyof Variation, value: any) => {
        onUpdate({ ...variation, [field]: value });
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            const formData = new FormData();
            formData.append('image', file);

            const response = await api.post('/uploads/image', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.data) {
                const imageUrl = typeof response.data === 'string' ? response.data : response.data.url;
                handleChange('images', [...variation.images, imageUrl]);
            }
        } catch (error) {
            console.error('Upload failed:', error);
            alert('Failed to upload image');
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const label = variation.attributeValues.map(av => av.value).join(' / ') || 'New Variation';

    return (
        <div className="bg-white border border-gray-100 rounded-[2rem] overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div className="p-6 flex items-center justify-between gap-4 bg-gray-50/30">
                <div className="flex items-center gap-4 flex-1">
                    <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold">
                        {variation.attributeValues[0]?.value?.charAt(0) || 'V'}
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900">{label}</h3>
                        <p className="text-xs text-gray-500 font-medium">SKU: {variation.sku || 'Not set'}</p>
                    </div>
                </div>

                <div className="flex items-center gap-3 text-sm font-bold">
                    <div className="flex flex-col items-end">
                        {variation.salePrice ? (
                            <>
                                <span className="text-gray-400 line-through text-[10px] leading-none">${variation.price}</span>
                                <span className="text-green-600">${variation.salePrice}</span>
                            </>
                        ) : (
                            <div className="px-3 py-1 bg-green-50 text-green-600 rounded-lg">
                                ${variation.price}
                            </div>
                        )}
                    </div>
                    <div className="px-3 py-1 bg-purple-50 text-purple-600 rounded-lg">
                        {variation.stock} in stock
                    </div>
                    {variation.isDefault && (
                        <div className="px-3 py-1 bg-orange-50 text-orange-600 rounded-lg flex items-center gap-1">
                            <Check size={14} /> Default
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="p-2 text-gray-400 hover:text-black hover:bg-white rounded-lg transition-all"
                    >
                        <Maximize size={18} />
                    </button>
                    {!isSingle && (
                        <button
                            type="button"
                            onClick={onRemove}
                            className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        >
                            <Trash2 size={18} />
                        </button>
                    )}
                </div>
            </div>

            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t border-gray-100"
                    >
                        <div className="p-8 space-y-8">
                            {/* Basic Info */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">SKU</label>
                                    <input
                                        type="text"
                                        value={variation.sku}
                                        onChange={(e) => handleChange('sku', e.target.value)}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-100 transition-all font-medium text-sm"
                                        placeholder="SKU-123"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">Price</label>
                                    <div className="relative">
                                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                                        <input
                                            type="number"
                                            value={variation.price}
                                            onChange={(e) => handleChange('price', parseFloat(e.target.value))}
                                            className="w-full pl-8 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-100 transition-all font-medium text-sm"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">Stock</label>
                                    <div className="relative">
                                        <Package className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                                        <input
                                            type="number"
                                            value={variation.stock}
                                            onChange={(e) => handleChange('stock', parseInt(e.target.value))}
                                            className="w-full pl-8 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-100 transition-all font-medium text-sm"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Sale Price */}
                            <div className="p-6 bg-orange-50/30 rounded-2xl border border-orange-100/50 space-y-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <Calendar className="text-orange-500" size={18} />
                                    <h4 className="font-bold text-orange-900 text-sm">Sale Pricing</h4>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div>
                                        <label className="block text-xs font-bold text-orange-700 mb-2 uppercase tracking-wider">Sale Price</label>
                                        <input
                                            type="number"
                                            value={variation.salePrice || ''}
                                            onChange={(e) => handleChange('salePrice', e.target.value ? parseFloat(e.target.value) : undefined)}
                                            className="w-full px-4 py-3 bg-white border border-orange-100 rounded-xl focus:ring-2 focus:ring-orange-200 transition-all font-medium text-sm"
                                            placeholder="0.00"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-orange-700 mb-2 uppercase tracking-wider">Start Date</label>
                                        <input
                                            type="date"
                                            value={variation.saleStartDate || ''}
                                            onChange={(e) => handleChange('saleStartDate', e.target.value)}
                                            className="w-full px-4 py-3 bg-white border border-orange-100 rounded-xl focus:ring-2 focus:ring-orange-200 transition-all font-medium text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-orange-700 mb-2 uppercase tracking-wider">End Date</label>
                                        <input
                                            type="date"
                                            value={variation.saleEndDate || ''}
                                            onChange={(e) => handleChange('saleEndDate', e.target.value)}
                                            className="w-full px-4 py-3 bg-white border border-orange-100 rounded-xl focus:ring-2 focus:ring-orange-200 transition-all font-medium text-sm"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Dimensions & Weight */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">Weight (kg)</label>
                                    <input
                                        type="number"
                                        value={variation.weight || ''}
                                        onChange={(e) => handleChange('weight', parseFloat(e.target.value))}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-100 transition-all font-medium text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">Length (cm)</label>
                                    <input
                                        type="number"
                                        value={variation.length || ''}
                                        onChange={(e) => handleChange('length', parseFloat(e.target.value))}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-100 transition-all font-medium text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">Width (cm)</label>
                                    <input
                                        type="number"
                                        value={variation.width || ''}
                                        onChange={(e) => handleChange('width', parseFloat(e.target.value))}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-100 transition-all font-medium text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">Height (cm)</label>
                                    <input
                                        type="number"
                                        value={variation.height || ''}
                                        onChange={(e) => handleChange('height', parseFloat(e.target.value))}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-100 transition-all font-medium text-sm"
                                    />
                                </div>
                            </div>

                            {/* Variation Images */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <ImageIcon className="text-purple-500" size={18} />
                                    <h4 className="font-bold text-gray-900 text-sm">Variation Images</h4>
                                </div>
                                <div className="flex gap-4 overflow-x-auto pb-4">
                                    {variation.images.map((img, i) => (
                                        <div key={i} className="relative w-24 h-24 rounded-2xl overflow-hidden border border-gray-100 flex-shrink-0 group">
                                            <img src={img} alt="" className="w-full h-full object-cover" />
                                            <button
                                                type="button"
                                                onClick={() => handleChange('images', variation.images.filter((_, idx) => idx !== i))}
                                                className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                                            >
                                                <X size={10} />
                                            </button>
                                        </div>
                                    ))}
                                    <div className="relative w-24 h-24 rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center flex-shrink-0 hover:border-indigo-500 transition-colors group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            className="hidden"
                                            accept="image/*"
                                            onChange={handleFileUpload}
                                            disabled={uploading}
                                        />
                                        {uploading ? (
                                            <Loader2 className="text-indigo-500 animate-spin" size={24} />
                                        ) : (
                                            <>
                                                <Plus className="text-gray-400 group-hover:text-indigo-500" size={24} />
                                                <span className="text-[10px] text-gray-400 font-bold mt-1">UPLOAD</span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Status & Options */}
                            <div className="flex flex-wrap gap-6 pt-4 border-t border-gray-50">
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <div className={`w-12 h-6 rounded-full transition-all relative ${variation.inStock ? 'bg-green-500' : 'bg-gray-200'}`}>
                                        <input
                                            type="checkbox"
                                            className="hidden"
                                            checked={variation.inStock}
                                            onChange={(e) => handleChange('inStock', e.target.checked)}
                                        />
                                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${variation.inStock ? 'left-7' : 'left-1'}`} />
                                    </div>
                                    <span className="text-sm font-bold text-gray-700 group-hover:text-black transition-colors">Available / In Stock</span>
                                </label>

                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <div className={`w-12 h-6 rounded-full transition-all relative ${variation.isDefault ? 'bg-orange-500' : 'bg-gray-200'}`}>
                                        <input
                                            type="checkbox"
                                            className="hidden"
                                            checked={variation.isDefault}
                                            onChange={(e) => handleChange('isDefault', e.target.checked)}
                                        />
                                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${variation.isDefault ? 'left-7' : 'left-1'}`} />
                                    </div>
                                    <span className="text-sm font-bold text-gray-700 group-hover:text-black transition-colors">Set as Default Variation</span>
                                </label>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
