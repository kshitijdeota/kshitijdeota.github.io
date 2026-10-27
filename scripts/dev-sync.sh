#!/usr/bin/env bash
# Sync working tree → jellyfinbox dev copy (source only; node_modules lives there)
set -euo pipefail

DEST="jellyfinbox:sites/kdpixels.com"

rsync -az --delete \
  --exclude '.git/' \
  --exclude 'node_modules/' \
  --exclude 'dist/' \
  --exclude '.astro/' \
  --exclude '.DS_Store' \
  ./ "$DEST/"

echo "synced → $DEST (dev server hot-reloads)"
