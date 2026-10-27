#!/usr/bin/env bash
# Single-attempt Play stats ingest — meant to be driven by a transient
# systemd timer on the server (see AGENTS.md → "Metrics retry timer").
# On first success it stops its own timer, so nothing is left running.
set -u

cd /home/kd/sites/kdpixels.com || exit 1
LOG=/home/kd/logs/metrics-retry.log
mkdir -p /home/kd/logs

if runuser -u kd -- env KDPX_SA_KEY=/home/kd/.secrets/play-sa.json \
     node scripts/pull-metrics.mjs >>"$LOG" 2>&1; then
  echo "$(date -Is) SUCCESS — stopping transient timer" >>"$LOG"
  systemctl stop kdpixels-metrics-retry.timer 2>/dev/null || true
  systemctl reset-failed kdpixels-metrics-retry.service 2>/dev/null || true
  exit 0
fi

echo "$(date -Is) grant not mirrored yet — timer will retry" >>"$LOG"
exit 0
