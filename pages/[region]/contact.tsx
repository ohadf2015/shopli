import { GetServerSideProps } from 'next';
import Header from '../../components/Header';
import { getRegion, isValidRegion, RegionCode, RegionConfig } from '../../lib/regions';
import SeoHead from '../../components/SeoHead';
import { SITE_URL } from '../../lib/seo';

interface ContactPageProps {
  region: RegionCode;
  config: RegionConfig;
  rtl: boolean;
}

const CONTENT: Record<string, { title: string; heading: string; intro: string; methods: Array<{ title: string; description: string; link?: string; linkText?: string }> }> = {
  en: {
    title: 'Contact Us',
    heading: 'Get in touch',
    intro: 'Have a question, suggestion, or issue? We\'d love to hear from you. Reach out through any of the channels below.',
    methods: [
      {
        title: 'Email',
        description: 'For general inquiries, feedback, or support:',
        link: 'mailto:ohadf2015@gmail.com',
        linkText: 'ohadf2015@gmail.com',
      },
    ],
  },
  he: {
    title: 'צור קשר',
    heading: 'צור קשר',
    intro: 'יש לכם שאלה, הצעה או בעיה? נשמח לשמוע מכם.',
    methods: [
      {
        title: 'דוא"ל',
        description: 'לשאלות כלליות, משוב או תמיכה:',
        link: 'mailto:ohadf2015@gmail.com',
        linkText: 'ohadf2015@gmail.com',
      },
    ],
  },
  fr: {
    title: 'Nous contacter',
    heading: 'Nous contacter',
    intro: 'Vous avez une question, une suggestion ou un problème ? Nous adorerions vous entendre. Contactez-nous via l\'un des canaux ci-dessous.',
    methods: [
      {
        title: 'Email',
        description: 'Pour les demandes générales, les commentaires ou le support :',
        link: 'mailto:ohadf2015@gmail.com',
        linkText: 'ohadf2015@gmail.com',
      },
    ],
  },
  de: {
    title: 'Kontakt',
    heading: 'Kontaktieren Sie uns',
    intro: 'Haben Sie eine Frage, einen Vorschlag oder ein Problem? Wir würden gerne von Ihnen hören. Schreiben Sie uns über einen der folgenden Kanäle.',
    methods: [
      {
        title: 'E-Mail',
        description: 'Bei allgemeinen Anfragen, Feedback oder Support:',
        link: 'mailto:ohadf2015@gmail.com',
        linkText: 'ohadf2015@gmail.com',
      },
    ],
  },
  es: {
    title: 'Contacto',
    heading: 'Contáctanos',
    intro: '¿Tienes una pregunta, sugerencia o problema? Nos encantaría saber de ti. Ponte en contacto a través de cualquiera de los canales a continuación.',
    methods: [
      {
        title: 'Correo electrónico',
        description: 'Para consultas generales, comentarios o soporte:',
        link: 'mailto:ohadf2015@gmail.com',
        linkText: 'ohadf2015@gmail.com',
      },
    ],
  },
  it: {
    title: 'Contatti',
    heading: 'Contattaci',
    intro: 'Hai una domanda, un suggerimento o un problema? Ci piacerebbe sentirti. Contattaci attraverso uno dei canali di seguito.',
    methods: [
      {
        title: 'Email',
        description: 'Per domande generali, feedback o supporto:',
        link: 'mailto:ohadf2015@gmail.com',
        linkText: 'ohadf2015@gmail.com',
      },
    ],
  },
  ru: {
    title: 'Контакты',
    heading: 'Свяжитесь с нами',
    intro: 'У вас есть вопрос, предложение или проблема? Нам было бы приятно услышать от вас. Свяжитесь с нами через один из каналов ниже.',
    methods: [
      {
        title: 'Электронная почта',
        description: 'Для общих вопросов, отзывов или поддержки:',
        link: 'mailto:ohadf2015@gmail.com',
        linkText: 'ohadf2015@gmail.com',
      },
    ],
  },
};

export default function ContactPage({ region, config, rtl }: ContactPageProps) {
  const lang = (config.lang || 'en') as keyof typeof CONTENT;
  const content = CONTENT[lang] || CONTENT.en;
  const pageUrl = `${SITE_URL}/${region}/contact`;

  return (
    <>
      <SeoHead
        region={region}
        path="/contact"
        title={content.title}
        description={content.intro}
        canonical={pageUrl}
      />
      <Header currentRegion={region} dir={config.direction} />

      <main
        className="max-w-3xl mx-auto px-4 sm:px-6 pt-20 sm:pt-24 pb-16"
        style={{ fontFamily: rtl ? "var(--font-assistant), system-ui, sans-serif" : undefined }}
      >
        <h1
          className="text-3xl md:text-4xl font-extrabold mb-4"
          style={{ color: 'var(--shopli-navy)' }}
        >
          {content.heading}
        </h1>

        <p
          className="text-base leading-relaxed mb-10"
          style={{ color: 'var(--shopli-warm-gray)' }}
        >
          {content.intro}
        </p>

        <div className="grid gap-8">
          {content.methods.map((method, idx) => (
            <div
              key={idx}
              className="p-6 rounded-lg border border-[#141414]"
              style={{ backgroundColor: 'var(--shopli-warm-card)' }}
            >
              <h2
                className="text-lg font-bold mb-2"
                style={{ color: 'var(--shopli-navy)' }}
              >
                {method.title}
              </h2>
              <p
                className="text-sm mb-4"
                style={{ color: 'var(--shopli-warm-gray)' }}
              >
                {method.description}
              </p>
              {method.link && method.linkText && (
                <a
                  href={method.link}
                  className="inline-block px-4 py-2 rounded-lg font-medium text-white transition-all hover:opacity-90"
                  style={{ backgroundColor: 'var(--shopli-orange)' }}
                  target={method.linkText.includes('@') ? undefined : '_blank'}
                  rel={method.linkText.includes('@') ? undefined : 'noopener noreferrer'}
                >
                  {method.linkText}
                </a>
              )}
            </div>
          ))}
        </div>
      </main>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params, res }) => {
  const region = ((params?.region as string) || 'eu') as RegionCode;
  if (!isValidRegion(region)) return { notFound: true };
  const config = getRegion(region);
  const rtl = config.direction === 'rtl';

  res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate=604800');

  return {
    props: {
      region,
      config,
      rtl,
    },
  };
};
