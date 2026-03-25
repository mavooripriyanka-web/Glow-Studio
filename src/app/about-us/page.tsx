'use client';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Faq from '@/components/sections/faq';
import InstagramFeed from '@/components/sections/instagram-feed';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useLanguage } from '@/context/language-context';

export default function AboutUsPage() {
  const { t } = useLanguage();

  const treatments = [
    {
      title: t("services.LaserHairRemoval", "Laser Hair Removal"),
      href: "/treatments/laser-hair-removal",
      image: "/Laser-Hair-Removal.jpg"
    },
    {
      title: t("services.LaserSkinCare", "Laser Skin Care"),
      href: "/treatments/laser-skin-care",
      image: "/rejuvenation.png"
    },
    {
      title: t("services.Micropeeling", "Micropeeling DP4 (Dermapen 4)"),
      href: "/treatments/micropeeling",
      image: "/dp4.jpg"
    },
    {
      title: t("services.ChemicalPeel", "Chemical Peel"),
      href: "/treatments/chemical-peel",
      image: "/peels.jpg"
    },
    {
      title: t("services.Facials", "Facials"),
      href: "/treatments/facials",
      image: "/face.jpg"
    },
    {
      title: t("services.LipBlush", "Lip Blush"),
      href: "/treatments/lip-blush",
      image: "/lip.jpg"
    },
    {
      title: t("services.BodySculpting", "Body Sculpting"),
      href: "/treatments/body-sculpting",
      image: "https://images.unsplash.com/photo-1519415387722-a1c3bbef716c?q=80&w=2070&auto=format&fit=crop"
    }
  ];

  const heroImage = PlaceHolderImages.find(p => p.id === 'about-us-hero-woman');

  return (
    <div className="bg-[#FBF8F3] min-h-screen">
      <div className="bg-primary text-center pt-12 md:pt-20 pb-32 md:pb-40" style={{ borderBottomLeftRadius: '50% 30%', borderBottomRightRadius: '50% 30%' }}>
        <h1 className="text-5xl md:text-7xl font-bold text-white font-headline">{t("aboutUs.heroTitle", "Healthy Skin, Healthy Soul")}</h1>
      </div>

      <div className="container mx-auto px-4 -mt-24 md:-mt-32 relative z-10">
        <div className="relative w-40 h-40 md:w-56 md:h-56 mx-auto">
          {heroImage && (
            <Image
              src={heroImage.imageUrl}
              alt={heroImage.description}
              width={224}
              height={224}
              className="rounded-full object-cover shadow-2xl border-4 border-white"
              data-ai-hint={heroImage.imageHint}
            />
          )}
        </div>
      </div>

      <div className='py-12'>
        <div className="container mx-auto px-4">
          {/* Quote Section */}
          <section className="text-center max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold font-body text-blue-700 leading-relaxed">
              {t("aboutUs.quotePart1", "How you treat your skin reflects")}
              <br />
              {t("aboutUs.quotePart2", "How you feel in your soul.")}
            </h2>
            <div className="mt-8 flex items-center justify-center flex-wrap gap-3">
              <span className="bg-primary text-primary-foreground rounded-md px-4 py-1.5 text-sm font-semibold">
                {t("aboutUs.exceptionalSkincare", "Exceptional skincare")}
              </span>
              <p className="text-md text-muted-foreground">
                {t("aboutUs.quoteDescription", "starts with understanding your unique skin and innovating solutions that truly work.")}
              </p>
            </div>
          </section>



          {/* What is Lune Section */}
          <section className="py-12 md:py-20 text-center max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold font-headline text-primary mb-4">{t("aboutUs.whatIsLuneTitle", "What is Glow Studio?")}</h2>
            <p className="text-xl font-semibold text-foreground mb-6">
              {t("aboutUs.whatIsLuneSubtitle", "Personalized care for the skin that's uniquely yours.")}
            </p>
            <p className="text-muted-foreground leading-relaxed">
              {t("aboutUs.whatIsLuneDescription", "At Lune, we combine advanced technology with personalized care to treat and enhance your skin from within. Our expert-led treatments target concerns like aging, pigmentation, acne, and dullness—delivering visible results with comfort and confidence.")}
            </p>
          </section>

          {/* Treatments and Future of Skincare Section */}
          <section className="py-12 md:py-20">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-4xl font-bold font-headline text-primary mb-12 text-center">{t("aboutUs.treatmentsTitle", "Treatments we provide")}</h2>
              <div className="grid md:grid-cols-2 gap-16 items-center">
                {/* Left Column: Treatments List */}
                <div className="space-y-4">
                  {treatments.map((treatment) => (
                    <Link href={treatment.href} key={treatment.title}>
                      <div className="group flex items-center justify-between p-4 border-b border-stone-200 hover:bg-stone-100/50 transition-colors cursor-pointer">
                        <div className="flex items-center gap-4">
                          <div className="relative w-16 h-12 rounded-md overflow-hidden">
                            <Image src={treatment.image} alt={treatment.title} fill className="object-cover" />
                          </div>
                          <span className="font-semibold text-lg text-foreground">{treatment.title}</span>
                        </div>
                        <div className="w-8 h-8 rounded-full border border-stone-300 flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-colors">
                          <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-white" />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Right Column: Images */}
                <div className="flex gap-4">
                  <div className="relative w-1/2 aspect-[3/4] rounded-2xl overflow-hidden shadow-lg transform -rotate-3 transition-transform hover:rotate-0 hover:scale-105">
                    <Image
                      src="https://images.unsplash.com/photo-1574825227538-353d9943807a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwyfHxzb2xhcml1bXxlbnwwfHx8fDE3NjkzODQ1MjN8MA&ixlib-rb-4.1.0&q=80&w=1080"
                      alt="Woman in protective eyewear receiving a treatment."
                      fill
                      className="object-cover"
                      data-ai-hint="spa treatment"
                    />
                  </div>
                  <div className="relative w-1/2 aspect-[3/4] rounded-2xl overflow-hidden shadow-lg transform rotate-3 transition-transform hover:rotate-0 hover:scale-105 mt-8">
                    <Image
                      src="https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHx3b21hbiUyMHNwYXxlbnwwfHx8fDE3NjkzODQ1NDh8MA&ixlib-rb-4.1.0&q=80&w=1080"
                      alt="Woman lying down for a facial treatment"
                      fill
                      className="object-cover"
                      data-ai-hint="woman spa"
                    />
                  </div>
                </div>
              </div>

              {/* Future of Skincare */}
              <div className="mt-24 text-center max-w-3xl mx-auto">
                <h2 className="text-4xl font-bold font-headline text-primary mb-4">{t("aboutUs.futureTitle", "Future of Skincare")}</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {t("aboutUs.futureDescription", "The founders of Lune share a passion for skin health and innovation. With experience in dermatology, wellness, and aesthetics, they created science-backed, personalized treatments that deliver real results. Their goal is to help everyone feel confident in their skin through advanced, effective care.")}
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
      {/* InstagramFeed removed */}
      <Faq />
    </div>
  );
}
