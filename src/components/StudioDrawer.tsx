import React, { useState } from 'react';
import {
  Sliders,
  Layers,
  Scissors,
  Cpu,
  X,
  RotateCcw,
  Camera,
  Download,
  Plus,
  Trash2,
  Tv,
  Film,
  Grid,
  Zap,
  Sparkles,
  Network,
  Droplets,
  Brain,
  Eye,
  Orbit,
  Hexagon,
} from 'lucide-react';
import {
  DEFAULT_CINEMA,
  DEFAULT_CYNTHETOC_AI,
  DEFAULT_FUSION_MATRIX,
  DEFAULT_GRADING,
  DEFAULT_HOLOGRAPHIC,
  DEFAULT_LIQUID_BRAIN,
  DEFAULT_LIQUIFIED_3D,
  DEFAULT_REAL_TV,
  DEFAULT_SCENE_DESIGNER,
  DEFAULT_STEREOSCOPIC,
  DEFAULT_VIDEO_TO_CARTOON,
  type AppShapeTopologyId,
  type CartoonStyleId,
  type CinemaAspectRatio,
  type CinemaModeConfig,
  type ColorGradingState,
  type CynthetocAiConfig,
  type CynthetocModeId,
  type FractalAppModule,
  type FractalStudioState,
  type FrameGuideMode,
  type FusionMatrixConfig,
  type HologramRigMode,
  type HolographicProjectionConfig,
  type LiquidBrainConfig,
  type LiquidBrainFusionMode,
  type Liquified3dConfig,
  type LiquidPresetId,
  type LutPresetId,
  type RealTvModeConfig,
  type RealTvProfile,
  type SceneDesignerConfig,
  type SceneThemeId,
  type SovereignDaemon,
  type Stereoscopic3dConfig,
  type StereoscopicModeId,
  type UpscaleTier,
  type VideoToCartoonConfig,
} from '../core/fractalBrain';

interface StudioDrawerProps {
  open: boolean;
  onClose: () => void;
  state: FractalStudioState;
  apps: FractalAppModule[];
  daemons: SovereignDaemon[];
  onUpdateGrading: (patch: Partial<ColorGradingState>) => void;
  onUpdateCinema: (patch: Partial<CinemaModeConfig>) => void;
  onUpdateRealTv: (patch: Partial<RealTvModeConfig>) => void;
  onUpdateSceneDesigner: (patch: Partial<SceneDesignerConfig>) => void;
  onUpdateVideoToCartoon: (patch: Partial<VideoToCartoonConfig>) => void;
  onUpdateFusionMatrix: (patch: Partial<FusionMatrixConfig>) => void;
  onUpdateLiquified3d: (patch: Partial<Liquified3dConfig>) => void;
  onUpdateCynthetocAi: (patch: Partial<CynthetocAiConfig>) => void;
  onUpdateStereoscopic: (patch: Partial<Stereoscopic3dConfig>) => void;
  onUpdateLiquidBrain: (patch: Partial<LiquidBrainConfig>) => void;
  onUpdateHolographic: (patch: Partial<HolographicProjectionConfig>) => void;
  onProjectHologram: () => void;
  onFuseProjectedApps: () => void;
  onCynthetocDirect: () => void;
  onTriggerLiquidPulse: () => void;
  onMaximizeSystem: () => void;
  onUpdateState: (patch: Partial<FractalStudioState>) => void;
  onSetUpscale: (tier: UpscaleTier) => void;
  onCameraPreset: (preset: 'audience' | 'booth' | 'origin') => void;
  onAddMarker: (label: string) => void;
  onJumpMarker: (time: number) => void;
  onRemoveMarker: (id: string) => void;
  onSetAbPoint: (point: 'a' | 'b' | 'clear') => void;
  onToggleAbLoop: () => void;
  onCaptureSnapshot: () => void;
  onExportHtml: () => void;
}

type DrawerTab = 'color' | 'optics' | 'apps' | 'timeline' | 'brain';

const LUT_PRESETS: Array<{ id: LutPresetId; label: string; grading?: Partial<ColorGradingState> }> = [
  { id: 'neutral', label: 'Reset', grading: DEFAULT_GRADING },
  {
    id: 'kodak2383',
    label: 'Kodak 2383 Print',
    grading: { contrast: 1.14, saturation: 1.08, highlightRolloff: 0.45, temperature: 0.08 },
  },
  {
    id: 'tealAmber',
    label: 'Teal & Amber Scope',
    grading: { contrast: 1.12, saturation: 1.15, temperature: 0.05, highlightRolloff: 0.35 },
  },
  {
    id: 'bleachBypass',
    label: 'Bleach Bypass',
    grading: { contrast: 1.24, saturation: 0.72, highlightRolloff: 0.25 },
  },
  {
    id: 'noirSilver',
    label: 'Noir Silver',
    grading: { contrast: 1.28, saturation: 0.1, highlightRolloff: 0.4 },
  },
];

const ASPECT_OPTIONS: Array<{ id: CinemaAspectRatio; label: string }> = [
  { id: '2.39', label: '2.39:1' },
  { id: '2.35', label: '2.35:1' },
  { id: '1.85', label: '1.85:1' },
  { id: '16:9', label: '16:9' },
  { id: '4:3', label: '4:3' },
];

const TV_PROFILES: Array<{ id: RealTvProfile; label: string }> = [
  { id: 'crt', label: 'CRT 480i' },
  { id: 'trinitron', label: 'Trinitron' },
  { id: 'oled', label: 'Broadcast OLED' },
  { id: 'vhs', label: 'VHS RF' },
];

const SCENE_THEMES: Array<{ id: SceneThemeId; label: string }> = [
  { id: 'obsidianAmber', label: 'Obsidian Amber' },
  { id: 'solarReactor', label: 'Solar Reactor' },
  { id: 'neonBroadcast', label: 'Neon Broadcast' },
  { id: 'emeraldMatrix', label: 'Emerald Matrix' },
  { id: 'crimsonNoir', label: 'Crimson Noir' },
];

const CARTOON_STYLES: Array<{ id: CartoonStyleId; label: string }> = [
  { id: 'celAnime', label: 'Cel Anime' },
  { id: 'noirInk', label: 'Noir Ink' },
  { id: 'popComic', label: 'Pop Comic' },
  { id: 'microFractalToon', label: 'MicroFractal Toon' },
];

const LIQUID_PRESETS: Array<{ id: LiquidPresetId; label: string }> = [
  { id: 'moltenAmber', label: 'Molten Amber' },
  { id: 'mercuryChrome', label: 'Mercury Chrome' },
  { id: 'ferrofluidObsidian', label: 'Ferrofluid Obsidian' },
  { id: 'iridescentPlasma', label: 'Iridescent Plasma' },
  { id: 'liquidGlass', label: 'Liquid Glass' },
];

const CYNTHETOC_MODES: Array<{ id: CynthetocModeId; label: string }> = [
  { id: 'adaptiveDirector', label: 'Adaptive Director' },
  { id: 'neuralSupersample', label: 'Neural 16K/64K' },
  { id: 'syntheticRelight', label: 'Synthetic Relight' },
  { id: 'kineticPulse', label: 'Kinetic Pulse' },
];

const STEREO_MODES: Array<{ id: StereoscopicModeId; label: string }> = [
  { id: 'anaglyphRedCyan', label: 'Red / Cyan' },
  { id: 'amberBlueColorCode', label: 'Amber / Blue' },
  { id: 'pulfrichAnalog', label: 'Pulfrich 3D' },
  { id: 'sideBySide', label: 'Side-by-Side' },
  { id: 'interlacedField', label: 'Field 3D' },
];

