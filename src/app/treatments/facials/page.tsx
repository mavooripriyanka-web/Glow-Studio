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
import { useState, useEffect, Suspense } from 'react';
import { useAuthGuard } from "@/hooks/use-auth-guard";

export default function FacialsPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <FacialsPageContent />
        </Suspense>
    );
}

function FacialsPageContent() {
    const { facialTreatments, hydraFacialPerks, hydraFacialTreatments } = useAllServices();
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

    const treatments = facialTreatments;

    const benefits = [
        { text: "Improves skin tone, texture, and radiance" },
        { text: "Minimizes the appearance of pores" },
        { text: "Helps treat acne and breakouts" },
    ];
    const benefitsBottom = [
        { text: "Delays signs of aging by boosting collagen production" },
        { text: "Relaxes facial muscles and provides a calming effect" },
    ];

    const clientResultImage = PlaceHolderImages.find(img => img.id === "facial-before-after");

    const faqs = [
        {
            question: "What is a Facial?",
            answer: "A Facial is a skincare treatment that cleanses, exfoliates, and nourishes the skin to promote a clear, hydrated, and healthy complexion."
        },
        {
            question: "How often should I get a facial?",
            answer: "For optimal results, we recommend getting a facial every 4-6 weeks. This allows your skin to complete its natural regeneration cycle, making the treatment more effective."
        },
        {
            question: "Can facials help with acne?",
            answer: "Yes, facials, especially our Deep Clean Facial with LED therapy, can be very effective for treating acne. They help to unclog pores, reduce inflammation, and kill acne-causing bacteria."
        },
        {
            question: "Is there any downtime?",
            answer: "Most of our facials have no downtime, and you can resume your daily activities immediately. Your esthetician will advise if any specific aftercare is needed."
        }
    ];

    const ServiceCardGrid = ({ services, treatmentType }: { services: Array<any>, treatmentType: string }) => (
        <div className="grid md:grid-cols-2 gap-x-12 gap-y-6">
            {services.map((service) => {
                const image = PlaceHolderImages.find((img) => img.id === service.imageId);
                return (
                    <div key={service.name} className="bg-white border-stone-200/0 rounded-lg p-6 flex justify-between items-start shadow-sm gap-4 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                        <div className="space-y-2 flex-grow">
                            <h4 className="text-xl font-semibold uppercase tracking-wider text-primary pt-2">{service.name}</h4>
                            <p className="text-muted-foreground text-sm">{service.description}</p>
                            <div className="text-muted-foreground text-lg flex items-center gap-2 flex-wrap pt-2">
                                <button
                                    onClick={() => handleAuthAction(() => router.push(`/book?name=${encodeURIComponent(service.name)}&price=${encodeURIComponent(service.price)}&duration=${encodeURIComponent(service.duration || '')}&treatment=${treatmentType}`))}
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
                    src="/face.jpg"
                    alt="Facials"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/30" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white px-4 max-w-4xl">
                        <h1 className="text-3xl md:text-5xl font-light uppercase tracking-widest font-serif mt-2">
                            Facials
                        </h1>
                        <p className="text-lg md:text-xl font-light mt-4">Smooth, radiant skin begins with our tailored facial treatments today.</p>
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
                    <span className="text-stone-900">Facials</span>
                </div>
            </div>

            {/* Main Content */}
            <div className="container px-4 py-16">
                <div className="max-w-4xl mx-auto">
                    <div className="prose lg:prose-xl max-w-none text-stone-600 text-center">
                        <h2 className="text-4xl font-light uppercase tracking-wide font-serif text-stone-900">Facials</h2>
                        <p className="mt-4 text-lg leading-relaxed">
                            Facials are professional skincare treatments that cleanse, exfoliate, and nourish the skin to enhance its health and appearance. They often include steam, masks, gentle massage, and hydration. Facials promote relaxation and help address concerns like acne, dryness, and overall skin rejuvenation.
                        </p>
                    </div>
                </div>
            </div>

            {/* Pricing Sections */}
            <div className="bg-background py-16">
                <div className="container px-4 max-w-4xl mx-auto space-y-12">
                    <ServiceCardGrid services={treatments} treatmentType="facials" />
                </div>
            </div>

            <div className="py-16">
                <div className="container px-4 max-w-4xl mx-auto space-y-12">
                    <div className="text-center">
                        <h2 className="text-4xl font-light uppercase tracking-wide font-serif text-stone-900">HydraFacial®</h2>
                    </div>
                    <ServiceCardGrid services={hydraFacialTreatments} treatmentType="facials" />
                    <div className="grid md:grid-cols-2 gap-12">
                        {hydraFacialPerks.map((service) => {
                            const image = PlaceHolderImages.find((img) => img.id === service.imageId);
                            return (
                                <div key={service.name} className="bg-white border-stone-200/0 rounded-lg p-6 flex justify-between items-start shadow-sm gap-4 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                                    <div className="space-y-2 flex-grow">
                                        <h4 className="text-xl font-semibold uppercase tracking-wider text-primary pt-2">{service.name}</h4>
                                        <p className="text-muted-foreground text-sm">{(service as any).description}</p>
                                        <div className="text-muted-foreground text-lg flex items-center gap-2 flex-wrap pt-2">
                                            <button
                                                onClick={() => handleAuthAction(() => router.push(`/book?name=${encodeURIComponent(service.name)}&price=${encodeURIComponent(service.price)}&duration=${encodeURIComponent(service.duration || '')}&treatment=facials`))}
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
                    <div className="text-center bg-stone-100 p-6 rounded-lg">
                        <h4 className="font-semibold text-lg text-stone-800">Additional Treatments</h4>
                        <p className="text-stone-600 mt-2 max-w-2xl mx-auto">Please note: Customized HydraFacial® treatments are available for various body areas, personalized to suit your unique skin needs. We also offer the Keravive Scalp Treatment using HydraFacial® technology. For more information or to book your appointment, please call us.</p>
                    </div>
                </div>
            </div>


            {/* Benefits Section */}
            <section className="py-20 bg-stone-50 overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-br from-stone-50 via-rose-50 to-purple-50 z-0"></div>
                <div className="absolute inset-0 bg-[url('/bgGradient.png')] bg-cover opacity-30 mix-blend-soft-light z-0"></div>
                <div className="container mx-auto text-center relative z-10">
                    <p className="text-stone-600 uppercase tracking-widest">Experience the full benefits of</p>
                    <h2 className="text-3xl md:text-4xl text-primary font-serif font-light mt-2 mb-12">Facials</h2>
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
                                <p className="text-stone-600 leading-relaxed text-center">Customized to address individual skin concerns, these treatments can hydrate, cleanse, and rejuvenate the skin, promoting a clearer, more radiant complexion.</p>
                            </div>
                        </TabsContent>
                        <TabsContent value="pre-treatment">
                            <div className="bg-white p-6 rounded-lg mt-6 border border-stone-200/50">
                                <ul className="list-disc list-inside text-stone-600 space-y-2 text-left prose">
                                    <li>Avoid using exfoliating products or retinoids for a few days before your facial.</li>
                                    <li>Come to your appointment with clean, makeup-free skin if possible.</li>
                                    <li>Inform your esthetician about any skin sensitivities or allergies.</li>
                                </ul>
                            </div>
                        </TabsContent>
                        <TabsContent value="post-treatment">
                            <div className="bg-white p-6 rounded-lg mt-6 border border-stone-200/50">
                                <ul className="list-disc list-inside text-stone-600 space-y-2 text-left prose">
                                    <li>Avoid direct sun exposure and wear SPF to protect your newly treated skin.</li>
                                    <li>Refrain from using harsh skincare products or exfoliants for a day or two.</li>
                                    <li>Stay hydrated and allow your skin to fully absorb the benefits of the treatment.</li>
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
