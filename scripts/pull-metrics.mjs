#!/usr/bin/env node
/**
 * Pull Play Store statistics for all KD Pixels apps from the private
 * per-developer reports bucket on Google Cloud Storage (the documented
 * programmatic route — no scraping) and write src/data/metrics.json.
 *
 * Reports:  stats/installs/installs_<pkg>_<YYYYMM>_overview.csv  (cumulative installs)
 *           stats/ratings/ratings_<pkg>_<YYYYMM>_overview.csv   (avg rating + count)
 *
 * Auth:     service account JSON, provided by either:
 *             - env var KDPX_SA_KEY=/abs/path/key.json       (local runs)
 *             - GOOGLE_APPLICATION_CREDENTIALS                (CI / standard ADC)
 *           The account must be invited in Play Console → Users & permissions
 *           with "View app information" (stats reports do not need financial data).
 *
 * Output:   src/data/metrics.json (committed; the Astro build overlays it on
 *           the curated copy in src/data/apps.ts)
 */

import { Storage } from '@google-cloud/storage';
import { GoogleAuth } from 'google-auth-library';
import { existsSync, readFileSync, writeFileSync, renameSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

// Google's documented requirement for the reports bucket:
// OAuth2 scope must be devstorage.read_only (NOT the SDK's cloud-platform default)
// https://support.google.com/googleplay/android-developer/answer/6135870
const GCS_SCOPE = 'https://www.googleapis.com/auth/devstorage.read_only';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, '..');
const OUT = resolve(ROOT, 'src/data/metrics.json');

// Authoritative per-developer reports bucket — from Play Console →
// Download reports → "Copy Cloud Storage URI" (shared by the account owner).
// Guesses below are only fallbacks for a fresh rebuild.
const PINNED_BUCKETS = ['pubsite_prod_rev_15742151642195349260'];

// From the public dev page URL: store/apps/dev?id=8037609104948916115
const DEV_ID = '8037609104948916115';

// The package list lives here so this script stays dependency-free from Astro
const { packages } = JSON.parse(readFileSync(resolve(ROOT, 'src/data/play-packages.json'), 'utf8'));

function keyFile() {
  const p = process.env.KDPX_SA_KEY || process.env.GOOGLE_APPLICATION_CREDENTIALS;
  if (p && existsSync(p)) return p;
  const local = resolve(ROOT, 'service-account.json');
  if (existsSync(local)) return local;
  console.error(
    `No service-account key found.\n` +
    `  Set KDPX_SA_KEY=/path/to/key.json (or place ./service-account.json at repo root).\n` +
    `  Create the key: Cloud Console → IAM → Service Accounts → your SA → Keys → Add key (JSON).\n` +
    `  Grant it in Play Console → Users & permissions → Invite (enter the service account's email)\n` +
    `  with "View app information", all apps.\n`
  );
  process.exit(1);
}

/** narrow CSV splitter — report rows here have no quoted commas */
function splitLine(line) {
  return line.split(',').map((s) => s.trim());
}

/** report CSVs are UTF-16 (BOM-marked per Google's docs); decode accordingly */
function decodeCsv(buf) {
  if (buf.length >= 2 && buf[0] === 0xff && buf[1] === 0xfe) {
    let s = buf.toString('utf16le');
    return s.replace(/^\uFEFF/, '');
  }
  return buf.toString('utf8');
}

function parseCsvText(text) {
  text = text.replace(/^\uFEFF/, '');
  const lines = text.trim().split(/\r?\n/);
  const headers = splitLine(lines[0]);
  const rows = lines.slice(1).map(splitLine);
  return { headers, rows };
}

function findCol(headers, patterns) {
  for (const pat of patterns) {
    const i = headers.findIndex((h) => pat.test(h));
    if (i >= 0) return i;
  }
  return -1;
}

