type Offer = { price?: number; originalPrice?: number | null; currency?: string; discount?: string };

export function withLookupOffer<T extends Offer>(card: T, found: Offer): T {
  if (!(typeof found.price === 'number' && found.price > 0)) return card;
  return {
    ...card,
    price: found.price,
    originalPrice: found.originalPrice ?? null,
    ...(found.currency ? { currency: found.currency } : {}),
    discount: found.discount ?? '',
  };
}

export async function keepLinkable<T extends { id: string } & Offer>(
  products: T[],
  lookup: (ids: string[]) => Promise<({ id: string } & Offer)[]>
): Promise<T[]> {
  // One id per call, exactly as the product page asks: the by-id API answers
  // differently depending on which other ids share the request.
  const found = await Promise.all(
    products.map((p) =>
      lookup([p.id])
        .then((r) => r.find((f) => String(f.id) === p.id) || null)
        .catch(() => null)
    )
  );
  // An empty answer looks the same as a throttled call, so drop misses only
  // when the API resolved at least one of the others.
  if (!found.some(Boolean)) return products;
  // Search and by-id quote different prices for one item; the card takes the
  // by-id one so it matches the product page it links to.
  return products.flatMap((p, i) => (found[i] ? [withLookupOffer(p, found[i]!)] : []));
}
