"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AuthHelper } from "@/lib/auth-helper";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { CheckCircle, Send } from "lucide-react";
import { useUser } from "@/firebase/provider";
import { useLanguage } from "@/context/language-context";

export default function LeadsForm() {
    const { user } = useUser();
    const { t } = useLanguage();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        mobile: "",
        message: ""
    });

    // If user is logged in, pre-fill some fields
    useState(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                name: user.displayName || "",
                email: user.email || ""
            }));
        }
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const result = await AuthHelper.addLead({
                name: formData.name,
                email: formData.email,
                mobile: formData.mobile,
                message: formData.message,
                treatment: "General Inquiry" // Default for generic contact form
            });

            if (result.success) {
                setShowSuccess(true);
                setFormData({
                    name: user?.displayName || "",
                    email: user?.email || "",
                    mobile: "",
                    message: ""
                });
            } else {
                alert(t("forms.submitFailed", "Failed to submit inquiry. Please try again."));
            }
        } catch (error) {
            console.error("Leads submission error:", error);
            alert(t("forms.errorOccurred", "An error occurred. Please try again."));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className="bg-[#FDFBF7] py-16 rounded-3xl border border-stone-100 shadow-sm relative overflow-hidden">
            <div className="container px-4 relative z-10 max-w-4xl mx-auto text-center">
                <div className="mb-10 space-y-4">
                    <h2 className="text-3xl md:text-4xl font-bold font-headline text-primary">
                        {t("leadsForm.title", "Have Questions?")}
                    </h2>
                    <p className="text-stone-500 max-w-2xl mx-auto">
                        {t("leadsForm.description", "Not sure which treatment is right for you? Fill out the form below and our experts will get back to you shortly.")}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-stone-100 text-left space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label htmlFor="name" className="text-sm font-medium uppercase tracking-wider text-stone-600">{t("forms.name", "Name*")}</label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => handleInputChange("name", e.target.value)}
                                placeholder={t("forms.yourName", "Your Name")}
                                className="bg-stone-50 border-stone-200"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="email" className="text-sm font-medium uppercase tracking-wider text-stone-600">{t("forms.email", "Email*")}</label>
                            <Input
                                id="email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => handleInputChange("email", e.target.value)}
                                placeholder={t("forms.yourEmail", "Your Email Address")}
                                className="bg-stone-50 border-stone-200"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="mobile" className="text-sm font-medium uppercase tracking-wider text-stone-600">{t("forms.mobile", "Mobile Number*")}</label>
                        <div className="flex gap-2">
                            <div className="flex items-center justify-center bg-stone-50 border border-stone-200 rounded-md px-3 text-sm text-stone-500">
                                +1
                            </div>
                            <Input
                                id="mobile"
                                type="tel"
                                value={formData.mobile}
                                onChange={(e) => handleInputChange("mobile", e.target.value)}
                                placeholder={t("forms.yourMobile", "Your Mobile Number")}
                                className="bg-stone-50 border-stone-200 flex-1"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="message" className="text-sm font-medium uppercase tracking-wider text-stone-600">{t("leadsForm.message", "Message / Query*")}</label>
                        <Textarea
                            id="message"
                            value={formData.message}
                            onChange={(e) => handleInputChange("message", e.target.value)}
                            placeholder={t("leadsForm.messagePlaceholder", "Tell us what you're looking for or ask a question...")}
                            className="bg-stone-50 border-stone-200 min-h-[120px]"
                            required
                        />
                    </div>

                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full uppercase tracking-widest py-6 bg-primary hover:bg-primary/90 text-white rounded-md transition-all mt-4"
                    >
                        {isSubmitting ? (
                            t("forms.sending", "Sending...")
                        ) : (
                            <span className="flex items-center gap-2">
                                {t("leadsForm.sendInquiry", "Send Inquiry")} <Send className="w-4 h-4" />
                            </span>
                        )}
                    </Button>
                </form>
            </div>

            {/* Success Dialog */}
            <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
                <DialogContent className="sm:max-w-[425px]">
                    <div className="flex flex-col items-center justify-center py-6 text-center space-y-4">
                        <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mb-2">
                            <CheckCircle className="h-8 w-8 text-green-600" />
                        </div>
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-serif text-primary text-center">{t("leadsForm.successTitle", "Inquiry Sent!")}</DialogTitle>
                        </DialogHeader>
                        <p className="text-stone-500">
                            {t("leadsForm.successMessage", "Thank you for reaching out. We have received your query and will contact you shortly.")}
                        </p>
                        <Button onClick={() => setShowSuccess(false)} className="mt-4 bg-stone-100 hover:bg-stone-200 text-stone-900 w-full shadow-none py-6 uppercase tracking-widest text-xs">
                            {t("forms.close", "Close")}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </section>
    );
}
