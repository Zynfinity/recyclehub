import { create } from "zustand";

// Zustand store to manage only selected items for checkout
export const useCartStore = create((set) => ({
    selectedItemsForCheckout: [],  // Store the selected items with product info for checkout

    // Set selected items for checkout (with product info)
    setSelectedItemsForCheckout: (items) => set(() => ({ selectedItemsForCheckout: items }))
}));
