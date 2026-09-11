/* ═══════════════════════════════════════════════════════════════
   1. HIGH-FIDELITY "SUKOON" MUSIC & ACOUSTIC ENGINE
═══════════════════════════════════════════════════════════════ */
let audioCtx = null;
let isMusicPlaying = false;
let musicTimer = null;
let noteIndex = 0;
let lastCrackerSoundAt = -Infinity;
let masterReverb = null;

// Musical Note Frequencies in Hz
const N = {
  C3: 130.81, G3: 196.00, A3: 220.00, B3: 246.94,
  C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.00, A4: 440.00, B4: 493.88,
  C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99, A5: 880.00
};

// Gentle, Slow, Emotional "Sukoon" Birthday Melody Score
const sukoonScore = [
  // Phrase 1: Happy Birthday to you...
  [N.G4, 0.5, N.C3], [N.G4, 0.5, null], [N.A4, 0.9, N.G3], [N.G4, 0.9, null], [N.C5, 0.9, N.C4], [N.B4, 1.8, N.G3],
  // Phrase 2: Happy Birthday to you...
  [N.G4, 0.5, N.G3], [N.G4, 0.5, null], [N.A4, 0.9, N.D4], [N.G4, 0.9, null], [N.D5, 0.9, N.G4], [N.C5, 1.8, N.C4],
  // Phrase 3: Happy Birthday Dear Ayushi...
  [N.G4, 0.5, N.C3], [N.G4, 0.5, null], [N.G5, 0.9, N.C4], [N.E5, 0.9, N.E4], [N.C5, 0.9, N.A3], [N.B4, 0.9, N.G3], [N.A4, 1.8, N.F3],
  // Phrase 4: Happy Birthday to you...
  [N.F5, 0.5, N.F3], [N.F5, 0.5, null], [N.E5, 0.9, N.C4], [N.C5, 0.9, null], [N.D5, 0.9, N.G3], [N.C5, 2.4, N.C3],
  // Gentle Peaceful Outro Arpeggios
  [N.E4, 0.8, N.C3], [N.G4, 0.8, null], [N.C5, 1.0, N.E4], [N.E5, 1.2, N.G4], [N.G5, 2.5, N.C4]
];

function initAudioContext() {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioContext();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}

// Lush Acoustic Ambience / Reverb Node
function getReverbInput() {
  if (!audioCtx) return null;
  if (masterReverb) return masterReverb.input;
  try {
    const rate = audioCtx.sampleRate;
    const length = Math.floor(rate * 1.5);
    const impulse = audioCtx.createBuffer(2, length, rate);
    const left = impulse.getChannelData(0);
    const right = impulse.getChannelData(1);
    for (let i = 0; i < length; i++) {
      const decay = Math.exp(-i / (rate * 0.35));
      left[i] = (Math.random() * 2 - 1) * decay;
      right[i] = (Math.random() * 2 - 1) * decay;
    }
    const convolver = audioCtx.createConvolver();
    convolver.buffer = impulse;

    const reverbGain = audioCtx.createGain();
    reverbGain.gain.setValueAtTime(0.22, audioCtx.currentTime);

    const lowpass = audioCtx.createBiquadFilter();
    lowpass.type = 'lowpass';
    lowpass.frequency.setValueAtTime(3200, audioCtx.currentTime);

    convolver.connect(lowpass);
    lowpass.connect(reverbGain);
    reverbGain.connect(audioCtx.destination);

    masterReverb = { input: convolver };
    return masterReverb.input;
  } catch(e) {
    return null;
  }
}

function updateMusicToggleUI() {
  const btn = document.getElementById('musicToggleBtn');
  const icon = document.getElementById('musicIcon');
  if (!btn) return;
  if (isMusicPlaying) {
    btn.classList.add('playing');
    btn.title = 'Sound: ON (Tap to Mute)';
    if (icon) icon.textContent = '🎵';
  } else {
    btn.classList.remove('playing');
    btn.title = 'Sound: OFF (Tap to Play)';
    if (icon) icon.textContent = '🔇';
  }
}

// Rich, warm music box celesta bell tone with harmonic sparkle & soft reverb
function playSukoonTone(freq, duration = 1.0, isBass = false) {
  if (!audioCtx || freq === null) return;
  if (audioCtx.state === 'suspended') audioCtx.resume();

  const now = audioCtx.currentTime;
  const reverbInput = getReverbInput();

  // 1. Fundamental Tone (Warmth)
  const osc1 = audioCtx.createOscillator();
  const gain1 = audioCtx.createGain();
  osc1.type = isBass ? 'triangle' : 'sine';
  osc1.frequency.setValueAtTime(freq, now);

  // 2. Harmonic Bell Chime (Octave overtone)
  const osc2 = audioCtx.createOscillator();
  const gain2 = audioCtx.createGain();
  osc2.type = 'sine';
  osc2.frequency.setValueAtTime(freq * (isBass ? 1 : 2.003), now);

  // 3. Delicate Crystal Sparkle (High bell shimmer)
  const osc3 = audioCtx.createOscillator();
  const gain3 = audioCtx.createGain();
  osc3.type = 'sine';
  osc3.frequency.setValueAtTime(freq * 3.01, now);

  // Filter for soft, mellow warmth
  const filter = audioCtx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(isBass ? 580 : 3200, now);
  filter.frequency.exponentialRampToValueAtTime(isBass ? 160 : 750, now + duration);

  // Master Gain & Envelope
  const masterGain = audioCtx.createGain();
  const peakVol = isBass ? 0.16 : 0.18;

  // Gentle acoustic hammer attack & long singing decay
  masterGain.gain.setValueAtTime(0.0001, now);
  masterGain.gain.linearRampToValueAtTime(peakVol, now + 0.02);
  masterGain.gain.exponentialRampToValueAtTime(0.0001, now + duration + 1.2);

  gain1.gain.setValueAtTime(isBass ? 0.9 : 0.75, now);
  gain2.gain.setValueAtTime(isBass ? 0.15 : 0.28, now);
  gain3.gain.setValueAtTime(isBass ? 0.02 : 0.10, now);

  osc1.connect(gain1);
  osc2.connect(gain2);
  osc3.connect(gain3);

  gain1.connect(filter);
  gain2.connect(filter);
  gain3.connect(filter);

  filter.connect(masterGain);
  masterGain.connect(audioCtx.destination);

  // Send subtle wet signal to ambient reverb
  if (reverbInput) {
    const wetGain = audioCtx.createGain();
    wetGain.gain.setValueAtTime(isBass ? 0.10 : 0.25, now);
    masterGain.connect(wetGain);
    wetGain.connect(reverbInput);
  }

  osc1.start(now);
  osc2.start(now);
  osc3.start(now);

  const stopTime = now + duration + 1.3;
  osc1.stop(stopTime);
  osc2.stop(stopTime);
  osc3.stop(stopTime);
}

