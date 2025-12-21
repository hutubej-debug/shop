'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useShoppingListStore } from '@/store/shoppingListStore';
import { useSocket } from '@/hooks/useSocket';
import StoreGroup from './components/StoreGroup';
import AddItemForm from './components/AddItemForm';

export default function HomePage() {
  const { items, stores, categories, fetchItems, fetchStores, fetchCategories, updateItem, deleteItem, addItem } = useShoppingListStore();
  const { socket, isConnected } = useSocket();
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([fetchItems(), fetchStores(), fetchCategories()]);
      setLoading(false);
    };
    loadData();
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on('item:created', (newItem) => addItem(newItem));
    socket.on('item:updated', (updatedItem) => updateItem(updatedItem));
    socket.on('item:deleted', (deletedId) => deleteItem(deletedId));

    return () => {
      socket.off('item:created');
      socket.off('item:updated');
      socket.off('item:deleted');
    };
  }, [socket]);

  const handleUpdateItem = async (id: number, updates: any) => {
    try {
      const response = await fetch(`/api/items/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      const data = await response.json();
      if (!data.success) console.error('Failed to update item:', data.error);
    } catch (error) {
      console.error('Error updating item:', error);
    }
  };

  const handleDeleteItem = async (id: number) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    try {
      const response = await fetch(`/api/items/${id}`, { method: 'DELETE' });
      const data = await response.json();
      if (!data.success) console.error('Failed to delete item:', data.error);
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const itemsByStore = stores.reduce((acc, store) => {
    acc[store.id] = items.filter((item) => item.storeId === store.id);
    return acc;
  }, {} as Record<number, typeof items>);

  const totalItems = items.filter(item => !item.isBought).length;
  const boughtItems = items.filter(item => item.isBought).length;
  const totalPrice = items.reduce((sum, item) => {
    const price = item.product?.priceHistory?.[0]?.price;
    return sum + (price ? Number(price) * item.quantity : 0);
  }, 0);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 spinner rounded-full mx-auto mb-4"></div>
          <p className="text-white/60 text-lg">Loading your shopping list...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 page-transition">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 mb-4 float">
            <span className="text-4xl">🛒</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-3">
            Shopping List
          </h1>
          <p className="text-white/60 text-lg flex items-center justify-center gap-3">
            <span>Organize</span>
            <span className="w-1 h-1 bg-white/40 rounded-full"></span>
            <span>Track</span>
            <span className="w-1 h-1 bg-white/40 rounded-full"></span>
            <span>Sync</span>
            {isConnected && (
              <span className="ml-2 inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <span className="w-2 h-2 bg-emerald-400 rounded-full mr-2 animate-pulse"></span>
                Live
              </span>
            )}
          </p>
        </header>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="glass rounded-2xl p-5 text-center card-hover">
            <div className="text-3xl font-bold text-white mb-1">{totalItems}</div>
            <div className="text-white/50 text-sm font-medium">To Buy</div>
          </div>
          <div className="glass rounded-2xl p-5 text-center card-hover">
            <div className="text-3xl font-bold text-emerald-400 mb-1">{boughtItems}</div>
            <div className="text-white/50 text-sm font-medium">Completed</div>
          </div>
          <div className="glass rounded-2xl p-5 text-center card-hover">
            <div className="text-3xl font-bold text-purple-400 mb-1">{stores.length}</div>
            <div className="text-white/50 text-sm font-medium">Stores</div>
          </div>
          <div className="glass rounded-2xl p-5 text-center card-hover">
            <div className="text-3xl font-bold text-blue-400 mb-1">€{totalPrice.toFixed(2)}</div>
            <div className="text-white/50 text-sm font-medium">Est. Total</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-10">
          <button
            onClick={() => setShowAddForm(true)}
            className="btn-primary inline-flex items-center justify-center px-8 py-4 text-white text-lg font-semibold rounded-xl shadow-lg"
          >
            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Item
          </button>
          <Link
            href="/settings"
            className="btn-secondary inline-flex items-center justify-center px-8 py-4 text-white text-lg font-semibold rounded-xl shadow-lg"
          >
            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Settings
          </Link>
        </div>

        {/* Store Groups */}
        {items.length === 0 ? (
          <div className="glass rounded-3xl p-12 text-center">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-white/10 flex items-center justify-center">
              <span className="text-5xl">📝</span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">
              Your list is empty
            </h3>
            <p className="text-white/60 mb-8 max-w-md mx-auto">
              Start adding items to your shopping list. Organize by store, track prices, and sync in real-time.
            </p>
            <button
              onClick={() => setShowAddForm(true)}
              className="btn-primary px-8 py-3 text-white font-semibold rounded-xl"
            >
              Add Your First Item
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {stores.map((store) => (
              <StoreGroup
                key={store.id}
                storeName={store.name}
                storeCode={store.code}
                items={itemsByStore[store.id] || []}
                onUpdate={handleUpdateItem}
                onDelete={handleDeleteItem}
              />
            ))}
          </div>
        )}

        {/* Footer */}
        <footer className="mt-12 text-center text-white/30 text-sm">
          <p>Made with ❤️ for smarter shopping</p>
        </footer>

        {showAddForm && (
          <AddItemForm
            onClose={() => setShowAddForm(false)}
            onItemAdded={fetchItems}
          />
        )}
      </div>
    </main>
  );
}
