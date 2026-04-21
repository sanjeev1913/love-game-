/* ==========================================================
   LOVE LETTERS — MAIN SCRIPT
   ----------------------------------------------------------
   Sections:
   1. Scene navigation & intersection observer
   2. Floating hearts background
   3. Scene 1  — Envelope hearts + wax seal sparkle
   4. Scene 2  — Lip marks background + typewriter effect
   5. Scene 3  — Falling petals + bloom flowers burst
   6. Scene 4  — Scattered hearts
   7. Scene 5  — Send love toast + anniversary countdown
   8. Scene 6  — Starfield generation
   9. Music    — Web Audio API ambient music toggle
========================================================== */


/* ==========================================================
   1. SCENE NAVIGATION
========================================================== */
const sections = document.querySelectorAll('section');
const dots     = document.querySelectorAll('.dot');
let current    = 0;

/** Smooth-scroll to scene index i (0-based) */
function goTo(i) {
  sections[i].scrollIntoView({ behavior: 'smooth' });
}

/** Update active nav dot & trigger scene-specific effects on scroll */
const obs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const i = [...sections].indexOf(e.target);
      current = i;
      dots.forEach((d, j) => d.classList.toggle('active', j === i));

      // Scene 2: start typewriter the first time it's visible
      if (i === 1) startTypewriter();
    }
  });
}, { threshold: 0.5 });

sections.forEach(s => obs.observe(s));


/* ==========================================================
   2. FLOATING HEARTS BACKGROUND (global overlay)
========================================================== */
const heartContainer = document.getElementById('hearts-container');
const heartChars     = ['♡', '♥', '💕', '💗', '💓', '💞', '💖'];

/** Scatter love emojis radially from a click point */
function scatterLoveAt(cx, cy) {
  const loveEmojis = ['💕','💗','💖','❤️','💓','💞','🩷'];
  for (let i = 0; i < 10; i++) {
    const s = document.createElement('span');
    s.style.cssText = `
      position:fixed; font-size:${1 + Math.random()*0.8}rem;
      pointer-events:none; z-index:9999;
      left:${cx}px; top:${cy}px;
      transform:translate(-50%,-50%) scale(0);
      transition: transform ${0.5+Math.random()*0.4}s cubic-bezier(.34,1.56,.64,1), opacity 0.6s ease;
      opacity:1;
    `;
    s.textContent = loveEmojis[Math.floor(Math.random() * loveEmojis.length)];
    document.body.appendChild(s);
    const angle = (Math.PI * 2 / 10) * i;
    const dist  = 50 + Math.random() * 60;
    const tx = Math.cos(angle) * dist;
    const ty = Math.sin(angle) * dist;
    requestAnimationFrame(() => requestAnimationFrame(() => {
      s.style.transform = `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px)) scale(1.2)`;
      s.style.opacity = '0';
    }));
    setTimeout(() => s.remove(), 1100);
  }
}

function spawnHeart() {
  const h   = document.createElement('span');
  h.className = 'fheart';
  h.textContent = heartChars[Math.floor(Math.random() * heartChars.length)];
  h.style.left   = Math.random() * 100 + 'vw';
  const dur  = 8  + Math.random() * 10;
  const delay = Math.random() * 5;
  h.style.animationDuration = dur   + 's';
  h.style.animationDelay   = delay + 's';
  h.style.fontSize = (0.8 + Math.random() * 1.2) + 'rem';
  h.style.color    = ['#c03575', '#e085ab', '#8B1A1A', '#f4a7c3'][Math.floor(Math.random() * 4)];
  // ── Clicking a floating heart scatters love emojis ──
  h.style.pointerEvents = 'auto';
  h.style.cursor = 'pointer';
  h.addEventListener('click', function(e) {
    e.stopPropagation();
    scatterLoveAt(e.clientX, e.clientY);
    h.remove();
  });
  heartContainer.appendChild(h);
  setTimeout(() => h.remove(), (dur + delay) * 1000);
}

setInterval(spawnHeart, 600);


/* ==========================================================
   3. SCENE 1 — Envelope hearts, seal sparkle, audio, love scatter
========================================================== */

