// Безопасная обёртка для хранилища: если браузер блокирует localStorage
// (например, встроенный просмотр в iframe), приложение продолжает работать
// и помнит прогресс хотя бы в пределах сессии.
const storage = {
    _mem: {},
    get(key, fallback = '') {
        try {
            const v = window.localStorage.getItem(key);
            return v === null ? (this._mem[key] ?? fallback) : v;
        } catch (e) {
            return this._mem[key] ?? fallback;
        }
    },
    set(key, value) {
        this._mem[key] = value;
        try { window.localStorage.setItem(key, value); } catch (e) {}
    }
};

// Состояние приложения (сохранённые значения подгружаются при старте)
let state = {
    currentMode: null,
    hearts: 5,
    xp: 0,
    streak: 0,
    
    // Cards mode
    deck: [],
    currentCard: 0,
    isFlipped: false,
    cardFilter: 'all',
    
    // Trainer mode
    currentTrainerQuestion: 0,
    trainerQuestions: [],
    selectedBlank: 0,
    blanksState: [],
    usedOptions: [],
    
    // Letters mode (Тренажер 2)
    lettersQuestions: [],
    currentLettersQuestion: 0,
    lettersExpected: [],
    lettersPlaced: [],
    lettersTiles: [],
    
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

// Подгрузить сохранённый прогресс (XP, серия дней)
function loadSavedState() {
    state.xp = parseInt(storage.get('linuxTrainerXP', '0')) || 0;
    state.streak = parseInt(storage.get('linuxTrainerStreak', '0')) || 0;
}

// DOM Elements
const screens = ['mainMenu', 'cardsScreen', 'trainerScreen', 'lettersScreen', 'testScreen', 'dictScreen'];

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
    // «Изучено» — карточки, отмеченные как «знаю» (хранится на устройстве)
    document.getElementById('totalLearned').textContent = knownCardsCount();
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
        // Восстанавливаем фильтр и позицию, чтобы продолжить с того же места
        const saved = JSON.parse(storage.get('linuxTrainerCardSession', 'null') || 'null');
        state.cardFilter = (saved && saved.filter) || 'all';
        state.deck = buildDeck(state.cardFilter);
        state.isFlipped = false;
        renderFilterChips();
        updateKnownCount();
        state.currentCard = saved ? Math.min(saved.index || 0, state.deck.length - 1) : 0;
        if (state.currentCard < 0) state.currentCard = 0;
        document.getElementById('cardTotal').textContent = state.deck.length;
        showCard();
        showScreen('cardsScreen');
        updateProgress(state.currentCard + 1, state.deck.length);
    } else if (mode === 'trainer') {
        state.trainerQuestions = shuffleArray(TRAINER_QUESTIONS).slice(0, state.questionsPerLesson);
        state.currentTrainerQuestion = 0;
        showTrainerQuestion();
        showScreen('trainerScreen');
        updateProgress(0, state.questionsPerLesson);
    } else if (mode === 'letters') {
        state.lettersQuestions = shuffleArray(TRAINER_QUESTIONS).slice(0, state.questionsPerLesson);
        state.currentLettersQuestion = 0;
        showLettersQuestion();
        showScreen('lettersScreen');
        updateProgress(0, state.questionsPerLesson);
    } else if (mode === 'dict') {
        renderGuide();
        renderDict();
        showScreen('dictScreen');
        updateProgress(0, 1);
    } else if (mode === 'test') {
        state.testQuestions = shuffleArray(TEST_QUESTIONS).slice(0, state.questionsPerLesson);
        state.currentTestQuestion = 0;
        state.selectedTestOption = null;
        showTestQuestion();
        showScreen('testScreen');
        updateProgress(0, state.questionsPerLesson);
    }
}

// ========== CARDS MODE (Tinder-style) ==========
// Статусы карточек хранятся в localStorage — приложение помнит,
// какие команды ты уже знаешь, а что стоит повторить.

function getCardStatuses() {
    try {
        return JSON.parse(storage.get('linuxTrainerCardStatus', '{}'));
    } catch (e) {
        return {};
    }
}

function markCard(command, status) {
    const statuses = getCardStatuses();
    statuses[command] = status;
    storage.set('linuxTrainerCardStatus', JSON.stringify(statuses));
}

