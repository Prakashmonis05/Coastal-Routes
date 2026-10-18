import prisma from "@/lib/prisma";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import RouteListFilter from "@/components/routes/RouteListFilter";
import { Bus } from "lucide-react";

export const metadata = {
  title: "All Bus Routes - Coastal Routes",
  description: "Browse all available city bus routes, terminals, and stop sequences.",
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

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <div className="flex items-center gap-2 text-red-600 font-bold text-xs uppercase tracking-wider mb-1">
            <Bus className="w-4 h-4" />
            Transit Directory
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            All City Bus Routes
          </h1>
          <p className="text-sm font-medium text-gray-700 mt-1">
            Browse through all {routes.length} active scheduled city bus routes.
            Select any route to view its full stop-by-stop sequence.
          </p>
        </div>

        <RouteListFilter initialRoutes={routes} />
      </main>
      <Footer />
    </div>
  );
}
