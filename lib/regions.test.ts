import { describe, it } from 'node:test';
import assert from 'node:assert';
import { REGIONS, getTelegramChannelUrl, RegionConfig } from './regions';
import { organizationJsonLd } from './seo';

describe('Telegram channel configuration', () => {
  it('removes dead channels from us and eu configs', () => {
    assert.strictEqual(REGIONS.us.tgChannel, undefined);
    assert.strictEqual(REGIONS.eu.tgChannel, undefined);
  });

  it('keeps the real channel for il and ru', () => {
    assert.strictEqual(REGIONS.il.tgChannel, 'shoppingisraelnew');
    assert.strictEqual(REGIONS.ru.tgChannel, 'shoppingisraelnew');
  });

  it('does not contain any dead channel handles in region configs', () => {
    const handles = Object.values(REGIONS).map((r: RegionConfig) => r.tgChannel);
    assert.ok(!handles.includes('shopli_us'), 'found shopli_us in region configs');
    assert.ok(!handles.includes('shopli_eu'), 'found shopli_eu in region configs');
  });
});

describe('getTelegramChannelUrl helper', () => {
  it('returns undefined when a region has no channel', () => {
    assert.strictEqual(getTelegramChannelUrl(REGIONS.us), undefined);
    assert.strictEqual(getTelegramChannelUrl(REGIONS.eu), undefined);
  });

  it('returns the full t.me URL when a region has a channel', () => {
    assert.strictEqual(getTelegramChannelUrl(REGIONS.il), 'https://t.me/shoppingisraelnew');
    assert.strictEqual(getTelegramChannelUrl(REGIONS.ru), 'https://t.me/shoppingisraelnew');
  });
});

describe('Organization structured data', () => {
  it('only lists real channel URLs and excludes dead ones', () => {
    const sameAs = organizationJsonLd().sameAs as string[];
    const allowed = new Set(
      Object.values(REGIONS)
        .map((r: RegionConfig) => (r.tgChannel ? `https://t.me/${r.tgChannel}` : undefined))
        .filter((url): url is string => Boolean(url))
    );

    assert.ok(!sameAs.includes('https://t.me/shopli_us'), 'sameAs contains dead shopli_us');
    assert.ok(!sameAs.includes('https://t.me/shopli_eu'), 'sameAs contains dead shopli_eu');

    for (const url of sameAs) {
      assert.ok(allowed.has(url), `sameAs contains unexpected URL: ${url}`);
    }
  });
});
