import * as admin from 'firebase-admin';

const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT;

if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(JSON.parse(serviceAccount as string)),
      storageBucket: 'spruces-app-bff67.appspot.com',
    });
  } catch (error) {
    console.error('Firebase Admin Initialization Error', error);
  }
}

export const adminAuth = admin.auth();
export const adminStorage = admin.storage();
