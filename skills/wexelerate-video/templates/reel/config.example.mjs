// Example config: a weXelerate event recap with voiceover, one soundbite and fact cards.
// Copy to config.mjs, replace everything marked EXAMPLE, then: node build.mjs config.mjs
// All times are reel seconds. Plan the beats first, then fill this in.

export default {
  title: "EXAMPLE recap",
  brand: "wexelerate",          // "wexelerate" | "futureforward"
  format: "9:16",               // "9:16" (default) | "4:5" | "1:1" | "16:9"
  duration: 40.0,
  headerLogo: false,            // small logo top-right after the hook (FF reels often use it)

  // Shots: video or photo. `audio: true` only for clips where a quoted person speaks.
  // `chapter: true` = punch-in + soft flash on this cut. `punch` = [[time, scale]] inside a shot.
  shots: [
    { id: "hook", src: "assets/clips/hook.mp4", start: 0, dur: 3.2, chapter: true },
    { id: "stage", src: "assets/clips/stage.mp4", start: 3.2, dur: 2.6, mediaStart: 0.5, chapter: true },
    { id: "crowd", src: "assets/img/crowd.jpg", start: 5.8, dur: 2.6 },
    { id: "tour", src: "assets/clips/tour.mp4", start: 8.4, dur: 2.6, chapter: true },
    { id: "bite", src: "assets/clips/soundbite.mp4", start: 11.0, dur: 9.0, audio: true, chapter: true, punch: [[15.5, 1.14]] },
    { id: "team", src: "assets/img/team.jpg", start: 20.0, dur: 3.0, chapter: true },
    { id: "close", src: "assets/clips/close.mp4", start: 23.0, dur: 17.0, mediaStart: 0.5 },
  ],

  // Voiceover lines (ElevenLabs, voice Ivano), cut from one take. Never over a soundbite.
  voiceover: [
    { src: "assets/vo/vo1.m4a", start: 0.15, dur: 3.0 },
    { src: "assets/vo/vo2.m4a", start: 3.3, dur: 7.4 },
    { src: "assets/vo/vo3.m4a", start: 20.1, dur: 3.2 },
  ],

  hook: { kicker: "Recap · Insights", lines: ["Inside Day 1", "of EXAMPLE", "Days."], teaser: "3 things worth knowing", until: 3.15 },

  progress: [{ from: 3.3, to: 10.9, text: "01 / 03 · The keynote" }],

  // Fact cards, timed to the voiceover words they illustrate.
  facts: [
    { from: 3.35, to: 5.75, lines: ["EXAMPLE Speaker"], sub: "EXAMPLE role · Company" },
    { from: 5.85, to: 8.35, kicker: "Did you know?", lines: ["EXAMPLE verified", "fact."] },
    { from: 8.5, to: 10.9, kicker: "Hub tour", lines: ["Awi Lifshitz"], sub: "CEO · weXelerate" },
    { from: 20.1, to: 22.9, lines: ["In our ecosystem", "for years."], sub: "EXAMPLE × weXelerate" },
  ],

  lowerThirds: [{ from: 11.2, to: 14.6, name: "EXAMPLE Name", role: "EXAMPLE Company" }],

  // Captions for the soundbite: hand-set lines at breath points.
  captions: [
    { from: 11.3, to: 13.0, text: "EXAMPLE first line" },
    { from: 13.0, to: 15.4, text: "of what they said." },
  ],

  // The best line of the soundbite as full-screen type: [time, line]
  quote: { from: 15.5, to: 19.9, lines: [[15.5, "EXAMPLE best"], [16.3, "line, revealed"], [17.2, "as spoken."]] },

  // urlPill: { from: 18, to: 22, kicker: "Apply now", text: "example.com" },   // only with a real CTA

  end: {
    start: 23.1,
    headline: ["EXAMPLE", "closing line."],
    meta: "weXelerate Innovation Hub · Vienna",
    // partnerLogo: "assets/img/partner-white.png",   // transparent, single-ink (white) only
    // cta: { label: "Apply now", small: "EXAMPLE.COM" }, // one accent element, only with a real CTA
  },
};
