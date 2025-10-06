# Spruces. - Cleaner Management Platform

This is a Next.js web application designed as a two-sided platform to connect a cleaning services company with professional cleaners. The app provides separate dashboard views for administrators and cleaners to manage the lifecycle of cleaning jobs.

This project is connected to a GitHub repository for version control and collaborative development.

## Key Features

The application is divided into two main user roles: Admin and Cleaner.

### 1. Cleaner Features

- **Authentication:** Cleaners can sign up and log in to their accounts using email and password.
- **Dashboard:** A central hub showing their current job, a summary of their applications, and new job opportunities.
- **Job Opportunities:** Cleaners can browse a list of all available cleaning jobs.
- **Job Details & Application:** They can view detailed information for each job and submit an application.
- **Application Tracking:** Cleaners can view a list of all jobs they have applied for and track their application status (Pending, Accepted, Rejected).
- **Profile Management:** Cleaners can update their personal and professional information, including their name, contact details, ABN, banking information, and profile picture.

### 2. Admin Features

- **Admin-Only Access:** The admin section is protected and only accessible to a designated administrator email.
- **Job Management (CRUD):** Admins can create, view, edit, and delete job listings.
- **Application Review:** Admins can view all applications submitted by cleaners for each job. They can review applicant details and change an application's status to "Accepted," "Rejected," or "Pending."

## Technology Stack

- **Framework:** Next.js (with App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** ShadCN UI
- **Authentication:** Firebase Authentication
- **Database:** Firestore
- **File Storage:** Firebase Storage (for profile pictures and other documents)

## Firebase Services Used

- **Firebase Authentication:** Manages user registration and login. It provides the core security and identity layer for the application.
- **Firestore:** A NoSQL database used to store all application data, including `jobs`, `users` (profiles), and `applications`.
- **Firebase Storage:** Used for storing user-uploaded files, primarily cleaner profile pictures and verification documents like White Cards.

## Current Known Issues

- **Image Upload Functionality:** This is the most significant known issue. When a cleaner attempts to upload a profile picture on the "My Profile" page, the operation fails due to a **CORS (Cross-Origin Resource Sharing) policy error**. The browser blocks the upload request because the web app's domain is not on the Firebase Storage bucket's list of allowed origins.
    - **Status:** The application code has been updated multiple times to attempt different solutions (server-side proxy, client-side SDK), but the issue persists because it is a cloud configuration problem, not a code problem.
    - **Required Fix:** The CORS policy on the Google Cloud Storage bucket that backs Firebase Storage needs to be updated. A `cors.json` file with the correct configuration is present in the project's root directory. This configuration must be applied to the bucket for uploads to work.
