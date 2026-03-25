import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Link from 'next/link';
import { Badge } from '../ui/badge';
import { HeroBookButton } from './hero-book-button';

export default function Hero() {
  const heroImage = PlaceHolderImages.find((img) => img.id === 'hero-main');

  return (
    <section className="relative h-[80vh] md:h-[90vh] w-full flex items-center justify-start text-foreground">
      {heroImage && (
        <Image
          src={heroImage.imageUrl}
          alt={heroImage.description}
          fill
          className="object-cover"
          priority
          data-ai-hint={heroImage.imageHint}
        />
      )}
      <div className="relative z-10 p-4 md:p-8 lg:p-12 container">
        <div className="max-w-xl text-left bg-background/80 rounded-lg backdrop-blur-sm p-8">
          <Badge variant="secondary" className="mb-4">
            Advanced Skincare
          </Badge>
          <h1 className="text-4xl md:text-6xl font-headline tracking-tight">
            Elevate Your Skincare Ritual
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground">
            Discover our range of advanced, science-backed skincare treatments designed to rejuvenate and restore your skin's natural radiance.
          </p>
          <div className="mt-8 flex gap-4">
            <Link href="/treatments">
              <Button size="lg">Our Treatments</Button>
            </Link>
            <HeroBookButton />

          </div>
        </div>
      </div>
    </section>
  );
}
