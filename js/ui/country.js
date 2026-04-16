// js/ui/country.js
import { countries } from "../data/countries.js";
import { courses } from "../data/courses.js";
import { livingCosts } from "../data/livingCosts.js";
import { formatCurrency } from "./helpers.js";
import { navigateTo } from "../app.js";

const root = document.getElementById("app-root");

export function renderCountryPage(countryId) {
  const country = countries.find((c) => c.id === countryId);
  if (!country) {
    root.innerHTML = `<div class="text-center py-20">Страна не найдена</div>`;
    return;
  }

  const countryCourses = courses.filter((c) => c.countryId === countryId);
  const living = livingCosts.find((l) => l.countryId === countryId);
  const imageUrl = `https://source.unsplash.com/featured/1200x400/?${country.name.toLowerCase()},${country.capital.toLowerCase()},landmark`;

  let html = `
        <div class="max-w-5xl mx-auto">
            <div class="relative h-64 md:h-80 rounded-2xl overflow-hidden mb-8">
                <img src="${imageUrl}" alt="${country.name}" class="w-full h-full object-cover"
                     onerror="this.onerror=null; this.src=''; this.parentElement.classList.add('bg-gradient-to-r', 'from-blue-800', 'to-blue-600');">
                <div class="absolute inset-0 bg-black/30"></div>
                <div class="absolute bottom-6 left-6 text-white">
                    <div class="flex items-center">
                        <div class="bg-white/20 backdrop-blur-sm p-2 rounded-xl mr-4">
                            <span class="fi fi-${country.code} text-4xl"></span>
                        </div>
                        <div>
                            <h1 class="text-4xl font-bold">${country.name}</h1>
                            <p class="text-lg opacity-90">${country.capital}</p>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="grid md:grid-cols-2 gap-8 mb-8">
                <div class="bg-white rounded-2xl p-6 shadow-sm">
                    <h2 class="font-semibold text-xl mb-4">Общая информация</h2>
                    <dl class="space-y-2 text-sm">
                        <div class="flex"><dt class="w-1/3 text-gray-500">Язык:</dt><dd>${country.language?.join(", ") || "Английский"}</dd></div>
                        <div class="flex"><dt class="w-1/3 text-gray-500">Валюта:</dt><dd>${country.currency}</dd></div>
                        <div class="flex"><dt class="w-1/3 text-gray-500">Климат:</dt><dd>${getClimateLabel(country.climate)}</dd></div>
                        <div class="flex"><dt class="w-1/3 text-gray-500">Подработка:</dt><dd>${country.workAllowed ? "Разрешена" : "Нет"}</dd></div>
                    </dl>
                </div>
                <div class="bg-white rounded-2xl p-6 shadow-sm">
                    <h2 class="font-semibold text-xl mb-4">Средние расходы (в месяц)</h2>
                    ${
                      living
                        ? `
                        <dl class="space-y-2 text-sm">
                            <div class="flex"><dt class="w-1/2 text-gray-500">Проживание (общ.):</dt><dd>${formatCurrency(living.accommodation.sharedRoom * country.exchangeRate)}</dd></div>
                            <div class="flex"><dt class="w-1/2 text-gray-500">Питание:</dt><dd>${formatCurrency(((living.food.cooking + living.food.eatingOut) / 2) * country.exchangeRate)}</dd></div>
                            <div class="flex"><dt class="w-1/2 text-gray-500">Транспорт:</dt><dd>${formatCurrency(living.transport * country.exchangeRate)}</dd></div>
                        </dl>
                    `
                        : '<p class="text-gray-500">Нет данных</p>'
                    }
                </div>
            </div>
            
            <h2 class="text-2xl font-bold mb-4">Языковые школы</h2>
            <div class="space-y-4">
                ${countryCourses.map((course) => renderSchoolCard(course, country)).join("")}
            </div>
        </div>
    `;
  root.innerHTML = html;

  document.querySelectorAll(".school-card").forEach((card) => {
    card.addEventListener("click", () => {
      const schoolId = card.dataset.schoolId;
      navigateTo(`/school/${schoolId}`);
    });
  });
}

function renderSchoolCard(course, country) {
  const schoolImage = `https://ui-avatars.com/api/?name=${encodeURIComponent(course.schoolName)}&background=1E3A8A&color=fff&size=48`;
  return `
        <div class="school-card bg-white rounded-xl p-5 shadow-sm flex items-start gap-4 cursor-pointer card-hover" data-school-id="${course.id}">
            <img src="${schoolImage}" alt="${course.schoolName}" class="w-12 h-12 rounded-full">
            <div class="flex-1">
                <div class="flex justify-between items-start">
                    <div>
                        <h3 class="font-semibold text-lg">${course.schoolName}</h3>
                        <p class="text-gray-500 text-sm">${course.city}</p>
                    </div>
                    <span class="bg-blue-50 text-blue-800 text-xs px-3 py-1 rounded-full">⭐ ${course.schoolRating}</span>
                </div>
                <div class="mt-3 grid grid-cols-2 gap-2 text-sm">
                    <div><span class="text-gray-500">Интенсивность:</span> ${course.intensity || "стандарт"}</div>
                    <div><span class="text-gray-500">Стоимость:</span> ${getPriceDisplay(course, country)}</div>
                </div>
            </div>
        </div>
    `;
}

function getClimateLabel(climate) {
  const labels = {
    warm: "Тёплый",
    temper: "Умеренный",
    cold: "Холодный",
    varied: "Разнообразный",
  };
  return labels[climate] || climate;
}

function getPriceDisplay(course, country) {
  if (course.pricePerWeekUSD)
    return `${formatCurrency(course.pricePerWeekUSD * 4 * 96.5)} / мес`;
  if (course.pricePerWeekEUR)
    return `${formatCurrency(course.pricePerWeekEUR * 4 * 105)} / мес`;
  if (course.pricePerMonthUSD)
    return `${formatCurrency(course.pricePerMonthUSD * 96.5)} / мес`;
  if (course.pricePerMonthEUR)
    return `${formatCurrency(course.pricePerMonthEUR * 105)} / мес`;
  return "По запросу";
}
