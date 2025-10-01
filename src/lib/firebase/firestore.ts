import { collection, getDocs, getDoc, doc, query, where, Timestamp, addDoc, updateDoc, serverTimestamp, setDoc, deleteDoc, writeBatch } from 'firebase/firestore';
import { db } from './firebase';
import type { Job, Application, JobStatus, UserProfile, ApplicationStatus, JobCategory, PublicJobStatus } from '@/lib/types';

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

type CreateJobData = Partial<Omit<Job, 'id' | 'date' | 'time' | 'startDate' | 'payment' | 'adminStage'>> & {
  jobTitle?: string;
  startDate?: Date;
  startTime?: string;
  totalPay?: number;
  adminStage?: JobStatus;
  jobDescription?: string;
};


/**
 * Creates a new job in the 'jobs' collection.
 * @param jobData - The data for the new job.
 */
export async function createJob(jobData: CreateJobData): Promise<string> {
  const { startDate, startTime, totalPay, adminStage, jobDescription, duration, jobStatus, jobTitle, location, ...restJobData } = jobData;
  
  let combinedDateTime: Date | null = null;
  if (startDate && startTime) {
    const [hours, minutes] = startTime.split(':').map(Number);
    combinedDateTime = new Date(startDate);
    combinedDateTime.setHours(hours, minutes, 0, 0);
  } else if (startDate) {
    combinedDateTime = startDate;
  }

  const jobsCollection = collection(db, 'jobs');
  const docRef = await addDoc(jobsCollection, {
    ...restJobData,
    projectName: jobTitle || null,
    locationCity: location || null,
    fullDescription: jobDescription || '',
    days: duration || null,
    displayStatus: jobStatus || 'Available',
    payment: totalPay || 0,
    startDate: combinedDateTime ? Timestamp.fromDate(combinedDateTime) : serverTimestamp(),
    status: adminStage || 'Open', 
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}


/**
 * Fetches all jobs from the 'jobs' collection.
 */
export async function fetchJobs(adminStageFilter?: JobStatus | JobStatus[]): Promise<Job[]> {
  const jobsCollection = collection(db, 'jobs');
  let q = query(jobsCollection);

  if (adminStageFilter) {
    if (Array.isArray(adminStageFilter)) {
        q = query(jobsCollection, where('status', 'in', adminStageFilter));
    } else {
        q = query(jobsCollection, where('status', '==', adminStageFilter));
    }
  }

  const jobSnapshot = await getDocs(q);
  
  const jobs: Job[] = jobSnapshot.docs.map((doc) => {
    const data = doc.data();
    
    const startDate = data.startDate || data.createdAt;

    return {
      id: doc.id,
      jobTitle: data.projectName || `Project at ${data.locationCity || 'Unknown Location'}`,
      jobDescription: data.fullDescription || data.scopeOfWorkURL || 'No description provided.',
      location: data.locationCity || 'No location specified',
      date: startDate ? formatDate(startDate.toDate()) : 'TBD',
      time: startDate ? formatTime(startDate.toDate()) : 'N/A',
      payment: data.payment || 0,
      adminStage: data.status || 'Open',
      cleanersNeeded: data.cleanersNeeded,
      assignedTo: data.assignedTo,
      category: data.category,
      duration: data.days?.toString() || data.projectDates,
      areaM2: data.areaM2,
      jobStatus: data.displayStatus,
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
    
    const startDate = data.startDate || data.createdAt;

    return { 
        id: jobSnap.id,
        jobTitle: data.projectName || `Project at ${data.locationCity || 'Unknown Location'}`,
        jobDescription: data.fullDescription || data.scopeOfWorkURL || 'No description provided.',
        location: data.locationCity || 'No location specified',
        date: startDate ? formatDate(startDate.toDate()) : 'TBD',
        time: startDate ? formatTime(startDate.toDate()) : 'TBD',
        payment: data.payment || 0,
        adminStage: data.status || 'Open',
        cleanersNeeded: data.cleanersNeeded,
        assignedTo: data.assignedTo,
        category: data.category,
        duration: data.days?.toString() || data.projectDates,
        areaM2: data.areaM2,
        jobStatus: data.displayStatus,
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
    const startDate = (data.startDate || data.createdAt)?.toDate(); // Convert Timestamp to Date
    
    return {
      id: jobSnap.id,
      jobTitle: data.projectName || '',
      jobDescription: data.fullDescription || data.scopeOfWorkURL ||'',
      location: data.locationCity || '',
      totalPay: data.payment || 0,
      paymentPerCleaner: data.paymentPerCleaner || undefined,
      adminStage: data.status || 'Open',
      cleanersNeeded: data.cleanersNeeded || 1,
      startDate: startDate,
      startTime: startDate ? `${startDate.getHours().toString().padStart(2, '0')}:${startDate.getMinutes().toString().padStart(2, '0')}` : '09:00',
      category: data.category,
      duration: data.days?.toString() || data.projectDates,
      areaM2: data.areaM2,
      jobStatus: data.displayStatus,
    };
  }
  return null;
}

/**
 * Updates an existing job in the 'jobs' collection.
 * @param id - The ID of the job to update.
 * @param jobData - The data to update.
 */
export async function updateJob(id: string, jobData: Partial<CreateJobData & { paymentPerCleaner?: number }>): Promise<void> {
    const { startDate, startTime, totalPay, adminStage, jobDescription, duration, jobStatus, jobTitle, location, paymentPerCleaner, ...restJobData } = jobData;
    
    const updateData: {[key: string]: any} = { ...restJobData };
  
    // Handle date and time
    if (startDate) {
      const newDate = new Date(startDate);
      if (startTime) {
        const [hours, minutes] = startTime.split(':').map(Number);
        newDate.setHours(hours, minutes, 0, 0);
      }
      updateData.startDate = Timestamp.fromDate(newDate);
    }
  
    if (totalPay !== undefined) updateData.payment = totalPay;
    if (adminStage) updateData.status = adminStage;
    if (jobDescription !== undefined) updateData.fullDescription = jobDescription;
    if (duration !== undefined) updateData.days = duration;
    if (jobStatus !== undefined) updateData.displayStatus = jobStatus;
    if (jobTitle !== undefined) updateData.projectName = jobTitle;
    if (location !== undefined) updateData.locationCity = location;
    if (paymentPerCleaner !== undefined) {
      updateData.paymentPerCleaner = paymentPerCleaner;
    } else {
      updateData.paymentPerCleaner = null; // Or some other default value that is not undefined
    }
  
    const jobDocRef = doc(db, 'jobs', id);
    await updateDoc(jobDocRef, updateData);
}

/**
 * Deletes a job and all its associated applications.
 * @param jobId The ID of the job to delete.
 */
export async function deleteJob(jobId: string): Promise<void> {
  if (!jobId) {
    throw new Error("Job ID is required.");
  }
  
  const jobDocRef = doc(db, 'jobs', jobId);
  const applicationsRef = collection(db, 'applications');

  // Find all applications for the job
  const q = query(applicationsRef, where("jobId", "==", jobId));
  const querySnapshot = await getDocs(q);

  // Use a batch to delete all applications and the job in one atomic operation
  const batch = writeBatch(db);

  querySnapshot.forEach((doc) => {
    batch.delete(doc.ref);
  });

  batch.delete(jobDocRef);

  await batch.commit();
}


/**
 * Creates a job application.
 * @param jobId - The ID of the job being applied for.
 * @param userId - The UID of the user applying.
 * @param userName - The name of the user applying.
 * @param jobTitle - The title of the job.
 */
export async function applyForJob(jobId: string, userId: string, userName: string, jobTitle: string) {
  // Check if the user has already applied for this job
  const q = query(
    collection(db, 'applications'),
    where('jobId', '==', jobId),
    where('userId', '==', userId)
  );
  const querySnapshot = await getDocs(q);
  if (!querySnapshot.empty) {
    throw new Error("You have already applied for this job.");
  }

  // Create new application
  await addDoc(collection(db, 'applications'), {
    jobId,
    userId,
    userName: userName || 'Anonymous',
    jobTitle,
    status: 'Pending',
    appliedAt: serverTimestamp(),
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

/**
 * Updates the status of a job application.
 * @param applicationId The ID of the application to update.
 * @param status The new status.
 */
export async function updateApplicationStatus(applicationId: string, status: ApplicationStatus): Promise<void> {
    if (!applicationId) return;
    const appDocRef = doc(db, 'applications', applicationId);
    await updateDoc(appDocRef, { status });
}


/**
 * Fetches a user's profile from the 'users' collection.
 * @param userId The UID of the user.
 */
export async function fetchUserProfile(userId: string): Promise<UserProfile | null> {
    if (!userId) return null;
    const userDocRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userDocRef);

    if (userSnap.exists()) {
        return userSnap.data() as UserProfile;
    }
    
    return null;
}

/**
 * Updates a user's profile in the 'users' collection.
 * @param userId The UID of the user.
 * @param profileData The data to update.
 */
export async function updateUserProfile(userId: string, profileData: Partial<UserProfile>): Promise<void> {
    if (!userId) return;
    const userDocRef = doc(db, 'users', userId);
    await setDoc(userDocRef, profileData, { merge: true });
}
