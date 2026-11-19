import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let running = !reduce;
const stage = document.getElementById('stage'), canvas = document.getElementById('gl');
const now = document.getElementById('now'), motionBtn = document.getElementById('motion');
const CH = {
  1: { name: '01 Hello', go: '#hello', color: '#c8553d', lines: ['. display "Hi, I\'m Lan."', '#Hi, I\'m Lan.', '. tab interests', '#labor econ  ********', '#urban econ  *******', '#music       ******', '. * pick a record'] },
  2: { name: '02 Education', go: '#education', color: '#4f7cac', lines: ['. list degree school yr', '#PhD  Clemson     2023', '#MS   UW-Madison  2018', '#BS   Minnesota   2015', '. * see Education'] },
  3: { name: '03 Research', go: '#research', color: '#f0b15c', lines: ['. use acs_2010_2019', '. reghdfe match ///', '>   ln_mktsize, a(major)', '#290 metro areas', '#Q: thicker market for', '#   your major, better fit?', '. * see Research'] },
  4: { name: '04 Teaching', go: '#teaching', color: '#6aa37c', lines: ['. list course level', '#Econometrics  Master', '#Econometrics  PhD', '. assert student.curious', '. * see Teaching'] },
  5: { name: '05 Life', go: '#life', color: '#9b6fb0', lines: ['. tab weekend', '#tennis     ******', '#guitar     *****', '#AI tinker  *******', '. * see Life'] }
};