// ── Heart spots on envelope face ──
const envHearts = document.getElementById('env-hearts');
const hPositions = [
  [15,12],[38,8],[55,5],[75,15],[88,10],
  [10,35],[28,30],[62,28],[80,32],[92,38],
  [5,60],[20,55],[45,58],[70,52],[90,60],
  [18,80],[40,78],[60,82],[82,76],
];
hPositions.forEach(([x, y]) => {
  const h = document.createElement('span');
  h.className = 'env-heart';
  h.textContent = '♥';
  h.style.left  = x + '%';
  h.style.top   = y + '%';
  h.style.animationDelay = Math.random() * 2 + 's';
  envHearts.appendChild(h);
});

// ── Click ANYWHERE on Scene 1 → scatter love emojis ──
const scene1El = document.getElementById('scene1');
const s1LoveEmojis = ['💕','💗','💖','❤️','💓','💞','🩷','✨','🫀'];
scene1El.addEventListener('click', function(e) {
  // don't double-fire for the seal (it has its own)
  const cx = e.clientX, cy = e.clientY;
  const count = 8;
  for (let i = 0; i < count; i++) {
    const el = document.createElement('span');
    el.style.cssText = `
      position:fixed;
      font-size:${0.9 + Math.random() * 0.7}rem;
      pointer-events:none;
      z-index:9998;
      left:${cx}px;
      top:${cy}px;
      transform:translate(-50%,-50%) scale(0);
      transition: transform ${0.45 + Math.random()*0.35}s cubic-bezier(.34,1.56,.64,1),
                  opacity 0.55s ease ${0.15 + Math.random()*0.1}s;
      opacity:1;
    `;
    el.textContent = s1LoveEmojis[Math.floor(Math.random() * s1LoveEmojis.length)];
    document.body.appendChild(el);
    const angle = (Math.PI * 2 / count) * i + Math.random() * 0.5;
    const dist  = 45 + Math.random() * 65;
    const tx = Math.cos(angle) * dist;
    const ty = Math.sin(angle) * dist;
    requestAnimationFrame(() => requestAnimationFrame(() => {
      el.style.transform = `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px)) scale(1.15)`;
      el.style.opacity   = '0';
    }));
    setTimeout(() => el.remove(), 1000);
  }
});

// ── Wax seal —  sparkle burst + open envelope ──
let envelopeOpen = false;
const waxSeal = document.getElementById('wax-seal');
waxSeal.addEventListener('click', function(e) {
  e.stopPropagation(); // prevent scene1 scatter on seal itself
  const cx = e.clientX, cy = e.clientY;
  // dramatic sparkle ring
  const sparkleEmojis = ['✨','⭐','💫','🌟','💥','🌸','💕'];
  for (let i = 0; i < 18; i++) {
    const s = document.createElement('span');
    s.className = 'sparkle';
    s.textContent = sparkleEmojis[Math.floor(Math.random() * sparkleEmojis.length)];
    const angle = (Math.PI * 2 / 18) * i;
    const dist  = 55 + Math.random() * 75;
    s.style.left = cx + 'px';
    s.style.top  = cy + 'px';
    s.style.fontSize = (0.9 + Math.random() * 0.8) + 'rem';
    s.style.setProperty('--sx', (Math.cos(angle) * dist) + 'px');
    s.style.setProperty('--sy', (Math.sin(angle) * dist) + 'px');
    document.body.appendChild(s);
    setTimeout(() => s.remove(), 950);
  }
  // open or close toggle
  if (!envelopeOpen) {
    envelopeOpen = true;
    document.getElementById('env').classList.add('open');
    const hint = document.getElementById('open-hint-text');
    if (hint) { hint.style.opacity = '0'; hint.style.pointerEvents = 'none'; }
  }
});

/** Close envelope from the × button inside the letter */
function closeEnvelope() {
  envelopeOpen = false;
  document.getElementById('env').classList.remove('open');
  const hint = document.getElementById('open-hint-text');
  if (hint) { hint.style.opacity = '1'; hint.style.pointerEvents = ''; }
  // stop audio too
  stopScene1Audio();
}

// ── Scene 1 Audio Player ──
let s1Playing  = false;
let s1Interval = null;

