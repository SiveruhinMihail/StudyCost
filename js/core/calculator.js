import { countries } from "../data/countries.js";
import { courses } from "../data/courses.js";
import { livingCosts } from "../data/livingCosts.js";
import { visaCosts } from "../data/visaCosts.js";

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

function convertToRUB(amount, currency) {
  return amount * (EXCHANGE_RATES[currency] || 1);
}

function getCourseCost(course, durationValue, durationUnit) {
  let weeks;
  switch (durationUnit) {
    case "weeks":
      weeks = durationValue;
      break;
    case "months":
      weeks = durationValue * 4;
      break;
    case "semester":
      weeks = 24;
      break;
    case "year":
      weeks = 48;
      break;
    default:
      weeks = durationValue * 4;
  }

  let cost = 0,
    currency = "USD";
  if (course.pricePerWeekUSD) {
    cost = course.pricePerWeekUSD * weeks;
    currency = "USD";
  } else if (course.pricePerWeekEUR) {
    cost = course.pricePerWeekEUR * weeks;
    currency = "EUR";
  } else if (course.pricePerWeekCAD) {
    cost = course.pricePerWeekCAD * weeks;
    currency = "CAD";
  } else if (course.pricePerWeekGBP) {
    cost = course.pricePerWeekGBP * weeks;
    currency = "GBP";
  } else if (course.pricePerWeekAUD) {
    cost = course.pricePerWeekAUD * weeks;
    currency = "AUD";
  } else if (course.pricePerWeekNZD) {
    cost = course.pricePerWeekNZD * weeks;
    currency = "NZD";
  } else if (course.pricePerMonthUSD) {
    cost = course.pricePerMonthUSD * (weeks / 4);
    currency = "USD";
  } else if (course.pricePerMonthEUR) {
    cost = course.pricePerMonthEUR * (weeks / 4);
    currency = "EUR";
  } else if (course.pricePerMonthCAD) {
    cost = course.pricePerMonthCAD * (weeks / 4);
    currency = "CAD";
  } else if (course.pricePerMonthGBP) {
    cost = course.pricePerMonthGBP * (weeks / 4);
    currency = "GBP";
  } else if (course.pricePerMonthAUD) {
    cost = course.pricePerMonthAUD * (weeks / 4);
    currency = "AUD";
  } else if (course.pricePerMonthNZD) {
    cost = course.pricePerMonthNZD * (weeks / 4);
    currency = "NZD";
  }

  return cost > 0 ? convertToRUB(cost, currency) : 0;
}

function getLivingCost(living, durationValue, durationUnit) {
  if (!living) return 0;
  let months;
  switch (durationUnit) {
    case "weeks":
      months = durationValue / 4;
      break;
    case "months":
      months = durationValue;
      break;
    case "semester":
      months = 6;
      break;
    case "year":
      months = 12;
      break;
    default:
      months = durationValue;
  }
  const avgAccommodation =
    (living.accommodation.sharedRoom + living.accommodation.privateRoom) / 2;
  const avgFood = (living.food.cooking + living.food.eatingOut) / 2;
  const totalLocal =
    (avgAccommodation + avgFood + (living.transport || 0)) * months;
  return convertToRUB(totalLocal, living.currency);
}

function getVisaCostRub(countryId) {
  const visa = visaCosts.find((v) => v.countryId === countryId);
  if (!visa) return 0;
  let amount = 0,
    currency = "USD";
  if (visa.priceEUR) {
    amount = visa.priceEUR;
    currency = "EUR";
  } else if (visa.priceUSD) {
    amount = visa.priceUSD;
    currency = "USD";
  } else if (visa.priceGBP) {
    amount = visa.priceGBP;
    currency = "GBP";
  } else if (visa.priceAUD) {
    amount = visa.priceAUD;
    currency = "AUD";
  } else if (visa.priceNZD) {
    amount = visa.priceNZD;
    currency = "NZD";
  } else if (visa.priceCAD) {
    amount = visa.priceCAD;
    currency = "CAD";
  } else if (visa.priceAED) {
    amount = visa.priceAED;
    currency = "AED";
  }
  return convertToRUB(amount, currency);
}

export function calculateCandidates(filters) {
  const { totalBudget, budgetType, duration, climate, workAllowed } = filters;
  if (!duration || !duration.value) return [];

  let candidates = buildCandidates(filters, true);
  if (candidates.length === 0) {
    candidates = buildCandidates({ ...filters, climate: null }, true);
  }
  if (candidates.length === 0) {
    candidates = buildCandidates(
      { ...filters, climate: null, workAllowed: null },
      true,
    );
  }
  if (candidates.length === 0) {
    candidates = buildCandidates(
      { ...filters, climate: null, workAllowed: null },
      false,
    );
  }
  return candidates;
}

function buildCandidates(filters, applyBudgetLimit = true) {
  const { totalBudget, budgetType, duration, climate, workAllowed } = filters;
  const candidates = [];

  for (const course of courses) {
    const country = countries.find((c) => c.id === course.countryId);
    const living = livingCosts.find(
      (l) => l.countryId === course.countryId && l.city === course.city,
    );
    if (!country) continue;

    if (climate && country.climate !== climate && country.climate !== "varied")
      continue;
    if (workAllowed !== null && country.workAllowed !== workAllowed) continue;

    const courseCostRub = getCourseCost(course, duration.value, duration.unit);
    const livingCostRub = getLivingCost(living, duration.value, duration.unit);
    const visaCostRub = getVisaCostRub(course.countryId);
    const flightEstimateRub = 50000;

    let totalCostRub;
    if (budgetType === "course") totalCostRub = courseCostRub;
    else if (budgetType === "course+living")
      totalCostRub = courseCostRub + livingCostRub;
    else
      totalCostRub =
        courseCostRub + livingCostRub + visaCostRub + flightEstimateRub;

    if (totalCostRub === 0) continue;

    const budgetDiff = totalBudget ? totalBudget - totalCostRub : null;
    if (applyBudgetLimit && totalBudget !== null && budgetDiff < 0) continue;

    candidates.push({
      schoolId: course.id,
      countryId: course.countryId,
      countryName: country.name,
      flag: country.flag,
      city: course.city,
      schoolName: course.schoolName,
      schoolRating: course.schoolRating || 4.0,
      courseCost: Math.round(courseCostRub),
      livingCost: Math.round(livingCostRub),
      visaCost: Math.round(visaCostRub),
      totalCost: Math.round(totalCostRub),
      budgetDiff: budgetDiff !== null ? Math.round(budgetDiff) : null,
      workAllowed: country.workAllowed,
    });
  }
  return candidates;
}

export function rankCandidates(candidates, sortType, budget) {
  const sorted = [...candidates];
  switch (sortType) {
    case "savings":
      sorted.sort(
        (a, b) => (b.budgetDiff || -Infinity) - (a.budgetDiff || -Infinity),
      );
      break;
    case "prestige":
      sorted.sort((a, b) => {
        const ratingA = a.schoolRating || 4.0;
        const ratingB = b.schoolRating || 4.0;
        if (ratingA !== ratingB) return ratingB - ratingA;
        return a.countryName.localeCompare(b.countryName);
      });
      break;
    case "price-quality":
    default:
      sorted.sort((a, b) => {
        const scoreA =
          a.schoolRating * 0.6 +
          (budget ? Math.max(0, a.budgetDiff / budget) : 0) * 0.4;
        const scoreB =
          b.schoolRating * 0.6 +
          (budget ? Math.max(0, b.budgetDiff / budget) : 0) * 0.4;
        return scoreB - scoreA;
      });
      break;
  }
  return sorted;
}