const APP_SHAPES: Array<{ id: AppShapeTopologyId; label: string }> = [
  { id: 'mobiusRibbon', label: 'Mobius' },
  { id: 'torus', label: 'Torus' },
  { id: 'sphere', label: 'Sphere' },
  { id: 'cube', label: 'Cube' },
  { id: 'octaPrism', label: 'OctaPrism' },
  { id: 'cone', label: 'Cone' },
];

const PROJECTABLE_APPS: Array<{ id: string; label: string }> = [
  { id: 'cynthetoc-ai', label: 'Cynthetoc AI' },
  { id: 'intelligent-scene-designer', label: 'Scene Designer' },
  { id: 'intelligent-video-to-cartoon', label: 'Cartoonizer' },
  { id: 'liquified-3d-studio', label: 'Liquified 3D' },
  { id: 'real-tv-engine', label: 'Real TV' },
  { id: 'csp-collector', label: 'CSP Loop' },
];

const HOLOGRAM_RIGS: Array<{ id: HologramRigMode; label: string }> = [
  { id: 'pepperGhostPyramid', label: "Pepper's Ghost" },
  { id: 'volumetricSliceStack', label: 'Volumetric Slices' },
  { id: 'liquidGlassPrism', label: 'Liquid Glass Prism' },
  { id: 'floatingCausticField', label: 'Caustic Field' },
];

function formatTime(sec: number): string {
  const s = Math.max(0, sec);
  const mins = Math.floor(s / 60);
  const rem = Math.floor(s % 60);
  const tenths = Math.floor((s % 1) * 10);
  return `${String(mins).padStart(2, '0')}:${String(rem).padStart(2, '0')}.${tenths}`;
}

