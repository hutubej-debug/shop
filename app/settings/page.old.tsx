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
  
  // Store form
  const [newStoreName, setNewStoreName] = useState('');
  const [newStoreCode, setNewStoreCode] = useState('');
  const [storeError, setStoreError] = useState('');
  const [storeSuccess, setStoreSuccess] = useState('');
  
  // Category form
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
    if (!confirm(`Are you sure you want to delete "${name}"? This will also delete all items from this store.`)) {
      return;
    }

    try {
      const response = await fetch(`/api/stores?id=${id}`, { method: 'DELETE' });
      const data = await response.json();

      if (data.success) {
        fetchData();
      } else {
        setStoreError(data.error);
      }
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
    if (!confirm(`Are you sure you want to delete "${name}"? This will also delete all products in this category.`)) {
      return;
    }

    try {
      const response = await fetch(`/api/categories?id=${id}`, { method: 'DELETE' });
      const data = await response.json();

      if (data.success) {
        fetchData();
      } else {
        setCategoryError(data.error);
      }
    } catch (error) {
      setCategoryError('Failed to delete category');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">⚙️ Settings</h1>
            <p className="text-gray-600 mt-1">Manage stores and categories</p>
          </div>
          <Link
            href="/"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            ← Back to List
          </Link>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Stores Section */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              🏪 Stores
            </h2>

            {/* Add Store Form */}
            <form onSubmit={handleAddStore} className="mb-6 space-y-3">
              <div>
                <input
                  type="text"
                  placeholder="Store name (e.g., Rewe)"
                  value={newStoreName}
                  onChange={(e) => setNewStoreName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Code (e.g., REWE)"
                  value={newStoreCode}
                  onChange={(e) => setNewStoreCode(e.target.value.toUpperCase())}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  maxLength={20}
                />
              </div>
              <button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-medium transition-colors"
              >
                + Add Store
              </button>
              {storeError && (
                <p className="text-red-600 text-sm">{storeError}</p>
              )}
              {storeSuccess && (
                <p className="text-green-600 text-sm">{storeSuccess}</p>
              )}
            </form>

            {/* Store List */}
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {stores.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No stores yet</p>
              ) : (
                stores.map((store) => (
                  <div
                    key={store.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div>
                      <span className="font-medium text-gray-900">{store.name}</span>
                      <span className="ml-2 text-xs text-gray-500 bg-gray-200 px-2 py-0.5 rounded">
                        {store.code}
                      </span>
                      {store._count && (
                        <span className="ml-2 text-xs text-gray-400">
                          ({store._count.items} items)
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => handleDeleteStore(store.id, store.name)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 rounded transition-colors"
                      title="Delete store"
                    >
                      🗑️
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Categories Section */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              📁 Categories
            </h2>

            {/* Add Category Form */}
            <form onSubmit={handleAddCategory} className="mb-6 space-y-3">
              <div>
                <input
                  type="text"
                  placeholder="Category name (e.g., Dairy)"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-medium transition-colors"
              >
                + Add Category
              </button>
              {categoryError && (
                <p className="text-red-600 text-sm">{categoryError}</p>
              )}
              {categorySuccess && (
                <p className="text-green-600 text-sm">{categorySuccess}</p>
              )}
            </form>

            {/* Category List */}
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {categories.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No categories yet</p>
              ) : (
                categories.map((category) => (
                  <div
                    key={category.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div>
                      <span className="font-medium text-gray-900">{category.name}</span>
                      {category._count && (
                        <span className="ml-2 text-xs text-gray-400">
                          ({category._count.products} products)
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => handleDeleteCategory(category.id, category.name)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 rounded transition-colors"
                      title="Delete category"
                    >
                      🗑️
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
