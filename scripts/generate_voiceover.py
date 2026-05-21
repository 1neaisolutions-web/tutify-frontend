"""
Tutify Demo — Conference-Grade Voiceover Generator
Voice: en-US-AvaMultilingualNeural | Rate: -8% | Pitch: -2%
Apple keynote pacing, SSML-controlled delivery
Concatenation: raw binary MP3 merge (no pydub required)
"""

import asyncio
import os
import sys

try:
    import edge_tts
except ImportError:
    print("edge-tts not found. Run: python -m pip install edge-tts")
    sys.exit(1)

# ── Config ──────────────────────────────────────────────────────────────────
VOICE       = "en-US-AvaMultilingualNeural"
BACKUP_VOICE = "en-US-AndrewMultilingualNeural"
OUT_DIR     = os.path.join("public", "remotion-assets", "voiceover")
MASTER_OUT  = os.path.join("public", "remotion-assets", "voiceover.mp3")
SILENCE_MS  = 800   # gap between scenes in master file

# ── SSML scenes (25 scenes, all with SSML prosody + breaks) ─────────────────
SCENES = [
    # 01 — Empathetic, documentary tone
    (1, """<speak version="1.0" xml:lang="en-US">
  <voice name="en-US-AvaMultilingualNeural">
    <prosody rate="-10%" pitch="-2%">
      Every day, <break time="200ms"/> millions of teachers
      <break time="200ms"/> stay long after the bell
      <break time="300ms"/> — drowning in admin,
      <break time="200ms"/> paperwork, <break time="200ms"/>
      and burnout.
    </prosody>
  </voice>
</speak>"""),

    # 02 — Concerned, building emotional weight
    (2, """<speak version="1.0" xml:lang="en-US">
  <voice name="en-US-AvaMultilingualNeural">
    <prosody rate="-8%" pitch="-2%">
      Students are drifting. <break time="500ms"/>
      Parents are left in the dark. <break time="600ms"/>
      The old system <break time="200ms"/> is quietly failing
      <break time="200ms"/> everyone it was built for.
    </prosody>
  </voice>
</speak>"""),

    # 03 — Serious, institutional concern
    (3, """<speak version="1.0" xml:lang="en-US">
  <voice name="en-US-AvaMultilingualNeural">
    <prosody rate="-8%" pitch="-2%">
      Principals lose visibility. <break time="400ms"/>
      Schools lose control. <break time="500ms"/>
      Fragmented tools <break time="200ms"/>
      and <emphasis level="moderate">unmanaged AI</emphasis>
      <break time="200ms"/> are creating new risks
      <break time="200ms"/> every day.
    </prosody>
  </voice>
</speak>"""),

    # 04 — The turning point — slow, weighted, hopeful
    (4, """<speak version="1.0" xml:lang="en-US">
  <voice name="en-US-AvaMultilingualNeural">
    <prosody rate="-15%" pitch="-1%">
      It's time <break time="300ms"/> for something different.
      <break time="800ms"/>
      It's time for <emphasis level="strong">Tutify</emphasis>.
    </prosody>
  </voice>
</speak>"""),

    # 05 — Confident brand introduction
    (5, """<speak version="1.0" xml:lang="en-US">
  <voice name="en-US-AvaMultilingualNeural">
    <prosody rate="-8%" pitch="-1%">
      <emphasis level="strong">Tutify</emphasis>
      <break time="200ms"/> is the AI platform
      <break time="200ms"/> built for intelligent education
      <break time="400ms"/> — one ecosystem connecting everyone
      <break time="300ms"/> who shapes a child's future.
    </prosody>
  </voice>
</speak>"""),

    # 06 — Steady infrastructure confidence
    (6, """<speak version="1.0" xml:lang="en-US">
  <voice name="en-US-AvaMultilingualNeural">
    <prosody rate="-8%" pitch="-1%">
      From <emphasis level="moderate">global organizations</emphasis>,
      <break time="300ms"/>
      to <emphasis level="moderate">individual schools</emphasis>,
      <break time="300ms"/>
      to every single educator
      <break time="400ms"/> — governed, <break time="200ms"/>
      secure, <break time="200ms"/> and built for scale.
    </prosody>
  </voice>
</speak>"""),

    # 07 — Product announcement — milestone moment
    (7, """<speak version="1.0" xml:lang="en-US">
  <voice name="en-US-AvaMultilingualNeural">
    <prosody rate="-8%" pitch="-1%">
      And today, <break time="400ms"/>
      the first pillar of Tutify <break time="200ms"/> is
      <emphasis level="strong">live</emphasis>
      <break time="400ms"/> — the
      <emphasis level="strong">Teacher Assistant</emphasis>.
      <break time="600ms"/>
      Every tool a modern teacher needs,
      <break time="300ms"/> in one unified space.
    </prosody>
  </voice>
</speak>"""),

    # 08 — Problem → Solution beat
    (8, """<speak version="1.0" xml:lang="en-US">
  <voice name="en-US-AvaMultilingualNeural">
    <prosody rate="-8%" pitch="-1%">
      Worksheets used to take hours.
      <break time="500ms"/>
      Now they take <emphasis level="strong">seconds</emphasis>.
      <break time="600ms"/>
      Tutify generates personalized, <break time="200ms"/>
      classroom-ready worksheets <break time="200ms"/>
      from a single idea.
    </prosody>
  </voice>
</speak>"""),

    # 09 — Feature variety, confident list cadence
    (9, """<speak version="1.0" xml:lang="en-US">
  <voice name="en-US-AvaMultilingualNeural">
    <prosody rate="-8%" pitch="-1%">
      Mixed question types. <break time="400ms"/>
      Multiple difficulty levels. <break time="400ms"/>
      Print-ready or digital
      <break time="400ms"/> — every worksheet shaped
      <break time="200ms"/> to every learner.
    </prosody>
  </voice>
</speak>"""),

    # 10 — Conversational hook
    (10, """<speak version="1.0" xml:lang="en-US">
  <voice name="en-US-AvaMultilingualNeural">
    <prosody rate="-8%" pitch="-1%">
      Take one real classroom challenge
      <break time="400ms"/> — students who won't stay in their seats.
      <break time="600ms"/>
      One sentence in.
    </prosody>
  </voice>
</speak>"""),

    # 11 — Payoff — wow moment
    (11, """<speak version="1.0" xml:lang="en-US">
  <voice name="en-US-AvaMultilingualNeural">
    <prosody rate="-8%" pitch="-1%">
      Out comes a complete, <break time="200ms"/>
      classroom-ready strategy
      <break time="400ms"/> — with rationale, <break time="200ms"/>
      implementation steps, <break time="200ms"/>
      and real teaching wisdom.
      <break time="500ms"/>
      In <emphasis level="strong">seconds</emphasis>.
    </prosody>
  </voice>
</speak>"""),

    # 12 — Relatable YouTube hook
    (12, """<speak version="1.0" xml:lang="en-US">
  <voice name="en-US-AvaMultilingualNeural">
    <prosody rate="-8%" pitch="-1%">
      Everyone already watches YouTube. <break time="500ms"/>
      Tutify turns it into a safe, <break time="200ms"/>
      intelligent learning engine
      <break time="400ms"/> — nature, <break time="200ms"/>
      space, <break time="200ms"/> world cultures,
      <break time="200ms"/> science, <break time="200ms"/>
      history.
    </prosody>
  </voice>
</speak>"""),

    # 13 — Technical capability, confident
    (13, """<speak version="1.0" xml:lang="en-US">
  <voice name="en-US-AvaMultilingualNeural">
    <prosody rate="-8%" pitch="-1%">
      Our algorithm recommends what's right for your region
      <break time="400ms"/> — and lets teachers explore
      <break time="200ms"/> across cultures
      <break time="300ms"/> with one tap.
    </prosody>
  </voice>
</speak>"""),

    # 14 — Educational truth
    (14, """<speak version="1.0" xml:lang="en-US">
  <voice name="en-US-AvaMultilingualNeural">
    <prosody rate="-8%" pitch="-1%">
      Students learn better <break time="200ms"/>
      when they see, <break time="300ms"/> not just read.
      <break time="500ms"/>
      <emphasis level="strong">Image Studio</emphasis>
      <break time="200ms"/> generates beautiful classroom visuals
      <break time="200ms"/> from a single prompt.
    </prosody>
  </voice>
</speak>"""),

    # 15 — Differentiation — strong confidence
    (15, """<speak version="1.0" xml:lang="en-US">
  <voice name="en-US-AvaMultilingualNeural">
    <prosody rate="-8%" pitch="-1%">
      Generic AI <break time="200ms"/>
      gives <emphasis level="moderate">generic</emphasis> answers.
      <break time="600ms"/>
      Tutify gives teachers a team of
      <emphasis level="strong">subject-expert</emphasis>
      AI assistants <break time="400ms"/>
      — built for the curriculum, <break time="200ms"/>
      governed for the classroom.
    </prosody>
  </voice>
</speak>"""),

    # 16 — Every learner matters
    (16, """<speak version="1.0" xml:lang="en-US">
  <voice name="en-US-AvaMultilingualNeural">
    <prosody rate="-8%" pitch="-1%">
      Every teacher, <break time="200ms"/> every student
      <break time="200ms"/> is different.
      <break time="500ms"/>
      Tutify understands region, <break time="200ms"/>
      background, <break time="200ms"/>
      learning style, <break time="200ms"/>
      and institutional context
      <break time="400ms"/> — instantly.
    </prosody>
  </voice>
</speak>"""),

    # 17 — Adaptive intelligence payoff
    (17, """<speak version="1.0" xml:lang="en-US">
  <voice name="en-US-AvaMultilingualNeural">
    <prosody rate="-8%" pitch="-1%">
      And AI builds an adaptive learning path
      <break time="400ms"/> — for every teacher, <break time="200ms"/>
      every student, <break time="200ms"/> every classroom.
      <break time="500ms"/>
      Personalization that
      <emphasis level="strong">finally scales</emphasis>.
    </prosody>
  </voice>
</speak>"""),

    # 18 — Visionary — founder conviction
    (18, """<speak version="1.0" xml:lang="en-US">
  <voice name="en-US-AvaMultilingualNeural">
    <prosody rate="-12%" pitch="-2%">
      Tutify is not just another platform.
      <break time="700ms"/>
      It is the
      <emphasis level="strong">next era of education</emphasis>
      <break time="500ms"/>
      — a unified, <break time="200ms"/>
      protected, <break time="200ms"/>
      intelligent ecosystem.
    </prosody>
  </voice>
</speak>"""),

    # 19 — AI and humanity bridge
    (19, """<speak version="1.0" xml:lang="en-US">
  <voice name="en-US-AvaMultilingualNeural">
    <prosody rate="-10%" pitch="-2%">
      A bridge <break time="300ms"/>
      between artificial intelligence
      <break time="300ms"/> and human-centered teaching
      <break time="500ms"/>
      — where technology serves the teacher,
      <break time="400ms"/> not the other way around.
    </prosody>
  </voice>
</speak>"""),

    # 20 — Enterprise confidence
    (20, """<speak version="1.0" xml:lang="en-US">
  <voice name="en-US-AvaMultilingualNeural">
    <prosody rate="-8%" pitch="-1%">
      With enterprise-grade privacy, <break time="200ms"/>
      multi-tier governance, <break time="200ms"/>
      and full institutional control
      <break time="400ms"/> — built in <break time="300ms"/>
      from day one.
    </prosody>
  </voice>
</speak>"""),

    # 21 — Warm payoff
    (21, """<speak version="1.0" xml:lang="en-US">
  <voice name="en-US-AvaMultilingualNeural">
    <prosody rate="-9%" pitch="-1%">
      The result <break time="500ms"/>
      — teachers reclaim hours.
      <break time="400ms"/>
      Students stay engaged. <break time="400ms"/>
      Parents stay connected.
      <break time="500ms"/>
      And learning <break time="300ms"/>
      finally works the way it should.
    </prosody>
  </voice>
</speak>"""),

    # 22 — Numbers carry weight
    (22, """<speak version="1.0" xml:lang="en-US">
  <voice name="en-US-AvaMultilingualNeural">
    <prosody rate="-8%" pitch="-1%">
      Up to <emphasis level="strong">ten hours</emphasis>
      <break time="200ms"/> saved every week.
      <break time="500ms"/>
      Strong early adoption.
      <break time="500ms"/>
      Real teachers, <break time="200ms"/>
      real results
      <break time="400ms"/> — already in classrooms today.
    </prosody>
  </voice>
</speak>"""),

    # 23 — Momentum, movement
    (23, """<speak version="1.0" xml:lang="en-US">
  <voice name="en-US-AvaMultilingualNeural">
    <prosody rate="-8%" pitch="-1%">
      Educators, <break time="200ms"/> schools, <break time="200ms"/>
      and entire districts <break time="300ms"/>
      are joining the movement.
      <break time="600ms"/>
      The future of learning
      <break time="200ms"/> is being written
      <break time="400ms"/> — <emphasis level="strong">right now</emphasis>.
    </prosody>
  </voice>
</speak>"""),

    # 24 — Brand statement — slow, declarative
    (24, """<speak version="1.0" xml:lang="en-US">
  <voice name="en-US-AvaMultilingualNeural">
    <prosody rate="-12%" pitch="-2%">
      This is <emphasis level="strong">Tutify</emphasis>.
      <break time="700ms"/>
      The AI-powered <break time="200ms"/>
      unified education system.
    </prosody>
  </voice>
</speak>"""),

    # 25 — The invitation — emotional closing
    (25, """<speak version="1.0" xml:lang="en-US">
  <voice name="en-US-AvaMultilingualNeural">
    <prosody rate="-13%" pitch="-2%">
      Be part of the journey.
      <break time="700ms"/>
      Help shape the future of education
      <break time="400ms"/> — for the
      <emphasis level="strong">next generation</emphasis>.
    </prosody>
  </voice>
</speak>"""),
]


