'use client';

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/context/language-context";

export default function WelcomeSection() {
    const { t } = useLanguage();

    return (
        <section className="bg-[#FBF8F3] py-20">
            <div className="container px-4 text-center max-w-4xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-headline text-primary">{t('welcome.title')}</h2>
                <div className="my-4 flex justify-center">
                    <span className="text-5xl font-headline font-bold text-primary tracking-tighter">Glow Studio</span>
                </div>
                <h3 className="text-4xl md:text-5xl font-headline text-primary mb-8">{t('welcome.subtitle')}</h3>
                <div className="text-stone-600 space-y-4 text-lg leading-relaxed">
                    <p>
                        {t('welcome.description1')}
                    </p>
                    <p>
                        {t('welcome.description2')}
                    </p>
                </div>
                <div className="mt-10">
                    <Link href="/treatments">
                        <Button size="lg" className="rounded-full px-8">{t('welcome.cta')}</Button>
                    </Link>
                </div>
            </div>
        </section>
    );
}
