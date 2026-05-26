// ================= AUDIO SYNTHESIZER =================
let audioCtx = null;
let isMuted = false;

function initAudio() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
}

// Cute synth-pop chime sounds
const sounds = {
    evade() {
        if (isMuted) return;
        initAudio();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(300, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(600, audioCtx.currentTime + 0.08);
        gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.08);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.08);
    },
    
    yes() {
        if (isMuted) return;
        initAudio();
        const now = audioCtx.currentTime;
        // Sweeping sparkling C-major chord arpeggio
        const chord = [523.25, 659.25, 783.99, 1046.50, 1318.51]; // C5, E5, G5, C6, E6
        chord.forEach((freq, index) => {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now + index * 0.07);
            gain.gain.setValueAtTime(0.08, now + index * 0.07);
            gain.gain.exponentialRampToValueAtTime(0.001, now + index * 0.07 + 0.45);
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start(now + index * 0.07);
            osc.stop(now + index * 0.07 + 0.5);
        });
    },

    openEnvelope() {
        if (isMuted) return;
        initAudio();
        const now = audioCtx.currentTime;
        // Airy sweep representing a letter sliding open
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(400, now);
        osc.frequency.exponentialRampToValueAtTime(1000, now + 0.35);
        gain.gain.setValueAtTime(0.06, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.35);
    },

    hug() {
        if (isMuted) return;
        initAudio();
        const now = audioCtx.currentTime;
        // Warm hum & chime
        const oscLow = audioCtx.createOscillator();
        const gainLow = audioCtx.createGain();
        oscLow.type = 'triangle';
        oscLow.frequency.setValueAtTime(261.63, now); // C4
        oscLow.frequency.exponentialRampToValueAtTime(329.63, now + 0.4); // E4
        gainLow.gain.setValueAtTime(0.18, now);
        gainLow.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
        oscLow.connect(gainLow);
        gainLow.connect(audioCtx.destination);
        oscLow.start(now);
        oscLow.stop(now + 0.4);

        const oscChime = audioCtx.createOscillator();
        const gainChime = audioCtx.createGain();
        oscChime.type = 'sine';
        oscChime.frequency.setValueAtTime(880, now + 0.1);
        gainChime.gain.setValueAtTime(0.08, now + 0.1);
        gainChime.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
        oscChime.connect(gainChime);
        gainChime.connect(audioCtx.destination);
        oscChime.start(now + 0.1);
        oscChime.stop(now + 0.4);
    },

    beat() {
        if (isMuted) return;
        initAudio();
        const now = audioCtx.currentTime;
        const playPulse = (delay) => {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(55, now + delay);
            osc.frequency.linearRampToValueAtTime(10, now + delay + 0.15);
            gain.gain.setValueAtTime(0.4, now + delay);
            gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.15);
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start(now + delay);
            osc.stop(now + delay + 0.18);
        };
        playPulse(0);
        playPulse(0.14); // Double-thud heart rhythm
    },

    kiss() {
        if (isMuted) return;
        initAudio();
        const now = audioCtx.currentTime;
        
        // Smack noise
        const bufferSize = audioCtx.sampleRate * 0.05; // 50ms buffer
        const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }
        const noise = audioCtx.createBufferSource();
        noise.buffer = buffer;

        const filter = audioCtx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(1200, now);
        filter.frequency.exponentialRampToValueAtTime(3200, now + 0.04);
        
        const gainNoise = audioCtx.createGain();
        gainNoise.gain.setValueAtTime(0.08, now);
        gainNoise.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

        noise.connect(filter);
        filter.connect(gainNoise);
        gainNoise.connect(audioCtx.destination);
        noise.start(now);
        noise.stop(now + 0.05);

        // Sweet popup pitch whistle
        const osc = audioCtx.createOscillator();
        const gainOsc = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(700, now);
        osc.frequency.exponentialRampToValueAtTime(1600, now + 0.07);
        gainOsc.gain.setValueAtTime(0.06, now);
        gainOsc.gain.exponentialRampToValueAtTime(0.001, now + 0.07);
        osc.connect(gainOsc);
        gainOsc.connect(audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.07);
    }
};

