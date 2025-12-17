import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '@/types';

export interface CartItem extends Product {
    quantity: number;
}

interface CartState {
    items: CartItem[];
    isOpen: boolean;
    addItem: (product: Product, quantity?: number) => void;
    removeItem: (productId: string) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    clearCart: () => void;
    toggleCart: () => void;
    total: () => number;
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],
            isOpen: false,
            addItem: (product, quantity = 1) => {
                const currentItems = get().items;
                const existingItem = currentItems.find(item => item.$id === product.$id);

                if (existingItem) {
                    set({
                        items: currentItems.map(item =>
                            item.$id === product.$id
                                ? { ...item, quantity: item.quantity + quantity }
                                : item
                        ),
                        isOpen: true // Open cart when adding
                    });
                } else {
                    set({
                        items: [...currentItems, { ...product, quantity }],
                        isOpen: true
                    });
                }
            },
            removeItem: (productId) => {
                set({
                    items: get().items.filter(item => item.$id !== productId)
                });
            },
            updateQuantity: (productId, quantity) => {
                if (quantity <= 0) {
                    get().removeItem(productId);
                    return;
                }
                set({
                    items: get().items.map(item =>
                        item.$id === productId ? { ...item, quantity } : item
                    )
                });
            },
            clearCart: () => set({ items: [] }),
            toggleCart: () => set({ isOpen: !get().isOpen }),
            total: () => {
                return get().items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
            }
        }),
        {
            name: 'cart-storage',
            storage: {
                getItem: (name) => {
                    const str = sessionStorage.getItem(name);
                    return str ? JSON.parse(str) : null;
                },
                setItem: (name, value) => {
                    sessionStorage.setItem(name, JSON.stringify(value));
                },
                removeItem: (name) => sessionStorage.removeItem(name),
            },
        }
    )
);
