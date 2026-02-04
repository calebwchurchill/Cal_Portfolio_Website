const startButton = document.getElementById("start-button");
const startMenu = document.getElementById("start-menu");
const desktop = document.getElementById("desktop");
const photos = [
  { name: "Photo_01.jpg", src: "photos/photo1.jpg" },
  { name: "Photo_02.jpg", src: "photos/photo2.jpg" },
  { name: "Photo_03.jpg", src: "photos/photo3.jpg" },
  { name: "Photo_04.jpg", src: "photos/photo4.jpg" }
];

let zIndex = 10;

/* START MENU */
startButton.onclick = () => {
  startMenu.style.display =
    startMenu.style.display === "block" ? "none" : "block";
};

document.addEventListener("click", e => {
  if (!startButton.contains(e.target) && !startMenu.contains(e.target)) {
    startMenu.style.display = "none";
  }
});

function makeDraggable(win, titleSelector = ".title-bar") {
  // Wait until the element exists
  const titleBar = win.querySelector(titleSelector);
  if (!titleBar) return; // Exit safely if not found

  let dragging = false, offsetX = 0, offsetY = 0;

  titleBar.onmousedown = e => {
    dragging = true;
    offsetX = e.clientX - win.offsetLeft;
    offsetY = e.clientY - win.offsetTop;
    win.style.zIndex = zIndex++;
    e.preventDefault(); // prevent text selection
  };

  document.onmousemove = e => {
    if (!dragging) return;

    const desktopRect = desktop.getBoundingClientRect();
    const winRect = win.getBoundingClientRect();

    let x = e.clientX - offsetX;
    let y = e.clientY - offsetY;

    // Clamp to desktop bounds
    x = Math.max(desktopRect.left,
        Math.min(x, desktopRect.right - winRect.width));
    y = Math.max(desktopRect.top,
        Math.min(y, desktopRect.bottom - winRect.height));

    win.style.left = x - desktopRect.left + "px";
    win.style.top = y - desktopRect.top + "px";
  };

  document.onmouseup = () => dragging = false;
}