// Toggle audio control
const soundToggle = document.getElementById('sound-toggle');
soundToggle.addEventListener('click', () => {
    isMuted = !isMuted;
    soundToggle.classList.toggle('muted', isMuted);
    if (!isMuted) {
        initAudio();
        sounds.evade(); // Cute chime to confirm unmute
    }
});


// ================= PARTICLE PHYSICS ENGINE =================

// Helper to draw a heart
function drawHeart(ctx, x, y, size, color, alpha = 1) {
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.beginPath();
    const topCurveHeight = size * 0.3;
    ctx.moveTo(x, y + topCurveHeight);
    ctx.bezierCurveTo(
        x - size / 1.8, y - topCurveHeight / 1.5,
        x - size / 1.8, y + (size + topCurveHeight) / 2,
        x, y + size
    );
    ctx.bezierCurveTo(
        x + size / 1.8, y + (size + topCurveHeight) / 2,
        x + size / 1.8, y - topCurveHeight / 1.5,
        x, y + topCurveHeight
    );
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
    ctx.restore();
}

// Helper to draw a 4-point sparkle star
function drawSparkle(ctx, cx, cy, size, color, alpha = 1) {
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.beginPath();
    ctx.moveTo(cx, cy - size);
    ctx.quadraticCurveTo(cx, cy, cx + size, cy);
    ctx.quadraticCurveTo(cx, cy, cx, cy + size);
    ctx.quadraticCurveTo(cx, cy, cx - size, cy);
    ctx.quadraticCurveTo(cx, cy, cx, cy - size);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
    ctx.restore();
}


// --- 1. Ambient Background Canvas Particles ---
const ambientCanvas = document.getElementById('ambient-canvas');
const ambientCtx = ambientCanvas.getContext('2d');
let ambientParticles = [];

function resizeAmbientCanvas() {
    ambientCanvas.width = window.innerWidth;
    ambientCanvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeAmbientCanvas);
resizeAmbientCanvas();

class AmbientParticle {
    constructor() {
        this.reset();
        this.y = Math.random() * ambientCanvas.height; // Distribute on load
    }
    reset() {
        this.x = Math.random() * ambientCanvas.width;
        this.y = ambientCanvas.height + 20;
        this.size = 6 + Math.random() * 12;
        this.speedY = 0.4 + Math.random() * 0.8;
        this.driftX = 0;
        this.driftSpeed = 0.005 + Math.random() * 0.01;
        this.color = `hsl(${340 + Math.random() * 30}, 100%, ${80 + Math.random() * 15}%)`;
        this.type = Math.random() > 0.4 ? 'heart' : 'sparkle';
        this.alpha = 0.3 + Math.random() * 0.4;
    }
    update() {
        this.y -= this.speedY;
        this.driftX += this.driftSpeed;
        this.x += Math.sin(this.driftX) * 0.3;
        
        if (this.y < -20) {
            this.reset();
        }
    }
    draw() {
        if (this.type === 'heart') {
            drawHeart(ambientCtx, this.x, this.y, this.size, this.color, this.alpha);
        } else {
            drawSparkle(ambientCtx, this.x, this.y, this.size, this.color, this.alpha);
        }
    }
}

// Instantiate ambient particles
for (let i = 0; i < 28; i++) {
    ambientParticles.push(new AmbientParticle());
}

// Particle bursts spawned globally
let globalBursts = [];

class GlobalBurstParticle {
    constructor(x, y, dx, dy, size, color, type) {
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
        this.size = size;
        this.color = color;
        this.type = type; // 'heart' | 'sparkle'
        this.alpha = 1;
        this.gravity = 0.05;
        this.decay = 0.015 + Math.random() * 0.015;
    }
    update() {
        this.x += this.dx;
        this.y += this.dy;
        this.dy += this.gravity;
        this.alpha -= this.decay;
    }
    draw() {
        if (this.type === 'heart') {
            drawHeart(ambientCtx, this.x, this.y, this.size, this.color, this.alpha);
        } else {
            drawSparkle(ambientCtx, this.x, this.y, this.size, this.color, this.alpha);
        }
    }
}