/* ═══════════════════════════════════════════════════════════════
   2. CINEMATIC REALISTIC FIREWORK BURST SOUND (NO WHISTLE)
═══════════════════════════════════════════════════════════════ */
function playCrackerBurstSound() {
  if (!audioCtx) initAudioContext();
  if (!audioCtx) return;
  if (audioCtx.state === 'suspended') audioCtx.resume();
  try {
    const now = audioCtx.currentTime;
    if (now - lastCrackerSoundAt < 0.26) return; // Prevent harsh overlap
    lastCrackerSoundAt = now;

    // Master Compressor for clean, powerful punch without digital distortion
    const compressor = audioCtx.createDynamicsCompressor();
    compressor.threshold.setValueAtTime(-16, now);
    compressor.knee.setValueAtTime(12, now);
    compressor.ratio.setValueAtTime(6, now);
    compressor.attack.setValueAtTime(0.002, now);
    compressor.release.setValueAtTime(0.18, now);
    compressor.connect(audioCtx.destination);

    // 1. Initial Detonation Crack (Acoustic transient snap)
    const snapOsc = audioCtx.createOscillator();
    const snapGain = audioCtx.createGain();
    snapOsc.type = 'sawtooth';
    snapOsc.frequency.setValueAtTime(800 + Math.random() * 300, now);
    snapOsc.frequency.exponentialRampToValueAtTime(80, now + 0.05);

    snapGain.gain.setValueAtTime(0.40, now);
    snapGain.gain.exponentialRampToValueAtTime(0.001, now + 0.055);

    snapOsc.connect(snapGain);
    snapGain.connect(compressor);
    snapOsc.start(now);
    snapOsc.stop(now + 0.06);

    // 2. Deep Sub-Bass Thump (Physical pressure wave)
    const boomOsc = audioCtx.createOscillator();
    const boomGain = audioCtx.createGain();
    boomOsc.type = 'triangle';
    boomOsc.frequency.setValueAtTime(145 + Math.random() * 35, now);
    boomOsc.frequency.exponentialRampToValueAtTime(22, now + 0.42);

    boomGain.gain.setValueAtTime(0.68, now);
    boomGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);

    boomOsc.connect(boomGain);
    boomGain.connect(compressor);
    boomOsc.start(now);
    boomOsc.stop(now + 0.48);

    // 3. Realistic Air Shockwave (Acoustic explosion roar)
    const bufferSize = Math.floor(audioCtx.sampleRate * 0.32);
    const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = (Math.random() * 2 - 1) * Math.exp(-i / (audioCtx.sampleRate * 0.075));
    }

    const whiteNoise = audioCtx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;

    const noiseFilter = audioCtx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.setValueAtTime(1200 + Math.random() * 600, now);
    noiseFilter.Q.setValueAtTime(1.1, now);

    const noiseGain = audioCtx.createGain();
    noiseGain.gain.setValueAtTime(0.48, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.30);

    whiteNoise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(compressor);
    whiteNoise.start(now);

    // 4. Golden Sizzling Phooljhadi Crackles
    const crackleCount = 7 + Math.floor(Math.random() * 5);
    for (let c = 0; c < crackleCount; c++) {
      const cDelay = 0.05 + Math.random() * 0.28;
      const cTime = now + cDelay;

      const cOsc = audioCtx.createOscillator();
      const cGain = audioCtx.createGain();
      cOsc.type = 'sawtooth';
      cOsc.frequency.setValueAtTime(900 + Math.random() * 1200, cTime);
      cOsc.frequency.exponentialRampToValueAtTime(60, cTime + 0.038);

      cGain.gain.setValueAtTime(0.24, cTime);
      cGain.gain.exponentialRampToValueAtTime(0.0001, cTime + 0.042);

      cOsc.connect(cGain);
      cGain.connect(compressor);
      cOsc.start(cTime);
      cOsc.stop(cTime + 0.045);
    }
  } catch(e) {}
}

/* ═══════════════════════════════════════════════════════════════
   3. CUTE & HYPER-SATISFYING BALLOON POP SOUND (FOR GAME)
═══════════════════════════════════════════════════════════════ */
function playBalloonPopSound(pts = 10) {
  if (!audioCtx) initAudioContext();
  if (!audioCtx) return;
  if (audioCtx.state === 'suspended') audioCtx.resume();
  try {
    const now = audioCtx.currentTime;

    // 1. Crisp Snappy Pop (Quick Pitch-Drop)
    const popOsc = audioCtx.createOscillator();
    const popGain = audioCtx.createGain();
    popOsc.type = 'sine';
    popOsc.frequency.setValueAtTime(560 + Math.random() * 120, now);
    popOsc.frequency.exponentialRampToValueAtTime(70, now + 0.06);

    popGain.gain.setValueAtTime(0.35, now);
    popGain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);

    popOsc.connect(popGain);
    popGain.connect(audioCtx.destination);
    popOsc.start(now);
    popOsc.stop(now + 0.075);

    // 2. Cheerful Chime Sparkle based on Points
    const chimeFreq = 523.25 * (1 + (pts / 50)); // Higher chime for bigger score
    const chimeOsc = audioCtx.createOscillator();
    const chimeGain = audioCtx.createGain();
    chimeOsc.type = 'sine';
    chimeOsc.frequency.setValueAtTime(chimeFreq, now + 0.02);

    chimeGain.gain.setValueAtTime(0.14, now + 0.02);
    chimeGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.32);

    chimeOsc.connect(chimeGain);
    chimeGain.connect(audioCtx.destination);
    chimeOsc.start(now + 0.02);
    chimeOsc.stop(now + 0.34);
  } catch(e) {}
}

function playNextSukoonNote() {
  if (!isMusicPlaying) return;

  const item = sukoonScore[noteIndex];
  const melFreq = item[0];
  const dur = item[1];
  const bassFreq = item[2];

  playSukoonTone(melFreq, dur * 1.5, false);

  if (bassFreq) {
    playSukoonTone(bassFreq, dur * 2.2, true);
  }

  noteIndex = (noteIndex + 1) % sukoonScore.length;
  const delay = (noteIndex === 0 ? dur + 1.2 : dur) * 1000 * 0.95;

  musicTimer = setTimeout(playNextSukoonNote, delay);
}

function openBirthdaySurprise(event) {
  if (event) event.stopPropagation();
  const intro = document.getElementById('giftIntro');
  if (intro) {
    intro.classList.add('hidden');
    setTimeout(() => { intro.style.display = 'none'; }, 850);
  }
  toggleSukoonMusic(true);
  if (typeof launchRockets === 'function') {
    launchRockets(4);
  }
}

