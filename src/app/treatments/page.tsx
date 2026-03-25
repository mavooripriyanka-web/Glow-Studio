"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Clock, Sparkles, CheckCircle2 } from "lucide-react";
import LeadsForm from '@/components/sections/leads-form';
import Faq from "@/components/sections/faq";
import InstagramFeed from "@/components/sections/instagram-feed";
import { useLanguage } from "@/context/language-context";

export default function TreatmentsPage() {
  const { t } = useLanguage();

  const treatments = [
    {
      title: t("services.LaserHairRemoval", "Laser Hair Removal"),
      duration: "45 min",
      description: t("treatmentsPage.laserHairRemovalDesc", "Experience smooth, hair-free skin with our advanced laser technology. Safe, effective, and suitable for all skin types."),
      subServices: [t("services.FaceNeck", "Face & Neck"), t("services.UpperBody", "Upper Body"), t("services.LowerBody", "Lower Body"), t("services.LaserAreasMen", "Laser Areas for Men"), t("services.ComboPacks", "Combo Packs")],
      href: "/treatments/laser-hair-removal",
      image: "/Laser-Hair-Removal.jpg"
    },
    {
      title: t("services.Micropeeling", "Micropeeling DP4 (Dermapen 4)"),
      duration: "Dermapen 4",
      description: t("treatmentsPage.micropeelingDesc", "Stimulate collagen production for firmer, more youthful skin. Reduces fine lines, acne scars, and improves texture."),
      subServices: [t("services.Face", "Face"), t("services.Neck", "Neck"), t("services.Decollete", "Décolleté"), t("services.FullBack", "Full back"), t("services.JellyMaskAddon", "Jelly mask add-on")],
      href: "/treatments/micropeeling",
      image: "/microneedling-pen.jpg"
    },
    {
      title: t("services.Facials", "Facials"),
      duration: "60–90 min",
      description: t("treatmentsPage.facialsDesc", "Customized facials to cleanse, hydrate, and nourish your skin. Tailored to your specific skin concerns for a radiant glow."),
      subServices: [t("services.DermaplaningClassic", "Dermaplaning & Classic Facial"), t("services.HydraFacial", "Hydra facial"), t("services.DeepCleansingLED", "Deep Cleansing Facial with LED Therapy"), t("services.GlowJellyMask", "Glow Jelly Mask Facial")],
      href: "/treatments/facials",
      image: "/face.jpg"
    },
    {
      title: t("services.LaserSkinCare", "Laser Skin Care"),
      duration: "60 min",
      description: t("treatmentsPage.laserSkinCareDesc", "Revitalize your complexion and reduce signs of aging. Targets pigmentation, sun damage, and uneven skin tone."),
      subServices: [t("services.SkinTightening", "Skin Tightening"), t("services.PigmentRemoval", "Pigment Removal")],
      href: "/treatments/laser-skin-care",
      image: "/rejuvenation.png"
    },
    {
      title: t("services.ChemicalPeel", "Chemical Peel"),
      duration: "60 min",
      description: t("treatmentsPage.chemicalPeelDesc", "Exfoliate and renew your skin for a brighter, smoother texture. Effective for acne, hyperpigmentation, and dullness."),
      subServices: [t("services.PerfectDermaPeel", "The Perfect Derma Peel"), t("services.BioRePeel", "BioRePeel")],
      href: "/treatments/chemical-peel",
      image: "/peels.jpg"
    },
    {
      title: t("services.BodySculpting", "Body Sculpting"),
      duration: "30–45 min per session",
      description: t("treatmentsPage.bodySculptingDesc", "Contour and shape your body with our non-invasive treatments. Target stubborn fat and tone muscles effortlessly."),
      subServices: [t("services.Cavitation", "Cavitation"), t("services.RadioFrequency", "Radio frequency"), t("services.VacuumTherapy", "Vacuum therapy"), t("services.Lipolysis", "Lipolysis"), t("services.EMS", "Electrical Muscle Stimulation"), t("services.SaunaBlanket", "Sauna blanket")],
      href: "/treatments/body-sculpting",
      image: "https://images.unsplash.com/photo-1519415387722-a1c3bbef716c?q=80&w=2070&auto=format&fit=crop"
    },
    {
      title: t("services.LipBlush", "Lip Blush"),
      duration: "3 hours",
      description: t("treatmentsPage.lipBlushDesc", "Enhance your natural lip color and shape with semi-permanent makeup. Wake up with perfectly tinted lips every day."),
      subServices: [t("services.DarkLipsNeutralisation", "Dark Lips Neutralisation"), t("services.AnnualColourRefresh", "Annual Colour Refresh"), t("services.MelaninRichLips", "Melanin-Rich Lips Neutralization")],
      href: "/treatments/lip-blush",
      image: "/lip.jpg"
    }
  ];

  return (
    <div className="bg-stone-50 min-h-screen pb-20 relative overflow-hidden">
      {/* Ambient Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-200/30 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute top-[20%] right-[-10%] w-[30%] h-[30%] bg-pink-200/30 rounded-full blur-[100px] animate-pulse delay-700" />
        <div className="absolute bottom-[-10%] left-[20%] w-[50%] h-[50%] bg-blue-100/30 rounded-full blur-[100px] animate-pulse delay-1000" />
      </div>

      {/* Hero Section with Parallax */}
      <div className="relative h-[60vh] flex items-center justify-center overflow-hidden bg-stone-900 bg-fixed bg-cover bg-center" style={{ backgroundImage: "url('/rejuvenation.png')" }}>
        <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-stone-900/90" />

        <div className="container relative z-10 text-center space-y-6 px-4 animate-in fade-in zoom-in duration-1000 slide-in-from-bottom-10">
          <div className="inline-block border border-white/20 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full mb-4">
            <span className="text-xs font-medium uppercase tracking-[0.2em] text-white">{t("treatmentsPage.premiumCare", "Premium Care")}</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-light uppercase tracking-widest font-serif text-transparent bg-clip-text bg-gradient-to-r from-white via-stone-200 to-stone-400 drop-shadow-sm">
            {t("treatmentsPage.ourTreatments", "Our Treatments")}
          </h1>
          <p className="text-stone-200 max-w-2xl mx-auto text-lg md:text-xl font-light leading-relaxed">
            {t("treatmentsPage.discoverDesc", "Discover our range of advanced skincare solutions tailored to your unique needs.")}
          </p>
        </div>
      </div>

      <div className="container px-4 -mt-32 relative z-20">
        <div className="grid gap-12">
          {treatments.map((treatment, index) => (
            <div
              key={index}
              className="group relative bg-white/80 backdrop-blur-md rounded-[60px] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-700 border border-white/50 animate-in slide-in-from-bottom-12 fade-in duration-1000"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <Link href={treatment.href} className="absolute inset-0 z-0" aria-label={`View ${treatment.title}`} />
              <div className="grid md:grid-cols-2 gap-0 relative z-10 pointer-events-none">
                {/* Image Section */}
                <div className={`relative h-72 md:h-auto overflow-hidden ${index % 2 === 1 ? 'md:order-2' : ''}`}>
                  <img
                    src={treatment.image}
                    alt={treatment.title}
                    className="object-cover w-full h-full transition-transform duration-1000 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500" />
                  <div className="absolute bottom-4 left-4 md:bottom-8 md:left-8">
                    <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full flex items-center gap-2 shadow-lg transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                      <Sparkles className="w-4 h-4 text-yellow-500" />
                      <span className="text-xs font-bold uppercase tracking-wider text-stone-900">{t("treatmentsPage.premiumService", "Premium Service")}</span>
                    </div>
                  </div>
                </div>

                {/* Content Section */}
                <div className={`p-8 md:p-16 flex flex-col justify-center space-y-8 ${index % 2 === 1 ? 'md:order-1' : ''}`}>
                  <div className={`space-y-4 ${index % 2 === 1 ? 'flex flex-col items-end text-right' : 'text-left'}`}>
                    <h2 className="text-3xl md:text-4xl font-light uppercase tracking-wide font-serif text-blue-700 transition-all duration-300">
                      {treatment.title}
                    </h2>
                    <div className="flex items-center text-stone-500 text-sm uppercase tracking-wider gap-2 bg-stone-100/50 px-4 py-1.5 rounded-full w-fit border border-stone-200/50">
                      <Clock className="w-4 h-4" />
                      <span>{treatment.duration}</span>
                    </div>
                  </div>

                  <p className={`text-stone-600 leading-relaxed text-lg font-light ${index % 2 === 1 ? 'text-right' : 'text-left'}`}>
                    {treatment.description}
                  </p>

                  <div className={`space-y-4 ${index % 2 === 1 ? 'flex flex-col items-end' : ''}`}>
                    <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                      {index % 2 === 1 && <span className="w-8 h-[1px] bg-stone-300"></span>}
                      {t("treatmentsPage.availableServices", "Available Services")}
                      {index % 2 === 0 && <span className="w-8 h-[1px] bg-stone-300"></span>}
                    </h3>
                    <div className={`flex flex-wrap gap-3 ${index % 2 === 1 ? 'justify-end' : ''}`}>
                      {treatment.subServices.map((service, i) => (
                        <span key={i} className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-medium bg-stone-50 text-stone-600 border border-stone-200/60 hover:bg-stone-100 hover:border-stone-300 transition-colors cursor-default">
                          <CheckCircle2 className="w-3 h-3 mr-2 text-green-500/70" />
                          {service}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className={`pt-6 flex items-center gap-4 ${index % 2 === 1 ? 'justify-end' : ''} pointer-events-auto`}>
                    <Link href={treatment.href}>
                      <Button variant="default" className="pill-button relative z-20">
                        <span className="flex items-center gap-2">
                          {t("treatmentsPage.viewDetails", "View Details")}
                        </span>
                      </Button>
                    </Link>
                    <Link href={`${treatment.href}#book-appointment`}>
                      <Button variant="default" className="pill-button relative z-20">
                        {t("treatmentsPage.bookAppointmentBtn", "Book Appointment")}
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <LeadsForm />
      <Faq />
      {/* InstagramFeed removed */}
    </div>
  );
}
