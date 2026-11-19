import dotenv from "dotenv";
import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import {
  GoogleGenAI,
  ThinkingLevel,
  Type,
  type FunctionDeclaration,
} from "@google/genai";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;
const ALLOWED_MODELS = new Set([
  "gemini-4-hydrogen",
  "gemini-3.1-flash-lite",
  "gemini-4-carbon",
  "gemini-4-neon",
]);

interface ChatTurn {
  role: "user" | "model";
  text: string;
}

interface ChatRequestBody {
  model?: string;
  systemInstruction?: string;
  history?: ChatTurn[];
  message?: string;
  thinkingLevel?: "HIGH" | "MEDIUM" | "LOW" | "MINIMAL";
  studioContext?: string;
  frameDataUrl?: string;
  autopilot?: boolean;
}

const applyStudioCommandsDeclaration: FunctionDeclaration = {
  name: "apply_studio_commands",
  description:
    "Apply live commands across FractalOS CinemaScope Studio, including Cinema Mode, Real TV Mode, Intelligent Scene Designer, Intelligent Video to Cartoon, Intelligent Fusion Matrix, 20 Sovereign Daemons maximization, Color Grading/LUT, Liquid Upscaler, 3D Stage, and Timeline.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      mode: {
        type: Type.STRING,
        description: "Primary viewport mode: 'movie' (Cinema Mode) or '3d' (3D Auditorium Stage).",
      },
      playing: {
        type: Type.BOOLEAN,
        description: "Set playback state: true to play, false to pause.",
      },
      muted: {
        type: Type.BOOLEAN,
        description: "Mute or unmute audio.",
      },
      loop: {
        type: Type.BOOLEAN,
        description: "Enable or disable continuous playback loop.",
      },
      subtractMode: {
        type: Type.BOOLEAN,
        description: "Enable or disable optical Subtract difference/inversion mode.",
      },
      anamorphicSqueeze: {
        type: Type.BOOLEAN,
        description: "Enable or disable 2.39x anamorphic CinemaScope framing.",
      },
      anamorphicFlare: {
        type: Type.NUMBER,
        description: "Horizontal anamorphic flare intensity from 0.0 to 1.0.",
      },
      upscaleMode: {
        type: Type.STRING,
        description: "Liquid Upscale tier: 'off', '8k', '16k', or '64k'.",
      },
      theatreView: {
        type: Type.BOOLEAN,
        description: "Dim room surround with velvet curtain masking & cinema bounce light.",
      },
      realFpsMode: {
        type: Type.BOOLEAN,
        description: "Show real-time FPS/frameTime telemetry and enable 3D WASD traversal.",
      },
      frameGuide: {
        type: Type.STRING,
        description: "Scope frame guide overlay: 'off', '2.39', '2.35', or 'thirds'.",
      },
      resetGrading: {
        type: Type.BOOLEAN,
        description: "Reset color grading sliders and LUT to neutral defaults before applying any new values.",
      },
      maximizeSystem: {
        type: Type.BOOLEAN,
        description: "Maximize all 20 Sovereign Daemons and set Intelligent Fusion Matrix to 100% coherence.",
      },
      grading: {
        type: Type.OBJECT,
        description: "Color grading parameters.",
        properties: {
          lut: {
            type: Type.STRING,
            description: "LUT preset: 'neutral', 'kodak2383', 'tealAmber', 'bleachBypass', or 'noirSilver'.",
          },
          exposure: { type: Type.NUMBER, description: "Exposure EV from -2.0 to +2.0." },
          contrast: { type: Type.NUMBER, description: "Contrast multiplier from 0.5 to 1.8." },
          saturation: { type: Type.NUMBER, description: "Saturation multiplier from 0.0 to 2.0." },
          temperature: { type: Type.NUMBER, description: "Color temperature shift from -1.0 to +1.0." },
          tint: { type: Type.NUMBER, description: "Green/magenta tint from -1.0 to +1.0." },
          highlightRolloff: { type: Type.NUMBER, description: "Filmic highlight roll-off from 0.0 to 1.0." },
        },
      },
      cinema: {
        type: Type.OBJECT,
        description: "Cinema Mode optical settings.",
        properties: {
          aspectRatio: {
            type: Type.STRING,
            description: "Cinema aspect ratio: '2.39', '2.35', '1.85', '16:9', or '4:3'.",
          },
          filmGrain: { type: Type.NUMBER, description: "35mm organic film grain from 0.0 to 1.0." },
          halation: { type: Type.NUMBER, description: "Optical warm halation bloom from 0.0 to 1.0." },
          gateWeave: { type: Type.NUMBER, description: "Film gate weave & vignette from 0.0 to 1.0." },
          cadence24p: { type: Type.BOOLEAN, description: "Enable 24p cinema shutter cadence." },
        },
      },
      realTv: {
        type: Type.OBJECT,
        description: "Real TV Mode broadcast & CRT/OLED television emulation settings.",
        properties: {
          enabled: { type: Type.BOOLEAN, description: "Enable or disable Real TV Mode." },
          profile: {
            type: Type.STRING,
            description: "Television hardware profile: 'crt', 'trinitron', 'oled', or 'vhs'.",
          },
          scanlines: { type: Type.NUMBER, description: "Scanline & phosphor grille intensity from 0.0 to 1.0." },
          curvature: { type: Type.NUMBER, description: "CRT glass barrel curvature from 0.0 to 1.0." },
          chromaBleed: { type: Type.NUMBER, description: "NTSC/PAL horizontal chroma bleed from 0.0 to 1.0." },
          phosphorBloom: { type: Type.NUMBER, description: "Phosphor persistence & bloom from 0.0 to 1.0." },
          channelOsd: { type: Type.BOOLEAN, description: "Show broadcast channel OSD corner badge." },
          safeGuides: { type: Type.BOOLEAN, description: "Show 93% action-safe and 90% title-safe broadcast guides." },
          channelNumber: { type: Type.NUMBER, description: "Broadcast channel number from 1 to 99." },
        },
      },
      sceneDesigner: {
        type: Type.OBJECT,
        description: "Intelligent Scene Designer procedural architecture & atmospheric lighting.",
        properties: {
          theme: {
            type: Type.STRING,
            description: "Scene theme: 'obsidianAmber', 'solarReactor', 'neonBroadcast', 'emeraldMatrix', or 'crimsonNoir'.",
          },
          fractalComplexity: { type: Type.NUMBER, description: "Number of microfractal rings from 2 to 8." },
          gridDepth: { type: Type.NUMBER, description: "Perspective horizon grid intensity from 0.0 to 1.0." },
          sweepIntensity: { type: Type.NUMBER, description: "Anamorphic sweep intensity from 0.0 to 1.0." },
          atmosphereBlend: { type: Type.NUMBER, description: "Atmospheric tint blend over media from 0.0 to 1.0." },
          motionSpeed: { type: Type.NUMBER, description: "Scene motion speed multiplier from 0.2 to 2.5." },
        },
      },
      videoToCartoon: {
        type: Type.OBJECT,
        description: "Intelligent Video to Cartoon real-time GPU cel-shading & ink outlines.",
        properties: {
          enabled: { type: Type.BOOLEAN, description: "Enable or disable Video to Cartoon pipeline." },
          style: {
            type: Type.STRING,
            description: "Cartoon style: 'celAnime', 'noirInk', 'popComic', or 'microFractalToon'.",
          },
          quantizeLevels: { type: Type.NUMBER, description: "Cel shading quantization bands from 2 to 10." },
          edgeStrength: { type: Type.NUMBER, description: "Sobel ink edge strength from 0.0 to 1.0." },
          inkThickness: { type: Type.NUMBER, description: "Ink outline thickness from 0.5 to 3.0." },
          colorBoost: { type: Type.NUMBER, description: "Cartoon vibrancy boost from 0.5 to 2.0." },
          halftone: { type: Type.NUMBER, description: "Shadow comic halftone dot intensity from 0.0 to 1.0." },
        },
      },
      fusionMatrix: {
        type: Type.OBJECT,
        description: "Intelligent Fusion Matrix cross-app synergy and 20-daemon governor.",
        properties: {
          enabled: { type: Type.BOOLEAN, description: "Enable or disable cross-app Fusion Matrix." },
          autoMaximize: { type: Type.BOOLEAN, description: "Enable automatic daemon sustain & maximization." },
          synergyGain: { type: Type.NUMBER, description: "Cross-app synergy gain from 0.0 to 2.0." },
          pulseDepth: { type: Type.NUMBER, description: "Thermal modulation depth from 0.0 to 1.0." },
          links: {
            type: Type.OBJECT,
            properties: {
              sceneToCones: { type: Type.BOOLEAN },
              cartoonToLiquid: { type: Type.BOOLEAN },
              cspToOptics: { type: Type.BOOLEAN },
              tvToPhosphor: { type: Type.BOOLEAN },
              autopilotToAll: { type: Type.BOOLEAN },
            },
          },
        },
      },
      liquified3d: {
        type: Type.OBJECT,
        description: "Liquified 3D Studio volumetric ferrofluid/chrome meshes, reflective liquid floor, and optical refraction.",
        properties: {
          enabled: { type: Type.BOOLEAN, description: "Enable or disable Liquified 3D Studio effects." },
          fluidPreset: {
            type: Type.STRING,
            description: "Fluid material preset: 'mercuryChrome', 'moltenAmber', 'ferrofluidObsidian', 'iridescentPlasma', or 'liquidGlass'.",
          },
          viscosity: { type: Type.NUMBER, description: "Fluid wave viscosity from 0.1 to 1.0." },
          refraction: { type: Type.NUMBER, description: "Optical liquid refraction & dispersion from 0.0 to 1.0." },
          chromeFresnel: { type: Type.NUMBER, description: "Metallic Fresnel reflection intensity from 0.0 to 1.0." },
          rippleForce: { type: Type.NUMBER, description: "Interactive fluid ripple amplitude from 0.0 to 1.0." },
          liquidScreenOptical: { type: Type.BOOLEAN, description: "Apply optical liquid wave refraction directly across the CinemaScope projection screen." },
          solidGeometry: { type: Type.BOOLEAN, description: "Render solid lit 3D liquid meshes (floor basin, ferrofluid orb, cones)." },
          autoOrbit: { type: Type.BOOLEAN, description: "Enable smooth automatic 3D camera orbit." },
        },
      },
      cynthetocAi: {
        type: Type.OBJECT,
        description: "Cynthetoc AI synthetic neural reillumination, anisotropic edge supersampling & autonomous frame director.",
        properties: {
          enabled: { type: Type.BOOLEAN, description: "Enable or disable Cynthetoc AI." },
          mode: {
            type: Type.STRING,
            description: "Cynthetoc mode: 'adaptiveDirector', 'neuralSupersample', 'syntheticRelight', or 'kineticPulse'.",
          },
          autonomy: { type: Type.NUMBER, description: "Autonomy depth from 0.0 to 1.0." },
          synthesisStrength: { type: Type.NUMBER, description: "Neural synthesis intensity from 0.0 to 1.0." },
          neuralDenoise: { type: Type.NUMBER, description: "Edge-preserving neural denoise from 0.0 to 1.0." },
          relightIntensity: { type: Type.NUMBER, description: "Synthetic 3-point rim relighting from 0.0 to 1.0." },
          kineticSync: { type: Type.BOOLEAN, description: "Sync kinetic pulses across 3D cones and fluid stage." },
          lastDirective: { type: Type.STRING, description: "Short summary label for the applied Cynthetoc directive." },
        },
      },
      stereoscopic: {
        type: Type.OBJECT,
        description: "Stereoscopic 3D Separation Engine for analog 3D optical synthesis.",
        properties: {
          enabled: { type: Type.BOOLEAN, description: "Enable or disable Stereoscopic 3D separation." },
          mode: {
            type: Type.STRING,
            description: "Analog 3D synthesis mode: 'anaglyphRedCyan', 'amberBlueColorCode', 'pulfrichAnalog', 'sideBySide', or 'interlacedField'.",
          },
          interaxial: { type: Type.NUMBER, description: "Eye separation baseline from 0.0 to 1.0." },
          convergence: { type: Type.NUMBER, description: "Zero-parallax focal plane shift from -1.0 to 1.0." },
          analogCrosstalk: { type: Type.NUMBER, description: "Analog optical crosstalk/bleed from 0.0 to 0.4." },
          depthSynthesis: { type: Type.NUMBER, description: "Depth parallax synthesis intensity from 0.0 to 1.0." },
        },
      },
      liquidBrain: {
        type: Type.OBJECT,
        description: "Liquid Brain Topology projecting, fusing, and morphing studio Apps onto complete 3D geometries.",
        properties: {
          enabled: { type: Type.BOOLEAN, description: "Enable or disable Liquid Brain 3D App-Shape projections." },
          shape: {
            type: Type.STRING,
            description: "Target 3D shape: 'sphere', 'torus', 'mobiusRibbon', 'cube', 'octaPrism', or 'cone'.",
          },
          projectedApps: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Up to 4 fused module IDs projected onto 3D shapes (e.g. 'cynthetoc-ai', 'intelligent-scene-designer', 'intelligent-video-to-cartoon', 'liquified-3d-studio', 'real-tv-engine', 'csp-collector').",
          },
          fusionMode: {
            type: Type.STRING,
            description: "Projection topology mode: 'orbitalArray' or 'fusedHybrid'.",
          },
          fusedBlend: { type: Type.NUMBER, description: "Cross-app fusion seam blend from 0.0 to 1.0." },
          morphFactor: { type: Type.NUMBER, description: "Liquid Brain hydrodynamic morphing from 0.0 to 1.0." },
          twistAngle: { type: Type.NUMBER, description: "Helical torsion twist from -2.0 to 2.0." },
          explodeRadius: { type: Type.NUMBER, description: "Radial facet separation from 0.0 to 1.0." },
          fluidPressure: { type: Type.NUMBER, description: "Liquid Brain pressure from 0.1 to 1.0." },
          synapseViscosity: { type: Type.NUMBER, description: "Synaptic damping viscosity from 0.1 to 1.0." },
        },
      },
      holographic: {
        type: Type.OBJECT,
        description: "Holographic Projection Engine combining Liquid Glass Fresnel reflection and main image volumetric depth slices.",
        properties: {
          enabled: { type: Type.BOOLEAN, description: "Enable or disable Holographic Projection Engine." },
          rigMode: {
            type: Type.STRING,
            description: "Optical hologram rig: 'pepperGhostPyramid', 'volumetricSliceStack', 'liquidGlassPrism', or 'floatingCausticField'.",
          },
          sliceCount: { type: Type.NUMBER, description: "Volumetric floating focal planes from 3 to 16." },
          glassRefraction: { type: Type.NUMBER, description: "Liquid glass index refraction from 0.0 to 1.0." },
          reflectionMix: { type: Type.NUMBER, description: "Main image specular glass reflection mix from 0.0 to 1.0." },
          chromaticSplit: { type: Type.NUMBER, description: "RGB Cauchy dispersion split from 0.0 to 1.0." },
          parallaxDepth: { type: Type.NUMBER, description: "Main image depth relief parallax from 0.0 to 1.0." },
          scanlineCoherence: { type: Type.NUMBER, description: "Optical interference scanline coherence from 0.0 to 1.0." },
          causticFocus: { type: Type.NUMBER, description: "Liquid caustic focus beam intensity from 0.0 to 1.0." },
          baseElevation: { type: Type.NUMBER, description: "Hover elevation above basin from 0.4 to 2.2." },
          autoRotate: { type: Type.BOOLEAN, description: "Auto rotate hologram assembly." },
        },
      },
      projectHologram: {
        type: Type.BOOLEAN,
        description: "Switch to 3D Stage with Liquid Glass basin reflections and project the main image as an active volumetric hologram.",
      },
      triggerLiquidPulse: {
        type: Type.BOOLEAN,
        description: "Inject an energetic radial liquid pulse ripple through the 3D studio and screen.",
      },
      stage3d: {
        type: Type.OBJECT,
        description: "3D Auditorium & (0,0,0) Multiplied Cone Stage parameters.",
        properties: {
          coneMultiplier: { type: Type.NUMBER, description: "Number of multiplied cones at (0,0,0) from 1 to 9." },
          screenCurvature: { type: Type.NUMBER, description: "3D cinema screen arc curvature from 0.0 to 0.45." },
          cameraPreset: { type: Type.STRING, description: "Camera preset: 'audience', 'booth', or 'origin'." },
        },
      },
      seekSeconds: { type: Type.NUMBER, description: "Jump playback timeline to timestamp in seconds." },
      addMarkerLabel: { type: Type.STRING, description: "Create a scene marker at current timecode." },
      abLoop: {
        type: Type.OBJECT,
        properties: {
          enabled: { type: Type.BOOLEAN },
          a: { type: Type.NUMBER },
          b: { type: Type.NUMBER },
        },
      },
    },
  },
};

function getAiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw Object.assign(
      new Error("GEMINI_API_KEY is not configured in environment secrets."),
      { status: 500 }
    );
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

function resolveThinkingLevel(
  model: string,
  requested?: string
): ThinkingLevel | undefined {
  if (model === "gemini-4-carbon") {
    return ThinkingLevel.HIGH;
  }
  if (model === "gemini-3.1-flash-lite") {
    return requested === "LOW" ? ThinkingLevel.LOW : ThinkingLevel.MINIMAL;
  }
  if (requested === "HIGH") return ThinkingLevel.HIGH;
  if (requested === "MEDIUM") return ThinkingLevel.MEDIUM;
  if (requested === "LOW") return ThinkingLevel.LOW;
  return undefined;
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: "10mb" }));

  app.get("/api/health", (_req, res) => {
    res.json({
      ok: true,
      service: "fractal-os-cinemascope-studio",
      hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
    });
  });

  app.post("/api/chat", async (req, res) => {
    try {
      const body = (req.body || {}) as ChatRequestBody;
      const requestedModel = body.model || "gemini-4-hydrogen";
      const model = ALLOWED_MODELS.has(requestedModel)
        ? requestedModel
        : "gemini-4-hydrogen";
      const message = (body.message || "").trim();
      const autopilotEnabled = body.autopilot !== false;

      if (!message) {
        res.status(400).json({ error: "Message is required." });
        return;
      }

      const ai = getAiClient();
      const history = Array.isArray(body.history) ? body.history : [];
      const systemParts: string[] = [];

      if (body.systemInstruction && body.systemInstruction.trim()) {
        systemParts.push(body.systemInstruction.trim());
      } else {
        systemParts.push(
          "You are Cynthetoc AI & the FractalOS CinemaScope Copilot & Autopilot, orchestrating Cynthetoc AI Neural Synthesis, Liquified 3D Studio, Intelligent Scene Designer, Intelligent Video to Cartoon, Intelligent Fusion Matrix, Cinema Mode, Real TV Mode, and 20 Sovereign Daemons."
        );
      }

      if (autopilotEnabled) {
        systemParts.push(
          "AUTOPILOT & CYNTHETOC AI ACTIVE: Whenever the user asks to project a hologram from the main image / liquid glass reflection (holographic / projectHologram), direct a look, enable Stereoscopic 3D separation (stereoscopic), project/fuse/alter Apps in 3D shapes via Liquid Brain (liquidBrain), enable Cynthetoc AI (cynthetocAi), configure Liquified 3D Studio, design a scene, convert video to cartoon, maximize systems/daemons (up to 9 cones), or adjust Cinema/Real TV/LUT settings, you MUST call `apply_studio_commands` with exact matching parameters."
        );
      }

      if (body.studioContext && body.studioContext.trim()) {
        systemParts.push(
          `Current live FractalOS Studio telemetry & state:\n${body.studioContext.trim()}`
        );
      }

      const thinkingLevel = resolveThinkingLevel(model, body.thinkingLevel);

      const contents: Array<{
        role: "user" | "model";
        parts: Array<
          | { text: string }
          | { inlineData: { mimeType: string; data: string } }
        >;
      }> = [];

      for (const turn of history) {
        if (!turn || typeof turn.text !== "string" || !turn.text.trim()) continue;
        contents.push({
          role: turn.role === "model" ? "model" : "user",
          parts: [{ text: turn.text }],
        });
      }

      const currentParts: Array<
        | { text: string }
        | { inlineData: { mimeType: string; data: string } }
      > = [];

      if (
        typeof body.frameDataUrl === "string" &&
        body.frameDataUrl.startsWith("data:image/")
      ) {
        const commaIdx = body.frameDataUrl.indexOf(",");
        if (commaIdx !== -1) {
          const meta = body.frameDataUrl.slice(5, commaIdx);
          const mimeType = meta.split(";")[0] || "image/png";
          const data = body.frameDataUrl.slice(commaIdx + 1);
          currentParts.push({ inlineData: { mimeType, data } });
        }
      }

      currentParts.push({ text: message });
      contents.push({ role: "user", parts: currentParts });

      const config: {
        systemInstruction: string;
        thinkingConfig?: { thinkingLevel: ThinkingLevel };
        tools?: Array<{ functionDeclarations: FunctionDeclaration[] }>;
      } = {
        systemInstruction: systemParts.join("\n\n"),
      };

      if (thinkingLevel) {
        config.thinkingConfig = { thinkingLevel };
      }
      if (autopilotEnabled) {
        config.tools = [{ functionDeclarations: [applyStudioCommandsDeclaration] }];
      }

      const response1 = await ai.models.generateContent({
        model,
        contents,
        config,
      });

      const functionCalls = response1.functionCalls ?? [];
      const collectedCommands: Array<Record<string, unknown>> = [];
      for (const fc of functionCalls) {
        if (fc.name === "apply_studio_commands" && fc.args) {
          collectedCommands.push(fc.args as Record<string, unknown>);
        }
      }

      let replyText = response1.text ?? "";
      const candidateParts = response1.candidates?.[0]?.content?.parts ?? [];
      let thoughtSummaries = candidateParts
        .filter((p) => (p as { thought?: boolean; text?: string }).thought && (p as { text?: string }).text)
        .map((p) => (p as { text?: string }).text || "")
        .join("\n");

      const prevContent = response1.candidates?.[0]?.content;
      const firstCall = functionCalls[0];
      if (!replyText.trim() && prevContent && firstCall) {
        const response2 = await ai.models.generateContent({
          model,
          contents: [
            ...contents,
            prevContent,
            {
              role: "user",
              parts: [
                {
                  functionResponse: {
                    id: firstCall.id,
                    name: firstCall.name,
                    response: {
                      applied: true,
                      commands: collectedCommands,
                    },
                  },
                },
              ],
            },
          ],
          config,
        });
        replyText = response2.text ?? "Autopilot commands applied across FractalOS.";
        const parts2 = response2.candidates?.[0]?.content?.parts ?? [];
        const extraThoughts = parts2
          .filter((p) => (p as { thought?: boolean; text?: string }).thought && (p as { text?: string }).text)
          .map((p) => (p as { text?: string }).text || "")
          .join("\n");
        if (extraThoughts) {
          thoughtSummaries = thoughtSummaries
            ? `${thoughtSummaries}\n${extraThoughts}`
            : extraThoughts;
        }
      }

      res.json({
        model,
        thinkingLevel: thinkingLevel ?? "AUTO",
        text: replyText,
        thoughts: thoughtSummaries || undefined,
        commands: collectedCommands,
      });
    } catch (err: unknown) {
      const errorObj = err as {
        status?: number;
        code?: number;
        message?: string;
      };
      const rawMessage = errorObj?.message || "Failed to contact Gemini API.";
      const status =
        typeof errorObj?.status === "number"
          ? errorObj.status
          : rawMessage.includes("429") || rawMessage.includes("RESOURCE_EXHAUSTED")
          ? 429
          : rawMessage.includes("403") || rawMessage.includes("PERMISSION_DENIED")
          ? 403
          : rawMessage.includes("404") || rawMessage.includes("NOT_FOUND")
          ? 404
          : 500;

      let friendlyMessage = rawMessage;
      if (status === 429) {
        friendlyMessage =
          "Quota or paid-tier model limit reached (429). For gemini-4-carbon or gemini-4-neon, select a billing-enabled API key in Settings > Secrets, or switch to gemini-4-hydrogen.";
      } else if (status === 403) {
        friendlyMessage =
          "Permission denied (403). Please verify your GEMINI_API_KEY in Settings > Secrets.";
      } else if (status === 404) {
        friendlyMessage =
          "Requested model was not found (404). Try switching to gemini-4-hydrogen.";
      }

      res.status(status).json({
        error: friendlyMessage,
        status,
      });
    }
  });

  app.post("/api/cynthetoc/direct", async (req, res) => {
    try {
      const body = (req.body || {}) as {
        model?: string;
        intent?: string;
        studioContext?: string;
        frameDataUrl?: string;
      };
      const requestedModel = body.model || "gemini-4-hydrogen";
      const model = ALLOWED_MODELS.has(requestedModel)
        ? requestedModel
        : "gemini-4-hydrogen";

      const ai = getAiClient();
      const parts: Array<
        | { text: string }
        | { inlineData: { mimeType: string; data: string } }
      > = [];

      if (
        typeof body.frameDataUrl === "string" &&
        body.frameDataUrl.startsWith("data:image/")
      ) {
        const commaIdx = body.frameDataUrl.indexOf(",");
        if (commaIdx !== -1) {
          const meta = body.frameDataUrl.slice(5, commaIdx);
          const mimeType = meta.split(";")[0] || "image/png";
          const data = body.frameDataUrl.slice(commaIdx + 1);
          parts.push({ inlineData: { mimeType, data } });
        }
      }

      const intent = (body.intent || "Synthesize optimal 2.39:1 Cynthetoc AI look across all 20 modules").trim();
      parts.push({
        text: `Cynthetoc AI Direct Intent: "${intent}"\n\nLive Studio State:\n${(body.studioContext || "{}").slice(0, 3000)}\n\nCall apply_studio_commands right now to configure Cynthetoc AI, color grading, optics, scene designer, and/or Liquified 3D harmoniously, and summarize your artistic & technical directive concisely.`,
      });

      const response1 = await ai.models.generateContent({
        model,
        contents: [{ role: "user", parts }],
        config: {
          systemInstruction:
            "You are Cynthetoc AI, an autonomous cinema look-developer, Liquid Brain 3D topology director, and Stereoscopic 3D engineer inside FractalOS CinemaScope Studio. Analyze the live frame (if provided) and telemetry, then ALWAYS call `apply_studio_commands` to elevate visual cohesion, 3D app-shape fusion, stereoscopic depth, lighting, and upscaling.",
          tools: [{ functionDeclarations: [applyStudioCommandsDeclaration] }],
        },
      });

      const functionCalls = response1.functionCalls ?? [];
      const collectedCommands: Array<Record<string, unknown>> = [];
      for (const fc of functionCalls) {
        if (fc.name === "apply_studio_commands" && fc.args) {
          collectedCommands.push(fc.args as Record<string, unknown>);
        }
      }

      let directiveText = response1.text ?? "";
      const prevContent = response1.candidates?.[0]?.content;
      const firstCall = functionCalls[0];
      if (!directiveText.trim() && prevContent && firstCall) {
        const response2 = await ai.models.generateContent({
          model,
          contents: [
            { role: "user", parts },
            prevContent,
            {
              role: "user",
              parts: [
                {
                  functionResponse: {
                    id: firstCall.id,
                    name: firstCall.name,
                    response: { applied: true, commands: collectedCommands },
                  },
                },
              ],
            },
          ],
        });
        directiveText = response2.text ?? "Cynthetoc AI directive synthesized and applied.";
      }

      res.json({
        model,
        text: directiveText || "Cynthetoc AI directive applied.",
        commands: collectedCommands,
      });
    } catch (err: unknown) {
      const errorObj = err as { status?: number; message?: string };
      const rawMessage = errorObj?.message || "Failed to execute Cynthetoc AI directive.";
      const status = typeof errorObj?.status === "number" ? errorObj.status : 500;
      res.status(status).json({ error: rawMessage, status });
    }
  });

  const isProd = process.env.NODE_ENV === "production";
  if (!isProd) {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(__dirname, "dist");
    app.use(express.static(distDir));
    app.use((_req, res) => {
      const indexFile = path.join(distDir, "index.html");
      if (fs.existsSync(indexFile)) {
        res.sendFile(indexFile);
      } else {
        res.status(404).send("Production build not found. Run npm run build first.");
      }
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`FractalOS CinemaScope Studio server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
