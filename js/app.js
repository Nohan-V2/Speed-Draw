const startBtn = document.getElementById("startBtn");
const homeScreen = document.getElementById("homeScreen");
const gameScreen = document.getElementById("gameScreen");
const canvasContainer = document.getElementById("canvas-container");
const timerDisplay = document.getElementById("timer");
const themeDisplay = document.getElementById("themeDisplay");
const brushSizeRange = document.getElementById("brushSizeRange");
const brushOpacityRange = document.getElementById("brushOpacityRange");
const colorPicker = document.getElementById("colorPicker");
const cursor = document.getElementById("cursor");
const layersList = document.getElementById("layersList");
const addLayerBtn = document.getElementById("addLayerBtn");

let timer;
let countdown = 5 * 60;
let themes = ["Chien", "Dragon", "Maison", "Pizza", "Espace", "Sirène"];
let currentTheme = "";

let layers = [];
let activeLayerIndex = 0;

startBtn.addEventListener("click", () => {
  homeScreen.classList.add("hidden");
  gameScreen.classList.remove("hidden");
  initGame();
});

function initGame() {
  currentTheme = themes[Math.floor(Math.random() * themes.length)];
  themeDisplay.textContent = `Thème: ${currentTheme}`;
  createLayer();
  startTimer();
}

function startTimer() {
  updateTimerDisplay();
  timer = setInterval(() => {
    countdown--;
    updateTimerDisplay();
    if (countdown <= 0) {
      clearInterval(timer);
      alert("Temps écoulé !");
    }
  }, 1000);
}

function updateTimerDisplay() {
  const minutes = String(Math.floor(countdown / 60)).padStart(2, "0");
  const seconds = String(countdown % 60).padStart(2, "0");
  timerDisplay.textContent = `${minutes}:${seconds}`;
}

function createLayer() {
  const canvas = document.createElement("canvas");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  canvasContainer.appendChild(canvas);

  const ctx = canvas.getContext("2d");
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  layers.push({ canvas, ctx });
  activeLayerIndex = layers.length - 1;

  updateLayersPanel();
  setupDrawing(canvas, ctx);
}

function updateLayersPanel() {
  layersList.innerHTML = "";
  layers.forEach((layer, index) => {
    const li = document.createElement("li");
    li.classList.add("layer-item");
    if (index === activeLayerIndex) li.classList.add("active");
    li.textContent = `Calque ${index + 1}`;
    li.onclick = () => {
      activeLayerIndex = index;
      updateLayersPanel();
    };
    layersList.appendChild(li);
  });
}

addLayerBtn.addEventListener("click", createLayer);

function setupDrawing(canvas, ctx) {
  let painting = false;
  let lastX = 0;
  let lastY = 0;

  function startDraw(e) {
    painting = true;
    [lastX, lastY] = [e.clientX, e.clientY];
  }

  function draw(e) {
    if (!painting) return;
    ctx.strokeStyle = colorPicker.value;
    ctx.lineWidth = brushSizeRange.value;
    ctx.globalAlpha = brushOpacityRange.value;

    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(e.clientX, e.clientY);
    ctx.stroke();
    [lastX, lastY] = [e.clientX, e.clientY];
  }

  function stopDraw() {
    painting = false;
  }

  canvas.addEventListener("mousedown", startDraw);
  canvas.addEventListener("mousemove", draw);
  canvas.addEventListener("mouseup", stopDraw);
  canvas.addEventListener("mouseout", stopDraw);
}

// Curseur personnalisé
window.addEventListener("mousemove", (e) => {
  const size = brushSizeRange.value;
  cursor.style.width = `${size}px`;
  cursor.style.height = `${size}px`;
  cursor.style.left = `${e.clientX - size / 2}px`;
  cursor.style.top = `${e.clientY - size / 2}px`;
  cursor.style.opacity = brushOpacityRange.value;
});
