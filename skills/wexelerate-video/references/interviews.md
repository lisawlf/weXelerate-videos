# Interviews, panels, talking heads

The person is the story. Design carries what they say; it never competes with their face.

## Speaker reel (one person, 25–40 s, 9:16)

1. Transcribe all takes; mark every complete, strong sentence.
2. **Cold open** on the strongest line (as full-screen type over the speaker).
3. Introduce them: name in Sora + role chip in mono, top left, 3–4 s.
4. 2–3 beats of substance, each one sentence, best take each.
5. Close on their call to action in their own words, then the end card.
6. Same location throughout if possible. Hide jump cuts by alternating framing
   (1.0 → 1.12–1.2) between segments.
7. At most one or two 1-second cutaways (b-roll) where the speaker names something
   visual. The face is the hook; do not bury it.

## Interview / panel cut (several people)

- One lower third per person, the first time they speak only.
- Order soundbites to build an argument, not in recording order.
- Translate faithfully when the language differs; subtitles in English unless asked.
- If interviewer questions are needed, show them as a mono chip ("Q · What surprised you?")
  instead of keeping the interviewer's audio.
- Long-form (16:9, minutes long): chapter cards every topic, captions optional burned-in
  (deliver an `.srt` too: `npx hyperframes transcribe <file> --to srt`).

## Captions

- Word-lit captions on every spoken line (see `design-system.md`).
- Line breaks by breath, max 4–6 words per line in 9:16.
- Correct spelling of names and brands in captions even when the speaker mispronounces.
- Do not caption filler ("um", "you know") unless it carries meaning.

## Audio

- Speech at -16 LUFS before the master, master at -14 LUFS.
- Remove room noise only if it hurts intelligibility; do not over-process voices.
- No music under the speaker in the file; the poster adds it in the app.
