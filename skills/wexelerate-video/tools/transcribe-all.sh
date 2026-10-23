#!/usr/bin/env bash
# Transcribe every take with word timestamps. One JSON per take: <out>/w<name>.json
# Usage: tools/transcribe-all.sh /path/to/footage /path/to/project/transcripts
# Needs: ffmpeg, npx hyperframes (first run: npx hyperframes models install parakeet)
set -euo pipefail
src="${1:?footage folder}"; out="${2:?output folder}"
mkdir -p "$out/wav"
find "$src" -maxdepth 1 -type f \( -iname '*.mov' -o -iname '*.mp4' -o -iname '*.m4a' -o -iname '*.wav' -o -iname '*.mp3' \) | sort | while read -r f; do
  name="$(basename "${f%.*}")"
  ffmpeg -nostdin -v error -y -i "$f" -vn -ac 1 -ar 16000 "$out/wav/$name.wav"
  # The CLI writes transcript.json next to the wav and overwrites it each run: copy it right away.
  res=$(cd "$out/wav" && npx hyperframes transcribe "$name.wav" -e parakeet --json 2>/dev/null)
  path=$(printf '%s' "$res" | python3 -c 'import json,sys; print(json.load(sys.stdin).get("transcriptPath",""))')
  if [ -n "$path" ] && [ -f "$path" ]; then cp "$path" "$out/w$name.json"; echo "ok  $name"; else echo "FAIL $name: $res"; fi
done
# Print every take as phrases with timestamps, to read and pick takes
python3 - "$out" <<'EOF'
import json, sys, glob, os
for p in sorted(glob.glob(os.path.join(sys.argv[1], "w*.json"))):
    w = json.load(open(p)); w = w.get("words", w) if isinstance(w, dict) else w
    print("===", os.path.basename(p)[1:-5])
    cur, last = [], None
    for x in w:
        if last is not None and x["start"] - last > 0.7:
            print("  [%6.2f-%6.2f] %s" % (cur[0]["start"], cur[-1]["end"], " ".join(y["text"] for y in cur))); cur = []
        cur.append(x); last = x["end"]
    if cur: print("  [%6.2f-%6.2f] %s" % (cur[0]["start"], cur[-1]["end"], " ".join(y["text"] for y in cur)))
EOF
