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
import { PlaceHolderImages } from "@/lib/placeholder-images";
import Image from "next/image";
import { useAllServices } from "@/lib/all-services";
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuthGuard } from "@/hooks/use-auth-guard";
import { useState, useEffect, Suspense } from "react";

export default function BodySculptingPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <BodySculptingPageContent />
        </Suspense>
    );
}

function BodySculptingPageContent() {
    const { cavitationServices, emsServices, laserLypolysisServices, radioFrequencyServices, saunaBlanketServices, vacuumTherapyServices } = useAllServices();
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
        { text: "Boosts confidence by enhancing body shape" },
        { text: "Breaks down stubborn fat cells" },
        { text: "Improves blood circulation" },
    ];
    const benefitsBottom = [
        { text: "Promotes skin tightening through collagen stimulation" },
        { text: "Painless and requires no downtime" },
    ];

    const faqs = [
        {
            question: "Is Body Sculpting safe?",
            answer: "Yes, it’s FDA-approved and safe when performed by trained professionals. It’s non-surgical, painless, and requires no downtime."
        },
        {
            question: "How many sessions are needed?",
            answer: "The number of sessions depends on your individual goals and the area being treated. Most clients see results within 6-12 sessions, but we'll create a personalized plan for you."
        },
        {
            question: "What does it feel like?",
            answer: "Most treatments are painless and comfortable. You may feel a warm sensation during Radio Frequency or gentle suction with Vacuum Therapy. EMS feels like an intensive workout."
        },
        {
            question: "How long do results last?",
            answer: "Results can be long-lasting with a healthy diet and regular exercise. The fat cells that are eliminated do not return. Maintenance sessions are recommended to maintain skin tightness and muscle tone."
        }
    ];

    const ServiceCardGrid = ({ title, description, services }: { title: string, description: string, services: Array<any> }) => (
        <div>
            <div className="flex items-center justify-center text-center mb-8">
                <span className="flex-grow border-t border-dashed border-border/40"></span>
                <h4 className="text-xl uppercase tracking-widest text-foreground/80 px-6">{title}</h4>
                <span className="flex-grow border-t border-dashed border-border/40"></span>
            </div>
            <p className="text-center text-stone-500 mb-6 -mt-4 max-w-2xl mx-auto">{description}</p>
            <div className="grid md:grid-cols-2 gap-x-12 gap-y-6">
                {services.map((service) => {
                    const image = PlaceHolderImages.find((img) => img.id === service.imageId);
                    return (
                        <div key={service.name} className="bg-white border-stone-100 rounded-lg p-4 flex justify-between items-start gap-4 transition-all duration-300 hover:bg-stone-50 border">
                            <div className="space-y-1 flex-grow">
                                <h4 className="text-base font-semibold uppercase tracking-wider text-primary">{service.name}</h4>
                                <div className="text-muted-foreground text-sm flex items-center gap-2 flex-wrap">
                                    <button
                                        onClick={() => handleAuthAction(() => router.push(`/book?name=${encodeURIComponent(service.name)}&price=${encodeURIComponent(service.price)}&duration=${encodeURIComponent(service.duration || '')}&treatment=body-sculpting`))}
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
            {/* Hero Section */}
            <div className="relative h-[60vh] bg-stone-100">
                <img
                    src="/body scultpting.jpg"
                    alt="Body Sculpting"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/30" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white px-4 max-w-4xl">
                        <h1 className="text-5xl font-bold font-headline text-white mt-2">
                            Body Sculpting
                        </h1>
                        <p className="text-lg md:text-xl font-light mt-4">Sculpt your dream body with precision, strength, and lasting confidence.</p>
                    </div>
                </div>
            </div>

            {/* Breadcrumb */}
            <div className="bg-stone-50">
                <div className="container mx-auto px-4 py-3 text-sm text-stone-500">
                    <Link href="/" className="hover:text-stone-900">Home</Link>
                    <span className="mx-2">/</span>
                    <Link href="/treatments" className="hover:text-stone-900">Our Treatments</Link>
                    <span className="mx-2">/</span>
                    <span className="text-stone-900">Body Sculpting</span>
                </div>
            </div>

            {/* Main Content */}
            <div className="container px-4 py-16">
                <div className="max-w-4xl mx-auto">
                    <div className="prose lg:prose-xl max-w-none text-stone-600 text-center">
                        <h2 className="text-4xl font-bold font-headline text-primary">Body Sculpting</h2>
                        <p className="mt-4 text-lg leading-relaxed">
                            Inquire now for Combo Package price.
                        </p>
                    </div>
                </div>
            </div>

            {/* Pricing Sections */}
            <div className="bg-background py-16">
                <div className="container px-4 max-w-4xl mx-auto space-y-16">
                    <ServiceCardGrid title="Cavitation" description="A non-invasive ultrasound treatment that targets and breaks down stubborn fat cells, effectively reducing localized fat deposits while improving skin texture and firmness." services={cavitationServices} />
                    <ServiceCardGrid title="Radio Frequency" description="A skin-tightening procedure that uses controlled heat energy to stimulate collagen production, helping to diminish wrinkles, lift sagging skin, and reduce the appearance of cellulite." services={radioFrequencyServices} />
                    <ServiceCardGrid title="Vacuum Therapy" description="A suction-based treatment that enhances blood circulation and lymphatic drainage, promoting smoother skin, reducing cellulite, and aiding in body contouring." services={vacuumTherapyServices} />
                    <ServiceCardGrid title="Laser Lipolysis" description="A non-surgical, low-level laser therapy that targets fat cells to accelerate fat breakdown and body contouring, offering effective results with no downtime." services={laserLypolysisServices} />
                    <ServiceCardGrid title="Electrical Muscle Stimulation" description="Utilizes electrical impulses to trigger muscle contractions, improving muscle tone, strength, and definition for a firmer, sculpted appearance." services={emsServices} />
                    <ServiceCardGrid title="Sauna Blanket" description="A heated therapy blanket designed to promote detoxification, boost circulation, and support weight loss through induced sweating and deep relaxation." services={saunaBlanketServices} />
                </div>
            </div>

            {/* Benefits Section */}
            <section className="py-20 bg-stone-50 overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-br from-stone-50 via-rose-50 to-purple-50 z-0"></div>
                <div className="absolute inset-0 bg-[url('/bgGradient.png')] bg-cover opacity-30 mix-blend-soft-light z-0"></div>
                <div className="container mx-auto text-center relative z-10">
                    <p className="text-stone-600 uppercase tracking-widest">Experience the full benefits of</p>
                    <h2 className="text-4xl font-bold font-headline text-primary mt-2 mb-12">Body Sculpting</h2>
                </div>
                <div className="space-y-4">
                    <div className="relative flex overflow-hidden group">
                        <div className="flex gap-4 animate-scroll whitespace-nowrap">
                            {[...Array(4)].map((_, setIndex) => (
                                <div key={setIndex} className="flex gap-4">
                                    {benefits.map((benefit, i) => (
                                        <div key={i} className={`flex items-center gap-3 px-6 py-3 rounded-full ${i % 2 === 0 ? 'bg-primary text-primary-foreground' : 'bg-stone-200 text-stone-800'}`}>
                                            <span className="text-lg font-medium">{benefit.text}</span>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="relative flex overflow-hidden group">
                        <div className="flex gap-4 animate-scroll whitespace-nowrap" style={{ animationDirection: 'reverse' }}>
                            {[...Array(4)].map((_, setIndex) => (
                                <div key={setIndex} className="flex gap-4">
                                    {benefitsBottom.map((benefit, i) => (
                                        <div key={i} className={`flex items-center gap-3 px-6 py-3 rounded-full ${i % 2 !== 0 ? 'bg-primary text-primary-foreground' : 'bg-stone-200 text-stone-800'}`}>
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
            {/* Booking Form */}
            <LeadsForm />

            {/* Treatment Guide */}
            <div className="py-20 bg-stone-50/50" id="treatment-guide">
                <div className="container mx-auto px-4 max-w-4xl">
                    <h2 className="text-4xl font-bold font-headline text-primary text-center mb-12">Treatment Guide</h2>
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <TabsList className="grid w-full grid-cols-3 bg-stone-200/50 rounded-full p-1 h-auto text-stone-900">
                            <TabsTrigger value="information" className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground py-2.5 text-base">Information</TabsTrigger>
                            <TabsTrigger value="pre-treatment" className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground py-2.5 text-base">Pre-Treatment Care</TabsTrigger>
                            <TabsTrigger value="post-treatment" className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground py-2.5 text-base">Post-Treatment Care</TabsTrigger>
                        </TabsList>
                        <TabsContent value="information">
                            <div className="bg-white p-6 rounded-lg mt-6 border border-stone-200/50">
                                <p className="text-stone-600 leading-relaxed text-center">A non-invasive body contouring treatment that uses ultrasound waves to break down fat cells, helping to reduce localized fat and improve skin texture.</p>
                            </div>
                        </TabsContent>
                        <TabsContent value="pre-treatment">
                            <div className="bg-white p-6 rounded-lg mt-6 border border-stone-200/50">
                                <ul className="list-disc list-inside text-stone-600 space-y-2 text-left prose">
                                    <li>Stay hydrated by drinking plenty of water before your session.</li>
                                    <li>Avoid heavy meals, caffeine, and alcohol for at least 2 hours before treatment.</li>
                                    <li>Wear comfortable, loose-fitting clothing to your appointment.</li>
                                </ul>
                            </div>
                        </TabsContent>
                        <TabsContent value="post-treatment">
                            <div className="bg-white p-6 rounded-lg mt-6 border border-stone-200/50">
                                <ul className="list-disc list-inside text-stone-600 space-y-2 text-left prose">
                                    <li>Drink at least 2 liters of water daily for the next 3 days to help flush out toxins.</li>
                                    <li>Engage in light physical activity, like walking, to support lymphatic drainage.</li>
                                    <li>Maintain a balanced diet and avoid processed foods, sugar, and alcohol.</li>
                                    <li>Follow any specific aftercare instructions provided by your technician.</li>
                                </ul>
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>

            {/* FAQs */}
            <div className="pb-20 pt-10 bg-background">
                <div className="container mx-auto px-4 max-w-2xl">
                    <h2 className="text-4xl font-bold font-headline text-primary text-center mb-12">
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

            {/* Instagram Feed */}
            {/* InstagramFeed removed */}

            {/* Back Link */}
            <div className="container px-4 py-12 text-center">
                <Link href="/treatments" className="inline-flex items-center text-sm text-stone-500 hover:text-stone-900 transition-colors uppercase tracking-wider">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to all Treatments
                </Link>
            </div>
            {AuthGuardComponent}
        </div>
    );
}
