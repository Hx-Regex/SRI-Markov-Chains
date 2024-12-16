// src/services/api.ts
const API_URL = 'http://localhost:3001';

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

export async function searchPages(query: string): Promise<Page[]> {
  const response = await fetch(`${API_URL}/pages`);
  const pages = await response.json();
  return pages.filter((page: Page) => 
    page.title.toLowerCase().includes(query.toLowerCase()) ||
    page.content.toLowerCase().includes(query.toLowerCase()) ||
    page.keywords.some(k => k.toLowerCase().includes(query.toLowerCase()))
  );
}

export async function updatePage(id: number, updates: Partial<Page>): Promise<void> {
  await fetch(`${API_URL}/pages/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updates),
  });
}

export async function getRelatedPages(id: number): Promise<Page[]> {
  const response = await fetch(`${API_URL}/pages/${id}`);
  const page = await response.json();
  const relatedIds = page.relatedPages || [];
  
  const relatedPages = await Promise.all(
    relatedIds.map(async (relatedId: string) => {
      const response = await fetch(`${API_URL}/pages/${relatedId}`);
      return response.json();
    })
  );
  
  return relatedPages;
}