/* INTERNET EXPLORER WINDOW */
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
      <iframe
        src="${url}"
        allow="autoplay; encrypted-media"
        allowfullscreen>
      </iframe>
    </div>
  `;

  desktop.appendChild(win);

  win.querySelector(".close-btn").onclick = () => win.remove();

  // Dragging
  const titleBar = win.querySelector(".title-bar");
  let dragging = false, offsetX, offsetY;

  titleBar.onmousedown = e => {
    dragging = true;
    offsetX = e.clientX - win.offsetLeft;
    offsetY = e.clientY - win.offsetTop;
    win.style.zIndex = zIndex++;
  };

  document.onmousemove = e => {
    if (dragging) {
      win.style.left = e.clientX - offsetX + "px";
      win.style.top = e.clientY - offsetY + "px";
    }
  };

  document.onmouseup = () => dragging = false;
}

// Ensure global access
window.openWinamp = function() {
  // Playlist: adjust filenames to match your repo (case-sensitive)
  const playlist = [
    { title: "Antilock - apologies for our absence", src: "audio/1.mp3" },
    { title: "Antilock - next time", src: "audio/2.mp3" },
    { title: "Antilock - killing my idols", src: "audio/3.mp3" }
  ];

  let currentTrack = 0;

  // Create the Winamp window
  const win = document.createElement("div");
  win.className = "window";
  win.style.width = "320px";
  win.style.height = "160px"; // enough for controls + progress
  win.style.top = "150px";
  win.style.left = "200px";
  win.style.zIndex = zIndex++;

  // HTML structure
  win.innerHTML = `
    <div class="title-bar">
      <span>Winamp</span>
      <div class="close-btn"></div>
    </div>
    <div class="winamp-body" style="
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background: #c0c0c0;
        height: calc(100% - 24px);
        padding: 4px;
        box-sizing: border-box;
    ">
      <div class="winamp-track" style="font-size: 12px; text-align:center; margin-bottom:6px;">
        Track: ${playlist[currentTrack].title}
      </div>
      <div class="winamp-controls" style="margin-bottom: 6px;">
        <button id="prev-btn">⏮</button>
        <button id="play-btn">▶</button>
        <button id="pause-btn">⏸</button>
        <button id="stop-btn">⏹</button>
        <button id="next-btn">⏭</button>
      </div>
      <div class="progress-container" style="width: 90%; height: 8px; background:#808080; border:1px solid #404040; cursor:pointer;">
        <div class="progress-bar" style="width:0%; height:100%; background:#000080;"></div>
      </div>
    </div>
    <audio id="winamp-audio" src="${playlist[currentTrack].src}"></audio>
  `;

  desktop.appendChild(win);

  // Close button
  win.querySelector(".close-btn").onclick = () => win.remove();

  // Make draggable
  makeDraggable(win);

  // Audio elements
  const audio = win.querySelector("#winamp-audio");
  const trackLabel = win.querySelector(".winamp-track");
  const progressBar = win.querySelector(".progress-bar");
  const progressContainer = win.querySelector(".progress-container");

  // Track updater
  const updateTrack = () => {
    audio.src = playlist[currentTrack].src;
    trackLabel.textContent = "Track: " + playlist[currentTrack].title;
    audio.play().catch(() => console.log("Autoplay blocked"));
  };

  // Button handlers
  win.querySelector("#play-btn").onclick = () => audio.play();
  win.querySelector("#pause-btn").onclick = () => audio.pause();
  win.querySelector("#stop-btn").onclick = () => {
    audio.pause();
    audio.currentTime = 0;
  };
  win.querySelector("#prev-btn").onclick = () => {
    currentTrack = (currentTrack - 1 + playlist.length) % playlist.length;
    updateTrack();
  };
  win.querySelector("#next-btn").onclick = () => {
    currentTrack = (currentTrack + 1) % playlist.length;
    updateTrack();
  };

  // Auto next track
  audio.onended = () => {
    currentTrack = (currentTrack + 1) % playlist.length;
    updateTrack();
  };

  // Progress bar
  audio.ontimeupdate = () => {
    const percent = (audio.currentTime / audio.duration) * 100 || 0;
    progressBar.style.width = percent + "%";
  };

  // Seek
  progressContainer.onclick = e => {
    const rect = progressContainer.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    audio.currentTime = (clickX / rect.width) * audio.duration;
  };
};





function openResumeWindow() {
  const win = document.createElement("div");
  win.className = "window";

  // Bigger window
  win.style.width = "900px";
  win.style.height = "700px";
  win.style.top = "60px";
  win.style.left = "80px";
  win.style.zIndex = zIndex++;

  // Replace with your PDF path
  const pdfPath = "caleb_churchill_resume.pdf";

  win.innerHTML = `
    <div class="title-bar">
      <span>Resume - Cal Churchill</span>
      <div class="close-btn"></div>
    </div>

    <!-- Fake toolbar -->
    <div class="pdf-toolbar">
      <button onclick="downloadPDF('${pdfPath}')">Download</button>
      
    </div>

    <div class="pdf-body">
      <iframe src="${pdfPath}#toolbar=0&navpanes=0&scrollbar=1" type="application/pdf"></iframe>
    </div>
  `;

  desktop.appendChild(win);

  // Close button
  win.querySelector(".close-btn").onclick = () => win.remove();

  // Make draggable
  makeDraggable(win);
}

// Download function
function downloadPDF(path) {
  const a = document.createElement("a");
  a.href = path;
  a.download = "Cal_Churchill_Resume.pdf";
  document.body.appendChild(a);
  a.click();
  a.remove();
}




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
        <div class="photo-icon" ondblclick="openPhotoViewer('${p.src}', '${p.name}')">
          <img src="${p.src}" />
          <span>${p.name}</span>
        </div>
      `).join("")}
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
      <img src="${src}" />
    </div>
  `;

  desktop.appendChild(win);
  win.querySelector(".close-btn").onclick = () => win.remove();
  makeDraggable(win);
}

function makeDraggable(win) {
  const titleBar = win.querySelector(".title-bar");
  let dragging = false, offsetX, offsetY;

  titleBar.onmousedown = e => {
    dragging = true;
    offsetX = e.clientX - win.offsetLeft;
    offsetY = e.clientY - win.offsetTop;
    win.style.zIndex = zIndex++;
  };

  document.onmousemove = e => {
    if (!dragging) return;

    const desktopRect = desktop.getBoundingClientRect();
    const winRect = win.getBoundingClientRect();

    let x = e.clientX - offsetX;
    let y = e.clientY - offsetY;

    // Clamp to desktop bounds
    x = Math.max(desktopRect.left,
        Math.min(x, desktopRect.right - winRect.width));

    y = Math.max(desktopRect.top,
        Math.min(y, desktopRect.bottom - winRect.height));

    win.style.left = x - desktopRect.left + "px";
    win.style.top = y - desktopRect.top + "px";
  };

  document.onmouseup = () => dragging = false;
}

/* SHUT DOWN */
function shutDown() {
  startMenu.style.display = "none";

  const screen = document.getElementById("shutdown-screen");
  const video = document.getElementById("shutdown-video");
  const credits = document.getElementById("shutdown-credits");
  const unmuteBtn = document.getElementById("unmute-btn");

  unmuteBtn.onclick = () => {
    video.muted = false;
    video.volume = 1;
    unmuteBtn.style.display = "none"; // hide button after unmuting
  };

  screen.style.display = "block";

  video.src = "videos/shutdown.mp4";
  video.currentTime = 0;
  video.muted = true;
  video.play();

  // ⏱️ WAIT 2 SECONDS, THEN SHOW CREDITS
  setTimeout(() => {
    credits.classList.add("show");
    credits.classList.remove("hide");
  }, 2000);

  // ⏱️ HIDE AFTER 5 SECONDS OF BEING VISIBLE
  setTimeout(() => {
    credits.classList.add("hide");
    credits.classList.remove("show");
  }, 7000);

  // Cleanup classes
  setTimeout(() => {
    credits.classList.remove("hide");
  }, 8500);
}

function openEmail() {
  // Opens the user's default mail client
  window.location.href = "mailto:calebwchurchill@gmail.com";
}


function openNotepad() {
  const win = document.createElement("div");
  win.className = "window";
  win.style.width = "520px";
  win.style.height = "400px";
  win.style.top = "120px";
  win.style.left = "180px";
  win.style.zIndex = zIndex++;

  win.innerHTML = `
    <div class="title-bar">
      <span>Notepad - About Me</span>
      <div class="close-btn"></div>
    </div>
    <div class="notepad-menu">
      <span>File</span>
      <span>Edit</span>
      <span>Search</span>
      <span>Help</span>
    </div>
    <div class="notepad-body">
      <div class="about-container">
        <img src="photos/me.jpg" alt="Cal Churchill" class="about-photo" />
        <textarea readonly>
