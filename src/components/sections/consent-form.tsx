"use client";

import { useLanguage } from '@/context/language-context';

import { useState, useEffect, useRef } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Eraser, PenTool } from "lucide-react";

interface ConsentFormProps {
    onConsentChange: (isValid: boolean, data: any) => void;
}

export function ConsentForm({ onConsentChange }: ConsentFormProps) {
    const { t } = useLanguage();
    const [medicalHistory, setMedicalHistory] = useState({
        pregnancy: false,
        diabetes: false,
        accutane: false,
        pacemaker: false,
        keloids: false,
        skinCancer: false,
        herpesSimplex: false,
        sunburn: false
    });

    const [hasReadAgreement, setHasReadAgreement] = useState(false);
    const [signatureData, setSignatureData] = useState<string | null>(null);
    const [signatureDate, setSignatureDate] = useState(new Date().toISOString().split('T')[0]);

    // Canvas state
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);

    // Initialize canvas
    useEffect(() => {
        if (canvasRef.current) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.lineWidth = 2;
                ctx.lineCap = 'round';
                ctx.strokeStyle = '#000';
            }
        }
    }, []);

    // Drawing functions
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

    useEffect(() => {
        const isValid = hasReadAgreement && !!signatureData;

        onConsentChange(isValid, {
            medicalHistory,
            consentSigned: hasReadAgreement,
            consentSignature: signatureData,
            consentDate: signatureDate
        });
    }, [medicalHistory, hasReadAgreement, signatureData, signatureDate, onConsentChange]);

    return (
        <div className="space-y-8 border rounded-xl p-6 bg-stone-50/50">
            <div>
                <h2 className="text-xl font-bold font-headline mb-4">{t("consentForm.title", "Client Consent Form")}</h2>
                <p className="text-stone-500 text-sm mb-6">
                    {t("consentForm.description", "Please review the following information carefully. Your safety and comfort are our top priorities.")}
                </p>
            </div>

            {/* Medical History Section */}
            <section className="space-y-4">
                <h3 className="font-semibold text-stone-900 border-b pb-2">{t("consentForm.medicalHistory", "Medical History")}</h3>
                <p className="text-sm text-stone-600 mb-3">{t("consentForm.medicalQuestion", "Do you currently have or have you had any of the following?")}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="pregnancy"
                            checked={medicalHistory.pregnancy}
                            onCheckedChange={(checked) => setMedicalHistory(prev => ({ ...prev, pregnancy: checked as boolean }))}
                        />
                        <Label htmlFor="pregnancy">{t("consentForm.pregnancy", "Pregnancy / Breastfeeding")}</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="diabetes"
                            checked={medicalHistory.diabetes}
                            onCheckedChange={(checked) => setMedicalHistory(prev => ({ ...prev, diabetes: checked as boolean }))}
                        />
                        <Label htmlFor="diabetes">{t("consentForm.diabetes", "Diabetes")}</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="accutane"
                            checked={medicalHistory.accutane}
                            onCheckedChange={(checked) => setMedicalHistory(prev => ({ ...prev, accutane: checked as boolean }))}
                        />
                        <Label htmlFor="accutane">{t("consentForm.accutane", "Accutane use (last 6 months)")}</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="pacemaker"
                            checked={medicalHistory.pacemaker}
                            onCheckedChange={(checked) => setMedicalHistory(prev => ({ ...prev, pacemaker: checked as boolean }))}
                        />
                        <Label htmlFor="pacemaker">{t("consentForm.pacemaker", "Pacemaker / Metal Implants")}</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="keloids"
                            checked={medicalHistory.keloids}
                            onCheckedChange={(checked) => setMedicalHistory(prev => ({ ...prev, keloids: checked as boolean }))}
                        />
                        <Label htmlFor="keloids">{t("consentForm.keloids", "Keloid Scarring")}</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="skinCancer"
                            checked={medicalHistory.skinCancer}
                            onCheckedChange={(checked) => setMedicalHistory(prev => ({ ...prev, skinCancer: checked as boolean }))}
                        />
                        <Label htmlFor="skinCancer">{t("consentForm.skinCancer", "Skin Cancer")}</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="herpes"
                            checked={medicalHistory.herpesSimplex}
                            onCheckedChange={(checked) => setMedicalHistory(prev => ({ ...prev, herpesSimplex: checked as boolean }))}
                        />
                        <Label htmlFor="herpes">{t("consentForm.herpes", "Active Herpes Simplex (Cold Sores)")}</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="sunburn"
                            checked={medicalHistory.sunburn}
                            onCheckedChange={(checked) => setMedicalHistory(prev => ({ ...prev, sunburn: checked as boolean }))}
                        />
                        <Label htmlFor="sunburn">{t("consentForm.sunburn", "Recent Sunburn / Tan (last 2 weeks)")}</Label>
                    </div>
                </div>
            </section>

            {/* Consent Agreement */}
            <section className="space-y-4">
                <h3 className="font-semibold text-stone-900 border-b pb-2">{t("consentForm.treatmentConsent", "Treatment Consent")}</h3>
                <ScrollArea className="h-[200px] w-full rounded-md border p-4 bg-white text-sm text-stone-600">
                    <p className="mb-2">
                        {t("consentForm.consent1", "I acknowledge that I have voluntarily requested a skin care treatment / laser service from Lune Advanced Skincare. I understand that while complications are rare, they can occur. Potential risks include but are not limited to: temporary redness, swelling, blistering, burns, scarring, or changes in skin pigmentation.")}
                    </p>
                    <p className="mb-2">
                        {t("consentForm.consent2", "I confirm that I have disclosed all relevant medical history, including current medications and recent sun exposure. I understand the importance of following pre- and post-treatment instructions to minimize risks and achieve optimal results.")}
                    </p>
                    <p className="mb-2">
                        {t("consentForm.consent3", "I understand that results vary from person to person and that multiple sessions may be required. No guarantees have been made to me regarding the outcome of the treatment.")}
                    </p>
                    <p>
                        {t("consentForm.consent4", "By signing below, I release Lune Advanced Skincare and its staff from any liability associated with the treatment performed, except in cases of gross negligence.")}
                    </p>
                </ScrollArea>

                <div className="flex items-center space-x-2 pt-2">
                    <Checkbox
                        id="agreement"
                        checked={hasReadAgreement}
                        onCheckedChange={(checked) => setHasReadAgreement(checked as boolean)}
                    />
                    <Label htmlFor="agreement" className="font-medium text-stone-900">
                        {t("consentForm.agreement", "I have read and understand the contents of this consent form.")}
                    </Label>
                </div>
            </section>

            {/* Signature Section */}
            <section className="space-y-4 pt-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <Label htmlFor="signature">{t("consentForm.digitalSignature", "Digital Signature")}</Label>
                            <Button variant="ghost" size="sm" onClick={clearSignature} className="text-xs text-muted-foreground hover:text-destructive h-6 px-2">
                                <Eraser className="w-3 h-3 mr-1" /> {t("consentForm.clear", "Clear")}
                            </Button>
                        </div>

                        <div className="border rounded-md bg-white overflow-hidden relative cursor-crosshair touch-none h-32 w-full">
                            <canvas
                                ref={canvasRef}
                                className="w-full h-full block"
                                width={500}
                                height={200}
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
                                    <span className="flex items-center text-sm"><PenTool className="w-4 h-4 mr-2" /> {t("consentForm.signHere", "Sign here")}</span>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="date">{t("consentForm.date", "Date")}</Label>
                        <Input
                            id="date"
                            type="date"
                            value={signatureDate}
                            readOnly
                            className="bg-stone-100"
                        />
                    </div>
                </div>
            </section>
        </div>
    );
}
