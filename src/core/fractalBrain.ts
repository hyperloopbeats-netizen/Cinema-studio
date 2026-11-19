export type StudioViewMode = 'movie' | '3d';
export type UpscaleTier = 'off' | '8k' | '16k' | '64k';
export type FrameGuideMode = 'off' | '2.39' | '2.35' | 'thirds';
export type LutPresetId = 'neutral' | 'kodak2383' | 'tealAmber' | 'bleachBypass' | 'noirSilver';
export type CinemaAspectRatio = '2.39' | '2.35' | '1.85' | '16:9' | '4:3';
export type RealTvProfile = 'crt' | 'trinitron' | 'oled' | 'vhs';
export type SceneThemeId = 'obsidianAmber' | 'solarReactor' | 'neonBroadcast' | 'emeraldMatrix' | 'crimsonNoir';
export type CartoonStyleId = 'celAnime' | 'noirInk' | 'popComic' | 'microFractalToon';
export type LiquidPresetId = 'mercuryChrome' | 'moltenAmber' | 'ferrofluidObsidian' | 'iridescentPlasma' | 'liquidGlass';
export type CynthetocModeId = 'adaptiveDirector' | 'neuralSupersample' | 'syntheticRelight' | 'kineticPulse';
export type StereoscopicModeId =
  | 'anaglyphRedCyan'
  | 'amberBlueColorCode'
  | 'pulfrichAnalog'
  | 'sideBySide'
  | 'interlacedField';
export type AppShapeTopologyId =
  | 'sphere'
  | 'torus'
  | 'mobiusRibbon'
  | 'cube'
  | 'octaPrism'
  | 'cone';
export type LiquidBrainFusionMode = 'orbitalArray' | 'fusedHybrid';
export type HologramRigMode =
  | 'pepperGhostPyramid'
  | 'volumetricSliceStack'
  | 'liquidGlassPrism'
  | 'floatingCausticField';

export interface ColorGradingState {
  exposure: number;
  contrast: number;
  saturation: number;
  temperature: number;
  tint: number;
  highlightRolloff: number;
  lut: LutPresetId;
}

export interface CinemaModeConfig {
  aspectRatio: CinemaAspectRatio;
  filmGrain: number;
  halation: number;
  gateWeave: number;
  cadence24p: boolean;
}

export interface RealTvModeConfig {
  enabled: boolean;
  profile: RealTvProfile;
  scanlines: number;
  curvature: number;
  chromaBleed: number;
  phosphorBloom: number;
  channelOsd: boolean;
  safeGuides: boolean;
  channelNumber: number;
}

export interface SceneDesignerConfig {
  theme: SceneThemeId;
  fractalComplexity: number; // 2 to 8 rings
  gridDepth: number; // 0.0 to 1.0
  sweepIntensity: number; // 0.0 to 1.0
  atmosphereBlend: number; // 0.0 to 1.0 (blends scene atmosphere over video too)
  motionSpeed: number; // 0.2 to 2.5
}

export interface VideoToCartoonConfig {
  enabled: boolean;
  style: CartoonStyleId;
  quantizeLevels: number; // 2 to 10
  edgeStrength: number; // 0.0 to 1.0
  inkThickness: number; // 0.5 to 3.0
  colorBoost: number; // 0.5 to 2.0
  halftone: number; // 0.0 to 1.0
}

export interface FusionLinksConfig {
  sceneToCones: boolean;
  cartoonToLiquid: boolean;
  cspToOptics: boolean;
  tvToPhosphor: boolean;
  autopilotToAll: boolean;
}

export interface FusionMatrixConfig {
  enabled: boolean;
  autoMaximize: boolean;
  synergyGain: number; // 0.0 to 2.0
  coherencePct: number; // 0 to 100
  pulseDepth: number; // 0.0 to 1.0
  links: FusionLinksConfig;
}

export interface Liquified3dConfig {
  enabled: boolean;
  fluidPreset: LiquidPresetId;
  viscosity: number; // 0.1 to 1.0
  refraction: number; // 0.0 to 1.0
  chromeFresnel: number; // 0.0 to 1.0
  rippleForce: number; // 0.0 to 1.0
  liquidScreenOptical: boolean;
  solidGeometry: boolean;
  autoOrbit: boolean;
  pulseEnergy: number; // transient burst decayed smoothly
}

export interface CynthetocAiConfig {
  enabled: boolean;
  mode: CynthetocModeId;
  autonomy: number; // 0.0 to 1.0
  synthesisStrength: number; // 0.0 to 1.0
  neuralDenoise: number; // 0.0 to 1.0
  relightIntensity: number; // 0.0 to 1.0
  kineticSync: boolean;
  lastDirective: string;
}

export interface Stereoscopic3dConfig {
  enabled: boolean;
  mode: StereoscopicModeId;
  interaxial: number; // 0.0 to 1.0
  convergence: number; // -1.0 to 1.0
  analogCrosstalk: number; // 0.0 to 0.4
  depthSynthesis: number; // 0.0 to 1.0
}

export interface LiquidBrainConfig {
  enabled: boolean;
  shape: AppShapeTopologyId;
  projectedApps: string[];
  fusionMode: LiquidBrainFusionMode;
  fusedBlend: number; // 0.0 to 1.0
  morphFactor: number; // 0.0 to 1.0
  twistAngle: number; // -2.0 to 2.0
  explodeRadius: number; // 0.0 to 1.0
  fluidPressure: number; // 0.1 to 1.0
  synapseViscosity: number; // 0.1 to 1.0
}

export interface HolographicProjectionConfig {
  enabled: boolean;
  rigMode: HologramRigMode;
  sliceCount: number; // 3 to 16 volumetric focal planes
  glassRefraction: number; // 0.0 to 1.0 liquid glass index dispersion
  reflectionMix: number; // 0.0 to 1.0 main image specular reflection weight
  chromaticSplit: number; // 0.0 to 1.0 RGB Cauchy prism dispersion
  parallaxDepth: number; // 0.0 to 1.0 floating depth relief
  scanlineCoherence: number; // 0.0 to 1.0 interference fringe scanlines
  causticFocus: number; // 0.0 to 1.0 liquid glass caustic convergence
  baseElevation: number; // 0.4 to 2.2 hover elevation above liquid basin
  autoRotate: boolean;
}

export interface TimelineMarker {
  id: string;
  time: number;
  label: string;
}

export interface AbLoopState {
  enabled: boolean;
  a: number | null;
  b: number | null;
}

export interface FractalAppModule {
  id: string;
  name: string;
  order: number;
  registeredAt: number;
  fused: boolean;
  fusedAt: number | null;
  role: string;
  config: Record<string, unknown>;
}

export interface SovereignDaemon {
  id: string;
  name: string;
  tier: 'CORE' | 'OPTICS' | 'INTELLIGENCE' | 'SUSTAIN';
  status: 'ACTIVE' | 'MAXIMIZED' | 'SUSTAINING' | 'SYNCED' | 'IDLE';
  ticks: number;
  lastTickAt: number;
  loadPct: number;
  efficiencyPct: number;
  boostFactor: number;
  telemetry: Record<string, string | number | boolean>;
}

export interface FractalBrainEvent {
  id: number;
  ts: number;
  name: string;
  payload: unknown;
}

export interface FractalStudioState {
  mode: StudioViewMode;
  playing: boolean;
  muted: boolean;
  volume: number;
  loop: boolean;
  subtractMode: boolean;
  anamorphicSqueeze: boolean;
  anamorphicFlare: number;
  upscaleMode: UpscaleTier;
  upscaleResolution: string;
  theatreView: boolean;
  realFpsMode: boolean;
  fps: number;
  frameTimeMs: number;
  targetCapHz: number;
  frameGuide: FrameGuideMode;
  grading: ColorGradingState;
  cinema: CinemaModeConfig;
  realTv: RealTvModeConfig;
  sceneDesigner: SceneDesignerConfig;
  videoToCartoon: VideoToCartoonConfig;
  fusionMatrix: FusionMatrixConfig;
  liquified3d: Liquified3dConfig;
  cynthetocAi: CynthetocAiConfig;
  stereoscopic: Stereoscopic3dConfig;
  liquidBrain: LiquidBrainConfig;
  holographic: HolographicProjectionConfig;
  mediaSourceName: string;
  mediaType: 'procedural' | 'video' | 'image';
  duration: number;
  currentTime: number;
  abLoop: AbLoopState;
  markers: TimelineMarker[];
  stage3d: {
    coneMultiplier: number;
    cspThermalPhase: number;
    screenCurvature: number;
    cameraPreset: 'audience' | 'booth' | 'origin' | 'free';
  };
}

export interface StudioCommandPayload {
  mode?: StudioViewMode;
  playing?: boolean;
  muted?: boolean;
  loop?: boolean;
  subtractMode?: boolean;
  anamorphicSqueeze?: boolean;
  anamorphicFlare?: number;
  upscaleMode?: UpscaleTier;
  theatreView?: boolean;
  realFpsMode?: boolean;
  frameGuide?: FrameGuideMode;
  resetGrading?: boolean;
  maximizeSystem?: boolean;
  triggerLiquidPulse?: boolean;
  grading?: Partial<ColorGradingState>;
  cinema?: Partial<CinemaModeConfig>;
  realTv?: Partial<RealTvModeConfig>;
  sceneDesigner?: Partial<SceneDesignerConfig>;
  videoToCartoon?: Partial<VideoToCartoonConfig>;
  fusionMatrix?: Partial<FusionMatrixConfig>;
  liquified3d?: Partial<Liquified3dConfig>;
  cynthetocAi?: Partial<CynthetocAiConfig>;
  stereoscopic?: Partial<Stereoscopic3dConfig>;
  liquidBrain?: Partial<LiquidBrainConfig>;
  holographic?: Partial<HolographicProjectionConfig>;
  projectHologram?: boolean;
  stage3d?: Partial<FractalStudioState['stage3d']>;
  seekSeconds?: number;
  addMarkerLabel?: string;
  abLoop?: Partial<AbLoopState>;
}

type EventHandler = (payload: unknown, snapshot: FractalBrainSnapshot) => void;

