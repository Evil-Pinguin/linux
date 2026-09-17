// Звуковое сопровождение как в Duolingo через Web Audio API
let audioCtx = null;
// Чтение настройки без падения, если браузер блокирует localStorage (iframe и т.п.)
let soundEnabled = (function () {
    try { return window.localStorage.getItem('linuxTrainerSound') !== 'off'; }
    catch (e) { return true; }
})();

function initAudio() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
}

function toggleSound() {
    soundEnabled = !soundEnabled;
    try { window.localStorage.setItem('linuxTrainerSound', soundEnabled ? 'on' : 'off'); } catch (e) {}
    
    const btn = document.getElementById('soundBtn');
    btn.textContent = soundEnabled ? '🔊' : '🔇';
    
    if (soundEnabled) {
        initAudio();
        playClick();
    }
}

// Инициализируем кнопку звука после загрузки
document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('soundBtn');
    btn.textContent = soundEnabled ? '🔊' : '🔇';
});

// Вспомогательная функция для воспроизведения тона
function playTone(frequency, startTime, duration, volume = 0.3, type = 'sine', attack = 0.01, release = 0.1) {
    if (!soundEnabled || !audioCtx) return;
    
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, startTime);
    
    gainNode.gain.setValueAtTime(0, startTime);
    gainNode.gain.linearRampToValueAtTime(volume, startTime + attack);
    gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration + release);
    
    oscillator.start(startTime);
    oscillator.stop(startTime + duration + release);
}

// Короткий звук нажатия на кнопку/слово
function playClick() {
    if (!soundEnabled) return;
    initAudio();
    
    const now = audioCtx.currentTime;
    playTone(800, now, 0.05, 0.15, 'sine', 0.005, 0.05);
}

// Звук выбора слова/опции
function playSelect() {
    if (!soundEnabled) return;
    initAudio();
    
    const now = audioCtx.currentTime;
    playTone(600, now, 0.06, 0.12, 'triangle', 0.005, 0.06);
}

// Звук правильного ответа (как в Duolingo - восходящий аккорд)
function playCorrect() {
    if (!soundEnabled) return;
    initAudio();
    
    const now = audioCtx.currentTime;
    
    // Ноты: C5, E5, G5, C6 — мажорное трезвучие с октавой
    setTimeout(() => playTone(523.25, now, 0.15, 0.25, 'triangle', 0.02, 0.15), 0);
    setTimeout(() => playTone(659.25, now + 0.1, 0.15, 0.25, 'triangle', 0.02, 0.15), 100);
    setTimeout(() => playTone(783.99, now + 0.2, 0.15, 0.25, 'triangle', 0.02, 0.15), 200);
    setTimeout(() => playTone(1046.50, now + 0.3, 0.3, 0.25, 'triangle', 0.02, 0.3), 300);
}

// Звук неправильного ответа (нисходящий)
function playWrong() {
    if (!soundEnabled) return;
    initAudio();
    
    const now = audioCtx.currentTime;
    
    // Нисходящие ноты
    playTone(300, now, 0.2, 0.25, 'sawtooth', 0.02, 0.2);
    setTimeout(() => playTone(200, now + 0.15, 0.3, 0.22, 'sawtooth', 0.02, 0.3), 150);
}

// Звук пропуска вопроса
function playSkip() {
    if (!soundEnabled) return;
    initAudio();
    
    const now = audioCtx.currentTime;
    playTone(350, now, 0.15, 0.18, 'triangle', 0.02, 0.15);
}

// Звук потери сердечка
function playHeartLost() {
    if (!soundEnabled) return;
    initAudio();
    
    const now = audioCtx.currentTime;
    playTone(400, now, 0.1, 0.2, 'square', 0.01, 0.1);
    setTimeout(() => playTone(300, now + 0.08, 0.2, 0.18, 'square', 0.01, 0.15), 80);
}

// Звук завершения урока (фанфары)
function playLessonComplete() {
    if (!soundEnabled) return;
    initAudio();
    
    const now = audioCtx.currentTime;
    
    // Победная мелодия
    const melody = [
        { note: 523.25, delay: 0, dur: 0.15 },    // C5
        { note: 659.25, delay: 0.15, dur: 0.15 }, // E5
        { note: 783.99, delay: 0.3, dur: 0.15 },  // G5
        { note: 1046.50, delay: 0.45, dur: 0.4 }  // C6
    ];
    
    melody.forEach(m => {
        playTone(m.note, now + m.delay, m.dur, 0.3, 'triangle', 0.03, 0.2);
    });
}

// Звук перелистывания карточки
function playFlip() {
    if (!soundEnabled) return;
    initAudio();
    
    const now = audioCtx.currentTime;
    playTone(500, now, 0.08, 0.1, 'sine', 0.01, 0.08);
    setTimeout(() => playTone(700, now + 0.06, 0.08, 0.08, 'sine', 0.01, 0.08), 60);
}
