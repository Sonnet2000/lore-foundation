import type { MetadataRoute } from "next";

const SITE_URL = "https://www.lorefondation.com";

/**
 * Next.js jenere /robots.txt otomatikman ak fichye sa a.
 * Nou kite tout paj piblik yo ouvè, epi nou bloke sèlman
 * zòn prive/administratif ak API yo.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api", "/compte", "/auth"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