function fmtTime(sec) {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return m + ':' + String(s).padStart(2, '0');
}

function stopScene1Audio() {
  const audio = document.getElementById('scene1-audio');
  const btn   = document.getElementById('audio-play-btn');
  const icon  = document.getElementById('play-icon');
  const disc  = document.getElementById('audio-disc');
  if (audio) { audio.pause(); audio.currentTime = 0; }
  s1Playing = false;
  clearInterval(s1Interval);
  if (btn)  btn.classList.remove('playing');
  if (icon) icon.textContent = '▶';
  if (disc) disc.classList.remove('spinning');
  updateAudioUI(0, 0);
}

function updateAudioUI(cur, dur) {
  const fill  = document.getElementById('audio-progress-fill');
  const thumb = document.getElementById('audio-progress-thumb');
  const time  = document.getElementById('audio-current');
  const pct   = dur > 0 ? (cur / dur * 100) : 0;
  if (fill)  fill.style.width = pct + '%';
  if (thumb) thumb.style.left = pct + '%';
  if (time)  time.textContent = fmtTime(cur);
}

function toggleAudioScene1() {
  const audio = document.getElementById('scene1-audio');
  const btn   = document.getElementById('audio-play-btn');
  const icon  = document.getElementById('play-icon');
  const disc  = document.getElementById('audio-disc');
  if (!audio) return;

  if (s1Playing) {
    // pause
    audio.pause();
    s1Playing = false;
    clearInterval(s1Interval);
    btn.classList.remove('playing');
    icon.textContent = '▶';
    disc.classList.remove('spinning');
  } else {
    // play
    audio.play().catch(() => {});
    s1Playing = true;
    btn.classList.add('playing');
    icon.textContent = '⏸';
    disc.classList.add('spinning');
    // set duration label
    const durEl = document.getElementById('audio-duration');
    if (durEl && audio.duration) durEl.textContent = fmtTime(audio.duration);
    audio.addEventListener('loadedmetadata', () => {
      if (durEl) durEl.textContent = fmtTime(audio.duration);
    }, { once: true });
    // progress tick
    s1Interval = setInterval(() => {
      updateAudioUI(audio.currentTime, audio.duration);
    }, 300);
    // on end
    audio.onended = () => stopScene1Audio();
  }
}


/* ==========================================================
   4. SCENE 2 — Lip marks background + typewriter + heart sparks
   ── Change pcLines[] text to edit the postcard message ──
   ── Change lipCount to add/remove background lip marks ──
========================================================== */

// Scattered lip emoji background
const lipsBg   = document.getElementById('lips-bg');
const lipCount = 22; // ← increase/decrease number of lips
for (let i = 0; i < lipCount; i++) {
  const lip = document.createElement('span');
  lip.className = 'lip';
  lip.textContent = '💋';
  lip.style.top  = Math.random() * 100 + '%';
  lip.style.left = Math.random() * 100 + '%';
  lip.style.setProperty('--r', (Math.random() * 360) + 'deg');
  lip.style.setProperty('--s', (0.5 + Math.random() * 0.8).toString());
  lip.style.animationDuration  = (6 + Math.random() * 8) + 's';
  lip.style.animationDirection = Math.random() > 0.5 ? 'alternate' : 'reverse';
  lipsBg.appendChild(lip);
}

// Typewriter lines — edit text here to change the postcard poem
const pcLines = [
  { id: 'pc-line-1', text: 'Spending time'         },  // ← line 1
  { id: 'pc-line-2', text: 'with you does'         },  // ← line 2
  { id: 'pc-line-3', text: 'give me'               },  // ← line 3
  { id: 'pc-line-4', text: 'luxury... ✦'           },  // ← line 4
];
let twDone = false;

