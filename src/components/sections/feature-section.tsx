'use client';

import * as React from 'react';
import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useAuthGuard } from '@/hooks/use-auth-guard';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/context/language-context';

export default function FeatureSection() {
    const container = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const imageLeftRef = useRef<HTMLDivElement>(null);
    const imageRightRef = useRef<HTMLDivElement>(null);
    const { handleAuthAction, AuthGuardComponent } = useAuthGuard();
    const router = useRouter();
    const { t } = useLanguage();

    useGSAP(() => {
        let mm = gsap.matchMedia();

        // Desktop Animation (Pinned & Complex)
        mm.add("(min-width: 768px)", () => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: container.current,
                    start: "top top",
                    end: "+=150%", // Extended for smooth long scroll
                    pin: true,
                    scrub: 1,
                    anticipatePin: 1
                }
            });

            // Animations
            if (imageLeftRef.current && imageRightRef.current && contentRef.current) {

                // Initial Content Animation (Fade In & Slide Up)
                gsap.fromTo(contentRef.current.children,
                    { y: 50, opacity: 0 },
                    { y: 0, opacity: 1, duration: 2, stagger: 0.2, ease: "power2.out" }
                );

                // Button specific animation
                const button = contentRef.current.querySelector('button');
                if (button) {
                    tl.to(button, { y: -20, ease: "none", duration: 10 }, 0);
                }

                // Left Image: Moves Left
                tl.fromTo(imageLeftRef.current,
                    { x: 0, opacity: 1, scale: 0.9, z: -20 },
                    { x: -150, opacity: 1, scale: 1, z: 20, ease: "power1.inOut", duration: 10 }
                    , 0);

                // Right Image: Moves Right
                tl.fromTo(imageRightRef.current,
                    { x: 0, opacity: 1, scale: 0.9, z: -20 },
                    { x: 150, opacity: 1, scale: 1, z: 20, ease: "power1.inOut", duration: 10 }
                    , 0);

                tl.to(contentRef.current, { scale: 0.95, opacity: 0.9, ease: "none", duration: 10 }, 0);

                // Stars parallax
                tl.to(".star-decoration", {
                    y: -150,
                    opacity: 0.8,
                    rotation: 45,
                    ease: "none",
                    duration: 10
                }, 0);
            }
            return () => { }; // cleanup function
        });

        // Mobile Animation (Simple fade up, no pinning)
        mm.add("(max-width: 767px)", () => {
            if (contentRef.current) {
                gsap.fromTo(contentRef.current.children,
                    { y: 30, opacity: 0 },
                    {
                        y: 0,
                        opacity: 1,
                        duration: 1,
                        stagger: 0.2,
                        ease: "power2.out",
                        scrollTrigger: {
                            trigger: container.current,
                            start: "top 80%",
                        }
                    }
                );
            }

            // Slight parallax for images instead of massive horizontal movement
            if (imageLeftRef.current && imageRightRef.current) {
                gsap.to(imageLeftRef.current, {
                    y: -50,
                    ease: "none",
                    scrollTrigger: {
                        trigger: container.current,
                        scrub: true,
                        start: "top bottom",
                        end: "bottom top"
                    }
                });
                gsap.to(imageRightRef.current, {
                    y: -80,
                    ease: "none",
                    scrollTrigger: {
                        trigger: container.current,
                        scrub: true,
                        start: "top bottom",
                        end: "bottom top"
                    }
                });
            }
            return () => { }; // cleanup
        });

        return () => mm.revert(); // Cleanup all matchMedia instances

    }, { scope: container });

    return (
        <section
            ref={container}
            className="relative h-screen w-full flex items-center justify-center bg-[#fffbf5] overflow-hidden perspective-[1000px]"
        >
            {/* Fixed/Pinned Content */}
            <div ref={contentRef} className="relative z-0 text-center max-w-[800px] px-5 will-change-transform">
                <h2 className="text-4xl md:text-5xl font-bold font-headline text-[#2a3c5f] mb-6 leading-tight">
                    {t("feature.titlePart1", "Advanced Care For Your")} <br />
                    <span className="text-[#3e5075] italic">{t("feature.titlePart2", "Most Radiant Skin Yet")}</span>
                </h2>
                <p className="text-stone-600 text-sm md:text-base mb-8 leading-relaxed font-sans max-w-2xl mx-auto">
                    {t("feature.description", "Reveal your best skin with advanced, results-driven treatments tailored to your unique needs. From lasers to peels, each service is designed to boost glow, smooth texture, and enhance radiance.")}
                </p>
                <Button
                    onClick={() => handleAuthAction(() => router.push("#appointment"))}
                    className="px-8 py-6 bg-[#2a3c5f] text-white rounded-full text-sm hover:scale-105 transition-transform duration-300 shadow-lg cursor-pointer"
                >
                    {t("feature.cta", "Book your visit")}
                </Button>
                {AuthGuardComponent}
            </div>

            {/* Floating Images (Absolute) */}
            <div
                ref={imageLeftRef}
                className="absolute left-[8%] md:left-[12%] w-[180px] md:w-[240px] aspect-[3/4] rounded-[24px] overflow-hidden shadow-2xl z-10 will-change-transform"
            >
                <Image
                    src="/inside-skincare.jpg"
                    alt="Inside Skincare"
                    fill
                    className="object-cover"
                />
            </div>

            <div
                ref={imageRightRef}
                className="absolute right-[8%] md:right-[12%] w-[180px] md:w-[240px] aspect-[3/4] rounded-[24px] overflow-hidden shadow-2xl z-20 will-change-transform"
            >
                <Image
                    src="/skin care.jpg"
                    alt="Skin Care"
                    fill
                    className="object-cover"
                />
            </div>

            {/* Decorative Elements (Stars) */}
            <div className="star-decoration absolute top-[25%] right-[20%] text-[2.5rem] text-[#2a3c5f] opacity-80">✦</div>
            <div className="star-decoration absolute bottom-[30%] left-[20%] text-[2rem] text-[#2a3c5f] opacity-60">✦</div>
            <div className="star-decoration absolute top-[65%] left-[15%] text-[1.5rem] text-[#2a3c5f] opacity-50">✦</div>

        </section>
    );
}
