"use client";

import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { User as UserIcon, LogOut, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function ProfilePage() {
    const { user, signOut } = useAuth();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [fullName, setFullName] = useState(user?.displayName || '');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [location, setLocation] = useState('');
    const [postcode, setPostcode] = useState('');
    const [nationality, setNationality] = useState('');
    const [proximity, setProximity] = useState([25]);

    const getInitials = (name: string) => {
        if (!name) return 'U';
        const names = name.split(' ');
        if (names.length > 1) {
            return names[0][0] + names[names.length - 1][0];
        }
        return name.substring(0, 2);
    };
    
    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Here you would typically call an update function to save the data to Firestore
        // e.g., await updateUserProfile(user.uid, { fullName, phoneNumber, ... });
        console.log({
            fullName,
            phoneNumber,
            location,
            postcode,
            nationality,
            proximity: proximity[0],
        });
        
        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            toast({
                title: "Profile Updated",
                description: "Your information has been saved successfully.",
            });
        }, 1500);
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div className="space-y-2">
                    <h1 className="font-headline text-3xl font-bold tracking-tight">Your Profile</h1>
                    <p className="text-muted-foreground">Keep your information up-to-date to find the best job matches.</p>
                </div>
                 <Button variant="destructive-outline" onClick={signOut}>
                    <LogOut className="mr-2 h-4 w-4" /> Logout
                </Button>
            </div>
            
            <form onSubmit={handleUpdate}>
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-4">
                            <UserIcon className="h-6 w-6 text-muted-foreground" />
                            <CardTitle>Profile Picture</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="flex items-center gap-6">
                         <Avatar className="h-20 w-20">
                            <AvatarImage src={user?.photoURL || ''} />
                            <AvatarFallback>{getInitials(fullName)}</AvatarFallback>
                        </Avatar>
                        <div className="space-y-2">
                            <Label htmlFor="picture">Upload New Profile Picture</Label>
                            <Input id="picture" type="file" className="max-w-sm" />
                            <p className="text-xs text-muted-foreground">Recommended: Square image (e.g., 300x300px)</p>
                        </div>
                    </CardContent>
                </Card>

                <Separator className="my-8" />
                
                <Card>
                     <CardHeader>
                        <div className="flex items-center gap-4">
                            <UserIcon className="h-6 w-6 text-muted-foreground" />
                            <CardTitle>Personal Information</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="fullName">Full Name</Label>
                                <Input id="fullName" value={fullName} onChange={e => setFullName(e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" value={user?.email || ''} disabled />
                                <p className="text-xs text-muted-foreground">Email cannot be changed here.</p>
                            </div>
                        </div>
                         <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="phoneNumber">Phone Number</Label>
                                <Input id="phoneNumber" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} placeholder="0775006585"/>
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="location">Location</Label>
                                <Input id="location" value={location} onChange={e => setLocation(e.target.value)} placeholder="Southport 4521" />
                                <p className="text-xs text-muted-foreground">Your current location for job matching.</p>
                            </div>
                        </div>
                         <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="postcode">Postcode</Label>
                                <Input id="postcode" value={postcode} onChange={e => setPostcode(e.target.value)} placeholder="4215" />
                                <p className="text-xs text-muted-foreground">Used for job proximity matching.</p>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="nationality">Nationality</Label>
                                <Input id="nationality" value={nationality} onChange={e => setNationality(e.target.value)} />
                            </div>
                        </div>
                        <div className="space-y-4 pt-2">
                            <Label htmlFor="proximity-slider">Job Notification Proximity: {proximity[0]} km</Label>
                            <Slider
                                id="proximity-slider"
                                defaultValue={proximity}
                                onValueChange={setProximity}
                                max={100}
                                step={1}
                            />
                            <p className="text-xs text-muted-foreground">Set how far you're willing to travel for jobs.</p>
                        </div>
                    </CardContent>
                </Card>
                
                <div className="mt-8 flex justify-end">
                    <Button type="submit" disabled={loading}>
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Finish update
                    </Button>
                </div>
            </form>

        </div>
    );
}
