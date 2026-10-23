#!/usr/bin/env bash
# Master a rendered video to -14 LUFS and print loudness + silent stretches.
# Usage: tools/finalize.sh renders/video.mp4
set -euo pipefail
f="${1:?rendered mp4}"
tmp="${f%.mp4}.tmp.mp4"
ffmpeg -nostdin -v error -y -i "$f" -c:v copy -af "loudnorm=I=-14:TP=-1.5:LRA=9" -c:a aac -b:a 192k -ar 48000 "$tmp" && mv "$tmp" "$f"
echo "duration: $(ffprobe -v error -show_entries format=duration -of csv=p=0 "$f") s"
ffmpeg -nostdin -i "$f" -af ebur128 -f null - 2>&1 | grep -E "^\s+I:" | tail -1
echo "silent stretches (should only be where nobody speaks on purpose):"
ffmpeg -nostdin -i "$f" -af "silencedetect=n=-45dB:d=0.6" -f null - 2>&1 | grep -oE "silence_(start|end): [0-9.]+" | paste - - || true
