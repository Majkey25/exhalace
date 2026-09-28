import type { APIRoute, GetStaticPaths } from 'astro';
import { getConcerts, type Concert } from '../../content';
import { buildIcs } from '../../ics';
import { href } from '../../site';

// /koncerty/<slug>.ics next to each concert page: "Přidat do kalendáře".
export const getStaticPaths = (async () => {
  const { all } = await getConcerts();
  return all.map((concert) => ({ params: { slug: concert.slug }, props: { concert } }));
}) satisfies GetStaticPaths;

export const GET: APIRoute<{ concert: Concert }> = ({ props, site }) => {
  const url = new URL(href(`koncerty/${props.concert.slug}/`), site).href;
  return new Response(buildIcs(props.concert, url, new Date()), {
    headers: { 'Content-Type': 'text/calendar; charset=utf-8' },
  });
};
