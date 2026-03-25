'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from "@/context/language-context";

export default function AboutLune() {
  const { t } = useLanguage();

  return (
    <section id="about" className="w-full py-12 md:py-24 lg:py-32 bg-[#FBF8F3]">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="text-center md:text-left">
            <h2 className="text-6xl md:text-8xl font-body text-primary font-bold tracking-tighter">
              {t('about.where')}
            </h2>
            <div className="flex items-center justify-center md:justify-start gap-4 my-4">
              <div className="relative w-80 h-32 rounded-full overflow-hidden hidden md:block">
                <Image
                  src="/best skin.jpg"
                  alt="Best skin"
                  fill
                  className="object-cover"
                />
              </div>
              <h2 className="text-6xl md:text-8xl font-body text-primary font-bold tracking-tighter">
                {t('about.skin')}
              </h2>
            </div>
            <h2 className="text-6xl md:text-8xl font-body text-primary font-bold tracking-tighter">
              {t('about.begins')}
            </h2>
          </div>
          <div className="space-y-4">
            <h3 className="text-2xl font-bold font-headline text-primary">{t('about.atLune')}</h3>
            <p className="text-muted-foreground">
              {t('about.description')}
            </p>
            <Link href="/about-us" className="inline-flex items-center text-primary font-semibold hover:underline">
              {t('about.cta')} <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
