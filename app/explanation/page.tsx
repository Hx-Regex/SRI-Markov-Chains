// src/app/explanation/page.tsx
'use client';

export default function ExplanationPage() {
  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-center mb-8">
          Understanding Markov Chains in Search Ranking
        </h1>

        {/* Basic Concept */}
        <section className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-4">Basic Concept</h2>
          <p className="mb-4">
            A Markov Chain is a mathematical system that transitions from one state 
            to another based on certain probabilities. In search ranking:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>States = Search Results/Pages</li>
            <li>Transitions = User clicking from one page to another</li>
            <li>Probabilities = Likelihood of users choosing specific results</li>
          </ul>
        </section>

        {/* How It Works */}
        <section className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-4">How It Works</h2>
          <div className="space-y-4">
            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="font-bold">1. Initial State</h3>
              <p>When a user searches, each result has initial probabilities:</p>
              <ul className="list-disc pl-6">
                <li>Click Probability (how likely users click this result)</li>
                <li>Stay Probability (how long users stay on the page)</li>
                <li>Return Rate (how often users come back to search)</li>
              </ul>
            </div>

            <div className="border-l-4 border-green-500 pl-4">
              <h3 className="font-bold">2. User Behavior</h3>
              <p>As users interact:</p>
              <ul className="list-disc pl-6">
                <li>Click patterns affect probabilities</li>
                <li>Popular pages get higher rankings</li>
                <li>Less useful pages drop in ranking</li>
              </ul>
            </div>

            <div className="border-l-4 border-purple-500 pl-4">
              <h3 className="font-bold">3. Ranking Formula</h3>
              <code className="block bg-gray-100 p-3 rounded">
                Rank = (Click Probability × 0.4) + <br />
                       (Stay Probability × 0.3) + <br />
                       (1 - Return Rate × 0.3)
              </code>
            </div>
          </div>
        </section>

        {/* Example */}
        <section className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-4">Practical Example</h2>
          <div className="space-y-4">
            <p>Consider a search for "Python Tutorial":</p>
            
            <div className="bg-gray-100 p-4 rounded">
              <h3 className="font-bold">Initial State:</h3>
              <pre>
                Result 1: 40% click chance<br />
                Result 2: 30% click chance<br />
                Result 3: 20% click chance
              </pre>
            </div>

            <div className="bg-gray-100 p-4 rounded">
              <h3 className="font-bold">After User Interactions:</h3>
              <pre>
                Result 2: ⬆️ (many clicks, long stays)<br />
                Result 1: ⬇️ (quick bounces)<br />
                Result 3: ⬇️ (few clicks)
              </pre>
            </div>
          </div>
        </section>

        {/* Interactive Demo Link */}
        <div className="text-center">
          <a 
            href="/"
            className="inline-block bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600"
          >
            Try Interactive Demo
          </a>
        </div>
      </div>
    </div>
  );
}