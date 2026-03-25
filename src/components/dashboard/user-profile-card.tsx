import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { User, Mail, Calendar } from "lucide-react";
import Image from "next/image";
import { AuthHelper, UserData } from "@/lib/auth-helper";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";

import { useAllServices } from "@/lib/all-services";
import { useLanguage } from "@/context/language-context";
import { ConsentForm } from "@/components/consent-form";

interface UserProfileCardProps {
    user?: UserData | null;
    onUpdate?: (user: UserData) => void;
    // Controlled state for booking dialog
    isBookingOpen?: boolean;
    onBookingOpenChange?: (open: boolean) => void;
}

export function UserProfileCard({ user, onUpdate, isBookingOpen: controlledOpen, onBookingOpenChange }: UserProfileCardProps) {
    const { t } = useLanguage();
    const { allServicesByCategory } = useAllServices();
    const router = useRouter();
    // Internal state if uncontrolled
    const [internalOpen, setInternalOpen] = useState(false);

    // Use controlled state if provided, otherwise internal
    const isBookingOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;
    const setIsBookingOpen = (open: boolean) => {
        if (onBookingOpenChange) {
            onBookingOpenChange(open);
        } else {
            setInternalOpen(open);
        }
    };

    const [showSuccess, setShowSuccess] = useState(false);
    const [isConsentOpen, setIsConsentOpen] = useState(false);
    const [bookingData, setBookingData] = useState({
        treatment: "", // Category
        subService: "", // Specific Service
        date: "",
        time: ""
    });

    const handleLogout = async () => {
        await AuthHelper.logout();
        router.push("/");
    };

    const handleInitBooking = () => {
        if (!user || !bookingData.treatment || !bookingData.subService || !bookingData.date || !bookingData.time) return;
        setIsConsentOpen(true);
    };

    const handleFinalizeBooking = async (signatureData: string, medicalHistory: any) => {
        if (!user) return;

        const result = await AuthHelper.addAppointment(user.email, {
            treatment: `${bookingData.treatment} - ${bookingData.subService}`,
            date: bookingData.date,
            time: bookingData.time,
            clientName: user.name,
            consentSigned: true,
            consentDate: new Date().toLocaleDateString(),
            consentSignature: signatureData,
            medicalHistory: medicalHistory
        });

        if (result.success && onUpdate) {
            setIsConsentOpen(false);
            // Show success message instead of closing immediately
            setShowSuccess(true);
            // Clear form data
            setBookingData({ treatment: "", subService: "", date: "", time: "" });
        }
    };

    const handleCloseDialog = () => {
        setShowSuccess(false);
        setIsBookingOpen(false);
    };

    if (!user) return null;

    const selectedCategory = allServicesByCategory.find(c => c.title === bookingData.treatment);

    return (
        <div className="bg-white rounded-3xl p-8 shadow-sm" >
            <div className="flex flex-col items-center sm:items-start sm:flex-row gap-4 mb-8">
                <div className="h-20 w-20 rounded-full bg-stone-100 flex items-center justify-center shrink-0">
                    <User className="h-8 w-8 text-primary" />
                </div>
                <div>
                    <h2 className="text-2xl font-serif text-primary">{user.name}</h2>
                    <p className="text-stone-500 text-sm">{user.email}</p>
                </div>
            </div>

            <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center py-3 border-b border-stone-100">
                    <span className="text-stone-500 text-sm">{t('dashboard.memberSince')}</span>
                    <span className="font-medium text-primary">{user.joinedDate || 'Today'}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-stone-100">
                    <span className="text-stone-500 text-sm">{t('dashboard.totalVisits')}</span>
                    <span className="font-medium text-primary">{user.appointments?.length || 0}</span>
                </div>
            </div>

            <div className="flex flex-col gap-3">
                <Dialog open={isBookingOpen} onOpenChange={(open) => {
                    if (!open) setShowSuccess(false); // Reset on close
                    setIsBookingOpen(open);
                }}>
                    <DialogTrigger asChild>
                        <Button className="w-full py-6 uppercase tracking-widest bg-primary hover:bg-primary/90 text-white rounded-xl shadow-none">
                            {t('dashboard.bookNewSession')}
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        {showSuccess ? (
                            <div className="flex flex-col items-center justify-center py-6 text-center space-y-4">
                                <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mb-2">
                                    <Calendar className="h-8 w-8 text-green-600" />
                                </div>
                                <DialogHeader>
                                    <DialogTitle className="text-2xl font-serif text-primary">{t('dashboard.bookingSuccessTitle')}</DialogTitle>
                                </DialogHeader>
                                <p className="text-stone-500">
                                    {t('dashboard.bookingSuccessMsg')}
                                </p>
                                <Button onClick={handleCloseDialog} className="mt-4 bg-primary w-full shadow-none py-6 uppercase tracking-widest text-xs">
                                    {t('dashboard.done')}
                                </Button>
                            </div>
                        ) : (
                            <>
                                <DialogHeader>
                                    <DialogTitle className="text-center font-serif text-2xl text-primary">{t('dashboard.bookSession')}</DialogTitle>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor="treatment">{t('dashboard.category')}</Label>
                                        <Select value={bookingData.treatment} onValueChange={(val) => setBookingData({ ...bookingData, treatment: val, subService: "" })}>
                                            <SelectTrigger>
                                                <SelectValue placeholder={t('dashboard.selectCategory')} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {allServicesByCategory.map(cat => (
                                                    <SelectItem key={cat.title} value={cat.title}>{cat.title}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {bookingData.treatment && (
                                        <div className="flex flex-col gap-2">
                                            <Label htmlFor="service">{t('dashboard.service')}</Label>
                                            <Select
                                                value={bookingData.subService}
                                                onValueChange={(val) => setBookingData({ ...bookingData, subService: val })}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder={t('dashboard.selectService')} />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {selectedCategory?.services.map(s => (
                                                        <SelectItem key={s.name} value={s.name}>{s.name} ({s.price})</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    )}

                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor="date">{t('dashboard.date')}</Label>
                                        <Input
                                            id="date"
                                            type="date"
                                            value={bookingData.date}
                                            onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })}
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor="time">{t('dashboard.time')}</Label>
                                        <Select value={bookingData.time} onValueChange={(val) => setBookingData({ ...bookingData, time: val })}>
                                            <SelectTrigger>
                                                <SelectValue placeholder={t('dashboard.selectTime')} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {["09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00"].map(t => (
                                                    <SelectItem key={t} value={t}>{t}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button
                                        className="w-full bg-primary py-6 uppercase tracking-widest text-xs shadow-none"
                                        onClick={handleInitBooking}
                                        disabled={!bookingData.treatment || !bookingData.subService || !bookingData.date || !bookingData.time}
                                    >
                                        {t('dashboard.confirmBooking')}
                                    </Button>
                                </DialogFooter>
                            </>
                        )}
                    </DialogContent>
                </Dialog>

                <Button variant="outline" onClick={handleLogout} className="w-full py-6 uppercase tracking-widest rounded-xl text-stone-500 hover:text-primary border-stone-200">
                    {t('dashboard.signOut')}
                </Button>
            </div>

            <ConsentForm
                open={isConsentOpen}
                onOpenChange={setIsConsentOpen}
                clientName={user.name}
                treatmentName={`${bookingData.treatment} - ${bookingData.subService}`}
                onConfirm={handleFinalizeBooking}
            />
        </div >
    );
}
