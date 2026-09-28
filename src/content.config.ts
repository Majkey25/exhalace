import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { defineCollection } from 'astro:content';
import type { Loader } from 'astro/loaders';
import { z } from 'astro/zod';
import { CORE_SCHEMA, load } from 'js-yaml';

/**
 * Loads one YAML file edited by hand or through Pages CMS. A list becomes one entry per item
 * (ids keep the file order); a single object becomes one entry.
 * Own loader instead of file(): file() only logs YAML syntax errors and ships an empty list,
 * and it cannot read root-level lists. The core schema keeps dates as plain strings; the default
 * one turns 2026-11-31 into 1 December.
 */
const yamlFile = (file: string): Loader => ({
  name: `yaml:${file}`,
  load: async ({ config, store, parseData, logger, watcher }) => {
    const path = fileURLToPath(new URL(file, config.root));
    const sync = async () => {
      const raw = load(await readFile(path, 'utf8'), { schema: CORE_SCHEMA, filename: file });
      const items: unknown[] = Array.isArray(raw) ? raw : raw == null ? [] : [raw];
      const entries = await Promise.all(
        items.map(async (item, i) => {
          const id = String(i).padStart(3, '0');
          const data = item as Record<string, unknown>;
          return { id, filePath: file, data: await parseData({ id, data, filePath: file }) };
        }),
      );
      store.clear();
      entries.forEach((entry) => store.set(entry));
    };
    await sync();
    watcher?.add(path);
    watcher?.on('change', (changed) => {
      if (changed === path) sync().catch((error: Error) => logger.error(error.message));
    });
  },
});

// Error messages are Czech: the band reads them in the failed deploy log.

// The CMS writes empty strings for fields left blank; treat them as missing.
const optional = <T extends z.ZodType>(schema: T) =>
  z.preprocess((v) => (v === '' || v === null ? undefined : v), schema.optional());
const text = z.string().trim().min(1, 'Pole nesmí být prázdné');
const time = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Čas piš jako HH:MM, např. 20:00');
const https = (field: string) =>
  z.url({ protocol: /^https$/, error: `${field} musí být odkaz začínající https://` });

const koncerty = defineCollection({
  loader: yamlFile('src/data/koncerty.yaml'),
  schema: ({ image }) =>
    z.strictObject({
      title: optional(text),
      date: z.iso.date({ error: 'Datum piš jako RRRR-MM-DD, např. 2026-11-14' }),
      time: optional(time),
      end: optional(time),
      venue: optional(text),
      address: optional(text),
      city: text,
      map: optional(https('Odkaz na mapu')),
      tickets: optional(https('Odkaz na vstupenky')),
      status: optional(z.enum(['cancelled', 'postponed', 'sold-out', 'free'])),
      info: optional(text),
      poster: optional(image()),
    }),
});

const galerie = defineCollection({
  loader: yamlFile('src/data/galerie.yaml'),
  schema: ({ image }) => z.strictObject({ photo: image(), alt: text }),
});

const clenove = defineCollection({
  loader: yamlFile('src/data/clenove.yaml'),
  schema: ({ image }) =>
    z.strictObject({
      name: text,
      role: text,
      previously: optional(text),
      photo: image(),
    }),
});

const kapela = defineCollection({
  loader: yamlFile('src/data/kapela.yaml'),
  schema: z.strictObject({
    lead: text,
    story: z
      .array(
        z.strictObject({
          year: optional(z.string().regex(/^\d{4}$/, 'Rok piš čtyřmi číslicemi, např. 2019')),
          text,
        }),
      )
      .min(1, 'Příběh potřebuje aspoň jednu kapitolu'),
    founded: z.string().regex(/^\d{4}$/, 'Rok vzniku piš čtyřmi číslicemi, např. 2019'),
    home: text,
  }),
});

const repertoar = defineCollection({
  loader: yamlFile('src/data/repertoar.yaml'),
  schema: z.strictObject({ title: text, artist: text }),
});

// A YouTube link in any common form, or a bare 11-character video id.
const youtubeId = z.string().transform((value, ctx) => {
  const id = /(?:v=|youtu\.be\/|shorts\/|embed\/)([\w-]{11})/.exec(value)?.[1] ?? value.trim();
  if (!/^[\w-]{11}$/.test(id)) {
    ctx.addIssue({ code: 'custom', message: 'Vlož odkaz na YouTube, např. https://youtu.be/…' });
    return z.NEVER;
  }
  return id;
});

const videa = defineCollection({
  loader: yamlFile('src/data/videa.yaml'),
  schema: z.strictObject({
    youtube: youtubeId,
    title: text,
    year: z.coerce.number().int().min(2000).max(2100),
  }),
});

const nastaveni = defineCollection({
  loader: yamlFile('src/data/nastaveni.yaml'),
  schema: ({ image }) =>
    z.strictObject({
      email: z.email({ error: 'Neplatný e-mail' }),
      phone: optional(z.string().regex(/^\+?[\d ]{9,17}$/, 'Telefon piš jako +420 604 525 780')),
      slogan: text,
      hero: image(),
      facebook: optional(https('Facebook')),
      instagram: optional(https('Instagram')),
      youtube: optional(https('YouTube')),
      organisers: text,
      // Pin for the "Kde nás najdete" map on the contact page; no map without both.
      map_lat: optional(z.coerce.number().min(-90).max(90)),
      map_lng: optional(z.coerce.number().min(-180).max(180)),
    }),
});

export const collections = { koncerty, galerie, clenove, kapela, repertoar, videa, nastaveni };
