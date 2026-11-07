export async function keepLinkable<T extends { id: string }>(
  products: T[],
  lookup: (ids: string[]) => Promise<{ id: string }[]>
): Promise<T[]> {
  // One id per call, exactly as the product page asks: the by-id API answers
  // differently depending on which other ids share the request.
  const found = await Promise.all(
    products.map((p) =>
      lookup([p.id])
        .then((r) => r.some((f) => String(f.id) === p.id))
        .catch(() => false)
    )
  );
  // An empty answer looks the same as a throttled call, so drop misses only
  // when the API resolved at least one of the others.
  if (!found.some(Boolean)) return products;
  return products.filter((_, i) => found[i]);
}
