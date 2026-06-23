import { getApp, getApps, initializeApp, type FirebaseApp, type FirebaseOptions } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";

const requiredEnv = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
} satisfies Record<string, string | undefined>;

export const missingFirebaseEnvVars = Object.entries(requiredEnv)
  .filter(([, value]) => !value)
  .map(([key]) => `NEXT_PUBLIC_FIREBASE_${key.replace(/([A-Z])/g, "_$1").toUpperCase()}`);

const firebaseConfig: FirebaseOptions = {
  apiKey: requiredEnv.apiKey || "build-placeholder-api-key",
  authDomain: requiredEnv.authDomain || "build-placeholder.firebaseapp.com",
  projectId: requiredEnv.projectId || "build-placeholder",
  messagingSenderId: requiredEnv.messagingSenderId || "000000000000",
  appId: requiredEnv.appId || "1:000000000000:web:0000000000000000000000",
};

export const app: FirebaseApp = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const db: Firestore = getFirestore(app);
export const auth: Auth = getAuth(app);