function startTypewriter() {
  if (twDone) return; // only run once
  twDone = true;
  let lineIdx = 0;

  function typeLine(lineObj, cb) {
    const el = document.getElementById(lineObj.id);
    el.classList.add('visible');
    el.innerHTML = '';
    const cursor = document.createElement('span');
    cursor.className = 'tw-cursor';
    el.appendChild(cursor);
    let charIdx = 0;

    const interval = setInterval(() => {
      if (charIdx <= lineObj.text.length) {
        el.innerHTML = lineObj.text.slice(0, charIdx);
        if (charIdx < lineObj.text.length) el.appendChild(cursor);
        charIdx++;
      } else {
        clearInterval(interval);
        cursor.remove();
        setTimeout(cb, 300); // pause between lines
      }
    }, 65); // ← typing speed in ms per character
  }

  function next() {
    if (lineIdx < pcLines.length) typeLine(pcLines[lineIdx++], next);
  }
  next();
}


/* ==========================================================
   4b. SCENE 2 — Heart Spark Burst Effect
   ── Fires on click/touch of any heart or love element ──
   ── Works on photo frame, stamp, typewriter lines, lips ──
========================================================== */

/**
 * heartSparkBurst(cx, cy, count)
 * Creates a magical burst of heart emoji particles from (cx, cy).
 * Each particle flies outward with a random angle, speed, size and rotation.
 */
function heartSparkBurst(cx, cy, count = 14) {
  const sparkEmojis = ['♡', '♥', '💕', '💗', '💖', '💓', '💞', '🩷', '✨', '💫'];
  const sizes       = ['0.9rem', '1.1rem', '1.3rem', '1.5rem', '0.75rem'];

  for (let i = 0; i < count; i++) {
    const el = document.createElement('span');
    el.className = 'heart-spark';

    // Random angle spread across full circle with slight inward bias
    const angle   = (Math.PI * 2 / count) * i + (Math.random() - 0.5) * 0.6;
    const dist    = 55 + Math.random() * 90;
    const tx      = Math.cos(angle) * dist;
    const ty      = Math.sin(angle) * dist;
    const dur     = 0.65 + Math.random() * 0.45;
    const rotStart = (Math.random() - 0.5) * 30;
    const rotEnd   = (Math.random() - 0.5) * 120;

    el.style.setProperty('--hs-tx',      tx + 'px');
    el.style.setProperty('--hs-ty',      ty + 'px');
    el.style.setProperty('--hs-dur',     dur + 's');
    el.style.setProperty('--hs-size',    sizes[Math.floor(Math.random() * sizes.length)]);
    el.style.setProperty('--hs-rot',     rotStart + 'deg');
    el.style.setProperty('--hs-rot-end', rotEnd   + 'deg');
    el.style.left = cx + 'px';
    el.style.top  = cy + 'px';
    el.style.transform = 'translate(-50%, -50%)';

    el.textContent = sparkEmojis[Math.floor(Math.random() * sparkEmojis.length)];
    document.body.appendChild(el);
    setTimeout(() => el.remove(), (dur + 0.15) * 1000);
  }
}

// ── Wire up heart spark to Scene 2 elements ──
(function attachScene2Sparks() {
  const scene2 = document.getElementById('scene2');
  if (!scene2) return;

  // Helper: fire spark from a pointer event
  function fireFromEvent(e) {
    const cx = e.touches ? e.touches[0].clientX : e.clientX;
    const cy = e.touches ? e.touches[0].clientY : e.clientY;
    heartSparkBurst(cx, cy, 14);
  }

  // 1. Photo frame — click or touch
  const photoFrame = scene2.querySelector('.pc-photo-frame');
  if (photoFrame) {
    photoFrame.addEventListener('click',      fireFromEvent);
    photoFrame.addEventListener('touchstart', fireFromEvent, { passive: true });
  }

  // 2. Stamp box — click or touch
  const stampBox = scene2.querySelector('.stamp-box');
  if (stampBox) {
    stampBox.addEventListener('click',      fireFromEvent);
    stampBox.addEventListener('touchstart', fireFromEvent, { passive: true });
  }

  // 3. Typewriter lines — click
  const pcLineEls = scene2.querySelectorAll('.postcard-left p');
  pcLineEls.forEach(p => {
    p.style.cursor = 'pointer';
    p.addEventListener('click',      fireFromEvent);
    p.addEventListener('touchstart', fireFromEvent, { passive: true });
  });

  // 4. Aankhein caption — click
  const caption = scene2.querySelector('.pc-photo-caption');
  if (caption) {
    caption.style.cursor = 'pointer';
    caption.addEventListener('click',      fireFromEvent);
    caption.addEventListener('touchstart', fireFromEvent, { passive: true });
  }

  // 5. Lip emojis background — clicking any lip also fires sparks
  const lipsBgEl = document.getElementById('lips-bg');
  if (lipsBgEl) {
    lipsBgEl.addEventListener('click', fireFromEvent);
  }

  // 6. Address / signature area — soft spark on click
  const sig = scene2.querySelector('.postcard-signature');
  if (sig) {
    sig.style.cursor = 'pointer';
    sig.addEventListener('click', fireFromEvent);
  }
})();


