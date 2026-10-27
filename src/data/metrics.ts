/**
 * Live Play Store metrics produced by scripts/pull-metrics.mjs (nightly in CI).
 *
 * Falls back to null when the file is still a stub (no run yet) so the pages
 * keep rendering with the curated static figures from apps.ts.
 *
 * Ratings convention (owner decision): the audience is ~0.1% India — the
 * site shows US-market ratings first, Japan second, global as last resort.
 */

import raw from './metrics.json';

export interface Metric {
  installs: number | null;
  ratingUS: number | null;
  ratingJP: number | null;
  ratingGlobal: number | null;
  ratingCount: number | null;
  statsDate: string | null;
}

interface MetricsFile {
  fetchedAt: string | null;
  bucket: string | null;
  apps: Record<string, Metric>;
}

const data = raw as MetricsFile;

export function metricFor(pkg: string): Metric | null {
  const m = data.apps?.[pkg];
  if (!data.fetchedAt || !m) return null;
  return m;
}

/** ISO date that the Play stats were last pulled, or null */
export function metricsAsOf(): string | null {
  return data.fetchedAt;
}

export function hasMetrics(): boolean {
  return Boolean(data.fetchedAt && Object.keys(data.apps ?? {}).length);
}

export function totalInstalls(packages: string[]): number | null {
  if (!hasMetrics()) return null;
  let sum = 0;
  let any = false;
  for (const pkg of packages) {
    const m = data.apps[pkg];
    if (typeof m?.installs === 'number') { sum += m.installs; any = true; }
  }
  return any ? sum : null;
}

/** Headline rating: US → JP → global → curated fallback */
export function headlineRating(m: Metric | null, fallback: number | null): number | null {
  const live = m ? m.ratingUS ?? m.ratingJP ?? m.ratingGlobal : null;
  return live ?? fallback;
}
