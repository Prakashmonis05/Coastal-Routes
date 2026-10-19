import prisma from "@/lib/prisma";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import RouteListFilter from "@/components/routes/RouteListFilter";
import { Bus } from "lucide-react";
import { SITE_URL } from "@/lib/constants/seo";

export const metadata = {
  title: "Mangalore Bus Routes - All Private & City Bus Numbers | Coastal Routes",
  description:
    "Browse the complete directory of Mangalore private buses and city bus routes. Check bus numbers, origin-destination terminals, and full intermediate stops.",
  keywords: [
    "mangalore bus routes",
    "mangalore private buses",
    "mangalore bus numbers",
    "all mangalore bus routes",
    "mangaluru city bus directory",
    "state bank bus routes list",
    "surathkal bus routes",
    "kankanady bus numbers",
  ],
  alternates: {
    canonical: "/routes",
  },
};

export default async function RoutesPage() {
  const routes = await prisma.route.findMany({
    where: { isActive: true },
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

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Mangalore Bus Routes & Private Buses Directory",
    description: "Complete list of scheduled city and private bus routes in Mangalore, Karnataka.",
    itemListElement: routes.slice(0, 50).map((r, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: `Bus ${r.busNumber}: ${r.startingPoint.name} to ${r.destination.name}`,
      url: `${SITE_URL}/routes/${r.id}`,
    })),
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <div className="flex items-center gap-2 text-red-600 font-bold text-xs uppercase tracking-wider mb-1">
            <Bus className="w-4 h-4" />
            Mangalore Transit Directory
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            All Mangalore Bus Routes &amp; Private Buses
          </h1>
          <p className="text-sm font-medium text-gray-700 mt-1 max-w-3xl">
            Browse through all {routes.length} active scheduled Mangalore private buses and
            city bus routes. Select any bus number to view its verified stop-by-stop sequence,
            intermediate stops, and return route.
          </p>
        </div>

        <RouteListFilter initialRoutes={routes} />
      </main>
      <Footer />
    </div>
  );
}
