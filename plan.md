# Tutify Demo Video V2 — Master Plan

**Target:** 90-second premium product reel  
**Standard:** Apple / Linear / Stripe product video quality  
**Audience:** School principals, education ministers, non-technical decision-makers  
**Last updated:** 2026-05-15

---

## Emotional Arc

The viewer must feel these five things, in order:

| # | Feeling | Beat |
|---|---------|------|
| 1 | "That's exactly my life." | Beat 01 |
| 2 | "Wait, what's this?" | Beats 02–03 |
| 3 | "Oh." (the click) | Beat 04 |
| 4 | "I want this for my school." | Beats 05–07 |
| 5 | "How do I get it?" | Beats 08–09 |

---

## Visual System — 4 Scene Types

Every beat is assigned one of four visual modes. **Never run more than 2 consecutive beats in the same mode.**

### TYPE A — Quiet Typography
- **Use for:** Emotional / contemplative moments
- **Background:** Warm cream radial gradient `#FFF4E6 → #FAF0E1`
- **Text:** Charcoal `#1A2942`, coral `#FFB69E` accents only where emotionally meaningful
- **Grain overlay:** 4% opacity feTurbulence noise
- **Motion:** Breathing scale (1.0 → 1.005 sine, 4s cycle)
- **Max beats in video:** 2

### TYPE B — Bold Brand Wash
- **Use for:** Brand reveals, emotional peaks
- **Background:** Full-screen diagonal gradient `#2A8EEB → #3B9EFF → #44BFAB → #5DD4B5`
- **Text:** White `#FFFFFF`, secondary at 86% opacity
- **Extras:** Centre glow, corner vignette, noise grain 6%, white particles
- **Camera:** Subtle 1.8% push-in over beat duration

### TYPE C — Product Hero
- **Use for:** Showing the product, feature moments
- **Background:** Pure white `#FFFFFF` or off-white `#FAFBFE`
- **UI elements:** Real-looking cards, input fields, output documents
- **Depth:** Soft drop shadows `0 8px 24px rgba(26,41,66,0.08)`
- **Accents:** Sky blue / mint on interactive elements
- **Camera:** Slow push-in 1–2% for dimensional feel

### TYPE D — Data & Motion
- **Use for:** Stats, proof, impact
- **Background:** Soft cream gradient with depth
- **Numbers:** 280px Sora Bold, each in a different brand colour
- **Extras:** Animated count-up, soft glow under numbers, world map

---

## Colour Palette

| Token | Hex | Use |
|-------|-----|-----|
| `bg` | `#FAFBFE` | Default background (cool white) |
| `bgWarm` | `#FFF8F0` | Warm background (Type A) |
| `bgWarmGradCenter` | `#FFF4E6` | Radial gradient centre |
| `bgWarmGradEdge` | `#FAF0E1` | Radial gradient edge |
| `surface` | `#FFFFFF` | Cards, modals |
| `charcoal` | `#1A2942` | Primary text (never pure black) |
| `muted` | `#6B7A99` | Secondary text |
| `skyBlue` | `#3B9EFF` | Primary accent, CTAs |
| `mint` | `#5DD4B5` | Secondary accent |
| `coral` | `#FFB69E` | Human moments, emotional accents |
| `lavender` | `#B8A9F5` | Admin / structure |

**Rules:**
- Never use `#000000` — always `#1A2942`
- Never use pure `#FFFFFF` for backgrounds — use `#FAFBFE` or `#FFF8F0`
- Sky blue `#3B9EFF` must appear in every beat in some form

---

## Typography

| Role | Font | Weight | Notes |
|------|------|--------|-------|
| Hero numbers | Sora | 700 | 240px+ for dominance |
| Headlines | Sora | 700 | -0.03em tracking |
| Body / taglines | Sora | 500 | 0.01em tracking |
| Subtext | DM Sans | 400 | Cool grey |

**Loaded via:** `@remotion/google-fonts/Sora`  
**Rule:** Larger than you think. Confident. Never small text on screen.

---

## Animation Principles

| Effect | Config |
|--------|--------|
| Spring entrance | `damping: 200, stiffness: 100` (non-bouncy, confident) |
| Spring bounce (landing) | `damping: 20, stiffness: 200` (~4% overshoot) |
| Breathing scale | `1 + 0.005 * sin(frame * 2π/120)` (4s cycle) |
| Exit drift | `translateY -8px + fade`, `cubic-bezier(0.7, 0, 0.84, 0)` |
| Beat transitions | 15-frame white wash in/out via `<BeatTransition>` |
| Camera push-in | `scale(1.0) → scale(1.02–1.07)` over beat duration |

