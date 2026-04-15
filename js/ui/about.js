import { navigateTo } from "../app.js";

const root = document.getElementById("app-root");

export function renderAboutPage() {
  root.innerHTML = `
        <div class="max-w-6xl mx-auto py-8">
            <!-- Hero -->
            <div class="text-center mb-12">
                <h1 class="text-5xl font-bold mb-4" style="color: #1E3A8A;">StudyCost</h1>
                <p class="text-xl text-gray-600 max-w-3xl mx-auto">Прозрачный подбор страны для изучения английского языка</p>
                <button id="start-wizard-btn" class="mt-8 inline-flex items-center px-8 py-4 text-lg font-medium rounded-full text-white bg-blue-800 hover:bg-blue-900 transition shadow-lg">
                    🚀 Начать подбор
                </button>
            </div>
            
            <!-- Миссия и цифры -->
            <div class="grid md:grid-cols-2 gap-8 mb-12">
                <div class="bg-white rounded-2xl p-8 shadow-sm">
                    <h2 class="text-2xl font-semibold mb-4">🎯 Наша миссия</h2>
                    <p class="text-gray-700 leading-relaxed">Мы верим, что планирование обучения за рубежом должно быть простым и честным. StudyCost помогает сравнить реальные расходы и выбрать оптимальный вариант под ваш бюджет, избавляя от необходимости искать информацию на десятках сайтов.</p>
                </div>
                <div class="bg-white rounded-2xl p-8 shadow-sm">
                    <h2 class="text-2xl font-semibold mb-4">📊 Что мы предлагаем</h2>
                    <ul class="space-y-3 text-gray-700">
                        <li class="flex items-center"><span class="text-green-500 mr-2">✓</span> Актуальные цены на курсы английского в 15+ странах</li>
                        <li class="flex items-center"><span class="text-green-500 mr-2">✓</span> Расчёт стоимости проживания, визы и перелёта</li>
                        <li class="flex items-center"><span class="text-green-500 mr-2">✓</span> Подбор по бюджету, климату и возможности подработки</li>
                        <li class="flex items-center"><span class="text-green-500 mr-2">✓</span> Сохранение истории поиска в личном кабинете</li>
                    </ul>
                </div>
            </div>
            
            <!-- Как это работает -->
            <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl p-10 mb-12">
                <h2 class="text-3xl font-bold text-center mb-10">Как это работает</h2>
                <div class="grid md:grid-cols-3 gap-8">
                    <div class="text-center">
                        <div class="w-16 h-16 bg-blue-800 text-white rounded-full flex items-center justify-center text-2xl mx-auto mb-4">1</div>
                        <h3 class="font-semibold text-xl mb-2">Укажите бюджет</h3>
                        <p class="text-gray-600">Сумма, срок, что включить в расчёт</p>
                    </div>
                    <div class="text-center">
                        <div class="w-16 h-16 bg-blue-800 text-white rounded-full flex items-center justify-center text-2xl mx-auto mb-4">2</div>
                        <h3 class="font-semibold text-xl mb-2">Мы анализируем</h3>
                        <p class="text-gray-600">Сравниваем стоимость курсов, проживания, виз</p>
                    </div>
                    <div class="text-center">
                        <div class="w-16 h-16 bg-blue-800 text-white rounded-full flex items-center justify-center text-2xl mx-auto mb-4">3</div>
                        <h3 class="font-semibold text-xl mb-2">Получаете подборку</h3>
                        <p class="text-gray-600">Топ вариантов с детализацией расходов</p>
                    </div>
                </div>
            </div>
            
            <!-- Источники данных -->
            <div class="bg-white rounded-2xl p-8 shadow-sm text-center">
                <h3 class="text-xl font-semibold mb-4">🔍 Откуда данные?</h3>
                <p class="text-gray-600 max-w-2xl mx-auto">Мы собираем информацию из открытых источников: официальных сайтов языковых школ, государственных порталов и агрегаторов. Данные обновляются ежемесячно.</p>
                <p class="mt-4 text-sm text-gray-500">Версия 1.0 · 2025</p>
            </div>
        </div>
    `;

  document.getElementById("start-wizard-btn").addEventListener("click", () => {
    navigateTo("/wizard");
  });
}
