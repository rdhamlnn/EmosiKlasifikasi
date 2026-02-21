export interface HistoryItem {
    id: string;
    teksInput: string;
    hasilEmosi: string;
    confidence: number;
    probabilities: { emotion: string; probability: number }[];
    createdAt: string;
}

const STORAGE_KEY = "emotionsense_history";

export const getHistory = (): HistoryItem[] => {
    if (typeof window === "undefined") return [];
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
};

export const saveToHistory = (item: Omit<HistoryItem, "id" | "createdAt">) => {
    const history = getHistory();
    history.unshift({
        ...item,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
};

export const deleteHistoryItem = (id: string) => {
    const history = getHistory().filter((item) => item.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    return history;
};

export const clearHistory = () => {
    localStorage.removeItem(STORAGE_KEY);
};
