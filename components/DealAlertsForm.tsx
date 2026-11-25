// Deal-alerts capture posting to the company-brain interest rail.
// This form owns its submit (interest.js would show the thank-you on any response,
// failed ones included) so the signup is counted only when /interest answers ok.
// 'website' is the rail's honeypot — keep it invisible and empty.

import { useEffect, useRef } from 'react';
import { trackConversion } from '../lib/analytics';

const INTEREST_URL = 'https://company-brain-production-841e.up.railway.app/interest';

interface DealAlertsFormProps {
  source: string; // e.g. 'mood' | 'collection' — recorded on the interest row
  rtl: boolean;
}

/** Invisible, unfocusable and zero-size, without moving it in either direction. */
const HONEYPOT_STYLE = {
  position: 'absolute',
  width: '1px',
  height: '1px',
  padding: 0,
  margin: '-1px',
  border: 0,
  overflow: 'hidden',
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  whiteSpace: 'nowrap',
  opacity: 0,
} as const;

export default function DealAlertsForm({ source, rtl }: DealAlertsFormProps) {
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const form = formRef.current;
    if (!form) return;
    const say = (cls: string, msg: string, replace: boolean) => {
      const p = document.createElement('p');
      p.className = cls;
      p.textContent = msg;
      if (replace) form.textContent = '';
      form.appendChild(p);
    };
    const onSubmit = async (e: SubmitEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const field = (name: string) => (form.elements.namedItem(name) as HTMLInputElement | null)?.value ?? '';
      try {
        const res = await fetch(INTEREST_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ product: 'shopli', kind: 'notify', source, email: field('email'), website: field('website') }),
        });
        if (!res.ok) throw new Error(String(res.status));
        say('interest-done', form.getAttribute('data-done') || '', true);
        trackConversion('deal_alerts_signup_completed', { form: 'deal_alerts', source });
      } catch {
        say('interest-error', rtl ? 'לא הצלחנו לשמור, נסו שוב' : 'Could not save that, try again?', false);
      }
    };
    form.addEventListener('submit', onSubmit);
    return () => form.removeEventListener('submit', onSubmit);
  }, [source, rtl]);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div
        className="rounded-2xl p-8 md:p-10 text-center"
        style={{ background: 'var(--shopli-navy)', color: 'white' }}
      >
        <h2 className="text-xl md:text-2xl font-bold mb-2">
          {rtl ? 'קבלו התראה על דילים חדשים' : 'Get alerts for new deals'}
        </h2>
        <p className="mb-6 max-w-md mx-auto text-sm" style={{ color: 'oklch(70% 0.02 80)' }}>
          {rtl
            ? 'עדכון אחד קצר כשיוצאת ערכה חדשה או כשמחיר צולל — בלי ספאם'
            : 'One short update when a new collection drops or a price dives — no spam'}
        </p>
        <div className="max-w-sm mx-auto">
          <form
            ref={formRef}
            data-interest="shopli"
            data-kind="notify"
            data-source={source}
            data-done={rtl ? 'נרשמת! נעדכן כשיש דיל חדש' : "You're in — we'll ping you on the next deal"}
            className="relative flex gap-2"
            toolname="get_deal_alerts"
            tooldescription="Subscribe an email address to shopli's short updates about new collections and price drops."
          >
            <input
              type="email"
              name="email"
              toolparamdescription="The email address that should receive deal alerts."
              required
              placeholder={rtl ? 'האימייל שלך' : 'your@email.com'}
              className="flex-1 px-4 py-2.5 rounded-xl text-sm text-gray-900 placeholder-gray-400 border-0 focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
            {/* Honeypot: real users never see or fill this; the rail drops bots that do.
                Hidden by clipping in place, not by pushing it 9999px off to the left: that
                made every Hebrew (right-to-left) page with this form 10,000px wide,
                and the browser showed an empty strip of it instead of the page. */}
            <input
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              style={HONEYPOT_STYLE}
            />
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl font-bold text-sm cursor-pointer"
              style={{ background: 'var(--shopli-orange)', color: 'var(--shopli-on-orange)' }}
            >
              {rtl ? 'עדכנו אותי' : 'Notify me'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
