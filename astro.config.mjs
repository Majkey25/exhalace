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
      // The band's typeface since the first site: one variable file for headings and text.
      provider: fontProviders.fontsource(),
      name: 'Montserrat',
      cssVariable: '--font',
      weights: ['400 800'],
      styles: ['normal'],
      subsets: ['latin', 'latin-ext'],
      fallbacks: ['system-ui', 'sans-serif'],
    },
  ],
});
