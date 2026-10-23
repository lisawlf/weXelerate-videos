# Formats

9:16 is the default. The template supports all four below via `format` in the config;
it rescales type and moves the layout anchors.

| Format | Size | For | Layout anchors (top chip / lower block / captions) | Type scale |
|---|---|---|---|---|
| `9:16` | 1080×1920 | Reels, Stories, TikTok, Shorts | 250 / 1060 / 1250 | 1.00 |
| `4:5` | 1080×1350 | Instagram & LinkedIn feed | 110 / 700 / 1000 | 0.85 |
| `1:1` | 1080×1080 | LinkedIn, feed | 80 / 540 / 800 | 0.78 |
| `16:9` | 1920×1080 | YouTube, website, event screens, long interviews | 80 / 560 / 860 | 0.80 |

## Safe zones

- **9:16**: Meta's Reels safe zone is 14 % top, 35 % bottom, 6 % each side (≈ 269 / 672 /
  65 px). Our house margins: **110 px left and right**, headlines below y = 270, key data
  above y ≈ 1400, nothing important in the bottom-right corner (like / comment / share
  rail). Organic captions cover less than ads, so y 1250–1400 is fine for secondary text
  such as source lines.
- **4:5 and 1:1**: 72 px margin all round; the feed crops nothing, but the UI overlays the
  bottom 10 %.
- **16:9**: 80 px margin. Captions centred in the lower third, max 2 lines, max ~42
  characters per line.

## Shooting for several formats

When a request asks for several formats, build the 9:16 first, then re-render with
`format` changed and check every snapshot. The template **fills and crops** every shot to
the canvas: vertical phone footage in 16:9 keeps only a horizontal band, and faces get cut.
For 16:9 deliverables ask for horizontally shot footage (or shoot both). If only vertical
footage exists, build a dedicated side-by-side layout (vertical video left, type right)
instead of shipping cropped faces.
