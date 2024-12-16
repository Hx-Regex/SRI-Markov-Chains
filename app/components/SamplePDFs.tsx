import React from 'react';

interface SamplePDF {
  title: string;
  description: string;
  url: string;
}

const SAMPLE_PDFS: SamplePDF[] = [
  {
    title: "React Documentation",
    description: "Official React documentation in PDF format",
    url: "/samples/react-docs.pdf"
  },
  {
    title: "JavaScript Basics",
    description: "A comprehensive guide to JavaScript fundamentals",
    url: "/samples/javascript-basics.pdf"
  },
  // Add more sample PDFs as needed
];

export default function SamplePDFs({ onSelect }: { onSelect: (url: string) => void }) {
  const fetchAndLoadPDF = async (url: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const file = new File([blob], url.split('/').pop() || 'document.pdf', { type: 'application/pdf' });
      onSelect(file);
    } catch (error) {
      console.error('Error loading sample PDF:', error);
      alert('Failed to load sample PDF');
    }
  };

  return (
    <div className="mt-4">
      <h2 className="text-xl font-semibold mb-3">Sample PDFs</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {SAMPLE_PDFS.map((pdf) => (
          <div 
            key={pdf.url}
            className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
            onClick={() => fetchAndLoadPDF(pdf.url)}
          >
            <h3 className="font-medium text-blue-600">{pdf.title}</h3>
            <p className="text-sm text-gray-600">{pdf.description}</p>
          </div>
        ))}
      </div>
      
      <div className="mt-4 text-sm text-gray-500">
        <p>You can also:</p>
        <ul className="list-disc ml-5 space-y-1">
          <li>
            <a 
              href="https://arxiv.org" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              Download research papers from arXiv
            </a>
          </li>
          <li>
            <a 
              href="https://gutenberg.org" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              Get free eBooks from Project Gutenberg
            </a>
          </li>
          <li>
            <a 
              href="https://pdfdrive.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              Browse PDFs on PDF Drive
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
} 