function toggleSukoonMusic(forcePlay = false, event) {
  if (event) event.stopPropagation();
  initAudioContext();
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }

  if (isMusicPlaying && !forcePlay) {
    isMusicPlaying = false;
    clearTimeout(musicTimer);
    updateMusicToggleUI();
  } else if (!isMusicPlaying || forcePlay) {
    isMusicPlaying = true;
    clearTimeout(musicTimer);
    playNextSukoonNote();
    updateMusicToggleUI();
  }
}

function unlockAudio() {
  initAudioContext();
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().then(() => {
      if (!isMusicPlaying) toggleSukoonMusic(true);
    });
  } else if (!isMusicPlaying) {
    toggleSukoonMusic(true);
  }
  removeAutoStartListeners();
}

const autoEvents = ['touchstart', 'touchend', 'click', 'pointerdown', 'keydown', 'scroll'];
function addAutoStartListeners() {
  autoEvents.forEach(evt => window.addEventListener(evt, unlockAudio, { passive: true, once: true }));
}
function removeAutoStartListeners() {
  autoEvents.forEach(evt => window.removeEventListener(evt, unlockAudio));
}
addAutoStartListeners();

/* ═══════════════════════════════════════════════════════════════
   3. TWINKLING STARS BACKGROUND
═══════════════════════════════════════════════════════════════ */
const starsCanvas = document.getElementById('stars-canvas');
const sCtx = starsCanvas.getContext('2d');

function resizeStars() {
  starsCanvas.width = window.innerWidth;
  starsCanvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeStars);
resizeStars();

const isMobileViewport = window.matchMedia('(max-width: 767px)').matches;
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const stars = Array.from({ length: isMobileViewport ? 42 : 72 }, () => ({
  x: Math.random() * window.innerWidth,
  y: Math.random() * window.innerHeight,
  r: Math.random() * 1.5 + 0.4,
  alpha: Math.random(),
  speed: (Math.random() * 0.015 + 0.005) * (Math.random() > 0.5 ? 1 : -1),
  color: Math.random() > 0.4 ? '#ffffff' : (Math.random() > 0.5 ? '#f6d365' : '#fda085')
}));

let lastStarsFrame = 0;
function animateStars(timestamp = 0) {
  // The stars are ambience, so painting them at 25fps leaves more room for scrolling.
  if (timestamp - lastStarsFrame < 40) {
    requestAnimationFrame(animateStars);
    return;
  }
  lastStarsFrame = timestamp;
  sCtx.clearRect(0, 0, starsCanvas.width, starsCanvas.height);
  stars.forEach(s => {
    s.alpha += s.speed;
    if (s.alpha > 1 || s.alpha < 0.1) s.speed = -s.speed;
    sCtx.save();
    sCtx.globalAlpha = Math.max(0, Math.min(1, s.alpha));
    sCtx.beginPath();
    sCtx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    sCtx.fillStyle = s.color;
    sCtx.shadowBlur = isMobileViewport ? 0 : 3;
    sCtx.shadowColor = s.color;
    sCtx.fill();
    sCtx.restore();
  });
  requestAnimationFrame(animateStars);
}
animateStars();

/* ═══════════════════════════════════════════════════════════════
   4. CELEBRATORY FIREWORKS & CRACKERS ENGINE
═══════════════════════════════════════════════════════════════ */
const fwCanvas = document.getElementById('fw-canvas');
const fCtx = fwCanvas.getContext('2d');

function resizeFireworks() {
  fwCanvas.width = window.innerWidth;
  fwCanvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeFireworks);
resizeFireworks();

const PALETTE = ['#f6d365', '#fda085', '#ff6b8b', '#ffffff', '#845ec2', '#00c9a7', '#ff9671', '#ffc75f'];

class SparkParticle {
  constructor(x, y, color, speedMult = 1) {
    this.x = x;
    this.y = y;
    this.color = color;
    const angle = Math.random() * Math.PI * 2;
    const speed = (Math.random() * 5.5 + 1.5) * speedMult;
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;
    this.alpha = 1;
    this.decay = Math.random() * 0.016 + 0.012;
    this.gravity = 0.07;
    this.size = Math.random() * 2.5 + 1.2;
    this.flicker = Math.random() > 0.5;
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += this.gravity;
    this.vx *= 0.98;
    this.alpha -= this.decay;
  }
  draw() {
    fCtx.save();
    fCtx.globalAlpha = Math.max(0, this.alpha);
    fCtx.beginPath();
    fCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    fCtx.fillStyle = this.color;
    fCtx.shadowBlur = this.flicker ? 8 : 4;
    fCtx.shadowColor = this.color;
    fCtx.fill();
    fCtx.restore();
  }
}

class CrackerRocket {
  constructor(targetX, targetY) {
    this.x = targetX !== undefined ? targetX : Math.random() * fwCanvas.width * 0.8 + fwCanvas.width * 0.1;
    this.y = fwCanvas.height;
    this.tx = targetX !== undefined ? targetX : this.x + (Math.random() - 0.5) * 150;
    this.ty = targetY !== undefined ? targetY : Math.random() * fwCanvas.height * 0.45 + 80;
    this.color = PALETTE[Math.floor(Math.random() * PALETTE.length)];
    const dx = this.tx - this.x;
    const dy = this.ty - this.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const speed = 16 + Math.random() * 5;
    this.vx = (dx / dist) * speed;
    this.vy = (dy / dist) * speed;
    this.trail = [];
    this.exploded = false;
  }
  update(particles) {
    if (this.exploded) return;
    this.trail.push({ x: this.x, y: this.y, a: 1 });
    this.x += this.vx;
    this.y += this.vy;
    this.vy += 0.25;

    if (this.vy >= 0 || Math.hypot(this.x - this.tx, this.y - this.ty) < 20) {
      this.exploded = true;
      this.burst(particles);
    }
    this.trail = this.trail.filter(t => { t.a -= 0.09; return t.a > 0; });
  }
  burst(particles) {
    // Blast / Dhamaka sound without whistle
    playCrackerBurstSound();
    // Keep bursts celebratory without creating hundreds of expensive glow draws.
    const count = isMobileViewport ? 28 + Math.floor(Math.random() * 16) : 46 + Math.floor(Math.random() * 22);
    for (let i = 0; i < count; i++) {
      particles.push(new SparkParticle(this.x, this.y, this.color, 1));
    }
    const color2 = PALETTE[Math.floor(Math.random() * PALETTE.length)];
    for (let i = 0; i < (isMobileViewport ? 8 : 12); i++) {
      particles.push(new SparkParticle(this.x, this.y, color2, 1.4));
    }
  }
  draw() {
    this.trail.forEach(t => {
      fCtx.save();
      fCtx.globalAlpha = t.a * 0.6;
      fCtx.beginPath();
      fCtx.arc(t.x, t.y, 2, 0, Math.PI * 2);
      fCtx.fillStyle = this.color;
      fCtx.fill();
      fCtx.restore();
    });
    fCtx.save();
    fCtx.beginPath();
    fCtx.arc(this.x, this.y, 3, 0, Math.PI * 2);
    fCtx.fillStyle = '#fff';
    fCtx.shadowBlur = 10;
    fCtx.shadowColor = this.color;
    fCtx.fill();
    fCtx.restore();
  }
}

