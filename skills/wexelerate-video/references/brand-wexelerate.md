# Brand layer: weXelerate

Source of truth: [weXelerate Design System](https://github.com/lisawlf/weXelerate-Design-System)
(`weXelerate-brand-colour-system.md` wins over everything). This file is the video subset.

## Palette (no other colours, ever)

| Token | Hex | In video |
|---|---|---|
| Teal (brand) | `#319b8e` | End card field, brand title cards. Text on teal is **always white** |
| Navy (accent) | `#102030` | Dark title cards, alternative end card |
| Lime (spark) | `#dcff00` | **At most one element per frame**, usually the CTA pill, black text. Never a background, never text |
| Ink | `#0e0e0e` | Dark canvas |
| White | `#ffffff` | Type on footage, teal, navy, ink |
| Offwhite | `#d9d9d9` | Hairlines, secondary meta on dark |

Never: teal text, navy on black, white on lime, the retired navy `#213959`, decorative
gradients. The photo scrim (`linear-gradient(to top, rgba(0,0,0,.82), transparent)`) is the
only gradient.

## Colour weighting in video (decided by the team, Oct 2026)

- **Default weXelerate video**: white, black (`#0e0e0e`) and navy (`#102030`) carry the
  frame. Teal and lime are **hints only**: one teal element per scene at most (a marker, a
  highlight line, one chip), and lime once, on the CTA.
- **Quantum topics only** (Quantum Reality Check, Qubit Founders, anything quantum):
  teal-led. Teal headline highlights, teal data, teal end card.
- End card default: navy `#102030` field with the white wordmark. Quantum: teal field.

## Type

Sora **700** for headlines (not 800), sentence case, negative tracking. Barlow 400 body.
JetBrains Mono uppercase for eyebrows, dates, chips. Never more than two weights of one
family on screen.

## Shapes

Chips and fact plates are **dark glass** (ink-based so they stay legible on bright footage): `rgba(14,14,14,.42)` fill, 1 px
`rgba(255,255,255,.34)` hairline, `backdrop-filter: blur(30px) saturate(180%)`, radius
**14 px**. Pills (CTA) 50 px.

## Logo (`assets/logos/wexelerate/`)

| File | Use |
|---|---|
| `wexelerate-white.png` | Default in video: on footage (over the scrim), on teal, on navy, on ink |
| `wexelerate-black.png` | On white / offwhite only |
| `mark-x-white.png` / `mark-x-black.png` | Small or square spots: corner stamp, last frame, avatar |

- Default lockup: **white wordmark on teal**.
- Unicolour only. No coloured X, no outline, no shadow, no glow, never on lime.
- Never rebuild the wordmark in live type, never stretch.
- Clear space = height of the wordmark on every side. Minimum 120 px wide.

## Co-branding (weXelerate × partner)

Partner logo on the same baseline, separated by a 1 px `#d9d9d9` vertical hairline.
Partner logos render in **one ink** (white on dark, black on light), never in their brand
colours and never inside a white or coloured box. Ask the partner for a transparent
single-colour logo; if only a logo on a white box exists, use the "×" text lockup on a dark
frame instead and flag it.

## Copy

- **No emoji**: not on screen, not in the caption.
- Sentence case everywhere except mono eyebrows.
- Numbers carry the claims ("700+ startups supported", not "world-class ecosystem").
- Dates in mono: `22.10.2026 · 09:00` or `OCT 22, 2026`, middot separators.

## End card (default)

Navy `#102030` field (teal `#319b8e` for quantum topics), white wordmark (or wordmark ×
partner), white Sora 700 headline, venue in mono (`weXelerate Innovation Hub · Vienna`),
optional lime CTA pill.
