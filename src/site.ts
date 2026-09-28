// Site-wide paths and navigation.

const base = import.meta.env.BASE_URL.replace(/\/?$/, '/');

/** Path inside the site, e.g. href('koncerty/') -> /koncerty/ (respects the base path). */
export const href = (path = '') => `${base}${path}`;

export const nav = [
  { key: 'koncerty', label: 'Koncerty' },
  { key: 'kapela', label: 'Kapela' },
  { key: 'repertoar', label: 'Repertoár' },
  { key: 'galerie', label: 'Galerie' },
  { key: 'kontakt', label: 'Kontakt' },
] as const;

export type Page = (typeof nav)[number]['key'];

export const bookingHref = href('kontakt/#poptavka');

/** Czech plural: plural(3, ['koncert', 'koncerty', 'koncertů']) -> "3 koncerty". */
export const plural = (n: number, [one, few, many]: readonly [string, string, string]) =>
  `${n} ${n === 1 ? one : n >= 2 && n <= 4 ? few : many}`;

/**
 * The logo typeface (FarCry) has capitals, digits and basic punctuation only, no Czech accents.
 * Titles use it only when every character is covered; otherwise they stay in Montserrat.
 */
export const logoTypeFits = (text: string) => /^[A-Za-z0-9 .,:;!?'"()&+/-]+$/.test(text);

/** In FarCry the capital C hangs low and the F sits high; the lowercase c and f match the logo. */
export const logoText = (text: string) => text.toUpperCase().replace(/C/g, 'c').replace(/F/g, 'f');

/** Czech typography: one-letter prepositions and conjunctions never end a line. */
export const vlna = (text: string) => text.replace(/(^|[\s(])([ksvzouaiKSVZOUAI]) /g, '$1$2 ');
