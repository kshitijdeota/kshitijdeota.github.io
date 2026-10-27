/**
 * Curated portfolio shortlist.
 * Categories: 'android' | 'brand-identity' | 'web-app'
 * Featured images live in /public/images/featured/ (from the old Jekyll site).
 * Full case-study copy can be resurrected from git history when needed.
 */

export type WorkCategory = 'android' | 'brand-identity' | 'web-app';

export interface WorkEntry {
  slug: string;
  title: string;
  category: WorkCategory;
  year: number;
  featured: string; // path under /public
  excerpt: string;
  /** short stat line shown on the card */
  meta: string;
}

export const work: WorkEntry[] = [
  {
    slug: 'monoic-icon-pack',
    title: 'Monoic Icons',
    category: 'android',
    year: 2018,
    featured: '/images/featured/monoic.jpeg',
    excerpt:
      'A minimal white icon system — 14,000+ icons across four sibling packs, boxed into a single coherent design language and shipped to 1M+ downloads on Google Play.',
    meta: 'Icon design system · Android',
  },
  {
    slug: 'bb-icon-pack',
    title: 'BB Icon Pack',
    category: 'android',
    year: 2019,
    featured: '/images/featured/bb.jpeg',
    excerpt:
      'An early pack that set the tone for the studio: bold rounded glyphs, obsessive-align repeatable grid, launcher-wide theming support.',
    meta: 'Icon pack · Android',
  },
  {
    slug: 'caffyne-agency',
    title: 'Caffyne Agency',
    category: 'brand-identity',
    year: 2019,
    featured: '/images/featured/caffyne.jpeg',
    excerpt: 'A full identity build for a creative agency — mark, type system and collateral packaged for daily use.',
    meta: 'Brand identity · Agency',
  },
  {
    slug: '10-pounder-pizzateria',
    title: '10 Pounder Pizzateria',
    category: 'brand-identity',
    year: 2019,
    featured: '/images/featured/10pounder.png',
    excerpt:
      'Identity and packaging design for a pizzeria — a weighty, appetite-forward mark system built to hold its own on boxes, menus and storefronts.',
    meta: 'Brand identity · Packaging',
  },
  {
    slug: 'cook-in-a-pan',
    title: 'Cook in a Pan',
    category: 'brand-identity',
    year: 2019,
    featured: '/images/featured/cookinapan.png',
    excerpt: 'Identity design for a home-cooking brand — friendly mark, cover art, menu system.',
    meta: 'Brand identity · F&B',
  },
  {
    slug: 'knowledge-factory',
    title: 'Knowledge Factory',
    category: 'brand-identity',
    year: 2019,
    featured: '/images/featured/knowledge-factory.png',
    excerpt: 'Identity design for an education-first venture — geometric mark and a full study-friendly visual system.',
    meta: 'Brand identity · Education',
  },
  {
    slug: 'audio-logix',
    title: 'Audio Logix',
    category: 'brand-identity',
    year: 2019,
    featured: '/images/featured/audio-logix.png',
    excerpt:
      'A full identity build for an audio venture — mark, type and a sound-tech-appropriate visual language that stays crisp from favicon to banner.',
    meta: 'Brand identity · Audio',
  },
  {
    slug: 'travel-penn',
    title: 'Travel Penn',
    category: 'brand-identity',
    year: 2019,
    featured: '/images/featured/travel-penn.png',
    excerpt:
      'Identity plus web design for a travel brand — a mark built for itineraries, tickets and the open road, carried through to the site.',
    meta: 'Brand identity · Web design',
  },
  {
    slug: 'caufmann-estate',
    title: 'Caufmann Estate',
    category: 'web-app',
    year: 2019,
    featured: '/images/featured/caufmann.png',
    excerpt:
      'Estate & vineyards — identity and web design with a heritage register: serif-led, wine-label-grade detailing across print and screen.',
    meta: 'Brand identity · Web design',
  },
];

export function getWork(slug: string): WorkEntry | undefined {
  return work.find((w) => w.slug === slug);
}

export const categoryLabel: Record<WorkCategory, string> = {
  android: 'Android / Icons',
  'brand-identity': 'Brand Identity',
  'web-app': 'Web & App',
};
