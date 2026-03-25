'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { useLanguage } from '@/context/language-context';

export default function Faq() {
  const { t } = useLanguage();

  const faqs = [
    {
      question: t("faq.q1", "What skin concerns do your treatments address?"),
      answer: t("faq.a1", "Our treatments target a range of concerns including acne, pigmentation, fine lines, wrinkles, uneven texture, enlarged pores, and dullness."),
    },
    {
      question: t("faq.q2", "Is there any downtime after treatments?"),
      answer: t("faq.a2", "Downtime varies by treatment, but most aesthetic procedures have minimal to no downtime. You might experience mild redness, swelling, or sensitivity for a day or two. Some treatments, like deep chemical peels or micropeeling, may require a few days of recovery. Always follow post-care instructions for the best results."),
    },
    {
      question: t("faq.q3", "How do I know which treatment is right for me?"),
      answer: t("faq.a3", "We will assess your skin type, concerns, goals, and medical history to recommend the most suitable options. Personalized consultations ensure safe, effective results tailored to your needs."),
    },
    {
      question: t("faq.q4", "Are your treatments suitable for all skin types?"),
      answer: t("faq.a4", "Yes, many of our treatments are suitable for all skin types, including sensitive and deeper skin tones. However, certain procedures may need to be adjusted based on your skin's unique needs. Our consultation helps ensure the treatment is safe, effective, and tailored to your skin type."),
    },
    {
      question: t("faq.q5", "Are your treatments painful?"),
      answer: t("faq.a5", "Most of our treatments are not painful and are generally well-tolerated. You may feel mild discomfort like tingling, warmth, or a light prickling sensation, depending on the procedure. For more sensitive treatments, cooling pads or gels are applied to ensure comfort throughout the session."),
    },
  ];

  return (
    <section id="faq" className="w-full pt-6 md:pt-12 lg:pt-16 pb-12 md:pb-24 lg:pb-32 bg-[#FBF8F3]">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold tracking-tighter font-headline text-primary sm:text-4xl">
            {t("faq.title", "FAQs")}
          </h2>
        </div>
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible defaultValue="item-0">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-lg font-medium text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-base text-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
