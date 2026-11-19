import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Repeat,
  Upload,
  Sliders,
  MessageSquare,
  Box,
  Film,
  Maximize2,
  Activity,
  Tv,
  Sparkles,
  Droplets,
  Brain,
  Eye,
  Hexagon,
} from 'lucide-react';
import {
  getFractalBrain,
  type CinemaModeConfig,
  type ColorGradingState,
  type CynthetocAiConfig,
  type FractalBrainSnapshot,
  type FractalStudioState,
  type FusionMatrixConfig,
  type HologramRigMode,
  type HolographicProjectionConfig,
  type LiquidBrainConfig,
  type Liquified3dConfig,
  type RealTvModeConfig,
  type SceneDesignerConfig,
  type Stereoscopic3dConfig,
  type StereoscopicModeId,
  type StudioCommandPayload,
  type UpscaleTier,
  type VideoToCartoonConfig,
} from './core/fractalBrain';
import { ProceduralScopeStream } from './core/proceduralStream';
import { CinemaScopeEngine } from './core/cinemaEngine';
import { exportStandaloneStudioHtml } from './core/standaloneExport';
import { MicroFractalLogo } from './components/MicroFractalLogo';
import { StudioDrawer } from './components/StudioDrawer';
import { GeminiCopilotDrawer } from './components/GeminiCopilotDrawer';

function formatTimecode(sec: number): string {
  const s = Math.max(0, sec);
  const mins = Math.floor(s / 60);
  const rem = Math.floor(s % 60);
  const tenths = Math.floor((s % 1) * 10);
  return `${String(mins).padStart(2, '0')}:${String(rem).padStart(2, '0')}.${tenths}`;
}

const UPSCALE_CYCLE: UpscaleTier[] = ['off', '8k', '16k', '64k'];
const STEREO_MODES: StereoscopicModeId[] = [
  'anaglyphRedCyan',
  'amberBlueColorCode',
  'pulfrichAnalog',
  'sideBySide',
  'interlacedField',
];
const HOLO_RIGS: HologramRigMode[] = [
  'pepperGhostPyramid',
  'volumetricSliceStack',
  'liquidGlassPrism',
  'floatingCausticField',
];

const TV_PROFILE_LABEL: Record<RealTvModeConfig['profile'], string> = {
  crt: 'CRT 480i · 59.94 Hz',
  trinitron: 'TRINITRON · 1080i',
  oled: 'BROADCAST OLED · 60 Hz',
  vhs: 'VHS RF · NTSC',
};