function spawnGlobalBurst(x, y, count = 20) {
    for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const force = 2 + Math.random() * 5;
        const dx = Math.cos(angle) * force;
        const dy = Math.sin(angle) * force - 1; // Slight upward bias
        const size = 8 + Math.random() * 10;
        const color = `hsl(${340 + Math.random() * 30}, 100%, ${60 + Math.random() * 20}%)`;
        const type = Math.random() > 0.4 ? 'heart' : 'sparkle';
        globalBursts.push(new GlobalBurstParticle(x, y, dx, dy, size, color, type));
    }
}

// Global Animation Tick
function tick() {
    ambientCtx.clearRect(0, 0, ambientCanvas.width, ambientCanvas.height);
    
    // Ambient
    ambientParticles.forEach(p => {
        p.update();
        p.draw();
    });

    // Global Bursts
    globalBursts.forEach((p, idx) => {
        p.update();
        if (p.alpha <= 0) {
            globalBursts.splice(idx, 1);
        } else {
            p.draw();
        }
    });

    requestAnimationFrame(tick);
}
tick();


// ================= SCREEN 1: DO YOU LOVE ME MECHANICS =================

const yesBtn = document.getElementById('yes-btn');
const noBtn = document.getElementById('no-btn');
const questionScreen = document.getElementById('question-screen');
const envelopeScreen = document.getElementById('envelope-screen');
let yesScale = 1.0;

function evadeNoButton(e) {
    if (e) {
        e.preventDefault();
    }
    sounds.evade();
    
    // Expand the Yes Button
    yesScale += 0.15;
    yesBtn.style.transform = `scale(${yesScale})`;
    
    // Position parameters
    const btnRect = noBtn.getBoundingClientRect();
    const btnWidth = btnRect.width;
    const btnHeight = btnRect.height;
    
    // Switch to fixed position on first escape so it floats on viewport
    if (noBtn.style.position !== 'fixed') {
        const rect = noBtn.getBoundingClientRect();
        noBtn.style.left = `${rect.left}px`;
        noBtn.style.top = `${rect.top}px`;
        noBtn.style.position = 'fixed';
        noBtn.style.margin = '0';
    }
    
    const margin = 40;
    const maxX = window.innerWidth - btnWidth - margin;
    const maxY = window.innerHeight - btnHeight - margin;
    
    let newX = margin + Math.random() * (maxX - margin);
    let newY = margin + Math.random() * (maxY - margin);

    // Keep it somewhat away from the center/card on early attempts if possible
    noBtn.style.left = `${newX}px`;
    noBtn.style.top = `${newY}px`;
}

// Evasion Events
noBtn.addEventListener('mouseenter', evadeNoButton);
noBtn.addEventListener('touchstart', evadeNoButton);

// Yes Button Click Transition
yesBtn.addEventListener('click', (e) => {
    sounds.yes();
    
    // Visual explosion at button coordinates
    const rect = yesBtn.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    spawnGlobalBurst(centerX, centerY, 40);

    // Fade out and enter Screen 2 (Envelope)
    questionScreen.classList.add('fade-out');
    setTimeout(() => {
        questionScreen.classList.remove('active', 'fade-out');
        envelopeScreen.classList.add('active', 'bubble-in');
    }, 500);
});


// ================= SCREEN 2: INTERACTIVE ENVELOPE =================

const envelope = document.getElementById('love-envelope');
const bookScreen = document.getElementById('book-screen');

envelope.addEventListener('click', () => {
    if (envelope.classList.contains('open')) return;
    
    envelope.classList.add('open');
    sounds.openEnvelope();
    
    // Spawn subtle sparkles near the seal opening
    const seal = document.getElementById('envelope-seal');
    const rect = seal.getBoundingClientRect();
    spawnGlobalBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 15);

    // Transition to Screen 3 (The Book) after envelope opens fully
    setTimeout(() => {
        envelopeScreen.classList.add('fade-out');
        setTimeout(() => {
            envelopeScreen.classList.remove('active', 'fade-out');
            bookScreen.classList.add('active', 'bubble-in');
            // Trigger first slide canvas resizing
            initActiveSlideAnim();
        }, 500);
    }, 1800);
});


