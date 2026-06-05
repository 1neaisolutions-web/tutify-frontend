---
name: TutifyV9-75s
overview: Create Remotion V9 (fps=60) that preserves the full V6 storyboard content while retiming each major section to fit within a 75-second premium SaaS launch film, with unique advanced transitions per section.
todos:
  - id: scaffold-v9-composition
    content: Add `TutifyDemoV9` Remotion composition at `fps={60}` and `durationInFrames={4500}` in `src/remotion/Root.tsx`; create `src/remotion/v9/Root.tsx` wiring the full V6 scene list.
    status: pending
  - id: v9-timeline-frames
    content: "Create `src/remotion/v9/timeline/sceneDurations.ts` with per-scene frame targets that sum to 4500 (per major section targets: 480/300/240/720/480/600/480/600/360/240)."
    status: pending
  - id: frame-scale-context
    content: Implement V9 frame scaling helpers (e.g. `useV9ScaledFrame`) so V9 scene subtrees can replace `useCurrentFrame()` with a scaled frame derived from `OLD_SCENE_FRAMES / NEW_SCENE_FRAMES`.
    status: pending
  - id: retime-each-scene-subtree
    content: "Duplicate required V6 scene modules into `src/remotion/v9/*` and update them to use the scaled frame hook (ensuring typing/reveal/motion completes within each V9 scene duration). Scenes to cover: TeachingIntro, EducationChangingSlide, TeachersOverwhelmed, Scene02_Vision, Scene03_Introduction, Scene04_AITeacherIntro, Scene04_AIAssistant, Scene05_ImageStudioIntro, Scene05_VisualStudio, Scene06_YouTubeStudioIntro, Scene06_YouTube, Scene07_PersonalizationIntro, Scene07_Personalization, Scene07b_LearningHub, Scene08_Ecosystem, Scene10_Closing."
    status: pending
  - id: chapter-transition-upgrades
    content: "Within each major section’s V9 scene subtree, strengthen the creative-direction transition style: parallax/DOF + kinetic chaos cards (Opening), morphing typography + magnetic pills + particle handoff (Vision), glass/liquid logo reveal (Meet), live UI simulation/workflow (AI Teacher), canvas expansion/progressive build (AI Image), URL paste scan + neural/data stream + structured quiz assembly (YouTube), dashboard intelligence + flowing connections + morph (Personalization), vertical path building + interactive quiz + ceremonial certificate (LearningHub), network energy + enterprise badges + merge (Ecosystem), cinematic finale + typewriter tagline (Closing)."
    status: pending
  - id: reanchor-audio-sfx
    content: Port V6 music volume curve + SFX trigger schedules into V9, but re-anchor trigger windows to the V9 frame offsets so typing/data/card sounds still land on the correct beats.
    status: pending
  - id: render-and-time-check
    content: Render `TutifyDemoV9` and verify total duration <= 75 seconds at 60fps; then review chapter-by-chapter for truncation, readability, and transition uniqueness.
    status: pending
isProject: false
---

## Scope
- Add a new Remotion composition `TutifyDemoV9` (fps=60) without deleting any V6 scenes/features/messages/workflows.
- Preserve the full V6 storyboard narrative continuity: problem → solution → ecosystem → closing.
- Retiming goal: total duration <= 75s (75s target pacing beats provided), while maintaining high-end readability.

## Target timing (fps=60)
Total = `4500` frames.
- Opening + Problem Setup (TeachingIntro + EducationChangingSlide + TeachersOverwhelmed): `480f`
- Vision / Turning Point (Scene02_Vision): `300f`
- Meet Tutify (Scene03_Introduction): `240f`
- AI Teacher Assistant (Scene04_AITeacherIntro + Scene04_AIAssistant): `720f`
- AI Image Studio (Scene05_ImageStudioIntro + Scene05_VisualStudio): `480f`
- YouTube Fun Studio (Scene06_YouTubeStudioIntro + Scene06_YouTube): `600f`
- Personalization (Scene07_PersonalizationIntro + Scene07_Personalization): `480f`
- Learning Hub (Scene07b_LearningHub): `600f`
- Connected Ecosystem (Scene08_Ecosystem): `360f`
- Closing (Scene10_Closing): `240f`