function knownCardsCount() {
    const statuses = getCardStatuses();
    return ALL_COMMANDS.filter(c => statuses[c.command] === 'known').length;
}

// Колода: сначала «не знаю», потом «повторить», потом новые, в конце — выученные.
// topic — фильтр: 'all' или тема карточек (Linux / Bash / Git / Термины)
function buildDeck(topic = 'all') {
    const statuses = getCardStatuses();
    const priority = c => {
        const s = statuses[c.command];
        if (s === 'unknown') return 0;
        if (s === 'review') return 1;
        if (!s) return 2;
        return 3; // known
    };
    const source = topic === 'all' ? ALL_COMMANDS : ALL_COMMANDS.filter(c => c.topic === topic);
    return source
        .map((card, i) => ({ card, i }))
        .sort((a, b) => priority(a.card) - priority(b.card) || a.i - b.i)
        .map(o => o.card);
}

// Запомнить, на какой карточке остановился пользователь (и с каким фильтром)
function saveCardSession() {
    storage.set('linuxTrainerCardSession', JSON.stringify({
        filter: state.cardFilter,
        index: state.currentCard
    }));
}

const CARD_TOPICS = ['all', 'Linux', 'Bash', 'Git', 'Термины'];

function renderFilterChips() {
    const box = document.getElementById('cardFilters');
    box.innerHTML = '';
    CARD_TOPICS.forEach(topic => {
        const btn = document.createElement('button');
        btn.className = 'filter-chip' + (state.cardFilter === topic ? ' active' : '');
        btn.textContent = topic === 'all' ? 'Все' : topic;
        btn.onclick = () => setCardFilter(topic);
        box.appendChild(btn);
    });
}

function setCardFilter(topic) {
    playClick();
    state.cardFilter = topic;
    state.deck = buildDeck(topic);
    state.currentCard = 0;
    state.isFlipped = false;
    saveCardSession();
    renderFilterChips();
    document.getElementById('cardTotal').textContent = state.deck.length;
    updateKnownCount();
    showCard();
    updateProgress(1, state.deck.length);
}

function showCard() {
    const card = state.deck[state.currentCard];
    document.getElementById('cardCategory').textContent = card.category;
    document.getElementById('cardCommand').textContent = card.command;
    document.getElementById('cardDescription').textContent = card.description;
    document.getElementById('cardExample').textContent = card.example;
    
    document.getElementById('cardCurrent').textContent = state.currentCard + 1;
    
    // Плашка статуса, если карточка уже отмечалась раньше
    const status = getCardStatuses()[card.command];
    const statusEl = document.getElementById('cardStatus');
    statusEl.className = 'card-status' + (status ? ' ' + status : '');
    statusEl.textContent = status === 'known' ? '✓ знаю' :
                           status === 'unknown' ? '✗ не знаю' :
                           status === 'review' ? '↻ повторить' : '';
    
    const flashcard = document.getElementById('flashcard');
    flashcard.classList.remove('flipped');
    state.isFlipped = false;
    
    // Анимация появления следующей карточки
    flashcard.classList.remove('card-enter');
    void flashcard.offsetWidth;
    flashcard.classList.add('card-enter');
}

function flipCard() {
    if (state.currentMode !== 'cards') return;
    playFlip();
    const flashcard = document.getElementById('flashcard');
    flashcard.classList.toggle('flipped');
    state.isFlipped = !state.isFlipped;
}

function updateKnownCount() {
    const statuses = getCardStatuses();
    const source = state.cardFilter === 'all' ? ALL_COMMANDS : ALL_COMMANDS.filter(c => c.topic === state.cardFilter);
    const known = source.filter(c => statuses[c.command] === 'known').length;
    document.getElementById('knownCount').textContent = known;
    document.getElementById('knownTotal').textContent = source.length;
}

function advanceCard() {
    if (state.currentCard < state.deck.length - 1) {
        state.currentCard++;
        saveCardSession();
        showCard();
        updateProgress(state.currentCard + 1, state.deck.length);
    } else {
        // Колода пройдена — в следующий раз начнём сначала
        storage.set('linuxTrainerCardSession', JSON.stringify({ filter: state.cardFilter, index: 0 }));
        showLessonComplete();
    }
}

