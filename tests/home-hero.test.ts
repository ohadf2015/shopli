/**
 * t_2ecfa746 — /eu above-fold conversion invariants.
 * After compare kill (#28), /eu is the dominant path @ 56.1% bounce.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  HOME_PRIMARY_CTA_CLASS,
  homeHeroCopy,
  homePrimaryCtaHref,
  isHomeSecondaryCtaClass,
} from '../lib/home-hero';

test('primary CTA always targets /${region}/trending — never a collection', () => {
  assert.equal(homePrimaryCtaHref('eu'), '/eu/trending');
  assert.equal(homePrimaryCtaHref('il'), '/il/trending');
  assert.equal(homePrimaryCtaHref('us'), '/us/trending');
  assert.ok(!homePrimaryCtaHref('eu').includes('/collection/'));
});

test('sole primary CTA class is btn-primary', () => {
  assert.equal(HOME_PRIMARY_CTA_CLASS, 'btn-primary');
  assert.equal(isHomeSecondaryCtaClass('btn-text'), true);
  assert.equal(isHomeSecondaryCtaClass('btn-secondary'), true);
  assert.equal(isHomeSecondaryCtaClass('btn-primary'), false);
  assert.equal(isHomeSecondaryCtaClass('btn-text btn-primary'), false);
});

test('EU above-fold copy names Europe / EUR and keeps Browse label', () => {
  const copy = homeHeroCopy({
    region: 'eu',
    lang: 'en',
    rtl: false,
    currencySymbol: '€',
  });
  assert.match(copy.title, /Europe/i);
  assert.match(copy.description, /EUR/i);
  assert.equal(copy.ctaLabel, 'Browse All Deals');
  assert.ok(copy.chips.length >= 3);
  assert.ok(copy.chips.some((c) => /€|EUR|EU/i.test(c.label)));
  assert.ok(copy.previewHeading.length > 0);
});

test('non-EU English copy stays outcome-focused without EU-only framing', () => {
  const copy = homeHeroCopy({
    region: 'us',
    lang: 'en',
    rtl: false,
    currencySymbol: '$',
  });
  assert.ok(!/Europe/i.test(copy.title));
  assert.match(copy.description, /\$/);
  assert.equal(copy.ctaLabel, 'Browse All Deals');
});

test('RTL Hebrew copy keeps Browse CTA label and value chips', () => {
  const copy = homeHeroCopy({
    region: 'il',
    lang: 'he',
    rtl: true,
    currencySymbol: '₪',
  });
  assert.equal(copy.ctaLabel, 'כל המבצעים');
  assert.ok(copy.title.length > 10);
  assert.ok(copy.chips.length >= 3);
  assert.ok(copy.chips.some((c) => c.label.includes('₪')));
});