async function main() {
  const [meta, room] = await Promise.all([fetch('meta.json').then(r => r.json()), fetch('room.json').then(r => r.json())]);
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
  renderer.outputColorSpace = THREE.SRGBColorSpace; renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
  const scene = new THREE.Scene(); scene.background = new THREE.Color(0x0a0f1c);
  const cam = new THREE.PerspectiveCamera(meta.cam.fov, 1.6, 0.1, 40);
  const target = new THREE.Vector3(...meta.cam.target), base = new THREE.Vector3(...meta.cam.pos).sub(target);
  const sph0 = new THREE.Spherical().setFromVector3(base);
  let az = 0, pol = 0, azT = 0, polT = 0;
  const scrC = new THREE.Vector3(...meta.screen.c); let zoom = 0, zoomT = 0;
  const _p = new THREE.Vector3(), _z = new THREE.Vector3(), _l = new THREE.Vector3();
  function placeCam() {
    const e = zoom * zoom * (3 - 2 * zoom), th = Math.tan(cam.fov * Math.PI / 360);
    _p.setFromSpherical(new THREE.Spherical(sph0.radius, sph0.phi + pol * (1 - e), sph0.theta + az * (1 - e))).add(target);
    const d = Math.max(meta.screen.h / 0.62 / (2 * th), meta.screen.w / 0.78 / (2 * th * cam.aspect));
    _z.set(scrC.x, scrC.y, scrC.z + d); cam.position.lerpVectors(_p, _z, e); cam.lookAt(_l.lerpVectors(target, scrC, e));
  }
  placeCam();

  const tl = new THREE.TextureLoader();
  const tex = (u, flip) => new Promise((ok, no) => tl.load(u, t => { t.colorSpace = THREE.SRGBColorSpace; t.flipY = !!flip; t.anisotropy = 8; ok(t); }, undefined, no));
  const names = ['A', 'B', 'C', 'D'];
  const maps = await Promise.all(names.flatMap(g => [tex(`bake_${g}_on.webp`), tex(`bake_${g}_off.webp`)]));
  const lampU = { value: 0 };
  const mats = {};
  names.forEach((g, i) => mats[g] = new THREE.ShaderMaterial({
    uniforms: { a: { value: maps[i * 2] }, b: { value: maps[i * 2 + 1] }, m: lampU },
    vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
    fragmentShader: 'uniform sampler2D a; uniform sampler2D b; uniform float m; varying vec2 vUv; void main(){ gl_FragColor = mix(texture2D(a, vUv), texture2D(b, vUv), m); \n#include <colorspace_fragment>\n }'
  }));
  const bin = Uint8Array.from(atob(room.glb), c => c.charCodeAt(0)).buffer;
  const gltf = await new Promise((ok, no) => new GLTFLoader().parse(bin, '', ok, no));
  gltf.scene.traverse(o => { if (o.isMesh) { const g = (o.name.match(/grp([ABCD])/) || o.parent.name.match(/grp([ABCD])/) || [])[1]; o.material = mats[g] || mats.C; } });
  scene.add(gltf.scene);

  /* skyline far behind the glass, so it shifts against the window frame as the camera moves */
  const skyImg = await new Promise((ok, no) => { const im = new Image(); im.onload = () => ok(im); im.onerror = no; im.src = 'nyc.webp'; });
  const skyT = new THREE.Texture(skyImg); skyT.colorSpace = THREE.SRGBColorSpace; skyT.needsUpdate = true;
  const sky = new THREE.Mesh(new THREE.PlaneGeometry(4.6, 4.6 * skyImg.height / skyImg.width), new THREE.MeshBasicMaterial({ map: skyT, color: 0xe4e4e4 }));
  sky.position.set(0.15, 0.62, -5); scene.add(sky);

  /* misted glass with beads and runners */
  const W = 1020, H = 600, k = W / 520, R = Math.random;
  const mk = () => { const c = document.createElement('canvas'); c.width = W; c.height = H; return c; };
  const gc = mk(), gx = gc.getContext('2d'), mc = mk(), mx = mc.getContext('2d'), sc = mk(), sx = sc.getContext('2d');
  let beads = [], runners = [], dirty = true;
  const bead = (x, y, r) => ({ x, y, rx: r * (.85 + R() * .25), ry: r * (1 + R() * .35), tilt: (R() - .5) * .5 });
  const runner = y => ({ x: R() * W, y: y === undefined ? -8 : y, r: (0.85 + R() * 0.55) * k, v: 0, wait: R() * 60, drift: (R() - .5) * .3 });
  for (let i = 0; i < 190; i++) beads.push(bead(R() * W, R() * H, (R() < .8 ? .55 + R() * .9 : 1.4 + R() * 1.1) * k));
  for (let i = 0; i < 4; i++) runners.push(runner(R() * H * .7));
  function drop(c, d, big) {
    c.save(); c.translate(d.x, d.y); c.rotate(d.tilt || 0); c.beginPath();
    if (big) { c.moveTo(0, -d.ry * 1.25); c.bezierCurveTo(d.rx * .9, -d.ry * .5, d.rx * 1.05, d.ry * .55, 0, d.ry); c.bezierCurveTo(-d.rx * 1.05, d.ry * .55, -d.rx * .9, -d.ry * .5, 0, -d.ry * 1.25); }
    else c.ellipse(0, 0, d.rx, d.ry, 0, 0, 7);
    c.clip();
    c.save(); c.scale(-1, -1); c.drawImage(skyImg, -d.rx * 1.9, -d.ry * 1.9, d.rx * 3.8, d.ry * 3.8); c.restore();
    const g = c.createRadialGradient(0, d.ry * .15, d.rx * .2, 0, 0, Math.max(d.rx, d.ry) * 1.15);
    g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(.8, 'rgba(0,0,0,.06)'); g.addColorStop(1, 'rgba(0,0,0,.3)');
    c.fillStyle = g; c.fillRect(-d.rx * 1.3, -d.ry * 1.4, d.rx * 2.6, d.ry * 2.8);
    c.fillStyle = 'rgba(255,255,255,.75)'; c.beginPath(); c.ellipse(-d.rx * .32, -d.ry * .38, d.rx * .16, d.ry * .12, -.6, 0, 7); c.fill();
    c.restore();
  }
  function rainDraw() {
    if (dirty) { sx.clearRect(0, 0, W, H); for (const b of beads) drop(sx, b, false); dirty = false; }
    gx.globalCompositeOperation = 'source-over'; gx.clearRect(0, 0, W, H);
    gx.fillStyle = 'rgba(205,214,232,.17)'; gx.fillRect(0, 0, W, H);
    gx.globalCompositeOperation = 'destination-out'; gx.drawImage(mc, 0, 0);
    gx.globalCompositeOperation = 'source-over'; gx.drawImage(sc, 0, 0);
    for (const r of runners) drop(gx, { x: r.x, y: r.y, rx: r.r * .82, ry: r.r, tilt: 0 }, true);
    glassT.needsUpdate = true;
  }
  function rainStep() {
    mx.globalCompositeOperation = 'destination-out'; mx.fillStyle = 'rgba(0,0,0,.012)'; mx.fillRect(0, 0, W, H);
    mx.globalCompositeOperation = 'source-over'; mx.strokeStyle = '#fff'; mx.lineCap = 'round';
    for (let i = runners.length - 1; i >= 0; i--) {
      const r = runners[i];
      if (r.wait > 0) { r.wait--; if (r.wait <= 0) r.v = (1.2 + R() * 3.2) * k; continue; }
      const px = r.x, py = r.y; r.y += r.v; r.x += r.drift + (R() - .5) * .5 * k; r.v *= .985;
      mx.lineWidth = r.r * 1.6; mx.beginPath(); mx.moveTo(px, py); mx.lineTo(r.x, r.y); mx.stroke();
      if (R() < .05) { beads.push(bead(r.x + (R() - .5) * r.r, r.y - r.r * 1.5, (.4 + R() * .5) * k)); dirty = true; }
      for (let j = beads.length - 1; j >= 0; j--) { const b = beads[j]; if (Math.abs(b.x - r.x) < r.r && Math.abs(b.y - r.y) < r.r * 1.2) { beads.splice(j, 1); r.r = Math.min(1.7 * k, r.r + .03 * k); r.v += .25 * k; dirty = true; } }
      if (r.v < .35 * k) r.wait = 20 + R() * 160;
      if (r.y > H + 12) runners.splice(i, 1);
    }
    if (runners.length < 6 && R() < .03) runners.push(runner(R() < .5 ? undefined : R() * H * .5));
    if (beads.length < 210 && R() < .25) { beads.push(bead(R() * W, R() * H, (.5 + R() * .8) * k)); dirty = true; }
    if (beads.length > 270) { beads.splice(0, 20); dirty = true; }
  }
  const glassT = new THREE.CanvasTexture(gc); glassT.colorSpace = THREE.SRGBColorSpace;
  const glass = new THREE.Mesh(new THREE.PlaneGeometry(meta.window.w, meta.window.h), new THREE.MeshBasicMaterial({ map: glassT, transparent: true, depthWrite: false }));
  glass.position.set(...meta.window.c); scene.add(glass); rainDraw();

  /* computer screen */
  const SCW = 680, SCH = 510, scv = document.createElement('canvas'); scv.width = SCW; scv.height = SCH; const sg = scv.getContext('2d');
  const screenT = new THREE.CanvasTexture(scv); screenT.colorSpace = THREE.SRGBColorSpace;
  const screen = new THREE.Mesh(new THREE.PlaneGeometry(meta.screen.w, meta.screen.h), new THREE.MeshBasicMaterial({ map: screenT }));
  screen.position.set(...meta.screen.c); scene.add(screen);
  try { await document.fonts.load('44px VT323'); } catch (e) {}
  let shown = { lines: [], n: 0, noise: false };
  const clockStr = () => new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Shanghai' }).format(new Date());
  function drawScreen() {
    sg.shadowBlur = 0; sg.fillStyle = '#05121a'; sg.fillRect(0, 0, SCW, SCH);
    if (zoomT === 1 && zoom > 0.5) { /* the live terminal sits on top */ }
    else if (shown.noise) { for (let i = 0; i < 2600; i++) { sg.fillStyle = `rgba(${120 + R() * 135 | 0},${200 + R() * 55 | 0},255,${R() * .7})`; sg.fillRect(R() * SCW, R() * SCH, 3 + R() * 9, 2); } }
    else {
      sg.font = '44px VT323, monospace'; sg.textBaseline = 'top'; sg.shadowColor = 'rgba(60,220,255,.8)'; sg.shadowBlur = 12;
      sg.fillStyle = '#9ff6ff'; sg.fillText('◆ File Edit', 22, 10); const cs = clockStr(); sg.fillText(cs, SCW - 22 - sg.measureText(cs).width, 10);
      sg.fillRect(0, 60, SCW, 2);
      let left = shown.n, y = 76, cx = 22, cy = y;
      for (const L of shown.lines) {
        if (left <= 0) break; const isOut = L.startsWith('#'), txt = isOut ? L.slice(1) : L, s = txt.slice(0, left); left -= txt.length + 1;
        sg.fillStyle = isOut ? '#d9fdff' : '#45c4d6'; sg.fillText(s, 22, y); cx = 22 + sg.measureText(s).width; cy = y;
        if (left > 0) { y += 56; cx = 22; cy = y; }
      }
      if (Math.floor(performance.now() / 500) % 2 === 0 || reduce) { sg.fillStyle = '#9ff6ff'; sg.fillRect(cx + 4, cy + 6, 20, 34); }
    }
    sg.shadowBlur = 0; sg.fillStyle = 'rgba(0,0,0,.22)'; for (let y = 0; y < SCH; y += 4) sg.fillRect(0, y, SCW, 1.5);
    screenT.needsUpdate = true;
  }

  /* spinning record label */
  const lc = document.createElement('canvas'); lc.width = lc.height = 128; const lg = lc.getContext('2d');
  const labelT = new THREE.CanvasTexture(lc); labelT.colorSpace = THREE.SRGBColorSpace;
  function paintLabel(col) { lg.fillStyle = '#d9d0b8'; lg.fillRect(0, 0, 128, 128); lg.fillStyle = col; lg.fillRect(0, 0, 64, 128); lg.fillStyle = '#111'; lg.beginPath(); lg.arc(64, 64, 6, 0, 7); lg.fill(); labelT.needsUpdate = true; }
  const lgeo = new THREE.CircleGeometry(meta.label.r, 48); lgeo.rotateX(-Math.PI / 2);
  const label = new THREE.Mesh(lgeo, new THREE.MeshBasicMaterial({ map: labelT, color: 0xb0b0b0 })); label.position.set(...meta.label.c); scene.add(label);

  /* soft glows */
  function glowTex(r, g, b) { const c = document.createElement('canvas'); c.width = c.height = 128; const x = c.getContext('2d'); const gr = x.createRadialGradient(64, 64, 0, 64, 64, 64); gr.addColorStop(0, `rgba(${r},${g},${b},.9)`); gr.addColorStop(.35, `rgba(${r},${g},${b},.28)`); gr.addColorStop(1, `rgba(${r},${g},${b},0)`); x.fillStyle = gr; x.fillRect(0, 0, 128, 128); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t; }
  const glow = (t, w, h, p) => { const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: t, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true })); s.scale.set(w, h, 1); s.position.set(...p); scene.add(s); return s; };
  { /* the strip's halo is painted flat on the wall, so it stays put when the camera moves */
    const c = document.createElement('canvas'); c.width = 256; c.height = 64; const x = c.getContext('2d');
    const gv = x.createLinearGradient(0, 0, 0, 64); gv.addColorStop(0, 'rgba(40,200,255,0)'); gv.addColorStop(.42, 'rgba(40,200,255,.30)'); gv.addColorStop(.5, 'rgba(120,230,255,.85)'); gv.addColorStop(.58, 'rgba(40,200,255,.30)'); gv.addColorStop(1, 'rgba(40,200,255,0)');
    x.fillStyle = gv; x.fillRect(0, 0, 256, 64); x.globalCompositeOperation = 'destination-in';
    const gh = x.createLinearGradient(0, 0, 256, 0); gh.addColorStop(0, 'rgba(0,0,0,0)'); gh.addColorStop(.06, '#000'); gh.addColorStop(.94, '#000'); gh.addColorStop(1, 'rgba(0,0,0,0)'); x.fillStyle = gh; x.fillRect(0, 0, 256, 64);
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace;
    const m = new THREE.Mesh(new THREE.PlaneGeometry(meta.window.w + 0.2, 0.2), new THREE.MeshBasicMaterial({ map: t, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }));
    m.position.set(meta.window.c[0], meta.window.c[1] + meta.window.h / 2 + 0.022, 0.014); scene.add(m);
  }
  const bulbGlow = glow(glowTex(255, 190, 110), 0.34, 0.34, meta.lamp);

  /* picking */
  const ghost = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false, colorWrite: false });
  const hits = meta.sleeves.map((s, i) => { const m = new THREE.Mesh(new THREE.BoxGeometry(...s.s), ghost); m.position.set(...s.c); m.userData.rec = i + 1; scene.add(m); return m; });
  const lampHit = new THREE.Mesh(new THREE.SphereGeometry(0.12, 12, 8), ghost); lampHit.position.set(...meta.lamp); lampHit.userData.lamp = true; lampHit.userData.name = 'Lamp'; scene.add(lampHit); hits.push(lampHit);
  hits.forEach(h => { if (h.userData.rec) h.userData.name = CH[h.userData.rec].name; });
  const addHit = (geo, pos, data) => { const m = new THREE.Mesh(geo, ghost); m.position.set(...pos); Object.assign(m.userData, data); scene.add(m); hits.push(m); return m; };
  addHit(new THREE.BoxGeometry(meta.screen.w, meta.screen.h, 0.02), meta.screen.c, { screen: true, name: 'Computer' });
  addHit(new THREE.BoxGeometry(0.32, 0.8, 0.1), [0.775, 0.5, 0.05], { tip: 'guitar', name: 'Guitar' });
  addHit(new THREE.BoxGeometry(0.26, 0.11, 0.2), [0.61, 0.05, 0.31], { tip: 'books', name: 'Books' });
  addHit(new THREE.BoxGeometry(0.19, 0.03, 0.24), [0.565, 0.012, 0.505], { tip: 'notebook', name: 'Notebook' });
  addHit(new THREE.BoxGeometry(0.25, 0.33, 0.03), [-0.909, 0.68, 0.013], { tip: 'poster', name: 'Posters' });
  addHit(new THREE.BoxGeometry(0.25, 0.33, 0.03), [-0.623, 0.68, 0.013], { tip: 'poster', name: 'Posters' });
  addHit(new THREE.SphereGeometry(0.065, 10, 8), [meta.mug[0], 0.05, meta.mug[2]], { tip: 'mug', name: 'Coffee' });
  const marker = new THREE.Mesh(new THREE.ConeGeometry(0.013, 0.028, 16), new THREE.MeshBasicMaterial({ color: 0xf0b15c })); marker.rotation.x = Math.PI; scene.add(marker);
  const SLW = meta.sleeves[0].s[0], OFF = meta.sleeves[1].c[0] - meta.sleeves[0].c[0];
  const markerPos = i => { const s = meta.sleeves[i]; return [i === 0 ? s.c[0] - OFF / 2 : s.c[0] + SLW / 2 - OFF / 2, meta.sleeveTop + 0.04, s.c[2]]; };

  let job = 0, started = false, current = 1, lampOn = true, lampT = 0;
  function play(n) {
    const c = CH[n], my = ++job; current = n;
    now.textContent = c.name; now.setAttribute('href', c.go);
    marker.position.set(...markerPos(n - 1));
    const total = c.lines.reduce((a, l) => a + l.length + 1, 0);
    if (reduce || !started) { started = true; paintLabel(c.color); shown = { lines: c.lines, n: reduce ? total : 0, noise: false }; if (reduce) return; }
    else shown.noise = true;
    setTimeout(() => {
      if (my !== job) return; paintLabel(c.color); shown = { lines: c.lines, n: 0, noise: false };
      (function type() { if (my !== job) return; shown.n += 2; if (shown.n % 4 === 0) sfx.tick(); if (shown.n < total) setTimeout(type, 28); })();
    }, shown.noise ? 420 : 0);
  }
  function toggleLamp() { sfx.click(); lampOn = !lampOn; lampT = lampOn ? 0 : 1; const b = document.getElementById('lampbtn'); if (b) b.setAttribute('aria-pressed', String(lampOn)); }
  const lb = document.getElementById('lampbtn'); if (lb) lb.addEventListener('click', toggleLamp);

  /* ---- sound: synthesized, off until asked for ---- */
  const sfx = (() => {
    let ac = null, on = false, master = null; const btn = document.getElementById('sound');
    const noise = sec => { const b = ac.createBuffer(1, ac.sampleRate * sec, ac.sampleRate), d = b.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1; return b; };
    function start() {
      ac = new (window.AudioContext || window.webkitAudioContext)(); master = ac.createGain(); master.gain.value = 0.9; master.connect(ac.destination);
      const rain = ac.createBufferSource(); rain.buffer = noise(2); rain.loop = true; const lp = ac.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 950; const rg = ac.createGain(); rg.gain.value = 0.03; rain.connect(lp).connect(rg).connect(master); rain.start();
      const cb = ac.createBuffer(1, ac.sampleRate * 4, ac.sampleRate), cd = cb.getChannelData(0);
      for (let i = 0; i < cd.length; i++) if (Math.random() < 0.0007) { const a = (0.3 + Math.random() * 0.7) * (Math.random() < .5 ? -1 : 1); for (let j = 0; j < 14 && i + j < cd.length; j++) cd[i + j] = a * (1 - j / 14); }
      const cr = ac.createBufferSource(); cr.buffer = cb; cr.loop = true; const hp = ac.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 1400; const cg = ac.createGain(); cg.gain.value = 0.1; cr.connect(hp).connect(cg).connect(master); cr.start();
    }
    function burst(type, f0, f1, dur, gain) {
      if (!on || !ac) return; const t = ac.currentTime, src = ac.createBufferSource(); src.buffer = noise(dur + 0.05);
      const f = ac.createBiquadFilter(); f.type = type; f.frequency.setValueAtTime(f0, t); f.frequency.exponentialRampToValueAtTime(f1, t + dur);
      const g = ac.createGain(); g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(gain, t + Math.min(0.03, dur * .3)); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      src.connect(f).connect(g).connect(master); src.start(t); src.stop(t + dur + 0.05);
    }
    function thump() { if (!on || !ac) return; const t = ac.currentTime, o = ac.createOscillator(), g = ac.createGain(); o.frequency.setValueAtTime(95, t); o.frequency.exponentialRampToValueAtTime(45, t + 0.14); g.gain.setValueAtTime(0.28, t); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.16); o.connect(g).connect(master); o.start(t); o.stop(t + 0.18); }
    if (btn) btn.addEventListener('click', () => { on = !on; try { if (on && !ac) start(); else if (ac) (on ? ac.resume() : ac.suspend()); } catch (e) { on = false; } btn.textContent = on ? 'Sound: on' : 'Sound: off'; btn.setAttribute('aria-pressed', String(on)); });
    return { click: () => burst('highpass', 2600, 1800, 0.035, 0.22), tick: () => burst('bandpass', 3600, 3000, 0.014, 0.05), whoosh: () => burst('bandpass', 320, 1900, 0.42, 0.11), thump };
  })();
  window.sfx = sfx;

  /* ---- little notes for the other things on the desk ---- */
  const mk2 = (cls, html) => { const d = document.createElement('div'); d.className = cls; if (html) d.innerHTML = html; document.body.appendChild(d); return d; };
  const hov = mk2('hov'), tip = mk2('tip');
  const JOKES = ['Robust standard errors. Always.', 'Correlation is not causation, but it is a fine reason for a second coffee.', 'This mug has a point estimate and no confidence interval.', 'Instrument for staying awake: relevant, and almost certainly not exogenous.', 'Fifth click, and now it is significant. You were p-hacking the mug.'];
  const QUOTES = [
    ['Harry Potter', 'It does not do to dwell on dreams and forget to live.', 'Albus Dumbledore'],
    ['Sherlock', 'The game is on.', 'Sherlock Holmes'],
    ['The Good Wife', 'Sometimes I think justice would be better served with a coin flip.', 'Will Gardner'],
    ['The Newsroom', 'The first step in solving any problem is recognizing there is one.', 'Will McAvoy'],
    ['White Collar', 'Did you just lie to a priest?', 'Peter Burke'],
    ['Fleabag', 'Hair is everything.', 'Fleabag'],
    ['The Big Bang Theory', 'Bazinga!', 'Sheldon Cooper'],
    ['Downton Abbey', 'What is a weekend?', 'Violet Crawley'],
    ['Dead Poets Society', 'Carpe diem. Seize the day, boys.', 'John Keating']
  ];
  const FORMULAS = [
    ['Cobb–Douglas production', 'Y = A K<sup>α</sup> L<sup>1−α</sup>'],
    ['Solow growth', 'k̇ = s f(k) − (n + δ) k'],
    ['Mincer earnings', 'ln w = β₀ + β₁S + β₂X + β₃X² + ε'],
    ['Matching function', 'm(u, v) = A u<sup>α</sup> v<sup>1−α</sup>'],
    ['Euler equation', 'u′(cₜ) = β (1 + r) u′(cₜ₊₁)'],
    ['Ordinary least squares', 'β̂ = (X′X)⁻¹ X′y'],
    ['Difference-in-differences', 'τ = (Ȳ<sub>T,post</sub> − Ȳ<sub>T,pre</sub>) − (Ȳ<sub>C,post</sub> − Ȳ<sub>C,pre</sub>)']
  ];
  const SONGS = [['Someone Like You', 'Adele'], ['Rolling in the Deep', 'Adele'], ['Creep', 'Radiohead'], ['No Surprises', 'Radiohead'], ['Dreams', 'The Cranberries'], ['Zombie', 'The Cranberries'], ['Love Story', 'Taylor Swift'], ['All Too Well', 'Taylor Swift'], ['The Story', 'Brandi Carlile'], ['The Joke', 'Brandi Carlile']];
  const lastPick = {}; const draw1 = (key, arr) => { let k; do { k = Math.floor(Math.random() * arr.length); } while (arr.length > 1 && k === lastPick[key]); lastPick[key] = k; return arr[k]; };
  let mugN = 0, tipTimer = 0;
  function showTip(kind, e) {
    let head, text, by = '', link = 0, linkText = '', cls = '';
    if (kind === 'mug') { head = 'Coffee'; text = JOKES[mugN % JOKES.length]; mugN++; }
    else if (kind === 'poster') { const q = draw1(kind, QUOTES); head = q[0]; text = '“' + q[1] + '”'; by = '— ' + q[2]; cls = 'q'; }
    else if (kind === 'notebook') { const f = draw1(kind, FORMULAS); head = f[0]; text = f[1]; cls = 'f'; }
    else if (kind === 'guitar') { const g = draw1(kind, SONGS); head = 'On the guitar'; text = g[0]; by = g[1]; cls = 'q'; link = 5; linkText = 'Open 05 Life'; }
    else { head = 'On the desk'; text = 'Two working papers on major-specific labor markets and how well graduates match to jobs.'; link = 3; linkText = 'Open 03 Research'; }
    tip.innerHTML = '<b></b><span></span>' + (by ? '<em></em>' : '') + (link ? '<button type="button"></button>' : '');
    tip.querySelector('b').textContent = head; const sp = tip.querySelector('span'); if (cls === 'f') sp.innerHTML = text; else sp.textContent = text; sp.className = cls; if (by) tip.querySelector('em').textContent = by;
    if (link) { const bt = tip.querySelector('button'); bt.textContent = linkText; bt.addEventListener('click', () => { tip.classList.remove('on'); window.openRecord && window.openRecord(link); }); }
    tip.classList.add('on'); const w = tip.offsetWidth, h = tip.offsetHeight;
    tip.style.left = Math.max(12, Math.min(innerWidth - w - 12, e.clientX - w / 2)) + 'px'; tip.style.top = Math.max(70, e.clientY - h - 18) + 'px';
    clearTimeout(tipTimer); tipTimer = setTimeout(() => tip.classList.remove('on'), 7000); sfx.click();
  }

  /* ---- the computer: click to lean in, then type ---- */
  const term = mk2('term', '<div class="tlog" id="tlog"></div><form id="tform"><span>.&nbsp;</span><input id="tin" autocomplete="off" autocapitalize="off" spellcheck="false" aria-label="Terminal input"></form>');
  const tlog = term.querySelector('#tlog'), tin = term.querySelector('#tin');
  const INFO = {
    hello: ['Lan Lan, applied microeconomist', 'Assistant Professor, Li Anmin', '  Institute of Economics Research,', '  Liaoning University (2023-)', 'Visiting Scholar, FU Berlin (2026)'],
    education: ['2023  PhD Economics, Clemson', '2018  MS  Economics, UW-Madison', '2015  BS  Economics, Minnesota'],
    research: ['[1] The Benefits of Major-related', '    Labor Markets for Job Match', '    Quality of College Graduates', '[2] The Major-Specific Market Size', '    and the Job Match of Power', '    Couples'],
    teaching: ['Econometrics (Master\'s, Ph.D.)', '  Liaoning University, 2023-', 'Macroeconomics, Clemson'],
    life: ['tennis', 'guitar', 'building odd things with AI']
  };
  const KEYS = Object.keys(INFO);
  const say = (lines, cls) => { for (const l of [].concat(lines)) { const d = document.createElement('div'); if (cls) d.className = cls; d.textContent = l; tlog.appendChild(d); } tlog.scrollTop = tlog.scrollHeight; };
  function run(raw) {
    const cmd = raw.trim(); say('. ' + cmd, 'c'); if (!cmd) return; const [a, b] = cmd.toLowerCase().split(/\s+/);
    if (a === 'help') say(['ls            list the records', 'cat <name>    read one here', 'open <name>   pull the record out', 'lamp | rain   switches', 'clear | exit']);
    else if (a === 'ls' || a === 'dir') say(KEYS.map((k, i) => '0' + (i + 1) + '  ' + k));
    else if ((a === 'cat' || a === 'type' || a === 'list' || a === 'describe') && INFO[b]) say(INFO[b]);
    else if (INFO[a]) say(INFO[a]);
    else if (a === 'open' && INFO[b]) { say('pulling ' + b + '...'); zoomOut(); setTimeout(() => window.openRecord && window.openRecord(KEYS.indexOf(b) + 1), 650); }
    else if (a === 'cat' || a === 'open') say('no such record. try: ls');
    else if (a === 'lamp') { toggleLamp(); say('lamp ' + (lampOn ? 'on' : 'off')); }
    else if (a === 'rain') { motionBtn.click(); say(running ? 'raining' : 'paused'); }
    else if (a === 'clear' || a === 'cls') tlog.replaceChildren();
    else if (a === 'exit' || a === 'quit' || a === 'q') zoomOut();
    else if (a === 'whoami') say('a visitor. welcome.');
    else if (a === 'email' || a === 'contact') say('doublellan1015@outlook.com');
    else if (a === 'sudo') say('this desk has no root. only roots of unity.');
    else if (a === 'reg' || a === 'regress' || a === 'reghdfe') say(['      match |  Coef.   Std. Err.', '------------+-------------------', '   ln_mkt   |  (see the paper)', 'note: identification not included', '      in this terminal.']);
    else say('unrecognized command: ' + a + '. try: help');
  }
  term.querySelector('#tform').addEventListener('submit', e => { e.preventDefault(); const v = tin.value; tin.value = ''; sfx.click(); run(v); });
  tin.addEventListener('keydown', e => { if (e.key === 'Escape') { e.stopPropagation(); zoomOut(); } else if (e.key.length === 1) sfx.tick(); });
  let greeted = false;
  function zoomIn() { if (zoomT) return; zoomT = 1; azT = 0; polT = 0; sfx.whoosh(); if (!greeted) { greeted = true; say(['Lan Lan desk terminal', 'type help, or exit to lean back', '']); } setTimeout(() => { if (zoomT) tin.focus({ preventScroll: true }); }, 700); }
  function zoomOut() { if (!zoomT) return; zoomT = 0; tin.blur(); sfx.whoosh(); }
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && zoomT) zoomOut(); });

  /* ---- first-visit pointers ---- */
  const coachA = mk2('coach', 'Pick a record'), coachB = mk2('coach', 'Or lean into the screen'); let coached = false;
  const endCoach = () => { if (coached) return; coached = true; coachA.classList.add('gone'); coachB.classList.add('gone'); };
  setTimeout(endCoach, 16000);

  function act(h, e) {
    if (zoomT) { if (!h || !h.screen) zoomOut(); else tin.focus({ preventScroll: true }); return; }
    if (!h) { tip.classList.remove('on'); return; }
    endCoach(); hov.classList.remove('on');
    if (h.lamp) toggleLamp(); else if (h.screen) zoomIn(); else if (h.tip) showTip(h.tip, e);
    else if (window.openRecord) window.openRecord(h.rec); else play(h.rec);
  }
  const _a = new THREE.Vector3(), _b = new THREE.Vector3();
  function layout() {
    const r = canvas.getBoundingClientRect(), px = v => [r.left + (v.x + 1) / 2 * r.width, r.top + (1 - v.y) / 2 * r.height];
    if (zoom > 0.02) {
      const a = px(_a.set(scrC.x - meta.screen.w / 2, scrC.y + meta.screen.h / 2, scrC.z + 0.001).project(cam)), b = px(_b.set(scrC.x + meta.screen.w / 2, scrC.y - meta.screen.h / 2, scrC.z + 0.001).project(cam));
      term.style.left = a[0] + 'px'; term.style.top = a[1] + 'px'; term.style.width = (b[0] - a[0]) + 'px'; term.style.height = (b[1] - a[1]) + 'px'; term.style.fontSize = Math.max(10, (b[1] - a[1]) / 20.5) + 'px';
      const o = Math.max(0, Math.min(1, (zoom - 0.7) / 0.25)); term.style.opacity = o; term.style.display = 'flex'; term.style.pointerEvents = zoomT ? 'auto' : 'none';
    } else term.style.display = 'none';
    if (!coached) {
      const veilOpen = document.getElementById('veil').classList.contains('open');
      const s1 = meta.sleeves[0], p1 = px(_a.set(s1.c[0], meta.sleeveTop + 0.1, s1.c[2]).project(cam)), p2 = px(_b.set(scrC.x, scrC.y + meta.screen.h / 2 + 0.11, scrC.z).project(cam));
      coachA.style.left = p1[0] + 'px'; coachA.style.top = p1[1] + 'px'; coachB.style.left = p2[0] + 'px'; coachB.style.top = p2[1] + 'px';
      coachA.style.visibility = coachB.style.visibility = (veilOpen || zoom > 0.05) ? 'hidden' : 'visible';
    }
  }

  const ray = new THREE.Raycaster(), ptr = new THREE.Vector2(); let downAt = null;
  function pick(e) { const r = canvas.getBoundingClientRect(); ptr.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1); ray.setFromCamera(ptr, cam); const h = ray.intersectObjects(hits, false)[0]; return h ? h.object.userData : null; }
  canvas.addEventListener('pointermove', e => {
    const r = canvas.getBoundingClientRect(), nx = ((e.clientX - r.left) / r.width) * 2 - 1, ny = ((e.clientY - r.top) / r.height) * 2 - 1;
    if ((e.pointerType === 'mouse' || downAt) && !zoomT) { azT = -nx * 0.15; polT = -ny * 0.05; }
    if (e.pointerType !== 'mouse' && downAt) e.preventDefault();
    const hv = pick(e); canvas.style.cursor = hv ? 'pointer' : (zoomT ? 'zoom-out' : 'grab');
    if (hv && hv.name && e.pointerType === 'mouse' && !zoomT) { hov.textContent = hv.name; hov.style.left = e.clientX + 14 + 'px'; hov.style.top = e.clientY + 16 + 'px'; hov.classList.add('on'); } else hov.classList.remove('on');
  });
  let hovering = false; canvas.addEventListener('pointerenter', () => { hovering = true; }); canvas.addEventListener('pointerleave', () => { hovering = false; azT = 0; polT = 0; hov.classList.remove('on'); });
  canvas.addEventListener('pointerdown', e => { downAt = [e.clientX, e.clientY]; });
  canvas.addEventListener('pointerup', e => {
    const moved = downAt && Math.hypot(e.clientX - downAt[0], e.clientY - downAt[1]) > 8; downAt = null; if (moved) return;
    const h = pick(e); act(h, e);
  });

  const setMotion = () => motionBtn.textContent = running ? 'Pause the rain' : 'Let it rain';
  setMotion(); motionBtn.addEventListener('click', () => { running = !running; setMotion(); });

  function resize() { const r = stage.getBoundingClientRect(); renderer.setSize(r.width, r.height, false); const a = r.width / r.height; cam.aspect = a;
    cam.fov = a >= 1.6 ? meta.cam.fov : Math.min(75, 2 * Math.atan(Math.tan(meta.cam.fov * Math.PI / 360) * 1.6 / a) * 180 / Math.PI); cam.updateProjectionMatrix(); }
  new ResizeObserver(resize).observe(stage); resize();
  let visible = true; new IntersectionObserver(es => { visible = es[0].isIntersecting; }).observe(stage);

  window.recordScreenPos = n => {
    const s = meta.sleeves[n - 1], r = canvas.getBoundingClientRect(), a = new THREE.Vector3(...s.c).project(cam), b = new THREE.Vector3(s.c[0] + SLW, s.c[1], s.c[2]).project(cam);
    return { x: r.left + (a.x + 1) / 2 * r.width, y: r.top + (1 - a.y) / 2 * r.height, w: Math.abs(b.x - a.x) / 2 * r.width };
  };
  window.playRecord = n => { if (n !== current || !started) play(n); };
  play(window.__pending || 1);
  let last = performance.now(), acc = 0;
  function frame(t) {
    requestAnimationFrame(frame); if (!visible) { last = t; return; }
    const dt = Math.min(0.1, (t - last) / 1000); last = t;
    if (!hovering && !downAt && running && !reduce && !zoomT) azT = Math.sin(t / 3800) * 0.035;
    az += (azT - az) * Math.min(1, dt * 4); pol += (polT - pol) * Math.min(1, dt * 4); zoom += (zoomT - zoom) * Math.min(1, dt * 3.4); if (Math.abs(zoomT - zoom) < 0.002) zoom = zoomT; placeCam(); layout();
    lampU.value += (lampT - lampU.value) * Math.min(1, dt * 5); bulbGlow.material.opacity = 1 - lampU.value;
    if (running) { label.rotation.y -= dt * (Math.PI * 2 / 1.8); acc += dt; if (acc > 1 / 30) { acc = 0; rainStep(); rainDraw(); } }
    marker.position.y = meta.sleeveTop + 0.04 + (reduce ? 0 : Math.sin(t / 400) * 0.006);
    drawScreen(); renderer.render(scene, cam);
  }
  requestAnimationFrame(frame);
  stage.classList.add('ready'); window.__ready = true;
}
main().catch(e => { console.error(e); stage.classList.add('nogl'); window.__err = String(e && e.stack || e); });
