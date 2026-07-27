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
  if (desc === "Heavy Rain Fall") scheduleFlash();

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