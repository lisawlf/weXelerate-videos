# Data explainer template

Worked example: **"When will quantum computers break your encryption?"**, a 65 s weXelerate
explainer for the Quantum Reality Check (8 scenes, voice Ivano). Read
`../../references/data-explainer.md` first.

## Use it

1. Copy this folder next to your project (`tools/new-project.sh` gives you `assets/logos`;
   copy `build.mjs` and `hyperframes.json` from here).
2. Write the script: one line per scene, every name through `references/pronunciation.md`.
3. Generate the voiceover (one take), transcribe it, cut it into `assets/vo/vo1.m4a …`, and
   write `vo.json` (see `vo.example.json`): line start/duration in the reel, plus word
   times per line.
4. Replace the scene sections and their timeline blocks with your topic. Keep the
   structure: question headline (`[highlighted phrase]`), one data answer, a source line.
5. `THEME=default node build.mjs` (non-quantum) or `node build.mjs` (quantum),
   `npx hyperframes check`, snapshot every scene, render, `tools/finalize.sh`.
