import type {
  AppShapeTopologyId,
  CartoonStyleId,
  CinemaAspectRatio,
  ColorGradingState,
  CynthetocModeId,
  FractalStudioState,
  HologramRigMode,
  KineticHarmMode,
  LiquidPresetId,
  LutPresetId,
  RealTvProfile,
  SmartMorphModeId,
  StereoscopicModeId,
  UpscaleTier,
} from './fractalBrain';
import { getSceneThemeRgb } from './proceduralStream';

export interface Camera3DState {
  yaw: number;
  pitch: number;
  distance: number;
  targetX: number;
  targetY: number;
  targetZ: number;
}

const LUT_INDEX_MAP: Record<LutPresetId, number> = {
  neutral: 0,
  kodak2383: 1,
  tealAmber: 2,
  bleachBypass: 3,
  noirSilver: 4,
};

const UPSCALE_STRENGTH_MAP: Record<UpscaleTier, number> = {
  off: 0.0,
  '8k': 0.42,
  '16k': 0.72,
  '64k': 1.0,
};

const TV_PROFILE_MAP: Record<RealTvProfile, number> = {
  crt: 0,
  trinitron: 1,
  oled: 2,
  vhs: 3,
};

const TOON_STYLE_MAP: Record<CartoonStyleId, number> = {
  celAnime: 0,
  noirInk: 1,
  popComic: 2,
  microFractalToon: 3,
};

const LIQUID_PRESET_MAP: Record<LiquidPresetId, number> = {
  mercuryChrome: 0,
  moltenAmber: 1,
  ferrofluidObsidian: 2,
  iridescentPlasma: 3,
  liquidGlass: 4,
};

const CYNTHETOC_MODE_MAP: Record<CynthetocModeId, number> = {
  adaptiveDirector: 0,
  neuralSupersample: 1,
  syntheticRelight: 2,
  kineticPulse: 3,
};

const STEREO_MODE_MAP: Record<StereoscopicModeId, number> = {
  anaglyphRedCyan: 0,
  amberBlueColorCode: 1,
  pulfrichAnalog: 2,
  sideBySide: 3,
  interlacedField: 4,
};

const HOLOGRAM_RIG_MAP: Record<HologramRigMode, number> = {
  pepperGhostPyramid: 0,
  volumetricSliceStack: 1,
  liquidGlassPrism: 2,
  floatingCausticField: 3,
};

const SMART_MORPH_MODE_MAP: Record<SmartMorphModeId, number> = {
  organicExpand: 0,
  gradientFlow: 1,
  goldenSpiral: 2,
  harmonicBreathe: 3,
};

const KINETIC_HARM_MODE_MAP: Record<KineticHarmMode, number> = {
  chromaticRim: 0,
  goldenAura: 1,
  prismDiffract: 2,
  thermalEcho: 3,
};

function getAppVisualProfile(appId: string): {
  rgb: [number, number, number];
  sig: number;
} {
  if (appId.includes('cynthetoc')) return { rgb: [0.32, 0.85, 1.0], sig: 1.0 };
  if (appId.includes('cartoon')) return { rgb: [1.0, 0.42, 0.68], sig: 2.0 };
  if (appId.includes('scene-designer')) return { rgb: [1.0, 0.56, 0.14], sig: 3.0 };
  if (appId.includes('real-tv')) return { rgb: [0.46, 0.96, 0.62], sig: 4.0 };
  if (appId.includes('liquified')) return { rgb: [0.95, 0.72, 0.28], sig: 5.0 };
  if (appId.includes('csp')) return { rgb: [1.0, 0.36, 0.08], sig: 6.0 };
  return { rgb: [0.85, 0.58, 1.0], sig: 0.0 };
}

const ASPECT_RATIO_MAP: Record<CinemaAspectRatio, number> = {
  '2.39': 2.39,
  '2.35': 2.35,
  '1.85': 1.85,
  '16:9': 16 / 9,
  '4:3': 4 / 3,
};

function mat4Identity(): Float32Array {
  const m = new Float32Array(16);
  m[0] = m[5] = m[10] = m[15] = 1;
  return m;
}

function mat4Perspective(fovRad: number, aspect: number, near: number, far: number): Float32Array {
  const f = 1.0 / Math.tan(fovRad * 0.5);
  const nf = 1 / (near - far);
  const out = new Float32Array(16);
  out[0] = f / Math.max(aspect, 0.01);
  out[5] = f;
  out[10] = (far + near) * nf;
  out[11] = -1;
  out[14] = 2 * far * near * nf;
  return out;
}

function mat4LookAt(
  eyeX: number,
  eyeY: number,
  eyeZ: number,
  cx: number,
  cy: number,
  cz: number,
  upX = 0,
  upY = 1,
  upZ = 0
): Float32Array {
  let zx = eyeX - cx;
  let zy = eyeY - cy;
  let zz = eyeZ - cz;
  let len = Math.hypot(zx, zy, zz) || 1;
  zx /= len;
  zy /= len;
  zz /= len;

  let xx = upY * zz - upZ * zy;
  let xy = upZ * zx - upX * zz;
  let xz = upX * zy - upY * zx;
  len = Math.hypot(xx, xy, xz);
  if (len === 0) {
    xx = 1;
    xy = 0;
    xz = 0;
  } else {
    xx /= len;
    xy /= len;
    xz /= len;
  }

  const yx = zy * xz - zz * xy;
  const yy = zz * xx - zx * xz;
  const yz = zx * xy - zy * xx;

  const out = new Float32Array(16);
  out[0] = xx;
  out[1] = yx;
  out[2] = zx;
  out[3] = 0;
  out[4] = xy;
  out[5] = yy;
  out[6] = zy;
  out[7] = 0;
  out[8] = xz;
  out[9] = yz;
  out[10] = zz;
  out[11] = 0;
  out[12] = -(xx * eyeX + xy * eyeY + xz * eyeZ);
  out[13] = -(yx * eyeX + yy * eyeY + yz * eyeZ);
  out[14] = -(zx * eyeX + zy * eyeY + zz * eyeZ);
  out[15] = 1;
  return out;
}

function mat4Multiply(a: Float32Array, b: Float32Array): Float32Array {
  const out = new Float32Array(16);
  for (let i = 0; i < 4; i++) {
    const ai0 = a[i];
    const ai1 = a[i + 4];
    const ai2 = a[i + 8];
    const ai3 = a[i + 12];
    out[i] = ai0 * b[0] + ai1 * b[1] + ai2 * b[2] + ai3 * b[3];
    out[i + 4] = ai0 * b[4] + ai1 * b[5] + ai2 * b[6] + ai3 * b[7];
    out[i + 8] = ai0 * b[8] + ai1 * b[9] + ai2 * b[10] + ai3 * b[11];
    out[i + 12] = ai0 * b[12] + ai1 * b[13] + ai2 * b[14] + ai3 * b[15];
  }
  return out;
}

interface MeshGeometry {
  posBuf: WebGLBuffer | null;
  normBuf: WebGLBuffer | null;
  uvBuf: WebGLBuffer | null;
  vertexCount: number;
}

function buildSphereData(radius: number, latBands: number, lonBands: number) {
  const pos: number[] = [];
  const norm: number[] = [];
  const uv: number[] = [];
  for (let lat = 0; lat < latBands; lat++) {
    const t0 = (lat / latBands) * Math.PI;
    const t1 = ((lat + 1) / latBands) * Math.PI;
    for (let lon = 0; lon < lonBands; lon++) {
      const p0 = (lon / lonBands) * Math.PI * 2;
      const p1 = ((lon + 1) / lonBands) * Math.PI * 2;

      const pts: Array<[number, number, number, number]> = [
        [t0, p0, lon / lonBands, lat / latBands],
        [t1, p0, lon / lonBands, (lat + 1) / latBands],
        [t1, p1, (lon + 1) / lonBands, (lat + 1) / latBands],
        [t0, p0, lon / lonBands, lat / latBands],
        [t1, p1, (lon + 1) / lonBands, (lat + 1) / latBands],
        [t0, p1, (lon + 1) / lonBands, lat / latBands],
      ];
      for (const [th, ph, u, v] of pts) {
        const nx = Math.sin(th) * Math.cos(ph);
        const ny = Math.cos(th);
        const nz = Math.sin(th) * Math.sin(ph);
        pos.push(nx * radius, ny * radius, nz * radius);
        norm.push(nx, ny, nz);
        uv.push(u, v);
      }
    }
  }
  return { pos, norm, uv };
}

function buildPlaneData(width: number, depth: number, segsX: number, segsZ: number, y: number) {
  const pos: number[] = [];
  const norm: number[] = [];
  const uv: number[] = [];
  for (let ix = 0; ix < segsX; ix++) {
    const u0 = ix / segsX;
    const u1 = (ix + 1) / segsX;
    const x0 = (u0 - 0.5) * width;
    const x1 = (u1 - 0.5) * width;
    for (let iz = 0; iz < segsZ; iz++) {
      const v0 = iz / segsZ;
      const v1 = (iz + 1) / segsZ;
      const z0 = (v0 - 0.5) * depth;
      const z1 = (v1 - 0.5) * depth;

      const quad: Array<[number, number, number, number]> = [
        [x0, z0, u0, v0],
        [x0, z1, u0, v1],
        [x1, z1, u1, v1],
        [x0, z0, u0, v0],
        [x1, z1, u1, v1],
        [x1, z0, u1, v0],
      ];
      for (const [px, pz, u, v] of quad) {
        pos.push(px, y, pz);
        norm.push(0, 1, 0);
        uv.push(u, v);
      }
    }
  }
  return { pos, norm, uv };
}

function buildConeData(radius: number, height: number, segs: number) {
  const pos: number[] = [];
  const norm: number[] = [];
  const uv: number[] = [];
  const slope = radius / Math.max(0.01, height);
  for (let i = 0; i < segs; i++) {
    const a0 = (i / segs) * Math.PI * 2;
    const a1 = ((i + 1) / segs) * Math.PI * 2;
    const am = (a0 + a1) * 0.5;
    const x0 = Math.cos(a0) * radius;
    const z0 = Math.sin(a0) * radius;
    const x1 = Math.cos(a1) * radius;
    const z1 = Math.sin(a1) * radius;

    const n0 = [Math.cos(a0), slope, Math.sin(a0)];
    const n1 = [Math.cos(a1), slope, Math.sin(a1)];
    const nm = [Math.cos(am), slope, Math.sin(am)];
    const l0 = Math.hypot(n0[0], n0[1], n0[2]) || 1;
    const l1 = Math.hypot(n1[0], n1[1], n1[2]) || 1;
    const lm = Math.hypot(nm[0], nm[1], nm[2]) || 1;

    pos.push(0, height * 0.5, 0, x0, -height * 0.5, z0, x1, -height * 0.5, z1);
    norm.push(
      nm[0] / lm, nm[1] / lm, nm[2] / lm,
      n0[0] / l0, n0[1] / l0, n0[2] / l0,
      n1[0] / l1, n1[1] / l1, n1[2] / l1
    );
    uv.push((i + 0.5) / segs, 0, i / segs, 1, (i + 1) / segs, 1);
  }
  return { pos, norm, uv };
}

function buildTorusData(majorR: number, minorR: number, majorSegs: number, minorSegs: number) {
  const pos: number[] = [];
  const norm: number[] = [];
  const uv: number[] = [];
  for (let i = 0; i < majorSegs; i++) {
    const u0 = i / majorSegs;
    const u1 = (i + 1) / majorSegs;
    const th0 = u0 * Math.PI * 2;
    const th1 = u1 * Math.PI * 2;
    for (let j = 0; j < minorSegs; j++) {
      const v0 = j / minorSegs;
      const v1 = (j + 1) / minorSegs;
      const ph0 = v0 * Math.PI * 2;
      const ph1 = v1 * Math.PI * 2;

      const pt = (th: number, ph: number, u: number, v: number) => {
        const ct = Math.cos(th);
        const st = Math.sin(th);
        const cp = Math.cos(ph);
        const sp = Math.sin(ph);
        const r = majorR + minorR * cp;
        const x = r * ct;
        const y = minorR * sp;
        const z = r * st;
        const nx = cp * ct;
        const ny = sp;
        const nz = cp * st;
        return { x, y, z, nx, ny, nz, u, v };
      };

      const a = pt(th0, ph0, u0, v0);
      const b = pt(th1, ph0, u1, v0);
      const c = pt(th1, ph1, u1, v1);
      const d = pt(th0, ph1, u0, v1);
      for (const p of [a, b, c, a, c, d]) {
        pos.push(p.x, p.y, p.z);
        norm.push(p.nx, p.ny, p.nz);
        uv.push(p.u, p.v);
      }
    }
  }
  return { pos, norm, uv };
}

function buildCubeData(size: number, segs: number) {
  const pos: number[] = [];
  const norm: number[] = [];
  const uv: number[] = [];
  const half = size * 0.5;

  const faces: Array<{
    n: [number, number, number];
    uAxis: [number, number, number];
    vAxis: [number, number, number];
  }> = [
    { n: [0, 0, 1], uAxis: [1, 0, 0], vAxis: [0, 1, 0] },
    { n: [0, 0, -1], uAxis: [-1, 0, 0], vAxis: [0, 1, 0] },
    { n: [1, 0, 0], uAxis: [0, 0, -1], vAxis: [0, 1, 0] },
    { n: [-1, 0, 0], uAxis: [0, 0, 1], vAxis: [0, 1, 0] },
    { n: [0, 1, 0], uAxis: [1, 0, 0], vAxis: [0, 0, -1] },
    { n: [0, -1, 0], uAxis: [1, 0, 0], vAxis: [0, 0, 1] },
  ];

  const emitPt = (
    f: (typeof faces)[number],
    u: number,
    v: number
  ) => {
    const su = (u - 0.5) * 2 * half;
    const sv = (v - 0.5) * 2 * half;
    pos.push(
      f.n[0] * half + f.uAxis[0] * su + f.vAxis[0] * sv,
      f.n[1] * half + f.uAxis[1] * su + f.vAxis[1] * sv,
      f.n[2] * half + f.uAxis[2] * su + f.vAxis[2] * sv
    );
    norm.push(f.n[0], f.n[1], f.n[2]);
    uv.push(u, v);
  };

  for (const f of faces) {
    for (let i = 0; i < segs; i++) {
      const u0 = i / segs;
      const u1 = (i + 1) / segs;
      for (let j = 0; j < segs; j++) {
        const v0 = j / segs;
        const v1 = (j + 1) / segs;
        emitPt(f, u0, v0);
        emitPt(f, u1, v0);
        emitPt(f, u1, v1);
        emitPt(f, u0, v0);
        emitPt(f, u1, v1);
        emitPt(f, u0, v1);
      }
    }
  }
  return { pos, norm, uv };
}

function buildOctaPrismData(radius: number, halfH: number, sides: number, bands: number) {
  const pos: number[] = [];
  const norm: number[] = [];
  const uv: number[] = [];

  const pushCap = (signY: number) => {
    for (let s = 0; s < sides; s++) {
      const a0 = (s / sides) * Math.PI * 2;
      const a1 = ((s + 1) / sides) * Math.PI * 2;
      const am = (a0 + a1) * 0.5;
      const nx = Math.cos(am);
      const nz = Math.sin(am);
      const ny = signY * (radius / Math.max(0.01, halfH)) * 0.65;
      const nl = Math.hypot(nx, ny, nz) || 1;
      for (let b = 0; b < bands; b++) {
        const t0 = b / bands;
        const t1 = (b + 1) / bands;
        const r0 = radius * (1 - t0);
        const r1 = radius * (1 - t1);
        const y0 = signY * halfH * t0;
        const y1 = signY * halfH * t1;

        const p00 = [Math.cos(a0) * r0, y0, Math.sin(a0) * r0, s / sides, t0];
        const p10 = [Math.cos(a1) * r0, y0, Math.sin(a1) * r0, (s + 1) / sides, t0];
        const p11 = [Math.cos(a1) * r1, y1, Math.sin(a1) * r1, (s + 1) / sides, t1];
        const p01 = [Math.cos(a0) * r1, y1, Math.sin(a0) * r1, s / sides, t1];

        const tris = signY > 0 ? [p00, p10, p11, p00, p11, p01] : [p00, p11, p10, p00, p01, p11];
        for (const pt of tris) {
          pos.push(pt[0], pt[1], pt[2]);
          norm.push(nx / nl, ny / nl, nz / nl);
          uv.push(pt[3], pt[4]);
        }
      }
    }
  };
  pushCap(1);
  pushCap(-1);
  return { pos, norm, uv };
}

function buildMobiusData(majorR: number, halfWidth: number, segsU: number, segsV: number) {
  const pos: number[] = [];
  const norm: number[] = [];
  const uv: number[] = [];

  const evalMobius = (u: number, v: number) => {
    const theta = u * Math.PI * 2;
    const s = (v - 0.5) * 2 * halfWidth;
    const halfTh = theta * 0.5;
    const ch = Math.cos(halfTh);
    const sh = Math.sin(halfTh);
    const ct = Math.cos(theta);
    const st = Math.sin(theta);

    const ring = majorR + s * ch;
    const x = ring * ct;
    const y = s * sh;
    const z = ring * st;

    // Approximate surface normal
    const nx = sh * ct;
    const ny = -ch;
    const nz = sh * st;
    const nl = Math.hypot(nx, ny, nz) || 1;
    return { x, y, z, nx: nx / nl, ny: ny / nl, nz: nz / nl, u, v };
  };

  for (let i = 0; i < segsU; i++) {
    const u0 = i / segsU;
    const u1 = (i + 1) / segsU;
    for (let j = 0; j < segsV; j++) {
      const v0 = j / segsV;
      const v1 = (j + 1) / segsV;
      const a = evalMobius(u0, v0);
      const b = evalMobius(u1, v0);
      const c = evalMobius(u1, v1);
      const d = evalMobius(u0, v1);
      for (const p of [a, b, c, a, c, d]) {
        pos.push(p.x, p.y, p.z);
        norm.push(p.nx, p.ny, p.nz);
        uv.push(p.u, p.v);
      }
    }
  }
  return { pos, norm, uv };
}

