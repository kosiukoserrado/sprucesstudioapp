"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { Slider } from '@/components/ui/slider';
import { updateUserProfile } from '@/lib/firebase/firestore';
import type { UserProfile } from '@/lib/types';

export default function LoginPage() {
  const router = useRouter();
  const { user, signUp, signIn, loading, auth } = useAuth();
  const { toast } = useToast();
  
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
  const [signupPhoneNumber, setSignupPhoneNumber] = useState('');
  const [signupLocation, setSignupLocation] = useState('');
  const [signupAbn, setSignupAbn] = useState('');
  const [signupProximity, setSignupProximity] = useState([25]);

  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signIn(loginEmail, loginPassword);
      toast({ title: "Login Successful", description: "Welcome back!" });
      router.push('/dashboard');
    } catch (error: any) {
      toast({ variant: "destructive", title: "Login Failed", description: error.message });
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (signupPassword !== signupConfirmPassword) {
      toast({ variant: "destructive", title: "Sign Up Failed", description: "Passwords do not match." });
      return;
    }
    try {
      const userCredential = await signUp(signupEmail, signupPassword, signupName);

      if (userCredential && userCredential.user) {
         const profileData: Partial<UserProfile> = {
            fullName: signupName,
            email: signupEmail,
            phoneNumber: signupPhoneNumber,
            location: signupLocation,
            abn: signupAbn,
            proximity: signupProximity[0],
        };
        await updateUserProfile(userCredential.user.uid, profileData);
      }
      
      toast({ title: "Sign Up Successful", description: "Your account has been created." });
      router.push('/dashboard');
    } catch (error: any) {
      toast({ variant: "destructive", title: "Sign Up Failed", description: error.message });
    }
  };

  if (loading) {
     return (
       <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (user) {
    return null; // Or a loader, while redirecting
  }
  
  return (
    <div className="w-full lg:grid lg:min-h-[100vh] lg:grid-cols-2">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[400px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold font-headline">Welcome</h1>
            <p className="text-balance text-muted-foreground">
              Enter your credentials to access your cleaner dashboard
            </p>
          </div>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <Card>
                <CardHeader>
                  <CardTitle>Login</CardTitle>
                  <CardDescription>
                    Access your account to view and manage your cleaning jobs.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email-login">Email</Label>
                      <Input id="email-login" type="email" placeholder="m@example.com" required value={loginEmail} onChange={e => setLoginEmail(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <Label htmlFor="password-login">Password</Label>
                        <Link href="#" className="ml-auto inline-block text-sm underline">
                          Forgot your password?
                        </Link>
                      </div>
                      <Input id="password-login" type="password" required value={loginPassword} onChange={e => setLoginPassword(e.target.value)}/>
                    </div>
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? <Loader2 className="animate-spin" /> : 'Login'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="signup">
              <Card>
                <CardHeader>
                  <CardTitle>Sign Up</CardTitle>
                  <CardDescription>
                    Create an account to start finding cleaning opportunities.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                   <form onSubmit={handleSignUp} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name-signup">Full Name</Label>
                        <Input id="name-signup" placeholder="Alex Doe" required value={signupName} onChange={e => setSignupName(e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone-signup">Phone Number</Label>
                        <Input id="phone-signup" placeholder="0412 345 678" required value={signupPhoneNumber} onChange={e => setSignupPhoneNumber(e.target.value)} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email-signup">Email</Label>
                      <Input id="email-signup" type="email" placeholder="m@example.com" required value={signupEmail} onChange={e => setSignupEmail(e.target.value)} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="password-signup">Password</Label>
                        <Input id="password-signup" type="password" required value={signupPassword} onChange={e => setSignupPassword(e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirm-password-signup">Confirm Password</Label>
                        <Input id="confirm-password-signup" type="password" required value={signupConfirmPassword} onChange={e => setSignupConfirmPassword(e.target.value)} />
                      </div>
                    </div>
                     <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="location-signup">Location</Label>
                        <Input id="location-signup" placeholder="e.g., Southport" required value={signupLocation} onChange={e => setSignupLocation(e.target.value)} />
                      </div>
                       <div className="space-y-2">
                        <Label htmlFor="abn-signup">ABN</Label>
                        <Input id="abn-signup" placeholder="Your ABN" value={signupAbn} onChange={e => setSignupAbn(e.target.value)} />
                      </div>
                    </div>
                    <div className="space-y-4 pt-2">
                        <Label htmlFor="proximity-slider">Job Notification Proximity: {signupProximity[0]} km</Label>
                        <Slider
                            id="proximity-slider"
                            defaultValue={signupProximity}
                            onValueChange={setSignupProximity}
                            max={100}
                            step={1}
                        />
                    </div>
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? <Loader2 className="animate-spin" /> : 'Create an account'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <div className="hidden bg-muted lg:flex lg:flex-col lg:items-center lg:justify-center p-10">
        <div className="relative w-full h-full">
            <Image
                src="https://images.unsplash.com/photo-1516937998395-699e69387a24?q=80&w=2070&auto=format&fit=crop"
                alt="Green plants on a wall"
                fill
                className="object-cover rounded-lg"
                data-ai-hint="green plants"
            />
            <div className="absolute inset-0 bg-zinc-900/60 rounded-lg flex flex-col items-center justify-center text-white p-8 text-center">
                 <h2 className="text-5xl font-bold mb-2 font-headline" style={{color: "#c7de6b"}}>spruces.</h2>
                 <p className="text-xl">The all-in-one platform for professional cleaners.</p>
            </div>
        </div>
      </div>
    </div>
  );
}
