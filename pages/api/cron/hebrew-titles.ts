import type { NextApiRequest, NextApiResponse } from 'next';
import {
  cleanGeneratedTitle,
  getProductsMissingHebrewTitles,
  parseGeneratedTitles,
  saveHebrewTitles,
} from '../../../lib/hebrew-titles';

/**
 * Batch writer behind lib/hebrew-titles.ts: rewrites the AliExpress API's
 * literal machine-translated Hebrew titles into short natural ones with an
 * LLM, one table row per product. Runs after the daily trend snapshot (which
 * is what keeps feed_products, the work queue, filled).
 *
 * Wired to Vercel Cron (see vercel.json), same CRON_SECRET bearer contract as
 * the trend-snapshot cron. Also runnable by hand:
 *   curl -H "Authorization: Bearer $CRON_SECRET" \
 *     "https://www.tryshopli.com/api/cron/hebrew-titles?batches=5"
 *
 * Cost: policies.yaml cheap tier — the OpenRouter free model first, paid
 * flash as server-side fallback; ~10 titles per call, well under a cent per
 * full sweep even on the paid model.
 */

const MODELS = ['nvidia/nemotron-3-super-120b-a12b:free', 'deepseek/deepseek-v4-flash'];
const BATCH_SIZE = 10;
// Leaves headroom under the function's 300s ceiling; each LLM call is 5-15s.
const DEADLINE_MS = 240_000;

async function generateBatch(
  apiKey: string,
  items: Array<{ id: string; title: string; productType: string }>
): Promise<Array<{ id: string; title: string; sourceTitle: string }>> {
  const prompt = `You write short, natural Hebrew product titles for an Israeli shopping site.
Each input title is a machine-translated AliExpress listing title (keyword-stuffing run through literal translation). Rewrite each as a clean Hebrew title of 2-6 words: what the product actually is, plus the brand if one appears. No sizes, no voltages, no marketing words, no repeated keywords. Latin brand names stay in Latin script. Use correct, natural Hebrew (e.g. פרנץ׳ פרס, מטחנת קפה חשמלית).
Return ONLY a JSON array: [{"id":"...","title":"..."}]

Input:
${JSON.stringify(items.map((i) => ({ id: i.id, title: i.title, category: i.productType })))}`;

  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      models: MODELS,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.2,
      // The account key enforces a low per-call token ceiling; this batch
      // needs only a few hundred.
      max_tokens: 1500,
    }),
  });
  const data: any = await res.json().catch(() => null);
  const text: string = data?.choices?.[0]?.message?.content || '';
  const byId = new Map(items.map((i) => [i.id, i]));
  const out: Array<{ id: string; title: string; sourceTitle: string }> = [];
  for (const row of parseGeneratedTitles(text)) {
    const item = byId.get(String(row.id));
    if (!item) continue;
    const title = cleanGeneratedTitle(row.title, item.title);
    if (title) out.push({ id: item.id, title, sourceTitle: item.title });
  }
  return out;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return res.status(503).json({ error: 'CRON_SECRET not configured' });
  if (req.headers.authorization !== `Bearer ${secret}`) {
    return res.status(401).json({ error: 'unauthorized' });
  }
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) return res.status(503).json({ error: 'OPENROUTER_API_KEY not configured' });

  const maxBatches = Math.max(1, Math.min(50, parseInt(String(req.query.batches || '50'), 10) || 50));
  const started = Date.now();
  let batches = 0;
  let saved = 0;
  let examined = 0;
  // A batch that yields nothing valid twice in a row means the queue head is
  // rows the model keeps failing — stop rather than burning the deadline.
  let emptyStreak = 0;

  while (batches < maxBatches && Date.now() - started < DEADLINE_MS) {
    const candidates = await getProductsMissingHebrewTitles(BATCH_SIZE);
    if (!candidates.length) break;
    examined += candidates.length;
    const generated = await generateBatch(apiKey, candidates).catch(() => []);
    if (generated.length) {
      saved += await saveHebrewTitles(generated);
      emptyStreak = 0;
    } else {
      emptyStreak++;
      if (emptyStreak >= 2) break;
    }
    batches++;
  }

  res.setHeader('Cache-Control', 'no-store');
  return res.status(200).json({ ok: true, batches, examined, saved, ms: Date.now() - started });
}
