export type SegmentAssetMap = {
  segmentId: string
  uiMockups: string[]
  alphaMasks: string[]
  overlays: string[]
}

export const launchAssetsMap: SegmentAssetMap[] = [
  {
    segmentId: 'bootPrompt',
    uiMockups: ['commandPanel', 'inputField', 'cursorGlyph'],
    alphaMasks: ['inputFieldRevealMask'],
    overlays: ['introGlowGradient'],
  },
  {
    segmentId: 'workflowBuilder',
    uiMockups: ['workflowCanvas', 'nodeCards', 'connectorLines'],
    alphaMasks: ['nodeGrowMasks', 'connectorDrawMasks'],
    overlays: ['lateralMotionBlur'],
  },
  {
    segmentId: 'dataProcessing',
    uiMockups: ['progressRail', 'progressFill', 'statusLabels'],
    alphaMasks: ['progressBarMask'],
    overlays: ['counterTickOverlay'],
  },
  {
    segmentId: 'moduleShowcase',
    uiMockups: ['ticketCard', 'automationCard', 'insightsCard', 'settingsCard'],
    alphaMasks: ['cardEntranceMasks'],
    overlays: ['cardDepthShadowOverlay'],
  },
  {
    segmentId: 'unifiedFlow',
    uiMockups: ['pipelineCards', 'flowConnectors', 'outcomePanel'],
    alphaMasks: ['stageRevealMasks'],
    overlays: ['panGuidanceLightSweep'],
  },
  {
    segmentId: 'brandClose',
    uiMockups: ['brandLockup', 'valueText', 'ctaButton'],
    alphaMasks: ['brandResolveMask'],
    overlays: ['ctaPulseGlow'],
  },
]

