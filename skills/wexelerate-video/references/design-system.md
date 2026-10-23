# Video design system (shared by every brand)

This is the motion and type system of the reels the team liked best (Future Forward expo
reel, a partner innovation-day recap). It is the same for weXelerate and Future Forward; the brand
layer (`brand-wexelerate.md`, `brand-future-forward.md`) only swaps logo, colours, corner
radius, headline weight and the end card.

All pixel values are for 1080×1920. Other formats scale them, see `formats.md`.

## Type

| Role | Face | Size (9:16) | Notes |
|---|---|---|---|
| Hook / statement | Sora | 104–116 px | Tracking -0.045em, line-height 1.0. Lines set by hand, never left to wrap badly |
| Name / fact headline | Sora | 100–112 px | Max 3 lines |
| Big number | Sora | 150–190 px | Tabular feel; one number per frame |
| Captions | Sora | 64–66 px | Tracking -0.03em, line-height 1.08 |
| Chips, eyebrows, meta | JetBrains Mono | 26–30 px | Uppercase, letter-spacing 0.08em |
| Body (rare in video) | Barlow | 30 px | |

Floor: nothing readable under 28 px on a 1080-wide canvas.

## Layout (9:16)

- **Side margin** 110 px left and right (Meta's minimum is 6 % ≈ 65 px; we keep a buffer). Keep the bottom-right corner free for Instagram's action rail.
- **Top keep-out** 250 px: progress chip, speaker name, logo start at y = 250.
- **Lower block** (names, facts, hook) starts at y ≈ 1000–1080.
- **Captions** at y = 1240–1400. Nothing important below y = 1500 (caption and UI zone).
- Shades: top gradient 0→760 px (black 62% → 0) and bottom gradient 1100 px (black 78% → 0)
  on every frame. These are the photo scrims; they are the only gradients allowed on
  footage.

## Motion

- **Word reveal**: each word sits in an overflow-hidden span and slides up from 115%
  (`expo.out`, 0.45 s, 0.06 s stagger).
- **Chip pop**: opacity/y/scale from 0/24/0.9, `back.out(1.8)`, 0.35 s.
- **Shot drift**: every shot slowly scales 1.06 → 1.0 (or 1.0 → 1.035 for talking heads).
- **Chapter cut**: first shot of each section punches in 1.14 → 1.04 in 0.5 s, plus a
  white flash at 30% opacity for 0.18 s. Gentle, not a strobe.
- **Jump cuts in talking heads / soundbites**: alternate framing 1.0 / 1.12–1.2 between
  segments of the same take so the cut reads as intentional.
- **Exit**: 0.15–0.2 s fade. Things leave faster than they arrive.

## Building blocks

| Block | Where | Content |
|---|---|---|
| Hook | lower block, frame 0 | Mono chip ("Recap · Insights"), 2–3 line statement, optional teaser chip ("3 names worth knowing") |
| Progress chip | top left | `01 / 03 · The keynote` for list-style recaps |
| Fact card | lower block | Optional mono kicker ("Valuation", "Did you know?") + headline + optional mono sub-chip (source / context) |
| Lower third | top left during soundbites | Name in Sora 72 px + role chip in mono |
| Captions | caption zone | Word-lit: the line pops in, every word goes from 40% to 100% opacity when spoken |
| Quote moment | lower block | The best soundbite line as full-screen type, revealed line by line on the spoken words |
| URL / CTA pill | lower block | The brand's one accent colour, black text, 50 px pill radius |
| End card | full frame | Logo lockup, headline, venue/date in mono, CTA pill if any |

## Rules learned the hard way

- **Hook text must be fully visible on frame 0.** No reveal animation on the hook; a scale
  settle is fine.
- **Never put text over a face.** Check every snapshot; move the block, not the person.
- **Hand-set caption line breaks** at breath points (`phrases` in the config). Automatic
  grouping produced lines like "and get real / estate for a".
- **Do not count numbers up through wrong values.** A $0 → $5B count-up showed "$2 billion"
  on a paused frame, which was the company's previous real valuation. Show the final number;
  only count up when no intermediate value could be misread as a fact.
- **Shots 2–3 s.** 1 s cuts were rejected as too fast.
- **Sound only where a quoted speaker clearly speaks**, or the voiceover. Everything else is
  silent (music gets added on the platform).
- **One accent element per frame.** Usually the CTA pill on the end card.
- **Recap tone is informative, not salesy.** No "Get your ticket" on a partner recap.