let rockets = [];
let particles = [];

function launchRockets(count = 2) {
  for (let i = 0; i < count; i++) {
    setTimeout(() => {
      if (!document.hidden) rockets.push(new CrackerRocket());
    }, i * 280);
  }
}

function triggerFireworks(event) {
  if (event) event.stopPropagation();
  launchRockets(5);
}

// Timed firework shows
setTimeout(() => launchRockets(isMobileViewport ? 1 : 2), 800);
setInterval(() => launchRockets(1), isMobileViewport ? 7000 : 5200);
setInterval(() => launchRockets(isMobileViewport ? 2 : 4), 18000);

let lastFireworkFrame = 0;
function animateFireworks(timestamp = 0) {
  if (document.hidden || prefersReducedMotion) {
    requestAnimationFrame(animateFireworks);
    return;
  }
  if (timestamp - lastFireworkFrame < 33) {
    requestAnimationFrame(animateFireworks);
    return;
  }
  lastFireworkFrame = timestamp;
  fCtx.clearRect(0, 0, fwCanvas.width, fwCanvas.height);
  rockets = rockets.filter(r => {
    r.update(particles);
    if (!r.exploded) r.draw();
    return !r.exploded || r.trail.length > 0;
  });
  // A hard cap prevents overlapping shows from blocking a scroll frame.
  if (particles.length > 260) particles.splice(0, particles.length - 260);
  particles = particles.filter(p => {
    p.update();
    p.draw();
    return p.alpha > 0;
  });
  requestAnimationFrame(animateFireworks);
}
animateFireworks();

/* ═══════════════════════════════════════════════════════════════
   5. SOOTHING MULTI-FLOWER SHOWER
   (Roses, Sakura, Jasmine, Marigold, Lavender, Hibiscus)
═══════════════════════════════════════════════════════════════ */
const petalsContainer = document.getElementById('petals');

const flowerVarieties = [
  // 1. Red Velvet Rose
  { grad: 'radial-gradient(ellipse at 30% 30%, #ff4d6d, #c9184a 70%, #800f2f)', radius: '4px 75% 6px 75%', shadow: 'rgba(201, 24, 74, 0.35)', ratio: 1.3 },
  // 2. Pink Cherry Blossom / Sakura
  { grad: 'radial-gradient(ellipse at 30% 30%, #ffb3c6, #ff758f 70%, #fb6f92)', radius: '75% 4px 75% 6px', shadow: 'rgba(255, 117, 143, 0.35)', ratio: 1.15 },
  // 3. Golden Marigold / Genda
  { grad: 'radial-gradient(ellipse at 30% 30%, #fff3b0, #ffd166 70%, #f77f00)', radius: '50% 50% 50% 50% / 80% 80% 20% 20%', shadow: 'rgba(255, 209, 102, 0.4)', ratio: 1.4 },
  // 4. Soft Lavender / Violet
  { grad: 'radial-gradient(ellipse at 30% 30%, #e0aaff, #c77dff 70%, #7b2cbf)', radius: '6px 75% 4px 75%', shadow: 'rgba(199, 125, 255, 0.35)', ratio: 1.25 },
  // 5. Coral Hibiscus / Gudhal
  { grad: 'radial-gradient(ellipse at 30% 30%, #ff99c8, #f43f5e 70%, #be123c)', radius: '4px 80% 4px 80%', shadow: 'rgba(244, 63, 94, 0.35)', ratio: 1.35 },
  // 6. White Mogra / Jasmine
  { grad: 'radial-gradient(ellipse at 30% 30%, #ffffff, #fdf4ff 60%, #e2e8f0)', radius: '50% 50% 50% 50% / 70% 70% 30% 30%', shadow: 'rgba(255, 255, 255, 0.45)', ratio: 1.2 }
];

const totalPetals = isMobileViewport ? 12 : 24;
let activeScrollPetals = 0;
let lastPetalBurstAt = 0;

function addPetal(isScrollPetal = false) {
  const p = document.createElement('div');
  p.className = 'petal';
  
  const flower = flowerVarieties[Math.floor(Math.random() * flowerVarieties.length)];
  const width = Math.random() * 8 + 9;
  const height = width * flower.ratio;
  const duration = Math.random() * 8 + 7.5;
  const delay = isScrollPetal ? 0 : Math.random() * -20;
  
  p.style.cssText = `
    left: ${Math.random() * 100}vw;
    width: ${width}px;
    height: ${height}px;
    background: ${flower.grad};
    border-radius: ${flower.radius};
  box-shadow: ${isMobileViewport ? 'none' : `0 4px 12px ${flower.shadow}`};
    animation-duration: ${duration}s;
    animation-delay: ${delay}s;
    opacity: ${Math.random() * 0.4 + 0.45};
    filter: ${isMobileViewport ? 'none' : 'drop-shadow(0 2px 6px rgba(0,0,0,0.25))'};
  `;
  petalsContainer.appendChild(p);

  // Scroll petals are temporary, keeping the effect smooth even on long pages.
  if (isScrollPetal) {
    activeScrollPetals += 1;
    setTimeout(() => {
      p.remove();
      activeScrollPetals -= 1;
    }, duration * 1000 + 150);
  }
}

for (let i = 0; i < totalPetals; i++) {
  addPetal();
}

window.addEventListener('scroll', () => {
  const now = Date.now();
  const maxScrollPetals = isMobileViewport ? 10 : 16;
  if (now - lastPetalBurstAt < 900 || activeScrollPetals >= maxScrollPetals) return;

  lastPetalBurstAt = now;
  const burstSize = isMobileViewport ? 2 : 3;
  for (let i = 0; i < burstSize; i++) addPetal(true);
}, { passive: true });

/* ═══════════════════════════════════════════════════════════════
   6. HINGLISH TYPEWRITER EFFECT
═══════════════════════════════════════════════════════════════ */
const typeMessages = [
  "Happy Birthday Ayushi Didi! 🎂",
  "Aap ho hamari sabse pyaari Didi 💖",
  "Aapke saare sapne poore hon 🚀",
  "Aap hain toh har pal khoobsurat hai 🌸",
  "Hamesha aise hi muskurati raho ✨",
  "Love you so much Didi ❤️"
];
let phraseIdx = 0, charIdx = 0, isDeleting = false;
const twEl = document.getElementById('typewriter');

