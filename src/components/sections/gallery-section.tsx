'use client';

import * as React from 'react';
import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { GalleryHelper, GalleryImage } from '@/lib/gallery-helper';
import { useLanguage } from '@/context/language-context';

const defaultGalleryImages = [
    {
        src: "/microneedling.jpg",
        alt: "Microneedling Treatment",
        className: "top-[10%] left-[10%] w-[35vw] md:w-[20vw] aspect-[3/4] z-10",
        speed: 1
    },
    {
        src: "/woman-smile.jpg",
        alt: "Radiant Skin",
        className: "bottom-[15%] left-[35%] w-[40vw] md:w-[25vw] aspect-[4/3] z-20",
        speed: 1.2
    },
    {
        src: "/blue-gloves.jpg",
        alt: "Expert Care",
        className: "top-[20%] left-[60%] w-[30vw] md:w-[22vw] aspect-square z-10",
        speed: 0.9
    },
    {
        src: "/facial-massage.jpg",
        alt: "Relaxing Facial",
        className: "bottom-[10%] left-[85%] w-[35vw] md:w-[20vw] aspect-square z-0 opacity-90",
        speed: 1.1
    },
    {
        src: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?q=80",
        alt: "Advanced Care",
        className: "top-[15%] left-[110%] w-[38vw] md:w-[24vw] aspect-[3/4] z-10",
        speed: 1
    },
    {
        src: "https://images.unsplash.com/photo-1556760544-74068565f05c?q=80",
        alt: "Consultation",
        className: "bottom-[20%] left-[135%] w-[40vw] md:w-[25vw] aspect-[16/9] z-20",
        speed: 1.3
    }
];

// Fallback images ... (keep existing)
const fallbackImages = [
    "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1556760544-74068565f05c?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1600334129128-685c5582fd35?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?q=80&w=2070&auto=format&fit=crop"
];

// Register ScrollTrigger plugin
if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

export default function GallerySection() {
    const container = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLHeadingElement>(null);
    const imagesRef = useRef<HTMLDivElement>(null);
    const [galleryImages, setGalleryImages] = useState(defaultGalleryImages);
    const [loading, setLoading] = useState(true);
    const { t } = useLanguage();

    useEffect(() => {
        const loadGalleryImages = async () => {
            try {
                const images = await GalleryHelper.getAllGalleryImages();
                if (images.length > 0) {
                    // Map Firebase images to gallery format with positioning
                    const positions = [
                        "top-[10%] left-[100%] w-[35vw] md:w-[20vw] aspect-[3/4] z-10",
                        "bottom-[15%] left-[125%] w-[40vw] md:w-[25vw] aspect-[4/3] z-20",
                        "top-[20%] left-[150%] w-[30vw] md:w-[22vw] aspect-square z-10",
                        "bottom-[10%] left-[175%] w-[35vw] md:w-[20vw] aspect-square z-0 opacity-90",
                        "top-[15%] left-[200%] w-[38vw] md:w-[24vw] aspect-[3/4] z-10",
                        "bottom-[20%] left-[225%] w-[40vw] md:w-[25vw] aspect-[16/9] z-20"
                    ];

                    const formattedImages = images.map((img, index) => ({
                        src: img.imageUrl,
                        alt: img.alt,
                        className: positions[index % positions.length],
                        speed: 1 + (index % 3) * 0.1
                    }));

                    setGalleryImages(formattedImages);
                }
            } catch (error) {
                console.error("Failed to load gallery images:", error);
                // Keep default images on error
            } finally {
                setLoading(false);
            }
        };

        loadGalleryImages();
    }, []);


    useGSAP(() => {
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: container.current,
                start: "top top",
                end: "+=1000%", // Reduced to 1000% per user request
                pin: true,
                pinSpacing: true, // Force the spacer to push next content down
                scrub: true, // Use scrub without delay for immediate response
            }
        });

        // Horizontal Scroll Animation
        // Move the entire images container leftward
        // We start with some images off-screen right (left > 100%)
        // We scroll until the last image is visible or past center

        if (imagesRef.current) {
            tl.to(imagesRef.current, {
                x: "-350vw", // Move far enough to clear all images starting from >100%
                ease: "none"
            }, 0);
        }

        // Parallax effect within the horizontal movement
        // We can slightly adjust individual images if needed, but the main horizontal move is cleaner

        // Text stays completely static - no animation applied

    }, { scope: container });

    return (
        <section
            ref={container}
            className="relative w-full h-screen bg-[#f1efe9] overflow-hidden flex flex-col items-center justify-center z-10"
        >
            {/* Centered Large Text - stays relatively fixed */}
            <h2
                ref={textRef}
                className="font-headline font-medium text-[#2a3c5f] text-[15vw] leading-none tracking-tight text-center z-0 select-none whitespace-nowrap"
            >
                {t("gallery.title", "OUR GALLERY")}
            </h2>

            {/* Locate Lune Button */}
            <div className="absolute bottom-10 right-10 z-30">
                <Link href="/contact">
                    <Button variant="outline" className="rounded-full px-6 py-6 bg-[#fffbf5] border-[#2a3c5f] text-[#2a3c5f] hover:bg-[#2a3c5f] hover:text-white transition-colors gap-2 text-lg">
                        {t("gallery.locate", "Locate Lune")}
                        <span className="bg-[#2a3c5f] text-white rounded-full p-1 w-8 h-8 flex items-center justify-center group-hover:bg-white group-hover:text-[#2a3c5f]">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                            </svg>
                        </span>
                    </Button>
                </Link>
            </div>

            {/* Floating Images Container */}
            {/* We make this container wide enough or just rely on absolute positioning being relative to it */}
            <div ref={imagesRef} className="absolute inset-0 pointer-events-none w-full h-full z-10">
                {galleryImages.map((img, i) => (
                    <div
                        key={i}
                        className={cn(
                            "absolute overflow-hidden rounded-[2rem] shadow-2xl",
                            img.className
                        )}
                    >
                        <Image
                            src={img.src}
                            alt={img.alt}
                            fill
                            className="object-cover"
                        />
                    </div>
                ))}
            </div>
        </section>
    );
}
