'use client';

import { useAppointment } from '@/context/appointment-context';
import { useAllServices } from '@/lib/all-services';
import { Button } from '@/components/ui/button';
import { Check, Edit2, ChevronUp, ChevronDown } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import Link from 'next/link';

// Helper to parse price string like "CA$150.00" or "$40–$55"
const parsePrice = (priceStr: string): number => {
    if (!priceStr) return 0;
    const cleaned = priceStr.replace('CA', '').replace('$', '');
    if (cleaned.includes('–')) {
        const [min, max] = cleaned.split('–').map(Number);
        return (min + max) / 2;
    }
    return parseFloat(cleaned) || 0;
};


// Helper to format total duration
const formatDuration = (totalMinutes: number) => {
    if (totalMinutes === 0) return '0 min';
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    let result = '';
    if (hours > 0) {
        result += `${hours} hr `;
    }
    if (minutes > 0) {
        result += `${minutes} min`;
    }
    return result.trim();
};


export default function AppointmentPage() {
    const { allServicesByCategory } = useAllServices();
    const router = useRouter();
    const { services, addService, removeService, clearCurrentServices, isServiceAdded, totalPrice, totalDurationInMinutes } = useAppointment();

    // ONLY show add-ons for the most recently added treatment flow
    const lastService = services[services.length - 1];
    const activeTreatmentSlug = lastService?.treatment;
    const filteredCategories = allServicesByCategory.filter(cat =>
        cat.treatmentSlug === activeTreatmentSlug
    );

    return (
        <div className="bg-white min-h-screen">
            <div className="container mx-auto px-4 py-16">
                <div className="grid lg:grid-cols-3 gap-16">
                    {/* Left Column: Add more services */}
                    <div className="lg:col-span-2">
                        {filteredCategories.length > 0 && (
                            <>
                                <h1 className="text-3xl font-bold mb-8">Add more to your appointment?</h1>
                                <Accordion type="multiple" className="w-full space-y-4">
                                    {filteredCategories.map((category) => (
                                        <AccordionItem value={category.title} key={category.title} className="border rounded-lg bg-stone-50/50">
                                            <AccordionTrigger className="p-6 text-xl font-semibold hover:no-underline group">
                                                <div className="flex justify-between w-full items-center">
                                                    <span>{category.title}</span>
                                                    <ChevronDown className="h-5 w-5 shrink-0 transition-transform duration-200 text-stone-500 group-data-[state=open]:rotate-180" />
                                                </div>
                                            </AccordionTrigger>
                                            <AccordionContent className="px-6 pb-6 pt-0">
                                                <div className="space-y-4 border-t pt-4">
                                                    {category.services.map((service, index) => (
                                                        <div key={`${service.name}-${index}`} className="border-b py-4 last:border-b-0">
                                                            <div className="flex justify-between items-center">
                                                                <div>
                                                                    <h3 className="font-semibold text-lg">{service.name}</h3>
                                                                    <p className="text-stone-500">
                                                                        {service.price}
                                                                        {service.duration && ` • ${service.duration}`}
                                                                        {service.sessions && ` • ${service.sessions}`}
                                                                    </p>
                                                                </div>
                                                                {isServiceAdded(service.name) ? (
                                                                    <div className="flex items-center text-green-600 font-semibold">
                                                                        <Check className="w-4 h-4 mr-2" />
                                                                        Added
                                                                    </div>
                                                                ) : (
                                                                    <Button variant="outline" onClick={() => addService({ name: service.name, price: service.price, duration: service.duration || '', treatment: category.treatmentSlug })}>
                                                                        Add
                                                                    </Button>
                                                                )}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </AccordionContent>
                                        </AccordionItem>
                                    ))}
                                </Accordion>
                            </>
                        )}
                        {filteredCategories.length === 0 && (
                            <div className="flex flex-col items-center justify-center p-12 border rounded-lg bg-stone-50/50 text-center">
                                <h1 className="text-2xl font-bold mb-4">No additional services found</h1>
                                <p className="text-stone-500 mb-8">Please add a service from our treatment pages to see related add-ons.</p>
                                <Link href="/treatments">
                                    <Button variant="outline">Browse Treatments</Button>
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Right Column: Appointment Summary */}
                    <div className="sticky top-24 h-fit">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-2xl font-bold">Appointment summary</h2>
                            {services.length > 0 && (
                                <Button variant="ghost" size="sm" className="text-stone-500 hover:text-red-500" onClick={clearCurrentServices}>
                                    Clear all
                                </Button>
                            )}
                        </div>
                        <div className="border rounded-lg shadow-sm">
                            <Accordion type="single" collapsible defaultValue="item-1" className="w-full">
                                <AccordionItem value="item-1" className="border-none">
                                    <AccordionTrigger className="p-6 hover:no-underline group">
                                        <div className="flex justify-between items-center w-full">
                                            <span className="font-semibold">{services.length} {services.length === 1 ? 'service' : 'services'}</span>
                                            <span className="text-stone-500">
                                                CA${totalPrice.toFixed(2)} • {formatDuration(totalDurationInMinutes)}
                                            </span>
                                        </div>
                                        <ChevronUp className="h-4 w-4 shrink-0 transition-transform duration-200 text-stone-500 group-data-[state=open]:rotate-180 ml-2" />
                                    </AccordionTrigger>
                                    <AccordionContent className="px-6 pb-6">
                                        <div className="space-y-4 border-t pt-4 relative">
                                            <div className="absolute top-4 bottom-4 left-2 w-px bg-stone-200"></div>
                                            {services.map((service, index) => (
                                                <div key={index} className="flex justify-between items-start pl-6">
                                                    <div className="relative">
                                                        <div className="absolute -left-[1.3rem] top-1.5 w-2 h-2 rounded-full bg-stone-300"></div>
                                                        <div>
                                                            <p className="font-medium">{service.name}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className='text-sm'>CA${parsePrice(service.price).toFixed(2)}</span>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-stone-500 hover:text-stone-800" onClick={() => removeService(service.name)}>
                                                            <Edit2 className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                            <div className="p-6 bg-stone-50 rounded-b-lg border-t">
                                <Link href="/appointment/schedule" className='block w-full'>
                                    <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground py-6 text-lg">Next</Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
