export type LaunchSegment = {
  id: string
  startFrame: number
  durationInFrames: number
  visualFocus: string
  transition: string
  motionEffect: 'Scale' | 'Slide' | 'Masking' | 'Mixed'
}

export const launchSegments: LaunchSegment[] = [
  {
    id: 'bootPrompt',
    startFrame: 0,
    durationInFrames: 300,
    visualFocus: 'Hero AI command panel with cursor-first typewriter reveal',
    transition: 'Fade-up from near-white with micro zoom-in',
    motionEffect: 'Scale',
  },
  {
    id: 'workflowBuilder',
    startFrame: 300,
    durationInFrames: 300,
    visualFocus: 'Workflow builder module with node branches and connectors',
    transition: 'Lateral slide handoff with directional blur decay',
    motionEffect: 'Mixed',
  },
  {
    id: 'dataProcessing',
    startFrame: 600,
    durationInFrames: 300,
    visualFocus: 'Horizontal loading bar synchronized with live percentage counter',
    transition: 'Vertical parallax lift from workflow to analytics strip',
    motionEffect: 'Masking',
  },
  {
    id: 'moduleShowcase',
    startFrame: 900,
    durationInFrames: 300,
    visualFocus: 'High-fidelity module cards for tickets, automation, insights, settings',
    transition: 'Staggered card entrance with momentum continuity',
    motionEffect: 'Mixed',
  },
  {
    id: 'unifiedFlow',
    startFrame: 1200,
    durationInFrames: 300,
    visualFocus: 'Unified input-to-outcome pipeline with stage connectors',
    transition: 'Camera zoom-out then guided horizontal pan',
    motionEffect: 'Slide',
  },
  {
    id: 'brandClose',
    startFrame: 1500,
    durationInFrames: 300,
    visualFocus: 'Brand lockup, value proposition, and CTA',
    transition: 'System converges to center into brand frame',
    motionEffect: 'Scale',
  },
]

