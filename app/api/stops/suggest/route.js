import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { normalizeName } from "@/lib/utils/string";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const q = (searchParams.get("q") || "").trim();

  if (!q || q.length < 1) {
    return NextResponse.json({ suggestions: [] });
  }

  const norm = normalizeName(q);

  try {
    // 1. Direct search by official name, normalized name, or aliases
    const stops = await prisma.stop.findMany({
      where: {
        isActive: true,
        OR: [
          { name: { contains: q, mode: "insensitive" } },
          { normalizedName: { contains: norm } },
          {
            aliases: {
              some: {
                OR: [
                  { aliasName: { contains: q, mode: "insensitive" } },
                  { normalizedAlias: { contains: norm } },
                ],
              },
            },
          },
        ],
      },
      include: {
        aliases: {
          select: { aliasName: true, normalizedAlias: true },
        },
      },
      take: 15,
    });

    // Score and rank matches
    const ranked = stops
      .map((stop) => {
        const normName = stop.normalizedName;
        let score = 0;
        let matchedAlias = null;

        if (normName === norm) {
          score = 100;
        } else if (normName.startsWith(norm)) {
          score = 80;
        } else if (normName.includes(norm)) {
          score = 60;
        }

        // Check aliases
        for (const a of stop.aliases) {
          const normA = a.normalizedAlias;
          if (normA === norm) {
            score = Math.max(score, 90);
            matchedAlias = a.aliasName;
          } else if (normA.startsWith(norm)) {
            score = Math.max(score, 75);
            matchedAlias = a.aliasName;
          } else if (normA.includes(norm)) {
            score = Math.max(score, 50);
            matchedAlias = matchedAlias || a.aliasName;
          }
        }

        return {
          id: stop.id,
          name: stop.name,
          matchedAlias,
          score,
        };
      })
      .sort((a, b) => b.score - a.score || a.name.localeCompare(b.name))
      .slice(0, 8);

    if (ranked.length > 0) {
      return NextResponse.json({ suggestions: ranked });
    }

    // 2. Fuzzy fallback if pg_trgm is available
    try {
      const fuzzy = await prisma.$queryRaw`
        SELECT s.id, s.name, similarity(s."normalizedName", ${norm}) AS sm
        FROM "Stop" s
        WHERE s."isActive" = true AND similarity(s."normalizedName", ${norm}) > 0.2
        ORDER BY sm DESC
        LIMIT 6;
      `;
      const fuzzyResults = (fuzzy || []).map((f) => ({
        id: f.id,
        name: f.name,
        matchedAlias: null,
        isFuzzy: true,
      }));
      return NextResponse.json({ suggestions: fuzzyResults });
    } catch {
      return NextResponse.json({ suggestions: [] });
    }
  } catch (error) {
    console.error("Stop suggestion API error:", error);
    return NextResponse.json({ suggestions: [] });
  }
}