/* ==========================================================
   5. SCENE 3 — Falling petals + bloom flowers burst
   ── Change petalEmojis[] to use different petals ──
   ── Change petalCount to add/remove falling petals ──
========================================================== */

// Falling petal emojis
const petalArea   = document.getElementById('falling-petals');
const petalEmojis = ['🌸', '🌺', '🌹', '💮']; // ← change petal styles
const petalCount  = 12;  // ← how many petals fall

for (let i = 0; i < petalCount; i++) {
  const p = document.createElement('span');
  p.className   = 'petal-fall';
  p.textContent = petalEmojis[Math.floor(Math.random() * petalEmojis.length)];
  p.style.left            = Math.random() * 100 + 'vw';
  p.style.animationDuration = (6 + Math.random() * 8) + 's';
  p.style.animationDelay    = (Math.random() * 10) + 's';
  petalArea.appendChild(p);
}

/**
 * bloomFlowers() — called when "Click me 🌸" tag is clicked.
 * Changes all petal colors then fires a radial heart burst.
 */
function bloomFlowers() {
  // Brighten petals
  const petals = document.querySelectorAll('#scene3 .petal');
  petals.forEach(p => {
    p.style.background = 'linear-gradient(180deg, #ff8fbf, #e0397a)'; // ← bloom color
  });

  // Burst hearts outward using JS Math.cos/sin (cross-browser safe)
  const burstEmojis = ['💕', '💗', '💖', '❤️']; // ← change burst hearts
  for (let i = 0; i < 12; i++) {
    const h     = document.createElement('span');
    const angle = (2 * Math.PI / 12) * i;
    const dist  = 180 + Math.random() * 80;
    const tx    = Math.cos(angle) * dist;
    const ty    = Math.sin(angle) * dist;
    h.style.cssText = `
      position:fixed; font-size:2rem; pointer-events:none;
      left:50%; top:50%;
      transform:translate(-50%,-50%) scale(0);
      z-index:9999;
      transition: transform ${0.7 + i * 0.04}s cubic-bezier(.34,1.56,.64,1), opacity 0.7s ease;
      opacity:1;
    `;
    h.textContent = burstEmojis[Math.floor(Math.random() * burstEmojis.length)];
    document.body.appendChild(h);
    requestAnimationFrame(() => requestAnimationFrame(() => {
      h.style.transform = `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px)) scale(1.5)`;
      h.style.opacity   = '0';
    }));
    setTimeout(() => h.remove(), 1500);
  }

  // Reset petals after 2 seconds
  setTimeout(() => {
    petals.forEach(p => { p.style.background = ''; });
  }, 2000);
}


/* ==========================================================
   6. SCENE 4 — Scattered background hearts
   ── Change heartCount to add/remove hearts ──
========================================================== */
const scHearts  = document.getElementById('scattered-hearts');
const heartCount = 25; // ← number of background hearts

for (let i = 0; i < heartCount; i++) {
  const h = document.createElement('span');
  h.className   = 'sc-heart';
  h.textContent = ['♡', '♥', '💕'][Math.floor(Math.random() * 3)];
  h.style.top    = Math.random() * 100 + '%';
  h.style.left   = Math.random() * 100 + '%';
  h.style.animationDelay    = Math.random() * 3 + 's';
  h.style.animationDuration = (2 + Math.random() * 2) + 's';
  h.style.fontSize = (0.8 + Math.random() * 1.5) + 'rem';
  h.style.color  = ['#c03575', '#e085ab', '#8B1A1A'][Math.floor(Math.random() * 3)];
  scHearts.appendChild(h);
}