// XP за карточки начисляем сразу и сохраняем на устройство —
// иначе выход посреди колоды обнулял бы заработанное
function addCardXP(n) {
    state.sessionXP += n;
    state.xp += n;
    storage.set('linuxTrainerXP', state.xp.toString());
}

// Действие после анимации вылета карточки
function doKnow() {
    markCard(state.deck[state.currentCard].command, 'known');
    addCardXP(3);
    state.sessionCorrect++;
    updateKnownCount();
    advanceCard();
}

function doDontKnow() {
    markCard(state.deck[state.currentCard].command, 'unknown');
    state.sessionWrong++;
    updateKnownCount();
    advanceCard();
}

function doRepeat() {
    markCard(state.deck[state.currentCard].command, 'review');
    addCardXP(1);
    updateKnownCount();
    advanceCard();
}

// Кнопки действий (дублируют свайпы, карточка так же улетает)
function knowCard() {
    playSelect();
    flyCardOut('right', 0, 0, doKnow);
}

function dontKnowCard() {
    playSkip();
    flyCardOut('left', 0, 0, doDontKnow);
}

function repeatCard() {
    playClick();
    flyCardOut('down', 0, 0, doRepeat);
}

// Навигация без смены статуса
function skipCard() {
    playClick();
    advanceCard();
}

function prevCard() {
    playClick();
    if (state.currentCard > 0) {
        state.currentCard--;
        saveCardSession();
        showCard();
        updateProgress(state.currentCard + 1, state.deck.length);
    }
}

// ========== CARD SWIPE (жесты) ==========
const SWIPE_THRESHOLD = 90;
let cardDrag = null;

// Штампы появляются постепенно, по мере того как тянешь карточку
function updateStamps(dx, dy) {
    const clamp01 = v => Math.max(0, Math.min(1, v));
    const horizontal = Math.min(1, Math.abs(dx) / SWIPE_THRESHOLD);
    document.getElementById('stampKnow').style.opacity = clamp01(dx / SWIPE_THRESHOLD);
    document.getElementById('stampDontknow').style.opacity = clamp01(-dx / SWIPE_THRESHOLD);
    // «Повторить» — только когда тянут преимущественно вниз
    document.getElementById('stampRepeat').style.opacity = clamp01(dy / SWIPE_THRESHOLD) * (1 - horizontal);
}

function hideStamps(exceptId) {
    ['stampKnow', 'stampDontknow', 'stampRepeat'].forEach(id => {
        document.getElementById(id).style.opacity = (id === exceptId) ? 1 : 0;
    });
}

// Анимация вылета карточки за экран, затем действие
function flyCardOut(direction, dx, dy, action) {
    const card = document.getElementById('flashcard');
    if (state.currentMode !== 'cards' || card.classList.contains('flying')) return;
    card.classList.add('flying');

    const stampId = direction === 'right' ? 'stampKnow' :
                    direction === 'left' ? 'stampDontknow' : 'stampRepeat';
    hideStamps(stampId);

    const offX = Math.max(window.innerWidth, 500);
    const offY = Math.max(window.innerHeight, 700);
    const targets = {
        right: [offX, dy, 25],
        left: [-offX, dy, -25],
        down: [dx, offY, 0]
    };
    const [tx, ty, rot] = targets[direction];

    card.style.transition = 'transform 0.28s ease-in, opacity 0.28s ease-in';
    card.style.transform = `translate(${tx}px, ${ty}px) rotate(${rot}deg)`;
    card.style.opacity = '0';

    setTimeout(() => {
        resetCardInstant(card);
        if (state.currentMode !== 'cards') return; // пользователь успел выйти
        action();
    }, 280);
}

// Мгновенный сброс позиции после вылета + плавное появление
function resetCardInstant(card) {
    card.style.transition = 'none';
    card.style.transform = '';
    hideStamps();
    void card.offsetWidth; // reflow, чтобы «none» применился
    card.style.transition = 'opacity 0.18s ease';
    card.style.opacity = '';
    setTimeout(() => {
        card.style.transition = '';
        card.classList.remove('flying');
    }, 200);
}

// Пружинный возврат карточки, если свайп не дошёл до порога
function snapCardBack(card) {
    card.style.transition = 'transform 0.28s cubic-bezier(.2,.8,.3,1.2)';
    card.style.transform = '';
    hideStamps();
    setTimeout(() => { card.style.transition = ''; }, 300);
}

