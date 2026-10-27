# kdpixels.com

Official website of **KD Pixels** — Android icon packs, UI design & front-end development.

Built with [Astro](https://astro.build), deployed to GitHub Pages from this repo.

## Development

The live dev server runs on the home webserver (`jellyfinbox` @ `192.168.0.131`),
not on the MacBook. Edits are made here, synced over rsync, and hot-reload there.

| Target | URL | What |
|---|---|---|
| Dev server (hot reload) | `http://192.168.0.131:4321` | `astro dev` managed by systemd (`kdpixels-dev.service`) |
| Static test deploy | `https://box.local.kdpixels.com/kdpixels/` | `dist/` in the existing dev docroot (`/var/www/dev/kdpixels`) |
| Production | `https://kdpixels.com` | GitHub Pages |

### Commands (run locally, on the MacBook)

- `npm run sync` — rsync source → server (dev server picks it up with hot reload)
- `npm run deploy-test` — build locally, deploy `dist/` → the existing `box-ssl` vhost's docroot (no new vhosts)

### One-time server setup (already done on 2026-10-27)

```
ssh root@192.168.0.131
mkvirtual env: /home/kd/sites/kdpixels.com  (source copy, chown kd:kd)
systemd unit: /etc/systemd/system/kdpixels-dev.service (astro dev --host --port 4321)
apache: untouched — static test reuses the existing /var/www/dev docroot
```

## Structure

```
src/
  data/     apps.ts (Play catalogue), upcoming.ts (Monoic Widgets, BB Icons), site.ts (identity), wallpapers.json
  layouts/  Base.astro (head/SEO, header, footer, theme toggle)
  pages/    index, apps/*, about, contact, 404
  styles/   global.css (design tokens + components)
public/     favicon set, images (all assets from the old Jekyll site minus notebook)
```

## Play Store statistics pipeline

`npm run metrics` pulls cumulative installs + ratings for all 9 apps from
Google's private reports GCS bucket (`pubsite_prod_rev_…`, the documented
programmatic route — no scraping) and writes `src/data/metrics.json`.
Pages overlay these live figures (falling back to curated bands in `apps.ts`
while metrics.json is still an empty stub).

One-time setup (user-side):

1. Cloud Console → create a service account → Keys → add JSON key
2. Play Console → Users & permissions → invite the SA's client_email with
   **View app information** (all apps)
3. Locally: `KDPX_SA_KEY=/path/key.json npm run metrics`
4. CI: repo secret `KDPX_PLAY_SA_JSON` = key JSON → `.github/workflows/play-stats.yml`
   runs nightly 03:00 IST

Data is daily-dated (Google's own lag ~24–48h); pages stamp "as of <date>".

Discarded legacy: the entire Jekyll codebase (pages/posts/data/includes/sass) —
recoverable from git history (tag `pre-astro` in the log) if ever needed.

## Roadmap (from the rebuild plan)

- [ ] Self-host app screenshots from Play Console media kit → `/public/images/apps/<slug>/`
- [ ] `/services/` page with rates + availability
- [ ] `/store/` direct sale page (Lemon Squeezy) — wallpapers, desktop icon sets, design assets
- [ ] Blog sections: `/blog/customize/` (icon users) & `/blog/build/` (craft log)
- [ ] Redirect map from old Jekyll URLs (`/notebook/*`, `/work/brand-identity`, `/glassy/`)
- [ ] ASO wave 1 — Monoic White listing + In-App Review SDK
