//windows logic

//drag
function dragElement(element) {

  var initialX = 0;
  var initialY = 0;
  var currentX = 0;
  var currentY = 0;

  if (document.getElementById(element.id + "header")) {
    document.getElementById(element.id + "header").onmousedown = startDragging;
  } else {
    element.onmousedown = startDragging;
  }
  function startDragging(e) {
    e = e || window.event;
    e.preventDefault();
    initialX = e.clientX;
    initialY = e.clientY;
    document.onmouseup = stopDragging;
    document.onmousemove = dragElement;
  }

  function dragElement(e) {
    e = e || window.event;
    e.preventDefault();
    currentX = initialX - e.clientX;
    currentY = initialY - e.clientY;
    initialX = e.clientX;
    initialY = e.clientY;
    element.style.top = (element.offsetTop - currentY) + "px";
    element.style.left = (element.offsetLeft - currentX) + "px";
  }

  function stopDragging() {
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

var biggestIndex = 1;
var openWindows = [];
var topBar = document.querySelector("#top")

//open and close minimize

function closeWindow(element) {
  element.style.display = "none"
  openWindows = openWindows.filter(w => w.el !== element);
  removePillDot(element);
}
function openWindow(element) {
  element.style.display = "flex";
  element.style.height = "";
  biggestIndex++;
  element.style.zIndex = biggestIndex;
  topBar.style.zIndex = biggestIndex + 1;

  if (element.id === "TUYU") {
    setTimeout(() => { resize(); draw(); }, 50);
  }

  if (!openWindows.find(w => w.el === element)) {
    openWindows.push({ el: element, minimized: false });
    addPillDot(element);
  } else {
    const entry = openWindows.find(w => w.el === element);
    if (entry) entry.minimized = false;
    const dot = document.querySelector(`.pill-dot[data-window="${element.id}"]`);
    if (dot) dot.style.opacity = "1";
  }
}

function minimizeWindow(element) {
  element.style.display = "none";
  const entry = openWindows.find(w => w.el === element);
  if (entry) entry.minimized = true;
  const dot = document.querySelector(`.pill-dot[data-window="${element.id}"]`);
  if (dot) dot.style.opacity = "0.4";
}

function addPillDot(element) {
  const pill = document.getElementById('app-open');
  pill.style.display = 'flex'; // ensure it's visible
  const dot = document.createElement('div');
  dot.className = 'pill-dot';
  dot.dataset.window = element.id;
  dot.style.background = element.dataset.color || "#6082c8";
  dot.addEventListener('click', () => openWindow(element));
  pill.appendChild(dot);
}

function removePillDot(element) {
  const dot = document.querySelector(`.pill-dot[data-window="${element.id}"]`);
  console.log("removing dot for", element.id, "dot found:", dot);
  if (dot) dot.remove();

  const pill = document.getElementById('app-open');
  console.log("remaining dots:", pill.querySelectorAll('.pill-dot').length);
  if (pill.querySelectorAll('.pill-dot').length === 0) {
    pill.style.display = 'none';
  }
}

function handleWindowTap(element) {
  biggestIndex++;
  element.style.zIndex = biggestIndex;
  topBar.style.zIndex = biggestIndex + 1;
}
function addWindowTapHandling(element) {
  element.addEventListener("mousedown", () =>
    handleWindowTap(element)
  )
}

//App clicking
function handleIconTap(element) {
  const target = document.getElementById(element.dataset.window);
  openWindow(target);
}

//Time
function updatetime(){
          var currentTime = new Date().toLocaleString();
          var timeText = document.querySelector("#timeElement");
          timeText.innerHTML = currentTime;
    }
    setInterval(updatetime, 1000);


//initalize windows
function initializeWindow(elementName, color) {
  var screen = document.querySelector("#" + elementName);
  screen.dataset.color = color || "#6082c8";

  dragElement(screen);
  addWindowTapHandling(screen);

  var closeBtn = document.querySelector("#" + elementName + "close");
  var minimizeBtn = document.querySelector("#" + elementName + "minimize");
  var openBtn  = document.querySelector("#" + elementName + "open");
  if (closeBtn) closeBtn.addEventListener("click", () => closeWindow(screen));
  if (minimizeBtn) minimizeBtn.addEventListener("click", () => minimizeWindow(screen));
  if (openBtn)  openBtn.addEventListener("click",  () => openWindow(screen));
}

initializeWindow("welcome", "#6082c8");
initializeWindow("TUYU", "#a78bda");

openWindow(document.getElementById("welcome"));

//rain effect
function easeInQuad(t) {
  return t * t;
}

const rainCanvas = document.getElementById('desktop-rain');
const rainCtx = rainCanvas.getContext('2d');
var rainEnabled = true; // controls on/off

function resizeRain() {
  rainCanvas.width = window.innerWidth;
  rainCanvas.height = window.innerHeight;
}

const rainDrops = Array.from({length: 120}, () => ({
  x: Math.random() * window.innerWidth,
  len: 10 + Math.random() * 20,
  duration: 1 + Math.random() * .5,
  elapsed: Math.random() * 2,
  opacity: 0.08 + Math.random() * 0.18
}));

function drawRain() {
  if (!rainEnabled) {
    rainCtx.clearRect(0, 0, rainCanvas.width, rainCanvas.height);
    requestAnimationFrame(drawRain);
    return;
  }
  rainCtx.clearRect(0, 0, rainCanvas.width, rainCanvas.height);
  rainDrops.forEach(d => {
    d.elapsed += 0.016;
    const t = (d.elapsed % d.duration) / d.duration;
    const eased = easeInQuad(t);
    const y = eased * rainCanvas.height;

    rainCtx.beginPath();
    rainCtx.moveTo(d.x, y);
    rainCtx.lineTo(d.x - 1, y + d.len);
    rainCtx.strokeStyle = `rgba(147,197,253,${d.opacity})`;
    rainCtx.lineWidth = 1;
    rainCtx.stroke();
  });
  requestAnimationFrame(drawRain);
}

function toggleRain() {
  rainEnabled = !rainEnabled;
  document.querySelector('.rain-toggle').classList.toggle('off');
}

setTimeout(() => { resizeRain(); drawRain(); }, 100);
window.addEventListener('resize', resizeRain);