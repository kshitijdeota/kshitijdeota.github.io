/**
 * Google Play catalogue — all apps under the "KD Pixels" developer page.
 *
 * Play listing URLs follow: https://play.google.com/store/apps/details?id=<pkg>
 * `screenshots` intentionally left empty for now — real assets will be
 * self-hosted under /public/images/apps/<slug>/ once extracted from the
 * Play Console (never hot-link play-lh URLs in production).
 */

export interface AppEntry {
  slug: string;
  name: string;
  /** Android application ID on Google Play */
  pkg: string;
  kind: 'pack' | 'mask';
  /** For Monoic variants — groups cross-promotion links */
  family?: 'monoic';
  price: 'Free · in-app purchase' | 'Paid';
  rating: number | null; // null = unrated / too few reviews
  downloads: string; // Play download band
  tagline: string;
  description: string;
  launchers: string[];
  /** Claimed/verified icon coverage count, null if unknown */
  iconCount?: number;
  /** Placeholder art hue — stand-in until real screenshots are self-hosted */
  hue: number;
}

export const apps: AppEntry[] = [
  {
    slug: 'monoic-white',
    name: 'Monoic White Minimal Icon Pack',
    pkg: 'com.kdpixels.iconpacks.monoic',
    kind: 'pack',
    family: 'monoic',
    price: 'Free · in-app purchase',
    rating: 3.9,
    downloads: '1M+',
    tagline: 'A premium white icon pack with 14,000+ icons for OLED / AMOLED displays.',
    description:
      'The KD Pixels flagship. Over 14,000 crafted, uniformly-aligned icons in a clean minimal white style, designed to blend seamlessly with OLED and AMOLED wallpapers. Supports icon requesting, with new icons added in regular updates.',
    launchers: ['Nova', 'Lawnchair', 'Niagara', 'Smart Launcher', 'Action Launcher', 'Apex', 'Microsoft Launcher'],
    iconCount: 14000,
    hue: 26,
  },
  {
    slug: 'monoic-black',
    name: 'Monoic Black Minimal Icon Pack',
    pkg: 'com.kdpixels.iconpacks.monoicblack',
    kind: 'pack',
    family: 'monoic',
    price: 'Free · in-app purchase',
    rating: 4.2,
    downloads: '100K+',
    tagline: 'The monochromatic dark twin of Monoic — for true black theming.',
    description:
      'Monoic geared for dark homescreens: thousands of clean monochrome icons that read crisply against black wallpapers and always-on displays.',
    launchers: ['Nova', 'Lawnchair', 'Niagara', 'Smart Launcher', 'Action Launcher', 'Apex', 'Microsoft Launcher'],
    hue: 26,
  },
  {
    slug: 'monoic-sq-white',
    name: 'Monoic SQ White Icon Pack',
    pkg: 'com.kdpixels.iconpacks.monoicsq',
    kind: 'pack',
    family: 'monoic',
    price: 'Free · in-app purchase',
    rating: 3.6,
    downloads: '100K+',
    tagline: 'Monoic in a squircle shape — white.',
    description:
      'The Monoic design language applied to soft-cornered squircles. Same coverage discipline, softer silhouette.',
    launchers: ['Nova', 'Lawnchair', 'Niagara', 'Smart Launcher'],
    hue: 26,
  },
  {
    slug: 'monoic-sq-black',
    name: 'Monoic SQ Black Icon Pack',
    pkg: 'com.kdpixels.iconpacks.monoicsqblack',
    kind: 'pack',
    family: 'monoic',
    price: 'Free · in-app purchase',
    rating: 3.7,
    downloads: '100K+',
    tagline: 'Monoic in a squircle shape — black.',
    description:
      'The dark Monoic variant in squircles — thousands of icons tuned for black-based setups.',
    launchers: ['Nova', 'Lawnchair', 'Niagara', 'Smart Launcher'],
    hue: 26,
  },
  {
    slug: 'glassy',
    name: 'Glassy Icon Pack',
    pkg: 'com.kdpixels.iconpacks.glassy',
    kind: 'pack',
    price: 'Paid',
    rating: 4.5,
    downloads: '50K+',
    tagline: 'A frosted-glass icon pack with matching wallpapers and widgets.',
    description:
      'Frosted-glass squares that let your wallpaper glow through, plus a curated companion wallpaper collection. Highest-rated pack in the KD Pixels catalogue.',
    launchers: ['Nova', 'Lawnchair', 'Niagara', 'Smart Launcher', 'Action Launcher'],
    hue: 199,
  },
  {
    slug: 'glass-waves',
    name: 'Glass Waves Icon Pack',
    pkg: 'com.kdpixels.iconpacks.waves',
    kind: 'pack',
    price: 'Paid',
    rating: null,
    downloads: '10K+',
    tagline: 'Glassmorphism with a flowing, liquid twist.',
    description:
      'Rippled glass tiles — the Glassy idea with wave motion baked into the design language.',
    launchers: ['Nova', 'Lawnchair', 'Niagara', 'Smart Launcher'],
    hue: 210,
  },
  {
    slug: 'droplet',
    name: 'Droplet Icon Pack',
    pkg: 'com.kdpixels.iconpacks.crystalorb2',
    kind: 'pack',
    price: 'Paid',
    rating: null,
    downloads: '10K+',
    tagline: 'Crystal orbs — liquid glass droplets for your home screen.',
    description:
      'Sphere-cut glass droplets with refracted depth. A bold, ornamental take on glassmorphism.',
    launchers: ['Nova', 'Lawnchair', 'Niagara', 'Smart Launcher'],
    hue: 190,
  },
  {
    slug: 'bubble-mask',
    name: 'Bubble Icon Mask',
    pkg: 'com.kdpixels.iconpacks.bubble',
    kind: 'mask',
    price: 'Paid',
    rating: null,
    downloads: '10K+',
    tagline: 'A bubble shape mask that themes every app icon automatically.',
    description:
      'Icon mask packs shape whatever apps you have installed into a consistent design — no icon-by-icon swap needed.',
    launchers: ['Nova', 'Lawnchair', 'Niagara', 'Smart Launcher', 'Action Launcher', 'Apex'],
    hue: 205,
  },
  {
    slug: 'moonlight-mask',
    name: 'Moonlight Icon Mask',
    pkg: 'com.kdpixels.iconpacks.moonlit',
    kind: 'mask',
    price: 'Paid',
    rating: null,
    downloads: '10K+',
    tagline: 'A soft crescent-light mask for icon shapes that glow.',
    description:
      'Style an entire launcher’s app set under a gentle moonlit mask — coverage for everything, craft where it counts.',
    launchers: ['Nova', 'Lawnchair', 'Niagara', 'Smart Launcher', 'Apex'],
    hue: 230,
  },
];

export const appCards = {
  app: apps,
  getBySlug: (slug: string) => apps.find((a) => a.slug === slug),
  playLink: (pkg: string) => `https://play.google.com/store/apps/details?id=${pkg}`,
} as const;

export function playLink(pkg: string) {
  return `https://play.google.com/store/apps/details?id=${pkg}`;
}

export function getApp(slug: string): AppEntry | undefined {
  return apps.find((a) => a.slug === slug);
}

/** Sibling apps in the same family (or all remaining packs), for cross-promo */
export function relatedApps(current: AppEntry, n = 3): AppEntry[] {
  const pool = apps.filter((a) => a.slug !== current.slug);
  const same = current.family ? pool.filter((a) => a.family === current.family) : [];
  const rest = pool.filter((a) => !(current.family && a.family === current.family));
  return [...same, ...rest].slice(0, n);
}

/** Display label — actual price is localized by Google Play at checkout,
 *  so the site never shows a hard currency (no INR/USD confusion). */
export function priceLabel(app: AppEntry): string {
  return app.price === 'Paid' ? 'One-time purchase' : 'Free';
}
