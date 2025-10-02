'use server';

import { getAdminApp } from '@/lib/firebase/firebase-admin';
import { firebaseConfig } from '@/lib/firebase/firebase';

interface GetSignedURLParams {
  filePath: string;
  contentType: string;
}

export async function getSignedURL({ filePath, contentType }: GetSignedURLParams) {
  const adminApp = getAdminApp();
  const bucket = adminApp.storage().bucket();
  const file = bucket.file(filePath);

  const [signedUrl] = await file.getSignedUrl({
    version: 'v4',
    action: 'write',
    expires: Date.now() + 15 * 60 * 1000, // 15 minutes
    contentType,
  });

  const publicUrl = `https://storage.googleapis.com/${firebaseConfig.storageBucket}/${filePath}`;
  
  return { signedUrl, publicUrl };
}
