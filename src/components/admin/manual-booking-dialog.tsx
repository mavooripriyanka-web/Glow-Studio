"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from "react";
import { AuthHelper } from "@/lib/auth-helper";
import { useToast } from "@/hooks/use-toast";
import { ConsentForm } from "@/components/consent-form";
import { useAllServices } from "@/lib/all-services";

const ADVANCED_TREATMENTS = [
    "Laser Hair Removal",
    "Micropeeling",
    "Chemical Peel",
    "Laser Skin Care",
    "Body Sculpting",
    "Lip Blush"
];

export function ManualBookingDialog() {
    const { allServicesByCategory } = useAllServices();
    const [open, setOpen] = useState(false);
    const { toast } = useToast();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        treatment: "", // This will now represent the Category (e.g. Laser Hair Removal)
        subService: "", // This will represent the specific Service (e.g. Full Face)
        date: "",
        time: ""
    });

    const [showConsent, setShowConsent] = useState(false);
    const [consentData, setConsentData] = useState<{ signature: string; medical: any } | null>(null);

    // Reset consent when dialog closes or form resets
    useEffect(() => {
        if (!open) {
            setConsentData(null);
            setShowConsent(false);
        }
    }, [open]);

    // Handle submission trigger after consent
    useEffect(() => {
        if (consentData) {
            handleSubmit();
        }
    }, [consentData]);

    const selectedCategory = allServicesByCategory.find(c => c.title === formData.treatment);

    const handleSubmit = async () => {
        if (!formData.name || !formData.email || !formData.treatment || !formData.subService || !formData.date || !formData.time) {
            toast({
                title: "Missing Information",
                description: "Please fill in all fields (including service) to create a booking.",
                variant: "destructive"
            });
            return;
        }

        // Check for advanced treatment consent
        if (ADVANCED_TREATMENTS.includes(formData.treatment) && !consentData) {
            setShowConsent(true);
            return;
        }

        // 1. Register/Check User as Guest (async)
        await AuthHelper.registerUser({
            name: formData.name,
            email: formData.email,
            password: "welcome123", // Default mock password
        });

        // 2. Add Appointment (async)
        const bookingResult = await AuthHelper.addAppointment(formData.email, {
            treatment: `${formData.treatment} - ${formData.subService}`,
            date: formData.date,
            time: formData.time,
            consentSigned: !!consentData,
            consentDate: consentData ? new Date().toISOString() : undefined,
            consentSignature: consentData?.signature,
            medicalHistory: consentData?.medical
        });

        if (bookingResult.success) {
            toast({
                title: "Booking Created",
                description: `Appointment set for ${formData.name} on ${formData.date}.`,
            });
            setOpen(false);
            setFormData({ name: "", email: "", treatment: "", subService: "", date: "", time: "" });
            setConsentData(null);
        } else {
            toast({
                title: "Error",
                description: "Could not create booking. Please try again.",
                variant: "destructive"
            });
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-primary/90">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Manual Entry
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add Manual Booking</DialogTitle>
                    <DialogDescription>
                        Create a booking for a new or existing client.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">Name</Label>
                        <Input
                            id="name"
                            className="col-span-3"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="email" className="text-right">Email</Label>
                        <Input
                            id="email"
                            className="col-span-3"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="treatment" className="text-right">Category</Label>
                        <Select onValueChange={(val) => setFormData({ ...formData, treatment: val, subService: "" })}>
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select treatment" />
                            </SelectTrigger>
                            <SelectContent>
                                {allServicesByCategory.map(cat => (
                                    <SelectItem key={cat.title} value={cat.title}>{cat.title}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {formData.treatment && (
                        <div className="grid grid-cols-4 items-center gap-4 animate-in fade-in slide-in-from-top-1 duration-200">
                            <Label htmlFor="service" className="text-right">Service</Label>
                            <Select
                                value={formData.subService}
                                onValueChange={(val) => setFormData({ ...formData, subService: val })}
                            >
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Select service" />
                                </SelectTrigger>
                                <SelectContent>
                                    {selectedCategory?.services.map(s => (
                                        <SelectItem key={s.name} value={s.name}>{s.name} ({s.price})</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )}
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="date" className="text-right">Date</Label>
                        <Input
                            id="date"
                            type="date"
                            className="col-span-3"
                            value={formData.date}
                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="time" className="text-right">Time</Label>
                        <Select onValueChange={(val) => setFormData({ ...formData, time: val })}>
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select time" />
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
                    <Button type="submit" onClick={handleSubmit}>Create Booking</Button>
                </DialogFooter>
            </DialogContent>
            <ConsentForm
                open={showConsent}
                onOpenChange={setShowConsent}
                clientName={formData.name}
                treatmentName={formData.treatment}
                onConfirm={(signature, medical) => setConsentData({ signature, medical })}
            />
        </Dialog>
    );
}