function initCardGestures() {
    const card = document.getElementById('flashcard');

    card.addEventListener('pointerdown', e => {
        if (state.currentMode !== 'cards' || card.classList.contains('flying')) return;
        cardDrag = { startX: e.clientX, startY: e.clientY, dx: 0, dy: 0, moved: false };
        card.classList.add('dragging');
        try { card.setPointerCapture(e.pointerId); } catch (err) {}
    });

    card.addEventListener('pointermove', e => {
        if (!cardDrag) return;
        cardDrag.dx = e.clientX - cardDrag.startX;
        cardDrag.dy = e.clientY - cardDrag.startY;
        if (Math.abs(cardDrag.dx) > 6 || Math.abs(cardDrag.dy) > 6) cardDrag.moved = true;
        card.style.transition = 'none';
        card.style.transform = `translate(${cardDrag.dx}px, ${cardDrag.dy}px) rotate(${cardDrag.dx / 12}deg)`;
        updateStamps(cardDrag.dx, cardDrag.dy);
    });

    card.addEventListener('pointerup', e => {
        if (!cardDrag) return;
        const { dx, dy, moved } = cardDrag;
        cardDrag = null;
        card.classList.remove('dragging');

        if (!moved) {
            snapCardBack(card); // на случай микродвижения
            flipCard();         // тап — перевернуть карточку
            return;
        }
        if (dx > SWIPE_THRESHOLD && Math.abs(dx) > Math.abs(dy)) {
            playSelect();
            flyCardOut('right', dx, dy, doKnow);
        } else if (dx < -SWIPE_THRESHOLD && Math.abs(dx) > Math.abs(dy)) {
            playSkip();
            flyCardOut('left', dx, dy, doDontKnow);
        } else if (dy > SWIPE_THRESHOLD && dy > Math.abs(dx)) {
            playClick();
            flyCardOut('down', dx, dy, doRepeat);
        } else {
            snapCardBack(card);
        }
    });

    card.addEventListener('pointercancel', () => {
        if (!cardDrag) return;
        cardDrag = null;
        card.classList.remove('dragging');
        snapCardBack(card);
    });
}

// ========== TRAINER MODE (Duolingo-style) ==========
function showTrainerQuestion() {
    state.blanksState = [];
    state.usedOptions = [];
    document.getElementById('checkBtn').classList.remove('active');
    document.getElementById('checkBtn').disabled = true;
    
    const q = state.trainerQuestions[state.currentTrainerQuestion];
    
    // Задача всегда показана явно: пользователь точно знает, ЧТО должна сделать команда
    document.getElementById('trainerTopic').textContent = q.topic || 'Команды';
    document.getElementById('trainerQuestion').textContent = q.task || q.question || 'Собери команду:';
    
    // Разбиваем полную команду на слова; индексы из q.blanks становятся пропусками
    const cmdWords = q.fullCommand.split(' ');
    const commandParts = cmdWords.map((word, i) => {
        if (q.blanks.includes(i)) {
            state.blanksState.push(null);
            return { type: 'blank', index: state.blanksState.length - 1 };
        }
        return { type: 'text', word: word };
    });
    
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
    
    // Варианты слов (в data.js всегда ровно один правильный + подходящие по теме отвлекающие)
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
        showResult(true, 'Правильно! 👏', q.hint || q.description || 'Отличная работа!');
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
        const msg = `Правильная команда: <strong style="font-family: monospace; font-size: 0.9em">${correctCommand}</strong><br><br>${q.hint || q.description || ''}`;
        
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
    const msg = `Команда: <strong style="font-family: monospace; font-size: 0.9em">${q.fullCommand}</strong><br><br>${q.hint || q.description || ''}`;
    state.sessionWrong++;
    
    if (state.hearts <= 0) {
        showResult(false, 'Пропуск', msg);
        setTimeout(() => showLessonComplete(), 2200);
    } else {
        showResult(false, 'Пропущено', msg);
    }
}

// ========== LETTERS MODE (Тренажер 2: буквы, как в Duolingo) ==========
// Показываем задачу и фишки с буквами. Тап по правильной (следующей) букве
// ставит её в пропуск, тап по неправильной — фишка вспыхивает красным,
// НЕ ставится, а жизнь сгорает.

