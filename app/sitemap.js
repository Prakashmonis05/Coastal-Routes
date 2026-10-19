import prisma from "@/lib/prisma";
import { SITE_URL } from "@/lib/constants/seo";

export default async function sitemap() {
  let routeUrls = [];

  try {
    const routes = await prisma.route.findMany({
      where: { isActive: true },
      select: {
        id: true,
        updatedAt: true,
      },
    });

    routeUrls = routes.map((r) => ({
      url: `${SITE_URL}/routes/${r.id}`,
      lastModified: r.updatedAt ? new Date(r.updatedAt).toISOString() : new Date().toISOString(),
      changeFrequency: "weekly",
      priority: 0.8,
    }));
  } catch (err) {
    console.error("Error generating dynamic sitemap routes:", err);
  }

  const staticPages = [
    {
      url: `${SITE_URL}`,
      lastModified: new Date().toISOString(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/routes`,
      lastModified: new Date().toISOString(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/search`,
      lastModified: new Date().toISOString(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: new Date().toISOString(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/suggest-stop`,
      lastModified: new Date().toISOString(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/feedback`,
      lastModified: new Date().toISOString(),
      changeFrequency: "monthly",
      priority: 0.4,
    },
  ];

  return [...staticPages, ...routeUrls];
}
