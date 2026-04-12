import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

if (!getApps().length) {
  console.log("Initializing Firebase Admin SDK...");
  console.log("Project ID:", process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID);
  console.log("Client Email:", process.env.FIREBASE_CLIENT_EMAIL);
  
  initializeApp({
    credential: cert({
      project_id: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
      private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    } as any),
  });
  
  console.log("Firebase Admin SDK initialized successfully");
}
export const db = getFirestore();