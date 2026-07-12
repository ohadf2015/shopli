import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import '../styles/globals.css';

export default function ShopliApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const region = (router.query?.region as string) || 'eu';
  const config = (pageProps as any)?.regionConfig;

  useEffect(() => {
    if (config?.direction === 'rtl') {
      document.documentElement.dir = 'rtl';
      document.documentElement.lang = 'he';
    } else {
      document.documentElement.dir = 'ltr';
      document.documentElement.lang = config?.lang || 'en';
    }
  }, [config]);

  return <Component {...pageProps} />;
}