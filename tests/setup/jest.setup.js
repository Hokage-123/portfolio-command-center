// Jest setup file for Portfolio Command Center tests

// Mock Firebase
global.firebase = {
  initializeApp: jest.fn(),
  auth: jest.fn(() => ({
    signInAnonymously: jest.fn(() => Promise.resolve({
      user: { uid: 'test-uid', isAnonymous: true }
    })),
    onAuthStateChanged: jest.fn()
  })),
  firestore: jest.fn(() => ({
    doc: jest.fn(() => ({
      get: jest.fn(() => Promise.resolve({
        exists: true,
        data: () => ({ test: 'data' })
      })),
      set: jest.fn(() => Promise.resolve())
    }))
  }))
};

// Mock Chart.js
global.Chart = {
  register: jest.fn(),
  Chart: jest.fn()
};

// Mock DOM APIs
Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn()
  }
});

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  log: jest.fn(),
  warn: jest.fn(),
  error: jest.fn()
};

// Setup DOM
document.body.innerHTML = '<div id="app"></div>';
