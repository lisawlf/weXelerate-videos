// weXelerate data explainer template. Worked example: "When will quantum break your encryption?" (Quantum Reality Check).
// Copy this folder, keep the scene kit (question headline + one animated data answer per scene), replace the scenes.
// See references/data-explainer.md.
// Style reference: question headline + animated data answer per scene (Fragments-style), in weXelerate design.
// Build: node build.mjs   → index.html. Scene timing comes from vo.json (one entry per voiceover line).
import { readFileSync, writeFileSync, existsSync } from "node:fs";

const W = 1080, H = 1920;

// Colour themes (references/brand-wexelerate.md → Colour weighting):
//  default: every weXelerate topic. White / black / navy lead, ONE teal hint per scene, lime only on the CTA.
//  quantum: quantum topics only. Teal-led.
const THEME = process.env.THEME || "quantum";
const THEMES = {
  default: { hl: "#102030", focus: "#102030", second: "#d9d9d9", hint: "#319b8e", endBg: "#102030" },
  quantum: { hl: "#319b8e", focus: "#319b8e", second: "#102030", hint: "#319b8e", endBg: "#319b8e" },
};
const T = THEMES[THEME];
// Voiceover lines: [start, duration] in reel seconds. Placeholder estimates until the real take exists.
const VO = existsSync("vo.json") ? JSON.parse(readFileSync("vo.json", "utf8")) : {
  lines: [[0.3, 5.0], [6.0, 8.0], [14.6, 6.4], [21.6, 12.6], [34.8, 10.0], [45.4, 11.2], [57.2, 12.4], [70.2, 5.0]],
  words: {},
};
const L = VO.lines;
const GAP = 0.35;
// Scene i runs from its line start (minus a beat) to the next line start.
const SC = L.map(([s], i) => [Math.max(0, s - (i ? 0.45 : 0.3)), i < L.length - 1 ? L[i + 1][0] - 0.45 : s + L[i][1] + 2.6]);
const DUR = +(SC.at(-1)[1]).toFixed(2);
// Word cue: time of a word inside a line, falls back to a fraction of the line.
const cue = (line, word, frac) => {
  const w = (VO.words[line] || []).find((x) => x.t.toLowerCase().startsWith(word));
  return +(w ? L[line][0] + w.s : L[line][0] + L[line][1] * frac).toFixed(2);
};

const words = (t) => t.split(" ").map((w) => `<span class="w"><span>${w}</span></span>`).join(" ");
// Headline with one highlighted phrase: "Before [phrase] after"
const headline = (t) => t.replace(/\[(.+?)\]/, (_, p) => `</span><mark>${p}</mark><span class="pl">`).replace(/^/, '<span class="pl">') + "</span>";

const grid = (id, n, cols) => `<div class="grid" id="${id}" style="grid-template-columns:repeat(${cols}, 1fr)">${Array.from({ length: n }, (_, i) => `<i class="sq" id="${id}-${i}"></i>`).join("")}</div>`;

