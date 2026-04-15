import { AppState } from "../core/state.js";
import { calculateCandidates, rankCandidates } from "../core/calculator.js";
import { formatCurrency, formatNumberInput } from "./helpers.js";
import { navigateTo } from "../app.js";
import { storage } from "../core/storage.js";

const root = document.getElementById("app-root");

export function renderWizardPage() {
  if (AppState.currentStep === 4) {
    renderWizardResults();
    return;
  }
  renderWizardStep();
}

function renderWizardStep() {
  const step = AppState.currentStep;
  let html = `
        <div class="max-w-2xl mx-auto">
            <div class="mb-8">
                ${renderProgressBar()}
            </div>
            <div id="wizard-step-content" class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
                ${step === 1 ? renderBudgetStep() : step === 2 ? renderDurationStep() : renderPreferencesStep()}
            </div>
        </div>
    `;
  root.innerHTML = html;
  attachWizardListeners(step);
}

function renderProgressBar() {
  const steps = ["Бюджет", "Срок", "Предпочтения", "Результат"];
  return `
        <div class="flex justify-between">
            ${steps
              .map((label, idx) => {
                const stepNum = idx + 1;
                const isActive = AppState.currentStep === stepNum;
                const isCompleted = AppState.currentStep > stepNum;
                return `
                    <div class="flex flex-col items-center w-1/4 wizard-progress-step ${isActive ? "active" : ""} ${isCompleted ? "completed" : ""}">
                        <div class="step-circle w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium border-2 ${isActive ? "border-blue-800 bg-blue-800 text-white" : isCompleted ? "border-green-500 bg-green-500 text-white" : "border-gray-300 bg-white text-gray-500"}">
                            ${stepNum}
                        </div>
                        <span class="text-xs mt-2 text-gray-600 hidden sm:block">${label}</span>
                    </div>
                `;
              })
              .join("")}
        </div>
    `;
}

function renderBudgetStep() {
  const budget = AppState.filters.totalBudget || "";
  const budgetType = AppState.filters.budgetType;
  return `
        <h2 class="text-2xl font-bold mb-6 text-gray-900">💰 Ваш бюджет</h2>
        <div class="space-y-6">
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Сумма на весь период (₽)</label>
                <div class="relative">
                    <input type="text" id="budget-input" value="${budget}" placeholder="200 000" class="wizard-input text-lg" inputmode="numeric">
                    <div class="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1">
                        <button type="button" data-add="1000" class="budget-add-btn text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded">+1к</button>
                        <button type="button" data-add="10000" class="budget-add-btn text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded">+10к</button>
                        <button type="button" data-add="100000" class="budget-add-btn text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded">+100к</button>
                    </div>
                </div>
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-3">Что включить в расчёт?</label>
                <div class="space-y-3">
                    <label class="flex items-center cursor-pointer">
                        <input type="radio" name="budgetType" value="course" ${budgetType === "course" ? "checked" : ""} class="wizard-radio">
                        <span class="ml-2">Только стоимость курса</span>
                    </label>
                    <label class="flex items-center cursor-pointer">
                        <input type="radio" name="budgetType" value="course+living" ${budgetType === "course+living" ? "checked" : ""} class="wizard-radio">
                        <span class="ml-2">Курс + проживание</span>
                    </label>
                    <label class="flex items-center cursor-pointer">
                        <input type="radio" name="budgetType" value="all" ${budgetType === "all" ? "checked" : ""} class="wizard-radio">
                        <span class="ml-2">Всё включено (перелёт, виза, питание)</span>
                    </label>
                </div>
            </div>
            <div class="flex justify-end pt-4">
                <button id="next-step-1" class="bg-blue-800 text-white px-8 py-3 rounded-xl hover:bg-blue-900 transition-colors font-medium">Продолжить →</button>
            </div>
        </div>
    `;
}

