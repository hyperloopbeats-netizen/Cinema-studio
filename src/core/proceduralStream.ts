import type { CynthetocAiConfig, Liquified3dConfig, SceneDesignerConfig, SceneThemeId } from './fractalBrain';

interface ThemePalette {
  bgInner: string;
  bgMid: string;
  bgOuter: string;
  grid: string;
  ringPrimary: string;
  ringSecondary: string;
  flareCenter: string;
  flareEdge: string;
  node: string;
}

const SCENE_PALETTES: Record<SceneThemeId, ThemePalette> = {
  obsidianAmber: {
    bgInner: '#1c0e04',
    bgMid: '#090708',
    bgOuter: '#030304',
    grid: '255, 106, 0',
    ringPrimary: 'rgba(255, 152, 66, 0.94)',
    ringSecondary: '255, 106, 0',
    flareCenter: 'rgba(255, 168, 76, 0.36)',
    flareEdge: 'rgba(92, 165, 220, 0.14)',
    node: '#ff7b1c',
  },
  solarReactor: {
    bgInner: '#2e1002',
    bgMid: '#120703',
    bgOuter: '#040202',
    grid: '255, 140, 32',
    ringPrimary: 'rgba(255, 204, 102, 0.95)',
    ringSecondary: '255, 92, 16',
    flareCenter: 'rgba(255, 212, 118, 0.44)',
    flareEdge: 'rgba(255, 84, 16, 0.18)',
    node: '#ffb248',
  },
  neonBroadcast: {
    bgInner: '#081824',
    bgMid: '#06090f',
    bgOuter: '#030306',
    grid: '56, 189, 248',
    ringPrimary: 'rgba(125, 211, 252, 0.92)',
    ringSecondary: '255, 106, 0',
    flareCenter: 'rgba(56, 189, 248, 0.36)',
    flareEdge: 'rgba(255, 118, 28, 0.22)',
    node: '#38bdf8',
  },
  emeraldMatrix: {
    bgInner: '#061c14',
    bgMid: '#050c09',
    bgOuter: '#020403',
    grid: '34, 197, 94',
    ringPrimary: 'rgba(110, 231, 183, 0.9)',
    ringSecondary: '16, 185, 129',
    flareCenter: 'rgba(74, 222, 128, 0.32)',
    flareEdge: 'rgba(255, 138, 42, 0.14)',
    node: '#34d399',
  },
  crimsonNoir: {
    bgInner: '#22060a',
    bgMid: '#0b0406',
    bgOuter: '#030203',
    grid: '244, 63, 94',
    ringPrimary: 'rgba(253, 164, 175, 0.9)',
    ringSecondary: '225, 29, 72',
    flareCenter: 'rgba(251, 113, 133, 0.34)',
    flareEdge: 'rgba(255, 140, 48, 0.16)',
    node: '#fb7185',
  },
};

export function getSceneThemeRgb(theme: SceneThemeId): [number, number, number] {
  switch (theme) {
    case 'solarReactor':
      return [1.0, 0.56, 0.14];
    case 'neonBroadcast':
      return [0.22, 0.74, 0.98];
    case 'emeraldMatrix':
      return [0.18, 0.85, 0.52];
    case 'crimsonNoir':
      return [0.95, 0.24, 0.38];
    default:
      return [1.0, 0.42, 0.0];
  }
}

/**
 * Procedural 2.39:1 CinemaScope MicroFractal & Liquified Caustics Stream
 */
export class ProceduralScopeStream {
  public readonly canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private timeSec = 0;

  constructor(width = 1434, height = 600) {
    this.canvas = document.createElement('canvas');
    this.canvas.width = width;
    this.canvas.height = height;
    const ctx = this.canvas.getContext('2d', { alpha: false });
    if (!ctx) {
      throw new Error('2D context unavailable for procedural stream');
    }
    this.ctx = ctx;
    this.render(0);
  }

  public advance(dtSec: number, speed = 1.0) {
    this.timeSec += dtSec * speed;
  }

  public getTime(): number {
    return this.timeSec;
  }

  public setTime(t: number) {
    this.timeSec = Math.max(0, t);
  }

