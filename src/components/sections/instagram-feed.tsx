'use client';

import { PlaceHolderImages } from '@/lib/placeholder-images';
import { ArrowRight, Instagram } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import useEmblaCarousel from 'embla-carousel-react';
import AutoScroll from 'embla-carousel-auto-scroll';
import { useLanguage } from '@/context/language-context';

const instagramPosts = [
  'instagram-real-1',
  'instagram-real-2',
  'instagram-real-3',
  'instagram-real-4',
  'instagram-real-5',
  'instagram-real-6',
  'treatment-facial',
];

export default function InstagramFeed() {
  const { t } = useLanguage();
  const baseImages = instagramPosts.map((id) =>
    PlaceHolderImages.find((img) => img.id === id)
  ).filter(Boolean);

  // Duplicate items to ensure enough content for a smooth infinite loop
  const carouselImages = [...baseImages, ...baseImages, ...baseImages];

  const [emblaRef] = useEmblaCarousel({ loop: true, dragFree: true }, [
    AutoScroll({
      playOnInit: true,
      stopOnInteraction: false,
      stopOnMouseEnter: true,
      direction: 'backward',
      speed: 1,
    }),
  ]);

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-[#FBF8F3]">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-body text-foreground">
            {t("instagram.followJourney", "Follow our")}
            <br />
            <span className="text-5xl sm:text-6xl font-headline font-semibold text-primary">{t("instagram.journeyOn", "Journey On Instagram")}</span>
          </h2>
          <Link href="https://instagram.com/skincarebylune" target="_blank">
            <div className="mt-8 max-w-sm mx-auto flex items-center justify-between border border-foreground rounded-full px-4 py-2 hover:bg-stone-100 transition-colors">
              <div className='flex items-center gap-2'>
                <Instagram className="w-5 h-5 text-foreground" />
                <span className="text-foreground font-medium">@skincarebylune</span>
              </div>
              <ArrowRight className="w-5 h-5 text-foreground" />
            </div>
          </Link>
        </div>

        <div className="overflow-hidden p-4 cursor-grab active:cursor-grabbing" ref={emblaRef}>
          <div className="flex gap-4 touch-pan-y">
            {carouselImages.map((image, index) =>
              image ? (
                <div
                  key={`${image.id}-${index}`}
                  className="flex-[0_0_60%] sm:flex-[0_0_40%] md:flex-[0_0_25%] lg:flex-[0_0_20%] xl:flex-[0_0_16.666%] min-w-0"
                >
                  <div className="relative aspect-square rounded-lg overflow-hidden group">
                    <Image
                      src={image.imageUrl}
                      alt={image.description}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      data-ai-hint={image.imageHint}
                    />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Instagram className="w-8 h-8 text-white" />
                    </div>
                  </div>
                </div>
              ) : null
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
