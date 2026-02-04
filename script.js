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

