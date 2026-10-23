// weXelerate / Future Forward reel builder (HyperFrames).
// Usage: node build.mjs [config.mjs]   → writes index.html, then `npx hyperframes render -o renders/out.mp4`
// All content lives in the config (see config.example.mjs). All times are reel seconds.
import { writeFileSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";

const cfgPath = resolve(process.argv[2] || "config.mjs");
const C = (await import(pathToFileURL(cfgPath).href)).default;

// ---------- formats: canvas + layout anchors + type scale (see references/formats.md)
const FORMATS = {
  "9:16": { w: 1080, h: 1920, top: 250, low: 1060, cap: 1250, s: 1.0, padR: 140 },
  "4:5": { w: 1080, h: 1350, top: 110, low: 700, cap: 1000, s: 0.85, padR: 90 },
  "1:1": { w: 1080, h: 1080, top: 80, low: 540, cap: 800, s: 0.78, padR: 80 },
  "16:9": { w: 1920, h: 1080, top: 80, low: 560, cap: 860, s: 0.8, padR: 640 },
};
const F = FORMATS[C.format || "9:16"];
if (!F) throw new Error(`unknown format ${C.format}; use ${Object.keys(FORMATS).join(", ")}`);

// ---------- brand layers (see references/brand-*.md)
const BRANDS = {
  wexelerate: {
    weight: 700, radius: 14, logo: "logos/wexelerate/wexelerate-white.png", logoH: 64,
    chipBg: "rgba(14,14,14,.42)", chipBorder: "rgba(255,255,255,.34)", chipBlur: "blur(30px) saturate(180%)",
    endBg: "#102030", accent: "#dcff00", upper: false,   // quantum topics: set `theme: "quantum"` for a teal end card
  },
  futureforward: {
    weight: 800, radius: 8, logo: "logos/future-forward/ff-logo-white.png", logoH: 100,
    chipBg: "rgba(0,0,0,.5)", chipBorder: "rgba(255,255,255,.5)", chipBlur: "none",
    endBg: "radial-gradient(120% 75% at 95% 100%, #11264f 0%, #0a1834 30%, #050b1a 55%, #000 80%)", accent: "#dcff00", upper: false,
  },
};
const B = { ...BRANDS[C.brand || "wexelerate"] };
if (C.theme === "quantum" && (C.brand || "wexelerate") === "wexelerate") B.endBg = "#319b8e";
if (!B) throw new Error(`unknown brand ${C.brand}; use wexelerate or futureforward`);
const ASSETS = C.assetsDir || "assets";

const shots = C.shots || [];
const DUR = C.duration;
const END = C.end?.start ?? DUR;
const esc = (t) => String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;");
const words = (t) => esc(t).split(" ").map((w) => `<span class="w"><span>${w}</span></span>`).join(" ");
const linesHtml = (ls) => ls.map(words).join("<br/>");
const isImg = (src) => /\.(jpe?g|png|webp)$/i.test(src);

// ---------- media
const shotHtml = shots.map((s, i) => {
  const id = `shot-${s.id || i}`;  // prefixed: shot ids must never collide with overlay ids
  return isImg(s.src)
    ? `  <div class="clip shot" id="${id}" data-start="${s.start}" data-duration="${s.dur}" data-track-index="1"><div class="push" id="${id}-p"><img class="fill" src="${s.src}" alt="" /></div></div>`
    : `  <div class="shot" id="${id}"><div class="push" id="${id}-p"><video id="${id}-v" class="clip fill" src="${s.src}" playsinline ${s.audio ? `data-has-audio="true" data-volume="${s.volume ?? 1}"` : "muted"} data-start="${s.start}" data-duration="${s.dur}" data-media-start="${s.mediaStart || 0}" data-track-index="${s.audio ? 0 : 1}"></video></div></div>`;
}).join("\n");
const voHtml = (C.voiceover || []).map((v, i) => `  <audio id="vo${i}" src="${v.src}" data-start="${v.start}" data-duration="${v.dur}" data-track-index="${3 + (i % 2)}" data-volume="1"></audio>`).join("\n");

// ---------- overlays
const hook = C.hook;
const hookHtml = hook ? `<div class="ov" id="hook">${hook.kicker ? `<div class="chip mono">${esc(hook.kicker)}</div>` : ""}<div class="h">${linesHtml(hook.lines)}</div>${hook.teaser ? `<div class="chip mono teaser">${esc(hook.teaser)}</div>` : ""}</div>` : "";
const progHtml = (C.progress || []).map((p, i) => `<div class="ov prog" id="prog${i}"><span class="chip mono">${esc(p.text)}</span></div>`).join("\n");
const factHtml = (C.facts || []).map((f, i) => `<div class="ov low" id="fact${i}">${f.kicker ? `<div class="chip mono kick">${esc(f.kicker)}</div>` : ""}<div class="h">${linesHtml(f.lines)}</div>${f.sub ? `<div class="chip mono">${esc(f.sub)}</div>` : ""}</div>`).join("\n");
const ltHtml = (C.lowerThirds || []).map((l, i) => `<div class="ov who" id="who${i}"><b>${esc(l.name)}</b>${l.role ? `<span class="chip mono">${esc(l.role)}</span>` : ""}</div>`).join("\n");
const capHtml = (C.captions || []).map((c, i) => `<div class="cap" id="sub${i}">${esc(c.text).split(" ").map((w) => `<span class="cw">${w}</span>`).join(" ")}</div>`).join("");
const quote = C.quote;
const quoteHtml = quote ? `<div class="ov" id="quote"><div class="h">${quote.lines.map(([, t], i) => `<span class="ln" id="ql${i}">${words(t)}</span>`).join("")}</div></div>` : "";
const urlHtml = C.urlPill ? `<div class="ov" id="url">${C.urlPill.kicker ? `<div class="chip mono kick">${esc(C.urlPill.kicker)}</div>` : ""}<div class="pill">${esc(C.urlPill.text)}</div></div>` : "";
const E = C.end || {};
const partner = E.partnerLogo ? `<span class="sep"></span><img class="partner" src="${E.partnerLogo}" alt="" />` : "";
const endHtml = C.end ? `<div class="ov" id="end">
    <div class="lock"><img class="logo" src="${ASSETS}/${B.logo}" alt="" />${partner}</div>
    <div class="h">${linesHtml(E.headline)}</div>
    ${E.meta ? `<div class="meta chip mono">${esc(E.meta)}</div>` : ""}
    ${E.cta ? `<div class="cta">${esc(E.cta.label)}${E.cta.small ? ` <small>${esc(E.cta.small)}</small>` : ""}</div>` : ""}
  </div>` : "";
const headerHtml = C.headerLogo ? `<div class="ov" id="head"><img src="${ASSETS}/${B.logo}" alt="" /></div>` : "";

const S = (px) => `${Math.round(px * F.s)}px`;
const css = `
@import url("https://fonts.googleapis.com/css2?family=Sora:wght@300;700;800&family=Barlow:wght@400;500&family=JetBrains+Mono:wght@400;500&display=block");
* { margin:0; padding:0; box-sizing:border-box; }
html, body { width:${F.w}px; height:${F.h}px; overflow:hidden; background:#000; }
#root { position:relative; width:100%; height:100%; overflow:hidden; color:#fff; font-family:"Barlow", sans-serif; background:#000; }
.mono { font-family:"JetBrains Mono", monospace; letter-spacing:.08em; text-transform:uppercase; }
.shot, .push { position:absolute; inset:0; overflow:hidden; }
.push { transform-origin:50% 40%; }
.fill { position:absolute; inset:0; width:100%; height:100%; object-fit:cover; }
.ov { position:absolute; opacity:0; visibility:hidden; }
.w { display:inline-block; overflow:hidden; vertical-align:top; padding-bottom:.08em; margin-bottom:-.08em; }
.w > span { display:inline-block; }
.shade-top { position:absolute; left:0; right:0; top:0; height:${Math.round(F.h * 0.4)}px; background:linear-gradient(180deg, rgba(0,0,0,.62), rgba(0,0,0,0)); }
.shade-bot { position:absolute; left:0; right:0; bottom:0; height:${Math.round(F.h * 0.57)}px; background:linear-gradient(0deg, rgba(0,0,0,.78), rgba(0,0,0,0)); }
#flash { position:absolute; inset:0; background:#fff; opacity:0; }
.chip { display:inline-block; font-size:${S(28)}; color:#fff; background:${B.chipBg}; border:1px solid ${B.chipBorder}; border-radius:${B.radius}px; padding:${S(12)} ${S(18)}; -webkit-backdrop-filter:${B.chipBlur}; backdrop-filter:${B.chipBlur}; }
.h { font-family:"Sora", sans-serif; font-weight:${B.weight}; letter-spacing:-.045em; line-height:1.0; text-shadow:0 4px 30px rgba(0,0,0,.35); }
#head { right:${Math.min(F.padR, 140)}px; top:${F.top}px; } #head img { height:${S(58)}; width:auto; }
#hook { left:110px; right:${F.padR}px; top:${F.low - 60 * F.s}px; } #hook .chip { margin-bottom:${S(28)}; } #hook .teaser { margin:${S(28)} 0 0; } #hook .h { font-size:${S(112)}; }
.prog { left:110px; top:${F.top}px; }
.low { left:110px; right:${F.padR}px; top:${F.low}px; } .low .h { font-size:${S(100)}; } .low .chip { margin-top:${S(24)}; } .low .kick { margin:0 0 ${S(24)}; }
.who { left:110px; top:${F.top}px; display:flex; flex-direction:column; gap:12px; } .who b { font-family:"Sora", sans-serif; font-weight:${B.weight}; font-size:${S(72)}; letter-spacing:-.04em; line-height:1; } .who .chip { align-self:flex-start; }
.cap { position:absolute; left:110px; right:${F.padR + 20}px; top:${F.cap}px; font-family:"Sora", sans-serif; font-weight:${B.weight}; font-size:${S(66)}; line-height:1.08; letter-spacing:-.03em; text-shadow:0 4px 24px rgba(0,0,0,.7), 0 2px 4px rgba(0,0,0,.6); opacity:0; visibility:hidden; }
.cw { opacity:.4; }
#quote { left:110px; right:${F.padR}px; top:${F.low - 60 * F.s}px; } #quote .h { font-size:${S(104)}; } #quote .ln { display:block; }
#url { left:110px; top:${F.low - 100 * F.s}px; } #url .kick { margin-bottom:${S(22)}; }
#url .pill, .cta { display:inline-block; background:${B.accent}; color:#000; border-radius:50px; font-family:"Sora", sans-serif; font-weight:800; }
#url .pill { padding:${S(30)} ${S(52)}; font-size:${S(62)}; letter-spacing:-.02em; }
#end { inset:0; display:flex; flex-direction:column; justify-content:center; gap:${S(40)}; padding:0 110px; background:${B.endBg}; }
#end .lock { display:flex; align-items:center; gap:${S(28)}; } #end .logo { height:${S(B.logoH)}; width:auto; }
#end .sep { width:1px; align-self:stretch; background:#d9d9d9; } #end .partner { height:${S(B.logoH)}; width:auto; }
#end .h { font-size:${S(120)}; } #end .meta { align-self:flex-start; background:none; border:0; padding:0; -webkit-backdrop-filter:none; backdrop-filter:none; font-size:${S(28)}; }
.cta { align-self:flex-start; padding:${S(30)} ${S(54)}; font-size:${S(44)}; text-transform:uppercase; } .cta small { font-family:"JetBrains Mono", monospace; font-weight:500; font-size:${S(22)}; letter-spacing:.06em; opacity:.7; margin-left:12px; }
`;

const chapters = shots.filter((s) => s.chapter && s.start > 0).map((s) => s.start);
const tl = {
  shots: shots.map((s, i) => [`shot-${s.id || i}`, s.start, s.dur, !!s.chapter, s.punch || []]),
  facts: (C.facts || []).map((f, i) => [`#fact${i}`, f.from, f.to]),
  prog: (C.progress || []).map((p, i) => [`#prog${i}`, p.from, p.to]),
  who: (C.lowerThirds || []).map((l, i) => [`#who${i}`, l.from, l.to]),
  caps: (C.captions || []).map((c, i) => [`#sub${i}`, c.from, c.to]),
  quote: quote ? quote.lines.map(([t], i) => [`#ql${i}`, t]) : [],
};

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=${F.w}, height=${F.h}" />
<title>${esc(C.title || "video")}</title>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"></script>
<style>${css}</style>
</head>
<body>
<div id="root" data-composition-id="main" data-start="0" data-duration="${DUR}" data-width="${F.w}" data-height="${F.h}" data-fps="30">
${shotHtml}
${voHtml}
  <div class="shade-top"></div>
  <div class="shade-bot"></div>
  ${headerHtml}
  ${hookHtml}
${progHtml}
${factHtml}
${ltHtml}
  ${capHtml}
  ${quoteHtml}
  ${urlHtml}
  ${endHtml}
  <div id="flash"></div>
</div>
<script>
window.__timelines = window.__timelines || {};
document.fonts.ready.then(() => {
  const tl = gsap.timeline({ paused: true });
  const X = "expo.out";
  const T = ${JSON.stringify(tl)};
  const reveal = (sel, t, stagger = 0.06) => { const el = document.querySelectorAll(sel + " .w > span"); if (el.length) tl.fromTo(el, { yPercent: 115 }, { yPercent: 0, duration: 0.45, ease: X, stagger, immediateRender: false }, t); };
  const pop = (el, t) => tl.fromTo(el, { opacity: 0, y: 24, scale: 0.9 }, { opacity: 1, y: 0, scale: 1, duration: 0.35, ease: "back.out(1.8)", immediateRender: false }, t);
  const block = (sel, a, b) => {
    tl.set(sel, { autoAlpha: 1 }, a);
    reveal(sel, a);
    document.querySelectorAll(sel + " .chip").forEach((c, i) => pop(c, a + 0.2 + i * 0.1));
    tl.to(sel, { autoAlpha: 0, duration: 0.15, ease: "power2.in" }, b - 0.15);
  };

  // shots: slow drift; chapter starts punch in; optional punch-ins inside a shot
  T.shots.forEach(([id, s, d, k, punch], i) => {
    const p = "#" + id + "-p";
    tl.fromTo(p, { scale: k ? 1.14 : 1.06 }, { scale: k ? 1.04 : 1.0, duration: k ? 0.5 : d, ease: k ? X : "none", immediateRender: i === 0 }, s);
    if (k) tl.to(p, { scale: 1.0, duration: Math.max(d - 0.5, 0.1), ease: "none" }, s + 0.5);
    punch.forEach(([t, sc]) => tl.to(p, { scale: sc, duration: 0.25, ease: X }, t));
  });
  ${JSON.stringify(chapters)}.forEach((t) => tl.fromTo("#flash", { opacity: 0.3 }, { opacity: 0, duration: 0.18, ease: "power2.out", immediateRender: false }, t));

  ${hook ? `tl.set("#hook", { autoAlpha: 1 }, 0);
  tl.fromTo("#hook .h", { scale: 1.08, transformOrigin: "0% 50%" }, { scale: 1, duration: 1.4, ease: "power2.out" }, 0);
  tl.to("#hook", { autoAlpha: 0, duration: 0.15 }, ${hook.until - 0.15});` : ""}
  ${C.headerLogo ? `tl.set("#head", { autoAlpha: 1 }, ${hook ? hook.until : 0}); tl.to("#head", { autoAlpha: 0, duration: 0.2 }, ${END - 0.2});` : ""}

  T.facts.forEach(([sel, a, b]) => block(sel, a, b));
  T.prog.forEach(([sel, a, b]) => { tl.set(sel, { autoAlpha: 1 }, a); pop(sel + " .chip", a); tl.to(sel, { autoAlpha: 0, duration: 0.15 }, b - 0.15); });
  T.who.forEach(([sel, a, b]) => {
    tl.set(sel, { autoAlpha: 1 }, a);
    tl.fromTo(sel + " b", { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: 0.4, ease: X, immediateRender: false }, a);
    document.querySelectorAll(sel + " .chip").forEach((c) => pop(c, a + 0.15));
    tl.to(sel, { autoAlpha: 0, duration: 0.2 }, b - 0.2);
  });
  // captions: line pops in, words light up evenly across the line (or set words yourself)
  T.caps.forEach(([sel, a, b]) => {
    const ws = document.querySelectorAll(sel + " .cw"), step = (b - a) / ws.length;
    tl.set(sel, { autoAlpha: 1 }, a);
    tl.fromTo(sel, { y: 16, scale: 0.96 }, { y: 0, scale: 1, duration: 0.25, ease: X, immediateRender: false }, a);
    ws.forEach((w, k) => tl.to(w, { opacity: 1, duration: 0.08 }, a + k * step * 0.85));
    tl.set(sel, { autoAlpha: 0 }, b);
  });
  ${quote ? `tl.set("#quote", { autoAlpha: 1 }, ${quote.from});
  T.quote.forEach(([sel, t]) => reveal(sel, t, 0.07));
  tl.to("#quote", { autoAlpha: 0, duration: 0.15 }, ${quote.to - 0.15});` : ""}
  ${C.urlPill ? `tl.set("#url", { autoAlpha: 1 }, ${C.urlPill.from});
  tl.fromTo("#url .pill", { scale: 0.6, opacity: 0, transformOrigin: "0% 50%" }, { scale: 1, opacity: 1, duration: 0.45, ease: "back.out(1.8)", immediateRender: false }, ${C.urlPill.from});
  tl.to("#url", { autoAlpha: 0, duration: 0.2 }, ${C.urlPill.to - 0.2});` : ""}
  ${C.end ? `tl.set("#end", { autoAlpha: 1 }, ${END});
  tl.fromTo("#end", { opacity: 0 }, { opacity: 1, duration: 0.25, immediateRender: false }, ${END});
  tl.fromTo("#end .lock", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.45, ease: X, immediateRender: false }, ${END + 0.05});
  reveal("#end", ${END + 0.2}, 0.07);
  tl.fromTo("#end .meta", { opacity: 0 }, { opacity: 1, duration: 0.4, immediateRender: false }, ${END + 0.8});
  ${E.cta ? `tl.fromTo("#end .cta", { opacity: 0, y: 40, scale: 0.9 }, { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: "back.out(1.6)", immediateRender: false }, ${END + 0.9});` : ""}` : ""}
  tl.to({}, { duration: 0.01 }, ${DUR} - 0.01);

  window.__timelines["main"] = tl;
  tl.seek(0);
});
</script>
</body>
</html>
`;

writeFileSync("index.html", html);
console.log(`index.html: ${C.brand || "wexelerate"} · ${C.format || "9:16"} · ${DUR}s · ${shots.length} shots`);
