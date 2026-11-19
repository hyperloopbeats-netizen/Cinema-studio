import React, { useEffect, useRef, useState } from 'react';
import { Send, Trash2, Camera, Cpu, Zap } from 'lucide-react';
import type { FractalBrainSnapshot, StudioCommandPayload } from '../core/fractalBrain';

export type GeminiModelChoice =
  | 'gemini-4-hydrogen'
  | 'gemini-3.1-flash-lite'
  | 'gemini-4-carbon'
  | 'gemini-4-neon';

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  model?: string;
  thinkingLevel?: string;
  thoughts?: string;
  appliedActions?: string[];
  error?: boolean;
}

const ROLE_PRESETS = [
  {
    id: 'colorist',
    label: 'Abby CIO & Cynthetoc Director',
    instruction:
      'You are Abby Video CIO, Cynthetoc AI & the FractalOS CinemaScope Director. Use apply_studio_commands to orchestrate Abby Automatic Video CIO (abbyCio), Kinetic Prism Harmonizer (kineticHarmonizer), Stereoscopic 3D separation (stereoscopic), Liquid Brain 3D App-Shape projection/fusion/morphing (liquidBrain), Cynthetoc AI (cynthetocAi), Liquified 3D Studio, Intelligent Scene Designer, Intelligent Video to Cartoon, Cinema Mode, Real TV Mode, and LUT grading.',
  },
  {
    id: 'architect',
    label: 'High-Thinking Liquid Brain Architect',
    instruction:
      'You are the principal Liquid Brain & Stereoscopic 3D Architect governing 27 fused modules and 40+ Sovereign Daemons (3.0x Overdrive). Reason deeply about Abby Video CIO autonomous adaptation, Kinetic Prism Harmonizer spectral synthesis, analog 3D separation, projecting & fusing apps onto 3D shapes, 9x cones, and Liquid 64K upscaling.',
  },
  {
    id: 'toonArtist',
    label: 'Cartoon & Cel Shading Artist',
    instruction:
      'You are a lead cel-animation and graphic-novel shader artist. Use Intelligent Video to Cartoon (celAnime, noirInk, popComic, microFractalToon) fused with Abby Video CIO, Kinetic Prism Harmonizer, Liquid Brain 3D shapes, Stereoscopic 3D, Cynthetoc AI, and Liquid sharpening.',
  },
];

const MODEL_OPTIONS: Array<{
  id: GeminiModelChoice;
  label: string;
  note: string;
}> = [
  { id: 'gemini-4-hydrogen', label: 'gemini-4-hydrogen', note: 'General' },
  { id: 'gemini-3.1-flash-lite', label: 'gemini-3.1-flash-lite', note: 'Fast' },
  { id: 'gemini-4-carbon', label: 'gemini-4-carbon', note: 'High Thinking' },
  { id: 'gemini-4-neon', label: 'gemini-4-neon', note: 'Complex' },
];

const QUICK_PROMPTS = [
  'Switch Abby Video CIO to Holo Prism & activate Kinetic Prism Harmonizer Golden Aura',
  'Enable Smart Morph Golden Spiral expansion & have Daemon Queen seed a new daemon',
  'Project Liquid Glass Pepper\'s Ghost Hologram from the main image with 12 slices',
  'Maximize all 27 modules, 40+ Sovereign Daemons & Liquid 64K',
];

interface GeminiCopilotPanelProps {
  getSnapshot: () => FractalBrainSnapshot;
  onCaptureFrame: () => string | null;
  onApplyCommands: (commands: StudioCommandPayload[]) => string[];
}

