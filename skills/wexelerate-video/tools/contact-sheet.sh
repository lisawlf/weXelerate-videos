#!/usr/bin/env bash
# One frame every N seconds, tiled, for reviewing a take.
# Usage: tools/contact-sheet.sh take.MOV out.jpg [every_seconds=3]
set -euo pipefail
in="${1:?video}"; out="${2:?out.jpg}"; n="${3:-3}"
dur=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$in")
count=$(python3 -c "import math; print(max(1, math.ceil($dur / $n)))")
cols=8; rows=$(( (count + cols - 1) / cols ))
ffmpeg -nostdin -v error -y -i "$in" -vf "fps=1/$n,scale=180:-2,tile=${cols}x${rows}" -frames:v 1 "$out"
echo "$out: $count frames, 1 per ${n}s, row-major (frame k = $n*k seconds)"
