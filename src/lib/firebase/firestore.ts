import { collection, getDocs, getDoc, doc, query, where } from 'firebase/firestore';
import { db } from './firebase';
import type { Job, Application } from '@/lib/types';

// Assumes you have collections named 'jobs' and 'applications' in Firestore.

/**
 * Fetches all jobs from the 'jobs' collection.
 */
export async function fetchJobs(): Promise<Job[]> {
  const jobsCollection = collection(db, 'jobs');
  const jobSnapshot = await getDocs(jobsCollection);
  return jobSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Job));
}

/**
 * Fetches a single job by its ID from the 'jobs' collection.
 * @param id - The ID of the job to fetch.
 */
export async function fetchJobById(id: string): Promise<Job | null> {
  const jobDocRef = doc(db, 'jobs', id);
  const jobSnap = await getDoc(jobDocRef);
  if (jobSnap.exists()) {
    return { id: jobSnap.id, ...jobSnap.data() } as Job;
  }
  return null;
}

/**
 * Fetches all applications for a specific user from the 'applications' collection.
 * @param userId - The UID of the user whose applications to fetch.
 */
export async function fetchApplicationsByUserId(userId: string): Promise<Application[]> {
  const applicationsCollection = collection(db, 'applications');
  const q = query(applicationsCollection, where('userId', '==', userId));
  const appSnapshot = await getDocs(q);
  return appSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Application));
}