function runTypewriter() {
  const currentMsg = typeMessages[phraseIdx];
  if (!isDeleting) {
    twEl.textContent = currentMsg.slice(0, ++charIdx);
    if (charIdx === currentMsg.length) {
      isDeleting = true;
      setTimeout(runTypewriter, 2000);
      return;
    }
  } else {
    twEl.textContent = currentMsg.slice(0, --charIdx);
    if (charIdx === 0) {
      isDeleting = false;
      phraseIdx = (phraseIdx + 1) % typeMessages.length;
      setTimeout(runTypewriter, 300);
      return;
    }
  }
  setTimeout(runTypewriter, isDeleting ? 40 : 75);
}
setTimeout(runTypewriter, 1200);

/* ═══════════════════════════════════════════════════════════════
   7. SCROLL REVEAL OBSERVER
═══════════════════════════════════════════════════════════════ */
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, idx) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('revealed'), idx * 50);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

document.querySelectorAll('.reveal-item').forEach(el => observer.observe(el));

// Show a graceful loader until each lazy-loaded memory photo is ready.
document.querySelectorAll('.photo-card img').forEach((img) => {
  const card = img.closest('.photo-card');
  if (!card) return;

  const finishLoading = () => card.classList.remove('photo-loading');
  card.classList.add('photo-loading');
  img.addEventListener('load', finishLoading, { once: true });
  img.addEventListener('error', finishLoading, { once: true });

  // Cached images may have completed before this script runs.
  if (img.complete) finishLoading();
});

/* ═══════════════════════════════════════════════════════════════
   8. LIGHTBOX FUNCTIONALITY
═══════════════════════════════════════════════════════════════ */
const lightbox = document.getElementById('lightbox');
const lbImg = document.getElementById('lightbox-img');
const lbCap = document.getElementById('lightbox-cap');

function openLightbox(card) {
  const img = card.querySelector('img');
  const caption = card.getAttribute('data-caption') || '';
  lbImg.src = img.src;
  lbCap.textContent = caption;
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLightbox(e) {
  if (e.target === lightbox) forceCloseLightbox();
}

function forceCloseLightbox() {
  lightbox.classList.remove('active');
  document.body.style.overflow = '';
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') forceCloseLightbox();
});

/* ═══════════════════════════════════════════════════════════════
   9. FLOATING 3D BALLOONS GENERATOR
═══════════════════════════════════════════════════════════════ */
const balloonsContainer = document.getElementById('balloons');
const balloonGradients = [
  'radial-gradient(circle at 35% 35%, #ffd1dc, #ff6b8b 70%, #c9184a)', // Rose
  'radial-gradient(circle at 35% 35%, #fff3b0, #ffd166 70%, #f77f00)', // Gold
  'radial-gradient(circle at 35% 35%, #e0aaff, #c77dff 70%, #7b2cbf)', // Lavender
  'radial-gradient(circle at 35% 35%, #bbf7d0, #4ade80 70%, #15803d)', // Emerald
  'radial-gradient(circle at 35% 35%, #bae6fd, #38bdf8 70%, #0369a1)'  // Sky Blue
];

if (balloonsContainer) {
  const totalBalloons = isMobileViewport ? 6 : 12;
  for (let b = 0; b < totalBalloons; b++) {
    const el = document.createElement('div');
    el.className = 'balloon';
    // Use evenly spaced lanes so balloons never bunch up on one side.
    const posX = 5 + (b * 90) / (totalBalloons - 1);
    const size = Math.random() * 16 + 36;
    const duration = Math.random() * 10 + 14;
    const delay = Math.random() * -25;
    const grad = balloonGradients[Math.floor(Math.random() * balloonGradients.length)];

    el.style.cssText = `
      left: ${posX}vw;
      width: ${size}px;
      height: ${size * 1.25}px;
      background: ${grad};
      animation-duration: ${duration}s;
      animation-delay: ${delay}s;
    `;
    balloonsContainer.appendChild(el);
  }
}

/* ═══════════════════════════════════════════════════════════════
   10. INTERACTIVE TOUCH & MOUSE SPARKLE TRAIL
═══════════════════════════════════════════════════════════════ */
const sparkChars = ['✨', '💖', '⭐', '🌸', '✦'];
let lastSparkTime = 0;

function createSparkle(x, y) {
  const now = Date.now();
  if (now - lastSparkTime < 45) return; // Throttle
  lastSparkTime = now;

  const spark = document.createElement('div');
  const char = sparkChars[Math.floor(Math.random() * sparkChars.length)];
  spark.textContent = char;
  spark.style.cssText = `
    position: fixed;
    left: ${x}px;
    top: ${y}px;
    font-size: ${Math.random() * 12 + 14}px;
    pointer-events: none;
    z-index: 999;
    transform: translate(-50%, -50%) scale(1);
    opacity: 1;
    transition: transform 0.8s cubic-bezier(0.165, 0.84, 0.44, 1), opacity 0.8s ease;
    filter: drop-shadow(0 0 6px rgba(246, 211, 101, 0.8));
    user-select: none;
  `;
  document.body.appendChild(spark);

  const moveX = (Math.random() - 0.5) * 40;
  const moveY = -(Math.random() * 35 + 20);

  requestAnimationFrame(() => {
    spark.style.transform = `translate(calc(-50% + ${moveX}px), calc(-50% + ${moveY}px)) scale(0.4)`;
    spark.style.opacity = '0';
  });

  setTimeout(() => spark.remove(), 850);
}

// Never create/animate DOM nodes during a touch scroll. It was the main source of
// the "stuck" feeling on phones. The trail remains available for mouse users.
if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
  window.addEventListener('mousemove', (e) => createSparkle(e.clientX, e.clientY), { passive: true });
}

/* ═══════════════════════════════════════════════════════════════
   11. BIRTHDAY COUNTDOWN TIMER (TARGET: 13 SEPTEMBER)
═══════════════════════════════════════════════════════════════ */
function updateCountdown() {
  const now = new Date();
  const year = now.getFullYear();
  // Month is 0-indexed: 8 = September, Day 13
  let next = new Date(year, 8, 13, 0, 0, 0);

  // If today is Sept 13 itself:
  if (now.getMonth() === 8 && now.getDate() === 13) {
    const sub = document.querySelector('.countdown-section .sec-subtitle');
    if (sub) sub.innerHTML = "🎉 <strong style='color:var(--gold);'>Aaj Ayushi Didi ka Birthday hai! Happy Birthday!</strong> 👑🎂";
  } else if (now.getTime() > next.getTime()) {
    next = new Date(year + 1, 8, 13, 0, 0, 0);
  }

  const diff = Math.max(0, next - now);
  const days  = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const mins  = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const secs  = Math.floor((diff % (1000 * 60)) / 1000);

  function setAndTick(id, val) {
    const el = document.getElementById(id);
    if (!el) return;
    const str = String(val).padStart(2, '0');
    if (el.textContent !== str) {
      el.textContent = str;
      el.classList.remove('tick');
      void el.offsetWidth;
      el.classList.add('tick');
      setTimeout(() => el.classList.remove('tick'), 200);
    }
  }
  setAndTick('cd-days', days);
  setAndTick('cd-hours', hours);
  setAndTick('cd-mins', mins);
  setAndTick('cd-secs', secs);
}
updateCountdown();
setInterval(updateCountdown, 1000);