export interface FractalBrainSnapshot {
  version: string;
  bootTime: number;
  uptimeMs: number;
  state: FractalStudioState;
  apps: FractalAppModule[];
  daemons: SovereignDaemon[];
  recentEvents: FractalBrainEvent[];
}

export interface FractalBrainAPI {
  version: string;
  registerApp: (id: string, meta?: { name?: string; role?: string }) => FractalAppModule;
  fuseApp: (id: string, config?: Record<string, unknown>) => FractalAppModule;
  set: (keyOrPatch: string | Partial<FractalStudioState>, value?: unknown) => FractalStudioState;
  get: <K extends keyof FractalStudioState>(key: K) => FractalStudioState[K];
  setLiquid8k: (enabled: boolean) => void;
  setLiquid16k: (enabled: boolean) => void;
  setLiquid64k: (enabled: boolean) => void;
  setTheatreView: (enabled: boolean) => void;
  setRealFpsMode: (enabled: boolean) => void;
  setRealTvMode: (enabled: boolean, profile?: RealTvProfile) => void;
  setSceneDesigner: (patch: Partial<SceneDesignerConfig>) => void;
  setVideoToCartoon: (patch: Partial<VideoToCartoonConfig>) => void;
  setFusionMatrix: (patch: Partial<FusionMatrixConfig>) => void;
  setLiquified3d: (patch: Partial<Liquified3dConfig>) => void;
  setCynthetocAi: (patch: Partial<CynthetocAiConfig>) => void;
  setStereoscopic: (patch: Partial<Stereoscopic3dConfig>) => void;
  setLiquidBrain: (patch: Partial<LiquidBrainConfig>) => void;
  setHolographic: (patch: Partial<HolographicProjectionConfig>) => void;
  projectHologramFromMainImage: (rigMode?: HologramRigMode) => void;
  fuseProjectedApps: (appIds?: string[], targetShape?: AppShapeTopologyId) => void;
  alterAppShape: (
    patch: Partial<
      Pick<LiquidBrainConfig, 'shape' | 'morphFactor' | 'twistAngle' | 'explodeRadius' | 'fluidPressure'>
    >
  ) => void;
  triggerLiquidPulse: (strength?: number) => void;
  maximizeSystem: () => string[];
  applyCommands: (commands: StudioCommandPayload) => string[];
  syncPlaybackTime: (currentTime: number, duration?: number) => void;
  getSnapshot: () => FractalBrainSnapshot;
  getApps: () => FractalAppModule[];
  getDaemons: () => SovereignDaemon[];
  getEventLog: () => FractalBrainEvent[];
  emit: (eventName: string, payload?: unknown) => void;
  on: (eventName: string, handler: EventHandler) => () => void;
  off: (eventName: string, handler: EventHandler) => void;
  reportFrameMetrics: (fps: number, frameTimeMs: number, targetCapHz?: number) => void;
  tickDaemons: (nowMs: number) => void;
}

const UPSCALE_RES_MAP: Record<UpscaleTier, string> = {
  off: 'Native Scope (2.39:1)',
  '8k': '7680x4320 (Liquid 8K)',
  '16k': '15360x8640 (Liquid 16K)',
  '64k': '61440x34560 (Liquid 64K)',
};

export const DEFAULT_GRADING: ColorGradingState = {
  exposure: 0,
  contrast: 1.04,
  saturation: 1.06,
  temperature: 0,
  tint: 0,
  highlightRolloff: 0.25,
  lut: 'neutral',
};

export const DEFAULT_CINEMA: CinemaModeConfig = {
  aspectRatio: '2.39',
  filmGrain: 0.16,
  halation: 0.26,
  gateWeave: 0.1,
  cadence24p: false,
};

export const DEFAULT_REAL_TV: RealTvModeConfig = {
  enabled: false,
  profile: 'crt',
  scanlines: 0.56,
  curvature: 0.36,
  chromaBleed: 0.3,
  phosphorBloom: 0.42,
  channelOsd: true,
  safeGuides: true,
  channelNumber: 3,
};

export const DEFAULT_SCENE_DESIGNER: SceneDesignerConfig = {
  theme: 'obsidianAmber',
  fractalComplexity: 5,
  gridDepth: 0.72,
  sweepIntensity: 0.65,
  atmosphereBlend: 0.22,
  motionSpeed: 1.0,
};

export const DEFAULT_VIDEO_TO_CARTOON: VideoToCartoonConfig = {
  enabled: false,
  style: 'celAnime',
  quantizeLevels: 5,
  edgeStrength: 0.78,
  inkThickness: 1.35,
  colorBoost: 1.25,
  halftone: 0.18,
};

export const DEFAULT_FUSION_MATRIX: FusionMatrixConfig = {
  enabled: true,
  autoMaximize: true,
  synergyGain: 1.0,
  coherencePct: 98,
  pulseDepth: 0.35,
  links: {
    sceneToCones: true,
    cartoonToLiquid: true,
    cspToOptics: true,
    tvToPhosphor: true,
    autopilotToAll: true,
  },
};

export const DEFAULT_LIQUIFIED_3D: Liquified3dConfig = {
  enabled: true,
  fluidPreset: 'moltenAmber',
  viscosity: 0.58,
  refraction: 0.48,
  chromeFresnel: 0.78,
  rippleForce: 0.65,
  liquidScreenOptical: false,
  solidGeometry: true,
  autoOrbit: true,
  pulseEnergy: 0,
};

export const DEFAULT_CYNTHETOC_AI: CynthetocAiConfig = {
  enabled: true,
  mode: 'adaptiveDirector',
  autonomy: 0.72,
  synthesisStrength: 0.68,
  neuralDenoise: 0.45,
  relightIntensity: 0.52,
  kineticSync: true,
  lastDirective: 'Balanced Anamorphic Coherence',
};

export const DEFAULT_STEREOSCOPIC: Stereoscopic3dConfig = {
  enabled: false,
  mode: 'anaglyphRedCyan',
  interaxial: 0.48,
  convergence: 0.14,
  analogCrosstalk: 0.06,
  depthSynthesis: 0.72,
};

export const DEFAULT_LIQUID_BRAIN: LiquidBrainConfig = {
  enabled: true,
  shape: 'mobiusRibbon',
  projectedApps: ['cynthetoc-ai', 'intelligent-scene-designer', 'liquified-3d-studio'],
  fusionMode: 'orbitalArray',
  fusedBlend: 0.54,
  morphFactor: 0.34,
  twistAngle: 0.45,
  explodeRadius: 0.06,
  fluidPressure: 0.66,
  synapseViscosity: 0.56,
};

export const DEFAULT_HOLOGRAPHIC: HolographicProjectionConfig = {
  enabled: false,
  rigMode: 'pepperGhostPyramid',
  sliceCount: 8,
  glassRefraction: 0.72,
  reflectionMix: 0.86,
  chromaticSplit: 0.44,
  parallaxDepth: 0.76,
  scanlineCoherence: 0.62,
  causticFocus: 0.68,
  baseElevation: 1.35,
  autoRotate: true,
};

const REQUIRED_MODULES: Array<{ id: string; name: string; role: string }> = [
  { id: 'csp-collector', name: 'CSP Collector', role: 'Primary constraint & thermal telemetry collector' },
  { id: 'cinemascope-optics', name: 'CinemaScope Optics', role: '2.39x anamorphic desqueeze, grain & halation optics' },
  { id: 'cinemascope-projector', name: 'CinemaScope Projector', role: 'Dual 2D/3D projection & subtract matrix' },
  { id: 'liquid-8k-upscaler', name: 'Liquid 8K Upscaler', role: '7680x4320 temporal micro-detail upscaler' },
  { id: 'liquid-16k-upscaler', name: 'Liquid 16K Upscaler', role: '15360x8640 multi-tap liquid upscaler' },
  { id: 'liquid-64k-upscaler', name: 'Liquid 64K Upscaler', role: '61440x34560 hyper-field upscaler' },
  { id: 'theatre-view', name: 'Theatre View', role: 'Auditorium dimming, curtain & bounce optics' },
  { id: 'real-fps-engine', name: 'Real FPS Engine', role: 'Frame pacing, Hz cap & 3D WASD traversal' },
  { id: 'real-tv-engine', name: 'Real TV Engine', role: 'CRT/Trinitron/OLED/VHS scanlines, aperture & chroma pipeline' },
  { id: 'cinemascope-color-suite', name: 'CinemaScope Color Suite', role: 'EV, LUT & highlight roll-off grading' },
  { id: 'timeline-sequencer', name: 'Timeline Sequencer', role: 'Scrub, scene markers & A/B loop controller' },
  { id: 'aimx-core-a', name: 'AIMX Core A', role: 'Signal synthesis & frame-buffer arbiter' },
  { id: 'aimx-core-b', name: 'AIMX Core B', role: 'Geometry cone & spatial coherence core' },
  { id: 'aimx-core-c', name: 'AIMX Core C', role: 'Autopilot command & semantic telemetry bridge' },
  { id: 'first-principle-loop', name: 'First Principle Loop', role: 'Self-healing watchdog & zero-stall loop' },
  { id: 'intelligent-scene-designer', name: 'Intelligent Scene Designer', role: 'Procedural fractal architecture, lighting & atmosphere synthesizer' },
  { id: 'intelligent-video-to-cartoon', name: 'Intelligent Video to Cartoon', role: 'Real-time GLSL Sobel ink outlines, cel quantization & comic halftone' },
  { id: 'intelligent-fusion-matrix', name: 'Intelligent Fusion Matrix', role: 'Cross-app neural synergy bus connecting all 22 modules & 20 daemons' },
  { id: 'liquified-3d-studio', name: 'Liquified 3D Studio', role: 'Volumetric solid/ferrofluid 3D meshes, Fresnel video reflections & optical refraction' },
  { id: 'cynthetoc-ai', name: 'Cynthetoc AI', role: 'Synthetic neural reillumination, anisotropic edge supersampling & autonomous frame director' },
  { id: 'stereoscopic-3d-engine', name: 'Stereoscopic 3D Separation', role: 'Analog 3D dual-eye optical separation & parallax synthesizer' },
  { id: 'liquid-brain-premise', name: 'Liquid Brain Topology', role: 'Hydrodynamic app-to-3D-shape projection, fusion & morphing engine' },
  { id: 'holographic-projection-engine', name: 'Holographic Projection Engine', role: 'Liquid glass reflection & main-image volumetric hologram synthesis engine' },
];

