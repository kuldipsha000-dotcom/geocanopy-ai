/**
 * Firebase Configuration — GeoCanopy AI
 *
 * HOW TO SET UP (takes 3 minutes):
 * 1. Go to https://console.firebase.google.com
 * 2. Click "Add project" → name it "geocanopy-ai" → Continue
 * 3. Disable Google Analytics (optional) → Create project
 * 4. Click "Realtime Database" in the left sidebar → "Create Database"
 * 5. Choose region: asia-southeast1 (Singapore) → Start in TEST mode → Enable
 * 6. Go to Project Settings (gear icon) → "Your apps" → Click Web icon (</>)
 * 7. Register app name "GeoCanopy Web" → Copy the firebaseConfig values below
 * 8. Replace the placeholder strings with your actual values
 * 9. In Realtime Database Rules, paste this for secure public read/write:
 *
 *    {
 *      "rules": {
 *        "visitors": {
 *          ".read": true,
 *          ".write": true
 *        }
 *      }
 *    }
 */

import { initializeApp, FirebaseApp } from 'firebase/app';
import { getDatabase, Database } from 'firebase/database';

const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY            || 'YOUR_API_KEY',
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN        || 'YOUR_PROJECT.firebaseapp.com',
  databaseURL:       import.meta.env.VITE_FIREBASE_DATABASE_URL       || 'https://YOUR_PROJECT-default-rtdb.asia-southeast1.firebasedatabase.app',
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID         || 'YOUR_PROJECT_ID',
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET     || 'YOUR_PROJECT.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || 'YOUR_SENDER_ID',
  appId:             import.meta.env.VITE_FIREBASE_APP_ID             || 'YOUR_APP_ID',
};

// Detect if config is still placeholder (no real keys set yet)
export const isFirebaseConfigured: boolean =
  firebaseConfig.apiKey !== 'YOUR_API_KEY' &&
  firebaseConfig.databaseURL !== 'https://YOUR_PROJECT-default-rtdb.asia-southeast1.firebasedatabase.app';

let app: FirebaseApp | null = null;
let database: Database | null = null;

if (isFirebaseConfigured) {
  try {
    app = initializeApp(firebaseConfig);
    database = getDatabase(app);
  } catch (e) {
    console.warn('[GeoCanopy] Firebase init failed:', e);
  }
}

export { database };
export default app;
