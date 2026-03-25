"use client";

import { Button } from "@/components/ui/button";
import { Download, Plus } from "lucide-react";
import { StatsCards } from "@/components/admin/stats-cards";
import { AppointmentsTable } from "@/components/admin/appointments-table";
import { ActivityChart } from "@/components/admin/activity-chart";
import { ManualBookingDialog } from "@/components/admin/manual-booking-dialog";
import { GalleryManager } from "@/components/admin/gallery-manager";
import { TestimonialsManager } from "@/components/admin/testimonials-manager";
import { LeadsTable } from "@/components/admin/leads-table";
import { AuthHelper } from "@/lib/auth-helper";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/context/language-context";
import { useEffect, useRef, useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function DashboardPage() {
    const { t } = useLanguage();
    const { toast } = useToast();
    const previousLeadsLength = useRef<number>(0);

    const [newLeadsCount, setNewLeadsCount] = useState(0);

    const isFirstLoad = useRef(true);

    useEffect(() => {
        const unsubscribe = AuthHelper.subscribeToLeads((leads) => {
            // Update new leads count
            const newCount = leads.filter(l => l.status === 'new').length;
            setNewLeadsCount(newCount);

            // Skip notification on first load, but set the previous length
            if (isFirstLoad.current) {
                previousLeadsLength.current = leads.length;
                isFirstLoad.current = false;
                return;
            }

            // Check if leads increased
            if (leads.length > previousLeadsLength.current) {
                toast({
                    title: "New Lead Received! 🎉",
                    description: "A new inquiry has been submitted via the contact form.",
                    duration: 5000,
                });
            }
            previousLeadsLength.current = leads.length;
        });

        return () => unsubscribe();
    }, [toast]);

    const handleDownloadReport = async () => {
        try {
            const appointments = await AuthHelper.getAllAppointments();

            // Define CSV headers
            const headers = ["Client Name", "Client Email", "Treatment", "Date", "Time", "Status"];

            // Map data to CSV rows
            const rows = appointments.map(apt => [
                `"${apt.clientName}"`,
                `"${apt.clientEmail}"`,
                `"${apt.treatment}"`,
                `"${apt.date}"`,
                `"${apt.time}"`,
                `"${apt.status}"`
            ]);

            // Combine headers and rows
            const csvContent = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");

            // Create download link
            const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.setAttribute("href", url);
            link.setAttribute("download", `lune_report_${new Date().toISOString().split('T')[0]}.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error("Failed to download report:", error);
        }
    };

    return (
        <div className="min-h-screen bg-[#FFFDF9] py-8">
            <div className="container mx-auto px-4 space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-serif text-slate-900">{t('admin.title')}</h1>
                        <p className="text-muted-foreground mt-1">
                            {t('admin.subtitle')}
                        </p>
                    </div>
                </div>

                {/* Tabs */}
                <Tabs defaultValue="dashboard" className="space-y-6">
                    <TabsList className="bg-white">
                        <TabsTrigger value="dashboard">{t('admin.tabs.dashboard')}</TabsTrigger>
                        <TabsTrigger value="gallery">{t('admin.tabs.gallery')}</TabsTrigger>
                        <TabsTrigger value="testimonials">{t('admin.tabs.testimonials')}</TabsTrigger>
                        <TabsTrigger value="leads" className="relative">
                            <span>Leads</span>
                            {newLeadsCount > 0 && (
                                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
                                    {newLeadsCount}
                                </span>
                            )}
                        </TabsTrigger>
                    </TabsList>

                    {/* Dashboard Tab */}
                    <TabsContent value="dashboard" className="space-y-6">
                        <div className="flex items-center gap-2">
                            <Button variant="outline" className="bg-white hover:bg-stone-50" onClick={handleDownloadReport}>
                                <Download className="mr-2 h-4 w-4" />
                                {t('admin.buttons.downloadReport')}
                            </Button>
                            <ManualBookingDialog />
                        </div>

                        {/* Stats */}
                        <StatsCards />

                        {/* Main Content */}
                        <div className="grid lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2">
                                <AppointmentsTable />
                            </div>
                            <div className="lg:col-span-1">
                                <ActivityChart />
                            </div>
                        </div>
                    </TabsContent>

                    {/* Gallery Tab */}
                    <TabsContent value="gallery">
                        <GalleryManager />
                    </TabsContent>

                    {/* Testimonials Tab */}
                    <TabsContent value="testimonials">
                        <TestimonialsManager />
                    </TabsContent>

                    {/* Leads Tab */}
                    <TabsContent value="leads">
                        <LeadsTable />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
