"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Calendar, DollarSign, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import { AuthHelper } from "@/lib/auth-helper";
import { initializeFirebase } from "@/firebase";
import { collection, onSnapshot } from "firebase/firestore";
import { useLanguage } from "@/context/language-context";

export function StatsCards() {
    const { t } = useLanguage();
    const [stats, setStats] = useState({ bookings: 0, revenue: 0, clients: 0 });

    useEffect(() => {
        const { firestore } = initializeFirebase();

        // Listen to Users
        const unsubUsers = onSnapshot(collection(firestore, "users"), (snapshot) => {
            setStats(prev => ({ ...prev, clients: snapshot.size }));
        });

        // Listen to Appointments
        const unsubApts = onSnapshot(collection(firestore, "appointments"), (snapshot) => {
            const count = snapshot.size;
            setStats(prev => ({
                ...prev,
                bookings: count,
                revenue: count * 150
            }));
        });

        return () => {
            unsubUsers();
            unsubApts();
        };
    }, []);

    const cards = [
        {
            title: t('admin.stats.totalBookings'),
            value: stats.bookings.toString(),
            change: "+12.5%",
            icon: Calendar,
        },
        {
            title: t('admin.stats.activeClients'),
            value: stats.clients.toString(),
            change: "+4.2%",
            icon: Users,
        },
        {
            title: t('admin.stats.revenue'),
            value: `$${stats.revenue.toLocaleString()}`,
            change: "+8.1%",
            icon: DollarSign,
        },
        {
            title: t('admin.stats.growth'),
            value: "24%",
            change: "+2.4%",
            icon: TrendingUp,
        },
    ];

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {cards.map((card) => (
                <Card key={card.title}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            {card.title}
                        </CardTitle>
                        <card.icon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{card.value}</div>
                        <p className="text-xs text-muted-foreground">
                            {card.change} {t('admin.stats.fromLastMonth')}
                        </p>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