/* ==========================================================
   7. SCENE 5 — Being Better Together (Hardcoded Countdown)
   ── Counts days since 21 March 2025 automatically ──
   ── No date input / no name form needed anymore    ──
========================================================== */

// Hardcoded start date — 21 March 2025
(function startFixedCountdown() {
  const TARGET_DATE = new Date('2026-03-21T00:00:00');

  const cdUnits   = document.getElementById('countdown-units');
  const cdDisplay = document.getElementById('countdown-display');

  // Always show the units immediately
  if (cdUnits) cdUnits.style.display = 'flex';

  function updateCD() {
    const now  = new Date();
    let diff   = now - TARGET_DATE;       // ms since 21 March 2025
    const isPast = diff >= 0;
    if (!isPast) diff = -diff;            // safety: handle future edge-case

    const days = Math.floor(diff / 864e5);
    const hrs  = Math.floor((diff % 864e5) / 36e5);
    const min  = Math.floor((diff % 36e5)  / 6e4);
    const sec  = Math.floor((diff % 6e4)   / 1e3);

    const dEl = document.getElementById('cd-days');
    const hEl = document.getElementById('cd-hrs');
    const mEl = document.getElementById('cd-min');
    const sEl = document.getElementById('cd-sec');

    if (dEl) dEl.textContent = days;
    if (hEl) hEl.textContent = String(hrs).padStart(2, '0');
    if (mEl) mEl.textContent = String(min).padStart(2, '0');
    if (sEl) sEl.textContent = String(sec).padStart(2, '0');

    if (cdDisplay) {
      cdDisplay.textContent = isPast
        ? `💞 ${days} beautiful day${days !== 1 ? 's' : ''} of us`
        : `✨ ${days} day${days !== 1 ? 's' : ''} until we begin`;
    }
  }

  updateCD();
  setInterval(updateCD, 1000);
})();


/* ==========================================================
   8. SCENE 6 — Starfield generation
   ── Change starCount / warmCount to add/remove stars ──
========================================================== */
(function buildStars() {
  const sf         = document.getElementById('starfield');
  const starCount  = 180; // ← white stars
  const warmCount  = 80;  // ← warm golden stars

  // White stars layer
  const shadows = [];
  for (let i = 0; i < starCount; i++) {
    const x  = Math.floor(Math.random() * window.innerWidth);
    const y  = Math.floor(Math.random() * window.innerHeight);
    const op = (0.3 + Math.random() * 0.7).toFixed(2);
    shadows.push(`${x}px ${y}px 0 rgba(255,255,255,${op})`);
  }
  const layer         = document.createElement('div');
  layer.className     = 'star-layer';
  layer.style.boxShadow = shadows.join(',');
  layer.style.animation = `starTwinkle ${3 + Math.random() * 4}s ease-in-out infinite alternate`;
  sf.appendChild(layer);

  // Warm golden star layer
  const shadows2 = [];
  for (let i = 0; i < warmCount; i++) {
    const x = Math.floor(Math.random() * window.innerWidth);
    const y = Math.floor(Math.random() * window.innerHeight);
    shadows2.push(`${x}px ${y}px 1px rgba(255,220,180,0.6)`);
  }
  const layer2          = document.createElement('div');
  layer2.className      = 'star-layer';
  layer2.style.boxShadow = shadows2.join(',');
  layer2.style.animation = `starTwinkle ${4 + Math.random() * 3}s ease-in-out infinite alternate-reverse`;
  sf.appendChild(layer2);

  // Inject the twinkle keyframe once
  const style = document.createElement('style');
  style.textContent = `
    @keyframes starTwinkle {
      from { opacity: 0.6; }
      to   { opacity: 1; }
    }
  `;
  document.head.appendChild(style);
})();


/* ==========================================================
   8b. SCENE 6 — Candle Blow Interaction
   ── Click the candle to blow it out romantically ──
   ── Sparkle particles fly up, flame goes out      ──
   ── Automatically relights after 3 seconds        ──
========================================================== */

/**
 * triggerCandleBlow(wrapperEl)
 * Called by onclick on #candle-wrapper.
 * Blows out the candle, spawns romantic sparkles, then relights.
 */
