import { Calendar, Clock, CheckCircle, Info, PenTool } from "lucide-react";
import Link from "next/link";
import { Appointment, AuthHelper } from "@/lib/auth-helper";
import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { useLanguage } from "@/context/language-context";
import { ConsentForm } from "@/components/consent-form";

interface AppointmentsSectionProps {
    appointments?: Appointment[];
    onBookNew?: () => void;
}

export function AppointmentsSection({ appointments = [], onBookNew }: AppointmentsSectionProps) {
    const { t, language } = useLanguage();
    const hasAppointments = appointments && appointments.length > 0;
    const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
    const [isConsentOpen, setIsConsentOpen] = useState(false);
    const [signingAppointment, setSigningAppointment] = useState<Appointment | null>(null);

    const handleSignClick = (apt: Appointment) => {
        setSigningAppointment(apt);
        setIsConsentOpen(true);
    };

    const handleConsentConfirm = async (signatureData: string, medicalHistory: any) => {
        if (!signingAppointment) return;

        const result = await AuthHelper.updateAppointmentConsent(signingAppointment.id, signatureData, medicalHistory);

        if (result.success) {
            // Update local state to reflect change immediately
            if (selectedAppointment && selectedAppointment.id === signingAppointment.id) {
                setSelectedAppointment({
                    ...selectedAppointment,
                    consentSigned: true,
                    consentSignature: signatureData,
                    consentDate: new Date().toLocaleDateString(),
                    medicalHistory: medicalHistory,
                    eSignStatus: 'successful'
                });
            }
            setIsConsentOpen(false);
            setSigningAppointment(null);
            // Ideally facilitate a re-fetch here if parent component supports it, 
            // but for now local state update allows user to see effect.
            // A full page refresh or parent re-fetch would be better for consistency.
            window.location.reload(); // Simple way to refresh data
        } else {
            alert("Failed to save signature. Please try again.");
        }
    };

    return (
        <div className="bg-white rounded-3xl p-8 shadow-sm h-[400px] overflow-y-auto">
            <h2 className="text-2xl font-serif text-primary mb-6">{t('dashboard.myAppointments')}</h2>

            {!hasAppointments ? (
                <div className="flex flex-col items-center justify-center h-[280px]">
                    <div className="h-20 w-20 rounded-full bg-stone-50 flex items-center justify-center mb-6">
                        <Calendar className="h-8 w-8 text-stone-300" />
                    </div>
                    <p className="text-stone-500 mb-2">{t('dashboard.noAppointments')}</p>
                    <Link
                        href="/treatments"
                        className="text-primary font-medium border-b border-primary/20 hover:border-primary"
                    >
                        {t('dashboard.scheduleFirst')}
                    </Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {appointments.map((apt) => (
                        <div key={apt.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-[#FDFBF7] rounded-xl gap-4 border border-stone-100 transition-all hover:shadow-md">
                            <div className="flex items-start gap-4">
                                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mt-1 shrink-0">
                                    <Calendar className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="font-medium text-lg text-primary">{apt.treatment}</h3>
                                    <div className="flex items-center gap-3 text-stone-500 text-sm mt-1 flex-wrap">
                                        <span className="flex items-center gap-1">
                                            {new Date(apt.date + 'T00:00:00').toLocaleDateString(language, { weekday: 'short', month: 'short', day: 'numeric' })}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Clock className="h-3 w-3" />
                                            {apt.time}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 w-full sm:w-auto mt-2 sm:mt-0">
                                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-50 text-green-700 text-xs font-medium uppercase tracking-wider shrink-0">
                                    <CheckCircle className="h-3 w-3" />
                                    {t('dashboard.confirmed')}
                                </div>
                                <div className="flex gap-2 ml-auto sm:ml-0">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="gap-2"
                                        onClick={() => setSelectedAppointment(apt)}
                                    >
                                        <Info className="h-4 w-4" />
                                        {t('dashboard.viewDetails')}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <Dialog open={!!selectedAppointment} onOpenChange={(open) => !open && setSelectedAppointment(null)}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="font-serif text-2xl text-primary">{t('dashboard.appointmentDetails')}</DialogTitle>
                        <DialogDescription>
                            {t('dashboard.fullDetails')}
                        </DialogDescription>
                    </DialogHeader>

                    {selectedAppointment && (
                        <div className="space-y-8 py-2">
                            {/* Service Status Header */}
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-stone-50 p-4 rounded-lg border border-stone-100 gap-4">
                                <div>
                                    <h3 className="font-bold text-lg text-primary">{selectedAppointment.treatment}</h3>
                                    <p className="text-stone-500 text-sm">
                                        {new Date(selectedAppointment.date + 'T00:00:00').toLocaleDateString(language, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} at {selectedAppointment.time}
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 px-3 py-1">
                                        {t('dashboard.confirmed')}
                                    </Badge>
                                    <Badge variant="outline" className={`${selectedAppointment.eSignStatus === 'successful' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-yellow-50 text-yellow-700 border-yellow-200'} px-3 py-1`}>
                                        {selectedAppointment.eSignStatus === 'successful' ? t('dashboard.consentSigned') : t('dashboard.consentPending')}
                                    </Badge>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-8">
                                {/* Left Column: Client & Medical */}
                                <div className="space-y-6">
                                    <div>
                                        <h4 className="text-sm font-medium uppercase tracking-wider text-stone-500 mb-3 border-b pb-1">{t('dashboard.clientInfo')}</h4>
                                        <div className="space-y-1 text-sm">
                                            {/* We rely on the context for user name, but here we only have appointment data. 
                                                If client info is not in appointment object, we assume current logged in user.
                                                Ideally appointment object should have snapshot of client details. 
                                                For now distinguishing fields if they exist or falling back to generic label. */}
                                            <p><span className="font-medium">{t('dashboard.dateBooked')}:</span> {selectedAppointment.date}</p>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="text-sm font-medium uppercase tracking-wider text-stone-500 mb-3 border-b pb-1">{t('dashboard.medicalHistory')}</h4>
                                        {selectedAppointment.medicalHistory ? (
                                            <div className="space-y-2 text-sm">
                                                {Object.entries(selectedAppointment.medicalHistory).map(([key, value]) => (
                                                    value === true && (
                                                        <div key={key} className="flex items-center gap-2 text-stone-800 bg-red-50 p-2 rounded">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                                                            <span className="capitalize font-medium">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                                                        </div>
                                                    )
                                                ))}
                                                {!Object.values(selectedAppointment.medicalHistory).some(v => v === true) && (
                                                    <p className="text-stone-500 italic flex items-center gap-2">
                                                        <CheckCircle className="w-4 h-4 text-green-500" />
                                                        {t('dashboard.noConditions')}
                                                    </p>
                                                )}
                                            </div>
                                        ) : (
                                            <p className="text-stone-400 italic text-sm">{t('dashboard.noMedicalHistory')}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Right Column: Signature */}
                                <div>
                                    <h4 className="text-sm font-medium uppercase tracking-wider text-stone-500 mb-3 border-b pb-1">{t('dashboard.digitalConsent')}</h4>

                                    {selectedAppointment.consentSignature ? (
                                        <div className="bg-white border-2 border-stone-100 rounded-xl p-4 flex flex-col items-center justify-between h-48 shadow-sm">
                                            <div className="w-full text-left">
                                                <p className="text-xs text-stone-400 uppercase tracking-widest mb-2">{t('dashboard.clientSignature')}</p>
                                            </div>
                                            <div className="relative w-full h-24 mb-2">
                                                <Image
                                                    src={selectedAppointment.consentSignature}
                                                    alt="Client Signature"
                                                    fill
                                                    className="object-contain"
                                                />
                                            </div>
                                            <div className="w-full border-t border-dashed border-stone-200 pt-2 flex justify-between text-xs text-stone-400 font-mono">
                                                <span>{t('dashboard.signedElectronically')}</span>
                                                <span>{selectedAppointment.consentDate}</span>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-6 flex flex-col items-center justify-center text-center h-48 gap-3">
                                            <div className="bg-yellow-100 p-3 rounded-full">
                                                <Clock className="w-6 h-6 text-yellow-600" />
                                            </div>
                                            <div>
                                                <h5 className="font-semibold text-yellow-800">{t('dashboard.consentPending')}</h5>
                                                <p className="text-xs text-yellow-600 mt-1 max-w-[200px]">
                                                    {t('dashboard.pleaseSign')}
                                                </p>
                                            </div>
                                            <Button
                                                size="sm"
                                                className="bg-yellow-600 hover:bg-yellow-700 text-white gap-2 text-xs uppercase tracking-wider w-full"
                                                onClick={() => handleSignClick(selectedAppointment)}
                                            >
                                                <PenTool className="w-3 h-3" />
                                                Sign Now
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Signing Modal */}
            {signingAppointment && (
                <ConsentForm
                    open={isConsentOpen}
                    onOpenChange={setIsConsentOpen}
                    clientName={signingAppointment.clientName || "Client"}
                    treatmentName={signingAppointment.treatment}
                    onConfirm={handleConsentConfirm}
                />
            )}
        </div>
    );
}
