# Markov Chain Search Ranking Demo

A demonstration of search result ranking using Markov Chain principles. This project shows how user interactions can dynamically influence search rankings through click probabilities, stay rates, and return rates.

## Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (version 18 or higher)
- [Git](https://git-scm.com/) (or GitHub Desktop)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/markov-search-demo.git
cd markov-search-demo
```

2. Install dependencies:
```bash
npm install
```

3. Start the JSON server (in a separate terminal):
```bash
npm run json-server
```

4. Start the development server (in another terminal):
```bash
npm run dev
```

5. Open your browser and navigate to [http://localhost:3000](http://localhost:3000)

## Important Notes

- The JSON server runs on port 3001
- The Next.js development server runs on port 3000
- Both servers need to be running simultaneously for the application to work
- Make sure no other applications are using these ports

## Features

- Dynamic search ranking based on Markov Chain principles
- Real-time visualization of page relationships
- Interactive result ranking updates
- Click, stay, and return rate tracking
- Related pages suggestions
- Visual feedback for ranking changes

## Tech Stack

- Next.js 15.1 with App Router
- TypeScript
- Tailwind CSS
- D3.js for visualizations
- JSON Server for data persistence

## Basic Usage

1. Enter a search term (e.g., "python", "javascript")
2. Click on results to see ranking changes
3. Observe the Markov Chain visualization
4. Use the reset button to restore default rankings

## License

MIT License
