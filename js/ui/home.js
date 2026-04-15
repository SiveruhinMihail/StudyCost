import { countries } from "../data/countries.js";
import { courses } from "../data/courses.js";
import { livingCosts } from "../data/livingCosts.js";
import { formatCurrency } from "./helpers.js";
import { navigateTo } from "../app.js";

const root = document.getElementById("app-root");

export function renderHomePage() {
  const allCountries = countries;

  let html = `
        <div class="mb-8">
            <h1 class="text-3xl font-bold text-gray-900 mb-2">Страны для изучения английского</h1>
            <p class="text-gray-600">Выберите страну, чтобы узнать подробности о курсах и стоимости жизни</p>
        </div>
        
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" id="countries-grid">
            ${allCountries.map((country) => renderCountryCard(country)).join("")}
        </div>
    `;

  root.innerHTML = html;

  document.querySelectorAll(".country-card").forEach((card) => {
    card.addEventListener("click", () => {
      const id = card.dataset.countryId;
      navigateTo(`/country/${id}`);
    });
  });

  window.addEventListener("global-search", (e) => {
    filterCountryCards(e.detail);
  });
}

function renderCountryCard(country) {
  const countryCourses = courses.filter((c) => c.countryId === country.id);
  const living = livingCosts.find((l) => l.countryId === country.id);

  let minCost = null;
  countryCourses.forEach((course) => {
    let costPerMonth = 0;
    if (course.pricePerMonthUSD) costPerMonth = course.pricePerMonthUSD * 96.5;
    else if (course.pricePerMonthEUR)
      costPerMonth = course.pricePerMonthEUR * 105;
    else if (course.pricePerWeekUSD)
      costPerMonth = course.pricePerWeekUSD * 4 * 96.5;
    else if (course.pricePerWeekEUR)
      costPerMonth = course.pricePerWeekEUR * 4 * 105;
    if (costPerMonth > 0 && (minCost === null || costPerMonth < minCost))
      minCost = costPerMonth;
  });

  const priceDisplay = minCost
    ? `от ${formatCurrency(minCost)} / мес`
    : "Цена по запросу";
  const searchData = `${country.name.toLowerCase()} ${country.capital.toLowerCase()} ${country.id}`;

  const imageUrl = `https://source.unsplash.com/featured/400x300/?${country.name.toLowerCase()},city,landmark`;

  return `
        <div class="country-card bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden card-hover cursor-pointer" 
             data-country-id="${country.id}" data-searchable="${searchData}">
            <div class="h-36 bg-gradient-to-br from-blue-100 to-blue-50 relative">
                <img src="${imageUrl}" alt="${country.name}" class="w-full h-full object-cover" 
                     onerror="this.onerror=null; this.parentElement.innerHTML='<span class=\'text-5xl absolute inset-0 flex items-center justify-center\'>${country.flag}</span>';">
                <span class="absolute top-3 left-3 text-3xl drop-shadow">${country.flag}</span>
            </div>
            <div class="p-5">
                <h3 class="font-semibold text-xl mb-1">${country.name}</h3>
                <p class="text-gray-500 text-sm mb-2">${country.capital}</p>
                <div class="flex items-center mb-2">
                    <span class="text-yellow-400 mr-1">★</span>
                    <span class="text-sm font-medium">${country.rating || 4.5}</span>
                </div>
                <div class="text-sm text-gray-700">
                    <div class="flex justify-between">
                        <span>Курсы:</span>
                        <span class="font-medium">${priceDisplay}</span>
                    </div>
                    <div class="flex justify-between mt-1">
                        <span>Проживание:</span>
                        <span class="font-medium">${living ? formatCurrency(living.accommodation.sharedRoom * country.exchangeRate) : "—"}</span>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function filterCountryCards(query) {
  document.querySelectorAll(".country-card").forEach((card) => {
    const searchable = card.dataset.searchable;
    card.style.display = searchable && searchable.includes(query) ? "" : "none";
  });
}
