# QA checklist (before every delivery)

## Content
- [ ] Every name on screen matches the request / the person's own spelling.
- [ ] Every role and fact has a source; unverified ones are listed for the user.
- [ ] No expired dates, prices or offers, in speech or on screen.
- [ ] No em dashes. weXelerate: no emoji. FF: no "spectators" line.
- [ ] Hook says what the video is, and is readable on frame 0.
- [ ] End card: correct logo for the brand, venue, CTA only if requested.

## Picture (snapshot every beat and look)
- [ ] No text over a face. No text in the top 250 px / bottom 420 px / right rail (9:16).
- [ ] Line breaks set by hand; no orphan words, no lines broken mid-phrase.
- [ ] One accent (lime / acid) element per frame at most.
- [ ] Shots 2–3 s; no flicker cuts.
- [ ] Count-ups never pass through a misleading value; final numbers correct.
- [ ] Logo unicolour, not boxed, not stretched, clear space kept.
- [ ] `npx hyperframes check` passes.

## Sound
- [ ] Sound only where a quoted person speaks or the voiceover runs.
- [ ] Voiceover never overlaps a soundbite.
- [ ] Every name in the voiceover pronounced per `pronunciation.md` (transcribe and read).
- [ ] Master at -14 LUFS (`ebur128`), no clipping.
- [ ] `silencedetect` shows silence only where intended.

## File
- [ ] Duration as planned, 30 fps, H.264 + AAC.
- [ ] Named `<Brand>-<Event>-<Kind>_<format>.mp4`; earlier versions kept.
- [ ] Delivery note: beats, flags, caption.
