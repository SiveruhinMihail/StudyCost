// js/ui/resultDetail.js
import { AppState } from "../core/state.js";
import { formatCurrency } from "./helpers.js";
import { navigateTo } from "../app.js";
import { countries } from "../data/countries.js";

const root = document.getElementById("app-root");

export function renderResultDetailPage(candidateIndex) {
  const candidate = AppState.results.all[candidateIndex];
  if (!candidate) {
    root.innerHTML = `<div class="text-center py-20">Результат не найден</div>`;
    return;
  }

  const country = countries.find((c) => c.id === candidate.countryId);
  const budget = AppState.filters.totalBudget;
  const budgetDiff = candidate.budgetDiff;
  const diffClass = budgetDiff >= 0 ? "text-green-600" : "text-red-500";
  const duration = AppState.filters.duration;
  const accommodationType = AppState.filters.accommodationType || "shared";
  const foodType = AppState.filters.foodType || "cooking";
  const selectedItems =
    candidate.selectedItems || AppState.filters.selectedItems;

  const getMultiplier = () => {
    switch (duration.unit) {
      case "weeks":
        return duration.value;
      case "months":
        return duration.value;
      case "semester":
        return 6;
      case "year":
        return 12;
      default:
        return duration.value;
    }
  };

  const multiplier = getMultiplier();
  const unitLabel =
    duration.unit === "weeks"
      ? "нед."
      : duration.unit === "months"
        ? "мес."
        : duration.unit === "semester"
          ? "семестр"
          : "год";

  const coursePerPeriod = candidate.courseCost / multiplier;
  const accommodationPerPeriod = candidate.accommodationCost / multiplier;
  const foodPerPeriod = candidate.foodCost / multiplier;
  const transportPerPeriod = candidate.transportCost / multiplier;

  const accommodationLabel =
    accommodationType === "shared" ? "Общая комната" : "Отдельная комната";
  const foodLabel =
    foodType === "cooking" ? "Готовка дома" : "Питание вне дома";

  const costItems = [
    {
      key: "course",
      label: "Курс английского",
      cost: candidate.courseCost,
      perPeriod: coursePerPeriod,
      note: "",
    },
    {
      key: "accommodation",
      label: `Проживание (${accommodationLabel})`,
      cost: candidate.accommodationCost,
      perPeriod: accommodationPerPeriod,
      note: "",
    },
    {
      key: "food",
      label: `Питание (${foodLabel})`,
      cost: candidate.foodCost,
      perPeriod: foodPerPeriod,
      note: "",
    },
    {
      key: "transport",
      label: "Транспорт",
      cost: candidate.transportCost,
      perPeriod: transportPerPeriod,
      note: "",
    },
    {
      key: "visa",
      label: "Виза",
      cost: candidate.visaCost,
      perPeriod: candidate.visaCost,
      note: "единоразово",
    },
    {
      key: "flight",
      label: "Авиаперелёт (оценка)",
      cost: candidate.flightCost,
      perPeriod: candidate.flightCost,
      note: "туда-обратно",
    },
  ];

  const sortedItems = [
    ...costItems.filter((item) => selectedItems.includes(item.key)),
    ...costItems.filter((item) => !selectedItems.includes(item.key)),
  ];

  const renderCostRow = (item, isSelected) => {
    const textColor = isSelected
      ? "text-green-700 font-medium"
      : "text-gray-400";
    const bgClass = isSelected ? "" : "bg-gray-50";
    const statusBadge = isSelected
      ? ""
      : '<span class="text-xs ml-2 text-gray-400">(не включено)</span>';
    return `
            <div class="${bgClass} p-3 rounded-lg">
                <div class="flex justify-between items-baseline ${textColor}">
                    <dt class="flex items-center">${item.label} ${statusBadge}</dt>
                    <dd class="font-medium">${formatCurrency(item.cost)}</dd>
                </div>
                <p class="text-xs text-gray-500 mt-1">${formatCurrency(item.perPeriod)} × ${multiplier} ${unitLabel} ${item.note}</p>
            </div>
        `;
  };

  let html = `
        <div class="max-w-3xl mx-auto">
            <div class="bg-white rounded-2xl shadow-sm p-6 md:p-8">
                <div class="flex items-center gap-4 mb-6">
                    <div class="bg-gray-100 p-2 rounded-xl">
                        <span class="fi fi-${country?.code || "unknown"} text-3xl"></span>
                    </div>
                    <div>
                        <h1 class="text-2xl font-bold">${candidate.countryName}, ${candidate.city}</h1>
                        <p class="text-gray-600">${candidate.schoolName}</p>
                    </div>
                </div>
                
                <div class="mb-4 p-3 bg-green-50 rounded-lg text-sm text-green-800 border border-green-200">
                    <span class="font-medium">✓ В расчёт итога включены:</span> ${selectedItems
                      .map((item) => {
                        const map = {
                          course: "Курс",
                          accommodation: "Проживание",
                          food: "Питание",
                          transport: "Транспорт",
                          visa: "Виза",
                          flight: "Перелёт",
                        };
                        return map[item] || item;
                      })
                      .join(", ")}
                </div>
                
                <h2 class="text-xl font-semibold mb-4">Детализация расходов</h2>
                <div class="bg-gray-50 rounded-xl p-5 mb-6">
                    <dl class="space-y-3">
                        ${sortedItems.map((item) => renderCostRow(item, selectedItems.includes(item.key))).join("")}
                    </dl>
                    <div class="border-t pt-3 mt-4">
                        <div class="flex justify-between text-lg font-bold">
                            <dt>Итого (выбранное)</dt>
                            <dd class="text-green-700">${formatCurrency(candidate.totalCost)}</dd>
                        </div>
                    </div>
                </div>
                
                ${
                  budget
                    ? `
                <div class="bg-white border rounded-xl p-4 mb-6">
                    <div class="flex justify-between text-sm">
                        <span>Ваш бюджет на ${duration.value} ${getDurationLabel(duration.unit)}</span>
                        <span>${formatCurrency(budget)}</span>
                    </div>
                    <div class="flex justify-between font-medium ${diffClass} mt-2">
                        <span>${budgetDiff >= 0 ? "Остаток" : "Не хватает"}</span>
                        <span>${formatCurrency(Math.abs(budgetDiff))}</span>
                    </div>
                </div>
                `
                    : ""
                }
                
                <div class="flex gap-4">
                    <button class="flex-1 bg-blue-800 text-white py-3 rounded-xl hover:bg-blue-900 transition" data-action="country" data-id="${candidate.countryId}">
                        Страна: ${candidate.countryName}
                    </button>
                    <button class="flex-1 border border-blue-800 text-blue-800 py-3 rounded-xl hover:bg-blue-50 transition" data-action="school" data-id="${candidate.schoolId}">
                        Школа: ${candidate.schoolName}
                    </button>
                </div>
            </div>
        </div>
    `;
  root.innerHTML = html;

  document
    .querySelector('[data-action="country"]')
    .addEventListener("click", () => {
      navigateTo(`/country/${candidate.countryId}`);
    });
  document
    .querySelector('[data-action="school"]')
    .addEventListener("click", () => {
      navigateTo(`/school/${candidate.schoolId}`);
    });
}

function getDurationLabel(unit) {
  const map = {
    weeks: "нед.",
    months: "мес.",
    semester: "семестр",
    year: "год",
  };
  return map[unit] || unit;
}