function renderDurationStep() {
  const duration = AppState.filters.duration;
  return `
        <h2 class="text-2xl font-bold mb-6 text-gray-900">📅 Длительность обучения</h2>
        <div class="space-y-6">
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Количество</label>
                <input type="number" id="duration-value" value="${duration.value || ""}" min="1" class="wizard-input">
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Период</label>
                <select id="duration-unit" class="wizard-input">
                    <option value="weeks" ${duration.unit === "weeks" ? "selected" : ""}>Недели</option>
                    <option value="months" ${duration.unit === "months" ? "selected" : ""}>Месяцы</option>
                    <option value="semester" ${duration.unit === "semester" ? "selected" : ""}>Семестр (6 мес)</option>
                    <option value="year" ${duration.unit === "year" ? "selected" : ""}>Год</option>
                </select>
            </div>
            <div class="flex justify-between pt-4">
                <button id="prev-step-2" class="text-gray-600 hover:text-gray-800 font-medium">← Назад</button>
                <button id="next-step-2" class="bg-blue-800 text-white px-8 py-3 rounded-xl hover:bg-blue-900 transition-colors font-medium">Продолжить →</button>
            </div>
        </div>
    `;
}

function renderPreferencesStep() {
  const climate = AppState.filters.climate;
  const work = AppState.filters.workAllowed;
  return `
        <h2 class="text-2xl font-bold mb-6 text-gray-900">🎯 Ваши предпочтения</h2>
        <div class="space-y-6">
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Предпочитаемый климат</label>
                <select id="climate-select" class="wizard-input">
                    <option value="">Не важно</option>
                    <option value="warm" ${climate === "warm" ? "selected" : ""}>Тёплый</option>
                    <option value="temperate" ${climate === "temperate" ? "selected" : ""}>Умеренный</option>
                    <option value="cold" ${climate === "cold" ? "selected" : ""}>Холодный</option>
                </select>
            </div>
            <div>
                <label class="flex items-center cursor-pointer">
                    <input type="checkbox" id="work-allowed" ${work ? "checked" : ""} class="wizard-checkbox">
                    <span class="ml-2">Важна возможность подработки</span>
                </label>
            </div>
            <div class="flex justify-between pt-4">
                <button id="prev-step-3" class="text-gray-600 hover:text-gray-800 font-medium">← Назад</button>
                <button id="calculate-btn" class="bg-green-600 text-white px-8 py-3 rounded-xl hover:bg-green-700 transition-colors font-medium">Показать результаты</button>
            </div>
        </div>
    `;
}

function attachWizardListeners(step) {
  if (step === 1) {
    const budgetInput = document.getElementById("budget-input");
    budgetInput.addEventListener("input", (e) => {
      let value = e.target.value.replace(/\s/g, "").replace(/\D/g, "");
      if (value) e.target.value = formatNumberInput(value);
    });
    budgetInput.addEventListener("blur", (e) => {
      const raw = e.target.value.replace(/\s/g, "");
      if (raw) e.target.value = formatNumberInput(raw);
    });
    document.querySelectorAll(".budget-add-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const add = parseInt(btn.dataset.add, 10);
        let current = parseInt(budgetInput.value.replace(/\s/g, ""), 10) || 0;
        current += add;
        budgetInput.value = formatNumberInput(current.toString());
      });
    });
    document.getElementById("next-step-1").addEventListener("click", () => {
      const rawValue = budgetInput.value.replace(/\s/g, "");
      const budgetValue = rawValue ? parseFloat(rawValue) : null;
      const budgetType = document.querySelector(
        'input[name="budgetType"]:checked',
      ).value;
      AppState.filters.totalBudget = budgetValue;
      AppState.filters.budgetType = budgetType;
      AppState.currentStep = 2;
      storage.saveState(AppState);
      renderWizardStep();
    });
  } else if (step === 2) {
    document.getElementById("prev-step-2").addEventListener("click", () => {
      AppState.currentStep = 1;
      storage.saveState(AppState);
      renderWizardStep();
    });
    document.getElementById("next-step-2").addEventListener("click", () => {
      const value = document.getElementById("duration-value").value;
      const unit = document.getElementById("duration-unit").value;
      if (!value || value <= 0) {
        alert("Введите корректную длительность");
        return;
      }
      AppState.filters.duration = { value: parseFloat(value), unit };
      AppState.currentStep = 3;
      storage.saveState(AppState);
      renderWizardStep();
    });
  } else if (step === 3) {
    document.getElementById("prev-step-3").addEventListener("click", () => {
      AppState.currentStep = 2;
      storage.saveState(AppState);
      renderWizardStep();
    });
    document.getElementById("calculate-btn").addEventListener("click", () => {
      const climate = document.getElementById("climate-select").value || null;
      const workAllowed = document.getElementById("work-allowed").checked;
      AppState.filters.climate = climate;
      AppState.filters.workAllowed = workAllowed;

      const candidates = calculateCandidates(AppState.filters);
      AppState.results.all = candidates;
      const ranked = rankCandidates(
        candidates,
        AppState.activeSortTab,
        AppState.filters.totalBudget,
      );
      AppState.results.topRecommended = ranked.slice(0, 5);

      AppState.addSavedSearch();

      AppState.currentStep = 4;
      storage.saveState(AppState);
      renderWizardResults();
    });
  }
}

