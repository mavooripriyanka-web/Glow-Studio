"use client";

import { UserProfileCard } from "@/components/dashboard/user-profile-card";
import { ReferralCard } from "@/components/dashboard/referral-card";
import { AppointmentsSection } from "@/components/dashboard/appointments-section";
import { InfoCard } from "@/components/dashboard/info-card";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { UserData, Appointment } from "@/lib/auth-helper";
import { useRouter } from "next/navigation";
import { useUser, useFirestore } from "@/firebase/provider";
import { doc, getDoc, collection, query, where, onSnapshot } from "firebase/firestore";
import { useAllServices } from "@/lib/all-services";
import { useLanguage } from "@/context/language-context";

export default function UserDashboardPage() {
    const { allServices, allServicesByCategory } = useAllServices();
    const { t } = useLanguage();
    const { user: firebaseUser, isUserLoading } = useUser();
    const firestore = useFirestore();
    const [user, setUser] = useState<UserData | null>(null);
    const [isBookingOpen, setIsBookingOpen] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (isUserLoading) return;

        if (!firebaseUser) {
            router.push("/signin");
            return;
        }

        const fetchUserData = async () => {
            if (!firestore || !firebaseUser) return;

            try {
                // 1. Get User Profile
                const userDocRef = doc(firestore, "users", firebaseUser.uid);
                const userDocSnap = await getDoc(userDocRef);

                let userData: UserData = {
                    uid: firebaseUser.uid,
                    name: firebaseUser.displayName || "User",
                    email: firebaseUser.email || "",
                    isGuest: false,
                    appointments: []
                };

                if (userDocSnap.exists()) {
                    const data = userDocSnap.data() as UserData;
                    userData = { ...userData, ...data };
                }

                // 2. Subscribe to Appointments
                const q = query(
                    collection(firestore, "appointments"),
                    where("clientEmail", "==", firebaseUser.email)
                );

                const unsubscribe = onSnapshot(q, (snapshot) => {
                    const appointments: Appointment[] = [];
                    snapshot.forEach((doc) => {
                        appointments.push({ id: doc.id, ...doc.data() } as Appointment);
                    });

                    // Sort appointments
                    appointments.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

                    setUser({ ...userData, appointments });
                });

                return () => unsubscribe();

            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        fetchUserData();

    }, [firebaseUser, isUserLoading, router, firestore]);

    if (isUserLoading || !user) {
        return (
            <main className="min-h-screen bg-[#FDFBF7] py-12">
                <div className="container px-4">
                    <div className="animate-pulse space-y-8">
                        <div className="h-64 bg-stone-200 rounded"></div>
                        <div className="h-64 bg-stone-200 rounded"></div>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[#FDFBF7] py-12">
            <div className="container px-4">

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left Sidebar */}
                    <div className="lg:col-span-4 space-y-8">
                        <UserProfileCard
                            user={user}
                            onUpdate={setUser}
                            isBookingOpen={isBookingOpen}
                            onBookingOpenChange={setIsBookingOpen}
                        />
                        <ReferralCard />
                    </div>

                    {/* Right Content */}
                    <div className="lg:col-span-8 space-y-8">
                        <AppointmentsSection
                            appointments={user.appointments}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <InfoCard
                                icon={CheckCircle2}
                                title={t('dashboard.aftercare')}
                                description={t('dashboard.aftercareDesc')}
                                actionLabel={t('dashboard.viewManual')}
                                actionHref={(() => {
                                    if (user.appointments && user.appointments.length > 0) {
                                        const latestAppointment = user.appointments[0];
                                        const mainTreatmentName = latestAppointment.treatment.split(',')[0].trim().toLowerCase();

                                        // 1. Try to find exact service match
                                        const service = allServices.find(s => s.name.toLowerCase() === mainTreatmentName);
                                        if (service) {
                                            return `/treatments/${service.treatment}?tab=post-treatment#treatment-guide`;
                                        }

                                        // 2. Try to find category match (e.g. "Laser Hair Removal")
                                        const category = allServicesByCategory.find(c => c.title.toLowerCase() === mainTreatmentName);
                                        if (category) {
                                            return `/treatments/${category.treatmentSlug}?tab=post-treatment#treatment-guide`;
                                        }

                                        // 3. Fallback: Keyword matching for robust redirection
                                        // Chemical Peel
                                        if (mainTreatmentName.includes("peel") && !mainTreatmentName.includes("micro")) {
                                            return `/treatments/chemical-peel?tab=post-treatment#treatment-guide`;
                                        }
                                        // Micropeeling
                                        if (mainTreatmentName.includes("micro") || mainTreatmentName.includes("needling") || mainTreatmentName.includes("dermapen")) {
                                            return `/treatments/micropeeling?tab=post-treatment#treatment-guide`;
                                        }
                                        // Facials
                                        if (mainTreatmentName.includes("facial") || mainTreatmentName.includes("hydra")) {
                                            return `/treatments/facials?tab=post-treatment#treatment-guide`;
                                        }
                                        // Lip Blush
                                        if (mainTreatmentName.includes("lip blush") || mainTreatmentName.includes("neutralisation")) {
                                            return `/treatments/lip-blush?tab=post-treatment#treatment-guide`;
                                        }
                                        // Body Sculpting
                                        if (mainTreatmentName.includes("cavitation") || mainTreatmentName.includes("radio") || mainTreatmentName.includes("vacuum") ||
                                            mainTreatmentName.includes("lypolysis") || mainTreatmentName.includes("ems") || mainTreatmentName.includes("sauna") ||
                                            mainTreatmentName.includes("sculpting")) {
                                            return `/treatments/body-sculpting?tab=post-treatment#treatment-guide`;
                                        }
                                        // Laser Skin Care (Must be checked before generic 'laser')
                                        if (mainTreatmentName.includes("skin care") || mainTreatmentName.includes("tightening") ||
                                            mainTreatmentName.includes("dark spot") || mainTreatmentName.includes("redness") || mainTreatmentName.includes("rejuvenation")) {
                                            return `/treatments/laser-skin-care?tab=post-treatment#treatment-guide`;
                                        }
                                        // Laser Hair Removal (Catch-all for 'laser' references not caught above)
                                        if (mainTreatmentName.includes("hair") || mainTreatmentName.includes("laser") ||
                                            mainTreatmentName.includes("bikini") || mainTreatmentName.includes("legs") || mainTreatmentName.includes("arms")) {
                                            return `/treatments/laser-hair-removal?tab=post-treatment#treatment-guide`;
                                        }
                                    }
                                    // Default fallback
                                    return "/treatments";
                                })()}
                            />
                            <InfoCard
                                icon={AlertCircle}
                                title={t('dashboard.nextPayment')}
                                description={t('dashboard.noPendingPayments')}
                                actionLabel={t('dashboard.viewHistory')}
                                actionHref="#"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