const DAEMON_DEFINITIONS: Array<{
  id: string;
  name: string;
  tier: SovereignDaemon['tier'];
}> = [
  { id: 'd01-csp-fsm', name: 'CSP Finite State Machine', tier: 'CORE' },
  { id: 'd02-microfractal-kernel', name: 'MicroFractal Geometry Kernel', tier: 'CORE' },
  { id: 'd03-optics-desqueeze', name: 'Anamorphic 2.39x & Film Gate', tier: 'OPTICS' },
  { id: 'd04-liquid-upscale', name: 'Liquid 8K/16K/64K Scheduler', tier: 'OPTICS' },
  { id: 'd05-color-lut', name: 'CinemaScope Color & LUT', tier: 'OPTICS' },
  { id: 'd06-projector-beam', name: 'Projector, Subtract & Real TV', tier: 'OPTICS' },
  { id: 'd07-auditorium-3d', name: '3D Stage & (0,0,0) Cone Loop', tier: 'OPTICS' },
  { id: 'd08-timeline-ab', name: 'Timeline & A/B Sequencer', tier: 'CORE' },
  { id: 'd09-real-fps', name: 'Real FPS & WASD Traversal', tier: 'CORE' },
  { id: 'd10-brain-bus', name: 'FractalBrain Autopilot Bus', tier: 'CORE' },
  { id: 'd11-scene-designer', name: 'Intelligent Scene Synthesizer', tier: 'INTELLIGENCE' },
  { id: 'd12-cartoon-cel', name: 'Video-to-Cartoon Cel & Sobel', tier: 'INTELLIGENCE' },
  { id: 'd13-fusion-matrix', name: 'Intelligent Fusion Matrix Router', tier: 'INTELLIGENCE' },
  { id: 'd14-sustain-watchdog', name: 'First-Principle Sustain Watchdog', tier: 'SUSTAIN' },
  { id: 'd15-thermal-governor', name: 'CSP Thermal & Flare Governor', tier: 'SUSTAIN' },
  { id: 'd16-memory-gc-guard', name: 'Texture & Blob Memory Guard', tier: 'SUSTAIN' },
  { id: 'd17-shader-coherence', name: 'GLSL Shader & Context Coherence', tier: 'SUSTAIN' },
  { id: 'd18-bandwidth-maximizer', name: 'DPR & Frame-Time Maximizer', tier: 'SUSTAIN' },
  { id: 'd19-aimx-triad-sync', name: 'AIMX Core A/B/C Triad Sync', tier: 'INTELLIGENCE' },
  { id: 'd20-harmony-maximizer', name: 'Global Synergy & Output Maximizer', tier: 'SUSTAIN' },
];

function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}

