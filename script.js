/* ═══════════════════════════════════════════════════════════════
   HAPPY BIRTHDAY AYUSHI - JAVASCRIPT ENGINE
   (Audio Engine, Fireworks, Flower Shower, Typewriter, Lightbox)
═══════════════════════════════════════════════════════════════ */

/* ═══════════════════════════════════════════════════════════════
   1. SOOTHING BACKGROUND MUSIC ENGINE (Web Audio API)
═══════════════════════════════════════════════════════════════ */
let audioCtx = null;
let isMusicPlaying = false;
let musicTimer = null;
let noteIndex = 0;

// Musical Note Frequencies in Hz
const N = {
  C3: 130.81, G3: 196.00, A3: 220.00, B3: 246.94,
  C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.00, A4: 440.00, B4: 493.88,
  C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99, A5: 880.00
};

// Gentle, Slow, Emotional "Sukoon" Birthday Melody Score
// Format: [Melody Note, Duration in seconds, Bass/Chord Note]
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

// Plays a warm acoustic bell note
function playSukoonTone(freq, duration = 1.0, isBass = false) {
  if (!audioCtx || freq === null) return;
  if (audioCtx.state === 'suspended') audioCtx.resume();

  const now = audioCtx.currentTime;
  const osc1 = audioCtx.createOscillator();
  const osc2 = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();
  const filter = audioCtx.createBiquadFilter();

  osc1.type = isBass ? 'triangle' : 'sine';
  osc2.type = 'sine';

  osc1.frequency.setValueAtTime(freq, now);
  osc2.frequency.setValueAtTime(freq * (isBass ? 1 : 2.004), now);

  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(isBass ? 550 : 2200, now);
  filter.frequency.exponentialRampToValueAtTime(isBass ? 200 : 500, now + duration);

  const peakVol = isBass ? 0.22 : 0.20;
  gainNode.gain.setValueAtTime(0.0001, now);
  gainNode.gain.linearRampToValueAtTime(peakVol, now + 0.04);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, now + duration + 0.7);

  osc1.connect(filter);
  osc2.connect(filter);
  filter.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  osc1.start(now);
  osc2.start(now);
  osc1.stop(now + duration + 0.8);
  osc2.stop(now + duration + 0.8);
}

/* ═══════════════════════════════════════════════════════════════
   2. POWERFUL, LOUD & REALISTIC CRACKER SOUND (NO "TUU TUU" WHISTLE)
═══════════════════════════════════════════════════════════════ */
function playCrackerBurstSound() {
  if (!audioCtx) initAudioContext();
  if (!audioCtx) return;
  if (audioCtx.state === 'suspended') audioCtx.resume();
  try {
    const now = audioCtx.currentTime;

    // Master Dynamics Compressor for punchy volume without distortion
    const compressor = audioCtx.createDynamicsCompressor();
    compressor.threshold.setValueAtTime(-12, now);
    compressor.knee.setValueAtTime(8, now);
    compressor.ratio.setValueAtTime(4, now);
    compressor.attack.setValueAtTime(0.003, now);
    compressor.release.setValueAtTime(0.15, now);
    compressor.connect(audioCtx.destination);

    // 1. Heavy Deep Boom / Thump (Dhamaka Bass Layer 1)
    const boomOsc = audioCtx.createOscillator();
    const boomGain = audioCtx.createGain();
    boomOsc.type = 'triangle';
    boomOsc.frequency.setValueAtTime(180 + Math.random() * 50, now);
    boomOsc.frequency.exponentialRampToValueAtTime(20, now + 0.45);

    boomGain.gain.setValueAtTime(0.95, now);
    boomGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.48);

    boomOsc.connect(boomGain);
    boomGain.connect(compressor);
    boomOsc.start(now);
    boomOsc.stop(now + 0.5);

    // 1b. Sub Rumble (Layer 2 for heavy physical punch)
    const subOsc = audioCtx.createOscillator();
    const subGain = audioCtx.createGain();
    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(95, now);
    subOsc.frequency.exponentialRampToValueAtTime(22, now + 0.4);

    subGain.gain.setValueAtTime(0.85, now);
    subGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.42);

    subOsc.connect(subGain);
    subGain.connect(compressor);
    subOsc.start(now);
    subOsc.stop(now + 0.44);

    // 2. Loud White Noise Shockwave Blast (Crisp Explosion Crack)
    const bufferSize = Math.floor(audioCtx.sampleRate * 0.35);
    const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = (Math.random() * 2 - 1) * Math.exp(-i / (audioCtx.sampleRate * 0.08));
    }

    const whiteNoise = audioCtx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;

    const noiseFilter = audioCtx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.setValueAtTime(1400 + Math.random() * 800, now);
    noiseFilter.Q.setValueAtTime(1.2, now);

    const noiseGain = audioCtx.createGain();
    noiseGain.gain.setValueAtTime(0.85, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.32);

    whiteNoise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(compressor);
    whiteNoise.start(now);

    // 3. Realistic Sizzling Patakha Crackles (8 to 14 Loud Micro-Pops)
    const crackleCount = 8 + Math.floor(Math.random() * 6);
    for (let c = 0; c < crackleCount; c++) {
      const crackleDelay = 0.04 + Math.random() * 0.32;
      const cTime = now + crackleDelay;

      const cOsc = audioCtx.createOscillator();
      const cGain = audioCtx.createGain();
      cOsc.type = 'sawtooth';
      cOsc.frequency.setValueAtTime(750 + Math.random() * 1100, cTime);
      cOsc.frequency.exponentialRampToValueAtTime(60, cTime + 0.045);

      cGain.gain.setValueAtTime(0.55, cTime);
      cGain.gain.exponentialRampToValueAtTime(0.0001, cTime + 0.05);

      cOsc.connect(cGain);
      cGain.connect(compressor);
      cOsc.start(cTime);
      cOsc.stop(cTime + 0.055);
    }
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

