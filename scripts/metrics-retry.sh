#!/usr/bin/env bash
# Polls the Play reports bucket until the Play Console grant mirrors to GCS,
# then pulls metrics. Local helper for the one-time initial sync.
cd sites/kdpixels.com || exit 1

MAX_TRIES="${1:-20}"           # default: ~3.3h at 10-min intervals
INTERVAL="${2:-600}"

for i in $(seq 1 "$MAX_TRIES"); do
  echo "attempt $i/$MAX_TRIES $(date '+%H:%M:%S')"
  if KDPX_SA_KEY=/home/kd/.secrets/play-sa.json node scripts/pull-metrics.mjs; then
    echo "SUCCESS"
    exit 0
  fi
  sleep "$INTERVAL"
done

echo "EXHAUSTED"
exit 1
