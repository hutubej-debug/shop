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

  const latestPrice = item.product?.priceHistory?.[0]?.price;
  const itemTotal = latestPrice ? Number(latestPrice) * item.quantity : null;

  return (
    <div
      className={`group relative rounded-xl border-2 p-4 transition-all duration-300 ${
        item.isBought
          ? 'bg-emerald-50 border-emerald-200'
          : 'bg-white border-gray-100 hover:border-blue-200 hover:shadow-md'
      }`}
    >
      <div className="flex items-center gap-4">
        {/* Checkbox */}
        <div className="flex-shrink-0">
          <input
            type="checkbox"
            checked={item.isBought}
            onChange={handleToggleBought}
            className="w-6 h-6 rounded-lg cursor-pointer"
          />
        </div>

        {/* Item Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h3
                className={`font-semibold text-gray-900 truncate ${
                  item.isBought ? 'line-through text-gray-400' : ''
                }`}
              >
                {item.product?.name || 'Unknown Product'}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${
                  item.isBought 
                    ? 'bg-gray-100 text-gray-400' 
                    : 'bg-blue-50 text-blue-600'
                }`}>
                  {item.product?.category?.name || 'Uncategorized'}
                </span>
                {latestPrice && (
                  <span className={`text-sm font-medium ${
                    item.isBought ? 'text-gray-400' : 'text-emerald-600'
                  }`}>
                    €{Number(latestPrice).toFixed(2)}
                    {item.quantity > 1 && itemTotal && (
                      <span className="text-gray-400 ml-1">
                        (€{itemTotal.toFixed(2)})
                      </span>
                    )}
                  </span>
                )}
              </div>
              {item.notes && (
                <p className={`text-sm mt-2 ${
                  item.isBought ? 'text-gray-300' : 'text-gray-500'
                }`}>
                  💬 {item.notes}
                </p>
              )}
            </div>

            {/* Quantity & Actions */}
            <div className="flex items-center gap-2 flex-shrink-0">
              {isEditing ? (
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 font-bold transition-colors"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                    className="w-12 h-8 text-center border border-gray-200 rounded-lg text-sm font-medium"
                    autoFocus
                  />
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 font-bold transition-colors"
                  >
                    +
                  </button>
                  <button
                    onClick={handleQuantityChange}
                    className="w-8 h-8 rounded-lg bg-blue-500 hover:bg-blue-600 flex items-center justify-center text-white transition-colors ml-1"
                  >
                    ✓
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className={`h-9 px-4 rounded-lg font-semibold transition-all ${
                    item.isBought
                      ? 'bg-gray-100 text-gray-400'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  {item.quantity}×
                </button>
              )}

              <button
                onClick={() => onDelete(item.id)}
                className="w-9 h-9 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
                title="Delete item"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
