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
import { QuickContactForm } from "@/components/quick-contact-form";
import type { ChiotPublic } from "@/lib/puppies";
import { Link } from "@/i18n/navigation";
import { siteConfig } from "@/lib/site";

type Props = { featuredPuppies: ChiotPublic[]; upcomingLitters: ChiotPublic[] };

export async function PremiumHome({ featuredPuppies, upcomingLitters }: Props) {
  const tCta = await getTranslations("ctaMid");
  const tContact = await getTranslations("contactFormSection");

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

      <section id="contact" className="border-t border-stone-200/80 bg-white py-20 sm:py-28" aria-labelledby="contact-form-title">
        <div className="mx-auto grid max-w-6xl gap-14 px-4 sm:px-6 lg:grid-cols-2 lg:gap-20">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-stone-500">{tContact("eyebrow")}</p>
            <h2 id="contact-form-title" className="font-display mt-3 text-3xl font-medium text-ink-900 sm:text-4xl">
              {tContact("title")}
            </h2>
            <p className="mt-4 text-stone-600">{tContact("body")}</p>
            <p className="mt-6 text-sm text-stone-500">
              <a href={`mailto:${siteConfig.contactEmail}`} className="font-medium text-ink-900 underline-offset-4 hover:underline">
                {siteConfig.contactEmail}
              </a>
            </p>
          </div>
          <div className="rounded-2xl border border-stone-100 bg-cream-50 p-6 sm:p-8">
            <QuickContactForm />
          </div>
        </div>
      </section>
    </>
  );
}