function buildHoloPyramidData(topRadius: number, botRadius: number, height: number) {
  const pos: number[] = [];
  const norm: number[] = [];
  const uv: number[] = [];
  const sides = 4;
  const halfH = height * 0.5;
  const bands = 6;

  for (let s = 0; s < sides; s++) {
    const a0 = (s / sides) * Math.PI * 2 + Math.PI * 0.25;
    const a1 = ((s + 1) / sides) * Math.PI * 2 + Math.PI * 0.25;
    const am = (a0 + a1) * 0.5;
    // Outward 45-degree optical pane normal for Pepper's Ghost reflection
    const nx = Math.cos(am);
    const nz = Math.sin(am);
    const ny = -0.72;
    const nl = Math.hypot(nx, ny, nz) || 1;

    for (let b = 0; b < bands; b++) {
      const v0 = b / bands;
      const v1 = (b + 1) / bands;
      const r0 = botRadius + (topRadius - botRadius) * v0;
      const r1 = botRadius + (topRadius - botRadius) * v1;
      const y0 = -halfH + height * v0;
      const y1 = -halfH + height * v1;

      const p00 = [Math.cos(a0) * r0, y0, Math.sin(a0) * r0, 0, 1 - v0];
      const p10 = [Math.cos(a1) * r0, y0, Math.sin(a1) * r0, 1, 1 - v0];
      const p11 = [Math.cos(a1) * r1, y1, Math.sin(a1) * r1, 1, 1 - v1];
      const p01 = [Math.cos(a0) * r1, y1, Math.sin(a0) * r1, 0, 1 - v1];

      for (const pt of [p00, p10, p11, p00, p11, p01]) {
        pos.push(pt[0], pt[1], pt[2]);
        norm.push(nx / nl, ny / nl, nz / nl);
        uv.push(pt[3], pt[4]);
      }
    }
  }
  return { pos, norm, uv };
}

function buildHoloSliceQuadData(width: number, height: number, segsX: number, segsY: number) {
  const pos: number[] = [];
  const norm: number[] = [];
  const uv: number[] = [];

  for (let ix = 0; ix < segsX; ix++) {
    const u0 = ix / segsX;
    const u1 = (ix + 1) / segsX;
    const x0 = (u0 - 0.5) * width;
    const x1 = (u1 - 0.5) * width;
    for (let iy = 0; iy < segsY; iy++) {
      const v0 = iy / segsY;
      const v1 = (iy + 1) / segsY;
      const y0 = (0.5 - v0) * height;
      const y1 = (0.5 - v1) * height;

      const quad: Array<[number, number, number, number]> = [
        [x0, y1, u0, v1],
        [x1, y1, u1, v1],
        [x1, y0, u1, v0],
        [x0, y1, u0, v1],
        [x1, y0, u1, v0],
        [x0, y0, u0, v0],
      ];
      for (const [px, py, u, v] of quad) {
        pos.push(px, py, 0);
        norm.push(0, 0, 1);
        uv.push(u, v);
      }
    }
  }
  return { pos, norm, uv };
}

const SCREEN_VERT_SRC = `
  precision mediump float;
  attribute vec3 aPos;
  attribute vec2 aUv;
  uniform mat4 uMvp;
  varying vec2 vUv;
  void main() {
    vUv = aUv;
    gl_Position = uMvp * vec4(aPos, 1.0);
  }
`;

const SCREEN_FRAG_SRC = `
  precision mediump float;
  varying vec2 vUv;
  uniform sampler2D uTex;
  uniform sampler2D uPrevTex;
  uniform vec2 uTexelSize;
  uniform vec2 uOutputRes;
  uniform float uTime;

  uniform float uExposure;
  uniform float uContrast;
  uniform float uSaturation;
  uniform float uTemperature;
  uniform float uTint;
  uniform float uRolloff;
  uniform float uLut;
  uniform float uSubtract;
  uniform float uUpscale;
  uniform float uFlare;
  uniform float uSqueeze;
  uniform float uTheatreDim;

  // Cinema Mode Optics
  uniform float uFilmGrain;
  uniform float uHalation;
  uniform float uGateWeave;

  // Real TV Mode Optics
  uniform float uTvEnabled;
  uniform float uTvProfile;
  uniform float uTvScanlines;
  uniform float uTvCurvature;
  uniform float uTvChromaBleed;
  uniform float uTvBloom;

  // Intelligent Video-to-Cartoon
  uniform float uToonEnabled;
  uniform float uToonStyle;
  uniform float uToonLevels;
  uniform float uToonEdge;
  uniform float uToonThickness;
  uniform float uToonBoost;
  uniform float uToonHalftone;

  // Intelligent Scene Designer + Fusion Matrix
  uniform vec3 uSceneColor;
  uniform float uAtmosBlend;
  uniform float uFusionGain;

  // Liquified 3D Screen Optical Refraction & Ripples
  uniform float uLiquidScreen;
  uniform float uLiquidRefraction;
  uniform vec2 uRippleUv;
  uniform float uRippleAge;
  uniform float uRippleForce;
  uniform float uPulseEnergy;

  // Cynthetoc AI Neural Synthesis & Reillumination
  uniform float uCynthetocOn;
  uniform float uCynthetocMode;
  uniform float uCynthetocStrength;
  uniform float uCynthetocDenoise;
  uniform float uCynthetocRelight;

  // Analog Stereoscopic 3D Separation Engine
  uniform float uStereoOn;
  uniform float uStereoMode; // 0:redCyan, 1:amberBlue, 2:pulfrich, 3:sbs, 4:interlaced
  uniform float uStereoSep;
  uniform float uStereoConv;
  uniform float uStereoCross;
  uniform float uStereoDepth;
  uniform float uStereoParity; // 0=normal/left, 1=discard even rows for hardware right-eye interlace

  // Holographic Liquid Glass Reflection Synthesis (Movie Mode + Screen Overlay)
  uniform float uHoloOn;
  uniform float uHoloRig;
  uniform float uHoloRefraction;
  uniform float uHoloReflect;
  uniform float uHoloChroma;
  uniform float uHoloParallax;
  uniform float uHoloScan;
  uniform float uHoloCaustic;

  // Smart Morph Engine (Natural Frame Element Expansion)
  uniform float uMorphOn;
  uniform float uMorphMode; // 0:organicExpand, 1:gradientFlow, 2:goldenSpiral, 3:harmonicBreathe
  uniform float uMorphForce;
  uniform float uMorphCohesion;
  uniform float uMorphRate;
  uniform float uMorphRadial;
  uniform float uMorphEdgePreserve;

  // Kinetic Prism Harmonizer (Abby-matched spectral contour & aura synthesis)
  uniform float uHarmOn;
  uniform float uHarmMode; // 0:chromaticRim, 1:goldenAura, 2:prismDiffract, 3:thermalEcho
  uniform float uHarmStrength;
  uniform float uHarmEdge;
  uniform float uHarmShift;
  uniform float uHarmVig;
  uniform vec3 uHarmColor;

  float hash12(vec2 p) {
    vec3 p3 = fract(vec3(p.xyx) * 0.1031);
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.x + p3.y) * p3.z);
  }

  float getLuma(vec3 c) {
    return dot(c, vec3(0.2126, 0.7152, 0.0722));
  }

  vec3 applyLut(vec3 c, float lutId) {
    if (lutId < 0.5) {
      return c;
    } else if (lutId < 1.5) {
      vec3 s = smoothstep(vec3(0.0), vec3(1.0), c);
      c = mix(c, s, 0.44);
      c.r *= 1.06;
      c.g *= 1.01;
      c.b *= 0.93;
      c = mix(c, vec3(dot(c, vec3(0.3, 0.59, 0.11))), -0.09);
      return c;
    } else if (lutId < 2.5) {
      float l = dot(c, vec3(0.299, 0.587, 0.114));
      vec3 shadows = vec3(0.04, 0.22, 0.28);
      vec3 highlights = vec3(1.06, 0.68, 0.34);
      vec3 split = mix(shadows, highlights, smoothstep(0.15, 0.85, l));
      return mix(c, split * (l * 1.35 + 0.12), 0.56);
    } else if (lutId < 3.5) {
      float l = getLuma(c);
      vec3 mono = vec3(l);
      vec3 blended = mix(c, mono, 0.58);
      return (blended - 0.5) * 1.28 + 0.5;
    } else {
      float l = dot(c, vec3(0.26, 0.62, 0.12));
      l = smoothstep(0.03, 0.96, l);
      return vec3(l * 1.02, l * 0.99, l * 0.95);
    }
  }

  vec2 barrelDistort(vec2 uv, float amount) {
    vec2 cc = uv - 0.5;
    float dist = dot(cc, cc) * amount * 0.42;
    return uv + cc * dist;
  }

  vec3 applyVideoToCartoon(vec2 uv, vec3 col) {
    vec2 stepUv = uTexelSize * uToonThickness;
    vec3 cTL = texture2D(uTex, uv + vec2(-stepUv.x, -stepUv.y)).rgb;
    vec3 cT  = texture2D(uTex, uv + vec2(0.0, -stepUv.y)).rgb;
    vec3 cTR = texture2D(uTex, uv + vec2(stepUv.x, -stepUv.y)).rgb;
    vec3 cL  = texture2D(uTex, uv + vec2(-stepUv.x, 0.0)).rgb;
    vec3 cR  = texture2D(uTex, uv + vec2(stepUv.x, 0.0)).rgb;
    vec3 cBL = texture2D(uTex, uv + vec2(-stepUv.x, stepUv.y)).rgb;
    vec3 cB  = texture2D(uTex, uv + vec2(0.0, stepUv.y)).rgb;
    vec3 cBR = texture2D(uTex, uv + vec2(stepUv.x, stepUv.y)).rgb;

    float lTL = getLuma(cTL); float lT = getLuma(cT); float lTR = getLuma(cTR);
    float lL  = getLuma(cL);                      float lR  = getLuma(cR);
    float lBL = getLuma(cBL); float lB = getLuma(cB); float lBR = getLuma(cBR);

    float gx = -lTL - 2.0 * lL - lBL + lTR + 2.0 * lR + lBR;
    float gy = -lTL - 2.0 * lT - lTR + lBL + 2.0 * lB + lBR;
    float edge = clamp(sqrt(gx * gx + gy * gy) * 2.8, 0.0, 1.0);
    float inkMask = smoothstep(0.18, 0.52, edge) * uToonEdge;

    vec3 smoothCol = (col * 2.0 + cT + cB + cL + cR) / 6.0;
    float levels = max(2.0, uToonLevels);
    float luma = getLuma(smoothCol);
    float quantLuma = floor(luma * levels + 0.5) / levels;
    vec3 celCol = smoothCol * (quantLuma / max(0.001, luma));

    float celL = getLuma(celCol);
    celCol = mix(vec3(celL), celCol, uToonBoost);

    if (uToonStyle > 0.5 && uToonStyle < 1.5) {
      float inkTone = step(0.42, celL) * 0.65 + step(0.75, celL) * 0.35;
      celCol = vec3(inkTone * 1.02, inkTone * 0.98, inkTone * 0.92);
    } else if (uToonStyle >= 1.5 && uToonStyle < 2.5) {
      celCol = floor(celCol * max(2.0, levels - 1.0) + 0.5) / max(2.0, levels - 1.0);
    } else if (uToonStyle >= 2.5) {
      vec3 contourGlow = uSceneColor * inkMask * 1.35;
      celCol = mix(celCol, vec3(0.03, 0.03, 0.04), inkMask * 0.85) + contourGlow;
      return clamp(celCol, 0.0, 1.0);
    }

    if (uToonHalftone > 0.02 && luma < 0.45) {
      vec2 grid = sin(gl_FragCoord.xy * 0.55);
      float dots = step(0.35, grid.x * grid.y);
      celCol *= mix(1.0, 0.72 + 0.28 * dots, uToonHalftone * (1.0 - luma * 2.0));
    }

    return mix(celCol, vec3(0.02, 0.02, 0.025), inkMask);
  }

  void main() {
    vec2 uv = vUv;

    // Optional Liquified Screen Optical Wave + Cursor Ripple Refraction
    if (uLiquidScreen > 0.5 || uPulseEnergy > 0.02) {
      float amp = (uLiquidScreen > 0.5 ? uLiquidRefraction * 0.014 : 0.0) + uPulseEnergy * 0.01;
      vec2 wave = vec2(
        sin(uv.y * 16.0 + uTime * 2.4) + cos(uv.x * 11.0 - uTime * 1.7),
        cos(uv.x * 14.0 + uTime * 2.1) - sin(uv.y * 12.0 + uTime * 1.5)
      ) * amp;

      vec2 rd = uv - uRippleUv;
      float rDist = length(rd);
      float rDecay = exp(-uRippleAge * 2.2) * exp(-rDist * 4.5);
      float rWave = sin(rDist * 38.0 - uRippleAge * 14.0) * rDecay * uRippleForce * 0.018;
      vec2 rDir = rDist > 0.001 ? rd / rDist : vec2(0.0);
      uv = clamp(uv + wave + rDir * rWave, 0.0, 1.0);
    }

    if (uGateWeave > 0.01 && uTvEnabled < 0.5) {
      float wx = sin(uTime * 19.7) * 0.00055 * uGateWeave;
      float wy = cos(uTime * 23.3) * 0.00075 * uGateWeave;
      uv = clamp(uv + vec2(wx, wy), 0.0, 1.0);
    }

    // Smart Morph Engine: Move elements within the frame towards their natural expansion
    vec2 morphVec = vec2(0.0);
    if (uMorphOn > 0.5 && uMorphForce > 0.005) {
      vec2 stepM = uTexelSize * (2.5 + (1.0 - uMorphCohesion) * 4.5);
      float mL = getLuma(texture2D(uTex, clamp(uv - vec2(stepM.x, 0.0), 0.0, 1.0)).rgb);
      float mR = getLuma(texture2D(uTex, clamp(uv + vec2(stepM.x, 0.0), 0.0, 1.0)).rgb);
      float mT = getLuma(texture2D(uTex, clamp(uv - vec2(0.0, stepM.y), 0.0, 1.0)).rgb);
      float mB = getLuma(texture2D(uTex, clamp(uv + vec2(0.0, stepM.y), 0.0, 1.0)).rgb);
      float mC = getLuma(texture2D(uTex, uv).rgb);

      // Outward gradient points away from local bright cores so sampling (uv - expand) grows elements outward
      vec2 lumGrad = vec2(mL - mR, mT - mB);
      float gradMag = length(lumGrad);
      vec2 gradDir = gradMag > 0.0015 ? lumGrad / gradMag : vec2(0.0);

      vec2 fromCenter = uv - 0.5;
      float radDist = length(fromCenter);
      vec2 radialDir = radDist > 0.001 ? fromCenter / radDist : vec2(0.0);
      vec2 tangentDir = vec2(-radialDir.y, radialDir.x);

      // Edge damper keeps boundaries natural without tearing
      float edgeMargin = min(min(uv.x, 1.0 - uv.x), min(uv.y, 1.0 - uv.y));
      float boundaryEase = smoothstep(0.0, 0.14, edgeMargin);

      // Breath phase locked to Golden Angle 2.39996 rad & flowRate
      float tPhase = uTime * uMorphRate * 1.45;
      float natPhase = 0.58 + 0.42 * sin(tPhase - radDist * 5.2 + mC * 2.4);

      if (uMorphMode < 0.5) {
        // Organic Natural Expansion: weighted luminance contour expansion + golden radial envelope
        vec2 natDir = mix(gradDir * (0.4 + gradMag * 4.0), radialDir * (0.55 + mC * 0.65), uMorphRadial);
        morphVec = natDir * natPhase;
      } else if (uMorphMode < 1.5) {
        // Gradient Flow: anisotropic expansion strictly along local element contours
        float contrastBoost = smoothstep(0.01, 0.25, gradMag);
        morphVec = mix(gradDir * (0.65 + contrastBoost * 1.4), radialDir * 0.4, uMorphRadial * 0.45) * (0.5 + 0.5 * sin(tPhase + mC * 3.14));
      } else if (uMorphMode < 2.5) {
        // Golden Phyllotaxis Spiral Expansion (phi divergence 2.399963)
        float phiWave = sin(radDist * 14.0 - tPhase * 1.3 + atan(fromCenter.y, fromCenter.x) * 3.0);
        vec2 spiralDir = radialDir * 0.85 + tangentDir * (0.42 * phiWave);
        morphVec = mix(gradDir, spiralDir, 0.45 + uMorphRadial * 0.5) * (0.65 + 0.35 * cos(tPhase * 0.8));
      } else {
        // Harmonic Breathe: rhythmic cellular expansion preserving form
        float breathe = 0.5 + 0.5 * sin(tPhase * 1.25 - radDist * 3.0);
        morphVec = mix(gradDir, radialDir, 0.35 + uMorphRadial * 0.55) * breathe * (0.7 + mC * 0.6);
      }

      // Preserve crisp outer silhouette lines when edgePreserve is high
      float silhouetteBrake = mix(1.0, 1.0 - clamp(gradMag * 3.2, 0.0, 0.72), uMorphEdgePreserve);
      float dispAmt = uMorphForce * 0.048 * boundaryEase * silhouetteBrake;
      uv = clamp(uv - morphVec * dispAmt, 0.0, 1.0);
    }

    float tvMask = 1.0;
    if (uTvEnabled > 0.5) {
      if (uTvCurvature > 0.01) {
        uv = barrelDistort(uv, uTvCurvature);
      }
      if (uTvProfile > 2.5) {
        float rfJitter = (hash12(vec2(floor(uv.y * 240.0), floor(uTime * 30.0))) - 0.5) * 0.004;
        uv.x += rfJitter;
        if (uv.y > 0.955) {
          uv.x += sin(uTime * 48.0 + uv.y * 120.0) * 0.015;
        }
      }
      if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) {
        gl_FragColor = vec4(0.012, 0.012, 0.016, 1.0);
        return;
      }
      vec2 edge = abs(uv - 0.5) * 2.0;
      float corner = length(max(edge - vec2(0.92), 0.0));
      tvMask = 1.0 - smoothstep(0.03, 0.085, corner);
    }

    vec4 base = texture2D(uTex, uv);
    vec4 prev = texture2D(uPrevTex, uv);
    vec3 col = base.rgb;

    // Coherent Smart Morph multi-tap blending keeps expanded elements silky smooth
    if (uMorphOn > 0.5 && uMorphForce > 0.01 && uMorphCohesion > 0.05) {
      vec2 advUv = clamp(uv + morphVec * (uMorphForce * 0.012), 0.0, 1.0);
      vec3 advCol = texture2D(uTex, advUv).rgb;
      col = mix(col, (col + advCol) * 0.5, uMorphCohesion * 0.38);
    }

    // Chromatic Dispersion when Liquified Screen Optical Refraction is active
    if (uLiquidScreen > 0.5 && uLiquidRefraction > 0.05) {
      float disp = uLiquidRefraction * 0.0045;
      col.r = texture2D(uTex, clamp(uv + vec2(disp, 0.0), 0.0, 1.0)).r;
      col.b = texture2D(uTex, clamp(uv - vec2(disp, 0.0), 0.0, 1.0)).b;
    }

    if (uTvEnabled > 0.5 && uTvChromaBleed > 0.01) {
      float offset = (0.003 + (uTvProfile > 2.5 ? 0.005 : 0.0)) * uTvChromaBleed;
      float rShift = texture2D(uTex, vec2(clamp(uv.x + offset, 0.0, 1.0), uv.y)).r;
      float bShift = texture2D(uTex, vec2(clamp(uv.x - offset, 0.0, 1.0), uv.y)).b;
      col.r = mix(col.r, rShift, 0.65 * uTvChromaBleed);
      col.b = mix(col.b, bShift, 0.65 * uTvChromaBleed);
    }

    // Motion-adaptive 3x Anisotropic Liquid 8K / 16K / 64K Sharpening & Cynthetoc Denoise
    if (uUpscale > 0.01 || (uCynthetocOn > 0.5 && uCynthetocDenoise > 0.05)) {
      vec3 n = texture2D(uTex, uv + vec2(0.0, uTexelSize.y)).rgb;
      vec3 s = texture2D(uTex, uv - vec2(0.0, uTexelSize.y)).rgb;
      vec3 e = texture2D(uTex, uv + vec2(uTexelSize.x, 0.0)).rgb;
      vec3 w = texture2D(uTex, uv - vec2(uTexelSize.x, 0.0)).rgb;
      vec3 blur = (n + s + e + w) * 0.25;
      vec3 detail = col - blur;
      float edgeWeight = clamp(length(n - s) + length(e - w), 0.0, 1.0);
      float motionDiff = clamp(length(col - prev.rgb) * 5.0, 0.0, 1.0);

      // Edge-preserving Cynthetoc neural denoise on flat regions
      if (uCynthetocOn > 0.5 && uCynthetocDenoise > 0.05) {
        col = mix(col, blur, uCynthetocDenoise * 0.34 * (1.0 - edgeWeight));
      }
      if (uUpscale > 0.01) {
        float neuralBoost = uCynthetocOn > 0.5 && uCynthetocMode > 0.5 && uCynthetocMode < 1.5 ? 1.32 : 1.0;
        col = col + detail * (uUpscale * 1.65 * neuralBoost * (0.45 + 0.55 * edgeWeight));
        col = mix(col, prev.rgb, uUpscale * 0.16 * (1.0 - motionDiff));
      }
    }

    if (uToonEnabled > 0.5) {
      col = applyVideoToCartoon(uv, col);
    }

    if (uSubtract > 0.5) {
      vec3 diff = abs(col - prev.rgb) * 4.5;
      vec3 inv = vec3(1.0) - col;
      col = clamp(inv * 0.72 + diff * 0.85, 0.0, 1.0);
    }

    if (uAtmosBlend > 0.01) {
      vec2 ac = uv - 0.5;
      float radial = exp(-dot(ac, ac) * 3.4);
      col += uSceneColor * radial * uAtmosBlend * 0.28 * uFusionGain;
    }

    // Cynthetoc AI Synthetic Reillumination & Rim Contour Enhancement
    if (uCynthetocOn > 0.5 && uCynthetocRelight > 0.02) {
      vec2 cu = uv - 0.5;
      float rDist = length(cu);
      float sweepKey = max(0.0, sin(uv.x * 3.14159 + uTime * 0.45) * 0.5 + 0.5);
      float rimHalo = smoothstep(0.18, 0.72, rDist) * uCynthetocRelight;
      float lC = getLuma(col);
      vec3 synthCol = mix(uSceneColor, vec3(0.45, 0.82, 1.0), 0.28 * sweepKey);
      col += synthCol * rimHalo * (0.14 + lC * 0.24) * (0.65 + uCynthetocStrength * 0.65);
    }

    col *= pow(2.0, uExposure);

    col.r *= 1.0 + uTemperature * 0.18 + uTint * 0.06;
    col.g *= 1.0 - uTint * 0.14;
    col.b *= 1.0 - uTemperature * 0.18 + uTint * 0.06;

    col = (col - 0.5) * uContrast + 0.5;

    float luma = getLuma(col);
    col = mix(vec3(luma), col, uSaturation);

    if (uRolloff > 0.01) {
      vec3 rolled = col / (1.0 + col * uRolloff * 1.25) * (1.0 + uRolloff * 0.55);
      col = mix(col, rolled, smoothstep(0.45, 1.0, luma) * uRolloff);
    }

    col = applyLut(col, uLut);

    if (uHalation > 0.01) {
      vec3 hal = vec3(0.0);
      for (int i = -2; i <= 2; i++) {
        for (int j = -1; j <= 1; j++) {
          vec2 tapUv = clamp(uv + vec2(float(i) * 4.5, float(j) * 4.5) * uTexelSize, 0.0, 1.0);
          vec3 tCol = texture2D(uTex, tapUv).rgb;
          float tLum = max(0.0, dot(tCol, vec3(0.3, 0.59, 0.11)) - 0.62);
          hal += tCol * tLum;
        }
      }
      hal /= 15.0;
      col += hal * vec3(1.18, 0.44, 0.18) * uHalation * 1.35;
    }

    // 3-Band Spectral Anamorphic Streak Flare
    if (uSqueeze > 0.5 && uFlare > 0.01) {
      float streakCore = 0.0;
      float streakWing = 0.0;
      for (int i = -4; i <= 4; i++) {
        float fi = float(i) * 5.0;
        vec3 tap = texture2D(uTex, vec2(clamp(uv.x + fi * uTexelSize.x, 0.0, 1.0), uv.y)).rgb;
        float tapLuma = max(0.0, dot(tap, vec3(0.3, 0.59, 0.11)) - 0.66);
        streakCore += tapLuma;
        vec3 wingTap = texture2D(uTex, vec2(clamp(uv.x + fi * 2.4 * uTexelSize.x, 0.0, 1.0), uv.y)).rgb;
        streakWing += max(0.0, dot(wingTap, vec3(0.3, 0.59, 0.11)) - 0.72);
      }
      streakCore = (streakCore / 9.0) * uFlare * 0.88;
      streakWing = (streakWing / 9.0) * uFlare * 0.42;
      col += uSceneColor * streakCore + vec3(0.28, 0.66, 1.0) * streakWing;
    }

    if (uFilmGrain > 0.01 && uTvEnabled < 0.5 && uToonEnabled < 0.5) {
      float grain = hash12(uv * uOutputRes + fract(uTime * 13.7) * 512.0) - 0.5;
      float weight = (1.0 - abs(luma - 0.5) * 1.1);
      col += grain * uFilmGrain * 0.12 * clamp(weight, 0.25, 1.0);
    }

    if (uTvEnabled > 0.5) {
      if (uTvBloom > 0.01) {
        col = max(col, prev.rgb * (0.28 * uTvBloom));
        float pGlow = max(0.0, dot(col, vec3(0.3, 0.59, 0.11)) - 0.55);
        col += col * pGlow * uTvBloom * 0.45;
      }

      if (uTvScanlines > 0.01) {
        float lineDensity = uTvProfile > 1.5 && uTvProfile < 2.5 ? 540.0 : 280.0;
        float interlace = mod(floor(uTime * 59.94), 2.0) * 1.57;
        float scan = 0.5 + 0.5 * sin(uv.y * lineDensity * 3.14159 * 2.0 + interlace);
        float scanStrength = uTvScanlines * (uTvProfile > 1.5 && uTvProfile < 2.5 ? 0.18 : 0.44);
        col *= mix(1.0, 0.58 + 0.42 * scan, scanStrength);
      }

      if (uTvProfile < 1.5) {
        float px = floor(gl_FragCoord.x);
        float sub = mod(px, 3.0);
        vec3 mask = sub < 0.5 ? vec3(1.12, 0.9, 0.9) : sub < 1.5 ? vec3(0.9, 1.12, 0.9) : vec3(0.9, 0.9, 1.12);
        if (uTvProfile < 0.5) {
          float py = mod(floor(gl_FragCoord.y), 2.0);
          mask *= mix(0.92, 1.06, py);
        }
        col = mix(col, col * mask, 0.48 * uTvScanlines);
      }

      vec2 vEdge = (uv - 0.5) * 2.0;
      float crtVig = 1.0 - dot(vEdge, vEdge) * (0.14 * uTvCurvature + 0.06);
      col *= clamp(crtVig, 0.6, 1.0) * tvMask;
    }

    if (uTheatreDim > 0.5 || uGateWeave > 0.05) {
      vec2 d = (uv - 0.5) * vec2(1.1, 1.35);
      float amt = uTheatreDim > 0.5 ? 0.24 : 0.12 * uGateWeave;
      float vig = 1.0 - dot(d, d) * amt;
      col *= clamp(vig, 0.72, 1.0);
    }

    // Interlaced even/odd scanline parity discard in 3D hardware pass
    if (uStereoParity < -0.5 && mod(floor(gl_FragCoord.y), 2.0) >= 0.5) {
      discard;
    }
    if (uStereoParity > 0.5 && mod(floor(gl_FragCoord.y), 2.0) < 0.5) {
      discard;
    }

    // Analog Stereoscopic 3D Separation Synthesis (Movie Mode & Pulfrich / Interlaced / SBS)
    if (uStereoOn > 0.5) {
      float edgeN = length(texture2D(uTex, clamp(uv + vec2(uTexelSize.x * 2.0, 0.0), 0.0, 1.0)).rgb - col);
      float depthMap = clamp(getLuma(col) * 0.68 + edgeN * 0.45, 0.0, 1.0);
      float shift = (depthMap - (0.48 + uStereoConv * 0.34)) * uStereoSep * uStereoDepth * 0.028;

      if (uStereoMode > 2.5 && uStereoMode < 3.5) {
        // Side-by-Side Stereo Pair
        float isRight = step(0.5, vUv.x);
        vec2 sbsUv = vec2(fract(vUv.x * 2.0) + (isRight < 0.5 ? shift : -shift), uv.y);
        sbsUv = clamp(sbsUv, 0.0, 1.0);
        col = texture2D(uTex, sbsUv).rgb;
        if (abs(vUv.x - 0.5) < 0.0025) col = vec3(1.0, 0.42, 0.0);
      } else {
        vec2 uvL = clamp(uv + vec2(shift, 0.0), 0.0, 1.0);
        vec2 uvR = clamp(uv - vec2(shift, 0.0), 0.0, 1.0);
        vec3 colL = mix(col, texture2D(uTex, uvL).rgb, 0.85);
        vec3 colR = mix(col, texture2D(uTex, uvR).rgb, 0.85);

        if (uStereoMode < 0.5) {
          // Analog Red / Cyan Anaglyph Synthesis
          float rOut = mix(getLuma(colL), colL.r, 0.55) + colR.r * uStereoCross;
          float gOut = colR.g * 0.92 + colL.g * uStereoCross;
          float bOut = colR.b * 0.98 + colL.b * uStereoCross;
          col = vec3(rOut, gOut, bOut);
        } else if (uStereoMode < 1.5) {
          // Amber / Blue ColorCode 3-D Analog Synthesis
          float amber = getLuma(colL) * 0.96;
          float rOut = mix(amber * 1.05, colL.r, 0.35) + colR.r * uStereoCross;
          float gOut = amber * 0.86 + colR.g * uStereoCross;
          float bOut = colR.b * 1.08 + colL.b * uStereoCross;
          col = vec3(rOut, gOut, bOut);
        } else if (uStereoMode < 2.5) {
          // Pulfrich Time-Delayed Parallax Analog 3D
          vec3 pulfrichR = mix(colR, prev.rgb, 0.38 + uStereoDepth * 0.25);
          col = mix(colL * vec3(1.04, 0.96, 0.92), pulfrichR * vec3(0.92, 0.98, 1.06), 0.5);
        } else {
          // Interlaced Field Analog 3D (even/odd lines)
          float rowParity = mod(floor(gl_FragCoord.y), 2.0);
          col = rowParity < 0.5 ? colL : colR;
        }
      }
    }

    // Holographic Liquid Glass Reflection + Main Image Optical Echo (Movie Mode)
    if (uHoloOn > 0.5) {
      vec2 hc = uv - 0.5;
      float r2 = dot(hc, hc);
      float fresnelEdge = pow(clamp(length(hc) * 1.45, 0.0, 1.0), 2.2);
      vec2 refractUv = clamp(uv + hc * (uHoloRefraction * 0.055 * (1.0 - r2)) + vec2(sin(uv.y * 14.0 + uTime * 2.2), cos(uv.x * 12.0 - uTime * 1.8)) * (uHoloRefraction * 0.008), 0.0, 1.0);
      vec2 reflUv = clamp(vec2(1.0 - uv.x, uv.y) * 0.85 + 0.075 + hc * (uHoloParallax * 0.06), 0.0, 1.0);
      float disp = uHoloChroma * 0.012;
      vec3 glassRefract = vec3(
        texture2D(uTex, clamp(refractUv + vec2(disp, 0.0), 0.0, 1.0)).r,
        texture2D(uTex, refractUv).g,
        texture2D(uTex, clamp(refractUv - vec2(disp, 0.0), 0.0, 1.0)).b
      );
      vec3 glassMirror = texture2D(uTex, reflUv).rgb;
      float interference = 0.5 + 0.5 * sin(gl_FragCoord.y * 1.4 - uTime * 7.5 + r2 * 22.0);
      float scanGate = mix(1.0, 0.72 + 0.28 * interference, uHoloScan);
      float causticRing = exp(-abs(length(hc) - (0.32 + 0.04 * sin(uTime * 1.6))) * 18.0) * uHoloCaustic;
      vec3 holoCyan = vec3(0.28, 0.88, 1.0);
      vec3 holoSpec = mix(uSceneColor, holoCyan, 0.58 + 0.25 * sin(uTime * 1.2 + uv.x * 5.0));
      vec3 holoComposite = mix(col, glassRefract, 0.35 * uHoloRefraction) +
                           glassMirror * (0.24 * uHoloReflect * (0.35 + fresnelEdge)) +
                           holoSpec * (fresnelEdge * 0.28 + causticRing * 0.45);
      col = mix(col, holoComposite * scanGate, 0.72);
    }

    // Kinetic Prism Harmonizer (On-Screen Matched Aura, Contour Rim & Spectral Balance)
    if (uHarmOn > 0.5) {
      vec2 hc = uv - 0.5;
      float hDist = length(hc);
      vec2 stepUv = uTexelSize * (1.8 + uHarmShift * 5.0);
      float lN = getLuma(texture2D(uTex, clamp(uv + vec2(0.0, stepUv.y), 0.0, 1.0)).rgb);
      float lS = getLuma(texture2D(uTex, clamp(uv - vec2(0.0, stepUv.y), 0.0, 1.0)).rgb);
      float lE = getLuma(texture2D(uTex, clamp(uv + vec2(stepUv.x, 0.0), 0.0, 1.0)).rgb);
      float lW = getLuma(texture2D(uTex, clamp(uv - vec2(stepUv.x, 0.0), 0.0, 1.0)).rgb);
      float edgeContour = clamp(length(vec2(lE - lW, lN - lS)) * 3.8, 0.0, 1.0);

      vec3 prismCol = vec3(
        texture2D(uTex, clamp(uv + hc * (0.008 * uHarmShift), 0.0, 1.0)).r,
        col.g,
        texture2D(uTex, clamp(uv - hc * (0.008 * uHarmShift), 0.0, 1.0)).b
      );
      vec3 glowTint = uHarmColor;
      if (uHarmMode > 0.5 && uHarmMode < 1.5) {
        // Golden Aura
        float goldenRing = exp(-abs(hDist - 0.382) * 14.0);
        glowTint = mix(uHarmColor, vec3(1.0, 0.68, 0.24), 0.52) * (0.55 + goldenRing * 0.9);
      } else if (uHarmMode > 1.5 && uHarmMode < 2.5) {
        // Prism Diffract
        float wave = 0.5 + 0.5 * sin(uv.x * 24.0 - uv.y * 16.0 + uTime * 2.4);
        glowTint = mix(uHarmColor, vec3(wave, 0.82 - wave * 0.35, 1.0 - wave * 0.4), 0.45);
      } else if (uHarmMode > 2.5) {
        // Thermal Echo
        float heat = clamp(getLuma(col) * 1.15, 0.0, 1.0);
        glowTint = mix(uHarmColor * 0.7, vec3(1.0, 0.42, 0.08), heat);
      }

      float radialAura = smoothstep(0.18, 0.78, hDist);
      float vigMask = 1.0 - smoothstep(0.32, 0.92, hDist) * (0.34 * uHarmVig);
      vec3 harmonized = mix(col, prismCol, 0.28 * uHarmStrength) +
                        glowTint * (edgeContour * uHarmEdge * 0.42) +
                        uHarmColor * (radialAura * uHarmStrength * 0.16);
      col = mix(col, harmonized * vigMask, clamp(0.45 + uHarmStrength * 0.5, 0.0, 0.95));
    }

    gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
  }
`;

