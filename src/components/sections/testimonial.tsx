'use client';

import * as React from 'react';
import { useRef, useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { cn } from '@/lib/utils';
import { TestimonialsHelper, Testimonial } from '@/lib/testimonials-helper';

import { useLanguage } from '@/context/language-context';
export default function TestimonialsSection() {
  const container = useRef<HTMLDivElement>(null);
  const col1Ref = useRef<HTMLDivElement>(null);
  const col2Ref = useRef<HTMLDivElement>(null);
  const col3Ref = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  const defaultTestimonials = [
    { name: "Andrea Pinti", text: t("testimonials.andrea", "The team at Lune is incredibly professional and knowledgeable.") },
    { name: "Suthasinee Sivara", text: t("testimonials.suthasinee", "I'm so happy I found Lune! Their treatments truly work wonders — my skin feels fresh, glowing, and healthier than ever.") },
    { name: "Peckhan Tan", text: t("testimonials.peckhan", "Lune's advanced skincare treatments gave me back my confidence. After years of struggling with dull skin and uneven texture, their tailored approach really worked") },
    { name: "Mahe Combe", text: t("testimonials.mahe", "An incredible moment of relaxation") },
    { name: "Madeleine Segieth", text: t("testimonials.madeleine", "Lune is my go-to for all skincare needs now! Every session leaves me feeling pampered and confident.") },
    { name: "Nicky Kung", text: t("testimonials.nicky", "Very good service. Super comfortable and reasonable price. The location is super convenient too.") },
    { name: "째용스", text: t("testimonials.jjae", "It was such a good & relaxing experience. All the service was nice. I would definitely come back next time :)") },
    { name: "Sarah L.", text: t("testimonials.sarah", "Absolutely loved the facial! My skin has never looked better.") },
    { name: "Jessica M.", text: t("testimonials.jessica", "Professional, clean, and incredibly relaxing environment.") }
  ];

  const [testimonials, setTestimonials] = useState(defaultTestimonials);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTestimonials = async () => {
      try {
        const data = await TestimonialsHelper.getAllTestimonials();
        if (data.length > 0) {
          // Map Firebase testimonials to the format expected by the component
          const formattedTestimonials = data.map(t => ({
            name: t.name,
            text: t.text
          }));
          setTestimonials(formattedTestimonials);
        }
      } catch (error) {
        console.error("Failed to load testimonials:", error);
        // Keep default testimonials on error
      } finally {
        setLoading(false);
      }
    };

    loadTestimonials();
  }, []);

  useGSAP(() => {
    // Only run animation after testimonials are loaded
    if (loading) return;

    // Rain Animation: Constant vertical movement
    const animateColumn = (element: HTMLElement | null, speed: number) => {
      if (!element) return;

      gsap.to(element, {
        y: "-50%",
        ease: "none",
        duration: 20 / speed, // Duration based on speed
        repeat: -1
      });
    };

    animateColumn(col1Ref.current, 1);
    animateColumn(col2Ref.current, 0.8);
    animateColumn(col3Ref.current, 1.2);

  }, { scope: container, dependencies: [loading, testimonials] });

  // Split testimonials into 3 columns
  const col1 = testimonials.filter((_, i) => i % 3 === 0);
  const col2 = testimonials.filter((_, i) => i % 3 === 1);
  const col3 = testimonials.filter((_, i) => i % 3 === 2);

  const TestimonialCard = ({ data }: { data: typeof testimonials[0] }) => (
    <div className="bg-[#fffbf5] p-6 rounded-2xl shadow-sm border border-stone-100 mb-6">
      <div className="flex gap-1 text-[#2a3c5f] mb-3">
        {[...Array(5)].map((_, star) => <Star key={star} className="w-3 h-3 fill-current" />)}
      </div>
      <p className="text-stone-600 mb-4 text-sm leading-relaxed">"{data.text}"</p>
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-full bg-[#2a3c5f] text-white flex items-center justify-center text-[10px] font-bold">
          {data.name.charAt(0)}
        </div>
        <p className="font-medium text-[#2a3c5f] text-xs uppercase tracking-wider">{data.name}</p>
      </div>
    </div>
  );

  return (
    <section ref={container} className="relative z-30 py-24 bg-[#fdfbf7] overflow-hidden">
      <div className="container px-4 text-center mb-16">
        <p className="text-[#2a3c5f] uppercase tracking-widest text-sm mb-3">Lune Advanced Skincare</p>
        <h2 className="text-4xl md:text-5xl font-bold font-headline text-[#2a3c5f]">
          {t("testimonials.titlePart1", "What Our Clients")}
          <br />
          {t("testimonials.titlePart2", "Say About Us")}
        </h2>
      </div>

      {/* Rain Container Box */}
      <div className="container px-4 relative z-10">
        <div className="relative h-[600px] overflow-hidden rounded-[3rem] border border-[#dcdcd9] bg-white/50 backdrop-blur-sm shadow-xl">
          <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#fdfbf7] to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#fdfbf7] to-transparent z-10 pointer-events-none" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full p-8">
            {/* Column 1 */}
            <div ref={col1Ref} className="flex flex-col">
              {[...col1, ...col1].map((t, i) => <TestimonialCard key={`col1-${i}`} data={t} />)}
            </div>
            {/* Column 2 */}
            <div ref={col2Ref} className="flex flex-col pt-12">
              {[...col2, ...col2].map((t, i) => <TestimonialCard key={`col2-${i}`} data={t} />)}
            </div>
            {/* Column 3 */}
            <div ref={col3Ref} className="flex flex-col">
              {[...col3, ...col3].map((t, i) => <TestimonialCard key={`col3-${i}`} data={t} />)}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