const stars = Array.from({ length: 90 }, () => ({
  x: Math.random() * window.innerWidth,
  y: Math.random() * window.innerHeight,
  r: Math.random() * 1.5 + 0.4,
  alpha: Math.random(),
  speed: (Math.random() * 0.015 + 0.005) * (Math.random() > 0.5 ? 1 : -1),
  color: Math.random() > 0.4 ? '#ffffff' : (Math.random() > 0.5 ? '#f6d365' : '#fda085')
}));

function animateStars() {
  sCtx.clearRect(0, 0, starsCanvas.width, starsCanvas.height);
  stars.forEach(s => {
    s.alpha += s.speed;
    if (s.alpha > 1 || s.alpha < 0.1) s.speed = -s.speed;
    sCtx.save();
    sCtx.globalAlpha = Math.max(0, Math.min(1, s.alpha));
    sCtx.beginPath();
    sCtx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    sCtx.fillStyle = s.color;
    sCtx.shadowBlur = 4;
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
    const count = 75 + Math.floor(Math.random() * 45);
    for (let i = 0; i < count; i++) {
      particles.push(new SparkParticle(this.x, this.y, this.color, 1));
    }
    const color2 = PALETTE[Math.floor(Math.random() * PALETTE.length)];
    for (let i = 0; i < 20; i++) {
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
      rockets.push(new CrackerRocket());
    }, i * 280);
  }
}

function triggerFireworks(event) {
  if (event) event.stopPropagation();
  launchRockets(5);
}

// Timed firework shows
setTimeout(() => launchRockets(3), 800);
setInterval(() => launchRockets(2), 4200);
setInterval(() => launchRockets(6), 14000);

function animateFireworks() {
  fCtx.clearRect(0, 0, fwCanvas.width, fwCanvas.height);
  rockets = rockets.filter(r => {
    r.update(particles);
    if (!r.exploded) r.draw();
    return !r.exploded || r.trail.length > 0;
  });
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

const totalPetals = window.innerWidth < 500 ? 22 : 36;

for (let i = 0; i < totalPetals; i++) {
  const p = document.createElement('div');
  p.className = 'petal';
  
  const flower = flowerVarieties[Math.floor(Math.random() * flowerVarieties.length)];
  const width = Math.random() * 8 + 9;
  const height = width * flower.ratio;
  const duration = Math.random() * 8 + 7.5;
  const delay = Math.random() * -20;
  
  p.style.cssText = `
    left: ${Math.random() * 100}vw;
    width: ${width}px;
    height: ${height}px;
    background: ${flower.grad};
    border-radius: ${flower.radius};
    box-shadow: 0 4px 12px ${flower.shadow};
    animation-duration: ${duration}s;
    animation-delay: ${delay}s;
    opacity: ${Math.random() * 0.4 + 0.45};
    filter: drop-shadow(0 2px 6px rgba(0,0,0,0.25));
  `;
  petalsContainer.appendChild(p);
}

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
  const totalBalloons = window.innerWidth < 500 ? 10 : 16;
  for (let b = 0; b < totalBalloons; b++) {
    const el = document.createElement('div');
    el.className = 'balloon';
    const isLeft = Math.random() > 0.5;
    const posX = isLeft ? Math.random() * 22 : 78 + Math.random() * 20; // Float along the sides
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

window.addEventListener('mousemove', (e) => createSparkle(e.clientX, e.clientY), { passive: true });
window.addEventListener('touchmove', (e) => {
  if (e.touches && e.touches[0]) {
    createSparkle(e.touches[0].clientX, e.touches[0].clientY);
  }
}, { passive: true });

