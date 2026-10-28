import type { APIRoute } from 'astro';
import { getConcerts } from '../content';
import { href, nav } from '../site';

export const GET: APIRoute = async ({ site }) => {
  const { all } = await getConcerts();
  const paths = [
    '',
    ...nav.map((page) => `${page.key}/`),
    ...all.map((c) => `koncerty/${c.slug}/`),
  ];
  const urls = paths.map((path) => `<url><loc>${new URL(href(path), site).href}</loc></url>`);
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.join('')}</urlset>`,
    { headers: { 'Content-Type': 'application/xml; charset=utf-8' } },
  );
};