function renderWizardResults() {
  const { topRecommended, all } = AppState.results;
  const activeTab = AppState.activeSortTab;

  let html = `
        <div class="max-w-7xl mx-auto">
            <div class="flex justify-between items-center mb-6">
                <h2 class="text-2xl font-bold">🎓 Рекомендованные варианты</h2>
                <button id="restart-wizard" class="text-gray-600 hover:text-gray-800 text-sm font-medium">← Начать заново</button>
            </div>
            
            <div class="border-b border-gray-200 mb-6">
                <nav class="flex space-x-6">
                    <button data-sort="price-quality" class="tab-btn pb-2 text-sm font-medium ${activeTab === "price-quality" ? "border-b-2 border-blue-800 text-blue-800" : "text-gray-500"}">Цена/Качество</button>
                    <button data-sort="prestige" class="tab-btn pb-2 text-sm font-medium ${activeTab === "prestige" ? "border-b-2 border-blue-800 text-blue-800" : "text-gray-500"}">Престиж</button>
                    <button data-sort="savings" class="tab-btn pb-2 text-sm font-medium ${activeTab === "savings" ? "border-b-2 border-blue-800 text-blue-800" : "text-gray-500"}">Экономия</button>
                </nav>
            </div>
            
            <div id="results-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                ${renderResultCards(topRecommended)}
            </div>
            
            <div id="show-all-container" class="text-center mt-8 ${all.length <= 5 ? "hidden" : ""}">
                <button id="show-all-btn" class="border border-gray-300 px-6 py-3 rounded-xl hover:bg-gray-50 transition-colors font-medium">
                    Показать все варианты (${all.length})
                </button>
            </div>
        </div>
    `;
  root.innerHTML = html;
  attachResultsListeners();
  attachCardButtons(); 
}

function renderResultCards(candidates) {
  if (!candidates || candidates.length === 0) {
    return `<div class="col-span-full text-center py-12 text-gray-500">К сожалению, нет подходящих вариантов. Попробуйте изменить фильтры.</div>`;
  }
  return candidates
    .map((c) => {
      const diff = c.budgetDiff;
      const diffClass = diff >= 0 ? "text-green-600" : "text-red-500";
      const schoolImage = `https://ui-avatars.com/api/?name=${encodeURIComponent(c.schoolName)}&background=1E3A8A&color=fff&size=48`;
      return `
            <div class="result-card bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden card-hover" data-searchable="${c.countryName.toLowerCase()} ${c.city.toLowerCase()} ${c.schoolName.toLowerCase()}">
                <div class="p-5">
                    <!-- Страна (крупно) -->
                    <div class="flex items-center gap-3 mb-3">
                        <span class="text-4xl">${c.flag}</span>
                        <div>
                            <h3 class="font-bold text-xl">${c.countryName}</h3>
                            <p class="text-gray-500 text-sm">${c.city}</p>
                        </div>
                    </div>
                    
                    <!-- Школа (выделенный блок) -->
                    <div class="flex items-center gap-3 mb-4 p-3 bg-blue-50/50 rounded-xl">
                        <img src="${schoolImage}" alt="${c.schoolName}" class="w-10 h-10 rounded-full">
                        <div>
                            <div class="font-semibold">${c.schoolName}</div>
                            <div class="flex items-center text-sm">
                                <span class="text-yellow-500 mr-1">★</span>
                                <span>${c.schoolRating}</span>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Стоимость -->
                    <div class="space-y-2 text-sm mb-4">
                        <div class="flex justify-between"><span class="text-gray-500">Курс:</span><span>${formatCurrency(c.courseCost)}</span></div>
                        <div class="flex justify-between"><span class="text-gray-500">Проживание:</span><span>${formatCurrency(c.livingCost)}</span></div>
                        <div class="border-t pt-2 mt-2 flex justify-between font-medium"><span>Итого:</span><span class="text-lg">${formatCurrency(c.totalCost)}</span></div>
                    </div>
                    ${
                      c.budgetDiff !== null
                        ? `
                        <div class="bg-gray-50 p-3 rounded-xl text-sm mb-3">
                            <div class="flex justify-between"><span>Бюджет:</span><span>${formatCurrency(AppState.filters.totalBudget)}</span></div>
                            <div class="flex justify-between font-medium ${diffClass}"><span>${diff >= 0 ? "Экономия" : "Не хватает"}:</span><span>${formatCurrency(Math.abs(diff))}</span></div>
                        </div>
                    `
                        : ""
                    }
                    <div class="flex gap-2">
                        <button class="school-link flex-1 text-center text-blue-800 hover:text-blue-900 text-sm font-medium py-2 border border-blue-800 rounded-lg hover:bg-blue-50 transition" data-school-id="${c.schoolId}">О школе →</button>
                        <button class="country-link flex-1 text-center text-gray-600 hover:text-gray-800 text-sm font-medium py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition" data-country-id="${c.countryId}">Страна →</button>
                    </div>
                </div>
            </div>
        `;
    })
    .join("");
}