// Liquified 3D & Liquid Brain App-Shape Shader: morphs, twists, explodes, and fuses Apps onto complete 3D geometries
const LIQUID_MESH_VERT_SRC = `
  precision mediump float;
  attribute vec3 aPos;
  attribute vec3 aNorm;
  attribute vec2 aUv;

  uniform mat4 uMvp;
  uniform vec3 uObjOffset;
  uniform vec3 uObjScale;
  uniform float uObjYaw;
  uniform float uMeshKind; // 0=floor, 1=coreOrb, 2=cone/torus, 3=appShapeBody
  uniform float uTime;
  uniform float uViscosity;
  uniform float uRippleForce;
  uniform float uPulseEnergy;
  uniform vec2 uRippleUv;
  uniform float uRippleAge;

  // Liquid Brain Shape Alteration uniforms
  uniform float uShapeMorph;
  uniform float uShapeTwist;
  uniform float uShapeExplode;
  uniform float uLiquidPressure;

  // Smart Morph 3D Natural Expansion
  uniform float uSmartMorphOn;
  uniform float uSmartMorphForce;
  uniform float uSmartMorphRate;
  uniform float uSmartMorphRadial;

  varying vec3 vWorldPos;
  varying vec3 vNormal;
  varying vec2 vUv;
  varying float vWaveHeight;

  void main() {
    vec3 localPos = aPos * uObjScale;
    vec3 localNorm = aNorm;

    // Helical Twist + Radial Explode + Liquid Morph for 3D App-Shape Projections
    if (uMeshKind > 2.5) {
      float twAngle = localPos.y * uShapeTwist * 1.45;
      float tc = cos(twAngle);
      float ts = sin(twAngle);
      localPos = vec3(
        localPos.x * tc - localPos.z * ts,
        localPos.y,
        localPos.x * ts + localPos.z * tc
      );
      localNorm = normalize(vec3(
        localNorm.x * tc - localNorm.z * ts,
        localNorm.y,
        localNorm.x * ts + localNorm.z * tc
      ));
      float shardSeed = 0.5 + 0.5 * sin(dot(aPos, vec3(7.3, 11.1, 5.7)));
      localPos += localNorm * (uShapeExplode * 0.45 * shardSeed);
    }

    float c = cos(uObjYaw);
    float s = sin(uObjYaw);
    vec3 rotPos = vec3(
      localPos.x * c - localPos.z * s,
      localPos.y,
      localPos.x * s + localPos.z * c
    );
    vec3 rotNorm = normalize(vec3(
      localNorm.x * c - localNorm.z * s,
      localNorm.y,
      localNorm.x * s + localNorm.z * c
    ));

    vec3 worldPos = rotPos + uObjOffset;
    float speed = 1.35 - uViscosity * 0.65;
    float waveH = 0.0;

    if (uMeshKind < 0.5) {
      float rDist = length(worldPos.xz);
      float w1 = sin(worldPos.x * 1.45 + uTime * speed * 1.8) * cos(worldPos.z * 1.25 - uTime * speed * 1.4);
      float w2 = sin(rDist * 2.8 - uTime * speed * 2.6) * exp(-rDist * 0.14);
      vec2 pWorld = (uRippleUv - 0.5) * 14.0;
      float pDist = length(worldPos.xz - pWorld);
      float pWave = sin(pDist * 3.6 - uRippleAge * 9.0) * exp(-uRippleAge * 1.8) * exp(-pDist * 0.35);
      waveH = (w1 * 0.055 + w2 * (0.09 + uPulseEnergy * 0.18) + pWave * 0.18 * uRippleForce);
      worldPos.y += waveH;
      rotNorm = normalize(vec3(
        -cos(worldPos.x * 1.45 + uTime * speed * 1.8) * 0.28,
        1.0,
        sin(worldPos.z * 1.25 - uTime * speed * 1.4) * 0.28
      ));
    } else if (uMeshKind < 1.5) {
      float harmonic =
        sin(aNorm.x * 5.0 + uTime * speed * 2.4) *
        cos(aNorm.y * 5.0 - uTime * speed * 1.9) *
        sin(aNorm.z * 5.0 + uTime * speed * 2.1);
      float spike = harmonic * (0.14 + uRippleForce * 0.14 + uPulseEnergy * 0.24);
      waveH = spike;
      worldPos += rotNorm * spike;
      rotNorm = normalize(rotNorm + vec3(harmonic * 0.35));
    } else if (uMeshKind < 2.5) {
      float cw = sin(localPos.y * 4.5 - uTime * speed * 3.0) * (0.04 + uPulseEnergy * 0.07);
      waveH = cw;
      worldPos.x += rotNorm.x * cw;
      worldPos.z += rotNorm.z * cw;
    } else {
      // Liquid Brain App-Shape fluid harmonic displacement
      float brainHarmonic =
        sin(aPos.x * 4.2 + uTime * speed * 2.0) *
        cos(aPos.y * 3.8 - uTime * speed * 1.7) *
        sin(aPos.z * 4.2 + uTime * speed * 2.3);
      float amp = uShapeMorph * (0.08 + uLiquidPressure * 0.24 + uPulseEnergy * 0.16);
      waveH = brainHarmonic * amp;
      worldPos += rotNorm * waveH;
      rotNorm = normalize(rotNorm + vec3(brainHarmonic * uShapeMorph * 0.4));
    }

    vWorldPos = worldPos;
    // Smart Morph 3D Natural Expansion along surface normal & golden-ratio radial trajectory
    if (uSmartMorphOn > 0.5 && uMeshKind > 0.5) {
      float mCycle = 0.55 + 0.45 * sin(uTime * uSmartMorphRate * 1.4 - length(worldPos) * 1.6);
      vec3 radDir3 = length(worldPos) > 0.001 ? normalize(worldPos) : rotNorm;
      vec3 natExpandDir = normalize(mix(rotNorm, radDir3, uSmartMorphRadial));
      float natAmt = uSmartMorphForce * mCycle * (uMeshKind > 2.5 ? 0.24 : 0.16);
      vWorldPos += natExpandDir * natAmt;
      waveH += natAmt;
    }
    vNormal = rotNorm;
    vUv = aUv;
    vWaveHeight = waveH;
    gl_Position = uMvp * vec4(vWorldPos, 1.0);
  }
`;

