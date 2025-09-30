import { collection, getDocs, getDoc, doc, query, where, Timestamp, addDoc, updateDoc } from 'firebase/firestore';
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

type CreateJobData = Omit<Job, 'id' | 'date' | 'time' | 'startDate'> & {
  startDate: Date;
  startTime: string;
};

/**
 * Creates a new job in the 'jobs' collection.
 * @param jobData - The data for the new job.
 */
export async function createJob(jobData: CreateJobData): Promise<string> {
  const { startDate, startTime, ...restJobData } = jobData;
  const [hours, minutes] = startTime.split(':').map(Number);
  
  const combinedDateTime = new Date(startDate);
  combinedDateTime.setHours(hours, minutes, 0, 0);

  const jobsCollection = collection(db, 'jobs');
  const docRef = await addDoc(jobsCollection, {
    ...restJobData,
     jobTitle: restJobData.jobTitle,
    jobDescription: restJobData.jobDescription,
    location: restJobData.location,
    totalPay: restJobData.totalPay,
    startDate: Timestamp.fromDate(combinedDateTime),
  });
  return docRef.id;
}


/**
 * Fetches all jobs from the 'jobs' collection.
 */
export async function fetchJobs(): Promise<Job[]> {
  const jobsCollection = collection(db, 'jobs');
  const jobSnapshot = await getDocs(jobsCollection);
  
  const jobs: Job[] = jobSnapshot.docs.map((doc) => {
    const data = doc.data();
    
    let payment = 0;
    const paymentValue = data.totalPay || data.paymentPerCleaner || 0;
    if (typeof paymentValue === 'string') {
        payment = parseFloat(paymentValue) || 0;
    } else if (typeof paymentValue === 'number') {
        payment = paymentValue;
    }

    const startDate = data.startDate;

    return {
      id: doc.id,
      jobTitle: data.jobTitle || data.projectName || data.title || 'Untitled Job',
      jobDescription: data.jobDescription || data.fullDescription || 'No description provided.',
      location: data.location || data.locationCity || 'No location specified',
      date: startDate ? formatDate(startDate.toDate()) : 'TBD',
      time: startDate ? formatTime(startDate.toDate()) : 'N/A',
      payment: payment,
      status: data.status || 'Available',
      cleanersNeeded: data.cleanersNeeded,
      areaM2: data.areaM2,
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
    const paymentValue = data.totalPay || data.paymentPerCleaner || 0;
     if (typeof paymentValue === 'string') {
        payment = parseFloat(paymentValue) || 0;
    } else if (typeof paymentValue === 'number') {
        payment = paymentValue;
    }
    
    const startDate = data.startDate;

    return { 
        id: jobSnap.id,
        jobTitle: data.jobTitle || data.projectName || data.title || 'Untitled Job',
        jobDescription: data.jobDescription || data.fullDescription || 'No description provided.',
        location: data.location || data.locationCity || 'No location specified',
        date: startDate ? formatDate(startDate.toDate()) : 'TBD',
        time: startDate ? formatTime(startDate.toDate()) : 'N/A',
        payment: payment,
        status: data.status || 'Available',
        cleanersNeeded: data.cleanersNeeded,
        areaM2: data.areaM2,
     };
  }
  
  return null;
}

// Separate function to fetch raw data for the edit form
export async function fetchJobByIdForEdit(id: string): Promise<any | null> {
  if (!id) return null;
  const jobDocRef = doc(db, 'jobs', id);
  const jobSnap = await getDoc(jobDocRef);

  if (jobSnap.exists()) {
    const data = jobSnap.data();
    const startDate = data.startDate?.toDate(); // Convert Timestamp to Date
    
    let payment = 0;
    const paymentValue = data.totalPay || data.paymentPerCleaner || 0;
     if (typeof paymentValue === 'string') {
        payment = parseFloat(paymentValue) || 0;
    } else if (typeof paymentValue === 'number') {
        payment = paymentValue;
    }
    
    return {
      id: jobSnap.id,
      jobTitle: data.jobTitle || data.projectName || data.title || '',
      jobDescription: data.jobDescription || data.fullDescription || '',
      location: data.location || data.locationCity || '',
      totalPay: payment,
      paymentPerCleaner: data.paymentPerCleaner || undefined,
      status: data.status || 'Available',
      cleanersNeeded: data.cleanersNeeded || 1,
      areaM2: data.areaM2 || undefined,
      startDate: startDate,
      startTime: startDate ? `${startDate.getHours().toString().padStart(2, '0')}:${startDate.getMinutes().toString().padStart(2, '0')}` : '09:00',
    };
  }
  return null;
}

/**
 * Updates an existing job in the 'jobs' collection.
 * @param id - The ID of the job to update.
 * @param jobData - The data to update.
 */
export async function updateJob(id: string, jobData: CreateJobData): Promise<void> {
  const { startDate, startTime, ...restJobData } = jobData;
  const [hours, minutes] = startTime.split(':').map(Number);
  
  const combinedDateTime = new Date(startDate);
  combinedDateTime.setHours(hours, minutes, 0, 0);

  const jobDocRef = doc(db, 'jobs', id);
  await updateDoc(jobDocRef, {
    ...restJobData,
    jobTitle: restJobData.jobTitle,
    jobDescription: restJobData.jobDescription,
    location: restJobData.location,
    totalPay: restJobData.totalPay,
    startDate: Timestamp.fromDate(combinedDateTime),
  });
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
      userName: data.userName || 'N/A'
    };
  });

  return applications;
}

/**
 * Fetches all applications from the 'applications' collection for the admin.
 */
export async function fetchAllApplications(): Promise<Application[]> {
  const applicationsCollection = collection(db, 'applications');
  const appSnapshot = await getDocs(applicationsCollection);

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
      userName: data.userName || 'N/A'
    };
  });

  return applications;
}