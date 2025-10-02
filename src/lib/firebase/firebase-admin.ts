import * as admin from 'firebase-admin';
import { firebaseConfig } from './firebase';

export function getAdminApp() {
    if (admin.apps.length > 0) {
        return admin.apps[0] as admin.app.App;
    }

    // This is a workaround for Vercel/Next.js environments where
    // service account credentials need to be parsed from an environment variable.
    const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT
        ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
        : undefined;

    if (!serviceAccount) {
         console.warn("FIREBASE_SERVICE_ACCOUNT env var not set. Firebase Admin SDK not initialized.");
         // Return a dummy object or handle as you see fit
         return {
            storage: () => ({
                bucket: () => ({
                    file: () => ({
                        getSignedUrl: () => Promise.reject("Admin SDK not initialized."),
                    }),
                }),
            }),
         } as any;
    }

    return admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        storageBucket: firebaseConfig.storageBucket,
    });
}