---

## File Structure

```
src/remotion/v2/
├── theme.ts                         ✅ Warm palette tokens
├── TutifyDemoV2.tsx                 ✅ Master composition (Sequence-based)
├── components/
│   ├── SoftCard.tsx                 ✅ White card, soft shadow, rounded corners
│   ├── WarmGlow.tsx                 ✅ Radial gradient glow helper
│   ├── FriendlyIcon.tsx             ✅ Icon wrapper with tinted background
│   ├── AnimatedNumber.tsx           ✅ Count-up with Easing.out(quad)
│   ├── CharacterIllustration.tsx    ✅ 4 flat SVG characters
│   ├── SoftParticles.tsx            ✅ Deterministic upward-drifting particles
│   └── BeatTransition.tsx           ✅ White-wash fade in/out
├── beats/
│   ├── Beat01_Recognition.tsx       ✅ LOCKED — 267 frames
│   ├── Beat02_TheWeight.tsx         🔄 Built, pending lock — 300 frames
│   ├── Beat03_ThePromise.tsx        🔄 Built, pending lock — 300 frames
│   ├── Beat04_MagicMoment.tsx       ⬜ Not started — 360 frames
│   ├── Beat05_NotJustOneThing.tsx   ⬜ Not started — 300 frames
│   ├── Beat06_ThePeople.tsx         ⬜ Not started — 300 frames
│   ├── Beat07_TheProof.tsx          ⬜ Not started — 300 frames
│   ├── Beat08_TheVision.tsx         ⬜ Not started — 300 frames
│   └── Beat09_TheInvitation.tsx     ⬜ Not started — 240 frames
└── assets/
    ├── voiceover.mp3                ⬜ ElevenLabs — pending generation
    ├── music.mp3                    ⬜ Artlist/Epidemic — pending licensing
    └── sfx/                         ⬜ Pending
```

---

## Beat-by-Beat Specification

### Beat 01 — Recognition `[LOCKED]`
- **Type:** A (Quiet Typography)
- **Duration:** 267 frames (~8.9s)
- **Visual:** Three typographic lines on warm cream
- **Timing:**
  - `0–60`: "9 PM." — 240px Sora Bold, `letterSpacing: 0.012em`
  - `66–138`: "The classroom is empty." — 110px
  - `144–267`: "But Sarah is still here." — 130px
    - "Sarah" in coral `#FFB69E`
    - Coral underline draws under "Sarah" only (spring, 24 frames)
- **Entrance:** `scale 0.94 → 1.0`, spring `{damping:18, stiffness:90}`, +12px Y → 0
- **Exit:** Drift -8px + fade, `cubic-bezier(0.7, 0, 0.84, 0)`
- **Extras:** Breathing scale during holds, grain overlay 4%
- **Status:** ✅ LOCKED. Do not modify.

---

### Beat 02 — The Weight `[PENDING LOCK]`
- **Type:** A (Quiet Typography — with emotional progression)
- **Duration:** 300 frames (10s)
- **Visual:** Admin task words drop in with spring physics, pile up
- **Words (in order):**

  | Word | startFrame | finalY | rot | dx |
  |------|-----------|--------|-----|-----|
  | Lesson plans | 22 | 310 | -1.8° | -28 |
  | Worksheets | 57 | 400 | +1.5° | +42 |
  | Grading | 92 | 485 | -2.2° | -18 |
  | Reports | 124 | 568 | +1.8° | +32 |
  | Parent emails | 156 | 648 | -0.8° | -35 |
  | **Teaching** | 215 | 748 | 0° | 0 |

- **Admin words:** 84px Sora Bold, charcoal, `letterSpacing: -0.025em`
- **Teaching:** 62px, coral `#FFB69E`, `scaleY: 0.88`, `opacity: 0.85`, `letterSpacing: -0.035em`
- **Drop spring:** `{damping: 20, stiffness: 200}` — ~4% overshoot landing bounce
- **"Teaching" entrance:** Pending decision — bounce (energetic) OR slow reveal from below (buried)
- **Pending refinement:** Warm coral glow behind the pile, background subtly darkens toward beat end
- **Status:** 🔄 Preview approved. Decide Teaching entrance style. Add coral glow.

---

