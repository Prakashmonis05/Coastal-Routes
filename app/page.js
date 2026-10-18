import Link from "next/link";
import prisma from "@/lib/prisma";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroSearch from "@/components/home/HeroSearch";
import RouteCard from "@/components/routes/RouteCard";
import {
  Bus,
  Search,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  MapPin,
  Clock,
  Compass,
} from "lucide-react";

export const metadata = {
  title: "City Bus Route Finder - Coastal Routes",
  description:
    "Find your bus, know your route. Search city bus numbers, discover intermediate stops, and get full sequential route schedules.",
};

export default async function HomePage() {
  // Fetch popular / active routes from database
  const [popularRoutes, popularStops, totalRoutesCount] = await Promise.all([
    prisma.route.findMany({
      where: { isActive: true },
      take: 6,
      include: {
        startingPoint: true,
        destination: true,
        _count: { select: { routeStops: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.stop.findMany({
      where: { isActive: true },
      take: 5,
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
    prisma.route.count({ where: { isActive: true } }),
  ]);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative bg-gradient-to-b from-red-50/40 via-white to-gray-50/50 py-16 sm:py-24 border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-100 text-red-700 text-xs font-bold uppercase tracking-wider mb-6">
              <Bus className="w-4 h-4" />
              City Bus Route Finder
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold text-gray-900 tracking-tight max-w-3xl mx-auto leading-tight">
              Find Your Bus. <br className="hidden sm:inline" />
              <span className="text-red-600">Know Your Route.</span>
            </h1>

            <p className="mt-4 sm:mt-6 text-base sm:text-xl text-gray-600 max-w-2xl mx-auto font-normal">
              Search city bus routes, discover bus stops, and find the right bus
              for your journey with full sequential stop order.
            </p>

            <div className="mt-8 sm:mt-10">
              <HeroSearch commonStops={popularStops} popularRoutes={popularRoutes} />
            </div>

            <div className="mt-6 flex items-center justify-center gap-6 text-xs text-gray-500">
              <span className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-green-600" />
                Verified Stop Sequences
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-green-600" />
                Fuzzy Spelling Support
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-green-600" />
                Direction-Aware Routing
              </span>
            </div>
          </div>
        </section>

        {/* POPULAR / FEATURED ROUTES SECTION */}
        <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-red-600 mb-1">
                Featured Transit Links
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                Popular City Bus Routes
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Frequently travelled corridors and key connecting lines across the city.
              </p>
            </div>
            {totalRoutesCount > 0 && (
              <Link
                href="/routes"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-red-600 hover:text-red-700 transition"
              >
                Browse All {totalRoutesCount} Routes <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </div>

          {popularRoutes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {popularRoutes.map((route) => (
                <RouteCard key={route.id} route={route} />
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-12 text-center max-w-lg mx-auto">
              <div className="w-12 h-12 rounded-xl bg-gray-200 text-gray-500 flex items-center justify-center mx-auto mb-3">
                <Bus className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">
                No routes available yet
              </h3>
              <p className="text-sm text-gray-500">
                The transit database is currently empty. Bus routes will appear here once
                added by administrators.
              </p>
            </div>
          )}
        </section>

        {/* HOW IT WORKS SECTION */}
        <section className="py-16 bg-gray-50 border-y border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-xs font-bold uppercase tracking-wider text-red-600">
                Simple &amp; Reliable
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-1">
                How It Works
              </h2>
              <p className="text-sm text-gray-500 mt-2">
                Designed to give daily passengers immediate answers in three simple steps.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Step 1 */}
              <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-xs relative">
                <div className="w-12 h-12 rounded-xl bg-red-600 text-white font-black text-lg flex items-center justify-center mb-5 shadow-xs">
                  1
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  Search for your bus
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Enter your bus number, origin and destination stops, or any landmark.
                  Our engine handles common typos and alternative stop names.
                </p>
              </div>

              {/* Step 2 */}
              <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-xs relative">
                <div className="w-12 h-12 rounded-xl bg-gray-900 text-white font-black text-lg flex items-center justify-center mb-5 shadow-xs">
                  2
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  Check route and stops
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  View the vertical stop sequence in exact travel order. Confirm whether
                  your bus moves in the forward or return direction.
                </p>
              </div>

              {/* Step 3 */}
              <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-xs relative">
                <div className="w-12 h-12 rounded-xl bg-red-600 text-white font-black text-lg flex items-center justify-center mb-5 shadow-xs">
                  3
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  Report missing or incorrect info
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Help fellow riders! Suggest missing stops or flag discrepancies directly
                  from any route page with a single click.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* COMMUNITY BANNER */}
        <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-600 rounded-2xl p-8 sm:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-md">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Can&apos;t find your bus stop?
              </h2>
              <p className="text-red-100 text-sm mt-2 max-w-xl">
                Suggest missing stops or let us know about newly created residential
                stops. We review all submissions to keep schedules accurate.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/suggest-stop"
                className="px-6 py-3 bg-white text-red-600 font-bold rounded-xl text-sm hover:bg-red-50 transition shadow-xs"
              >
                Suggest a Stop
              </Link>
              <Link
                href="/feedback"
                className="px-6 py-3 bg-red-700 text-white font-bold rounded-xl text-sm hover:bg-red-800 transition"
              >
                Send Feedback
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
