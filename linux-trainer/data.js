// Данные для тренажера: команды Linux и Git
const COMMANDS = {
    linux: [
        {
            command: 'ls',
            description: 'Показать содержимое текущей директории (список файлов и папок)',
            example: 'ls -la  # подробный список со скрытыми файлами',
            category: 'Навигация'
        },
        {
            command: 'cd',
            description: 'Сменить текущую директорию (перейти в другую папку)',
            example: 'cd Documents  # перейти в папку Documents\ncd ..         # подняться на уровень выше\ncd ~          # перейти в домашнюю директорию',
            category: 'Навигация'
        },
        {
            command: 'pwd',
            description: 'Показать полный путь текущей рабочей директории',
            example: 'pwd  # вывод: /home/user/Documents',
            category: 'Навигация'
        },
        {
            command: 'mkdir',
            description: 'Создать новую директорию (папку)',
            example: 'mkdir projects  # создать папку projects\nmkdir -p a/b/c  # создать вложенные папки',
            category: 'Файлы'
        },
        {
            command: 'touch',
            description: 'Создать новый пустой файл или обновить время существующего',
            example: 'touch index.html  # создать файл index.html',
            category: 'Файлы'
        },
        {
            command: 'cp',
            description: 'Копировать файлы или директории',
            example: 'cp file.txt backup.txt  # копировать файл\ncp -r folder/ backup/  # копировать папку',
            category: 'Файлы'
        },
        {
            command: 'mv',
            description: 'Переместить или переименовать файлы и директории',
            example: 'mv old.txt new.txt  # переименовать\nmv file.txt ../  # переместить',
            category: 'Файлы'
        },
        {
            command: 'rm',
            description: 'Удалить файлы или директории',
            example: 'rm file.txt      # удалить файл\nrm -rf folder/   # удалить папку и всё содержимое',
            category: 'Файлы'
        },
        {
            command: 'cat',
            description: 'Вывести содержимое файла в терминал',
            example: 'cat README.md',
            category: 'Просмотр'
        },
        {
            command: 'grep',
            description: 'Искать текст в файлах или выводе команд',
            example: 'grep "error" log.txt  # найти строки с "error"',
            category: 'Поиск'
        },
        {
            command: 'sudo',
            description: 'Выполнить команду с правами суперпользователя (администратора)',
            example: 'sudo apt update  # обновить пакеты',
            category: 'Права'
        },
        {
            command: 'chmod',
            description: 'Изменить права доступа к файлу или директории',
            example: 'chmod +x script.sh  # сделать файл исполняемым',
            category: 'Права'
        }
    ],
    git: [
        {
            command: 'git init',
            description: 'Инициализировать новый Git-репозиторий в текущей папке',
            example: 'git init',
            category: 'Основы Git'
        },
        {
            command: 'git clone',
            description: 'Клонировать (скопировать) существующий репозиторий с сервера',
            example: 'git clone https://github.com/user/repo.git',
            category: 'Основы Git'
        },
        {
            command: 'git status',
            description: 'Показать текущее состояние репозитория: измененные файлы, что подготовлено к коммиту',
            example: 'git status',
            category: 'Основы Git'
        },
        {
            command: 'git add',
            description: 'Добавить файлы в индекс (подготовить к коммиту)',
            example: 'git add file.txt  # добавить конкретный файл\ngit add .          # добавить все измененные файлы',
            category: 'Основы Git'
        },
        {
            command: 'git commit',
            description: 'Создать коммит: сохранить подготовленные изменения в истории репозитория',
            example: 'git commit -m "Добавлена главная страница"',
            category: 'Основы Git'
        },
        {
            command: 'git push',
            description: 'Отправить локальные коммиты на удаленный репозиторий (сервер)',
            example: 'git push origin main\ngit push  # короткая форма',
            category: 'Удаленный репозиторий'
        },
        {
            command: 'git pull',
            description: 'Загрузить изменения с удаленного репозитория и слить с локальной версией',
            example: 'git pull origin main',
            category: 'Удаленный репозиторий'
        },
        {
            command: 'git branch',
            description: 'Создать, посмотреть или удалить ветки',
            example: 'git branch feature-login  # создать ветку\ngit branch                 # показать ветки',
            category: 'Ветки'
        },
        {
            command: 'git checkout',
            description: 'Переключиться на другую ветку или восстановить файлы',
            example: 'git checkout main\ngit checkout -b new-feature  # создать и переключиться',
            category: 'Ветки'
        },
        {
            command: 'git merge',
            description: 'Слить изменения из одной ветки в текущую',
            example: 'git merge feature-login',
            category: 'Ветки'
        },
        {
            command: 'git log',
            description: 'Показать историю коммитов',
            example: 'git log\ngit log --oneline  # краткий вид',
            category: 'История'
        },
        {
            command: 'git diff',
            description: 'Показать различия между версиями файлов (что было изменено)',
            example: 'git diff\ngit diff --staged  # что подготовлено к коммиту',
            category: 'История'
        }
    ]
};

