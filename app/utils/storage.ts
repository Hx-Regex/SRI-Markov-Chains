import { Page } from '../data/staticData';
import { defaultPages } from '../data/defaultData';

const STORAGE_KEY = 'markov-search-pages';

export const loadPages = (): Page[] => {
  if (typeof window === 'undefined') return defaultPages;
  
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return defaultPages;
  
  try {
    return JSON.parse(stored);
  } catch {
    return defaultPages;
  }
};

export const savePages = (pages: Page[]) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(pages));
}; 