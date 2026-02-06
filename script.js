const startButton = document.getElementById("start-button");
const startMenu = document.getElementById("start-menu");
const desktop = document.getElementById("desktop");

const photos = [
  { name: "Photo_01.jpg", src: "photos/photo1.jpg" },
  { name: "Photo_02.jpg", src: "photos/photo2.jpg" },
  { name: "Photo_03.jpg", src: "photos/photo3.jpg" },
  { name: "Photo_04.jpg", src: "photos/photo4.jpg" }
];

const WALLPAPERS = [
  "wallpapers/1.jpg",
  "wallpapers/2.jpg",
  "wallpapers/3.jpg",
  "#008080"
];

let currentWallpaperIndex = 0;
let zIndex = 10;

/* ================= START MENU ================= */

startButton.onclick = () => {
  startMenu.style.display =
    startMenu.style.display === "block" ? "none" : "block";
};

document.addEventListener("click", e => {
  if (!startButton.contains(e.target) && !startMenu.contains(e.target)) {
    startMenu.style.display = "none";
  }
});

/* ================= DRAGGABLE WINDOWS ================= */
/* SINGLE, FIXED VERSION — DO NOT DUPLICATE */

function makeDraggable(win) {
  const titleBar = win.querySelector(".title-bar");

  let dragging = false;
  let offsetX = 0;
  let offsetY = 0;

  titleBar.addEventListener("mousedown", e => {
    // ABSOLUTE RULE: close button never starts drag
    if (e.target.classList.contains("close-btn")) return;

    dragging = true;
    offsetX = e.clientX - win.offsetLeft;
    offsetY = e.clientY - win.offsetTop;
    win.style.zIndex = zIndex++;
  });

  document.addEventListener("mousemove", e => {
    if (!dragging) return;
    win.style.left = e.clientX - offsetX + "px";
    win.style.top = e.clientY - offsetY + "px";
  });

  document.addEventListener("mouseup", () => {
    dragging = false;
  });
}


/* ================= INTERNET EXPLORER ================= */

function openIEWindow(url) {
  const win = document.createElement("div");
  win.className = "window";
  win.style.width = "640px";
  win.style.height = "480px";
  win.style.top = "80px";
  win.style.left = "120px";
  win.style.zIndex = zIndex++;

  win.innerHTML = `
    <div class="title-bar">
      <span>Internet Explorer</span>
      <div class="close-btn"></div>
    </div>
    <div class="ie-toolbar">
      <button disabled>Back</button>
      <button disabled>Forward</button>
      <div class="ie-url">${url}</div>
    </div>
    <div class="ie-body">
      <iframe src="${url}"></iframe>
    </div>
  `;

  desktop.appendChild(win);
  win.querySelector(".close-btn").onclick = () => win.remove();
  makeDraggable(win);
}

/* ================= WINAMP ================= */

window.openWinamp = function () {
  const playlist = [
    { title: "Antilock - apologies for our absence", src: "audio/1.mp3" },
    { title: "Antilock - next time", src: "audio/2.mp3" },
    { title: "Antilock - killing my idols", src: "audio/3.mp3" }
  ];

  let currentTrack = 0;

  const win = document.createElement("div");
  win.className = "window";
  win.style.width = "320px";
  win.style.height = "160px";
  win.style.top = "150px";
  win.style.left = "200px";
  win.style.zIndex = zIndex++;

  win.innerHTML = `
    <div class="title-bar">
      <span>Winamp</span>
      <div class="close-btn"></div>
    </div>
    <div class="winamp-body">
      <div class="winamp-track"></div>
      <div class="winamp-controls">
        <button id="prev-btn">⏮</button>
        <button id="play-btn">▶</button>
        <button id="pause-btn">⏸</button>
        <button id="stop-btn">⏹</button>
        <button id="next-btn">⏭</button>
      </div>
    </div>
    <audio id="winamp-audio"></audio>
  `;

  desktop.appendChild(win);
  win.querySelector(".close-btn").onclick = () => win.remove();
  makeDraggable(win);
};

/* ================= PHOTOS ================= */

function openPhotosWindow() {
  const win = document.createElement("div");
  win.className = "window";
  win.style.width = "600px";
  win.style.height = "400px";
  win.style.top = "100px";
  win.style.left = "150px";
  win.style.zIndex = zIndex++;

  win.innerHTML = `
    <div class="title-bar">
      <span>My Photos</span>
      <div class="close-btn"></div>
    </div>
    <div class="photos-body">
      ${photos.map(p => `
        <div class="photo-icon" onclick="openPhotoViewer('${p.src}', '${p.name}')">
          <img src="${p.src}">
          <span>${p.name}</span>
        </div>`).join("")}
    </div>
  `;

  desktop.appendChild(win);
  win.querySelector(".close-btn").onclick = () => win.remove();
  makeDraggable(win);
}

function openPhotoViewer(src, name) {
  const win = document.createElement("div");
  win.className = "window";
  win.style.width = "800px";
  win.style.height = "600px";
  win.style.top = "140px";
  win.style.left = "220px";
  win.style.zIndex = zIndex++;

  win.innerHTML = `
    <div class="title-bar">
      <span>${name}</span>
      <div class="close-btn"></div>
    </div>
    <div class="photo-viewer">
      <img src="${src}">
    </div>
  `;

  desktop.appendChild(win);
  win.querySelector(".close-btn").onclick = () => win.remove();
  makeDraggable(win);
}

/* ================= DOOM ================= */

function openDOOM() {
  const win = document.createElement("div");
  win.className = "window";
  win.style.width = "900px";
  win.style.height = "650px";
  win.style.top = "100px";
  win.style.left = "100px";
  win.style.position = "absolute";
  win.style.zIndex = zIndex++;

  win.innerHTML = `
    <div class="title-bar">
      <span>DOOM</span>
      <!-- ❌ NO CLOSE BUTTON -->
    </div>

    <div style="
      display:flex;
      flex-direction:column;
      height:calc(100% - 24px);
      background:black;
    ">
      <!-- EXIT BAR -->
      <div style="
        background:#c0c0c0;
        padding:4px;
        border-bottom:2px solid #808080;
        display:flex;
        justify-content:flex-end;
      ">
        <button id="exit-doom-btn"
          style="
            font-family: 'MS Sans Serif', sans-serif;
            font-size:12px;
            padding:2px 8px;
            cursor:pointer;
          ">
          Exit DOOM
        </button>
      </div>

      <!-- DOOM IFRAME -->
      <iframe
        id="doom-frame"
        src="https://js-dos.com/games/doom2.html"
        style="
          flex:1;
          border:none;
          background:black;
        "
        sandbox="allow-scripts allow-pointer-lock allow-same-origin"
        allowfullscreen>
      </iframe>
    </div>
  `;

  desktop.appendChild(win);
  makeDraggable(win);

  const exitBtn = win.querySelector("#exit-doom-btn");
  const frame = win.querySelector("#doom-frame");

  // 🔥 HARD KILL
  exitBtn.addEventListener("click", () => {
    frame.src = "about:blank"; // extra safety
    frame.remove();            // destroys DOS
    win.remove();              // remove window
  });
}




