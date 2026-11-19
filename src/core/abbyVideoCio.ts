import type { AbbyFrameMetrics } from './fractalBrain';

export class AbbyVideoSampler {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D | null;
  private readonly w = 64;
  private readonly h = 36;
  private prevLuma: Float32Array;
  private hasPrev = false;

  constructor() {
    this.canvas = document.createElement('canvas');
    this.canvas.width = this.w;
    this.canvas.height = this.h;
    this.ctx = this.canvas.getContext('2d', {
      alpha: false,
      willReadFrequently: true,
    });
    this.prevLuma = new Float32Array(this.w * this.h);
  }

  public sample(
    source: HTMLCanvasElement | HTMLVideoElement | HTMLImageElement
  ): AbbyFrameMetrics | null {
    if (!this.ctx) return null;

    if (source instanceof HTMLVideoElement && source.readyState < 2) {
      return null;
    }
    if (source instanceof HTMLImageElement && (!source.complete || source.naturalWidth === 0)) {
      return null;
    }

    try {
      this.ctx.drawImage(source, 0, 0, this.w, this.h);
      const data = this.ctx.getImageData(0, 0, this.w, this.h).data;
      const count = this.w * this.h;

      let sumR = 0;
      let sumG = 0;
      let sumB = 0;
      let sumLuma = 0;
      let minLuma = 1;
      let maxLuma = 0;
      let sumSat = 0;
      let edgeSum = 0;
      let motionSum = 0;

      // Saturation-weighted dominant color accumulator
      let domWeightSum = 0;
      let domR = 0;
      let domG = 0;
      let domB = 0;

      for (let y = 0; y < this.h; y++) {
        for (let x = 0; x < this.w; x++) {
          const i = y * this.w + x;
          const idx = i * 4;
          const r = data[idx] / 255;
          const g = data[idx + 1] / 255;
          const b = data[idx + 2] / 255;

          const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
          const cMax = Math.max(r, g, b);
          const cMin = Math.min(r, g, b);
          const sat = cMax > 0.001 ? (cMax - cMin) / cMax : 0;

          sumR += r;
          sumG += g;
          sumB += b;
          sumLuma += luma;
          if (luma < minLuma) minLuma = luma;
          if (luma > maxLuma) maxLuma = luma;
          sumSat += sat;

          const chromaWeight = sat * (0.25 + luma * 0.75) + 0.01;
          domWeightSum += chromaWeight;
          domR += r * chromaWeight;
          domG += g * chromaWeight;
          domB += b * chromaWeight;

          if (x > 0) {
            const pIdx = (i - 1) * 4;
            const prevRowLuma =
              0.2126 * (data[pIdx] / 255) +
              0.7152 * (data[pIdx + 1] / 255) +
              0.0722 * (data[pIdx + 2] / 255);
            edgeSum += Math.abs(luma - prevRowLuma);
          }
          if (y > 0) {
            const uIdx = (i - this.w) * 4;
            const upLuma =
              0.2126 * (data[uIdx] / 255) +
              0.7152 * (data[uIdx + 1] / 255) +
              0.0722 * (data[uIdx + 2] / 255);
            edgeSum += Math.abs(luma - upLuma);
          }

          if (this.hasPrev) {
            motionSum += Math.abs(luma - this.prevLuma[i]);
          }
          this.prevLuma[i] = luma;
        }
      }

      this.hasPrev = true;

      const avgLuma = sumLuma / count;
      const avgR = sumR / count;
      const avgG = sumG / count;
      const avgB = sumB / count;
      const contrastSpan = Math.max(0, Math.min(1, maxLuma - minLuma));
      const warmthBias = Math.max(
        -1,
        Math.min(1, ((avgR - avgB) / Math.max(0.08, avgR + avgG + avgB)) * 2.2)
      );
      const saturationLevel = Math.max(0, Math.min(1, sumSat / count));
      const edgeDensity = Math.max(0, Math.min(1, (edgeSum / (count * 2)) * 6.5));
      const motionEnergy = Math.max(0, Math.min(1, (motionSum / count) * 8.0));

      const outR = Math.round(Math.max(0, Math.min(1, domR / Math.max(0.001, domWeightSum))) * 255);
      const outG = Math.round(Math.max(0, Math.min(1, domG / Math.max(0.001, domWeightSum))) * 255);
      const outB = Math.round(Math.max(0, Math.min(1, domB / Math.max(0.001, domWeightSum))) * 255);
      const toHex = (n: number) => n.toString(16).padStart(2, '0');
      const dominantHex = `#${toHex(outR)}${toHex(outG)}${toHex(outB)}`;

      return {
        avgLuma,
        contrastSpan,
        warmthBias,
        saturationLevel,
        motionEnergy,
        edgeDensity,
        dominantRgb: [outR / 255, outG / 255, outB / 255],
        dominantHex,
      };
    } catch {
      return null;
    }
  }
}
