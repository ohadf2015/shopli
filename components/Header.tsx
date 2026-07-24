import { useState, useRef, useEffect, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Icon from './icons';
import { ALL_REGIONS, getRegion, RegionCode } from '../lib/regions';
import { getCollectionNavItems } from '../lib/collections';

export default function Header({ currentRegion, dir }: { currentRegion: RegionCode; dir?: string }) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [regionOpen, setRegionOpen] = useState(false);
  const [catOpen, setCatOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const regionRef = useRef<HTMLDivElement>(null);
  const catRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const region = getRegion(currentRegion);
  const rtl = region.direction === 'rtl';
  const lang = region.lang || 'en';

  const collections = getCollectionNavItems(lang).slice(0, 14);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (regionRef.current && !regionRef.current.contains(e.target as Node)) {
        setRegionOpen(false);
      }
      if (catRef.current && !catRef.current.contains(e.target as Node)) {
        setCatOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  useEffect(() => {
    if (searchOpen) {
      searchInputRef.current?.focus();
    }
  }, [searchOpen]);

  // Close menus on route change
  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
    setCatOpen(false);
  }, [router.asPath]);

  const onSearch = (e: FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    router.push(`/${currentRegion}/search?q=${encodeURIComponent(q)}`);
    setSearchOpen(false);
    setMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-2">
        {/* Logo */}
        <Link
          href={`/${currentRegion}`}
          className="flex items-center gap-2 text-lg sm:text-xl font-extrabold tracking-tight shrink-0"
          style={{ color: 'var(--shopli-navy)' }}
        >
          <svg width="28" height="28" viewBox="0 0 32 32" fill="none" aria-hidden>
            <rect width="32" height="32" rx="8" fill="var(--shopli-orange)" />
            <path d="M9 12h14l-2 12H11L9 12z" fill="white" opacity="0.9" />
            <path d="M12 12c0-3 1-5 4-5s4 2 4 5" stroke="white" strokeWidth="2" fill="none" />
            <circle cx="16" cy="17" r="3" fill="var(--shopli-orange)" />
          </svg>
          <span className="hidden xs:inline sm:inline">shopli</span>
        </Link>

        {/* Desktop search */}
        <form
          onSubmit={onSearch}
          className="hidden md:flex flex-1 max-w-md mx-4"
          role="search"
        >
          <div className="relative w-full">
            <span
              className="absolute top-1/2 -translate-y-1/2 start-3 pointer-events-none"
              style={{ color: 'var(--shopli-warm-gray)' }}
              aria-hidden
            >
              <Icon name="search" size={16} />
            </span>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={rtl ? 'חיפוש מוצרים...' : 'Search products...'}
              className="w-full ps-9 pe-3 py-2 text-sm rounded-xl border border-gray-200 bg-gray-50/80 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-300 transition-colors"
              style={{ color: 'var(--shopli-navy)' }}
              aria-label={rtl ? 'חיפוש מוצרים' : 'Search products'}
            />
          </div>
        </form>

        {/* Nav links — desktop */}
        <nav className="hidden md:flex items-center gap-0.5 shrink-0">
          <Link
            href={`/${currentRegion}`}
            className="px-3 py-2 text-sm font-medium rounded-lg hover:bg-gray-100 transition-colors"
            style={{ color: 'var(--shopli-navy)' }}
          >
            {rtl ? 'בית' : 'Home'}
          </Link>

          {/* Categories dropdown */}
          <div className="relative" ref={catRef}>
            <button
              type="button"
              onClick={() => setCatOpen(!catOpen)}
              className="px-3 py-2 text-sm font-medium rounded-lg hover:bg-gray-100 transition-colors inline-flex items-center gap-1"
              style={{ color: 'var(--shopli-navy)' }}
              aria-expanded={catOpen}
              aria-haspopup="true"
            >
              {rtl ? 'קטגוריות' : 'Categories'}
              <Icon name="chevron-down" size={14} />
            </button>
            {catOpen && (
              <div className="absolute top-full mt-1 start-0 bg-white border border-gray-100 rounded-xl shadow-lg overflow-hidden min-w-[220px] max-h-[70vh] overflow-y-auto z-50">
                <a
                  href={`/${currentRegion}#categories`}
                  onClick={() => setCatOpen(false)}
                  className="block px-4 py-2.5 text-sm font-semibold border-b border-gray-50 hover:bg-orange-50/50"
                  style={{ color: 'var(--shopli-orange)' }}
                >
                  {rtl ? 'כל הקטגוריות' : 'All categories'}
                </a>
                {collections.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/${currentRegion}/collection/${c.slug}`}
                    onClick={() => setCatOpen(false)}
                    className="block px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors"
                    style={{ color: 'var(--shopli-navy)' }}
                  >
                    {c.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link
            href={`/${currentRegion}/compare`}
            className="px-3 py-2 text-sm font-medium rounded-lg hover:bg-gray-100 transition-colors"
            style={{ color: 'var(--shopli-navy)' }}
          >
            {rtl ? 'השוואה' : 'Compare'}
          </Link>
          <a
            href={`https://t.me/${region.tgChannel || 'shoppingisraelnew'}`}
            target="_blank"
            rel="noopener"
            className="px-3 py-2 text-sm font-medium rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-1.5"
            style={{ color: 'var(--shopli-navy)' }}
          >
            <Icon name="telegram" size={14} />
            {rtl ? 'טלגרם' : 'Telegram'}
          </a>
        </nav>

        {/* Right side — search (mobile) + region + menu */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          <button
            type="button"
            className="md:hidden p-2.5 rounded-lg hover:bg-gray-100 min-w-[44px] min-h-[44px] flex items-center justify-center"
            onClick={() => setSearchOpen(!searchOpen)}
            style={{ color: 'var(--shopli-navy)' }}
            aria-label={rtl ? 'חיפוש' : 'Search'}
            aria-expanded={searchOpen}
          >
            <Icon name={searchOpen ? 'close' : 'search'} size={20} />
          </button>

          <div className="relative" ref={regionRef}>
            <button
              type="button"
              onClick={() => setRegionOpen(!regionOpen)}
              className="flex items-center gap-1.5 px-2 sm:px-3 py-2 text-sm font-medium rounded-lg hover:bg-gray-100 transition-colors min-h-[44px]"
              style={{ color: 'var(--shopli-navy)' }}
              aria-label={rtl ? 'בחירת אזור' : 'Select region'}
            >
              <Icon name={region.flag as any} size={18} />
              <span className="hidden sm:inline">{region.label}</span>
              <Icon name="chevron-down" size={14} />
            </button>

            {regionOpen && (
              <div
                className="absolute top-full mt-1 end-0 bg-white border border-gray-100 rounded-xl shadow-lg overflow-hidden min-w-[200px] z-50"
                style={{ direction: 'ltr' }}
              >
                {ALL_REGIONS.map((r) => (
                  <Link
                    key={r.code}
                    href={`/${r.code}`}
                    onClick={() => setRegionOpen(false)}
                    className={`flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                      r.code === currentRegion
                        ? 'bg-orange-50 font-semibold'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <Icon name={`${r.code}-flag` as any} size={18} />
                    <div className="flex-1">
                      <div className="font-medium" style={{ color: 'var(--shopli-navy)' }}>
                        {r.label}
                      </div>
                      <div className="text-xs" style={{ color: 'var(--shopli-warm-gray)' }}>
                        {r.localeLabel}
                      </div>
                    </div>
                    {r.code === currentRegion && (
                      <Icon name="check" size={14} className="text-shopli-orange" />
                    )}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <button
            type="button"
            className="md:hidden p-2.5 rounded-lg hover:bg-gray-100 min-w-[44px] min-h-[44px] flex items-center justify-center"
            onClick={() => setMenuOpen(!menuOpen)}
            style={{ color: 'var(--shopli-navy)' }}
            aria-label={menuOpen ? (rtl ? 'סגור תפריט' : 'Close menu') : (rtl ? 'תפריט' : 'Menu')}
            aria-expanded={menuOpen}
          >
            <Icon name={menuOpen ? 'close' : 'menu'} size={20} />
          </button>
        </div>
      </div>

      {/* Mobile search bar */}
      {searchOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-3 py-3">
          <form onSubmit={onSearch} className="flex gap-2" role="search">
            <input
              ref={searchInputRef}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={rtl ? 'חיפוש מוצרים...' : 'Search products...'}
              className="flex-1 min-w-0 px-3 py-2.5 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-200"
              style={{ color: 'var(--shopli-navy)' }}
              enterKeyHint="search"
            />
            <button
              type="submit"
              className="px-4 py-2.5 rounded-xl text-sm font-semibold text-white shrink-0 min-h-[44px]"
              style={{ background: 'var(--shopli-orange)' }}
            >
              {rtl ? 'חפש' : 'Go'}
            </button>
          </form>
        </div>
      )}

      {/* Mobile nav */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-3 pb-4 pt-2 space-y-0.5 max-h-[80vh] overflow-y-auto">
          <Link
            href={`/${currentRegion}`}
            className="block px-3 py-3 rounded-lg font-medium text-sm hover:bg-gray-100 min-h-[44px]"
            onClick={() => setMenuOpen(false)}
          >
            {rtl ? 'בית' : 'Home'}
          </Link>
          <Link
            href={`/${currentRegion}/compare`}
            className="block px-3 py-3 rounded-lg font-medium text-sm hover:bg-gray-100 min-h-[44px]"
            onClick={() => setMenuOpen(false)}
          >
            {rtl ? 'השוואה' : 'Compare'}
          </Link>
          <a
            href={`https://t.me/${region.tgChannel || 'shoppingisraelnew'}`}
            target="_blank"
            rel="noopener"
            className="flex items-center gap-2 px-3 py-3 rounded-lg font-medium text-sm hover:bg-gray-100 min-h-[44px]"
            onClick={() => setMenuOpen(false)}
          >
            <Icon name="telegram" size={16} />
            {rtl ? 'טלגרם' : 'Telegram'}
          </a>

          <div className="pt-2 mt-1 border-t border-gray-100">
            <p
              className="px-3 py-2 text-xs font-semibold uppercase tracking-wider"
              style={{ color: 'var(--shopli-warm-gray)' }}
            >
              {rtl ? 'קטגוריות' : 'Categories'}
            </p>
            {collections.map((c) => (
              <Link
                key={c.slug}
                href={`/${currentRegion}/collection/${c.slug}`}
                className="block px-3 py-2.5 rounded-lg text-sm hover:bg-gray-50 min-h-[44px]"
                style={{ color: 'var(--shopli-navy)' }}
                onClick={() => setMenuOpen(false)}
              >
                {c.name}
              </Link>
            ))}
            <a
              href={`/${currentRegion}#categories`}
              className="block px-3 py-2.5 rounded-lg text-sm font-semibold"
              style={{ color: 'var(--shopli-orange)' }}
              onClick={() => setMenuOpen(false)}
            >
              {rtl ? 'הצג הכל ←' : 'View all →'}
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
