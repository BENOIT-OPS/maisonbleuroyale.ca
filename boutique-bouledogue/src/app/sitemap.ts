import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { blogPosts, siteConfig } from "@/lib/site";
import { getAvailablePuppies } from "@/lib/puppies";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const puppies = await getAvailablePuppies("fr");
  const base = siteConfig.url.replace(/\/$/, "");
  const lastModified = new Date();

  const staticPaths = [
    "",
    "/chiots",
    "/blog",
    "/a-propos",
    "/reproducteurs",
    "/conditions-de-vente",
    "/livraison",
    "/faq",
    "/contact",
    "/reservation-acompte",
  ];
  const staticPages: MetadataRoute.Sitemap = [
    // Locale négociée sur la racine (hreflang x-default → / )
    {
      url: `${base}/`,
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
  ];

  for (const locale of routing.locales) {
    for (const path of staticPaths) {
      staticPages.push({
        url: `${base}/${locale}${path}`,
        lastModified,
        changeFrequency: "weekly",
        priority: path === "" ? 1 : 0.8,
      });
    }
  }

  const puppyPages: MetadataRoute.Sitemap = [];
  for (const locale of routing.locales) {
    for (const puppy of puppies) {
      puppyPages.push({
        url: `${base}/${locale}/chiots/${puppy.slug}`,
        lastModified,
        changeFrequency: "daily",
        priority: 0.9,
      });
    }
  }

  const blogPages: MetadataRoute.Sitemap = [];
  for (const locale of routing.locales) {
    for (const post of blogPosts) {
      blogPages.push({
        url: `${base}/${locale}/blog/${post.slug}`,
        lastModified: new Date(post.publishedAt),
        changeFrequency: "monthly",
        priority: 0.7,
      });
    }
  }

  return [...staticPages, ...puppyPages, ...blogPages];
}
