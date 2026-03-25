'use client';
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Minus, Plus, Heart } from "lucide-react";
import LeadsForm from "@/components/sections/leads-form";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import InstagramFeed from "@/components/sections/instagram-feed";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import Image from "next/image";
import { useAllServices } from "@/lib/all-services";
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuthGuard } from "@/hooks/use-auth-guard";
import { useState, useEffect, Suspense } from "react";

export default function LipBlushPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <LipBlushPageContent />
        </Suspense>
    );
}

function LipBlushPageContent() {
    const { lipBlushServices } = useAllServices();
    const router = useRouter();
    const { handleAuthAction, AuthGuardComponent } = useAuthGuard();
    const searchParams = useSearchParams();
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
        { text: "Waterproof finish" },
        { text: "Boosts confidence with naturally beautiful lips" },
        { text: "Enhances natural lip color" },
        { text: "Long-lasting results" },
        { text: "Ideal for people with allergies to conventional lipsticks" },
    ];

    const clientResultImage = PlaceHolderImages.find(img => img.id === "lip-blush-before-after");

    const faqs = [
        {
            question: "Is Lip Blush a tattoo?",
            answer: "Yes, it’s a form of cosmetic tattooing, but it uses specialized pigments and techniques to create a soft, natural result—not the harsh look of traditional tattoos."
        },
        {
            question: "How long does Lip Blush last?",
            answer: "Results typically last between 1-3 years, depending on your skin type, lifestyle, and aftercare. We recommend an annual color refresh to maintain the vibrancy."
        },
        {
            question: "Is the procedure painful?",
            answer: "We apply a topical numbing cream to minimize discomfort. Most clients report feeling little to no pain, describing the sensation as light scratching or vibrations."
        },
        {
            question: "What is the healing process like?",
            answer: "The healing process takes about 7-10 days. Initially, the color will appear brighter and more intense. You can expect some swelling and peeling. We provide detailed aftercare instructions to ensure the best results."
        }
    ];

    const ServiceCardGrid = ({ services }: { services: Array<any> }) => (
        <div className="grid md:grid-cols-2 gap-x-12 gap-y-6">
            {services.map((service) => {
                const image = PlaceHolderImages.find((img) => img.id === service.imageId);
                return (
                    <div key={service.name} className="bg-white border-stone-100 rounded-lg p-4 flex justify-between items-start gap-4 transition-all duration-300 hover:bg-stone-50 border">
                        <div className="space-y-1 flex-grow">
                            <h4 className="text-base font-semibold uppercase tracking-wider text-primary">{service.name}</h4>
                            {service.description && <p className="text-muted-foreground text-xs">{service.description}</p>}
                            <div className="text-muted-foreground text-sm flex items-center gap-2 flex-wrap mt-4">
                                <button
                                    onClick={() => handleAuthAction(() => router.push(`/book?name=${encodeURIComponent(service.name)}&price=${encodeURIComponent(service.price)}&duration=${encodeURIComponent(service.duration || '')}&treatment=lip-blush`))}
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
    );

    return (
        <div className="bg-white min-h-screen">
            {/* Hero Section */}
            <div className="relative h-[60vh] bg-stone-100">
                <img
                    src="/lip.jpg"
                    alt="Lip Blush"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/30" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white px-4 max-w-4xl">
                        <h1 className="text-3xl md:text-5xl font-light uppercase tracking-widest font-serif mt-2">
                            Lip Blush
                        </h1>
                        <p className="text-lg md:text-xl font-light mt-4">Enhances lip color naturally, defines shape, and adds fullness.</p>
                    </div>
                </div>
            </div>

            {/* Breadcrumb */}
            <div className="bg-stone-50">
                <div className="container mx-auto px-4 py-3 text-sm text-muted-foreground">
                    <Link href="/" className="hover:text-stone-900">Home</Link>
                    <span className="mx-2">/</span>
                    <Link href="/treatments" className="hover:text-stone-900">Our Treatments</Link>
                    <span className="mx-2">/</span>
                    <span className="text-stone-900">Lip Blush</span>
                </div>
            </div>

            {/* Main Content */}
            <div className="container px-4 py-16">
                <div className="max-w-4xl mx-auto">
                    <div className="prose lg:prose-xl max-w-none text-stone-600 text-center">
                        <h2 className="text-4xl font-light uppercase tracking-wide font-serif text-stone-900">Lip Blush</h2>
                        <p className="mt-4 text-lg leading-relaxed">
                            A semi-permanent cosmetic tattoo that enhances the natural color and shape of your lips. It adds subtle tint and definition, creating a fuller, more even, and youthful appearance. This treatment improves lip tone and can correct asymmetry while maintaining a natural look.
                        </p>
                    </div>
                </div>
            </div>

            {/* Pricing Sections */}
            <div className="bg-background py-16">
                <div className="container px-4 max-w-3xl mx-auto space-y-12">
                    <ServiceCardGrid services={lipBlushServices} />
                </div>
            </div>

            {/* Benefits Section */}
            <section className="py-20 bg-stone-50 overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-br from-stone-50 via-rose-50 to-purple-50 z-0"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-stone-50 via-rose-50 to-purple-50 z-0"></div>
                <div className="absolute inset-0 bg-[url('/bgGradient.png')] bg-cover opacity-30 mix-blend-soft-light z-0"></div>
                <div className="container mx-auto text-center relative z-10">
                    <p className="text-stone-600 uppercase tracking-widest">Experience the full benefits of</p>
                    <h2 className="text-3xl md:text-4xl text-primary font-serif font-light mt-2 mb-12">Lip Blush</h2>
                </div>
                <div className="space-y-4">
                    <div className="relative flex overflow-hidden group">
                        <div className="flex gap-4 animate-scroll whitespace-nowrap">
                            {[...Array(4)].map((_, setIndex) => (
                                <div key={setIndex} className="flex gap-4">
                                    {benefits.slice(0, 3).map((benefit, i) => (
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
                                    {benefits.slice(3).map((benefit, i) => (
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

            {/* Client Results */}
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

            {/* Treatment Guide */}
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
                                <p className="text-stone-600 leading-relaxed text-center">A semi-permanent makeup technique that enhances the natural color and shape of your lips, giving them a fuller, more defined look. It helps to correct uneven pigmentation and create a soft, natural lip tint.</p>
                            </div>
                        </TabsContent>
                        <TabsContent value="pre-treatment">
                            <div className="bg-white p-6 rounded-lg mt-6 border border-stone-200/50">
                                <ul className="list-disc list-inside text-stone-600 space-y-2 text-left prose">
                                    <li>Avoid blood-thinning medications (aspirin, ibuprofen, fish oil) for 48 hours before treatment unless prescribed.</li>
                                    <li>Avoid alcohol and caffeine 24 hours before to reduce swelling.</li>
                                    <li>Do not exfoliate or use lip balms with active ingredients 3 days before the procedure.</li>
                                    <li>Inform your provider about any allergies, medical conditions, or cold sore history.</li>
                                    <li>Arrive with clean, makeup-free lips.</li>
                                </ul>
                            </div>
                        </TabsContent>
                        <TabsContent value="post-treatment">
                            <div className="bg-white p-6 rounded-lg mt-6 border border-stone-200/50">
                                <ul className="list-disc list-inside text-stone-600 space-y-2 text-left prose">
                                    <li>Keep lips moisturized with a recommended healing balm.</li>
                                    <li>Avoid picking or peeling the treated area.</li>
                                    <li>Avoid direct sun exposure and use SPF on lips once healed.</li>
                                    <li>Avoid hot, spicy foods and excessive lip movement for a few days.</li>
                                    <li>Expect slight swelling and color intensity that will fade during healing.</li>
                                    <li>Avoid swimming, saunas, and heavy exercise for 5–7 days.</li>
                                </ul>
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>

            {/* FAQs */}
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