const css = `
@import url("https://fonts.googleapis.com/css2?family=Sora:wght@400;700&family=Barlow:wght@400;500&family=JetBrains+Mono:wght@400;500&display=block");
:root { --teal:#319b8e; --navy:#102030; --lime:#dcff00; --ink:#0e0e0e; --off:#d9d9d9; --hl:${T.hl}; --focus:${T.focus}; --second:${T.second}; --hint:${T.hint}; --endbg:${T.endBg}; }
* { margin:0; padding:0; box-sizing:border-box; }
html, body { width:${W}px; height:${H}px; overflow:hidden; background:#fff; }
#bg { position:absolute; inset:-60px; background-image:linear-gradient(rgba(217,217,217,.55) 1px, transparent 1px), linear-gradient(90deg, rgba(217,217,217,.55) 1px, transparent 1px); background-size:60px 60px; background-position:-1px -1px; }
#root { position:relative; width:100%; height:100%; overflow:hidden; background:#fff; color:var(--ink); font-family:"Barlow", sans-serif; }
.mono { font-family:"JetBrains Mono", monospace; letter-spacing:.08em; text-transform:uppercase; }
.scene { position:absolute; inset:0; opacity:0; visibility:hidden; }
#brand { position:absolute; left:110px; top:150px; height:34px; width:auto; }
#kick { position:absolute; right:110px; top:150px; font-size:28px; color:var(--navy); }
.hl { position:absolute; left:110px; right:110px; top:300px; font-family:"Sora", sans-serif; font-weight:700; font-size:84px; line-height:1.06; letter-spacing:-.04em; }
.hl mark { background:var(--hl); color:#fff; padding:0 .14em; border-radius:14px; -webkit-box-decoration-break:clone; box-decoration-break:clone; }
.sub { position:absolute; left:110px; right:110px; font-size:28px; color:var(--navy); }
.src { position:absolute; left:110px; right:110px; top:1400px; font-size:28px; color:var(--navy); opacity:.75; }
.big { font-family:"Sora", sans-serif; font-weight:700; letter-spacing:-.05em; line-height:.9; }
.chip { display:inline-block; font-size:28px; border-radius:14px; padding:10px 16px; border:1px solid var(--off); background:#fff; color:var(--ink); }
.chip.teal { background:var(--hint); border-color:var(--hint); color:#fff; }
.chip.navy { background:var(--navy); border-color:var(--navy); color:#fff; }
.w { display:inline-block; overflow:hidden; vertical-align:top; padding-bottom:.08em; margin-bottom:-.08em; } .w > span { display:inline-block; }

/* 1 lock */
#lock { position:absolute; left:50%; top:820px; width:360px; height:460px; margin-left:-180px; }
#lock svg { width:100%; height:100%; overflow:visible; }

/* 2 timeline */
#year { position:absolute; left:110px; top:700px; font-size:230px; color:var(--ink); font-variant-numeric:tabular-nums; }
#track { position:absolute; left:110px; right:110px; top:1080px; height:14px; background:var(--off); border-radius:7px; }
#fill { position:absolute; left:0; top:0; bottom:0; width:0; background:var(--focus); border-radius:7px; }
.tick { position:absolute; top:30px; font-size:28px; color:var(--navy); transform:translateX(-50%); }
.mark { position:absolute; top:-90px; transform:translateX(-50%); display:flex; flex-direction:column; align-items:center; gap:8px; }
.mark .dot { width:30px; height:30px; border-radius:50%; background:#fff; border:5px solid var(--navy); margin-top:4px; }
.mark .chip { white-space:nowrap; }
#mToday .dot { border-color:var(--navy); } #m29 .dot, #m34 .dot { border-color:var(--hint); }
#m29 { top:-150px; } #m34 { top:-90px; transform:translateX(-82%); align-items:flex-end; } #m34 .dot { margin-right:52px; }

/* 3 harvest */
#vault { position:absolute; left:530px; top:780px; width:440px; height:520px; border:2px solid var(--off); border-radius:18px; }
#vault .lbl { position:absolute; left:0; right:0; bottom:-60px; text-align:center; font-size:28px; color:var(--navy); }
.pkt { position:absolute; width:76px; height:76px; border-radius:14px; background:var(--navy); color:#fff; display:flex; align-items:center; justify-content:center; font-size:30px; }
#thief { position:absolute; left:110px; top:950px; font-size:28px; color:var(--navy); }

/* 4 unit chart */
.grid { position:absolute; left:110px; width:560px; top:760px; display:grid; gap:8px; }
.sq { display:block; aspect-ratio:1; border-radius:8px; background:#f0f0f0; border:1px solid var(--off); }
#s4count { position:absolute; left:110px; top:600px; font-size:110px; color:var(--focus); }
#s4count small { font-family:"JetBrains Mono", monospace; font-size:28px; letter-spacing:.08em; color:var(--navy); margin-left:16px; text-transform:uppercase; }
#leg { position:absolute; left:720px; top:760px; display:flex; flex-direction:column; gap:40px; }
#leg .li { display:flex; flex-direction:column; gap:8px; } #leg .sw { width:44px; height:44px; border-radius:8px; display:block; }
#leg b { font-family:"Sora", sans-serif; font-weight:700; font-size:56px; letter-spacing:-.03em; } #leg span { font-size:28px; color:var(--navy); }

/* 5 value */
#val { position:absolute; left:110px; top:640px; font-size:150px; }
#axis { position:absolute; left:110px; right:110px; top:880px; height:440px; border-left:2px solid var(--ink); border-bottom:2px solid var(--ink); }
.yt { position:absolute; left:-2px; width:100%; border-top:1px solid var(--off); font-size:20px; color:var(--navy); }
.yt { font-size:28px; } .yt span { position:absolute; left:12px; top:-38px; }
#vbar { position:absolute; left:300px; width:240px; bottom:0; height:0; background:var(--focus); border-radius:14px 14px 0 0; }
#vlow { position:absolute; left:280px; width:280px; border-top:4px dashed var(--navy); }
#vlow span, #vhigh span { position:absolute; left:296px; top:-20px; font-size:28px; color:var(--navy); white-space:nowrap; }
#vhigh { position:absolute; left:280px; width:280px; border-top:4px solid var(--ink); }

/* 6 austria */
.tile { position:absolute; left:110px; right:110px; height:290px; border:1px solid var(--off); border-radius:18px; padding:40px; }
.tile .big { font-size:150px; color:var(--ink); }
.tile .mono { font-size:28px; color:var(--navy); margin-top:20px; display:block; }
#t1 { top:700px; } #t2 { top:1030px; }

/* 7 program */
.step { position:absolute; left:110px; right:110px; height:140px; display:flex; align-items:center; gap:28px; border-bottom:1px solid var(--off); }
.step .n { font-family:"Sora", sans-serif; font-weight:700; font-size:72px; width:110px; letter-spacing:-.04em; }
.step .lab { font-family:"Sora", sans-serif; font-weight:700; font-size:46px; letter-spacing:-.03em; flex:1; }
.step .sqs { display:flex; gap:10px; } .step .sqs i { width:44px; height:44px; border-radius:8px; background:var(--focus); display:block; }
#free { position:absolute; left:110px; top:1300px; }

.mark, .pkt, #thief, .tile, .step, #free, #vlow, #vhigh, #g4, #s4count, #year, #axis, #lock, #leg .li { opacity:0; }
.lift { box-shadow:0 14px 34px rgba(16,32,48,.12), 0 2px 6px rgba(16,32,48,.08); }
.sq { box-shadow:0 4px 10px rgba(16,32,48,.10); }
#lock svg { filter:drop-shadow(0 18px 30px rgba(16,32,48,.18)); }
.tile, #vault, .pkt, #vbar, .step .sqs i, #track, .chip { box-shadow:0 10px 26px rgba(16,32,48,.10), 0 2px 5px rgba(16,32,48,.06); }
.tile, #vault { background:#fff; }
/* 8 end */
#end { position:absolute; inset:0; background:var(--endbg); color:#fff; display:flex; flex-direction:column; justify-content:center; gap:44px; padding:0 110px 260px; opacity:0; visibility:hidden; }
#end img { height:72px; width:auto; align-self:flex-start; }
#end .big { font-size:100px; }
#end .cta { align-self:flex-start; background:var(--lime); color:var(--ink); border-radius:50px; padding:28px 48px; font-family:"Sora", sans-serif; font-weight:700; font-size:44px; letter-spacing:-.02em; }
#end .meta { font-size:28px; }
`;

