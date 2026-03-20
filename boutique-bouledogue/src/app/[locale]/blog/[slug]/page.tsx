import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { SiteShell } from "@/components/site-shell";
import { blogPosts } from "@/lib/site";

type Props = { params: Promise<{ locale: string; slug: string }> };

export default async function BlogDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const post = blogPosts.find((item) => item.slug === slug);
  if (!post) return notFound();

  return (
    <SiteShell>
      <article className="container-premium py-14">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs uppercase tracking-[0.15em] text-[#7d715f]">
          {post.category ? <span className="font-semibold text-[#8c6a3f]">{post.category}</span> : null}
          {post.category ? <span aria-hidden>·</span> : null}
          <span>{post.publishedAt}</span>
        </div>
        <h1 className="mt-2 max-w-3xl text-4xl font-semibold">{post.title}</h1>
        <div className="mt-6 max-w-3xl space-y-6 text-lg leading-8 text-[#4f473d]">
          {post.content
            .trim()
            .split(/\n\n+/)
            .map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
        </div>
      </article>
    </SiteShell>
  );
}
