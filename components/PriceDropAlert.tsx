import { useState } from 'react';
import { trackConversion } from '../lib/analytics';

const EMAIL_KEY = 'shopli_alert_email';

function savedEmail(): string {
  try { return localStorage.getItem(EMAIL_KEY) || ''; } catch { return ''; }
}

/** "Tell me when this drops" for one product, fed into the daily price-drop email. */
export default function PriceDropAlert({ productId, region, rtl, placement }: {
  productId: string;
  region: string;
  rtl: boolean;
  placement: string;
}) {
  const [state, setState] = useState<'idle' | 'asking' | 'saving' | 'done' | 'error'>('idle');
  const [email, setEmail] = useState('');

  const save = async (address: string) => {
    setState('saving');
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: address, region, wishlist: true, items: [productId], source: 'shopli_price_alert' }),
      });
      if (!res.ok) throw new Error(String(res.status));
      try { localStorage.setItem(EMAIL_KEY, address); } catch { /* alert is saved server-side either way */ }
      setState('done');
      trackConversion('price_alert_signup_completed', { form: 'price_alert', placement, product_id: productId, region });
    } catch {
      setState('error');
    }
  };

  const linkStyle = { color: 'var(--shopli-orange)' };

  if (state === 'done') {
    return (
      <p className="mt-1.5 text-xs font-semibold" style={{ color: 'var(--shopli-navy)' }}>
        {rtl ? 'נשלח לך מייל כשהמחיר ירד' : "We'll email you when it drops"}
      </p>
    );
  }

  if (state === 'idle' || (state === 'error' && !email)) {
    return (
      <button
        type="button"
        className="mt-1.5 text-xs font-semibold underline underline-offset-2 cursor-pointer bg-transparent border-0 p-0"
        style={linkStyle}
        onClick={() => {
          const known = savedEmail();
          if (known) { setEmail(known); save(known); } else setState('asking');
        }}
      >
        {rtl ? 'התראה כשהמחיר יורד' : 'Alert me if the price drops'}
      </button>
    );
  }

  return (
    <form
      className="mt-1.5 flex gap-1"
      onSubmit={(e) => { e.preventDefault(); if (email.includes('@')) save(email.trim()); }}
    >
      <input
        type="email"
        required
        autoFocus
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={rtl ? 'האימייל שלך' : 'your@email.com'}
        aria-label={rtl ? 'אימייל להתראת מחיר' : 'Email for the price alert'}
        className="min-w-0 flex-1 px-2 py-1 rounded-md text-xs border border-orange-200 focus:outline-none focus:ring-1 focus:ring-orange-400"
      />
      <button
        type="submit"
        disabled={state === 'saving'}
        className="px-2 py-1 rounded-md text-xs font-bold cursor-pointer"
        style={{ background: 'var(--shopli-orange)', color: 'var(--shopli-on-orange)' }}
      >
        {state === 'error' ? (rtl ? 'שוב' : 'Retry') : 'OK'}
      </button>
    </form>
  );
}
