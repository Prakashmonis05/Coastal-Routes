import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import RouteDetailView from "@/components/routes/RouteDetailView";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { SITE_URL } from "@/lib/constants/seo";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const route = await prisma.route.findUnique({
    where: { id },
    include: { startingPoint: true, destination: true },
  });

  if (!route) {
    return {
      title: "Route Not Found - Mangalore Bus Routes",
      description: "The requested Mangalore bus route could not be found.",
    };
  }

  const title = `Bus ${route.busNumber} Route Mangalore (${route.startingPoint.name} to ${route.destination.name}) | Mangalore Private Bus`;
  const description = `Mangalore Bus ${route.busNumber} route information, stop list from ${route.startingPoint.name} to ${route.destination.name}, intermediate stops, and bus sequence. Check route timings and stops in Mangaluru.`;

  return {
    title,
    description,
    keywords: [
      `Bus ${route.busNumber} Mangalore`,
      `Mangalore bus ${route.busNumber}`,
      `${route.startingPoint.name} to ${route.destination.name} bus`,
      `Mangalore private bus ${route.busNumber}`,
      "Mangalore bus routes",
      "Mangalore private buses",
      "Mangalore city bus stops",
    ],
    alternates: {
      canonical: `/routes/${id}`,
    },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/routes/${id}`,
      type: "website",
      siteName: "Coastal Routes - Mangalore Bus Routes",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function RouteDetailsPage({ params }) {
  const { id } = await params;

  const route = await prisma.route.findUnique({
    where: { id },
    include: {
      startingPoint: true,
      destination: true,
      routeStops: {
        include: {
          stop: {
            include: {
              aliases: true,
            },
          },
        },
        orderBy: {
          stopOrder: "asc",
        },
      },
    },
  });

  if (!route) {
    notFound();
  }

  const busTripSchema = {
    "@context": "https://schema.org",
    "@type": "BusTrip",
    busName: `Mangalore Bus ${route.busNumber}${route.routeName ? ` - ${route.routeName}` : ""}`,
    busNumber: route.busNumber,
    departureStation: {
      "@type": "BusStation",
      name: `${route.startingPoint.name}, Mangalore`,
    },
    arrivalStation: {
      "@type": "BusStation",
      name: `${route.destination.name}, Mangalore`,
    },
    description: `Mangalore private bus ${route.busNumber} connecting ${route.startingPoint.name} and ${route.destination.name} with ${route.routeStops.length} sequential stops in Mangaluru.`,
    provider: {
      "@type": "Organization",
      name: "Mangalore City & Private Bus Services",
      url: SITE_URL,
    },
    itinerary: route.routeStops.map((rs) => ({
      "@type": "BusStop",
      name: rs.stop.name,
      position: rs.stopOrder,
    })),
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(busTripSchema) }}
      />
      <main className="flex-1">
        <RouteDetailView route={route} />
      </main>
      <Footer />
    </div>
  );
}