Hi, I'm Cal!

I'm a Senior QA Engineer, photographer and a musician!

At work, I enjoy working on:
- Managing and mentoring direct reports
- Test automation frameworks
- End-to-end and integration testing
- Improving developer confidence in releases

In life, my passions are:
- Taking photos of my friends
- Recording and listening to music
- Travelling and exploring
- Being hella gay


    </textarea>
    </div>
  `;

  desktop.appendChild(win);

    win.querySelector(".close-btn").onclick = () => win.remove();
    makeDraggable(win);
}

function formatHardDrive() {
  startMenu.style.display = "none";

  // Create countdown window
  const countdownWin = document.createElement("div");
  countdownWin.className = "window";
  countdownWin.style.width = "300px";
  countdownWin.style.height = "120px";
  countdownWin.style.top = "150px";
  countdownWin.style.left = "250px";
  countdownWin.style.zIndex = zIndex++;

  countdownWin.innerHTML = `
    <div class="title-bar">
      <span>Formatting C:\\</span>
      <div class="close-btn"></div>
    </div>
    <div class="notepad-body" style="display:flex;align-items:center;justify-content:center;font-family: 'MS Sans Serif';font-size:14px;">
      <span id="countdown-text">Formatting hard drive in 5 seconds...</span>
    </div>
  `;

  desktop.appendChild(countdownWin);
  countdownWin.querySelector(".close-btn").onclick = () => countdownWin.remove();

  let seconds = 5;
  const countdownText = countdownWin.querySelector("#countdown-text");
  const interval = setInterval(() => {
    seconds--;
    if (seconds > 0) {
      countdownText.textContent = `Formatting hard drive in ${seconds} second${seconds > 1 ? 's' : ''}...`;
    } else {
      clearInterval(interval);
      countdownWin.remove();
      showBSOD();
    }
  }, 1000);
}


function openCreditsWindow() {
  const win = document.createElement("div");
  win.className = "window";
  win.style.width = "400px";
  win.style.height = "200px";
  win.style.top = "150px";
  win.style.left = "200px";
  win.style.zIndex = zIndex++;

  win.innerHTML = `
    <div class="title-bar">
      <span>Credits</span>
      <div class="close-btn"></div>
    </div>
    <div class="notepad-body" style="padding: 10px; font-size: 14px; line-height: 1.4;">
      Startup music composed and performed by Cal Churchill<br>
    </div>
  `;

  desktop.appendChild(win);

  // Close button
  win.querySelector(".close-btn").onclick = () => win.remove();

  // Make draggable
  makeDraggable(win);
}


function showBSOD() {
  const bsod = document.createElement("div");
  bsod.id = "bsod-screen";
  bsod.innerHTML = `
    <div class="bsod-text">
      Oh no. Oh NO. You broke the computer!<br><br>
      What on earth were you doing? <br><br>
      Did you open 'Linking_Park_Numb_Live.mp3.exe' again?<br><br>
      Go get your brother and tell him you broke the computer with LimeWire again.<br><br>
      Technical Information:<br>
      *** STOP: 0x0000007B (0xF7A0E524, 0xC0000034, 0x00000000, 0x00000000)<br><br>
      Press any key to restart.
    </div>
  `;
  document.body.appendChild(bsod);

  // On click or key press, remove BSOD and start DOS reboot
  const reboot = () => {
    bsod.remove();
    startDOSReboot();
  };

  bsod.addEventListener("click", reboot);
  document.addEventListener("keydown", reboot, { once: true });
}

let rebooting = false; // tracks if reboot is in progress

function startDOSReboot() {
  // Fullscreen DOS-style window
  
  if (rebooting) return; // ignore if already rebooting
  rebooting = true;
  const dosScreen = document.createElement("div");
  dosScreen.id = "dos-screen";
  dosScreen.innerHTML = `<pre id="dos-text"></pre>`;
  document.body.appendChild(dosScreen);

  const dosText = dosScreen.querySelector("#dos-text");
  const messages = [
    "Starting Cal's Portfolio...",
    "Checking file system...",
    "C:\\>",
    "CHKDSK is verifying files (stage 1 of 3)...",
    "CHKDSK is verifying indexes (stage 2 of 3)...",
    "CHKDSK is verifying security descriptors (stage 3 of 3)...",
    "Cal's Portfolio is starting...",
    "Welcome to Cal's Portfolio!"
  ];

  let line = 0;
  const interval = setInterval(() => {
    if (line < messages.length) {
      dosText.textContent += messages[line] + "\n";
      line++;
    } else {
      clearInterval(interval);
      // Optional: remove DOS screen after a few seconds
      setTimeout(() => dosScreen.remove(), 2000);
      setTimeout(() => {
        const audio = new Audio("reboot.mp3"); // replace with your file path
        audio.play().catch(() => console.log("Audio autoplay blocked"));
        openCreditsWindow();
        rebooting = false;

      }, 1800); //
    }
  }, 1000); // 1 line per second
}

