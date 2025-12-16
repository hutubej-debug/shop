'use client';

import { useEffect, useState } from 'react';
import { useShoppingListStore } from '@/store/shoppingListStore';
import { useSocket } from '@/hooks/useSocket';
import StoreGroup from './components/StoreGroup';
import AddItemForm from './components/AddItemForm';

export default function HomePage() {
  const { items, stores, categories, fetchItems, fetchStores, fetchCategories, updateItem, deleteItem, addItem } = useShoppingListStore();
  const { socket, isConnected } = useSocket();
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(true);

  // Initial data fetch
  useEffect(() => {
    const loadData = async () => {
      await Promise.all([fetchItems(), fetchStores(), fetchCategories()]);
      setLoading(false);
    };
    loadData();
  }, []);

  // Socket.IO real-time updates
  useEffect(() => {
    if (!socket) return;

    socket.on('item:created', (newItem) => {
      console.log('Item created:', newItem);
      addItem(newItem);
    });

    socket.on('item:updated', (updatedItem) => {
      console.log('Item updated:', updatedItem);
      updateItem(updatedItem);
    });

    socket.on('item:deleted', (deletedId) => {
      console.log('Item deleted:', deletedId);
      deleteItem(deletedId);
    });

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
      if (!data.success) {
        console.error('Failed to update item:', data.error);
      }
    } catch (error) {
      console.error('Error updating item:', error);
    }
  };

  const handleDeleteItem = async (id: number) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    
    try {
      const response = await fetch(`/api/items/${id}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (!data.success) {
        console.error('Failed to delete item:', data.error);
      }
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  // Group items by store
  const itemsByStore = stores.reduce((acc, store) => {
    acc[store.id] = items.filter((item) => item.storeId === store.id);
    return acc;
  }, {} as Record<number, typeof items>);

  const totalItems = items.filter(item => !item.isBought).length;
  const boughtItems = items.filter(item => item.isBought).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading shopping list...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            🛒 Shopping List Manager
          </h1>
          <p className="text-lg text-gray-600">
            Organize by store • Track prices • Real-time sync
            {isConnected && (
              <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                <span className="w-2 h-2 bg-green-600 rounded-full mr-1 animate-pulse"></span>
                Live
              </span>
            )}
          </p>
        </div>

        {/* Stats */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600">{totalItems}</p>
              <p className="text-gray-600">Active Items</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">{boughtItems}</p>
              <p className="text-gray-600">Completed</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-purple-600">{stores.length}</p>
              <p className="text-gray-600">Stores</p>
            </div>
          </div>
        </div>

        {/* Add Item Button */}
        <div className="mb-8 text-center">
          <button
            onClick={() => setShowAddForm(true)}
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white text-lg font-semibold rounded-lg shadow-lg hover:bg-blue-700 transition-all transform hover:scale-105"
          >
            <span className="text-2xl mr-2">+</span>
            Add New Item
          </button>
        </div>

        {/* Store Groups */}
        {items.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">
              Your shopping list is empty
            </h3>
            <p className="text-gray-600 mb-6">
              Start by adding items to your list
            </p>
            <button
              onClick={() => setShowAddForm(true)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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

        {/* Add Item Modal */}
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
