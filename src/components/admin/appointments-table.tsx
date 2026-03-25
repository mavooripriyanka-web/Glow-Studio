"use client";

import { Search, MoreHorizontal, CheckCircle, XCircle, Trash2, FileSignature } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ConsentViewModal } from "@/components/admin/consent-view-modal";
import { useEffect, useState } from "react";
import { AuthHelper, Appointment } from "@/lib/auth-helper";
import { initializeFirebase } from "@/firebase";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { useLanguage } from "@/context/language-context";

type AdminAppointment = Appointment & { clientName: string; clientEmail: string };

const ADVANCED_TREATMENTS = [
    "Laser Hair Removal",
    "Micropeeling DP4",
    "Chemical Peel",
    "Laser Skin Care",
    "Body Sculpting",
    "Lip Blush"
];

export function AppointmentsTable() {
    const { t } = useLanguage();
    const [appointments, setAppointments] = useState<AdminAppointment[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedConsent, setSelectedConsent] = useState<AdminAppointment | null>(null);
    const [showConsentModal, setShowConsentModal] = useState(false);

    useEffect(() => {
        const { firestore } = initializeFirebase();

        // Subscribe to real-time updates
        const q = query(collection(firestore, "appointments"));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const newAppointments: AdminAppointment[] = [];
            snapshot.forEach((doc) => {
                const data = doc.data();
                newAppointments.push({
                    id: doc.id,
                    treatment: data.treatment,
                    date: data.date,
                    time: data.time,
                    status: data.status,
                    clientName: data.clientName || "Unknown",
                    clientEmail: data.clientEmail || "unknown@example.com",
                    userId: data.userId,
                    consentSigned: data.consentSigned,
                    eSignStatus: data.eSignStatus,
                    medicalHistory: data.medicalHistory,
                    consentDate: data.consentDate,
                    consentSignature: data.consentSignature
                } as AdminAppointment);
            });

            // Client-side sort
            newAppointments.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

            setAppointments(newAppointments);
        }, (error) => {
            console.error("Error fetching appointments:", error);
        });

        return () => unsubscribe();
    }, []);

    const handleStatusUpdate = async (email: string, id: string, status: 'upcoming' | 'completed' | 'cancelled') => {
        await AuthHelper.updateAppointmentStatus(email, id, status);
    };

    const handleDelete = async (id: string) => {
        if (window.confirm("Are you sure you want to delete this appointment? This action cannot be undone.")) {
            await AuthHelper.deleteAppointment(id);
        }
    };

    const handleViewConsent = (apt: AdminAppointment) => {
        if (apt.consentSigned) {
            setSelectedConsent(apt);
            setShowConsentModal(true);
        }
    };

    const filteredAppointments = appointments.filter(apt =>
        apt.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apt.treatment.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="bg-white rounded-lg shadow-sm border p-6 min-h-[400px]">
            <Tabs defaultValue="appointments" className="w-full">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
                    <TabsList className="bg-transparent p-0 w-full md:w-auto flex justify-start border-b rounded-none h-auto">
                        <TabsTrigger
                            value="appointments"
                            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2 uppercase tracking-wide text-xs font-semibold"
                        >
                            {t('admin.tabs.dashboard')}
                        </TabsTrigger>
                        <TabsTrigger
                            value="clients"
                            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2 uppercase tracking-wide text-xs font-semibold"
                        >
                            Clients
                        </TabsTrigger>
                        <TabsTrigger
                            value="analytics"
                            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2 uppercase tracking-wide text-xs font-semibold"
                        >
                            Analytics
                        </TabsTrigger>
                    </TabsList>

                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder={t('admin.appointments.searchPlaceholder')}
                            className="pl-8 bg-stone-50 border-none"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <TabsContent value="appointments">
                    <div className="rounded-md bg-stone-50/50">
                        <div className="overflow-x-auto w-full">
                            <Table>
                                <TableHeader>
                                    <TableRow className="border-none hover:bg-transparent">
                                        <TableHead className="uppercase text-xs font-bold tracking-wider text-muted-foreground pl-6">{t('admin.appointments.client')}</TableHead>
                                        <TableHead className="uppercase text-xs font-bold tracking-wider text-muted-foreground">{t('admin.appointments.treatment')}</TableHead>
                                        <TableHead className="uppercase text-xs font-bold tracking-wider text-muted-foreground">{t('admin.appointments.time')}</TableHead>
                                        <TableHead className="uppercase text-xs font-bold tracking-wider text-muted-foreground">{t('admin.appointments.esign')}</TableHead>
                                        <TableHead className="uppercase text-xs font-bold tracking-wider text-muted-foreground">{t('admin.appointments.status')}</TableHead>
                                        <TableHead className="uppercase text-xs font-bold tracking-wider text-muted-foreground">{t('admin.appointments.action')}</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredAppointments.length === 0 ? (
                                        <TableRow className="h-32 hover:bg-transparent">
                                            <TableCell colSpan={5} className="text-center text-muted-foreground italic">
                                                {t('admin.appointments.noBookings')}
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredAppointments.map((apt) => (
                                            <TableRow key={apt.id} className="hover:bg-white border-b border-stone-100">
                                                <TableCell className="font-medium text-primary pl-6 hover:bg-transparent">
                                                    <div className="min-w-[120px]">{apt.clientName}</div>
                                                    <div className="text-xs text-muted-foreground">{apt.clientEmail}</div>
                                                </TableCell>
                                                <TableCell className="min-w-[150px]">{apt.treatment}</TableCell>
                                                <TableCell className="min-w-[100px]">
                                                    <div className="text-sm">
                                                        {new Date(apt.date).toLocaleDateString()}
                                                    </div>
                                                    <div className="text-xs text-muted-foreground">{apt.time}</div>
                                                </TableCell>
                                                <TableCell className="min-w-[120px]">
                                                    {apt.consentSigned ? (
                                                        <div className="flex items-center gap-2">
                                                            <button
                                                                onClick={() => handleViewConsent(apt)}
                                                                className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-50 text-green-700 hover:bg-green-100 transition-colors cursor-pointer border border-green-200 whitespace-nowrap"
                                                                title={t('admin.appointments.viewConsent')}
                                                            >
                                                                <CheckCircle className="w-3 h-3 mr-1" /> {t('admin.appointments.download')}
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <button className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium cursor-pointer border transition-colors whitespace-nowrap
                                                                    ${!apt.eSignStatus || apt.eSignStatus === 'pending' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                                                                        apt.eSignStatus === 'in_process' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                                                            'bg-green-50 text-green-700 border-green-200'}`}>
                                                                    {!apt.eSignStatus || apt.eSignStatus === 'pending' ? t('admin.appointments.pending') :
                                                                        apt.eSignStatus === 'in_process' ? t('admin.appointments.inProcess') :
                                                                            t('admin.appointments.successful')}
                                                                </button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="start">
                                                                <DropdownMenuItem onClick={() => AuthHelper.updateAppointmentESignStatus(apt.id, 'pending')}>
                                                                    <span className="w-2 h-2 rounded-full bg-amber-500 mr-2"></span>
                                                                    {t('admin.appointments.pending')}
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem onClick={() => AuthHelper.updateAppointmentESignStatus(apt.id, 'in_process')}>
                                                                    <span className="w-2 h-2 rounded-full bg-blue-500 mr-2"></span>
                                                                    {t('admin.appointments.inProcess')}
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem onClick={() => AuthHelper.updateAppointmentESignStatus(apt.id, 'successful')}>
                                                                    <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                                                                    {t('admin.appointments.successful')}
                                                                </DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize whitespace-nowrap
                                                        ${apt.status === 'upcoming' ? 'bg-blue-50 text-blue-700' :
                                                            apt.status === 'completed' ? 'bg-green-50 text-green-700' :
                                                                'bg-red-50 text-red-700'}`}>
                                                        {t(`admin.appointments.statusValues.${apt.status}`)}
                                                    </span>
                                                </TableCell>
                                                <TableCell>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                                                <span className="sr-only">Open menu</span>
                                                                <MoreHorizontal className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuLabel>{t('admin.appointments.action')}</DropdownMenuLabel>
                                                            <DropdownMenuItem onClick={() => handleStatusUpdate(apt.clientEmail, apt.id, 'completed')}>
                                                                <CheckCircle className="mr-2 h-4 w-4" />
                                                                {t('admin.appointments.markCompleted')}
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => handleStatusUpdate(apt.clientEmail, apt.id, 'cancelled')} className="text-red-600">
                                                                <XCircle className="mr-2 h-4 w-4" />
                                                                {t('admin.appointments.cancelBooking')}
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => handleDelete(apt.id)} className="text-red-600">
                                                                <Trash2 className="mr-2 h-4 w-4" />
                                                                {t('admin.appointments.delete')}
                                                            </DropdownMenuItem>
                                                            {apt.consentSigned && (
                                                                <DropdownMenuItem onClick={() => handleViewConsent(apt)}>
                                                                    <FileSignature className="mr-2 h-4 w-4" />
                                                                    {t('admin.appointments.viewConsent')}
                                                                </DropdownMenuItem>
                                                            )}
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </TabsContent>
            </Tabs>

            <ConsentViewModal
                open={showConsentModal}
                onOpenChange={setShowConsentModal}
                appointment={selectedConsent}
            />
        </div>
    );
}
