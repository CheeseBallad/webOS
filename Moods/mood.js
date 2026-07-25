//Weather moods
const moodApparitions = {
  "Summer Breeze": "サマーブリーズ",
  "Overcast Skies": "曇天",
  "Hide and Seek Alone": "かくれんぼ、ひとり",
  "It's Raining After All": "やっぱり雨は降るんだね",
  "Heavy Rain Fall": "雨が降る",
  "When Morning Glory Falls": "明けない夜が降る、雪が降る"
};

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

function setWeatherMood(desc) {
  const mood = moodSettings[desc];
  if (!mood) return;

  // overlay
  const overlay = document.getElementById('mood-overlay');
  overlay.style.background = mood.overlay;
  overlay.style.opacity = mood.overlayOpacity;

  document.body.style.filter = `brightness(${mood.wallpaperBrightness})`;

  // apparition woah
  const apparition = document.getElementById('mood-apparition');
  apparition.style.opacity = 0;
  setTimeout(() => {
    apparition.innerHTML = moodApparitions[desc] || "";
    apparition.style.opacity = 0.06;
  }, 1000); // fade in after 1s delay

  // rain settings
  rainEnabled = mood.rainEnabled;
  if (mood.rainEnabled) {
    // adjust existing drops speed
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

    if (rainDrops.length > mood.rainCount) {
      rainDrops.splice(mood.rainCount);
    }
  }

  // toggle button sync
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

setTimeout(() => { resizeRain(); drawRain(); }, 100);
window.addEventListener('resize', resizeRain);