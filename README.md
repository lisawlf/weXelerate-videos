# weXelerate videos

Design, rules and tooling for weXelerate and Future Forward videos: event recaps, speaker
reels, interviews, promos and facts reels. Request a video with a form; Claude produces it
with the right brand, voice, spelling and motion design.

## How it works

1. **Request**: open a [video request](../../issues/new?template=video-request.yml). Pick
   the brand, the kind of video and the format, point to the footage on OneDrive, and list
   everyone on screen with the exact spelling of their name and how to say it.
2. **Produce**: whoever is producing opens Claude Code with this plugin installed and says
   *"produce video request #12"*. Claude reads the issue, triages the footage, writes the
   story, builds and renders the video, and checks it against the rules in this repo.
3. **Deliver**: Claude comments on the issue with the file location, what is in the video
   beat by beat, anything it could not verify, and a ready-to-paste caption.
4. **Learn**: when someone corrects a name, a pronunciation or a rule, it goes into this
   repo, so the next video gets it right the first time.

Defaults when the request does not say: **9:16 reel**, weXelerate brand, sound only where a
quoted person speaks, voiceover (if wanted) by the ElevenLabs voice **Ivano**, music added
later in Edits / Instagram.

## Install (producers)

Requirements: [Claude Code](https://claude.com/claude-code), Node 18+, `ffmpeg`, and the
ElevenLabs connector enabled in Claude if you need voiceovers.

```bash
# in Claude Code
/plugin marketplace add lisawlf/weXelerate-videos
/plugin install wexelerate-videos@wexelerate-videos
```

Or clone the repo and open Claude Code inside it; `CLAUDE.md` points it at the skill.

The video engine is [HyperFrames](https://hyperframes.heygen.com) (`npx hyperframes`, no
install needed). Every reel this system grew out of was built with it. Remotion works as
well if you prefer React; the design, copy and voice rules apply unchanged.

## What is in here

```
.github/ISSUE_TEMPLATE/video-request.yml   the request form
skills/wexelerate-video/
  SKILL.md                                 production workflow (start here)
  references/
    design-system.md                       shared motion + type system, building blocks
    data-explainer.md                      animated chart explainers: grid, lift shadows, scene kit, themes
    brand-wexelerate.md                    weXelerate layer: teal, Sora 700, glass chips, logo rules
    brand-future-forward.md                FF layer: acid, Sora 800, 8px boxes, FF logo, copy rules
    formats.md                             9:16 (default), 4:5, 1:1, 16:9 and safe zones
    copy-rules.md                          facts, names, style, post captions
    voice-and-audio.md                     ElevenLabs Ivano, script → lines → timing, loudness, music
    pronunciation.md                       on-screen spelling vs. what the voice is told to say
    footage-triage.md                      transcribe, contact sheets, pick takes, cut a-roll
    interviews.md                          speaker reels, interviews, panels
    hyperframes-notes.md                   tooling, commands, gotchas we hit
    qa-checklist.md                        before every delivery
  templates/reel/                          the reel builder (config → video), all brands and formats
  templates/data-explainer/                data explainer (worked example: quantum), themes default / quantum
  tools/                                   new-project, inventory, transcribe-all, contact-sheet, finalize
  assets/logos/                            weXelerate wordmark + X mark, Future Forward logo + chevrons
```

## Brands at a glance

| | weXelerate | Future Forward |
|---|---|---|
| When | Everything weXelerate, partner and ecosystem videos | Only the FF conference |
| Colour | White, black, navy lead; teal and lime only as hints. Teal-led **only for quantum topics** | Acid `#dcff00` once per frame |
| Headlines | Sora 700, sentence case | Sora 800 |
| Boxes | Dark glass, 14 px radius | 8 px radius |
| End card | Navy field, white wordmark (teal for quantum) | Night-navy gradient, FF logo, acid CTA |
| Emoji | Never | Sparingly, captions only |

Brand sources: [weXelerate Design System](https://github.com/lisawlf/weXelerate-Design-System),
[FF26 Design System](https://github.com/lisawlf/ff26-design-system).

## Never commit

Footage, renders, voiceover files, transcripts, or anything a person has not agreed to make
public. This repository is public. Projects live next to the footage on OneDrive.
