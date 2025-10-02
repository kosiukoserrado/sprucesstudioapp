import { NextResponse } from 'next/server';
import { getAuth } from 'firebase-admin/auth';
import { getStorage } from 'firebase-admin/storage';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { Readable } from 'stream';

// Initialize Firebase Admin SDK
// This is necessary for server-side operations.
const serviceAccount = JSON.parse(
    process.env.FIREBASE_SERVICE_ACCOUNT_KEY as string
);

if (!getApps().length) {
    initializeApp({
        credential: cert(serviceAccount),
        storageBucket: 'spruces-app-bff67.appspot.com'
    });
}

export async function POST(request: Request) {
    try {
        const authToken = request.headers.get('Authorization')?.split('Bearer ')[1];
        if (!authToken) {
            return NextResponse.json({ error: 'Unauthorized: No token provided' }, { status: 401 });
        }
        
        const decodedToken = await getAuth().verifyIdToken(authToken);
        const userId = decodedToken.uid;

        const formData = await request.formData();
        const file = formData.get('file') as File | null;
        const path = formData.get('path') as string | null;

        if (!file || !path) {
            return NextResponse.json({ error: 'File or path not provided' }, { status: 400 });
        }
        
        // Security check: ensure user is uploading to their own path
        if (!path.startsWith(`profile_pictures/${userId}`) && !path.startsWith(`white_cards/${userId}`)) {
             return NextResponse.json({ error: 'Unauthorized: You can only upload to your own directory.' }, { status: 403 });
        }
        
        const bucket = getStorage().bucket();
        const fileRef = bucket.file(path);

        // Stream the file upload
        const stream = fileRef.createWriteStream({
            metadata: {
                contentType: file.type,
            },
        });

        // Convert the file blob to a buffer and then to a readable stream
        const buffer = Buffer.from(await file.arrayBuffer());
        const readable = new Readable();
        readable._read = () => {}; // _read is required but you can noop it
        readable.push(buffer);
        readable.push(null);

        await new Promise((resolve, reject) => {
            readable.pipe(stream)
                .on('finish', resolve)
                .on('error', reject);
        });

        // Make the file public and get the URL
        await fileRef.makePublic();
        const downloadURL = fileRef.publicUrl();

        return NextResponse.json({ downloadURL });

    } catch (error: any) {
        console.error('Upload API Error:', error);
        if (error.code === 'auth/id-token-expired' || error.code === 'auth/argument-error') {
             return NextResponse.json({ error: 'Unauthorized: Invalid token' }, { status: 401 });
        }
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