// Объединяем все команды в один массив
const ALL_COMMANDS = [...COMMANDS.linux, ...COMMANDS.git];

// Вопросы для тренажера (Duolingo-style - заполни пропуск)
const TRAINER_QUESTIONS = [
    ...COMMANDS.linux.slice(0, 8).map(cmd => ({
        ...cmd,
        type: 'linux',
        question: 'Какая команда используется для этого?',
        parts: null
    })),
    ...COMMANDS.git.slice(0, 10).map(cmd => ({
        ...cmd,
        type: 'git',
        question: 'Какая команда Git используется для этого?',
        parts: null
    })),
    // Сценарии использования
    {
        question: 'Ты хочешь посмотреть, какие файлы лежат в текущей папке',
        fullCommand: 'ls -la',
        blanks: [0],
        options: ['ls', 'cd', 'dir', 'list', 'cat'],
        description: 'ls показывает содержимое директории'
    },
    {
        question: 'Перейди в папку Documents',
        fullCommand: 'cd Documents',
        blanks: [0],
        options: ['cd', 'mv', 'go', 'chdir', 'open'],
        description: 'cd (change directory) меняет текущую папку'
    },
    {
        question: 'Узнай, в какой папке ты сейчас находишься',
        fullCommand: 'pwd',
        blanks: [0],
        options: ['pwd', 'whoami', 'ls', 'dir', 'where'],
        description: 'pwd (print working directory) показывает текущий путь'
    },
    {
        question: 'Создай новую папку с именем проекта',
        fullCommand: 'mkdir my-project',
        blanks: [0],
        options: ['mkdir', 'mkfile', 'touch', 'newdir', 'create'],
        description: 'mkdir (make directory) создаёт новую папку'
    },
    {
        question: 'Инициализируй новый Git репозиторий',
        fullCommand: 'git init',
        blanks: [1],
        options: ['start', 'init', 'create', 'new', 'begin'],
        description: 'git init создаёт новый репозиторий'
    },
    {
        question: 'Проверь статус файлов в репозитории',
        fullCommand: 'git status',
        blanks: [1],
        options: ['status', 'check', 'info', 'stat', 'list'],
        description: 'git status показывает состояние рабочей копии'
    },
    {
        question: 'Подготовь все файлы к коммиту',
        fullCommand: 'git add .',
        blanks: [1],
        options: ['add', 'push', 'put', 'commit', 'stage'],
        description: 'git add добавляет файлы в индекс'
    },
    {
        question: 'Создай коммит с сообщением "Исправлен баг"',
        fullCommand: 'git commit -m "Исправлен баг"',
        blanks: [1],
        options: ['commit', 'save', 'push', 'create', 'snap'],
        description: 'git commit сохраняет изменения в истории'
    },
    {
        question: 'Отправь коммиты на сервер GitHub',
        fullCommand: 'git push origin main',
        blanks: [1],
        options: ['push', 'send', 'upload', 'pull', 'put'],
        description: 'git push отправляет изменения на удалённый репозиторий'
    },
    {
        question: 'Получи последние изменения с сервера',
        fullCommand: 'git pull origin main',
        blanks: [1],
        options: ['pull', 'fetch', 'download', 'get', 'load'],
        description: 'git pull скачивает и интегрирует изменения с сервера'
    },
    {
        question: 'Создай новую ветку для фичи',
        fullCommand: 'git checkout -b feature-auth',
        blanks: [1],
        options: ['checkout', 'branch', 'switch', 'create', 'new'],
        description: 'git checkout -b создаёт и сразу переключается на новую ветку'
    },
    {
        question: 'Посмотри историю всех коммитов',
        fullCommand: 'git log --oneline',
        blanks: [1],
        options: ['log', 'history', 'list', 'show', 'commits'],
        description: 'git log показывает историю коммитов'
    },
    {
        question: 'Клонируй репозиторий с GitHub',
        fullCommand: 'git clone https://github.com/user/repo.git',
        blanks: [1],
        options: ['clone', 'copy', 'download', 'get', 'fork'],
        description: 'git clone создаёт локальную копию удалённого репозитория'
    },
    {
        question: 'Создай новый пустой файл readme.txt',
        fullCommand: 'touch readme.txt',
        blanks: [0],
        options: ['touch', 'new', 'create', 'make', 'cat'],
        description: 'touch создаёт пустой файл или обновляет время существующего'
    },
    {
        question: 'Посмотри содержимое файла README.md',
        fullCommand: 'cat README.md',
        blanks: [0],
        options: ['cat', 'view', 'show', 'read', 'open'],
        description: 'cat выводит содержимое файла в терминал'
    }
];

