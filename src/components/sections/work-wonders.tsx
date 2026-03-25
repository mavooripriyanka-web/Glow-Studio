'use client';

import * as React from 'react';
import Image from 'next/image';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/components/ui/carousel';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useLanguage } from '@/context/language-context';

export default function WorkWonders() {
  const { t } = useLanguage();

  const treatments = [
    {
      id: 'rejuvenation',
      title: t("workWonders.laserHairRemoval.title", "Laser Hair Removal Benefits"),
      description: t("workWonders.laserHairRemoval.description", "Laser hair removal is a long-term solution for unwanted hair, offering convenience and lasting results. It reduces hair growth significantly, saves time, and minimizes skin irritation compared to traditional methods. This treatment offers smooth, flawless skin without the need for shaving or waxing ever again. It effectively eliminates ingrown hairs and is safe for all skin tones, including ethnic skin."),
      imageId: 'laser-hair-custom',
      href: '/treatments/laser-hair-removal'
    },
    {
      id: 'body-sculpting',
      title: t("workWonders.bodySculpting.title", "Body Sculpting Benefits"),
      description: t("workWonders.bodySculpting.description", "This treatment effectively reduces localized fat in areas like the belly, thighs, and arms, while also helping to improve the appearance of cellulite. It's a painless, non-surgical procedure with no downtime, making it a convenient option for body contouring."),
      imageId: 'body-sculpting',
      href: '/treatments/body-sculpting'
    },
    {
      id: 'peeling',
      title: t("workWonders.chemicalPeel.title", "Chemical Peeling Benefits"),
      description: t("workWonders.chemicalPeel.description", "The formula targets multiple skin concerns with a blend of actives. TCA 35% improves texture, scars, and pigmentation, while salicylic acid clears pores and controls oil. Tartaric acid brightens, and lactobionic acid supports cell metabolism. Vitamin C offers antioxidant protection and strengthens capillaries, while amino acids and Vitamin B2 revitalize and promote healthy cell renewal."),
      imageId: 'treatment-peel',
      href: '/treatments/chemical-peel'
    },
    {
      id: 'microneedling',
      title: t("workWonders.microneedling.title", "Microneedling with DP4 (Dermapen 4) benefits"),
      description: t("workWonders.microneedling.description", "Microneedling with DP4 (Dermapen4) stimulates collagen production by creating tiny micro-injuries in the skin, helping reduce fine lines, scars, and uneven texture. It leaves the skin smoother, firmer, and naturally radiant with minimal downtime."),
      imageId: 'microneedling',
      href: '/treatments/micropeeling'
    },
  ];

  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  const { contextSafe } = useGSAP({ scope: containerRef });

  const handleMouseMove = contextSafe((e: React.MouseEvent<HTMLDivElement>, imageSelector: string) => {
    const { clientX, clientY, currentTarget } = e;
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    const x = (clientX - left) / width - 0.5;
    const y = (clientY - top) / height - 0.5;

    gsap.to(imageSelector, {
      x: x * 20, // Move image 20px based on cursor
      y: y * 20,
      rotateX: -y * 5, // Subtle 3D tilt
      rotateY: x * 5,
      scale: 1.05, // Slight zoom to avoid edges showing
      duration: 0.5,
      ease: 'power2.out',
    });
  });

  const handleMouseLeave = contextSafe((imageSelector: string) => {
    gsap.to(imageSelector, {
      x: 0,
      y: 0,
      rotateX: 0,
      rotateY: 0,
      scale: 1,
      duration: 0.5,
      ease: 'power2.out',
    });
  });

  return (
    <section className="w-full py-12 md:py-24 bg-[#FFFBF5]" ref={containerRef}>
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-medium text-stone-900 mb-2">
            {t("workWonders.whyOurTreatments", "Why Our Treatments")}
          </h2>
          <h3 className="text-4xl md:text-5xl font-bold font-headline text-[#2a3c5f]">
            {t("workWonders.workWonders", "Work Wonders")}
          </h3>
        </div>

        <div className="relative max-w-5xl mx-auto">
          <Carousel
            setApi={setApi}
            opts={{
              align: 'start',
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent>
              {treatments.map((treatment, index) => {
                const image = PlaceHolderImages.find(
                  (img) => img.id === treatment.imageId
                );
                const uniqueImageClass = `carousel-image-${index}`;

                return (
                  <CarouselItem key={treatment.id}>
                    <div className="p-1">
                      <div
                        className="relative aspect-[16/10] md:aspect-[2/1] w-full rounded-[32px] overflow-hidden perspective-1000"
                        onMouseMove={(e) => handleMouseMove(e, `.${uniqueImageClass}`)}
                        onMouseLeave={() => handleMouseLeave(`.${uniqueImageClass}`)}
                      >
                        {image && (
                          <div className={cn("relative w-full h-full will-change-transform", uniqueImageClass)}>
                            <Image
                              src={image.imageUrl}
                              alt={image.description}
                              fill
                              className="object-cover"
                              data-ai-hint={image.imageHint}
                              priority={index === 0}
                            />
                          </div>
                        )}

                        {/* Overlay Card - Positioned absolute right-12 top-1/2 */}
                        <div className="hidden md:block absolute right-12 top-1/2 -translate-y-1/2 w-[380px] z-10 pointer-events-none">
                          <div className="bg-[#5e5346]/90 text-white p-6 rounded-[24px] backdrop-blur-sm shadow-xl text-left pointer-events-auto">
                            <h3 className="font-headline text-2xl md:text-3xl font-medium mb-4">
                              {treatment.title}
                            </h3>
                            <p className="text-sm md:text-base leading-relaxed opacity-90 mb-8 font-light">
                              {treatment.description}
                            </p>
                            <Link href={treatment.href}>
                              <Button className="rounded-full bg-[#fcf9f4] text-[#5e5346] hover:bg-white border-none px-6 py-2 h-auto text-sm font-semibold shadow-md transition-all">
                                {t("workWonders.knowMore", "Know more")}
                              </Button>
                            </Link>
                          </div>
                        </div>

                        {/* Mobile Overlay - Full cover or bottom sheet style if needed, but keeping simple for now */}
                        <div className="md:hidden absolute inset-0 bg-black/40 flex items-center justify-center p-6 z-10">
                          <div className="bg-[#5e5346]/95 text-white p-6 rounded-[24px] backdrop-blur-sm shadow-xl text-left">
                            <h3 className="font-headline text-2xl font-medium mb-3">
                              {treatment.title}
                            </h3>
                            <p className="text-sm leading-relaxed opacity-90 mb-6 font-light line-clamp-4">
                              {treatment.description}
                            </p>
                            <Link href={treatment.href}>
                              <Button className="rounded-full bg-[#fcf9f4] text-[#5e5346] hover:bg-white border-none px-6 py-2 h-auto text-sm font-semibold shadow-md transition-all">
                                {t("workWonders.knowMore", "Know more")}
                              </Button>
                            </Link>
                          </div>
                        </div>

                      </div>
                    </div>
                  </CarouselItem>
                );
              })}
            </CarouselContent>

            {/* Custom Navigation Arrows */}
            <CarouselPrevious className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full border-2 border-white/30 bg-white/10 text-white hover:bg-white/20 hover:text-white transition-all backdrop-blur-sm hover:border-white/50 [&>svg]:h-6 [&>svg]:w-6" />
            <CarouselNext className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full border-2 border-white/30 bg-white/10 text-white hover:bg-white/20 hover:text-white transition-all backdrop-blur-sm hover:border-white/50 [&>svg]:h-6 [&>svg]:w-6" />

          </Carousel>

          {/* Dots Pagination */}
          <div className="flex justify-center gap-3 mt-8">
            {Array.from({ length: count }).map((_, index) => (
              <button
                key={index}
                onClick={() => api?.scrollTo(index)}
                className={cn(
                  "w-2.5 h-2.5 rounded-full transition-all duration-300",
                  current === index
                    ? "bg-[#2a3c5f] w-2.5"
                    : "bg-[#d4cfc7] hover:bg-[#b0aba3]"
                )}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