// ================= SCREEN 3: LOVE BOOK SLIDES & CANVAS EFFECTS =================

let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.progress-dot');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');

function updateSlideView() {
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
    
    // Nav Button States
    prevBtn.disabled = currentSlide === 0;
    nextBtn.disabled = currentSlide === slides.length - 1;
    
    // Stop all active canvas animation loops and start the new one
    stopCanvasLoops();
    initActiveSlideAnim();
}

nextBtn.addEventListener('click', () => {
    if (currentSlide < slides.length - 1) {
        currentSlide++;
        sounds.evade();
        updateSlideView();
    }
});

prevBtn.addEventListener('click', () => {
    if (currentSlide > 0) {
        currentSlide--;
        sounds.evade();
        updateSlideView();
    }
});


// --- Slide Canvas Variables & Loop States ---
let heartLoopId = null;
let kissLoopId = null;

function stopCanvasLoops() {
    if (heartLoopId) cancelAnimationFrame(heartLoopId);
    if (kissLoopId) cancelAnimationFrame(kissLoopId);
    heartLoopId = null;
    kissLoopId = null;
}

// Trigger animations depending on which slide is shown
function initActiveSlideAnim() {
    if (currentSlide === 0) {
        // Hug bear slide
        const bearSvg = document.querySelector('.hug-bear-svg');
        bearSvg.classList.remove('hugging'); // Reset animation
    } else if (currentSlide === 1) {
        // Heart Symphony Slide
        initHeartSymphony();
    } else if (currentSlide === 2) {
        // Kiss Blaster Slide
        initKissBlaster();
    }
}


// --- SLIDE 1: VIRTUAL HUG BEAR ANIMATION ---
const hugBearSvg = document.querySelector('.hug-bear-svg');
const rippleOverlay = document.getElementById('hug-ripple-overlay');

hugBearSvg.addEventListener('click', () => {
    if (hugBearSvg.classList.contains('hugging')) return;
    
    hugBearSvg.classList.add('hugging');
    sounds.hug();
    
    // Trigger Ripple Overlay fading and ring burst
    rippleOverlay.classList.add('show');
    
    // Spawn heart particles around the bear body
    const rect = hugBearSvg.getBoundingClientRect();
    const bx = rect.left + rect.width / 2;
    const by = rect.top + rect.height / 2;
    setTimeout(() => {
        spawnGlobalBurst(bx, by, 25);
    }, 450); // Sync with bear arms closing
    
    setTimeout(() => {
        hugBearSvg.classList.remove('hugging');
        rippleOverlay.classList.remove('show');
    }, 1200);
});


// --- SLIDE 2: HEART SYMPHONY PARTICLES ---
const heartSvg = document.getElementById('symphony-heart-svg');
const heartCanvas = document.getElementById('heart-symphony-canvas');
let heartCtx = null;
let wordParticles = [];

// Spell array containing letters
const nameLetters = ['D', 'A', 'N', 'I', 'R', 'U', '❤️', 'S', 'A', 'N', 'D', 'E', 'E', 'R', 'A'];

class LetterParticle {
    constructor(x, y, text) {
        this.x = x;
        this.y = y;
        this.text = text;
        const angle = -Math.PI/2 + (Math.random() - 0.5) * 1.5; // Upward spray arc
        const speed = 1.5 + Math.random() * 2;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        this.size = 14 + Math.random() * 8;
        this.alpha = 1;
        this.rotation = (Math.random() - 0.5) * 0.4;
        this.spin = (Math.random() - 0.5) * 0.05;
        this.color = this.text === '❤️' ? '#ff3b61' : `hsl(${340 + Math.random()*25}, 100%, 65%)`;
    }
    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.rotation += this.spin;
        this.vy -= 0.02; // Extra upward float lift
        this.alpha -= 0.015;
    }
    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.font = `bold ${this.size}px ${this.text === '❤️' ? 'sans-serif' : 'Outfit'}`;
        ctx.fillStyle = this.color;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.text, 0, 0);
        ctx.restore();
    }
}

