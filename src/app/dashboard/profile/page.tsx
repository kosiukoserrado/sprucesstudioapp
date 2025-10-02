"use client";

import { useState, useEffect, ChangeEvent } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { User as UserIcon, LogOut, Loader2, Banknote, Briefcase, Calendar as CalendarIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { fetchUserProfile, updateUserProfile } from '@/lib/firebase/firestore';
import type { UserProfile } from '@/lib/types';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { updateProfile as updateAuthProfile } from 'firebase/auth';
import { storage } from '@/lib/firebase/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export default function ProfilePage() {
    const { user, signOut, loading: authLoading } = useAuth();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);

    // State for all form fields
    const [fullName, setFullName] = useState(user?.displayName || '');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [location, setLocation] = useState('');
    const [postcode, setPostcode] = useState('');
    const [nationality, setNationality] = useState('');
    const [proximity, setProximity] = useState([25]);
    const [abn, setAbn] = useState('');
    const [bsb, setBsb] = useState('');
    const [accountNumber, setAccountNumber] = useState('');
    const [profilePictureFile, setProfilePictureFile] = useState<File | null>(null);
    const [whiteCardFile, setWhiteCardFile] = useState<File | null>(null);
    const [whiteCardExpiration, setWhiteCardExpiration] = useState<Date | undefined>(undefined);
    const [avatarUrl, setAvatarUrl] = useState(user?.photoURL || '');

    useEffect(() => {
        const loadProfile = async () => {
            if (!user) return;
            setFetching(true);
            try {
                const profileData = await fetchUserProfile(user.uid);
                if (profileData) {
                    setFullName(profileData.fullName || user.displayName || '');
                    setPhoneNumber(profileData.phoneNumber || '');
                    setLocation(profileData.location || '');
                    setPostcode(profileData.postcode || '');
                    setNationality(profileData.nationality || '');
                    setAbn(profileData.abn || '');
                    setBsb(profileData.bsb || '');
                    setAccountNumber(profileData.accountNumber || '');
                    setProximity([profileData.proximity || 25]);
                    setAvatarUrl(profileData.photoURL || user.photoURL || '');
                    if(profileData.whiteCardExpiration) {
                        setWhiteCardExpiration(new Date(profileData.whiteCardExpiration));
                    }
                }
            } catch (error) {
                console.error("Failed to load profile", error);
                toast({ variant: "destructive", title: "Error", description: "Could not load your profile data."});
            } finally {
                setFetching(false);
            }
        };
        if (user) {
            loadProfile();
        }
    }, [user, toast]);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>, setFile: React.Dispatch<React.SetStateAction<File | null>>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setFile(file);
             if (e.target.id === "picture") {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setAvatarUrl(reader.result as string);
                };
                reader.readAsDataURL(file);
            }
        }
    };
    
    const handleFileUpload = async (file: File, path: string): Promise<string> => {
        const storageRef = ref(storage, path);
        const snapshot = await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(snapshot.ref);
        return downloadURL;
    }


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
        if (!user) return;
        setLoading(true);
        
        try {
            const profileData: Partial<UserProfile> = {
                fullName,
                phoneNumber: phoneNumber || '',
                location: location || '',
                postcode: postcode || '',
                nationality: nationality || '',
                proximity: proximity[0],
                abn: abn || '',
                bsb: bsb || '',
                accountNumber: accountNumber || '',
                whiteCardExpiration: whiteCardExpiration ? whiteCardExpiration.toISOString() : '',
            };

            if (profilePictureFile) {
                const downloadURL = await handleFileUpload(profilePictureFile, `profile_pictures/${user.uid}`);
                profileData.photoURL = downloadURL;
                await updateAuthProfile(user, { photoURL: downloadURL }); // Update auth profile
                setAvatarUrl(downloadURL);
            }
             if (whiteCardFile) {
                const downloadURL = await handleFileUpload(whiteCardFile, `white_cards/${user.uid}`);
                profileData.whiteCardUrl = downloadURL;
            }

            await updateUserProfile(user.uid, profileData);

            if (fullName !== user.displayName) {
                await updateAuthProfile(user, { displayName: fullName });
            }

            toast({
                title: "Profile Updated",
                description: "Your information has been saved successfully.",
            });
        } catch (error) {
             console.error("Update error:", error);
             toast({
                variant: "destructive",
                title: "Update Failed",
                description: "There was a problem updating your profile. Please check your browser console for details.",
            });
        } finally {
            setLoading(false);
        }
    };

    const isSubmitting = loading || authLoading || fetching;

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-2">
                    <h1 className="font-headline text-2xl md:text-3xl font-bold tracking-tight">Your Profile</h1>
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
                    <CardContent className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                         <Avatar className="h-20 w-20">
                            <AvatarImage src={avatarUrl} />
                            <AvatarFallback>{getInitials(fullName)}</AvatarFallback>
                        </Avatar>
                        <div className="space-y-2 w-full">
                            <Label htmlFor="picture">Upload New Profile Picture</Label>
                            <Input id="picture" type="file" className="max-w-sm" onChange={(e) => handleFileChange(e, setProfilePictureFile)} accept="image/*" />
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
                                value={proximity}
                                onValueChange={setProximity}
                                max={100}
                                step={1}
                            />
                            <p className="text-xs text-muted-foreground">Set how far you're willing to travel for jobs.</p>
                        </div>
                    </CardContent>
                </Card>

                 <Separator className="my-8" />

                <Card>
                     <CardHeader>
                        <div className="flex items-center gap-4">
                            <Briefcase className="h-6 w-6 text-muted-foreground" />
                            <CardTitle>Business & Verification</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="abn">ABN (Australian Business Number)</Label>
                            <Input id="abn" value={abn} onChange={e => setAbn(e.target.value)} placeholder="00 000 000 000" />
                        </div>
                         <div className="grid md:grid-cols-2 gap-6">
                             <div className="space-y-2">
                                <Label htmlFor="white-card">Upload White Card</Label>
                                <Input id="white-card" type="file" onChange={(e) => handleFileChange(e, setWhiteCardFile)} />
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="white-card-expiration">White Card Expiration Date</Label>
                                 <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant={"outline"}
                                            className={cn(
                                            "w-full justify-start text-left font-normal",
                                            !whiteCardExpiration && "text-muted-foreground"
                                            )}
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {whiteCardExpiration ? format(whiteCardExpiration, "PPP") : <span>Pick a date</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                        <Calendar
                                            mode="single"
                                            selected={whiteCardExpiration}
                                            onSelect={setWhiteCardExpiration}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>
                         </div>
                    </CardContent>
                </Card>

                <Separator className="my-8" />

                <Card>
                     <CardHeader>
                        <div className="flex items-center gap-4">
                            <Banknote className="h-6 w-6 text-muted-foreground" />
                            <CardTitle>Bank Details</CardTitle>
                             <CardDescription>This information is kept secure and is only used for job payments.</CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="bsb">BSB</Label>
                                <Input id="bsb" value={bsb} onChange={e => setBsb(e.target.value)} placeholder="000-000" />
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="accountNumber">Account Number</Label>
                                <Input id="accountNumber" value={accountNumber} onChange={e => setAccountNumber(e.target.value)} placeholder="000000000" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                
                <div className="mt-8 flex justify-end">
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {loading ? 'Saving...' : 'Finish update'}
                    </Button>
                </div>
            </form>

        </div>
    );
}
    

    