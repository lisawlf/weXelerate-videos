# Footage triage

The goal: know what every take says and looks like before deciding the story.

## Access

- Footage lives on OneDrive. If macOS blocks a folder (`Operation not permitted`, e.g.
  `~/Downloads`), ask the user to move the files into a OneDrive project folder; granting
  folder access inside the app is not always enough.
- iPhone footage is usually HEVC 4K, rotated (-90°). ffmpeg auto-rotates on decode.

## 1. Inventory

```bash
tools/inventory.sh /path/to/footage     # duration, resolution, rotation per file
```

## 2. Transcribe every take

```bash
tools/transcribe-all.sh /path/to/footage /path/to/project/transcripts
```

The script extracts 16 kHz mono WAVs and runs `npx hyperframes transcribe -e parakeet`.
**Gotcha:** the CLI writes `transcript.json` next to the input and overwrites it on every
run; the script copies each result to `w<file>.json` straight away. If you run it by hand,
do the same, or every take ends up with the last take's transcript.

First run: `npx hyperframes models install parakeet` (one-off, ~640 MB).
Parakeet handles English and German. Transcripts are for timing; never for spelling names.

## 3. Look at the takes

```bash
tools/contact-sheet.sh take.MOV out.jpg 3     # one frame every 3 s, timestamped
```

Read the sheet next to the transcript. Note per take: framing, who is speaking, location,
mic quality, whether the person looks at the camera.

## 4. Pick takes

- For every line of the story, the best delivery wins: complete sentence, no restart,
  energy, eye contact, clean audio.
- Drop: restarts ("wait, again"), off-mic or far-away takes, German asides, takes with
  expired dates or offers, takes where someone walks through.
- A take that is good except for one word can be cut around that word.
- Keep one location per reel where you can. Mixing locations reads as unplanned.

## 5. Cut the a-roll

Cut on word boundaries from the transcript, with 30 ms fade in / 40 ms fade out, scale to
the target format, 30 fps, then concatenate and normalise once:

```bash
ffmpeg -nostdin -ss A -i take.MOV -t D -vf "scale=1080:1920,fps=30,format=yuv420p" \
  -af "afade=t=in:d=0.03,afade=t=out:st=D-0.04:d=0.04" -c:v libx264 -crf 17 -c:a pcm_s16le seg1.mov
ffmpeg -f concat -safe 0 -i list.txt -c:v libx264 -crf 18 -af "loudnorm=I=-14:TP=-1.5:LRA=9" -c:a aac aroll.mp4
```

Always pass `-nostdin` when ffmpeg runs inside a loop that reads a heredoc, or it eats the
input and the loop silently skips takes.

For other formats crop instead of squashing: `scale=-2:1920,crop=1080:1350` etc.

## 6. Photos

Event photos are fine as 2–3 s stills with a slow push. Prefer portrait photos for 9:16;
landscape photos lose most of the frame. Pick photos where the subject is large and sharp.
