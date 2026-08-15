import { useMemo, useState } from 'react';
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import Header from '../../components/Header';
import SeoHead from '../../components/SeoHead';
import Icon from '../../components/icons';
import WhatsAppShare from '../../components/WhatsAppShare';
import { getRegion, isValidRegion, RegionCode, RegionConfig } from '../../lib/regions';
import { getPicks } from '../../lib/picks';
import { getReviewsBatch } from '../../lib/review-store';
import { productImage } from '../../lib/img';
import { SITE_URL } from '../../lib/seo';

/**
 * Guess the Price.
 *
 * The site knows two things nobody else on it can show: what is actually
 * selling right now (lib/picks.ts, from our own snapshots) and what the people
 * who bought it said (lib/reviews.ts). A price-guessing round is the cheapest
 * way to make both worth looking at — the reveal is the hook, and every reveal
 * ends on a link to the product page.
 *
 * Deterministic on purpose: the rounds and the decoy prices come from the
 * product id, not a random number, so everyone playing today plays the same
 * game and a shared score means something. It also renders identically on the
 * server and the client, which a Math.random() layout would not.
 */

interface Round {
  productId: string;
  title: string;
  imageUrl: string;
  price: number;
  options: number[];
  reason: string;
  perDay: number;
  dropPct: number;
  stars: number;
  ratingCount: number;
  quote: string;
  quoteCountry: string;
}

interface GamePageProps {
  region: RegionCode;
  config: RegionConfig;
  rtl: boolean;
  rounds: Round[];
}

const COPY = {
  en: {
    title: 'Guess the Price',
    lead: 'Five products people are actually buying right now. How close can you get?',
    round: (i: number, n: number) => `Round ${i} of ${n}`,
    correct: 'Spot on',
    close: 'Close',
    wrong: 'Not even close',
    actual: 'Actual price',
    sold: (n: number) => `${n} sold a day right now`,
    drop: (n: number) => `${n}% below its own median price`,
    buyers: (s: string, n: string) => `${s} ★ from ${n} buyer ratings`,
    next: 'Next product',
    see: 'See it on Shopli',
    done: 'You scored',
    outOf: (n: number) => `out of ${n}`,
    again: 'Play the other regions',
    share: 'I scored {score} on Shopli Guess the Price',
    empty: 'No game today — come back after the next daily update.',
    browse: 'Browse trending instead',
  },
  he: {
    title: 'נחשו את המחיר',
    lead: 'חמישה מוצרים שאנשים קונים ממש עכשיו. כמה קרוב תגיעו?',
    round: (i: number, n: number) => `סיבוב ${i} מתוך ${n}`,
    correct: 'בול',
    close: 'קרוב',
    wrong: 'רחוק מאוד',
    actual: 'המחיר האמיתי',
    sold: (n: number) => `${n} נמכרים ביום עכשיו`,
    drop: (n: number) => `${n}% מתחת למחיר החציוני שלו`,
    buyers: (s: string, n: string) => `${s} ★ מתוך ${n} דירוגי קונים`,
    next: 'המוצר הבא',
    see: 'לצפייה בשופלי',
    done: 'הניקוד שלכם',
    outOf: (n: number) => `מתוך ${n}`,
    again: 'שחקו גם באזורים אחרים',
    share: 'קלעתי {score} במשחק "נחשו את המחיר" של שופלי',
    empty: 'אין משחק היום — חזרו אחרי העדכון היומי הבא.',
    browse: 'לצפייה בטרנדים',
  },
};

