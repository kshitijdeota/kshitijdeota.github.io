#!/usr/bin/env node
/**
 * Probe whether the Play "View financial data" grant has mirrored into the
 * reports-bucket ACL yet.
 *
 * Exit 0 → financial reports are readable (grant mirrored).
 * Exit 1 → still 403 (propagating, up to ~24h).
 *
 * Driven by scripts/earnings-try.sh on a transient systemd timer; the timer
 * stops itself on the first success.
 */

import { Storage } from '@google-cloud/storage';
import { GoogleAuth } from 'google-auth-library';

const BUCKET = process.env.KDPX_BUCKET || 'pubsite_prod_rev_15742151642195349260';
const SCOPES = ['https://www.googleapis.com/auth/devstorage.read_only'];

function keyFile() {
  const p = process.env.KDPX_SA_KEY || process.env.GOOGLE_APPLICATION_CREDENTIALS;
  if (!p) {
    console.error('No service-account key path (set KDPX_SA_KEY).');
    process.exit(2);
  }
  return p;
}

const auth = new GoogleAuth({ keyFile: keyFile(), scopes: SCOPES });
const storage = new Storage({ authClient: await auth.getClient() });
const bucket = storage.bucket(BUCKET);

const [files] = await bucket.getFiles({ prefix: 'earnings/' });
const names = files.map((f) => f.name).sort();
if (!names.length) {
  console.error('No earnings objects even listed — unexpected.');
  process.exit(1);
}

// Newest monthly earnings archive is the cheapest reliable access probe.
const newest = names[names.length - 1];
try {
  const [buf] = await bucket.file(newest).download();
  console.log(`EARNINGS OK — ${newest} readable (${buf.length} bytes), ${names.length} monthly files listed`);
  process.exit(0);
} catch (e) {
  console.error(`still 403 on ${newest}: ${String(e.message).slice(0, 120)}`);
  process.exit(1);
}
