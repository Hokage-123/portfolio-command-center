import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

// Get Firebase configuration from localStorage or environment variables
function getFirebaseConfig() {
  // Try localStorage first
  const savedKeys = localStorage.getItem('portfolio_api_keys');
  if (savedKeys) {
    try {
      const parsedKeys = JSON.parse(savedKeys);
      if (parsedKeys.firebaseApiKey && parsedKeys.firebaseAuthDomain && parsedKeys.firebaseProjectId) {
        return {
          apiKey: parsedKeys.firebaseApiKey,
          authDomain: parsedKeys.firebaseAuthDomain,
          projectId: parsedKeys.firebaseProjectId,
          storageBucket: `${parsedKeys.firebaseProjectId}.appspot.com`,
          messagingSenderId: "123456789", // Default fallback
          appId: "1:123456789:web:abcdef" // Default fallback
        };
      }
    } catch (error) {
      console.error('Error parsing saved Firebase keys:', error);
    }
  }

  // Fallback to environment variables
  return {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'demo_firebase_key',
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'demo.firebaseapp.com',
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'demo-project',
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'demo-project.appspot.com',
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '123456789',
    appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:123456789:web:abcdef',
  };
}

// Initialize Firebase services
let app: FirebaseApp;
let auth: Auth;
let db: Firestore;

function initializeFirebaseServices() {
  const config = getFirebaseConfig();
  
  try {
    app = initializeApp(config);
    auth = getAuth(app);
    db = getFirestore(app);
    
    console.log('Firebase initialized successfully');
  } catch (error) {
    console.warn('Firebase initialization failed:', error);
    console.warn('Authentication and database features will be limited.');
  }
}

// Initialize services on module load
initializeFirebaseServices();

// Listen for API key updates and reinitialize Firebase
if (typeof window !== 'undefined') {
  window.addEventListener('apiKeysUpdated', () => {
    console.log('Reinitializing Firebase with updated keys...');
    initializeFirebaseServices();
  });
}

// Check if Firebase is properly configured
export function isFirebaseConfigured(): boolean {
  const config = getFirebaseConfig();
  return config.apiKey !== 'demo_firebase_key' && 
         config.authDomain !== 'demo.firebaseapp.com' && 
         config.projectId !== 'demo-project';
}

export { auth, db };
export default app;