function initHeartSymphony() {
    heartCanvas.width = heartCanvas.parentElement.clientWidth;
    heartCanvas.height = heartCanvas.parentElement.clientHeight;
    heartCtx = heartCanvas.getContext('2d');
    wordParticles = [];
    
    function loop() {
        heartCtx.clearRect(0, 0, heartCanvas.width, heartCanvas.height);
        
        wordParticles.forEach((p, idx) => {
            p.update();
            if (p.alpha <= 0) {
                wordParticles.splice(idx, 1);
            } else {
                p.draw(heartCtx);
            }
        });
        
        heartLoopId = requestAnimationFrame(loop);
    }
    loop();
}

heartSvg.parentElement.addEventListener('click', () => {
    sounds.beat();
    
    // Visual heart beat fast speed trigger
    heartSvg.classList.add('fast');
    setTimeout(() => {
        heartSvg.classList.remove('fast');
    }, 500);
    
    // Spawn letters
    const cx = heartCanvas.width / 2;
    const cy = heartCanvas.height / 2;
    
    // Add letters with sequential offsets to scatter nicely
    nameLetters.forEach((char, index) => {
        setTimeout(() => {
            wordParticles.push(new LetterParticle(cx, cy, char));
        }, index * 40);
    });
});


// --- SLIDE 3: KISS BLASTER ---
const kissCanvas = document.getElementById('kiss-blaster-canvas');
let kissCtx = null;
let kissParticles = [];

class KissParticle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.type = Math.random() > 0.4 ? 'lips' : 'sparkle';
        const angle = Math.random() * Math.PI * 2;
        const force = 1 + Math.random() * 3;
        this.vx = Math.cos(angle) * force;
        this.vy = Math.sin(angle) * force - 0.5; // Soft gravity lift
        this.size = this.type === 'lips' ? 22 + Math.random()*8 : 8 + Math.random()*6;
        this.rotation = Math.random() * Math.PI;
        this.spin = (Math.random() - 0.5) * 0.08;
        this.alpha = 1;
        this.decay = 0.01 + Math.random()*0.015;
    }
    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy -= 0.01; // float up slightly
        this.rotation += this.spin;
        this.alpha -= this.decay;
    }
    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        if (this.type === 'lips') {
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation);
            ctx.font = `${this.size}px sans-serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('💋', 0, 0);
        } else {
            drawSparkle(ctx, this.x, this.y, this.size, '#ffb830', this.alpha);
        }
        ctx.restore();
    }
}

function initKissBlaster() {
    kissCanvas.width = kissCanvas.parentElement.clientWidth;
    kissCanvas.height = kissCanvas.parentElement.clientHeight;
    kissCtx = kissCanvas.getContext('2d');
    kissParticles = [];

    function loop() {
        kissCtx.clearRect(0, 0, kissCanvas.width, kissCanvas.height);
        
        kissParticles.forEach((p, idx) => {
            p.update();
            if (p.alpha <= 0) {
                kissParticles.splice(idx, 1);
            } else {
                p.draw(kissCtx);
            }
        });
        
        kissLoopId = requestAnimationFrame(loop);
    }
    loop();
}

kissCanvas.addEventListener('click', (e) => {
    sounds.kiss();
    const rect = kissCanvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    
    // Spawn kisses and stars
    for (let i = 0; i < 8; i++) {
        kissParticles.push(new KissParticle(clickX, clickY));
    }
});


// ================= REPLAY LOGIC =================

const replayBtn = document.getElementById('replay-btn');
replayBtn.addEventListener('click', () => {
    sounds.yes();
    
    // Reset positions, states, indexes
    yesScale = 1.0;
    yesBtn.style.transform = `scale(1.0)`;
    
    // Reset No Button position & style
    noBtn.style.position = '';
    noBtn.style.left = '';
    noBtn.style.top = '';
    noBtn.style.margin = '';
    
    // Reset Envelope class
    envelope.classList.remove('open');
    
    // Go to first slide
    currentSlide = 0;
    updateSlideView();
    
    // Transition screens back to Screen 1
    bookScreen.classList.add('fade-out');
    setTimeout(() => {
        bookScreen.classList.remove('active', 'fade-out');
        questionScreen.classList.add('active', 'bubble-in');
    }, 500);
});
