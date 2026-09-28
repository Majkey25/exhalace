import logo from './assets/logo.svg?raw';
import monogram from './assets/monogram.svg?raw';
import x from './assets/x.svg?raw';

// Traced brand marks, inlined once per page as <symbol>s and reused with <use>.
const symbol = (id: string, svg: string) => {
  const viewBox = /viewBox="([^"]+)"/.exec(svg)?.[1];
  if (!viewBox) throw new Error(`${id}.svg has no viewBox`);
  return { id, viewBox, body: svg.replace(/^[\s\S]*?<svg[^>]*>|<\/svg>\s*$/g, '') };
};

export const marks = {
  logo: symbol('logo', logo),
  x: symbol('x', x),
  monogram: symbol('monogram', monogram),
};

export type Mark = keyof typeof marks;
