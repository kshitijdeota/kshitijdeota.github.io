#!/usr/bin/env bash
# Build locally, then push dist/ to the existing dev docroot on the server.
# Preview: https://box.local.kdpixels.com/kdpixels/  (served by the existing
# box-ssl vhost — DocumentRoot /var/www/dev — no new vhosts needed)
set -euo pipefail

DEST="jellyfinboxadmin:/var/www/dev/kdpixels/"

KDPX_BASE=/kdpixels/ npm run build

rsync -az --delete --chmod=D775,F664 \
  dist/ "$DEST/"

echo "deployed → https://box.local.kdpixels.com/kdpixels/"