const LIQUID_MESH_FRAG_SRC = `
  precision mediump float;
  varying vec3 vWorldPos;
  varying vec3 vNormal;
  varying vec2 vUv;
  varying float vWaveHeight;

  uniform sampler2D uTex;
  uniform vec3 uCameraPos;
  uniform vec3 uSceneColor;
  uniform float uTime;
  uniform float uLiquidPreset; // 0:mercury, 1:moltenAmber, 2:ferrofluid, 3:iridescent, 4:liquidGlass
  uniform float uFresnel;
  uniform float uRefraction;
  uniform float uAlpha;
  uniform float uMeshKind;
  uniform float uFusionGain;
  uniform float uSubtract;

  // Liquid Brain App-Shape Fusion & Stereo Interlace Parity
  uniform vec3 uAppPrimaryCol;
  uniform vec3 uAppSecondaryCol;
  uniform float uFusedBlend;
  uniform float uAppSignature;
  uniform float uStereoParity;
  uniform float uHoloFloorReflect;

  void main() {
    if (uStereoParity < -0.5 && mod(floor(gl_FragCoord.y), 2.0) >= 0.5) {
      discard;
    }
    if (uStereoParity > 0.5 && mod(floor(gl_FragCoord.y), 2.0) < 0.5) {
      discard;
    }

    vec3 N = normalize(vNormal);
    vec3 V = normalize(uCameraPos - vWorldPos);
    vec3 R = reflect(-V, N);

    vec3 keyDir = normalize(vec3(0.45, 0.82, 0.65));
    vec3 rimDir = normalize(vec3(-0.35, 0.55, -0.95));
    vec3 fillDir = normalize(vec3(-0.8, 0.35, 0.4));

    float diffKey = max(0.0, dot(N, keyDir));
    float diffFill = max(0.0, dot(N, fillDir));

    vec3 Hkey = normalize(keyDir + V);
    vec3 Hrim = normalize(rimDir + V);
    float specKey = pow(max(0.0, dot(N, Hkey)), 48.0);
    float specRim = pow(max(0.0, dot(N, Hrim)), 32.0);
    float fres = pow(1.0 - max(0.0, dot(N, V)), 2.6) * (0.35 + uFresnel * 0.85);

    vec2 reflUv = clamp(
      vec2(0.5 + (vWorldPos.x * 0.11) + R.x * (0.22 + uRefraction * 0.3), 0.55 - R.y * 0.35 - vWorldPos.z * 0.045),
      0.02,
      0.98
    );
    vec2 projUv = clamp(vUv + N.xz * (uRefraction * 0.08), 0.01, 0.99);
    vec3 envVideo = texture2D(uTex, uMeshKind > 2.5 ? mix(projUv, reflUv, 0.32) : reflUv).rgb;
    if (uSubtract > 0.5) {
      envVideo = vec3(1.0) - envVideo;
    }

    vec3 baseCol = vec3(0.05, 0.05, 0.06);
    vec3 specCol = uSceneColor;
    float outAlpha = uAlpha;

    if (uLiquidPreset < 0.5) {
      baseCol = vec3(0.22, 0.24, 0.27);
      specCol = vec3(0.95, 0.97, 1.0);
      baseCol = mix(baseCol, envVideo * 1.15, 0.68);
    } else if (uLiquidPreset < 1.5) {
      baseCol = vec3(0.06, 0.03, 0.02);
      float vein = smoothstep(0.02, 0.14, abs(vWaveHeight) * 1.4 + fres * 0.45);
      baseCol += uSceneColor * vein * 0.9 * uFusionGain;
      baseCol = mix(baseCol, envVideo * vec3(1.15, 0.82, 0.45), 0.45);
      specCol = mix(uSceneColor, vec3(1.0, 0.84, 0.5), 0.55);
    } else if (uLiquidPreset < 2.5) {
      baseCol = vec3(0.018, 0.018, 0.022);
      baseCol = mix(baseCol, envVideo * 0.72, fres * 0.65);
      specCol = mix(vec3(0.88, 0.92, 0.98), uSceneColor, 0.45);
    } else if (uLiquidPreset < 3.5) {
      float phase = dot(N, V) * 4.5 + uTime * 0.9 + vWaveHeight * 6.0;
      vec3 irid = 0.5 + 0.5 * cos(phase + vec3(0.0, 2.1, 4.2));
      baseCol = mix(vec3(0.05, 0.06, 0.09), irid * 0.68, 0.55 + fres * 0.4);
      baseCol = mix(baseCol, envVideo * 1.1, 0.42);
      specCol = mix(irid, vec3(1.0), 0.45);
    } else {
      vec2 glassUv = clamp(reflUv + N.xz * (uRefraction * 0.16), 0.02, 0.98);
      vec3 refr = vec3(
        texture2D(uTex, glassUv + vec2(0.008 * uRefraction, 0.0)).r,
        texture2D(uTex, glassUv).g,
        texture2D(uTex, glassUv - vec2(0.008 * uRefraction, 0.0)).b
      );
      baseCol = mix(vec3(0.07, 0.11, 0.15), refr * 1.25, 0.78);
      specCol = vec3(0.92, 0.97, 1.0);
      outAlpha = clamp(uAlpha * 0.82, 0.35, 0.95);
    }

    // App-Shape Optical Projection & Dual-App Fusion Seam (uMeshKind > 2.5)
    if (uMeshKind > 2.5) {
      float lattice = smoothstep(0.86, 0.97, abs(sin(vUv.x * 28.0 + uTime * 0.6))) +
                      smoothstep(0.86, 0.97, abs(sin(vUv.y * 28.0 - uTime * 0.5)));
      float fusionWave = 0.5 + 0.5 * sin(vWorldPos.y * 7.5 + vUv.x * 6.283 + uTime * 2.4);
      vec3 appCol = mix(uAppPrimaryCol, uAppSecondaryCol, fusionWave * uFusedBlend);
      baseCol = mix(baseCol, envVideo * 0.92 + appCol * 0.28, 0.62);
      baseCol += appCol * clamp(lattice, 0.0, 1.0) * (0.28 + uFusedBlend * 0.35);
      // App signature micro-modulation
      if (uAppSignature > 3.5 && uAppSignature < 4.5) {
        baseCol *= 0.8 + 0.2 * sin(vUv.y * 120.0 + uTime * 8.0);
      } else if (uAppSignature > 1.5 && uAppSignature < 2.5) {
        baseCol = floor(baseCol * 5.0 + 0.5) / 5.0;
      }
      specCol = mix(specCol, appCol, 0.55);
    }

    if (uMeshKind < 0.5) {
      float floorFade = 1.0 - smoothstep(6.0, 12.2, length(vWorldPos.xz));
      outAlpha *= floorFade;
    }

    vec3 lit =
      baseCol * (0.28 + diffKey * 0.68 + diffFill * 0.22) +
      specCol * (specKey * 0.85 + specRim * 0.65) +
      mix(uSceneColor, envVideo, 0.5) * fres * 0.9;

    // Inverted Main-Image Liquid Glass Caustic Mirror on Basin when Hologram Engine is active
    if (uHoloFloorReflect > 0.05 && uMeshKind < 0.5) {
      vec2 invUv = clamp(vec2(0.5 + vWorldPos.x * 0.125, 0.5 + vWorldPos.z * 0.145) + N.xz * 0.08, 0.02, 0.98);
      vec3 mirrorMain = vec3(
        texture2D(uTex, clamp(invUv + vec2(0.008, 0.0), 0.0, 1.0)).r,
        texture2D(uTex, invUv).g,
        texture2D(uTex, clamp(invUv - vec2(0.008, 0.0), 0.0, 1.0)).b
      );
      float basinFocus = exp(-length(vWorldPos.xz) * 0.38);
      float causticWave = 0.5 + 0.5 * sin(length(vWorldPos.xz) * 6.5 - uTime * 3.8 + vWaveHeight * 14.0);
      lit += mirrorMain * basinFocus * uHoloFloorReflect * (0.42 + 0.35 * causticWave) +
             mix(uSceneColor, vec3(0.32, 0.88, 1.0), 0.5) * basinFocus * causticWave * uHoloFloorReflect * 0.24;
    }

    gl_FragColor = vec4(clamp(lit, 0.0, 1.0), outAlpha);
  }
`;

// Dedicated Holographic Projection & Liquid Glass Reflection Engine Shaders
const HOLOGRAM_VERT_SRC = `
  precision mediump float;
  attribute vec3 aPos;
  attribute vec3 aNorm;
  attribute vec2 aUv;

  uniform mat4 uMvp;
  uniform vec3 uHoloOffset;
  uniform vec3 uHoloScale;
  uniform float uHoloYaw;
  uniform float uTime;
  uniform float uHoloKind; // 0=pyramidGlass, 1=volumetricSlice, 2=prismShell
  uniform float uSliceNorm; // -1.0 to 1.0 across focal depth stack
  uniform float uParallaxDepth;
  uniform float uGlassRefraction;

  varying vec3 vWorldPos;
  varying vec3 vNormal;
  varying vec2 vUv;
  varying float vRipple;

  void main() {
    vec3 p = aPos * uHoloScale;
    vec3 n = aNorm;

    if (uHoloKind > 0.5 && uHoloKind < 1.5) {
      // Depth-modulated floating relief wave on focal hologram slices
      float wave = sin(aUv.x * 9.0 + uTime * 2.1 + uSliceNorm * 3.0) *
                   cos(aUv.y * 7.0 - uTime * 1.7) * 0.045 * (0.35 + uGlassRefraction);
      p.z += wave + uSliceNorm * uParallaxDepth * 0.14;
      n = normalize(n + vec3(wave * 2.5, wave * 1.8, 0.0));
    } else {
      float glassRip = sin(p.y * 5.0 + uTime * 2.4) * cos(p.x * 4.5 - uTime * 1.9) * 0.025 * uGlassRefraction;
      p += n * glassRip;
      n = normalize(n + vec3(glassRip * 3.0, 0.0, glassRip * 3.0));
    }

    float cy = cos(uHoloYaw);
    float sy = sin(uHoloYaw);
    vec3 rotP = vec3(p.x * cy - p.z * sy, p.y, p.x * sy + p.z * cy);
    vec3 rotN = normalize(vec3(n.x * cy - n.z * sy, n.y, n.x * sy + n.z * cy));

    vWorldPos = rotP + uHoloOffset;
    vNormal = rotN;
    vUv = aUv;
    vRipple = sin(vWorldPos.y * 8.0 + uTime * 3.2);
    gl_Position = uMvp * vec4(vWorldPos, 1.0);
  }
`;

const HOLOGRAM_FRAG_SRC = `
  precision mediump float;
  varying vec3 vWorldPos;
  varying vec3 vNormal;
  varying vec2 vUv;
  varying float vRipple;

  uniform sampler2D uTex;
  uniform vec3 uCameraPos;
  uniform vec3 uSceneColor;
  uniform float uTime;
  uniform float uHoloKind; // 0=pyramidGlass, 1=volumetricSlice, 2=prismShell
  uniform float uSliceNorm;
  uniform float uGlassRefraction;
  uniform float uReflectionMix;
  uniform float uChromaticSplit;
  uniform float uParallaxDepth;
  uniform float uScanCoherence;
  uniform float uCausticFocus;
  uniform float uSubtract;
  uniform float uStereoParity;

  float holoLuma(vec3 c) {
    return dot(c, vec3(0.2126, 0.7152, 0.0722));
  }

  void main() {
    if (uStereoParity < -0.5 && mod(floor(gl_FragCoord.y), 2.0) >= 0.5) {
      discard;
    }
    if (uStereoParity > 0.5 && mod(floor(gl_FragCoord.y), 2.0) < 0.5) {
      discard;
    }

    vec3 N = normalize(vNormal);
    vec3 V = normalize(uCameraPos - vWorldPos);
    if (!gl_FrontFacing) N = -N;
    vec3 R = reflect(-V, N);

    // 1. Main Image Holographic Relief Parallax Sampling
    vec3 probeSample = texture2D(uTex, vUv).rgb;
    float relief = holoLuma(probeSample);
    vec2 viewParallax = vec2(dot(V.xz, vec2(1.0, 0.0)), V.y) * ((relief - 0.35) * uParallaxDepth * 0.065);
    vec2 sliceUv = clamp(vUv + viewParallax + N.xy * (uGlassRefraction * 0.035), 0.01, 0.99);

    // 2. Cauchy Chromatic Dispersion through Liquid Glass Medium
    float disp = uChromaticSplit * (0.008 + uGlassRefraction * 0.012);
    vec3 holoMain = vec3(
      texture2D(uTex, clamp(sliceUv + vec2(disp, 0.0), 0.0, 1.0)).r,
      texture2D(uTex, sliceUv).g,
      texture2D(uTex, clamp(sliceUv - vec2(disp, 0.0), 0.0, 1.0)).b
    );

    // 3. Real-Time Liquid Glass Reflection of Main Image
    vec2 reflUv = clamp(
      vec2(0.5 + R.x * (0.34 + uGlassRefraction * 0.18), 0.52 - R.y * 0.38),
      0.02,
      0.98
    );
    vec3 glassReflect = vec3(
      texture2D(uTex, clamp(reflUv + vec2(disp * 1.4, 0.0), 0.0, 1.0)).r,
      texture2D(uTex, reflUv).g,
      texture2D(uTex, clamp(reflUv - vec2(disp * 1.4, 0.0), 0.0, 1.0)).b
    );

    if (uSubtract > 0.5) {
      holoMain = vec3(1.0) - holoMain;
      glassReflect = vec3(1.0) - glassReflect;
    }

    float fresnel = pow(1.0 - max(0.0, dot(N, V)), 2.2);
    vec3 holoTint = mix(vec3(0.28, 0.9, 1.0), uSceneColor, 0.38 + 0.25 * sin(uTime * 1.1));

    // Optical phase scanline interference fringes
    float fringe = 0.5 + 0.5 * sin(gl_FragCoord.y * 1.55 - uTime * 8.0 + uSliceNorm * 6.0);
    float scanFactor = mix(1.0, 0.55 + 0.45 * fringe, uScanCoherence);

    // Caustic edge beam highlight
    float edgeDist = min(min(vUv.x, 1.0 - vUv.x), min(vUv.y, 1.0 - vUv.y));
    float bezel = (1.0 - smoothstep(0.0, 0.055, edgeDist)) * (0.35 + uCausticFocus * 0.65);

    vec3 combined = mix(holoMain, glassReflect * 1.25, uReflectionMix * (uHoloKind < 0.5 || uHoloKind > 1.5 ? 0.62 : 0.34));
    combined += holoTint * (fresnel * 0.48 + bezel * 0.45 + max(0.0, vRipple) * 0.12 * uCausticFocus);
    combined *= scanFactor;

    float lum = holoLuma(holoMain);
    float alpha;
    if (uHoloKind > 0.5 && uHoloKind < 1.5) {
      // Volumetric Focal Slice: transparent void, luminous subject
      float sliceEnvelope = 1.0 - abs(uSliceNorm) * 0.35;
      alpha = clamp((smoothstep(0.06, 0.55, lum) * 0.72 + fresnel * 0.25 + bezel * 0.3) * sliceEnvelope, 0.04, 0.88);
    } else {
      // Pepper's Ghost Liquid Glass Pyramid & Prism Shell: specular Fresnel + reflected main image
      alpha = clamp(0.14 + fresnel * 0.55 + holoLuma(glassReflect) * uReflectionMix * 0.36 + bezel * 0.35, 0.1, 0.9);
    }

    gl_FragColor = vec4(clamp(combined, 0.0, 1.0), alpha);
  }
`;

