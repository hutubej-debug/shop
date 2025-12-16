'use client';

import { Item } from '@/store/shoppingListStore';
import ItemCard from './ItemCard';

interface StoreGroupProps {
  storeName: string;
  storeCode: string;
  items: Item[];
  onUpdate: (id: number, updates: Partial<Item>) => void;
  onDelete: (id: number) => void;
}

const storeColors: Record<string, string> = {
  REWE: 'bg-red-500',
  ALDI: 'bg-blue-500',
  LIDL: 'bg-yellow-500',
  PENNY: 'bg-orange-500',
  DM: 'bg-pink-500',
  KARADAG: 'bg-purple-500',
};

export default function StoreGroup({
  storeName,
  storeCode,
  items,
  onUpdate,
  onDelete,
}: StoreGroupProps) {
  if (items.length === 0) return null;

  const activeItems = items.filter((item) => !item.isBought);
  const boughtItems = items.filter((item) => item.isBought);

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Store Header */}
      <div
        className={`${
          storeColors[storeCode] || 'bg-gray-500'
        } text-white px-6 py-4`}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">{storeName}</h2>
          <div className="flex items-center space-x-4">
            <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
              {activeItems.length} active
            </span>
            {boughtItems.length > 0 && (
              <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                {boughtItems.length} bought
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Items List */}
      <div className="p-6">
        <div className="space-y-3">
          {/* Active Items */}
          {activeItems.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              onUpdate={onUpdate}
              onDelete={onDelete}
            />
          ))}

          {/* Bought Items */}
          {boughtItems.length > 0 && (
            <>
              <div className="border-t border-gray-200 my-4"></div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">
                Completed
              </h3>
              {boughtItems.map((item) => (
                <ItemCard
                  key={item.id}
                  item={item}
                  onUpdate={onUpdate}
                  onDelete={onDelete}
                />
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
