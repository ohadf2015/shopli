const BATCH = 4;

export async function keepLinkable<T extends { id: string }>(
  products: T[],
  lookup: (ids: string[]) => Promise<{ id: string }[]>
): Promise<T[]> {
  const batches: T[][] = [];
  for (let i = 0; i < products.length; i += BATCH) batches.push(products.slice(i, i + BATCH));
  const kept = await Promise.all(
    batches.map(async (batch) => {
      const found = await lookup(batch.map((p) => p.id)).catch(() => []);
      // An empty answer is indistinguishable from a throttled call, so only a
      // batch the API actually answered may drop the ids it left out.
      if (found.length === 0) return batch;
      const ids = new Set(found.map((f) => String(f.id)));
      return batch.filter((p) => ids.has(p.id));
    })
  );
  return kept.flat();
}
