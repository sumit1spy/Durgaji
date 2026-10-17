// ===============================================
// DURGA UTSAV - INTERACTIVE SHOWCASE GALLERY JS
// ===============================================

// Mobile Navigation
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
        const isOpen = navLinks.classList.toggle("open");
        menuToggle.setAttribute("aria-expanded", isOpen);
        menuToggle.innerHTML = isOpen ? "&times;" : "☰";
    });

    navLinks.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
            navLinks.classList.remove("open");
            menuToggle.setAttribute("aria-expanded", "false");
            menuToggle.innerHTML = "☰";
        });
    });
}

// ---------------------------------------------------
// 1. ANIMATED FLOATING GOLDEN PARTICLES IN BACKGROUND
// ---------------------------------------------------
const particlesContainer = document.getElementById("particlesContainer");
if (particlesContainer) {
    const particleCount = 28;
    for (let i = 0; i < particleCount; i++) {
        const p = document.createElement("div");
        p.className = "particle";
        const size = Math.random() * 8 + 4; // 4px to 12px
        p.style.width = size + "px";
        p.style.height = size + "px";
        p.style.left = Math.random() * 100 + "%";
        p.style.animationDuration = Math.random() * 14 + 10 + "s";
        p.style.animationDelay = Math.random() * 10 + "s";
        particlesContainer.appendChild(p);
    }
}

// ---------------------------------------------------
// 2. SPOTLIGHT SHOWCASE & HOVER INTERACTION
// ---------------------------------------------------
const spotlightImg = document.getElementById("spotlightImg");
const spotlightTag = document.getElementById("spotlightTag");
const spotlightLoc = document.getElementById("spotlightLoc");
const spotlightTitle = document.getElementById("spotlightTitle");
const spotlightMap = document.getElementById("spotlightMap");
const spotlightProgress = document.getElementById("spotlightProgress");

const streamItems = Array.from(document.querySelectorAll(".stream-item"));

// Collect photo pool
const photoPool = streamItems.map((item) => ({
    img: item.dataset.img,
    title: item.dataset.title,
    location: item.dataset.location,
    category: item.dataset.category || "FESTIVAL",
    el: item
}));

let currentIndex = 0;
let autoTimer = null;
let isHovered = false;
const SLIDE_INTERVAL = 3800; // 3.8 seconds

function updateSpotlight(data, animate = true) {
    if (!spotlightImg) return;

    if (animate) {
        spotlightImg.classList.add("fade-out");
        setTimeout(() => {
            applyData(data);
            spotlightImg.classList.remove("fade-out");
        }, 180);
    } else {
        applyData(data);
    }

    // Highlight active thumbnail
    streamItems.forEach((i) => i.classList.remove("active-item"));
    if (data.el) {
        data.el.classList.add("active-item");
    }
}

function applyData(data) {
    spotlightImg.src = data.img;
    spotlightTag.textContent = data.category;
    spotlightLoc.textContent = data.location;
    spotlightTitle.textContent = data.title;
    if (spotlightMap) {
        spotlightMap.href =
            "https://www.google.com/maps/search/?api=1&query=" +
            encodeURIComponent(data.location);
    }
}

// Progress bar animation
function resetProgressBar() {
    if (!spotlightProgress) return;
    spotlightProgress.style.transition = "none";
    spotlightProgress.style.width = "0%";
    setTimeout(() => {
        if (!isHovered) {
            spotlightProgress.style.transition = "width " + SLIDE_INTERVAL + "ms linear";
            spotlightProgress.style.width = "100%";
        }
    }, 40);
}

// Auto slideshow rotation
function startAutoSlide() {
    stopAutoSlide();
    resetProgressBar();
    autoTimer = setInterval(() => {
        if (!isHovered && photoPool.length > 0) {
            currentIndex = (currentIndex + 1) % photoPool.length;
            updateSpotlight(photoPool[currentIndex]);
            resetProgressBar();
        }
    }, SLIDE_INTERVAL);
}

function stopAutoSlide() {
    if (autoTimer) {
        clearInterval(autoTimer);
        autoTimer = null;
    }
    if (spotlightProgress) {
        spotlightProgress.style.transition = "none";
        spotlightProgress.style.width = "0%";
    }
}

// Hover on any stream item
streamItems.forEach((item, index) => {
    item.addEventListener("mouseenter", () => {
        isHovered = true;
        stopAutoSlide();
        const data = {
            img: item.dataset.img,
            title: item.dataset.title,
            location: item.dataset.location,
            category: item.dataset.category || "FESTIVAL",
            el: item
        };
        updateSpotlight(data, true);
    });

    item.addEventListener("mouseleave", () => {
        isHovered = false;
        startAutoSlide();
    });

    item.addEventListener("click", () => {
        currentIndex = index % photoPool.length;
        openLightbox(photoPool[currentIndex]);
    });
});

// Initialize first photo & start
if (photoPool.length > 0) {
    updateSpotlight(photoPool[0], false);
    startAutoSlide();
}

