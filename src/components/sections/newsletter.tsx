'use client';

import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { useToast } from '@/hooks/use-toast';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const { toast } = useToast();
  const newsletterImage = PlaceHolderImages.find(img => img.id === 'newsletter-bg');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      toast({
        title: 'Subscribed!',
        description: 'Thanks for joining our newsletter.',
      });
      setEmail('');
    }
  };

  return (
    <section id="newsletter" className="w-full py-12 md:py-24 lg:py-32 relative text-white">
      {newsletterImage && (
        <Image 
          src={newsletterImage.imageUrl}
          alt={newsletterImage.description}
          fill
          className='object-cover'
          data-ai-hint={newsletterImage.imageHint}
        />
      )}
      <div className='absolute inset-0 bg-black/50'></div>
      <div className="container mx-auto px-4 md:px-6 text-center max-w-2xl relative z-10">
        <h2 className="text-3xl font-bold tracking-tighter font-headline mb-4 sm:text-4xl">
          Join the Lune Community
        </h2>
        <p className="mb-8">
          Sign up for our newsletter to receive exclusive offers, new treatment announcements, and wellness tips.
        </p>
        <form onSubmit={handleSubmit} className="flex w-full max-w-md mx-auto items-center space-x-2">
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="flex-1 bg-transparent/20 border-white placeholder:text-gray-300"
          />
          <Button type="submit" variant="secondary">Subscribe</Button>
        </form>
      </div>
    </section>
  );
}
