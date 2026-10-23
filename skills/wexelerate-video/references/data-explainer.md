# Data explainer (animated charts + voiceover)

A topic explained in 6–8 scenes, each one a **question headline answered by one animated
piece of data**. No footage needed. Reference style: the "Fragments" data reels (question,
map / bar race / unit chart, counter, small source line), translated into weXelerate design.
Worked example: `templates/data-explainer/` (Quantum Reality Check, 65 s, 9:16).

## Structure

1. **Hook**: a question the viewer wants answered ("When will quantum computers break your
   encryption?"). Readable on frame 0, with one animated object (padlock, map, counter).
2. **4–6 data scenes**, one fact each, every one sourced on screen.
3. **The answer / offer**: what weXelerate does about it, built up step by step.
4. **End card**: wordmark, short headline, one CTA (lime pill).

60–70 s is fine for an explainer; every scene must move within 3 s (no dead stretches).

## Look

- **Canvas**: white with a faint hairline grid (`#d9d9d9` at ~55 %, 60 px cells) that drifts
  slowly over the whole video. This is the one sanctioned "pattern" in weXelerate video: it
  is made of hairlines, it is quiet, and it gives charts a surface to sit on.
- **Headline**: Sora 700, 84 px, sentence case, at y ≈ 300. One phrase sits on a highlight
  plate (white text on the theme's highlight colour, 14 px radius).
- **Charts lift in with a soft shadow**: `0 10px 26px rgba(16,32,48,.10), 0 2px 5px
  rgba(16,32,48,.06)` on squares, bars, tiles, chips, the vault, the padlock. Entry: rise
  20–40 px and fade in, `expo.out`. Shadows are neutral navy-tinted, never coloured.
- **Source line** in mono, 28 px, navy at 75 %, under every chart (y ≈ 1400).
- **Header**: black wordmark top left, a mono kicker top right ("QUANTUM · EXPLAINED"),
  both hidden on the end card.
- Margins 110 px left and right; key data above y ≈ 1400 (`formats.md`).

## Colour themes

| Theme | When | Highlight plate | Main data | Second data | Teal | End card |
|---|---|---|---|---|---|---|
| `default` | every weXelerate topic | navy | navy | offwhite `#d9d9d9` | one hint per scene (a marker, a chip) | navy |
| `quantum` | quantum topics only | teal | teal | navy | leads | teal |

Lime appears once: the CTA pill on the end card. Set the theme with `THEME=default node
build.mjs` (the worked example defaults to `quantum`).

## Scene kit (in the template, reuse and recombine)

| Scene | Shows | Good for |
|---|---|---|
| Icon moment | an SVG object that reacts to a word (padlock opens on "break") | the hook |
| Timeline | big year counter + track with dated markers | forecasts, milestones |
| Flow | packets moving into a container, changing state later | processes, risks |
| Unit chart | 10 × 10 squares, "1 square = N", fills on the spoken number, legend with swatches | shares, survey results |
| Range bar | bar grows to a low then a high estimate, dashed / solid markers | market sizes, forecasts |
| Stat tiles | two hairline tiles with a big number and a mono label | proof points |
| Steps | rows of "3× Webinars" with a square per unit | programmes, offers |

## Data rules

- Every number on screen is checked against the **original** source (report, press
  release, official page), not a blog or an AI summary. Our own website can be wrong too:
  the quantum page said "$2T by 2035" where McKinsey says $1.3–2.7T.
- Quote the claim as the source states it ("7 in 10 are working on or planning
  quantum-safe security within five years", not "70 % are prepared").
- Leave out dates that the source states inconsistently.
- Count-ups only where every intermediate value is harmless (squares being counted, years
  on a timeline). Money: show the final figure.

## Timing to the voice

`vo.json` holds the voiceover lines (`lines: [[start, duration], …]`) and the word times per
line (`words`). Every animation is keyed to a word with `cue(line, "word", fallbackFraction)`:
the padlock opens on "break", the squares fill on "7", the bar reaches the high estimate on
"2.7". Scenes run from one line to the next. Generate the voice first, then build.
