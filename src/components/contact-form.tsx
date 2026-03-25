"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { AuthGuardModal } from "@/components/ui/auth-guard-modal";
import { useUser } from "@/firebase/provider";
import { AuthHelper } from "@/lib/auth-helper";
import { ConsentForm } from "@/components/consent-form";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter
} from "@/components/ui/dialog";
import { Calendar, CheckCircle } from "lucide-react";
import { useLanguage } from "@/context/language-context";

export default function ContactForm() {
    const [isClient, setIsClient] = useState(false);
    const { user, isUserLoading } = useUser();
    const router = useRouter();
    const { t } = useLanguage();
    const [showAuthDialog, setShowAuthDialog] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        mobile: "",
        date: "",
        treatment: "",
        message: ""
    });

    // Flow State
    const [isConsentOpen, setIsConsentOpen] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        setIsClient(true);
        if (user) {
            setFormData(prev => ({
                ...prev,
                name: user.displayName || prev.name,
                email: user.email || prev.email
            }));
        }
    }, [user]);

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleInitialSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) {
            setShowAuthDialog(true);
            return;
        }
        // Basic validation
        if (!formData.name || !formData.email || !formData.date || !formData.treatment) {
            alert(t("forms.fillRequired", "Please fill in all required fields."));
            return;
        }
        setIsConsentOpen(true);
    };

    const handleFinalizeBooking = async (signatureData: string, medicalHistory: any) => {
        setIsSubmitting(true);
        try {
            const result = await AuthHelper.addAppointment(formData.email, {
                treatment: formData.treatment,
                date: formData.date,
                time: "09:00", // Default or add time picker if needed
                clientName: formData.name,
                consentSigned: true,
                consentDate: new Date().toLocaleDateString(),
                consentSignature: signatureData,
                medicalHistory: medicalHistory
            });

            if (result.success) {
                setIsConsentOpen(false);
                setShowSuccess(true);
                setFormData({
                    name: user?.displayName || "",
                    email: user?.email || "",
                    mobile: "",
                    date: "",
                    treatment: "",
                    message: ""
                });
            } else {
                alert(t("forms.bookFailed", "Failed to book appointment. Please try again."));
            }
        } catch (error) {
            console.error("Booking error:", error);
            alert(t("forms.errorOccurred", "An error occurred. Please try again."));
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isClient) {
        return null;
    }

    return (
        <div>
            <h2 className="text-4xl font-bold font-headline text-primary mb-2">{t("contactForm.title", "Book Your Appointment Today")}</h2>
            <p className="text-stone-500 mb-8 text-sm">
                {t("contactForm.description", "Embrace a journey where purity meets luxury, and beauty is redefined. Book your appointment with Lune Advanced Skincare today!")}
            </p>
            <div className="relative">
                {(isUserLoading || !user) && (
                    <div
                        className="absolute inset-0 z-50 cursor-not-allowed"
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            if (!isUserLoading) {
                                setShowAuthDialog(true);
                            }
                        }}
                    />
                )}
                <form onSubmit={handleInitialSubmit} className="space-y-6">
                    <fieldset disabled={isUserLoading || !user || isSubmitting} className="space-y-6 transition-opacity disabled:opacity-50">
                        <div className="space-y-2">
                            <label htmlFor="name" className="text-sm font-medium uppercase tracking-wider">{t("forms.name", "Name*")}</label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => handleInputChange("name", e.target.value)}
                                placeholder={t("forms.yourName", "Your Name")}
                                className="bg-white rounded-[4px]"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="email" className="text-sm font-medium uppercase tracking-wider">{t("forms.email", "Email*")}</label>
                            <Input
                                id="email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => handleInputChange("email", e.target.value)}
                                placeholder={t("forms.yourEmail", "Your Email Address")}
                                className="bg-white rounded-[4px]"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="mobile" className="text-sm font-medium uppercase tracking-wider">{t("forms.mobile", "Mobile Number*")}</label>
                            <div className="flex gap-2">
                                <div className="flex items-center justify-center bg-white border rounded-[4px] px-3 text-sm text-stone-500">
                                    +1
                                </div>
                                <Input
                                    id="mobile"
                                    type="tel"
                                    value={formData.mobile}
                                    onChange={(e) => handleInputChange("mobile", e.target.value)}
                                    placeholder={t("forms.yourMobile", "Your Mobile Number")}
                                    className="bg-white rounded-[4px] flex-1"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="date" className="text-sm font-medium uppercase tracking-wider">{t("forms.bookingDate", "Booking Date*")}</label>
                            <Input
                                id="date"
                                type="date"
                                value={formData.date}
                                onChange={(e) => handleInputChange("date", e.target.value)}
                                className="bg-white rounded-[4px]"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="treatment" className="text-sm font-medium uppercase tracking-wider">{t("forms.treatments", "Treatments*")}</label>
                            <Select value={formData.treatment} onValueChange={(val) => handleInputChange("treatment", val)}>
                                <SelectTrigger className="bg-white rounded-[4px]">
                                    <SelectValue placeholder={t("forms.selectTreatment", "Select Treatment")} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Laser Hair Removal">{t("services.LaserHairRemoval", "Laser Hair Removal")}</SelectItem>
                                    <SelectItem value="Micropeeling DP4">{t("services.Micropeeling", "Micropeeling DP4")}</SelectItem>
                                    <SelectItem value="Facials">{t("services.Facials", "Facials")}</SelectItem>
                                    <SelectItem value="Laser Skin Care">{t("services.LaserSkinCare", "Laser Skin Care")}</SelectItem>
                                    <SelectItem value="Chemical Peel">{t("services.ChemicalPeel", "Chemical Peel")}</SelectItem>
                                    <SelectItem value="Body Sculpting">{t("services.BodySculpting", "Body Sculpting")}</SelectItem>
                                    <SelectItem value="Lip Blush">{t("services.LipBlush", "Lip Blush")}</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="message" className="text-sm font-medium uppercase tracking-wider">{t("forms.comments", "Comments")}</label>
                            <Textarea
                                id="message"
                                value={formData.message}
                                onChange={(e) => handleInputChange("message", e.target.value)}
                                placeholder={t("contactForm.commentsPlaceholder", "Specify your preferred treatment or ask a question")}
                                className="bg-white rounded-[4px] min-h-[120px]"
                            />
                        </div>

                        <Button type="submit" disabled={isSubmitting} className="w-full uppercase tracking-widest py-6 bg-primary hover:bg-primary/90 rounded-[4px]">
                            {isSubmitting ? t("forms.processing", "Processing...") : t("contactForm.bookAppointmentBtn", "Book Appointment")}
                        </Button>
                    </fieldset>
                </form>
            </div>

            {/* Auth Guard Modal */}
            <AuthGuardModal
                open={showAuthDialog}
                onOpenChange={setShowAuthDialog}
                onConfirm={() => {
                    setShowAuthDialog(false);
                    router.push('/signup');
                }}
            />

            {/* Consent Form Modal */}
            <ConsentForm
                open={isConsentOpen}
                onOpenChange={setIsConsentOpen}
                clientName={formData.name}
                treatmentName={formData.treatment}
                onConfirm={handleFinalizeBooking}
            />

            {/* Success Dialog */}
            <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
                <DialogContent className="sm:max-w-[425px]">
                    <div className="flex flex-col items-center justify-center py-6 text-center space-y-4">
                        <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mb-2">
                            <Calendar className="h-8 w-8 text-green-600" />
                        </div>
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-serif text-primary text-center">{t("contactForm.successTitle", "Appointment Booked!")}</DialogTitle>
                        </DialogHeader>
                        <p className="text-stone-500">
                            {t("contactForm.successMessage1", "Your appointment for")} <span className="font-semibold">{formData.treatment}</span> {t("contactForm.successMessage2", "on")} {formData.date} {t("contactForm.successMessage3", "has been successfully scheduled.")}
                        </p>
                        <Button onClick={() => {
                            setShowSuccess(false);
                            router.push('/dashboard');
                        }} className="mt-4 bg-primary w-full shadow-none py-6 uppercase tracking-widest text-xs">
                            {t("contactForm.goToDashboard", "Go to Dashboard")}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
