import { useEffect } from 'react';

const HOST = 'https://server-production-14a9.up.railway.app';
const EVENTS = ['pointerdown', 'keydown', 'touchstart'] as const;

// Loaded on first interaction so the widget never competes with first paint.
export default function FeedbackWidget() {
  useEffect(() => {
    const load = () => {
      EVENTS.forEach((e) => window.removeEventListener(e, load));
      if (document.getElementById('fdw-widget')) return;
      const s = document.createElement('script');
      s.id = 'fdw-widget';
      s.async = true;
      s.src = `${HOST}/widget.js`;
      s.dataset.token = 'fdt_b23dfc787448d4bc9c2378fac39590b566684c93fd2426a6';
      document.body.appendChild(s);
    };
    EVENTS.forEach((e) => window.addEventListener(e, load, { passive: true }));
    return () => EVENTS.forEach((e) => window.removeEventListener(e, load));
  }, []);
  return null;
}
