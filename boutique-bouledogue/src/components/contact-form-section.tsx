import { getTranslations } from "next-intl/server";
import { QuickContactForm } from "@/components/quick-contact-form";
import { siteConfig } from "@/lib/site";

/** Bloc formulaire + texte d’intro (identique à la section contact de l’accueil). */
export async function ContactFormSection() {
  const tContact = await getTranslations("contactFormSection");

  return (
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
  );
}