// Буквы-дополнения, похожие на символьный запас команд
const LETTER_DISTRACTORS = 'aeinrslcmgot'.split('');

function showLettersQuestion() {
    const q = state.lettersQuestions[state.currentLettersQuestion];
    document.getElementById('lettersTopic').textContent = q.topic || 'Команды';
    document.getElementById('lettersQuestion').textContent = q.task || 'Собери команду:';

    // Ожидаемое слово — пропуск в команде
    const words = q.fullCommand.split(' ');
    state.lettersExpected = words.filter((w, i) => q.blanks.includes(i)).join(' ').replace(/ /g, '').split('');
    state.lettersPlaced = [];

    // Командная строка с пропуском из буквенных ячеек
    const preview = document.getElementById('lettersPreview');
    preview.innerHTML = '';
    words.forEach((word, i) => {
        if (q.blanks.includes(i)) {
            const slot = document.createElement('span');
            slot.className = 'letters-slot';
            slot.id = 'lettersSlot';
            slot.onclick = removeLastLetter;
            for (let k = 0; k < word.length; k++) {
                const cell = document.createElement('span');
                cell.className = 'letter-cell';
                cell.id = `letter-cell-${k}`;
                cell.textContent = '';
                slot.appendChild(cell);
            }
            preview.appendChild(slot);
        } else {
            const span = document.createElement('span');
            span.className = 'cmd-text';
            span.textContent = word;
            preview.appendChild(span);
        }
        preview.appendChild(document.createTextNode(' '));
    });

    // Фишки с буквами: буквы ответа + 3 лишние буквы, всё перемешано
    const answerLetters = [...state.lettersExpected];
    const pool = LETTER_DISTRACTORS.filter(l => !answerLetters.includes(l));
    const distractors = shuffleArray(pool).slice(0, 3);
    state.lettersTiles = shuffleArray([...answerLetters, ...distractors]);

    const tilesBox = document.getElementById('letterTiles');
    tilesBox.innerHTML = '';
    state.lettersTiles.forEach((letter, i) => {
        const btn = document.createElement('button');
        btn.className = 'letter-tile';
        btn.textContent = letter;
        btn.dataset.letter = letter;
        btn.onclick = () => tapLetter(letter, btn);
        tilesBox.appendChild(btn);
    });
}

function tapLetter(letter, btn) {
    const nextIndex = state.lettersPlaced.length;
    const expected = state.lettersExpected[nextIndex];

    if (letter === expected) {
        // Правильная буква — ставим в пропуск
        playSelect();
        btn.classList.add('used');
        state.lettersPlaced.push({ letter, btn });
        const cell = document.getElementById(`letter-cell-${nextIndex}`);
        cell.textContent = letter;
        cell.classList.add('filled');

        // Слово собрано целиком — вопрос засчитан
        if (state.lettersPlaced.length === state.lettersExpected.length) {
            state.sessionCorrect++;
            state.sessionXP += 12;
            playCorrect();
            const q = state.lettersQuestions[state.currentLettersQuestion];
            setTimeout(() => {
                showResult(true, 'Правильно! 👏', q.hint || 'Отличная работа!');
            }, 350);
        }
    } else {
        // Не та буква — вспыхивает красным и НЕ ставится
        playWrong();
        state.sessionWrong++;
        state.hearts--;
        updateHearts();
        playHeartLost();
        btn.classList.add('wrong-flash');
        const tilesBox = document.getElementById('letterTiles');
        tilesBox.classList.add('shake');
        setTimeout(() => {
            btn.classList.remove('wrong-flash');
            tilesBox.classList.remove('shake');
        }, 500);

        if (state.hearts <= 0) {
            setTimeout(() => showLessonComplete(), 700);
        }
    }
}

// Тап по пропуску убирает последнюю поставленную букву
function removeLastLetter() {
    if (state.lettersPlaced.length === 0) return;
    const last = state.lettersPlaced.pop();
    playClick();
    last.btn.classList.remove('used');
    const cell = document.getElementById(`letter-cell-${state.lettersPlaced.length}`);
    cell.textContent = '';
    cell.classList.remove('filled');
}

