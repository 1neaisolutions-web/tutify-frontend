---
name: remotion-video-project
description: Tutify 3m30s cinematic product demo video built with Remotion 4 — structure, file locations, how to run
metadata:
  type: project
---

Tutify product demo video is fully scaffolded at `src/remotion/`.

**Why:** Conference-grade demo video for international event (CEOs, education leaders). Builds on Remotion 4.0.461 (already in package.json).

**Structure:**
- Entry: `src/remotion/index.ts` → `registerRoot` → `Root.tsx` → `TutifyDemo.tsx`
- 26 scene files in `src/remotion/scenes/`
- 7 reusable components in `src/remotion/components/`
- Brand tokens in `src/remotion/theme.ts`
- Config: `remotion.config.ts` at project root

**How to apply:**
- Preview: `yarn remotion:preview` (opens Remotion Studio at localhost:3000)
- Render: `yarn remotion:render`
- HQ render: `yarn remotion:render:hq`
- Audio files go in `public/remotion-assets/` (voiceover.mp3, music.mp3, sfx-master.mp3)
- Veo video clips go in `public/remotion-assets/veo-clips/scene01.mp4` etc.

**Frame math:** 25 scenes × 252 frames + Scene26 × 300 frames − 25 transitions × 12 = 6300 frames (3m30s @ 30fps).

**Key scenes:** Scene04 (Brand Reveal) is the crown jewel — full spring letter animation. Scenes 1/2/3/18/21 use VeoPlaceholder with cinematic fallbacks.

**All TS errors are zero** in remotion/ directory (pre-existing app errors in other files do not affect rendering).
