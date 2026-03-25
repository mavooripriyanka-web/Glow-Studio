'use client';
import Image from 'next/image';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import Link from 'next/link';
import BookNowButton from '../ui/book-now-button';

const treatments = [
  {
    id: 'treat-1',
    name: 'HydraFacial',
    description: 'Deep cleansing and hydration',
    price: '$199',
    imageId: 'treatment-facial',
    tag: 'Popular'
  },
  {
    id: 'treat-2',
    name: 'Swedish Massage',
    description: 'Relaxation and stress relief',
    price: '$120',
    imageId: 'treatment-massage',
  },
  {
    id: 'treat-3',
    name: 'Aromatherapy Wrap',
    description: 'Detoxifying and nourishing',
    price: '$150',
    imageId: 'treatment-wrap',
  },
  {
    id: 'treat-4',
    name: 'Chemical Peel',
    description: 'Improves skin texture',
    price: '$250',
    imageId: 'treatment-peel',
    tag: 'New'
  },
  {
    id: 'treat-5',
    name: 'Hot Stone Massage',
    description: 'Deep muscle relaxation',
    price: '$140',
    imageId: 'treatment-hot-stone',
  },
];

export default function BestSellers() {
  return (
    <section id="treatments" className="w-full py-12 md:py-24 lg:py-32 bg-secondary">
      <div className="container mx-auto px-4 md:px-6">
        <div className='text-center mb-12'>
          <Badge variant="outline">Our Services</Badge>
          <h2 className="text-3xl font-bold tracking-tighter text-center mt-4 font-headline">
            Popular Treatments
          </h2>
          <p className='text-muted-foreground max-w-2xl mx-auto mt-4'>
            Indulge in our curated selection of treatments designed to relax, rejuvenate, and restore.
          </p>
        </div>
        <Carousel
          opts={{
            align: 'start',
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent>
            {treatments.map((treatment) => {
              const image = PlaceHolderImages.find(
                (img) => img.id === treatment.imageId
              );
              return (
                <CarouselItem key={treatment.id} className="md:basis-1/2 lg:basis-1/3">
                  <div className="p-1">
                    <Card className="rounded-lg overflow-hidden group">
                      <CardContent className="p-0">
                        {image && (
                          <div className='relative h-96 w-full'>
                            <Image
                              src={image.imageUrl}
                              alt={image.description}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                              data-ai-hint={image.imageHint}
                            />
                            {treatment.tag && <Badge className='absolute top-4 right-4'>{treatment.tag}</Badge>}
                          </div>
                        )}
                        <div className="p-6">
                          <h3 className="font-semibold text-lg font-headline">{treatment.name}</h3>
                          <p className="text-sm text-muted-foreground">{treatment.description}</p>
                          <div className='flex justify-between items-center mt-4'>
                            <p className="font-semibold text-lg">{treatment.price}</p>
                            <BookNowButton treatmentName={treatment.name} price={treatment.price} variant="outline" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              );
            })}
          </CarouselContent>
          <CarouselPrevious className="absolute left-0 top-1/2 -translate-y-1/2 z-10" />
          <CarouselNext className="absolute right-0 top-1/2 -translate-y-1/2 z-10" />
        </Carousel>
        <div className="text-center mt-12">
          <Link href="/treatments">
            <Button size="lg">View All Treatments</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
