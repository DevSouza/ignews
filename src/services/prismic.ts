import * as Prismic from '@prismicio/client';

export function getPrismicClient(){
  
  const endpoint = Prismic.getEndpoint('ignewsroot')
  const client = Prismic.createClient(
    endpoint,
    {
      accessToken: process.env.PRISMIC_ACCESS_TOKEN
    }
  );

  return client;
}