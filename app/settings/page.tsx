'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Store {
  id: number;
  name: string;
  code: string;
  _count?: { items: number };
}

interface Category {
  id: number;
  name: string;
  _count?: { products: number };
}

export default function SettingsPage() {
  const [stores, setStores] = useState<Store[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'stores' | 'categories'>('stores');
  
  const [newStoreName, setNewStoreName] = useState('');
  const [newStoreCode, setNewStoreCode] = useState('');
  const [storeError, setStoreError] = useState('');
  const [storeSuccess, setStoreSuccess] = useState('');
  
  const [newCategoryName, setNewCategoryName] = useState('');
  const [categoryError, setCategoryError] = useState('');
  const [categorySuccess, setCategorySuccess] = useState('');

  const fetchData = async () => {
    try {
      const [storesRes, categoriesRes] = await Promise.all([
        fetch('/api/stores'),
        fetch('/api/categories'),
      ]);
      const storesData = await storesRes.json();
      const categoriesData = await categoriesRes.json();
      
      if (storesData.success) setStores(storesData.data);
      if (categoriesData.success) setCategories(categoriesData.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddStore = async (e: React.FormEvent) => {
    e.preventDefault();
    setStoreError('');
    setStoreSuccess('');

    if (!newStoreName.trim() || !newStoreCode.trim()) {
      setStoreError('Name and code are required');
      return;
    }

    try {
      const response = await fetch('/api/stores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newStoreName, code: newStoreCode }),
      });
      const data = await response.json();

      if (data.success) {
        setStoreSuccess('Store added successfully!');
        setNewStoreName('');
        setNewStoreCode('');
        fetchData();
        setTimeout(() => setStoreSuccess(''), 3000);
      } else {
        setStoreError(data.error);
      }
    } catch (error) {
      setStoreError('Failed to add store');
    }
  };

  const handleDeleteStore = async (id: number, name: string) => {
    if (!confirm(`Delete "${name}"? This will also delete all items from this store.`)) return;

    try {
      const response = await fetch(`/api/stores?id=${id}`, { method: 'DELETE' });
      const data = await response.json();
      if (data.success) fetchData();
      else setStoreError(data.error);
    } catch (error) {
      setStoreError('Failed to delete store');
    }
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setCategoryError('');
    setCategorySuccess('');

    if (!newCategoryName.trim()) {
      setCategoryError('Name is required');
      return;
    }

    try {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newCategoryName }),
      });
      const data = await response.json();

      if (data.success) {
        setCategorySuccess('Category added successfully!');
        setNewCategoryName('');
        fetchData();
        setTimeout(() => setCategorySuccess(''), 3000);
      } else {
        setCategoryError(data.error);
      }
    } catch (error) {
      setCategoryError('Failed to add category');
    }
  };

  const handleDeleteCategory = async (id: number, name: string) => {
    if (!confirm(`Delete "${name}"? This will also delete all products in this category.`)) return;

    try {
      const response = await fetch(`/api/categories?id=${id}`, { method: 'DELETE' });
      const data = await response.json();
      if (data.success) fetchData();
      else setCategoryError(data.error);
    } catch (error) {
      setCategoryError('Failed to delete category');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 spinner rounded-full mx-auto mb-4"></div>
          <p className="text-white/60 text-lg">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 page-transition">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Settings</h1>
              <p className="text-white/60">Manage stores and categories</p>
            </div>
          </div>
          <Link
            href="/"
            className="flex items-center gap-2 px-5 py-3 glass text-white rounded-xl hover:bg-white/10 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back
          </Link>
        </header>

        {/* Tabs */}
        <div className="glass rounded-2xl p-2 mb-8 flex">
          <button
            onClick={() => setActiveTab('stores')}
            className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all ${
              activeTab === 'stores'
                ? 'bg-white text-gray-900 shadow-lg'
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            <span className="flex items-center justify-center gap-2">
              <span>🏪</span> Stores ({stores.length})
            </span>
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all ${
              activeTab === 'categories'
                ? 'bg-white text-gray-900 shadow-lg'
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            <span className="flex items-center justify-center gap-2">
              <span>📁</span> Categories ({categories.length})
            </span>
          </button>
        </div>

        {/* Stores Tab */}
        {activeTab === 'stores' && (
          <div className="space-y-6 page-transition">
            {/* Add Store Form */}
            <div className="glass-card rounded-2xl p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">+</span>
                Add New Store
              </h2>
              <form onSubmit={handleAddStore} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Store Name</label>
                    <input
                      type="text"
                      placeholder="e.g., Rewe"
                      value={newStoreName}
                      onChange={(e) => setNewStoreName(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Store Code</label>
                    <input
                      type="text"
                      placeholder="e.g., REWE"
                      value={newStoreCode}
                      onChange={(e) => setNewStoreCode(e.target.value.toUpperCase())}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 uppercase"
                      maxLength={20}
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full btn-primary py-3 text-white font-semibold rounded-xl"
                >
                  Add Store
                </button>
                {storeError && (
                  <div className="bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm">{storeError}</div>
                )}
                {storeSuccess && (
                  <div className="bg-emerald-50 text-emerald-600 px-4 py-2 rounded-lg text-sm">{storeSuccess}</div>
                )}
              </form>
            </div>

            {/* Store List */}
            <div className="glass-card rounded-2xl overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100">
                <h2 className="font-bold text-gray-900">Your Stores</h2>
              </div>
              <div className="divide-y divide-gray-100">
                {stores.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    <span className="text-4xl mb-2 block">🏪</span>
                    No stores yet. Add your first store above.
                  </div>
                ) : (
                  stores.map((store) => (
                    <div key={store.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                          {store.code.substring(0, 2)}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{store.name}</h3>
                          <p className="text-sm text-gray-500">
                            {store._count?.items || 0} items • Code: {store.code}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteStore(store.id, store.name)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* Categories Tab */}
        {activeTab === 'categories' && (
          <div className="space-y-6 page-transition">
            {/* Add Category Form */}
            <div className="glass-card rounded-2xl p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600">+</span>
                Add New Category
              </h2>
              <form onSubmit={handleAddCategory} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category Name</label>
                  <input
                    type="text"
                    placeholder="e.g., Dairy, Vegetables, Snacks"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full btn-secondary py-3 text-white font-semibold rounded-xl"
                >
                  Add Category
                </button>
                {categoryError && (
                  <div className="bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm">{categoryError}</div>
                )}
                {categorySuccess && (
                  <div className="bg-emerald-50 text-emerald-600 px-4 py-2 rounded-lg text-sm">{categorySuccess}</div>
                )}
              </form>
            </div>

            {/* Category List */}
            <div className="glass-card rounded-2xl overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100">
                <h2 className="font-bold text-gray-900">Your Categories</h2>
              </div>
              <div className="divide-y divide-gray-100">
                {categories.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    <span className="text-4xl mb-2 block">📁</span>
                    No categories yet. Add your first category above.
                  </div>
                ) : (
                  categories.map((category) => (
                    <div key={category.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white">
                          📁
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{category.name}</h3>
                          <p className="text-sm text-gray-500">
                            {category._count?.products || 0} products
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteCategory(category.id, category.name)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