function attachCardButtons() {
  document.querySelectorAll(".school-link").forEach((btn) => {
    btn.removeEventListener("click", handleSchoolClick);
    btn.addEventListener("click", handleSchoolClick);
  });
  document.querySelectorAll(".country-link").forEach((btn) => {
    btn.removeEventListener("click", handleCountryClick);
    btn.addEventListener("click", handleCountryClick);
  });
}

function handleSchoolClick(e) {
  const schoolId = e.currentTarget.dataset.schoolId;
  navigateTo(`/school/${schoolId}`);
}

function handleCountryClick(e) {
  const countryId = e.currentTarget.dataset.countryId;
  navigateTo(`/country/${countryId}`);
}

function attachResultsListeners() {
  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const sort = btn.dataset.sort;
      AppState.activeSortTab = sort;
      const ranked = rankCandidates(
        AppState.results.all,
        sort,
        AppState.filters.totalBudget,
      );
      AppState.results.topRecommended = ranked.slice(0, 5);
      document.getElementById("results-grid").innerHTML = renderResultCards(
        AppState.results.topRecommended,
      );

      const showAllContainer = document.getElementById("show-all-container");
      if (AppState.results.all.length > 5) {
        showAllContainer.classList.remove("hidden");
        document.getElementById("show-all-btn").textContent =
          `Показать все варианты (${AppState.results.all.length})`;
      } else {
        showAllContainer.classList.add("hidden");
      }

      storage.saveState(AppState);
      document.querySelectorAll(".tab-btn").forEach((b) => {
        b.classList.remove("border-b-2", "border-blue-800", "text-blue-800");
        b.classList.add("text-gray-500");
      });
      btn.classList.add("border-b-2", "border-blue-800", "text-blue-800");

      attachCardButtons(); 
    });
  });

  document.getElementById("restart-wizard")?.addEventListener("click", () => {
    AppState.reset();
    AppState.currentStep = 1;
    storage.saveState(AppState);
    renderWizardStep();
  });

  document.getElementById("show-all-btn")?.addEventListener("click", (e) => {
    const btn = e.target;
    const allSorted = rankCandidates(
      AppState.results.all,
      AppState.activeSortTab,
      AppState.filters.totalBudget,
    );
    document.getElementById("results-grid").innerHTML =
      renderResultCards(allSorted);
    document.getElementById("show-all-container").classList.add("hidden");
    attachCardButtons();
  });

  window.addEventListener("global-search", (e) => {
    const query = e.detail;
    document.querySelectorAll(".result-card").forEach((card) => {
      const searchable = card.dataset.searchable;
      card.style.display =
        searchable && searchable.includes(query) ? "" : "none";
    });
  });
}
