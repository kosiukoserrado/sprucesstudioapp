import { NextResponse } from 'next/server';
import { adminStorage, adminAuth } from '@/lib/firebase/firebase-admin';
import { headers } from 'next/headers';

export async function POST(request: Request) {
  const headersList = headers();
  const authorization = headersList.get('authorization');

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized: No token provided' }, { status: 401 });
  }

  const token = authorization.split('Bearer ')[1];

  try {
    await adminAuth.verifyIdToken(token);
  } catch (error) {
    console.error('Token verification failed:', error);
    return NextResponse.json({ error: 'Unauthorized: Invalid token' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const path = formData.get('path') as string | null;

    if (!file || !path) {
      return NextResponse.json({ error: 'File or path is missing' }, { status: 400 });
    }

    const bucket = adminStorage.bucket();
    const fileBuffer = Buffer.from(await file.arrayBuffer());

    const fileRef = bucket.file(path);
    
    await fileRef.save(fileBuffer, {
      metadata: {
        contentType: file.type,
      },
    });

    const [downloadURL] = await fileRef.getSignedUrl({
        action: 'read',
        expires: '03-09-2491'
    });

    return NextResponse.json({ downloadURL });
  } catch (error) {
    console.error('Upload failed:', error);
    return NextResponse.json({ error: 'Something went wrong during the file upload.' }, { status: 500 });
  }
}
