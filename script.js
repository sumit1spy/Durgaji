// ===============================================
// DURGA UTSAV - HOME PAGE JAVASCRIPT
// ===============================================

// 1. Mobile Navigation
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", function () {
        const isOpen = navLinks.classList.toggle("open");
        menuToggle.setAttribute("aria-expanded", isOpen);
        menuToggle.innerHTML = isOpen ? "&times;" : "☰";
    });

    navLinks.querySelectorAll("a").forEach(function (link) {
        link.addEventListener("click", function () {
            navLinks.classList.remove("open");
            menuToggle.setAttribute("aria-expanded", "false");
            menuToggle.innerHTML = "☰";
        });
    });
}

// 2. Home Page Live Search Filter
const homeSearch = document.getElementById("homeSearch");
const placeCards = document.querySelectorAll(".place-card");
const homeNoResults = document.getElementById("homeNoResults");

if (homeSearch && placeCards.length > 0) {
    homeSearch.addEventListener("input", function () {
        const query = homeSearch.value.trim().toLowerCase();
        let visibleCount = 0;

        placeCards.forEach(function (card) {
            const textContent = (card.innerText || "").toLowerCase();
            const searchData = (card.dataset.search || "").toLowerCase();
            const isMatch = textContent.includes(query) || searchData.includes(query);

            card.style.display = isMatch ? "" : "none";
            if (isMatch) visibleCount++;
        });

        if (homeNoResults) {
            homeNoResults.hidden = visibleCount !== 0;
        }
    });
}

// ---------------------------------------------------
// 3. PERSISTENT FLOATING AUDIO PLAYER (Cross-page)
// ---------------------------------------------------
// const musicToggle = document.getElementById("musicToggle");
// const bgAudio = document.getElementById("bgAudio");

// यहाँ से वॉल्यूम धीमा सेट करें (0.1 से 1.0 के बीच)
// if (bgAudio) {
//     bgAudio.volume = 0.3; // 0.3 का मतलब 30% धीमी आवाज़ (Sweet background volume)
// }
// let synthAudioCtx = null;
// let synthBeatTimer = null;

// Synthesizer fallback if user hasn't added song.mp3 yet
// function playDhaakStroke(time, freq, decay) {
//     if (!synthAudioCtx) return;
//     const osc = synthAudioCtx.createOscillator();
//     const gain = synthAudioCtx.createGain();

//     osc.type = "sine";
//     osc.frequency.setValueAtTime(freq, time);
//     osc.frequency.exponentialRampToValueAtTime(30, time + decay);

//     gain.gain.setValueAtTime(0.6, time);
//     gain.gain.exponentialRampToValueAtTime(0.001, time + decay);

//     osc.connect(gain);
//     gain.connect(synthAudioCtx.destination);

//     osc.start(time);
//     osc.stop(time + decay);
// }

// function startSynthBeats() {
//     const AudioContextClass = window.AudioContext || window.webkitAudioContext;
//     if (!AudioContextClass) return;
//     if (!synthAudioCtx) synthAudioCtx = new AudioContextClass();
//     if (synthAudioCtx.state === "suspended") synthAudioCtx.resume();

//     let step = 0;
//     synthBeatTimer = setInterval(() => {
//         const now = synthAudioCtx.currentTime;
//         if (step % 4 === 0) playDhaakStroke(now, 160, 0.28);
//         else if (step % 4 === 2) playDhaakStroke(now, 220, 0.16);
//         else playDhaakStroke(now, 290, 0.12);
//         step++;
//     }, 280);
// }

// function stopSynthBeats() {
//     if (synthBeatTimer) {
//         clearInterval(synthBeatTimer);
//         synthBeatTimer = null;
//     }
// }

// Check if user has an mp3 file
// function tryPlayAudio() {
//     if (!bgAudio) return;

//     // Check saved timestamp
//     const savedTime = parseFloat(localStorage.getItem("durgaMusicTime") || "0");
//     if (!isNaN(savedTime) && savedTime > 0) {
//         try { bgAudio.currentTime = savedTime; } catch (e) {}
//     }

//     const playPromise = bgAudio.play();
//     if (playPromise !== undefined) {
//         playPromise.then(() => {
//             stopSynthBeats();
//         }).catch(() => {
//             // mp3 file missing or blocked -> fallback to synth beats
//             startSynthBeats();
//         });
//     } else {
//         startSynthBeats();
//     }
// }

// function pauseAudio() {
//     if (bgAudio) {
//         bgAudio.pause();
//     }
//     stopSynthBeats();
// }

// Save timestamp periodically while playing
// setInterval(() => {
//     if (localStorage.getItem("durgaMusicPlaying") === "true" && bgAudio && !bgAudio.paused) {
//         localStorage.setItem("durgaMusicTime", bgAudio.currentTime.toString());
//     }
// }, 600);

// Toggle handler
// if (musicToggle) {
//     musicToggle.addEventListener("click", () => {
//         const isCurrentlyPlaying = musicToggle.classList.contains("playing");

//         if (isCurrentlyPlaying) {
//             musicToggle.classList.remove("playing");
//             musicToggle.setAttribute("title", "Play Festive Song");
//             localStorage.setItem("durgaMusicPlaying", "false");
//             pauseAudio();
//         } else {
//             musicToggle.classList.add("playing");
//             musicToggle.setAttribute("title", "Pause Festive Song");
//             localStorage.setItem("durgaMusicPlaying", "true");
//             tryPlayAudio();
//         }
    // });

    // Auto-resume if user left music ON from another page
    // if (localStorage.getItem("durgaMusicPlaying") === "true") {
    //     musicToggle.classList.add("playing");
    //     musicToggle.setAttribute("title", "Pause Festive Song");
    //     tryPlayAudio();
    // }
// }