'use client';

import { Item } from '@/store/shoppingListStore';
import { useState } from 'react';

interface ItemCardProps {
  item: Item;
  onUpdate: (id: number, updates: Partial<Item>) => void;
  onDelete: (id: number) => void;
}

export default function ItemCard({ item, onUpdate, onDelete }: ItemCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [quantity, setQuantity] = useState(item.quantity);

  const handleToggleBought = async () => {
    onUpdate(item.id, { isBought: !item.isBought });
  };

  const handleQuantityChange = async () => {
    if (quantity !== item.quantity) {
      onUpdate(item.id, { quantity });
      setIsEditing(false);
    }
  };

  const latestPrice = item.product.priceHistory?.[0]?.price;

  return (
    <div
      className={`bg-white rounded-lg shadow-sm border-2 p-4 transition-all ${
        item.isBought
          ? 'border-green-300 bg-green-50 opacity-75'
          : 'border-gray-200 hover:shadow-md'
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          {/* Checkbox */}
          <input
            type="checkbox"
            checked={item.isBought}
            onChange={handleToggleBought}
            className="mt-1 h-5 w-5 rounded border-gray-300 text-green-600 focus:ring-green-500 cursor-pointer"
          />

          {/* Item Details */}
          <div className="flex-1">
            <h3
              className={`font-semibold text-gray-900 ${
                item.isBought ? 'line-through text-gray-500' : ''
              }`}
            >
              {item.product.name}
            </h3>
            <p className="text-sm text-gray-500">{item.product.category.name}</p>
            
            {latestPrice && (
              <p className="text-sm font-medium text-blue-600 mt-1">
                €{Number(latestPrice).toFixed(2)}
              </p>
            )}

            {item.notes && (
              <p className="text-sm text-gray-600 mt-2 italic">{item.notes}</p>
            )}
          </div>
        </div>

        {/* Quantity and Actions */}
        <div className="flex items-center space-x-2 ml-4">
          {isEditing ? (
            <div className="flex items-center space-x-1">
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                className="w-16 px-2 py-1 border border-gray-300 rounded text-center"
                autoFocus
              />
              <button
                onClick={handleQuantityChange}
                className="px-2 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
              >
                ✓
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 font-medium"
            >
              {item.quantity}x
            </button>
          )}

          <button
            onClick={() => onDelete(item.id)}
            className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
            title="Delete item"
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  );
}
