'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Suspense } from 'react';
import { useAppointment, type Service } from '@/context/appointment-context';
import Image from 'next/image';

function BookingDetails() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { addService } = useAppointment();

    const name = searchParams.get('name');
    const price = searchParams.get('price');
    const duration = searchParams.get('duration');
    const treatmentSlug = searchParams.get('treatment');
    const treatmentName = treatmentSlug ? treatmentSlug.replace(/-/g, ' ') : 'treatments';
    const image = searchParams.get('image');

    const handleAdd = () => {
        if (name && price && treatmentSlug) {
            addService({
                name,
                price,
                duration,
                treatment: treatmentSlug,
            });
            router.push('/appointment');
        }
    };

    const formatPrice = (priceStr: string | null) => {
        if (!priceStr) return '';
        if (priceStr.includes('–')) return `CA${priceStr}`; // It's a range
        const numericPrice = parseFloat(priceStr.replace('$', ''));
        if (!isNaN(numericPrice)) {
            return `CA$${numericPrice.toFixed(2)}`;
        }
        return `CA${priceStr}`;
    }

    return (
        <div className="bg-white min-h-screen">
            <div className="container mx-auto px-4 py-16 max-w-4xl">
                <div className="grid md:grid-cols-2 gap-12 items-start">
                    <div className="relative aspect-[4/5] rounded-lg overflow-hidden">
                        <Image
                            src={image || '/photo.jpg'}
                            alt={name || 'Treatment image'}
                            fill
                            className="object-cover"
                        />
                    </div>
                    <div>
                        <div className="text-sm text-stone-500 mb-4 capitalize">
                            <Link href="/treatments" className="hover:text-stone-900">All services</Link>
                            <span className="mx-2">/</span>
                            <Link href={`/treatments/${treatmentSlug}`} className="hover:text-stone-900">{treatmentName}</Link>
                        </div>
                        <h1 className="text-4xl font-bold font-headline text-primary mb-4">{name}</h1>
                        <p className="text-lg text-stone-600 mb-8">
                            {formatPrice(price)} {duration && `• ${duration}`}
                        </p>
                        <Button onClick={handleAdd} size="lg" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground py-6 text-lg">Add</Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function BookServicePage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <BookingDetails />
        </Suspense>
    );
}
