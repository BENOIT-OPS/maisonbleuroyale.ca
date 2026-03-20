import { getTranslations, setRequestLocale } from "next-intl/server";
import { SiteShell } from "@/components/site-shell";
import { Link } from "@/i18n/navigation";
import { blogPosts } from "@/lib/site";

type Props = { params: Promise<{ locale: string }> };

export default async function BlogPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "blogPage" });

  return (
    <SiteShell>
      <section className="container-premium py-14">
        <h1 className="mb-8 text-4xl font-semibold">{t("title")}</h1>
        <div className="grid gap-5 md:grid-cols-2">
          {blogPosts.map((post) => (
            <article key={post.slug} className="rounded-2xl border border-[#dccdb5] bg-white p-6">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs uppercase tracking-[0.15em] text-[#7d715f]">
                {post.category ? (
                  <span className="font-semibold text-[#8c6a3f]">{post.category}</span>
                ) : null}
                {post.category ? <span aria-hidden>·</span> : null}
                <span>{post.publishedAt}</span>
              </div>
              <h2 className="mt-2 text-2xl font-semibold">{post.title}</h2>
              <p className="mt-2 text-[#6f6454]">{post.excerpt}</p>
              <Link href={`/blog/${post.slug}`} className="mt-3 inline-block text-[#8c6a3f] hover:underline">
                {t("read")}
              </Link>
            </article>
          ))}
        </div>
      </section>
    </SiteShell>
  );
}
