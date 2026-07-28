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


// Sun ray shader adapted from ReactBits SideRays component
// Original: https://reactbits.dev/backgrounds/side-rays

// SUN RAYS, WebGL shader port
const sunCanvas = document.getElementById('desktop-sun');
let sunActive = false;
let sunAnimId = null;

function initSunRays() {
  const gl = sunCanvas.getContext('webgl');
  if (!gl) return null;

  const vert = `
    attribute vec2 position;
    void main() {
      gl_Position = vec4(position, 0.0, 1.0);
    }
  `;

  const frag = `
    precision highp float;
    uniform float iTime;
    uniform vec2 iResolution;
    uniform float iSpeed;
    uniform vec3 iRayColor1;
    uniform vec3 iRayColor2;
    uniform float iIntensity;
    uniform float iSpread;
    uniform float iSaturation;
    uniform float iBlend;
    uniform float iFalloff;
    uniform float iOpacity;

    float rayStrength(vec2 raySource, vec2 rayRefDirection, vec2 coord, float seedA, float seedB, float speed) {
      vec2 sourceToCoord = coord - raySource;
      float cosAngle = dot(normalize(sourceToCoord), rayRefDirection);
      return clamp(
        (0.45 + 0.15 * sin(cosAngle * seedA + iTime * speed)) +
        (0.3 + 0.2 * cos(-cosAngle * seedB + iTime * speed)),
        0.0, 1.0) *
        clamp((iResolution.x - length(sourceToCoord)) / iResolution.x, 0.5, 1.0);
    }

    void main() {
      vec2 fragCoord = gl_FragCoord.xy;
      vec2 coord = vec2(fragCoord.x, iResolution.y - fragCoord.y);
      vec2 rayPos = vec2(iResolution.x * 1.1, -0.5 * iResolution.y);

      float halfSpread = iSpread * 0.275;
      vec2 rayRefDir1 = normalize(vec2(cos(0.785398 + halfSpread), sin(0.785398 + halfSpread)));
      vec2 rayRefDir2 = normalize(vec2(cos(0.785398 - halfSpread), sin(0.785398 - halfSpread)));

      vec4 rays1 = vec4(iRayColor1, 1.0) * rayStrength(rayPos, rayRefDir1, coord, 36.2214, 21.11349, iSpeed);
      vec4 rays2 = vec4(iRayColor2, 1.0) * rayStrength(rayPos, rayRefDir2, coord, 22.3991, 18.0234, iSpeed * 0.2);

      vec4 color = rays1 * (1.0 - iBlend) * 0.9 + rays2 * iBlend * 0.9;

      float distanceToLight = length(fragCoord.xy - vec2(rayPos.x, iResolution.y - rayPos.y)) / iResolution.y;
      float brightness = iIntensity * 0.4 / pow(max(distanceToLight, 0.001), iFalloff);
      color.rgb *= brightness;

      float gray = dot(color.rgb, vec3(0.299, 0.587, 0.114));
      color.rgb = mix(vec3(gray), color.rgb, iSaturation);

      color.a = max(color.r, max(color.g, color.b)) * iOpacity;
      gl_FragColor = color;
    }
  `;

  function compileShader(type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    return shader;
  }

  const program = gl.createProgram();
  gl.attachShader(program, compileShader(gl.VERTEX_SHADER, vert));
  gl.attachShader(program, compileShader(gl.FRAGMENT_SHADER, frag));
  gl.linkProgram(program);
  gl.useProgram(program);

  const positions = new Float32Array([-1, -1, 3, -1, -1, 3]);
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
  const posLoc = gl.getAttribLocation(program, 'position');
  gl.enableVertexAttribArray(posLoc);
  gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

  // uniforms
  const uniforms = {
    iTime:       gl.getUniformLocation(program, 'iTime'),
    iResolution: gl.getUniformLocation(program, 'iResolution'),
    iSpeed:      gl.getUniformLocation(program, 'iSpeed'),
    iRayColor1:  gl.getUniformLocation(program, 'iRayColor1'),
    iRayColor2:  gl.getUniformLocation(program, 'iRayColor2'),
    iIntensity:  gl.getUniformLocation(program, 'iIntensity'),
    iSpread:     gl.getUniformLocation(program, 'iSpread'),
    iSaturation: gl.getUniformLocation(program, 'iSaturation'),
    iBlend:      gl.getUniformLocation(program, 'iBlend'),
    iFalloff:    gl.getUniformLocation(program, 'iFalloff'),
    iOpacity:    gl.getUniformLocation(program, 'iOpacity'),
  };

  gl.uniform1f(uniforms.iSpeed,      1.5);
  gl.uniform3fv(uniforms.iRayColor1, [1.0, 0.85, 0.4]);   // yellow
  gl.uniform3fv(uniforms.iRayColor2, [1.0, 0.95, 0.7]);   // white-gold
  gl.uniform1f(uniforms.iIntensity,  1.8);
  gl.uniform1f(uniforms.iSpread,     2.0);
  gl.uniform1f(uniforms.iSaturation, 1.2);
  gl.uniform1f(uniforms.iBlend,      0.6);
  gl.uniform1f(uniforms.iFalloff,    1.4);
  gl.uniform1f(uniforms.iOpacity,    0.85);

  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

  return { gl, uniforms };
}

let sunGL = null;

function resizeSun() {
  sunCanvas.width  = window.innerWidth;
  sunCanvas.height = window.innerHeight;
  if (sunGL) {
    sunGL.gl.viewport(0, 0, sunCanvas.width, sunCanvas.height);
    sunGL.gl.uniform2fv(sunGL.uniforms.iResolution, [sunCanvas.width, sunCanvas.height]);
  }
}

function drawSun(ts) {
  if (!sunActive || !sunGL) {
    sunAnimId = requestAnimationFrame(drawSun);
    return;
  }
  sunGL.gl.uniform1f(sunGL.uniforms.iTime, ts * 0.001);
  sunGL.gl.drawArrays(sunGL.gl.TRIANGLES, 0, 3);
  sunAnimId = requestAnimationFrame(drawSun);
}

function startSun() {
  sunCanvas.style.display = 'block';
  sunActive = true;
  if (!sunGL) {
    sunGL = initSunRays();
    resizeSun();
  }
}

function stopSun() {
  sunCanvas.style.display = 'none';
  sunActive = false;
}

setTimeout(() => { resizeSun(); requestAnimationFrame(drawSun); }, 100);
window.addEventListener('resize', resizeSun);