  public render(
    tOverride?: number,
    scene?: SceneDesignerConfig,
    liquid?: Liquified3dConfig,
    cynthetoc?: CynthetocAiConfig
  ) {
    const t = tOverride !== undefined ? tOverride : this.timeSec;
    const pal = SCENE_PALETTES[scene?.theme ?? 'obsidianAmber'];
    const rings = Math.max(2, Math.min(8, scene?.fractalComplexity ?? 5));
    const gridDepth = scene?.gridDepth ?? 0.72;
    const sweepIntensity = scene?.sweepIntensity ?? 0.65;
    const liquidActive = liquid?.enabled ?? true;
    const liquidVisc = liquid?.viscosity ?? 0.58;
    const liquidPulse = liquid?.pulseEnergy ?? 0;
    const cyOn = cynthetoc?.enabled ?? true;
    const cyStrength = cyOn ? cynthetoc?.synthesisStrength ?? 0.68 : 0;

    const { width: w, height: h } = this.canvas;
    const ctx = this.ctx;
    const cx = w * 0.5;
    const cy = h * 0.5;

    // 1. Deep cinema radial base
    const bgGrad = ctx.createRadialGradient(cx, cy, 32, cx, cy, w * 0.68);
    bgGrad.addColorStop(0, pal.bgInner);
    bgGrad.addColorStop(0.42, pal.bgMid);
    bgGrad.addColorStop(1, pal.bgOuter);
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, w, h);