function skipLettersQuestion() {
    playSkip();
    state.hearts--;
    updateHearts();
    playHeartLost();
    const q = state.lettersQuestions[state.currentLettersQuestion];
    const msg = `Команда: <strong style="font-family: monospace; font-size: 0.9em">${q.fullCommand}</strong><br><br>${q.hint || ''}`;
    state.sessionWrong++;

    if (state.hearts <= 0) {
        showResult(false, 'Пропуск', msg);
        setTimeout(() => showLessonComplete(), 2200);
    } else {
        showResult(false, 'Пропущено', msg);
    }
}

// ========== DICTIONARY MODE (Справочник) ==========
function renderGuide() {
    const box = document.getElementById('guideSteps');
    box.innerHTML = '';
    GIT_GUIDE.forEach((step, i) => {
        const el = document.createElement('div');
        el.className = 'guide-step';

        const num = document.createElement('div');
        num.className = 'guide-num';
        num.textContent = i + 1;

        const body = document.createElement('div');
        body.className = 'guide-body';

        const title = document.createElement('div');
        title.className = 'guide-title';
        title.textContent = step.title;

        const cmd = document.createElement('div');
        cmd.className = 'guide-command';
        cmd.textContent = step.command;
        // Псевдокоманды-описания (со стрелками →) не оформляем как терминал
        if (step.command.includes('→')) cmd.classList.add('guide-command-text');

        const note = document.createElement('div');
        note.className = 'guide-note';
        note.textContent = step.note;

        body.appendChild(title);
        body.appendChild(cmd);
        body.appendChild(note);
        el.appendChild(num);
        el.appendChild(body);
        box.appendChild(el);
    });
}

function renderDict() {
    const box = document.getElementById('dictList');
    box.innerHTML = '';
    const topics = [
        ['Linux', ALL_COMMANDS.filter(c => c.topic === 'Linux')],
        ['Bash', ALL_COMMANDS.filter(c => c.topic === 'Bash')],
        ['Git', ALL_COMMANDS.filter(c => c.topic === 'Git')],
        ['Термины Git', ALL_COMMANDS.filter(c => c.topic === 'Термины')]
    ];
    topics.forEach(([name, cards]) => {
        const header = document.createElement('h3');
        header.className = 'dict-topic';
        header.textContent = `${name} (${cards.length})`;
        box.appendChild(header);

        cards.forEach(card => {
            const item = document.createElement('div');
            item.className = 'dict-item';

            const cmd = document.createElement('div');
            cmd.className = 'dict-command';
            cmd.textContent = card.command;

            const desc = document.createElement('div');
            desc.className = 'dict-desc';
            desc.textContent = card.description;

            const example = document.createElement('div');
            example.className = 'dict-example';
            example.textContent = card.example;

            item.appendChild(cmd);
            item.appendChild(desc);
            item.appendChild(example);
            box.appendChild(item);
        });
    });
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
    } else if (state.currentMode === 'letters') {
        state.currentLettersQuestion++;
        if (state.currentLettersQuestion >= state.lettersQuestions.length) {
            showLessonComplete();
        } else {
            showLettersQuestion();
            updateProgress(state.currentLettersQuestion, state.questionsPerLesson);
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
    // В карточках XP уже начислены по ходу (addCardXP) — повторно не добавляем
    if (state.currentMode !== 'cards') {
        state.xp += state.sessionXP;
        storage.set('linuxTrainerXP', state.xp.toString());
    }
    
    // Для карточек подписи статистики другие
    const isCards = state.currentMode === 'cards';
    document.getElementById('correctLabel').textContent = isCards ? 'Знаю:' : 'Правильных:';
    document.getElementById('wrongLabel').textContent = isCards ? 'Не знаю:' : 'Ошибок:';
    
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
    loadSavedState();
    updateStats();
    updateHearts();
    updateProgress(0, 1);
    initCardGestures();
    
    // Инициализируем аудио при первом тапе/клике (требование мобильных браузеров)
    const initAudioOnFirstInteraction = () => {
        initAudio();
        document.removeEventListener('touchstart', initAudioOnFirstInteraction);
        document.removeEventListener('click', initAudioOnFirstInteraction);
    };
    document.addEventListener('touchstart', initAudioOnFirstInteraction, { once: true });
    document.addEventListener('click', initAudioOnFirstInteraction, { once: true });
});
