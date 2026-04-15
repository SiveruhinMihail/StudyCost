const STATE_KEY = "studyCost_state";
const SAVED_KEY = "studyCost_saved";

export const storage = {
  saveState(state) {
    try {
      localStorage.setItem(STATE_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn("Failed to save state", e);
    }
  },
  loadState() {
    try {
      const data = localStorage.getItem(STATE_KEY);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      return null;
    }
  },
  clearState() {
    localStorage.removeItem(STATE_KEY);
  },
  saveSavedSearches(searches) {
    try {
      localStorage.setItem(SAVED_KEY, JSON.stringify(searches));
    } catch (e) {
      console.warn("Failed to save searches", e);
    }
  },
  loadSavedSearches() {
    try {
      const data = localStorage.getItem(SAVED_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  },
};
