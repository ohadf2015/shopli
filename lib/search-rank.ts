/**
 * Put listings that are the thing searched for ahead of best-selling accessories.
 * AliExpress sorts by sales, so "power bank" returns cables first.
 */
function tokens(q: string): string[] {
  return q.toLowerCase().split(/[^\p{L}\p{N}]+/u).filter((t) => t.length > 1);
}

export function rankByQuery<T extends { title: string }>(products: T[], q: string): T[] {
  const words = tokens(q);
  if (!words.length) return products;
  const phrase = words.join(' ');
  const scored = products.map((p, i) => {
    const title = tokens(p.title).join(' ');
    const hits = words.filter((w) => title.includes(w)).length;
    const at = title.indexOf(phrase);
    const lead = at === -1 ? 0 : at < 20 ? 2 : 1;
    return { p, i, score: lead * 10 + Math.round((hits / words.length) * 9) };
  });
  return scored.sort((a, b) => b.score - a.score || a.i - b.i).map((s) => s.p);
}
