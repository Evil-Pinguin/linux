// Состояние приложения
let state = {
    currentMode: null,
    hearts: 5,
    xp: parseInt(localStorage.getItem('linuxTrainerXP') || '0'),
    streak: parseInt(localStorage.getItem('linuxTrainerStreak') || '0'),
    totalLearned: parseInt(localStorage.getItem('linuxTrainerLearned') || '0'),
    
    // Cards mode
    currentCard: 0,
    isFlipped: false,
    
    // Trainer mode
    currentTrainerQuestion: 0,
    trainerQuestions: [],
    selectedBlank: 0,
    blanksState: [],
    usedOptions: [],
    
    // Test mode
    currentTestQuestion: 0,
    testQuestions: [],
    selectedTestOption: null,
    
    // Session stats
    sessionCorrect: 0,
    sessionWrong: 0,
    sessionXP: 0,
    questionsPerLesson: 10
};

// DOM Elements
const screens = ['mainMenu', 'cardsScreen', 'trainerScreen', 'testScreen'];

// Показать экран
function showScreen(screenId) {
    screens.forEach(id => {
        document.getElementById(id).classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
    // Скролл наверх
    window.scrollTo(0, 0);
}

// Обновить статистику в меню
function updateStats() {
    document.getElementById('totalLearned').textContent = state.totalLearned;
    document.getElementById('streak').textContent = state.streak;
    document.getElementById('xp').textContent = state.xp;
}

// Обновить сердца с анимацией
function updateHearts() {
    document.getElementById('hearts').textContent = '❤'.repeat(state.hearts) + '🖤'.repeat(5 - state.hearts);
}

// Обновить прогресс бар
function updateProgress(current, total) {
    const percent = Math.min((current / total) * 100, 100);
    document.getElementById('progressFill').style.width = percent + '%';
}

// На главную
function goHome() {
    playClick();
    showScreen('mainMenu');
    state.currentMode = null;
    updateProgress(0, 1);
    updateStats();
    document.getElementById('resultModal').classList.remove('active');
    document.getElementById('completeModal').classList.remove('active');
}

// Перемешать массив
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Запустить режим
function startMode(mode) {
    playClick();
    state.currentMode = mode;
    state.hearts = 5;
    state.sessionCorrect = 0;
    state.sessionWrong = 0;
    state.sessionXP = 0;
    updateHearts();
    
    if (mode === 'cards') {
        state.currentCard = 0;
        state.isFlipped = false;
        document.getElementById('cardTotal').textContent = ALL_COMMANDS.length;
        showCard();
        showScreen('cardsScreen');
        updateProgress(1, ALL_COMMANDS.length);
    } else if (mode === 'trainer') {
        state.trainerQuestions = shuffleArray(TRAINER_QUESTIONS).slice(0, state.questionsPerLesson);
        state.currentTrainerQuestion = 0;
        showTrainerQuestion();
        showScreen('trainerScreen');
        updateProgress(0, state.questionsPerLesson);
    } else if (mode === 'test') {
        state.testQuestions = shuffleArray(TEST_QUESTIONS).slice(0, state.questionsPerLesson);
        state.currentTestQuestion = 0;
        state.selectedTestOption = null;
        showTestQuestion();
        showScreen('testScreen');
        updateProgress(0, state.questionsPerLesson);
    }
}

// ========== CARDS MODE ==========
function showCard() {
    const card = ALL_COMMANDS[state.currentCard];
    document.getElementById('cardCategory').textContent = card.category;
    document.getElementById('cardCommand').textContent = card.command;
    document.getElementById('cardDescription').textContent = card.description;
    document.getElementById('cardExample').textContent = card.example;
    
    document.getElementById('cardCurrent').textContent = state.currentCard + 1;
    
    const flashcard = document.getElementById('flashcard');
    flashcard.classList.remove('flipped');
    state.isFlipped = false;
}

function flipCard() {
    playFlip();
    const flashcard = document.getElementById('flashcard');
    flashcard.classList.toggle('flipped');
    state.isFlipped = !state.isFlipped;
}

function nextCard() {
    playClick();
    state.totalLearned++;
    localStorage.setItem('linuxTrainerLearned', state.totalLearned.toString());
    state.sessionXP += 2;
    state.xp += 2;
    localStorage.setItem('linuxTrainerXP', state.xp.toString());
    
    if (state.currentCard < ALL_COMMANDS.length - 1) {
        state.currentCard++;
        showCard();
        updateProgress(state.currentCard + 1, ALL_COMMANDS.length);
    } else {
        showLessonComplete();
    }
}

function prevCard() {
    playClick();
    if (state.currentCard > 0) {
        state.currentCard--;
        showCard();
        updateProgress(state.currentCard + 1, ALL_COMMANDS.length);
    }
}

// ========== TRAINER MODE (Duolingo-style) ==========
function showTrainerQuestion() {
    state.blanksState = [];
    state.usedOptions = [];
    document.getElementById('checkBtn').classList.remove('active');
    document.getElementById('checkBtn').disabled = true;
    
    const q = state.trainerQuestions[state.currentTrainerQuestion];
    document.getElementById('trainerQuestion').textContent = q.question || 'Соберите команду:';
    
    let commandParts;
    
    if (q.command && !q.fullCommand) {
        const cmdParts = q.command.split(' ');
        const blankIndex = q.type === 'git' ? 1 : 0;
        
        commandParts = cmdParts.map((word, i) => {
            if (i === blankIndex) {
                state.blanksState.push(null);
                return { type: 'blank', index: 0 };
            }
            return { type: 'text', word: word };
        });
        
        const correctWord = cmdParts[blankIndex];
        const otherOptions = [];
        const allWords = ALL_COMMANDS.flatMap(c => c.command.split(' '));
        while (otherOptions.length < 4) {
            const w = allWords[Math.floor(Math.random() * allWords.length)];
            if (w !== correctWord && !otherOptions.includes(w) && w !== 'git') {
                otherOptions.push(w);
            }
        }
        q.fullCommand = q.command;
        q.options = shuffleArray([correctWord, ...otherOptions]);
        q.correctAnswer = correctWord;
        q.blanks = [blankIndex];
    } else {
        const cmdWords = q.fullCommand.split(' ');
        commandParts = cmdWords.map((word, i) => {
            if (q.blanks && q.blanks.includes(i)) {
                state.blanksState.push(null);
                return { type: 'blank', index: state.blanksState.length - 1 };
            }
            return { type: 'text', word: word };
        });
        q.correctAnswer = q.fullCommand.split(' ').filter((w, i) => q.blanks.includes(i));
    }
    
    const preview = document.getElementById('commandPreview');
    preview.innerHTML = '';
    commandParts.forEach(part => {
        if (part.type === 'text') {
            const span = document.createElement('span');
            span.className = 'cmd-text';
            span.textContent = part.word;
            preview.appendChild(span);
        } else {
            const blank = document.createElement('div');
            blank.className = 'cmd-blank-slot';
            blank.id = `blank-slot-${part.index}`;
            blank.onclick = () => removeWordFromBlank(part.index);
            preview.appendChild(blank);
        }
        preview.appendChild(document.createTextNode(' '));
    });
    
    document.getElementById('selectedWords').innerHTML = '';
    
    const optionsContainer = document.getElementById('wordOptions');
    optionsContainer.innerHTML = '';
    const shuffledOptions = shuffleArray(q.options);
    shuffledOptions.forEach((word, i) => {
        const btn = document.createElement('button');
        btn.className = 'word-chip';
        btn.textContent = word;
        btn.dataset.word = word;
        btn.onclick = () => selectWord(word, btn);
        optionsContainer.appendChild(btn);
    });
}

function selectWord(word, btnElement) {
    const emptyBlankIndex = state.blanksState.findIndex(b => b === null);
    if (emptyBlankIndex === -1) return;
    
    playSelect();
    
    state.blanksState[emptyBlankIndex] = word;
    btnElement.classList.add('used');
    
    const slot = document.getElementById(`blank-slot-${emptyBlankIndex}`);
    slot.classList.add('has-word');
    slot.innerHTML = '';
    const chip = document.createElement('span');
    chip.className = 'word-chip';
    chip.textContent = word;
    slot.appendChild(chip);
    
    if (state.blanksState.every(b => b !== null)) {
        document.getElementById('checkBtn').classList.add('active');
        document.getElementById('checkBtn').disabled = false;
    }
}

function removeWordFromBlank(blankIndex) {
    const word = state.blanksState[blankIndex];
    if (word === null) return;
    
    playClick();
    
    state.blanksState[blankIndex] = null;
    
    const slot = document.getElementById(`blank-slot-${blankIndex}`);
    slot.classList.remove('has-word');
    slot.innerHTML = '';
    
    const options = document.querySelectorAll('.word-options .word-chip');
    options.forEach(btn => {
        if (btn.dataset.word === word && btn.classList.contains('used')) {
            btn.classList.remove('used');
        }
    });
    
    document.getElementById('checkBtn').classList.remove('active');
    document.getElementById('checkBtn').disabled = true;
}

function checkAnswer() {
    playClick();
    
    const q = state.trainerQuestions[state.currentTrainerQuestion];
    const correctWords = q.fullCommand.split(' ').filter((w, i) => q.blanks.includes(i));
    
    let isCorrect = true;
    for (let i = 0; i < correctWords.length; i++) {
        if (state.blanksState[i] !== correctWords[i]) {
            isCorrect = false;
            break;
        }
    }
    
    if (isCorrect) {
        state.sessionCorrect++;
        state.sessionXP += 10;
        playCorrect();
        showResult(true, 'Правильно! 👏', q.description || 'Отличная работа!');
    } else {
        state.sessionWrong++;
        state.hearts--;
        updateHearts();
        playWrong();
        playHeartLost();
        
        // Добавляем тряску
        const preview = document.getElementById('commandPreview');
        preview.classList.add('shake');
        setTimeout(() => preview.classList.remove('shake'), 500);
        
        const correctCommand = q.fullCommand;
        const msg = `Правильная команда: <strong style="font-family: monospace; font-size: 0.9em">${correctCommand}</strong><br><br>${q.description || ''}`;
        
        if (state.hearts <= 0) {
            setTimeout(() => showLessonComplete(), 2200);
        }
        
        showResult(false, 'Неправильно 😔', msg);
    }
}

function skipQuestion() {
    playSkip();
    state.hearts--;
    updateHearts();
    playHeartLost();
    const q = state.trainerQuestions[state.currentTrainerQuestion];
    const msg = `Команда: <strong style="font-family: monospace; font-size: 0.9em">${q.fullCommand}</strong><br><br>${q.description || ''}`;
    state.sessionWrong++;
    
    if (state.hearts <= 0) {
        showResult(false, 'Пропуск', msg);
        setTimeout(() => showLessonComplete(), 2200);
    } else {
        showResult(false, 'Пропущено', msg);
    }
}

// ========== TEST MODE ==========
function showTestQuestion() {
    state.selectedTestOption = null;
    document.getElementById('testCheckBtn').classList.remove('active');
    document.getElementById('testCheckBtn').disabled = true;
    
    const q = state.testQuestions[state.currentTestQuestion];
    document.getElementById('testQuestion').textContent = q.question;
    
    const optionsContainer = document.getElementById('testOptions');
    optionsContainer.innerHTML = '';
    
    q.options.forEach((option, i) => {
        const btn = document.createElement('button');
        btn.className = 'test-option';
        btn.textContent = option;
        btn.onclick = () => selectTestOption(i, btn);
        optionsContainer.appendChild(btn);
    });
}

function selectTestOption(index, btnElement) {
    playSelect();
    state.selectedTestOption = index;
    
    document.querySelectorAll('.test-option').forEach(btn => {
        btn.classList.remove('selected');
    });
    btnElement.classList.add('selected');
    
    document.getElementById('testCheckBtn').classList.add('active');
    document.getElementById('testCheckBtn').disabled = false;
}

function checkTestAnswer() {
    playClick();
    const q = state.testQuestions[state.currentTestQuestion];
    const isCorrect = state.selectedTestOption === q.correct;
    
    const options = document.querySelectorAll('.test-option');
    
    if (isCorrect) {
        options[state.selectedTestOption].classList.add('correct');
        state.sessionCorrect++;
        state.sessionXP += 10;
        playCorrect();
        showResult(true, 'Правильно! 🎉', q.explanation);
    } else {
        options[state.selectedTestOption].classList.add('wrong');
        options[q.correct].classList.add('correct');
        state.sessionWrong++;
        state.hearts--;
        updateHearts();
        playWrong();
        playHeartLost();
        
        // Тряска
        const testOpts = document.getElementById('testOptions');
        testOpts.classList.add('shake');
        setTimeout(() => testOpts.classList.remove('shake'), 500);
        
        if (state.hearts <= 0) {
            setTimeout(() => showLessonComplete(), 2700);
        }
        
        showResult(false, 'Неправильно', q.explanation);
    }
}

function skipTestQuestion() {
    playSkip();
    state.hearts--;
    updateHearts();
    playHeartLost();
    const q = state.testQuestions[state.currentTestQuestion];
    state.sessionWrong++;
    
    const options = document.querySelectorAll('.test-option');
    options[q.correct].classList.add('correct');
    
    if (state.hearts <= 0) {
        showResult(false, 'Пропуск', q.explanation);
        setTimeout(() => showLessonComplete(), 2200);
    } else {
        showResult(false, 'Пропущено', q.explanation);
    }
}

// ========== RESULTS ==========
function showResult(isCorrect, title, message) {
    const modal = document.getElementById('resultModal');
    const content = document.getElementById('resultContent');
    
    content.className = 'modal-content ' + (isCorrect ? 'correct' : 'wrong');
    document.getElementById('resultIcon').textContent = isCorrect ? '🎉' : '😢';
    document.getElementById('resultTitle').textContent = title;
    document.getElementById('resultMessage').innerHTML = message;
    
    setTimeout(() => {
        modal.classList.add('active');
    }, isCorrect ? 200 : 600);
}

function nextQuestion() {
    playClick();
    document.getElementById('resultModal').classList.remove('active');
    
    if (state.hearts <= 0) {
        showLessonComplete();
        return;
    }
    
    if (state.currentMode === 'trainer') {
        state.currentTrainerQuestion++;
        if (state.currentTrainerQuestion >= state.trainerQuestions.length) {
            showLessonComplete();
        } else {
            showTrainerQuestion();
            updateProgress(state.currentTrainerQuestion, state.questionsPerLesson);
        }
    } else if (state.currentMode === 'test') {
        state.currentTestQuestion++;
        if (state.currentTestQuestion >= state.testQuestions.length) {
            showLessonComplete();
        } else {
            showTestQuestion();
            updateProgress(state.currentTestQuestion, state.questionsPerLesson);
        }
    }
}

function showLessonComplete() {
    state.xp += state.sessionXP;
    localStorage.setItem('linuxTrainerXP', state.xp.toString());
    
    document.getElementById('earnedXP').textContent = state.sessionXP;
    document.getElementById('correctCount').textContent = state.sessionCorrect;
    document.getElementById('wrongCount').textContent = state.sessionWrong;
    
    document.getElementById('resultModal').classList.remove('active');
    
    setTimeout(() => {
        playLessonComplete();
        document.getElementById('completeModal').classList.add('active');
    }, 300);
    
    updateProgress(1, 1);
}

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    updateStats();
    updateHearts();
    updateProgress(0, 1);
    
    // Инициализируем аудио при первом тапе/клике (требование мобильных браузеров)
    const initAudioOnFirstInteraction = () => {
        initAudio();
        document.removeEventListener('touchstart', initAudioOnFirstInteraction);
        document.removeEventListener('click', initAudioOnFirstInteraction);
    };
    document.addEventListener('touchstart', initAudioOnFirstInteraction, { once: true });
    document.addEventListener('click', initAudioOnFirstInteraction, { once: true });
});
