import { storage } from "./storage.js";

export const AppState = {
  currentStep: 1,
  filters: {
    totalBudget: null,
    budgetType: "total",
    duration: { value: null, unit: "months" },
    climate: null,
    workAllowed: null,
    skippedSteps: [],
  },
  results: {
    all: [],
    topRecommended: [],
  },
  activeSortTab: "price-quality",
  savedSearches: [], 

  init() {
    const saved = storage.loadState();
    if (saved) {
      this.currentStep = saved.currentStep || 1;
      this.filters = saved.filters || this.filters;
      this.activeSortTab = saved.activeSortTab || "price-quality";
      this.results = saved.results || { all: [], topRecommended: [] };
    }
    this.savedSearches = storage.loadSavedSearches() || [];
  },

  reset() {
    this.currentStep = 1;
    this.filters = {
      totalBudget: null,
      budgetType: "total",
      duration: { value: null, unit: "months" },
      climate: null,
      workAllowed: null,
      skippedSteps: [],
    };
    this.results = { all: [], topRecommended: [] };
    this.activeSortTab = "price-quality";
    storage.clearState();
  },

  save() {
    storage.saveState({
      currentStep: this.currentStep,
      filters: this.filters,
      activeSortTab: this.activeSortTab,
      results: this.results,
    });
  },

  addSavedSearch() {
    if (this.results.all.length === 0) return;
    const search = {
      id: Date.now(),
      date: new Date().toLocaleString("ru-RU"),
      filters: { ...this.filters },
      results: {
        all: this.results.all,
        topRecommended: this.results.topRecommended,
      },
      activeSortTab: this.activeSortTab,
    };
    this.savedSearches.unshift(search);
    if (this.savedSearches.length > 10) this.savedSearches.pop();
    storage.saveSavedSearches(this.savedSearches);
  },

  removeSavedSearch(id) {
    this.savedSearches = this.savedSearches.filter((s) => s.id !== id);
    storage.saveSavedSearches(this.savedSearches);
  },
};
