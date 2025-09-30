import { redirect } from 'next/navigation';

export default function Home() {
  // This component is no longer used directly.
  // The redirect in next.config.js handles routing to /login.
  // This file remains to satisfy Next.js page requirements.
  redirect('/login');
}
