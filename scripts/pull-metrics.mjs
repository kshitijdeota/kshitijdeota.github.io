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
import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, '..');
const OUT = resolve(ROOT, 'src/data/metrics.json');

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

function parseCsv(text) {
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

/** pick the newest, non-overflow month file for a package */
function pickLatest(names, pkg, monthLabels) {
  const matching = names
    .filter((n) => n.includes(`_${pkg}_`) )
    .filter((n) => monthLabels.some((m) => n.includes(m)))
    .sort(); // YYYYMM sorts lexicographically
  return matching[matching.length - 1];
}

async function main() {
  const storage = new Storage({ keyFilename: keyFile() });

  // Bucket name: pubsite_prod_rev_<dev id, usually with a leading zero>
  const candidates = [`pubsite_prod_rev_0${DEV_ID}`, `pubsite_prod_rev_${DEV_ID}`];
  let bucket = null;
  for (const name of candidates) {
    const b = storage.bucket(name);
    const [exists] = await b.exists();
    if (exists) { bucket = b; break; }
  }
  if (!bucket) {
    // fallback: enumerate buckets prefixed pubsite_prod_rev_
    const [buckets] = await storage.getBuckets();
    bucket = buckets.find((b) => b.name.startsWith('pubsite_prod_rev_'));
  }
  if (!bucket) {
    console.error('No pubsite_prod_rev_* bucket visible to this service account.\nCheck the Play Console grant ("View app information", all apps), then retry.');
    process.exit(2);
  }
  console.log(`bucket: ${bucket.name}`);

  // enumerate report files once
  const names = [];
  await bucket.getFilesAutoPaginated({ prefix: 'stats/' }).then(([files]) => {
    for (const f of files) names.push(f.name);
  });
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
    const instNames = names.filter((n) => n.startsWith('stats/installs/'));
    const instName = pickLatest(instNames, pkg, monthLabels);
    if (instName) {
      const [buf] = await bucket.file(instName).download();
      const { headers, rows } = parseCsv(buf.toString('utf8'));
      // cumulative columns seen in the wild: "Total Users (Cumulative)",
      // "Active Device Installs"(overview); flexible in case of format drift
      const col =
        findCol(headers, [/cumulative/i, /active device installs/i, /^total.*installs/i]);
      const dateCol = 0;
      const dateColIdx = headers.findIndex((h) => /date/i.test(h));
      if (rows.length && col >= 0 && dateColIdx >= 0) {
        const last = rows[rows.length - 1];
        entry.installs = num(last[col]);
        entry.statsDate = last[dateColIdx];
      }
    }

    // ---- ratings ----
    const rNames = names.filter((n) => `stats/ratings/`.length && n.startsWith('stats/ratings/'));
    const rateName = pickLatest(rNames, pkg, monthLabels);
    if (rateName) {
      const [buf] = await bucket.file(rateName).download();
      const { headers, rows } = parseCsv(buf.toString('utf8'));
      if (rows.length) {
        const last = rows[rows.length - 1];
        const cCol = findCol(headers, [/total number of ratings/i, /number of ratings/i]);
        const aCol = findCol(headers, [/^rating$/i, /^average rating(?! for day)/i]);
        if (cCol >= 0) entry.ratingCount = num(last[cCol]);
        if (aCol >= 0) entry.rating = num(last[aCol]);
      }
    }

    result.apps[pkg] = entry;
    const label = [entry.installs ?? '—', entry.rating != null ? `★${entry.rating}` : '★—'].join('  ');
    console.log(`${pkg.padEnd(38)} ${label}`);
  }

  writeFileSync(OUT, JSON.stringify(result, null, 2) + '\n');
  console.log(`\nwrote ${OUT}`);
}

main().catch((err) => {
  console.error(err?.message || err);
  process.exit(1);
});
