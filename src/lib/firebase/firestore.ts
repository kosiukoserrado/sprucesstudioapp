import { collection, getDocs, getDoc, doc, query, where, Timestamp } from 'firebase/firestore';
import { db } from './firebase';
import type { Job, Application } from '@/lib/types';

// Assumes you have collections named 'jobs' and 'applications' in Firestore.

/**
 * Fetches all jobs from the 'jobs' collection.
 */
export async function fetchJobs(): Promise<Job[]> {
  const jobsCollection = collection(db, 'jobs');
  const jobSnapshot = await getDocs(jobsCollection);
  return jobSnapshot.docs.map(doc => {
    const data = doc.data();
    const payment = data.payment ? parseFloat(data.payment) : 0;
    return { 
      id: doc.id,
      jobTitle: data.jobTitle,
      jobDescription: data.jobDescription,
      location: data.location,
      date: data.date,
      time: data.time,
      payment: isNaN(payment) ? 0 : payment,
     } as Job;
  });
}

/**
 * Fetches a single job by its ID from the 'jobs' collection.
 * @param id - The ID of the job to fetch.
 */
export async function fetchJobById(id: string): Promise<Job | null> {
  const jobDocRef = doc(db, 'jobs', id);
  const jobSnap = await getDoc(jobDocRef);
  if (jobSnap.exists()) {
    const data = jobSnap.data();
    const payment = data.payment ? parseFloat(data.payment) : 0;
    return { 
        id: jobSnap.id,
        jobTitle: data.jobTitle,
        jobDescription: data.jobDescription,
        location: data.location,
        date: data.date,
        time: data.time,
        payment: isNaN(payment) ? 0 : payment,
     } as Job;
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
  return appSnapshot.docs.map(doc => {
    const data = doc.data();
    // Convert Firestore Timestamp to a readable string date format
    const appliedAt = data.appliedAt instanceof Timestamp 
      ? data.appliedAt.toDate().toLocaleDateString() 
      : data.appliedAt;

    return { 
      id: doc.id, 
      ...data,
      appliedAt,
    } as Application;
  });
}
