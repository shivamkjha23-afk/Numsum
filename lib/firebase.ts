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

const missingEnvVars = Object.entries(requiredEnv)
  .filter(([, value]) => !value)
  .map(([key]) => `NEXT_PUBLIC_FIREBASE_${key.replace(/([A-Z])/g, "_$1").toUpperCase()}`);

if (missingEnvVars.length > 0) {
  throw new Error(`Missing Firebase environment variables: ${missingEnvVars.join(", ")}`);
}

const firebaseConfig: FirebaseOptions = {
  apiKey: requiredEnv.apiKey,
  authDomain: requiredEnv.authDomain,
  projectId: requiredEnv.projectId,
  messagingSenderId: requiredEnv.messagingSenderId,
  appId: requiredEnv.appId,
};

export const app: FirebaseApp = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const db: Firestore = getFirestore(app);
export const auth: Auth = getAuth(app);
