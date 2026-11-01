import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.APP_URL || 'https://maria.dev';
  const lastModified = new Date('2026-10-31T00:00:00.000Z');

  const routes = [
    '',
    '/discover',
    '/about',
    '/faq',
    '/docs',
    '/privacy',
    '/terms',
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified,
    changeFrequency: route === '' || route === '/discover' ? 'daily' : 'weekly',
    priority: route === '' ? 1.0 : route === '/discover' ? 0.9 : 0.7,
  }));
}
