"use client";

import { useLanguage } from "@/context/language-context";

import { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X, Eraser, PenTool } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

interface ConsentFormProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    clientName: string;
    treatmentName: string;
    onConfirm: (signatureData: string, medicalData: any) => void;
}

export function ConsentForm({ open, onOpenChange, clientName, treatmentName, onConfirm }: ConsentFormProps) {
    const { t } = useLanguage();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [signatureData, setSignatureData] = useState<string | null>(null);
    const [medicalHistory, setMedicalHistory] = useState({
        pregnant: false,
        recentSunExposure: false,
        medications: false,
        implants: false,
        allergies: false
    });
    const [agreed, setAgreed] = useState(false);

    // Initialize canvas
    useEffect(() => {
        if (open && canvasRef.current) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.lineWidth = 2;
                ctx.lineCap = 'round';
                ctx.strokeStyle = '#000';
            }
        }
    }, [open]);

    const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        setIsDrawing(true);
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const rect = canvas.getBoundingClientRect();
        const x = ('touches' in e ? e.touches[0].clientX : e.clientX) - rect.left;
        const y = ('touches' in e ? e.touches[0].clientY : e.clientY) - rect.top;

        ctx.beginPath();
        ctx.moveTo(x, y);
    };

    const draw = (e: React.MouseEvent | React.TouchEvent) => {
        if (!isDrawing) return;
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const rect = canvas.getBoundingClientRect();
        const x = ('touches' in e ? e.touches[0].clientX : e.clientX) - rect.left;
        const y = ('touches' in e ? e.touches[0].clientY : e.clientY) - rect.top;

        ctx.lineTo(x, y);
        ctx.stroke();
    };

    const stopDrawing = () => {
        if (isDrawing) {
            setIsDrawing(false);
            if (canvasRef.current) {
                setSignatureData(canvasRef.current.toDataURL());
            }
        }
    };

    const clearSignature = () => {
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            ctx?.clearRect(0, 0, canvas.width, canvas.height);
            setSignatureData(null);
        }
    };

    const handleConfirm = () => {
        if (signatureData) {
            onConfirm(signatureData, medicalHistory);
        }
    };

    const isFormValid = signatureData && agreed;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-serif text-center uppercase tracking-wide">{t('bookingConsent.title', 'Treatment Consent Form')}</DialogTitle>
                    <DialogDescription className="text-center">
                        {t('bookingConsent.description', 'Please review and sign below to proceed with your booking for')} <span className="font-semibold text-primary">{treatmentName}</span>.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Client Details */}
                    <div className="bg-stone-50 p-4 rounded-lg">
                        <Label className="uppercase text-xs font-bold text-muted-foreground">{t('bookingConsent.clientName', 'Client Name')}</Label>
                        <p className="text-lg font-medium">{clientName}</p>
                    </div>

                    {/* Medical Questionnaire */}
                    <div className="space-y-4">
                        <h4 className="font-semibold text-stone-900 border-b pb-2">{t('bookingConsent.medicalHistory', 'Medical History')}</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="pregnant"
                                    checked={medicalHistory.pregnant}
                                    onCheckedChange={(c) => setMedicalHistory(prev => ({ ...prev, pregnant: !!c }))}
                                />
                                <label htmlFor="pregnant" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    {t("bookingConsent.pregnant", "Are you currently pregnant or breastfeeding?")}
                                </label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="sun"
                                    checked={medicalHistory.recentSunExposure}
                                    onCheckedChange={(c) => setMedicalHistory(prev => ({ ...prev, recentSunExposure: !!c }))}
                                />
                                <label htmlFor="sun" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    {t("bookingConsent.sunExposure", "Recent sun exposure / tanning (last 2 weeks)?")}
                                </label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="meds"
                                    checked={medicalHistory.medications}
                                    onCheckedChange={(c) => setMedicalHistory(prev => ({ ...prev, medications: !!c }))}
                                />
                                <label htmlFor="meds" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    {t("bookingConsent.medications", "Taking blood thinners or photosensitive meds?")}
                                </label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="implants"
                                    checked={medicalHistory.implants}
                                    onCheckedChange={(c) => setMedicalHistory(prev => ({ ...prev, implants: !!c }))}
                                />
                                <label htmlFor="implants" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    {t("bookingConsent.implants", "Do you have any metal implants or pacemakers?")}
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Terms */}
                    <ScrollArea className="h-32 rounded-md border p-4 bg-stone-50 text-sm text-muted-foreground">
                        <p className="mb-2"><strong>{t("bookingConsent.termsAndConditions", "Terms and Conditions:")}</strong></p>
                        <p>{t("bookingConsent.term1", "I acknowledge that the information provided is accurate and complete. I understand the potential risks and side effects associated with this treatment, including but not limited to redness, swelling, and temporary sensitivity.")}</p>
                        <p className="mt-2">{t("bookingConsent.term2", "I verify that I have adhered to all pre-treatment instructions, including avoiding sun exposure and discontinuing specific skincare products as advised.")}</p>
                        <p className="mt-2">{t("bookingConsent.term3", "I consent to the treatment and release Lune Skin Care and its staff from liability associated with normal risks of this procedure.")}</p>
                    </ScrollArea>

                    {/* Agreement Checkbox */}
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="terms"
                            checked={agreed}
                            onCheckedChange={(c) => setAgreed(!!c)}
                        />
                        <label htmlFor="terms" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            {t("bookingConsent.agreeText", "I have read and agree to the terms and conditions and certify that my medical history is accurate.")}
                        </label>
                    </div>

                    {/* Signature Pad */}
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <Label>{t("bookingConsent.digitalSignature", "Digital Signature")}</Label>
                            <Button variant="ghost" size="sm" onClick={clearSignature} className="text-xs text-muted-foreground hover:text-destructive">
                                <Eraser className="w-3 h-3 mr-1" /> {t("bookingConsent.clear", "Clear")}
                            </Button>
                        </div>
                        <div className="border rounded-md bg-stone-50 overflow-hidden relative cursor-crosshair touch-none">
                            <canvas
                                ref={canvasRef}
                                width={600}
                                height={200}
                                className="w-full h-48 block"
                                onMouseDown={startDrawing}
                                onMouseMove={draw}
                                onMouseUp={stopDrawing}
                                onMouseLeave={stopDrawing}
                                onTouchStart={startDrawing}
                                onTouchMove={draw}
                                onTouchEnd={stopDrawing}
                            />
                            {!signatureData && !isDrawing && (
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-muted-foreground/30">
                                    <span className="flex items-center text-sm"><PenTool className="w-4 h-4 mr-2" /> {t("bookingConsent.signHere", "Sign here")}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <DialogFooter className="gap-2 sm:gap-0">
                    <Button variant="outline" onClick={() => onOpenChange(false)}>{t("bookingConsent.cancel", "Cancel")}</Button>
                    <Button onClick={handleConfirm} disabled={!isFormValid} className="bg-primary hover:bg-primary/90">
                        {t("bookingConsent.confirmBook", "Confirm & Book Appointment")}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
