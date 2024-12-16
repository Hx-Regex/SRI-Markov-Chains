import { pdfjs } from 'pdf-lib';

export interface PDFPage {
  id: number;
  title: string;
  content: string;
  pageNumber: number;
  keywords: string[];
  rank: number;
  clickProbability: number;
  stayProbability: number;
  returnRate: number;
  category: string;
}

export async function parsePDF(file: File): Promise<PDFPage[]> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjs.getDocument(arrayBuffer).promise;
  const pages: PDFPage[] = [];

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const text = textContent.items
      .map((item: any) => item.str)
      .join(' ');

    // Extract a title from the first line or use filename
    const title = i === 1 ? text.split('\n')[0] : `Page ${i}`;
    
    // Extract keywords (you might want to implement a more sophisticated keyword extraction)
    const keywords = extractKeywords(text);

    pages.push({
      id: i,
      title: title,
      content: text.substring(0, 200) + '...', // Preview of content
      pageNumber: i,
      keywords,
      rank: 50, // Default rank
      clickProbability: 0.5,
      stayProbability: 0.5,
      returnRate: 0.3,
      category: 'Document'
    });
  }

  return pages;
}

function extractKeywords(text: string): string[] {
  // Simple keyword extraction - you might want to use a more sophisticated approach
  const words = text.toLowerCase()
    .split(/\W+/)
    .filter(word => word.length > 4)
    .filter(word => !commonWords.includes(word));
  
  return Array.from(new Set(words)).slice(0, 5);
}

const commonWords = [
  'about', 'above', 'after', 'again', 'their', 'these', 'those', 'which', 'while',
  // Add more common words as needed
];

export function searchPDFPages(pages: PDFPage[], query: string): PDFPage[] {
  const searchTerms = query.toLowerCase().split(' ');
  
  return pages
    .map(page => {
      const contentMatch = searchTerms.every(term => 
        page.content.toLowerCase().includes(term) ||
        page.keywords.some(keyword => keyword.includes(term))
      );
      
      if (contentMatch) {
        return {
          ...page,
          rank: calculateRelevance(page, searchTerms)
        };
      }
      return null;
    })
    .filter((page): page is PDFPage => page !== null);
}

function calculateRelevance(page: PDFPage, searchTerms: string[]): number {
  let score = 0;
  
  // Calculate score based on term frequency
  searchTerms.forEach(term => {
    const contentCount = (page.content.toLowerCase().match(new RegExp(term, 'g')) || []).length;
    const keywordCount = page.keywords.filter(k => k.includes(term)).length;
    
    score += (contentCount * 0.5) + (keywordCount * 2);
  });

  return Math.min(100, score * 10);
} 