function num(s) {
  const n = Number(String(s ?? '').replace(/[",]/g, ''));
  return Number.isFinite(n) ? n : null;
}

/** run an async mapper over items with bounded concurrency */
async function mapLimit(items, limit, fn) {
  const out = new Array(items.length);
  let next = 0;
  const workers = Array.from({ length: Math.min(limit, items.length) || 1 }, async () => {
    while (next < items.length) {
      const i = next++;
      out[i] = await fn(items[i], i);
    }
  });
  await Promise.all(workers);
  return out;
}

/** pick the newest, non-overflow month file for a package */
function pickLatest(names, pkg, monthLabels) {
  const matching = names
    .filter((n) => n.includes(`_${pkg}_`) )
    .filter((n) => monthLabels.some((m) => n.includes(m)))
    .sort(); // YYYYMM sorts lexicographically
  return matching[matching.length - 1];
}

async function main() {
  const auth = new GoogleAuth({
    keyFile: keyFile(),
    scopes: [GCS_SCOPE],
  });
  const client = await auth.getClient();
  const storage = new Storage({ authClient: client });

  const candidates = [...PINNED_BUCKETS, `pubsite_prod_rev_0${DEV_ID}`, `pubsite_prod_rev_${DEV_ID}`];

  // Pin: Play Console grants mirror to object-level ACLs (storage.objects.*),
  // NOT storage.buckets.get — so skip exists() and probe by listing objects.
  let bucket = null;
  for (const name of candidates) {
    const b = storage.bucket(name);
    try {
      const [files] = await b.getFiles({ maxResults: 1 });
      bucket = b;
      console.log(`bucket pinned: ${name} (${files.length} sample file)`);
      break;
    } catch (e) {
      if (String(e.message).includes('pubsite_prod_rev') === false) { /* not a 404 */ }
      // fall through — candidate unusable
    }
  }
  if (!bucket) {
    console.error(
      'No pubsite_prod_rev_* bucket visible to this service account.\n' +
      'Checks:\n' +
      '  1. Play Console → Users & permissions → the SA email must exist there,\n' +
      '     with "View app information" set to Global (all apps).\n' +
      '  2. Fresh grants can take a few minutes to propagate.\n' +
      '  3. If it still fails, open Play Console → Download reports → Statistics,\n' +
      '     click "Copy Cloud Storage URI" and share it — I will pin the exact\n' +
      '     bucket name instead of guessing it.\n'
    );
    process.exit(2);
  }
  console.log(`bucket: ${bucket.name}`);

  // enumerate report files once (getFiles auto-paginates by default)
  const [allFiles] = await bucket.getFiles({ prefix: 'stats/' });
  const names = allFiles.map((f) => f.name);
  console.log(`report files visible: ${names.length}`);

  // month labels: current + previous 3 (overview files exist per month)
  const monthLabels = [];
  for (let i = 0; i < 4; i++) {
    const d = new Date();
    d.setDate(1);
    d.setMonth(d.getMonth() - i);
    monthLabels.push(`${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}`);
  }

  const result = { fetchedAt: new Date().toISOString(), bucket: bucket.name, apps: {} };

  for (const pkg of packages) {
    const entry = { statsDate: null };

    // ---- installs ----
    // The reports carry per-day figures, NOT a lifetime counter: the
    // `Total User Installs` column is deprecated and reads 0 in current files,
    // and `Active Device Installs` is *current users on device* (Monoic White
    // = ~63k), far below the public store band (1M+).
    // The figure that reproduces the public band is the lifetime SUM of
    // `Daily Device Installs` across every monthly overview file (verified:
    // Monoic White = 1.33M -> "1M+" on Play). That is stored as `installs`;
    // `installsActive` keeps the current-users figure alongside it.
    const instNames = names
      .filter((n) => n.startsWith('stats/installs/') && n.endsWith('_overview.csv'))
      .filter((n) => n.includes(`_${pkg}_`))
      .sort(); // YYYYMM sorts chronologically
    if (instNames.length) {
      const months = await mapLimit(instNames, 8, async (name) => {
        const [buf] = await bucket.file(name).download();
        const { headers, rows } = parseCsvText(decodeCsv(buf));
        const dCol = findCol(headers, [/^daily device installs/i]);
        const aCol = findCol(headers, [
          /^active device installs/i,
          /^installs on active devices/i,
          /^current (device|user) installs/i,
        ]);
        const dateCol = findCol(headers, [/^date/i]);
        let daily = 0;
        for (const r of rows) {
          const v = dCol >= 0 ? num(r[dCol]) : null;
          if (v != null) daily += v;
        }
        const last = rows[rows.length - 1];
        return {
          daily,
          active: last && aCol >= 0 ? num(last[aCol]) : null,
          date: last && dateCol >= 0 ? last[dateCol] : null,
        };
      });

      const lifetime = months.reduce((sum, m) => sum + (m.daily || 0), 0);
      if (lifetime > 0) entry.installs = lifetime;
      const active = [...months].reverse().find((m) => m.active != null);
      if (active) entry.installsActive = active.active;
      const dated = [...months].reverse().find((m) => m.date);
      if (dated) entry.statsDate = dated.date;
    }
    // ---- ratings (global) ----
    const rNames = names.filter((n) => n.startsWith('stats/ratings/'));
    const rateName = pickLatest(
      rNames.filter((n) => !n.endsWith('_country.csv')),
      pkg,
      monthLabels
    );
    if (rateName) {
      const [buf] = await bucket.file(rateName).download();
      const { headers, rows } = parseCsvText(decodeCsv(buf));
      if (rows.length) {
        const last = rows[rows.length - 1];
        const aCol = findCol(headers, [/^total average rating/i, /^rating$/i]);
        const cCol = findCol(headers, [/total number of ratings/i, /number of ratings/i, /total (5\*)? ?ratings/i]);
        if (aCol >= 0) entry.ratingGlobal = num(last[aCol]);
        if (cCol >= 0) entry.ratingCount = num(last[cCol]);
      }
    }

    // ---- ratings by country — headline = US, secondary = JP
    //      (audience is ~0.1% India; owner wants US/JP framing, never IN) ----
    const rateCountryName = pickLatest(
      rNames.filter((n) => n.endsWith('_country.csv')),
      pkg,
      monthLabels
    );
    if (rateCountryName) {
      const [buf] = await bucket.file(rateCountryName).download();
      const { headers, rows } = parseCsvText(decodeCsv(buf));
      const cIdx = headers.findIndex((h) => /country/i.test(h));
      const aIdx = findCol(headers, [/^total average rating/i, /^rating$/i]);
      if (cIdx >= 0 && aIdx >= 0) {
        const latest = new Map(); // country -> latest row (files are date-sorted)
        for (const r of rows) latest.set(r[cIdx], r);
        for (const [code, row] of latest) {
          if (/^(US|United States)$/i.test(code)) entry.ratingUS = num(row[aIdx]);
          if (/^(JP|Japan)$/i.test(code)) entry.ratingJP = num(row[aIdx]);
        }
      }
    }

    result.apps[pkg] = entry;
    const label = [
      entry.installs ?? '—',
      `★${entry.ratingUS ?? entry.ratingGlobal ?? '—'}${entry.ratingUS ? ' (US)' : ''}`,
    ].join('  ');
    console.log(`${pkg.padEnd(38)} ${label}`);
  }

  // Write-then-rename: this box loses power often enough that a cut during a
  // direct write could leave a truncated metrics.json (which would break the
  // build). rename() within the same directory is atomic.
  const tmp = `${OUT}.tmp`;
  writeFileSync(tmp, JSON.stringify(result, null, 2) + '\n');
  renameSync(tmp, OUT);
  console.log(`\nwrote ${OUT}`);
}

main().catch((err) => {
  console.error(err?.message || err);
  process.exit(1);
});
