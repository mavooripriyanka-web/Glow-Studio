'use client';
import { useLanguage } from '@/context/language-context';

import {
    useState,
    useEffect,
    useCallback
} from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { useAppointment } from '@/context/appointment-context';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ChevronUp, Edit2, Clock } from 'lucide-react';
import { AuthHelper } from '@/lib/auth-helper';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from "@/components/ui/dialog";
import { useUser } from '@/firebase/provider';
import { ConsentForm } from '@/components/sections/consent-form';

// Helper to parse price string like "CA$150.00" or "$40–$55"
const parsePrice = (priceStr: string): number => {
    if (!priceStr) return 0;
    const cleaned = priceStr.replace('CA', '').replace('$', '');
    if (cleaned.includes('–')) {
        const [min, max] = cleaned.split('–').map(Number);
        return (min + max) / 2;
    }
    return parseFloat(cleaned) || 0;
};

// Helper to format total duration
const formatDuration = (totalMinutes: number) => {
    if (totalMinutes === 0) return '0 min';
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    let result = '';
    if (hours > 0) {
        result += `${hours} hr `;
    }
    if (minutes > 0) {
        result += `${minutes} min`;
    }
    return result.trim();
};

export default function SchedulePage() {
    const { t } = useLanguage();
    const router = useRouter();
    const { user: firebaseUser } = useUser();
    const { services, totalPrice, totalDurationInMinutes, removeService, clearCurrentServices } = useAppointment();

    // Steps: dateTime -> details -> success
    const [step, setStep] = useState<'dateTime' | 'details' | 'success'>('dateTime');

    const [date, setDate] = useState<Date | undefined>(new Date());
    const [selectedTime, setSelectedTime] = useState<string | null>(null);

    const [contactInfo, setContactInfo] = useState({
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
        notes: ''
    });

    const [showSignupPrompt, setShowSignupPrompt] = useState(false);
    const { toast } = useToast();

    // Mock time slots - expanded for demo
    const timeSlots = [
        "10:00", "10:30", "11:00", "11:30",
        "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30",
        "17:00", "17:30", "18:00", "18:30", "19:00", "19:30"
    ];

    // Group time slots
    const morningSlots = timeSlots.filter(t => parseInt(t.split(':')[0]) < 12);
    const afternoonSlots = timeSlots.filter(t => {
        const h = parseInt(t.split(':')[0]);
        return h >= 12 && h < 17;
    });
    const eveningSlots = timeSlots.filter(t => parseInt(t.split(':')[0]) >= 17);

    // Scroll to time slots when date changes
    useEffect(() => {
        if (date && step === 'dateTime') {
            const timeSlotsElement = document.getElementById('time-slots');
            if (timeSlotsElement) {
                // timeSlotsElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    }, [date, step]);

    const handleContinueToDetails = () => {
        if (!date || !selectedTime) {
            toast({
                title: "Incomplete details",
                description: "Please select a date and time.",
                variant: "destructive"
            });
            return;
        }
        setStep('details');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleBackToDateTime = () => {
        setStep('dateTime');
    };

    const [showSuccessDialog, setShowSuccessDialog] = useState(false);
    const [showConsentDialog, setShowConsentDialog] = useState(false); // New state for consent dialog

    const [isConsentValid, setIsConsentValid] = useState(false);
    const [consentData, setConsentData] = useState<any>(null);

    const handleConsentChange = useCallback((isValid: boolean, data: any) => {
        setIsConsentValid(isValid);
        setConsentData(data);
    }, []);

    const handleOpenConsentDialog = () => {
        if (!contactInfo.firstName || !contactInfo.lastName || !contactInfo.email || !contactInfo.phone) {
            toast({
                title: "Missing Information",
                description: "Please fill in all required contact fields.",
                variant: "destructive"
            });
            return;
        }
        setShowConsentDialog(true);
    };

    const handleBookAppointment = async () => {
        // Validation now happens before opening the dialog, but double check consent
        if (!isConsentValid) {
            toast({
                title: "Consent Required",
                description: "Please complete and sign the consent form.",
                variant: "destructive"
            });
            return;
        }

        const fullName = `${contactInfo.firstName.trim()} ${contactInfo.lastName.trim()}`;
        const email = contactInfo.email.trim();

        let shouldRegister = true;
        if (firebaseUser && firebaseUser.email === email) {
            shouldRegister = false;
        }

        if (shouldRegister) {
            const regResult = await AuthHelper.registerUser({
                name: fullName,
                email: email,
                password: "guest_pending_" + Math.random().toString(36).substring(7),
                isGuest: true
            });
            console.log("Guest registration result:", regResult);
        }

        await processBooking(email);
        setShowConsentDialog(false); // Close consent dialog after booking
    };

    const handleRedirectToSignup = () => {
        router.push('/signup');
    };

    const handleRedirectToLogin = () => {
        router.push('/signin');
    };

    const processBooking = async (email: string) => {
        const treatmentName = services.map(s => s.name).join(", ");
        const dateStr = date ? format(date, 'yyyy-MM-dd') : '';

        const result = await AuthHelper.addAppointment(email, {
            treatment: treatmentName,
            date: dateStr,
            time: selectedTime || "09:00",
            // Add consent data
            consentSigned: consentData?.consentSigned || false,
            consentDate: consentData?.consentDate || null,
            consentSignature: consentData?.consentSignature || null,
            medicalHistory: consentData?.medicalHistory || null,
            eSignStatus: consentData?.consentSigned ? 'successful' : 'pending' // Auto-mark successful if signed here
        });

        if (result.success) {
            if (clearCurrentServices) clearCurrentServices();

            if (firebaseUser) {
                toast({
                    title: "Booking Confirmed",
                    description: "Your appointment has been successfully booked. Redirecting to dashboard...",
                });
                router.push('/dashboard');
            } else {
                setShowSuccessDialog(true);
            }
        } else {
            console.error("Booking failed:", result);
            toast({
                title: "Booking Failed",
                description: result.message || "Could not book appointment. Please check your details and try again.",
                variant: "destructive"
            });
        }
    };

    const formatTime12Hour = (time24: string) => {
        const [hours, minutes] = time24.split(':');
        let h = parseInt(hours, 10);
        const ampm = h >= 12 ? 'PM' : 'AM';
        h = h % 12;
        h = h ? h : 12; // the hour '0' should be '12'
        return `${h}:${minutes} ${ampm}`;
    };

    const TimeSlotSection = ({ title, slots }: { title: string, slots: string[] }) => {
        if (slots.length === 0) return null;
        return (
            <div className="mb-6">
                <h3 className="font-semibold text-stone-900 mb-3">{title}</h3>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                    {slots.map(time => (
                        <Button
                            key={time}
                            variant={selectedTime === time ? "default" : "outline"}
                            onClick={() => setSelectedTime(time)}
                            className={`w-full py-6 font-medium ${selectedTime === time ? 'bg-stone-900 text-white hover:bg-stone-800' : 'bg-stone-100 border-transparent hover:bg-stone-200 text-stone-900'}`}
                        >
                            {formatTime12Hour(time)}
                        </Button>
                    ))}
                </div>
            </div>
        );
    };

    if (step === 'success') {
        return (
            <div className="bg-white min-h-screen flex items-center justify-center p-4">
                {/* Success view content - reused from previous or could be redundant if using dialog */}
            </div>
        );
    }

    return (
        <div className="bg-white min-h-screen font-sans">
            <div className="container mx-auto px-4 py-8 lg:py-12">
                {/* Header is removed in new design or simplified */}

                <div className="grid lg:grid-cols-3 gap-12 max-w-6xl mx-auto items-start">
                    {/* Left Column: Calendar & Time Slots */}
                    <div className="lg:col-span-2 space-y-10">

                        {step === 'dateTime' && (
                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">

                                {/* 1. Calendar */}
                                <div className="mb-10">
                                    <Calendar
                                        mode="single"
                                        selected={date}
                                        onSelect={(d) => {
                                            setDate(d);
                                            setSelectedTime(null);
                                        }}
                                        className="rounded-md border-none shadow-none mx-auto w-fit p-0"
                                        classNames={{
                                            head_cell: "text-stone-400 font-normal w-12 h-12 text-[0.9rem]",
                                            cell: "h-12 w-12 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                                            day: "h-12 w-12 p-0 font-normal aria-selected:opacity-100 hover:bg-stone-100 rounded-full",
                                            day_selected: "bg-stone-900 text-white hover:bg-stone-800 hover:text-white focus:bg-stone-900 focus:text-white rounded-full",
                                            day_today: "bg-stone-100 text-stone-900 rounded-full",
                                        }}
                                    />
                                    <div className="text-center text-xs text-stone-400 mt-4 border-b border-stone-100 pb-8">
                                        {t("appointmentSchedule.timesInEst", "Times are shown in EST.")}
                                    </div>
                                </div>

                                {/* 2. Selected Date Display */}
                                {date && (
                                    <div className="mb-8">
                                        <h2 className="text-xl font-bold font-headline text-stone-900">
                                            {format(date, 'EEEE, MMM d, yyyy')}
                                        </h2>
                                    </div>
                                )}

                                {/* 3. Time Slots */}
                                <div id="time-slots" className="space-y-6">
                                    {date ? (
                                        <>
                                            <TimeSlotSection title="Morning" slots={morningSlots} />
                                            <TimeSlotSection title="Afternoon" slots={afternoonSlots} />
                                            <TimeSlotSection title="Evening" slots={eveningSlots} />
                                        </>
                                    ) : (
                                        <p className="text-stone-500">Please select a date.</p>
                                    )}
                                </div>

                                {/* 4. Waitlist Banner */}
                                <div className="mt-12 bg-stone-100 rounded-lg p-6 text-center">
                                    <h3 className="font-semibold text-stone-900 mb-1">{t("appointmentSchedule.dontSeePreference", "Don't see your preference?")}</h3>
                                    <Button variant="link" className="text-stone-900 font-semibold underline decoration-2 underline-offset-4 h-auto p-0">
                                        {t("appointmentSchedule.joinWaitlist", "Join the waitlist")}
                                    </Button>
                                </div>

                                {/* Continue Button (only if not auto-progressing, but UI shows next step handling) */}
                                {selectedTime && (
                                    <div className="mt-8 flex justify-end sticky bottom-4 bg-white/90 backdrop-blur-sm p-4 border-t border-stone-100 rounded-lg shadow-sm lg:relative lg:bottom-auto lg:p-0 lg:border-none lg:shadow-none lg:bg-transparent">
                                        <Button
                                            onClick={handleContinueToDetails}
                                            className="px-8 py-6 text-lg w-full lg:w-auto"
                                        >
                                            {t("appointmentSchedule.continue", "Continue")}
                                        </Button>
                                    </div>
                                )}
                            </div>
                        )}

                        {step === 'details' && (
                            <div className="animate-in fade-in slide-in-from-right-8 duration-500 space-y-8">
                                <Button variant="ghost" onClick={handleBackToDateTime} className="pl-0 hover:bg-transparent hover:text-stone-600 mb-4">
                                    &larr; {t("appointmentSchedule.backToDateTime", "Back to date & time")}
                                </Button>

                                <h1 className="text-3xl font-bold font-headline text-stone-900 mb-6">{t("appointmentSchedule.details", "Details")}</h1>

                                {/* Contact Info */}
                                <section className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <h2 className="text-xl font-bold font-headline">{t("appointmentSchedule.contactInfo", "Contact info")}</h2>
                                        {!firebaseUser && (
                                            <Button variant="link" className="text-stone-500 underline" onClick={handleRedirectToSignup}>{t("appointmentSchedule.signIn", "Sign in")}</Button>
                                        )}
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="col-span-2">
                                            <Label htmlFor="phone">{t("appointmentSchedule.phoneNumber", "Phone number *")}</Label>
                                            <div className="flex gap-2 mt-1.5">
                                                <div className="flex items-center px-3 border rounded-md bg-stone-50 text-stone-500">CA +1</div>
                                                <Input
                                                    id="phone"
                                                    placeholder="(555) 555-5555"
                                                    value={contactInfo.phone}
                                                    onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
                                                    className="flex-1"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <Label htmlFor="firstName">{t("appointmentSchedule.firstName", "First name *")}</Label>
                                            <Input
                                                id="firstName"
                                                placeholder={t("appointmentSchedule.firstNamePlaceholder", "First name")}
                                                value={contactInfo.firstName}
                                                onChange={(e) => setContactInfo({ ...contactInfo, firstName: e.target.value })}
                                                className="mt-1.5"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="lastName">{t("appointmentSchedule.lastName", "Last name *")}</Label>
                                            <Input
                                                id="lastName"
                                                placeholder={t("appointmentSchedule.lastNamePlaceholder", "Last name")}
                                                value={contactInfo.lastName}
                                                onChange={(e) => setContactInfo({ ...contactInfo, lastName: e.target.value })}
                                                className="mt-1.5"
                                            />
                                        </div>
                                        <div className="col-span-2">
                                            <Label htmlFor="email">{t("appointmentSchedule.email", "Email *")}</Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                placeholder={t("appointmentSchedule.emailPlaceholder", "Email")}
                                                value={contactInfo.email}
                                                onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
                                                className="mt-1.5"
                                            />
                                        </div>
                                    </div>
                                </section>

                                {/* Notes */}
                                <section className="space-y-4">
                                    <Label htmlFor="notes">{t("appointmentSchedule.appointmentNote", "Appointment note (optional)")}</Label>
                                    <Textarea
                                        id="notes"
                                        className="w-full border rounded-md p-3 text-sm min-h-[100px] resize-y"
                                        placeholder={t("appointmentSchedule.specialRequests", "Any special requests or details?")}
                                        value={contactInfo.notes}
                                        onChange={(e) => setContactInfo({ ...contactInfo, notes: e.target.value })}
                                    />
                                </section>

                                {/* Removed Inline Consent Form */}

                                <Button
                                    className="w-full py-6 text-lg bg-stone-900 hover:bg-stone-800 text-white font-semibold shadow-none rounded-lg mt-8"
                                    onClick={handleOpenConsentDialog}
                                >
                                    {t("appointmentSchedule.reviewConsentBook", "Review Consent & Book")}
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* Right Column: Sticky Summary */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24">
                            <h2 className="text-xl font-bold mb-4 font-headline">{t("appointmentSummary.title", "Appointment summary")}</h2>
                            <div className="bg-white border rounded-xl shadow-sm overflow-hidden p-6">

                                {services.length > 0 ? (
                                    <div className="mb-6">
                                        <div className="flex items-start gap-4 mb-4">
                                            <div className="w-12 h-12 bg-stone-200 rounded-full flex-shrink-0 overflow-hidden relative">
                                                <Image
                                                    src="/photo.jpg"
                                                    alt="Specialist"
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-stone-900 leading-tight">{services[0].name}</h3>
                                                <p className="text-sm text-stone-500 mt-1">CA${parsePrice(services[0].price).toFixed(2)} • {services[0].duration || '—'}</p>
                                            </div>
                                            <Button variant="ghost" size="icon" className='ml-auto h-8 w-8 text-stone-400'>
                                                <ChevronUp className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-stone-500 italic mb-6">{t("appointmentSchedule.noServiceSelected", "No service selected")}</p>
                                )}

                                <div className="space-y-4 pt-6 border-t border-stone-100">
                                    <div className="flex justify-between items-center">
                                        <span className="font-semibold text-stone-900">{services[0]?.name}</span>
                                        <div className="flex items-center gap-3">
                                            <span className="text-stone-900">CA${totalPrice.toFixed(2)}</span>
                                            <Edit2 className="w-4 h-4 text-stone-400 cursor-pointer" />
                                        </div>
                                    </div>
                                    <div className='text-sm text-stone-500'>
                                        {t("appointmentSchedule.withAnita", "with Anita")}
                                    </div>

                                    {date && selectedTime && (
                                        <div className="pt-4 border-t border-stone-100 mt-4">
                                            <div className="flex items-center gap-2 text-stone-900 font-medium">
                                                <div className="w-2 h-2 bg-stone-900 rounded-full"></div>
                                                {format(date, 'MMMM d, yyyy')} at {selectedTime}
                                            </div>
                                        </div>
                                    )}
                                </div>


                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Consent Dialog */}
            <Dialog open={showConsentDialog} onOpenChange={setShowConsentDialog}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Consent Form</DialogTitle>
                        <DialogDescription>
                            Please review and sign the consent form to proceed with your booking.
                        </DialogDescription>
                    </DialogHeader>
                    <ConsentForm onConsentChange={handleConsentChange} />
                    <DialogFooter className="mt-4 gap-2">
                        <Button variant="outline" onClick={() => setShowConsentDialog(false)}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleBookAppointment}
                            disabled={!isConsentValid}
                            className="bg-stone-900 text-white hover:bg-stone-800"
                        >
                            Confirm & Book
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={showSuccessDialog} onOpenChange={(open) => {
                setShowSuccessDialog(open);
            }}>
                <DialogContent className="sm:max-w-md text-center">
                    <DialogHeader>
                        <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                            <Clock className="h-6 w-6 text-green-600" />
                        </div>
                        <DialogTitle className="text-xl">Booking Confirmed!</DialogTitle>
                        <DialogDescription>
                            Your appointment is booked. Please sign up to view your appointment.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="flex flex-col gap-2">
                            <Button className="w-full" onClick={handleRedirectToSignup}>Create Account</Button>
                            <Button variant="outline" className="w-full" onClick={handleRedirectToLogin}>Log In</Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