const LINE_VERT_SRC = `
  precision mediump float;
  attribute vec3 aPos;
  uniform mat4 uMvp;
  void main() {
    gl_Position = uMvp * vec4(aPos, 1.0);
  }
`;

const LINE_FRAG_SRC = `
  precision mediump float;
  uniform vec4 uColor;
  void main() {
    gl_FragColor = uColor;
  }
`;

function compileShader(gl: WebGLRenderingContext, type: number, src: string): WebGLShader {
  const s = gl.createShader(type);
  if (!s) throw new Error('Failed to create WebGL shader');
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    const info = gl.getShaderInfoLog(s) || 'Shader compile error';
    gl.deleteShader(s);
    throw new Error(info);
  }
  return s;
}

function createProgram(gl: WebGLRenderingContext, vsSrc: string, fsSrc: string): WebGLProgram {
  const vs = compileShader(gl, gl.VERTEX_SHADER, vsSrc);
  const fs = compileShader(gl, gl.FRAGMENT_SHADER, fsSrc);
  const prog = gl.createProgram();
  if (!prog) throw new Error('Failed to create WebGL program');
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    const info = gl.getProgramInfoLog(prog) || 'Program link error';
    gl.deleteProgram(prog);
    throw new Error(info);
  }
  gl.deleteShader(vs);
  gl.deleteShader(fs);
  return prog;
}

export class CinemaScopeEngine {
  private canvas: HTMLCanvasElement;
  private fallbackCanvas: HTMLCanvasElement | null = null;
  private gl: WebGLRenderingContext | null = null;
  private ctx2d: CanvasRenderingContext2D | null = null;
  private contextLost = false;

  private screenProg: WebGLProgram | null = null;
  private liquidProg: WebGLProgram | null = null;
  private hologramProg: WebGLProgram | null = null;
  private lineProg: WebGLProgram | null = null;
  private texCurr: WebGLTexture | null = null;
  private texPrev: WebGLTexture | null = null;
  private prevSnapshotCanvas: HTMLCanvasElement;
  private prevSnapshotCtx: CanvasRenderingContext2D | null;

  private screenPosBuf: WebGLBuffer | null = null;
  private screenUvBuf: WebGLBuffer | null = null;
  private lineBuf: WebGLBuffer | null = null;
  private screenVertexCount = 0;
  private lastCurvature = -1;
  private lastScreenAspect = -1;

  private floorMesh: MeshGeometry = { posBuf: null, normBuf: null, uvBuf: null, vertexCount: 0 };
  private orbMesh: MeshGeometry = { posBuf: null, normBuf: null, uvBuf: null, vertexCount: 0 };
  private coneMesh: MeshGeometry = { posBuf: null, normBuf: null, uvBuf: null, vertexCount: 0 };
  private torusMesh: MeshGeometry = { posBuf: null, normBuf: null, uvBuf: null, vertexCount: 0 };
  private cubeMesh: MeshGeometry = { posBuf: null, normBuf: null, uvBuf: null, vertexCount: 0 };
  private prismMesh: MeshGeometry = { posBuf: null, normBuf: null, uvBuf: null, vertexCount: 0 };
  private mobiusMesh: MeshGeometry = { posBuf: null, normBuf: null, uvBuf: null, vertexCount: 0 };
  private holoPyramidMesh: MeshGeometry = { posBuf: null, normBuf: null, uvBuf: null, vertexCount: 0 };
  private holoSliceMesh: MeshGeometry = { posBuf: null, normBuf: null, uvBuf: null, vertexCount: 0 };
  private uniformCache = new WeakMap<WebGLProgram, Map<string, WebGLUniformLocation | null>>();

  public camera: Camera3DState = {
    yaw: 0.24,
    pitch: 0.18,
    distance: 9.6,
    targetX: 0,
    targetY: 0.9,
    targetZ: -1.4,
  };

  private targetCamera: Camera3DState = { ...this.camera };
  private isPointerInteracting = false;
  private rippleUv: [number, number] = [0.5, 0.5];
  private rippleStartTime = -10;

  private keysDown = new Set<string>();
  private lastSourceW = 1434;
  private lastSourceH = 600;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.prevSnapshotCanvas = document.createElement('canvas');
    this.prevSnapshotCanvas.width = 640;
    this.prevSnapshotCanvas.height = 268;
    this.prevSnapshotCtx = this.prevSnapshotCanvas.getContext('2d', { alpha: false });

