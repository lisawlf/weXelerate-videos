# Voice and audio

## The voice

| | |
|---|---|
| Service | ElevenLabs (connector in Claude, or elevenlabs.io) |
| Voice | **Ivano - Cheerful, Energetic, and Smooth** |
| voice_id | `ZBjEfck3GpofRpP7YduB` |
| Model | `eleven_v4` |
| Direction tag | Start every prompt with `[upbeat, confident social media narrator]` |
| Language | English, slight German accent (fits a Vienna brand) |

Use another voice only when the request names one.

## Writing the script

- One short sentence per beat. ~2.5 spoken words per second; a 4 s beat holds ~10 words.
- Write numbers as words the way they should be said: "five billion dollars",
  "twenty twenty-five", "sixty-five to six hundred and fifty".
- **Run every name and acronym through `pronunciation.md`** and write the phonetic
  spelling into the prompt. The screen keeps the correct spelling.
- Separate lines with a blank line and `[short pause]`.
- The voiceover never runs over a live soundbite. Script around them.

## Generating

1. Generate **one take of the whole script** (`generations_count: 1`). This keeps tone and
   pace consistent and costs ~900 credits for 50 s.
2. Fixing a word later: regenerate **only the affected lines**, each as its own short
   prompt. Same voice, same direction tag.
3. ElevenLabs returns `429 rate_limited` after a burst of requests. Do not loop: wait
   90 s, then 5 min; if it still fails, ship what works and tell the user which line is
   pending.
4. Download the file immediately; the signed URL expires after ~2 h.

## Fitting the voiceover to the picture

1. Transcribe the take for word timestamps (`hyperframes transcribe <wav> -e parakeet --json`,
   see `footage-triage.md` for the transcript-overwrite gotcha).
2. Cut it into lines at sentence ends (start each cut ~0.05 s before the first word).
3. Normalise each line: `ffmpeg -i in.mp3 -ss A -t D -af "afade=t=in:d=0.02,afade=t=out:st=D-0.06:d=0.06,loudnorm=I=-16:TP=-1.5" out.m4a`
4. Place each line at its section start. Fact cards start on the word they illustrate
   (reel time = line start + word time − cut start).
5. If the script is longer than the gaps, **stretch the picture**, not the voice.
6. The transcript is a good pronunciation check: "Wixelerate" means the name was said
   wrong; "We Accelerate" means it was fixed.

## Sound rules

- Audio only where a **clearly speaking, quoted person** is on screen, or the voiceover.
  Montage shots are muted. No room-tone beds.
- Soundbites and voiceover at the same loudness (both ≈ -16 LUFS before the master).
- Final master: `ffmpeg -i in.mp4 -c:v copy -af "loudnorm=I=-14:TP=-1.5:LRA=9" -c:a aac -b:a 192k out.mp4`
  (Instagram / TikTok loudness).
- Check silence where it should be: `ffmpeg -i out.mp4 -af silencedetect=n=-45dB:d=0.6 -f null -`

## Music

Do not bake commercial music into the MP4. Tracks added in Edits / Instagram are licensed
for in-app use; the same track baked in can get the whole audio muted, voiceover included.
Tell the poster to add it in the app at about 15–25 % volume under speech. Only mix music
in when the user supplies a file they hold the rights to.
