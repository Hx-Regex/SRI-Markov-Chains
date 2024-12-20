const API_URL = 'http://localhost:3001';

const initialData = {
  "pages": [
    {
      "id": 1,
      "title": "Python Programming Fundamentals",
      "url": "python-basics.com/fundamentals",
      "content": "Learn Python basics including variables, data types, and control structures",
      "clickProbability": 0.5,
      "stayProbability": 0.8,
      "returnRate": 0.2,
      "keywords": ["python", "programming", "beginner"],
      "category": "programming",
      "relatedPages": ["2", "8", "15"],
      "rank": 70
    },
    {
      "id": 2,
      "title": "Advanced Python Concepts",
      "url": "python-advanced.com",
      "content": "Master advanced Python features like decorators, generators, and context managers",
      "clickProbability": 0.4,
      "stayProbability": 0.7,
      "returnRate": 0.3,
      "keywords": ["python", "advanced", "programming"],
      "category": "programming",
      "relatedPages": ["1", "16"],
      "rank": 65
    },
    {
      "id": 8,
      "title": "Python Data Structures",
      "url": "python-dsa.com",
      "content": "Understanding lists, dictionaries, sets, and tuples in Python",
      "clickProbability": 0.2,
      "stayProbability": 0.7,
      "returnRate": 0.1,
      "keywords": ["python", "data structures", "programming"],
      "category": "programming",
      "relatedPages": ["1", "2", "9"],
      "rank": 55
    },
    {
      "id": 9,
      "title": "Algorithms with Python",
      "url": "python-algorithms.com",
      "content": "Implementation of common algorithms using Python",
      "clickProbability": 0.4,
      "stayProbability": 0.6,
      "returnRate": 0.2,
      "keywords": ["python", "algorithms", "programming"],
      "category": "programming",
      "relatedPages": ["8", "2", "1"],
      "rank": 58
    },
    {
      "id": 15,
      "title": "Web Development with Python Flask",
      "url": "flask-tutorial.com",
      "content": "Build web applications using Python Flask framework",
      "clickProbability": 0.5,
      "stayProbability": 0.7,
      "returnRate": 0.1,
      "keywords": ["python", "flask", "web development"],
      "category": "web development",
      "relatedPages": ["16", "1", "2"],
      "rank": 70
    },
    {
      "id": 16,
      "title": "Django Web Framework",
      "url": "django-basics.com",
      "content": "Learn Django framework for building robust web applications",
      "clickProbability": 0.2,
      "stayProbability": 0.8,
      "returnRate": 0.2,
      "keywords": ["python", "django", "web development"],
      "category": "web development",
      "relatedPages": ["15", "1", "2"],
      "rank": 52
    },
    {
      "id": 3,
      "title": "JavaScript Fundamentals",
      "url": "js-basics.com",
      "content": "Core concepts of JavaScript programming language",
      "clickProbability": 0.6,
      "stayProbability": 0.7,
      "returnRate": 0.2,
      "keywords": ["javascript", "web", "programming"],
      "category": "programming",
      "relatedPages": ["4", "5", "6"],
      "rank": 65
    },
    {
      "id": 4,
      "title": "Advanced JavaScript Concepts",
      "url": "js-advanced.com",
      "content": "Advanced JS topics including closures, promises, and async/await",
      "clickProbability": 0.4,
      "stayProbability": 0.6,
      "returnRate": 0.3,
      "keywords": ["javascript", "advanced", "programming"],
      "category": "programming",
      "relatedPages": ["3", "5", "6"],
      "rank": 55
    },
    {
      "id": 5,
      "title": "React.js Basics",
      "url": "react-tutorial.com",
      "content": "Introduction to React.js framework",
      "clickProbability": 0.7,
      "stayProbability": 0.8,
      "returnRate": 0.1,
      "keywords": ["react", "javascript", "frontend"],
      "category": "web development",
      "relatedPages": ["6", "3", "4"],
      "rank": 75
    },
    {
      "id": 6,
      "title": "Advanced React Patterns",
      "url": "react-advanced.com",
      "content": "Advanced React patterns and best practices",
      "clickProbability": 0.25,
      "stayProbability": 0.9,
      "returnRate": 0.2,
      "keywords": ["react", "javascript", "advanced"],
      "category": "web development",
      "relatedPages": ["5", "3", "4"],
      "rank": 50
    }
  ],
  "categories": [
    {
      "id": "1",
      "name": "programming",
      "description": "General programming concepts and languages"
    },
    {
      "id": "2",
      "name": "web development",
      "description": "Web development frameworks and technologies"
    }
  ],
  "searchHistory": []
};

export const resetDatabase = async () => {
  try {
    // Reset each page individually
    const resetPromises = initialData.pages.map(page => 
      fetch(`${API_URL}/pages/${page.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(page),
      })
    );

    await Promise.all(resetPromises);
    return true;
  } catch (error) {
    console.error('Error resetting database:', error);
    throw error;
  }
}; 