/* ═══════════════════════════════════════════════════════════════
   12. BALLOON POP GAME ENGINE
═══════════════════════════════════════════════════════════════ */
let gameScore = 0, gamePopped = 0, gameTimeLeft = 30;
let gameActive = false, gameInterval = null, balloonInterval = null;

const BALLOON_COLORS = [
  'radial-gradient(circle at 35% 30%, #ffd1dc, #ff6b8b 65%, #c9184a)',
  'radial-gradient(circle at 35% 30%, #fff3b0, #ffd166 65%, #f77f00)',
  'radial-gradient(circle at 35% 30%, #e0aaff, #c77dff 65%, #7b2cbf)',
  'radial-gradient(circle at 35% 30%, #bbf7d0, #4ade80 65%, #15803d)',
  'radial-gradient(circle at 35% 30%, #bae6fd, #38bdf8 65%, #0369a1)',
  'radial-gradient(circle at 35% 30%, #ffd6a5, #ffb347 65%, #e67e00)',
  'radial-gradient(circle at 35% 30%, #ffb3c6, #ff4d6d 65%, #9d0208)'
];
const BALLOON_EMOJIS = ['🎈', '🌸', '⭐', '💖', '🎉', '✨', '🌟', '💫', '🌹', '👑'];
const LEVEL_LABELS = ['🌸 Beginner', '⭐ Rising Star', '🏅 Pro Popper', '🏆 Legend!', '👑 Birthday Queen!'];

function getLevelInfo(score) {
  if (score < 50)  return { label: LEVEL_LABELS[0], color: '#fda085' };
  if (score < 120) return { label: LEVEL_LABELS[1], color: '#ffd166' };
  if (score < 220) return { label: LEVEL_LABELS[2], color: '#00c9a7' };
  if (score < 350) return { label: LEVEL_LABELS[3], color: '#f6d365' };
  return { label: LEVEL_LABELS[4], color: '#ff6b8b' };
}

function spawnBalloon() {
  const arena = document.getElementById('gameArena');
  if (!arena || !gameActive) return;

  const el = document.createElement('div');
  el.className = 'game-balloon';
  const size = Math.random() * 28 + 46;
  const left = Math.random() * 82 + 5;
  const riseTime = Math.random() * 2.0 + 3.2;
  const points = Math.round((60 / size) * 30);
  const grad = BALLOON_COLORS[Math.floor(Math.random() * BALLOON_COLORS.length)];
  const emoji = BALLOON_EMOJIS[Math.floor(Math.random() * BALLOON_EMOJIS.length)];

  el.style.cssText = 'width: ' + size + 'px; height: ' + (size * 1.25) + 'px; left: ' + left + '%; bottom: -80px; background: ' + grad + '; animation-duration: ' + riseTime + 's;';
  el.textContent = emoji;
  el.dataset.points = points;

  el.addEventListener('click', (e) => popBalloon(el, e), { passive: true });
  el.addEventListener('touchstart', (e) => { e.preventDefault(); popBalloon(el, e.touches[0]); }, { passive: false });

  arena.appendChild(el);
  setTimeout(() => el.remove(), riseTime * 1000 + 200);
}

function popBalloon(el, e) {
  if (!gameActive || !el.parentNode) return;
  const pts = parseInt(el.dataset.points) || 10;
  gameScore += pts;
  gamePopped++;

  const burst = document.createElement('div');
  burst.className = 'balloon-pop';
  burst.textContent = ['💥', '✨', '🌟', '💖', '⭐'][Math.floor(Math.random() * 5)];
  const arena = document.getElementById('gameArena');
  const arenaRect = arena.getBoundingClientRect();
  burst.style.cssText = 'left: ' + (e.clientX - arenaRect.left - 20) + 'px; top: ' + (e.clientY - arenaRect.top - 20) + 'px;';
  arena.appendChild(burst);
  setTimeout(() => burst.remove(), 600);

  const scoreEl = document.createElement('div');
  scoreEl.style.cssText = 'position: absolute; left: ' + (e.clientX - arenaRect.left) + 'px; top: ' + (e.clientY - arenaRect.top - 10) + 'px; color: #ffd166; font-weight: 800; font-size: 1.1rem; pointer-events: none; z-index: 30; animation: popBurst 0.7s ease forwards;';
  scoreEl.textContent = '+' + pts;
  arena.appendChild(scoreEl);
  setTimeout(() => scoreEl.remove(), 700);

  el.remove();

  document.getElementById('game-score').textContent = gameScore;
  document.getElementById('game-popped').textContent = gamePopped;

  const level = getLevelInfo(gameScore);
  const badge = document.getElementById('level-badge');
  if (badge) { badge.textContent = level.label; badge.style.color = level.color; }

  if (typeof playBalloonPopSound === "function") playBalloonPopSound(pts); else if (typeof playCrackerBurstSound === "function") playCrackerBurstSound();
}

function startBalloonGame() {
  const arena = document.getElementById('gameArena');
  const startOverlay = document.getElementById('gameStartOverlay');
  if (startOverlay) startOverlay.classList.add('hidden');

  gameScore = 0; gamePopped = 0; gameTimeLeft = 30;
  gameActive = true;
  document.getElementById('game-score').textContent = 0;
  document.getElementById('game-popped').textContent = 0;
  document.getElementById('game-timer').textContent = 30;

  balloonInterval = setInterval(spawnBalloon, 800);
  setTimeout(() => { if (gameActive) { clearInterval(balloonInterval); balloonInterval = setInterval(spawnBalloon, 600); } }, 10000);
  setTimeout(() => { if (gameActive) { clearInterval(balloonInterval); balloonInterval = setInterval(spawnBalloon, 450); } }, 20000);

  gameInterval = setInterval(() => {
    gameTimeLeft--;
    const timerEl = document.getElementById('game-timer');
    if (timerEl) {
      timerEl.textContent = gameTimeLeft;
      if (gameTimeLeft <= 5) timerEl.style.color = '#ff6b8b';
    }
    if (gameTimeLeft <= 0) endBalloonGame();
  }, 1000);
}


