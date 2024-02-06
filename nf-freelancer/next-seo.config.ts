import { DefaultSeoProps } from 'next-seo';

const config: DefaultSeoProps = {
  openGraph: {
    type: 'website',
    locale: 'pt-BR',
    url: 'https://www.nf-reelancer.com/',
    siteName: 'nf-reelancer',
  },
  twitter: {
    handle: '@handle',
    site: '@site',
    cardType: 'share-image.jpg',
  },
};

export default config;
