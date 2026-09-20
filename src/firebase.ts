import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import bundledConfig from '../firebase-applet-config.json';

// Universal Firebase Configuration with Triple-Redundancy (Env Vars -> Bundled JSON -> Static Fallback)
// Ensures 100% reliable real-time database connection in local dev, AI Studio, and Vercel deployments
const STATIC_FALLBACK_CONFIG = {
  projectId: "gen-lang-client-0207271679",
  appId: "1:970131731174:web:5feddb801a76d6e8e48127",
  apiKey: "AIzaSyCnguqdB9UVFaVaF-HTsUkUDNFWQtaU8lY",
  authDomain: "gen-lang-client-0207271679.firebaseapp.com",
  firestoreDatabaseId: "ai-studio-1959e55b-78c9-4673-be88-b7d93b87ba81",
  storageBucket: "gen-lang-client-0207271679.firebasestorage.app",
  messagingSenderId: "970131731174",
};

const firebaseConfig = {
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || bundledConfig?.projectId || STATIC_FALLBACK_CONFIG.projectId,
  appId: import.meta.env.VITE_FIREBASE_APP_ID || bundledConfig?.appId || STATIC_FALLBACK_CONFIG.appId,
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || bundledConfig?.apiKey || STATIC_FALLBACK_CONFIG.apiKey,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || bundledConfig?.authDomain || STATIC_FALLBACK_CONFIG.authDomain,
  firestoreDatabaseId: import.meta.env.VITE_FIREBASE_DATABASE_ID || bundledConfig?.firestoreDatabaseId || STATIC_FALLBACK_CONFIG.firestoreDatabaseId,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || bundledConfig?.storageBucket || STATIC_FALLBACK_CONFIG.storageBucket,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || bundledConfig?.messagingSenderId || STATIC_FALLBACK_CONFIG.messagingSenderId,
};

// Initialize Firebase App
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// CRITICAL: Connect to the specific database instance
export const db = firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== '(default)'
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

export const auth = getAuth(app);

// Connection test helper
export async function testConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase client is offline or starting up:', error.message);
    }
    return false;
  }
}

// Non-blocking connection test
testConnection().catch((err) => {
  console.warn('Connection check handled:', err);
});

export { app, firebaseConfig };
