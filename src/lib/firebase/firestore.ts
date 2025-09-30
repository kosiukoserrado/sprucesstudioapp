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
  
  if (jobSnapshot.empty) {
    return [];
  }

  const jobs = jobSnapshot.docs.map((doc) => {
    const data = doc.data();
    let payment = 0;
    const paymentValue = data.payment;

    if (typeof paymentValue === 'string') {
        payment = parseFloat(paymentValue);
    } else if (typeof paymentValue === 'number') {
        payment = paymentValue;
    }

    return {
      id: doc.id,
      jobTitle: data.jobTitle || 'Untitled Job',
      jobDescription: data.jobDescription || 'No description provided.',
      location: data.location || 'No location specified',
      date: data.date || 'Date not set',
      time: data.time || 'Time not set',
      payment: isNaN(payment) ? 0 : payment,
    };
  });

  return jobs;
}

/**
 * Fetches a single job by its ID from the 'jobs' collection.
 * @param id - The ID of the job to fetch.
 */
export async function fetchJobById(id: string): Promise<Job | null> {
  if (!id) return null;
  const jobDocRef = doc(db, 'jobs', id);
  const jobSnap = await getDoc(jobDocRef);

  if (jobSnap.exists()) {
    const data = jobSnap.data();
    let payment = 0;
    const paymentValue = data.payment;
    
    if (typeof paymentValue === 'string') {
        payment = parseFloat(paymentValue);
    } else if (typeof paymentValue === 'number') {
        payment = paymentValue;
    }

    return { 
        id: jobSnap.id,
        jobTitle: data.jobTitle || 'Untitled Job',
        jobDescription: data.jobDescription || 'No description provided.',
        location: data.location || 'No location specified',
        date: data.date || 'Date not set',
        time: data.time || 'Time not set',
        payment: isNaN(payment) ? 0 : payment,
     };
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
      : 'N/A';

    return { 
      id: doc.id, 
      userId: data.userId,
      jobId: data.jobId,
      status: data.status,
      jobTitle: data.jobTitle,
      appliedAt,
    } as Application;
  });
}
