'use client';
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, CheckCircle, Minus, Plus } from "lucide-react";
import LeadsForm from "@/components/sections/leads-form";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PlaceHolderImages } from "@/lib/placeholder-images";
import Image from "next/image";
import { useAllServices } from "@/lib/all-services";
import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import { useAuthGuard } from "@/hooks/use-auth-guard";

export default function MicropeelingPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <MicropeelingPageContent />
        </Suspense>
    );
}

function MicropeelingPageContent() {
    const { jellyMaskServices, micropeelingPackages, micropeelingServices } = useAllServices();
    const services = micropeelingServices;
    const packages = micropeelingPackages;
    const searchParams = useSearchParams();
    const router = useRouter();
    const { handleAuthAction, AuthGuardComponent } = useAuthGuard();
    const [activeTab, setActiveTab] = useState("information");

    useEffect(() => {
        const tab = searchParams.get('tab');
        if (tab) {
            setActiveTab(tab);
            setTimeout(() => {
                const element = document.getElementById('treatment-guide');
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                }
            }, 500);
        }
    }, [searchParams]);

    const benefits = [
        { text: "Reduces fine lines and wrinkles", icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2c2.2 0 4 1.8 4 4v2" /><path d="M4 8V6c0-2.2 1.8-4 4-4" /><path d="M4 14v-2c0-1.1.9-2 2-2h12c1.1 0 2 .9 2 2v2" /><path d="M16 16.5c-1.5 0-2.8 1.1-3.3 2.5" /><path d="M8 16.5c1.5 0 2.8 1.1 3.3 2.5" /><path d="M12 21a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" /><path d="M12 5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" /></svg> },
        { text: "Shrinks enlarged pores", icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 21H7a2 2 0 0 1-2-2v-4.33L2.2 12.5a1 1 0 0 1 0-1L5 9.33V5a2 2 0 0 1 2-2h4" /><path d="m13 21 9-9-9-9" /><path d="M12 10v4" /><path d="M10 12h4" /></svg> },
        { text: "Stimulates natural collagen", icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" /><path d="m16.24 7.76.01-.01" /><path d="m10.27 3.9-.01.01" /><path d="m4.26 9.76.01.01" /><path d="m7.76 16.24.01-.01" /><path d="M4 12H2" /><path d="M12 4V2" /><path d="M20 12h2" /><path d="M12 20v2" /></svg> },
        { text: "Improves skin texture", icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2Z" /><path d="M7 13c.8-1.5 2.2-2.5 4-2.5s3.2 1 4 2.5" /><path d="m12 12-2 4" /><path d="m12 12 2 4" /></svg> },
        { text: "Improves the appearance of stretch marks", icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 5.5a2.5 2.5 0 0 0-5 0V7" /><path d="M11 12.5a2.5 2.5 0 0 0-5 0V14" /><path d="M6 8V6.5a4.5 4.5 0 1 1 9 0V8" /><path d="M6 14v-1.5a4.5 4.5 0 1 1 9 0V14" /><path d="M2 18h20" /><path d="m2 18-1-2.5a2.5 2.5 0 0 1 2-3h18a2.5 2.5 0 0 1 2 3L22 18" /></svg> },
        { text: "Minimizes appearance of scars", icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 13.5c-2.43 2.43-5.57 2.43-8 0" /><path d="m10.5 18-5-5" /><path d="m21.5 12-5-5" /><path d="M9 13.5c-2.43-2.43-2.43-5.57 0-8" /><path d="M13.5 18c2.43-2.43 5.57-2.43 8 0" /></svg> },
        { text: "Suitable for most skin types", icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a10 10 0 1 0 10 10c0-1.84-.5-3.55-1.32-5" /><path d="M15.5 11.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" /><path d="M8.5 11.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" /><path d="M18 16h-8" /><path d="M17.5 10.5c-1.5-1.5-3.5-1.5-5 0" /></svg> },
    ];

    const benefitsTop = benefits.slice(0, 4);
    const benefitsBottom = benefits.slice(4);

    const clientResultImage = PlaceHolderImages.find(img => img.id === "microneedling-before-after");

    const faqs = [
        {
            question: "Is micropeeling painful?",
            answer: "Most clients experience minimal discomfort. A topical numbing cream is applied before the treatment to ensure a comfortable experience. You might feel a slight vibrating or pricking sensation."
        },
        {
            question: "How many sessions will I need?",
            answer: "The number of sessions depends on your skin concerns. For general rejuvenation, 3-4 sessions are often recommended, spaced 4-6 weeks apart. For deeper concerns like acne scars, more sessions may be needed."
        },
        {
            question: "What is the downtime after micropeeling?",
            answer: "Downtime is minimal. You can expect redness and mild swelling for 24-48 hours, similar to a sunburn. Your skin may feel tight and sensitive. Most people return to normal activities the next day."
        },
        {
            question: "When will I see results?",
            answer: "You may notice a glow immediately after treatment. However, the most significant results appear after a few weeks as your body produces new collagen and elastin. Improvements can continue for up to six months."
        },
        {
            question: "Who is not a good candidate for micropeeling?",
            answer: "Micropeeling is not recommended for individuals with active acne, skin infections, keloid scarring, or certain skin conditions like eczema or psoriasis. It's also not advised for pregnant women."
        }
    ];

    const ServiceCardGrid = ({ title, services }: { title: string, services: Array<any> }) => (
        <div>
            <div className="flex items-center justify-center text-center mb-8">
                <span className="flex-grow border-t border-dashed border-border/40"></span>
                <h4 className="text-xl uppercase tracking-widest text-foreground/80 px-6">{title}</h4>
                <span className="flex-grow border-t border-dashed border-border/40"></span>
            </div>
            <div className="grid md:grid-cols-2 gap-x-12 gap-y-6">
                {services.map((service, index) => {
                    const image = PlaceHolderImages.find((img) => img.id === service.imageId);
                    return (
                        <div key={`${service.name}-${index}`} className="bg-white border-stone-200/0 rounded-lg p-6 flex justify-between items-start shadow-sm gap-4 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                            <div className="space-y-2 flex-grow">
                                <h4 className="text-xl font-semibold uppercase tracking-wider text-primary pt-2">{service.name}</h4>
                                <div className="text-muted-foreground text-lg flex items-center gap-2 flex-wrap pt-2">
                                    <button
                                        onClick={() => handleAuthAction(() => router.push(`/book?name=${encodeURIComponent(service.name)}&price=${encodeURIComponent(service.price)}&duration=${encodeURIComponent(service.duration || '')}&treatment=micropeeling`))}
                                        className="hover:underline text-primary font-medium bg-transparent border-none p-0 cursor-pointer text-left"
                                    >
                                        Book now
                                    </button>
                                    <span className="text-muted-foreground/50">•</span>
                                    <span>{service.price}</span>
                                    {service.duration && <>
                                        <span className="text-muted-foreground/50">•</span>
                                        <span>{service.duration}</span>
                                    </>}
                                    {service.sessions && <>
                                        <span className="text-muted-foreground/50">•</span>
                                        <span>{service.sessions}</span>
                                    </>}
                                </div>
                            </div>
                            {image && (
                                <Image
                                    src={image.imageUrl}
                                    alt={service.name}
                                    width={80}
                                    height={80}
                                    className="object-cover flex-shrink-0"
                                    data-ai-hint={image.imageHint}
                                />
                            )}
                        </div>
                    )
                })}
            </div>
        </div>
    );

    return (
        <div className="bg-white min-h-screen">
            <div className="relative h-[60vh] bg-stone-100">
                <img
                    src="/microneedling-pen.jpg"
                    alt="Micropeeling"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/20" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white px-4 max-w-4xl">
                        <h1 className="text-3xl md:text-5xl font-light uppercase tracking-widest font-serif">
                            Micropeeling DP4(Dermapen 4)
                        </h1>
                        <p className="mt-4 text-lg md:text-xl font-light">
                            Revitalize skin texture, boost collagen, and reveal a radiant glow.
                        </p>
                    </div>
                </div>
            </div>
            <div className="bg-stone-50">
                <div className="container mx-auto px-4 py-3 text-sm text-stone-500">
                    <Link href="/" className="hover:text-stone-900">Home</Link>
                    <span className="mx-2">/</span>
                    <Link href="/treatments" className="hover:text-stone-900">Our Treatments</Link>
                    <span className="mx-2">/</span>
                    <span className="text-stone-900">Micropeeling</span>
                </div>
            </div>

            <div className="container px-4 py-16">
                <div className="max-w-4xl mx-auto">
                    <div className="prose lg:prose-xl max-w-none text-stone-600">
                        <h2 className="text-4xl font-light uppercase tracking-wide font-serif text-stone-900 text-center">Micropeeling with DP4 (Dermapen 4)</h2>
                        <p className="mt-6 text-lg leading-relaxed text-justify">
                            DP4 Micropeeling is an advanced skin treatment that uses tiny, controlled needles to stimulate your skin's natural healing process. This encourages collagen and elastin production, which helps improve skin firmness, smooth texture, and reduces signs of aging like fine lines and acne scars. It also minimizes pores and evens out skin tone. Suitable for all skin types, DP4 Micropeeling delivers noticeable, long-lasting results with minimal downtime, leaving your skin looking refreshed and radiant.
                        </p>
                    </div>
                </div>
            </div>

            <div className="bg-background py-16">
                <div className="container px-4 max-w-4xl mx-auto space-y-16">
                    <ServiceCardGrid title="Individual Services" services={services} />
                    <ServiceCardGrid title="Micropeeling with Jelly Mask Add-On" services={jellyMaskServices} />
                    <ServiceCardGrid title="Micropeeling Packages" services={packages} />
                </div>
            </div>

            <section className="py-20 bg-stone-50 overflow-hidden">
                <div className="container mx-auto text-center">
                    <p className="text-stone-600 uppercase tracking-widest">Experience the full benefits of</p>
                    <h2 className="text-3xl md:text-4xl text-primary font-serif font-light mt-2 mb-12">Micropeeling</h2>
                </div>
                <div className="space-y-4">
                    <div className="relative flex overflow-hidden group">
                        <div className="flex gap-4 animate-scroll whitespace-nowrap">
                            {[...Array(3)].map((_, setIndex) => (
                                <div key={setIndex} className="flex gap-4">
                                    {benefitsTop.map((benefit, i) => (
                                        <div key={i} className={`flex items-center gap-3 px-6 py-3 rounded-full ${i % 2 === 0 ? 'bg-primary text-primary-foreground' : 'bg-stone-200 text-stone-800'}`}>
                                            <div className="shrink-0">{benefit.icon}</div>
                                            <span className="text-lg font-medium">{benefit.text}</span>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="relative flex overflow-hidden group">
                        <div className="flex gap-4 animate-scroll whitespace-nowrap" style={{ animationDirection: 'reverse' }}>
                            {[...Array(3)].map((_, setIndex) => (
                                <div key={setIndex} className="flex gap-4">
                                    {benefitsBottom.map((benefit, i) => (
                                        <div key={i} className={`flex items-center gap-3 px-6 py-3 rounded-full ${i % 2 !== 0 ? 'bg-primary text-primary-foreground' : 'bg-stone-200 text-stone-800'}`}>
                                            <div className="shrink-0">{benefit.icon}</div>
                                            <span className="text-lg font-medium">{benefit.text}</span>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Booking Form */}
            <LeadsForm />

            <div className="py-20 bg-stone-50 relative">
                <img
                    src="https://images.unsplash.com/photo-1552693673-1bf958298935?q=80&w=2073&auto=format&fit=crop"
                    alt="Client background"
                    className="absolute inset-0 w-full h-full object-cover opacity-20 blur-sm"
                    data-ai-hint="woman face"
                />
                <div className="relative container px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-light uppercase tracking-wide font-serif text-stone-900">Client Results</h2>
                    </div>
                    <div className="max-w-4xl mx-auto space-y-8">
                        {clientResultImage && (
                            <div className="bg-white p-4 rounded-lg shadow-md">
                                <div className="relative aspect-video w-full overflow-hidden rounded-md">
                                    <Image
                                        src={clientResultImage.imageUrl}
                                        alt={clientResultImage.description}
                                        fill
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        className="object-contain"
                                        data-ai-hint={clientResultImage.imageHint}
                                    />
                                </div>
                                <div className="mt-4 text-center">
                                    <p className="text-sm font-medium text-stone-500">Actual Patient Results</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="py-20 bg-stone-50/50" id="treatment-guide">
                <div className="container mx-auto px-4 max-w-4xl">
                    <h2 className="text-4xl font-light uppercase tracking-wide font-serif text-stone-900 text-center mb-12">Treatment Guide</h2>
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <TabsList className="grid w-full grid-cols-3 bg-stone-200/50 rounded-full p-1 h-auto text-stone-900">
                            <TabsTrigger value="information" className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground py-2.5 text-base">Information</TabsTrigger>
                            <TabsTrigger value="pre-treatment" className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground py-2.5 text-base">Pre-Treatment Care</TabsTrigger>
                            <TabsTrigger value="post-treatment" className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground py-2.5 text-base">Post-Treatment Care</TabsTrigger>
                        </TabsList>
                        <TabsContent value="information">
                            <div className="bg-white p-6 rounded-lg mt-6 border border-stone-200/50">
                                <p className="text-stone-600 leading-relaxed text-center">Micropeeling uses fine needles to create micro-injuries in the skin, triggering the body's natural collagen and elastin production. This process helps improve skin texture, reduce scars, and diminish the appearance of wrinkles.</p>
                            </div>
                        </TabsContent>
                        <TabsContent value="pre-treatment">
                            <div className="bg-white p-6 rounded-lg mt-6 border border-stone-200/50">
                                <ul className="list-disc list-inside text-stone-600 space-y-2 text-left prose">
                                    <li>Avoid direct sun exposure and tanning beds for at least 24 hours before treatment.</li>
                                    <li>Discontinue use of retinoids, exfoliants, or any topical acne products 3-5 days prior.</li>
                                    <li>Do not wax, shave, or use depilatory creams on the treatment area for 48 hours.</li>
                                    <li>Avoid blood-thinning medications like aspirin or ibuprofen for 48 hours before, if possible.</li>
                                    <li>Arrive at your appointment with clean, makeup-free skin.</li>
                                </ul>
                            </div>
                        </TabsContent>
                        <TabsContent value="post-treatment">
                            <div className="bg-white p-6 rounded-lg mt-6 border border-stone-200/50">
                                <ul className="list-disc list-inside text-stone-600 space-y-2 text-left prose">
                                    <li>Avoid sun exposure for at least 72 hours and use a broad-spectrum SPF 30+ daily.</li>
                                    <li>Do not use any exfoliating products, retinoids, or AHAs/BHAs for 5-7 days.</li>
                                    <li>Keep the skin hydrated with a gentle, non-comedogenic moisturizer.</li>
                                    <li>Avoid intense exercise, saunas, and steam rooms for 48 hours.</li>
                                    <li>Do not pick at or scratch the treated skin. Allow it to heal naturally.</li>
                                </ul>
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>

            <div className="pb-20 pt-10 bg-background">
                <div className="container mx-auto px-4 max-w-2xl">
                    <h2 className="text-4xl font-light uppercase tracking-wide font-serif text-primary text-center mb-12">
                        FAQs
                    </h2>
                    <Accordion type="single" collapsible className="w-full" defaultValue="item-0">
                        {faqs.map((faq, index) => (
                            <AccordionItem value={`item-${index}`} key={index} className="border-b border-stone-300">
                                <AccordionTrigger className="text-lg text-stone-900 font-medium py-6 hover:no-underline text-left">
                                    <div className="flex items-center">
                                        <span>{faq.question}</span>
                                    </div>
                                    <div className="w-8 h-8 rounded-full bg-stone-200 flex items-center justify-center shrink-0">
                                        <Plus className="h-4 w-4 text-stone-600 transition-transform duration-200 group-data-[state=open]:hidden" />
                                        <Minus className="h-4 w-4 text-stone-600 transition-transform duration-200 group-data-[state=closed]:hidden" />
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="pt-0 pb-6 text-stone-600 text-base text-left">
                                    {faq.answer}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>
            </div>

            <div className="container px-4 py-12 text-center">
                <Link href="/treatments" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors uppercase tracking-wider">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to all Treatments
                </Link>
            </div>
            {AuthGuardComponent}
        </div>
    );
}