export default function GamePage({ region, config, rtl, rounds }: GamePageProps) {
  const c = rtl ? COPY.he : COPY.en;
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const sym = config.currencySymbol;

  const round = rounds[index];
  const total = rounds.length;
  const finished = index >= total;

  const verdict = useMemo(() => {
    if (picked == null || !round) return null;
    if (picked === round.price) return { key: 'correct', points: 2 } as const;
    const off = Math.abs(picked - round.price) / round.price;
    return off <= 0.5 ? ({ key: 'close', points: 1 } as const) : ({ key: 'wrong', points: 0 } as const);
  }, [picked, round]);

  function choose(option: number) {
    if (picked != null || !round) return;
    setPicked(option);
    const off = Math.abs(option - round.price) / round.price;
    setScore((s) => s + (option === round.price ? 2 : off <= 0.5 ? 1 : 0));
  }

  function next() {
    setPicked(null);
    setIndex((i) => i + 1);
  }

  if (!rounds.length) {
    return (
      <>
        <SeoHead region={region} path="/game" title={`${c.title} | Shopli`} description={c.lead} noindex />
        <Header currentRegion={region} dir={config.direction} />
        <main className="max-w-2xl mx-auto px-4 pt-24 pb-16 text-center">
          <h1 className="text-2xl font-bold mb-3" style={{ color: 'var(--shopli-navy)' }}>{c.title}</h1>
          <p className="text-sm mb-6" style={{ color: 'var(--shopli-warm-gray)' }}>{c.empty}</p>
          <Link href={`/${region}/trending`} className="btn-primary text-sm">{c.browse}</Link>
        </main>
      </>
    );
  }

  return (
    <>
      <SeoHead region={region} path="/game" title={`${c.title} | Shopli`} description={c.lead} />
      <Header currentRegion={region} dir={config.direction} />

      <main className="max-w-2xl mx-auto px-4 sm:px-6 pt-24 pb-16" style={{ fontFamily: rtl ? 'var(--font-assistant), system-ui, sans-serif' : undefined }}>
        <h1 className="text-2xl md:text-3xl font-extrabold mb-1" style={{ color: 'var(--shopli-navy)' }}>
          {c.title}
        </h1>
        <p className="text-sm mb-6" style={{ color: 'var(--shopli-warm-gray)' }}>{c.lead}</p>

        {finished ? (
          <div className="rounded-3xl border border-gray-100 p-8 text-center">
            <div className="text-5xl font-extrabold mb-1" style={{ color: 'var(--shopli-orange)' }}>
              {score}
            </div>
            <div className="text-sm mb-6" style={{ color: 'var(--shopli-warm-gray)' }}>
              {c.done} · {c.outOf(total * 2)}
            </div>
            <div className="flex flex-wrap gap-3 justify-center">
              <WhatsAppShare
                title={c.share.replace('{score}', `${score}/${total * 2}`)}
                url={`${SITE_URL}/${region}/game`}
                locale={config.lang}
                size="md"
                className="btn-primary"
              />
              <Link href={`/${region}/trending`} className="btn-secondary text-sm">
                {c.browse}
              </Link>
            </div>
          </div>
        ) : (
          <div className="rounded-3xl border border-gray-100 overflow-hidden">
            <div className="px-4 py-2 text-xs flex items-center justify-between" style={{ background: 'oklch(96% 0.01 60)', color: 'var(--shopli-warm-gray)' }}>
              <span>{c.round(index + 1, total)}</span>
              <span className="font-semibold" style={{ color: 'var(--shopli-orange)' }}>{score}</span>
            </div>

            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              {...productImage(round.imageUrl, 640, '(max-width: 672px) 100vw, 640px')}
              alt={round.title}
              className="w-full aspect-square object-cover bg-gray-50"
              // The first round is the LCP element; later ones are behind a tap.
              // Lowercase: React 18 silently drops the camelCase fetchPriority.
              loading={index === 0 ? 'eager' : 'lazy'}
              fetchpriority={index === 0 ? 'high' : undefined}
            />

            <div className="p-4 sm:p-5">
              <h2 className="font-bold text-base mb-1 line-clamp-2" style={{ color: 'var(--shopli-navy)' }}>
                {round.title}
              </h2>
              <p className="text-xs mb-4" style={{ color: 'var(--shopli-warm-gray)' }}>
                {round.reason === 'price_drop' && round.dropPct > 0
                  ? c.drop(round.dropPct)
                  : c.sold(Math.round(round.perDay))}
              </p>

              <div className="grid grid-cols-3 gap-2">
                {round.options.map((opt) => {
                  const isAnswer = opt === round.price;
                  const isPicked = picked === opt;
                  const revealed = picked != null;
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => choose(opt)}
                      disabled={revealed}
                      className="py-3 rounded-xl font-bold text-sm border-2 transition-colors disabled:cursor-default"
                      style={{
                        borderColor: revealed && isAnswer ? 'var(--shopli-orange)' : isPicked ? 'var(--shopli-navy)' : 'oklch(92% 0.01 60)',
                        background: revealed && isAnswer ? 'oklch(94% 0.05 45)' : 'white',
                        color: 'var(--shopli-navy)',
                      }}
                    >
                      {sym}{opt.toFixed(2)}
                    </button>
                  );
                })}
              </div>

              {picked != null && verdict && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="font-bold text-sm mb-1" style={{ color: 'var(--shopli-orange)' }}>
                    {c[verdict.key]} · {c.actual}: {sym}{round.price.toFixed(2)}
                  </div>
                  {round.ratingCount > 0 && (
                    <div className="text-xs mb-2" style={{ color: 'var(--shopli-warm-gray)' }}>
                      {c.buyers(round.stars.toFixed(1), round.ratingCount.toLocaleString(config.lang === 'he' ? 'he-IL' : 'en-US'))}
                    </div>
                  )}
                  {round.quote && (
                    <blockquote className="text-sm italic leading-relaxed mb-3" style={{ color: 'var(--shopli-navy)' }}>
                      “{round.quote}”
                      {round.quoteCountry && (
                        <span className="not-italic text-xs" style={{ color: 'var(--shopli-warm-gray)' }}> — {round.quoteCountry}</span>
                      )}
                    </blockquote>
                  )}
                  <div className="flex gap-2 flex-wrap">
                    <Link href={`/${region}/product/${round.productId}`} className="btn-secondary text-sm">
                      {c.see}
                    </Link>
                    <button type="button" onClick={next} className="btn-primary text-sm">
                      {index + 1 === total ? c.done : c.next}
                      <Icon name={rtl ? 'chevron-left' : 'chevron-right'} size={14} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </>
  );
}

/**
 * Two decoys around the real price, derived from the product id so the answer
 * is not always in the same slot and the page is stable between renders.
 */
function buildOptions(price: number, productId: string): number[] {
  const round2 = (n: number) => Math.round(n * 100) / 100;
  const low = round2(Math.max(0.5, price * 0.42));
  const high = round2(price * 2.1);
  const seed = Number(productId.slice(-2)) || 0;
  const opts = [price, low, high];
  // Rotate by the seed: deterministic, and every slot is used across a game.
  const shift = seed % 3;
  return [...opts.slice(shift), ...opts.slice(0, shift)];
}

export const getServerSideProps: GetServerSideProps = async ({ params, res }) => {
  const region = ((params?.region as string) || 'eu') as RegionCode;
  if (!isValidRegion(region)) return { notFound: true };
  const config = getRegion(region);

  // More picks than rounds: a pick with a broken price or an identical decoy
  // is dropped rather than shown.
  const picks = await getPicks(region, { limit: 12 }).catch(() => []);
  const reviews = await getReviewsBatch(region, picks.map((p) => p.productId)).catch(() => ({}));

  const rounds: Round[] = picks
    .filter((p) => p.price > 0.5 && p.title && p.imageUrl)
    .slice(0, 5)
    .map((p) => {
      const r = reviews[p.productId];
      const quote = r?.reviews.find((x) => x.text.length > 40 && x.text.length < 220);
      return {
        productId: p.productId,
        title: p.title,
        imageUrl: p.imageUrl,
        price: Math.round(p.price * 100) / 100,
        options: buildOptions(Math.round(p.price * 100) / 100, p.productId),
        reason: p.reason,
        perDay: p.recentPerDay,
        dropPct: p.dropPct,
        stars: r?.averageStars ?? 0,
        ratingCount: r?.ratingCount ?? 0,
        quote: quote?.text ?? '',
        quoteCountry: quote?.country ?? '',
      };
    });

  // Never long-cache an empty game: it means the daily sweep has not landed yet.
  res.setHeader(
    'Cache-Control',
    rounds.length ? 'public, s-maxage=1800, stale-while-revalidate=3600' : 'public, s-maxage=30, must-revalidate'
  );

  return { props: { region, config, rtl: config.direction === 'rtl', rounds } };
};
