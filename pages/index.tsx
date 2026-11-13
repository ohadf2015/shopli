import { GetServerSideProps } from 'next';
import { COPY } from './[region]/index';
import { loadHomeProps } from '../lib/home-props';
import { cacheIfNotEmpty } from '../lib/cache';
import { wantsMarkdown, homeMarkdown } from '../lib/home-markdown';
import type { RegionCode } from '../lib/regions';

export default function RootRedirect() {
  return null; // server-side redirects
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  // Simple geo-detection by Accept-Language
  const acceptLang = req.headers['accept-language'] || '';
  let region = 'eu';

  if (acceptLang.startsWith('he') || acceptLang.includes('he-IL')) {
    region = 'il';
  } else if (acceptLang.startsWith('fr')) {
    region = 'fr';
  } else if (acceptLang.startsWith('de')) {
    region = 'de';
  } else if (acceptLang.startsWith('es')) {
    region = 'es';
  } else if (acceptLang.startsWith('it')) {
    region = 'it';
  }

  res.setHeader('Vary', 'Accept');
  if (wantsMarkdown(req.headers.accept)) {
    const props = await loadHomeProps(region as RegionCode);
    res.setHeader('Content-Type', 'text/markdown; charset=utf-8');
    cacheIfNotEmpty(res, props.drops.length + props.sellers.length > 0, 'public, s-maxage=600, stale-while-revalidate=86400');
    res.write(homeMarkdown(props, props.rtl ? COPY.he : COPY.en));
    res.end();
    return { props: {} };
  }

  return {
    redirect: {
      destination: `/${region}`,
      permanent: false,
    },
  };
};