function createFractalBrain(): FractalBrainAPI {
  const bootTime = performance.now();
  let eventSeq = 0;

  const state: FractalStudioState = {
    mode: 'movie',
    playing: true,
    muted: true,
    volume: 0.8,
    loop: true,
    subtractMode: false,
    anamorphicSqueeze: true,
    anamorphicFlare: 0.35,
    upscaleMode: 'off',
    upscaleResolution: UPSCALE_RES_MAP.off,
    theatreView: false,
    realFpsMode: false,
    fps: 60,
    frameTimeMs: 16.67,
    targetCapHz: 60,
    frameGuide: '2.39',
    grading: { ...DEFAULT_GRADING },
    cinema: { ...DEFAULT_CINEMA },
    realTv: { ...DEFAULT_REAL_TV },
    sceneDesigner: { ...DEFAULT_SCENE_DESIGNER },
    videoToCartoon: { ...DEFAULT_VIDEO_TO_CARTOON },
    fusionMatrix: {
      ...DEFAULT_FUSION_MATRIX,
      links: { ...DEFAULT_FUSION_MATRIX.links },
    },
    liquified3d: { ...DEFAULT_LIQUIFIED_3D },
    cynthetocAi: { ...DEFAULT_CYNTHETOC_AI },
    stereoscopic: { ...DEFAULT_STEREOSCOPIC },
    liquidBrain: {
      ...DEFAULT_LIQUID_BRAIN,
      projectedApps: [...DEFAULT_LIQUID_BRAIN.projectedApps],
    },
    holographic: { ...DEFAULT_HOLOGRAPHIC },
    mediaSourceName: 'MicroFractal 2.39:1 Calibration Stream',
    mediaType: 'procedural',
    duration: 120,
    currentTime: 0,
    abLoop: { enabled: false, a: null, b: null },
    markers: [
      { id: 'm-intro', time: 6, label: 'Scope Calibration' },
      { id: 'm-apex', time: 28, label: 'Thermal Cone Peak' },
    ],
    stage3d: {
      coneMultiplier: 3,
      cspThermalPhase: 0,
      screenCurvature: 0.22,
      cameraPreset: 'audience',
    },
  };

  const appsMap = new Map<string, FractalAppModule>();
  const daemons: SovereignDaemon[] = DAEMON_DEFINITIONS.map((def) => ({
    id: def.id,
    name: def.name,
    tier: def.tier,
    status: 'ACTIVE',
    ticks: 0,
    lastTickAt: bootTime,
    loadPct: 4,
    efficiencyPct: 99,
    boostFactor: 1.0,
    telemetry: {},
  }));

  const listeners = new Map<string, Set<EventHandler>>();
  const eventLog: FractalBrainEvent[] = [];

  const pushEvent = (name: string, payload?: unknown) => {
    eventSeq += 1;
    const evt: FractalBrainEvent = {
      id: eventSeq,
      ts: performance.now(),
      name,
      payload: payload ?? null,
    };
    eventLog.push(evt);
    if (eventLog.length > 80) {
      eventLog.shift();
    }
  };

  const getApps = (): FractalAppModule[] =>
    Array.from(appsMap.values()).sort((a, b) => a.order - b.order);

  const getSnapshot = (): FractalBrainSnapshot => ({
    version: '2.5.0',
    bootTime,
    uptimeMs: Math.round(performance.now() - bootTime),
    state: {
      ...state,
      grading: { ...state.grading },
      cinema: { ...state.cinema },
      realTv: { ...state.realTv },
      sceneDesigner: { ...state.sceneDesigner },
      videoToCartoon: { ...state.videoToCartoon },
      fusionMatrix: {
        ...state.fusionMatrix,
        links: { ...state.fusionMatrix.links },
      },
      liquified3d: { ...state.liquified3d },
      cynthetocAi: { ...state.cynthetocAi },
      stereoscopic: { ...state.stereoscopic },
      liquidBrain: {
        ...state.liquidBrain,
        projectedApps: [...state.liquidBrain.projectedApps],
      },
      holographic: { ...state.holographic },
      abLoop: { ...state.abLoop },
      markers: state.markers.map((m) => ({ ...m })),
      stage3d: { ...state.stage3d },
    },
    apps: getApps(),
    daemons: daemons.map((d) => ({ ...d, telemetry: { ...d.telemetry } })),
    recentEvents: eventLog.slice(-24),
  });

  const emit = (eventName: string, payload?: unknown) => {
    pushEvent(eventName, payload);
    const snap = getSnapshot();
    const setHandlers = listeners.get(eventName);
    if (setHandlers) {
      setHandlers.forEach((fn) => {
        try {
          fn(payload, snap);
        } catch {
          // Keep bus resilient
        }
      });
    }
    const wildcardHandlers = listeners.get('*');
    if (wildcardHandlers) {
      wildcardHandlers.forEach((fn) => {
        try {
          fn({ eventName, payload }, snap);
        } catch {
          // Keep bus resilient
        }
      });
    }
  };

  const on = (eventName: string, handler: EventHandler) => {
    let setHandlers = listeners.get(eventName);
    if (!setHandlers) {
      setHandlers = new Set();
      listeners.set(eventName, setHandlers);
    }
    setHandlers.add(handler);
    return () => off(eventName, handler);
  };

  const off = (eventName: string, handler: EventHandler) => {
    const setHandlers = listeners.get(eventName);
    if (setHandlers) {
      setHandlers.delete(handler);
    }
  };

  const registerApp = (
    id: string,
    meta?: { name?: string; role?: string }
  ): FractalAppModule => {
    const existing = appsMap.get(id);
    if (existing) return existing;
    const mod: FractalAppModule = {
      id,
      name: meta?.name || id,
      role: meta?.role || 'Fused FractalOS module',
      order: appsMap.size + 1,
      registeredAt: performance.now(),
      fused: false,
      fusedAt: null,
      config: {},
    };
    appsMap.set(id, mod);
    emit('app:registered', { id, order: mod.order });
    return mod;
  };

  const fuseApp = (
    id: string,
    config?: Record<string, unknown>
  ): FractalAppModule => {
    const mod = registerApp(id);
    mod.fused = true;
    mod.fusedAt = performance.now();
    if (config) {
      mod.config = { ...mod.config, ...config };
    }
    emit('app:fused', { id, order: mod.order });
    return mod;
  };

  // Cross-app Intelligent Fusion Matrix & Cynthetoc AI 3x propagation
  const propagateFusionSynergy = () => {
    if (!state.fusionMatrix.enabled) return;
    const gain = state.fusionMatrix.synergyGain;
    const links = state.fusionMatrix.links;
    const cyBoost = state.cynthetocAi.enabled ? 1 + state.cynthetocAi.synthesisStrength * 0.45 : 1.0;

    if (links.sceneToCones) {
      state.stage3d.coneMultiplier = clamp(
        Math.round(state.sceneDesigner.fractalComplexity * 0.9 * gain * (state.cynthetocAi.enabled ? 1.15 : 1)),
        1,
        9
      );
      if (state.liquified3d.enabled) {
        state.liquified3d.chromeFresnel = clamp(
          0.55 + state.sceneDesigner.sweepIntensity * 0.35 + (state.cynthetocAi.enabled ? state.cynthetocAi.relightIntensity * 0.15 : 0),
          0,
          1
        );
      }
    }
    if (links.cartoonToLiquid && state.videoToCartoon.enabled && state.upscaleMode === 'off') {
      state.upscaleMode = '16k';
      state.upscaleResolution = UPSCALE_RES_MAP['16k'];
    }
    if (state.cynthetocAi.enabled && state.cynthetocAi.mode === 'neuralSupersample' && state.upscaleMode === 'off') {
      state.upscaleMode = '16k';
      state.upscaleResolution = UPSCALE_RES_MAP['16k'];
    }
    if (links.cspToOptics) {
      state.anamorphicFlare = clamp(0.25 + state.sceneDesigner.sweepIntensity * 0.35 * gain * cyBoost, 0, 1);
    }
    if (links.tvToPhosphor && state.realTv.enabled) {
      state.realTv.phosphorBloom = clamp(0.32 + state.fusionMatrix.pulseDepth * 0.45, 0, 1);
    }
    if (state.liquidBrain.enabled) {
      state.liquidBrain.fluidPressure = clamp(
        0.38 + gain * 0.25 + (state.cynthetocAi.enabled ? state.cynthetocAi.synthesisStrength * 0.24 : 0),
        0.1,
        1.0
      );
      if (state.liquidBrain.fusionMode === 'fusedHybrid') {
        state.liquidBrain.fusedBlend = clamp(0.45 + gain * 0.3, 0.2, 1.0);
      }
    }
    const activeLinks = Object.values(links).filter(Boolean).length;
    state.fusionMatrix.coherencePct = Math.round(
      clamp(
        74 +
          activeLinks * 4 +
          (state.fusionMatrix.autoMaximize ? 3 : 0) +
          (state.cynthetocAi.enabled ? 3 : 0) +
          (state.liquidBrain.enabled ? 2 : 0),
        0,
        100
      )
    );
  };

  const set = (
    keyOrPatch: string | Partial<FractalStudioState>,
    value?: unknown
  ): FractalStudioState => {
    if (typeof keyOrPatch === 'string') {
      if (keyOrPatch === 'grading' && typeof value === 'object' && value !== null) {
        state.grading = { ...state.grading, ...(value as Partial<ColorGradingState>) };
      } else if (keyOrPatch === 'cinema' && typeof value === 'object' && value !== null) {
        state.cinema = { ...state.cinema, ...(value as Partial<CinemaModeConfig>) };
      } else if (keyOrPatch === 'realTv' && typeof value === 'object' && value !== null) {
        state.realTv = { ...state.realTv, ...(value as Partial<RealTvModeConfig>) };
      } else if (keyOrPatch === 'sceneDesigner' && typeof value === 'object' && value !== null) {
        state.sceneDesigner = { ...state.sceneDesigner, ...(value as Partial<SceneDesignerConfig>) };
        propagateFusionSynergy();
      } else if (keyOrPatch === 'videoToCartoon' && typeof value === 'object' && value !== null) {
        state.videoToCartoon = { ...state.videoToCartoon, ...(value as Partial<VideoToCartoonConfig>) };
        propagateFusionSynergy();
      } else if (keyOrPatch === 'fusionMatrix' && typeof value === 'object' && value !== null) {
        const patch = value as Partial<FusionMatrixConfig>;
        state.fusionMatrix = {
          ...state.fusionMatrix,
          ...patch,
          links: patch.links
            ? { ...state.fusionMatrix.links, ...patch.links }
            : state.fusionMatrix.links,
        };
        propagateFusionSynergy();
      } else if (keyOrPatch === 'liquified3d' && typeof value === 'object' && value !== null) {
        state.liquified3d = { ...state.liquified3d, ...(value as Partial<Liquified3dConfig>) };
        propagateFusionSynergy();
      } else if (keyOrPatch === 'cynthetocAi' && typeof value === 'object' && value !== null) {
        state.cynthetocAi = { ...state.cynthetocAi, ...(value as Partial<CynthetocAiConfig>) };
        propagateFusionSynergy();
      } else if (keyOrPatch === 'stereoscopic' && typeof value === 'object' && value !== null) {
        state.stereoscopic = { ...state.stereoscopic, ...(value as Partial<Stereoscopic3dConfig>) };
      } else if (keyOrPatch === 'liquidBrain' && typeof value === 'object' && value !== null) {
        const patch = value as Partial<LiquidBrainConfig>;
        state.liquidBrain = {
          ...state.liquidBrain,
          ...patch,
          projectedApps: Array.isArray(patch.projectedApps)
            ? patch.projectedApps.slice(0, 4)
            : state.liquidBrain.projectedApps,
        };
        propagateFusionSynergy();
      } else if (keyOrPatch === 'holographic' && typeof value === 'object' && value !== null) {
        state.holographic = { ...state.holographic, ...(value as Partial<HolographicProjectionConfig>) };
        propagateFusionSynergy();
      } else if (keyOrPatch === 'stage3d' && typeof value === 'object' && value !== null) {
        state.stage3d = { ...state.stage3d, ...(value as Partial<FractalStudioState['stage3d']>) };
      } else if (keyOrPatch === 'abLoop' && typeof value === 'object' && value !== null) {
        state.abLoop = { ...state.abLoop, ...(value as Partial<AbLoopState>) };
      } else if (keyOrPatch in state) {
        (state as unknown as Record<string, unknown>)[keyOrPatch] = value;
      }
      if (keyOrPatch === 'upscaleMode') {
        state.upscaleResolution = UPSCALE_RES_MAP[state.upscaleMode] || UPSCALE_RES_MAP.off;
      }
      emit('state:changed', { key: keyOrPatch, value });
    } else if (keyOrPatch && typeof keyOrPatch === 'object') {
      if (keyOrPatch.grading) {
        state.grading = { ...state.grading, ...keyOrPatch.grading };
      }
      if (keyOrPatch.cinema) {
        state.cinema = { ...state.cinema, ...keyOrPatch.cinema };
      }
      if (keyOrPatch.realTv) {
        state.realTv = { ...state.realTv, ...keyOrPatch.realTv };
      }
      if (keyOrPatch.sceneDesigner) {
        state.sceneDesigner = { ...state.sceneDesigner, ...keyOrPatch.sceneDesigner };
      }
      if (keyOrPatch.videoToCartoon) {
        state.videoToCartoon = { ...state.videoToCartoon, ...keyOrPatch.videoToCartoon };
      }
      if (keyOrPatch.fusionMatrix) {
        state.fusionMatrix = {
          ...state.fusionMatrix,
          ...keyOrPatch.fusionMatrix,
          links: keyOrPatch.fusionMatrix.links
            ? { ...state.fusionMatrix.links, ...keyOrPatch.fusionMatrix.links }
            : state.fusionMatrix.links,
        };
      }
      if (keyOrPatch.liquified3d) {
        state.liquified3d = { ...state.liquified3d, ...keyOrPatch.liquified3d };
      }
      if (keyOrPatch.cynthetocAi) {
        state.cynthetocAi = { ...state.cynthetocAi, ...keyOrPatch.cynthetocAi };
      }
      if (keyOrPatch.stereoscopic) {
        state.stereoscopic = { ...state.stereoscopic, ...keyOrPatch.stereoscopic };
      }
      if (keyOrPatch.liquidBrain) {
        state.liquidBrain = {
          ...state.liquidBrain,
          ...keyOrPatch.liquidBrain,
          projectedApps: Array.isArray(keyOrPatch.liquidBrain.projectedApps)
            ? keyOrPatch.liquidBrain.projectedApps.slice(0, 4)
            : state.liquidBrain.projectedApps,
        };
      }
      if (keyOrPatch.holographic) {
        state.holographic = { ...state.holographic, ...keyOrPatch.holographic };
      }
      if (keyOrPatch.stage3d) {
        state.stage3d = { ...state.stage3d, ...keyOrPatch.stage3d };
      }
      if (keyOrPatch.abLoop) {
        state.abLoop = { ...state.abLoop, ...keyOrPatch.abLoop };
      }
      const {
        grading: _g,
        cinema: _c,
        realTv: _rt,
        sceneDesigner: _sd,
        videoToCartoon: _vc,
        fusionMatrix: _fm,
        liquified3d: _l3,
        cynthetocAi: _ca,
        stereoscopic: _st,
        liquidBrain: _lb,
        holographic: _hg,
        stage3d: _s,
        abLoop: _a,
        ...rest
      } = keyOrPatch;
      Object.assign(state, rest);
      if (keyOrPatch.upscaleMode) {
        state.upscaleResolution = UPSCALE_RES_MAP[state.upscaleMode] || UPSCALE_RES_MAP.off;
      }
      if (
        keyOrPatch.sceneDesigner ||
        keyOrPatch.videoToCartoon ||
        keyOrPatch.fusionMatrix ||
        keyOrPatch.liquified3d ||
        keyOrPatch.cynthetocAi ||
        keyOrPatch.liquidBrain ||
        keyOrPatch.holographic
      ) {
        propagateFusionSynergy();
      }
      emit('state:changed', { patch: Object.keys(keyOrPatch) });
    }
    return state;
  };

  const get = <K extends keyof FractalStudioState>(key: K): FractalStudioState[K] =>
    state[key];

  const syncPlaybackTime = (currentTime: number, duration?: number) => {
    if (Number.isFinite(currentTime)) {
      state.currentTime = Math.max(0, currentTime);
    }
    if (typeof duration === 'number' && Number.isFinite(duration) && duration > 0) {
      state.duration = duration;
    }
  };

  const setLiquid8k = (enabled: boolean) => {
    set('upscaleMode', enabled ? '8k' : 'off');
    emit('upscale:liquid8k', { enabled, resolution: state.upscaleResolution });
  };

  const setLiquid16k = (enabled: boolean) => {
    set('upscaleMode', enabled ? '16k' : 'off');
    emit('upscale:liquid16k', { enabled, resolution: state.upscaleResolution });
  };

  const setLiquid64k = (enabled: boolean) => {
    set('upscaleMode', enabled ? '64k' : 'off');
    emit('upscale:liquid64k', { enabled, resolution: state.upscaleResolution });
  };

  const setTheatreView = (enabled: boolean) => {
    set('theatreView', Boolean(enabled));
    emit('theatre:view', { enabled: state.theatreView });
  };

  const setRealFpsMode = (enabled: boolean) => {
    set('realFpsMode', Boolean(enabled));
    emit('fps:mode', { enabled: state.realFpsMode, fps: state.fps });
  };

  const setRealTvMode = (enabled: boolean, profile?: RealTvProfile) => {
    const next: Partial<RealTvModeConfig> = { enabled: Boolean(enabled) };
    if (profile) next.profile = profile;
    set('realTv', next);
    emit('realtv:mode', { enabled: state.realTv.enabled, profile: state.realTv.profile });
  };

  const setSceneDesigner = (patch: Partial<SceneDesignerConfig>) => {
    set('sceneDesigner', patch);
    emit('scenedesigner:updated', state.sceneDesigner);
  };

  const setVideoToCartoon = (patch: Partial<VideoToCartoonConfig>) => {
    set('videoToCartoon', patch);
    emit('videotocartoon:updated', state.videoToCartoon);
  };

  const setFusionMatrix = (patch: Partial<FusionMatrixConfig>) => {
    set('fusionMatrix', patch);
    emit('fusionmatrix:updated', state.fusionMatrix);
  };

  const setLiquified3d = (patch: Partial<Liquified3dConfig>) => {
    set('liquified3d', patch);
    emit('liquified3d:updated', state.liquified3d);
  };

  const setCynthetocAi = (patch: Partial<CynthetocAiConfig>) => {
    set('cynthetocAi', patch);
    emit('cynthetoc:updated', state.cynthetocAi);
  };

  const setStereoscopic = (patch: Partial<Stereoscopic3dConfig>) => {
    set('stereoscopic', patch);
    emit('stereoscopic:updated', state.stereoscopic);
  };

  const setLiquidBrain = (patch: Partial<LiquidBrainConfig>) => {
    set('liquidBrain', patch);
    emit('liquidbrain:updated', state.liquidBrain);
  };

  const setHolographic = (patch: Partial<HolographicProjectionConfig>) => {
    set('holographic', patch);
    emit('holographic:updated', state.holographic);
  };

  const projectHologramFromMainImage = (rigMode?: HologramRigMode) => {
    state.holographic.enabled = true;
    if (rigMode) state.holographic.rigMode = rigMode;
    state.holographic.reflectionMix = clamp(Math.max(0.84, state.holographic.reflectionMix), 0, 1);
    state.holographic.glassRefraction = clamp(Math.max(0.68, state.holographic.glassRefraction), 0, 1);
    state.liquified3d.enabled = true;
    state.liquified3d.fluidPreset = 'liquidGlass';
    state.liquified3d.solidGeometry = true;
    state.liquified3d.chromeFresnel = clamp(Math.max(0.84, state.liquified3d.chromeFresnel), 0, 1);
    state.liquified3d.refraction = clamp(Math.max(0.62, state.liquified3d.refraction), 0, 1);
    state.liquified3d.pulseEnergy = 1.18;
    state.mode = '3d';
    propagateFusionSynergy();
    emit('holographic:projected', {
      rigMode: state.holographic.rigMode,
      sliceCount: state.holographic.sliceCount,
      reflectionMix: state.holographic.reflectionMix,
    });
  };

  const fuseProjectedApps = (appIds?: string[], targetShape?: AppShapeTopologyId) => {
    const nextApps =
      appIds && appIds.length > 0
        ? appIds.slice(0, 4)
        : state.liquidBrain.projectedApps.length >= 2
        ? state.liquidBrain.projectedApps
        : ['cynthetoc-ai', 'intelligent-scene-designer', 'liquified-3d-studio'];
    state.liquidBrain.enabled = true;
    state.liquidBrain.projectedApps = nextApps;
    if (targetShape) state.liquidBrain.shape = targetShape;
    state.liquidBrain.fusionMode = 'fusedHybrid';
    state.liquidBrain.fusedBlend = clamp(Math.max(0.76, state.liquidBrain.fusedBlend), 0, 1);
    state.liquidBrain.morphFactor = clamp(Math.max(0.45, state.liquidBrain.morphFactor), 0, 1);
    state.liquified3d.enabled = true;
    state.liquified3d.pulseEnergy = 1.15;
    state.mode = '3d';
    propagateFusionSynergy();
    emit('liquidbrain:fused', {
      apps: nextApps,
      shape: state.liquidBrain.shape,
      fusedBlend: state.liquidBrain.fusedBlend,
    });
  };

  const alterAppShape = (
    patch: Partial<
      Pick<LiquidBrainConfig, 'shape' | 'morphFactor' | 'twistAngle' | 'explodeRadius' | 'fluidPressure'>
    >
  ) => {
    set('liquidBrain', { enabled: true, ...patch });
    emit('liquidbrain:altered', state.liquidBrain);
  };

  const triggerLiquidPulse = (strength = 1.0) => {
    state.liquified3d.enabled = true;
    state.liquified3d.pulseEnergy = clamp(strength, 0.2, 1.5);
    emit('liquified3d:pulse', { strength: state.liquified3d.pulseEnergy });
  };

  const maximizeSystem = (): string[] => {
    state.fusionMatrix.enabled = true;
    state.fusionMatrix.autoMaximize = true;
    state.fusionMatrix.synergyGain = 1.5;
    state.fusionMatrix.coherencePct = 100;
    state.fusionMatrix.links = {
      sceneToCones: true,
      cartoonToLiquid: true,
      cspToOptics: true,
      tvToPhosphor: true,
      autopilotToAll: true,
    };
    state.cynthetocAi.enabled = true;
    state.cynthetocAi.autonomy = 1.0;
    state.cynthetocAi.synthesisStrength = 0.92;
    state.cynthetocAi.relightIntensity = 0.85;
    state.cynthetocAi.lastDirective = '3x Overdrive Coherence Lock';
    state.liquified3d.enabled = true;
    state.liquified3d.solidGeometry = true;
    state.liquified3d.chromeFresnel = Math.max(0.88, state.liquified3d.chromeFresnel);
    state.liquified3d.pulseEnergy = 1.25;
    state.liquidBrain.enabled = true;
    state.liquidBrain.fluidPressure = 0.94;
    state.liquidBrain.fusedBlend = Math.max(0.78, state.liquidBrain.fusedBlend);
    state.holographic.causticFocus = Math.max(0.82, state.holographic.causticFocus);
    state.holographic.reflectionMix = Math.max(0.9, state.holographic.reflectionMix);
    state.stage3d.coneMultiplier = Math.max(6, state.stage3d.coneMultiplier);
    if (state.upscaleMode === 'off' || state.upscaleMode === '8k') {
      state.upscaleMode = '64k';
      state.upscaleResolution = UPSCALE_RES_MAP['64k'];
    }
    state.anamorphicSqueeze = true;
    propagateFusionSynergy();

    daemons.forEach((d) => {
      d.status = d.tier === 'SUSTAIN' ? 'SUSTAINING' : 'MAXIMIZED';
      d.efficiencyPct = 100;
      d.boostFactor = 3.0;
    });

    const summary = [
      'All Systems 3x Overdrive',
      'Cynthetoc AI + Fusion 100%',
      '20 Daemons Maximized (3.0x)',
      `Liquified 3D (${state.liquified3d.fluidPreset})`,
      `Upscaler ${state.upscaleMode.toUpperCase()}`,
    ];
    emit('system:maximized', { summary });
    return summary;
  };

  const applyCommands = (commands: StudioCommandPayload): string[] => {
    const applied: string[] = [];
    if (!commands || typeof commands !== 'object') return applied;

    if (commands.resetGrading) {
      state.grading = { ...DEFAULT_GRADING };
      applied.push('Grading Reset');
    }
    if (commands.mode === 'movie' || commands.mode === '3d') {
      state.mode = commands.mode;
      applied.push(`Mode: ${commands.mode === '3d' ? '3D Stage' : 'Cinema'}`);
    }
    if (typeof commands.playing === 'boolean') {
      state.playing = commands.playing;
      applied.push(commands.playing ? 'Play' : 'Pause');
    }
    if (typeof commands.muted === 'boolean') {
      state.muted = commands.muted;
      applied.push(commands.muted ? 'Muted' : 'Unmuted');
    }
    if (typeof commands.loop === 'boolean') {
      state.loop = commands.loop;
      applied.push(`Loop ${commands.loop ? 'ON' : 'OFF'}`);
    }
    if (typeof commands.subtractMode === 'boolean') {
      state.subtractMode = commands.subtractMode;
      applied.push(commands.subtractMode ? 'Subtract ON' : 'Stream Mode');
    }
    if (typeof commands.anamorphicSqueeze === 'boolean') {
      state.anamorphicSqueeze = commands.anamorphicSqueeze;
      applied.push(`2.39x Scope ${commands.anamorphicSqueeze ? 'ON' : 'OFF'}`);
    }
    if (typeof commands.anamorphicFlare === 'number') {
      state.anamorphicFlare = clamp(commands.anamorphicFlare, 0, 1);
      applied.push(`Flare ${Math.round(state.anamorphicFlare * 100)}%`);
    }
    if (commands.upscaleMode && ['off', '8k', '16k', '64k'].includes(commands.upscaleMode)) {
      state.upscaleMode = commands.upscaleMode;
      state.upscaleResolution = UPSCALE_RES_MAP[commands.upscaleMode];
      applied.push(
        commands.upscaleMode === 'off'
          ? 'Upscale OFF'
          : `Liquid ${commands.upscaleMode.toUpperCase()}`
      );
    }
    if (typeof commands.theatreView === 'boolean') {
      state.theatreView = commands.theatreView;
      applied.push(`Theatre ${commands.theatreView ? 'ON' : 'OFF'}`);
    }
    if (typeof commands.realFpsMode === 'boolean') {
      state.realFpsMode = commands.realFpsMode;
      applied.push(`Real FPS ${commands.realFpsMode ? 'ON' : 'OFF'}`);
    }
    if (commands.frameGuide && ['off', '2.39', '2.35', 'thirds'].includes(commands.frameGuide)) {
      state.frameGuide = commands.frameGuide;
      applied.push(`Guide ${commands.frameGuide}`);
    }
    if (commands.grading && typeof commands.grading === 'object') {
      const g = commands.grading;
      if (g.lut && ['neutral', 'kodak2383', 'tealAmber', 'bleachBypass', 'noirSilver'].includes(g.lut)) {
        state.grading.lut = g.lut;
        applied.push(`LUT ${g.lut}`);
      }
      if (typeof g.exposure === 'number') {
        state.grading.exposure = clamp(g.exposure, -2, 2);
        applied.push(`EV ${state.grading.exposure >= 0 ? '+' : ''}${state.grading.exposure.toFixed(2)}`);
      }
      if (typeof g.contrast === 'number') {
        state.grading.contrast = clamp(g.contrast, 0.5, 1.8);
        applied.push(`Contrast ${state.grading.contrast.toFixed(2)}`);
      }
      if (typeof g.saturation === 'number') {
        state.grading.saturation = clamp(g.saturation, 0, 2);
        applied.push(`Sat ${state.grading.saturation.toFixed(2)}`);
      }
      if (typeof g.temperature === 'number') {
        state.grading.temperature = clamp(g.temperature, -1, 1);
        applied.push(`Temp ${Math.round(state.grading.temperature * 100)}`);
      }
      if (typeof g.tint === 'number') {
        state.grading.tint = clamp(g.tint, -1, 1);
        applied.push(`Tint ${Math.round(state.grading.tint * 100)}`);
      }
      if (typeof g.highlightRolloff === 'number') {
        state.grading.highlightRolloff = clamp(g.highlightRolloff, 0, 1);
        applied.push(`Rolloff ${Math.round(state.grading.highlightRolloff * 100)}%`);
      }
    }
    if (commands.cinema && typeof commands.cinema === 'object') {
      const c = commands.cinema;
      if (c.aspectRatio && ['2.39', '2.35', '1.85', '16:9', '4:3'].includes(c.aspectRatio)) {
        state.cinema.aspectRatio = c.aspectRatio;
        applied.push(`Aspect ${c.aspectRatio}`);
      }
      if (typeof c.filmGrain === 'number') {
        state.cinema.filmGrain = clamp(c.filmGrain, 0, 1);
        applied.push(`Grain ${Math.round(state.cinema.filmGrain * 100)}%`);
      }
      if (typeof c.halation === 'number') {
        state.cinema.halation = clamp(c.halation, 0, 1);
        applied.push(`Halation ${Math.round(state.cinema.halation * 100)}%`);
      }
      if (typeof c.gateWeave === 'number') {
        state.cinema.gateWeave = clamp(c.gateWeave, 0, 1);
        applied.push(`Gate Weave ${Math.round(state.cinema.gateWeave * 100)}%`);
      }
      if (typeof c.cadence24p === 'boolean') {
        state.cinema.cadence24p = c.cadence24p;
        applied.push(c.cadence24p ? '24p Cadence ON' : '60p Native');
      }
    }
    if (commands.realTv && typeof commands.realTv === 'object') {
      const rt = commands.realTv;
      if (typeof rt.enabled === 'boolean') {
        state.realTv.enabled = rt.enabled;
        applied.push(`Real TV ${rt.enabled ? 'ON' : 'OFF'}`);
      }
      if (rt.profile && ['crt', 'trinitron', 'oled', 'vhs'].includes(rt.profile)) {
        state.realTv.profile = rt.profile;
        if (typeof rt.enabled !== 'boolean') state.realTv.enabled = true;
        applied.push(`TV ${rt.profile.toUpperCase()}`);
      }
      if (typeof rt.scanlines === 'number') {
        state.realTv.scanlines = clamp(rt.scanlines, 0, 1);
        applied.push(`Scanlines ${Math.round(state.realTv.scanlines * 100)}%`);
      }
      if (typeof rt.curvature === 'number') {
        state.realTv.curvature = clamp(rt.curvature, 0, 1);
        applied.push(`Tube Curve ${Math.round(state.realTv.curvature * 100)}%`);
      }
      if (typeof rt.chromaBleed === 'number') {
        state.realTv.chromaBleed = clamp(rt.chromaBleed, 0, 1);
        applied.push(`Chroma ${Math.round(state.realTv.chromaBleed * 100)}%`);
      }
      if (typeof rt.phosphorBloom === 'number') {
        state.realTv.phosphorBloom = clamp(rt.phosphorBloom, 0, 1);
        applied.push(`Bloom ${Math.round(state.realTv.phosphorBloom * 100)}%`);
      }
      if (typeof rt.channelOsd === 'boolean') state.realTv.channelOsd = rt.channelOsd;
      if (typeof rt.safeGuides === 'boolean') state.realTv.safeGuides = rt.safeGuides;
      if (typeof rt.channelNumber === 'number') {
        state.realTv.channelNumber = clamp(Math.round(rt.channelNumber), 1, 99);
        applied.push(`CH ${String(state.realTv.channelNumber).padStart(2, '0')}`);
      }
    }
    if (commands.sceneDesigner && typeof commands.sceneDesigner === 'object') {
      const sd = commands.sceneDesigner;
      if (
        sd.theme &&
        ['obsidianAmber', 'solarReactor', 'neonBroadcast', 'emeraldMatrix', 'crimsonNoir'].includes(sd.theme)
      ) {
        state.sceneDesigner.theme = sd.theme;
        applied.push(`Scene ${sd.theme}`);
      }
      if (typeof sd.fractalComplexity === 'number') {
        state.sceneDesigner.fractalComplexity = clamp(Math.round(sd.fractalComplexity), 2, 8);
        applied.push(`${state.sceneDesigner.fractalComplexity} Fractal Rings`);
      }
      if (typeof sd.gridDepth === 'number') {
        state.sceneDesigner.gridDepth = clamp(sd.gridDepth, 0, 1);
      }
      if (typeof sd.sweepIntensity === 'number') {
        state.sceneDesigner.sweepIntensity = clamp(sd.sweepIntensity, 0, 1);
      }
      if (typeof sd.atmosphereBlend === 'number') {
        state.sceneDesigner.atmosphereBlend = clamp(sd.atmosphereBlend, 0, 1);
        applied.push(`Atmos ${Math.round(state.sceneDesigner.atmosphereBlend * 100)}%`);
      }
      if (typeof sd.motionSpeed === 'number') {
        state.sceneDesigner.motionSpeed = clamp(sd.motionSpeed, 0.2, 2.5);
      }
      propagateFusionSynergy();
    }
    if (commands.videoToCartoon && typeof commands.videoToCartoon === 'object') {
      const vc = commands.videoToCartoon;
      if (typeof vc.enabled === 'boolean') {
        state.videoToCartoon.enabled = vc.enabled;
        applied.push(`Cartoon ${vc.enabled ? 'ON' : 'OFF'}`);
      }
      if (
        vc.style &&
        ['celAnime', 'noirInk', 'popComic', 'microFractalToon'].includes(vc.style)
      ) {
        state.videoToCartoon.style = vc.style;
        if (typeof vc.enabled !== 'boolean') state.videoToCartoon.enabled = true;
        applied.push(`Toon ${vc.style}`);
      }
      if (typeof vc.quantizeLevels === 'number') {
        state.videoToCartoon.quantizeLevels = clamp(Math.round(vc.quantizeLevels), 2, 10);
      }
      if (typeof vc.edgeStrength === 'number') {
        state.videoToCartoon.edgeStrength = clamp(vc.edgeStrength, 0, 1);
      }
      if (typeof vc.inkThickness === 'number') {
        state.videoToCartoon.inkThickness = clamp(vc.inkThickness, 0.5, 3);
      }
      if (typeof vc.colorBoost === 'number') {
        state.videoToCartoon.colorBoost = clamp(vc.colorBoost, 0.5, 2);
      }
      if (typeof vc.halftone === 'number') {
        state.videoToCartoon.halftone = clamp(vc.halftone, 0, 1);
      }
      propagateFusionSynergy();
    }
    if (commands.fusionMatrix && typeof commands.fusionMatrix === 'object') {
      const fm = commands.fusionMatrix;
      if (typeof fm.enabled === 'boolean') {
        state.fusionMatrix.enabled = fm.enabled;
        applied.push(`Fusion Matrix ${fm.enabled ? 'ON' : 'OFF'}`);
      }
      if (typeof fm.autoMaximize === 'boolean') {
        state.fusionMatrix.autoMaximize = fm.autoMaximize;
      }
      if (typeof fm.synergyGain === 'number') {
        state.fusionMatrix.synergyGain = clamp(fm.synergyGain, 0, 2);
        applied.push(`Gain ${state.fusionMatrix.synergyGain.toFixed(2)}x`);
      }
      if (typeof fm.pulseDepth === 'number') {
        state.fusionMatrix.pulseDepth = clamp(fm.pulseDepth, 0, 1);
      }
      if (fm.links && typeof fm.links === 'object') {
        state.fusionMatrix.links = { ...state.fusionMatrix.links, ...fm.links };
      }
      propagateFusionSynergy();
    }
    if (commands.liquified3d && typeof commands.liquified3d === 'object') {
      const l3 = commands.liquified3d;
      if (typeof l3.enabled === 'boolean') {
        state.liquified3d.enabled = l3.enabled;
        applied.push(`Liquified 3D ${l3.enabled ? 'ON' : 'OFF'}`);
      }
      if (
        l3.fluidPreset &&
        ['mercuryChrome', 'moltenAmber', 'ferrofluidObsidian', 'iridescentPlasma', 'liquidGlass'].includes(
          l3.fluidPreset
        )
      ) {
        state.liquified3d.fluidPreset = l3.fluidPreset;
        if (typeof l3.enabled !== 'boolean') state.liquified3d.enabled = true;
        applied.push(`Liquid ${l3.fluidPreset}`);
      }
      if (typeof l3.viscosity === 'number') {
        state.liquified3d.viscosity = clamp(l3.viscosity, 0.1, 1);
      }
      if (typeof l3.refraction === 'number') {
        state.liquified3d.refraction = clamp(l3.refraction, 0, 1);
      }
      if (typeof l3.chromeFresnel === 'number') {
        state.liquified3d.chromeFresnel = clamp(l3.chromeFresnel, 0, 1);
      }
      if (typeof l3.rippleForce === 'number') {
        state.liquified3d.rippleForce = clamp(l3.rippleForce, 0, 1);
      }
      if (typeof l3.liquidScreenOptical === 'boolean') {
        state.liquified3d.liquidScreenOptical = l3.liquidScreenOptical;
        applied.push(`Liquid Screen ${l3.liquidScreenOptical ? 'ON' : 'OFF'}`);
      }
      if (typeof l3.solidGeometry === 'boolean') {
        state.liquified3d.solidGeometry = l3.solidGeometry;
      }
      if (typeof l3.autoOrbit === 'boolean') {
        state.liquified3d.autoOrbit = l3.autoOrbit;
      }
      propagateFusionSynergy();
    }
    if (commands.cynthetocAi && typeof commands.cynthetocAi === 'object') {
      const ca = commands.cynthetocAi;
      if (typeof ca.enabled === 'boolean') {
        state.cynthetocAi.enabled = ca.enabled;
        applied.push(`Cynthetoc AI ${ca.enabled ? 'ON' : 'OFF'}`);
      }
      if (
        ca.mode &&
        ['adaptiveDirector', 'neuralSupersample', 'syntheticRelight', 'kineticPulse'].includes(ca.mode)
      ) {
        state.cynthetocAi.mode = ca.mode;
        if (typeof ca.enabled !== 'boolean') state.cynthetocAi.enabled = true;
        applied.push(`Cynthetoc ${ca.mode}`);
      }
      if (typeof ca.autonomy === 'number') {
        state.cynthetocAi.autonomy = clamp(ca.autonomy, 0, 1);
      }
      if (typeof ca.synthesisStrength === 'number') {
        state.cynthetocAi.synthesisStrength = clamp(ca.synthesisStrength, 0, 1);
      }
      if (typeof ca.neuralDenoise === 'number') {
        state.cynthetocAi.neuralDenoise = clamp(ca.neuralDenoise, 0, 1);
      }
      if (typeof ca.relightIntensity === 'number') {
        state.cynthetocAi.relightIntensity = clamp(ca.relightIntensity, 0, 1);
      }
      if (typeof ca.kineticSync === 'boolean') {
        state.cynthetocAi.kineticSync = ca.kineticSync;
      }
      if (typeof ca.lastDirective === 'string' && ca.lastDirective.trim()) {
        state.cynthetocAi.lastDirective = ca.lastDirective.trim().slice(0, 80);
      }
      propagateFusionSynergy();
    }
    if (commands.stereoscopic && typeof commands.stereoscopic === 'object') {
      const st3 = commands.stereoscopic;
      if (typeof st3.enabled === 'boolean') {
        state.stereoscopic.enabled = st3.enabled;
        applied.push(`Stereo 3D ${st3.enabled ? 'ON' : 'OFF'}`);
      }
      if (
        st3.mode &&
        [
          'anaglyphRedCyan',
          'amberBlueColorCode',
          'pulfrichAnalog',
          'sideBySide',
          'interlacedField',
        ].includes(st3.mode)
      ) {
        state.stereoscopic.mode = st3.mode;
        if (typeof st3.enabled !== 'boolean') state.stereoscopic.enabled = true;
        applied.push(`Stereo ${st3.mode}`);
      }
      if (typeof st3.interaxial === 'number') {
        state.stereoscopic.interaxial = clamp(st3.interaxial, 0, 1);
      }
      if (typeof st3.convergence === 'number') {
        state.stereoscopic.convergence = clamp(st3.convergence, -1, 1);
      }
      if (typeof st3.analogCrosstalk === 'number') {
        state.stereoscopic.analogCrosstalk = clamp(st3.analogCrosstalk, 0, 0.4);
      }
      if (typeof st3.depthSynthesis === 'number') {
        state.stereoscopic.depthSynthesis = clamp(st3.depthSynthesis, 0, 1);
      }
    }
    if (commands.liquidBrain && typeof commands.liquidBrain === 'object') {
      const lb = commands.liquidBrain;
      if (typeof lb.enabled === 'boolean') {
        state.liquidBrain.enabled = lb.enabled;
        applied.push(`Liquid Brain ${lb.enabled ? 'ON' : 'OFF'}`);
      }
      if (
        lb.shape &&
        ['sphere', 'torus', 'mobiusRibbon', 'cube', 'octaPrism', 'cone'].includes(lb.shape)
      ) {
        state.liquidBrain.shape = lb.shape;
        applied.push(`Shape ${lb.shape}`);
      }
      if (Array.isArray(lb.projectedApps) && lb.projectedApps.length > 0) {
        state.liquidBrain.projectedApps = lb.projectedApps.slice(0, 4);
        applied.push(`${state.liquidBrain.projectedApps.length} App Shapes`);
      }
      if (lb.fusionMode && ['orbitalArray', 'fusedHybrid'].includes(lb.fusionMode)) {
        state.liquidBrain.fusionMode = lb.fusionMode;
        applied.push(`Brain ${lb.fusionMode}`);
      }
      if (typeof lb.fusedBlend === 'number') {
        state.liquidBrain.fusedBlend = clamp(lb.fusedBlend, 0, 1);
      }
      if (typeof lb.morphFactor === 'number') {
        state.liquidBrain.morphFactor = clamp(lb.morphFactor, 0, 1);
      }
      if (typeof lb.twistAngle === 'number') {
        state.liquidBrain.twistAngle = clamp(lb.twistAngle, -2, 2);
      }
      if (typeof lb.explodeRadius === 'number') {
        state.liquidBrain.explodeRadius = clamp(lb.explodeRadius, 0, 1);
      }
      if (typeof lb.fluidPressure === 'number') {
        state.liquidBrain.fluidPressure = clamp(lb.fluidPressure, 0.1, 1);
      }
      if (typeof lb.synapseViscosity === 'number') {
        state.liquidBrain.synapseViscosity = clamp(lb.synapseViscosity, 0.1, 1);
      }
      propagateFusionSynergy();
    }
    if (commands.holographic && typeof commands.holographic === 'object') {
      const hg = commands.holographic;
      if (typeof hg.enabled === 'boolean') {
        state.holographic.enabled = hg.enabled;
        applied.push(`Hologram ${hg.enabled ? 'ON' : 'OFF'}`);
      }
      if (
        hg.rigMode &&
        [
          'pepperGhostPyramid',
          'volumetricSliceStack',
          'liquidGlassPrism',
          'floatingCausticField',
        ].includes(hg.rigMode)
      ) {
        state.holographic.rigMode = hg.rigMode;
        if (typeof hg.enabled !== 'boolean') state.holographic.enabled = true;
        applied.push(`Holo ${hg.rigMode}`);
      }
      if (typeof hg.sliceCount === 'number') {
        state.holographic.sliceCount = clamp(Math.round(hg.sliceCount), 3, 16);
      }
      if (typeof hg.glassRefraction === 'number') {
        state.holographic.glassRefraction = clamp(hg.glassRefraction, 0, 1);
      }
      if (typeof hg.reflectionMix === 'number') {
        state.holographic.reflectionMix = clamp(hg.reflectionMix, 0, 1);
      }
      if (typeof hg.chromaticSplit === 'number') {
        state.holographic.chromaticSplit = clamp(hg.chromaticSplit, 0, 1);
      }
      if (typeof hg.parallaxDepth === 'number') {
        state.holographic.parallaxDepth = clamp(hg.parallaxDepth, 0, 1);
      }
      if (typeof hg.scanlineCoherence === 'number') {
        state.holographic.scanlineCoherence = clamp(hg.scanlineCoherence, 0, 1);
      }
      if (typeof hg.causticFocus === 'number') {
        state.holographic.causticFocus = clamp(hg.causticFocus, 0, 1);
      }
      if (typeof hg.baseElevation === 'number') {
        state.holographic.baseElevation = clamp(hg.baseElevation, 0.4, 2.2);
      }
      if (typeof hg.autoRotate === 'boolean') {
        state.holographic.autoRotate = hg.autoRotate;
      }
      propagateFusionSynergy();
    }
    if (commands.projectHologram) {
      projectHologramFromMainImage();
      applied.push('Liquid Glass Hologram Projected');
    }
    if (commands.triggerLiquidPulse) {
      triggerLiquidPulse(1.15);
      applied.push('Liquid Pulse');
    }
    if (commands.maximizeSystem) {
      applied.push(...maximizeSystem());
    }
    if (commands.stage3d && typeof commands.stage3d === 'object') {
      const s3 = commands.stage3d;
      if (typeof s3.coneMultiplier === 'number') {
        state.stage3d.coneMultiplier = clamp(Math.round(s3.coneMultiplier), 1, 9);
        applied.push(`${state.stage3d.coneMultiplier}x Cones`);
      }
      if (typeof s3.screenCurvature === 'number') {
        state.stage3d.screenCurvature = clamp(s3.screenCurvature, 0, 0.45);
        applied.push('Screen Curve');
      }
      if (s3.cameraPreset && ['audience', 'booth', 'origin', 'free'].includes(s3.cameraPreset)) {
        state.stage3d.cameraPreset = s3.cameraPreset;
        applied.push(`Cam ${s3.cameraPreset}`);
      }
    }
    if (typeof commands.seekSeconds === 'number' && Number.isFinite(commands.seekSeconds)) {
      state.currentTime = clamp(commands.seekSeconds, 0, state.duration || 120);
      applied.push(`Seek ${state.currentTime.toFixed(1)}s`);
    }
    if (typeof commands.addMarkerLabel === 'string' && commands.addMarkerLabel.trim()) {
      const label = commands.addMarkerLabel.trim();
      state.markers.push({
        id: `m-${Date.now()}`,
        time: state.currentTime,
        label,
      });
      applied.push(`Marker "${label}"`);
    }
    if (commands.abLoop && typeof commands.abLoop === 'object') {
      if (commands.abLoop.a !== undefined) state.abLoop.a = commands.abLoop.a;
      if (commands.abLoop.b !== undefined) state.abLoop.b = commands.abLoop.b;
      if (typeof commands.abLoop.enabled === 'boolean') {
        state.abLoop.enabled = commands.abLoop.enabled;
      } else if (state.abLoop.a !== null && state.abLoop.b !== null) {
        state.abLoop.enabled = true;
      }
      applied.push(`A/B Loop ${state.abLoop.enabled ? 'ON' : 'OFF'}`);
    }

    if (applied.length > 0) {
      emit('autopilot:applied', { applied, commands });
    }
    return applied;
  };

  const reportFrameMetrics = (fps: number, frameTimeMs: number, targetCapHz = 60) => {
    state.fps = Math.round(fps * 10) / 10;
    state.frameTimeMs = Math.round(frameTimeMs * 100) / 100;
    state.targetCapHz = targetCapHz;
  };

  let lastDaemonUpdate = 0;
  const tickDaemons = (nowMs: number) => {
    if (nowMs - lastDaemonUpdate < 160) return;
    lastDaemonUpdate = nowMs;
    const phase = (nowMs * 0.001) % (Math.PI * 2);
    state.stage3d.cspThermalPhase = Math.round(phase * 1000) / 1000;

    if (state.liquified3d.pulseEnergy > 0.005) {
      state.liquified3d.pulseEnergy = Math.max(0, state.liquified3d.pulseEnergy * 0.88 - 0.005);
    } else {
      state.liquified3d.pulseEnergy = 0;
    }

    // Auto-maximize daemon coherence when Fusion Matrix autoMaximize or Cynthetoc AI is enabled
    const maxMode = state.fusionMatrix.enabled && state.fusionMatrix.autoMaximize;
    const targetBoost = state.cynthetocAi.enabled
      ? Number((2.0 + state.cynthetocAi.autonomy).toFixed(1))
      : maxMode
      ? 2.2
      : 1.0;

    if (
      state.cynthetocAi.enabled &&
      state.cynthetocAi.kineticSync &&
      state.playing &&
      Math.sin(phase * 2.0) > 0.97 &&
      state.liquified3d.pulseEnergy < 0.15
    ) {
      state.liquified3d.pulseEnergy = 0.28 * state.cynthetocAi.synthesisStrength;
    }

    daemons.forEach((d, idx) => {
      d.ticks += 1;
      d.lastTickAt = nowMs;
      d.loadPct = Math.round((3.5 + ((idx * 2.4 + state.fps * 0.12) % 16)) * 10) / 10;
      d.efficiencyPct = maxMode
        ? Math.min(100, Math.round(97 + ((state.fps / Math.max(1, state.targetCapHz)) * 3)))
        : 95;
      d.boostFactor = Math.max(d.boostFactor >= 3.0 ? 3.0 : targetBoost, targetBoost);

      switch (d.id) {
        case 'd01-csp-fsm':
          d.status = maxMode ? 'MAXIMIZED' : 'ACTIVE';
          d.telemetry = { phase: state.stage3d.cspThermalPhase, collectorFused: true };
          break;
        case 'd02-microfractal-kernel':
          d.status = state.playing ? 'ACTIVE' : 'IDLE';
          d.telemetry = { source: state.mediaType, ratio: state.cinema.aspectRatio };
          break;
        case 'd03-optics-desqueeze':
          d.status = state.anamorphicSqueeze ? 'ACTIVE' : 'SYNCED';
          d.telemetry = { squeeze: state.anamorphicSqueeze ? '2.39x' : '1.00x', grain: state.cinema.filmGrain };
          break;
        case 'd04-liquid-upscale':
          d.status = state.upscaleMode === 'off' ? 'SYNCED' : 'MAXIMIZED';
          d.telemetry = { tier: state.upscaleMode.toUpperCase(), target: state.upscaleResolution };
          break;
        case 'd05-color-lut':
          d.status = 'ACTIVE';
          d.telemetry = { lut: state.grading.lut, ev: state.grading.exposure };
          break;
        case 'd06-projector-beam':
          d.status = state.realTv.enabled || state.subtractMode ? 'ACTIVE' : 'SYNCED';
          d.telemetry = { subtract: state.subtractMode, realTv: state.realTv.enabled };
          break;
        case 'd07-auditorium-3d':
          d.status =
            state.mode === '3d' || state.stereoscopic.enabled || state.holographic.enabled
              ? 'MAXIMIZED'
              : 'SYNCED';
          d.telemetry = {
            cones: state.stage3d.coneMultiplier,
            stereo: state.stereoscopic.enabled ? state.stereoscopic.mode : 'off',
            brainShape: state.liquidBrain.shape,
            hologram: state.holographic.enabled ? state.holographic.rigMode : 'off',
          };
          break;
        case 'd08-timeline-ab':
          d.status = state.abLoop.enabled ? 'ACTIVE' : 'SYNCED';
          d.telemetry = { markers: state.markers.length, t: Math.round(state.currentTime * 10) / 10 };
          break;
        case 'd09-real-fps':
          d.status = state.realFpsMode || state.cinema.cadence24p ? 'ACTIVE' : 'SYNCED';
          d.telemetry = { fps: state.fps, ms: state.frameTimeMs, cadence24p: state.cinema.cadence24p };
          break;
        case 'd10-brain-bus':
          d.status = maxMode ? 'MAXIMIZED' : 'ACTIVE';
          d.telemetry = { appsFused: appsMap.size, events: eventSeq };
          break;
        case 'd11-scene-designer':
          d.status = 'ACTIVE';
          d.telemetry = { theme: state.sceneDesigner.theme, rings: state.sceneDesigner.fractalComplexity };
          break;
        case 'd12-cartoon-cel':
          d.status = state.videoToCartoon.enabled ? 'MAXIMIZED' : 'SYNCED';
          d.telemetry = { enabled: state.videoToCartoon.enabled, style: state.videoToCartoon.style };
          break;
        case 'd13-fusion-matrix':
          d.status = state.fusionMatrix.enabled ? 'MAXIMIZED' : 'IDLE';
          d.telemetry = { coherence: `${state.fusionMatrix.coherencePct}%`, gain: state.fusionMatrix.synergyGain };
          break;
        case 'd14-sustain-watchdog':
          d.status = 'SUSTAINING';
          d.telemetry = { restarts: window.__FRACTAL_WATCHDOG__?.restarts ?? 0, healthy: true };
          break;
        case 'd15-thermal-governor':
          d.status = 'SUSTAINING';
          d.telemetry = { halation: state.cinema.halation, flare: state.anamorphicFlare };
          break;
        case 'd16-memory-gc-guard':
          d.status = 'SUSTAINING';
          d.telemetry = { eventBuffer: eventLog.length, maxEvents: 80 };
          break;
        case 'd17-shader-coherence':
          d.status = 'SUSTAINING';
          d.telemetry = { toon: state.videoToCartoon.enabled, tv: state.realTv.enabled };
          break;
        case 'd18-bandwidth-maximizer':
          d.status = maxMode ? 'MAXIMIZED' : 'SUSTAINING';
          d.telemetry = { frameMs: state.frameTimeMs, capHz: state.targetCapHz };
          break;
        case 'd19-aimx-triad-sync':
          d.status = 'MAXIMIZED';
          d.telemetry = { coreA: true, coreB: true, coreC: true, cynthetoc: state.cynthetocAi.enabled };
          break;
        case 'd20-harmony-maximizer':
          d.status = maxMode ? 'MAXIMIZED' : 'SUSTAINING';
          d.telemetry = {
            daemons: 20,
            modules: appsMap.size,
            boost: `${d.boostFactor.toFixed(1)}x`,
            synergy: `${state.fusionMatrix.coherencePct}%`,
          };
          break;
      }
    });
  };

  // Register and fuse csp-collector FIRST, then all remaining modules (20 total including cynthetoc-ai)
  for (const mod of REQUIRED_MODULES) {
    registerApp(mod.id, { name: mod.name, role: mod.role });
    fuseApp(mod.id, { bootPriority: mod.id === 'csp-collector' ? 0 : 1 });
  }

  emit('brain:ready', { version: '2.5.0', primary: 'csp-collector', daemons: 20, apps: appsMap.size });

  return {
    version: '2.5.0',
    registerApp,
    fuseApp,
    set,
    get,
    setLiquid8k,
    setLiquid16k,
    setLiquid64k,
    setTheatreView,
    setRealFpsMode,
    setRealTvMode,
    setSceneDesigner,
    setVideoToCartoon,
    setFusionMatrix,
    setLiquified3d,
    setCynthetocAi,
    setStereoscopic,
    setLiquidBrain,
    setHolographic,
    projectHologramFromMainImage,
    fuseProjectedApps,
    alterAppShape,
    triggerLiquidPulse,
    maximizeSystem,
    applyCommands,
    syncPlaybackTime,
    getSnapshot,
    getApps,
    getDaemons: () => daemons.map((d) => ({ ...d, telemetry: { ...d.telemetry } })),
    getEventLog: () => [...eventLog],
    emit,
    on,
    off,
    reportFrameMetrics,
    tickDaemons,
  };
}

declare global {
  interface Window {
    FractalBrain: FractalBrainAPI;
    __FRACTAL_BOOT_TS__?: number;
    __FRACTAL_WATCHDOG__?: {
      restarts: number;
      lastFrameTs: number;
      healthy: boolean;
    };
  }
}

export function getFractalBrain(): FractalBrainAPI {
  if (typeof window !== 'undefined') {
    if (!window.FractalBrain) {
      window.FractalBrain = createFractalBrain();
    }
    return window.FractalBrain;
  }
  return createFractalBrain();
}

if (typeof window !== 'undefined' && !window.FractalBrain) {
  window.FractalBrain = createFractalBrain();
}