const lockSvg = `<svg viewBox="0 0 360 460">
  <path id="shackle" d="M70 210 V130 a110 110 0 0 1 220 0 V210" fill="none" stroke="#0e0e0e" stroke-width="34" stroke-linecap="round"/>
  <g id="body"><rect x="20" y="200" width="320" height="250" rx="22" fill="#102030"/>
  <circle cx="180" cy="305" r="30" fill="#fff"/><rect x="167" y="320" width="26" height="70" rx="10" fill="#fff"/></g>
  <g id="crack" opacity="0"><path d="M180 200 L150 270 L205 320 L160 390 L185 450" fill="none" stroke="#dcff00" stroke-width="0"/></g>
</svg>`;

// timeline geometry: years 2026..2035 across 920px
const yx = (y) => ((y - 2026) / 9) * 860;

const html = `<!doctype html>
<html lang="en"><head><meta charset="UTF-8" /><meta name="viewport" content="width=${W}, height=${H}" />
<title>weXelerate quantum explainer</title>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"></script>
<style>${css}</style></head>
<body>
<div id="root" data-composition-id="main" data-start="0" data-duration="${DUR}" data-width="${W}" data-height="${H}" data-fps="30">
  <div id="bg"></div>
${L.map(([s, d], i) => `  <audio id="vo${i + 1}" src="assets/vo/vo${i + 1}.m4a" data-start="${s}" data-duration="${d}" data-track-index="${1 + (i % 2)}" data-volume="1"></audio>`).join("\n")}

  <img id="brand" src="assets/logos/wexelerate-black.png" alt="weXelerate" />
  <div id="kick" class="mono">Quantum · explained</div>

  <section class="scene" id="s1">
    <h1 class="hl">${headline("When will quantum computers [break your encryption]?")}</h1>
    <div id="lock">${lockSvg}</div>
  </section>

  <section class="scene" id="s2">
    <h1 class="hl">${headline("Today's encryption: [unsafe by 2029].")}</h1>
    <div id="year" class="big">2026</div>
    <div id="track"><div id="fill"></div>
      ${[2026, 2029, 2032, 2035].map((y) => `<div class="tick mono" style="left:${yx(y)}px">${y}</div>`).join("")}
      <div class="mark" id="mToday" style="left:${yx(2026)}px"><span class="chip navy mono">Today</span><i class="dot"></i></div>
      <div class="mark" id="m29" style="left:${yx(2029)}px"><span class="chip teal mono">2029 · Unsafe</span><i class="dot"></i></div>
      <div class="mark" id="m34" style="left:${yx(2034)}px"><span class="chip teal mono">2034 · Fully breakable</span><i class="dot"></i></div>
    </div>
    <div class="src mono">Source: Gartner</div>
  </section>

  <section class="scene" id="s3">
    <h1 class="hl">${headline("[Harvest now], decrypt later.")}</h1>
    <div id="thief" class="mono">Encrypted data<br/>stolen today</div>
    <div id="vault"><div class="lbl mono" id="vlbl">Stored until 2034</div></div>
    ${Array.from({ length: 12 }, (_, i) => `<div class="pkt" id="pk${i}" style="left:${110 + (i % 3) * 92}px; top:${1060 + Math.floor(i / 3) * 92}px">●</div>`).join("")}
    <div class="src mono">Source: Gartner</div>
  </section>

  <section class="scene" id="s4">
    <h1 class="hl">${headline("Who is [getting ready]?")}</h1>
    <div id="s4count" class="big"><span id="s4n">0</span><small>of 1,000 companies</small></div>
    ${grid("g4", 100, 10)}
    <div id="leg"><div class="li"><i class="sw" style="background:${T.focus}"></i><b>7 in 10</b><span class="mono">preparing</span></div><div class="li"><i class="sw" style="background:${T.second}"></i><b>3 in 10</b><span class="mono">ignoring it</span></div></div>
    <div class="src mono" style="top:1400px">1 square = 10 companies · Capgemini 2025</div>
  </section>

  <section class="scene" id="s5">
    <h1 class="hl">${headline("What could quantum be [worth by 2035]?")}</h1>
    <div id="val" class="big"><span class="w"><span>$1.3–2.7T</span></span></div>
    <div id="axis">
      ${[0, 1, 2, 3].map((v) => `<div class="yt mono" style="bottom:${(v / 3) * 100}%"><span>$${v}T</span></div>`).join("")}
      <div id="vbar"></div>
      <div id="vlow" style="bottom:${(1.3 / 3) * 100}%"><span class="mono">Low $1.3T</span></div>
      <div id="vhigh" style="bottom:${(2.7 / 3) * 100}%"><span class="mono">High $2.7T</span></div>
    </div>
    <div class="src mono">Source: McKinsey Quantum Monitor 2026</div>
  </section>

  <section class="scene" id="s6">
    <h1 class="hl">${headline("Austria is a [quantum nation].")}</h1>
    <div class="tile" id="t1"><div class="big">2022</div><span class="mono">Nobel Prize in Physics · Anton Zeilinger</span></div>
    <div class="tile" id="t2"><div class="big">€107M</div><span class="mono">Public funding · Quantum Austria</span></div>
    <div class="src mono" style="top:1370px">Sources: Nobel Foundation · FFG</div>
  </section>

  <section class="scene" id="s7">
    <h1 class="hl">${headline("The [Quantum Reality Check].")}</h1>
    ${[["3×", "Webinars", 3], ["3×", "Roundtables", 3], ["1×", "CEO briefing", 1], ["1×", "Ideation Day", 1]].map(([n, lab, k], i) => `<div class="step" id="st${i}" style="top:${600 + i * 150}px"><span class="n">${n}</span><span class="lab">${lab}</span><span class="sqs">${"<i></i>".repeat(k)}</span></div>`).join("")}
    <div id="free"><span class="chip navy mono">Free of charge · initiated by the FFG</span></div>
    <div class="src mono" style="top:1390px">quantum.wexelerate.com</div>
  </section>

  <div id="end">
    <img src="assets/logos/wexelerate-white.png" alt="weXelerate" />
    <div class="big">${words("Get quantum-ready.")}</div>
    <div class="cta">ecosystem@wexelerate.com</div>
    <div class="meta mono">Quantum Reality Check · weXelerate × FFG</div>
  </div>
</div>
<script>
window.__timelines = window.__timelines || {};
document.fonts.ready.then(() => {
  gsap.set("#val .w > span", { yPercent: 115 });
  const tl = gsap.timeline({ paused: true });
  const X = "expo.out";
  const SC = ${JSON.stringify(SC)};
  const scene = (i) => {
    const [a, b] = SC[i], s = "#s" + (i + 1);
    tl.set(s, { autoAlpha: 1 }, a);
    if (i > 0) tl.fromTo(s + " .hl .pl, " + s + " .hl mark", { yPercent: 40, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.5, ease: X, stagger: 0.08, immediateRender: false }, a);
    if (document.querySelector(s + " .src")) tl.fromTo(s + " .src", { opacity: 0 }, { opacity: 0.75, duration: 0.4, immediateRender: false }, a + 0.6);
    tl.fromTo(s, { scale: 1 }, { scale: 1.025, transformOrigin: "50% 40%", duration: b - a, ease: "none", immediateRender: false }, a);
    tl.to(s, { autoAlpha: 0, duration: 0.25, ease: "power2.in" }, b - 0.25);
    return a;
  };
  const IR = { immediateRender: false };

  // 1 · hook: lock appears, shackle springs open on "break"
  let a = scene(0);
  tl.fromTo("#lock", { scale: 0.85, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.6, ease: "back.out(1.6)", ...IR }, 0.2);
  tl.to("#shackle", { y: -70, rotation: -18, transformOrigin: "290px 210px", duration: 0.45, ease: "back.out(2)" }, ${cue(0, "break", 0.45)});
  tl.to("#lock", { rotation: 6, duration: 0.08, yoyo: true, repeat: 5, ease: "sine.inOut" }, ${cue(0, "break", 0.45)});
  tl.to("#body", { fill: "${T.hint}", duration: 0.3 }, ${cue(0, "break", 0.45)});

  // 2 · timeline: year counts 2026 → 2029 → 2034, track fills
  a = scene(1);
  const yr = { v: 2026 }, drawY = () => (document.getElementById("year").textContent = Math.round(yr.v));
  tl.fromTo("#mToday", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.4, ease: X, ...IR }, a + 0.4);
  tl.fromTo("#year", { opacity: 0 }, { opacity: 1, duration: 0.3, ...IR }, a + 0.3);
  const t29 = ${cue(1, "unsafe", 0.4)}, t34 = ${cue(1, "fully", 0.75)};
  tl.fromTo(yr, { v: 2026 }, { v: 2029, duration: 1.0, ease: "power2.inOut", onUpdate: drawY, ...IR }, t29 - 0.8);
  tl.fromTo("#fill", { width: 0 }, { width: ${yx(2029)}, duration: 1.0, ease: "power2.inOut", ...IR }, t29 - 0.8);
  tl.fromTo("#m29", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.4, ease: "back.out(1.8)", ...IR }, t29 + 0.1);
  tl.to(yr, { v: 2034, duration: 1.2, ease: "power2.inOut", onUpdate: drawY }, t34 - 0.8);
  tl.to("#fill", { width: ${yx(2034)}, duration: 1.2, ease: "power2.inOut" }, t34 - 0.8);
  tl.fromTo("#m34", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.4, ease: "back.out(1.8)", ...IR }, t34 + 0.3);

  // 3 · harvest now: packets fly into the vault, unlock later
  a = scene(2);
  tl.fromTo(".pkt", { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: 0.3, stagger: 0.04, ease: "back.out(2)", ...IR }, a + 0.3);
  tl.fromTo("#thief", { opacity: 0 }, { opacity: 1, duration: 0.3, ...IR }, a + 0.3);
  const steal = ${cue(2, "steal", 0.45)}, later = ${cue(2, "later", 0.85)};
  gsap.utils.toArray(".pkt").forEach((p, i) => tl.to(p, { x: 520 + (i % 3) * 30, y: -240 + Math.floor(i / 3) * 30 + (i % 3) * 8, duration: 0.6, ease: "power3.inOut" }, steal + i * 0.05));
  tl.to(".pkt", { backgroundColor: "${T.hint}", duration: 0.3, stagger: 0.03 }, later);
  tl.set("#vlbl", { textContent: "Readable in 2034" }, later);

  // 4 · unit chart: 70 squares fill teal, 30 navy
  a = scene(3);
  tl.fromTo("#g4", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.5, ease: X, ...IR }, a + 0.2);
  tl.fromTo("#s4count", { opacity: 0 }, { opacity: 1, duration: 0.3, ...IR }, a + 0.3);
  const seven = ${cue(3, "7", 0.35)}, three = ${cue(3, "3", 0.75)};
  const sq = gsap.utils.toArray("#g4 .sq");
  sq.slice(0, 70).forEach((s, i) => tl.to(s, { backgroundColor: "${T.focus}", borderColor: "${T.focus}", duration: 0.12 }, seven - 0.6 + i * 0.02));
  const n4 = { v: 0 };
  tl.fromTo(n4, { v: 0 }, { v: 700, duration: 0.6 + 70 * 0.02, ease: "none", onUpdate: () => (document.getElementById("s4n").textContent = Math.round(n4.v / 10) * 10), ...IR }, seven - 0.6);
  tl.fromTo("#leg .li:nth-child(1)", { opacity: 0, x: 20 }, { opacity: 1, x: 0, duration: 0.35, ease: X, immediateRender: false }, seven + 0.2);
  tl.fromTo("#leg .li:nth-child(2)", { opacity: 0, x: 20 }, { opacity: 1, x: 0, duration: 0.35, ease: X, immediateRender: false }, three);
  sq.slice(70).forEach((s, i) => tl.to(s, { backgroundColor: "${T.second}", borderColor: "${T.second}", duration: 0.12 }, three + i * 0.02));

  // 5 · value: bar grows to the range, markers
  a = scene(4);
  tl.fromTo("#val .w > span", { yPercent: 115 }, { yPercent: 0, duration: 0.5, ease: X, stagger: 0.08, ...IR }, ${cue(4, "2.7", 0.6)});
  tl.fromTo("#axis", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.5, ease: X, ...IR }, a + 0.4);
  tl.fromTo("#vbar", { height: 0 }, { height: "${(1.3 / 3) * 100}%", duration: 1.0, ease: "power3.out", ...IR }, ${cue(4, "mckinsey", 0.25)});
  tl.to("#vbar", { height: "${(2.7 / 3) * 100}%", duration: 1.0, ease: "power3.out" }, ${cue(4, "2.7", 0.6)} - 0.2);
  tl.fromTo("#vlow", { opacity: 0 }, { opacity: 1, duration: 0.3, ...IR }, ${cue(4, "mckinsey", 0.25)} + 0.9);
  tl.fromTo("#vhigh", { opacity: 0 }, { opacity: 1, duration: 0.3, ...IR }, ${cue(4, "2.7", 0.6)} + 0.8);

  // 6 · austria tiles
  a = scene(5);
  tl.fromTo("#t1", { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.5, ease: X, ...IR }, ${cue(5, "nobel", 0.4)} - 0.2);
  tl.fromTo("#t2", { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.5, ease: X, ...IR }, ${cue(5, "107", 0.7)} - 0.4);

  // 7 · program steps build up
  a = scene(6);
  const st = [${cue(6, "webinars", 0.35)}, ${cue(6, "roundtables", 0.5)}, ${cue(6, "briefing", 0.62)}, ${cue(6, "ideation", 0.75)}];
  st.forEach((t, i) => {
    tl.fromTo("#st" + i, { opacity: 0, x: -40 }, { opacity: 1, x: 0, duration: 0.4, ease: X, ...IR }, t - 0.5);
    tl.fromTo("#st" + i + " .sqs i", { scale: 0 }, { scale: 1, duration: 0.3, stagger: 0.08, ease: "back.out(2)", ...IR }, t - 0.3);
  });
  tl.fromTo("#free", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.4, ease: "back.out(1.8)", ...IR }, ${cue(6, "check", 0.3)} + 0.5);

  // 8 · end card
  const e = SC[7][0];
  tl.set("#end", { autoAlpha: 1 }, e);
  tl.to("#brand, #kick", { autoAlpha: 0, duration: 0.2 }, e);
  tl.fromTo("#end", { opacity: 0 }, { opacity: 1, duration: 0.3, ...IR }, e);
  tl.fromTo("#end img", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.45, ease: X, ...IR }, e + 0.05);
  tl.fromTo("#end .big .w > span", { yPercent: 115 }, { yPercent: 0, duration: 0.5, ease: X, stagger: 0.07, ...IR }, e + 0.2);
  tl.fromTo("#end .cta", { opacity: 0, y: 30, scale: 0.9 }, { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: "back.out(1.6)", ...IR }, e + 0.6);
  tl.fromTo("#end .meta", { opacity: 0 }, { opacity: 1, duration: 0.4, ...IR }, e + 0.9);
  tl.fromTo("#end .big, #end .cta", { scale: 1 }, { scale: 1.03, transformOrigin: "0% 50%", duration: ${DUR} - e, ease: "none", ...IR }, e);
  tl.fromTo("#bg", { x: 0, y: 0 }, { x: -30, y: -40, duration: ${DUR}, ease: "none", immediateRender: false }, 0);
  tl.to({}, { duration: 0.01 }, ${DUR} - 0.01);

  window.__timelines["main"] = tl;
  tl.seek(0);
});
</script>
</body></html>
`;
writeFileSync("index.html", html);
console.log(`index.html: theme ${THEME}, ${DUR}s, scenes`, SC.map((s) => s.map((x) => x.toFixed(1)).join("–")).join(" | "));
