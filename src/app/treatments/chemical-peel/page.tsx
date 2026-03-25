'use client';
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Minus, Plus } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import LeadsForm from "@/components/sections/leads-form";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import Image from "next/image";
import { useAllServices } from "@/lib/all-services";
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthGuard } from "@/hooks/use-auth-guard";
import { Suspense, useEffect, useState } from "react";
import { useLanguage } from "@/context/language-context";

export default function ChemicalPeelPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ChemicalPeelPageContent />
        </Suspense>
    );
}

function ChemicalPeelPageContent() {
    const { t } = useLanguage();
    const { biorepeelPackage, biorepeelTreatments, boosters, perfectDermaPeel } = useAllServices();
    const router = useRouter();
    const searchParams = useSearchParams();
    const { handleAuthAction, AuthGuardComponent } = useAuthGuard();
    const [activeTab, setActiveTab] = useState("information");

    useEffect(() => {
        const tab = searchParams.get('tab');
        if (tab) {
            setActiveTab(tab);
            // Wait for render cycle then scroll
            setTimeout(() => {
                const element = document.getElementById('treatment-guide');
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                }
            }, 100);
        }
    }, [searchParams]);

    const benefits = [
        { text: t('chemicalPeel.benefit1', "Reduces fine lines and wrinkles"), icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2c2.2 0 4 1.8 4 4v2" /><path d="M4 8V6c0-2.2 1.8-4 4-4" /><path d="M4 14v-2c0-1.1.9-2 2-2h12c1.1 0 2 .9 2 2v2" /><path d="M16 16.5c-1.5 0-2.8 1.1-3.3 2.5" /><path d="M8 16.5c1.5 0 2.8 1.1 3.3 2.5" /><path d="M12 21a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" /><path d="M12 5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" /></svg> },
        { text: t('chemicalPeel.benefit2', "Improves skin texture and tone"), icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2Z" /><path d="M7 13c.8-1.5 2.2-2.5 4-2.5s3.2 1 4 2.5" /><path d="m12 12-2 4" /><path d="m12 12 2 4" /></svg> },
        { text: t('chemicalPeel.benefit3', "Stimulates natural collagen"), icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" /><path d="m16.24 7.76.01-.01" /><path d="m10.27 3.9-.01.01" /><path d="m4.26 9.76.01.01" /><path d="m7.76 16.24.01-.01" /><path d="M4 12H2" /><path d="M12 4V2" /><path d="M20 12h2" /><path d="M12 20v2" /></svg> },
        { text: t('chemicalPeel.benefit4', "Minimizes acne scars and other types of scarring"), icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 13.5c-2.43 2.43-5.57 2.43-8 0" /><path d="m10.5 18-5-5" /><path d="m21.5 12-5-5" /><path d="M9 13.5c-2.43-2.43-2.43-5.57 0-8" /><path d="M13.5 18c2.43-2.43 5.57-2.43 8 0" /></svg> },
        { text: t('chemicalPeel.benefit5', "Can be customized for different skin types"), icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a10 10 0 1 0 10 10c0-1.84-.5-3.55-1.32-5" /><path d="M15.5 11.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" /><path d="M8.5 11.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" /><path d="M18 16h-8" /><path d="M17.5 10.5c-1.5-1.5-3.5-1.5-5 0" /></svg> },
    ];

    const benefitsTop = benefits.slice(0, 3);
    const benefitsBottom = benefits.slice(3);

    const clientResultImage = PlaceHolderImages.find(img => img.id === "chemical-peel-before-after");

    const faqs = [
        {
            question: t('chemicalPeel.faq1_q', "Are there different types of Peels?"),
            answer: t('chemicalPeel.faq1_a', "Chemical peels range from light (gentle exfoliation), to medium (for scars and pigmentation), to deep (for severe wrinkles and damage).")
        },
        {
            question: t('chemicalPeel.faq2_q', "Are there any risks or side effects?"),
            answer: t('chemicalPeel.faq2_a', "Redness, irritation, sensitivity, rashes, scarring, and pigmentation are risks associated with treatment.")
        },
        {
            question: t('chemicalPeel.faq3_q', "Who should avoid Chemical Peels?"),
            answer: t('chemicalPeel.faq3_a', "Chemical peels should be avoided by those with active skin infections, open wounds, or very sensitive skin. They're not recommended during pregnancy, for people with recent Accutane use, or those prone to keloids or poor healing. Always consult a professional before starting treatment.")
        },
        {
            question: t('chemicalPeel.faq4_q', "How often should I get a Chemical Peel?"),
            answer: t('chemicalPeel.faq4_a', "Light peels can be done every 4–6 weeks to maintain results, while medium peels are typically spaced 3–6 months apart. Deep peels are more intensive and usually done only once every few years. We will recommend the ideal schedule based on your skin’s needs.")
        },
        {
            question: t('chemicalPeel.faq5_q', "Are results permanent?"),
            answer: t('chemicalPeel.faq5_a', "Chemical peel results are not permanent, as your skin continues to age and is affected by sun exposure, lifestyle, and other factors. However, they can provide long-lasting improvements in skin texture, tone, and clarity. Maintenance treatments and good skincare habits help prolong the results.")
        }
    ];

    const ServiceCard = ({ service }: { service: any }) => {
        const image = PlaceHolderImages.find((img) => img.id === service.imageId);
        return (
            <div className="bg-white border-stone-200/0 rounded-lg p-6 flex justify-between items-start shadow-sm gap-4 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                <div className="space-y-2 flex-grow">
                    <h4 className="text-xl font-semibold uppercase tracking-wider text-primary pt-2">{service.name}</h4>
                    {service.subtitle && <p className="text-sm text-stone-500 -mt-2">{service.subtitle}</p>}
                    {service.description && <p className="text-muted-foreground text-sm">{service.description}</p>}
                    <div className="text-muted-foreground text-lg flex items-center gap-2 flex-wrap pt-2">
                        <button
                            onClick={() => handleAuthAction(() => router.push(`/book?name=${encodeURIComponent(service.name)}&price=${encodeURIComponent(service.price)}&duration=${encodeURIComponent(service.duration || '')}&treatment=chemical-peel`))}
                            className="hover:underline text-primary font-medium bg-transparent border-none p-0 cursor-pointer text-left"
                        >
                            Book now
                        </button>
                        <span className="text-muted-foreground/50">•</span>
                        <span>{service.price} {service.priceNote && <span className="text-sm">({service.priceNote})</span>}</span>
                        {service.duration && (
                            <>
                                <span className="text-muted-foreground/50">•</span>
                                <span>{service.duration}</span>
                            </>
                        )}
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
        );
    };

    return (
        <div className="bg-white min-h-screen">
            <div className="relative h-[60vh] bg-stone-100">
                <img
                    src="/peels.jpg"
                    alt="Chemical Peel"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/20" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white px-4">
                        <h1 className="text-3xl md:text-5xl font-light uppercase tracking-widest font-serif">
                            {t('chemicalPeel.heroTitle', 'Chemical Peel')}
                        </h1>
                        <p className="mt-4 text-lg md:text-xl font-light">
                            {t('chemicalPeel.heroSubtitle', 'Gently exfoliates, resurfaces skin, improves texture, tone, and clarity.')}
                        </p>
                    </div>
                </div>
            </div>
            <div className="bg-stone-50">
                <div className="container mx-auto px-4 py-3 text-sm text-stone-500">
                    <Link href="/" className="hover:text-stone-900">{t('nav.home', 'Home')}</Link>
                    <span className="mx-2">/</span>
                    <Link href="/treatments" className="hover:text-stone-900">{t('nav.treatments', 'Our Treatments')}</Link>
                    <span className="mx-2">/</span>
                    <span className="text-stone-900">{t('chemicalPeel.heroTitle', 'Chemical Peel')}</span>
                </div>
            </div>

            <div className="container px-4 py-16">
                <div className="max-w-4xl mx-auto">
                    <div className="prose lg:prose-xl max-w-none text-stone-600 text-center">
                        <h2 className="text-4xl font-light uppercase tracking-wide font-serif text-stone-900">{t('chemicalPeel.introTitle', 'Chemical Peel')}</h2>
                        <p className="mt-6 text-lg leading-relaxed max-w-3xl mx-auto">
                            {t('chemicalPeel.introDesc', 'This treatment gently exfoliates dead skin cells while stimulating collagen production to improve skin texture and tone. It helps reduce fine lines, pigmentation, acne scars, and unevenness, revealing a smoother, brighter complexion with lasting results.')}
                        </p>
                    </div>
                </div>
            </div>

            <div className="bg-background py-16">
                <div className="container px-4 max-w-4xl mx-auto space-y-16">
                    <div>
                        <div className="flex items-center justify-center text-center mb-8">
                            <span className="flex-grow border-t border-dashed border-border/40"></span>
                            <h3 className="text-xl uppercase tracking-widest text-foreground/80 px-6">{t('chemicalPeel.perfectDermaPeel', 'The Perfect Derma™ Peel')}</h3>
                            <span className="flex-grow border-t border-dashed border-border/40"></span>
                        </div>
                        <ServiceCard service={perfectDermaPeel} />
                    </div>

                    <div>
                        <div className="flex items-center justify-center text-center mb-8">
                            <span className="flex-grow border-t border-dashed border-border/40"></span>
                            <h3 className="text-xl uppercase tracking-widest text-foreground/80 px-6">{t('chemicalPeel.addonsBoosters', 'Add-ons - Peel Boosters')}</h3>
                            <span className="flex-grow border-t border-dashed border-border/40"></span>
                        </div>
                        <div className="grid md:grid-cols-2 gap-x-12 gap-y-6">
                            {boosters.map((booster, index) => (
                                <ServiceCard key={index} service={booster} />
                            ))}
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center justify-center text-center mb-8">
                            <span className="flex-grow border-t border-dashed border-border/40"></span>
                            <h3 className="text-xl uppercase tracking-widest text-foreground/80 px-6">{t('chemicalPeel.bioRePeel', 'BioRePeel')}</h3>
                            <span className="flex-grow border-t border-dashed border-border/40"></span>
                        </div>
                        <p className="mt-6 text-lg leading-relaxed max-w-3xl mx-auto text-center text-muted-foreground mb-8">
                            {t('chemicalPeel.bioRePeelDesc', "BioRePeel is an advanced, non-invasive chemical peel designed to support skin regeneration with minimal downtime. It effectively addresses acne, uneven tone, fine lines, and dull texture through gentle exfoliation, collagen stimulation, and cellular renewal, often with little to no peeling. Its unique bi-phase technology revitalizes and brightens skin, promoting a smoother, youthful complexion. Safe for all skin types, BioRePeel delivers visible improvements instantly and over time. Schedule your appointment today and rediscover your skin's natural radiance.")}
                        </p>
                        <div className="grid md:grid-cols-2 gap-x-12 gap-y-6">
                            {biorepeelTreatments.map((treatment, index) => (
                                <ServiceCard key={index} service={treatment} />
                            ))}
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center justify-center text-center mb-8">
                            <span className="flex-grow border-t border-dashed border-border/40"></span>
                            <h3 className="text-xl uppercase tracking-widest text-foreground/80 px-6">{t('chemicalPeel.bioRePeelPackages', 'BioRePeel Packages')}</h3>
                            <span className="flex-grow border-t border-dashed border-border/40"></span>
                        </div>
                        <ServiceCard service={biorepeelPackage} />
                    </div>

                </div>
            </div>

            <section className="py-20 bg-stone-50 overflow-x-hidden">
                <div className="container mx-auto px-4 text-center">
                    <p className="text-stone-600 uppercase tracking-widest">{t('treatmentsPage.experienceBenefits', 'Experience the full benefits of')}</p>
                    <h2 className="text-3xl md:text-4xl text-primary font-serif font-light mt-2 mb-12">{t('chemicalPeel.heroTitle', 'Chemical Peel')}</h2>
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
                        <h2 className="text-4xl font-light uppercase tracking-wide font-serif text-stone-900">{t('treatmentsPage.clientResults', 'Client Results')}</h2>
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
                                    <p className="text-sm font-medium text-stone-500">{t('treatmentsPage.actualPatientResults', 'Actual Patient Results')}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div id="treatment-guide" className="py-20 bg-stone-50/50">
                <div className="container mx-auto px-4 max-w-4xl">
                    <h2 className="text-4xl font-light uppercase tracking-wide font-serif text-stone-900 text-center mb-12">{t('treatmentsPage.treatmentGuide', 'Treatment Guide')}</h2>
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <TabsList className="grid w-full grid-cols-3 bg-stone-200/50 rounded-full p-1 h-auto text-stone-900">
                            <TabsTrigger value="information" className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground py-2.5 text-base">{t('treatmentsPage.information', 'Information')}</TabsTrigger>
                            <TabsTrigger value="pre-treatment" className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground py-2.5 text-base">{t('treatmentsPage.preTreatmentCare', 'Pre-Treatment Care')}</TabsTrigger>
                            <TabsTrigger value="post-treatment" className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground py-2.5 text-base">{t('treatmentsPage.postTreatmentCare', 'Post-Treatment Care')}</TabsTrigger>
                        </TabsList>
                        <TabsContent value="information">
                            <div className="bg-white p-6 rounded-lg mt-6 border border-stone-200/50">
                                <p className="text-stone-600 leading-relaxed text-center">{t('chemicalPeel.info', 'Utilizes chemical solutions to remove the top layers of the skin, helping to improve the texture and appearance of the skin by reducing fine lines, wrinkles, and dark spots, and treating acne.')}</p>
                            </div>
                        </TabsContent>
                        <TabsContent value="pre-treatment">
                            <div className="bg-white p-6 rounded-lg mt-6 border border-stone-200/50">
                                <ul className="list-disc list-inside text-stone-600 space-y-2 text-left prose">
                                    <li>{t('chemicalPeel.preCare1', 'Avoid sun exposure, tanning beds, and self-tanners for at least 2 weeks.')}</li>
                                    <li>{t('chemicalPeel.preCare2', 'Stop using retinoids, exfoliants (AHAs/BHAs), and strong skincare products 3-5 days before treatment.')}</li>
                                    <li>{t('chemicalPeel.preCare3', 'Inform your provider about any medications, medical conditions, or history of cold sores (antiviral may be required).')}</li>
                                    <li>{t('chemicalPeel.preCare4', 'Avoid waxing, plucking, or threading the treatment area for 4 weeks; shaving 24 hours before is allowed.')}</li>
                                    <li>{t('chemicalPeel.preCare5', 'Avoid blood-thinning medications (aspirin, ibuprofen, fish oil) 48 hours prior unless prescribed.')}</li>
                                    <li>{t('chemicalPeel.preCare6', 'Arrive with clean, makeup-free skin.')}</li>
                                </ul>
                            </div>
                        </TabsContent>
                        <TabsContent value="post-treatment">
                            <div className="bg-white p-6 rounded-lg mt-6 border border-stone-200/50">
                                <ul className="list-disc list-inside text-stone-600 space-y-2 text-left prose">
                                    <li>{t('chemicalPeel.postCare1', 'Avoid direct sun exposure and always use SPF 50+ to protect healing skin.')}</li>
                                    <li>{t('chemicalPeel.postCare2', 'Expect redness, peeling, and flaking; do not pick or peel the skin.')}</li>
                                    <li>{t('chemicalPeel.postCare3', 'Use gentle cleansers and moisturizers; avoid retinoids and exfoliants for at least 7 days.')}</li>
                                    <li>{t('chemicalPeel.postCare4', 'Avoid hot showers, saunas, and intense exercise for 48 hours.')}</li>
                                </ul>
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>

            <div className="pb-20 pt-10 bg-background">
                <div className="container mx-auto px-4 max-w-2xl">
                    <h2 className="text-4xl font-light uppercase tracking-wide font-serif text-primary text-center mb-12">
                        {t('treatmentsPage.faqs', 'FAQs')}
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
                <Link href="/treatments" className="inline-flex items-center text-sm text-stone-500 hover:text-stone-900 transition-colors uppercase tracking-wider">
                    <ArrowLeft className="w-4 h-4 mr-2" /> {t('treatmentsPage.backToTreatments', 'Back to all Treatments')}
                </Link>
            </div>
            {AuthGuardComponent}
        </div>
    );
}
