import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Currency = 'USD' | 'SAR' | 'PKR';

interface CurrencyRates {
    USD: number;
    SAR: number;
    PKR: number;
}

interface CurrencyState {
    currency: Currency;
    rates: CurrencyRates;
    isLoading: boolean;
    error: string | null;
    setCurrency: (currency: Currency) => void;
    fetchRates: () => Promise<void>;
}

const DEFAULT_RATES: CurrencyRates = {
    USD: 1,
    SAR: 3.75, // Fallback/default rate
    PKR: 278,  // Fallback/default rate
};

export const useCurrencyStore = create<CurrencyState>()(
    persist(
        (set, get) => ({
            currency: 'USD',
            rates: DEFAULT_RATES,
            isLoading: false,
            error: null,
            setCurrency: (currency) => set({ currency }),
            fetchRates: async () => {
                try {
                    set({ isLoading: true, error: null });
                    const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
                    const data = await response.json();

                    if (data && data.rates) {
                        set({
                            rates: {
                                USD: 1,
                                SAR: data.rates.SAR || DEFAULT_RATES.SAR,
                                PKR: data.rates.PKR || DEFAULT_RATES.PKR,
                            },
                            isLoading: false
                        });
                    }
                } catch (error) {
                    console.error('Failed to fetch exchange rates:', error);
                    set({
                        isLoading: false,
                        error: 'Failed to fetch latest rates, using fallback.'
                    });
                }
            },
        }),
        {
            name: 'currency-storage',
        }
    )
);

// Helper hook to easily format prices across the app
export const usePriceFormatter = () => {
    const { currency, rates } = useCurrencyStore();

    const formatPrice = (amount: number, forceCurrency?: Currency) => {
        const activeCurrency = forceCurrency || currency;
        const rate = rates[activeCurrency] || 1;
        const convertedAmount = amount * rate;

        // Formatting based on currency
        if (activeCurrency === 'USD') {
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 2,
            }).format(convertedAmount);
        } else if (activeCurrency === 'SAR') {
            // Custom format for SAR
            return `${new Intl.NumberFormat('en-SA', {
                minimumFractionDigits: 2,
            }).format(convertedAmount)} SAR`;
        } else if (activeCurrency === 'PKR') {
            // Custom format for PKR (Rs.)
            return `Rs. ${new Intl.NumberFormat('en-PK', {
                minimumFractionDigits: 0,
            }).format(convertedAmount)}`;
        }

        return `$${convertedAmount.toFixed(2)}`; // fallback
    };

    return { formatPrice };
};