export const GeminiCopilotPanel: React.FC<GeminiCopilotPanelProps> = ({
  getSnapshot,
  onCaptureFrame,
  onApplyCommands,
}) => {
  const [model, setModel] = useState<GeminiModelChoice>('gemini-4-hydrogen');
  const [roleId, setRoleId] = useState<string>('colorist');
  const [autopilot, setAutopilot] = useState(true);
  const [includeFrame, setIncludeFrame] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      model: 'gemini-4-hydrogen',
      text: 'Abby Video CIO, Kinetic Prism Harmonizer, Cynthetoc AI, Smart Morph & Daemon Queen connected across all 27 fused modules & 40+ daemons.',
    },
  ]);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const activeRole = ROLE_PRESETS.find((r) => r.id === roleId) || ROLE_PRESETS[0];

  const sendPrompt = async (promptText: string) => {
    const trimmed = promptText.trim();
    if (!trimmed || loading) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      text: trimmed,
    };

    const nextHistory = messages
      .filter((m) => !m.error && m.id !== 'welcome')
      .map((m) => ({ role: m.role, text: m.text }));

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const snap = getSnapshot();
      const studioContext = JSON.stringify({
        mode: snap.state.mode,
        playing: snap.state.playing,
        anamorphicSqueeze: snap.state.anamorphicSqueeze,
        subtractMode: snap.state.subtractMode,
        upscaleMode: snap.state.upscaleMode,
        theatreView: snap.state.theatreView,
        realFpsMode: snap.state.realFpsMode,
        fps: snap.state.fps,
        grading: snap.state.grading,
        cinema: snap.state.cinema,
        realTv: snap.state.realTv,
        sceneDesigner: snap.state.sceneDesigner,
        videoToCartoon: snap.state.videoToCartoon,
        fusionMatrix: snap.state.fusionMatrix,
        liquified3d: snap.state.liquified3d,
        cynthetocAi: snap.state.cynthetocAi,
        stereoscopic: snap.state.stereoscopic,
        liquidBrain: snap.state.liquidBrain,
        holographic: snap.state.holographic,
        smartMorph: snap.state.smartMorph,
        abbyCio: snap.state.abbyCio,
        kineticHarmonizer: snap.state.kineticHarmonizer,
        daemonQueen: snap.state.daemonQueen,
        stage3d: snap.state.stage3d,
        fusedModules: snap.apps.length,
        activeDaemons: snap.daemons.length,
      });

      const frameDataUrl = includeFrame ? onCaptureFrame() ?? undefined : undefined;

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model,
          systemInstruction: activeRole.instruction,
          history: nextHistory,
          message: trimmed,
          thinkingLevel: model === 'gemini-4-carbon' ? 'HIGH' : undefined,
          studioContext,
          frameDataUrl,
          autopilot,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setMessages((prev) => [
          ...prev,
          {
            id: `err-${Date.now()}`,
            role: 'model',
            text: data.error || `Request failed (${res.status})`,
            error: true,
          },
        ]);
      } else {
        let appliedActions: string[] = [];
        if (autopilot && Array.isArray(data.commands) && data.commands.length > 0) {
          appliedActions = onApplyCommands(data.commands as StudioCommandPayload[]);
        }

        setMessages((prev) => [
          ...prev,
          {
            id: `m-${Date.now()}`,
            role: 'model',
            text: data.text || 'Commands executed.',
            model: data.model,
            thinkingLevel: data.thinkingLevel,
            thoughts: data.thoughts,
            appliedActions: appliedActions.length > 0 ? appliedActions : undefined,
          },
        ]);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Network error calling Gemini Copilot';
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: 'model',
          text: msg,
          error: true,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const runCynthetocAutoDirect = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const snap = getSnapshot();
      const frameDataUrl = onCaptureFrame() ?? undefined;
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
        smartMorph: snap.state.smartMorph,
        abbyCio: snap.state.abbyCio,
        kineticHarmonizer: snap.state.kineticHarmonizer,
        daemonQueen: snap.state.daemonQueen,
        stage3d: snap.state.stage3d,
      });
      const res = await fetch('/api/cynthetoc/direct', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model,
          intent: 'Analyze live frame and direct cohesive 3x upgrade across Cinema, Liquified 3D, and Cynthetoc AI',
          studioContext,
          frameDataUrl,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessages((prev) => [
          ...prev,
          {
            id: `err-${Date.now()}`,
            role: 'model',
            text: data.error || `Cynthetoc direct failed (${res.status})`,
            error: true,
          },
        ]);
      } else {
        const applied =
          Array.isArray(data.commands) && data.commands.length > 0
            ? onApplyCommands(data.commands as StudioCommandPayload[])
            : [];
        setMessages((prev) => [
          ...prev,
          {
            id: `m-${Date.now()}`,
            role: 'model',
            text: data.text || 'Cynthetoc AI directive applied.',
            model: data.model,
            appliedActions: applied.length > 0 ? applied : undefined,
          },
        ]);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Network error calling Cynthetoc Direct';
      setMessages((prev) => [
        ...prev,
        { id: `err-${Date.now()}`, role: 'model', text: msg, error: true },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendPrompt(input);
  };

  return (
    <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
      <div className="flex items-center justify-between px-3 py-1.5 border-b border-white/10 bg-[#070709] shrink-0">
        <div className="flex items-center gap-1.5 text-[11px] font-mono tabular-nums text-zinc-400">
          <Cpu className="w-3 h-3 text-[#ff6a00]" />
          <span>{model === 'gemini-4-carbon' ? 'High Thinking' : 'Live Autopilot'}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setAutopilot((v) => !v)}
            className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold whitespace-nowrap shrink-0 transition-colors ${
              autopilot
                ? 'bg-[#ff6a00] text-[#050506]'
                : 'bg-[#141419] border border-white/10 text-zinc-400'
            }`}
            title="Toggle Autopilot live command execution"
          >
            <Zap className="w-2.5 h-2.5" />
            <span>{autopilot ? 'Auto On' : 'Auto Off'}</span>
          </button>
          <button
            type="button"
            onClick={() =>
              setMessages([
                {
                  id: 'welcome',
                  role: 'model',
                  model,
                  text: 'Thread cleared. Prompt Abby Video CIO, Kinetic Prism, Cynthetoc AI, Scene Designer, or 40+ Daemons.',
                },
              ])
            }
            className="p-1 rounded text-zinc-400 hover:text-zinc-100 hover:bg-white/5 transition-colors"
            aria-label="Clear conversation"
            title="Clear conversation"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>

      <div className="p-2.5 border-b border-white/10 bg-[#08080a] space-y-2 shrink-0">
        <div className="grid grid-cols-2 gap-1.5">
          <label className="block space-y-1">
            <span className="block text-[10px] text-zinc-400">Role</span>
            <select
              value={roleId}
              onChange={(e) => setRoleId(e.target.value)}
              className="w-full bg-[#121216] border border-white/10 rounded px-2 py-1 text-[11px] text-zinc-100 focus:outline-none focus:border-[#ff6a00]"
            >
              {ROLE_PRESETS.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.label}
                </option>
              ))}
            </select>
          </label>
          <label className="block space-y-1">
            <span className="block text-[10px] text-zinc-400">Model</span>
            <select
              value={model}
              onChange={(e) => setModel(e.target.value as GeminiModelChoice)}
              className="w-full bg-[#121216] border border-white/10 rounded px-2 py-1 text-[11px] text-zinc-100 focus:outline-none focus:border-[#ff6a00]"
            >
              {MODEL_OPTIONS.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.label} ({m.note})
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="flex flex-col gap-1 pt-0.5">
          <button
            type="button"
            disabled={loading}
            onClick={runCynthetocAutoDirect}
            className="w-full text-center text-[10.5px] font-semibold px-2 py-1 rounded bg-[#ff6a00] hover:bg-[#ff8c2e] text-[#050506] whitespace-nowrap transition-colors disabled:opacity-50"
          >
            Auto-Direct Live Frame
          </button>
          <div className="grid grid-cols-1 gap-1">
            {QUICK_PROMPTS.map((qp, idx) => (
              <button
                key={idx}
                type="button"
                disabled={loading}
                onClick={() => sendPrompt(qp)}
                className="text-left text-[10px] px-2 py-1 rounded bg-[#121216] border border-white/8 text-zinc-300 hover:border-[#ff6a00]/60 hover:text-[#ff8c2e] transition-colors truncate"
              >
                {qp}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto fos-scroll p-3.5 space-y-3">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${
              msg.role === 'user' ? 'items-end' : 'items-start'
            }`}
          >
            <div
              className={`max-w-[92%] rounded-lg px-3 py-2 text-xs leading-relaxed whitespace-pre-wrap ${
                msg.role === 'user'
                  ? 'bg-[#ff6a00] text-[#050506] font-medium'
                  : msg.error
                  ? 'bg-red-950/50 border border-red-500/40 text-red-200'
                  : 'bg-[#141419] border border-white/8 text-zinc-200'
              }`}
            >
              {msg.thoughts && (
                <details className="mb-2 pb-1.5 border-b border-white/10 text-[11px] text-zinc-400">
                  <summary className="cursor-pointer text-[#ff8c2e] select-none">
                    Reasoning trace
                  </summary>
                  <div className="mt-1 whitespace-pre-wrap">{msg.thoughts}</div>
                </details>
              )}
              {msg.text}
              {msg.appliedActions && msg.appliedActions.length > 0 && (
                <div className="mt-2 pt-1.5 border-t border-white/10 text-[11px] font-mono text-[#ff8c2e]">
                  Applied: {msg.appliedActions.join(' · ')}
                </div>
              )}
            </div>
            {msg.role === 'model' && msg.model && !msg.error && (
              <span className="mt-1 text-[10px] font-mono text-zinc-500">
                {msg.model}
                {msg.thinkingLevel && msg.thinkingLevel !== 'AUTO'
                  ? ` · Thinking ${msg.thinkingLevel}`
                  : ''}
              </span>
            )}
          </div>
        ))}
        {loading && (
          <div className="text-xs text-[#ff8c2e] font-mono">
            {model === 'gemini-4-carbon'
              ? 'Autopilot reasoning at ThinkingLevel.HIGH...'
              : 'Executing Autopilot prompt...'}
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="p-3 border-t border-white/10 bg-[#08080a] space-y-2 shrink-0">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => setIncludeFrame((v) => !v)}
            className={`flex items-center gap-1.5 px-2 py-1 rounded text-[11px] border transition-colors ${
              includeFrame
                ? 'bg-[#ff6a00]/18 border-[#ff6a00] text-[#ff8c2e]'
                : 'bg-[#121216] border-white/10 text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Camera className="w-3 h-3" />
            <span>{includeFrame ? 'Attach current frame: On' : 'Attach current frame'}</span>
          </button>
          <span className="text-[11px] font-mono text-zinc-500">
            {messages.length - 1} turns
          </span>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Command Abby, Cynthetoc, Prism, or 40 Daemons..."
            className="flex-1 min-w-0 bg-[#121216] border border-white/10 rounded-lg px-3 py-2 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-[#ff6a00]"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="p-2 rounded-lg bg-[#ff6a00] text-[#050506] disabled:opacity-40 hover:bg-[#ff8c2e] transition-colors shrink-0"
            aria-label="Send message"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};
