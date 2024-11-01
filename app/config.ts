import { NextConfig } from 'next'

export const routeConfig: NextConfig['redirects'] = async () => {
  return [
    {
      source: '/restricted',
      destination: '/restricted/market',
      permanent: true,
    },
  ]
}