// Вопросы для теста
const TEST_QUESTIONS = [
    {
        question: 'Какая команда показывает содержимое текущей директории?',
        options: ['ls', 'cd', 'pwd', 'dir'],
        correct: 0,
        explanation: 'ls = list - показывает список файлов и папок'
    },
    {
        question: 'Как перейти в родительскую директорию (на уровень выше)?',
        options: ['cd /', 'cd ..', 'cd ~', 'cd -'],
        correct: 1,
        explanation: '.. означает родительскую директорию'
    },
    {
        question: 'Какая команда инициализирует Git репозиторий?',
        options: ['git start', 'git new', 'git init', 'git create'],
        correct: 2,
        explanation: 'git init создаёт новый Git репозиторий в папке'
    },
    {
        question: 'Как добавить ВСЕ измененные файлы в индекс?',
        options: ['git add --all', 'git add *', 'git add .', 'Все варианты'],
        correct: 3,
        explanation: 'Все эти команды работают, но git add . — самый распространенный'
    },
    {
        question: 'Что делает git commit -m "сообщение"?',
        options: ['Отправляет на сервер', 'Сохраняет изменения в истории', 'Скачивает обновления', 'Показывает статус'],
        correct: 1,
        explanation: 'commit создаёт снимок состояния проекта с сообщением'
    },
    {
        question: 'Какая команда отправляет коммиты на удаленный репозиторий?',
        options: ['git send', 'git upload', 'git push', 'git put'],
        correct: 2,
        explanation: 'git push отправляет твои коммиты на сервер (например GitHub)'
    },
    {
        question: 'Что делает команда pwd?',
        options: ['Меняет пароль', 'Показывает текущую директорию', 'Печатает файл', 'Ищет файлы'],
        correct: 1,
        explanation: 'pwd = print working directory — показывает где ты сейчас'
    },
    {
        question: 'Как создать новую директорию "projects"?',
        options: ['new projects', 'dir projects', 'mkdir projects', 'touch projects'],
        correct: 2,
        explanation: 'mkdir = make directory — создаёт новую папку'
    },
    {
        question: 'Какая команда создаёт пустой файл?',
        options: ['mkfile', 'touch', 'new', 'create'],
        correct: 1,
        explanation: 'touch создаёт пустой файл или обновляет время существующего'
    },
    {
        question: 'Что делает git pull?',
        options: ['Тянет изменения с сервера', 'Отправляет изменения', 'Удаляет файлы', 'Создает ветку'],
        correct: 0,
        explanation: 'git pull скачивает изменения с сервера и сливает их с твоей версией'
    },
    {
        question: 'Как посмотреть историю коммитов?',
        options: ['git history', 'git log', 'git commits', 'git show'],
        correct: 1,
        explanation: 'git log показывает список всех коммитов'
    },
    {
        question: 'Какая команда переключает ветки?',
        options: ['git switch', 'git checkout', 'Обе команды', 'git branch'],
        correct: 2,
        explanation: 'И git checkout, и git switch работают для переключения веток'
    },
    {
        question: 'Что делает команда rm -rf folder/?',
        options: ['Копирует папку', 'Перемещает папку', 'Удаляет папку и все её содержимое', 'Переименовывает папку'],
        correct: 2,
        explanation: 'rm удаляет, -r рекурсивно, -f принудительно — БУДЬ ОСТОРОЖЕН!'
    },
    {
        question: 'Как клонировать репозиторий?',
        options: ['git copy <url>', 'git clone <url>', 'git get <url>', 'git download <url>'],
        correct: 1,
        explanation: 'git clone создаёт локальную копию удалённого репозитория'
    },
    {
        question: 'Что показывает команда git status?',
        options: ['Историю коммитов', 'Список веток', 'Состояние файлов в репозитории', 'Список удаленных репозиториев'],
        correct: 2,
        explanation: 'git status показывает какие файлы изменены, добавлены или готовы к коммиту'
    }
];