/* ═══════════════════════════════════════════════════════════════
   DYNAMIC REWARD POOL (ROTATES A NEW REWARD ON EVERY PLAY!)
═══════════════════════════════════════════════════════════════ */
let rewardPlayCount = 0;
const REWARD_POOL = [
  {
    ribbon: '🎁 SPECIAL BIRTHDAY REWARD #1 🎁',
    badge: '👑 Best Sister of the Universe 👑',
    title: 'Golden Sister VIP Pass ✨',
    text: 'Yeh pass Ayushi Didi ko Mukesh ki taraf se <strong>Unlimited Treats, Favorite Foods, Silly Jokes aur Lifetime Support</strong> ka permanent right deta hai! 💖',
    stamp: 'VERIFIED WITH LOVE ❤️'
  },
  {
    ribbon: '🍫 SPECIAL BIRTHDAY REWARD #2 🍫',
    badge: '🍨 Didi\'s Sweet Tooth Pass 🍰',
    title: 'Free Ice-Cream & Chocolates Voucher 🍦',
    text: 'Jab bhi Didi ka sweet crave kare, ye voucher redeem karo — Mukesh bina kisi nakhre ke aapki favourite chocolates aur dessert lekar hazir hoga! 😋',
    stamp: '100% SWEET GUARANTEE 🍬'
  },
  {
    ribbon: '🎬 SPECIAL BIRTHDAY REWARD #3 🎬',
    badge: '🍿 Personal Entertainer On Duty 🎭',
    title: 'Midnight Masti & Movie Night Ticket 🎬',
    text: 'Aapki pasand ki movie/web-series, unlimited popcorn aur ghanton tak dil khol ke late-night gossip — full VIP brother attention! 🛋️✨',
    stamp: 'POPCORN APPROVED 🍿'
  },
  {
    ribbon: '⚡ SPECIAL BIRTHDAY REWARD #4 ⚡',
    badge: '👑 Ghar Ki Supreme Boss 👑',
    title: '"Didi Is Always Right" Immunity Card 🛡️',
    text: 'Kisi bhi aane wali ladai ya argument mein ye card dikha dena — Mukesh bina kisi debate ke haar maan lega kyunki <strong>Didi hamesha sahi hoti hain!</strong> 😎',
    stamp: 'NO QUESTIONS ASKED ⚖️'
  },
  {
    ribbon: '💆‍♀️ SPECIAL BIRTHDAY REWARD #5 💆‍♀️',
    badge: '🌸 Queen Deserves Pampering 🌸',
    title: 'Stress-Free "Hukum Mere Aaka" Day Pass ☕',
    text: 'Aap aaram se rest karo — chai/coffee banani ho, koi cheez laani ho ya koi bhi chhota-bada kaam, aaj sab Mukesh karega! ☕✨',
    stamp: 'QUEEN TREATMENT 👑'
  },
  {
    ribbon: '💖 SPECIAL BIRTHDAY REWARD #6 💖',
    badge: '🌟 Ek Anmol Rishta 🌟',
    title: 'Lifetime Brother Promise Card 🔒',
    text: 'Zindagi ke har mod par, har khushi aur har challenge mein — aapka bhai hamesha ek call ki doori par aapke saath garv se khada rahega! 🤗❤️',
    stamp: 'PROMISE FOR LIFE 🔒'
  }
];

function endBalloonGame() {
  gameActive = false;
  clearInterval(gameInterval);
  clearInterval(balloonInterval);

  const arena = document.getElementById('gameArena');
  if (arena) arena.querySelectorAll('.game-balloon').forEach(b => b.remove());

  if (typeof launchRockets === 'function') launchRockets(4);

  const endOverlay = document.getElementById('gameEndOverlay');
  const level = getLevelInfo(gameScore);
  const titles = { 0: 'Koshish Karo! 🌸', 50: 'Wah Didi! 🌸', 120: 'Bhaari hai Didi! ⭐', 220: 'Legend! 🏆', 350: 'Birthday Queen! 👑' };
  let title = 'Wah Didi! 🌸';
  for (const [min, t] of Object.entries(titles)) if (gameScore >= parseInt(min)) title = t;
  
  const endTitleEl = document.getElementById('gameEndTitle');
  if (endTitleEl) endTitleEl.textContent = title;
  
  const finalScoreEl = document.getElementById('finalScore');
  if (finalScoreEl) finalScoreEl.textContent = gameScore;
  
  const endMsgEl = document.getElementById('gameEndMsg');
  if (endMsgEl) {
    endMsgEl.innerHTML = 'Aapne <strong style="color:var(--gold)">' + gameScore + '</strong> points score kiye aur <strong style="color:var(--rose)">' + gamePopped + '</strong> balloons pop kiye! ' + level.label;
  }

  // Pick a fresh reward from the pool on every single play!
  const currentReward = REWARD_POOL[rewardPlayCount % REWARD_POOL.length];
  rewardPlayCount++;

  const ribbonEl = document.querySelector('.reward-ribbon');
  const badgeEl = document.querySelector('.reward-badge');
  const titleEl = document.querySelector('.reward-title');
  const textEl = document.querySelector('.reward-text');
  const stampEl = document.querySelector('.reward-stamp');

  if (ribbonEl) ribbonEl.textContent = currentReward.ribbon;
  if (badgeEl) badgeEl.textContent = currentReward.badge;
  if (titleEl) titleEl.textContent = currentReward.title;
  if (textEl) textEl.innerHTML = currentReward.text;
  if (stampEl) {
    stampEl.textContent = currentReward.stamp;
    stampEl.style.background = 'linear-gradient(135deg, #f6d365, #ff6b8b)';
  }

  if (endOverlay) endOverlay.classList.remove('hidden');
}

function resetBalloonGame() {
  const endOverlay = document.getElementById('gameEndOverlay');
  const startOverlay = document.getElementById('gameStartOverlay');
  if (endOverlay) endOverlay.classList.add('hidden');
  if (startOverlay) startOverlay.classList.remove('hidden');
  gameTimeLeft = 30;
  const timerEl = document.getElementById('game-timer');
  if (timerEl) { timerEl.textContent = 30; timerEl.style.color = ''; }
  document.getElementById('game-score').textContent = 0;
  document.getElementById('game-popped').textContent = 0;
  const badge = document.getElementById('level-badge');
  if (badge) { badge.textContent = LEVEL_LABELS[0]; badge.style.color = ''; }
}

