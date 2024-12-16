// src/utils/markov.ts
export interface SearchResult {
    id: number;
    title: string;
    url: string;
    clickProbability: number;
    stayProbability: number;
    returnRate: number;
  }
  
  export const initialResults: SearchResult[] = [
    {
      id: 1,
      title: "Introduction to Python",
      url: "python-intro.com",
      clickProbability: 0.4,
      stayProbability: 0.6,
      returnRate: 0.2
    },
    {
      id: 2,
      title: "JavaScript Basics",
      url: "js-basics.com",
      clickProbability: 0.3,
      stayProbability: 0.5,
      returnRate: 0.3
    },
    {
      id: 3,
      title: "React Tutorial",
      url: "react-tutorial.com",
      clickProbability: 0.5,
      stayProbability: 0.7,
      returnRate: 0.1
    }
  ];
  
  export const calculateRank = (result: SearchResult) => {
    // More dramatic ranking formula
    return (
      (result.clickProbability * 0.5) +
      (result.stayProbability * 0.3) +
      ((1 - result.returnRate) * 0.2)
    ) * 100; // Multiply by 100 to make changes more visible
  };
  