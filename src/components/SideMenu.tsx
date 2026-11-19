import React, { useState } from 'react';
import {
  Activity,
  Aperture,
  Brain,
  Camera,
  Cpu,
  Crown,
  Download,
  Droplets,
  Eye,
  Film,
  Hexagon,
  MessageSquare,
  Network,
  Orbit,
  Plus,
  RotateCcw,
  Scissors,
  Sliders,
  Sparkles,
  Trash2,
  Tv,
  Upload,
  Wand2,
  X,
  Zap,
} from 'lucide-react';
import {
  BASE_DAEMON_COUNT,
  DEFAULT_ABBY_CIO,
  DEFAULT_CINEMA,
  DEFAULT_CYNTHETOC_AI,
  DEFAULT_DAEMON_QUEEN,
  DEFAULT_FUSION_MATRIX,
  DEFAULT_GRADING,
  DEFAULT_HOLOGRAPHIC,
  DEFAULT_KINETIC_HARMONIZER,
  DEFAULT_LIQUID_BRAIN,
  DEFAULT_LIQUIFIED_3D,
  DEFAULT_REAL_TV,
  DEFAULT_SCENE_DESIGNER,
  DEFAULT_SMART_MORPH,
  DEFAULT_STEREOSCOPIC,
  DEFAULT_VIDEO_TO_CARTOON,
  type AbbyLogicProfile,
  type AbbyVideoCioConfig,
  type AppShapeTopologyId,
  type CartoonStyleId,
  type CinemaAspectRatio,
  type CinemaModeConfig,
  type ColorGradingState,
  type CynthetocAiConfig,
  type CynthetocModeId,
  type DaemonQueenConfig,
  type FractalAppModule,
  type FractalBrainSnapshot,
  type FractalStudioState,
  type FrameGuideMode,
  type FusionMatrixConfig,
  type HologramRigMode,
  type HolographicProjectionConfig,
  type KineticHarmMode,
  type KineticHarmonizerConfig,
  type LiquidBrainConfig,
  type LiquidBrainFusionMode,
  type Liquified3dConfig,
  type LiquidPresetId,
  type LutPresetId,
  type RealTvModeConfig,
  type RealTvProfile,
  type SceneDesignerConfig,
  type SceneThemeId,
  type SmartMorphConfig,
  type SmartMorphModeId,
  type SovereignDaemon,
  type Stereoscopic3dConfig,
  type StereoscopicModeId,
  type StudioCommandPayload,
  type UpscaleTier,
  type VideoToCartoonConfig,
} from '../core/fractalBrain';
import { GeminiCopilotPanel } from './GeminiCopilotDrawer';

export type SideMenuDomain = 'smart' | 'station';

export type SmartSectionId =
  | 'abby'
  | 'copilot'
  | 'cynthetoc'
  | 'prism'
  | 'morph'
  | 'liquidBrain'
  | 'scene'
  | 'cartoon'
  | 'fusion'
  | 'queen';

export type StationSectionId =
  | 'optics'
  | 'realTv'
  | 'color'
  | 'stage3d'
  | 'stereo'
  | 'holo'
  | 'upscale'
  | 'media';

export type SideMenuSectionId = SmartSectionId | StationSectionId;

export const DEFAULT_SMART_SECTION: SmartSectionId = 'abby';
export const DEFAULT_STATION_SECTION: StationSectionId = 'optics';

export function isSmartSection(section: SideMenuSectionId): section is SmartSectionId {
  return [
    'abby',
    'copilot',
    'cynthetoc',
    'prism',
    'morph',
    'liquidBrain',
    'scene',
    'cartoon',
    'fusion',
    'queen',
  ].includes(section);
}

interface SideMenuProps {
  open: boolean;
  onClose: () => void;
  domain: SideMenuDomain;
  onSelectDomain: (d: SideMenuDomain) => void;
  section: SideMenuSectionId;
  onSelectSection: (s: SideMenuSectionId) => void;
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
  onUpdateSmartMorph: (patch: Partial<SmartMorphConfig>) => void;
  onTriggerNaturalExpansion: () => void;
  onUpdateAbbyCio: (patch: Partial<AbbyVideoCioConfig>) => void;
  onRunAbbyScanNow: () => void;
  onUpdateKineticHarmonizer: (patch: Partial<KineticHarmonizerConfig>) => void;
  onUpdateDaemonQueen: (patch: Partial<DaemonQueenConfig>) => void;
  onSeedDaemon: (specialization?: string) => void;
  onRemoveSeededDaemon: (id: string) => void;
  onResetSeededDaemons: () => void;
  onSaveDaemonsJson: (download?: boolean) => void;
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
  onLoadMediaClick: () => void;
  onResetScopeStream: () => void;
  getSnapshot: () => FractalBrainSnapshot;
  onCaptureFrame: () => string | null;
  onApplyCommands: (commands: StudioCommandPayload[]) => string[];
}

