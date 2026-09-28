<div align="center">

<img src="public/favicon.svg" width="72" alt="Exhalace brush X" />

# Exhalace

Official website of **Exhalace**, a Czech rock cover band from Jalubí near Uherské Hradiště.

[![CI](https://github.com/Majkey25/exhalace/actions/workflows/ci.yml/badge.svg)](https://github.com/Majkey25/exhalace/actions/workflows/ci.yml)
[![Deploy](https://github.com/Majkey25/exhalace/actions/workflows/deploy.yml/badge.svg)](https://github.com/Majkey25/exhalace/actions/workflows/deploy.yml)
[![Website](https://img.shields.io/website?url=https%3A%2F%2Fwww.exhalace.cz%2F&label=site)](https://www.exhalace.cz/)
[![Astro](https://img.shields.io/badge/Astro-7-BC52EE?logo=astro&logoColor=white)](https://astro.build)
[![Node](https://img.shields.io/badge/node-%E2%89%A522.12-339933?logo=nodedotjs&logoColor=white)](.nvmrc)
[![Dependabot](https://img.shields.io/badge/dependabot-enabled-025E8C?logo=dependabot&logoColor=white)](.github/dependabot.yml)

**[www.exhalace.cz](https://www.exhalace.cz/)**

</div>

## Features

- **The band's first site, modernised**: the same dark, glassy look with Montserrat and soft drifting colour light, rebuilt with a proper type scale, rounded glass cards, pill buttons and calm motion. The logo intro rises, then opens up and dissolves, once per session. The logo's own FarCry face appears only on page titles and dates. All CSS, off under `prefers-reduced-motion`.
- **Built for fans and organisers**: the whole band on the home page, concerts, line-up, a searchable and printable setlist, a booking form next to the printable organiser info, and a map.
- **Concerts with their own pages**: map link, downloadable calendar file (`.ics`) and `MusicEvent` data. Finished gigs move to the archive during the nightly rebuild.
- **Everything editable without code**: concerts, repertoire, gallery, line-up, story, videos and settings live in [`src/data`](src/data) and are edited through [Pages CMS](https://pagescms.org) ([guide in Czech](docs/editace.md)). Every field is validated at build time, so a broken edit never reaches the live site.
- **Booking form without a server**: relayed by FormSubmit, with a honeypot and a no-JS fallback.
- **Fast by default**: static HTML, no client framework, responsive AVIF/WebP images from the original photos, traced SVG logo and monogram, self-hosted fonts, YouTube only after a click.
- **Czech details**: Czech collation for the song list, no one-letter prepositions at line ends, correct plural forms.

## Stack

| Layer     | Choice                                                                             |
| --------- | ---------------------------------------------------------------------------------- |
| Framework | [Astro 7](https://astro.build), static output                                      |
| Styling   | Plain CSS with custom properties, scroll-driven animations                         |
| Images    | `astro:assets` + `sharp` (AVIF with WebP fallback)                                 |
| Fonts     | Montserrat (Astro Fonts API); FarCry Logo Font by Mike "Gumby" Anderson for titles |
| Hosting   | GitHub Pages at www.exhalace.cz, deployed by GitHub Actions                        |
| Content   | YAML in `src/data`, edited in Pages CMS, validated with Zod                        |
| Quality   | Prettier, `astro check` (TypeScript strict), Lighthouse CI                         |

## CI/CD

| Workflow                                     | Trigger                                    | Job                                               |
| -------------------------------------------- | ------------------------------------------ | ------------------------------------------------- |
| [`ci.yml`](.github/workflows/ci.yml)         | every pull request and push to `main`      | Prettier → `astro check` → build → Lighthouse     |
| [`deploy.yml`](.github/workflows/deploy.yml) | push to `main`, daily at 03:17 UTC, manual | Build with the Pages URL → deploy to GitHub Pages |

Actions are pinned to commit SHAs and kept current by Dependabot. Workflows run with read-only
tokens; only the deploy job gets `pages: write`.

## Content and media

Photos, logos, artwork and videos are © Exhalace and are not covered by any open-source licence.
