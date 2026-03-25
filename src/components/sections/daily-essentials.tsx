import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '../ui/button';

export default function DailyEssentials() {
  const sectionImage = PlaceHolderImages.find(
    (img) => img.id === 'daily-essentials'
  );

  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1">
            {sectionImage && (
              <Image
                src={sectionImage.imageUrl}
                alt={sectionImage.description}
                width={600}
                height={750}
                className="rounded-lg object-cover w-full h-full"
                data-ai-hint={sectionImage.imageHint}
              />
            )}
          </div>
          <div className="order-1 md:order-2 space-y-4 text-center md:text-left">
            <h2 className="text-3xl font-bold tracking-tighter font-headline sm:text-4xl md:text-5xl">
              The Lune Philosophy
            </h2>
            <p className="text-muted-foreground md:text-xl/relaxed">
              We believe in a holistic approach to beauty and wellness. Our treatments are a blend of ancient wisdom and modern science, using only the finest natural ingredients.
            </p>
            <Link href="#about">
              <Button size="lg">Learn More</Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
