import { defaultPages } from './defaultData';
import { loadPages, savePages } from '../utils/storage';

export interface Page {
  id: number;
  title: string;
  content: string;
  keywords: string[];
  rank: number;
  clickProbability: number;
  stayProbability: number;
  returnRate: number;
  category: string;
  url?: string;
  relatedPages?: string[];
}

// Initialize from localStorage or defaults
export let pages: Page[] = loadPages();

export function resetPages(): void {
  pages = [...defaultPages];
  savePages(pages);
}

export function searchPages(query: string): Page[] {
  const searchTerms = query.toLowerCase().split(' ');
  
  return pages.filter(page => 
    searchTerms.some(term => 
      page.title.toLowerCase().includes(term) ||
      page.content.toLowerCase().includes(term) ||
      page.keywords.some(keyword => keyword.includes(term))
    )
  );
}

export function getRelatedPages(id: number): Page[] {
  const currentPage = pages.find(p => p.id === id);
  if (!currentPage) return [];
  
  return pages
    .filter(page => 
      page.id !== id && 
      page.keywords.some(keyword => 
        currentPage.keywords.includes(keyword)
      )
    )
    .slice(0, 3);
}

export function updatePage(id: number, updates: Partial<Page>): void {
  const pageIndex = pages.findIndex(p => p.id === id);
  if (pageIndex !== -1) {
    pages[pageIndex] = { ...pages[pageIndex], ...updates };
    savePages(pages);
  }
} 