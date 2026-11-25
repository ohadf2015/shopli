import Link from 'next/link';
import type { GetStaticProps } from 'next';
import Header from '../components/Header';
import SeoHead from '../components/SeoHead';
import { ENTITY_FACTS } from '../lib/entity-map';
import { SITE_URL } from '../lib/seo';
import { getRegion } from '../lib/regions';

const TITLE = 'Facts about Shopli';
const DESCRIPTION =
  'What Shopli is, how it earns money, how its picks are made and how to reach it, in one place. Each fact quotes the page it comes from.';

export const getStaticProps: GetStaticProps = async () => ({ props: {} });

export default function EntityMapPage() {
  const region = getRegion('eu');
  const url = `${SITE_URL}/entity-map`;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: TITLE,
    url,
    about: { '@type': 'Organization', name: 'Shopli', url: SITE_URL },
  };

  return (
    <>
      <SeoHead
        region="eu"
        path="/entity-map"
        canonical={url}
        hreflang={false}
        title={TITLE}
        description={DESCRIPTION}
        jsonLd={jsonLd}
      />
      <Header currentRegion="eu" dir={region.direction} />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 pb-16">
        <h1 className="text-3xl md:text-4xl font-extrabold mb-4" style={{ color: 'var(--shopli-navy)' }}>
          {TITLE}
        </h1>
        <p className="text-base leading-relaxed mb-8" style={{ color: 'var(--shopli-warm-gray)' }}>
          Each line below is a sentence copied word for word from another page on this site, with a link to where it appears.
        </p>
        <dl className="space-y-6">
          {ENTITY_FACTS.map((f) => (
            <div key={f.label}>
              <dt className="text-lg font-bold" style={{ color: 'var(--shopli-navy)' }}>
                {f.label}
              </dt>
              <dd className="mt-1 text-base leading-relaxed" style={{ color: 'var(--shopli-warm-gray)' }}>
                <q>{f.quote}</q>{' '}
                <Link href={f.path} className="underline">
                  Source
                </Link>
              </dd>
            </div>
          ))}
        </dl>
      </main>
    </>
  );
}
