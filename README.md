# 🌍 StudyCost

<div align="center">

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Vanilla JS](https://img.shields.io/badge/Vanilla-JS-yellow.svg)](https://developer.mozilla.org/ru/docs/Web/JavaScript)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC.svg)](https://tailwindcss.com/)
[![SPA](https://img.shields.io/badge/SPA-Router-purple.svg)](#)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](#)

**Умный подбор страны для изучения английского языка с учётом бюджета и личных предпочтений**

[Демо](#) · [О проекте](#-о-проекте) · [Возможности](#-возможности) · [Установка](#-установка) · [Технологии](#-технологии)

</div>

## 🧭 О проекте

**StudyCost** — это интерактивный веб‑сервис, который помогает школьникам, студентам и всем желающим подобрать оптимальную страну для изучения английского языка.  
Пользователь указывает бюджет, срок обучения, климатические предпочтения и необходимость подработки, а система на основе реальных экономических данных предлагает топ‑5 вариантов с детализацией расходов.

---

## ✨ Возможности

- **🎯 Пошаговый визард** — удобный ввод бюджета, длительности и предпочтений.
- **💰 Автоматический расчёт** — стоимость курса, проживания, визы и перелёта в рублях.
- **📊 Три режима сортировки** — «Цена/Качество», «Престиж», «Экономия».
- **💾 История подборок** — все результаты сохраняются автоматически, можно вернуться к любому.
- **🏫 Подробные страницы школ** — контакты, описание, стоимость обучения.
- **🌐 Адаптивный дизайн** — комфортный просмотр на любых устройствах.
- **🔍 Глобальный поиск** — фильтрация стран, городов и школ в реальном времени.

---

## 🚀 Установка и запуск

1. **Клонируйте репозиторий**

   ```bash
   git clone https://github.com/yourusername/studycost.git
   cd studycost
   ```

2. **Откройте проект**
   - Просто откройте `index.html` в браузере (работает без сервера).

3. **Для разработки** (опционально)
   - Используйте [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) для автоматической перезагрузки.

---

## 🧰 Технологический стек

| Область          | Технологии                               |
| ---------------- | ---------------------------------------- |
| **Frontend**     | HTML5, CSS3, JavaScript (ES6+)           |
| **UI‑фреймворк** | [Tailwind CSS](https://tailwindcss.com/) |
| **Роутинг**      | Самописный SPA‑роутер                    |
| **Хранилище**    | LocalStorage (состояние и история)       |
| **Данные**       | Статические JSON (курсы валют, школы)    |

---

## 📁 Структура проекта

```
study-cost/
├── index.html
├── css/
│   └── styles.css
├── js/
│   ├── data/
│   │   ├── countries.js
│   │   ├── courses.js
│   │   ├── livingCosts.js
│   │   └── visaCosts.js
│   ├── core/
│   │   ├── state.js
│   │   ├── calculator.js
│   │   └── storage.js
│   ├── ui/
│   │   ├── home.js
│   │   ├── wizard.js
│   │   ├── results.js
│   │   ├── country.js
│   │   ├── school.js
│   │   ├── saved.js
│   │   ├── about.js
│   │   └── helpers.js
│   └── app.js
└── README.md
```

## 📄 Лицензия

Распространяется под лицензией MIT. См. [LICENSE](LICENSE) для подробностей.

---

## 📞 Контакты

**Разработчик**: [Lum1nous](https://github.com/SiveruhinMihail)  
**Email**: 89450.miha@gmail.com

---

<div align="center">
  <sub>Сделано с ❤️ для тех, кто хочет учить английский за рубежом</sub>
</div>