    this.initContext();
    this.bindContextListeners();
  }

  private bindContextListeners() {
    this.canvas.addEventListener('webglcontextlost', (e) => {
      e.preventDefault();
      this.contextLost = true;
    });
    this.canvas.addEventListener('webglcontextrestored', () => {
      this.contextLost = false;
      this.initContext();
    });
  }

  private uploadMesh(
    gl: WebGLRenderingContext,
    data: { pos: number[]; norm: number[]; uv: number[] }
  ): MeshGeometry {
    const posBuf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data.pos), gl.STATIC_DRAW);

    const normBuf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, normBuf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data.norm), gl.STATIC_DRAW);

    const uvBuf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, uvBuf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data.uv), gl.STATIC_DRAW);

    return { posBuf, normBuf, uvBuf, vertexCount: data.pos.length / 3 };
  }

  private activate2DFallback() {
    this.gl = null;
    const directCtx = this.canvas.getContext('2d', { alpha: false });
    if (directCtx) {
      this.ctx2d = directCtx;
      return;
    }
    // Canvas already locked to WebGL context: mount a sibling 2D canvas cleanly
    if (!this.fallbackCanvas) {
      const fb = document.createElement('canvas');
      fb.className = this.canvas.className;
      fb.style.position = 'absolute';
      fb.style.inset = '0';
      fb.style.width = '100%';
      fb.style.height = '100%';
      fb.style.pointerEvents = 'none';
      this.canvas.parentElement?.insertBefore(fb, this.canvas.nextSibling);
      this.fallbackCanvas = fb;
    }
    this.canvas.style.opacity = '0';
    this.ctx2d = this.fallbackCanvas.getContext('2d', { alpha: false });
  }

  private getUniformLoc(
    gl: WebGLRenderingContext,
    prog: WebGLProgram,
    name: string
  ): WebGLUniformLocation | null {
    let cache = this.uniformCache.get(prog);
    if (!cache) {
      cache = new Map();
      this.uniformCache.set(prog, cache);
    }
    if (cache.has(name)) {
      return cache.get(name) ?? null;
    }
    const loc = gl.getUniformLocation(prog, name);
    cache.set(name, loc);
    return loc;
  }

  private initContext() {
    try {
      const gl = this.canvas.getContext('webgl', {
        alpha: false,
        antialias: true,
        preserveDrawingBuffer: true,
        powerPreference: 'high-performance',
      });
      if (!gl) {
        this.activate2DFallback();
        return;
      }
      this.gl = gl;
      this.screenProg = createProgram(gl, SCREEN_VERT_SRC, SCREEN_FRAG_SRC);
      this.lineProg = createProgram(gl, LINE_VERT_SRC, LINE_FRAG_SRC);

      this.texCurr = this.createVideoTexture(gl);
      this.texPrev = this.createVideoTexture(gl);

      this.screenPosBuf = gl.createBuffer();
      this.screenUvBuf = gl.createBuffer();
      this.lineBuf = gl.createBuffer();

      try {
        this.liquidProg = createProgram(gl, LIQUID_MESH_VERT_SRC, LIQUID_MESH_FRAG_SRC);
        this.hologramProg = createProgram(gl, HOLOGRAM_VERT_SRC, HOLOGRAM_FRAG_SRC);
        this.floorMesh = this.uploadMesh(gl, buildPlaneData(24, 24, 44, 44, -0.52));
        this.orbMesh = this.uploadMesh(gl, buildSphereData(0.68, 30, 38));
        this.coneMesh = this.uploadMesh(gl, buildConeData(0.62, 1.35, 32));
        this.torusMesh = this.uploadMesh(gl, buildTorusData(1.85, 0.085, 48, 16));
        this.cubeMesh = this.uploadMesh(gl, buildCubeData(0.92, 8));
        this.prismMesh = this.uploadMesh(gl, buildOctaPrismData(0.68, 0.88, 6, 4));
        this.mobiusMesh = this.uploadMesh(gl, buildMobiusData(0.76, 0.24, 48, 10));
        this.holoPyramidMesh = this.uploadMesh(gl, buildHoloPyramidData(1.85, 0.34, 1.75));
        this.holoSliceMesh = this.uploadMesh(gl, buildHoloSliceQuadData(2.6, 1.12, 24, 12));
      } catch (liquidErr) {
        console.warn('Liquified 3D / Hologram shader fallback to wireframe:', liquidErr);
        this.liquidProg = null;
        this.hologramProg = null;
      }
    } catch (err) {
      console.warn('WebGL init failed, activating 2D canvas fallback:', err);
      this.activate2DFallback();
    }
  }

  private createVideoTexture(gl: WebGLRenderingContext): WebGLTexture | null {
    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      1,
      1,
      0,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      new Uint8Array([5, 5, 6, 255])
    );
    return tex;
  }

  public injectRipple(normX: number, normY: number, nowSec: number) {
    this.rippleUv = [
      Math.max(0, Math.min(1, normX)),
      Math.max(0, Math.min(1, normY)),
    ];
    this.rippleStartTime = nowSec;
  }

  public setPointerInteracting(active: boolean) {
    this.isPointerInteracting = active;
  }

  public setCameraPreset(preset: 'audience' | 'booth' | 'origin' | 'free') {
    if (preset === 'audience') {
      this.targetCamera = {
        yaw: 0.16,
        pitch: 0.16,
        distance: 9.8,
        targetX: 0,
        targetY: 0.9,
        targetZ: -1.6,
      };
    } else if (preset === 'booth') {
      this.targetCamera = {
        yaw: 0.0,
        pitch: 0.25,
        distance: 12.6,
        targetX: 0,
        targetY: 1.15,
        targetZ: -2.4,
      };
    } else if (preset === 'origin') {
      this.targetCamera = {
        yaw: 0.68,
        pitch: 0.34,
        distance: 4.8,
        targetX: 0,
        targetY: 0.55,
        targetZ: 0,
      };
    }
  }

  public orbit(dx: number, dy: number) {
    this.targetCamera.yaw += dx * 0.0065;
    this.targetCamera.pitch = Math.max(
      -0.35,
      Math.min(1.25, this.targetCamera.pitch + dy * 0.0055)
    );
  }

  public pan(dx: number, dy: number) {
    const rightX = Math.cos(this.targetCamera.yaw);
    const rightZ = -Math.sin(this.targetCamera.yaw);
    const scale = this.targetCamera.distance * 0.0014;
    this.targetCamera.targetX -= rightX * dx * scale;
    this.targetCamera.targetZ -= rightZ * dx * scale;
    this.targetCamera.targetY += dy * scale;
  }

  public zoom(delta: number) {
    this.targetCamera.distance = Math.max(
      2.4,
      Math.min(22.0, this.targetCamera.distance + delta * 0.008)
    );
  }

  public setKeyDown(key: string, down: boolean) {
    const k = key.toLowerCase();
    if (down) this.keysDown.add(k);
    else this.keysDown.delete(k);
  }

  public clearKeys() {
    this.keysDown.clear();
  }

  public updateTraversal(dtSec: number, state: FractalStudioState) {
    // Auto-orbit gently in Liquified 3D mode when idle
    if (
      state.mode === '3d' &&
      state.liquified3d.enabled &&
      state.liquified3d.autoOrbit &&
      !this.isPointerInteracting &&
      !state.realFpsMode &&
      this.keysDown.size === 0
    ) {
      this.targetCamera.yaw += dtSec * 0.14 * state.sceneDesigner.motionSpeed;
    }

    if (state.realFpsMode && this.keysDown.size > 0) {
      const speed = 5.6 * dtSec;
      const fwdX = -Math.sin(this.targetCamera.yaw);
      const fwdZ = -Math.cos(this.targetCamera.yaw);
      const rightX = Math.cos(this.targetCamera.yaw);
      const rightZ = -Math.sin(this.targetCamera.yaw);

      if (this.keysDown.has('w') || this.keysDown.has('arrowup')) {
        this.targetCamera.targetX += fwdX * speed;
        this.targetCamera.targetZ += fwdZ * speed;
      }
      if (this.keysDown.has('s') || this.keysDown.has('arrowdown')) {
        this.targetCamera.targetX -= fwdX * speed;
        this.targetCamera.targetZ -= fwdZ * speed;
      }
      if (this.keysDown.has('a') || this.keysDown.has('arrowleft')) {
        this.targetCamera.targetX -= rightX * speed;
        this.targetCamera.targetZ -= rightZ * speed;
      }
      if (this.keysDown.has('d') || this.keysDown.has('arrowright')) {
        this.targetCamera.targetX += rightX * speed;
        this.targetCamera.targetZ += rightZ * speed;
      }
      if (this.keysDown.has('e')) {
        this.targetCamera.targetY += speed * 0.7;
      }
      if (this.keysDown.has('q')) {
        this.targetCamera.targetY = Math.max(-0.5, this.targetCamera.targetY - speed * 0.7);
      }
    }

    // Smooth camera damping/lerp
    const k = 1 - Math.exp(-dtSec * 10);
    this.camera.yaw += (this.targetCamera.yaw - this.camera.yaw) * k;
    this.camera.pitch += (this.targetCamera.pitch - this.camera.pitch) * k;
    this.camera.distance += (this.targetCamera.distance - this.camera.distance) * k;
    this.camera.targetX += (this.targetCamera.targetX - this.camera.targetX) * k;
    this.camera.targetY += (this.targetCamera.targetY - this.camera.targetY) * k;
    this.camera.targetZ += (this.targetCamera.targetZ - this.camera.targetZ) * k;
  }

  public resizeToDisplay(upscaleMode: UpscaleTier) {
    const rect = this.canvas.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return;
    const baseDpr = Math.min(window.devicePixelRatio || 1, 2);
    const boost = upscaleMode === '64k' ? 1.5 : upscaleMode === '16k' ? 1.25 : upscaleMode === '8k' ? 1.1 : 1.0;
    const dpr = Math.min(2.5, baseDpr * boost);
    const targetW = Math.max(2, Math.floor(rect.width * dpr));
    const targetH = Math.max(2, Math.floor(rect.height * dpr));
    if (this.canvas.width !== targetW || this.canvas.height !== targetH) {
      this.canvas.width = targetW;
      this.canvas.height = targetH;
    }
    if (
      this.fallbackCanvas &&
      (this.fallbackCanvas.width !== targetW || this.fallbackCanvas.height !== targetH)
    ) {
      this.fallbackCanvas.width = targetW;
      this.fallbackCanvas.height = targetH;
    }
  }

  public getTargetAspect(state: FractalStudioState, srcW = this.lastSourceW, srcH = this.lastSourceH): number {
    if (state.realTv.enabled) {
      return state.realTv.profile === 'crt' || state.realTv.profile === 'vhs' ? 4 / 3 : 16 / 9;
    }
    if (!state.anamorphicSqueeze) {
      return srcW / Math.max(1, srcH);
    }
    return ASPECT_RATIO_MAP[state.cinema.aspectRatio] ?? 2.39;
  }

  private ensure3DScreenGeometry(gl: WebGLRenderingContext, curvature: number, aspect: number) {
    if (
      Math.abs(this.lastCurvature - curvature) < 0.001 &&
      Math.abs(this.lastScreenAspect - aspect) < 0.001 &&
      this.screenVertexCount > 0
    ) {
      return;
    }
    this.lastCurvature = curvature;
    this.lastScreenAspect = aspect;

    const width = 8.6;
    const height = width / Math.max(1.1, aspect);
    const segs = 32;
    const positions: number[] = [];
    const uvs: number[] = [];

    const yBot = 0.25;
    const yTop = yBot + height;
    const zBase = -4.2;

    for (let i = 0; i < segs; i++) {
      const u0 = i / segs;
      const u1 = (i + 1) / segs;
      const x0 = (u0 - 0.5) * width;
      const x1 = (u1 - 0.5) * width;
      const z0 = zBase + Math.pow((u0 - 0.5) * 2.0, 2.0) * curvature * 1.45;
      const z1 = zBase + Math.pow((u1 - 0.5) * 2.0, 2.0) * curvature * 1.45;

      positions.push(x0, yBot, z0, x1, yBot, z1, x1, yTop, z1);
      uvs.push(u0, 1, u1, 1, u1, 0);

      positions.push(x0, yBot, z0, x1, yTop, z1, x0, yTop, z0);
      uvs.push(u0, 1, u1, 0, u0, 0);
    }

    this.screenVertexCount = positions.length / 3;
    gl.bindBuffer(gl.ARRAY_BUFFER, this.screenPosBuf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.screenUvBuf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uvs), gl.STATIC_DRAW);
  }

  private drawLines(
    gl: WebGLRenderingContext,
    mvp: Float32Array,
    verts: number[],
    r: number,
    g: number,
    b: number,
    a: number,
    mode: number = gl.LINES
  ) {
    if (!this.lineProg || !this.lineBuf || verts.length === 0) return;
    gl.useProgram(this.lineProg);
    gl.uniformMatrix4fv(this.getUniformLoc(gl, this.lineProg, 'uMvp'), false, mvp);
    gl.uniform4f(this.getUniformLoc(gl, this.lineProg, 'uColor'), r, g, b, a);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.lineBuf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.DYNAMIC_DRAW);
    const loc = gl.getAttribLocation(this.lineProg, 'aPos');
    if (loc >= 0) {
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, 3, gl.FLOAT, false, 0, 0);
      gl.drawArrays(mode, 0, verts.length / 3);
      gl.disableVertexAttribArray(loc);
    }
  }

  private getShapeMesh(shape: AppShapeTopologyId): MeshGeometry {
    switch (shape) {
      case 'sphere':
        return this.orbMesh;
      case 'torus':
        return this.torusMesh;
      case 'cube':
        return this.cubeMesh;
      case 'octaPrism':
        return this.prismMesh;
      case 'cone':
        return this.coneMesh;
      case 'mobiusRibbon':
      default:
        return this.mobiusMesh;
    }
  }

  private drawLiquidMesh(
    gl: WebGLRenderingContext,
    mesh: MeshGeometry,
    mvp: Float32Array,
    eye: [number, number, number],
    state: FractalStudioState,
    timeSec: number,
    meshKind: number,
    offset: [number, number, number],
    scale: [number, number, number],
    yaw: number,
    alpha: number,
    appOpts?: {
      primaryCol: [number, number, number];
      secondaryCol: [number, number, number];
      fusedBlend: number;
      appSig: number;
      stereoParity: number;
    }
  ) {
    if (!this.liquidProg || !mesh.posBuf || !mesh.normBuf || !mesh.uvBuf || mesh.vertexCount === 0) {
      return;
    }
    const prog = this.liquidProg;
    gl.useProgram(prog);

    gl.uniformMatrix4fv(this.getUniformLoc(gl, prog, 'uMvp'), false, mvp);
    gl.uniform1i(this.getUniformLoc(gl, prog, 'uTex'), 0);
    gl.uniform3f(this.getUniformLoc(gl, prog, 'uCameraPos'), eye[0], eye[1], eye[2]);

    const [sr, sg, sb] = getSceneThemeRgb(state.sceneDesigner.theme);
    gl.uniform3f(this.getUniformLoc(gl, prog, 'uSceneColor'), sr, sg, sb);
    gl.uniform1f(this.getUniformLoc(gl, prog, 'uTime'), timeSec);

    gl.uniform3f(this.getUniformLoc(gl, prog, 'uObjOffset'), offset[0], offset[1], offset[2]);
    gl.uniform3f(this.getUniformLoc(gl, prog, 'uObjScale'), scale[0], scale[1], scale[2]);
    gl.uniform1f(this.getUniformLoc(gl, prog, 'uObjYaw'), yaw);
    gl.uniform1f(this.getUniformLoc(gl, prog, 'uMeshKind'), meshKind);

    gl.uniform1f(
      this.getUniformLoc(gl, prog, 'uLiquidPreset'),
      LIQUID_PRESET_MAP[state.liquified3d.fluidPreset] ?? 1
    );
    gl.uniform1f(this.getUniformLoc(gl, prog, 'uViscosity'), state.liquified3d.viscosity);
    gl.uniform1f(this.getUniformLoc(gl, prog, 'uRefraction'), state.liquified3d.refraction);
    gl.uniform1f(
      this.getUniformLoc(gl, prog, 'uFresnel'),
      Math.min(
        1.0,
        state.liquified3d.chromeFresnel +
          (state.cynthetocAi.enabled ? state.cynthetocAi.relightIntensity * 0.2 : 0)
      )
    );
    gl.uniform1f(this.getUniformLoc(gl, prog, 'uRippleForce'), state.liquified3d.rippleForce);
    gl.uniform1f(this.getUniformLoc(gl, prog, 'uPulseEnergy'), state.liquified3d.pulseEnergy);
    gl.uniform2f(this.getUniformLoc(gl, prog, 'uRippleUv'), this.rippleUv[0], this.rippleUv[1]);
    gl.uniform1f(
      this.getUniformLoc(gl, prog, 'uRippleAge'),
      Math.max(0, timeSec - this.rippleStartTime)
    );
    gl.uniform1f(this.getUniformLoc(gl, prog, 'uAlpha'), alpha);
    gl.uniform1f(
      this.getUniformLoc(gl, prog, 'uFusionGain'),
      (state.fusionMatrix.enabled ? state.fusionMatrix.synergyGain : 1.0) *
        (state.cynthetocAi.enabled ? 1 + state.cynthetocAi.synthesisStrength * 0.25 : 1.0)
    );
    gl.uniform1f(this.getUniformLoc(gl, prog, 'uSubtract'), state.subtractMode ? 1.0 : 0.0);

    gl.uniform1f(this.getUniformLoc(gl, prog, 'uShapeMorph'), state.liquidBrain.morphFactor);
    gl.uniform1f(this.getUniformLoc(gl, prog, 'uShapeTwist'), state.liquidBrain.twistAngle);
    gl.uniform1f(this.getUniformLoc(gl, prog, 'uShapeExplode'), state.liquidBrain.explodeRadius);
    gl.uniform1f(this.getUniformLoc(gl, prog, 'uLiquidPressure'), state.liquidBrain.fluidPressure);

    const pCol = appOpts?.primaryCol ?? [sr, sg, sb];
    const sCol = appOpts?.secondaryCol ?? [0.32, 0.85, 1.0];
    gl.uniform3f(this.getUniformLoc(gl, prog, 'uAppPrimaryCol'), pCol[0], pCol[1], pCol[2]);
    gl.uniform3f(this.getUniformLoc(gl, prog, 'uAppSecondaryCol'), sCol[0], sCol[1], sCol[2]);
    gl.uniform1f(this.getUniformLoc(gl, prog, 'uFusedBlend'), appOpts?.fusedBlend ?? 0.5);
    gl.uniform1f(this.getUniformLoc(gl, prog, 'uAppSignature'), appOpts?.appSig ?? 0.0);
    gl.uniform1f(this.getUniformLoc(gl, prog, 'uStereoParity'), appOpts?.stereoParity ?? 0.0);
    gl.uniform1f(
      this.getUniformLoc(gl, prog, 'uHoloFloorReflect'),
      state.holographic.enabled ? state.holographic.reflectionMix : 0.0
    );

    gl.uniform1f(
      this.getUniformLoc(gl, prog, 'uSmartMorphOn'),
      state.smartMorph.enabled ? 1.0 : 0.0
    );
    gl.uniform1f(
      this.getUniformLoc(gl, prog, 'uSmartMorphForce'),
      Math.min(1.5, state.smartMorph.expansionForce + state.smartMorph.pulseBoost * 0.45)
    );
    gl.uniform1f(this.getUniformLoc(gl, prog, 'uSmartMorphRate'), state.smartMorph.flowRate);
    gl.uniform1f(this.getUniformLoc(gl, prog, 'uSmartMorphRadial'), state.smartMorph.radialBias);

    const posLoc = gl.getAttribLocation(prog, 'aPos');
    if (posLoc >= 0) {
      gl.bindBuffer(gl.ARRAY_BUFFER, mesh.posBuf);
      gl.enableVertexAttribArray(posLoc);
      gl.vertexAttribPointer(posLoc, 3, gl.FLOAT, false, 0, 0);
    }

    const normLoc = gl.getAttribLocation(prog, 'aNorm');
    if (normLoc >= 0) {
      gl.bindBuffer(gl.ARRAY_BUFFER, mesh.normBuf);
      gl.enableVertexAttribArray(normLoc);
      gl.vertexAttribPointer(normLoc, 3, gl.FLOAT, false, 0, 0);
    }

    const uvLoc = gl.getAttribLocation(prog, 'aUv');
    if (uvLoc >= 0) {
      gl.bindBuffer(gl.ARRAY_BUFFER, mesh.uvBuf);
      gl.enableVertexAttribArray(uvLoc);
      gl.vertexAttribPointer(uvLoc, 2, gl.FLOAT, false, 0, 0);
    }

    gl.drawArrays(gl.TRIANGLES, 0, mesh.vertexCount);

    if (posLoc >= 0) gl.disableVertexAttribArray(posLoc);
    if (normLoc >= 0) gl.disableVertexAttribArray(normLoc);
    if (uvLoc >= 0) gl.disableVertexAttribArray(uvLoc);
  }

  private drawHologramMesh(
    gl: WebGLRenderingContext,
    mesh: MeshGeometry,
    mvp: Float32Array,
    eye: [number, number, number],
    state: FractalStudioState,
    timeSec: number,
    holoKind: number,
    sliceNorm: number,
    offset: [number, number, number],
    scale: [number, number, number],
    yaw: number,
    stereoParity: number
  ) {
    if (!this.hologramProg || !mesh.posBuf || !mesh.normBuf || !mesh.uvBuf || mesh.vertexCount === 0) {
      return;
    }
    const prog = this.hologramProg;
    gl.useProgram(prog);

    gl.uniformMatrix4fv(this.getUniformLoc(gl, prog, 'uMvp'), false, mvp);
    gl.uniform1i(this.getUniformLoc(gl, prog, 'uTex'), 0);
    gl.uniform3f(this.getUniformLoc(gl, prog, 'uCameraPos'), eye[0], eye[1], eye[2]);
    const [sr, sg, sb] = getSceneThemeRgb(state.sceneDesigner.theme);
    gl.uniform3f(this.getUniformLoc(gl, prog, 'uSceneColor'), sr, sg, sb);
    gl.uniform1f(this.getUniformLoc(gl, prog, 'uTime'), timeSec);

    gl.uniform3f(this.getUniformLoc(gl, prog, 'uHoloOffset'), offset[0], offset[1], offset[2]);
    gl.uniform3f(this.getUniformLoc(gl, prog, 'uHoloScale'), scale[0], scale[1], scale[2]);
    gl.uniform1f(this.getUniformLoc(gl, prog, 'uHoloYaw'), yaw);
    gl.uniform1f(this.getUniformLoc(gl, prog, 'uHoloKind'), holoKind);
    gl.uniform1f(this.getUniformLoc(gl, prog, 'uSliceNorm'), sliceNorm);

    gl.uniform1f(this.getUniformLoc(gl, prog, 'uGlassRefraction'), state.holographic.glassRefraction);
    gl.uniform1f(this.getUniformLoc(gl, prog, 'uReflectionMix'), state.holographic.reflectionMix);
    gl.uniform1f(this.getUniformLoc(gl, prog, 'uChromaticSplit'), state.holographic.chromaticSplit);
    gl.uniform1f(this.getUniformLoc(gl, prog, 'uParallaxDepth'), state.holographic.parallaxDepth);
    gl.uniform1f(this.getUniformLoc(gl, prog, 'uScanCoherence'), state.holographic.scanlineCoherence);
    gl.uniform1f(this.getUniformLoc(gl, prog, 'uCausticFocus'), state.holographic.causticFocus);
    gl.uniform1f(this.getUniformLoc(gl, prog, 'uSubtract'), state.subtractMode ? 1.0 : 0.0);
    gl.uniform1f(this.getUniformLoc(gl, prog, 'uStereoParity'), stereoParity);

    const posLoc = gl.getAttribLocation(prog, 'aPos');
    if (posLoc >= 0) {
      gl.bindBuffer(gl.ARRAY_BUFFER, mesh.posBuf);
      gl.enableVertexAttribArray(posLoc);
      gl.vertexAttribPointer(posLoc, 3, gl.FLOAT, false, 0, 0);
    }
    const normLoc = gl.getAttribLocation(prog, 'aNorm');
    if (normLoc >= 0) {
      gl.bindBuffer(gl.ARRAY_BUFFER, mesh.normBuf);
      gl.enableVertexAttribArray(normLoc);
      gl.vertexAttribPointer(normLoc, 3, gl.FLOAT, false, 0, 0);
    }
    const uvLoc = gl.getAttribLocation(prog, 'aUv');
    if (uvLoc >= 0) {
      gl.bindBuffer(gl.ARRAY_BUFFER, mesh.uvBuf);
      gl.enableVertexAttribArray(uvLoc);
      gl.vertexAttribPointer(uvLoc, 2, gl.FLOAT, false, 0, 0);
    }

    gl.drawArrays(gl.TRIANGLES, 0, mesh.vertexCount);

    if (posLoc >= 0) gl.disableVertexAttribArray(posLoc);
    if (normLoc >= 0) gl.disableVertexAttribArray(normLoc);
    if (uvLoc >= 0) gl.disableVertexAttribArray(uvLoc);
  }

  public render(
    source: HTMLCanvasElement | HTMLVideoElement | HTMLImageElement,
    state: FractalStudioState,
    timeSec: number
  ) {
    this.resizeToDisplay(state.upscaleMode);

    let srcW = 1434;
    let srcH = 600;
    if (source instanceof HTMLVideoElement) {
      srcW = source.videoWidth || 1434;
      srcH = source.videoHeight || 600;
    } else if (source instanceof HTMLImageElement) {
      srcW = source.naturalWidth || 1434;
      srcH = source.naturalHeight || 600;
    } else {
      srcW = source.width || 1434;
      srcH = source.height || 600;
    }
    this.lastSourceW = srcW;
    this.lastSourceH = srcH;

    if (this.contextLost || !this.gl || !this.screenProg) {
      this.renderFallback2D(source, state, srcW, srcH);
      return;
    }

    const gl = this.gl;
    const cw = this.canvas.width;
    const ch = this.canvas.height;
    gl.viewport(0, 0, cw, ch);

    if (state.theatreView) {
      gl.clearColor(0.01, 0.008, 0.012, 1.0);
    } else {
      gl.clearColor(0.02, 0.02, 0.024, 1.0);
    }
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    const ready = !(source instanceof HTMLVideoElement) || source.readyState >= 2;
    if (ready) {
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, this.texPrev);
      try {
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.prevSnapshotCanvas);
      } catch {
        // Ignore transient decode frame
      }

      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, this.texCurr);
      try {
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source);
      } catch {
        // Ignore transient decode frame
      }
    }

    try {
      if (state.mode === 'movie') {
        this.renderMovieMode(gl, cw, ch, srcW, srcH, state, timeSec);
      } else {
        this.render3DMode(gl, cw, ch, srcW, srcH, state, timeSec);
      }
    } catch (err) {
      console.warn('WebGL frame error, switching to 2D canvas fallback:', err);
      this.activate2DFallback();
      this.renderFallback2D(source, state, srcW, srcH);
      return;
    }

    if (ready && this.prevSnapshotCtx) {
      try {
        this.prevSnapshotCtx.drawImage(
          source,
          0,
          0,
          this.prevSnapshotCanvas.width,
          this.prevSnapshotCanvas.height
        );
      } catch {
        // Ignore
      }
    }
  }

  private bindScreenUniforms(
    gl: WebGLRenderingContext,
    mvp: Float32Array,
    state: FractalStudioState,
    timeSec: number,
    cw: number,
    ch: number,
    stereoShaderEnabled: boolean,
    stereoParity = 0
  ) {
    const prog = this.screenProg!;
    gl.useProgram(prog);
    gl.uniformMatrix4fv(this.getUniformLoc(gl, prog, 'uMvp'), false, mvp);
    gl.uniform1i(this.getUniformLoc(gl, prog, 'uTex'), 0);
    gl.uniform1i(this.getUniformLoc(gl, prog, 'uPrevTex'), 1);
    gl.uniform2f(
      this.getUniformLoc(gl, prog, 'uTexelSize'),
      1 / Math.max(1, this.lastSourceW),
      1 / Math.max(1, this.lastSourceH)
    );
    gl.uniform2f(this.getUniformLoc(gl, prog, 'uOutputRes'), cw, ch);
    gl.uniform1f(this.getUniformLoc(gl, prog, 'uTime'), timeSec);

    const g: ColorGradingState = state.grading;
    gl.uniform1f(this.getUniformLoc(gl, prog, 'uExposure'), g.exposure);
    gl.uniform1f(this.getUniformLoc(gl, prog, 'uContrast'), g.contrast);
    gl.uniform1f(this.getUniformLoc(gl, prog, 'uSaturation'), g.saturation);
    gl.uniform1f(this.getUniformLoc(gl, prog, 'uTemperature'), g.temperature);
    gl.uniform1f(this.getUniformLoc(gl, prog, 'uTint'), g.tint);
    gl.uniform1f(this.getUniformLoc(gl, prog, 'uRolloff'), g.highlightRolloff);
    gl.uniform1f(this.getUniformLoc(gl, prog, 'uLut'), LUT_INDEX_MAP[g.lut] ?? 0);
    gl.uniform1f(this.getUniformLoc(gl, prog, 'uSubtract'), state.subtractMode ? 1.0 : 0.0);
    gl.uniform1f(
      this.getUniformLoc(gl, prog, 'uUpscale'),
      UPSCALE_STRENGTH_MAP[state.upscaleMode] ?? 0.0
    );
    gl.uniform1f(this.getUniformLoc(gl, prog, 'uFlare'), state.anamorphicFlare);
    gl.uniform1f(this.getUniformLoc(gl, prog, 'uSqueeze'), state.anamorphicSqueeze ? 1.0 : 0.0);
    gl.uniform1f(this.getUniformLoc(gl, prog, 'uTheatreDim'), state.theatreView ? 1.0 : 0.0);

    gl.uniform1f(this.getUniformLoc(gl, prog, 'uFilmGrain'), state.cinema.filmGrain);
    gl.uniform1f(this.getUniformLoc(gl, prog, 'uHalation'), state.cinema.halation);
    gl.uniform1f(this.getUniformLoc(gl, prog, 'uGateWeave'), state.cinema.gateWeave);

    gl.uniform1f(this.getUniformLoc(gl, prog, 'uTvEnabled'), state.realTv.enabled ? 1.0 : 0.0);
    gl.uniform1f(
      this.getUniformLoc(gl, prog, 'uTvProfile'),
      TV_PROFILE_MAP[state.realTv.profile] ?? 0
    );
    gl.uniform1f(this.getUniformLoc(gl, prog, 'uTvScanlines'), state.realTv.scanlines);
    gl.uniform1f(this.getUniformLoc(gl, prog, 'uTvCurvature'), state.realTv.curvature);
    gl.uniform1f(this.getUniformLoc(gl, prog, 'uTvChromaBleed'), state.realTv.chromaBleed);
    gl.uniform1f(this.getUniformLoc(gl, prog, 'uTvBloom'), state.realTv.phosphorBloom);

    gl.uniform1f(
      this.getUniformLoc(gl, prog, 'uToonEnabled'),
      state.videoToCartoon.enabled ? 1.0 : 0.0
    );
    gl.uniform1f(
      this.getUniformLoc(gl, prog, 'uToonStyle'),
      TOON_STYLE_MAP[state.videoToCartoon.style] ?? 0
    );
    gl.uniform1f(
      this.getUniformLoc(gl, prog, 'uToonLevels'),
      state.videoToCartoon.quantizeLevels
    );
    gl.uniform1f(this.getUniformLoc(gl, prog, 'uToonEdge'), state.videoToCartoon.edgeStrength);
    gl.uniform1f(
      this.getUniformLoc(gl, prog, 'uToonThickness'),
      state.videoToCartoon.inkThickness
    );
    gl.uniform1f(this.getUniformLoc(gl, prog, 'uToonBoost'), state.videoToCartoon.colorBoost);
    gl.uniform1f(this.getUniformLoc(gl, prog, 'uToonHalftone'), state.videoToCartoon.halftone);

    const [sr, sg, sb] = getSceneThemeRgb(state.sceneDesigner.theme);
    gl.uniform3f(this.getUniformLoc(gl, prog, 'uSceneColor'), sr, sg, sb);
    gl.uniform1f(
      this.getUniformLoc(gl, prog, 'uAtmosBlend'),
      state.sceneDesigner.atmosphereBlend
    );
    gl.uniform1f(
      this.getUniformLoc(gl, prog, 'uFusionGain'),
      state.fusionMatrix.enabled ? state.fusionMatrix.synergyGain : 1.0
    );

    gl.uniform1f(
      this.getUniformLoc(gl, prog, 'uLiquidScreen'),
      state.liquified3d.enabled && state.liquified3d.liquidScreenOptical ? 1.0 : 0.0
    );
    gl.uniform1f(this.getUniformLoc(gl, prog, 'uLiquidRefraction'), state.liquified3d.refraction);
    gl.uniform2f(this.getUniformLoc(gl, prog, 'uRippleUv'), this.rippleUv[0], this.rippleUv[1]);
    gl.uniform1f(
      this.getUniformLoc(gl, prog, 'uRippleAge'),
      Math.max(0, timeSec - this.rippleStartTime)
    );
    gl.uniform1f(this.getUniformLoc(gl, prog, 'uRippleForce'), state.liquified3d.rippleForce);
    gl.uniform1f(this.getUniformLoc(gl, prog, 'uPulseEnergy'), state.liquified3d.pulseEnergy);

    gl.uniform1f(
      this.getUniformLoc(gl, prog, 'uCynthetocOn'),
      state.cynthetocAi.enabled ? 1.0 : 0.0
    );
    gl.uniform1f(
      this.getUniformLoc(gl, prog, 'uCynthetocMode'),
      CYNTHETOC_MODE_MAP[state.cynthetocAi.mode] ?? 0
    );
    gl.uniform1f(
      this.getUniformLoc(gl, prog, 'uCynthetocStrength'),
      state.cynthetocAi.synthesisStrength
    );
    gl.uniform1f(
      this.getUniformLoc(gl, prog, 'uCynthetocDenoise'),
      state.cynthetocAi.neuralDenoise
    );
    gl.uniform1f(
      this.getUniformLoc(gl, prog, 'uCynthetocRelight'),
      state.cynthetocAi.relightIntensity
    );

    gl.uniform1f(
      this.getUniformLoc(gl, prog, 'uStereoOn'),
      stereoShaderEnabled ? 1.0 : 0.0
    );
    gl.uniform1f(
      this.getUniformLoc(gl, prog, 'uStereoMode'),
      STEREO_MODE_MAP[state.stereoscopic.mode] ?? 0
    );
    gl.uniform1f(this.getUniformLoc(gl, prog, 'uStereoSep'), state.stereoscopic.interaxial);
    gl.uniform1f(this.getUniformLoc(gl, prog, 'uStereoConv'), state.stereoscopic.convergence);
    gl.uniform1f(this.getUniformLoc(gl, prog, 'uStereoCross'), state.stereoscopic.analogCrosstalk);
    gl.uniform1f(this.getUniformLoc(gl, prog, 'uStereoDepth'), state.stereoscopic.depthSynthesis);
    gl.uniform1f(this.getUniformLoc(gl, prog, 'uStereoParity'), stereoParity);

    gl.uniform1f(
      this.getUniformLoc(gl, prog, 'uHoloOn'),
      state.holographic.enabled && state.mode === 'movie' ? 1.0 : 0.0
    );
    gl.uniform1f(
      this.getUniformLoc(gl, prog, 'uHoloRig'),
      HOLOGRAM_RIG_MAP[state.holographic.rigMode] ?? 0
    );
    gl.uniform1f(this.getUniformLoc(gl, prog, 'uHoloRefraction'), state.holographic.glassRefraction);
    gl.uniform1f(this.getUniformLoc(gl, prog, 'uHoloReflect'), state.holographic.reflectionMix);
    gl.uniform1f(this.getUniformLoc(gl, prog, 'uHoloChroma'), state.holographic.chromaticSplit);
    gl.uniform1f(this.getUniformLoc(gl, prog, 'uHoloParallax'), state.holographic.parallaxDepth);
    gl.uniform1f(this.getUniformLoc(gl, prog, 'uHoloScan'), state.holographic.scanlineCoherence);
    gl.uniform1f(this.getUniformLoc(gl, prog, 'uHoloCaustic'), state.holographic.causticFocus);

    gl.uniform1f(
      this.getUniformLoc(gl, prog, 'uMorphOn'),
      state.smartMorph.enabled ? 1.0 : 0.0
    );
    gl.uniform1f(
      this.getUniformLoc(gl, prog, 'uMorphMode'),
      SMART_MORPH_MODE_MAP[state.smartMorph.mode] ?? 0
    );
    gl.uniform1f(
      this.getUniformLoc(gl, prog, 'uMorphForce'),
      Math.min(1.5, state.smartMorph.expansionForce + state.smartMorph.pulseBoost * 0.45)
    );
    gl.uniform1f(this.getUniformLoc(gl, prog, 'uMorphCohesion'), state.smartMorph.cohesion);
    gl.uniform1f(this.getUniformLoc(gl, prog, 'uMorphRate'), state.smartMorph.flowRate);
    gl.uniform1f(this.getUniformLoc(gl, prog, 'uMorphRadial'), state.smartMorph.radialBias);
    gl.uniform1f(this.getUniformLoc(gl, prog, 'uMorphEdgePreserve'), state.smartMorph.edgePreserve);

    const [hR, hG, hB] = state.kineticHarmonizer.syncWithAbby
      ? state.abbyCio.dominantRgb
      : [sr, sg, sb];
    gl.uniform1f(
      this.getUniformLoc(gl, prog, 'uHarmOn'),
      state.kineticHarmonizer.enabled ? 1.0 : 0.0
    );
    gl.uniform1f(
      this.getUniformLoc(gl, prog, 'uHarmMode'),
      KINETIC_HARM_MODE_MAP[state.kineticHarmonizer.mode] ?? 0
    );
    gl.uniform1f(
      this.getUniformLoc(gl, prog, 'uHarmStrength'),
      state.kineticHarmonizer.harmonyStrength
    );
    gl.uniform1f(
      this.getUniformLoc(gl, prog, 'uHarmEdge'),
      state.kineticHarmonizer.edgeGlow
    );
    gl.uniform1f(
      this.getUniformLoc(gl, prog, 'uHarmShift'),
      state.kineticHarmonizer.spectralShift
    );
    gl.uniform1f(
      this.getUniformLoc(gl, prog, 'uHarmVig'),
      state.kineticHarmonizer.vignetteBalance
    );
    gl.uniform3f(this.getUniformLoc(gl, prog, 'uHarmColor'), hR, hG, hB);
  }

  private renderMovieMode(
    gl: WebGLRenderingContext,
    cw: number,
    ch: number,
    srcW: number,
    srcH: number,
    state: FractalStudioState,
    timeSec: number
  ) {
    gl.disable(gl.DEPTH_TEST);
    gl.disable(gl.BLEND);

    const viewAspect = cw / Math.max(1, ch);
    const targetAspect = this.getTargetAspect(state, srcW, srcH);

    let sx = 1.0;
    let sy = 1.0;
    if (viewAspect > targetAspect) {
      sx = targetAspect / viewAspect;
    } else {
      sy = viewAspect / targetAspect;
    }
    if (state.theatreView) {
      sx *= 0.9;
      sy *= 0.9;
    } else if (state.realTv.enabled) {
      sx *= 0.93;
      sy *= 0.93;
    }

    const quadPos = new Float32Array([
      -sx, -sy, 0,
       sx, -sy, 0,
       sx,  sy, 0,
      -sx, -sy, 0,
       sx,  sy, 0,
      -sx,  sy, 0,
    ]);
    const quadUv = new Float32Array([
      0, 1,
      1, 1,
      1, 0,
      0, 1,
      1, 0,
      0, 0,
    ]);

    this.bindScreenUniforms(
      gl,
      mat4Identity(),
      state,
      timeSec,
      cw,
      ch,
      state.stereoscopic.enabled,
      0
    );

    const prog = this.screenProg!;
    gl.bindBuffer(gl.ARRAY_BUFFER, this.screenPosBuf);
    gl.bufferData(gl.ARRAY_BUFFER, quadPos, gl.DYNAMIC_DRAW);
    const posLoc = gl.getAttribLocation(prog, 'aPos');
    if (posLoc >= 0) {
      gl.enableVertexAttribArray(posLoc);
      gl.vertexAttribPointer(posLoc, 3, gl.FLOAT, false, 0, 0);
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, this.screenUvBuf);
    gl.bufferData(gl.ARRAY_BUFFER, quadUv, gl.DYNAMIC_DRAW);
    const uvLoc = gl.getAttribLocation(prog, 'aUv');
    if (uvLoc >= 0) {
      gl.enableVertexAttribArray(uvLoc);
      gl.vertexAttribPointer(uvLoc, 2, gl.FLOAT, false, 0, 0);
    }

    gl.drawArrays(gl.TRIANGLES, 0, 6);

    if (posLoc >= 0) gl.disableVertexAttribArray(posLoc);
    if (uvLoc >= 0) gl.disableVertexAttribArray(uvLoc);

    this.lastCurvature = -1;

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    const [sr, sg, sb] = getSceneThemeRgb(state.sceneDesigner.theme);
    const borderVerts = [
      -sx, -sy, 0, sx, -sy, 0,
       sx, -sy, 0, sx,  sy, 0,
       sx,  sy, 0, -sx, sy, 0,
      -sx,  sy, 0, -sx, -sy, 0,
    ];
    this.drawLines(
      gl,
      mat4Identity(),
      borderVerts,
      sr,
      sg,
      sb,
      state.theatreView ? 0.5 : 0.28
    );
    gl.disable(gl.BLEND);
  }

  private render3DMode(
    gl: WebGLRenderingContext,
    cw: number,
    ch: number,
    srcW: number,
    srcH: number,
    state: FractalStudioState,
    timeSec: number
  ) {
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    const baseEyeX =
      this.camera.targetX +
      Math.sin(this.camera.yaw) * Math.cos(this.camera.pitch) * this.camera.distance;
    const baseEyeY =
      this.camera.targetY + Math.sin(this.camera.pitch) * this.camera.distance;
    const baseEyeZ =
      this.camera.targetZ +
      Math.cos(this.camera.yaw) * Math.cos(this.camera.pitch) * this.camera.distance;

    const stereo = state.stereoscopic;
    if (!stereo.enabled) {
      const aspect = cw / Math.max(1, ch);
      const proj = mat4Perspective((50 * Math.PI) / 180, aspect, 0.1, 80.0);
      const view = mat4LookAt(
        baseEyeX,
        baseEyeY,
        baseEyeZ,
        this.camera.targetX,
        this.camera.targetY,
        this.camera.targetZ
      );
      this.render3DScenePass(
        gl,
        mat4Multiply(proj, view),
        [baseEyeX, baseEyeY, baseEyeZ],
        cw,
        ch,
        srcW,
        srcH,
        state,
        timeSec,
        0,
        false
      );
      gl.disable(gl.BLEND);
      gl.disable(gl.DEPTH_TEST);
      return;
    }

    // Stereoscopic Dual-Eye Camera Separation Vector
    const rightX = Math.cos(this.camera.yaw);
    const rightZ = -Math.sin(this.camera.yaw);
    const eyeSep = stereo.interaxial * 0.24;
    const convBias = stereo.convergence * 0.11;

    const leftEye: [number, number, number] = [
      baseEyeX - rightX * eyeSep,
      baseEyeY,
      baseEyeZ - rightZ * eyeSep,
    ];
    const rightEye: [number, number, number] = [
      baseEyeX + rightX * eyeSep,
      baseEyeY,
      baseEyeZ + rightZ * eyeSep,
    ];
    const leftTarget: [number, number, number] = [
      this.camera.targetX + rightX * convBias,
      this.camera.targetY,
      this.camera.targetZ + rightZ * convBias,
    ];
    const rightTarget: [number, number, number] = [
      this.camera.targetX - rightX * convBias,
      this.camera.targetY,
      this.camera.targetZ - rightZ * convBias,
    ];

    if (stereo.mode === 'sideBySide') {
      const halfW = Math.max(1, Math.floor(cw * 0.5));
      const rightW = Math.max(1, cw - halfW);
      const halfAspect = halfW / Math.max(1, ch);
      const proj = mat4Perspective((50 * Math.PI) / 180, halfAspect, 0.1, 80.0);

      gl.enable(gl.SCISSOR_TEST);

      // Left Eye Viewport
      gl.viewport(0, 0, halfW, ch);
      gl.scissor(0, 0, halfW, ch);
      const viewL = mat4LookAt(
        leftEye[0],
        leftEye[1],
        leftEye[2],
        leftTarget[0],
        leftTarget[1],
        leftTarget[2]
      );
      this.render3DScenePass(
        gl,
        mat4Multiply(proj, viewL),
        leftEye,
        halfW,
        ch,
        srcW,
        srcH,
        state,
        timeSec,
        0,
        false
      );

      // Right Eye Viewport
      gl.viewport(halfW, 0, rightW, ch);
      gl.scissor(halfW, 0, rightW, ch);
      gl.clear(gl.DEPTH_BUFFER_BIT);
      const viewR = mat4LookAt(
        rightEye[0],
        rightEye[1],
        rightEye[2],
        rightTarget[0],
        rightTarget[1],
        rightTarget[2]
      );
      this.render3DScenePass(
        gl,
        mat4Multiply(proj, viewR),
        rightEye,
        rightW,
        ch,
        srcW,
        srcH,
        state,
        timeSec,
        0,
        false
      );

      gl.disable(gl.SCISSOR_TEST);
      gl.viewport(0, 0, cw, ch);
    } else if (stereo.mode === 'interlacedField') {
      const aspect = cw / Math.max(1, ch);
      const proj = mat4Perspective((50 * Math.PI) / 180, aspect, 0.1, 80.0);
      const viewL = mat4LookAt(
        leftEye[0],
        leftEye[1],
        leftEye[2],
        leftTarget[0],
        leftTarget[1],
        leftTarget[2]
      );
      this.render3DScenePass(
        gl,
        mat4Multiply(proj, viewL),
        leftEye,
        cw,
        ch,
        srcW,
        srcH,
        state,
        timeSec,
        -1,
        false
      );

      gl.clear(gl.DEPTH_BUFFER_BIT);
      const viewR = mat4LookAt(
        rightEye[0],
        rightEye[1],
        rightEye[2],
        rightTarget[0],
        rightTarget[1],
        rightTarget[2]
      );
      this.render3DScenePass(
        gl,
        mat4Multiply(proj, viewR),
        rightEye,
        cw,
        ch,
        srcW,
        srcH,
        state,
        timeSec,
        1,
        false
      );
    } else if (stereo.mode === 'pulfrichAnalog') {
      // Pulfrich Analog: left-eye luminance parallax + optical time-shifted screen synthesis
      const aspect = cw / Math.max(1, ch);
      const proj = mat4Perspective((50 * Math.PI) / 180, aspect, 0.1, 80.0);
      const viewL = mat4LookAt(
        leftEye[0],
        leftEye[1],
        leftEye[2],
        leftTarget[0],
        leftTarget[1],
        leftTarget[2]
      );
      this.render3DScenePass(
        gl,
        mat4Multiply(proj, viewL),
        leftEye,
        cw,
        ch,
        srcW,
        srcH,
        state,
        timeSec,
        0,
        true
      );
    } else {
      // Hardware Dual-Pass Anaglyph (Red/Cyan or Amber/Blue ColorCode 3-D)
      const aspect = cw / Math.max(1, ch);
      const proj = mat4Perspective((50 * Math.PI) / 180, aspect, 0.1, 80.0);
      const isAmberBlue = stereo.mode === 'amberBlueColorCode';

      // Left Eye Pass (Red or Amber)
      gl.colorMask(true, isAmberBlue, false, true);
      const viewL = mat4LookAt(
        leftEye[0],
        leftEye[1],
        leftEye[2],
        leftTarget[0],
        leftTarget[1],
        leftTarget[2]
      );
      this.render3DScenePass(
        gl,
        mat4Multiply(proj, viewL),
        leftEye,
        cw,
        ch,
        srcW,
        srcH,
        state,
        timeSec,
        0,
        false
      );

      // Right Eye Pass (Cyan or Blue)
      gl.clear(gl.DEPTH_BUFFER_BIT);
      gl.colorMask(false, !isAmberBlue, true, true);
      const viewR = mat4LookAt(
        rightEye[0],
        rightEye[1],
        rightEye[2],
        rightTarget[0],
        rightTarget[1],
        rightTarget[2]
      );
      this.render3DScenePass(
        gl,
        mat4Multiply(proj, viewR),
        rightEye,
        cw,
        ch,
        srcW,
        srcH,
        state,
        timeSec,
        0,
        false
      );

      gl.colorMask(true, true, true, true);
    }

    gl.disable(gl.BLEND);
    gl.disable(gl.DEPTH_TEST);
  }

  private render3DScenePass(
    gl: WebGLRenderingContext,
    mvp: Float32Array,
    eye: [number, number, number],
    cw: number,
    ch: number,
    srcW: number,
    srcH: number,
    state: FractalStudioState,
    timeSec: number,
    stereoParity: number,
    screenStereoShader: boolean
  ) {
    const [sr, sg, sb] = getSceneThemeRgb(state.sceneDesigner.theme);
    const liquidOn =
      Boolean(this.liquidProg) &&
      state.liquified3d.enabled &&
      state.liquified3d.solidGeometry;
    const speedMult = state.sceneDesigner.motionSpeed;

    // 1. Reflective Liquified Studio Floor Basin
    if (liquidOn) {
      this.drawLiquidMesh(
        gl,
        this.floorMesh,
        mvp,
        eye,
        state,
        timeSec,
        0,
        [0, 0, 0],
        [1, 1, 1],
        0,
        state.theatreView ? 0.85 : 0.94,
        {
          primaryCol: [sr, sg, sb],
          secondaryCol: [0.32, 0.85, 1.0],
          fusedBlend: 0.35,
          appSig: 0,
          stereoParity,
        }
      );
    }

    const gridVerts: number[] = [];
    const extent = 12;
    const gridAlpha = liquidOn
      ? state.theatreView
        ? 0.08
        : 0.14
      : state.theatreView
      ? 0.14
      : 0.24;
    for (let i = -extent; i <= extent; i++) {
      gridVerts.push(i, -0.5, -extent, i, -0.5, extent);
      gridVerts.push(-extent, -0.5, i, extent, -0.5, i);
    }
    this.drawLines(gl, mvp, gridVerts, sr, sg, sb, gridAlpha);

    // 2. Stepped Auditorium Seating Tiers
    const tierVerts: number[] = [];
    for (let row = 0; row < 5; row++) {
      const z = 1.6 + row * 1.35;
      const y = -0.35 + row * 0.22;
      const halfW = 4.6 + row * 0.35;
      tierVerts.push(-halfW, y, z, halfW, y, z);
      tierVerts.push(-halfW, y - 0.16, z, halfW, y - 0.16, z);
      tierVerts.push(-halfW, y, z, -halfW, y - 0.16, z);
      tierVerts.push(halfW, y, z, halfW, y - 0.16, z);
      tierVerts.push(-0.6, y + 0.02, z, -0.45, y + 0.02, z);
      tierVerts.push(0.45, y + 0.02, z, 0.6, y + 0.02, z);
    }
    this.drawLines(gl, mvp, tierVerts, sr, sg, sb, state.theatreView ? 0.18 : 0.3);

    // 3. Curved 2.39:1 / Real TV Screen
    const screenAspect = this.getTargetAspect(state, srcW, srcH);
    const curvature = state.realTv.enabled
      ? 0.32 * state.realTv.curvature
      : state.stage3d.screenCurvature;
    this.ensure3DScreenGeometry(gl, curvature, screenAspect);
    this.bindScreenUniforms(
      gl,
      mvp,
      state,
      timeSec,
      cw,
      ch,
      screenStereoShader,
      stereoParity
    );
    const prog = this.screenProg!;

    gl.bindBuffer(gl.ARRAY_BUFFER, this.screenPosBuf);
    const posLoc = gl.getAttribLocation(prog, 'aPos');
    if (posLoc >= 0) {
      gl.enableVertexAttribArray(posLoc);
      gl.vertexAttribPointer(posLoc, 3, gl.FLOAT, false, 0, 0);
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, this.screenUvBuf);
    const uvLoc = gl.getAttribLocation(prog, 'aUv');
    if (uvLoc >= 0) {
      gl.enableVertexAttribArray(uvLoc);
      gl.vertexAttribPointer(uvLoc, 2, gl.FLOAT, false, 0, 0);
    }

    gl.drawArrays(gl.TRIANGLES, 0, this.screenVertexCount);
    if (posLoc >= 0) gl.disableVertexAttribArray(posLoc);
    if (uvLoc >= 0) gl.disableVertexAttribArray(uvLoc);

    const sw = 4.3;
    const sh = (sw * 2) / Math.max(1.1, screenAspect);
    const scZ = -4.2 + curvature * 1.45;
    const frameVerts = [
      -sw, 0.25, scZ, sw, 0.25, scZ,
      sw, 0.25, scZ, sw, 0.25 + sh, scZ,
      sw, 0.25 + sh, scZ, -sw, 0.25 + sh, scZ,
      -sw, 0.25 + sh, scZ, -sw, 0.25, scZ,
      -sw * 0.9, -0.5, scZ, -sw * 0.9, 0.25, scZ,
      sw * 0.9, -0.5, scZ, sw * 0.9, 0.25, scZ,
    ];
    this.drawLines(gl, mvp, frameVerts, sr, sg, sb, 0.8);

    // 4. Liquified (0,0,0) Ferrofluid Core, Solid CSP Ring & Multiplied Shaded Cones (up to 9x)
    const coneCount = Math.max(1, Math.min(9, state.stage3d.coneMultiplier));
    const originY = 0.42;

    if (liquidOn) {
      this.drawLiquidMesh(
        gl,
        this.orbMesh,
        mvp,
        eye,
        state,
        timeSec,
        1,
        [0, originY + 0.16, 0],
        [0.85, 0.85, 0.85],
        timeSec * 0.4 * speedMult,
        0.98,
        {
          primaryCol: [sr, sg, sb],
          secondaryCol: [1.0, 0.7, 0.2],
          fusedBlend: 0.45,
          appSig: 0,
          stereoParity,
        }
      );

      this.drawLiquidMesh(
        gl,
        this.torusMesh,
        mvp,
        eye,
        state,
        timeSec,
        2,
        [0, originY + 0.04, 0],
        [1.0, 1.0, 1.0],
        timeSec * 0.28 * speedMult,
        0.9,
        {
          primaryCol: [sr, sg, sb],
          secondaryCol: [0.32, 0.85, 1.0],
          fusedBlend: 0.4,
          appSig: 0,
          stereoParity,
        }
      );

      for (let c = 0; c < coneCount; c++) {
        const outerTier = c >= 6;
        const tierCount = outerTier ? coneCount - 6 : Math.min(6, coneCount);
        const tierIdx = outerTier ? c - 6 : c;
        const dir = outerTier ? -1 : 1;
        const offsetAngle =
          (tierIdx / Math.max(1, tierCount)) * Math.PI * 2 +
          dir * timeSec * 0.45 * speedMult;
        const orbitR = coneCount === 1 ? 0 : outerTier ? 1.85 : 1.08;
        const ox = Math.cos(offsetAngle) * orbitR;
        const oz = Math.sin(offsetAngle) * orbitR;
        const oy = originY + (outerTier ? 0.56 : 0.18) + Math.sin(timeSec * 1.6 + c) * 0.12;
        const sFactor = outerTier ? 0.4 : 0.52;
        this.drawLiquidMesh(
          gl,
          this.coneMesh,
          mvp,
          eye,
          state,
          timeSec,
          2,
          [ox, oy, oz],
          [sFactor, sFactor * 1.3, sFactor],
          -offsetAngle,
          0.95,
          {
            primaryCol: [sr, sg, sb],
            secondaryCol: [1.0, 0.68, 0.25],
            fusedBlend: 0.35,
            appSig: 0,
            stereoParity,
          }
        );
      }
    } else {
      const coneVerts: number[] = [];
      const segs = 20;
      for (let c = 0; c < coneCount; c++) {
        const offsetAngle = (c / coneCount) * Math.PI * 2 + timeSec * 0.45 * speedMult;
        const orbitR = coneCount === 1 ? 0 : 0.48 + (c >= 6 ? 0.55 : 0);
        const ox = Math.cos(offsetAngle) * orbitR;
        const oz = Math.sin(offsetAngle) * orbitR;
        const apexY = originY + 0.95 + Math.sin(timeSec * 1.6 + c) * 0.14;
        const baseY = originY - 0.55;
        const rad = 0.68 + (c % 4) * 0.08;

        for (let i = 0; i < segs; i++) {
          const a0 = (i / segs) * Math.PI * 2 + timeSec * 0.3;
          const a1 = ((i + 1) / segs) * Math.PI * 2 + timeSec * 0.3;
          const x0 = ox + Math.cos(a0) * rad;
          const z0 = oz + Math.sin(a0) * rad;
          const x1 = ox + Math.cos(a1) * rad;
          const z1 = oz + Math.sin(a1) * rad;
          coneVerts.push(x0, baseY, z0, x1, baseY, z1);
          if (i % 2 === 0) {
            coneVerts.push(x0, baseY, z0, ox, apexY, oz);
          }
        }
      }
      this.drawLines(gl, mvp, coneVerts, sr, sg, sb, 0.88);
    }

    // 4B. Liquid Brain: Projected, Fused & Altered Complete 3D App Shapes
    if (state.liquidBrain.enabled && this.liquidProg) {
      const appsList =
        state.liquidBrain.projectedApps.length > 0
          ? state.liquidBrain.projectedApps
          : ['cynthetoc-ai'];
      const targetMesh = this.getShapeMesh(state.liquidBrain.shape);
      const synapseVerts: number[] = [];

      if (state.liquidBrain.fusionMode === 'fusedHybrid') {
        const p0 = getAppVisualProfile(appsList[0]);
        const p1 = getAppVisualProfile(appsList[1] ?? appsList[0]);
        const hybridY = 1.62 + Math.sin(timeSec * 1.3) * 0.1;
        this.drawLiquidMesh(
          gl,
          targetMesh,
          mvp,
          eye,
          state,
          timeSec,
          3,
          [0, hybridY, -0.35],
          [1.22, 1.22, 1.22],
          timeSec * 0.5 * speedMult,
          0.95,
          {
            primaryCol: p0.rgb,
            secondaryCol: p1.rgb,
            fusedBlend: state.liquidBrain.fusedBlend,
            appSig: p0.sig,
            stereoParity,
          }
        );
        // Secondary interlocking counter-rotated fused app shell
        const outerMesh =
          state.liquidBrain.shape === 'torus' ? this.mobiusMesh : this.torusMesh;
        this.drawLiquidMesh(
          gl,
          outerMesh,
          mvp,
          eye,
          state,
          timeSec,
          3,
          [0, hybridY, -0.35],
          [0.74, 0.74, 0.74],
          -timeSec * 0.65 * speedMult,
          0.88,
          {
            primaryCol: p1.rgb,
            secondaryCol: p0.rgb,
            fusedBlend: state.liquidBrain.fusedBlend,
            appSig: p1.sig,
            stereoParity,
          }
        );
        synapseVerts.push(0, originY + 0.16, 0, 0, hybridY, -0.35);
        synapseVerts.push(0, hybridY, -0.35, 0, 1.3, scZ + 0.05);
      } else {
        const shapesCycle: AppShapeTopologyId[] = [
          state.liquidBrain.shape,
          state.liquidBrain.shape,
          state.liquidBrain.shape,
          state.liquidBrain.shape,
        ];
        const count = Math.min(4, appsList.length);
        const orbitRadius = 2.45;
        for (let i = 0; i < count; i++) {
          const prof = getAppVisualProfile(appsList[i]);
          const nextProf = getAppVisualProfile(appsList[(i + 1) % count]);
          const angle = (i / count) * Math.PI * 2 + timeSec * 0.34 * speedMult;
          const ax = Math.cos(angle) * orbitRadius;
          const az = Math.sin(angle) * orbitRadius - 0.35;
          const ay = 1.48 + Math.sin(timeSec * 1.5 + i * 1.7) * 0.18;

          this.drawLiquidMesh(
            gl,
            this.getShapeMesh(shapesCycle[i]),
            mvp,
            eye,
            state,
            timeSec,
            3,
            [ax, ay, az],
            [0.62, 0.62, 0.62],
            -angle * 1.4,
            0.94,
            {
              primaryCol: prof.rgb,
              secondaryCol: nextProf.rgb,
              fusedBlend: state.liquidBrain.fusedBlend,
              appSig: prof.sig,
              stereoParity,
            }
          );

          // Synaptic coupling filaments linking (0,0,0) Liquid Brain core -> App Shape -> neighbors
          synapseVerts.push(0, originY + 0.18, 0, ax, ay, az);
          const nextAngle = (((i + 1) % count) / count) * Math.PI * 2 + timeSec * 0.34 * speedMult;
          const nx = Math.cos(nextAngle) * orbitRadius;
          const nz = Math.sin(nextAngle) * orbitRadius - 0.35;
          const ny = 1.48 + Math.sin(timeSec * 1.5 + ((i + 1) % count) * 1.7) * 0.18;
          synapseVerts.push(ax, ay, az, nx, ny, nz);
        }
      }

      if (synapseVerts.length > 0) {
        this.drawLines(
          gl,
          mvp,
          synapseVerts,
          0.35 + sr * 0.65,
          0.78,
          1.0,
          0.58 + state.liquidBrain.fusedBlend * 0.3
        );
      }
    }

    // 4C. Holographic Projection App (Liquid Glass Reflection + Main Image)
    if (state.holographic.enabled && this.hologramProg) {
      const holo = state.holographic;
      const holoY = holo.baseElevation;
      const holoYaw = holo.autoRotate ? timeSec * 0.42 * speedMult : 0.0;
      const slices = Math.max(3, Math.min(16, Math.round(holo.sliceCount)));

      // Emitter laser beam frustum rays from liquid glass floor reflection node
      const holoBeamVerts: number[] = [];
      for (let b = 0; b < 8; b++) {
        const ang = (b / 8) * Math.PI * 2 + holoYaw * 0.6;
        const bx = Math.cos(ang) * 0.46;
        const bz = Math.sin(ang) * 0.46;
        const tx = Math.cos(ang) * 1.92;
        const tz = Math.sin(ang) * 1.92;
        holoBeamVerts.push(bx, -0.46, bz, tx, holoY + 0.95, tz);
      }
      this.drawLines(gl, mvp, holoBeamVerts, 0.32, 0.9, 1.0, 0.35 + holo.causticFocus * 0.35);

      gl.depthMask(false);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE);

      // Render volumetric stacked main-image hologram slices inside focal volume
      const sliceSpan = 0.55 + holo.parallaxDepth * 0.85;
      const sliceScaleX = holo.rigMode === 'pepperGhostPyramid' ? 0.72 : 1.05;
      const sliceScaleY = holo.rigMode === 'pepperGhostPyramid' ? 0.72 : 1.05;
      for (let s = 0; s < slices; s++) {
        const tNorm = slices > 1 ? (s / (slices - 1)) * 2 - 1 : 0;
        const zOff = tNorm * sliceSpan * 0.5;
        const rx = -Math.sin(holoYaw) * zOff;
        const rz = Math.cos(holoYaw) * zOff;
        this.drawHologramMesh(
          gl,
          this.holoSliceMesh,
          mvp,
          eye,
          state,
          timeSec,
          1,
          tNorm,
          [rx, holoY, rz],
          [sliceScaleX, sliceScaleY, 1.0],
          holoYaw,
          stereoParity
        );
      }

      // Render rig-specific Liquid Glass Reflection chamber around hologram
      if (holo.rigMode === 'pepperGhostPyramid') {
        this.drawHologramMesh(
          gl,
          this.holoPyramidMesh,
          mvp,
          eye,
          state,
          timeSec,
          0,
          0,
          [0, holoY - 0.1, 0],
          [1.0, 1.0, 1.0],
          holoYaw * 0.5,
          stereoParity
        );
      } else if (holo.rigMode === 'liquidGlassPrism') {
        this.drawHologramMesh(
          gl,
          this.prismMesh,
          mvp,
          eye,
          state,
          timeSec,
          2,
          0,
          [0, holoY, 0],
          [1.85, 1.45, 1.85],
          -holoYaw * 0.75,
          stereoParity
        );
      } else if (holo.rigMode === 'floatingCausticField') {
        this.drawHologramMesh(
          gl,
          this.torusMesh,
          mvp,
          eye,
          state,
          timeSec,
          2,
          0,
          [0, holoY, 0],
          [1.1, 1.1, 1.1],
          holoYaw * 0.9,
          stereoParity
        );
        this.drawHologramMesh(
          gl,
          this.holoSliceMesh,
          mvp,
          eye,
          state,
          timeSec,
          1,
          0.25,
          [0, holoY, 0],
          [1.0, 1.0, 1.0],
          holoYaw + Math.PI * 0.5,
          stereoParity
        );
      }

      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
      gl.depthMask(true);
    }

    // 5. CSP Thermal Flux Ring around (0,0,0)
    const thermalVerts: number[] = [];
    const loopSegs = 64;
    const majorR = 1.75;
    for (let i = 0; i < loopSegs; i++) {
      const a0 = (i / loopSegs) * Math.PI * 2;
      const a1 = ((i + 1) / loopSegs) * Math.PI * 2;
      const wave0 = Math.sin(a0 * 4 + timeSec * 2.2 * speedMult) * 0.12;
      const wave1 = Math.sin(a1 * 4 + timeSec * 2.2 * speedMult) * 0.12;
      thermalVerts.push(
        Math.cos(a0) * majorR,
        originY + wave0,
        Math.sin(a0) * majorR,
        Math.cos(a1) * majorR,
        originY + wave1,
        Math.sin(a1) * majorR
      );
    }
    this.drawLines(gl, mvp, thermalVerts, 1.0, 0.72, 0.26, 0.85);

    // 6. Volumetric Anamorphic Beam & Projector Booth Housing
    const projX = 0;
    const projY = 2.65;
    const projZ = 7.4;
    const bw = 0.55;
    const bh = 0.35;
    const beamVerts = [
      projX, projY, projZ, -sw, 0.25, scZ,
      projX, projY, projZ, sw, 0.25, scZ,
      projX, projY, projZ, sw, 0.25 + sh, scZ,
      projX, projY, projZ, -sw, 0.25 + sh, scZ,
      -bw, projY - bh, projZ, bw, projY - bh, projZ,
      bw, projY - bh, projZ, bw, projY + bh, projZ,
      bw, projY + bh, projZ, -bw, projY + bh, projZ,
      -bw, projY + bh, projZ, -bw, projY - bh, projZ,
      -bw, projY - bh, projZ + 0.9, bw, projY - bh, projZ + 0.9,
      bw, projY - bh, projZ + 0.9, bw, projY + bh, projZ + 0.9,
      bw, projY + bh, projZ + 0.9, -bw, projY + bh, projZ + 0.9,
      -bw, projY + bh, projZ + 0.9, -bw, projY - bh, projZ + 0.9,
      -bw, projY - bh, projZ, -bw, projY - bh, projZ + 0.9,
      bw, projY - bh, projZ, bw, projY - bh, projZ + 0.9,
      bw, projY + bh, projZ, bw, projY + bh, projZ + 0.9,
      -bw, projY + bh, projZ, -bw, projY + bh, projZ + 0.9,
    ];
    this.drawLines(
      gl,
      mvp,
      beamVerts,
      state.subtractMode ? 0.35 : sr,
      state.subtractMode ? 0.78 : sg,
      state.subtractMode ? 1.0 : sb,
      state.theatreView ? 0.38 : 0.26
    );

    if (state.theatreView) {
      const curtainVerts: number[] = [];
      for (const side of [-1, 1]) {
        for (let f = 0; f < 5; f++) {
          const cx = side * (4.65 + f * 0.28);
          curtainVerts.push(cx, -0.5, scZ - 0.1, cx, 4.4, scZ - 0.1);
        }
      }
      this.drawLines(gl, mvp, curtainVerts, 0.78, 0.22, 0.04, 0.45);
    }
  }

  private renderFallback2D(
    source: HTMLCanvasElement | HTMLVideoElement | HTMLImageElement,
    state: FractalStudioState,
    srcW: number,
    srcH: number
  ) {
    const ctx = this.ctx2d;
    if (!ctx) return;
    const target = this.fallbackCanvas ?? this.canvas;
    const cw = target.width;
    const ch = target.height;
    ctx.fillStyle = '#050506';
    ctx.fillRect(0, 0, cw, ch);

    const targetAspect = this.getTargetAspect(state, srcW, srcH);
    let drawW = cw;
    let drawH = cw / targetAspect;
    if (drawH > ch) {
      drawH = ch;
      drawW = ch * targetAspect;
    }
    const x = (cw - drawW) * 0.5;
    const y = (ch - drawH) * 0.5;

    ctx.save();
    const brightness = Math.pow(2, state.grading.exposure);
    const sat = state.videoToCartoon.enabled
      ? state.grading.saturation * state.videoToCartoon.colorBoost
      : state.grading.saturation;
    const con = state.videoToCartoon.enabled
      ? state.grading.contrast * 1.25
      : state.grading.contrast;
    ctx.filter = `brightness(${brightness}) contrast(${con}) saturate(${sat}) ${
      state.subtractMode ? 'invert(0.88)' : ''
    }`;
    ctx.drawImage(source, x, y, drawW, drawH);

    if (state.realTv.enabled && state.realTv.scanlines > 0.05) {
      ctx.fillStyle = `rgba(0,0,0,${0.25 * state.realTv.scanlines})`;
      for (let row = y; row < y + drawH; row += 4) {
        ctx.fillRect(x, row, drawW, 1.5);
      }
    }
    ctx.restore();
  }

  public captureSnapshotPng(): string | null {
    try {
      const target = this.fallbackCanvas && !this.gl ? this.fallbackCanvas : this.canvas;
      return target.toDataURL('image/png');
    } catch {
      return null;
    }
  }
}
