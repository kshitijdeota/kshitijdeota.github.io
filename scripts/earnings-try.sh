#!/usr/bin/env bash
# Single-attempt probe for the Play "View financial data" grant, driven by a
# transient systemd timer (see AGENTS.md → financial reports). Stops its own
# timer on first success so nothing is left running.
set -u

cd /home/kd/sites/kdpixels.com || exit 1
LOG=/home/kd/logs/earnings-watch.log
mkdir -p /home/kd/logs

if runuser -u kd -- env KDPX_SA_KEY=/home/kd/.secrets/play-sa.json \
     node scripts/earnings-watch.mjs >>"$LOG" 2>&1; then
  echo "$(date -Is) SUCCESS — financial reports readable, stopping watcher" >>"$LOG"
  systemctl stop kdpixels-earnings-watch.timer 2>/dev/null || true
  systemctl reset-failed kdpixels-earnings-watch.service 2>/dev/null || true
  exit 0
fi

echo "$(date -Is) financial grant not mirrored yet — will retry" >>"$LOG"
exit 0
