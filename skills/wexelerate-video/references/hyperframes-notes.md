# Tooling notes (HyperFrames, Remotion)

## Why HyperFrames

Every reel this system was built from was made with **HyperFrames**: an HTML page with
`data-*` timing attributes and a paused GSAP timeline, rendered frame by frame to MP4.
The template in `templates/reel/` is a HyperFrames project. Load the `hyperframes` skill
(and `hyperframes-core`) before editing timeline code.

**Remotion** (React) works too if a producer prefers it; the `remotion` skills cover it.
Everything in `design-system.md`, the brand files, copy and voice rules applies unchanged.
Do not mix the two in one project.

## Commands

```bash
node build.mjs config.mjs           # writes index.html from the config
npx hyperframes check               # lint, runtime, layout, contrast; fix errors, read warnings
npx hyperframes snapshot --at 0.2,4.5,9,13 --no-end -o /tmp/snap   # stills to look at
npx hyperframes render -o renders/name.mp4
npx hyperframes preview --background   # Studio preview for the user
```

Renders of ~70 s take 4–6 min. A log line `drawElement self-verify failed` is a fallback,
not a failure; check the file length and a few frames.

## Gotchas we hit

- **Unique ids.** The caption elements were `c0…c4` and so were fact cards; the caption
  timeline then animated the fact cards. The template prefixes every id (`sub`, `fact`,
  `shot`, `prog`).
- **Timed media**: `<video>` carries `data-start`, `data-duration`, `data-media-start`,
  `data-track-index`; the wrapper you animate must not have `data-start`.
- Videos with sound: `data-has-audio="true"`, no `muted`. Everything else `muted`.
- Every `<audio>` needs an `id` or it is silently dropped from the mix.
- `fromTo` tweens on the same element at different times: pass
  `immediateRender: false` to all but the first, or seeking shows the wrong state.
- Shot numbering shifts when you insert a shot; anything addressed by shot index
  (punch-ins) must be re-checked. The template addresses shots by name.
- `contrast` warnings on bright footage: darken the shade gradient, do not add plates.
- Fonts load from Google Fonts; the render waits for `document.fonts.ready`.
