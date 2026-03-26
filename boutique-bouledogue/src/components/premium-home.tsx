import { getTranslations } from "next-intl/server";
import { HomeHeroPremium } from "@/components/home-hero-premium";
import {
  AdoptionStepsSection,
  CanadianBreedsSection,
  ContactStripSection,
  FaqAccueilSection,
  FeaturedPuppiesSection,
  ReassuranceSection,
  UpcomingLittersSection,
  Testimonials100Section,
  WhyChooseSection,
} from "@/components/home/sections";
import { ContactFormSection } from "@/components/contact-form-section";
import type { ChiotPublic } from "@/lib/puppies";
import { Link } from "@/i18n/navigation";

type Props = { featuredPuppies: ChiotPublic[]; upcomingLitters: ChiotPublic[] };

export async function PremiumHome({ featuredPuppies, upcomingLitters }: Props) {
  const tCta = await getTranslations("ctaMid");

  return (
    <>
      <HomeHeroPremium />

      <ReassuranceSection />

      <FeaturedPuppiesSection chiots={featuredPuppies} />

      <UpcomingLittersSection chiots={upcomingLitters} />

      <CanadianBreedsSection />

      <WhyChooseSection />

      <section className="border-t border-stone-200/80 bg-ink-900 py-20 text-cream-50 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 text-center sm:px-6">
          <h2 className="font-display text-2xl font-medium sm:text-3xl">{tCta("title")}</h2>
          <p className="mx-auto mt-3 max-w-lg text-sm text-stone-400">{tCta("subtitle")}</p>
          <Link
            href="/chiots"
            className="mt-8 inline-flex rounded-full bg-cream-50 px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.12em] text-ink-900 transition-opacity hover:opacity-90"
          >
            {tCta("button")}
          </Link>
        </div>
      </section>

      <AdoptionStepsSection />

      <Testimonials100Section />

      <FaqAccueilSection />

      <ContactStripSection />

      <ContactFormSection />
    </>
  );
}
