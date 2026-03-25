'use client';
import { Mail, Phone, MapPin, Navigation, Clock } from 'lucide-react';
import ContactForm from '@/components/contact-form';
import Faq from '@/components/sections/faq';
import InstagramFeed from '@/components/sections/instagram-feed';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

import { useAuthGuard } from '@/hooks/use-auth-guard'; // Add hook
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/context/language-context';

export default function ContactPage() {
  const { handleAuthAction, AuthGuardComponent } = useAuthGuard();
  const router = useRouter();
  const { t } = useLanguage();
  return (
    <div className="bg-white min-h-screen">
      {/* Hero */}
      <div className="relative bg-cover bg-center py-32" style={{ backgroundImage: "url('/glow_studio_hero.png')" }}>
        <div className="absolute inset-0 bg-black/50" />
        <div className="container relative px-4 text-center">
          <h1 className="text-6xl md:text-8xl font-bold font-headline text-white mb-6 drop-shadow-lg">
            Glow Studio
          </h1>
          <h2 className="text-3xl md:text-4xl font-headline text-white/90">
            {t("contactUs.title", "Contact Us")}
          </h2>
          <p className="mt-6 text-white/80 max-w-2xl mx-auto text-lg md:text-xl font-light">
            {t("contactUs.subtitlePart1", "Have a question or need help?")} <br />
            {t("contactUs.subtitlePart2", "Reach out using the form or contact details.")} <br />
            {t("contactUs.subtitlePart3", "We'll get back to you shortly.")}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-20 bg-card">
        <div className="container px-4">
          <div className="max-w-6xl mx-auto bg-white p-8 md:p-12 rounded-lg shadow-sm grid md:grid-cols-2 gap-16 lg:gap-24 items-center">
            {/* Left Column: Contact Info */}
            <div className="space-y-8">
              <h2 className="text-4xl font-bold font-headline text-primary">
                {t("contactUs.getInTouch", "Get In Touch")}
              </h2>

              <div className="space-y-4">
                <h3 className="font-semibold uppercase tracking-wider text-foreground">
                  {t("contactUs.contactInfo", "Contact Info")}
                </h3>
                <div className="space-y-3 text-stone-600">
                  <a
                    href="mailto:care@luneskincare.com"
                    className="flex items-center gap-4 hover:text-primary transition-colors"
                  >
                    <Mail className="w-5 h-5 text-primary/70" />
                    <span>care@glowstudio.com</span>
                  </a>
                  <a
                    href="tel:+15147544499"
                    className="flex items-center gap-4 hover:text-primary transition-colors"
                  >
                    <Phone className="w-5 h-5 text-primary/70" />
                    <span>+1 514 754 4499</span>
                  </a>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold uppercase tracking-wider text-foreground">
                  {t("contactUs.ourLocation", "Our Location")}
                </h3>
                <div className="flex items-start gap-4 text-stone-600">
                  <MapPin className="w-5 h-5 text-primary/70 mt-1 shrink-0" />
                  <span>
                    2098 Crescent St,
                    <br />
                    Montreal, Quebec H3G 2B8
                  </span>
                </div>
                <a href="https://www.google.com/maps/search/?api=1&query=2098+Crescent+St,+Montreal,+Quebec+H3G+2B8" target="_blank" rel="noopener noreferrer">
                  <Button className="mt-2 bg-primary hover:bg-primary/90 rounded-full flex items-center gap-2">
                    <Navigation className="w-4 h-4" />
                    {t("contactUs.getDirections", "Get Directions")}
                  </Button>
                </a>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold uppercase tracking-wider text-foreground">
                  {t("contactUs.storeTimings", "Store Timings")}
                </h3>
                <div className="flex items-center gap-4 text-stone-600">
                  <Clock className="w-5 h-5 text-primary/70" />
                  <p>{t("contactUs.everyday", "Everyday: 11:00am - 8:00pm")}</p>
                </div>
              </div>
            </div>

            {/* Right Column: Image */}
            <div className="relative aspect-square md:aspect-[4/5] rounded-lg overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=1974&auto=format&fit=crop"
                alt="Woman receiving a facial treatment"
                fill
                className="object-cover"
                data-ai-hint="woman spa"
              />
            </div>
          </div>

          <div className="mt-12 max-w-2xl mx-auto">
            <div className="flex w-full rounded-full bg-stone-200 p-1 border border-stone-300/70 shadow-sm">
              <div className="flex-1">
                <Button
                  onClick={() => handleAuthAction(() => router.push("#book"))}
                  className="w-full rounded-full bg-primary hover:bg-primary/90 px-8 py-3 text-base h-auto"
                >
                  {t("contactForm.bookAppointmentBtn", "Book Appointment")}
                </Button>
                {AuthGuardComponent}
              </div>
              <Link href="#faq" className="flex-1">
                <Button variant="ghost" className="w-full rounded-full px-8 py-3 text-stone-700 hover:bg-stone-300/50 text-base h-auto">{t("contactUs.gotAQuestion", "Got a Question?")}</Button>
              </Link>
            </div>
          </div>

        </div>
      </div>

      <div className="py-20">
        <div className="container px-4">
          <div className="max-w-2xl mx-auto scroll-mt-24" id="book">
            <ContactForm />
          </div>
        </div>
      </div>

      <Faq />
      {/* InstagramFeed removed */}
    </div>
  );
}
