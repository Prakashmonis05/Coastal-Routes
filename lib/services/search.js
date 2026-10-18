import prisma from "@/lib/prisma";
import { normalizeName } from "@/lib/utils/string";

/**
 * Search routes by bus number (case-insensitive)
 */
export async function searchByBusNumber(query) {
  const cleanQuery = query.trim();
  if (!cleanQuery) return [];

  const routes = await prisma.route.findMany({
    where: {
      isActive: true,
      busNumber: {
        contains: cleanQuery,
        mode: "insensitive",
      },
    },
    include: {
      startingPoint: true,
      destination: true,
      _count: {
        select: { routeStops: true },
      },
    },
    orderBy: {
      busNumber: "asc",
    },
  });

  return routes.map((r) => ({
    id: r.id,
    busNumber: r.busNumber,
    routeName: r.routeName,
    startingPoint: r.startingPoint.name,
    destination: r.destination.name,
    stopCount: r._count.routeStops,
    description: r.description,
  }));
}

/**
 * Search routes that connect a starting point and destination in the correct sequence.
 * The destination stop must occur AFTER the starting stop in the route's stop sequence.
 */
export async function searchByStartAndDestination(fromQuery, toQuery) {
  const normFrom = normalizeName(fromQuery);
  const normTo = normalizeName(toQuery);

  if (!normFrom || !normTo) return [];

  // Find matching stop IDs for 'from' (via official name or alias)
  const fromStops = await prisma.stop.findMany({
    where: {
      isActive: true,
      OR: [
        { normalizedName: { contains: normFrom } },
        { aliases: { some: { normalizedAlias: { contains: normFrom } } } },
      ],
    },
    select: { id: true, name: true },
  });

  // Find matching stop IDs for 'to'
  const toStops = await prisma.stop.findMany({
    where: {
      isActive: true,
      OR: [
        { normalizedName: { contains: normTo } },
        { aliases: { some: { normalizedAlias: { contains: normTo } } } },
      ],
    },
    select: { id: true, name: true },
  });

  if (fromStops.length === 0 || toStops.length === 0) {
    return [];
  }

  const fromIds = fromStops.map((s) => s.id);
  const toIds = toStops.map((s) => s.id);

  // Find active routes containing both stops where stopOrder of from < stopOrder of to
  const matchingRoutes = await prisma.route.findMany({
    where: {
      isActive: true,
      routeStops: {
        some: { stopId: { in: fromIds } },
      },
      AND: {
        routeStops: {
          some: { stopId: { in: toIds } },
        },
      },
    },
    include: {
      startingPoint: true,
      destination: true,
      routeStops: {
        include: { stop: true },
        orderBy: { stopOrder: "asc" },
      },
    },
  });

  const validRoutes = [];

  for (const route of matchingRoutes) {
    // Find the first occurrence of any 'from' stop
    const fromIndex = route.routeStops.findIndex((rs) =>
      fromIds.includes(rs.stopId)
    );
    // Find any occurrence of 'to' stop that comes AFTER fromIndex
    const toIndex = route.routeStops.findIndex(
      (rs, idx) => idx > fromIndex && toIds.includes(rs.stopId)
    );

    if (fromIndex !== -1 && toIndex !== -1 && toIndex > fromIndex) {
      validRoutes.push({
        id: route.id,
        busNumber: route.busNumber,
        routeName: route.routeName,
        startingPoint: route.startingPoint.name,
        destination: route.destination.name,
        stopCount: route.routeStops.length,
        matchedFromStop: route.routeStops[fromIndex].stop.name,
        matchedToStop: route.routeStops[toIndex].stop.name,
        stopsInBetween: toIndex - fromIndex - 1,
        stops: route.routeStops.map((rs) => ({
          id: rs.stop.id,
          name: rs.stop.name,
          order: rs.stopOrder,
        })),
      });
    }
  }

  return validRoutes;
}

/**
 * Search bus stops by name or alias, including all routes that serve each stop.
 */
export async function searchByStopName(query) {
  const norm = normalizeName(query);
  if (!norm) return { stops: [], suggestions: [] };

  // 1. Direct and substring matches
  const directStops = await prisma.stop.findMany({
    where: {
      isActive: true,
      OR: [
        { normalizedName: { contains: norm } },
        { aliases: { some: { normalizedAlias: { contains: norm } } } },
      ],
    },
    include: {
      aliases: true,
      routeStops: {
        where: { route: { isActive: true } },
        include: {
          route: {
            include: {
              startingPoint: true,
              destination: true,
              _count: { select: { routeStops: true } },
            },
          },
        },
        orderBy: { stopOrder: "asc" },
      },
    },
  });

  if (directStops.length > 0) {
    return {
      stops: directStops.map((s) => ({
        id: s.id,
        name: s.name,
        description: s.description,
        aliases: s.aliases.map((a) => a.aliasName),
        routes: s.routeStops.map((rs) => ({
          id: rs.route.id,
          busNumber: rs.route.busNumber,
          routeName: rs.route.routeName,
          startingPoint: rs.route.startingPoint.name,
          destination: rs.route.destination.name,
          stopPosition: rs.stopOrder,
          totalStops: rs.route._count.routeStops,
        })),
      })),
      suggestions: [],
    };
  }

  // 2. If no direct match, execute pg_trgm fuzzy similarity search via raw query
  let suggestions = [];
  try {
    const rawSuggestions = await prisma.$queryRaw`
      SELECT s.id, s.name, similarity(s."normalizedName", ${norm}) AS sm
      FROM "Stop" s
      WHERE s."isActive" = true AND similarity(s."normalizedName", ${norm}) > 0.25
      ORDER BY sm DESC
      LIMIT 5;
    `;
    suggestions = rawSuggestions.map((r) => ({
      id: r.id,
      name: r.name,
      score: r.sm,
    }));
  } catch (err) {
    console.error("Fuzzy pg_trgm error:", err);
  }

  return {
    stops: [],
    suggestions,
  };
}

/**
 * Universal search helper for header/hero search bar
 */
export async function universalSearch(query) {
  const clean = query.trim();
  if (!clean) return { routes: [], stops: [], suggestions: [] };

  // Search by bus number
  const routesByBus = await searchByBusNumber(clean);

  // Search by stop name
  const { stops, suggestions } = await searchByStopName(clean);

  return {
    routes: routesByBus,
    stops,
    suggestions,
  };
}
