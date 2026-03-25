import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import BookNowButton from "@/components/ui/book-now-button";
import LeadsForm from "@/components/sections/leads-form";

// This would typically come from a CMS or database
const treatmentsData: Record<string, { title: string; description: string; details: string; benefits: string[]; image: string; price: string; duration: string }> = {
    "laser-hair-removal": {
        title: "Laser Hair Removal",
        description: "Experience smooth, hair-free skin with our advanced laser technology.",
        details: "Our medical-grade lasers target hair follicles to permanently reduce hair growth. Safe for all skin types, our technology ensures effective results with minimal discomfort. Say goodbye to shaving and waxing forever.",
        benefits: ["Permanent hair reduction", "Safe for all skin types", "Quick and comfortable sessions", "Prevents ingrown hairs"],
        image: "/Laser-Hair-Removal.jpg",
        price: "150",
        duration: "45 min"
    },
    "laser-skin-care": {
        title: "Laser Skin Care",
        description: "Revitalize your complexion and reduce signs of aging.",
        details: "Using advanced light energy, this treatment stimulates collagen production, reduces redness, and fades pigmentation. It's a non-invasive solution for a more youthful, radiant complexion with no downtime.",
        benefits: ["Stimulates collagen", "Reduces fine lines", "Evens skin tone", "No downtime"],
        image: "/rejuvenation.png",
        price: "250",
        duration: "60 min"
    },
    "chemical-peel": {
        title: "Chemical Peel",
        description: "Exfoliate and renew your skin for a brighter, smoother texture.",
        details: "Our customized chemical peels remove dead skin cells to reveal fresh, healthy skin. Whether you're treating acne, pigmentation, or dullness, we have a peel formulation tailored to your specific needs.",
        benefits: ["Deep exfoliation", "Brightens complexion", "Treats acne and scars", "Smoothes texture"],
        image: "/peels.jpg",
        price: "200",
        duration: "60 min"
    },
    "micropeeling": {
        title: "Micropeeling DP4",
        description: "Stimulate collagen production for firmer, more youthful skin.",
        details: "The Dermapen 4 is the gold standard in microneedling. It creates millions of fine fractional channels to rejuvenate the skin and carry active nutrients deeper. Excellent for scarring, wrinkles, and texture.",
        benefits: ["Boosts collagen", "Reduces acne scars", "Tightens skin", "Improves texture"],
        image: "/dp4.jpg",
        price: "290",
        duration: "60 min"
    }
};

export default async function TreatmentPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const treatment = treatmentsData[slug];

    if (!treatment) {
        notFound();
    }

    return (
        <div className="bg-white min-h-screen pb-20">
            {/* Hero */}
            <div className="relative h-[60vh] bg-stone-100">
                <img
                    src={treatment.image}
                    alt={treatment.title}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/20" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <h1 className="text-5xl font-bold font-headline text-white text-center px-4">
                        {treatment.title}
                    </h1>
                </div>
            </div>

            <div className="container px-4 py-12">
                <Link href="/treatments" className="inline-flex items-center text-sm text-stone-500 hover:text-stone-900 transition-colors mb-8 uppercase tracking-wider">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to Treatments
                </Link>

                <div className="grid md:grid-cols-3 gap-12">
                    <div className="md:col-span-2 space-y-8">
                        <div>
                            <h2 className="text-4xl font-bold font-headline text-primary mb-4">About the Treatment</h2>
                            <p className="text-lg text-stone-600 leading-relaxed">
                                {treatment.details}
                            </p>
                        </div>

                        <div>
                            <h2 className="text-4xl font-bold font-headline text-primary mb-4">Benefits</h2>
                            <ul className="grid sm:grid-cols-2 gap-4">
                                {treatment.benefits.map((benefit, index) => (
                                    <li key={index} className="flex items-center text-stone-600">
                                        <span className="w-1.5 h-1.5 bg-primary rounded-full mr-3" />
                                        {benefit}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className="bg-stone-50 p-8 h-fit border border-stone-100 sticky top-24">
                        <h3 className="text-2xl font-bold font-headline text-primary mb-2">Ready to Glow?</h3>
                        <p className="text-stone-500 mb-6 text-sm">
                            Book your consultation today and let our experts guide you to your best skin.
                        </p>
                        <BookNowButton
                            treatmentName={treatment.title}
                            price={treatment.price}
                            duration={treatment.duration}
                            className="w-full uppercase tracking-widest py-6 bg-primary hover:bg-primary/90"
                        />
                    </div>
                </div>
            </div>
            <LeadsForm />
        </div>
    );
}
