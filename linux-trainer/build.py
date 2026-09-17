#!/usr/bin/env python3
"""Собирает однофайловую версию тренажера.

index.html хранит разметку, а блоки <style> и <script> собираются
из отдельных файлов: style.css + data.js + sound.js + app.js.

Запуск:  python3 build.py
Результат: обновлены linux-trainer/index.html и ../linux-trainer.html
(два идентичных самодостаточных файла, которые можно открыть без сервера).
"""
import re
from pathlib import Path

HERE = Path(__file__).resolve().parent
INDEX = HERE / 'index.html'
STANDALONE = HERE.parent / 'linux-trainer.html'

JS_ORDER = ['data.js', 'sound.js', 'app.js']


def main() -> None:
    html = INDEX.read_text(encoding='utf-8')

    css = (HERE / 'style.css').read_text(encoding='utf-8').strip()
    js = '\n'.join(
        (HERE / name).read_text(encoding='utf-8').strip() for name in JS_ORDER
    )

    html, n_css = re.subn(
        r'<style>.*?</style>',
        lambda m: '<style>\n' + css + '\n</style>',
        html,
        count=1,
        flags=re.S,
    )
    html, n_js = re.subn(
        r'<script>.*?</script>',
        lambda m: '<script>\n' + js + '\n</script>',
        html,
        count=1,
        flags=re.S,
    )

    if n_css != 1 or n_js != 1:
        raise SystemExit(
            f'Ошибка: найдено style-блоков: {n_css}, script-блоков: {n_js} (нужно ровно по одному)'
        )

    INDEX.write_text(html, encoding='utf-8')
    STANDALONE.write_text(html, encoding='utf-8')
    print(f'Готово: {INDEX.name} и {STANDALONE.name} обновлены')


if __name__ == '__main__':
    main()
