'use client';
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Minus, Plus } from "lucide-react";
import LeadsForm from "@/components/sections/leads-form";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import InstagramFeed from "@/components/sections/instagram-feed";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { useAllServices } from "@/lib/all-services";
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuthGuard } from "@/hooks/use-auth-guard";
import { useState, useEffect, Suspense } from "react";



export default function LaserSkinCarePage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <LaserSkinCareContent />
        </Suspense>
    );
}

function LaserSkinCareContent() {
    const { laserSkinRejuvenationServices } = useAllServices();
    const router = useRouter();
    const searchParams = useSearchParams();
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
        { text: "Reduces fine lines & wrinkles", icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2c2.2 0 4 1.8 4 4v2" /><path d="M4 8V6c0-2.2 1.8-4 4-4" /><path d="M4 14v-2c0-1.1.9-2 2-2h12c1.1 0 2 .9 2 2v2" /><path d="M16 16.5c-1.5 0-2.8 1.1-3.3 2.5" /><path d="M8 16.5c1.5 0 2.8 1.1 3.3 2.5" /><path d="M12 21a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" /><path d="M12 5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" /></svg> },
        { text: "Improves skin texture", icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2Z" /><path d="M7 13c.8-1.5 2.2-2.5 4-2.5s3.2 1 4 2.5" /><path d="m12 12-2 4" /><path d="m12 12 2 4" /></svg> },
        { text: "Treats Sun damage", icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" /><path d="m16.24 7.76.01-.01" /><path d="m10.27 3.9-.01.01" /><path d="m4.26 9.76.01.01" /><path d="m7.76 16.24.01-.01" /><path d="M4 12H2" /><path d="M12 4V2" /><path d="M20 12h2" /><path d="M12 20v2" /></svg> },
    ];
    const benefitsBottom = [
        { text: "Fades acne scars & blemishes", icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 13.5c-2.43 2.43-5.57 2.43-8 0" /><path d="m10.5 18-5-5" /><path d="m21.5 12-5-5" /><path d="M9 13.5c-2.43-2.43-2.43-5.57 0-8" /><path d="M13.5 18c2.43-2.43 5.57-2.43 8 0" /></svg> },
        { text: "Minimizes pores", icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 21H7a2 2 0 0 1-2-2v-4.33L2.2 12.5a1 1 0 0 1 0-1L5 9.33V5a2 2 0 0 1 2-2h4" /><path d="m13 21 9-9-9-9" /><path d="M12 10v4" /><path d="M10 12h4" /></svg> },
        { text: "Boosts collagen production", icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" /><path d="m9 12 2 2 4-4" /></svg> },
    ];

    const clientResultImage = PlaceHolderImages.find(img => img.id === "laser-skin-care-before-after");

    const faqs = [
        {
            question: "What does Laser Skin Care treat?",
            answer: "It can reduce fine lines, wrinkles, Sun damage, age spots, acne scars, enlarged pores, uneven skin tone, texture redness and broken capillaries."
        },
        {
            question: "How many sessions will I need?",
            answer: "The number of sessions depends on your skin concerns and goals. Typically, a series of 3-6 treatments spaced 4 weeks apart is recommended for optimal, long-lasting results."
        },
        {
            question: "Is the treatment painful?",
            answer: "Most clients experience a mild, warming sensation during the treatment. The GentleMax Pro® has a built-in cooling system to ensure your comfort throughout the session."
        },
        {
            question: "What is the downtime?",
            answer: "There is minimal to no downtime. You might experience some mild redness immediately after the treatment, but this usually subsides within a few hours. You can return to your normal activities right away."
        },
        {
            question: "When will I see results?",
            answer: "Some clients notice an immediate improvement in their skin's radiance. However, the full benefits of collagen remodeling and pigment reduction will become more visible over several weeks to months."
        }
    ];

    return (
        <div className="bg-white min-h-screen">
            <div className="relative h-[60vh] bg-stone-100">
                <img
                    src="/rejuvenation.png"
                    alt="Laser Skin Care"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/20" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white px-4 max-w-4xl">
                        <p className="text-lg md:text-xl font-light">Reveal smoother, brighter, youthful skin with advanced laser skin care treatment.</p>
                        <h1 className="text-3xl md:text-5xl font-light uppercase tracking-widest font-serif mt-2">
                            Laser Skin Care
                        </h1>
                    </div>
                </div>
            </div>
            <div className="bg-stone-50">
                <div className="container mx-auto px-4 py-3 text-sm text-muted-foreground">
                    <Link href="/" className="hover:text-foreground">Home</Link>
                    <span className="mx-2">/</span>
                    <Link href="/treatments" className="hover:text-foreground">Our Treatments</Link>
                    <span className="mx-2">/</span>
                    <span className="text-foreground">Laser Skin Care</span>
                </div>
            </div>

            <div className="container px-4 py-16">
                <div className="max-w-4xl mx-auto">
                    <div className="prose lg:prose-xl max-w-none text-muted-foreground">
                        <h2 className="text-4xl font-light uppercase tracking-wide font-serif text-foreground text-center">Laser Skin Care with GentleMax Pro®</h2>
                        <p className="mt-6 text-lg leading-relaxed text-center">
                            Reveal firmer, smoother, and more radiant skin with our luxury laser skin care treatment. Using the advanced GentleMax Pro®, this non-invasive procedure boosts collagen, softens fine lines, and fades age spots — delivering visible anti-aging results with minimal downtime.
                        </p>
                    </div>

                    <div className="mt-12 text-center">
                        <h3 className="text-2xl font-light uppercase tracking-wide font-serif text-foreground">Benign Pigmented Lesions</h3>
                        <p className="mt-2 text-muted-foreground max-w-2xl mx-auto">Safe and effective for all skin tones, including brown and darker skin. Multiple sessions are recommended for optimal results.</p>
                    </div>
                </div>
            </div>

            <div className="bg-background py-16">
                <div className="container px-4 max-w-4xl mx-auto">
                    <div className="flex items-center justify-center text-center mb-12">
                        <span className="flex-grow border-t border-dashed border-border/40"></span>
                        <h3 className="text-xl uppercase tracking-widest text-foreground/80 px-6">Laser Skin Care – Individual Areas</h3>
                        <span className="flex-grow border-t border-dashed border-border/40"></span>
                    </div>

                    <div className="grid md:grid-cols-2 gap-x-12 gap-y-6">
                        {laserSkinRejuvenationServices.map((service) => {
                            const image = PlaceHolderImages.find((img) => img.id === service.imageId);
                            return (
                                <div key={service.name} className="bg-white border-stone-200/0 rounded-lg p-6 flex justify-between items-start shadow-sm gap-4 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                                    <div className="space-y-2 flex-grow">
                                        <h4 className="text-xl font-semibold uppercase tracking-wider text-primary pt-2">{service.name}</h4>
                                        <div className="text-muted-foreground text-lg flex items-center gap-2 flex-wrap pt-2">
                                            <button
                                                onClick={() => handleAuthAction(() => router.push(`/book?name=${encodeURIComponent(service.name)}&price=${encodeURIComponent(service.price)}&duration=${encodeURIComponent(service.duration || '')}&treatment=laser-skin-care`))}
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
            </div>

            <section className="py-20 bg-stone-50 overflow-hidden">
                <div className="container mx-auto text-center">
                    <p className="text-muted-foreground uppercase tracking-widest">Experience the full benefits of</p>
                    <h2 className="text-3xl md:text-4xl text-primary font-serif font-light mt-2 mb-12">Laser Skin Care</h2>
                </div>
                <div className="space-y-4">
                    <div className="relative flex overflow-hidden group">
                        <div className="flex gap-4 animate-scroll whitespace-nowrap">
                            {[...Array(4)].map((_, setIndex) => (
                                <div key={setIndex} className="flex gap-4">
                                    {benefits.map((benefit, i) => (
                                        <div key={i} className={`flex items-center gap-3 px-6 py-3 rounded-full ${i % 2 === 0 ? 'bg-primary text-primary-foreground' : 'bg-stone-200 text-foreground'}`}>
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
                                        <div key={i} className={`flex items-center gap-3 px-6 py-3 rounded-full ${i % 2 !== 0 ? 'bg-primary text-primary-foreground' : 'bg-stone-200 text-foreground'}`}>
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
                        <h2 className="text-4xl font-light uppercase tracking-wide font-serif text-foreground">Client Results</h2>
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
                    <h2 className="text-4xl font-light uppercase tracking-wide font-serif text-foreground text-center mb-12">Treatment Guide</h2>
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <TabsList className="grid w-full grid-cols-3 bg-stone-200/50 rounded-full p-1 h-auto text-foreground">
                            <TabsTrigger value="information" className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground py-2.5 text-base">Information</TabsTrigger>
                            <TabsTrigger value="pre-treatment" className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground py-2.5 text-base">Pre-Treatment Care</TabsTrigger>
                            <TabsTrigger value="post-treatment" className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground py-2.5 text-base">Post-Treatment Care</TabsTrigger>
                        </TabsList>
                        <TabsContent value="information">
                            <div className="bg-white p-6 rounded-lg mt-6 border border-stone-200/50 space-y-4">
                                <h3 className="font-semibold text-lg text-center">Skin Tightening</h3>
                                <p className="text-muted-foreground leading-relaxed text-center">Stimulates collagen to enhance skin firmness and smooth fine lines. Safe for all skin types with minimal downtime.</p>
                                <h3 className="font-semibold text-lg text-center pt-4 border-t">Benign Pigmented Lesions</h3>
                                <p className="text-muted-foreground leading-relaxed text-center">Targets excess melanin to reduce sun spots, age spots, and uneven pigmentation. Recommended for Fitzpatrick skin types I–III to ensure safety and effectiveness. Multiple treatments may be needed for best results. Not suitable for darker skin tones.</p>
                            </div>
                        </TabsContent>
                        <TabsContent value="pre-treatment">
                            <div className="bg-white p-6 rounded-lg mt-6 border border-stone-200/50">
                                <ul className="list-disc list-inside text-muted-foreground space-y-2 text-left prose">
                                    <li>Avoid sun exposure and tanning for at least 2 weeks before treatment.</li>
                                    <li>Discontinue use of retinoids, AHAs, BHAs, and other exfoliants 3-5 days prior.</li>
                                    <li>Arrive with clean skin, free of makeup, lotions, or creams.</li>
                                    <li>Inform your technician of any medications or skin sensitivities.</li>
                                </ul>
                            </div>
                        </TabsContent>
                        <TabsContent value="post-treatment">
                            <div className="bg-white p-6 rounded-lg mt-6 border border-stone-200/50">
                                <ul className="list-disc list-inside text-muted-foreground space-y-2 text-left prose">
                                    <li>Apply a broad-spectrum SPF 30+ daily and avoid direct sun exposure.</li>
                                    <li>Use a gentle cleanser and moisturizer. Avoid harsh products for at least one week.</li>
                                    <li>Avoid hot baths, saunas, and strenuous exercise for 24-48 hours.</li>
                                    <li>Do not pick or scratch the treated area.</li>
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
                                <AccordionTrigger className="text-lg text-foreground font-medium py-6 hover:no-underline text-left">
                                    <div className="flex items-center">
                                        <span>{faq.question}</span>
                                    </div>
                                    <div className="w-8 h-8 rounded-full bg-stone-200 flex items-center justify-center shrink-0">
                                        <Plus className="h-4 w-4 text-muted-foreground transition-transform duration-200 group-data-[state=open]:hidden" />
                                        <Minus className="h-4 w-4 text-muted-foreground transition-transform duration-200 group-data-[state=closed]:hidden" />
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="pt-0 pb-6 text-muted-foreground text-base text-left">
                                    {faq.answer}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>
            </div>

            {/* InstagramFeed removed */}

            <div className="container px-4 py-12 text-center">
                <Link href="/treatments" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors uppercase tracking-wider">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to all Treatments
                </Link>
            </div>
            {AuthGuardComponent}
        </div>
    );
}
