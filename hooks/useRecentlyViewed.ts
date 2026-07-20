import { useState, useEffect, useCallback } from 'react';
import { Product } from '../lib/types';

const STORAGE_KEY = 'shopli_recently_viewed';
const MAX_ITEMS = 10;

interface RecentProduct {
  productId: string;
  title: string;
  price: number;
  currency: string;
  imageUrl: string;
  rating: number;
  volume: number;
  category: string;
  affiliateLink: string;
  discount?: string;
  timestamp: number;
}

export function useRecentlyViewed() {
  const [items, setItems] = useState<RecentProduct[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as RecentProduct[];
        setItems(parsed.filter((p) => p.productId));
      }
    } catch {
      // localStorage not available
    }
  }, []);

  const addToRecentlyViewed = useCallback((product: Product) => {
    setItems((prev) => {
      const filtered = prev.filter((p) => p.productId !== product.productId);
      const updated = [
        {
          productId: product.productId || product.id,
          title: product.title,
          price: product.price,
          currency: product.currency,
          imageUrl: product.imageUrl,
          rating: product.rating,
          volume: product.volume,
          category: product.category || '',
          affiliateLink: product.affiliateLink,
          discount: product.discount,
          timestamp: Date.now(),
        },
        ...filtered,
      ].slice(0, MAX_ITEMS);

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // quota exceeded or unavailable
      }

      return updated;
    });
  }, []);

  return { recentlyViewed: items, addToRecentlyViewed };
}

export function getRecentlyViewed(): RecentProduct[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored).filter((p: any) => p.productId);
    }
  } catch {
    // ignore
  }
  return [];
}