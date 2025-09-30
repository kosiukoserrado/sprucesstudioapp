import { collection, getDocs, getDoc, doc, query, where, Timestamp } from 'firebase/firestore';
import { db } from './firebase';
import type { Job, Application } from '@/lib/types';

function formatDate(timestamp: Timestamp | Date): string {
    if (!timestamp) return 'Date not set';
    const date = (timestamp instanceof Timestamp) ? timestamp.toDate() : timestamp;
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }).format(date);
}

function formatTime(timestamp: Timestamp | Date): string {
    if (!timestamp) return 'Time not set';
     const date = (timestamp instanceof Timestamp) ? timestamp.toDate() : timestamp;
    return new Intl.DateTimeFormat('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    }).format(date);
}


/**
 * Fetches all jobs from the 'jobs' collection.
 */
export async function fetchJobs(): Promise<Job[]> {
  const jobsCollection = collection(db, 'jobs');
  const jobSnapshot = await getDocs(jobsCollection);
  
  if (jobSnapshot.empty) {
    return [];
  }

  const jobs: Job[] = jobSnapshot.docs.map((doc) => {
    const data = doc.data();
    
    // Safely handle payment, which might be a string or number
    let payment = 0;
    const paymentValue = data.totalPay || data.payment;
    if (typeof paymentValue === 'string') {
        payment = parseFloat(paymentValue) || 0;
    } else if (typeof paymentValue === 'number') {
        payment = paymentValue;
    }

    const startDate = data.startDate;

    return {
      id: doc.id,
      jobTitle: data.projectName || data.title || 'Untitled Job',
      jobDescription: data.fullDescription || data.jobDescription || 'No description provided.',
      location: data.locationCity || data.location || 'No location specified',
      date: startDate ? formatDate(startDate) : 'Date not set',
      time: startDate ? formatTime(startDate) : 'Time not set',
      payment: payment,
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
    const paymentValue = data.totalPay || data.payment;
     if (typeof paymentValue === 'string') {
        payment = parseFloat(paymentValue) || 0;
    } else if (typeof paymentValue === 'number') {
        payment = paymentValue;
    }
    
    const startDate = data.startDate;

    return { 
        id: jobSnap.id,
        jobTitle: data.projectName || data.title || 'Untitled Job',
        jobDescription: data.fullDescription || data.jobDescription || 'No description provided.',
        location: data.locationCity || data.location || 'No location specified',
        date: startDate ? formatDate(startDate) : 'Date not set',
        time: startDate ? formatTime(startDate) : 'Time not set',
        payment: payment,
     };
  }
  
  return null;
}

/**
 * Fetches all applications for a specific user from the 'applications' collection.
 * @param userId - The UID of the user whose applications to fetch.
 */
export async function fetchApplicationsByUserId(userId: string): Promise<Application[]> {
  if (!userId) return [];
  const applicationsCollection = collection(db, 'applications');
  const q = query(applicationsCollection, where('userId', '==', userId));
  const appSnapshot = await getDocs(q);

  if (appSnapshot.empty) {
    return [];
  }

  const applications: Application[] = appSnapshot.docs.map(doc => {
    const data = doc.data();
    const appliedAt = data.appliedAt;

    return { 
      id: doc.id, 
      userId: data.userId,
      jobId: data.jobId,
      status: data.status || "Pending",
      jobTitle: data.jobTitle || 'Untitled Job',
      appliedAt: appliedAt instanceof Timestamp ? appliedAt.toDate().toLocaleDateString() : 'N/A',
    };
  });

  return applications;
}
