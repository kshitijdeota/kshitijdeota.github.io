/**
 * Projects on the bench — not yet on Google Play.
 * Rendered on the home page and the /apps/ catalogue.
 */

export interface UpcomingApp {
  name: string;
  tagline: string;
  status: string;
  /** For the placeholder art hue (Monoic family shares the Monoic hue) */
  hue: number;
  family?: 'monoic';
}

export const upcoming: UpcomingApp[] = [
  {
    name: 'Monoic Widgets',
    tagline:
      'A whole family of home-screen widgets under the Monoic theme — the same minimal design language, extended from icons to clocks, weather and more.',
    status: 'In development',
    hue: 26,
    family: 'monoic',
  },
  {
    name: 'BB Icons',
    tagline:
      'A brand-new icon pack project in progress — a fresh design system built from scratch, separate from the Monoic universe.',
    status: 'In development',
    hue: 12,
  },
];
