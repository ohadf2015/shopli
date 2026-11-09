import { test } from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';

const nextConfig = require(path.join(process.cwd(), 'next.config.js'));

async function sitewideCsp(): Promise<Record<string, string[]>> {
  const rules: Array<{ source: string; headers: Array<{ key: string; value: string }> }> =
    await nextConfig.headers();
  const header = rules
    .find((r) => r.source === '/:path*')
    ?.headers.find((h) => h.key === 'Content-Security-Policy');
  assert.ok(header, 'every page sends an enforced Content-Security-Policy');
  const directives: Record<string, string[]> = {};
  for (const part of header.value.split(';')) {
    const [name, ...sources] = part.trim().split(/\s+/);
    if (name) directives[name] = sources;
  }
  return directives;
}

test('the CSP allows the analytics, affiliate images and lead scripts the site loads', async () => {
  const csp = await sitewideCsp();
  for (const origin of [
    'https://www.googletagmanager.com',
    'https://*.posthog.com',
    'https://growthradar.app',
    'https://company-brain-production-841e.up.railway.app',
  ]) {
    assert.ok(csp['script-src'].includes(origin), `script-src allows ${origin}`);
  }
  for (const origin of ['https://*.posthog.com', 'https://growthradar.app', 'https://*.google-analytics.com']) {
    assert.ok(csp['connect-src'].includes(origin), `connect-src allows ${origin}`);
  }
  assert.ok(csp['img-src'].includes('https://*.aliexpress-media.com'));
  assert.ok(csp['img-src'].includes('https://*.alicdn.com'));
});

test('the CSP never allows eval and keeps the page unframeable', async () => {
  const csp = await sitewideCsp();
  assert.ok(!Object.values(csp).flat().includes("'unsafe-eval'"));
  assert.deepEqual(csp['frame-ancestors'], ["'none'"]);
  assert.deepEqual(csp['object-src'], ["'none'"]);
});
