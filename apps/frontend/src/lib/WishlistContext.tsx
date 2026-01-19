'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define the shape of a product in the wishlist
// This should match the Product interface in your services/components
export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    image: string | null;
    category?: string;
}

interface WishlistContextType {
    items: Product[];
    addToWishlist: (product: Product) => void;
    removeFromWishlist: (productId: number) => void;
    isInWishlist: (productId: number) => boolean;
    toggleWishlist: (product: Product) => void;
    clearWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<Product[]>([]);
    const [isInitialized, setIsInitialized] = useState(false);

    // Load from local storage on mount
    useEffect(() => {
        const saved = localStorage.getItem('wishlist_items');
        if (saved) {
            try {
                setItems(JSON.parse(saved));
            } catch (e) {
                console.error('Failed to parse wishlist from local storage', e);
            }
        }
        setIsInitialized(true);
    }, []);

    // Save to local storage whenever items change
    useEffect(() => {
        if (isInitialized) {
            localStorage.setItem('wishlist_items', JSON.stringify(items));
        }
    }, [items, isInitialized]);

    const addToWishlist = (product: Product) => {
        setItems((prev) => {
            if (prev.some((p) => p.id === product.id)) return prev;
            return [...prev, product];
        });
    };

    const removeFromWishlist = (productId: number) => {
        setItems((prev) => prev.filter((p) => p.id !== productId));
    };

    const isInWishlist = (productId: number) => {
        return items.some((p) => p.id === productId);
    };

    const toggleWishlist = (product: Product) => {
        if (isInWishlist(product.id)) {
            removeFromWishlist(product.id);
        } else {
            addToWishlist(product);
        }
    };

    const clearWishlist = () => {
        setItems([]);
    };

    return (
        <WishlistContext.Provider
            value={{
                items,
                addToWishlist,
                removeFromWishlist,
                isInWishlist,
                toggleWishlist,
                clearWishlist,
            }}
        >
            {children}
        </WishlistContext.Provider>
    );
}

export function useWishlist() {
    const context = useContext(WishlistContext);
    if (context === undefined) {
        throw new Error('useWishlist must be used within a WishlistProvider');
    }
    return context;
}
