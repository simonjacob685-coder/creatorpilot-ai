import { ActiveResult } from "../types";

const HISTORY_KEY = "creator_pilot_history_v1";

export function getSavedHistory(): ActiveResult[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.error("Failed to load history from localStorage", e);
    return [];
  }
}

export function saveResultToHistory(result: ActiveResult): ActiveResult[] {
  try {
    const current = getSavedHistory();
    // Prepend new result, limit to last 20
    const updated = [result, ...current.filter((item) => {
      if (item.type === result.type && item.data.id === result.data.id) {
        return false;
      }
      return true;
    })].slice(0, 20);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error("Failed to save result to localStorage", e);
    return [];
  }
}

export function clearHistory(): void {
  try {
    localStorage.removeItem(HISTORY_KEY);
  } catch (e) {
    console.error("Failed to clear history", e);
  }
}
