// Deal-alerts capture wired to the company-brain interest rail.
// The form carries data-interest="shopli" and is handled entirely by the
// delegated submit listener in https://company-brain-production-841e.up.railway.app/interest.js
// (loaded once in pages/_app.tsx): it POSTs {product, kind, source, email, note, website}
// to /interest and swaps in the data-done message on success.
// 'website' is the rail's honeypot — keep it invisible and empty.

interface DealAlertsFormProps {
  source: string; // e.g. 'mood' | 'collection' — recorded on the interest row
  rtl: boolean;
}

export default function DealAlertsForm({ source, rtl }: DealAlertsFormProps) {
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
            data-interest="shopli"
            data-kind="notify"
            data-source={source}
            data-done={rtl ? 'נרשמת! נעדכן כשיש דיל חדש' : "You're in — we'll ping you on the next deal"}
            className="flex gap-2"
          >
            <input
              type="email"
              name="email"
              required
              placeholder={rtl ? 'האימייל שלך' : 'your@email.com'}
              className="flex-1 px-4 py-2.5 rounded-xl text-sm text-gray-900 placeholder-gray-400 border-0 focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
            {/* Honeypot: real users never see or fill this; the rail drops bots that do. */}
            <input
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px', opacity: 0 }}
            />
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl font-bold text-sm cursor-pointer"
              style={{ background: 'var(--shopli-orange)', color: 'white' }}
            >
              {rtl ? 'עדכנו אותי' : 'Notify me'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
