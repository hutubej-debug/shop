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

const storeGradients: Record<string, string> = {
  REWE: 'store-rewe',
  ALDI: 'store-aldi',
  LIDL: 'store-lidl',
  PENNY: 'store-penny',
  DM: 'store-dm',
  KARADAG: 'store-karadag',
};

const storeIcons: Record<string, string> = {
  REWE: '🏪',
  ALDI: '🛍️',
  LIDL: '🏬',
  PENNY: '💰',
  DM: '💄',
  KARADAG: '🥙',
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
  const storeTotal = items.reduce((sum, item) => {
    const price = item.product?.priceHistory?.[0]?.price;
    return sum + (price ? Number(price) * item.quantity : 0);
  }, 0);

  return (
    <div className="glass-card rounded-2xl overflow-hidden card-hover">
      {/* Store Header */}
      <div className={`${storeGradients[storeCode] || 'store-default'} px-6 py-5`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{storeIcons[storeCode] || '🏪'}</span>
            <div>
              <h2 className="text-xl font-bold text-white">{storeName}</h2>
              {storeTotal > 0 && (
                <p className="text-white/80 text-sm">Est. €{storeTotal.toFixed(2)}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {activeItems.length > 0 && (
              <span className="bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm font-medium text-white">
                {activeItems.length} to buy
              </span>
            )}
            {boughtItems.length > 0 && (
              <span className="bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm font-medium text-white/80">
                {boughtItems.length} done
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Items List */}
      <div className="p-5">
        <div className="space-y-3">
          {activeItems.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              onUpdate={onUpdate}
              onDelete={onDelete}
            />
          ))}

          {boughtItems.length > 0 && (
            <>
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="px-3 bg-white text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Completed ({boughtItems.length})
                  </span>
                </div>
              </div>
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
