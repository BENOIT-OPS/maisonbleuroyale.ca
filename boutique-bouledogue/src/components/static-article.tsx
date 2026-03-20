import { SiteShell } from "@/components/site-shell";

type Props = {
  title: string;
  body: string;
};

/** Contenu éditorial : paragraphes séparés par une ligne vide dans les messages (\\n\\n). */
export function StaticArticle({ title, body }: Props) {
  const paragraphs = body.trim().split(/\n\n+/).filter(Boolean);

  return (
    <SiteShell>
      <article className="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-20">
        <h1 className="font-display text-3xl font-semibold text-ink-900 sm:text-4xl">{title}</h1>
        <div className="mt-10 space-y-6 text-base leading-relaxed text-stone-600">
          {paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </article>
    </SiteShell>
  );
}
