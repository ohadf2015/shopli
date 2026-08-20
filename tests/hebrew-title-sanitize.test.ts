import { test } from 'node:test';
import assert from 'node:assert/strict';

import { searchAliExpress } from '../lib/aliexpress';

function queryResponse(titles: string[]) {
  return {
    aliexpress_affiliate_product_query_response: {
      resp_result: {
        result: {
          products: {
            product: titles.map((t, i) => ({
              product_id: String(1000 + i),
              product_title: t,
              target_sale_price: '9.99',
              target_sale_price_currency: 'ILS',
            })),
          },
        },
      },
    },
  };
}

/** Swap global.fetch for a canned JSON body; returns a restore fn. */
function stubFetch(body: unknown) {
  const real = globalThis.fetch;
  globalThis.fetch = (async () => ({ json: async () => body }) as Response) as typeof fetch;
  return () => { globalThis.fetch = real; };
}

test('il search titles get MT-artifact cleanup (geresh spacing, fused Latin)', async () => {
  const restore = stubFetch(queryResponse([
    "גאדג 'טים בישול כלי בישול",
    'Nonלהחליק לדחוף לעמוד',
    "צילום כפול ג 'יגגר קוקטייל גאדג' טים",
  ]));
  try {
    const products = await searchAliExpress('kitchen', 'il', 3);
    assert.equal(products[0].title, 'גאדג׳טים בישול כלי בישול');
    assert.equal(products[1].title, 'Non להחליק לדחוף לעמוד');
    assert.equal(products[2].title, 'צילום כפול ג׳יגגר קוקטייל גאדג׳טים');
  } finally {
    restore();
  }
});

test('non-HE titles go through cleanTitle (conservative: whitespace, filler, misspellings)', async () => {
  const restore = stubFetch(queryResponse(["Nonלהחליק gadget 's  mix"]));
  try {
    const products = await searchAliExpress('kitchen', 'us', 1);
    // cleanTitle only collapses the doubled space here — an unfamiliar title
    // is otherwise passed through untouched.
    assert.equal(products[0].title, "Nonלהחליק gadget 's mix");
  } finally {
    restore();
  }
});
