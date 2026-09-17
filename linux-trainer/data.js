// Данные для тренажера: команды Linux, основы Bash, команды и термины Git
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
    bash: [
        {
            command: 'echo',
            description: 'Вывести текст или значение переменной в терминал',
            example: 'echo "Привет!"  # вывод: Привет!\necho $HOME      # вывод: /home/user',
            category: 'Основы Bash'
        },
        {
            command: '|',
            description: 'Пайп (конвейер): передать вывод одной команды на вход другой',
            example: 'cat log.txt | grep error  # найти ошибки в логе\nls | wc -l                # посчитать файлы',
            category: 'Основы Bash'
        },
        {
            command: '>',
            description: 'Перенаправить вывод в файл. Внимание: файл будет перезаписан!',
            example: 'ls > files.txt  # сохранить список файлов в файл',
            category: 'Основы Bash'
        },
        {
            command: '>>',
            description: 'Дописать вывод в конец файла (содержимое сохраняется)',
            example: 'echo "новая строка" >> notes.txt',
            category: 'Основы Bash'
        },
        {
            command: '&&',
            description: 'Выполнить следующую команду, только если предыдущая завершилась успешно',
            example: 'mkdir build && cd build  # создал папку — зашёл в неё',
            category: 'Основы Bash'
        },
        {
            command: '*',
            description: 'Шаблон «любые символы»: выбирает файлы по маске имени',
            example: 'ls *.txt  # все файлы с расширением .txt\nrm *.tmp  # удалить все временные файлы',
            category: 'Основы Bash'
        },
        {
            command: '$VAR',
            description: 'Переменная: хранит значение. $ перед именем — прочитать значение',
            example: 'NAME=Anna   # создать переменную (без пробелов!)\necho $NAME  # вывод: Anna',
            category: 'Основы Bash'
        },
        {
            command: 'export',
            description: 'Сделать переменную доступной всем программам (переменная окружения)',
            example: 'export EDITOR=nano  # теперь git будет открывать nano',
            category: 'Основы Bash'
        },
        {
            command: 'history',
            description: 'Показать историю введённых команд',
            example: 'history  # список недавних команд\n# Совет: стрелка ↑ возвращает предыдущую команду',
            category: 'Основы Bash'
        },
        {
            command: 'man',
            description: 'Открыть встроенную справку (руководство) по команде',
            example: 'man ls  # всё о команде ls; выход — клавиша q',
            category: 'Основы Bash'
        },
        {
            command: 'which',
            description: 'Показать путь к программе, которая будет запущена',
            example: 'which python3  # вывод: /usr/bin/python3',
            category: 'Основы Bash'
        },
        {
            command: 'clear',
            description: 'Очистить экран терминала',
            example: 'clear  # или горячие клавиши Ctrl+L',
            category: 'Основы Bash'
        }
    ],
    git: [
        {
            command: 'git init',
            description: 'Инициализировать новый Git-репозиторий в текущей папке',
            example: 'git init  # создаёт скрытую папку .git',
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
            example: 'git status  # запускай по любому поводу!',
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
            example: 'git pull origin main  # = git fetch + git merge',
            category: 'Удаленный репозиторий'
        },
        {
            command: 'git fetch',
            description: 'Скачать изменения с сервера, НО не сливать их с твоим кодом',
            example: 'git fetch origin  # просто посмотреть, что нового',
            category: 'Удаленный репозиторий'
        },
        {
            command: 'git remote',
            description: 'Управление удалёнными репозиториями (серверами)',
            example: 'git remote -v  # показать имена и адреса серверов',
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
            command: 'git switch',
            description: 'Переключиться на другую ветку (современная замена checkout)',
            example: 'git switch main\ngit switch -c new-branch  # создать и переключиться',
            category: 'Ветки'
        },
        {
            command: 'git merge',
            description: 'Слить изменения из одной ветки в текущую',
            example: 'git merge feature-login',
            category: 'Ветки'
        },
        {
            command: 'git rebase',
            description: 'Перенести свои коммиты поверх другой ветки (история остаётся ровной)',
            example: 'git rebase main  # перенести текущую ветку на свежий main',
            category: 'Ветки'
        },
        {
            command: 'git log',
            description: 'Показать историю коммитов',
            example: 'git log\ngit log --oneline  # краткий вид: хеш + сообщение',
            category: 'История'
        },
        {
            command: 'git diff',
            description: 'Показать различия между версиями файлов (что было изменено)',
            example: 'git diff\ngit diff --staged  # что подготовлено к коммиту',
            category: 'История'
        },
        {
            command: 'git show',
            description: 'Показать подробности коммита: автор, дата, все изменения',
            example: 'git show HEAD  # последний коммит',
            category: 'История'
        },
        {
            command: 'git restore',
            description: 'Отменить незакоммиченные изменения в файлах',
            example: 'git restore file.txt  # вернуть файл к последнему коммиту\ngit restore .          # отменить все правки (осторожно!)',
            category: 'Отмена изменений'
        },
        {
            command: 'git reset',
            description: 'Убрать файлы из индекса или откатить коммиты',
            example: 'git reset file.txt    # убрать из индекса\ngit reset --hard HEAD # откатить всё (осторожно!)',
            category: 'Отмена изменений'
        },
        {
            command: 'git stash',
            description: 'Временно спрятать незаконченные изменения',
            example: 'git stash      # спрятать «в карман»\ngit stash pop  # достать обратно',
            category: 'Отмена изменений'
        },
        {
            command: 'git tag',
            description: 'Поставить именную метку (обычно номер версии) на коммит',
            example: 'git tag v1.0\ngit push origin v1.0  # отправить тег на сервер',
            category: 'Теги'
        },
        {
            command: 'git config',
            description: 'Настройки Git: имя, почта и другие параметры',
            example: 'git config --global user.name "Anna"\ngit config --global user.email "anna@mail.com"',
            category: 'Настройка'
        }
    ],
    terms: [
        {
            command: 'репозиторий (repository)',
            description: 'Папка проекта под контролем Git: хранит файлы и всю историю изменений',
            example: 'локальный — на твоём компьютере\nудалённый — на сервере (GitHub, GitLab)',
            category: 'Термины Git'
        },
        {
            command: 'коммит (commit)',
            description: 'Снимок изменений с описанием — «точка сохранения» в истории проекта',
            example: 'git commit -m "Добавил страницу входа"',
            category: 'Термины Git'
        },
        {
            command: 'ветка (branch)',
            description: 'Отдельная линия разработки: работаешь над фичей, не ломая основной код',
            example: 'git branch feature  # создать ветку\ngit switch feature  # перейти на неё',
            category: 'Термины Git'
        },
        {
            command: 'HEAD',
            description: 'Указатель на коммит, на котором ты сейчас находишься (обычно конец текущей ветки)',
            example: 'git show HEAD  # что в последнем коммите',
            category: 'Термины Git'
        },
        {
            command: 'origin',
            description: 'Стандартное имя удалённого репозитория, откуда ты клонировал проект',
            example: 'git push origin main  # отправить на origin\n# проверить адрес: git remote -v',
            category: 'Термины Git'
        },
        {
            command: 'индекс (staging area)',
            description: '«Зона подготовки»: файлы, отобранные для следующего коммита',
            example: 'git add file.txt  # файл попал в индекс\ngit status        # зелёные — в индексе',
            category: 'Термины Git'
        },
        {
            command: 'рабочая копия (working tree)',
            description: 'Файлы проекта на диске, с которыми ты работаешь прямо сейчас',
            example: 'git status   # что изменилось в рабочей копии\ngit restore . # откатить рабочую копию к коммиту',
            category: 'Термины Git'
        },
        {
            command: 'слияние (merge)',
            description: 'Объединение изменений из одной ветки в другую',
            example: 'git merge feature  # влить feature в текущую ветку',
            category: 'Термины Git'
        },
        {
            command: 'конфликт (conflict)',
            description: 'Git не смог сам объединить изменения: одни строки правили по-разному. Нужно разрулить вручную',
            example: 'открой файл, найди метки <<<<<<< и >>>>>>>\nотредактируй, затем: git add . → git commit',
            category: 'Термины Git'
        },
        {
            command: 'форк (fork)',
            description: 'Твоя копия чужого репозитория на сервере — чтобы предлагать изменения в чужой проект',
            example: 'кнопка Fork на GitHub → потом clone своей копии',
            category: 'Термины Git'
        },
        {
            command: 'пул-реквест (pull request)',
            description: 'Предложение влить твои изменения в другой репозиторий или ветку. Основа командной работы',
            example: 'push ветки → кнопка "Create pull request" на GitHub',
            category: 'Термины Git'
        },
        {
            command: 'хеш коммита (SHA)',
            description: 'Уникальный «номер» коммита из 40 символов, например a1b2c3d4...',
            example: 'git log --oneline  # короткие хеши слева',
            category: 'Термины Git'
        },
        {
            command: '.gitignore',
            description: 'Файл со списком того, что Git должен игнорировать (не отслеживать)',
            example: 'node_modules/\n*.log\n.env  # секреты сюда!',
            category: 'Термины Git'
        },
        {
            command: 'тег (tag)',
            description: 'Постоянная именная метка на коммите — обычно номер версии релиза',
            example: 'git tag v1.0  # коммит помечен как версия 1.0',
            category: 'Термины Git'
        }
    ]
};