    // 1b. Liquified caustic ribbons + Cynthetoc harmonic carrier waves (6 layers)
    if (liquidActive || cyOn) {
      ctx.save();
      const waveCount = cyOn ? 6 : 4;
      for (let l = 0; l < waveCount; l++) {
        ctx.strokeStyle = `rgba(${pal.grid}, ${0.07 + l * 0.024 + liquidPulse * 0.1 + cyStrength * 0.05})`;
        ctx.lineWidth = l % 2 === 0 ? 1.7 : 1.0;
        ctx.beginPath();
        const phase = t * (0.68 + (1 - liquidVisc) * 0.62) + l * 1.12;
        const amp = 22 + l * 13 + liquidPulse * 26 + cyStrength * 12;
        for (let x = 0; x <= w; x += 20) {
          const nx = x / w;
          const y =
            cy +
            Math.sin(nx * Math.PI * (3 + l) + phase) * amp +
            Math.cos(nx * Math.PI * (5 + (l % 3)) - phase * 0.75) * (amp * 0.36);
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
      ctx.restore();
    }

    // 2. MicroFractal perspective grid horizon
    if (gridDepth > 0.02) {
      ctx.save();
      ctx.strokeStyle = `rgba(${pal.grid}, ${0.18 * gridDepth})`;
      ctx.lineWidth = 1;
      const cols = 24;
      for (let i = -cols; i <= cols; i++) {
        const xTop = cx + i * 26;
        const xBot = cx + i * 95;
        ctx.beginPath();
        ctx.moveTo(xTop, cy);
        ctx.lineTo(xBot, h);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(xTop, cy);
        ctx.lineTo(xBot, 0);
        ctx.stroke();
      }
      for (let j = 1; j <= 10; j++) {
        const p = Math.pow((j + ((t * 1.4) % 1)) / 10, 1.85);
        const yOffset = p * (h * 0.5);
        ctx.strokeStyle = `rgba(${pal.grid}, ${(0.06 + p * 0.24) * gridDepth})`;
        ctx.beginPath();
        ctx.moveTo(0, cy + yOffset);
        ctx.lineTo(w, cy + yOffset);
        ctx.moveTo(0, cy - yOffset);
        ctx.lineTo(w, cy - yOffset);
        ctx.stroke();
      }
      ctx.restore();
    }

    // 3. Sweeping anamorphic horizontal flare ribbon
    if (sweepIntensity > 0.02) {
      const sweepX = cx + Math.sin(t * 0.65) * (w * 0.34);
      const flareGrad = ctx.createLinearGradient(0, cy - 30, w, cy + 30);
      flareGrad.addColorStop(0, 'rgba(0,0,0,0)');
      flareGrad.addColorStop(0.28, `rgba(${pal.grid}, ${0.12 * sweepIntensity})`);
      flareGrad.addColorStop(0.5, pal.flareCenter);
      flareGrad.addColorStop(0.72, pal.flareEdge);
      flareGrad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = flareGrad;
      ctx.fillRect(0, cy - 2, w, 4);

      const glow = ctx.createRadialGradient(sweepX, cy, 4, sweepX, cy, 240);
      glow.addColorStop(0, pal.flareCenter);
      glow.addColorStop(0.35, `rgba(${pal.grid}, ${0.14 * sweepIntensity})`);
      glow.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.ellipse(sweepX, cy, 280, 44, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    // 4. Recursive MicroFractal Hex-Ring & Multiplied Cone Cross-Section at center
    ctx.save();
    ctx.translate(cx, cy);
    for (let r = 0; r < rings; r++) {
      const scale = 54 + r * 34 + Math.sin(t * 1.1 + r * 0.6) * 8 + liquidPulse * 12;
      const rot = t * (0.18 + r * 0.06) * (r % 2 === 0 ? 1 : -1);
      ctx.save();
      ctx.rotate(rot);
      ctx.strokeStyle =
        r === 0
          ? pal.ringPrimary
          : `rgba(${pal.ringSecondary}, ${Math.max(0.14, 0.72 - r * 0.09)})`;
      ctx.lineWidth = r === 0 ? 2.3 : 1.3;

      const sides = 6;
      ctx.beginPath();
      for (let s = 0; s <= sides; s++) {
        const ang = (s / sides) * Math.PI * 2;
        const wobble = liquidActive ? Math.sin(t * 2.2 + s * 2 + r) * 3.5 : 0;
        const px = Math.cos(ang) * (scale + wobble);
        const py = Math.sin(ang) * (scale + wobble);
        if (s === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();

      for (let s = 0; s < sides; s++) {
        const ang = (s / sides) * Math.PI * 2;
        const px = Math.cos(ang) * scale;
        const py = Math.sin(ang) * scale;
        const sub = 11 + Math.sin(t * 2 + s) * 3;
        ctx.strokeStyle = `rgba(${pal.grid}, 0.45)`;
        ctx.beginPath();
        ctx.moveTo(px - sub, py);
        ctx.lineTo(px + sub, py);
        ctx.moveTo(px, py - sub);
        ctx.lineTo(px, py + sub);
        ctx.stroke();
      }
      ctx.restore();
    }

    ctx.strokeStyle = 'rgba(255, 232, 200, 0.85)';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.arc(0, 0, 28 + Math.sin(t * 2.4) * 3 + liquidPulse * 6, 0, Math.PI * 2);
    ctx.stroke();

    const orbitalPts: Array<[number, number]> = [];
    const nodeCount = cyOn ? 6 : 3;
    for (let k = 0; k < nodeCount; k++) {
      const a = t * (1.05 + (k % 2) * 0.35) + (k * Math.PI * 2) / nodeCount;
      const rx = Math.cos(a) * (138 + (k % 2) * 44);
      const ry = Math.sin(a * 2) * (54 + (k % 2) * 20);
      orbitalPts.push([rx, ry]);
      ctx.fillStyle = pal.node;
      ctx.beginPath();
      ctx.arc(rx, ry, k % 2 === 0 ? 4.5 : 3.2, 0, Math.PI * 2);
      ctx.fill();
    }

    if (cyOn && orbitalPts.length >= 3) {
      ctx.strokeStyle = `rgba(${pal.grid}, ${0.22 + cyStrength * 0.3})`;
      ctx.lineWidth = 1.1;
      ctx.beginPath();
      for (let i = 0; i < orbitalPts.length; i++) {
        const [x0, y0] = orbitalPts[i];
        const [x1, y1] = orbitalPts[(i + 2) % orbitalPts.length];
        ctx.moveTo(x0, y0);
        ctx.lineTo(x1, y1);
      }
      ctx.stroke();

      // Cynthetoc calibrated dual vernier arcs
      ctx.strokeStyle = `rgba(${pal.grid}, ${0.38 + cyStrength * 0.25})`;
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.arc(0, 0, 212, t * 0.4, t * 0.4 + Math.PI * 0.55);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(0, 0, 212, t * 0.4 + Math.PI, t * 0.4 + Math.PI * 1.55);
      ctx.stroke();
    }
    ctx.restore();

    // 5. CinemaScope color-calibration chip bar + Cynthetoc micro-oscillator
    const swatches = ['#0c0c0f', '#3a1a08', '#ff6a00', '#ffa74f', '#f4ede4', '#386f8a'];
    const swW = 18;
    const swH = 8;
    swatches.forEach((col, i) => {
      ctx.fillStyle = col;
      ctx.fillRect(36 + i * (swW + 4), h - 32, swW, swH);
    });
    if (cyOn) {
      ctx.strokeStyle = `rgba(${pal.grid}, 0.55)`;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      for (let i = 0; i <= 28; i++) {
        const px = w - 210 + i * 6;
        const py = h - 28 + Math.sin(t * 4.5 + i * 0.48) * (4 + cyStrength * 6);
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();
    }

    // 6. Optical corner ticks
    ctx.strokeStyle = `rgba(${pal.grid}, 0.6)`;
    ctx.lineWidth = 1.5;
    const pad = 22;
    const tick = 18;
    const corners: Array<[number, number, number, number]> = [
      [pad, pad, 1, 1],
      [w - pad, pad, -1, 1],
      [pad, h - pad, 1, -1],
      [w - pad, h - pad, -1, -1],
    ];
    for (const [x, y, dx, dy] of corners) {
      ctx.beginPath();
      ctx.moveTo(x, y + dy * tick);
      ctx.lineTo(x, y);
      ctx.lineTo(x + dx * tick, y);
      ctx.stroke();
    }
  }
}
