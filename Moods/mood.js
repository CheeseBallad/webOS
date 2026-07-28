//Weather moods
const moodApparitions = {
  "Summer Breeze": "サマーブリーズ",
  "Overcast Skies": "曇天",
  "Hide and Seek Alone": "かくれんぼ、ひとり",
  "It's Raining After All": "やっぱり雨は降るんだね",
  "Heavy Rain Fall": "雨が降る",
  "When Morning Glory Falls": "明けない夜が降る、雪が降る"
};
// Mood settings
const moodSettings = {
  "Summer Breeze": {
    overlay: "rgba(255, 200, 100, 0.08)",
    overlayOpacity: 0.3,
    wallpaperBrightness: 1.1,
    rainEnabled: false,
  },
  "Overcast Skies": {
    overlay: "rgba(100, 120, 160, 0.3)",
    overlayOpacity: 0.4,
    wallpaperBrightness: 0.7,
    rainEnabled: false,
  },
  "Hide and Seek Alone": {
    overlay: "rgba(65, 72, 90, 0.4)",
    overlayOpacity: 0.5,
    wallpaperBrightness: 0.6,
    rainEnabled: false,
  },
  "It's Raining After All": {
    overlay: "rgba(30, 40, 80, 0.4)",
    overlayOpacity: 0.5,
    wallpaperBrightness: 0.75,
    rainEnabled: true,
    rainCount: 120,
    rainSpeed: 1
  },
  "Heavy Rain Fall": {
    overlay: "rgba(10, 20, 50, 0.6)",
    overlayOpacity: 0.65,
    wallpaperBrightness: 0.5,
    rainEnabled: true,
    rainCount: 220,
    rainSpeed: 1.8
  },
  "When Morning Glory Falls": {
    overlay: "rgba(180, 200, 230, 0.15)",
    overlayOpacity: 0.3,
    wallpaperBrightness: 0.85,
    rainEnabled: false,
  }
};
//Mood function
function setWeatherMood(desc) {
  const mood = moodSettings[desc];
  if (!mood) return;

  const overlay = document.getElementById('mood-overlay');
  overlay.style.background = mood.overlay;
  overlay.style.opacity = mood.overlayOpacity;

  document.body.style.filter = `brightness(${mood.wallpaperBrightness})`;

  const apparition = document.getElementById('mood-apparition');
  apparition.style.opacity = 0;
  setTimeout(() => {
    apparition.innerHTML = moodApparitions[desc] || "";
    apparition.style.opacity = 0.06;
  }, 1000);

  // always stop flash first
  stopFlash();
  stopMist();
  stopSun();

  if (desc === "Heavy Rain Fall") scheduleFlash();
  if (desc === "Hide and Seek Alone") startMist();
  if (desc === "Summer Breeze") startSun();

  rainEnabled = mood.rainEnabled;
  if (mood.rainEnabled) {
    rainDrops.forEach(d => {
      d.duration = (0.5 + Math.random() * 0.5) / mood.rainSpeed;
    });
    while (rainDrops.length < mood.rainCount) {
      rainDrops.push({
        x: Math.random() * window.innerWidth,
        len: 10 + Math.random() * 20,
        duration: (0.5 + Math.random() * 0.5) / mood.rainSpeed,
        elapsed: Math.random() * 2,
        opacity: 0.08 + Math.random() * 0.18
      });
    }
    if (rainDrops.length > mood.rainCount) rainDrops.splice(mood.rainCount);
  }

  document.querySelector('.rain-toggle').classList.toggle('off', !mood.rainEnabled);
}
//test moods
function testMood(mood) {
  const validMoods = [
    "Summer Breeze",
    "Overcast Skies", 
    "Hide and Seek Alone",
    "It's Raining After All",
    "Heavy Rain Fall",
    "When Morning Glory Falls"
  ];
  
  if (!mood) {
    console.log("Available moods:", validMoods);
    return;
  }
  
  setWeatherMood(mood);
  console.log("Mood set to:", mood);
}

// lightning flashes
const flashCanvas = document.getElementById('desktop-flash');
const flashCtx = flashCanvas.getContext('2d');
let flashAlpha = 0;
let flashActive = false;
let flashTimeout;

function resizeFlash() {
  flashCanvas.width = window.innerWidth;
  flashCanvas.height = window.innerHeight;
}

function triggerFlash() {
  flashAlpha = 0.5 + Math.random() * 0.4;
  flashActive = true;
}

function scheduleFlash() {
  clearTimeout(flashTimeout);
  flashTimeout = setTimeout(() => {
    triggerFlash();
    scheduleFlash();
  }, 3000 + Math.random() * 6000);
}

function stopFlash() {
  clearTimeout(flashTimeout);
  flashActive = false;
  flashAlpha = 0;
  flashCtx.clearRect(0, 0, flashCanvas.width, flashCanvas.height);
}

function drawFlash() {
  if (!flashActive) {
    requestAnimationFrame(drawFlash);
    return;
  }
  flashCtx.clearRect(0, 0, flashCanvas.width, flashCanvas.height);
  if (flashAlpha > 0) {
    flashCtx.fillStyle = `rgba(220, 230, 255, ${flashAlpha})`;
    flashCtx.fillRect(0, 0, flashCanvas.width, flashCanvas.height);
    flashAlpha = Math.max(0, flashAlpha - 0.04);
  }
  requestAnimationFrame(drawFlash);
}

