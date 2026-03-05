'use client';

import { useEffect, useState, useRef } from 'react';
import { useCurrencyStore } from '@/store/useCurrencyStore';
import { ChevronDown, Loader2 } from 'lucide-react';
import { useClickOutside } from '@/hooks/useClickOutside';

export default function CurrencySelector() {
    const { currency, setCurrency, fetchRates, isLoading } = useCurrencyStore();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useClickOutside<HTMLDivElement>(() => setIsOpen(false));

    useEffect(() => {
        // Fetch real-time rates when component mounts
        fetchRates();
    }, [fetchRates]);

    const currencies = [
        { code: 'USD', label: 'US Dollar', symbol: '$' },
        { code: 'SAR', label: 'Saudi Riyal', symbol: 'SAR' },
        { code: 'PKR', label: 'Pakistani Rupee', symbol: 'Rs' }
    ] as const;

    const activeCurrency = currencies.find(c => c.code === currency) || currencies[0];

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center space-x-1.5 text-[11px] font-bold text-gray-500 hover:text-black uppercase tracking-widest transition-colors py-1 px-2 rounded hover:bg-gray-50"
            >
                <span>{activeCurrency.code}</span>
                {isLoading ? (
                    <Loader2 size={12} className="animate-spin text-emerald-500" />
                ) : (
                    <ChevronDown size={12} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 top-full mt-1 w-40 bg-white border border-gray-100 shadow-xl rounded-xl overflow-hidden z-[100] animate-in fade-in zoom-in duration-200">
                    <div className="py-2">
                        {currencies.map((c) => (
                            <button
                                key={c.code}
                                onClick={() => {
                                    setCurrency(c.code as any);
                                    setIsOpen(false);
                                }}
                                className={`w-full text-left px-4 py-2 text-[12px] font-bold tracking-wider uppercase transition-colors flex items-center justify-between
                  ${currency === c.code
                                        ? 'bg-emerald-50 text-emerald-700'
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-black'}`}
                            >
                                <div className="flex items-center space-x-2">
                                    <span className="text-gray-400 w-6 font-medium">{c.symbol}</span>
                                    <span>{c.code}</span>
                                </div>
                                {currency === c.code && (
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                                )}
                            </button>
                        ))}
                    </div>
                    <div className="px-4 py-2 border-t border-gray-50 bg-gray-50/50">
                        <p className="text-[9px] text-gray-400 text-center uppercase font-black tracking-widest leading-tight">
                            Real-time Exchange Rates
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