function celebrateReward() {
  if (typeof launchRockets === 'function') {
    launchRockets(8); // Grand fireworks burst
  }
  const stamp = document.querySelector('.reward-stamp');
  if (stamp) {
    stamp.textContent = '🎉 REWARD CLAIMED! 💖';
    stamp.style.background = 'linear-gradient(135deg, #00c9a7, #f6d365)';
  }
  if (typeof playSukoonTone === 'function') {
    playSukoonTone(523.25, 0.25);
    setTimeout(() => playSukoonTone(659.25, 0.25), 160);
    setTimeout(() => playSukoonTone(783.99, 0.35), 320);
    setTimeout(() => playSukoonTone(1046.50, 1.0), 480);
  }

  // After 1.4 seconds of celebration, ask if she wants to play again for the next reward!
  setTimeout(() => {
    const promptModal = document.getElementById('claimPromptOverlay');
    if (promptModal) {
      promptModal.classList.remove('hidden');
    }
  }, 1400);
}

function acceptPlayAgain() {
  const promptModal = document.getElementById('claimPromptOverlay');
  if (promptModal) promptModal.classList.add('hidden');
  resetBalloonGame();
  setTimeout(() => {
    startBalloonGame();
  }, 200);
}

function closeClaimPrompt() {
  const promptModal = document.getElementById('claimPromptOverlay');
  if (promptModal) promptModal.classList.add('hidden');
}

/* ═══════════════════════════════════════════════════════════════
   13. REAL-TIME AUTOMATIC SUN & MOON + IN-MODAL SWITCHER
═══════════════════════════════════════════════════════════════ */
const CELESTIAL_DATA = {
  moon: {
    icon: '🌙',
    badge: '✨ RAAT KI CHAON · DIL SE ✨',
    quote: '"Jaise chand sitaron ke beech chamakta hai, waise hi aap hamari zindagi ko roshan karti ho, Ayushi Didi!"',
    sub: 'Aapki smile aur presence hamari zindagi ki sabse badi khushi hai. Hamesha aise hi chamakti raho! 💖🌹',
    glow: 'rgba(246, 211, 101, 0.25)'
  },
  sun: {
    icon: '☀️',
    badge: '✨ SUBAH KI KIRAN · DIL SE ✨',
    quote: '"Jaise subah ka sooraj saari duniya ko nayi roshni, garmahat aur taazgi deta hai, waise hi aapki muskaan hamari zindagi mein khushiyan bikher deti hai, Ayushi Didi!"',
    sub: 'Aapki positive energy aur khilkhilati hansi se hamari zindagi ka har pal hamesha roshan aur khushnuma rehta hai. Keep shining, sunshine! ☀️🌸',
    glow: 'rgba(255, 175, 50, 0.35)'
  }
};

let modalCurrentView = null; // 'moon' or 'sun'

function updateCelestialSky() {
  const celestial = document.getElementById('skyCelestial');
  const icon = document.getElementById('celestialIcon');
  const greeting = document.getElementById('celestialGreeting');
  if (!celestial || !icon) return;

  const now = new Date();
  const hours = now.getHours(); // 0 - 23

  // STRICT REAL-TIME: Day is 6:00 AM to 6:00 PM (18:00), Night is 6:00 PM to 6:00 AM
  const isNight = (hours >= 18 || hours < 6);

  if (isNight) {
    celestial.classList.remove('sun-mode');
    celestial.classList.add('moon-mode');
    icon.textContent = '🌙';
    if (greeting) {
      if (hours >= 18 && hours < 21) greeting.textContent = 'Khoobsurat Shaam Didi ✨';
      else if (hours >= 21 || hours < 4) greeting.textContent = 'Taaron Bhari Raat 🌙';
      else greeting.textContent = 'Taaron Ki Chaon 🌌';
    }
  } else {
    celestial.classList.remove('moon-mode');
    celestial.classList.add('sun-mode');
    icon.textContent = '☀️';
    if (greeting) {
      if (hours >= 6 && hours < 12) greeting.textContent = 'Khilti Hui Subah ☀️';
      else greeting.textContent = 'Roshan Din Didi 🌞';
    }
  }
}

function openCelestialModal(event) {
  if (event) event.stopPropagation();
  const now = new Date();
  const isNight = (now.getHours() >= 18 || now.getHours() < 6);
  
  // Default to current time mode on open
  modalCurrentView = isNight ? 'moon' : 'sun';
  applyModalView(modalCurrentView);

  const modal = document.getElementById('moonModalOverlay');
  if (modal) {
    modal.classList.remove('hidden');
    if (typeof playSukoonTone === 'function') {
      playSukoonTone(isNight ? 659.25 : 783.99, 0.3);
      setTimeout(() => playSukoonTone(isNight ? 783.99 : 880.00, 0.4), 180);
    }
  }
}

function toggleModalView(event) {
  if (event) event.stopPropagation();
  modalCurrentView = (modalCurrentView === 'moon') ? 'sun' : 'moon';
  applyModalView(modalCurrentView);

  if (typeof playSukoonTone === 'function') {
    playSukoonTone(modalCurrentView === 'sun' ? 783.99 : 659.25, 0.25);
  }
}

function applyModalView(mode) {
  const data = CELESTIAL_DATA[mode];
  const modalBadge = document.getElementById('modalBadge');
  const modalIcon = document.getElementById('moonCardIcon');
  const modalQuote = document.getElementById('moonModalQuoteText');
  const modalSub = document.getElementById('modalSub');
  const glow = document.querySelector('.moon-modal-glow');
  const switchIcon = document.getElementById('modalSwitchIcon');
  const switchLabel = document.getElementById('modalSwitchLabel');

  if (modalBadge) modalBadge.textContent = data.badge;
  if (modalIcon) modalIcon.textContent = data.icon;
  if (modalQuote) modalQuote.textContent = data.quote;
  if (modalSub) modalSub.textContent = data.sub;
  if (glow) glow.style.background = 'radial-gradient(circle, ' + data.glow + ' 0%, rgba(255, 107, 139, 0.15) 50%, transparent 70%)';

  // Toggle button shows option to switch into the other celestial
  if (switchIcon && switchLabel) {
    if (mode === 'moon') {
      switchIcon.textContent = '☀️';
      switchLabel.textContent = 'Sooraj Ka Paigaam Dekho';
    } else {
      switchIcon.textContent = '🌙';
      switchLabel.textContent = 'Chand Ka Paigaam Dekho';
    }
  }
}

function closeCelestialModal(event) {
  if (event) event.stopPropagation();
  const modal = document.getElementById('moonModalOverlay');
  if (modal) {
    modal.classList.add('hidden');
  }
  // RESET STRICTLY TO REAL-TIME CLOCK ON CLOSE!
  updateCelestialSky();
}

// Close on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeCelestialModal();
});

updateCelestialSky();
setInterval(updateCelestialSky, 60000); // Check every minute
