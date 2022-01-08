import Prismic from '@prismicio/client';

export function getPrismicClient(){
  const prismic = Prismic.createClient(
    'https://ignewsroot.prismic.io/api/v2',
    {
      accessToken: process.env.PRISMIC_ACCESS_TOKEN
    }
  );

  return prismic;
}