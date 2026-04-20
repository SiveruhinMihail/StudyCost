import { AppState } from "./core/state.js";
import { renderHomePage } from "./ui/home.js";
import { renderWizardPage } from "./ui/wizard.js";
import { renderCountryPage } from "./ui/country.js";
import { renderSchoolPage } from "./ui/school.js";
import { renderSavedPage } from "./ui/saved.js";
import { renderAboutPage } from "./ui/about.js";
import { renderResultDetailPage } from "./ui/resultDetail.js";
import { storage } from "./core/storage.js";

const root = document.getElementById("app-root");

function getHashPath() {
  const hash = window.location.hash.slice(1);
  return hash || "/";
}

let currentPath = getHashPath();

window.appGoBack = function () {
  if (window.history.length > 1) {
    window.history.back();
  } else {
    navigateTo("/");
  }
};

document.addEventListener("click", (e) => {
  const link = e.target.closest("[data-link]");
  if (link) {
    e.preventDefault();
    const path = link.dataset.link;
    navigateTo(path);
  }
});

window.addEventListener("hashchange", () => {
  handleLocation();
});

export function navigateTo(path) {
  const targetFullPath = "#" + path;
  if (targetFullPath === "#" + currentPath) return;
  window.location.hash = path;
}

function handleLocation() {
  currentPath = getHashPath();
  renderPage(currentPath);
  updateActiveNav();
}

function renderPage(path) {
  root.classList.add("page-transition-enter");
  root.classList.remove("page-transition-enter-active");

  setTimeout(() => {
    if (path === "/" || path === "") {
      renderHomePage();
    } else if (path === "/wizard") {
      // Если уже есть результаты (шаг 5), просто показываем их
      if (AppState.currentStep === 5 && AppState.results.all.length > 0) {
        renderWizardPage();
      } else if (
        AppState.currentStep === 4 &&
        AppState.results.all.length > 0
      ) {
        // legacy
        renderWizardPage();
      } else {
        // Иначе загружаем последнюю сохранённую подборку
        if (AppState.savedSearches && AppState.savedSearches.length > 0) {
          const lastSearch = AppState.savedSearches[0];
          AppState.filters = { ...lastSearch.filters };
          AppState.results = { ...lastSearch.results };
          AppState.activeSortTab = lastSearch.activeSortTab;
          AppState.currentStep = 5;
          AppState.save();
          renderWizardPage();
        } else {
          AppState.reset();
          AppState.currentStep = 1;
          storage.saveState(AppState);
          renderWizardPage();
        }
      }
    } else if (path.startsWith("/country/")) {
      const countryId = path.split("/")[2];
      renderCountryPage(countryId);
    } else if (path.startsWith("/school/")) {
      const schoolId = path.split("/")[2];
      renderSchoolPage(schoolId);
    } else if (path.startsWith("/result/")) {
      const index = parseInt(path.split("/")[2], 10);
      renderResultDetailPage(index);
    } else if (path === "/saved") {
      renderSavedPage();
    } else if (path === "/about") {
      renderAboutPage();
    } else {
      root.innerHTML = `<div class="text-center py-20">Страница не найдена</div>`;
    }

    root.classList.add("page-transition-enter-active");
  }, 50);
}

function updateActiveNav() {
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.classList.remove("text-blue-800", "font-semibold");
    if (link.dataset.link === currentPath) {
      link.classList.add("text-blue-800", "font-semibold");
    }
  });
}

document.addEventListener("input", (e) => {
  if (e.target.id === "global-search-input") {
    const query = e.target.value.toLowerCase();
    window.dispatchEvent(new CustomEvent("global-search", { detail: query }));
  }
});

document.addEventListener("DOMContentLoaded", () => {
  AppState.init();

  const isFirstVisit = !localStorage.getItem("studyCost_visited");
  const currentHash = getHashPath();

  if (isFirstVisit && (currentHash === "/" || currentHash === "")) {
    localStorage.setItem("studyCost_visited", "true");
    navigateTo("/about");
    return;
  }

  handleLocation();
});
