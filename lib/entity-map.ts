export interface EntityFact {
  label: string;
  quote: string;
  path: string;
  file: string;
  parts?: string[];
}

export const ENTITY_FACTS: EntityFact[] = [
  {
    label: 'What Shopli is',
    quote: 'Shopli is an independent deal-curation website.',
    path: '/eu/about',
    file: 'pages/[region]/about.tsx',
  },
  {
    label: 'Relationship to AliExpress',
    quote:
      'Shopli is not owned by, affiliated with (except through the public affiliate program), or endorsed by Alibaba Group or AliExpress beyond the affiliate commission structure.',
    path: '/eu/about',
    file: 'pages/[region]/about.tsx',
  },
  {
    label: 'How it earns money',
    quote: 'Shopli earns a commission on qualifying purchases made through our affiliate links.',
    path: '/eu/about',
    file: 'pages/[region]/about.tsx',
  },
  {
    label: 'Cost to you',
    quote: 'This commission comes from AliExpress at no extra cost to you.',
    path: '/eu/about',
    file: 'pages/[region]/about.tsx',
  },
  {
    label: 'How picks are made',
    quote:
      'Every pick starts from live AliExpress data — current price, rating, review count and order volume — not from a paid placement.',
    path: '/eu',
    file: 'components/Footer.tsx',
  },
  {
    label: 'Contact',
    quote: 'For general inquiries, feedback, or support: ohadf2015@gmail.com',
    path: '/eu/contact',
    file: 'pages/[region]/contact.tsx',
    parts: ['For general inquiries, feedback, or support:', 'ohadf2015@gmail.com'],
  },
];