## Implementation approach
1. **New V9 entrypoint + composition**
   - Create `src/remotion/v9/Root.tsx` exporting `TutifyDemoV9`.
   - Add `<Composition id="TutifyDemoV9" component={TutifyDemoV9} durationInFrames={4500} fps={60} ... />` to `src/remotion/Root.tsx`.

2. **Scene retiming without cutting content**
   - Create a small V9 frame-scaling utility that all V9 scene/subcomponents use instead of `useCurrentFrame()`.
   - For each V9 scene wrapper, compute `frameScale = OLD_SCENE_FRAMES / NEW_SCENE_FRAMES` using the V6 exported durations (e.g. `TEACHING_INTRO_V6_DURATION`, `EDUCATION_SLIDE_V6_DURATION`, `SCENE05_DURATION`, etc.).
   - Inside the V9 scene subtree, use `scaledFrame = useCurrentFrame() * frameScale` so all existing word/typing/reveal timings stay coherent while the scene occupies the new `durationInFrames`.

3. **Unique advanced transition style per major section**
   - Ensure each major section’s *entry/exit choreography* matches your creative direction by updating the relevant scene-level assets:
     - Opening: enhance parallax depth + DOF/blur ramp and kinetic chaos-card choreography.
     - Vision: morphing typography feel (already word-by-word reveal); add magnetic/particle handoff into next scene.
     - Meet Tutify: premium lockup via glass + liquid/shape morph entry.
     - AI Teacher Assistant: tighten UI-simulation cadence; connect workflow steps; auto-layout expansion behavior.
     - AI Image Studio: canvas expansion + progressive reveal build-up; premium preset interactions.
     - YouTube Fun Studio: URL paste scan visualization + neural/data-stream analysis; structured quiz assembly.
     - Personalization: dashboard intelligence animation with flowing connections and morph transitions.
     - Learning Hub: vertical content-flow path building; responsive quiz interaction feel; ceremonial certificate.
     - Connected Ecosystem: network-building energy lines; smooth 3D-like role carousel; enterprise-grade badges; cinematic merge.
     - Closing: strongest brand lockup + elegant typewriter for `The self-learning support OS` (already defined in `ClosingScene/constants.ts`).

4. **Audio/SFX continuity**
   - Copy V6 audio behavior (music curve + keyboard/data/card SFX trigger windows) into V9, but re-anchor trigger times to the new V9 timeline frame offsets.

5. **Verification**
   - Render `TutifyDemoV9` and confirm exact duration: <= 75 seconds.
   - Spot-check each major section for readability (typing speed, word reveals, quiz/certificate progression) and ensure no scene content is truncated.

## Key files (where changes will concentrate)
- Composition wiring:
  - `[src/remotion/Root.tsx]` (add `TutifyDemoV9` composition)
  - `src/remotion/v9/Root.tsx` (new)
- Timing constants:
  - `src/remotion/v6/timeline/sceneRhythm.ts` (reference pacing tiers)
  - `src/remotion/v6/timeline/sceneDurations.ts` (reference old durations)
  - `src/remotion/v9/timeline/*` (new per-section frame map for 4500 frames)
- Example “pinning” constant already matching your requested copy:
  - `src/remotion/v6/scenes/ClosingScene/constants.ts` exports `FINALE_TAGLINE = 'The self-learning support OS'`.

## Notes on transition variety
- The V6 storyboard already uses many visually distinct components (masked typewriters, kinetic scattered cards, network graph merge, etc.). V9 will preserve these visuals while (a) retiming them to the 75-second plan and (b) adding/strengthening the specific transition flavors you listed so every major section reads as a different “chapter” in a single cohesive SaaS launch film.

## Rollout
- Implement as new `v9/*` files first; do not delete or downgrade V6.
- Once V9 renders within 75 seconds and visually matches the chapter transition direction, we can optionally fine-tune micro-timing (easing/settles) per scene boundary.
