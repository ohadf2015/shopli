import { test } from 'node:test';
import assert from 'node:assert/strict';

import { getProductsByIds, REGION_MAP } from '../lib/aliexpress';

const LIMITED = {
  error_response: {
    type: 'ISV',
    code: 'ApiCallLimit',
    msg: 'Api access frequency exceeds the limit. this ban will last 1 seconds',
  },
};

function productResponse(id: string) {
  return {
    aliexpress_affiliate_productdetail_get_response: {
      resp_result: {
        result: {
          products: {
            product: [{
              product_id: id,
              product_title: 'Test product',
              target_sale_price: '9.99',
              target_sale_price_currency: 'USD',
            }],
          },
        },
      },
    },
  };
}

/** Swap global.fetch for a queue of canned JSON bodies; returns the call count. */
function stubFetch(bodies: unknown[]) {
  const real = globalThis.fetch;
  const state = { calls: 0 };
  globalThis.fetch = (async () => {
    const body = bodies[Math.min(state.calls, bodies.length - 1)];
    state.calls++;
    return { json: async () => body } as Response;
  }) as typeof fetch;
  return { state, restore: () => { globalThis.fetch = real; } };
}

test('a rate-limited call is retried instead of reported as a missing product', async () => {
  const { state, restore } = stubFetch([LIMITED, productResponse('123')]);
  try {
    const products = await getProductsByIds(['123'], 'us');
    assert.equal(state.calls, 2, 'should have retried past the ban');
    assert.equal(products.length, 1, 'the live product must survive one rate-limit blip');
    assert.equal(products[0].id, '123');
  } finally {
    restore();
  }
});

test('a persistently rate-limited call gives up rather than hanging', async () => {
  const { state, restore } = stubFetch([LIMITED]);
  try {
    const products = await getProductsByIds(['123'], 'us');
    // 3 attempts on productdetail.get, then 3 on the product.query fallback.
    assert.equal(state.calls, 6);
    assert.deepEqual(products, []);
  } finally {
    restore();
  }
});

test('the ru region prices in shekels, not euros', () => {
  assert.equal(REGION_MAP.ru.currency, 'ILS');
  assert.equal(REGION_MAP.ru.shipToCountry, 'IL');
});
