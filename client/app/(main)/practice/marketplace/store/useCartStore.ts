import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartItem {
    id: number;
    productId: number;
    name: string;
    price: number;
    quantity: number;
    image?: string;
    type: 'product' | 'service';
}

interface CartStore {
    items: CartItem[];
    addItem: (item: CartItem) => void;
    removeItem: (id: number) => void;
    updateQuantity: (id: number, quantity: number) => void;
    clearCart: () => void;
    total: () => number;
}

export const useCartStore = create<CartStore>()(
    persist(
        (set, get) => ({
            items: [],
            addItem: (item) => {
                const items = get().items;
                const existing = items.find((i) => i.productId === item.productId && i.type === item.type);
                if (existing) {
                    set({
                        items: items.map((i) =>
                            i.productId === item.productId && i.type === item.type
                                ? { ...i, quantity: i.quantity + item.quantity }
                                : i
                        ),
                    });
                } else {
                    set({ items: [...items, item] });
                }
            },
            removeItem: (id) => set({ items: get().items.filter((i) => i.id !== id) }),
            updateQuantity: (id, quantity) =>
                set({
                    items: get().items.map((i) => (i.id === id ? { ...i, quantity } : i)),
                }),
            clearCart: () => set({ items: [] }),
            total: () => get().items.reduce((acc, item) => acc + item.price * item.quantity, 0),
        }),
        {
            name: 'marketplace-cart',
        }
    )
);
