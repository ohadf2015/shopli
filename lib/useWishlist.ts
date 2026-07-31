'use client';

import { useState, useEffect, useCallback } from 'react';

/** Minimal product snapshot stored in wishlist — enough to render a card serverlessly. */
export interface WishlistItem {
  id: string;
  title: string;
  price: number;
  originalPrice?: number | null;
  imageUrl?: string | null;
  affiliateLink?: string | null;
  rating?: number;
  reviewCount?: number;
  volume?: number;
  discount?: string | null;
  freeShipping?: boolean;
  shopName?: string | null;
  addedAt: number; // Date.now() when added
}

const STORAGE_KEY = 'shopli_wishlist';

function readWishlist(): WishlistItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as WishlistItem[];
  } catch {
    return [];
  }
}

export function useWishlist() {
  const [items, setItems] = useState<WishlistItem[]>(readWishlist);

  // Sync across tabs and from syncAdd/syncRemove
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) setItems(readWishlist());
    };
    const onCustom = () => setItems(readWishlist());
    window.addEventListener('storage', onStorage);
    window.addEventListener('shopli-wishlist-changed', onCustom);
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('shopli-wishlist-changed', onCustom);
    };
  }, []);

  const save = useCallback((next: WishlistItem[]) => {
    setItems(next);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    }
  }, []);

  const add = useCallback(
    (item: Omit<WishlistItem, 'addedAt'>) => {
      const current = readWishlist();
      if (current.some((i) => i.id === item.id)) return; // already saved
      save([...current, { ...item, addedAt: Date.now() }]);
    },
    [save],
  );

  const remove = useCallback(
    (id: string) => {
      save(readWishlist().filter((i) => i.id !== id));
    },
    [save],
  );

  const toggle = useCallback(
    (item: Omit<WishlistItem, 'addedAt'>) => {
      const current = readWishlist();
      const existing = current.find((i) => i.id === item.id);
      if (existing) {
        save(current.filter((i) => i.id !== item.id));
      } else {
        save([...current, { ...item, addedAt: Date.now() }]);
      }
    },
    [save],
  );

  const isSaved = useCallback((id: string) => readWishlist().some((i) => i.id === id), []);

  return {
    items,        // WishlistItem[], newest-first
    count: items.length,
    add,
    remove,
    toggle,
    isSaved,
  };
}

/** Pure helper — no hook. Use outside React for SSR-safe reads. */
export function getWishlistSnapshot(): WishlistItem[] {
  return readWishlist();
}

/** Synchronous add — for use outside React hooks (e.g., event handlers). */
export function syncAdd(item: Omit<WishlistItem, 'addedAt'>): void {
  const current = readWishlist();
  if (current.some((i) => i.id === item.id)) return;
  const next = [...current, { ...item, addedAt: Date.now() }];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  window.dispatchEvent(new Event('shopli-wishlist-changed'));
}

/** Synchronous remove — for use outside React hooks. */
export function syncRemove(id: string): void {
  const current = readWishlist();
  const next = current.filter((i) => i.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  window.dispatchEvent(new Event('shopli-wishlist-changed'));
}

/** Pure helper — check without hook. */
export function isInWishlist(id: string): boolean {
  return readWishlist().some((i) => i.id === id);
}