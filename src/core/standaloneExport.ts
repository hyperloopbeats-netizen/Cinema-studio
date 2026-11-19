import type { FractalBrainSnapshot } from './fractalBrain';

export function exportStandaloneStudioHtml(snapshot: FractalBrainSnapshot): string {
  const initialStateJson = JSON.stringify(snapshot.state);
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>FractalOS // CinemaScope Studio (Standalone)</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { width: 100%; height: 100%; background: #050506; color: #f4f4f5; font-family: ui-sans-serif, system-ui, -apple-system, sans-serif; overflow: hidden; }
  canvas { display: block; width: 100%; height: 100%; }
  .hud-top { position: fixed; top: 0; left: 0; right: 0; z-index: 10; display: flex; align-items: center; justify-content: space-between; padding: 12px 20px; background: linear-gradient(to bottom, rgba(5,5,6,0.9), transparent); }
  .brand { font-weight: 700; font-size: 14px; letter-spacing: 0.06em; color: #f4f4f5; }
  .brand span { color: #ff6a00; }
  .hud-bot { position: fixed; bottom: 0; left: 0; right: 0; z-index: 10; display: flex; align-items: center; gap: 10px; flex-wrap: wrap; padding: 12px 20px; background: linear-gradient(to top, rgba(5,5,6,0.94), transparent); font-size: 12px; }
  button { background: #141418; color: #e4e4e7; border: 1px solid rgba(255,255,255,0.12); border-radius: 6px; padding: 6px 12px; font-size: 12px; cursor: pointer; white-space: nowrap; }
  button.active { background: #ff6a00; color: #050506; border-color: #ff6a00; font-weight: 600; }
  .meta { color: #a1a1aa; font-family: ui-monospace, monospace; font-size: 11px; font-variant-numeric: tabular-nums; }
</style>
</head>
<body>
<div class="hud-top">
  <div class="brand">FRACTAL<span>OS</span> CinemaScope Studio</div>
  <div id="fpsReadout" class="meta">2.39:1 · 60.0 FPS · 16.7 ms</div>
</div>
<canvas id="stage"></canvas>
<div class="hud-bot">
  <button id="btnPlay" class="active">Pause (Space)</button>
  <button id="btnMode">Mode: Cinema (1/2)</button>
  <button id="btnSub">Subtract (S)</button>
  <button id="btnSq" class="active">2.39x Scope (L)</button>
  <button id="btnLiq">Liquid: OFF (K)</button>
  <button id="btnTv">Real TV (V)</button>
  <button id="btnToon">Toon (X)</button>
  <button id="btnCyn" class="active">Cynthetoc AI (Z)</button>
  <button id="btnAbby" class="active">Abby CIO (B)</button>
  <button id="btnHarm" class="active">Prism (P)</button>
  <button id="btnHolo">Holo (H)</button>
  <button id="btnStereo">Stereo 3D (Y)</button>
  <button id="btnMorph">Morph (N)</button>
  <button id="btnQueen">Queen Seed (J)</button>
  <button id="btnTh">Theatre (T)</button>
  <button id="btnFps">Real FPS (F)</button>
  <label style="cursor:pointer"><button type="button" onclick="document.getElementById('fileIn').click()">Load Video/Image</button><input id="fileIn" type="file" accept="video/*,image/*" style="display:none" /></label>
</div>
<script>
(function(){
  var initial = ${initialStateJson};
  var state = Object.assign({}, initial);
  state.realTv = Object.assign({ enabled: false, profile: 'crt', scanlines: 0.56 }, initial.realTv || {});
  state.sceneDesigner = Object.assign({ theme: 'obsidianAmber', fractalComplexity: 5, gridDepth: 0.72, sweepIntensity: 0.65, atmosphereBlend: 0.25, motionSpeed: 1.0 }, initial.sceneDesigner || {});
  state.videoToCartoon = Object.assign({ enabled: false, style: 'celAnime', quantizeLevels: 5, edgeStrength: 0.78, inkThickness: 1.4, colorBoost: 1.28, halftone: 0.22 }, initial.videoToCartoon || {});
  state.fusionMatrix = Object.assign({ enabled: true, autoMaximize: true, synergyGain: 1.5, coherencePct: 98, pulseDepth: 0.68 }, initial.fusionMatrix || {});
  state.liquified3d = Object.assign({ enabled: true, fluidPreset: 'moltenAmber', viscosity: 0.58, refraction: 0.48, chromeFresnel: 0.78, rippleForce: 0.65, solidGeometry: true }, initial.liquified3d || {});
  state.cynthetocAi = Object.assign({ enabled: true, mode: 'adaptiveDirector', autonomy: 0.72, synthesisStrength: 0.68, relightIntensity: 0.52 }, initial.cynthetocAi || {});
  state.stereoscopic = Object.assign({ enabled: false, mode: 'anaglyphRedCyan', interaxial: 0.48 }, initial.stereoscopic || {});
  state.liquidBrain = Object.assign({ enabled: true, shape: 'mobiusRibbon', fusionMode: 'orbitalArray' }, initial.liquidBrain || {});
  state.holographic = Object.assign({ enabled: false, rigMode: 'pepperGhostPyramid', sliceCount: 8, reflectionMix: 0.86 }, initial.holographic || {});
  state.smartMorph = Object.assign({ enabled: false, mode: 'organicExpand', expansionForce: 0.62, cohesion: 0.74, flowRate: 1.05, radialBias: 0.52 }, initial.smartMorph || {});
  state.abbyCio = Object.assign({ enabled: true, logicProfile: 'balancedCinema', scanIntervalMs: 700, adaptationRate: 0.28 }, initial.abbyCio || {});
  state.kineticHarmonizer = Object.assign({ enabled: true, mode: 'chromaticRim', harmonyStrength: 0.52, edgeGlow: 0.58, syncWithAbby: true }, initial.kineticHarmonizer || {});
  state.daemonQueen = Object.assign({ enabled: true, autoSeed: false, seedIntervalSec: 12, maxSeededDaemons: 24, jsonFilePath: 'daemons.json' }, initial.daemonQueen || {});
  var apps = {};
  var daemons = [];
  for (var i = 1; i <= 40; i++) daemons.push({ id: 'd' + (i < 10 ? '0'+i : i), ticks: 0, status: 'ACTIVE', efficiencyPct: 99, boostFactor: 3.0 });
  var listeners = {};
  window.FractalBrain = {
    version: '2.5.0',
    registerApp: function(id, meta) { apps[id] = Object.assign({ id: id, fused: false }, meta || {}); return apps[id]; },
    fuseApp: function(id, cfg) { if (!apps[id]) apps[id] = { id: id }; apps[id].fused = true; apps[id].config = cfg || {}; return apps[id]; },
    set: function(k, v) { if (typeof k === 'string') state[k] = v; else Object.assign(state, k); return state; },
    setLiquid8k: function(e){ state.upscaleMode = e ? '8k' : 'off'; },
    setLiquid16k: function(e){ state.upscaleMode = e ? '16k' : 'off'; },
    setLiquid64k: function(e){ state.upscaleMode = e ? '64k' : 'off'; },
    setTheatreView: function(e){ state.theatreView = !!e; },
    setRealFpsMode: function(e){ state.realFpsMode = !!e; },
    setRealTvMode: function(e){ state.realTv.enabled = !!e; },
    setSceneDesigner: function(p){ Object.assign(state.sceneDesigner, p || {}); },
    setVideoToCartoon: function(p){ Object.assign(state.videoToCartoon, p || {}); },
    setFusionMatrix: function(p){ Object.assign(state.fusionMatrix, p || {}); },
    setLiquified3d: function(p){ Object.assign(state.liquified3d, p || {}); },
    setCynthetocAi: function(p){ Object.assign(state.cynthetocAi, p || {}); },
    setStereoscopic: function(p){ Object.assign(state.stereoscopic, p || {}); },
    setLiquidBrain: function(p){ Object.assign(state.liquidBrain, p || {}); },
    setHolographic: function(p){ Object.assign(state.holographic, p || {}); },
    setSmartMorph: function(p){ Object.assign(state.smartMorph, p || {}); },
    setAbbyCio: function(p){ Object.assign(state.abbyCio, p || {}); },
    setKineticHarmonizer: function(p){ Object.assign(state.kineticHarmonizer, p || {}); },
    setDaemonQueen: function(p){ Object.assign(state.daemonQueen, p || {}); },
    seedNewDaemon: function(spec){
      var idx = daemons.length + 1;
      var d = { id: 'q' + (idx < 10 ? '0'+idx : idx) + '-seed', name: spec || ('Queen Seed #' + (daemons.length - 39)), tier: 'QUEEN_SEED', parentQueenId: 'smart-daemon-queen', seededAt: new Date().toISOString(), status: 'ACTIVE', efficiencyPct: 99, boostFactor: 2.5 };
      daemons.push(d);
      return d;
    },
    getDaemonsJsonPayload: function(){
      return { schema: 'fractal-os-daemons/v1', queenVersion: '2.5.0', savedAt: new Date().toISOString(), totalDaemons: daemons.length, baseDaemons: 40, seededDaemons: daemons.slice(40), allDaemons: daemons };
    },
    projectHologramFromMainImage: function(rig){ state.holographic.enabled = true; if(rig) state.holographic.rigMode = rig; state.liquified3d.fluidPreset = 'liquidGlass'; state.mode = '3d'; },
    triggerLiquidPulse: function(){ state.liquified3d.enabled = true; },
    maximizeSystem: function(){ state.fusionMatrix.enabled = true; state.fusionMatrix.autoMaximize = true; state.fusionMatrix.coherencePct = 100; state.cynthetocAi.enabled = true; state.abbyCio.enabled = true; state.kineticHarmonizer.enabled = true; daemons.forEach(function(d){ d.status = 'MAXIMIZED'; d.efficiencyPct = 100; d.boostFactor = 3.0; }); return ['All Systems 3x Overdrive']; },
    getSnapshot: function(){ return { version: '2.5.0', state: state, apps: apps, daemons: daemons }; },
    emit: function(ev, p){ (listeners[ev]||[]).forEach(function(fn){ fn(p); }); },
    on: function(ev, fn){ listeners[ev] = listeners[ev]||[]; listeners[ev].push(fn); return function(){}; }
  };
  ['csp-collector','cinemascope-optics','cinemascope-projector','liquid-8k-upscaler','liquid-16k-upscaler','liquid-64k-upscaler','theatre-view','real-fps-engine','real-tv-engine','cinemascope-color-suite','timeline-sequencer','aimx-core-a','aimx-core-b','aimx-core-c','first-principle-loop','intelligent-scene-designer','intelligent-video-to-cartoon','intelligent-fusion-matrix','liquified-3d-studio','cynthetoc-ai','stereoscopic-3d-engine','liquid-brain-premise','holographic-projection-engine','smart-morph-app','smart-daemon-queen','abby-video-cio','kinetic-prism-harmonizer'].forEach(function(m){
    window.FractalBrain.registerApp(m); window.FractalBrain.fuseApp(m);
  });

  var canvas = document.getElementById('stage');
  var ctx = canvas.getContext('2d');
  var vid = document.createElement('video');
  vid.loop = true; vid.muted = true; vid.playsInline = true;
  var hasVid = false;
  var t = 0, last = performance.now(), frames = 0, fpsLast = last, fps = 60;

  document.getElementById('fileIn').addEventListener('change', function(e){
    var f = e.target.files[0]; if (!f) return;
    var url = URL.createObjectURL(f);
    if (f.type.startsWith('video/')) { vid.src = url; vid.play(); hasVid = true; }
  });

  function syncUi(){
    document.getElementById('btnPlay').textContent = state.playing ? 'Pause (Space)' : 'Play (Space)';
    document.getElementById('btnMode').textContent = 'Mode: ' + (state.mode === '3d' ? '3D Stage' : 'Cinema');
    document.getElementById('btnSub').classList.toggle('active', !!state.subtractMode);
    document.getElementById('btnSq').classList.toggle('active', !!state.anamorphicSqueeze);
    document.getElementById('btnLiq').textContent = 'Liquid: ' + String(state.upscaleMode).toUpperCase() + ' (K)';
    document.getElementById('btnTv').classList.toggle('active', !!(state.realTv && state.realTv.enabled));
    document.getElementById('btnToon').classList.toggle('active', !!(state.videoToCartoon && state.videoToCartoon.enabled));
    document.getElementById('btnCyn').classList.toggle('active', !!(state.cynthetocAi && state.cynthetocAi.enabled));
    document.getElementById('btnAbby').classList.toggle('active', !!(state.abbyCio && state.abbyCio.enabled));
    document.getElementById('btnHarm').classList.toggle('active', !!(state.kineticHarmonizer && state.kineticHarmonizer.enabled));
    document.getElementById('btnHolo').classList.toggle('active', !!(state.holographic && state.holographic.enabled));
    document.getElementById('btnStereo').classList.toggle('active', !!(state.stereoscopic && state.stereoscopic.enabled));
    document.getElementById('btnMorph').classList.toggle('active', !!(state.smartMorph && state.smartMorph.enabled));
    document.getElementById('btnQueen').textContent = 'Queen Seed (' + daemons.length + 'D) (J)';
    document.getElementById('btnTh').classList.toggle('active', !!state.theatreView);
    document.getElementById('btnFps').classList.toggle('active', !!state.realFpsMode);
  }
  document.getElementById('btnPlay').onclick = function(){ state.playing = !state.playing; if (hasVid) state.playing ? vid.play() : vid.pause(); syncUi(); };
  document.getElementById('btnMode').onclick = function(){ state.mode = state.mode === 'movie' ? '3d' : 'movie'; syncUi(); };
  document.getElementById('btnSub').onclick = function(){ state.subtractMode = !state.subtractMode; syncUi(); };
  document.getElementById('btnSq').onclick = function(){ state.anamorphicSqueeze = !state.anamorphicSqueeze; syncUi(); };
  document.getElementById('btnLiq').onclick = function(){ var o=['off','8k','16k','64k']; state.upscaleMode = o[(o.indexOf(state.upscaleMode)+1)%4]; syncUi(); };
  document.getElementById('btnTv').onclick = function(){ state.realTv.enabled = !state.realTv.enabled; syncUi(); };
  document.getElementById('btnToon').onclick = function(){ state.videoToCartoon.enabled = !state.videoToCartoon.enabled; syncUi(); };
  document.getElementById('btnCyn').onclick = function(){ state.cynthetocAi.enabled = !state.cynthetocAi.enabled; syncUi(); };
  document.getElementById('btnAbby').onclick = function(){ state.abbyCio.enabled = !state.abbyCio.enabled; syncUi(); };
  document.getElementById('btnHarm').onclick = function(){ state.kineticHarmonizer.enabled = !state.kineticHarmonizer.enabled; syncUi(); };
  document.getElementById('btnHolo').onclick = function(){ state.holographic.enabled = !state.holographic.enabled; syncUi(); };
  document.getElementById('btnStereo').onclick = function(){ state.stereoscopic.enabled = !state.stereoscopic.enabled; syncUi(); };
  document.getElementById('btnMorph').onclick = function(){ state.smartMorph.enabled = !state.smartMorph.enabled; syncUi(); };
  document.getElementById('btnQueen').onclick = function(){
    window.FractalBrain.seedNewDaemon();
    var blob = new Blob([JSON.stringify(window.FractalBrain.getDaemonsJsonPayload(), null, 2)], { type: 'application/json' });
    var u = URL.createObjectURL(blob); var a = document.createElement('a'); a.href = u; a.download = 'daemons.json'; a.click();
    setTimeout(function(){ URL.revokeObjectURL(u); }, 500);
    syncUi();
  };
  document.getElementById('btnTh').onclick = function(){ state.theatreView = !state.theatreView; syncUi(); };
  document.getElementById('btnFps').onclick = function(){ state.realFpsMode = !state.realFpsMode; syncUi(); };
  window.addEventListener('keydown', function(e){
    var k = e.key.toLowerCase();
    if (k === ' ') { e.preventDefault(); document.getElementById('btnPlay').click(); }
    else if (k === '1' || k === 'm') { state.mode = 'movie'; syncUi(); }
    else if (k === '2' || k === '3') { state.mode = '3d'; syncUi(); }
    else if (k === 's') document.getElementById('btnSub').click();
    else if (k === 'l') document.getElementById('btnSq').click();
    else if (k === 'k') document.getElementById('btnLiq').click();
    else if (k === 'v') document.getElementById('btnTv').click();
    else if (k === 'x') document.getElementById('btnToon').click();
    else if (k === 'z') document.getElementById('btnCyn').click();
    else if (k === 'b') document.getElementById('btnAbby').click();
    else if (k === 'p') document.getElementById('btnHarm').click();
    else if (k === 'h') document.getElementById('btnHolo').click();
    else if (k === 'y') document.getElementById('btnStereo').click();
    else if (k === 'n') document.getElementById('btnMorph').click();
    else if (k === 'j') document.getElementById('btnQueen').click();
    else if (k === 't') document.getElementById('btnTh').click();
    else if (k === 'f') document.getElementById('btnFps').click();
  });
  syncUi();

  function frame(now){
    var dt = Math.min(0.05, (now - last) / 1000); last = now;
    if (state.playing) t += dt;
    frames++;
    if (now - fpsLast >= 400) {
      fps = (frames * 1000) / (now - fpsLast); frames = 0; fpsLast = now;
      document.getElementById('fpsReadout').textContent = (state.realTv.enabled ? 'REAL TV · ' : '2.39:1 · ') + fps.toFixed(1) + ' FPS · ' + (1000/Math.max(1,fps)).toFixed(1) + ' ms';
    }
    var w = canvas.width = window.innerWidth;
    var h = canvas.height = window.innerHeight;
    ctx.fillStyle = state.theatreView ? '#020203' : '#050506';
    ctx.fillRect(0, 0, w, h);
    var ar = state.realTv.enabled ? 4/3 : (state.anamorphicSqueeze ? 2.39 : 16/9);
    var dw = w * (state.theatreView ? 0.88 : 0.96);
    var dh = dw / ar;
    if (dh > h * 0.86) { dh = h * 0.86; dw = dh * ar; }
    var x = (w - dw)/2, y = (h - dh)/2;
    ctx.save();
    if (state.subtractMode) ctx.filter = 'invert(0.88) contrast(1.25)';
    if (hasVid && vid.readyState >= 2) {
      ctx.drawImage(vid, x, y, dw, dh);
    } else {
      ctx.fillStyle = '#0c0806';
      ctx.fillRect(x, y, dw, dh);
      ctx.strokeStyle = '#ff6a00';
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, dw, dh);
      ctx.translate(w/2, h/2);
      for (var r=0; r<5; r++){
        ctx.save(); ctx.rotate(t*(0.2+r*0.07)*(r%2?-1:1));
        ctx.strokeStyle = 'rgba(255,106,0,'+(0.8-r*0.14)+')';
        ctx.beginPath();
        for (var s=0; s<=6; s++){ var a=s/6*Math.PI*2, rad=44+r*30; if(s===0) ctx.moveTo(Math.cos(a)*rad,Math.sin(a)*rad); else ctx.lineTo(Math.cos(a)*rad,Math.sin(a)*rad); }
        ctx.stroke(); ctx.restore();
      }
    }
    ctx.restore();
    if (state.realTv.enabled) {
      ctx.fillStyle = 'rgba(0,0,0,0.22)';
      for (var row = y; row < y + dh; row += 4) ctx.fillRect(x, row, dw, 1.5);
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();
</script>
</body>
</html>`;
}
