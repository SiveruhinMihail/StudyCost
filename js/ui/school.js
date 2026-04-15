import { courses } from "../data/courses.js";
import { countries } from "../data/countries.js";
import { formatCurrency } from "./helpers.js";

const root = document.getElementById("app-root");

export function renderSchoolPage(schoolId) {
  const course = courses.find((c) => c.id === schoolId);
  if (!course) {
    root.innerHTML = `<div class="text-center py-20">Школа не найдена</div>`;
    return;
  }
  const country = countries.find((c) => c.id === course.countryId);
  const schoolImage = `https://ui-avatars.com/api/?name=${encodeURIComponent(course.schoolName)}&background=1E3A8A&color=fff&size=120`;

  let html = `
        <div class="max-w-3xl mx-auto">
            <div class="bg-white rounded-2xl shadow-sm p-6 md:p-8">
                <div class="flex items-center gap-6 mb-6">
                    <img src="${schoolImage}" alt="${course.schoolName}" class="w-20 h-20 rounded-full">
                    <div>
                        <h1 class="text-3xl font-bold">${course.schoolName}</h1>
                        <p class="text-gray-600 flex items-center gap-2">
                            <span>${country.flag} ${country.name}, ${course.city}</span>
                            <span class="text-yellow-500">★ ${course.schoolRating || 4.0}</span>
                        </p>
                    </div>
                </div>
                
                <div class="grid md:grid-cols-2 gap-6 mb-8">
                    <div>
                        <h2 class="font-semibold text-xl mb-3">О школе</h2>
                        <p class="text-gray-700">${course.description || "Современная языковая школа с многолетним опытом преподавания английского языка. Индивидуальный подход, квалифицированные преподаватели."}</p>
                    </div>
                    <div>
                        <h2 class="font-semibold text-xl mb-3">Стоимость обучения</h2>
                        <div class="space-y-2 text-sm">
                            <div class="flex justify-between"><span>Стандартный курс (в неделю):</span><span>${formatCoursePrice(course, "week", false, country)}</span></div>
                            <div class="flex justify-between"><span>Интенсив (в неделю):</span><span>${formatCoursePrice(course, "week", true, country)}</span></div>
                            <div class="flex justify-between"><span>Длительное обучение (месяц):</span><span>${formatCoursePrice(course, "month", false, country)}</span></div>
                        </div>
                    </div>
                </div>
                
                <div class="border-t pt-6">
                    <h2 class="font-semibold text-xl mb-3">Контакты</h2>
                    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                        <div><span class="text-gray-500">Телефон:</span> ${course.phone || "+7 (XXX) XXX-XX-XX"}</div>
                        <div><span class="text-gray-500">Email:</span> <a href="mailto:${course.email || `info@${course.schoolName.toLowerCase().replace(/\s+/g, "")}.com`}" class="text-blue-800">${course.email || `info@${course.schoolName.toLowerCase().replace(/\s+/g, "")}.com`}</a></div>
                        <div><span class="text-gray-500">Сайт:</span> <a href="#" class="text-blue-800">${course.website || "www.school.com"}</a></div>
                    </div>
                </div>
            </div>
        </div>
    `;
  root.innerHTML = html;
}

function formatCoursePrice(course, period, intensive = false, country) {
  const EXCHANGE_RATES = {
    USD: 96.5,
    EUR: 105,
    CAD: 70.5,
    GBP: 120,
    AUD: 62,
    NZD: 56,
    AED: 26,
    ZAR: 5.2,
    PHP: 1.7,
  };

  let priceInRub = 0;

  if (period === "week") {
    if (course.pricePerWeekUSD)
      priceInRub = course.pricePerWeekUSD * EXCHANGE_RATES.USD;
    else if (course.pricePerWeekEUR)
      priceInRub = course.pricePerWeekEUR * EXCHANGE_RATES.EUR;
    else if (course.pricePerWeekCAD)
      priceInRub = course.pricePerWeekCAD * EXCHANGE_RATES.CAD;
    else if (course.pricePerWeekGBP)
      priceInRub = course.pricePerWeekGBP * EXCHANGE_RATES.GBP;
    else if (course.pricePerWeekAUD)
      priceInRub = course.pricePerWeekAUD * EXCHANGE_RATES.AUD;
    else if (course.pricePerWeekNZD)
      priceInRub = course.pricePerWeekNZD * EXCHANGE_RATES.NZD;
    else if (course.pricePerMonthUSD)
      priceInRub = (course.pricePerMonthUSD / 4) * EXCHANGE_RATES.USD;
    else if (course.pricePerMonthEUR)
      priceInRub = (course.pricePerMonthEUR / 4) * EXCHANGE_RATES.EUR;
    else if (course.pricePerMonthCAD)
      priceInRub = (course.pricePerMonthCAD / 4) * EXCHANGE_RATES.CAD;
    else if (course.pricePerMonthGBP)
      priceInRub = (course.pricePerMonthGBP / 4) * EXCHANGE_RATES.GBP;
    else if (course.pricePerMonthAUD)
      priceInRub = (course.pricePerMonthAUD / 4) * EXCHANGE_RATES.AUD;
    else if (course.pricePerMonthNZD)
      priceInRub = (course.pricePerMonthNZD / 4) * EXCHANGE_RATES.NZD;

    if (intensive) priceInRub *= 1.5;
  } else if (period === "month") {
    if (course.pricePerMonthUSD)
      priceInRub = course.pricePerMonthUSD * EXCHANGE_RATES.USD;
    else if (course.pricePerMonthEUR)
      priceInRub = course.pricePerMonthEUR * EXCHANGE_RATES.EUR;
    else if (course.pricePerMonthCAD)
      priceInRub = course.pricePerMonthCAD * EXCHANGE_RATES.CAD;
    else if (course.pricePerMonthGBP)
      priceInRub = course.pricePerMonthGBP * EXCHANGE_RATES.GBP;
    else if (course.pricePerMonthAUD)
      priceInRub = course.pricePerMonthAUD * EXCHANGE_RATES.AUD;
    else if (course.pricePerMonthNZD)
      priceInRub = course.pricePerMonthNZD * EXCHANGE_RATES.NZD;
    else if (course.pricePerWeekUSD)
      priceInRub = course.pricePerWeekUSD * 4 * EXCHANGE_RATES.USD;
    else if (course.pricePerWeekEUR)
      priceInRub = course.pricePerWeekEUR * 4 * EXCHANGE_RATES.EUR;
    else if (course.pricePerWeekCAD)
      priceInRub = course.pricePerWeekCAD * 4 * EXCHANGE_RATES.CAD;
    else if (course.pricePerWeekGBP)
      priceInRub = course.pricePerWeekGBP * 4 * EXCHANGE_RATES.GBP;
    else if (course.pricePerWeekAUD)
      priceInRub = course.pricePerWeekAUD * 4 * EXCHANGE_RATES.AUD;
    else if (course.pricePerWeekNZD)
      priceInRub = course.pricePerWeekNZD * 4 * EXCHANGE_RATES.NZD;
  }

  if (priceInRub > 0) {
    return formatCurrency(priceInRub);
  }
  return "По запросу";
}
