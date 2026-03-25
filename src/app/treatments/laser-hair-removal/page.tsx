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
import { useState, useEffect, Suspense } from 'react';
import { useAuthGuard } from "@/hooks/use-auth-guard";
import { useLanguage } from "@/context/language-context";

export default function LaserHairRemovalPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <LaserHairRemovalPageContent />
        </Suspense>
    );
}

function LaserHairRemovalPageContent() {
    const { t } = useLanguage();
    const { comboPackages, faceAndNeckServices, fullBodyPackages, fullBodySessionPackages, lowerBodyServices, menServices, upperBodyServices } = useAllServices();
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
        { text: t("laserHairRemoval.benefit1", "Long-term solution"), icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2c2.2 0 4 1.8 4 4v2" /><path d="M4 8V6c0-2.2 1.8-4 4-4" /><path d="M4 14v-2c0-1.1.9-2 2-2h12c1.1 0 2 .9 2 2v2" /><path d="M16 16.5c-1.5 0-2.8 1.1-3.3 2.5" /><path d="M8 16.5c1.5 0 2.8 1.1 3.3 2.5" /><path d="M12 21a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" /><path d="M12 5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" /></svg> },
        { text: t("laserHairRemoval.benefit2", "Time-saving"), icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" /><path d="M12 6v6l4 2" /></svg> },
        { text: t("laserHairRemoval.benefit3", "Minimizes skin irritation"), icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a10 10 0 1 0 10 10c0-1.84-.5-3.55-1.32-5" /><path d="M15.5 11.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" /><path d="M8.5 11.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" /><path d="M18 16h-8" /><path d="M17.5 10.5c-1.5-1.5-3.5-1.5-5 0" /></svg> },
    ];
    const benefitsBottom = [
        { text: t("laserHairRemoval.benefitBottom1", "Convenience and lasting results"), icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" /><path d="m9 12 2 2 4-4" /></svg> },
        { text: t("laserHairRemoval.benefitBottom2", "Leaves skin smooth and flawless"), icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2Z" /><path d="M7 13c.8-1.5 2.2-2.5 4-2.5s3.2 1 4 2.5" /><path d="m12 12-2 4" /><path d="m12 12 2 4" /></svg> },
        { text: t("laserHairRemoval.benefitBottom3", "Safe and effective"), icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="m9 12 2 2 4-4" /></svg> },
    ];

    const clientResultImage = PlaceHolderImages.find(img => img.id === "laser-hair-removal-before-after");

    const faqs = [
        {
            question: t("laserHairRemoval.faq1Q", "Is laser hair removal painful?"),
            answer: t("laserHairRemoval.faq1A", "Most clients describe the sensation as a quick snap, like a rubber band against the skin. Our GentleMax Pro® system features a built-in cooling device to enhance comfort during treatment.")
        },
        {
            question: t("laserHairRemoval.faq2Q", "How many sessions will I need?"),
            answer: t("laserHairRemoval.faq2A", "The number of sessions varies depending on hair type, skin tone, and the treatment area. Typically, 6-8 sessions spaced 4-6 weeks apart are needed for optimal results.")
        },
        {
            question: t("laserHairRemoval.faq3Q", "Is laser hair removal permanent?"),
            answer: t("laserHairRemoval.faq3A", "Laser hair removal offers permanent hair reduction. While it can significantly reduce hair growth, some clients may need occasional maintenance sessions to address any new hair growth.")
        },
        {
            question: t("laserHairRemoval.faq4Q", "Is it safe for all skin types?"),
            answer: t("laserHairRemoval.faq4A", "Yes, the Candela GentleMax Pro® is safe and effective for all skin types, including darker skin tones, thanks to its dual-wavelength technology.")
        },
        {
            question: t("laserHairRemoval.faq5Q", "What is the downtime after treatment?"),
            answer: t("laserHairRemoval.faq5A", "There is minimal to no downtime. You may experience slight redness or swelling in the treated area, which usually subsides within a few hours.")
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
                {services.map((service) => {
                    const image = PlaceHolderImages.find((img) => img.id === service.imageId);
                    return (
                        <div key={service.name} className="bg-white border-stone-200/0 rounded-lg p-6 flex justify-between items-start shadow-sm gap-4 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                            <div className="space-y-2 flex-grow">
                                <h4 className="text-xl font-semibold uppercase tracking-wider text-primary pt-2">{service.name}</h4>
                                <div className="text-muted-foreground text-lg flex items-center gap-2 flex-wrap pt-2">
                                    <button
                                        onClick={() => handleAuthAction(() => router.push(`/book?name=${encodeURIComponent(service.name)}&price=${encodeURIComponent(service.price)}&duration=${encodeURIComponent(service.duration || '')}&treatment=laser-hair-removal`))}
                                        className="hover:underline text-primary font-medium bg-transparent border-none p-0 cursor-pointer text-left"
                                    >
                                        {t("services.bookNow", "Book now")}
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
    );

    const ComboPackageGrid = ({ title, services }: { title: string, services: Array<any> }) => (
        <div>
            <div className="flex items-center justify-center text-center mb-8">
                <span className="flex-grow border-t border-dashed border-border/40"></span>
                <h4 className="text-xl uppercase tracking-widest text-foreground/80 px-6">{title}</h4>
                <span className="flex-grow border-t border-dashed border-border/40"></span>
            </div>
            <div className="grid md:grid-cols-2 gap-x-12 gap-y-6">
                {services.map((pkg) => {
                    const image = PlaceHolderImages.find((img) => img.id === pkg.imageId);
                    return (
                        <div key={pkg.name} className="bg-white border-stone-200/0 rounded-lg p-6 flex justify-between items-start shadow-sm gap-4 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                            <div className="space-y-2 flex-grow">
                                <h4 className="text-xl font-semibold uppercase tracking-wider text-primary pt-2">{pkg.name}</h4>
                                <div className="text-muted-foreground text-lg flex items-center gap-2 flex-wrap pt-2">
                                    <button
                                        onClick={() => handleAuthAction(() => router.push(`/book?name=${encodeURIComponent(pkg.name)}&price=${encodeURIComponent(pkg.price)}&duration=${encodeURIComponent(pkg.duration || '')}&treatment=laser-hair-removal`))}
                                        className="hover:underline text-primary font-medium bg-transparent border-none p-0 cursor-pointer text-left"
                                    >
                                        {t("services.bookNow", "Book now")}
                                    </button>
                                    <span className="text-muted-foreground/50">•</span>
                                    <span>{pkg.price}</span>
                                    {pkg.duration && <>
                                        <span className="text-muted-foreground/50">•</span>
                                        <span>{pkg.duration}</span>
                                    </>}
                                </div>
                            </div>
                            {image && (
                                <Image
                                    src={image.imageUrl}
                                    alt={pkg.name}
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
                    src="/laser hair.jpg"
                    alt="Laser Hair Removal"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/20" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white px-4 max-w-4xl">
                        <p className="text-lg md:text-xl font-light">Precision treatments for every skin story.</p>
                        <h1 className="text-3xl md:text-5xl font-light uppercase tracking-widest font-serif mt-2">
                            Laser Hair Removal
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
                    <span className="text-foreground">Laser Hair Removal</span>
                </div>
            </div>

            <div className="container px-4 py-16">
                <div className="max-w-4xl mx-auto">
                    <div className="prose lg:prose-xl max-w-none text-muted-foreground">
                        <h2 className="text-4xl font-light uppercase tracking-wide font-serif text-foreground text-center">Laser Hair Removal with Candela GentleMax Pro®</h2>
                        <p className="mt-6 text-lg leading-relaxed text-justify">
                            Experience smooth, hair-free skin with advanced laser technology that’s safe and effective for all skin tones, including brown and darker skin. The GentleMax Pro® targets hair at the root using dual wavelengths, 755 nm Alexandrite and 1064 nm Nd: YAG, delivering long-term results with minimal discomfort. Ideal for treating areas like the face, underarms, arms, legs, chest, back, bikini line, and more for both men and women. With built-in cooling for comfort and minimal downtime, it’s the gold standard in medical-grade hair removal.
                        </p>
                    </div>
                </div>
            </div>

            <div className="bg-background py-16">
                <div className="container px-4 max-w-4xl mx-auto">
                    <h3 className="text-3xl font-light uppercase tracking-wide font-serif text-foreground text-center mb-12">Individual Areas</h3>
                    <div className="space-y-16">
                        <ServiceCardGrid title="Face & Neck" services={faceAndNeckServices} />
                        <ServiceCardGrid title="Upper Body" services={upperBodyServices} />
                        <ServiceCardGrid title="Lower Body" services={lowerBodyServices} />
                        <ServiceCardGrid title="Laser Areas For Men" services={menServices} />
                    </div>
                </div>
            </div>

            <div className="py-16 relative">
                <div className="absolute inset-0 bg-gradient-to-br from-stone-50 via-rose-50 to-purple-50 z-0"></div>
                <div className="absolute inset-0 bg-[url('/bgGradient.png')] bg-cover opacity-30 mix-blend-soft-light z-0"></div>

                <div className="container px-4 max-w-4xl mx-auto relative z-10">
                    <h3 className="text-3xl font-light uppercase tracking-wide font-serif text-foreground text-center mb-12">Combo Packages</h3>
                    <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">Popular Areas Together</p>
                    <ComboPackageGrid title="" services={comboPackages} />
                </div>
            </div>

            <div className="bg-background py-16">
                <div className="container px-4 max-w-4xl mx-auto">
                    <div className="space-y-16">
                        <ComboPackageGrid title="Full Body Laser Hair Removal" services={fullBodyPackages} />
                        <ComboPackageGrid title="Full Body Packages" services={fullBodySessionPackages} />
                    </div>
                </div>
            </div>

            <section className="py-20 bg-stone-50 overflow-hidden">
                <div className="container mx-auto text-center">
                    <p className="text-muted-foreground uppercase tracking-widest">Experience the full benefits of</p>
                    <h2 className="text-3xl md:text-4xl text-primary font-serif font-light mt-2 mb-12">Laser Hair Removal Treatment</h2>
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
                            <div className="bg-white p-6 rounded-lg mt-6 border border-stone-200/50">
                                <p className="text-muted-foreground leading-relaxed text-center">GentleMax Pro is a dual-wavelength laser system combining 755 nm Alexandrite and 1064 nm Nd:YAG lasers for safe, effective, and long-lasting hair removal. Suitable for all skin types, it precisely targets hair follicles while protecting the skin. It also treats vascular lesions, pigmentation, and supports skin rejuvenation—all with minimal discomfort and downtime.</p>
                            </div>
                        </TabsContent>
                        <TabsContent value="pre-treatment">
                            <div className="bg-white p-6 rounded-lg mt-6 border border-stone-200/50">
                                <ul className="list-disc list-inside text-muted-foreground space-y-2 text-left prose">
                                    <li>Avoid sun exposure, tanning beds, and self-tanners for at least 2 weeks.</li>
                                    <li>Stop using retinoids, exfoliants (AHAs/BHAs), and strong skincare products 3-5 days before treatment.</li>
                                    <li>Do not wax, pluck, or use depilatory creams on the treatment area for 4 weeks; shaving 24 hours before is allowed.</li>
                                    <li>Avoid blood-thinning medications (aspirin, ibuprofen, fish oil) 48 hours prior unless prescribed.</li>
                                    <li>Arrive with clean, makeup-free skin.</li>
                                </ul>
                            </div>
                        </TabsContent>
                        <TabsContent value="post-treatment">
                            <div className="bg-white p-6 rounded-lg mt-6 border border-stone-200/50">
                                <ul className="list-disc list-inside text-muted-foreground space-y-2 text-left prose">
                                    <li>Avoid direct sun exposure and always use SPF 50+ to protect healing skin.</li>
                                    <li>You may experience slight redness and swelling, which can be soothed with a cool compress.</li>
                                    <li>Avoid hot showers, saunas, and intense exercise for 48 hours.</li>
                                    <li>Do not use any exfoliating products or strong chemicals on the treated area for at least a week.</li>
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