### Beat 03 — The Promise `[PENDING LOCK]`
- **Type:** B (Bold Brand Wash)
- **Duration:** 300 frames (10s)
- **Visual:** FULL COLOUR SHIFT — sky blue → mint diagonal gradient
- **This is the SUNRISE. The biggest visual contrast in the video.**
- **Layers (back to front):**
  1. Gradient background `135deg, #2A8EEB → #3B9EFF → #44BFAB → #5DD4B5`
  2. Radial centre glow (white, pulsing 0.06 amplitude)
  3. Corner vignette (darkens edges, cinematic depth)
  4. Noise grain 6% (prevents "CSS gradient" look)
  5. White particles (28 count, drift upward)
  6. Soft halo behind wordmark
  7. Tutify wordmark (168px, white, materialises via blur 12→0)
  8. Tagline "Education, reimagined." (46px, 86% white, slides up)
- **Camera:** 1.8% push-in over full beat
- **Wordmark entrance:** Spring `{damping:200, stiffness:100}`, scale 0.88→1.0, blur 12→0
- **Tagline entrance:** 40 frames after wordmark, spring Y +22→0
- **Pending refinement:** Consider increasing wordmark to 200px for conference screen impact
- **Status:** 🔄 Preview approved. Optional: size increase before lock.

---

### Beat 04 — The Magic Moment `[NOT STARTED]`
- **Type:** C (Product Hero)
- **Duration:** 360 frames (12s) — hero beat, longest in video
- **Visual:** Real product UI interaction on pure white
- **This is the HERO of the video. The moment that sells everything.**
- **Sequence:**
  1. Clean white rounded card enters (spring, 16-20px radius, soft shadow)
  2. Input field with blinking cursor
  3. Text types itself: "students who won't stay in their seats" (~8 chars/sec)
  4. Sky-blue Generate button pulses softly
  5. Button "clicks" — satisfying spring compress + release
  6. Below the card: structured output document builds line by line
     - Section headers in sky blue
     - Bullets fade in with 4-frame stagger
     - Visible sections: "Why this works" / "How to implement" / "What to do tomorrow"
  7. Subtle sparkle on document first-appear (one-time, tasteful)
- **Lower-third caption** (frame 270+): "From challenge to classroom — in seconds."
- **Camera:** Slow push-in throughout, parallax depth on card vs background
- **Depth:** Card has `box-shadow: 0 8px 40px rgba(26,41,66,0.12)`, background slightly blurred
- **Status:** ⬜ Not started. Build after Beat 03 locked.

---

### Beat 05 — Not Just One Thing `[NOT STARTED]`
- **Type:** C (Product Hero)
- **Duration:** 300 frames (10s)
- **Visual:** 2×2 grid of elevated feature cards on `#FAFBFE`
- **Cards:**

  | Card | Icon (lucide) | Accent | Title |
  |------|--------------|--------|-------|
  | 1 | FileText | Mint `#5DD4B5` | Worksheets |
  | 2 | Youtube | Coral `#FFB69E` | YouTube Quizzes |
  | 3 | Image | Lavender `#B8A9F5` | Image Studio |
  | 4 | MessageSquare | Sky `#3B9EFF` | AI Assistants |

- **Card spec:** White surface, 20px radius, `box-shadow: 0 4px 24px rgba(26,41,66,0.08)`, subtle top accent border in card colour, 64px icon, 28px Sora Bold title
- **Animation:** Staggered spring entrance (300ms apart), subtle lift + glow ring when VO names each feature
- **Status:** ⬜ Not started.

---

### Beat 06 — The People `[NOT STARTED]`
- **Type:** C (Product Hero with warm tints)
- **Duration:** 300 frames (10s)
- **Visual:** 4 character cards laid down like photos on a table (3D rotate on entrance)
- **Cards:**

  | Role | Background tint | Emoji / Icon | Benefit line |
  |------|----------------|--------------|--------------|
  | Teachers | Mint pastel `#E8F9F5` | 👩‍🏫 | "Hours saved every week" |
  | Students | Sky pastel `#E8F3FF` | 👨‍🎓 | "Engaged and curious" |
  | Parents | Coral pastel `#FFF0EA` | 👨‍👩‍👧 | "Always in the loop" |
  | Schools | Lavender pastel `#F2F0FF` | 🏫 | "In full control" |

- **Card entrance:** 3D Y-axis rotation (rotateY 90° → 0°), spring physics, staggered 18 frames apart
- **Tiny chime sound** synced to each card placement
- **Status:** ⬜ Not started.

---

### Beat 07 — The Proof `[NOT STARTED]`
- **Type:** D (Data & Motion)
- **Duration:** 300 frames (10s)
- **Visual:** Three massive stat numbers on soft cream gradient
- **Stats:**

  | Stat | Number | Colour | Subtitle |
  |------|--------|--------|---------|
  | Left | `10+` | Sky blue `#3B9EFF` | "hours saved weekly" |
  | Centre (slightly larger) | `50+` | Mint `#5DD4B5` | "schools onboarded" |
  | Right | `98%` | Coral `#FFB69E` | "teacher satisfaction" |

