'use client';

import { create } from 'zustand';

export interface Item {
  id: number;
  productId: number;
  storeId: number;
  quantity: number;
  isBought: boolean;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  product: {
    id: number;
    name: string;
    category: {
      id: number;
      name: string;
    };
    priceHistory: Array<{
      price: number;
      recordedAt: string;
    }>;
  };
  store: {
    id: number;
    name: string;
    code: string;
  };
}

export interface Store {
  id: number;
  name: string;
  code: string;
  _count: {
    items: number;
  };
}

export interface Category {
  id: number;
  name: string;
}

interface ShoppingListStore {
  items: Item[];
  stores: Store[];
  categories: Category[];
  loading: boolean;
  error: string | null;
  
  // Actions
  setItems: (items: Item[]) => void;
  setStores: (stores: Store[]) => void;
  setCategories: (categories: Category[]) => void;
  addItem: (item: Item) => void;
  updateItem: (item: Item) => void;
  deleteItem: (id: number) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  fetchItems: () => Promise<void>;
  fetchStores: () => Promise<void>;
  fetchCategories: () => Promise<void>;
}

export const useShoppingListStore = create<ShoppingListStore>((set) => ({
  items: [],
  stores: [],
  categories: [],
  loading: false,
  error: null,

  setItems: (items) => set({ items }),
  setStores: (stores) => set({ stores }),
  setCategories: (categories) => set({ categories }),
  
  addItem: (item) => set((state) => ({
    items: [item, ...state.items],
  })),
  
  updateItem: (updatedItem) => set((state) => ({
    items: state.items.map((item) =>
      item.id === updatedItem.id ? updatedItem : item
    ),
  })),
  
  deleteItem: (id) => set((state) => ({
    items: state.items.filter((item) => item.id !== id),
  })),
  
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  fetchItems: async () => {
    set({ loading: true, error: null });
    try {
      const response = await fetch('/api/items');
      const data = await response.json();
      if (data.success) {
        set({ items: data.data, loading: false });
      } else {
        set({ error: data.error, loading: false });
      }
    } catch (error) {
      set({ error: 'Failed to fetch items', loading: false });
    }
  },

  fetchStores: async () => {
    try {
      const response = await fetch('/api/stores');
      const data = await response.json();
      if (data.success) {
        set({ stores: data.data });
      }
    } catch (error) {
      console.error('Failed to fetch stores:', error);
    }
  },

  fetchCategories: async () => {
    try {
      const response = await fetch('/api/categories');
      const data = await response.json();
      if (data.success) {
        set({ categories: data.data });
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  },
}));
