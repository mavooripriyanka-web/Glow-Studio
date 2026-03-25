'use client';

import { Button } from '@/components/ui/button';
import { useAppointment } from '@/context/appointment-context';
import { useRouter } from 'next/navigation';
import { useAuthGuard } from '@/hooks/use-auth-guard';

interface BookNowButtonProps {
    treatmentName: string;
    price?: string; // Optional, defaults to "Contact for price" or similar logic if needed, but better to pass it.
    duration?: string;
    className?: string;
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
}

export default function BookNowButton({ treatmentName, price = "0", duration = "", className, variant = "default" }: BookNowButtonProps) {
    const { addService, clearCurrentServices } = useAppointment();
    const router = useRouter();
    const { handleAuthAction, AuthGuardComponent } = useAuthGuard();

    const handleBookNow = () => {
        handleAuthAction(() => {
            // Clear existing cart to start fresh from this specific treatment page
            clearCurrentServices();

            // Add the current treatment
            addService({
                name: treatmentName,
                price: price, // We might need to map this if it's not passed, but for now assuming specific pages pass it or we use a generic lookup.
                duration: duration,
                treatment: treatmentName.toLowerCase().replace(/\s+/g, '-') // Simple slugify
            });

            // Navigate to schedule
            router.push('/appointment/schedule');
        });
    };

    return (
        <>
            {AuthGuardComponent}
            <Button
                onClick={handleBookNow}
                className={className}
                variant={variant}
            >
                Book Appointment
            </Button>
        </>
    );
}
