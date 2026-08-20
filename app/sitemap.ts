import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";

export default function sitemap(): MetadataRoute.Sitemap {
  // Use a stable, meaningful lastModified date
  const lastModified = new Date("2026-08-20T00:00:00.000Z");

  return [
    {
      url: siteConfig.url,
      lastModified,
      changeFrequency: "monthly",
      priority: 1.0,
    },
  ];
}
