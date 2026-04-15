import { AppState } from "../core/state.js";
import { rankCandidates } from "../core/calculator.js";
import { formatCurrency } from "./helpers.js";

const root = document.getElementById("app-root");

export function renderResults() {
  const { topRecommended, all } = AppState.results;
  const activeTab = AppState.activeSortTab;

  let html = `
        <div class="max-w-7xl mx-auto">
            <div class="flex justify-between items-center mb-6">
                <h2 class="text-2xl font-semibold">🎓 Рекомендованные варианты</h2>
                <button id="restart-wizard" class="text-blue-600 hover:text-blue-800 text-sm font-medium">← Начать заново</button>
            </div>
            
            <!-- Вкладки сортировки -->
            <div class="border-b border-gray-200 mb-8">
                <nav class="flex space-x-8">
                    <button data-sort="price-quality" class="tab-btn py-3 px-1 border-b-2 ${activeTab === "price-quality" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"} font-medium text-sm">Цена/Качество</button>
                    <button data-sort="savings" class="tab-btn py-3 px-1 border-b-2 ${activeTab === "savings" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"} font-medium text-sm">Максимальная экономия</button>
                    <button data-sort="cheapest" class="tab-btn py-3 px-1 border-b-2 ${activeTab === "cheapest" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"} font-medium text-sm">Самые дешёвые</button>
                </nav>
            </div>
            
            <div id="results-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                ${renderCards(topRecommended)}
            </div>
            
            ${
              all.length > 5
                ? `
                <div class="text-center mt-8">
                    <button id="show-all-btn" class="bg-white border border-gray-300 text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-50 transition-colors font-medium">
                        Показать все варианты (${all.length})
                    </button>
                </div>
            `
                : ""
            }
        </div>
    `;

  root.innerHTML = html;
  attachResultsListeners();

  window.addEventListener("search-results", (e) => {
    const query = e.detail;
    filterResultCards(query);
  });
}

function renderCards(candidates) {
  if (!candidates || candidates.length === 0) {
    return `<div class="col-span-full text-center py-12 text-gray-500">Нет подходящих вариантов. Попробуйте изменить фильтры.</div>`;
  }

  return candidates
    .map((candidate) => {
      const diff = candidate.budgetDiff;
      const diffClass = diff >= 0 ? "text-green-600" : "text-red-500";
      const diffSign = diff >= 0 ? "+" : "";

      return `
            <div class="result-card bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden card-hover" data-searchable="${candidate.countryName.toLowerCase()} ${candidate.city.toLowerCase()}">
                <div class="p-6">
                    <div class="flex items-start justify-between mb-4">
                        <div class="flex items-center">
                            <span class="text-4xl mr-3">${candidate.flag}</span>
                            <div>
                                <h3 class="font-semibold text-xl">${candidate.countryName}</h3>
                                <p class="text-gray-500">${candidate.city}</p>
                            </div>
                        </div>
                        ${candidate.workAllowed ? '<span class="bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full">💼 Подработка</span>' : ""}
                    </div>
                    
                    <p class="text-sm text-gray-600 mb-4">${candidate.schoolName}</p>
                    
                    <div class="space-y-2 mb-4 text-sm">
                        <div class="flex justify-between">
                            <span class="text-gray-500">Курс:</span>
                            <span>${formatCurrency(candidate.courseCost)}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-gray-500">Проживание:</span>
                            <span>${formatCurrency(candidate.livingCost)}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-gray-500">Виза:</span>
                            <span>${formatCurrency(candidate.visaCost)}</span>
                        </div>
                        <div class="border-t pt-3 mt-3 flex justify-between font-medium">
                            <span>Итого:</span>
                            <span class="text-lg">${formatCurrency(candidate.totalCost)}</span>
                        </div>
                    </div>
                    
                    ${
                      candidate.budgetDiff !== null
                        ? `
                        <div class="bg-gray-50 p-4 rounded-xl text-sm">
                            <div class="flex justify-between mb-1">
                                <span>Ваш бюджет:</span>
                                <span>${formatCurrency(AppState.filters.totalBudget)}</span>
                            </div>
                            <div class="flex justify-between font-medium ${diffClass}">
                                <span>${diff >= 0 ? "Экономия:" : "Не хватает:"}</span>
                                <span>${diffSign}${formatCurrency(Math.abs(diff))}</span>
                            </div>
                        </div>
                    `
                        : ""
                    }
                    
                    <button class="details-btn w-full mt-4 text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center justify-center" data-id="${candidate.countryId}-${candidate.city}">
                        Подробнее о школе <span class="ml-1">→</span>
                    </button>
                </div>
            </div>
        `;
    })
    .join("");
}

function filterResultCards(query) {
  const cards = document.querySelectorAll(".result-card");
  cards.forEach((card) => {
    const searchable = card.dataset.searchable;
    if (searchable.includes(query)) {
      card.style.display = "";
    } else {
      card.style.display = "none";
    }
  });
}

function attachResultsListeners() {
  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const sortType = btn.dataset.sort;
      AppState.activeSortTab = sortType;

      const ranked = rankCandidates(
        AppState.results.all,
        sortType,
        AppState.filters.totalBudget,
      );
      AppState.results.topRecommended = ranked.slice(0, 5);

      const grid = document.getElementById("results-grid");
      grid.innerHTML = renderCards(AppState.results.topRecommended);

      document.querySelectorAll(".tab-btn").forEach((b) => {
        b.classList.remove("border-blue-600", "text-blue-600");
        b.classList.add("border-transparent", "text-gray-500");
      });
      btn.classList.add("border-blue-600", "text-blue-600");
      btn.classList.remove("border-transparent", "text-gray-500");

      AppState.save();
    });
  });

  const showAllBtn = document.getElementById("show-all-btn");
  if (showAllBtn) {
    showAllBtn.addEventListener("click", () => {
      const grid = document.getElementById("results-grid");
      const allSorted = rankCandidates(
        AppState.results.all,
        AppState.activeSortTab,
        AppState.filters.totalBudget,
      );
      grid.innerHTML = renderCards(allSorted);
      showAllBtn.style.display = "none";
    });
  }

  document.getElementById("restart-wizard").addEventListener("click", () => {
    AppState.reset();
    import("./home.js").then((module) => module.renderHomePage());
  });

  document.querySelectorAll(".details-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const id = btn.dataset.id;
      alert(
        `Подробная информация о школе будет доступна в следующей версии.\nID: ${id}`,
      );
    });
  });
}