export const StudioDrawer: React.FC<StudioDrawerProps> = ({
  open,
  onClose,
  state,
  apps,
  daemons,
  onUpdateGrading,
  onUpdateCinema,
  onUpdateRealTv,
  onUpdateSceneDesigner,
  onUpdateVideoToCartoon,
  onUpdateFusionMatrix,
  onUpdateLiquified3d,
  onUpdateCynthetocAi,
  onUpdateStereoscopic,
  onUpdateLiquidBrain,
  onUpdateHolographic,
  onProjectHologram,
  onFuseProjectedApps,
  onCynthetocDirect,
  onTriggerLiquidPulse,
  onMaximizeSystem,
  onUpdateState,
  onSetUpscale,
  onCameraPreset,
  onAddMarker,
  onJumpMarker,
  onRemoveMarker,
  onSetAbPoint,
  onToggleAbLoop,
  onCaptureSnapshot,
  onExportHtml,
}) => {
  const [tab, setTab] = useState<DrawerTab>('apps');
  const [markerLabel, setMarkerLabel] = useState('');

  if (!open) return null;

  const sliderRow = (
    label: string,
    value: number,
    min: number,
    max: number,
    step: number,
    format: (v: number) => string,
    onChange: (v: number) => void
  ) => (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-[11px]">
        <span className="text-zinc-300 font-medium">{label}</span>
        <span className="font-mono tabular-nums text-[#ff8c2e]">{format(value)}</span>
      </div>
      <input
        type="range"
        className="fos-slider w-full"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
      />
    </div>
  );

  return (
    <aside
      aria-label="CinemaScope Studio Inspector"
      className="fixed top-8 right-2 bottom-12 z-30 w-[280px] max-w-[calc(100vw-16px)] bg-[#0b0b0e]/95 backdrop-blur-md border border-white/10 rounded-lg shadow-2xl flex flex-col overflow-hidden"
    >
      {/* Drawer Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-white/10 shrink-0">
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-semibold tracking-wide text-zinc-100">
            Studio & Apps
          </span>
          <span className="text-[10px] font-mono tabular-nums text-[#ff6a00]">
            {state.fusionMatrix.coherencePct}% · {daemons.length}D
          </span>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="p-1 rounded text-zinc-400 hover:text-zinc-100 hover:bg-white/5 transition-colors"
          aria-label="Close Studio Drawer"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Segmented Tabs */}
      <div className="grid grid-cols-5 gap-1 p-1 border-b border-white/10 bg-[#08080a] shrink-0">
        {(
          [
            { id: 'apps', label: 'Apps', title: '3D & AI Apps', icon: Grid },
            { id: 'color', label: 'Color', title: 'Color Grading & LUTs', icon: Sliders },
            { id: 'optics', label: 'Optics', title: 'Cinema & Real TV Optics', icon: Layers },
            { id: 'timeline', label: 'Clips', title: 'Clips & Export', icon: Scissors },
            { id: 'brain', label: '20D', title: '20 Sovereign Daemons & Bus', icon: Cpu },
          ] as const
        ).map((item) => {
          const Icon = item.icon;
          const active = tab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              title={item.title}
              onClick={() => setTab(item.id)}
              className={`flex items-center justify-center gap-1 py-1 px-0.5 rounded text-[9.5px] font-medium whitespace-nowrap shrink-0 transition-colors ${
                active
                  ? 'bg-[#ff6a00] text-[#050506]'
                  : 'text-zinc-400 hover:text-zinc-100 hover:bg-white/5'
              }`}
            >
              <Icon className="w-2.5 h-2.5 shrink-0" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Scrollable Body */}
      <div className="flex-1 overflow-y-auto fos-scroll p-3 space-y-4">
        {tab === 'apps' && (
          <>
            {/* Cynthetoc AI Neural Director & Synthesizer */}
            <div className="space-y-2.5 pb-3 border-b border-white/8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Brain className="w-3.5 h-3.5 text-[#ff6a00]" />
                  <span className="text-xs font-semibold text-zinc-100">
                    Cynthetoc AI (Z)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onUpdateCynthetocAi(DEFAULT_CYNTHETOC_AI)}
                    className="text-[11px] text-zinc-400 hover:text-zinc-200"
                  >
                    Reset
                  </button>
                  <button
                    type="button"
                    onClick={() => onUpdateCynthetocAi({ enabled: !state.cynthetocAi.enabled })}
                    className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-colors ${
                      state.cynthetocAi.enabled
                        ? 'bg-[#ff6a00] text-[#050506]'
                        : 'bg-[#121216] border border-white/10 text-zinc-300'
                    }`}
                  >
                    {state.cynthetocAi.enabled ? 'Active' : 'Off'}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-1.5">
                {CYNTHETOC_MODES.map((cm) => (
                  <button
                    key={cm.id}
                    type="button"
                    onClick={() => onUpdateCynthetocAi({ enabled: true, mode: cm.id })}
                    className={`py-1.5 px-2 rounded-md text-[11px] font-medium text-left truncate border transition-colors ${
                      state.cynthetocAi.enabled && state.cynthetocAi.mode === cm.id
                        ? 'bg-[#ff6a00]/18 border-[#ff6a00] text-[#ff9438]'
                        : 'bg-[#121216] border-white/8 text-zinc-300 hover:border-white/20'
                    }`}
                  >
                    {cm.label}
                  </button>
                ))}
              </div>

              {sliderRow(
                'Neural Synthesis',
                state.cynthetocAi.synthesisStrength,
                0,
                1,
                0.02,
                (v) => `${Math.round(v * 100)}%`,
                (v) => onUpdateCynthetocAi({ synthesisStrength: v })
              )}
              {sliderRow(
                'Rim Reillumination',
                state.cynthetocAi.relightIntensity,
                0,
                1,
                0.02,
                (v) => `${Math.round(v * 100)}%`,
                (v) => onUpdateCynthetocAi({ relightIntensity: v })
              )}
              {sliderRow(
                'Anisotropic Denoise',
                state.cynthetocAi.neuralDenoise,
                0,
                1,
                0.02,
                (v) => `${Math.round(v * 100)}%`,
                (v) => onUpdateCynthetocAi({ neuralDenoise: v })
              )}

              <div className="grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={() =>
                    onUpdateCynthetocAi({ kineticSync: !state.cynthetocAi.kineticSync })
                  }
                  className={`py-1.5 px-2 rounded-md text-[11px] font-medium border transition-colors ${
                    state.cynthetocAi.kineticSync
                      ? 'bg-[#ff6a00]/18 border-[#ff6a00] text-[#ff9438]'
                      : 'bg-[#121216] border-white/8 text-zinc-400'
                  }`}
                >
                  Kinetic Sync
                </button>
                <button
                  type="button"
                  onClick={onCynthetocDirect}
                  className="py-1.5 px-2 rounded-md text-[11px] font-semibold bg-[#ff6a00] hover:bg-[#ff8c2e] text-[#050506] transition-colors truncate"
                >
                  Auto-Direct Frame
                </button>
              </div>
            </div>

            {/* 0. Liquified 3D Studio */}
            <div className="space-y-3 pb-3 border-b border-white/8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Droplets className="w-3.5 h-3.5 text-[#ff6a00]" />
                  <span className="text-xs font-semibold text-zinc-100">
                    Liquified 3D Studio
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onUpdateLiquified3d(DEFAULT_LIQUIFIED_3D)}
                    className="text-[11px] text-zinc-400 hover:text-zinc-200"
                  >
                    Reset
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const nextEnabled = !state.liquified3d.enabled;
                      onUpdateLiquified3d({ enabled: nextEnabled });
                      if (nextEnabled) onUpdateState({ mode: '3d' });
                    }}
                    className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors ${
                      state.liquified3d.enabled
                        ? 'bg-[#ff6a00] text-[#050506]'
                        : 'bg-[#121216] border border-white/10 text-zinc-300'
                    }`}
                  >
                    {state.liquified3d.enabled ? 'Active' : 'Off'}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-1.5">
                {LIQUID_PRESETS.map((lp) => (
                  <button
                    key={lp.id}
                    type="button"
                    onClick={() => {
                      onUpdateLiquified3d({ enabled: true, fluidPreset: lp.id });
                      onUpdateState({ mode: '3d' });
                    }}
                    className={`py-1.5 px-2 rounded-lg text-xs font-medium text-left truncate border transition-colors ${
                      state.liquified3d.enabled && state.liquified3d.fluidPreset === lp.id
                        ? 'bg-[#ff6a00]/18 border-[#ff6a00] text-[#ff9438]'
                        : 'bg-[#121216] border-white/8 text-zinc-300 hover:border-white/20'
                    }`}
                  >
                    {lp.label}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    onUpdateState({ mode: '3d' });
                    onTriggerLiquidPulse();
                  }}
                  className="py-1.5 px-2 rounded-lg text-xs font-semibold bg-[#ff6a00]/15 border border-[#ff6a00]/60 text-[#ff9438] hover:bg-[#ff6a00] hover:text-[#050506] transition-colors"
                >
                  Inject Liquid Pulse
                </button>
              </div>

              {sliderRow(
                'Fluid Viscosity',
                state.liquified3d.viscosity,
                0.1,
                1,
                0.02,
                (v) => `${Math.round(v * 100)}%`,
                (v) => onUpdateLiquified3d({ viscosity: v })
              )}
              {sliderRow(
                'Optical Refraction & Dispersion',
                state.liquified3d.refraction,
                0,
                1,
                0.02,
                (v) => `${Math.round(v * 100)}%`,
                (v) => onUpdateLiquified3d({ refraction: v })
              )}
              {sliderRow(
                'Chrome Fresnel Reflection',
                state.liquified3d.chromeFresnel,
                0,
                1,
                0.02,
                (v) => `${Math.round(v * 100)}%`,
                (v) => onUpdateLiquified3d({ chromeFresnel: v })
              )}
              {sliderRow(
                'Interactive Ripple Force',
                state.liquified3d.rippleForce,
                0,
                1,
                0.02,
                (v) => `${Math.round(v * 100)}%`,
                (v) => onUpdateLiquified3d({ rippleForce: v })
              )}

              <div className="grid grid-cols-3 gap-1.5">
                <button
                  type="button"
                  onClick={() =>
                    onUpdateLiquified3d({ solidGeometry: !state.liquified3d.solidGeometry })
                  }
                  className={`py-1.5 px-2 rounded-lg text-[11px] font-medium border transition-colors ${
                    state.liquified3d.solidGeometry
                      ? 'bg-[#ff6a00]/18 border-[#ff6a00] text-[#ff9438]'
                      : 'bg-[#121216] border-white/8 text-zinc-400'
                  }`}
                >
                  Solid Liquid
                </button>
                <button
                  type="button"
                  onClick={() =>
                    onUpdateLiquified3d({
                      liquidScreenOptical: !state.liquified3d.liquidScreenOptical,
                    })
                  }
                  className={`py-1.5 px-2 rounded-lg text-[11px] font-medium border transition-colors ${
                    state.liquified3d.liquidScreenOptical
                      ? 'bg-[#ff6a00]/18 border-[#ff6a00] text-[#ff9438]'
                      : 'bg-[#121216] border-white/8 text-zinc-400'
                  }`}
                >
                  Liquid Screen
                </button>
                <button
                  type="button"
                  onClick={() =>
                    onUpdateLiquified3d({ autoOrbit: !state.liquified3d.autoOrbit })
                  }
                  className={`py-1.5 px-2 rounded-lg text-[11px] font-medium border transition-colors ${
                    state.liquified3d.autoOrbit
                      ? 'bg-[#ff6a00]/18 border-[#ff6a00] text-[#ff9438]'
                      : 'bg-[#121216] border-white/8 text-zinc-400'
                  }`}
                >
                  Auto Orbit
                </button>
              </div>
            </div>

            {/* Stereoscopic 3D Separation Engine */}
            <div className="space-y-2.5 pb-3 border-b border-white/8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-[#ff6a00]" />
                  <span className="text-xs font-semibold text-zinc-100">
                    Stereoscopic 3D (Y)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onUpdateStereoscopic(DEFAULT_STEREOSCOPIC)}
                    className="text-[11px] text-zinc-400 hover:text-zinc-200"
                  >
                    Reset
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      onUpdateStereoscopic({ enabled: !state.stereoscopic.enabled })
                    }
                    className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-colors ${
                      state.stereoscopic.enabled
                        ? 'bg-[#ff6a00] text-[#050506]'
                        : 'bg-[#121216] border border-white/10 text-zinc-300'
                    }`}
                  >
                    {state.stereoscopic.enabled ? 'Active' : 'Off'}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-1.5">
                {STEREO_MODES.map((sm) => (
                  <button
                    key={sm.id}
                    type="button"
                    onClick={() => onUpdateStereoscopic({ enabled: true, mode: sm.id })}
                    className={`py-1.5 px-2 rounded-md text-[11px] font-medium text-left truncate border transition-colors ${
                      state.stereoscopic.enabled && state.stereoscopic.mode === sm.id
                        ? 'bg-[#ff6a00]/18 border-[#ff6a00] text-[#ff9438]'
                        : 'bg-[#121216] border-white/8 text-zinc-300 hover:border-white/20'
                    }`}
                  >
                    {sm.label}
                  </button>
                ))}
              </div>

              {sliderRow(
                'Interaxial Separation',
                state.stereoscopic.interaxial,
                0,
                1,
                0.02,
                (v) => `${Math.round(v * 100)}%`,
                (v) => onUpdateStereoscopic({ interaxial: v })
              )}
              {sliderRow(
                'Convergence Plane',
                state.stereoscopic.convergence,
                -1,
                1,
                0.02,
                (v) => `${v >= 0 ? '+' : ''}${v.toFixed(2)}`,
                (v) => onUpdateStereoscopic({ convergence: v })
              )}
              {sliderRow(
                'Analog Crosstalk',
                state.stereoscopic.analogCrosstalk,
                0,
                0.4,
                0.01,
                (v) => `${Math.round(v * 100)}%`,
                (v) => onUpdateStereoscopic({ analogCrosstalk: v })
              )}
              {sliderRow(
                'Depth Synthesis',
                state.stereoscopic.depthSynthesis,
                0,
                1,
                0.02,
                (v) => `${Math.round(v * 100)}%`,
                (v) => onUpdateStereoscopic({ depthSynthesis: v })
              )}
            </div>

            {/* Liquid Brain 3D App Shapes & Fusion */}
            <div className="space-y-2.5 pb-3 border-b border-white/8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Orbit className="w-3.5 h-3.5 text-[#ff6a00]" />
                  <span className="text-xs font-semibold text-zinc-100">
                    Liquid Brain · 3D App Shapes
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onUpdateLiquidBrain(DEFAULT_LIQUID_BRAIN)}
                    className="text-[11px] text-zinc-400 hover:text-zinc-200"
                  >
                    Reset
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const nextEnabled = !state.liquidBrain.enabled;
                      onUpdateLiquidBrain({ enabled: nextEnabled });
                      if (nextEnabled) onUpdateState({ mode: '3d' });
                    }}
                    className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-colors ${
                      state.liquidBrain.enabled
                        ? 'bg-[#ff6a00] text-[#050506]'
                        : 'bg-[#121216] border border-white/10 text-zinc-300'
                    }`}
                  >
                    {state.liquidBrain.enabled ? 'Active' : 'Off'}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-1">
                {APP_SHAPES.map((sh) => (
                  <button
                    key={sh.id}
                    type="button"
                    onClick={() => {
                      onUpdateLiquidBrain({ enabled: true, shape: sh.id });
                      onUpdateState({ mode: '3d' });
                    }}
                    className={`py-1.5 px-1.5 rounded-md text-[11px] font-medium truncate border transition-colors ${
                      state.liquidBrain.enabled && state.liquidBrain.shape === sh.id
                        ? 'bg-[#ff6a00]/18 border-[#ff6a00] text-[#ff9438]'
                        : 'bg-[#121216] border-white/8 text-zinc-300 hover:border-white/20'
                    }`}
                  >
                    {sh.label}
                  </button>
                ))}
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-zinc-400 font-medium">Projected Apps (max 4)</span>
                  <span className="font-mono tabular-nums text-[#ff8c2e]">
                    {state.liquidBrain.projectedApps.length}/4
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  {PROJECTABLE_APPS.map((pa) => {
                    const selected = state.liquidBrain.projectedApps.includes(pa.id);
                    return (
                      <button
                        key={pa.id}
                        type="button"
                        onClick={() => {
                          const curr = state.liquidBrain.projectedApps;
                          let next: string[];
                          if (selected) {
                            next = curr.length > 1 ? curr.filter((x) => x !== pa.id) : curr;
                          } else {
                            next = [...curr, pa.id].slice(-4);
                          }
                          onUpdateLiquidBrain({ enabled: true, projectedApps: next });
                          onUpdateState({ mode: '3d' });
                        }}
                        className={`py-1 px-2 rounded text-[10.5px] font-medium text-left truncate border transition-colors ${
                          selected
                            ? 'bg-[#ff6a00]/18 border-[#ff6a00] text-[#ff9438]'
                            : 'bg-[#121216] border-white/8 text-zinc-400 hover:text-zinc-200'
                        }`}
                      >
                        {pa.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-1.5">
                {(
                  [
                    { id: 'orbitalArray', label: 'Orbital Array' },
                    { id: 'fusedHybrid', label: 'Fused Hybrid' },
                  ] as Array<{ id: LiquidBrainFusionMode; label: string }>
                ).map((fm) => (
                  <button
                    key={fm.id}
                    type="button"
                    onClick={() => {
                      onUpdateLiquidBrain({ enabled: true, fusionMode: fm.id });
                      onUpdateState({ mode: '3d' });
                    }}
                    className={`py-1.5 px-2 rounded-md text-[11px] font-medium border transition-colors ${
                      state.liquidBrain.fusionMode === fm.id
                        ? 'bg-[#ff6a00]/18 border-[#ff6a00] text-[#ff9438]'
                        : 'bg-[#121216] border-white/8 text-zinc-300'
                    }`}
                  >
                    {fm.label}
                  </button>
                ))}
              </div>

              {sliderRow(
                'Hydro Morph',
                state.liquidBrain.morphFactor,
                0,
                1,
                0.02,
                (v) => `${Math.round(v * 100)}%`,
                (v) => onUpdateLiquidBrain({ morphFactor: v })
              )}
              {sliderRow(
                'Helix Twist',
                state.liquidBrain.twistAngle,
                -2,
                2,
                0.05,
                (v) => `${v >= 0 ? '+' : ''}${v.toFixed(2)}`,
                (v) => onUpdateLiquidBrain({ twistAngle: v })
              )}
              {sliderRow(
                'Facet Explode',
                state.liquidBrain.explodeRadius,
                0,
                1,
                0.02,
                (v) => `${Math.round(v * 100)}%`,
                (v) => onUpdateLiquidBrain({ explodeRadius: v })
              )}
              {sliderRow(
                'Fluid Pressure',
                state.liquidBrain.fluidPressure,
                0.1,
                1,
                0.02,
                (v) => `${Math.round(v * 100)}%`,
                (v) => onUpdateLiquidBrain({ fluidPressure: v })
              )}
              {sliderRow(
                'Fusion Blend',
                state.liquidBrain.fusedBlend,
                0,
                1,
                0.02,
                (v) => `${Math.round(v * 100)}%`,
                (v) => onUpdateLiquidBrain({ fusedBlend: v })
              )}

              <button
                type="button"
                onClick={onFuseProjectedApps}
                className="w-full py-1.5 px-3 rounded-md bg-[#ff6a00]/15 border border-[#ff6a00]/60 text-[#ff9438] hover:bg-[#ff6a00] hover:text-[#050506] text-xs font-semibold transition-colors"
              >
                Fuse &amp; Morph 3D Shapes
              </button>
            </div>

            {/* Holographic Projection Engine (Liquid Glass Reflection + Main Image) */}
            <div className="space-y-2.5 pb-3 border-b border-white/8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Hexagon className="w-3.5 h-3.5 text-[#ff6a00]" />
                  <span className="text-xs font-semibold text-zinc-100">
                    Hologram Engine (H)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onUpdateHolographic(DEFAULT_HOLOGRAPHIC)}
                    className="text-[11px] text-zinc-400 hover:text-zinc-200"
                  >
                    Reset
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      onUpdateHolographic({ enabled: !state.holographic.enabled })
                    }
                    className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-colors ${
                      state.holographic.enabled
                        ? 'bg-[#ff6a00] text-[#050506]'
                        : 'bg-[#121216] border border-white/10 text-zinc-300'
                    }`}
                  >
                    {state.holographic.enabled ? 'Active' : 'Off'}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-1.5">
                {HOLOGRAM_RIGS.map((rig) => (
                  <button
                    key={rig.id}
                    type="button"
                    onClick={() => {
                      onUpdateHolographic({ enabled: true, rigMode: rig.id });
                      onUpdateState({ mode: '3d' });
                    }}
                    className={`py-1.5 px-2 rounded-md text-[11px] font-medium text-left truncate border transition-colors ${
                      state.holographic.enabled && state.holographic.rigMode === rig.id
                        ? 'bg-[#ff6a00]/18 border-[#ff6a00] text-[#ff9438]'
                        : 'bg-[#121216] border-white/8 text-zinc-300 hover:border-white/20'
                    }`}
                  >
                    {rig.label}
                  </button>
                ))}
              </div>

              {sliderRow(
                'Focal Slices',
                state.holographic.sliceCount,
                3,
                16,
                1,
                (v) => `${v} planes`,
                (v) => onUpdateHolographic({ sliceCount: v })
              )}
              {sliderRow(
                'Image Reflection',
                state.holographic.reflectionMix,
                0,
                1,
                0.02,
                (v) => `${Math.round(v * 100)}%`,
                (v) => onUpdateHolographic({ reflectionMix: v })
              )}
              {sliderRow(
                'Glass Refraction',
                state.holographic.glassRefraction,
                0,
                1,
                0.02,
                (v) => `${Math.round(v * 100)}%`,
                (v) => onUpdateHolographic({ glassRefraction: v })
              )}
              {sliderRow(
                'Prism Dispersion',
                state.holographic.chromaticSplit,
                0,
                1,
                0.02,
                (v) => `${Math.round(v * 100)}%`,
                (v) => onUpdateHolographic({ chromaticSplit: v })
              )}
              {sliderRow(
                'Parallax Relief',
                state.holographic.parallaxDepth,
                0,
                1,
                0.02,
                (v) => `${Math.round(v * 100)}%`,
                (v) => onUpdateHolographic({ parallaxDepth: v })
              )}
              {sliderRow(
                'Fringe Coherence',
                state.holographic.scanlineCoherence,
                0,
                1,
                0.02,
                (v) => `${Math.round(v * 100)}%`,
                (v) => onUpdateHolographic({ scanlineCoherence: v })
              )}
              {sliderRow(
                'Caustic Focus',
                state.holographic.causticFocus,
                0,
                1,
                0.02,
                (v) => `${Math.round(v * 100)}%`,
                (v) => onUpdateHolographic({ causticFocus: v })
              )}
              {sliderRow(
                'Hover Elevation',
                state.holographic.baseElevation,
                0.4,
                2.2,
                0.05,
                (v) => `${v.toFixed(2)}m`,
                (v) => onUpdateHolographic({ baseElevation: v })
              )}

              <div className="grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={() =>
                    onUpdateHolographic({ autoRotate: !state.holographic.autoRotate })
                  }
                  className={`py-1.5 px-2 rounded-md text-[11px] font-medium border transition-colors ${
                    state.holographic.autoRotate
                      ? 'bg-[#ff6a00]/18 border-[#ff6a00] text-[#ff9438]'
                      : 'bg-[#121216] border-white/8 text-zinc-400'
                  }`}
                >
                  Auto Rotate
                </button>
                <button
                  type="button"
                  onClick={onProjectHologram}
                  className="py-1.5 px-2 rounded-md text-[11px] font-semibold bg-[#ff6a00] hover:bg-[#ff8c2e] text-[#050506] transition-colors truncate"
                >
                  Project Hologram
                </button>
              </div>
            </div>

            {/* 1. Intelligent Scene Designer */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#ff6a00]" />
                  <span className="text-xs font-semibold text-zinc-100">
                    Intelligent Scene Designer
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => onUpdateSceneDesigner(DEFAULT_SCENE_DESIGNER)}
                  className="text-[11px] text-zinc-400 hover:text-zinc-200"
                >
                  Reset
                </button>
              </div>

              <div className="grid grid-cols-2 gap-1.5">
                {SCENE_THEMES.map((th) => (
                  <button
                    key={th.id}
                    type="button"
                    onClick={() => onUpdateSceneDesigner({ theme: th.id })}
                    className={`py-1.5 px-2 rounded-lg text-xs font-medium text-left truncate border transition-colors ${
                      state.sceneDesigner.theme === th.id
                        ? 'bg-[#ff6a00]/18 border-[#ff6a00] text-[#ff9438]'
                        : 'bg-[#121216] border-white/8 text-zinc-300 hover:border-white/20'
                    }`}
                  >
                    {th.label}
                  </button>
                ))}
              </div>

              {sliderRow(
                'Fractal Ring Complexity',
                state.sceneDesigner.fractalComplexity,
                2,
                8,
                1,
                (v) => `${v} rings`,
                (v) => onUpdateSceneDesigner({ fractalComplexity: v })
              )}
              {sliderRow(
                'Perspective Grid Depth',
                state.sceneDesigner.gridDepth,
                0,
                1,
                0.02,
                (v) => `${Math.round(v * 100)}%`,
                (v) => onUpdateSceneDesigner({ gridDepth: v })
              )}
              {sliderRow(
                'Atmosphere Overlay Blend',
                state.sceneDesigner.atmosphereBlend,
                0,
                1,
                0.02,
                (v) => `${Math.round(v * 100)}%`,
                (v) => onUpdateSceneDesigner({ atmosphereBlend: v })
              )}
              {sliderRow(
                'Scene Motion Speed',
                state.sceneDesigner.motionSpeed,
                0.2,
                2.5,
                0.05,
                (v) => `${v.toFixed(2)}x`,
                (v) => onUpdateSceneDesigner({ motionSpeed: v })
              )}
            </div>

            {/* 2. Intelligent Video to Cartoon */}
            <div className="space-y-3 pt-3 border-t border-white/8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Film className="w-3.5 h-3.5 text-[#ff6a00]" />
                  <span className="text-xs font-semibold text-zinc-100">
                    Intelligent Video to Cartoon (X)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onUpdateVideoToCartoon(DEFAULT_VIDEO_TO_CARTOON)}
                    className="text-[11px] text-zinc-400 hover:text-zinc-200"
                  >
                    Reset
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      onUpdateVideoToCartoon({ enabled: !state.videoToCartoon.enabled })
                    }
                    className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors ${
                      state.videoToCartoon.enabled
                        ? 'bg-[#ff6a00] text-[#050506]'
                        : 'bg-[#121216] border border-white/10 text-zinc-300'
                    }`}
                  >
                    {state.videoToCartoon.enabled ? 'Active' : 'Off'}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-1.5">
                {CARTOON_STYLES.map((st) => (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => onUpdateVideoToCartoon({ enabled: true, style: st.id })}
                    className={`py-1.5 px-2 rounded-lg text-xs font-medium text-left truncate border transition-colors ${
                      state.videoToCartoon.enabled && state.videoToCartoon.style === st.id
                        ? 'bg-[#ff6a00]/18 border-[#ff6a00] text-[#ff9438]'
                        : 'bg-[#121216] border-white/8 text-zinc-300 hover:border-white/20'
                    }`}
                  >
                    {st.label}
                  </button>
                ))}
              </div>

              {sliderRow(
                'Cel Quantization Bands',
                state.videoToCartoon.quantizeLevels,
                2,
                10,
                1,
                (v) => `${v} bands`,
                (v) => onUpdateVideoToCartoon({ quantizeLevels: v })
              )}
              {sliderRow(
                'Sobel Ink Edge Strength',
                state.videoToCartoon.edgeStrength,
                0,
                1,
                0.02,
                (v) => `${Math.round(v * 100)}%`,
                (v) => onUpdateVideoToCartoon({ edgeStrength: v })
              )}
              {sliderRow(
                'Ink Line Thickness',
                state.videoToCartoon.inkThickness,
                0.5,
                3,
                0.05,
                (v) => `${v.toFixed(2)}px`,
                (v) => onUpdateVideoToCartoon({ inkThickness: v })
              )}
              {sliderRow(
                'Comic Halftone Dots',
                state.videoToCartoon.halftone,
                0,
                1,
                0.02,
                (v) => `${Math.round(v * 100)}%`,
                (v) => onUpdateVideoToCartoon({ halftone: v })
              )}
            </div>

            {/* 3. Intelligent Fusion Matrix */}
            <div className="space-y-3 pt-3 border-t border-white/8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Network className="w-3.5 h-3.5 text-[#ff6a00]" />
                  <span className="text-xs font-semibold text-zinc-100">
                    Intelligent Fusion Matrix
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    onUpdateFusionMatrix({ enabled: !state.fusionMatrix.enabled })
                  }
                  className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors ${
                    state.fusionMatrix.enabled
                      ? 'bg-[#ff6a00] text-[#050506]'
                      : 'bg-[#121216] border border-white/10 text-zinc-300'
                  }`}
                >
                  {state.fusionMatrix.enabled ? 'Fused' : 'Bypass'}
                </button>
              </div>

              <div className="text-[11px] font-mono tabular-nums text-zinc-400">
                Coherence: {state.fusionMatrix.coherencePct}% · Apps: {apps.length} · Daemons: {daemons.length}
              </div>

              {sliderRow(
                'Cross-App Synergy Gain',
                state.fusionMatrix.synergyGain,
                0,
                2,
                0.05,
                (v) => `${v.toFixed(2)}x`,
                (v) => onUpdateFusionMatrix({ synergyGain: v })
              )}

              <div className="grid grid-cols-2 gap-1.5">
                {(
                  [
                    { key: 'sceneToCones', label: 'Scene → 3D Cones' },
                    { key: 'cartoonToLiquid', label: 'Toon → Liquid 8K' },
                    { key: 'cspToOptics', label: 'CSP → Flare Optics' },
                    { key: 'tvToPhosphor', label: 'TV → Phosphor Sync' },
                    { key: 'autopilotToAll', label: 'Autopilot → All' },
                  ] as const
                ).map((link) => {
                  const active = state.fusionMatrix.links[link.key];
                  return (
                    <button
                      key={link.key}
                      type="button"
                      onClick={() =>
                        onUpdateFusionMatrix({
                          links: {
                            ...state.fusionMatrix.links,
                            [link.key]: !active,
                          },
                        })
                      }
                      className={`py-1.5 px-2 rounded-lg text-[11px] font-medium text-left truncate border transition-colors ${
                        active
                          ? 'bg-[#ff6a00]/18 border-[#ff6a00] text-[#ff9438]'
                          : 'bg-[#121216] border-white/8 text-zinc-400'
                      }`}
                    >
                      {link.label}
                    </button>
                  );
                })}
                <button
                  type="button"
                  onClick={() => onUpdateFusionMatrix(DEFAULT_FUSION_MATRIX)}
                  className="py-1.5 px-2 rounded-lg text-[11px] font-medium bg-[#121216] border border-white/8 text-zinc-400 hover:text-zinc-200"
                >
                  Reset Matrix
                </button>
              </div>

              <button
                type="button"
                onClick={onMaximizeSystem}
                className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-[#ff6a00] hover:bg-[#ff8c2e] text-[#050506] text-xs font-semibold transition-colors"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Sustain & Maximize All 20 Daemons</span>
              </button>
            </div>
          </>
        )}

        {tab === 'color' && (
          <>
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-zinc-200">CinemaScope LUT Presets</span>
                <button
                  type="button"
                  onClick={() => onUpdateGrading(DEFAULT_GRADING)}
                  className="flex items-center gap-1 text-[11px] text-zinc-400 hover:text-[#ff8c2e] transition-colors"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {LUT_PRESETS.map((preset) => {
                  const active = state.grading.lut === preset.id;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() =>
                        onUpdateGrading({
                          ...(preset.grading || {}),
                          lut: preset.id,
                        })
                      }
                      className={`px-2.5 py-2 rounded-lg text-xs font-medium text-left truncate border transition-colors ${
                        active
                          ? 'bg-[#ff6a00]/18 border-[#ff6a00] text-[#ff9438]'
                          : 'bg-[#121216] border-white/8 text-zinc-300 hover:border-white/20'
                      }`}
                    >
                      {preset.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-4 pt-2 border-t border-white/8">
              {sliderRow(
                'Exposure (EV)',
                state.grading.exposure,
                -2,
                2,
                0.05,
                (v) => `${v >= 0 ? '+' : ''}${v.toFixed(2)}`,
                (v) => onUpdateGrading({ exposure: v })
              )}
              {sliderRow(
                'Contrast',
                state.grading.contrast,
                0.5,
                1.8,
                0.02,
                (v) => v.toFixed(2),
                (v) => onUpdateGrading({ contrast: v })
              )}
              {sliderRow(
                'Saturation',
                state.grading.saturation,
                0,
                2,
                0.02,
                (v) => v.toFixed(2),
                (v) => onUpdateGrading({ saturation: v })
              )}
              {sliderRow(
                'Temperature',
                state.grading.temperature,
                -1,
                1,
                0.02,
                (v) => `${v >= 0 ? '+' : ''}${Math.round(v * 100)}`,
                (v) => onUpdateGrading({ temperature: v })
              )}
              {sliderRow(
                'Tint',
                state.grading.tint,
                -1,
                1,
                0.02,
                (v) => `${v >= 0 ? '+' : ''}${Math.round(v * 100)}`,
                (v) => onUpdateGrading({ tint: v })
              )}
              {sliderRow(
                'Highlight Roll-off',
                state.grading.highlightRolloff,
                0,
                1,
                0.02,
                (v) => `${Math.round(v * 100)}%`,
                (v) => onUpdateGrading({ highlightRolloff: v })
              )}
            </div>
          </>
        )}

        {tab === 'optics' && (
          <>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Tv className="w-3.5 h-3.5 text-[#ff6a00]" />
                  <span className="text-xs font-semibold text-zinc-200">Real TV Mode (V)</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onUpdateRealTv(DEFAULT_REAL_TV)}
                    className="text-[11px] text-zinc-400 hover:text-zinc-200"
                  >
                    Reset
                  </button>
                  <button
                    type="button"
                    onClick={() => onUpdateRealTv({ enabled: !state.realTv.enabled })}
                    className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors ${
                      state.realTv.enabled
                        ? 'bg-[#ff6a00] text-[#050506]'
                        : 'bg-[#121216] border border-white/10 text-zinc-300'
                    }`}
                  >
                    {state.realTv.enabled ? 'Active' : 'Off'}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-1.5">
                {TV_PROFILES.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => onUpdateRealTv({ enabled: true, profile: p.id })}
                    className={`py-1.5 px-2 rounded-lg text-xs font-medium border transition-colors ${
                      state.realTv.enabled && state.realTv.profile === p.id
                        ? 'bg-[#ff6a00]/18 border-[#ff6a00] text-[#ff9438]'
                        : 'bg-[#121216] border-white/8 text-zinc-300 hover:border-white/20'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>

              {sliderRow(
                'Scanlines & Phosphor Grille',
                state.realTv.scanlines,
                0,
                1,
                0.02,
                (v) => `${Math.round(v * 100)}%`,
                (v) => onUpdateRealTv({ scanlines: v })
              )}
              {sliderRow(
                'CRT Tube Curvature',
                state.realTv.curvature,
                0,
                1,
                0.02,
                (v) => `${Math.round(v * 100)}%`,
                (v) => onUpdateRealTv({ curvature: v })
              )}
              {sliderRow(
                'NTSC Chroma Bleed',
                state.realTv.chromaBleed,
                0,
                1,
                0.02,
                (v) => `${Math.round(v * 100)}%`,
                (v) => onUpdateRealTv({ chromaBleed: v })
              )}
              {sliderRow(
                'Phosphor Bloom',
                state.realTv.phosphorBloom,
                0,
                1,
                0.02,
                (v) => `${Math.round(v * 100)}%`,
                (v) => onUpdateRealTv({ phosphorBloom: v })
              )}

              <div className="grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={() => onUpdateRealTv({ channelOsd: !state.realTv.channelOsd })}
                  className={`py-1.5 px-2 rounded-lg text-xs font-medium border transition-colors ${
                    state.realTv.channelOsd
                      ? 'bg-[#ff6a00]/18 border-[#ff6a00] text-[#ff9438]'
                      : 'bg-[#121216] border-white/8 text-zinc-400'
                  }`}
                >
                  Channel OSD
                </button>
                <button
                  type="button"
                  onClick={() => onUpdateRealTv({ safeGuides: !state.realTv.safeGuides })}
                  className={`py-1.5 px-2 rounded-lg text-xs font-medium border transition-colors ${
                    state.realTv.safeGuides
                      ? 'bg-[#ff6a00]/18 border-[#ff6a00] text-[#ff9438]'
                      : 'bg-[#121216] border-white/8 text-zinc-400'
                  }`}
                >
                  Safe Area 90/93%
                </button>
              </div>
            </div>

            <div className="space-y-3 pt-3 border-t border-white/8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Film className="w-3.5 h-3.5 text-[#ff6a00]" />
                  <span className="text-xs font-semibold text-zinc-200">Cinema Mode Optics</span>
                </div>
                <button
                  type="button"
                  onClick={() => onUpdateCinema(DEFAULT_CINEMA)}
                  className="text-[11px] text-zinc-400 hover:text-zinc-200"
                >
                  Reset
                </button>
              </div>

              <div className="grid grid-cols-5 gap-1">
                {ASPECT_OPTIONS.map((ar) => (
                  <button
                    key={ar.id}
                    type="button"
                    onClick={() => {
                      onUpdateRealTv({ enabled: false });
                      onUpdateState({ anamorphicSqueeze: true });
                      onUpdateCinema({ aspectRatio: ar.id });
                    }}
                    className={`py-1.5 px-1 rounded-md text-[11px] font-medium border transition-colors ${
                      !state.realTv.enabled && state.cinema.aspectRatio === ar.id
                        ? 'bg-[#ff6a00]/18 border-[#ff6a00] text-[#ff9438]'
                        : 'bg-[#121216] border-white/8 text-zinc-300'
                    }`}
                  >
                    {ar.label}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={() => onUpdateCinema({ cadence24p: !state.cinema.cadence24p })}
                  className={`py-1.5 px-2 rounded-lg text-xs font-medium border transition-colors ${
                    state.cinema.cadence24p
                      ? 'bg-[#ff6a00] border-[#ff6a00] text-[#050506] font-semibold'
                      : 'bg-[#121216] border-white/8 text-zinc-300'
                  }`}
                >
                  24p Film Cadence
                </button>
                <button
                  type="button"
                  onClick={() => onUpdateState({ theatreView: !state.theatreView })}
                  className={`py-1.5 px-2 rounded-lg text-xs font-medium border transition-colors ${
                    state.theatreView
                      ? 'bg-[#ff6a00] border-[#ff6a00] text-[#050506] font-semibold'
                      : 'bg-[#121216] border-white/8 text-zinc-300'
                  }`}
                >
                  Theatre Masking
                </button>
              </div>

              {sliderRow(
                '35mm Film Grain',
                state.cinema.filmGrain,
                0,
                1,
                0.02,
                (v) => `${Math.round(v * 100)}%`,
                (v) => onUpdateCinema({ filmGrain: v })
              )}
              {sliderRow(
                'Optical Halation',
                state.cinema.halation,
                0,
                1,
                0.02,
                (v) => `${Math.round(v * 100)}%`,
                (v) => onUpdateCinema({ halation: v })
              )}
              {sliderRow(
                'Gate Weave & Vignette',
                state.cinema.gateWeave,
                0,
                1,
                0.02,
                (v) => `${Math.round(v * 100)}%`,
                (v) => onUpdateCinema({ gateWeave: v })
              )}
              {sliderRow(
                'Anamorphic Streak Flare',
                state.anamorphicFlare,
                0,
                1,
                0.02,
                (v) => `${Math.round(v * 100)}%`,
                (v) => onUpdateState({ anamorphicFlare: v })
              )}
            </div>

            <div className="space-y-2.5 pt-3 border-t border-white/8">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-zinc-200">Liquid Upscale Ladder</span>
                <span className="font-mono tabular-nums text-zinc-400">
                  {state.upscaleResolution}
                </span>
              </div>
              <div className="grid grid-cols-4 gap-1.5">
                {(['off', '8k', '16k', '64k'] as UpscaleTier[]).map((tier) => {
                  const active = state.upscaleMode === tier;
                  return (
                    <button
                      key={tier}
                      type="button"
                      onClick={() => onSetUpscale(tier)}
                      className={`py-2 px-2 rounded-lg text-xs font-semibold border transition-colors ${
                        active
                          ? 'bg-[#ff6a00] border-[#ff6a00] text-[#050506]'
                          : 'bg-[#121216] border-white/8 text-zinc-300 hover:border-white/20'
                      }`}
                    >
                      {tier === 'off' ? 'OFF' : tier.toUpperCase()}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-3 pt-3 border-t border-white/8">
              <span className="block text-xs font-semibold text-zinc-200">
                CinemaScope Frame Guides
              </span>
              <div className="grid grid-cols-4 gap-1.5">
                {(
                  [
                    { id: 'off', label: 'Off' },
                    { id: '2.39', label: '2.39:1' },
                    { id: '2.35', label: '2.35:1' },
                    { id: 'thirds', label: 'Thirds' },
                  ] as Array<{ id: FrameGuideMode; label: string }>
                ).map((g) => (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => onUpdateState({ frameGuide: g.id })}
                    className={`py-1.5 px-2 rounded-lg text-xs font-medium border transition-colors ${
                      state.frameGuide === g.id
                        ? 'bg-[#ff6a00]/18 border-[#ff6a00] text-[#ff9438]'
                        : 'bg-[#121216] border-white/8 text-zinc-300 hover:border-white/20'
                    }`}
                  >
                    {g.label}
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-between text-xs pt-2">
                <span className="font-semibold text-zinc-200">3D Auditorium & Cone Stage</span>
                <span className="text-zinc-400">
                  {state.mode === '3d' ? 'Active' : 'Standby'}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                {(
                  [
                    { id: 'audience', label: 'Audience' },
                    { id: 'booth', label: 'Booth' },
                    { id: 'origin', label: '(0,0,0) Cone' },
                  ] as const
                ).map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => {
                      onUpdateState({ mode: '3d' });
                      onCameraPreset(p.id);
                    }}
                    className="py-1.5 px-2 rounded-lg text-xs font-medium bg-[#121216] border border-white/8 text-zinc-300 hover:border-[#ff6a00]/60 hover:text-zinc-100 transition-colors whitespace-nowrap"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
              {sliderRow(
                'Multiplied Cones (3x Stage)',
                state.stage3d.coneMultiplier,
                1,
                9,
                1,
                (v) => `${v}x`,
                (v) =>
                  onUpdateState({
                    stage3d: { ...state.stage3d, coneMultiplier: v },
                  })
              )}
              {sliderRow(
                '3D Screen Curvature',
                state.stage3d.screenCurvature,
                0,
                0.45,
                0.02,
                (v) => `${Math.round((v / 0.45) * 100)}%`,
                (v) =>
                  onUpdateState({
                    stage3d: { ...state.stage3d, screenCurvature: v },
                  })
              )}
            </div>
          </>
        )}

        {tab === 'timeline' && (
          <>
            <div className="space-y-2.5">
              <span className="block text-xs font-semibold text-zinc-200">
                A/B Loop Sequencer
              </span>
              <div className="grid grid-cols-4 gap-1.5">
                <button
                  type="button"
                  onClick={() => onSetAbPoint('a')}
                  className="py-1.5 px-2 rounded-lg text-xs font-medium bg-[#121216] border border-white/10 text-zinc-200 hover:border-[#ff6a00]"
                >
                  Set A
                </button>
                <button
                  type="button"
                  onClick={() => onSetAbPoint('b')}
                  className="py-1.5 px-2 rounded-lg text-xs font-medium bg-[#121216] border border-white/10 text-zinc-200 hover:border-[#ff6a00]"
                >
                  Set B
                </button>
                <button
                  type="button"
                  onClick={onToggleAbLoop}
                  className={`py-1.5 px-2 rounded-lg text-xs font-semibold border transition-colors ${
                    state.abLoop.enabled
                      ? 'bg-[#ff6a00] border-[#ff6a00] text-[#050506]'
                      : 'bg-[#121216] border-white/10 text-zinc-300'
                  }`}
                >
                  {state.abLoop.enabled ? 'Loop On' : 'Loop Off'}
                </button>
                <button
                  type="button"
                  onClick={() => onSetAbPoint('clear')}
                  className="py-1.5 px-2 rounded-lg text-xs font-medium bg-[#121216] border border-white/10 text-zinc-400 hover:text-zinc-100"
                >
                  Clear
                </button>
              </div>
              <div className="text-[11px] font-mono tabular-nums text-zinc-400">
                A: {state.abLoop.a !== null ? formatTime(state.abLoop.a) : '--:--.-'} · B:{' '}
                {state.abLoop.b !== null ? formatTime(state.abLoop.b) : '--:--.-'}
              </div>
            </div>

            <div className="space-y-2.5 pt-3 border-t border-white/8">
              <span className="block text-xs font-semibold text-zinc-200">
                Scene & Cutaway Markers
              </span>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  onAddMarker(markerLabel.trim() || `Cue ${formatTime(state.currentTime)}`);
                  setMarkerLabel('');
                }}
                className="flex gap-1.5"
              >
                <input
                  type="text"
                  value={markerLabel}
                  onChange={(e) => setMarkerLabel(e.target.value)}
                  placeholder="Marker label..."
                  className="flex-1 min-w-0 bg-[#121216] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-[#ff6a00]"
                />
                <button
                  type="submit"
                  className="px-2.5 py-1.5 rounded-lg bg-[#ff6a00] text-[#050506] text-xs font-semibold flex items-center gap-1 shrink-0 hover:bg-[#ff8c2e] transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Mark</span>
                </button>
              </form>

              <div className="space-y-1.5 max-h-44 overflow-y-auto fos-scroll">
                {state.markers.length === 0 ? (
                  <p className="text-xs text-zinc-500 py-2">No scene markers yet.</p>
                ) : (
                  state.markers.map((m) => (
                    <div
                      key={m.id}
                      className="flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-lg bg-[#121216] border border-white/8"
                    >
                      <button
                        type="button"
                        onClick={() => onJumpMarker(m.time)}
                        className="flex items-center gap-2 text-left min-w-0 flex-1 hover:text-[#ff8c2e] transition-colors"
                      >
                        <span className="font-mono tabular-nums text-[11px] text-[#ff6a00] shrink-0">
                          {formatTime(m.time)}
                        </span>
                        <span className="text-xs text-zinc-200 truncate">{m.label}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => onRemoveMarker(m.id)}
                        className="p-1 text-zinc-500 hover:text-zinc-200 transition-colors"
                        aria-label={`Remove ${m.label}`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="space-y-2 pt-3 border-t border-white/8">
              <span className="block text-xs font-semibold text-zinc-200">
                Frame & Standalone Exports
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={onCaptureSnapshot}
                  className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-[#141419] border border-white/10 text-xs font-medium text-zinc-100 hover:border-[#ff6a00] transition-colors"
                >
                  <Camera className="w-3.5 h-3.5 text-[#ff6a00]" />
                  <span>Grab PNG</span>
                </button>
                <button
                  type="button"
                  onClick={onExportHtml}
                  className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-[#141419] border border-white/10 text-xs font-medium text-zinc-100 hover:border-[#ff6a00] transition-colors"
                >
                  <Download className="w-3.5 h-3.5 text-[#ff6a00]" />
                  <span>Export HTML</span>
                </button>
              </div>
            </div>
          </>
        )}

        {tab === 'brain' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-zinc-200">20 Sovereign Daemons</span>
              <button
                type="button"
                onClick={onMaximizeSystem}
                className="px-2.5 py-1 rounded bg-[#ff6a00] hover:bg-[#ff8c2e] text-[#050506] text-[11px] font-semibold transition-colors"
              >
                Maximize All 20
              </button>
            </div>

            <div className="space-y-1">
              {daemons.map((d) => (
                <div
                  key={d.id}
                  className="flex items-center justify-between px-2 py-1 rounded bg-[#111115] border border-white/6 text-[10px]"
                >
                  <div className="truncate pr-1.5">
                    <span className="font-mono text-[#ff8c2e]">{d.id}</span>
                    <span className="text-zinc-400"> · {d.name}</span>
                  </div>
                  <span className="font-mono tabular-nums text-zinc-300 shrink-0">
                    {d.boostFactor.toFixed(1)}x · {d.efficiencyPct}%
                  </span>
                </div>
              ))}
            </div>

            <div className="space-y-1.5 pt-2 border-t border-white/8">
              <div className="flex items-center justify-between text-[11px] font-medium text-zinc-400">
                <span>Fused Modules (csp-collector #1)</span>
                <span className="font-mono tabular-nums text-[#ff8c2e]">
                  {apps.filter((a) => a.fused).length}/{apps.length}
                </span>
              </div>
              <div className="space-y-1">
                {apps.map((app) => (
                  <div
                    key={app.id}
                    className="flex items-center justify-between px-2.5 py-1.5 rounded-md bg-[#111115] border border-white/6 text-[11px]"
                  >
                    <span className="font-mono text-zinc-200 truncate">
                      {app.order}. {app.id}
                    </span>
                    <span className="font-mono text-[#ff6a00] shrink-0">
                      {app.fused ? 'FUSED' : 'REG'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