setTimeout(() => { resizeFlash(); drawFlash(); }, 100);
window.addEventListener('resize', resizeFlash);

//Mist
const mistCanvas = document.getElementById('desktop-mist');
const mistCtx = mistCanvas.getContext('2d');
let mistActive = false;

function resizeMist() {
  mistCanvas.width = window.innerWidth;
  mistCanvas.height = window.innerHeight;
}

const mistLayers = Array.from({length: 8}, (_, i) => ({
  yRatio: i / 8,
  speed: 0.0002 + Math.random() * 0.0003,
  offset: Math.random() * 1000,
  opacity: 0.05 + Math.random() * 0.09,
  height: 100 + Math.random() * 140,
}));

const mistParticles = Array.from({length: 30}, () => ({
  x: Math.random(),
  y: Math.random(),
  size: 1 + Math.random() * 2,
  speed: 0.00005 + Math.random() * 0.0001,
  opacity: 0.03 + Math.random() * 0.08,
  offset: Math.random() * 1000
}));

function drawMist(ts) {
  mistCtx.clearRect(0, 0, mistCanvas.width, mistCanvas.height);
  if (mistActive) {
    mistLayers.forEach(l => {
      const y = l.yRatio * mistCanvas.height;
      const drift = Math.sin(ts * l.speed + l.offset) * 50;
      const breathe = Math.sin(ts * 0.0003 + l.offset) * 0.03;
      const op = Math.max(0, l.opacity + breathe);
      const grad = mistCtx.createLinearGradient(0, y + drift - 30, 0, y + drift + l.height + 30);
      grad.addColorStop(0, 'transparent');
      grad.addColorStop(0.3, `rgba(150, 162, 195, ${op})`);
      grad.addColorStop(0.7, `rgba(150, 162, 195, ${op})`);
      grad.addColorStop(1, 'transparent');
      mistCtx.fillStyle = grad;
      mistCtx.fillRect(0, y + drift - 30, mistCanvas.width, l.height + 60);
    });

    mistParticles.forEach(p => {
      const x = (p.x + ts * p.speed) % 1;
      const y = p.y * mistCanvas.height;
      const breathe = Math.sin(ts * 0.0004 + p.offset) * 0.03;
      mistCtx.beginPath();
      mistCtx.arc(x * mistCanvas.width, y, p.size, 0, Math.PI * 2);
      mistCtx.fillStyle = `rgba(180, 190, 220, ${Math.max(0, p.opacity + breathe)})`;
      mistCtx.fill();
    });
  }
  requestAnimationFrame(drawMist);
}

function startMist() { mistCanvas.style.display = 'block'; mistActive = true; }
function stopMist()  { mistCanvas.style.display = 'none';  mistActive = false; }

setTimeout(() => { resizeMist(); requestAnimationFrame(drawMist); }, 100);
window.addEventListener('resize', resizeMist);

// SUN RAYS
const sunCanvas = document.getElementById('desktop-sun');
const sunCtx = sunCanvas.getContext('2d');
let sunActive = false;

function resizeSun() {
  sunCanvas.width = window.innerWidth;
  sunCanvas.height = window.innerHeight;
}

const sunRays = Array.from({length: 12}, (_, i) => ({
  angle: (i / 12) * Math.PI * 0.75 + Math.PI * 0.6,
  width: 0.04 + Math.random() * 0.07,
  offset: Math.random() * 1000,
  speed: 0.0002 + Math.random() * 0.0003
}));

function drawSun(ts) {
  sunCtx.clearRect(0, 0, sunCanvas.width, sunCanvas.height);
  if (sunActive) {
    const cx = sunCanvas.width * 0.88;
    const cy = -30;

    // ambient glow
    const glow = sunCtx.createRadialGradient(cx, cy, 0, cx, cy, sunCanvas.width * 0.8);
    glow.addColorStop(0, 'rgba(255, 210, 100, 0.1)');
    glow.addColorStop(1, 'transparent');
    sunCtx.fillStyle = glow;
    sunCtx.fillRect(0, 0, sunCanvas.width, sunCanvas.height);

    // rays
    sunRays.forEach(r => {
      const breathe = Math.sin(ts * r.speed + r.offset) * 0.015;
      const len = sunCanvas.width * 1.8;
      const a1 = r.angle - r.width / 2;
      const a2 = r.angle + r.width / 2;

      sunCtx.beginPath();
      sunCtx.moveTo(cx, cy);
      sunCtx.lineTo(cx + Math.cos(a1) * len, cy + Math.sin(a1) * len);
      sunCtx.lineTo(cx + Math.cos(a2) * len, cy + Math.sin(a2) * len);
      sunCtx.closePath();

      const grad = sunCtx.createLinearGradient(cx, cy, cx + Math.cos(r.angle) * len, cy + Math.sin(r.angle) * len);
      grad.addColorStop(0, `rgba(255, 220, 120, ${0.07 + breathe})`);
      grad.addColorStop(0.5, `rgba(255, 210, 100, ${0.03 + breathe})`);
      grad.addColorStop(1, 'transparent');
      sunCtx.fillStyle = grad;
      sunCtx.fill();
    });
  }
  requestAnimationFrame(drawSun);
}

function startSun() { sunCanvas.style.display = 'block'; sunActive = true; }
function stopSun()  { sunCanvas.style.display = 'none';  sunActive = false; }

setTimeout(() => { resizeSun(); requestAnimationFrame(drawSun); }, 100);
window.addEventListener('resize', resizeSun);