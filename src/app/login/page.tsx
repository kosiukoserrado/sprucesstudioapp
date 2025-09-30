"use client";

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LifeBuoy, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';

export default function LoginPage() {
  const router = useRouter();
  const { user, signUp, signIn, loading } = useAuth();
  const { toast } = useToast();
  
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');

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
    try {
      await signUp(signupEmail, signupPassword, signupName);
      toast({ title: "Sign Up Successful", description: "Your account has been created." });
      router.push('/dashboard');
    } catch (error: any) {
       toast({ variant: "destructive", title: "Sign Up Failed", description: error.message });
    }
  };

  if (user) {
    router.push('/dashboard');
    return null;
  }
  
  return (
    <div className="w-full lg:grid lg:min-h-[100vh] lg:grid-cols-2">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Welcome</h1>
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
                <CardContent>
                   <form onSubmit={handleSignUp} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name-signup">Full Name</Label>
                      <Input id="name-signup" placeholder="Alex Doe" required value={signupName} onChange={e => setSignupName(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email-signup">Email</Label>
                      <Input id="email-signup" type="email" placeholder="m@example.com" required value={signupEmail} onChange={e => setSignupEmail(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password-signup">Password</Label>
                      <Input id="password-signup" type="password" required value={signupPassword} onChange={e => setSignupPassword(e.target.value)} />
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
                src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=2070&auto=format&fit=crop"
                alt="Person cleaning a window"
                fill
                className="object-cover rounded-lg"
                data-ai-hint="person cleaning"
            />
            <div className="absolute inset-0 bg-zinc-900/60 rounded-lg flex flex-col items-center justify-center text-white p-8 text-center">
                 <LifeBuoy className="w-16 h-16 text-primary mb-4" />
                 <h2 className="text-4xl font-bold mb-2">SprucesApp Portal</h2>
                 <p className="text-xl">The all-in-one platform for professional cleaners.</p>
            </div>
        </div>
      </div>
    </div>
  );
}
