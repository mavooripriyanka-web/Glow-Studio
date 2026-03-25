"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Check, X, Download } from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useRef } from "react";

interface ConsentViewModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    appointment: any; // Using any for simplicity, effectively AdminAppointment
}

export function ConsentViewModal({ open, onOpenChange, appointment }: ConsentViewModalProps) {
    if (!appointment) return null;

    const contentRef = useRef<HTMLDivElement>(null);

    const { clientName, treatment, consentDate, consentSignature, medicalHistory } = appointment;

    const handleDownloadPDF = async () => {
        if (!contentRef.current) return;

        try {
            const canvas = await html2canvas(contentRef.current, {
                scale: 2, // High resolution
                useCORS: true,
                logging: false,
                windowWidth: 794, // A4 width in px at 96dpi (approx)
                windowHeight: 1123, // A4 height in px at 96dpi (approx)
                onclone: (clonedDoc) => {
                    // Ensure the cloned element is visible
                    const element = clonedDoc.getElementById('print-container');
                    if (element) {
                        element.style.display = 'block';
                    }
                }
            });

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4',
            });

            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();

            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);

            // Generate filename
            const dateStr = consentDate ? new Date(consentDate).toISOString().split('T')[0] : 'undated';
            const safeClientName = clientName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
            pdf.save(`consent_${safeClientName}_${dateStr}.pdf`);
        } catch (error) {
            console.error("Error generating PDF:", error);
            // Optionally show user feedback here
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-serif text-center uppercase tracking-wide">Signed Consent Form</DialogTitle>
                    <DialogDescription className="text-center">
                        Verified consent for <span className="font-semibold text-primary">{treatment}</span>
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Header Info */}
                    <div className="grid grid-cols-2 gap-4 bg-stone-50 p-4 rounded-lg">
                        <div>
                            <p className="text-xs uppercase font-bold text-muted-foreground">Client</p>
                            <p className="font-medium">{clientName}</p>
                        </div>
                        <div>
                            <p className="text-xs uppercase font-bold text-muted-foreground">Date Signed</p>
                            <p className="font-medium">{consentDate ? new Date(consentDate).toLocaleString() : "N/A"}</p>
                        </div>
                    </div>

                    {/* Medical History */}
                    {medicalHistory && (
                        <div className="space-y-3">
                            <h4 className="font-semibold text-stone-900 border-b pb-2">Medical Declarations</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-4 text-sm">
                                <div className="flex items-center justify-between border-b border-dashed border-stone-200 pb-1">
                                    <span>Pregnant/Breastfeeding</span>
                                    <span>{medicalHistory.pregnant ? <Check className="w-4 h-4 text-red-500" /> : <X className="w-4 h-4 text-green-500" />}</span>
                                </div>
                                <div className="flex items-center justify-between border-b border-dashed border-stone-200 pb-1">
                                    <span>Recent Sun Exposure</span>
                                    <span>{medicalHistory.recentSunExposure ? <Check className="w-4 h-4 text-red-500" /> : <X className="w-4 h-4 text-green-500" />}</span>
                                </div>
                                <div className="flex items-center justify-between border-b border-dashed border-stone-200 pb-1">
                                    <span>Medications/Blood Thinners</span>
                                    <span>{medicalHistory.medications ? <Check className="w-4 h-4 text-red-500" /> : <X className="w-4 h-4 text-green-500" />}</span>
                                </div>
                                <div className="flex items-center justify-between border-b border-dashed border-stone-200 pb-1">
                                    <span>Implants/Pacemaker</span>
                                    <span>{medicalHistory.implants ? <Check className="w-4 h-4 text-red-500" /> : <X className="w-4 h-4 text-green-500" />}</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Terms */}
                    <div className="text-xs text-muted-foreground bg-stone-50 p-3 rounded italic">
                        "I acknowledge that the information provided is accurate... I consent to the treatment and release Lune Skin Care from liability..."
                    </div>

                    {/* Signature */}
                    <div className="space-y-2">
                        <h4 className="font-semibold text-stone-900">Digital Signature</h4>
                        <div className="border rounded-md bg-white p-4 flex justify-center">
                            {consentSignature ? (
                                <img
                                    src={consentSignature}
                                    alt="Client Signature"
                                    className="max-h-32 object-contain"
                                />
                            ) : (
                                <span className="text-muted-foreground italic">No signature data found.</span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-4 border-t mt-4">
                    <Button onClick={handleDownloadPDF} className="bg-primary text-white hover:bg-primary/90">
                        <Download className="mr-2 h-4 w-4" /> Download PDF
                    </Button>
                </div>
            </DialogContent>

            {/* Hidden Print Container */}
            <div style={{ position: "absolute", top: "-9999px", left: "-9999px" }}>
                <div
                    id="print-container"
                    ref={contentRef}
                    style={{
                        width: "210mm",
                        minHeight: "297mm",
                        padding: "20mm",
                        backgroundColor: "white",
                        color: "black",
                        fontFamily: "serif",
                        fontSize: "12pt",
                        lineHeight: "1.5"
                    }}
                >
                    {/* Header */}
                    <div className="flex justify-between items-start border-b-2 border-black pb-4 mb-8">
                        <div>
                            <h1 className="text-2xl font-bold uppercase tracking-widest">Lune Skin Care</h1>
                            <p className="text-sm text-gray-600">Advanced Skincare & Laser Clinic</p>
                        </div>
                        <div className="text-right">
                            <h2 className="text-xl font-bold uppercase">Consent Form</h2>
                            <p className="text-sm font-semibold mt-1">{treatment}</p>
                        </div>
                    </div>

                    {/* Client Info Grid */}
                    <div className="grid grid-cols-2 gap-8 mb-8">
                        <div>
                            <p className="text-xs font-bold uppercase text-gray-500 mb-1">Client Name</p>
                            <p className="text-lg font-medium border-b border-gray-300 pb-1">{clientName}</p>
                        </div>
                        <div>
                            <p className="text-xs font-bold uppercase text-gray-500 mb-1">Date Signed</p>
                            <p className="text-lg font-medium border-b border-gray-300 pb-1">
                                {consentDate ? new Date(consentDate).toLocaleString() : "N/A"}
                            </p>
                        </div>
                    </div>

                    {/* Medical Declarations */}
                    {medicalHistory && (
                        <div className="mb-8">
                            <h3 className="font-bold text-lg uppercase mb-4 border-b border-gray-200 pb-2">Medical Declarations</h3>
                            <div className="grid grid-cols-2 gap-x-12 gap-y-4">
                                <div className="flex justify-between items-center border-b border-dotted border-gray-300 pb-1">
                                    <span>Pregnant / Breastfeeding</span>
                                    <span className="font-bold">{medicalHistory.pregnant ? "YES" : "NO"}</span>
                                </div>
                                <div className="flex justify-between items-center border-b border-dotted border-gray-300 pb-1">
                                    <span>Recent Sun Exposure</span>
                                    <span className="font-bold">{medicalHistory.recentSunExposure ? "YES" : "NO"}</span>
                                </div>
                                <div className="flex justify-between items-center border-b border-dotted border-gray-300 pb-1">
                                    <span>Medications / Blood Thinners</span>
                                    <span className="font-bold">{medicalHistory.medications ? "YES" : "NO"}</span>
                                </div>
                                <div className="flex justify-between items-center border-b border-dotted border-gray-300 pb-1">
                                    <span>Implants / Pacemaker</span>
                                    <span className="font-bold">{medicalHistory.implants ? "YES" : "NO"}</span>
                                </div>
                                <div className="flex justify-between items-center border-b border-dotted border-gray-300 pb-1">
                                    <span>Active Infections</span>
                                    <span className="font-bold">{medicalHistory.activeInfection ? "YES" : "NO"}</span>
                                </div>
                                <div className="flex justify-between items-center border-b border-dotted border-gray-300 pb-1">
                                    <span>Keloid Scarring</span>
                                    <span className="font-bold">{medicalHistory.keloidScarring ? "YES" : "NO"}</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Agreement Text */}
                    <div className="mb-12 text-sm text-justify leading-relaxed text-gray-700 bg-gray-50 p-6 rounded-lg border border-gray-100">
                        <p className="mb-2 font-bold">Informed Consent Agreement:</p>
                        <p>
                            I acknowledge that I have been fully informed about the treatment, its procedure, expected results, and potential risks.
                            I confirm that the medical information provided above is accurate and complete to the best of my knowledge.
                            I understand that results may vary and that multiple sessions may be required.
                            I hereby release Lune Skin Care and its staff from any liability associated with the treatment performed today.
                            I consent to the taking of photographs for medical records and progress monitoring.
                        </p>
                    </div>

                    {/* Signature Section */}
                    <div className="mt-auto">
                        <div className="grid grid-cols-2 gap-12">
                            <div>
                                <p className="text-xs font-bold uppercase text-gray-500 mb-4">Client Signature</p>
                                <div className="border-b-2 border-black h-32 flex items-end justify-center pb-2">
                                    {consentSignature ? (
                                        <img
                                            src={consentSignature}
                                            alt="Client Signature"
                                            className="max-h-28 object-contain"
                                        />
                                    ) : (
                                        <span className="text-gray-400 italic">Signed Digitally</span>
                                    )}
                                </div>
                            </div>
                            <div>
                                <p className="text-xs font-bold uppercase text-gray-500 mb-4">Clinic Representative</p>
                                <div className="border-b-2 border-black h-32 flex items-end justify-center pb-2">
                                    <span className="font-script text-2xl text-gray-600">Lune Skin Care</span>
                                </div>
                            </div>
                        </div>
                        <p className="text-center text-xs text-gray-400 mt-8 pt-4 border-t border-gray-100">
                            Generated on {new Date().toLocaleDateString()} • Lune Skin Care Digital Records
                        </p>
                    </div>
                </div>
            </div>
        </Dialog>
    );
}