- **Number size:** 280px Sora Bold, staggered spring entrance
- **Count animation:** 0 → target, 36 frames, `Easing.out(quad)`
- **Soft colour glow** under each number (`box-shadow: 0 0 80px rgba(color, 0.20)`)
- **Below stats:** World map — white background, soft grey continents, brand-coloured glowing dots appearing in waves
- **Subtle caption** top: "Real impact. Real classrooms." (cool grey, 18px)
- **Status:** ⬜ Not started.

---

### Beat 08 — The Vision `[NOT STARTED]`
- **Type:** A (Quiet Typography — second and final use)
- **Duration:** 300 frames (10s)
- **Visual:** Single powerful quote on warm cream → soft mint gradient
- **Text:** "The next generation of education starts here."
  - 96px Sora Bold, charcoal
  - The words "next generation" use gradient text fill: `linear-gradient(135deg, #3B9EFF, #5DD4B5)`
- **Animation:** Slow fade in (1s), very subtle camera push-in, 2+ second hold
- **Feel:** Apple "Why we make what we make" — calm, confident, slightly emotional
- **Status:** ⬜ Not started.

---

### Beat 09 — The Invitation `[NOT STARTED]`
- **Type:** B (Bold Brand Wash — second and final use)
- **Duration:** 240 frames (8s)
- **Visual:** Full-screen sky blue gradient — the brand's final impression
- **Layout (top to bottom):**
  1. Tutify wordmark — white, 140px (slightly smaller than Beat 03)
  2. "Education, reimagined." — white 88% opacity, 38px
  3. "Book a Demo" button — white rounded pill, sky blue text, soft shadow, gentle pulse animation
  4. `www.tutify.co` — white 60% opacity, 22px
- **Background:** Same gradient system as Beat 03
- **Particles:** Same white particles, slightly slower drift
- **Hold:** Final 2 seconds completely still — the frame that lives in memory
- **Status:** ⬜ Not started.

---

## Composition Timeline

```
Frame    0 –  267  Beat 01 Recognition    TYPE A  267f  ~8.9s
Frame  267 –  567  Beat 02 The Weight     TYPE A  300f  10.0s
Frame  567 –  867  Beat 03 The Promise    TYPE B  300f  10.0s
Frame  867 – 1227  Beat 04 Magic Moment   TYPE C  360f  12.0s  ← longest
Frame 1227 – 1527  Beat 05 Features Grid  TYPE C  300f  10.0s
Frame 1527 – 1827  Beat 06 The People     TYPE C  300f  10.0s
Frame 1827 – 2127  Beat 07 The Proof      TYPE D  300f  10.0s
Frame 2127 – 2427  Beat 08 The Vision     TYPE A  300f  10.0s
Frame 2427 – 2667  Beat 09 The Invitation TYPE B  240f   8.0s
─────────────────────────────────────────────────────────────
TOTAL                                           2667f  88.9s
```

*15-frame white-wash transitions are embedded within each beat's `<BeatTransition>` — they do not add to the total.*

---

## Audio Plan

### Voiceover
- **Service:** ElevenLabs (paid tier)
- **Recommended voice:** "Rachel" (warm female) or "Adam" (warm male)
- **Style:** NPR narrator — warm, thoughtful, conversational. Not excited.
- **Settings:** Stability 50–60%, Similarity 75%, Style Exaggeration 20–30%, Speaker Boost ON
- **Full script (140 words):**

  > It's 9 PM. The classroom is empty. But Sarah is still here.
  >
  > Lesson plans. Worksheets. Grading. Reports. Parent emails.
  > And somewhere in there — actually teaching.
  >
  > What if all of it — every lesson, every worksheet, every insight —
  > lived in one place. Built for teachers. Built for schools.
  >
  > Type one sentence. Get a complete teaching plan.
  >
  > Worksheets that adapt. Quizzes from any YouTube video. Visuals on
  > demand. AI tutors built for the classroom.
  >
  > Teachers save hours. Students learn better. Parents stay connected.
  > Schools stay in control.
  >
  > Already trusted by educators across the world. Already saving teachers
  > up to ten hours every single week.
  >
  > Tutify isn't just another tool. It's how the next generation of
  > education works.
  >
  > Tutify. Education, reimagined. Visit tutify dot co.

### Background Music
- **Genre:** Modern minimal acoustic / cinematic-lite
- **Mood:** Warm, hopeful, uplifting — NOT corporate
- **Search terms (Artlist / Epidemic Sound):** "Hopeful Acoustic Story", "Bright Beginnings", "Tomorrow's Promise"
- **Volume:** 18–22% under voiceover
- **Arc:** Gentle build through video, peaks at Beat 08, resolves at Beat 09

