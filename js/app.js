import { AppState } from './core/state.js';
import { renderHomePage } from './ui/home.js';
import { renderWizardPage } from './ui/wizard.js';
import { renderCountryPage } from './ui/country.js';
import { renderSchoolPage } from './ui/school.js';
import { renderSavedPage } from './ui/saved.js';
import { renderAboutPage } from './ui/about.js';
import { storage } from './core/storage.js';

const root = document.getElementById('app-root');
let currentPath = window.location.pathname;

const BASE_PATH = (() => {
    const path = window.location.pathname;
    const match = path.match(/^(\/[^/]+)(?:\/|$)/);
    if (match && !match[1].includes('.')) {
        return match[1] + '/';
    }
    return '/';
})();

function normalizePath(path) {
    if (BASE_PATH !== '/' && path.startsWith(BASE_PATH)) {
        return path.slice(BASE_PATH.length - 1) || '/';
    }
    return path;
}

function fullPath(route) {
    if (BASE_PATH === '/') return route;
    return BASE_PATH.slice(0, -1) + route;
}

window.appGoBack = function() {
    if (window.history.length > 1) {
        window.history.back();
    } else {
        navigateTo('/');
    }
};

document.addEventListener('click', (e) => {
    const link = e.target.closest('[data-link]');
    if (link) {
        e.preventDefault();
        const path = link.dataset.link;
        navigateTo(path);
    }
});

window.addEventListener('popstate', () => {
    handleLocation();
});

export function navigateTo(path) {
    const normalized = normalizePath(path);
    const targetFullPath = fullPath(normalized);
    if (targetFullPath === currentPath) return;
    window.history.pushState({}, '', targetFullPath);
    handleLocation();
}

function handleLocation() {
    currentPath = window.location.pathname;
    const normalizedPath = normalizePath(currentPath);
    renderPage(normalizedPath);
    updateActiveNav();
}

function renderPage(path) {
    root.classList.add('page-transition-enter');
    root.classList.remove('page-transition-enter-active');
    
    setTimeout(() => {
        if (path === '/' || path === '') {
            renderHomePage();
        } else if (path === '/wizard') {
            if (AppState.currentStep === 4 && AppState.results.all.length > 0) {
                renderWizardPage();
            } else {
                if (AppState.savedSearches && AppState.savedSearches.length > 0) {
                    const lastSearch = AppState.savedSearches[0];
                    AppState.filters = { ...lastSearch.filters };
                    AppState.results = { ...lastSearch.results };
                    AppState.activeSortTab = lastSearch.activeSortTab;
                    AppState.currentStep = 4;
                    AppState.save();
                    renderWizardPage();
                } else {
                    AppState.reset();
                    AppState.currentStep = 1;
                    storage.saveState(AppState);
                    renderWizardPage();
                }
            }
        } else if (path.startsWith('/country/')) {
            const countryId = path.split('/')[2];
            renderCountryPage(countryId);
        } else if (path.startsWith('/school/')) {
            const schoolId = path.split('/')[2];
            renderSchoolPage(schoolId);
        } else if (path === '/saved') {
            renderSavedPage();
        } else if (path === '/about') {
            renderAboutPage();
        } else {
            root.innerHTML = `<div class="text-center py-20">Страница не найдена</div>`;
        }
        
        root.classList.add('page-transition-enter-active');
    }, 50);
}

function updateActiveNav() {
    const normalizedCurrent = normalizePath(currentPath);
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('text-blue-800', 'font-semibold');
        if (link.dataset.link === normalizedCurrent) {
            link.classList.add('text-blue-800', 'font-semibold');
        }
    });
}

document.addEventListener('input', (e) => {
    if (e.target.id === 'global-search-input') {
        const query = e.target.value.toLowerCase();
        window.dispatchEvent(new CustomEvent('global-search', { detail: query }));
    }
});

document.addEventListener('DOMContentLoaded', () => {
    AppState.init();
    
    const isFirstVisit = !localStorage.getItem('studyCost_visited');
    const currentPathname = window.location.pathname;
    const normalizedCurrent = normalizePath(currentPathname);
    
    if (isFirstVisit && (normalizedCurrent === '/' || normalizedCurrent === '')) {
        localStorage.setItem('studyCost_visited', 'true');
        const aboutFullPath = fullPath('/about');
        window.history.replaceState({}, '', aboutFullPath);
        handleLocation();
        return;
    }
    
    handleLocation();
});