// ---------------------------------------------------
// 3. CATEGORY PILL FILTERS
// ---------------------------------------------------
const pills = document.querySelectorAll(".pill");
pills.forEach((pill) => {
    pill.addEventListener("click", () => {
        pills.forEach((p) => p.classList.remove("active"));
        pill.classList.add("active");

        const category = pill.dataset.category.toLowerCase();

        streamItems.forEach((item) => {
            const itemCat = (item.dataset.category || "").toLowerCase();
            const itemLoc = (item.dataset.location || "").toLowerCase();

            if (
                category === "all" ||
                itemCat.includes(category) ||
                itemLoc.includes(category)
            ) {
                item.style.opacity = "1";
                item.style.filter = "none";
            } else {
                item.style.opacity = "0.28";
                item.style.filter = "grayscale(70%)";
            }
        });
    });
});

// ---------------------------------------------------
// 4. FULLSCREEN LIGHTBOX MODAL
// ---------------------------------------------------
const lightboxModal = document.getElementById("lightboxModal");
const lightboxBackdrop = document.getElementById("lightboxBackdrop");
const lightboxClose = document.getElementById("lightboxClose");
const lightboxPrev = document.getElementById("lightboxPrev");
const lightboxNext = document.getElementById("lightboxNext");
const lightboxImg = document.getElementById("lightboxImg");
const lightboxTitle = document.getElementById("lightboxTitle");
const lightboxLoc = document.getElementById("lightboxLoc");
const expandBtn = document.getElementById("expandBtn");

function openLightbox(data) {
    if (!lightboxModal) return;
    lightboxImg.src = data.img;
    lightboxTitle.textContent = data.title;
    lightboxLoc.textContent = data.location;
    lightboxModal.removeAttribute("hidden");
    document.body.style.overflow = "hidden";
}

function closeLightbox() {
    if (!lightboxModal) return;
    lightboxModal.setAttribute("hidden", "");
    document.body.style.overflow = "";
}

if (expandBtn) {
    expandBtn.addEventListener("click", () => {
        if (photoPool.length > 0) {
            openLightbox(photoPool[currentIndex]);
        }
    });
}

if (lightboxClose) lightboxClose.addEventListener("click", closeLightbox);
if (lightboxBackdrop) lightboxBackdrop.addEventListener("click", closeLightbox);

if (lightboxNext) {
    lightboxNext.addEventListener("click", () => {
        currentIndex = (currentIndex + 1) % photoPool.length;
        openLightbox(photoPool[currentIndex]);
    });
}

if (lightboxPrev) {
    lightboxPrev.addEventListener("click", () => {
        currentIndex = (currentIndex - 1 + photoPool.length) % photoPool.length;
        openLightbox(photoPool[currentIndex]);
    });
}

window.addEventListener("keydown", (e) => {
    if (lightboxModal && !lightboxModal.hasAttribute("hidden")) {
        if (e.key === "Escape") closeLightbox();
        if (e.key === "ArrowRight") lightboxNext?.click();
        if (e.key === "ArrowLeft") lightboxPrev?.click();
    }
});

// ---------------------------------------------------
// 5. FLOATING FESTIVE DHAAK BEAT AUDIO SYNTHESIZER
// ---------------------------------------------------
// const musicToggle = document.getElementById("musicToggle");
// let audioCtx = null;
// let isPlaying = false;
// let beatTimer = null;

// function playDhaakStroke(time, freq, decay) {
//     if (!audioCtx) return;
//     const osc = audioCtx.createOscillator();
//     const gain = audioCtx.createGain();

//     osc.type = "sine";
//     osc.frequency.setValueAtTime(freq, time);
//     osc.frequency.exponentialRampToValueAtTime(30, time + decay);

//     gain.gain.setValueAtTime(0.6, time);
//     gain.gain.exponentialRampToValueAtTime(0.001, time + decay);

//     osc.connect(gain);
//     gain.connect(audioCtx.destination);

//     osc.start(time);
//     osc.stop(time + decay);
// }

// function startFestiveBeats() {
//     const AudioContextClass = window.AudioContext || window.webkitAudioContext;
//     if (!AudioContextClass) return;
//     if (!audioCtx) audioCtx = new AudioContextClass();

//     if (audioCtx.state === "suspended") {
//         audioCtx.resume();
//     }

//     let step = 0;
    // Rhythmic Dhaak Pattern: Dha-Ting-Tin-Dha
//     beatTimer = setInterval(() => {
//         const now = audioCtx.currentTime;
//         if (step % 4 === 0) {
//             playDhaakStroke(now, 160, 0.28);
//         } else if (step % 4 === 2) {
//             playDhaakStroke(now, 220, 0.16);
//         } else {
//             playDhaakStroke(now, 290, 0.12);
//         }
//         step++;
//     }, 280);
// }

// function stopFestiveBeats() {
//     if (beatTimer) {
//         clearInterval(beatTimer);
//         beatTimer = null;
//     }
// }

// if (musicToggle) {
//     musicToggle.addEventListener("click", () => {
//         isPlaying = !isPlaying;
//         if (isPlaying) {
//             musicToggle.classList.add("playing");
//             musicToggle.setAttribute("title", "Pause Festive Dhaak");
//             startFestiveBeats();
//         } else {
//             musicToggle.classList.remove("playing");
//             musicToggle.setAttribute("title", "Play Festive Dhaak");
//             stopFestiveBeats();
//         }
//     });
// }