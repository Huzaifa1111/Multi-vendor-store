'use client';

import { useState, useEffect } from 'react';
import { Search, Plus, Check, Loader2, X } from 'lucide-react';

interface AttributeValue {
    id: number;
    value: string;
}

interface Attribute {
    id: number;
    name: string;
    values: AttributeValue[];
}

interface Props {
    attributeName: string;
    selectedValues: AttributeValue[];
    onChange: (values: AttributeValue[]) => void;
}

export default function AttributeSelector({ attributeName, selectedValues, onChange }: Props) {
    const [query, setQuery] = useState('');
    const [options, setOptions] = useState<AttributeValue[]>([]);
    const [loading, setLoading] = useState(false);
    const [showOptions, setShowOptions] = useState(false);

    useEffect(() => {
        const fetchOptions = async () => {
            if (!showOptions && query === '') return;

            setLoading(true);
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/attributes/values?attribute=${attributeName}&q=${query}`);
                if (res.ok) {
                    const data = await res.json();
                    setOptions(data);
                }
            } catch (err) {
                console.error('Failed to fetch attribute values', err);
            } finally {
                setLoading(false);
            }
        };

        const timer = setTimeout(fetchOptions, 300);
        return () => clearTimeout(timer);
    }, [query, attributeName, showOptions]);

    const handleAddValue = async () => {
        if (!query.trim()) return;

        setLoading(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/attributes/values`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ attribute: attributeName, value: query.trim() }),
            });

            if (res.ok) {
                const newValue = await res.json();
                if (!selectedValues.find(v => v.id === newValue.id)) {
                    onChange([...selectedValues, newValue]);
                }
                setQuery('');
                setShowOptions(false);
            }
        } catch (err) {
            console.error('Failed to add attribute value', err);
        } finally {
            setLoading(false);
        }
    };

    const toggleValue = (val: AttributeValue) => {
        const exists = selectedValues.find(v => v.id === val.id);
        if (exists) {
            onChange(selectedValues.filter(v => v.id !== val.id));
        } else {
            onChange([...selectedValues, val]);
        }
    };

    return (
        <div className="space-y-3">
            <label className="block text-sm font-bold text-gray-700">{attributeName}</label>

            <div className="relative">
                <div className="flex gap-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => {
                                setQuery(e.target.value);
                                setShowOptions(true);
                            }}
                            onFocus={() => setShowOptions(true)}
                            placeholder={`Search or add ${attributeName.toLowerCase()}...`}
                            className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all text-sm"
                        />
                    </div>
                    {query.trim() && !options.find(o => o.value.toLowerCase() === query.toLowerCase().trim()) && (
                        <button
                            type="button"
                            onClick={handleAddValue}
                            className="px-4 py-2 bg-blue-50 text-blue-600 rounded-xl font-bold hover:bg-blue-100 transition-colors flex items-center gap-2 text-sm"
                        >
                            <Plus size={16} /> Add "{query}"
                        </button>
                    )}
                </div>

                {showOptions && (options.length > 0 || loading) && (
                    <div className="absolute z-20 w-full mt-2 bg-white border border-gray-100 shadow-xl rounded-2xl overflow-hidden max-h-60 overflow-y-auto">
                        {loading && <div className="p-4 text-center"><Loader2 className="animate-spin mx-auto text-blue-500" /></div>}
                        {!loading && options.map(opt => (
                            <button
                                key={opt.id}
                                type="button"
                                onClick={() => toggleValue(opt)}
                                className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center justify-between transition-colors border-b border-gray-50 last:border-0"
                            >
                                <span className="text-sm font-medium text-gray-700">{opt.value}</span>
                                {selectedValues.find(v => v.id === opt.id) && <Check size={16} className="text-blue-500" />}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <div className="flex flex-wrap gap-2">
                {selectedValues.map(val => (
                    <span key={val.id} className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-xs font-bold border border-blue-100">
                        {val.value}
                        <button type="button" onClick={() => toggleValue(val)} className="hover:text-blue-900">
                            <X size={14} />
                        </button>
                    </span>
                ))}
            </div>

            {showOptions && (
                <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowOptions(false)}
                />
            )}
        </div>
    );
}
