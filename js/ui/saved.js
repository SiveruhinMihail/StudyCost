import { AppState } from "../core/state.js";
import { formatCurrency } from "./helpers.js";
import { navigateTo } from "../app.js";

const root = document.getElementById("app-root");

export function renderSavedPage() {
  const saved = AppState.savedSearches || [];

  if (saved.length === 0) {
    root.innerHTML = `
            <div class="max-w-3xl mx-auto text-center py-12">
                <h2 class="text-2xl font-bold mb-4">📭 Нет сохранённых подборок</h2>
                <p class="text-gray-600 mb-6">Вы ещё не сохранили ни одного результата. Перейдите в раздел «Подбор» и завершите визард — подборка сохранится автоматически.</p>
                <a href="/wizard" data-link="/wizard" class="inline-block bg-blue-800 text-white px-6 py-3 rounded-xl hover:bg-blue-900 transition">Перейти к подбору</a>
            </div>
        `;
    return;
  }

  let html = `
        <div class="max-w-5xl mx-auto">
            <h1 class="text-3xl font-bold mb-2">📚 Мои подборки</h1>
            <p class="text-gray-600 mb-8">Автоматически сохранённые результаты поиска</p>
            
            <div class="space-y-6">
                ${saved.map((search) => renderSavedSearch(search)).join("")}
            </div>
        </div>
    `;
  root.innerHTML = html;

  document.querySelectorAll(".delete-saved").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const id = Number(btn.dataset.id);
      if (confirm("Удалить эту подборку?")) {
        AppState.removeSavedSearch(id);
        renderSavedPage();
      }
    });
  });

  document.querySelectorAll(".view-saved").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = Number(btn.dataset.id);
      const search = saved.find((s) => s.id === id);
      if (search) {
        AppState.filters = { ...search.filters };
        AppState.results = { ...search.results };
        AppState.activeSortTab = search.activeSortTab;
        AppState.currentStep = 4;
        AppState.save();
        navigateTo("/wizard");
      }
    });
  });
}

function renderSavedSearch(search) {
  const filters = search.filters;
  const topResults = search.results.topRecommended.slice(0, 3);

  return `
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div class="flex justify-between items-start mb-4">
                <div>
                    <div class="text-sm text-gray-500 mb-1">${search.date}</div>
                    <div class="flex flex-wrap gap-2 text-sm">
                        ${filters.totalBudget ? `<span class="bg-gray-100 px-3 py-1 rounded-full">💰 ${formatCurrency(filters.totalBudget)}</span>` : ""}
                        ${filters.duration.value ? `<span class="bg-gray-100 px-3 py-1 rounded-full">📅 ${filters.duration.value} ${getDurationLabel(filters.duration.unit)}</span>` : ""}
                        ${filters.climate ? `<span class="bg-gray-100 px-3 py-1 rounded-full">🌡️ ${getClimateLabel(filters.climate)}</span>` : ""}
                        ${filters.workAllowed ? `<span class="bg-gray-100 px-3 py-1 rounded-full">💼 С подработкой</span>` : ""}
                    </div>
                </div>
                <div class="flex gap-2">
                    <button class="view-saved text-blue-800 hover:text-blue-900 text-sm px-3 py-1 border border-blue-800 rounded-lg hover:bg-blue-50" data-id="${search.id}">Открыть</button>
                    <button class="delete-saved text-red-600 hover:text-red-700 text-sm px-3 py-1 border border-red-300 rounded-lg hover:bg-red-50" data-id="${search.id}">Удалить</button>
                </div>
            </div>
            
            <h3 class="font-medium mb-3">Лучшие варианты:</h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                ${topResults
                  .map(
                    (school) => `
                    <div class="border rounded-xl p-3">
                        <div class="flex items-center gap-2 mb-2">
                            <span class="text-xl">${school.flag}</span>
                            <span class="font-medium truncate">${school.schoolName}</span>
                        </div>
                        <div class="text-sm text-gray-600">${school.countryName}, ${school.city}</div>
                        <div class="text-sm font-medium mt-2">${formatCurrency(school.totalCost)}</div>
                    </div>
                `,
                  )
                  .join("")}
            </div>
        </div>
    `;
}

function getDurationLabel(unit) {
  const labels = {
    weeks: "нед.",
    months: "мес.",
    semester: "семестр",
    year: "год",
  };
  return labels[unit] || unit;
}

function getClimateLabel(climate) {
  const labels = { warm: "Тёплый", temper: "Умеренный", cold: "Холодный" };
  return labels[climate] || climate;
}
