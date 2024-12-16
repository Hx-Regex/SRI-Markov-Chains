// src/app/components/Tutorial.tsx
'use client';

const Tutorial = () => {
  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6">How Markov Chains Work in Search</h2>
      <div className="space-y-4">
        <div className="border-l-4 border-blue-500 pl-4">
          <h3 className="font-bold">1. States</h3>
          <p>Each search result is a state in our Markov Chain</p>
        </div>
        
        <div className="border-l-4 border-green-500 pl-4">
          <h3 className="font-bold">2. Transitions</h3>
          <p>Clicking results creates transitions between states</p>
        </div>
        
        <div className="border-l-4 border-purple-500 pl-4">
          <h3 className="font-bold">3. Probabilities</h3>
          <p>Each click updates the probability of future transitions</p>
        </div>
        
        <div className="border-l-4 border-yellow-500 pl-4">
          <h3 className="font-bold">4. Ranking</h3>
          <p>Results are ranked based on their transition probabilities</p>
        </div>
      </div>
    </div>
  );
};

export default Tutorial;