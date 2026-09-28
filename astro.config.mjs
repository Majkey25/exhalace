// @ts-check
import { defineConfig, fontProviders } from 'astro/config';

// The deploy workflow passes --site and --base from the GitHub Pages settings (www.exhalace.cz).
export default defineConfig({
  site: 'https://www.exhalace.cz',
  compressHTML: true,
  build: { inlineStylesheets: 'always' },
  // YouTube thumbnails for the video facade.
  image: { domains: ['i.ytimg.com'] },
  fonts: [
    {
      // Headlines, labels, buttons: condensed village-poster capitals.
      provider: fontProviders.fontsource(),
      name: 'Big Shoulders Display',
      cssVariable: '--font-display',
      weights: [800],
      styles: ['normal'],
      subsets: ['latin', 'latin-ext'],
      fallbacks: ['Arial Narrow', 'sans-serif'],
    },
    {
      // Dates only: stencil digits echo the cut letters of the logo.
      provider: fontProviders.fontsource(),
      name: 'Big Shoulders Stencil Display',
      cssVariable: '--font-stencil',
      weights: [800],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['Arial Narrow', 'sans-serif'],
    },
    {
      provider: fontProviders.fontsource(),
      name: 'Schibsted Grotesk',
      cssVariable: '--font-body',
      weights: ['400 700'],
      styles: ['normal'],
      subsets: ['latin', 'latin-ext'],
      fallbacks: ['system-ui', 'sans-serif'],
    },
  ],
});
