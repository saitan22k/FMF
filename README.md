# Complex SW СУСТАВЫ — Landing Page

Лендинг для БАД «Complex SW СУСТАВЫ» от Оптисалт.  
Чистый HTML/CSS/JS без фреймворков и сборщиков.

---

## Структура проекта

```
FMF/
├── index.html        # Единственная страница, все секции в порядке DOM
├── css/
│   └── style.css     # Все стили: reset → токены → секции → @media 900px → @media 480px
├── js/
│   └── main.js       # Ванильный JS: по одному IIFE на каждую фичу
├── img/              # Все растровые и SVG-ресурсы
└── README.md
```

---

## 1. Верстка по макету

- Одностраничный лендинг, все секции в порядке: header → hero → tagline → benefits → products-trio → composition → target → comparison → price → faq → contact → footer.
- Соблюдены цвета, типографика (шрифт Onest), отступы, border-radius из Figma.
- **BEM**-нейминг для всех классов (`.block__element--modifier`).
- CSS Custom Properties (дизайн-токены в `:root`): цвета, радиусы, тени, переходы.
- Pixel-perfect на десктопе ≥1280px и мобильных 375px.

---

## 2. Оптимизация страницы

### 2.1 Скорость загрузки

| Техника | Реализация |
|---|---|
| Resource hints | `dns-prefetch` + `preconnect` для fonts.googleapis.com / fonts.gstatic.com |
| Font display | `display=swap` — текст виден до загрузки шрифта |
| Lazy loading | `loading="lazy"` на всех изображениях кроме hero |
| Hero eager | `loading="eager"` на главном изображении — браузер приоритизирует |
| Passive listeners | `{ passive: true }` на scroll-обработчиках |
| Без зависимостей | Ванильный JS, без jQuery/React/Bootstrap |
| Один CSS-файл | ~10 KB, нет каскада `@import` |

### 2.2 CLS (Cumulative Layout Shift)

Все изображения имеют явные `width` и `height` — браузер резервирует место до загрузки, сдвига контента нет.

### 2.3 SEO

- Семантические теги: единственный `<h1>`, иерархия h2→h3→h4.
- `alt` на всех значимых изображениях, `aria-hidden="true"` на декоративных.
- Уникальный `<meta name="description">` 150+ символов.
- JSON-LD `Product` schema — расширенные сниппеты в Google.
- Open Graph + Twitter Card — корректный превью при шеринге.

### 2.4 Доступность

- ARIA: `aria-label`, `aria-expanded` на интерактивных элементах.
- `:focus-visible` для навигации с клавиатуры.
- Белый текст на #3193CC — соответствует WCAG AA по контрасту.

### 2.5 Адаптивность

- Breakpoints: `≤900px` (планшет/мобильный), `≤480px` (малый мобильный).
- `overflow-x: hidden` на `body` — нет горизонтального скролла.
- Burger-меню с блокировкой скролла страницы.

---

## 3. Интеграция в CMS

### Bitrix24 / Bitrix CMS

1. В файловом менеджере Bitrix создать папку `/upload/fmf/`
2. Загрузить `img/` → `/upload/fmf/img/`
3. Загрузить `css/style.css` → `/upload/fmf/css/style.css`
4. Загрузить `js/main.js` → `/upload/fmf/js/main.js`
5. Раздел «Сайты и магазины» → создать новую страницу
6. Редактор → режим «HTML» → вставить содержимое `<body>` из `index.html`
7. «Настройки страницы → Дополнительные метатеги» → вставить содержимое `<head>`
8. «Настройки страницы → CSS/JS» → подключить:
   - CSS: `/upload/fmf/css/style.css`
   - JS: `/upload/fmf/js/main.js`
9. Заменить пути к изображениям: `img/` → `/upload/fmf/img/`

### WordPress

1. Создать дочернюю тему или использовать плагин **Custom CSS & JS**
2. В `functions.php`:
```php
function fmf_enqueue() {
    wp_enqueue_style('fmf-style', get_template_directory_uri() . '/fmf/css/style.css');
    wp_enqueue_script('fmf-main', get_template_directory_uri() . '/fmf/js/main.js', [], null, true);
}
add_action('wp_enqueue_scripts', 'fmf_enqueue');
```
3. Создать страницу с шаблоном «Blank Page»
4. Добавить блок «Произвольный HTML» → вставить содержимое `<body>`
5. Мета-теги и JSON-LD добавить через **Yoast SEO** или хук `wp_head`

---

## 4. Запуск локально

```bash
# Открыть напрямую в браузере
open index.html

# Через локальный сервер (рекомендуется)
npx serve .
# → http://localhost:3000

# VS Code: расширение Live Server → ПКМ на index.html → Open with Live Server
```

---

## Технические ограничения

- CSS и JS не минифицированы. При деплое: `cssnano` для стилей, `terser` для скриптов.
- Google Fonts требует интернета. Офлайн: скачать шрифт и подключить через `@font-face`.
- Форма: success-state без реальной отправки. Для интеграции: FormSpree или Bitrix CRM API.
