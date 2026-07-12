import { GetServerSideProps } from 'next';

export default function RootRedirect() {
  return null; // server-side redirects
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
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

  return {
    redirect: {
      destination: `/${region}`,
      permanent: false,
    },
  };
};