// ===============================================
// DURGA UTSAV - CROSS-PAGE CONTINUOUS AUDIO PLAYER
// ===============================================

document.addEventListener("DOMContentLoaded", () => {
    const musicToggle = document.getElementById("musicToggle");
    const bgAudio = document.getElementById("bgAudio");

    if (!musicToggle || !bgAudio) return;

    // 1. Initial Volume: Soft & gentle (30%)
    bgAudio.volume = 0.3;

    let synthAudioCtx = null;
    let synthBeatTimer = null;

    // Web Audio API Synthesizer Fallback (plays festive Dhaak beats if song.mp3 is missing)
    function playDhaakStroke(time, freq, decay) {
        if (!synthAudioCtx) return;
        try {
            const osc = synthAudioCtx.createOscillator();
            const gain = synthAudioCtx.createGain();
            osc.type = "sine";
            osc.frequency.setValueAtTime(freq, time);
            osc.frequency.exponentialRampToValueAtTime(30, time + decay);
            gain.gain.setValueAtTime(0.18, time);
            gain.gain.exponentialRampToValueAtTime(0.001, time + decay);
            osc.connect(gain);
            gain.connect(synthAudioCtx.destination);
            osc.start(time);
            osc.stop(time + decay);
        } catch (e) {}
    }

    function startSynthBeats() {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (!AudioContextClass) return;
        if (!synthAudioCtx) synthAudioCtx = new AudioContextClass();
        if (synthAudioCtx.state === "suspended") synthAudioCtx.resume();

        let step = 0;
        if (synthBeatTimer) clearInterval(synthBeatTimer);
        synthBeatTimer = setInterval(() => {
            const now = synthAudioCtx.currentTime;
            if (step % 4 === 0) playDhaakStroke(now, 160, 0.28);
            else if (step % 4 === 2) playDhaakStroke(now, 220, 0.16);
            else playDhaakStroke(now, 290, 0.12);
            step++;
        }, 280);
    }

    function stopSynthBeats() {
        if (synthBeatTimer) {
            clearInterval(synthBeatTimer);
            synthBeatTimer = null;
        }
    }

    function playAudio() {
        // Resume from saved timestamp
        const savedTime = parseFloat(localStorage.getItem("durgaMusicTime") || "0");
        if (!isNaN(savedTime) && savedTime > 0) {
            try { bgAudio.currentTime = savedTime; } catch (e) {}
        }

        const playPromise = bgAudio.play();
        if (playPromise !== undefined) {
            playPromise.then(() => {
                stopSynthBeats();
            }).catch(() => {
                // Fallback to synth if mp3 is missing or blocked
                startSynthBeats();
            });
        } else {
            startSynthBeats();
        }
    }

    function pauseAudio() {
        try { bgAudio.pause(); } catch (e) {}
        stopSynthBeats();
    }

    // Save timestamp continuously while playing
    setInterval(() => {
        if (localStorage.getItem("durgaMusicPlaying") === "true" && bgAudio && !bgAudio.paused) {
            localStorage.setItem("durgaMusicTime", bgAudio.currentTime.toString());
        }
    }, 300);

    window.addEventListener("beforeunload", () => {
        if (bgAudio && !bgAudio.paused) {
            localStorage.setItem("durgaMusicTime", bgAudio.currentTime.toString());
        }
    });

    // Toggle button click handler
    musicToggle.addEventListener("click", () => {
        const isPlaying = musicToggle.classList.contains("playing");

        if (isPlaying) {
            // STOP / PAUSE MUSIC
            musicToggle.classList.remove("playing");
            musicToggle.setAttribute("title", "Play Festive Song");
            localStorage.setItem("durgaMusicPlaying", "false");
            pauseAudio();
        } else {
            // START / RESUME MUSIC
            musicToggle.classList.add("playing");
            musicToggle.setAttribute("title", "Pause Festive Song");
            localStorage.setItem("durgaMusicPlaying", "true");
            playAudio();
        }
    });

    // Check if music was ON from previous page
    if (localStorage.getItem("durgaMusicPlaying") === "true") {
        musicToggle.classList.add("playing");
        musicToggle.setAttribute("title", "Pause Festive Song");
        playAudio();

        // Browser policy fallback: first tap anywhere resumes audio if needed
        const resumeOnFirstTouch = () => {
            if (localStorage.getItem("durgaMusicPlaying") === "true") {
                playAudio();
            }
            document.removeEventListener("click", resumeOnFirstTouch);
            document.removeEventListener("touchstart", resumeOnFirstTouch);
        };
        document.addEventListener("click", resumeOnFirstTouch, { once: true });
        document.addEventListener("touchstart", resumeOnFirstTouch, { once: true });
    }
});
// Scroll to Top Floating Button Handler
    const backToTop = document.getElementById("backToTop");
    if (backToTop) {
        window.addEventListener("scroll", () => {
            if (window.scrollY > 300) {
                backToTop.classList.add("show");
            } else {
                backToTop.classList.remove("show");
            }
        });

        backToTop.addEventListener("click", () => {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        });
    }