# ── Generator ────────────────────────────────────────────────────────────────
async def generate_scene(scene_num: int, ssml: str, voice: str = VOICE) -> str:
    path = os.path.join(OUT_DIR, f"scene-{scene_num:02d}.mp3")
    try:
        communicate = edge_tts.Communicate(ssml, voice)
        await communicate.save(path)
        size = os.path.getsize(path)
        print(f"  [OK] scene-{scene_num:02d}.mp3  ({size // 1024} KB)")
        return path
    except Exception as e:
        print(f"  [FAIL] scene-{scene_num:02d} FAILED: {e}")
        # Retry with backup voice
        if voice == VOICE:
            print(f"    → Retrying with backup voice {BACKUP_VOICE}...")
            return await generate_scene(scene_num, ssml, BACKUP_VOICE)
        raise


async def main():
    os.makedirs(OUT_DIR, exist_ok=True)

    print(f"\n[MIC] Tutify Voiceover Generator")
    print(f"   Voice : {VOICE}")
    print(f"   Output: {OUT_DIR}/")
    print(f"   Scenes: {len(SCENES)}\n")

    # Generate all scenes
    paths = []
    for scene_num, ssml in SCENES:
        path = await generate_scene(scene_num, ssml)
        paths.append(path)

    print(f"\n[DONE] All {len(SCENES)} scenes generated.\n")

    # Concatenate into master file — raw binary MP3 merge (no pydub needed)
    # MP3 is a streaming format; binary concat produces a valid playable file.
    print("[LINK] Building master voiceover.mp3 ...")
    total_bytes = 0
    with open(MASTER_OUT, "wb") as master_file:
        for path in paths:
            with open(path, "rb") as f:
                data = f.read()
                master_file.write(data)
                total_bytes += len(data)

    size_kb = total_bytes // 1024
    print(f"  [OK] {MASTER_OUT}  ({size_kb} KB)\n")

    print("─" * 60)
    print("Next steps:")
    print("  1. Drop music.mp3 into public/remotion-assets/")
    print("  2. Uncomment <Audio> lines in src/remotion/TutifyDemo.tsx")
    print("  3. Run: yarn remotion:preview")
    print("─" * 60)


if __name__ == "__main__":
    asyncio.run(main())
