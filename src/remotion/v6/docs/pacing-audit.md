# TutifyDemoV6 — Pacing Audit (from V4 baseline)

Scored 1 (weak) – 5 (strong). Target tier drives `timeline/sceneRhythm.ts` holds.

| # | Scene | Tier | Attention | Transition | Type | V6 action |
|---|--------|------|-----------|------------|------|-----------|
| 00 | Teaching Intro | opening | 4 | 4 | 5 | Keep composition timing |
| 01 | Education Changing | opening | 4 | 4 | 5 | Keep |
| 02 | Teachers Overwhelmed | emotional | 4 | 5 | 5 | Keep; eased close → Vision |
| 03 | Vision | emotional | 4 | 4 | 5 | +0.5s hold line 2 (255f) |
| 04 | Meet Tutify | emotional | 4 | 3 | 4 | Keep 360f; add crossfade to AI intro |
| 05 | AI Teacher intro | feature-intro | 3 | 3 | 4 | Trim 210f; FeatureIntroBeat |
| 06 | AI Assistant demo | feature-demo | 3 | 4 | 4 | Trim 306f; faster beats |
| 07 | Image Studio intro | feature-intro | 4 | 4 | 5 | Keep 204f |
| 07b | PixGen demo | feature-demo | 3 | 4 | 4 | Trim 408f |
| 08 | YouTube intro | feature-intro | 4 | 4 | 5 | Cumulative tagline ~212f (Image Studio pattern) |
| 08b | YouTube quiz | feature-demo | 4 | 4 | 4 | ~381f; hero quiz hold; looped keyboard |
| 10 | Personalization intro | feature-intro | 3 | 4 | 4 | Trim 300f |
| 10b | Personalization demo | feature-demo | 3 | 4 | 4 | Trim 538f; cameraPush |
| 10c | Learning Hub | feature-demo | 2 | 4 | 4 | Trim 652f (~25%) |
| 11 | Ecosystem | ecosystem | 4 | 4 | 5 | Trim 486f; eased merge |
| 12 | Closing | closing | 5 | 5 | 5 | Keep finale typewriter hold |

## QA frame checkpoints

- f0–150: Opening trilogy handoffs (no white flash)
- Teachers local 198–252: highlight → eased close
- Vision enter: crossfade from Teachers
- YouTube intro: full tagline readable ≥1.5s
- Closing: full "The self-learning support OS" + 52f hold before fade
