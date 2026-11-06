import type { Verdict } from '../lib/verdict';
import { verdictLabel, verdictReason } from '../lib/verdict';

/**
 * The answer to "is this a good buy?", at the top of every product page.
 * Neo-brutalist card (ink border, offset shadow) — the look the redesign
 * moves the whole site to.
 */

const TONE: Record<Verdict['kind'], string> = {
  good: '#B8F2C9',
  fair: '#FFF0C2',
  wait: '#FFD9C7',
  mixed: '#FFD9C7',
  new: '#E9E4FF',
};

export default function VerdictCard({
  verdict,
  spark,
  rating,
  ratingCount,
  currencySymbol,
  rtl,
}: {
  verdict: Verdict;
  /** Precomputed sparkline for a 320×72 box; empty when there is too little history. */
  spark: { solid: string[]; gaps: string[] };
  /** 0–100 positive feedback. */
  rating: number;
  ratingCount: number | null;
  currencySymbol: string;
  rtl: boolean;
}) {
  const lang = rtl ? 'he' : 'en';
  const fmt = (n: number) => `${currencySymbol}${n.toFixed(2)}`;
  const nf = (n: number) => n.toLocaleString(rtl ? 'he-IL' : 'en-US');
  const stars = rating > 0 ? (rating / 20).toFixed(1) : null;

  const cells: Array<{ label: string; value: string }> = [];
  if (verdict.vsMedianPct != null) {
    cells.push({
      label: rtl ? 'מול הרגיל' : 'vs its usual',
      value:
        verdict.vsMedianPct === 0
          ? rtl ? 'כרגיל' : 'Same'
          : `${verdict.vsMedianPct > 0 ? '+' : '−'}${Math.abs(verdict.vsMedianPct)}%`,
    });
  }
  if (stars) {
    cells.push({
      label: rtl ? 'קונים' : 'Buyers',
      value: ratingCount ? `${stars} · ${nf(ratingCount)}` : stars,
    });
  }
  if (verdict.perDay != null && verdict.perDay > 0) {
    cells.push({ label: rtl ? 'נמכר' : 'Selling', value: rtl ? `~${nf(verdict.perDay)} ביום` : `~${nf(verdict.perDay)}/day` });
  }

  return (
    <section
      aria-label={rtl ? 'האם כדאי לקנות' : 'Is it a good buy'}
      className="mb-5 rounded-2xl bg-white p-4 sm:p-5 flex flex-col gap-3"
      style={{ border: '2.5px solid #141414', boxShadow: '5px 5px 0 #141414', color: '#141414' }}
    >
      <div className="flex items-center gap-2 flex-wrap">
        <span
          className="px-3 py-1.5 rounded-lg font-extrabold text-base sm:text-lg"
          style={{ background: TONE[verdict.kind], border: '2.5px solid #141414' }}
        >
          {verdictLabel(verdict.kind, lang)}
        </span>
      </div>
      <p className="text-sm sm:text-base leading-snug m-0">{verdictReason(verdict, lang, fmt)}</p>

      {cells.length > 0 && (
        <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${cells.length}, minmax(0, 1fr))` }}>
          {cells.map((c) => (
            <div key={c.label} className="rounded-xl px-2.5 py-2" style={{ border: '2px solid #141414', background: '#FFF4E4' }}>
              <div className="text-xs" style={{ color: '#5C554C' }}>{c.label}</div>
              <div className="font-bold text-sm tabular-nums" dir="ltr">{c.value}</div>
            </div>
          ))}
        </div>
      )}

      {spark.solid.length > 0 && (
        <figure className="m-0">
          <svg
            viewBox="0 0 320 72"
            className="w-full h-16"
            preserveAspectRatio="none"
            role="img"
            aria-label={
              rtl
                ? `מחיר ב-${verdict.spanDays} הימים האחרונים, בין ${fmt(verdict.low!)} ל-${fmt(verdict.high!)}`
                : `Price over the last ${verdict.spanDays} days, between ${fmt(verdict.low!)} and ${fmt(verdict.high!)}`
            }
            style={{ transform: rtl ? 'scaleX(-1)' : undefined }}
          >
            {spark.gaps.map((g) => (
              <polyline
                key={g}
                fill="none"
                stroke="#9A9184"
                strokeWidth="2"
                strokeDasharray="4 5"
                vectorEffect="non-scaling-stroke"
                points={g}
              />
            ))}
            {spark.solid.map((seg) => (
              <polyline
                key={seg}
                fill="none"
                stroke="#141414"
                strokeWidth="2.5"
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
                points={seg}
              />
            ))}
          </svg>
          <figcaption className="text-xs flex justify-between" style={{ color: '#5C554C' }}>
            <span>{rtl ? `לפני ${verdict.spanDays} ימים` : `${verdict.spanDays} days ago`}</span>
            <span>
              {spark.gaps.length > 0
                ? rtl ? 'מקווקו: ימים בלי נתונים' : 'Dashed: days we have no reading'
                : rtl ? 'מחיר שתיעדנו כל יום' : 'Price we record daily'}
            </span>
            <span>{rtl ? 'היום' : 'Today'}</span>
          </figcaption>
        </figure>
      )}
    </section>
  );
}
