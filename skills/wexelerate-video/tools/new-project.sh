#!/usr/bin/env bash
# Create a video project folder next to the footage, with the reel template and logos.
# Usage: tools/new-project.sh "/path/to/OneDrive/Event folder/My-Video"
set -euo pipefail
here="$(cd "$(dirname "$0")/.." && pwd)"
dest="${1:?usage: new-project.sh <project folder>}"
mkdir -p "$dest"/{assets/clips,assets/img,assets/vo,renders,transcripts}
cp "$here/templates/reel/build.mjs" "$here/templates/reel/hyperframes.json" "$dest/"
[ -f "$dest/config.mjs" ] || cp "$here/templates/reel/config.example.mjs" "$dest/config.mjs"
mkdir -p "$dest/assets/logos"
cp -R "$here/assets/logos/." "$dest/assets/logos/"
echo "Project ready: $dest"
echo "Next: put cut clips in assets/clips, photos in assets/img, voiceover lines in assets/vo,"
echo "edit config.mjs, then: (cd \"$dest\" && node build.mjs config.mjs && npx hyperframes check)"
