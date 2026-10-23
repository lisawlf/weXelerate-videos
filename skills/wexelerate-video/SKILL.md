---
name: wexelerate-video
description: Produce a weXelerate or Future Forward video (reel, event recap, talking head, interview or panel cut, promo, facts reel) from raw footage and photos, with the house motion design, the right brand layer and logo, the ElevenLabs voice "Ivano", and checked spelling and pronunciation. Use for any video request from the weXelerate team, including GitHub issues labelled video-request, "make a reel from these takes", "cut this interview", "recap video for the event".
---

# weXelerate video production

You are producing a short video for weXelerate or Future Forward. The rules below were
learned on real projects; most of them exist because something went wrong once. Follow them
exactly, and read the referenced files before the step that needs them.

## 0. Defaults (use unless the request says otherwise)

| | Default |
|---|---|
| Format | 9:16 reel, 1080×1920, 30 fps, MP4 (H.264 + AAC) |
| Brand | weXelerate. Future Forward only when the video is about the FF conference |
| Length | As short as the story allows. Recaps 40–70s, speaker reels 25–40s |
| Shot length | 2–3 s per shot. Never a flicker montage of 1 s cuts |
| Sound | Only a clearly speaking, quoted person, or the voiceover. No room noise, no background chatter |
| Voiceover | Only if asked. ElevenLabs voice **Ivano**, see `references/voice-and-audio.md` |
| Music | Not baked in. The poster adds licensed music in Edits / Instagram |
| Tool | HyperFrames (HTML + GSAP rendered to MP4). Remotion is fine if the producer prefers it; the rules are tool-agnostic |

## 1. Intake

1. If the request is a GitHub issue: `gh issue view <n> --repo lisawlf/weXelerate-videos`.
2. Pull out: brand, kind, format(s), length, goal, footage location, people (spelling, role,
   pronunciation), voiceover yes/no, facts with sources, CTA, deadline.
3. Ask only for what blocks the work: footage location, and the spelling of any name you
   cannot confirm. Everything else has a default. Never ask the user to pick a voice or a
   font; those are decided here.
4. Work in a project folder **next to the footage** (OneDrive), never inside this repo.
   Footage, renders and transcripts are never committed.

## 2. Footage triage → `references/footage-triage.md`

Probe every file, extract audio, transcribe every take (word timestamps), make contact
sheets with timestamps, and look at them. Pick the best take of each line. Drop restarts,
stumbles, off-mic takes, takes that mention expired dates or offers.

## 3. Story

Write the storyline before building. One idea per beat, in order:

- **Hook (0–3 s)**: says what this is. Text on screen from frame 0. For recaps: what the
  event is ("Inside Day 2 of …"). For speaker reels: the strongest line, as a cold open.
- **Beats**: one person, company or fact per beat. A progress chip (`01 / 03 · The keynote`)
  makes a list format feel save-worthy.
- **Human core**: the live soundbites. Captioned word by word; the best line becomes a
  full-screen type moment.
- **End card**: logo lockup, one headline, venue/date in mono, one CTA if there is one.

Educational / facts reels: lead with numbers ("$5 billion. 650 people. 1 bank…"), give each
hero 2–4 verified facts as fact cards, timed to the voiceover.

## 4. Copy and facts → `references/copy-rules.md`

Every on-screen word and voiceover line goes through the copy rules: verified facts only,
names exactly as the person writes them, no em dashes, no invented quotes, and the brand's
own rules (weXelerate: no emoji, sentence case; FF: load the `ff-copy` skill).

## 5. Build → `references/design-system.md`, `references/brand-*.md`, `references/formats.md`

Start from `templates/reel/` (copy it into the project folder). Set `brand` and `format`
in the config; the template switches logo, colours, radius and type weight. Read
`references/hyperframes-notes.md` before touching the timeline code.

## 6. Voiceover → `references/voice-and-audio.md`, `references/pronunciation.md`

Write the script, run every name through the pronunciation dictionary, generate one take
with Ivano, split it into lines by transcription, and time the fact cards to the words.

## 7. QA → `references/qa-checklist.md`

Snapshot every beat, check every name and number on screen against the request, check the
audio has sound only where intended, run `npx hyperframes check`, render, normalise to
-14 LUFS, measure.

## 8. Deliver

- Output: `renders/<Brand>-<Event>-<Kind>_<format>.mp4`, e.g.
  `wX-InnoDays-Day2-Recap_9x16.mp4`. Keep earlier versions; never overwrite a file the
  user may already have posted. Name a corrected re-cut `_v2`, `_v3`.
- Give the user: the file, what is in it beat by beat, every fact that is unverified or
  from a single source, every pronunciation you had to guess, and a ready-to-paste caption
  (`references/copy-rules.md` → Captions).
- If the request was a GitHub issue, comment on it with the output path and the flags.
- Add anything new you learned (a name, a pronunciation, a rule the user corrected) to
  `references/pronunciation.md` or the relevant rule file in a pull request, so the next
  video gets it right the first time.

## Interviews and panels

Read `references/interviews.md`. Same system; the person is the story, cuts are hidden
with punch-ins, captions carry everything.
