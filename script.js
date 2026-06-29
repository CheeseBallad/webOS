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
var topBar = document.querySelector("#top")

//open and close
function closeWindow(element) {
  element.style.display = "none"
}
function openWindow(element) {
  element.style.display = "flex"
  element.style.height = "";
  biggestIndex++;
  element.style.zIndex = biggestIndex;
  topBar.style.zIndex = biggestIndex + 1;
  if (element.id === "TUYU") {
    setTimeout(() => { resize(); draw(); }, 50);
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
  openWindow(document.getElementById(element.dataset.window));
}

//Time
function updatetime(){
          var currentTime = new Date().toLocaleString();
          var timeText = document.querySelector("#timeElement");
          timeText.innerHTML = currentTime;
    }
    setInterval(updatetime, 1000);


//initalize windows
function initializeWindow(elementName) {
  var screen = document.querySelector("#" + elementName);
  dragElement(screen);
  addWindowTapHandling(screen);

  var closeBtn = document.querySelector("#" + elementName + "close");
  var openBtn  = document.querySelector("#" + elementName + "open");
  if (closeBtn) closeBtn.addEventListener("click", () => closeWindow(screen));
  if (openBtn)  openBtn.addEventListener("click",  () => openWindow(screen));
}

initializeWindow("welcome");
initializeWindow("TUYU");