// Объединяем все карточки в один массив (порядок обучения: Linux → Bash → Git → термины)
const ALL_COMMANDS = [...COMMANDS.linux, ...COMMANDS.bash, ...COMMANDS.git, ...COMMANDS.terms];

// Вопросы для тренажера (Duolingo-style — собери команду).
// У каждого вопроса явно написана ЗАДАЧА (task) — что должна сделать команда,
// поэтому всегда понятно, что нужно угадать.
// topic — тема (плашка сверху), fullCommand — полная команда,
// blanks — индексы слов-пропусков, options — варианты (один правильный),
// hint — объяснение после ответа.
const TRAINER_QUESTIONS = [
    // ========== LINUX ==========
    {
        topic: 'Linux',
        task: 'Покажи список файлов в текущей папке (подробно, со скрытыми файлами)',
        fullCommand: 'ls -la',
        blanks: [0],
        options: ['ls', 'cd', 'cat', 'pwd', 'dir'],
        hint: 'ls (list) показывает содержимое папки. Флаг -la: подробный список + скрытые файлы'
    },
    {
        topic: 'Linux',
        task: 'Перейди в папку Documents',
        fullCommand: 'cd Documents',
        blanks: [0],
        options: ['cd', 'mv', 'ls', 'open', 'goto'],
        hint: 'cd (change directory) меняет текущую папку. cd .. — на уровень выше'
    },
    {
        topic: 'Linux',
        task: 'Узнай, в какой папке ты сейчас находишься',
        fullCommand: 'pwd',
        blanks: [0],
        options: ['pwd', 'ls', 'cd', 'dir', 'whereami'],
        hint: 'pwd (print working directory) печатает полный путь текущей папки'
    },
    {
        topic: 'Linux',
        task: 'Создай новую папку projects',
        fullCommand: 'mkdir projects',
        blanks: [0],
        options: ['mkdir', 'touch', 'newdir', 'mk', 'create'],
        hint: 'mkdir (make directory) создаёт папку. Вложенные папки: mkdir -p a/b/c'
    },
    {
        topic: 'Linux',
        task: 'Создай пустой файл readme.txt',
        fullCommand: 'touch readme.txt',
        blanks: [0],
        options: ['touch', 'cat', 'echo', 'mkdir', 'newfile'],
        hint: 'touch создаёт пустой файл (или обновляет дату изменения существующего)'
    },
    {
        topic: 'Linux',
        task: 'Скопируй файл notes.txt в backup.txt',
        fullCommand: 'cp notes.txt backup.txt',
        blanks: [0],
        options: ['cp', 'mv', 'copy', 'cat', 'rsync'],
        hint: 'cp (copy) копирует: cp ЧТО КУДА. Для папок добавь флаг -r'
    },
    {
        topic: 'Linux',
        task: 'Переименуй файл draft.txt в final.txt',
        fullCommand: 'mv draft.txt final.txt',
        blanks: [0],
        options: ['mv', 'cp', 'rename', 'rm', 'rn'],
        hint: 'mv (move) и перемещает, и переименовывает файлы'
    },
    {
        topic: 'Linux',
        task: 'Удали файл temp.log',
        fullCommand: 'rm temp.log',
        blanks: [0],
        options: ['rm', 'del', 'erase', 'mv', 'rmdir'],
        hint: 'rm (remove) удаляет навсегда — корзины в терминале нет!'
    },
    {
        topic: 'Linux',
        task: 'Посмотри содержимое файла config.txt',
        fullCommand: 'cat config.txt',
        blanks: [0],
        options: ['cat', 'ls', 'echo', 'grep', 'view'],
        hint: 'cat выводит весь файл в терминал одним куском'
    },
    {
        topic: 'Linux',
        task: 'Найди строки со словом error в файле app.log',
        fullCommand: 'grep error app.log',
        blanks: [0],
        options: ['grep', 'find', 'cat', 'sed', 'search'],
        hint: 'grep ЧТО_ИСКАТЬ ГДЕ — показывает только строки, где нашёлся текст'
    },
    {
        topic: 'Linux',
        task: 'Обнови список пакетов — обычным пользователям это запрещено',
        fullCommand: 'sudo apt update',
        blanks: [0],
        options: ['sudo', 'root', 'admin', 'su', 'runas'],
        hint: 'sudo запускает команду с правами суперпользователя (спросит пароль)'
    },
    {
        topic: 'Linux',
        task: 'Сделай скрипт start.sh исполняемым, чтобы его можно было запускать',
        fullCommand: 'chmod +x start.sh',
        blanks: [0],
        options: ['chmod', 'chown', 'sudo', 'exec', 'permit'],
        hint: 'chmod меняет права доступа; +x разрешает запускать файл как программу'
    },
    // ========== BASH (основы языка) ==========
    {
        topic: 'Bash',
        task: 'Выведи в терминал текст Hello!',
        fullCommand: 'echo Hello!',
        blanks: [0],
        options: ['echo', 'print', 'cat', 'say', 'show'],
        hint: 'echo печатает текст в терминал — «Hello, World» командной строки'
    },
    {
        topic: 'Bash',
        task: 'Выведи значение переменной HOME (путь к домашней папке)',
        fullCommand: 'echo $HOME',
        blanks: [1],
        options: ['$HOME', 'HOME', '#HOME', '@HOME', '%HOME'],
        hint: '$ перед именем читает значение переменной: echo $HOME → /home/user'
    },
    {
        topic: 'Bash',
        task: 'Найди ошибки в логе: передай вывод cat на вход grep',
        fullCommand: 'cat app.log | grep error',
        blanks: [2],
        options: ['|', '>', '&&', ';', '<'],
        hint: 'Пайп | соединяет команды: вывод левой становится входом правой'
    },
    {
        topic: 'Bash',
        task: 'Сохрани список файлов в list.txt, перезаписав этот файл',
        fullCommand: 'ls > list.txt',
        blanks: [1],
        options: ['>', '>>', '|', '<', '&&'],
        hint: '> отправляет вывод в файл, полностью перезаписывая его'
    },
    {
        topic: 'Bash',
        task: 'Допиши запись в конец notes.txt, НЕ стирая содержимое файла',
        fullCommand: 'echo milk >> notes.txt',
        blanks: [2],
        options: ['>>', '>', '|', '<', '&&'],
        hint: '>> дописывает в конец файла (append), а > стёр бы файл и записал заново'
    },
    {
        topic: 'Bash',
        task: 'Создай папку build и, если всё получилось, сразу зайди в неё',
        fullCommand: 'mkdir build && cd build',
        blanks: [2],
        options: ['&&', '||', '|', ';', '>'],
        hint: '&& выполняет вторую команду, только если первая завершилась успешно'
    },
    {
        topic: 'Bash',
        task: 'Покажи в текущей папке только файлы с расширением .txt',
        fullCommand: 'ls *.txt',
        blanks: [1],
        options: ['*.txt', '?.txt', '#txt', 'all.txt', 'txt.all'],
        hint: '* — шаблон «любые символы»: *.txt — всё, что заканчивается на .txt'
    },
    {
        topic: 'Bash',
        task: 'Сохрани своё имя в переменную NAME',
        fullCommand: 'NAME=Anna',
        blanks: [0],
        options: ['NAME=Anna', '$NAME=Anna', 'set NAME Anna', 'var NAME=Anna', 'NAME : Anna'],
        hint: 'Переменная создаётся как ИМЯ=значение — без пробелов и без $. $ нужен только при чтении'
    },
    {
        topic: 'Bash',
        task: 'Посмотри историю команд, которые ты вводил раньше',
        fullCommand: 'history',
        blanks: [0],
        options: ['history', 'log', 'past', 'journal', 'man'],
        hint: 'history — список недавних команд. Стрелка ↑ возвращает предыдущую команду'
    },
    {
        topic: 'Bash',
        task: 'Открой встроенную справку по команде ls',
        fullCommand: 'man ls',
        blanks: [0],
        options: ['man', 'help', 'info', 'doc', 'about'],
        hint: 'man (manual) — справочник по любой команде. Листай стрелками, выход — q'
    },
    {
        topic: 'Bash',
        task: 'Узнай, где на диске установлена программа python3',
        fullCommand: 'which python3',
        blanks: [0],
        options: ['which', 'where', 'find', 'locate', 'grep'],
        hint: 'which показывает путь к файлу программы, например /usr/bin/python3'
    },
    {
        topic: 'Bash',
        task: 'Очисти экран терминала от лишнего текста',
        fullCommand: 'clear',
        blanks: [0],
        options: ['clear', 'clean', 'cls', 'wipe', 'reset'],
        hint: 'clear очищает экран; то же самое делает сочетание Ctrl+L'
    },
    // ========== GIT ==========
    {
        topic: 'Git',
        task: 'Преврати текущую папку в Git-репозиторий',
        fullCommand: 'git init',
        blanks: [1],
        options: ['init', 'start', 'create', 'new', 'open'],
        hint: 'git init создаёт скрытую папку .git — с этого момента Git следит за проектом'
    },
    {
        topic: 'Git',
        task: 'Склонируй репозиторий с GitHub на свой компьютер',
        fullCommand: 'git clone https://github.com/user/repo.git',
        blanks: [1],
        options: ['clone', 'copy', 'download', 'get', 'fork'],
        hint: 'git clone скачивает репозиторий целиком, вместе с историей изменений'
    },
    {
        topic: 'Git',
        task: 'Проверь, какие файлы изменены и что готово к коммиту',
        fullCommand: 'git status',
        blanks: [1],
        options: ['status', 'check', 'info', 'stat', 'list'],
        hint: 'git status — главная команда Git. Запускай её по любому поводу!'
    },
    {
        topic: 'Git',
        task: 'Подготовь ВСЕ изменённые файлы к коммиту',
        fullCommand: 'git add .',
        blanks: [1],
        options: ['add', 'stage', 'push', 'commit', 'put'],
        hint: 'git add кладёт файлы в индекс (staging area); точка — «все изменения в папке»'
    },
    {
        topic: 'Git',
        task: 'Сделай коммит с сообщением "Исправлен баг"',
        fullCommand: 'git commit -m "Исправлен баг"',
        blanks: [1],
        options: ['commit', 'save', 'push', 'snap', 'record'],
        hint: 'git commit -m "текст" сохраняет снимок подготовленных изменений в историю'
    },
    {
        topic: 'Git',
        task: 'Отправь свои коммиты на сервер (например, на GitHub)',
        fullCommand: 'git push origin main',
        blanks: [1],
        options: ['push', 'send', 'upload', 'pull', 'put'],
        hint: 'git push origin main отправляет локальную ветку main на сервер origin'
    },
    {
        topic: 'Git',
        task: 'Забери свежие изменения с сервера и сляй их со своим кодом',
        fullCommand: 'git pull origin main',
        blanks: [1],
        options: ['pull', 'fetch', 'download', 'get', 'load'],
        hint: 'git pull = git fetch + git merge: скачать и сразу слить с текущей веткой'
    },
    {
        topic: 'Git',
        task: 'Скачай обновления с сервера, НЕ меняя свой код — просто посмотреть, что нового',
        fullCommand: 'git fetch origin',
        blanks: [1],
        options: ['fetch', 'pull', 'clone', 'checkout', 'sync'],
        hint: 'git fetch только скачивает новости — твои файлы остаются нетронутыми'
    },
    {
        topic: 'Git',
        task: 'Создай новую ветку feature (переключаться на неё не нужно)',
        fullCommand: 'git branch feature',
        blanks: [1],
        options: ['branch', 'switch', 'checkout', 'fork', 'new'],
        hint: 'git branch имя создаёт ветку, но не переключает на неё. Без имени — список веток'
    },
    {
        topic: 'Git',
        task: 'Переключись на ветку main',
        fullCommand: 'git switch main',
        blanks: [1],
        options: ['switch', 'branch', 'merge', 'jump', 'open'],
        hint: 'git switch — современная команда переключения веток (замена git checkout)'
    },
    {
        topic: 'Git',
        task: 'Создай ветку fix-bug и сразу перейди на неё',
        fullCommand: 'git checkout -b fix-bug',
        blanks: [1],
        options: ['checkout', 'switch', 'branch', 'merge', 'init'],
        hint: 'git checkout -b создаёт ветку и переключается одной командой (аналог: git switch -c)'
    },
    {
        topic: 'Git',
        task: 'Влей изменения из ветки feature в текущую ветку',
        fullCommand: 'git merge feature',
        blanks: [1],
        options: ['merge', 'join', 'combine', 'mix', 'union'],
        hint: 'git merge сливает указанную ветку с той, где ты находишься сейчас'
    },
    {
        topic: 'Git',
        task: 'Посмотри историю коммитов в компактном виде — по одной строке на коммит',
        fullCommand: 'git log --oneline',
        blanks: [1],
        options: ['log', 'history', 'show', 'list', 'commits'],
        hint: 'git log --oneline: короткий хеш + сообщение. Полный вид — просто git log'
    },
    {
        topic: 'Git',
        task: 'Посмотри, какие именно строки изменились в файлах с прошлого коммита',
        fullCommand: 'git diff',
        blanks: [1],
        options: ['diff', 'compare', 'changes', 'status', 'log'],
        hint: 'git diff показывает разницу построчно: красное — удалено, зелёное — добавлено'
    },
    {
        topic: 'Git',
        task: 'Нужно срочно сменить ветку: временно спрячь незаконченные изменения',
        fullCommand: 'git stash',
        blanks: [1],
        options: ['stash', 'hide', 'save', 'shelve', 'park'],
        hint: 'git stash прячет изменения «в карман». Достать обратно: git stash pop'
    },
    {
        topic: 'Git',
        task: 'Отмени все незакоммиченные правки — верни файлы к последнему коммиту',
        fullCommand: 'git restore .',
        blanks: [1],
        options: ['restore', 'reset', 'undo', 'revert', 'clean'],
        hint: 'git restore . отменяет изменения в рабочей копии. Восстановить их уже нельзя!'
    },
    {
        topic: 'Git',
        task: 'Покажи, к каким серверам привязан этот репозиторий',
        fullCommand: 'git remote -v',
        blanks: [1],
        options: ['remote', 'origin', 'url', 'server', 'link'],
        hint: 'git remote -v показывает имена (обычно origin) и адреса удалённых репозиториев'
    },
    {
        topic: 'Git',
        task: 'Поставь метку v1.0 на текущий коммит — отметь версию релиза',
        fullCommand: 'git tag v1.0',
        blanks: [1],
        options: ['tag', 'label', 'mark', 'version', 'release'],
        hint: 'git tag v1.0 ставит постоянную метку. Отправить тег: git push origin v1.0'
    },
    {
        topic: 'Git',
        task: 'Посмотри подробности последнего коммита: кто, когда и что изменил',
        fullCommand: 'git show HEAD',
        blanks: [1],
        options: ['show', 'log', 'diff', 'cat', 'view'],
        hint: 'HEAD — указатель на текущий коммит. git show HEAD покажет его целиком'
    },
    {
        topic: 'Git',
        task: 'Укажи своё имя, которым будут подписываться все твои коммиты',
        fullCommand: 'git config --global user.name "Anna"',
        blanks: [1],
        options: ['config', 'set', 'user', 'name', 'setup'],
        hint: 'git config --global настраивает Git один раз для всех твоих проектов'
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
    },
    // ========== Основы Bash ==========
    {
        question: 'Что делает символ | (пайп) между двумя командами?',
        options: ['Передаёт вывод первой команды на вход второй', 'Запускает команды одновременно', 'Выполняет одну из двух команд', 'Разделяет аргументы команды'],
        correct: 0,
        explanation: 'cat log.txt | grep error: сначала cat выводит файл, потом grep фильтрует строки'
    },
    {
        question: 'Как сохранить вывод команды ls в файл files.txt, перезаписав его?',
        options: ['ls >> files.txt', 'ls > files.txt', 'ls | files.txt', 'files.txt < ls'],
        correct: 1,
        explanation: '> перезаписывает файл выводом команды, >> дописывает в конец'
    },
    {
        question: 'Чем >> отличается от >?',
        options: ['Ничем, это одно и то же', '>> дописывает в конец файла, > перезаписывает файл', '>> работает быстрее', '> дописывает, а >> перезаписывает'],
        correct: 1,
        explanation: '>> — append (добавить в конец), > — overwrite (стереть и записать заново)'
    },
    {
        question: 'Как правильно создать переменную NAME со значением Anna в Bash?',
        options: ['$NAME=Anna', 'NAME=Anna', 'set NAME Anna', 'var NAME="Anna"'],
        correct: 1,
        explanation: 'ИМЯ=значение — без пробелов и без $. $ нужен только при чтении: echo $NAME'
    },
    {
        question: 'Ты в папке с файлами a.txt и b.txt. Что выведет echo *.txt?',
        options: ['*.txt', 'a.txt b.txt', 'ошибку', 'только a.txt'],
        correct: 1,
        explanation: 'Bash сам раскрывает шаблон *.txt в список подходящих файлов ещё до запуска echo'
    },
    {
        question: 'Что делает команда man ls?',
        options: ['Удаляет команду ls', 'Открывает справочное руководство по ls', 'Показывает версию ls', 'Создаёт файл ls'],
        correct: 1,
        explanation: 'man (manual) — встроенная справка по любой команде. Выйти — клавиша q'
    },
    // ========== Git: команды и термины ==========
    {
        question: 'Что делает git fetch?',
        options: ['Сливает ветки между собой', 'Скачивает изменения с сервера, не трогая твои файлы', 'Отправляет коммиты на сервер', 'Удаляет удалённую ветку'],
        correct: 1,
        explanation: 'fetch — «просто скачать новости». А git pull = fetch + merge'
    },
    {
        question: 'Что такое HEAD в Git?',
        options: ['Первый коммит репозитория', 'Указатель на коммит, на котором ты сейчас находишься', 'Главная ветка проекта', 'Имя сервера'],
        correct: 1,
        explanation: 'HEAD показывает твоё текущее положение: обычно это конец текущей ветки'
    },
    {
        question: 'Что такое origin?',
        options: ['Первая ветка репозитория', 'Стандартное имя удалённого репозитория (сервера)', 'Автор первого коммита', 'Скрытая папка .git'],
        correct: 1,
        explanation: 'При clone Git сам называет сервер origin. Проверить: git remote -v'
    },
    {
        question: 'Что делает git stash?',
        options: ['Безвозвратно удаляет изменения', 'Отправляет изменения на сервер', 'Временно прячет незакоммиченные изменения', 'Создаёт новую ветку'],
        correct: 2,
        explanation: 'stash — «схрон». Изменения прячутся в карман, вернуть: git stash pop'
    },
    {
        question: 'Для чего нужен файл .gitignore?',
        options: ['Хранит настройки Git', 'Список файлов и папок, которые Git не должен отслеживать', 'Список авторов проекта', 'Лог всех команд Git'],
        correct: 1,
        explanation: 'В .gitignore пишут node_modules/, *.log, .env — всё, чему не место в репозитории'
    },
    {
        question: 'Как отменить незакоммиченные правки в файле и вернуть его к последнему коммиту?',
        options: ['git restore file.txt', 'git delete file.txt', 'git undo file.txt', 'git back file.txt'],
        correct: 0,
        explanation: 'git restore отменяет изменения в рабочей копии. Осторожно: правки пропадут насовсем!'
    },
    {
        question: 'Что такое индекс (staging area)?',
        options: ['Папка с бэкапами', 'Зона подготовки: файлы, отобранные для следующего коммита', 'Сервер с репозиторием', 'Последний коммит ветки'],
        correct: 1,
        explanation: 'git add кладёт файл в индекс; git commit сохраняет то, что в индексе'
    },
    {
        question: 'Что такое форк (fork)?',
        options: ['Слияние двух веток', 'Твоя копия чужого репозитория на сервере', 'Ошибка в Git', 'Удалённая ветка'],
        correct: 1,
        explanation: 'Fork — кнопка на GitHub: копия чужого проекта в твоём аккаунте, чтобы предлагать изменения'
    },
    {
        question: 'Что такое пул-реквест (pull request)?',
        options: ['Запрос на скачивание репозитория', 'Предложение влить твои изменения в проект или ветку', 'Команда обновления Git', 'Особый тип ветки'],
        correct: 1,
        explanation: 'PR — это «посмотрите мои изменения и примите, если всё ок». Основа командной работы'
    },
    {
        question: 'Как пометить текущий коммит как версию v1.0?',
        options: ['git version v1.0', 'git mark v1.0', 'git tag v1.0', 'git label v1.0'],
        correct: 2,
        explanation: 'git tag создаёт метку на коммите. Не забудь отправить: git push origin v1.0'
    }
];
