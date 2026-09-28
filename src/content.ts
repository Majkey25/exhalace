import { getCollection, type CollectionEntry } from 'astro:content';
import { plural } from './site';

// Read helpers for the YAML content in src/data (all editable in Pages CMS).

const byFileOrder = <T extends { id: string }>(a: T, b: T) => a.id.localeCompare(b.id);
const inOrder = <T extends { id: string; data: unknown }>(entries: T[]) =>
  entries.sort(byFileOrder).map((e): T['data'] => e.data);
const only = <T>([entry]: { data: T }[], file: string) => {
  if (!entry) throw new Error(`src/data/${file}.yaml is empty`);
  return entry.data;
};

export const getSettings = async () => only(await getCollection('nastaveni'), 'nastaveni');
export const getAbout = async () => only(await getCollection('kapela'), 'kapela');
export const getGallery = async () => inOrder(await getCollection('galerie'));
export const getMembers = async () => inOrder(await getCollection('clenove'));
export const getVideos = async () => inOrder(await getCollection('videa'));

const collator = new Intl.Collator('cs');

/** Songs grouped by artist, both in Czech alphabetical order. */
export const getRepertoire = async () => {
  const groups = new Map<string, string[]>();
  for (const { data } of await getCollection('repertoar'))
    groups.set(data.artist, [...(groups.get(data.artist) ?? []), data.title]);
  return [...groups]
    .sort(([a], [b]) => collator.compare(a, b))
    .map(([artist, songs]) => ({ artist, songs: songs.sort(collator.compare) }));
};

/** "49 písní od 31 interpretů" with the right Czech plural forms. */
export const repertoireSummary = (groups: { songs: string[] }[]) =>
  `${plural(
    groups.reduce((n, g) => n + g.songs.length, 0),
    ['píseň', 'písně', 'písní'],
  )} od ${plural(groups.length, ['interpreta', 'interpretů', 'interpretů'])}`;

export const slugify = (text: string) =>
  text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

export type Concert = CollectionEntry<'koncerty'>['data'] & {
  name: string;
  slug: string;
  inactive: boolean;
};

const byDate = (a: Concert, b: Concert) =>
  a.date.localeCompare(b.date) || (a.time ?? '').localeCompare(b.time ?? '');

/** Concerts split at build time in Czech time; the nightly rebuild moves finished ones. */
export const getConcerts = async () => {
  const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Prague' }).format(new Date());
  const taken = new Map<string, number>();
  const all = (await getCollection('koncerty')).sort(byFileOrder).map(({ data }): Concert => {
    const name = data.title ?? data.venue ?? data.city;
    const base = `${data.date}-${slugify(name)}`;
    const count = (taken.get(base) ?? 0) + 1;
    taken.set(base, count);
    return {
      ...data,
      name,
      slug: count > 1 ? `${base}-${count}` : base,
      inactive: data.status === 'cancelled' || data.status === 'postponed',
    };
  });
  return {
    all,
    upcoming: all.filter((c) => c.date >= today).sort(byDate),
    past: all.filter((c) => c.date < today).sort((a, b) => byDate(b, a)),
  };
};

export const statusLabel = {
  cancelled: 'Zrušeno',
  postponed: 'Přesunuto',
  'sold-out': 'Vyprodáno',
  free: 'Vstup zdarma',
} as const;

/** The band's own map link, or a map search for the place. */
export const mapUrl = (c: Concert) =>
  c.map ??
  `https://mapy.com/fnc/v1/search?query=${encodeURIComponent(
    [c.venue, c.address, c.city].filter(Boolean).join(', '),
  )}`;

/** Date pieces for lists and detail pages, in Czech. */
export const dateParts = (iso: string) => {
  const d = new Date(`${iso}T12:00:00Z`);
  const f = (o: Intl.DateTimeFormatOptions) =>
    new Intl.DateTimeFormat('cs-CZ', { timeZone: 'UTC', ...o }).format(d);
  return {
    day: String(d.getUTCDate()),
    month: f({ month: 'long' }).replace(/^./, (c) => c.toUpperCase()),
    monthShort: f({ month: 'short' }).replace('.', ''),
    year: f({ year: 'numeric' }),
    weekday: f({ weekday: 'long' }),
    short: f({ day: 'numeric', month: 'numeric', year: 'numeric' }).replace(/\s/g, ' '),
    long: f({ weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }),
    // "6. září 2025": reads right after a verb, unlike the weekday form.
    date: f({ day: 'numeric', month: 'long', year: 'numeric' }),
    // Czech gig posters write the month in Roman numerals: 24. VII.
    roman: ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'][
      d.getUTCMonth()
    ],
  };
};

const eventStatus = { cancelled: 'EventCancelled', postponed: 'EventPostponed' } as const;

/** The calendar day after an ISO date: nextDay('2026-12-31') -> '2027-01-01'. */
export const nextDay = (date: string) => {
  const d = new Date(`${date}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + 1);
  return d.toISOString().slice(0, 10);
};

/** schema.org MusicEvent for search engines. */
export const concertJsonLd = (c: Concert, url: string) => ({
  '@context': 'https://schema.org',
  '@type': 'MusicEvent',
  name: `Exhalace — ${c.name}`,
  url,
  startDate: c.time ? `${c.date}T${c.time}` : c.date,
  // An end at or before the start is after midnight, on the next day.
  ...(c.time && c.end && { endDate: `${c.end > c.time ? c.date : nextDay(c.date)}T${c.end}` }),
  eventStatus: `https://schema.org/${c.status === 'cancelled' || c.status === 'postponed' ? eventStatus[c.status] : 'EventScheduled'}`,
  eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
  location: {
    '@type': 'Place',
    name: c.venue ?? c.city,
    address: {
      '@type': 'PostalAddress',
      ...(c.address && { streetAddress: c.address }),
      addressLocality: c.city,
      addressCountry: 'CZ',
    },
  },
  performer: { '@type': 'MusicGroup', name: 'Exhalace' },
  ...(c.info && { description: c.info }),
  ...(c.tickets && {
    offers: {
      '@type': 'Offer',
      url: c.tickets,
      availability: `https://schema.org/${c.status === 'sold-out' ? 'SoldOut' : 'InStock'}`,
    },
  }),
});
