'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Star } from "lucide-react";
import AppointmentForm from "@/components/sections/appointment-form";
import AboutLune from "@/components/sections/about-lune";
import WelcomeSection from "@/components/sections/welcome-section";
import WorkWonders from "@/components/sections/work-wonders";
import GallerySection from "@/components/sections/gallery-section";
import FeatureSection from "@/components/sections/feature-section";
import TestimonialsSection from "@/components/sections/testimonial";
import InstagramFeed from "@/components/sections/instagram-feed";
import { ScrollReveal } from "@/components/animations";
import { useLanguage } from "@/context/language-context";

export default function Home() {
  const { t } = useLanguage();

  const treatments = [
    {
      title: t('homeTreatments.laserHairRemoval.title'),
      description: t('homeTreatments.laserHairRemoval.description'),
      href: "/treatments/laser-hair-removal",
      image: "/Laser-Hair-Removal.jpg"
    },
    {
      title: t('homeTreatments.laserSkinCare.title'),
      description: t('homeTreatments.laserSkinCare.description'),
      href: "/treatments/laser-skin-care",
      image: "/rejuvenation.png"
    },
    {
      title: t('homeTreatments.chemicalPeel.title'),
      description: t('homeTreatments.chemicalPeel.description'),
      href: "/treatments/chemical-peel",
      image: "/peels.jpg"
    },
    {
      title: t('homeTreatments.micropeeling.title'),
      description: t('homeTreatments.micropeeling.description'),
      href: "/treatments/micropeeling",
      image: "/dp4.jpg"
    },
    {
      title: t('homeTreatments.facials.title'),
      description: t('homeTreatments.facials.description'),
      href: "/treatments/facials",
      image: "/face.jpg"
    },
    {
      title: t('homeTreatments.lipBlush.title'),
      description: t('homeTreatments.lipBlush.description'),
      href: "/treatments/lip-blush",
      image: "/lip.jpg"
    },
    {
      title: t('homeTreatments.bodySculpting.title'),
      description: t('homeTreatments.bodySculpting.description'),
      href: "/treatments/body-sculpting",
      image: "https://images.unsplash.com/photo-1519415387722-a1c3bbef716c?q=80&w=2070&auto=format&fit=crop"
    }
  ];

  const testimonials = [
    { name: "Andrea Pinti", text: "The team at Lune is incredibly professional and knowledgeable." },
    { name: "Suthasinee Sivara", text: "I'm so happy I found Lune! Their treatments truly work wonders — my skin feels fresh, glowing, and healthier than ever." },
    { name: "Peckhan Tan", text: "Lune's advanced skincare treatments gave me back my confidence. After years of struggling with dull skin and uneven texture, their tailored approach really worked" },
    { name: "Mahe Combe", text: "An incredible moment of relaxation" },
    { name: "Madeleine Segieth", text: "Lune is my go-to for all skincare needs now! Every session leaves me feeling pampered and confident." },
    { name: "Nicky Kung", text: "Very good service. Super comfortable and reasonable price. The location is super convenient too." },
    { name: "째용스", text: "It was such a good & relaxing experience. All the service was nice. I would definitely come back next time :)" }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="/glow_studio_hero.png"
            alt="Glow Studio Hero"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/20" />
        </div>
        <div className="relative z-10 text-center px-4">
          <h1 className="text-5xl md:text-7xl lg:text-9xl font-headline text-white drop-shadow-2xl tracking-tight">
            Glow Studio
          </h1>
          <p className="mt-6 text-lg md:text-2xl text-white/90 drop-shadow-md font-light tracking-wide max-w-2xl mx-auto">
            Personalized care for the skin that's uniquely yours.
          </p>
        </div>
      </section>

      {/* Welcome Section */}
      <WelcomeSection />

      <AboutLune />

      {/* Treatments Grid */}
      <section className="py-20 bg-stone-50">
        <div className="container px-4">
          <ScrollReveal direction="up" className="text-center mb-16">
            <h2 className="text-4xl font-bold font-headline text-primary">{t('homeTreatments.title')}</h2>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {treatments.map((treatment, index) => (
              <ScrollReveal
                key={index}
                direction="up"
                delay={index * 0.1}
              >
                <Link href={treatment.href} className="group block bg-white p-6 hover:shadow-lg transition-all duration-300">
                  <div className="space-y-4 text-center">
                    <div className="aspect-square relative overflow-hidden bg-stone-100 rounded-full w-48 h-48 mx-auto mb-6">
                      <img
                        src={treatment.image}
                        alt={treatment.title}
                        className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                    <h3 className="text-2xl font-bold font-headline text-primary">
                      {treatment.title}
                    </h3>
                    <p className="text-stone-500 text-sm">{treatment.description}</p>
                    <div className="pt-2">
                      <Button variant="outline" className="uppercase tracking-widest text-xs border-stone-200 group-hover:border-stone-900 group-hover:bg-stone-900 group-hover:text-white transition-all">
                        {t('homeTreatments.explore')}
                      </Button>
                    </div>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <WorkWonders />

      {/* Feature Section */}
      <FeatureSection />

      {/* Gallery Section - Two rows of scrolling images */}
      <GallerySection />



      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* InstagramFeed removed */}

      <AppointmentForm />
    </div>
  );
}
