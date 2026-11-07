import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';

/**
 * Thin bar across the top while a client-side navigation is waiting on the
 * server. Every page here is server-rendered, so a tap on a link fetches that
 * page's data before anything changes on screen; without a sign of progress a
 * slow answer looked like a dead tap and people tapped again and again.
 *
 * Shown only after a short delay, so fast navigations never flash it.
 */
export default function RouteProgress() {
  const router = useRouter();
  const [state, setState] = useState<'idle' | 'loading' | 'done'>('idle');
  const showTimer = useRef<ReturnType<typeof setTimeout>>();
  const hideTimer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    const start = (url: string, { shallow }: { shallow?: boolean } = {}) => {
      if (shallow) return;
      clearTimeout(hideTimer.current);
      clearTimeout(showTimer.current);
      showTimer.current = setTimeout(() => setState('loading'), 120);
    };
    const end = () => {
      clearTimeout(showTimer.current);
      setState((s) => (s === 'loading' ? 'done' : 'idle'));
      hideTimer.current = setTimeout(() => setState('idle'), 300);
    };
    router.events.on('routeChangeStart', start);
    router.events.on('routeChangeComplete', end);
    router.events.on('routeChangeError', end);
    return () => {
      router.events.off('routeChangeStart', start);
      router.events.off('routeChangeComplete', end);
      router.events.off('routeChangeError', end);
      clearTimeout(showTimer.current);
      clearTimeout(hideTimer.current);
    };
  }, [router.events]);

  if (state === 'idle') return null;
  return (
    <div
      role="progressbar"
      aria-label="Loading"
      aria-busy={state === 'loading'}
      className={`route-progress route-progress--${state}`}
    />
  );
}
