// src/app/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Page, searchPages, updatePage, getRelatedPages } from './services/api';
import MarkovVisualization from './componenets/MarkovVisualization';
import Tutorial from './componenets/Tutorial';  
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/solid';
import MarkovExplanation from './components/MarkovExplanation';
import { resetDatabase } from './services/resetData';

interface RankChange {
  [key: number]: number;
}

export default function Home() {
  const [pages, setPages] = useState<Page[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentState, setCurrentState] = useState('search');
  const [isLoading, setIsLoading] = useState(false);
  const [relatedPages, setRelatedPages] = useState<Page[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [previousRanks, setPreviousRanks] = useState<RankChange>({});

  // Debounced search function
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery.trim()) {
        handleSearch(searchQuery);
      } else {
        setPages([]);
        setShowResults(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handleSearch = async (query: string) => {
    if (!query.trim()) return;
    
    setIsLoading(true);
    try {
      const results = await searchPages(query);
      const currentRanks: RankChange = {};
      results.forEach(page => {
        currentRanks[page.id] = page.rank;
      });
      setPreviousRanks(currentRanks);
      setPages(results);
      setShowResults(true);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResultClick = async (id: number, event?: React.MouseEvent) => {
    event?.preventDefault();
    
    const page = pages.find(p => p.id === id);
    if (!page) return;

    setIsLoading(true);
    try {
      const related = await getRelatedPages(id);
      setRelatedPages(related);

      const currentRanks: RankChange = {};
      pages.forEach(p => {
        currentRanks[p.id] = p.rank;
      });

      const newClickProb = Math.min(page.clickProbability + 0.05, 1);
      const newStayProb = Math.min(page.stayProbability + 0.02, 1);
      const newRank = calculateNewRank(newClickProb, newStayProb, page.returnRate);

      await updatePage(id, {
        clickProbability: newClickProb,
        stayProbability: newStayProb,
        rank: newRank
      });

      setPages(prevPages => 
        prevPages.map(p => {
          if (p.id === id) {
            return { 
              ...p, 
              clickProbability: newClickProb, 
              stayProbability: newStayProb, 
              rank: newRank 
            };
          } else {
            const decreasedClickProb = Math.max(p.clickProbability - 0.01, 0);
            const decreasedRank = Math.max(p.rank - 1, 0);
            
            updatePage(p.id, {
              clickProbability: decreasedClickProb,
              rank: decreasedRank
            });
            
            return {
              ...p,
              clickProbability: decreasedClickProb,
              rank: decreasedRank
            };
          }
        })
      );

      setCurrentState(page.title);
      setPreviousRanks(currentRanks);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateNewRank = (clickProb: number, stayProb: number, returnRate: number) => {
    return ((clickProb * 0.5) + (stayProb * 0.3) + ((1 - returnRate) * 0.2)) * 100;
  };

  const RankChangeIndicator = ({ currentRank, previousRank }: { currentRank: number, previousRank?: number }) => {
    if (!previousRank || currentRank === previousRank) return null;
    
    if (currentRank > previousRank) {
      return <ArrowUpIcon className="h-4 w-4 text-green-500 inline-block ml-2" />;
    }
    return <ArrowDownIcon className="h-4 w-4 text-red-500 inline-block ml-2" />;
  };

  const handleReset = async () => {
    if (!confirm('Are you sure you want to reset all data? This cannot be undone.')) {
      return;
    }
    
    setIsLoading(true);
    try {
      await resetDatabase();
      setPages([]);
      setRelatedPages([]);
      setShowResults(false);
      setSearchQuery('');
      setPreviousRanks({});
      setCurrentState('search');
      alert('Data has been reset successfully!');
    } catch (error) {
      console.error('Reset error:', error);
      alert('Failed to reset data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <div className="mb-8">
        <div className="relative max-w-4xl mx-auto">
          <button
            onClick={handleReset}
            className="absolute -top-2 right-0 text-sm text-red-500 hover:text-red-600 hover:underline"
          >
            Reset Data
          </button>
          
          <h1 className="text-3xl font-bold text-center mb-4">
            Markov Chain Search Ranking Demo
          </h1>

          <div className="mt-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search (e.g., 'python', 'javascript', 'web development')..."
              className="w-full p-3 border rounded-lg shadow-sm"
            />
          </div>
        </div>
      </div>

      {isLoading && (
        <div className="fixed top-4 right-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
        </div>
      )}

      {showResults && (
        <div className="flex gap-8 flex-col">
          <div className="flex gap-8">
            {/* Left side: Search Results */}
            <div className="w-1/2 space-y-6">
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-xl font-bold mb-4">Search Results</h2>
                {pages.length === 0 ? (
                  <p className="text-gray-500">No results found</p>
                ) : (
                  <div className="space-y-4">
                    {pages
                      .sort((a, b) => b.rank - a.rank)
                      .map((page, index) => (
                        <div 
                          key={page.id}
                          onClick={(e) => handleResultClick(page.id, e)}
                          className="p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <h3 className="font-bold text-blue-600">{page.title}</h3>
                            <div className="flex items-center">
                              <span className="text-sm font-medium text-gray-600">
                                #{index + 1}
                              </span>
                              <RankChangeIndicator 
                                currentRank={page.rank} 
                                previousRank={previousRanks[page.id]} 
                              />
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{page.content}</p>
                          
                          {/* Metrics Display */}
                          <div className="mt-3 grid grid-cols-4 gap-2 text-xs text-gray-500">
                            <div className="p-2 bg-gray-50 rounded">
                              <span className="font-semibold">Click Rate:</span>
                              <div className="mt-1">
                                <div className="w-full bg-gray-200 rounded-full h-1.5">
                                  <div 
                                    className="bg-blue-500 h-1.5 rounded-full" 
                                    style={{width: `${page.clickProbability * 100}%`}}
                                  ></div>
                                </div>
                                <span className="text-xs">{(page.clickProbability * 100).toFixed(0)}%</span>
                              </div>
                            </div>
                            
                            <div className="p-2 bg-gray-50 rounded">
                              <span className="font-semibold">Stay Rate:</span>
                              <div className="mt-1">
                                <div className="w-full bg-gray-200 rounded-full h-1.5">
                                  <div 
                                    className="bg-green-500 h-1.5 rounded-full" 
                                    style={{width: `${page.stayProbability * 100}%`}}
                                  ></div>
                                </div>
                                <span className="text-xs">{(page.stayProbability * 100).toFixed(0)}%</span>
                              </div>
                            </div>
                            
                            <div className="p-2 bg-gray-50 rounded">
                              <span className="font-semibold">Return Rate:</span>
                              <div className="mt-1">
                                <div className="w-full bg-gray-200 rounded-full h-1.5">
                                  <div 
                                    className="bg-yellow-500 h-1.5 rounded-full" 
                                    style={{width: `${page.returnRate * 100}%`}}
                                  ></div>
                                </div>
                                <span className="text-xs">{(page.returnRate * 100).toFixed(0)}%</span>
                              </div>
                            </div>
                            
                            <div className="p-2 bg-gray-50 rounded">
                              <span className="font-semibold">Overall Rank:</span>
                              <div className="mt-1">
                                <div className="w-full bg-gray-200 rounded-full h-1.5">
                                  <div 
                                    className="bg-purple-500 h-1.5 rounded-full" 
                                    style={{width: `${page.rank}%`}}
                                  ></div>
                                </div>
                                <span className="text-xs">{page.rank.toFixed(0)}/100</span>
                              </div>
                            </div>
                          </div>

                          <div className="mt-2 flex flex-wrap gap-2">
                            {page.keywords.map(keyword => (
                              <span 
                                key={keyword}
                                className="px-2 py-1 bg-gray-100 text-xs rounded"
                              >
                                {keyword}
                              </span>
                            ))}
                          </div>
                          <div className="mt-2 text-sm text-gray-500">
                            <span>Category: {page.category}</span>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>

              {/* Related Pages */}
              {relatedPages.length > 0 && (
                <div className="bg-white p-6 rounded-lg shadow-lg transition-all">
                  <h2 className="text-xl font-bold mb-4">Related Pages</h2>
                  <div className="space-y-4">
                    {relatedPages.map(page => (
                      <div 
                        key={page.id}
                        onClick={(e) => handleResultClick(page.id, e)}
                        className="p-4 border rounded-lg cursor-pointer hover:bg-gray-50"
                      >
                        <h3 className="font-bold text-blue-600">{page.title}</h3>
                        <p className="text-sm text-gray-600">{page.content}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right side: Visualization */}
            <div className="w-1/2 sticky top-8 h-[calc(100vh-150px)]">
              <div className="bg-white p-6 rounded-lg shadow-lg h-full">
                <MarkovVisualization
                  results={pages}
                  currentState={currentState}
                  onStateChange={handleResultClick}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      <Tutorial />
    </main>
  );
}