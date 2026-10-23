#!/usr/bin/env bash
# List every video in a folder with duration, resolution and rotation.
# Usage: tools/inventory.sh /path/to/footage
set -euo pipefail
dir="${1:?usage: inventory.sh <footage folder>}"
find "$dir" -maxdepth 1 -type f \( -iname '*.mov' -o -iname '*.mp4' -o -iname '*.m4v' \) | sort | while read -r f; do
  info=$(ffprobe -v error -select_streams v:0 -show_entries format=duration:stream=width,height:stream_side_data=rotation -of default=nw=1:nk=1 "$f" | tr '\n' ' ')
  printf '%s\t%s\n' "$(basename "$f")" "$info"
done
