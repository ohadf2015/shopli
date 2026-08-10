import React, { useEffect, useState } from 'react';
import Icon from './icons';
import { trackShareClick, SharePageType, ShareNetwork } from '../lib/analytics';

interface ShareBarProps {
  /** Page/product title used in the shared message */
  title: string;
  /** Absolute URL to share */
  url: string;
  /** Optional extra line in the shared message */
  description?: string;
  /** Which surface the bar sits on — reported as page_type in share_click */
  pageType: SharePageType;
  /** Region code, reported in share_click */
  region?: string;
  /** Button-label locale */
  locale?: string;
  /** RTL layout (labels only — flexbox handles direction) */
  rtl?: boolean;
  /** Size variant */
  size?: 'sm' | 'md';
  className?: string;
}

// Short labels — the full CTA ("שתפו בוואטסאפ") lives in the surrounding copy.
const LABELS: Record<string, { whatsapp: string; telegram: string; native: string }> = {
  he: { whatsapp: 'וואטסאפ', telegram: 'טלגרם', native: 'שיתוף' },
  en: { whatsapp: 'WhatsApp', telegram: 'Telegram', native: 'Share' },
  fr: { whatsapp: 'WhatsApp', telegram: 'Telegram', native: 'Partager' },
  de: { whatsapp: 'WhatsApp', telegram: 'Telegram', native: 'Teilen' },
  es: { whatsapp: 'WhatsApp', telegram: 'Telegram', native: 'Compartir' },
  it: { whatsapp: 'WhatsApp', telegram: 'Telegram', native: 'Condividi' },
  ru: { whatsapp: 'WhatsApp', telegram: 'Telegram', native: 'Поделиться' },
};

const WA_ICON = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

/**
 * WhatsApp + Telegram + native-share bar. Icon-only on screens ≤480px
 * (same responsive rule as the feedback widget). Every tap fires the
 * PostHog `share_click { page_type, network, region }` event.
 */
export default function ShareBar({
  title,
  url,
  description,
  pageType,
  region,
  locale = 'en',
  size = 'sm',
  className = '',
}: ShareBarProps) {
  const labels = LABELS[locale] || LABELS.en;
  const [canNativeShare, setCanNativeShare] = useState(false);

  useEffect(() => {
    try {
      setCanNativeShare(typeof navigator !== 'undefined' && typeof (navigator as any).share === 'function');
    } catch {
      /* never let feature detection break the bar */
    }
  }, []);

  const text = description ? `${title} — ${description}\n\n${url}` : `${title}\n\n${url}`;
  const waUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
  const tgUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;

  const sizeClasses = size === 'sm' ? 'text-xs px-3 py-1.5 gap-1.5' : 'text-sm px-4 py-2 gap-2';
  const base =
    'inline-flex items-center rounded-full font-medium transition-all duration-200 hover:scale-105 active:scale-95';

  const track = (network: ShareNetwork) => {
    trackShareClick({ page_type: pageType, network, region });
  };

  const onNativeShare = async () => {
    track('native');
    try {
      await (navigator as any).share({ title, text: description ? `${title} — ${description}` : title, url });
    } catch {
      /* user dismissed the sheet — not an error */
    }
  };

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`} role="group" aria-label={labels.native}>
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={labels.whatsapp}
        className={`${base} ${sizeClasses}`}
        style={{ backgroundColor: '#25D366', color: '#fff' }}
        onClick={() => track('whatsapp')}
      >
        {WA_ICON}
        <span className="max-[480px]:hidden">{labels.whatsapp}</span>
      </a>
      <a
        href={tgUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={labels.telegram}
        className={`${base} ${sizeClasses}`}
        style={{ backgroundColor: '#229ED9', color: '#fff' }}
        onClick={() => track('telegram')}
      >
        <Icon name="telegram" size={16} />
        <span className="max-[480px]:hidden">{labels.telegram}</span>
      </a>
      {canNativeShare && (
        <button
          type="button"
          aria-label={labels.native}
          className={`${base} ${sizeClasses} border border-gray-200 bg-white`}
          style={{ color: 'var(--shopli-navy)' }}
          onClick={onNativeShare}
        >
          <Icon name="share" size={16} />
          <span className="max-[480px]:hidden">{labels.native}</span>
        </button>
      )}
    </div>
  );
}
