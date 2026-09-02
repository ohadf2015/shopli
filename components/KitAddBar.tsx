import { useState } from 'react';
import Icon from './icons';
import LandedCostBadge from './LandedCostBadge';
import { syncAdd } from '../lib/useWishlist';

export interface KitSku {
  id: string;
  title: string;
  price: number;
  originalPrice?: number | null;
  currency?: string | null;
  imageUrl?: string | null;
  affiliateLink?: string | null;
  rating?: number;
  reviewCount?: number;
  volume?: number;
  discount?: string | null;
  freeShipping?: boolean;
  shopName?: string | null;
}

interface KitAddBarProps {
  region: string;
  rtl: boolean;
  /** ISO currency of kit SKU prices (IL feed = ILS). */
  currency: string;
  skus: KitSku[];
}

/**
 * Kit page add-bar: IL landed-cost rollup vs $75 ptur, then add-kit.
 * Badge first so shoppers see whether the combined order stays duty-free
 * before they dump every SKU into the wishlist.
 */
export default function KitAddBar({ region, rtl, currency, skus }: KitAddBarProps) {
  const [saved, setSaved] = useState(false);
  const kitSkus = (skus || []).filter((s) => s && Number.isFinite(s.price) && s.price > 0);
  if (kitSkus.length === 0) return null;

  const addKit = () => {
    for (const sku of kitSkus) {
      syncAdd({
        id: sku.id,
        title: sku.title,
        price: sku.price,
        originalPrice: sku.originalPrice,
        imageUrl: sku.imageUrl,
        affiliateLink: sku.affiliateLink,
        rating: sku.rating,
        reviewCount: sku.reviewCount,
        volume: sku.volume,
        discount: sku.discount,
        freeShipping: sku.freeShipping,
        shopName: sku.shopName,
      });
    }
    setSaved(true);
  };

  return (
    <div
      className="mt-6 rounded-xl border border-gray-100 bg-white p-4 sm:p-5"
      data-kit-add-bar=""
    >
      {region === 'il' && (
        <LandedCostBadge
          variant="full"
          scope="kit"
          skus={kitSkus.map((s) => ({
            price: s.price,
            currency: s.currency || currency || 'ILS',
            freeShipping: s.freeShipping,
          }))}
        />
      )}
      {saved ? (
        <div className="flex flex-wrap items-center gap-3">
          <span
            className="inline-flex items-center gap-1.5 text-sm font-semibold"
            style={{ color: '#047857' }}
            data-kit-saved=""
          >
            <Icon name="check" size={16} />
            {rtl ? 'הערכה נוספה למועדפים' : 'Kit saved'}
          </span>
          <a
            href={`/${region}/wishlist`}
            className="text-sm font-semibold underline-offset-2 hover:underline"
            style={{ color: 'var(--shopli-orange)' }}
          >
            {rtl ? 'למועדפים' : 'View wishlist'}
          </a>
        </div>
      ) : (
        <button
          type="button"
          onClick={addKit}
          data-kit-sku-count={kitSkus.length}
          className="inline-flex items-center justify-center gap-2 text-sm font-bold px-4 py-2.5 rounded-lg text-white transition-opacity hover:opacity-90"
          style={{ background: 'var(--shopli-orange)' }}
        >
          <Icon name="heart" size={16} />
          {rtl ? 'הוסף ערכה למועדפים' : 'Add kit to wishlist'}
        </button>
      )}
    </div>
  );
}