const LUT_PRESETS: Array<{ id: LutPresetId; label: string; grading?: Partial<ColorGradingState> }> = [
  { id: 'neutral', label: 'Neutral Scope', grading: DEFAULT_GRADING },
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

const SMART_MORPH_MODES: Array<{ id: SmartMorphModeId; label: string }> = [
  { id: 'organicExpand', label: 'Organic Expand' },
  { id: 'gradientFlow', label: 'Gradient Flow' },
  { id: 'goldenSpiral', label: 'Golden Spiral' },
  { id: 'harmonicBreathe', label: 'Harmonic Breathe' },
];

const ABBY_PROFILES: Array<{ id: AbbyLogicProfile; label: string }> = [
  { id: 'balancedCinema', label: 'Balanced Cinema' },
  { id: 'reactiveStage', label: 'Reactive Stage' },
  { id: 'editorialMatch', label: 'Editorial Match' },
  { id: 'holoPrism', label: 'Holo Prism' },
];

const KINETIC_HARM_MODES: Array<{ id: KineticHarmMode; label: string }> = [
  { id: 'chromaticRim', label: 'Chromatic Rim' },
  { id: 'goldenAura', label: 'Golden Aura' },
  { id: 'prismDiffract', label: 'Prism Diffract' },
  { id: 'thermalEcho', label: 'Thermal Echo' },
];

function formatTime(sec: number): string {
  const s = Math.max(0, sec);
  const mins = Math.floor(s / 60);
  const rem = Math.floor(s % 60);
  const tenths = Math.floor((s % 1) * 10);
  return `${String(mins).padStart(2, '0')}:${String(rem).padStart(2, '0')}.${tenths}`;
}

export const SideMenu: React.FC<SideMenuProps> = ({
  open,
  onClose,
  domain,
  onSelectDomain,
  section,
  onSelectSection,
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
  onUpdateSmartMorph,
  onTriggerNaturalExpansion,
  onUpdateAbbyCio,
  onRunAbbyScanNow,
  onUpdateKineticHarmonizer,
  onUpdateDaemonQueen,
  onSeedDaemon,
  onRemoveSeededDaemon,
  onResetSeededDaemons,
  onSaveDaemonsJson,
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
  onLoadMediaClick,
  onResetScopeStream,
  getSnapshot,
  onCaptureFrame,
  onApplyCommands,
}) => {
  const [markerLabel, setMarkerLabel] = useState('');
  const [seedSpecInput, setSeedSpecInput] = useState('');

  if (!open) return null;

  const seededCount = Math.max(0, daemons.length - BASE_DAEMON_COUNT);

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

  const smartItems: Array<{
    id: SmartSectionId;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    enabled?: boolean;
    onToggle?: () => void;
    statusText?: string;
  }> = [
    {
      id: 'abby',
      label: 'Abby CIO',
      icon: Aperture,
      enabled: state.abbyCio.enabled,
      onToggle: () => onUpdateAbbyCio({ enabled: !state.abbyCio.enabled }),
    },
    {
      id: 'copilot',
      label: 'Autopilot',
      icon: MessageSquare,
      statusText: 'AI',
    },
    {
      id: 'cynthetoc',
      label: 'Cynthetoc AI',
      icon: Brain,
      enabled: state.cynthetocAi.enabled,
      onToggle: () => onUpdateCynthetocAi({ enabled: !state.cynthetocAi.enabled }),
    },
    {
      id: 'prism',
      label: 'Kinetic Prism',
      icon: Activity,
      enabled: state.kineticHarmonizer.enabled,
      onToggle: () =>
        onUpdateKineticHarmonizer({ enabled: !state.kineticHarmonizer.enabled }),
    },
    {
      id: 'morph',
      label: 'Smart Morph',
      icon: Wand2,
      enabled: state.smartMorph.enabled,
      onToggle: () => onUpdateSmartMorph({ enabled: !state.smartMorph.enabled }),
    },
    {
      id: 'liquidBrain',
      label: 'Liquid Brain',
      icon: Orbit,
      enabled: state.liquidBrain.enabled,
      onToggle: () => {
        const next = !state.liquidBrain.enabled;
        onUpdateLiquidBrain({ enabled: next });
        if (next) onUpdateState({ mode: '3d' });
      },
    },
    {
      id: 'scene',
      label: 'Scene Design',
      icon: Sparkles,
      statusText: `${state.sceneDesigner.fractalComplexity}R`,
    },
    {
      id: 'cartoon',
      label: 'Cartoonize',
      icon: Film,
      enabled: state.videoToCartoon.enabled,
      onToggle: () => onUpdateVideoToCartoon({ enabled: !state.videoToCartoon.enabled }),
    },
    {
      id: 'fusion',
      label: 'Fusion Matrix',
      icon: Network,
      enabled: state.fusionMatrix.enabled,
      onToggle: () => onUpdateFusionMatrix({ enabled: !state.fusionMatrix.enabled }),
    },
    {
      id: 'queen',
      label: 'Daemon Queen',
      icon: Crown,
      enabled: state.daemonQueen.enabled,
      onToggle: () => onUpdateDaemonQueen({ enabled: !state.daemonQueen.enabled }),
    },
  ];

  const stationItems: Array<{
    id: StationSectionId;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    enabled?: boolean;
    onToggle?: () => void;
    statusText?: string;
  }> = [
    {
      id: 'optics',
      label: 'Cinema Optics',
      icon: Film,
      statusText: state.cinema.aspectRatio,
    },
    {
      id: 'realTv',
      label: 'Real TV Deck',
      icon: Tv,
      enabled: state.realTv.enabled,
      onToggle: () => onUpdateRealTv({ enabled: !state.realTv.enabled }),
    },
    {
      id: 'color',
      label: 'Color Lab',
      icon: Sliders,
      statusText: state.grading.lut === 'neutral' ? 'Raw' : 'LUT',
    },
    {
      id: 'stage3d',
      label: '3D Stage',
      icon: Droplets,
      enabled: state.liquified3d.enabled,
      onToggle: () => {
        const next = !state.liquified3d.enabled;
        onUpdateLiquified3d({ enabled: next });
        if (next) onUpdateState({ mode: '3d' });
      },
    },
    {
      id: 'stereo',
      label: 'Stereo 3D',
      icon: Eye,
      enabled: state.stereoscopic.enabled,
      onToggle: () => onUpdateStereoscopic({ enabled: !state.stereoscopic.enabled }),
    },
    {
      id: 'holo',
      label: 'Hologram Rig',
      icon: Hexagon,
      enabled: state.holographic.enabled,
      onToggle: () => onUpdateHolographic({ enabled: !state.holographic.enabled }),
    },
    {
      id: 'upscale',
      label: 'Liquid Upscale',
      icon: Zap,
      statusText: state.upscaleMode === 'off' ? 'Off' : state.upscaleMode.toUpperCase(),
    },
    {
      id: 'media',
      label: 'Clips & Export',
      icon: Scissors,
      statusText: state.markers.length > 0 ? `${state.markers.length}M` : undefined,
    },
  ];

  const activeItems = domain === 'smart' ? smartItems : stationItems;
  const currentTitle =
    [...smartItems, ...stationItems].find((x) => x.id === section)?.label || 'Menu';

  const renderSectionHeaderActions = () => {
    switch (section) {
      case 'abby':
        return (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onUpdateAbbyCio(DEFAULT_ABBY_CIO)}
              className="text-[11px] text-zinc-400 hover:text-zinc-200 whitespace-nowrap"
            >
              Reset
            </button>
            <button
              type="button"
              onClick={() => onUpdateAbbyCio({ enabled: !state.abbyCio.enabled })}
              className={`px-2 py-0.5 rounded text-[11px] font-semibold whitespace-nowrap ${
                state.abbyCio.enabled
                  ? 'bg-[#ff6a00] text-[#050506]'
                  : 'bg-[#141419] border border-white/10 text-zinc-300'
              }`}
            >
              {state.abbyCio.enabled ? 'Auto On' : 'Off'}
            </button>
          </div>
        );
      case 'prism':
        return (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onUpdateKineticHarmonizer(DEFAULT_KINETIC_HARMONIZER)}
              className="text-[11px] text-zinc-400 hover:text-zinc-200 whitespace-nowrap"
            >
              Reset
            </button>
            <button
              type="button"
              onClick={() =>
                onUpdateKineticHarmonizer({ enabled: !state.kineticHarmonizer.enabled })
              }
              className={`px-2 py-0.5 rounded text-[11px] font-semibold whitespace-nowrap ${
                state.kineticHarmonizer.enabled
                  ? 'bg-[#ff6a00] text-[#050506]'
                  : 'bg-[#141419] border border-white/10 text-zinc-300'
              }`}
            >
              {state.kineticHarmonizer.enabled ? 'Active' : 'Off'}
            </button>
          </div>
        );
      case 'cynthetoc':
        return (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onUpdateCynthetocAi(DEFAULT_CYNTHETOC_AI)}
              className="text-[11px] text-zinc-400 hover:text-zinc-200 whitespace-nowrap"
            >
              Reset
            </button>
            <button
              type="button"
              onClick={() => onUpdateCynthetocAi({ enabled: !state.cynthetocAi.enabled })}
              className={`px-2 py-0.5 rounded text-[11px] font-semibold whitespace-nowrap ${
                state.cynthetocAi.enabled
                  ? 'bg-[#ff6a00] text-[#050506]'
                  : 'bg-[#141419] border border-white/10 text-zinc-300'
              }`}
            >
              {state.cynthetocAi.enabled ? 'Active' : 'Off'}
            </button>
          </div>
        );
      case 'morph':
        return (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onUpdateSmartMorph(DEFAULT_SMART_MORPH)}
              className="text-[11px] text-zinc-400 hover:text-zinc-200 whitespace-nowrap"
            >
              Reset
            </button>
            <button
              type="button"
              onClick={() => onUpdateSmartMorph({ enabled: !state.smartMorph.enabled })}
              className={`px-2 py-0.5 rounded text-[11px] font-semibold whitespace-nowrap ${
                state.smartMorph.enabled
                  ? 'bg-[#ff6a00] text-[#050506]'
                  : 'bg-[#141419] border border-white/10 text-zinc-300'
              }`}
            >
              {state.smartMorph.enabled ? 'Active' : 'Off'}
            </button>
          </div>
        );
      case 'liquidBrain':
        return (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onUpdateLiquidBrain(DEFAULT_LIQUID_BRAIN)}
              className="text-[11px] text-zinc-400 hover:text-zinc-200 whitespace-nowrap"
            >
              Reset
            </button>
            <button
              type="button"
              onClick={() => {
                const next = !state.liquidBrain.enabled;
                onUpdateLiquidBrain({ enabled: next });
                if (next) onUpdateState({ mode: '3d' });
              }}
              className={`px-2 py-0.5 rounded text-[11px] font-semibold whitespace-nowrap ${
                state.liquidBrain.enabled
                  ? 'bg-[#ff6a00] text-[#050506]'
                  : 'bg-[#141419] border border-white/10 text-zinc-300'
              }`}
            >
              {state.liquidBrain.enabled ? 'Active' : 'Off'}
            </button>
          </div>
        );
      case 'scene':
        return (
          <button
            type="button"
            onClick={() => onUpdateSceneDesigner(DEFAULT_SCENE_DESIGNER)}
            className="text-[11px] text-zinc-400 hover:text-zinc-200 whitespace-nowrap"
          >
            Reset
          </button>
        );
      case 'cartoon':
        return (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onUpdateVideoToCartoon(DEFAULT_VIDEO_TO_CARTOON)}
              className="text-[11px] text-zinc-400 hover:text-zinc-200 whitespace-nowrap"
            >
              Reset
            </button>
            <button
              type="button"
              onClick={() => onUpdateVideoToCartoon({ enabled: !state.videoToCartoon.enabled })}
              className={`px-2 py-0.5 rounded text-[11px] font-semibold whitespace-nowrap ${
                state.videoToCartoon.enabled
                  ? 'bg-[#ff6a00] text-[#050506]'
                  : 'bg-[#141419] border border-white/10 text-zinc-300'
              }`}
            >
              {state.videoToCartoon.enabled ? 'Active' : 'Off'}
            </button>
          </div>
        );
      case 'fusion':
        return (
          <button
            type="button"
            onClick={() => onUpdateFusionMatrix({ enabled: !state.fusionMatrix.enabled })}
            className={`px-2 py-0.5 rounded text-[11px] font-semibold whitespace-nowrap ${
              state.fusionMatrix.enabled
                ? 'bg-[#ff6a00] text-[#050506]'
                : 'bg-[#141419] border border-white/10 text-zinc-300'
            }`}
          >
            {state.fusionMatrix.enabled ? 'Fused' : 'Bypass'}
          </button>
        );
      case 'queen':
        return (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onUpdateDaemonQueen(DEFAULT_DAEMON_QUEEN)}
              className="text-[11px] text-zinc-400 hover:text-zinc-200 whitespace-nowrap"
            >
              Reset
            </button>
            <button
              type="button"
              onClick={() => onUpdateDaemonQueen({ enabled: !state.daemonQueen.enabled })}
              className={`px-2 py-0.5 rounded text-[11px] font-semibold whitespace-nowrap ${
                state.daemonQueen.enabled
                  ? 'bg-[#ff6a00] text-[#050506]'
                  : 'bg-[#141419] border border-white/10 text-zinc-300'
              }`}
            >
              {state.daemonQueen.enabled ? 'Active' : 'Paused'}
            </button>
          </div>
        );
      case 'optics':
        return (
          <button
            type="button"
            onClick={() => onUpdateCinema(DEFAULT_CINEMA)}
            className="text-[11px] text-zinc-400 hover:text-zinc-200 whitespace-nowrap"
          >
            Reset
          </button>
        );
      case 'realTv':
        return (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onUpdateRealTv(DEFAULT_REAL_TV)}
              className="text-[11px] text-zinc-400 hover:text-zinc-200 whitespace-nowrap"
            >
              Reset
            </button>
            <button
              type="button"
              onClick={() => onUpdateRealTv({ enabled: !state.realTv.enabled })}
              className={`px-2 py-0.5 rounded text-[11px] font-semibold whitespace-nowrap ${
                state.realTv.enabled
                  ? 'bg-[#ff6a00] text-[#050506]'
                  : 'bg-[#141419] border border-white/10 text-zinc-300'
              }`}
            >
              {state.realTv.enabled ? 'Active' : 'Off'}
            </button>
          </div>
        );
      case 'color':
        return (
          <button
            type="button"
            onClick={() => onUpdateGrading(DEFAULT_GRADING)}
            className="flex items-center gap-1 text-[11px] text-zinc-400 hover:text-[#ff8c2e] whitespace-nowrap"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        );
      case 'stage3d':
        return (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onUpdateLiquified3d(DEFAULT_LIQUIFIED_3D)}
              className="text-[11px] text-zinc-400 hover:text-zinc-200 whitespace-nowrap"
            >
              Reset
            </button>
            <button
              type="button"
              onClick={() => {
                const next = !state.liquified3d.enabled;
                onUpdateLiquified3d({ enabled: next });
                if (next) onUpdateState({ mode: '3d' });
              }}
              className={`px-2 py-0.5 rounded text-[11px] font-semibold whitespace-nowrap ${
                state.liquified3d.enabled
                  ? 'bg-[#ff6a00] text-[#050506]'
                  : 'bg-[#141419] border border-white/10 text-zinc-300'
              }`}
            >
              {state.liquified3d.enabled ? 'Active' : 'Off'}
            </button>
          </div>
        );
      case 'stereo':
        return (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onUpdateStereoscopic(DEFAULT_STEREOSCOPIC)}
              className="text-[11px] text-zinc-400 hover:text-zinc-200 whitespace-nowrap"
            >
              Reset
            </button>
            <button
              type="button"
              onClick={() => onUpdateStereoscopic({ enabled: !state.stereoscopic.enabled })}
              className={`px-2 py-0.5 rounded text-[11px] font-semibold whitespace-nowrap ${
                state.stereoscopic.enabled
                  ? 'bg-[#ff6a00] text-[#050506]'
                  : 'bg-[#141419] border border-white/10 text-zinc-300'
              }`}
            >
              {state.stereoscopic.enabled ? 'Active' : 'Off'}
            </button>
          </div>
        );
      case 'holo':
        return (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onUpdateHolographic(DEFAULT_HOLOGRAPHIC)}
              className="text-[11px] text-zinc-400 hover:text-zinc-200 whitespace-nowrap"
            >
              Reset
            </button>
            <button
              type="button"
              onClick={() => onUpdateHolographic({ enabled: !state.holographic.enabled })}
              className={`px-2 py-0.5 rounded text-[11px] font-semibold whitespace-nowrap ${
                state.holographic.enabled
                  ? 'bg-[#ff6a00] text-[#050506]'
                  : 'bg-[#141419] border border-white/10 text-zinc-300'
              }`}
            >
              {state.holographic.enabled ? 'Active' : 'Off'}
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <aside
      aria-label="Smart vs Station Side Menu"
      className="fixed top-7 left-0 bottom-[46px] z-30 w-[448px] max-w-[100vw] bg-[#070709]/96 backdrop-blur-md border-r border-white/10 flex flex-col overflow-hidden"
    >
      {/* Top Side Menu Switcher: Smart vs Station */}
      <div className="flex items-center justify-between gap-2 px-2.5 py-2 border-b border-white/10 bg-[#050506] shrink-0">
        <div className="flex-1 grid grid-cols-2 gap-1 p-0.5 rounded-md bg-[#0e0e13] border border-white/8">
          <button
            type="button"
            onClick={() => {
              onSelectDomain('smart');
              if (!isSmartSection(section)) {
                onSelectSection(DEFAULT_SMART_SECTION);
              }
            }}
            className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded text-xs font-semibold whitespace-nowrap shrink-0 transition-colors ${
              domain === 'smart'
                ? 'bg-[#ff6a00] text-[#050506]'
                : 'text-zinc-400 hover:text-zinc-100'
            }`}
          >
            <Cpu className="w-3.5 h-3.5 shrink-0" />
            <span>Smart</span>
          </button>
          <button
            type="button"
            onClick={() => {
              onSelectDomain('station');
              if (isSmartSection(section)) {
                onSelectSection(DEFAULT_STATION_SECTION);
              }
            }}
            className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded text-xs font-semibold whitespace-nowrap shrink-0 transition-colors ${
              domain === 'station'
                ? 'bg-[#ff6a00] text-[#050506]'
                : 'text-zinc-400 hover:text-zinc-100'
            }`}
          >
            <Tv className="w-3.5 h-3.5 shrink-0" />
            <span>Station</span>
          </button>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="p-1.5 rounded text-zinc-400 hover:text-zinc-100 hover:bg-white/5 transition-colors shrink-0"
          aria-label="Close Side Menu"
          title="Close Side Menu (G)"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Master-Detail Split Body */}
      <div className="flex-1 min-h-0 flex overflow-hidden">
        {/* Left Navigation List */}
        <nav
          aria-label={domain === 'smart' ? 'Smart Engines Menu' : 'Station Controls Menu'}
          className="w-[154px] sm:w-[166px] shrink-0 border-r border-white/10 bg-[#050506]/90 flex flex-col overflow-hidden"
        >
          <div className="px-2.5 py-1.5 border-b border-white/8 text-[10px] font-mono tabular-nums text-zinc-400 truncate shrink-0">
            {domain === 'smart'
              ? `10 Smart Engines · ${daemons.length}D`
              : `${state.realTv.enabled ? 'TV' : state.mode === '3d' ? '3D Stage' : state.cinema.aspectRatio} · ${state.upscaleMode === 'off' ? 'Native' : state.upscaleMode.toUpperCase()}`}
          </div>

          <div className="flex-1 overflow-y-auto fos-scroll p-1.5 space-y-0.5">
            {activeItems.map((item) => {
              const Icon = item.icon;
              const selected = section === item.id;
              return (
                <div
                  key={item.id}
                  className={`flex items-center justify-between gap-1 rounded-md transition-colors ${
                    selected
                      ? 'bg-[#ff6a00]/16 text-[#ff9438]'
                      : 'text-zinc-300 hover:bg-white/5 hover:text-zinc-100'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => onSelectSection(item.id)}
                    className="flex items-center gap-1.5 min-w-0 flex-1 py-1.5 pl-2 pr-1 text-left text-[11px] font-medium"
                  >
                    <Icon
                      className={`w-3.5 h-3.5 shrink-0 ${
                        selected ? 'text-[#ff6a00]' : 'text-zinc-400'
                      }`}
                    />
                    <span className="truncate whitespace-nowrap">{item.label}</span>
                  </button>

                  {typeof item.enabled === 'boolean' && item.onToggle ? (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        item.onToggle?.();
                      }}
                      className={`mr-1 px-1.5 py-0.5 rounded text-[9.5px] font-mono font-semibold whitespace-nowrap shrink-0 transition-colors ${
                        item.enabled
                          ? 'bg-[#ff6a00] text-[#050506]'
                          : 'bg-[#121216] border border-white/10 text-zinc-400 hover:text-zinc-200'
                      }`}
                      title={`Toggle ${item.label}`}
                    >
                      {item.enabled ? 'On' : 'Off'}
                    </button>
                  ) : item.statusText ? (
                    <span className="mr-1.5 text-[9.5px] font-mono tabular-nums text-zinc-400 shrink-0">
                      {item.statusText}
                    </span>
                  ) : null}
                </div>
              );
            })}
          </div>

          <div className="p-2 border-t border-white/10 space-y-1.5 shrink-0">
            <div className="flex items-center justify-between text-[10px] font-mono tabular-nums text-zinc-400">
              <span>{apps.filter((a) => a.fused).length}/{apps.length} Fused</span>
              <span className="text-[#ff8c2e]">{state.fusionMatrix.coherencePct}%</span>
            </div>
            <button
              type="button"
              onClick={onMaximizeSystem}
              className="w-full py-1.5 px-2 rounded bg-[#ff6a00] hover:bg-[#ff8c2e] text-[#050506] text-[10.5px] font-semibold whitespace-nowrap transition-colors"
            >
              Maximize {daemons.length}D
            </button>
          </div>
        </nav>

        {/* Right Detail Workspace */}
        <div className="flex-1 min-w-0 flex flex-col bg-[#08080b] overflow-hidden">
          <div className="px-3 py-2 border-b border-white/10 flex items-center justify-between gap-2 shrink-0">
            <div className="flex items-center gap-1.5 min-w-0 text-xs">
              <span className="text-zinc-400 shrink-0">
                {domain === 'smart' ? 'Smart' : 'Station'}
              </span>
              <span className="text-zinc-600 shrink-0">·</span>
              <span className="font-semibold text-zinc-100 truncate">{currentTitle}</span>
            </div>
            {renderSectionHeaderActions()}
          </div>

          {section === 'copilot' ? (
            <GeminiCopilotPanel
              getSnapshot={getSnapshot}
              onCaptureFrame={onCaptureFrame}
              onApplyCommands={onApplyCommands}
            />
          ) : (
            <div className="flex-1 overflow-y-auto fos-scroll p-3.5 space-y-4">
              {/* SMART: ABBY VIDEO CIO */}
              {section === 'abby' && (
                <div className="space-y-3.5">
                  <div className="grid grid-cols-2 gap-1.5">
                    {ABBY_PROFILES.map((ap) => (
                      <button
                        key={ap.id}
                        type="button"
                        onClick={() => {
                          onUpdateAbbyCio({ enabled: true, logicProfile: ap.id });
                          onRunAbbyScanNow();
                        }}
                        className={`py-1.5 px-2 rounded-md text-[11px] font-medium text-left truncate border whitespace-nowrap transition-colors ${
                          state.abbyCio.enabled && state.abbyCio.logicProfile === ap.id
                            ? 'bg-[#ff6a00]/18 border-[#ff6a00] text-[#ff9438]'
                            : 'bg-[#121216] border-white/8 text-zinc-300 hover:border-white/20'
                        }`}
                      >
                        {ap.label}
                      </button>
                    ))}
                  </div>

                  <div className="space-y-1.5 pt-2 border-t border-white/8 text-[11px] font-mono tabular-nums text-zinc-400">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-zinc-200 truncate">{state.abbyCio.sceneClass}</span>
                      <span className="flex items-center gap-1.5 shrink-0">
                        <span
                          className="inline-block w-2.5 h-2.5 rounded-sm border border-white/20"
                          style={{ backgroundColor: state.abbyCio.dominantHex }}
                        />
                        <span className="text-[#ff8c2e]">{state.abbyCio.dominantHex}</span>
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[10.5px]">
                      <span>L {Math.round(state.abbyCio.avgLuma * 100)}%</span>
                      <span>C {Math.round(state.abbyCio.contrastSpan * 100)}%</span>
                      <span>M {Math.round(state.abbyCio.motionEnergy * 100)}%</span>
                      <span>E {Math.round(state.abbyCio.edgeDensity * 100)}%</span>
                    </div>
                    <div className="flex items-center justify-between gap-2 text-[10px] text-zinc-500">
                      <span className="truncate">{state.abbyCio.lastDecision}</span>
                      <span className="shrink-0 text-zinc-400">#{state.abbyCio.decisionsCount}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-1.5 pt-1">
                    <button
                      type="button"
                      onClick={() => onUpdateAbbyCio({ matchGrading: !state.abbyCio.matchGrading })}
                      className={`py-1.5 px-1.5 rounded-md text-[10px] font-medium border whitespace-nowrap transition-colors ${
                        state.abbyCio.matchGrading
                          ? 'bg-[#ff6a00]/18 border-[#ff6a00] text-[#ff9438]'
                          : 'bg-[#121216] border-white/8 text-zinc-400'
                      }`}
                    >
                      Grading
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        onUpdateAbbyCio({
                          matchSceneAndLiquid: !state.abbyCio.matchSceneAndLiquid,
                        })
                      }
                      className={`py-1.5 px-1.5 rounded-md text-[10px] font-medium border whitespace-nowrap transition-colors ${
                        state.abbyCio.matchSceneAndLiquid
                          ? 'bg-[#ff6a00]/18 border-[#ff6a00] text-[#ff9438]'
                          : 'bg-[#121216] border-white/8 text-zinc-400'
                      }`}
                    >
                      Scene &amp; 3D
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        onUpdateAbbyCio({ matchMorphAndOptics: !state.abbyCio.matchMorphAndOptics })
                      }
                      className={`py-1.5 px-1.5 rounded-md text-[10px] font-medium border whitespace-nowrap transition-colors ${
                        state.abbyCio.matchMorphAndOptics
                          ? 'bg-[#ff6a00]/18 border-[#ff6a00] text-[#ff9438]'
                          : 'bg-[#121216] border-white/8 text-zinc-400'
                      }`}
                    >
                      Morph &amp; Prism
                    </button>
                  </div>

                  {sliderRow(
                    'Adaptation Rate',
                    state.abbyCio.adaptationRate,
                    0.08,
                    1,
                    0.02,
                    (v) => `${Math.round(v * 100)}%`,
                    (v) => onUpdateAbbyCio({ adaptationRate: v })
                  )}
                  {sliderRow(
                    'Scan Cadence',
                    state.abbyCio.scanIntervalMs,
                    250,
                    3000,
                    50,
                    (v) => `${v}ms`,
                    (v) => onUpdateAbbyCio({ scanIntervalMs: v })
                  )}

                  <button
                    type="button"
                    onClick={onRunAbbyScanNow}
                    className="w-full py-2 px-3 rounded-md text-xs font-semibold bg-[#ff6a00] hover:bg-[#ff8c2e] text-[#050506] whitespace-nowrap transition-colors"
                  >
                    Scan &amp; Match Screen Now (Shift+B)
                  </button>
                </div>
              )}

              {/* SMART: KINETIC PRISM HARMONIZER */}
              {section === 'prism' && (
                <div className="space-y-3.5">
                  <div className="grid grid-cols-2 gap-1.5">
                    {KINETIC_HARM_MODES.map((km) => (
                      <button
                        key={km.id}
                        type="button"
                        onClick={() => onUpdateKineticHarmonizer({ enabled: true, mode: km.id })}
                        className={`py-1.5 px-2 rounded-md text-[11px] font-medium text-left truncate border whitespace-nowrap transition-colors ${
                          state.kineticHarmonizer.enabled && state.kineticHarmonizer.mode === km.id
                            ? 'bg-[#ff6a00]/18 border-[#ff6a00] text-[#ff9438]'
                            : 'bg-[#121216] border-white/8 text-zinc-300 hover:border-white/20'
                        }`}
                      >
                        {km.label}
                      </button>
                    ))}
                  </div>

                  {sliderRow(
                    'Harmony Strength',
                    state.kineticHarmonizer.harmonyStrength,
                    0,
                    1,
                    0.02,
                    (v) => `${Math.round(v * 100)}%`,
                    (v) => onUpdateKineticHarmonizer({ harmonyStrength: v })
                  )}
                  {sliderRow(
                    'Edge Contour Glow',
                    state.kineticHarmonizer.edgeGlow,
                    0,
                    1,
                    0.02,
                    (v) => `${Math.round(v * 100)}%`,
                    (v) => onUpdateKineticHarmonizer({ edgeGlow: v })
                  )}
                  {sliderRow(
                    'Spectral Shift',
                    state.kineticHarmonizer.spectralShift,
                    0,
                    1,
                    0.02,
                    (v) => `${Math.round(v * 100)}%`,
                    (v) => onUpdateKineticHarmonizer({ spectralShift: v })
                  )}
                  {sliderRow(
                    'Vignette Balance',
                    state.kineticHarmonizer.vignetteBalance,
                    0,
                    1,
                    0.02,
                    (v) => `${Math.round(v * 100)}%`,
                    (v) => onUpdateKineticHarmonizer({ vignetteBalance: v })
                  )}

                  <button
                    type="button"
                    onClick={() =>
                      onUpdateKineticHarmonizer({
                        syncWithAbby: !state.kineticHarmonizer.syncWithAbby,
                      })
                    }
                    className={`w-full py-2 px-3 rounded-md text-xs font-medium border whitespace-nowrap transition-colors ${
                      state.kineticHarmonizer.syncWithAbby
                        ? 'bg-[#ff6a00]/18 border-[#ff6a00] text-[#ff9438]'
                        : 'bg-[#121216] border-white/8 text-zinc-400'
                    }`}
                  >
                    {state.kineticHarmonizer.syncWithAbby
                      ? 'Synced with Abby Screen Color'
                      : 'Use Scene Designer Color'}
                  </button>
                </div>
              )}

              {/* SMART: CYNTHETOC AI */}
              {section === 'cynthetoc' && (
                <div className="space-y-3.5">
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

                  <div className="grid grid-cols-2 gap-1.5 pt-1">
                    <button
                      type="button"
                      onClick={() =>
                        onUpdateCynthetocAi({ kineticSync: !state.cynthetocAi.kineticSync })
                      }
                      className={`py-2 px-2 rounded-md text-[11px] font-medium border whitespace-nowrap transition-colors ${
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
                      className="py-2 px-2 rounded-md text-[11px] font-semibold bg-[#ff6a00] hover:bg-[#ff8c2e] text-[#050506] whitespace-nowrap transition-colors truncate"
                    >
                      Auto-Direct Frame
                    </button>
                  </div>
                </div>
              )}

              {/* SMART: SMART MORPH ENGINE */}
              {section === 'morph' && (
                <div className="space-y-3.5">
                  <div className="grid grid-cols-2 gap-1.5">
                    {SMART_MORPH_MODES.map((mm) => (
                      <button
                        key={mm.id}
                        type="button"
                        onClick={() => onUpdateSmartMorph({ enabled: true, mode: mm.id })}
                        className={`py-1.5 px-2 rounded-md text-[11px] font-medium text-left truncate border transition-colors ${
                          state.smartMorph.enabled && state.smartMorph.mode === mm.id
                            ? 'bg-[#ff6a00]/18 border-[#ff6a00] text-[#ff9438]'
                            : 'bg-[#121216] border-white/8 text-zinc-300 hover:border-white/20'
                        }`}
                      >
                        {mm.label}
                      </button>
                    ))}
                  </div>

                  {sliderRow(
                    'Expansion Force',
                    state.smartMorph.expansionForce,
                    0,
                    1,
                    0.02,
                    (v) => `${Math.round(v * 100)}%`,
                    (v) => onUpdateSmartMorph({ expansionForce: v })
                  )}
                  {sliderRow(
                    'Form Cohesion',
                    state.smartMorph.cohesion,
                    0,
                    1,
                    0.02,
                    (v) => `${Math.round(v * 100)}%`,
                    (v) => onUpdateSmartMorph({ cohesion: v })
                  )}
                  {sliderRow(
                    'Flow Rate',
                    state.smartMorph.flowRate,
                    0.1,
                    2.5,
                    0.05,
                    (v) => `${v.toFixed(2)}x`,
                    (v) => onUpdateSmartMorph({ flowRate: v })
                  )}
                  {sliderRow(
                    'Phyllotaxis Radial Bias',
                    state.smartMorph.radialBias,
                    0,
                    1,
                    0.02,
                    (v) => `${Math.round(v * 100)}%`,
                    (v) => onUpdateSmartMorph({ radialBias: v })
                  )}
                  {sliderRow(
                    'Edge Preserve Anchor',
                    state.smartMorph.edgePreserve,
                    0,
                    1,
                    0.02,
                    (v) => `${Math.round(v * 100)}%`,
                    (v) => onUpdateSmartMorph({ edgePreserve: v })
                  )}

                  <button
                    type="button"
                    onClick={onTriggerNaturalExpansion}
                    className="w-full py-2 px-3 rounded-md bg-[#ff6a00] hover:bg-[#ff8c2e] text-[#050506] text-xs font-semibold whitespace-nowrap transition-colors"
                  >
                    Natural Expand Frame &amp; Stage
                  </button>
                </div>
              )}

              {/* SMART: LIQUID BRAIN 3D TOPOLOGY */}
              {section === 'liquidBrain' && (
                <div className="space-y-3.5">
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

                  <div className="space-y-1.5 pt-2 border-t border-white/8">
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
                            className={`py-1.5 px-2 rounded text-[10.5px] font-medium text-left truncate border transition-colors ${
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
                    className="w-full py-2 px-3 rounded-md bg-[#ff6a00]/15 border border-[#ff6a00]/60 text-[#ff9438] hover:bg-[#ff6a00] hover:text-[#050506] text-xs font-semibold transition-colors"
                  >
                    Fuse &amp; Morph 3D Shapes
                  </button>
                </div>
              )}

              {/* SMART: INTELLIGENT SCENE DESIGNER */}
              {section === 'scene' && (
                <div className="space-y-3.5">
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
              )}

              {/* SMART: VIDEO TO CARTOON */}
              {section === 'cartoon' && (
                <div className="space-y-3.5">
                  <div className="grid grid-cols-2 gap-1.5">
                    {CARTOON_STYLES.map((cs) => (
                      <button
                        key={cs.id}
                        type="button"
                        onClick={() => onUpdateVideoToCartoon({ enabled: true, style: cs.id })}
                        className={`py-1.5 px-2 rounded-lg text-xs font-medium text-left truncate border transition-colors ${
                          state.videoToCartoon.enabled && state.videoToCartoon.style === cs.id
                            ? 'bg-[#ff6a00]/18 border-[#ff6a00] text-[#ff9438]'
                            : 'bg-[#121216] border-white/8 text-zinc-300 hover:border-white/20'
                        }`}
                      >
                        {cs.label}
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
              )}

              {/* SMART: FUSION MATRIX */}
              {section === 'fusion' && (
                <div className="space-y-3.5">
                  <div className="text-[11px] font-mono tabular-nums text-zinc-400">
                    Coherence {state.fusionMatrix.coherencePct}% · {apps.length} Modules ·{' '}
                    {daemons.length} Daemons
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
                        { key: 'tvToPhosphor', label: 'TV → Phosphor' },
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

                  <div className="grid grid-cols-2 gap-1.5 pt-1">
                    <button
                      type="button"
                      onClick={onMaximizeSystem}
                      className="flex items-center justify-center gap-1 py-2 px-2 rounded-lg bg-[#ff6a00] hover:bg-[#ff8c2e] text-[#050506] text-[11px] font-semibold transition-colors whitespace-nowrap"
                    >
                      <Zap className="w-3 h-3 shrink-0" />
                      <span>Maximize {daemons.length}D</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        onSeedDaemon();
                        onSelectSection('queen');
                      }}
                      className="flex items-center justify-center gap-1 py-2 px-2 rounded-lg bg-[#141419] border border-[#ff6a00]/60 text-[#ff9438] hover:bg-[#ff6a00] hover:text-[#050506] text-[11px] font-semibold transition-colors whitespace-nowrap"
                    >
                      <Crown className="w-3 h-3 shrink-0" />
                      <span>Queen Seed (J)</span>
                    </button>
                  </div>

                  <div className="space-y-1.5 pt-3 border-t border-white/8">
                    <div className="flex items-center justify-between text-[11px] font-medium text-zinc-400">
                      <span>Fused Module Bus</span>
                      <span className="font-mono tabular-nums text-[#ff8c2e]">
                        {apps.filter((a) => a.fused).length}/{apps.length}
                      </span>
                    </div>
                    <div className="space-y-1 max-h-48 overflow-y-auto fos-scroll pr-0.5">
                      {apps.map((app) => (
                        <div
                          key={app.id}
                          className="flex items-center justify-between px-2 py-1 rounded bg-[#111115] border border-white/6 text-[10.5px]"
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

              {/* SMART: DAEMON QUEEN & SWARM */}
              {section === 'queen' && (
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between text-[11px] font-mono tabular-nums text-zinc-400">
                    <span>
                      {daemons.length} Daemons · {seededCount} Seeded
                    </span>
                    <span className="text-[#ff8c2e]">
                      Fitness {state.daemonQueen.adaptiveFitness}%
                    </span>
                  </div>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      onSeedDaemon(seedSpecInput.trim() || undefined);
                      setSeedSpecInput('');
                    }}
                    className="flex gap-1.5"
                  >
                    <input
                      type="text"
                      value={seedSpecInput}
                      onChange={(e) => setSeedSpecInput(e.target.value)}
                      placeholder="Optional daemon specialty..."
                      className="flex-1 min-w-0 bg-[#121216] border border-white/10 rounded-md px-2 py-1.5 text-[11px] text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-[#ff6a00]"
                    />
                    <button
                      type="submit"
                      className="px-2.5 py-1.5 rounded-md bg-[#ff6a00] hover:bg-[#ff8c2e] text-[#050506] text-[11px] font-semibold whitespace-nowrap shrink-0 transition-colors"
                    >
                      Seed Daemon
                    </button>
                  </form>

                  <div className="grid grid-cols-3 gap-1.5">
                    <button
                      type="button"
                      onClick={() =>
                        onUpdateDaemonQueen({ autoSeed: !state.daemonQueen.autoSeed })
                      }
                      className={`py-1.5 px-1.5 rounded-md text-[10.5px] font-medium border whitespace-nowrap transition-colors ${
                        state.daemonQueen.autoSeed
                          ? 'bg-[#ff6a00]/18 border-[#ff6a00] text-[#ff9438]'
                          : 'bg-[#121216] border-white/8 text-zinc-300'
                      }`}
                    >
                      Auto-Seed
                    </button>
                    <button
                      type="button"
                      onClick={() => onSaveDaemonsJson(true)}
                      className="flex items-center justify-center gap-1 py-1.5 px-1.5 rounded-md text-[10.5px] font-semibold bg-[#121216] border border-white/10 text-zinc-100 hover:border-[#ff6a00] whitespace-nowrap transition-colors"
                    >
                      <Download className="w-3 h-3 text-[#ff6a00] shrink-0" />
                      <span>Save JSON</span>
                    </button>
                    <button
                      type="button"
                      onClick={onResetSeededDaemons}
                      disabled={seededCount === 0}
                      className="py-1.5 px-1.5 rounded-md text-[10.5px] font-medium bg-[#121216] border border-white/8 text-zinc-400 hover:text-zinc-100 disabled:opacity-40 whitespace-nowrap transition-colors"
                    >
                      Prune All
                    </button>
                  </div>

                  {sliderRow(
                    'Auto-Seed Cadence',
                    state.daemonQueen.seedIntervalSec,
                    4,
                    60,
                    1,
                    (v) => `${v}s`,
                    (v) => onUpdateDaemonQueen({ seedIntervalSec: v })
                  )}
                  {sliderRow(
                    'Max Queen Seeded Cap',
                    state.daemonQueen.maxSeededDaemons,
                    4,
                    48,
                    1,
                    (v) => `${v} max`,
                    (v) => onUpdateDaemonQueen({ maxSeededDaemons: v })
                  )}

                  <div className="text-[10px] font-mono text-zinc-500 truncate">
                    JSON: {state.daemonQueen.jsonFilePath}
                    {state.daemonQueen.lastSavedAt
                      ? ` · Saved ${new Date(state.daemonQueen.lastSavedAt).toLocaleTimeString()}`
                      : ' · Live Sync Ready'}
                  </div>

                  <div className="space-y-1.5 pt-2 border-t border-white/8">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-zinc-200">
                        Swarm Registry ({daemons.length})
                      </span>
                      <button
                        type="button"
                        onClick={onMaximizeSystem}
                        className="px-2 py-0.5 rounded bg-[#ff6a00] hover:bg-[#ff8c2e] text-[#050506] text-[10.5px] font-semibold transition-colors"
                      >
                        Maximize All
                      </button>
                    </div>
                    <div className="space-y-1 max-h-60 overflow-y-auto fos-scroll pr-0.5">
                      {daemons.map((d, idx) => {
                        const isSeeded =
                          idx >= BASE_DAEMON_COUNT ||
                          d.tier === 'QUEEN_SEED' ||
                          Boolean(d.parentQueenId);
                        return (
                          <div
                            key={d.id}
                            className={`flex items-center justify-between px-2 py-1 rounded border text-[10px] ${
                              isSeeded
                                ? 'bg-[#17110b] border-[#ff6a00]/30'
                                : 'bg-[#111115] border-white/6'
                            }`}
                          >
                            <div className="min-w-0 truncate pr-1.5">
                              <span className="font-mono text-[#ff8c2e]">{d.id}</span>
                              <span className="text-zinc-400"> · {d.name}</span>
                            </div>
                            <div className="flex items-center gap-1.5 shrink-0">
                              <span className="font-mono tabular-nums text-zinc-300">
                                {d.boostFactor.toFixed(1)}x · {d.efficiencyPct}%
                              </span>
                              {isSeeded && (
                                <button
                                  type="button"
                                  onClick={() => onRemoveSeededDaemon(d.id)}
                                  aria-label={`Remove ${d.name}`}
                                  className="p-0.5 text-zinc-500 hover:text-[#ff8c2e] transition-colors"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* STATION: CINEMA OPTICS */}
              {section === 'optics' && (
                <div className="space-y-3.5">
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
                        className={`py-1.5 px-1 rounded-md text-[11px] font-medium border whitespace-nowrap transition-colors ${
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
                      className={`py-1.5 px-2 rounded-lg text-xs font-medium border whitespace-nowrap transition-colors ${
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
                      className={`py-1.5 px-2 rounded-lg text-xs font-medium border whitespace-nowrap transition-colors ${
                        state.theatreView
                          ? 'bg-[#ff6a00] border-[#ff6a00] text-[#050506] font-semibold'
                          : 'bg-[#121216] border-white/8 text-zinc-300'
                      }`}
                    >
                      Theatre Masking (T)
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

                  <div className="space-y-2 pt-2 border-t border-white/8">
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
                          className={`py-1.5 px-2 rounded-lg text-xs font-medium border whitespace-nowrap transition-colors ${
                            state.frameGuide === g.id
                              ? 'bg-[#ff6a00]/18 border-[#ff6a00] text-[#ff9438]'
                              : 'bg-[#121216] border-white/8 text-zinc-300 hover:border-white/20'
                          }`}
                        >
                          {g.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* STATION: REAL TV DECK */}
              {section === 'realTv' && (
                <div className="space-y-3.5">
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
              )}

              {/* STATION: COLOR LAB */}
              {section === 'color' && (
                <div className="space-y-4">
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

                  <div className="space-y-3.5 pt-2 border-t border-white/8">
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
                </div>
              )}

              {/* STATION: LIQUIFIED 3D STAGE */}
              {section === 'stage3d' && (
                <div className="space-y-3.5">
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
                    'Optical Refraction',
                    state.liquified3d.refraction,
                    0,
                    1,
                    0.02,
                    (v) => `${Math.round(v * 100)}%`,
                    (v) => onUpdateLiquified3d({ refraction: v })
                  )}
                  {sliderRow(
                    'Chrome Fresnel',
                    state.liquified3d.chromeFresnel,
                    0,
                    1,
                    0.02,
                    (v) => `${Math.round(v * 100)}%`,
                    (v) => onUpdateLiquified3d({ chromeFresnel: v })
                  )}
                  {sliderRow(
                    'Interactive Ripple',
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
                      className={`py-1.5 px-1.5 rounded-lg text-[10.5px] font-medium border whitespace-nowrap transition-colors ${
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
                      className={`py-1.5 px-1.5 rounded-lg text-[10.5px] font-medium border whitespace-nowrap transition-colors ${
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
                      className={`py-1.5 px-1.5 rounded-lg text-[10.5px] font-medium border whitespace-nowrap transition-colors ${
                        state.liquified3d.autoOrbit
                          ? 'bg-[#ff6a00]/18 border-[#ff6a00] text-[#ff9438]'
                          : 'bg-[#121216] border-white/8 text-zinc-400'
                      }`}
                    >
                      Auto Orbit
                    </button>
                  </div>

                  <div className="space-y-2.5 pt-2 border-t border-white/8">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-zinc-200">Auditorium &amp; Cones</span>
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
                      'Multiplied Cones (Stage)',
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
                </div>
              )}

              {/* STATION: STEREOSCOPIC 3D */}
              {section === 'stereo' && (
                <div className="space-y-3.5">
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
              )}

              {/* STATION: HOLOGRAM RIG */}
              {section === 'holo' && (
                <div className="space-y-3.5">
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
                      className={`py-2 px-2 rounded-md text-[11px] font-medium border transition-colors ${
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
                      className="py-2 px-2 rounded-md text-[11px] font-semibold bg-[#ff6a00] hover:bg-[#ff8c2e] text-[#050506] transition-colors truncate"
                    >
                      Project Hologram
                    </button>
                  </div>
                </div>
              )}

              {/* STATION: LIQUID UPSCALE & DISPLAY */}
              {section === 'upscale' && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-zinc-200">Liquid Upscale Ladder</span>
                      <span className="font-mono tabular-nums text-[#ff8c2e]">
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

                  <div className="space-y-2 pt-3 border-t border-white/8">
                    <span className="block text-xs font-semibold text-zinc-200">
                      Signal &amp; Performance HUD
                    </span>
                    <div className="grid grid-cols-2 gap-1.5">
                      <button
                        type="button"
                        onClick={() => onUpdateState({ subtractMode: !state.subtractMode })}
                        className={`py-2 px-2 rounded-lg text-xs font-medium border transition-colors ${
                          state.subtractMode
                            ? 'bg-[#ff6a00] border-[#ff6a00] text-[#050506] font-semibold'
                            : 'bg-[#121216] border-white/8 text-zinc-300'
                        }`}
                      >
                        {state.subtractMode ? 'Subtract On (S)' : 'Stream Direct (S)'}
                      </button>
                      <button
                        type="button"
                        onClick={() => onUpdateState({ realFpsMode: !state.realFpsMode })}
                        className={`py-2 px-2 rounded-lg text-xs font-medium border transition-colors ${
                          state.realFpsMode
                            ? 'bg-[#ff6a00] border-[#ff6a00] text-[#050506] font-semibold'
                            : 'bg-[#121216] border-white/8 text-zinc-300'
                        }`}
                      >
                        Real FPS HUD (F)
                      </button>
                    </div>
                    <div className="flex items-center justify-between text-[11px] font-mono tabular-nums text-zinc-400 pt-1">
                      <span>Frame Rate: {state.fps.toFixed(1)} FPS</span>
                      <span>{state.frameTimeMs.toFixed(1)} ms</span>
                    </div>
                  </div>
                </div>
              )}

              {/* STATION: CLIPS, TIMELINE & EXPORT */}
              {section === 'media' && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <span className="block text-xs font-semibold text-zinc-200">Media Source</span>
                    <div className="text-[11px] font-mono text-zinc-400 truncate">
                      {state.mediaSourceName}
                    </div>
                    <div className="grid grid-cols-2 gap-1.5">
                      <button
                        type="button"
                        onClick={onLoadMediaClick}
                        className="flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg bg-[#ff6a00] hover:bg-[#ff8c2e] text-[#050506] text-xs font-semibold transition-colors"
                      >
                        <Upload className="w-3.5 h-3.5 shrink-0" />
                        <span>Load File</span>
                      </button>
                      <button
                        type="button"
                        onClick={onResetScopeStream}
                        className="py-2 px-2 rounded-lg bg-[#141419] border border-white/10 text-xs font-medium text-zinc-200 hover:border-[#ff6a00] transition-colors"
                      >
                        Scope Stream
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2.5 pt-3 border-t border-white/8">
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
                      Scene &amp; Cutaway Markers
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

                    <div className="space-y-1.5 max-h-40 overflow-y-auto fos-scroll">
                      {state.markers.length === 0 ? (
                        <p className="text-xs text-zinc-500 py-1.5">No scene markers yet.</p>
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
                      Frame &amp; Standalone Exports
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
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
