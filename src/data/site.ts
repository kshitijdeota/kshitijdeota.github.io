/**
 * Site-wide constants. Single source of truth for identity + links.
 */
export const site = {
  name: 'KD Pixels',
  title: 'KD Pixels — Android apps: icon packs, widgets & masks',
  description:
    'Independent Android apps studio. Premium icon packs and masks on Google Play, a Monoic widget family in the works, and UI design & front-end development for individuals & businesses.',
  author: 'Kshitij Deota',
  email: 'dev@kdpixels.com',
  url: 'https://kdpixels.com',
  playStore: {
    developerName: 'KD Pixels',
    // Cast to full URL in templates
    page: 'https://play.google.com/store/apps/developer?id=KD+Pixels',
    // Facebook-scoped numeric dev id used in short links
    devId: 8037609104948916115,
  },
  socials: [
    { label: 'Play Store', icon: 'play', href: 'https://play.google.com/store/apps/dev?id=8037609104948916115' },
    { label: 'GitHub', icon: 'github', href: 'https://github.com/kshitijdeota/' },
    { label: 'Instagram', icon: 'instagram', href: 'https://www.instagram.com/kshitijdeota/' },
    { label: 'X / Twitter', icon: 'x', href: 'https://twitter.com/kdpixels/' },
    { label: 'Behance', icon: 'behance', href: 'https://www.behance.net/kshitijdeota/' },
  ],
} as const;

export const nav = [
  { label: 'Apps', href: '/apps/' },
  { label: 'About', href: '/about/' },
  { label: 'Contact', href: '/contact/' },
] as const;