### Sound Design (all SFX should be felt, not heard)
| Beat | SFX |
|------|-----|
| 02 | Soft "drop" sounds as words land (wooden block feel) |
| 03 | Soft chime as gradient reveals |
| 04 | Keyboard typing (premium soft), satisfying click, gentle sparkle |
| 05 | Four subtle "place" sounds as cards appear |
| 06 | Tiny soft chimes as character cards lay down |
| 07 | Soft data-ping for each stat reveal |
| 08 | Subtle warm pad swell (subliminal) |
| 09 | Gentle UI completion chime, then soft hold |

---

## Execution Order

Work beat by beat. Show one frame preview per beat. Get approval before the next.

- [x] **Step 1** — theme.ts (warm palette tokens)
- [x] **Step 2** — All 7 reusable components (SoftCard, WarmGlow, FriendlyIcon, AnimatedNumber, CharacterIllustration, SoftParticles, BeatTransition)
- [x] **Step 3** — Beat 01 Recognition (TYPE A) → LOCKED
- [x] **Step 4** — Beat 02 The Weight (TYPE A) → Previewed, pending lock
- [x] **Step 5** — Beat 03 The Promise (TYPE B) → Previewed, pending lock
- [ ] **Step 6** — Decide Beat 02 final details (Teaching entrance style, coral glow), lock Beat 02
- [ ] **Step 7** — Optional: Increase Beat 03 wordmark to 200px, lock Beat 03
- [ ] **Step 8** — Beat 04 Magic Moment (TYPE C) — product UI hero
- [ ] **Step 9** — Beat 05 Features Grid (TYPE C)
- [ ] **Step 10** — Beat 06 The People (TYPE C)
- [ ] **Step 11** — Beat 07 The Proof (TYPE D)
- [ ] **Step 12** — Beat 08 The Vision (TYPE A)
- [ ] **Step 13** — Beat 09 The Invitation (TYPE B)
- [ ] **Step 14** — Sequence review: render Beats 1–9 as continuous preview, verify visual variety
- [ ] **Step 15** — Audio integration (voiceover + music + SFX sync)
- [ ] **Step 16** — Final render: 1920×1080, H.264, AAC, 30fps

---

## Render Commands

```bash
# Preview single frame (Beat N, frame F in global timeline)
npx remotion still --public-dir=out TutifyDemoV2 out/previews/frame.png --frame=F

# Open Remotion Studio for real-time scrubbing
npx remotion studio

# Render full video (after all beats locked)
npx remotion render TutifyDemoV2 out/TutifyDemoV2.mp4
```

---

## Quality Benchmarks

Before any beat is locked, it must pass all 6 tests:

1. **Attention test** — Could a tired principal watch this without losing interest?
2. **Recognition test** — In the first 10 seconds, does a teacher feel "this is about me"?
3. **Clarity test** — Could a non-technical administrator explain Tutify after one viewing?
4. **Emotion test** — Does the ending feel like "yes, this should exist" (quiet confidence, not hype)?
5. **Approachability test** — Works for both a 60-year-old superintendent AND a 25-year-old teacher?
6. **Brand test** — Strip the logo. Is the visual language still cohesive and premium?

**The standard we're holding:** When the video ends, the room should be quiet for half a second before the applause. That half-second is the goal.

---

## Hard Rules (Never Break)

### Never
- ❌ Dark navy or black backgrounds
- ❌ Cosmic / space / sci-fi aesthetics  
- ❌ Glassmorphism
- ❌ Scenes longer than 12 seconds
- ❌ More than 3 lines of text on screen simultaneously
- ❌ Voiceover sentences longer than 15 words
- ❌ "AI particle clouds" or generic tech motion graphics
- ❌ Stock business music
- ❌ Pure `#000000` text
- ❌ Pure `#FFFFFF` backgrounds
- ❌ More than 2 consecutive beats in the same visual type

### Always
- ✅ Warm white or pastel backgrounds
- ✅ Breathing scale on all held moments (subliminal, 0.5% amplitude)
- ✅ `#3B9EFF` sky blue present in every beat
- ✅ Spring physics for organic motion (not CSS transitions)
- ✅ Hold final frames 0.5–1s longer than feels comfortable
- ✅ `box-shadow` on every card/button (soft, warm, never harsh)
- ✅ Camera push-in on every static beat (1–2%, barely perceptible)
- ✅ Paper grain texture (4–6% opacity) on every scene
