import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Icon from './icons';
import { ALL_REGIONS, getRegion, RegionCode } from '../lib/regions';

export default function Header({ currentRegion, dir }: { currentRegion: RegionCode; dir?: string }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [regionOpen, setRegionOpen] = useState(false);
  const regionRef = useRef<HTMLDivElement>(null);
  const region = getRegion(currentRegion);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (regionRef.current && !regionRef.current.contains(e.target as Node)) {
        setRegionOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const rtl = region.direction === 'rtl';

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          href={`/${currentRegion}`}
          className="flex items-center gap-2.5 text-xl font-extrabold tracking-tight"
          style={{ color: 'var(--shopli-navy)' }}
        >
          <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
            <rect width="32" height="32" rx="8" fill="var(--shopli-orange)" />
            <path d="M9 12h14l-2 12H11L9 12z" fill="white" opacity="0.9" />
            <path d="M12 12c0-3 1-5 4-5s4 2 4 5" stroke="white" strokeWidth="2" fill="none" />
            <circle cx="16" cy="17" r="3" fill="var(--shopli-orange)" />
          </svg>
          shopli
        </Link>

        {/* Nav links — hidden on mobile */}
        <nav className="hidden md:flex items-center gap-1">
          <Link
            href={`/${currentRegion}`}
            className="px-3 py-2 text-sm font-medium rounded-lg hover:bg-gray-100 transition-colors"
            style={{ color: 'var(--shopli-navy)' }}
          >
            {rtl ? 'בית' : 'Home'}
          </Link>
          <Link
            href={`/${currentRegion}/categories`}
            className="px-3 py-2 text-sm font-medium rounded-lg hover:bg-gray-100 transition-colors"
            style={{ color: 'var(--shopli-navy)' }}
          >
            {rtl ? 'קטגוריות' : 'Categories'}
          </Link>
          <a
            href={rtl ? 'https://t.me/shopli_il' : 'https://t.me/shopli_eu'}
            target="_blank"
            rel="noopener"
            className="px-3 py-2 text-sm font-medium rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-1.5"
            style={{ color: 'var(--shopli-navy)' }}
          >
            <Icon name="telegram" size={14} />
            {rtl ? 'טלגרם' : 'Telegram'}
          </a>
        </nav>

        {/* Right side — region + mobile menu */}
        <div className="flex items-center gap-2">
          {/* Region switcher */}
          <div className="relative" ref={regionRef}>
            <button
              onClick={() => setRegionOpen(!regionOpen)}
              className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg hover:bg-gray-100 transition-colors"
              style={{ color: 'var(--shopli-navy)' }}
            >
              <Icon name={region.flag as any} size={18} />
              <span className="hidden sm:inline">{region.label}</span>
              <Icon name="chevron-down" size={14} />
            </button>

            {regionOpen && (
              <div
                className="absolute top-full mt-1 right-0 bg-white border border-gray-100 rounded-xl shadow-lg overflow-hidden min-w-[200px] z-50"
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
                      <div className="font-medium" style={{ color: 'var(--shopli-navy)' }}>{r.label}</div>
                      <div className="text-xs" style={{ color: 'var(--shopli-warm-gray)' }}>{r.localeLabel}</div>
                    </div>
                    {r.code === currentRegion && (
                      <Icon name="check" size={14} className="text-shopli-orange" />
                    )}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            onClick={() => setMenuOpen(!menuOpen)}
            style={{ color: 'var(--shopli-navy)' }}
          >
            <Icon name={menuOpen ? 'close' : 'menu'} size={20} />
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 pb-4 pt-2 space-y-1">
          <Link
            href={`/${currentRegion}`}
            className="block px-3 py-2.5 rounded-lg font-medium text-sm hover:bg-gray-100"
            onClick={() => setMenuOpen(false)}
          >
            {rtl ? 'בית' : 'Home'}
          </Link>
          <Link
            href={`/${currentRegion}/categories`}
            className="block px-3 py-2.5 rounded-lg font-medium text-sm hover:bg-gray-100"
            onClick={() => setMenuOpen(false)}
          >
            {rtl ? 'קטגוריות' : 'Categories'}
          </Link>
          <a
            href={rtl ? 'https://t.me/shopli_il' : 'https://t.me/shopli_eu'}
            target="_blank"
            rel="noopener"
            className="flex items-center gap-2 px-3 py-2.5 rounded-lg font-medium text-sm hover:bg-gray-100"
            onClick={() => setMenuOpen(false)}
          >
            <Icon name="telegram" size={16} />
            {rtl ? 'טלגרם' : 'Telegram'}
          </a>
        </div>
      )}
    </header>
  );
}