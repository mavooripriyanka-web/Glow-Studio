'use client';

import Link from "next/link";
import Image from "next/image";
import { Instagram, Facebook, Mail, Phone } from "lucide-react";
import { useLanguage } from "@/context/language-context";

export function Footer() {
  const { t } = useLanguage();

  const treatments = [
    { href: "/treatments/laser-hair-removal", label: "Laser Hair Removal" },
    { href: "/treatments/laser-skin-care", label: "Laser Skin Care" },
    { href: "/treatments/micropeeling", label: "Micropeeling DP4 (Dermapen 4)" },
    { href: "/treatments/chemical-peel", label: "Chemical Peel" },
    { href: "/treatments/facials", label: "Facials" },
    { href: "/treatments/lip-blush", label: "Lip Blush" },
    { href: "/treatments/body-sculpting", label: "Body Sculpting" },
  ];

  const quickLinks = [
    { href: "/", label: t('nav.home') },
    { href: "/treatments", label: t('nav.treatments') },
    { href: "/about-us", label: t('nav.about') },
    { href: "/contact", label: t('nav.contact') },
  ];

  return (
    <footer className="relative bg-[#23325F] text-white overflow-hidden">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute z-0 w-full h-full object-cover"
      >
        <source src="/lune-logo-video.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-[#23325F] z-10"></div>
      <div className="container relative z-20 py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">

          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider">{t('footer.quickLinks')}</h4>
            <ul className="space-y-2 text-sm text-stone-300">
              {quickLinks.map(link => (
                <li key={link.href}><Link href={link.href} className="hover:text-white transition-colors">{link.label}</Link></li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider">{t('footer.exploreTreatments')}</h4>
            <ul className="space-y-2 text-sm text-stone-300">
              {treatments.map(treatment => (
                <li key={treatment.href}><Link href={treatment.href} className="hover:text-white transition-colors">{treatment.label}</Link></li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider">{t('footer.location')}</h4>
            <p className="text-sm text-stone-300">
              2098 Crescent St, Montreal,<br />
              Quebec H3G 2B8
            </p>
            <h4 className="text-sm font-semibold uppercase tracking-wider mt-8">{t('footer.timings')}</h4>
            <p className="text-sm text-stone-300">
              Everyday: 11:00am - 8:00pm
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider">{t('footer.contactInfo')}</h4>
            <ul className="space-y-2 text-sm text-stone-300">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0" />
                <a href="mailto:care@luneskincare.com" className="hover:text-white">care@glowstudio.com</a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0" />
                <a href="tel:+15147544499" className="hover:text-white">+1 514 754 4499</a>
              </li>
            </ul>
            <div className="flex gap-4 pt-2">
              <Link href="#" className="text-stone-300 hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="https://www.instagram.com/skincarebylune/" target="_blank" rel="noopener noreferrer" className="text-stone-300 hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
            </div>
          </div>

        </div>

        <div className="mt-16 pt-8 border-t border-stone-600/50 text-center text-sm text-stone-400">
          <div className="flex justify-center mb-8">
            <span className="text-2xl font-headline font-bold text-white tracking-tighter">Glow Studio</span>
          </div>
          <p>{t('footer.copyright')} <a href="#" className="underline hover:text-white">AxirData</a></p>
        </div>
      </div>
    </footer >
  );
}