function triggerCandleBlow(wrapperEl) {
  if (!wrapperEl) wrapperEl = document.getElementById('candle-wrapper');
  if (wrapperEl.classList.contains('blown')) return; // already blown

  // ── 1. Blow out the flame ──
  wrapperEl.classList.remove('relight');
  wrapperEl.classList.add('blown');

  // ── 2. Spawn romantic sparkle particles from flame position ──
  const flameEl = document.getElementById('candle-flame') || wrapperEl.querySelector('.flame');
  let cx = window.innerWidth  / 2;
  let cy = window.innerHeight / 2;
  if (flameEl) {
    const r = flameEl.getBoundingClientRect();
    cx = r.left + r.width  / 2;
    cy = r.top  + r.height / 2;
  }

  const sparkEmojis = ['✨','💫','🌟','⭐','💛','🔆','🕯️'];
  const count       = 16;

  for (let i = 0; i < count; i++) {
    const el  = document.createElement('span');
    el.className = 'candle-sparkle';

    const angle = (Math.PI * 2 / count) * i + (Math.random() - 0.5) * 0.5;
    const dist  = 40 + Math.random() * 80;
    const tx    = Math.cos(angle) * dist;
    const ty    = Math.sin(angle) * dist - 30; // bias upward (like smoke)
    const dur   = 0.7 + Math.random() * 0.5;
    const sizes = ['0.8rem', '1rem', '1.2rem', '1.4rem', '0.65rem'];

    el.style.setProperty('--cs-tx',   tx   + 'px');
    el.style.setProperty('--cs-ty',   ty   + 'px');
    el.style.setProperty('--cs-dur',  dur  + 's');
    el.style.setProperty('--cs-size', sizes[Math.floor(Math.random() * sizes.length)]);
    el.style.left      = cx + 'px';
    el.style.top       = cy + 'px';
    el.style.transform = 'translate(-50%, -50%)';
    el.textContent     = sparkEmojis[Math.floor(Math.random() * sparkEmojis.length)];
    document.body.appendChild(el);
    setTimeout(() => el.remove(), (dur + 0.2) * 1000);
  }

  // ── 3. Relight after 3 seconds ──
  setTimeout(() => {
    wrapperEl.classList.remove('blown');
    wrapperEl.classList.add('relight');
    // clean up relight class after animation finishes
    setTimeout(() => wrapperEl.classList.remove('relight'), 900);
  }, 3000);
}


/* ==========================================================
   9. MUSIC — Main website song player
   ── File: "main audio .mpeg"                     ──
   ── Click 🎵 to play / pause with smooth fade    ──
========================================================== */

const musicBtn = document.getElementById('music-btn');

// Create the audio element pointing to your main song
const mainAudio       = new Audio('main audio .mpeg');
mainAudio.loop        = true;
mainAudio.volume      = 0;
mainAudio.preload     = 'auto';

let isPlaying   = false;
let fadeInterval = null;

function fadeTo(targetVol, duration, onDone) {
  if (fadeInterval) clearInterval(fadeInterval);
  const steps    = 30;
  const stepTime = duration / steps;
  const startVol = mainAudio.volume;
  const delta    = (targetVol - startVol) / steps;
  let   count    = 0;
  fadeInterval   = setInterval(() => {
    count++;
    mainAudio.volume = Math.min(1, Math.max(0, startVol + delta * count));
    if (count >= steps) {
      clearInterval(fadeInterval);
      fadeInterval = null;
      mainAudio.volume = targetVol;
      if (onDone) onDone();
    }
  }, stepTime);
}

musicBtn.addEventListener('click', () => {
  if (isPlaying) {
    // Fade out then pause
    fadeTo(0, 1200, () => {
      mainAudio.pause();
    });
    isPlaying = false;
    musicBtn.textContent = '🎵';
    musicBtn.classList.remove('playing');
  } else {
    // Play then fade in
    mainAudio.play().catch(() => {});
    fadeTo(0.72, 1500);
    isPlaying = true;
    musicBtn.textContent = '🎶';
    musicBtn.classList.add('playing');
  }
});