export default function App() {
  const brainRef = useRef(getFractalBrain());
  const [snapshot, setSnapshot] = useState<FractalBrainSnapshot>(() =>
    brainRef.current.getSnapshot()
  );
  const [studioOpen, setStudioOpen] = useState(false);
  const [copilotOpen, setCopilotOpen] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const engineRef = useRef<CinemaScopeEngine | null>(null);
  const procStreamRef = useRef<ProceduralScopeStream | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const mediaUrlRef = useRef<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const cynthetocDirectBusyRef = useRef(false);

  const pointerDragRef = useRef<{
    active: boolean;
    mode: 'orbit' | 'pan';
    lastX: number;
    lastY: number;
  }>({ active: false, mode: 'orbit', lastX: 0, lastY: 0 });

  const showToast = useCallback((msg: string) => {
    setToastMsg(msg);
  }, []);

  useEffect(() => {
    if (!toastMsg) return;
    const t = window.setTimeout(() => setToastMsg(null), 2800);
    return () => window.clearTimeout(t);
  }, [toastMsg]);

  useEffect(() => {
    const brain = brainRef.current;
    const unsub = brain.on('*', () => {
      setSnapshot(brain.getSnapshot());
    });
    return unsub;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const brain = brainRef.current;
    if (!procStreamRef.current) {
      procStreamRef.current = new ProceduralScopeStream(1434, 600);
    }
    if (!engineRef.current) {
      engineRef.current = new CinemaScopeEngine(canvas);
    }
    if (!videoRef.current) {
      const vid = document.createElement('video');
      vid.playsInline = true;
      vid.muted = true;
      vid.loop = true;
      vid.crossOrigin = 'anonymous';
      videoRef.current = vid;
    }

    let rafId = 0;
    let lastTs = performance.now();
    let fpsCounterFrames = 0;
    let fpsLastSample = lastTs;
    let currentFps = 60;
    let lastUiSync = 0;
    let cinema24pAccum = 0;
    let cancelled = false;

    const runLoop = (now: number) => {
      if (cancelled) return;

      const dtMs = Math.max(0.1, Math.min(80, now - lastTs));
      const dtSec = dtMs / 1000;
      lastTs = now;

      const snap = brain.getSnapshot();
      const st = snap.state;
      const vid = videoRef.current;
      const proc = procStreamRef.current!;
      const engine = engineRef.current!;

      engine.updateTraversal(dtSec, st);

      if (st.mediaType === 'procedural') {
        if (st.playing) {
          if (st.cinema.cadence24p && !st.realTv.enabled) {
            cinema24pAccum += dtSec;
            const step24 = 1 / 24;
            if (cinema24pAccum >= step24) {
              const steps = Math.floor(cinema24pAccum / step24);
              cinema24pAccum -= steps * step24;
              proc.advance(steps * step24, st.sceneDesigner.motionSpeed);
            }
          } else {
            proc.advance(dtSec, st.sceneDesigner.motionSpeed);
          }

          let t = proc.getTime();
          if (
            st.abLoop.enabled &&
            st.abLoop.a !== null &&
            st.abLoop.b !== null &&
            st.abLoop.b > st.abLoop.a
          ) {
            if (t >= st.abLoop.b || t < st.abLoop.a) {
              t = st.abLoop.a;
              proc.setTime(t);
            }
          } else if (t >= st.duration) {
            t = st.loop ? t % st.duration : st.duration;
            proc.setTime(t);
            if (!st.loop) {
              brain.set('playing', false);
            }
          }
          brain.syncPlaybackTime(t, st.duration);
        }
        proc.render(undefined, st.sceneDesigner, st.liquified3d, st.cynthetocAi);
      } else if (st.mediaType === 'video' && vid) {
        if (
          st.abLoop.enabled &&
          st.abLoop.a !== null &&
          st.abLoop.b !== null &&
          st.abLoop.b > st.abLoop.a
        ) {
          if (vid.currentTime >= st.abLoop.b || vid.currentTime < st.abLoop.a) {
            vid.currentTime = st.abLoop.a;
          }
        }
        const vidDur = vid.duration && Number.isFinite(vid.duration) ? vid.duration : st.duration;
        brain.syncPlaybackTime(vid.currentTime || 0, vidDur);
      }

      let source: HTMLCanvasElement | HTMLVideoElement | HTMLImageElement = proc.canvas;
      if (st.mediaType === 'video' && vid && vid.readyState >= 2) {
        source = vid;
      } else if (st.mediaType === 'image' && imageRef.current && imageRef.current.complete) {
        source = imageRef.current;
      }

      try {
        engine.render(source, st, now * 0.001);
      } catch (err) {
        console.warn('Render tick recovered:', err);
      }

      fpsCounterFrames += 1;
      if (now - fpsLastSample >= 320) {
        currentFps = (fpsCounterFrames * 1000) / (now - fpsLastSample);
        fpsCounterFrames = 0;
        fpsLastSample = now;
        const targetHz =
          st.cinema.cadence24p && !st.realTv.enabled
            ? 24
            : currentFps > 95
            ? 120
            : currentFps > 70
            ? 75
            : 60;
        brain.reportFrameMetrics(currentFps, 1000 / Math.max(1, currentFps), targetHz);
      }

      brain.tickDaemons(now);

      if (window.__FRACTAL_WATCHDOG__) {
        window.__FRACTAL_WATCHDOG__.lastFrameTs = now;
        if (!window.__FRACTAL_WATCHDOG__.healthy) {
          window.__FRACTAL_WATCHDOG__.healthy = true;
          const bootEl = document.getElementById('fractal-watchdog-boot');
          if (bootEl) bootEl.style.display = 'none';
        }
      }

      if (now - lastUiSync >= 100) {
        lastUiSync = now;
        setSnapshot(brain.getSnapshot());
      }

      rafId = window.requestAnimationFrame(runLoop);
    };

    rafId = window.requestAnimationFrame(runLoop);

    const watchdogTimer = window.setInterval(() => {
      if (cancelled || document.visibilityState !== 'visible') return;
      const wd = window.__FRACTAL_WATCHDOG__;
      if (wd && performance.now() - wd.lastFrameTs > 1500) {
        wd.restarts += 1;
        wd.lastFrameTs = performance.now();
        window.cancelAnimationFrame(rafId);
        lastTs = performance.now();
        rafId = window.requestAnimationFrame(runLoop);
        brain.emit('watchdog:healed', { restarts: wd.restarts });
      }
    }, 1000);

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(rafId);
      window.clearInterval(watchdogTimer);
    };
  }, []);

  const loadMediaFile = useCallback(
    (file: File) => {
      const brain = brainRef.current;
      if (mediaUrlRef.current) {
        URL.revokeObjectURL(mediaUrlRef.current);
        mediaUrlRef.current = null;
      }

      const url = URL.createObjectURL(file);
      mediaUrlRef.current = url;

      if (file.type.startsWith('video/')) {
        const vid = videoRef.current;
        if (!vid) return;
        const st = brain.getSnapshot().state;
        vid.src = url;
        vid.loop = st.loop;
        vid.muted = st.muted;
        vid.volume = st.volume;
        vid.onloadedmetadata = () => {
          brain.set({
            mediaType: 'video',
            mediaSourceName: file.name,
            duration: vid.duration || 120,
            currentTime: 0,
            playing: true,
          });
          vid.play().catch(() => {
            vid.muted = true;
            brain.set('muted', true);
            vid.play().catch(() => {});
          });
          showToast(`Loaded video: ${file.name}`);
        };
      } else if (file.type.startsWith('image/')) {
        const img = new Image();
        img.onload = () => {
          imageRef.current = img;
          brain.set({
            mediaType: 'image',
            mediaSourceName: file.name,
            duration: 60,
            currentTime: 0,
            playing: true,
          });
          showToast(`Loaded still frame: ${file.name}`);
        };
        img.src = url;
      } else {
        showToast('Unsupported media type. Load MP4/WebM video or PNG/JPG image.');
      }
    },
    [showToast]
  );

  const resetToProceduralStream = useCallback(() => {
    const brain = brainRef.current;
    const vid = videoRef.current;
    if (vid) {
      vid.pause();
      vid.removeAttribute('src');
      vid.load();
    }
    if (mediaUrlRef.current) {
      URL.revokeObjectURL(mediaUrlRef.current);
      mediaUrlRef.current = null;
    }
    brain.set({
      mediaType: 'procedural',
      mediaSourceName: 'MicroFractal 2.39:1 Calibration Stream',
      duration: 120,
      currentTime: 0,
      playing: true,
    });
    showToast('Switched to procedural 2.39:1 Scope stream');
  }, [showToast]);

  const togglePlay = useCallback(() => {
    const brain = brainRef.current;
    const st = brain.getSnapshot().state;
    const next = !st.playing;
    brain.set('playing', next);
    const vid = videoRef.current;
    if (st.mediaType === 'video' && vid) {
      if (next) vid.play().catch(() => {});
      else vid.pause();
    }
  }, []);

  const toggleMute = useCallback(() => {
    const brain = brainRef.current;
    const next = !brain.getSnapshot().state.muted;
    brain.set('muted', next);
    if (videoRef.current) {
      videoRef.current.muted = next;
    }
  }, []);

  const toggleLoop = useCallback(() => {
    const brain = brainRef.current;
    const next = !brain.getSnapshot().state.loop;
    brain.set('loop', next);
    if (videoRef.current) {
      videoRef.current.loop = next;
    }
  }, []);

  const seekTo = useCallback((time: number) => {
    const brain = brainRef.current;
    const st = brain.getSnapshot().state;
    const clamped = Math.max(0, Math.min(st.duration || 120, time));
    brain.set('currentTime', clamped);
    if (st.mediaType === 'video' && videoRef.current) {
      videoRef.current.currentTime = clamped;
    } else if (st.mediaType === 'procedural' && procStreamRef.current) {
      procStreamRef.current.setTime(clamped);
    }
  }, []);

  const setUpscaleTier = useCallback((tier: UpscaleTier) => {
    const brain = brainRef.current;
    if (tier === '8k') brain.setLiquid8k(true);
    else if (tier === '16k') brain.setLiquid16k(true);
    else if (tier === '64k') brain.setLiquid64k(true);
    else brain.set('upscaleMode', 'off');
  }, []);

  const cycleUpscaleTier = useCallback(() => {
    const curr = brainRef.current.getSnapshot().state.upscaleMode;
    const next = UPSCALE_CYCLE[(UPSCALE_CYCLE.indexOf(curr) + 1) % UPSCALE_CYCLE.length];
    setUpscaleTier(next);
    showToast(`Upscaler: ${next === 'off' ? 'Native Scope' : `Liquid ${next.toUpperCase()}`}`);
  }, [setUpscaleTier, showToast]);

  const handleCaptureSnapshot = useCallback(() => {
    const dataUrl = engineRef.current?.captureSnapshotPng();
    if (!dataUrl) {
      showToast('Unable to capture frame.');
      return;
    }
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `fractal-cinemascope-${Date.now()}.png`;
    a.click();
    showToast('Exported 2.39:1 PNG frame grab');
  }, [showToast]);

  const handleExportHtml = useCallback(() => {
    const html = exportStandaloneStudioHtml(brainRef.current.getSnapshot());
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'fractal-os-cinemascope-studio.html';
    a.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    showToast('Exported standalone single-file HTML Studio');
  }, [showToast]);

  const handleApplyAutopilotCommands = useCallback(
    (commandsList: StudioCommandPayload[]): string[] => {
      const brain = brainRef.current;
      const allApplied: string[] = [];

      for (const cmd of commandsList) {
        const applied = brain.applyCommands(cmd);
        allApplied.push(...applied);

        const nextState = brain.getSnapshot().state;
        const vid = videoRef.current;
        if (nextState.mediaType === 'video' && vid) {
          vid.muted = nextState.muted;
          vid.loop = nextState.loop;
          if (typeof cmd.playing === 'boolean') {
            if (cmd.playing) vid.play().catch(() => {});
            else vid.pause();
          }
          if (typeof cmd.seekSeconds === 'number') {
            vid.currentTime = nextState.currentTime;
          }
        } else if (
          nextState.mediaType === 'procedural' &&
          typeof cmd.seekSeconds === 'number' &&
          procStreamRef.current
        ) {
          procStreamRef.current.setTime(nextState.currentTime);
        }

        if (cmd.stage3d?.cameraPreset) {
          engineRef.current?.setCameraPreset(cmd.stage3d.cameraPreset);
        }
      }

      setSnapshot(brain.getSnapshot());
      if (allApplied.length > 0) {
        showToast(`Autopilot: ${allApplied.slice(0, 3).join(' · ')}`);
      }
      return allApplied;
    },
    [showToast]
  );

  const handleCynthetocDirect = useCallback(async () => {
    if (cynthetocDirectBusyRef.current) return;
    cynthetocDirectBusyRef.current = true;
    showToast('Cynthetoc AI analyzing live frame...');
    try {
      const snap = brainRef.current.getSnapshot();
      const frameDataUrl = engineRef.current?.captureSnapshotPng() ?? undefined;
      const studioContext = JSON.stringify({
        mode: snap.state.mode,
        upscaleMode: snap.state.upscaleMode,
        grading: snap.state.grading,
        sceneDesigner: snap.state.sceneDesigner,
        liquified3d: snap.state.liquified3d,
        cynthetocAi: snap.state.cynthetocAi,
        stereoscopic: snap.state.stereoscopic,
        liquidBrain: snap.state.liquidBrain,
        holographic: snap.state.holographic,
        stage3d: snap.state.stage3d,
        fusionMatrix: snap.state.fusionMatrix,
      });
      const res = await fetch('/api/cynthetoc/direct', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'gemini-4-hydrogen',
          intent: `Direct current 2.39:1 frame using Cynthetoc AI (${snap.state.cynthetocAi.mode}) and 3x studio optimization.`,
          studioContext,
          frameDataUrl,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || `HTTP ${res.status}`);
      }
      if (Array.isArray(data?.commands) && data.commands.length > 0) {
        handleApplyAutopilotCommands(data.commands as StudioCommandPayload[]);
      }
      showToast(
        typeof data?.text === 'string' && data.text.trim()
          ? `Cynthetoc AI: ${data.text.slice(0, 72)}`
          : 'Cynthetoc AI directive applied'
      );
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Cynthetoc AI direct failed';
      showToast(msg);
    } finally {
      cynthetocDirectBusyRef.current = false;
    }
  }, [handleApplyAutopilotCommands, showToast]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const isTyping =
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT' ||
          target.isContentEditable);
      if (isTyping) return;

      const brain = brainRef.current;
      const st = brain.getSnapshot().state;
      const k = e.key.toLowerCase();

      if (st.mode === '3d' && st.realFpsMode) {
        if (
          ['w', 'a', 's', 'd', 'q', 'e', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(k)
        ) {
          engineRef.current?.setKeyDown(k, true);
          if (k.startsWith('arrow')) e.preventDefault();
          if (k === 's' && !e.shiftKey) return;
        }
      }

      if (k === ' ') {
        e.preventDefault();
        togglePlay();
      } else if (k === '1' || k === 'm') {
        brain.set('mode', 'movie');
      } else if (k === '2' || k === '3') {
        brain.set('mode', '3d');
      } else if (k === 's') {
        brain.set('subtractMode', !st.subtractMode);
      } else if (k === 'l') {
        brain.set('anamorphicSqueeze', !st.anamorphicSqueeze);
      } else if (k === 'k') {
        cycleUpscaleTier();
      } else if (k === 't') {
        brain.setTheatreView(!st.theatreView);
      } else if (k === 'f') {
        brain.setRealFpsMode(!st.realFpsMode);
      } else if (k === 'v') {
        brain.setRealTvMode(!st.realTv.enabled);
        showToast(!st.realTv.enabled ? `Real TV Mode: ${st.realTv.profile.toUpperCase()}` : 'Real TV Mode: OFF');
      } else if (k === 'x') {
        const nextToon = !st.videoToCartoon.enabled;
        brain.setVideoToCartoon({ enabled: nextToon });
        showToast(nextToon ? `Video to Cartoon: ${st.videoToCartoon.style}` : 'Video to Cartoon: OFF');
      } else if (k === 'z') {
        const nextCyn = !st.cynthetocAi.enabled;
        brain.setCynthetocAi({ enabled: nextCyn });
        showToast(nextCyn ? `Cynthetoc AI: ${st.cynthetocAi.mode}` : 'Cynthetoc AI: OFF');
      } else if (k === 'y') {
        if (e.shiftKey) {
          const currIdx = STEREO_MODES.indexOf(st.stereoscopic.mode);
          const nextMode = STEREO_MODES[(currIdx + 1) % STEREO_MODES.length];
          brain.setStereoscopic({ enabled: true, mode: nextMode });
          showToast(`Stereoscopic 3D: ${nextMode}`);
        } else {
          const nextStereo = !st.stereoscopic.enabled;
          brain.setStereoscopic({ enabled: nextStereo });
          showToast(nextStereo ? `Stereoscopic 3D: ${st.stereoscopic.mode}` : 'Stereoscopic 3D: OFF');
        }
      } else if (k === 'h') {
        if (e.shiftKey) {
          const currIdx = HOLO_RIGS.indexOf(st.holographic.rigMode);
          const nextRig = HOLO_RIGS[(currIdx + 1) % HOLO_RIGS.length];
          brain.projectHologramFromMainImage(nextRig);
          engineRef.current?.injectRipple(0.5, 0.5, performance.now() * 0.001);
          showToast(`Hologram Rig: ${nextRig}`);
        } else {
          const nextHolo = !st.holographic.enabled;
          if (nextHolo) {
            brain.projectHologramFromMainImage();
            engineRef.current?.injectRipple(0.5, 0.5, performance.now() * 0.001);
            showToast(`Liquid Glass Hologram: ${st.holographic.rigMode}`);
          } else {
            brain.setHolographic({ enabled: false });
            showToast('Holographic Projection: OFF');
          }
        }
      } else if (k === 'g') {
        setStudioOpen((v) => !v);
      } else if (k === 'c') {
        setCopilotOpen((v) => !v);
      }
    };

    const onKeyUp = (e: KeyboardEvent) => {
      engineRef.current?.setKeyDown(e.key.toLowerCase(), false);
    };

    const onBlur = () => {
      engineRef.current?.clearKeys();
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('blur', onBlur);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('blur', onBlur);
    };
  }, [cycleUpscaleTier, showToast, togglePlay]);

  const st = snapshot.state;

  const getMovieScopeRect = () => {
    const vw = typeof window !== 'undefined' ? window.innerWidth : 1440;
    const vh = typeof window !== 'undefined' ? window.innerHeight : 900;
    const viewAspect = vw / Math.max(1, vh);
    const targetAspect = engineRef.current
      ? engineRef.current.getTargetAspect(st)
      : st.realTv.enabled
      ? st.realTv.profile === 'crt' || st.realTv.profile === 'vhs'
        ? 4 / 3
        : 16 / 9
      : st.anamorphicSqueeze
      ? 2.39
      : 16 / 9;
    let widthPct = 100;
    let heightPct = 100;
    if (viewAspect > targetAspect) {
      widthPct = (targetAspect / viewAspect) * 100;
    } else {
      heightPct = (viewAspect / targetAspect) * 100;
    }
    if (st.theatreView) {
      widthPct *= 0.9;
      heightPct *= 0.9;
    } else if (st.realTv.enabled) {
      widthPct *= 0.93;
      heightPct *= 0.93;
    }
    return { widthPct, heightPct };
  };

  const scopeRect = getMovieScopeRect();

  return (
    <div
      className={`relative w-screen h-screen overflow-hidden select-none ${
        st.theatreView ? 'bg-[#020203]' : 'bg-[#050506]'
      }`}
      onDragOver={(e) => {
        e.preventDefault();
        setDragActive(true);
      }}
      onDragLeave={(e) => {
        if (e.currentTarget.contains(e.relatedTarget as Node)) return;
        setDragActive(false);
      }}
      onDrop={(e) => {
        e.preventDefault();
        setDragActive(false);
        const file = e.dataTransfer.files?.[0];
        if (file) loadMediaFile(file);
      }}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="video/*,image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) loadMediaFile(f);
          e.target.value = '';
        }}
      />

      <canvas
        ref={canvasRef}
        className={`block w-full h-full ${st.mode === '3d' ? 'cursor-grab active:cursor-grabbing' : ''}`}
        onContextMenu={(e) => e.preventDefault()}
        onPointerDown={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          if (rect.width > 0 && rect.height > 0) {
            engineRef.current?.injectRipple(
              (e.clientX - rect.left) / rect.width,
              (e.clientY - rect.top) / rect.height,
              performance.now() * 0.001
            );
          }
          if (st.mode !== '3d') return;
          engineRef.current?.setPointerInteracting(true);
          pointerDragRef.current = {
            active: true,
            mode: e.button === 2 || e.shiftKey ? 'pan' : 'orbit',
            lastX: e.clientX,
            lastY: e.clientY,
          };
          e.currentTarget.setPointerCapture(e.pointerId);
        }}
        onPointerMove={(e) => {
          if (st.mode === '3d' && st.liquified3d.enabled && !pointerDragRef.current.active) {
            const rect = e.currentTarget.getBoundingClientRect();
            if (rect.width > 0 && rect.height > 0) {
              engineRef.current?.injectRipple(
                (e.clientX - rect.left) / rect.width,
                (e.clientY - rect.top) / rect.height,
                performance.now() * 0.001
              );
            }
          }
          if (!pointerDragRef.current.active || st.mode !== '3d') return;
          const dx = e.clientX - pointerDragRef.current.lastX;
          const dy = e.clientY - pointerDragRef.current.lastY;
          pointerDragRef.current.lastX = e.clientX;
          pointerDragRef.current.lastY = e.clientY;
          if (pointerDragRef.current.mode === 'pan') {
            engineRef.current?.pan(dx, dy);
          } else {
            engineRef.current?.orbit(dx, dy);
          }
        }}
        onPointerUp={(e) => {
          pointerDragRef.current.active = false;
          engineRef.current?.setPointerInteracting(false);
          try {
            e.currentTarget.releasePointerCapture(e.pointerId);
          } catch {
            // ignore
          }
        }}
        onWheel={(e) => {
          if (st.mode === '3d') {
            engineRef.current?.zoom(e.deltaY);
          }
        }}
      />

      {st.theatreView && (
        <div className="pointer-events-none fixed inset-0 z-10 transition-opacity duration-300">
          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse 68% 42% at 50% 50%, rgba(255,106,0,0.08) 0%, rgba(2,2,3,0.6) 72%, rgba(0,0,0,0.94) 100%)',
            }}
          />
          <div className="absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-[#1a0903]/85 to-transparent" />
          <div className="absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-[#1a0903]/85 to-transparent" />
        </div>
      )}

      {st.mode === 'movie' && (
        <div className="pointer-events-none fixed inset-0 z-10 flex items-center justify-center">
          <div
            className="relative"
            style={{
              width: `${scopeRect.widthPct}%`,
              height: `${scopeRect.heightPct}%`,
            }}
          >
            {!st.realTv.enabled && st.frameGuide === '2.35' && (
              <div className="absolute inset-y-0 left-[0.85%] right-[0.85%] border border-[#ff6a00]/45" />
            )}
            {!st.realTv.enabled && st.frameGuide === 'thirds' && (
              <>
                <div className="absolute inset-y-0 left-1/3 w-px bg-[#ff6a00]/30" />
                <div className="absolute inset-y-0 left-2/3 w-px bg-[#ff6a00]/30" />
                <div className="absolute inset-x-0 top-1/3 h-px bg-[#ff6a00]/30" />
                <div className="absolute inset-x-0 top-2/3 h-px bg-[#ff6a00]/30" />
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 border border-[#ff6a00]/55 rounded-full" />
              </>
            )}
            {!st.realTv.enabled && st.frameGuide === '2.39' && (
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3">
                <div className="absolute left-1/2 top-0 bottom-0 w-px bg-[#ff6a00]/40" />
                <div className="absolute top-1/2 left-0 right-0 h-px bg-[#ff6a00]/40" />
              </div>
            )}

            {st.realTv.enabled && st.realTv.safeGuides && (
              <>
                <div className="absolute inset-[3.5%] border border-dashed border-[#ff6a00]/35" />
                <div className="absolute inset-[5%] border border-dotted border-zinc-300/25" />
              </>
            )}

            {st.realTv.enabled && st.realTv.channelOsd && (
              <div className="absolute top-3 right-4 text-right font-mono tabular-nums text-[11px] tracking-wider text-[#ff8c2e]/90 drop-shadow-[0_1px_4px_rgba(0,0,0,0.95)]">
                <div>CH {String(st.realTv.channelNumber).padStart(2, '0')} · TV</div>
                <div className="text-[10px] text-zinc-300/80">
                  {TV_PROFILE_LABEL[st.realTv.profile]}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Compact Structured 3-Zone Top Rail (28px) */}
      <header
        className={`fixed top-0 inset-x-0 z-20 h-7 flex items-center justify-between gap-4 px-2.5 bg-[#050506]/90 backdrop-blur-sm border-b border-white/10 transition-opacity duration-300 ${
          st.theatreView ? 'opacity-45 hover:opacity-100' : 'opacity-100'
        }`}
      >
        <div className="flex items-center gap-1.5 shrink-0">
          <MicroFractalLogo className="w-3.5 h-3.5 shrink-0" />
          <span className="text-[11px] font-semibold tracking-tight text-zinc-100 whitespace-nowrap shrink-0">
            FractalOS <span className="text-[#ff6a00]">Studio</span>
          </span>
        </div>

        <nav className="flex items-center gap-0.5 p-0.5 rounded bg-[#0c0c10] border border-white/10 text-[10px] font-medium overflow-x-auto fos-scroll max-w-full">
          <button
            type="button"
            onClick={() => brainRef.current.set('mode', 'movie')}
            className={`flex items-center gap-1 px-2 py-0.5 rounded whitespace-nowrap shrink-0 transition-colors ${
              st.mode === 'movie'
                ? 'bg-[#ff6a00] text-[#050506] font-semibold'
                : 'text-zinc-400 hover:text-zinc-100'
            }`}
          >
            <Film className="w-2.5 h-2.5" />
            <span>Cinema (1)</span>
          </button>
          <button
            type="button"
            onClick={() => {
              brainRef.current.set('mode', '3d');
              brainRef.current.setLiquified3d({ enabled: true });
            }}
            className={`flex items-center gap-1 px-2 py-0.5 rounded whitespace-nowrap shrink-0 transition-colors ${
              st.mode === '3d'
                ? 'bg-[#ff6a00] text-[#050506] font-semibold'
                : 'text-zinc-400 hover:text-zinc-100'
            }`}
          >
            <Box className="w-2.5 h-2.5" />
            <span>Liquified 3D (2)</span>
          </button>
          <span className="w-px h-3 bg-white/10 mx-0.5 hidden sm:inline-block" />
          <button
            type="button"
            onClick={() => setStudioOpen((v) => !v)}
            className={`flex items-center gap-1 px-2 py-0.5 rounded whitespace-nowrap shrink-0 transition-colors ${
              studioOpen
                ? 'bg-[#ff6a00]/20 text-[#ff8c2e]'
                : 'text-zinc-400 hover:text-zinc-100'
            }`}
          >
            <Sliders className="w-2.5 h-2.5" />
            <span>Apps (G)</span>
          </button>
          <button
            type="button"
            onClick={() => setCopilotOpen((v) => !v)}
            className={`flex items-center gap-1 px-2 py-0.5 rounded whitespace-nowrap shrink-0 transition-colors ${
              copilotOpen
                ? 'bg-[#ff6a00]/20 text-[#ff8c2e]'
                : 'text-zinc-400 hover:text-zinc-100'
            }`}
          >
            <MessageSquare className="w-2.5 h-2.5" />
            <span>Autopilot (C)</span>
          </button>
        </nav>

        <div className="flex items-center gap-2 shrink-0">
          <span className="hidden lg:inline text-[10px] font-mono tabular-nums text-zinc-400 whitespace-nowrap">
            {st.realTv.enabled ? 'TV' : st.cinema.aspectRatio} · {st.fps.toFixed(0)}fps · 20D
          </span>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1 px-2 py-0.5 rounded bg-[#ff6a00] hover:bg-[#ff8c2e] text-[#050506] text-[10px] font-semibold whitespace-nowrap shrink-0 transition-colors"
          >
            <Upload className="w-2.5 h-2.5" />
            <span>Load</span>
          </button>
        </div>
      </header>

      {st.realFpsMode && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-20 px-2 py-0.5 rounded bg-[#0a0a0d]/85 backdrop-blur-sm border border-[#ff6a00]/40 text-[10px] font-mono tabular-nums text-zinc-200 flex items-center gap-1.5 pointer-events-none">
          <Activity className="w-2.5 h-2.5 text-[#ff6a00]" />
          <span>{st.fps.toFixed(1)} FPS</span>
          <span className="text-zinc-500">·</span>
          <span>{st.frameTimeMs.toFixed(1)} ms</span>
          <span className="text-zinc-500">·</span>
          <span>20D · {st.fusionMatrix.coherencePct}%</span>
          {st.mode === '3d' && (
            <>
              <span className="text-zinc-500">·</span>
              <span className="text-[#ff8c2e]">WASD</span>
            </>
          )}
        </div>
      )}

      {toastMsg && (
        <div className="fixed top-9 right-3 z-40 px-2 py-1 rounded bg-[#111115]/95 border border-[#ff6a00]/50 text-[10px] text-zinc-100 shadow-lg">
          {toastMsg}
        </div>
      )}

      {dragActive && (
        <div className="fixed inset-0 z-50 bg-[#050506]/85 backdrop-blur-sm border-2 border-dashed border-[#ff6a00] flex flex-col items-center justify-center gap-2 pointer-events-none">
          <Upload className="w-6 h-6 text-[#ff6a00]" />
          <p className="text-xs font-semibold text-zinc-100">
            Drop MP4, WebM, or Image into 2.39:1 CinemaScope Projector
          </p>
        </div>
      )}

      <StudioDrawer
        open={studioOpen}
        onClose={() => setStudioOpen(false)}
        state={st}
        apps={snapshot.apps}
        daemons={snapshot.daemons}
        onUpdateGrading={(patch: Partial<ColorGradingState>) =>
          brainRef.current.set('grading', patch)
        }
        onUpdateCinema={(patch: Partial<CinemaModeConfig>) =>
          brainRef.current.set('cinema', patch)
        }
        onUpdateRealTv={(patch: Partial<RealTvModeConfig>) =>
          brainRef.current.set('realTv', patch)
        }
        onUpdateSceneDesigner={(patch: Partial<SceneDesignerConfig>) =>
          brainRef.current.setSceneDesigner(patch)
        }
        onUpdateVideoToCartoon={(patch: Partial<VideoToCartoonConfig>) =>
          brainRef.current.setVideoToCartoon(patch)
        }
        onUpdateFusionMatrix={(patch: Partial<FusionMatrixConfig>) =>
          brainRef.current.setFusionMatrix(patch)
        }
        onUpdateLiquified3d={(patch: Partial<Liquified3dConfig>) =>
          brainRef.current.setLiquified3d(patch)
        }
        onUpdateCynthetocAi={(patch: Partial<CynthetocAiConfig>) =>
          brainRef.current.setCynthetocAi(patch)
        }
        onUpdateStereoscopic={(patch: Partial<Stereoscopic3dConfig>) =>
          brainRef.current.setStereoscopic(patch)
        }
        onUpdateLiquidBrain={(patch: Partial<LiquidBrainConfig>) =>
          brainRef.current.setLiquidBrain(patch)
        }
        onUpdateHolographic={(patch: Partial<HolographicProjectionConfig>) =>
          brainRef.current.setHolographic(patch)
        }
        onProjectHologram={() => {
          brainRef.current.projectHologramFromMainImage();
          engineRef.current?.injectRipple(0.5, 0.5, performance.now() * 0.001);
          showToast('Liquid Glass Hologram projected from main image');
        }}
        onFuseProjectedApps={() => {
          brainRef.current.fuseProjectedApps();
          engineRef.current?.injectRipple(0.5, 0.5, performance.now() * 0.001);
          showToast('Liquid Brain fused projected 3D app shapes');
        }}
        onCynthetocDirect={handleCynthetocDirect}
        onTriggerLiquidPulse={() => {
          brainRef.current.triggerLiquidPulse(1.1);
          engineRef.current?.injectRipple(0.5, 0.5, performance.now() * 0.001);
          showToast('Liquified 3D Pulse injected');
        }}
        onMaximizeSystem={() => {
          const summary = brainRef.current.maximizeSystem();
          showToast(summary[0] || '20 Daemons Maximized');
        }}
        onUpdateState={(patch: Partial<FractalStudioState>) =>
          brainRef.current.set(patch)
        }
        onSetUpscale={setUpscaleTier}
        onCameraPreset={(preset) => engineRef.current?.setCameraPreset(preset)}
        onAddMarker={(label) => {
          const curr = brainRef.current.getSnapshot().state;
          brainRef.current.set('markers', [
            ...curr.markers,
            { id: `m-${Date.now()}`, time: curr.currentTime, label },
          ]);
        }}
        onJumpMarker={seekTo}
        onRemoveMarker={(id) => {
          const curr = brainRef.current.getSnapshot().state;
          brainRef.current.set(
            'markers',
            curr.markers.filter((m) => m.id !== id)
          );
        }}
        onSetAbPoint={(pt) => {
          const curr = brainRef.current.getSnapshot().state;
          if (pt === 'clear') {
            brainRef.current.set('abLoop', { enabled: false, a: null, b: null });
          } else if (pt === 'a') {
            brainRef.current.set('abLoop', {
              ...curr.abLoop,
              a: curr.currentTime,
            });
          } else {
            brainRef.current.set('abLoop', {
              ...curr.abLoop,
              b: curr.currentTime,
              enabled: curr.abLoop.a !== null,
            });
          }
        }}
        onToggleAbLoop={() => {
          const curr = brainRef.current.getSnapshot().state;
          brainRef.current.set('abLoop', {
            ...curr.abLoop,
            enabled: !curr.abLoop.enabled,
          });
        }}
        onCaptureSnapshot={handleCaptureSnapshot}
        onExportHtml={handleExportHtml}
      />

      <GeminiCopilotDrawer
        open={copilotOpen}
        onClose={() => setCopilotOpen(false)}
        getSnapshot={() => brainRef.current.getSnapshot()}
        onCaptureFrame={() => engineRef.current?.captureSnapshotPng() ?? null}
        onApplyCommands={handleApplyAutopilotCommands}
      />

      {/* Compact Structured 2-Row Bottom Console */}
      <footer
        className={`fixed bottom-0 inset-x-0 z-20 px-2.5 py-1 bg-[#050506]/92 backdrop-blur-sm border-t border-white/10 transition-opacity duration-300 ${
          st.theatreView ? 'opacity-40 hover:opacity-100' : 'opacity-100'
        }`}
      >
        <div className="max-w-[1440px] mx-auto space-y-1">
          {/* Band A: Precision Timeline Scrub Rail */}
          <div className="flex items-center gap-2 h-3.5">
            <span className="font-mono tabular-nums text-[10px] text-zinc-300 w-12 shrink-0">
              {formatTimecode(st.currentTime)}
            </span>
            <div className="relative flex-1 flex items-center">
              {st.markers.map((m) => {
                const pct =
                  st.duration > 0
                    ? Math.min(100, Math.max(0, (m.time / st.duration) * 100))
                    : 0;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => seekTo(m.time)}
                    title={`${m.label} (${formatTimecode(m.time)})`}
                    style={{ left: `${pct}%` }}
                    className="absolute -top-1 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#ff6a00] hover:scale-150 transition-transform z-10"
                  />
                );
              })}
              <input
                type="range"
                aria-label="Timeline seek"
                className="fos-slider w-full"
                min={0}
                max={Math.max(1, st.duration)}
                step={0.1}
                value={Math.min(st.duration || 1, st.currentTime)}
                onChange={(e) => seekTo(parseFloat(e.target.value))}
              />
            </div>
            <span className="font-mono tabular-nums text-[10px] text-zinc-500 w-12 text-right shrink-0">
              {formatTimecode(st.duration)}
            </span>
            <span className="hidden md:inline text-[10px] text-zinc-500 truncate max-w-[140px] border-l border-white/10 pl-2">
              {st.mediaSourceName}
            </span>
            {st.mediaType !== 'procedural' && (
              <button
                type="button"
                onClick={resetToProceduralStream}
                className="text-[10px] text-[#ff8c2e] hover:underline whitespace-nowrap shrink-0"
              >
                Scope
              </button>
            )}
          </div>

          {/* Band B: Structured Control Groups (Transport | Optics | Stage & Modes) */}
          <div className="flex items-center justify-between gap-2 overflow-x-auto fos-scroll">
            {/* Group 1: Transport */}
            <div className="flex items-center gap-1 shrink-0">
              <span className="hidden xl:inline text-[9px] font-medium text-zinc-500 mr-0.5">
                Transport
              </span>
              <button
                type="button"
                onClick={togglePlay}
                className="flex items-center gap-1 px-2 py-0.5 rounded bg-[#ff6a00] hover:bg-[#ff8c2e] text-[#050506] text-[10px] font-semibold whitespace-nowrap shrink-0 transition-colors"
                title="Play / Pause (Space)"
              >
                {st.playing ? <Pause className="w-2.5 h-2.5" /> : <Play className="w-2.5 h-2.5" />}
                <span>{st.playing ? 'Pause' : 'Play'}</span>
              </button>
              <button
                type="button"
                onClick={toggleMute}
                className="p-1 rounded bg-[#111115] border border-white/10 text-zinc-300 hover:text-zinc-100 transition-colors"
                aria-label={st.muted ? 'Unmute' : 'Mute'}
                title={st.muted ? 'Unmute' : 'Mute'}
              >
                {st.muted ? <VolumeX className="w-2.5 h-2.5" /> : <Volume2 className="w-2.5 h-2.5" />}
              </button>
              <button
                type="button"
                onClick={toggleLoop}
                className={`p-1 rounded border transition-colors ${
                  st.loop
                    ? 'bg-[#ff6a00]/18 border-[#ff6a00]/60 text-[#ff8c2e]'
                    : 'bg-[#111115] border-white/10 text-zinc-400'
                }`}
                aria-label="Toggle Loop"
                title="Loop playback"
              >
                <Repeat className="w-2.5 h-2.5" />
              </button>
            </div>

            <div className="w-px h-3.5 bg-white/10 shrink-0" />

            {/* Group 2: Optics & Resolution */}
            <div className="flex items-center gap-1 shrink-0">
              <span className="hidden xl:inline text-[9px] font-medium text-zinc-500 mr-0.5">
                Optics
              </span>
              <button
                type="button"
                onClick={() => brainRef.current.set('subtractMode', !st.subtractMode)}
                className={`px-1.5 py-0.5 rounded text-[10px] font-medium border whitespace-nowrap shrink-0 transition-colors ${
                  st.subtractMode
                    ? 'bg-[#ff6a00] border-[#ff6a00] text-[#050506] font-semibold'
                    : 'bg-[#111115] border-white/10 text-zinc-300 hover:border-white/25'
                }`}
                title="Toggle Stream vs Subtract (S)"
              >
                {st.subtractMode ? 'Sub (S)' : 'Stream (S)'}
              </button>
              <button
                type="button"
                onClick={() =>
                  brainRef.current.set('anamorphicSqueeze', !st.anamorphicSqueeze)
                }
                className={`px-1.5 py-0.5 rounded text-[10px] font-medium border whitespace-nowrap shrink-0 transition-colors ${
                  st.anamorphicSqueeze
                    ? 'bg-[#ff6a00]/18 border-[#ff6a00] text-[#ff8c2e]'
                    : 'bg-[#111115] border-white/10 text-zinc-300 hover:border-white/25'
                }`}
                title="Toggle 2.39x Anamorphic Squeeze (L)"
              >
                2.39x (L)
              </button>
              <button
                type="button"
                onClick={cycleUpscaleTier}
                className={`px-1.5 py-0.5 rounded text-[10px] font-medium border whitespace-nowrap shrink-0 transition-colors ${
                  st.upscaleMode !== 'off'
                    ? 'bg-[#ff6a00]/18 border-[#ff6a00] text-[#ff8c2e]'
                    : 'bg-[#111115] border-white/10 text-zinc-300 hover:border-white/25'
                }`}
                title="Cycle Liquid 8K / 16K / 64K (K)"
              >
                {st.upscaleMode === 'off'
                  ? 'Liquid (K)'
                  : `${st.upscaleMode.toUpperCase()} (K)`}
              </button>
            </div>

            <div className="w-px h-3.5 bg-white/10 shrink-0" />

            {/* Group 3: Stage & Intelligent Modes */}
            <div className="flex items-center gap-1 shrink-0">
              <span className="hidden xl:inline text-[9px] font-medium text-zinc-500 mr-0.5">
                Stage
              </span>
              <button
                type="button"
                onClick={() => {
                  const nextMode = st.mode === '3d' ? 'movie' : '3d';
                  brainRef.current.set('mode', nextMode);
                  if (nextMode === '3d') {
                    brainRef.current.setLiquified3d({ enabled: true });
                    brainRef.current.triggerLiquidPulse(0.95);
                  }
                }}
                className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium border whitespace-nowrap shrink-0 transition-colors ${
                  st.mode === '3d'
                    ? 'bg-[#ff6a00] border-[#ff6a00] text-[#050506] font-semibold'
                    : 'bg-[#111115] border-white/10 text-zinc-300 hover:border-white/25'
                }`}
                title="Toggle Liquified 3D Studio (2)"
              >
                <Droplets className="w-2.5 h-2.5" />
                <span>3D Liquid</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  const nextHolo = !st.holographic.enabled;
                  if (nextHolo) {
                    brainRef.current.projectHologramFromMainImage();
                    engineRef.current?.injectRipple(0.5, 0.5, performance.now() * 0.001);
                    showToast(`Liquid Glass Hologram: ${st.holographic.rigMode}`);
                  } else {
                    brainRef.current.setHolographic({ enabled: false });
                    showToast('Holographic Projection: OFF');
                  }
                }}
                className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium border whitespace-nowrap shrink-0 transition-colors ${
                  st.holographic.enabled
                    ? 'bg-[#ff6a00] border-[#ff6a00] text-[#050506] font-semibold'
                    : 'bg-[#111115] border-white/10 text-zinc-300 hover:border-white/25'
                }`}
                title="Toggle Liquid Glass Main-Image Hologram Projection (H, Shift+H cycles rig)"
              >
                <Hexagon className="w-2.5 h-2.5" />
                <span>Holo (H)</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  const nextStereo = !st.stereoscopic.enabled;
                  brainRef.current.setStereoscopic({ enabled: nextStereo });
                  showToast(
                    nextStereo ? `Stereoscopic 3D: ${st.stereoscopic.mode}` : 'Stereoscopic 3D: OFF'
                  );
                }}
                className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium border whitespace-nowrap shrink-0 transition-colors ${
                  st.stereoscopic.enabled
                    ? 'bg-[#ff6a00] border-[#ff6a00] text-[#050506] font-semibold'
                    : 'bg-[#111115] border-white/10 text-zinc-300 hover:border-white/25'
                }`}
                title="Toggle Analog Stereoscopic 3D Separation (Y, Shift+Y cycles mode)"
              >
                <Eye className="w-2.5 h-2.5" />
                <span>Stereo (Y)</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  const nextCyn = !st.cynthetocAi.enabled;
                  brainRef.current.setCynthetocAi({ enabled: nextCyn });
                }}
                className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium border whitespace-nowrap shrink-0 transition-colors ${
                  st.cynthetocAi.enabled
                    ? 'bg-[#ff6a00] border-[#ff6a00] text-[#050506] font-semibold'
                    : 'bg-[#111115] border-white/10 text-zinc-300 hover:border-white/25'
                }`}
                title="Toggle Cynthetoc AI Neural Synthesis & Relight (Z)"
              >
                <Brain className="w-2.5 h-2.5" />
                <span>Cynthetoc (Z)</span>
              </button>
              <button
                type="button"
                onClick={() =>
                  brainRef.current.setVideoToCartoon({
                    enabled: !st.videoToCartoon.enabled,
                  })
                }
                className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium border whitespace-nowrap shrink-0 transition-colors ${
                  st.videoToCartoon.enabled
                    ? 'bg-[#ff6a00] border-[#ff6a00] text-[#050506] font-semibold'
                    : 'bg-[#111115] border-white/10 text-zinc-300 hover:border-white/25'
                }`}
                title="Toggle Intelligent Video to Cartoon (X)"
              >
                <Sparkles className="w-2.5 h-2.5" />
                <span>Toon (X)</span>
              </button>
              <button
                type="button"
                onClick={() => brainRef.current.setRealTvMode(!st.realTv.enabled)}
                className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium border whitespace-nowrap shrink-0 transition-colors ${
                  st.realTv.enabled
                    ? 'bg-[#ff6a00] border-[#ff6a00] text-[#050506] font-semibold'
                    : 'bg-[#111115] border-white/10 text-zinc-300 hover:border-white/25'
                }`}
                title="Toggle Real TV Mode (V)"
              >
                <Tv className="w-2.5 h-2.5" />
                <span>TV (V)</span>
              </button>
              <button
                type="button"
                onClick={() => brainRef.current.setTheatreView(!st.theatreView)}
                className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium border whitespace-nowrap shrink-0 transition-colors ${
                  st.theatreView
                    ? 'bg-[#ff6a00] border-[#ff6a00] text-[#050506] font-semibold'
                    : 'bg-[#111115] border-white/10 text-zinc-300 hover:border-white/25'
                }`}
                title="Toggle Theatre View (T)"
              >
                <Maximize2 className="w-2.5 h-2.5" />
                <span>Theatre (T)</span>
              </button>
              <button
                type="button"
                onClick={() => brainRef.current.setRealFpsMode(!st.realFpsMode)}
                className={`px-1.5 py-0.5 rounded text-[10px] font-medium border whitespace-nowrap shrink-0 transition-colors ${
                  st.realFpsMode
                    ? 'bg-[#ff6a00] border-[#ff6a00] text-[#050506] font-semibold'
                    : 'bg-[#111115] border-white/10 text-zinc-300 hover:border-white/25'
                }`}
                title="Toggle Real FPS & 3D Traversal (F)"
              >
                FPS (F)
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
