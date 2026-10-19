import Link from "next/link";
import prisma from "@/lib/prisma";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroSearch from "@/components/home/HeroSearch";
import RouteCard from "@/components/routes/RouteCard";
import FaqSection from "@/components/home/FaqSection";
import { FAQS } from "@/lib/constants/faqs";
import {
  Bus,
  Search,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  MapPin,
  Clock,
  Compass,
  Navigation,
  ShieldCheck,
} from "lucide-react";

export const metadata = {
  title: "Mangalore Bus Routes, Private Buses & Timings Finder | Coastal Routes",
  description:
    "Find Mangalore city bus routes, Mangalore private buses, bus numbers, intermediate stop sequences, and schedules from State Bank, Kankanady, Surathkal, Jyothi & Dakshina Kannada.",
  keywords: [
    "mangalore bus routes",
    "mangalore private buses",
    "mangalore privatie busses",
    "mangalore city bus routes",
    "mangaluru bus routes",
    "mangaluru private buses",
    "state bank mangalore bus routes",
    "mangalore bus numbers",
    "surathkal bus route",
    "kankanady bus route",
    "mangalore city bus guide",
  ],
  alternates: {
    canonical: "/",
  },
};

const POPULAR_CORRIDORS = [
  {
    from: "State Bank",
    to: "Surathkal",
    label: "State Bank ⇄ Surathkal (NITK)",
    buses: "Bus 2, 2A, 15",
    description: "Via Ladyhill, Kulur, Panambur Beach & Baikampady",
  },
  {
    from: "State Bank",
    to: "Mangalore University",
    label: "State Bank ⇄ Mangalore University (Konaje)",
    buses: "Bus 51, 51A",
    description: "Via Kankanady, Pumpwell, Thokkottu & Deralakatte",
  },
  {
    from: "State Bank",
    to: "Kankanady",
    label: "State Bank ⇄ Kankanady / Pumpwell",
    buses: "Frequent Services",
    description: "Via Jyothi Circle, Bunts Hostel, Mallikatte",
  },
  {
    from: "State Bank",
    to: "Bajpe Aerodrome",
    label: "State Bank ⇄ Bajpe (Mangalore Airport)",
    buses: "Bus 47 & Express",
    description: "Via Kavoor, Maravoor Bridge & Kenjar",
  },
  {
    from: "State Bank",
    to: "Panambur",
    label: "State Bank ⇄ Panambur Beach / NMPT",
    buses: "Bus 1, 1A, 2",
    description: "Direct coastal corridor via Urwa Stores & Kulur",
  },
  {
    from: "Car Street",
    to: "Mangaladevi",
    label: "Car Street ⇄ Mangaladevi Temple",
    buses: "Bus 27",
    description: "Connecting heritage temples via Hampankatta & Bolar",
  },
];

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
      take: 6,
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
    prisma.route.count({ where: { isActive: true } }),
  ]);

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative bg-gradient-to-b from-red-50/40 via-white to-gray-50/50 py-16 sm:py-24 border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-100 text-red-700 text-xs font-bold uppercase tracking-wider mb-6">
              <Bus className="w-4 h-4" />
              Mangalore City &amp; Private Bus Routes
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold text-gray-900 tracking-tight max-w-4xl mx-auto leading-tight">
              Mangalore Bus Routes &amp; <br className="hidden sm:inline" />
              <span className="text-red-600">Private Buses Finder</span>
            </h1>

            <p className="mt-4 sm:mt-6 text-base sm:text-xl text-gray-600 max-w-3xl mx-auto font-normal">
              Find Mangalore city bus routes, private buses, intermediate stops, and
              sequential stop timings connecting State Bank, Kankanady, Surathkal, Jyothi Circle,
              and across Dakshina Kannada.
            </p>

            <div className="mt-8 sm:mt-10">
              <HeroSearch commonStops={popularStops} popularRoutes={popularRoutes} />
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-gray-500">
              <span className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-green-600" />
                Verified Mangalore Stop Sequences
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-green-600" />
                State Bank &amp; Private Bus Numbers
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-green-600" />
                Direction-Aware Routing
              </span>
            </div>
          </div>
        </section>

        {/* POPULAR MANGALORE BUS CORRIDORS */}
        <section className="py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="text-xs font-bold uppercase tracking-wider text-red-600 mb-1">
              Key Connecting Hubs
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
              Popular Mangalore Bus Corridors
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Direct routes connecting State Bank terminal with key residential, educational, and commercial centers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {POPULAR_CORRIDORS.map((corridor) => (
              <Link
                key={corridor.label}
                href={`/search?from=${encodeURIComponent(
                  corridor.from
                )}&to=${encodeURIComponent(corridor.to)}&mode=point-to-point`}
                className="group p-5 rounded-2xl border border-gray-200 bg-white hover:border-red-500 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs font-bold text-red-600 mb-2">
                    <span className="flex items-center gap-1">
                      <Bus className="w-3.5 h-3.5" />
                      {corridor.buses}
                    </span>
                    <span className="text-gray-400 group-hover:text-red-600 transition">
                      View Routes →
                    </span>
                  </div>
                  <h3 className="font-extrabold text-gray-900 group-hover:text-red-600 transition text-base">
                    {corridor.label}
                  </h3>
                  <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                    {corridor.description}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500 font-medium">
                  <span>{corridor.from}</span>
                  <span className="text-gray-300">⇄</span>
                  <span>{corridor.to}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* POPULAR / FEATURED ROUTES SECTION */}
        <section className="py-14 bg-gray-50 border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-red-600 mb-1">
                  Active Bus Timetable
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                  Featured Mangalore Bus Routes
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Frequently travelled routes with verified sequential stops and intermediate timings.
                </p>
              </div>
              {totalRoutesCount > 0 && (
                <Link
                  href="/routes"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-red-600 hover:text-red-700 transition"
                >
                  Browse All {totalRoutesCount} Mangalore Routes <ArrowRight className="w-4 h-4" />
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
              <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center max-w-lg mx-auto">
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
          </div>
        </section>

        {/* INFORMATIONAL SEO GUIDE SECTION ON MANGALORE PRIVATE BUSES */}
        <section className="py-16 bg-white border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-6 space-y-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold uppercase tracking-wider">
                  <Navigation className="w-3.5 h-3.5" />
                  Guide to Mangalore Transit
                </div>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight">
                  Navigating Mangalore Bus Routes &amp; Private Buses
                </h2>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed font-normal">
                  Mangaluru (Mangalore) is renowned across India for its exceptionally efficient,
                  punctual, and frequent <strong>private bus network</strong>. Rather than relying solely on municipal
                  corporations, private operators run hundreds of buses daily from early morning
                  until late evening.
                </p>
                <div className="space-y-3 pt-2 text-sm text-gray-700">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-md bg-red-50 text-red-600 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                      ✓
                    </div>
                    <div>
                      <strong className="text-gray-900">State Bank Bus Stand (Hampankatta):</strong> The central terminus
                      where almost 80% of city and private buses originate or pass through.
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-md bg-red-50 text-red-600 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                      ✓
                    </div>
                    <div>
                      <strong className="text-gray-900">Bus Numbering System:</strong> Routes are designated with
                      standardized numbers (e.g. 2, 2A, 15, 27, 45, 51) indicating corridor destinations like
                      Surathkal, Car Street, Kavoor, and Mangalore University.
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-md bg-red-50 text-red-600 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                      ✓
                    </div>
                    <div>
                      <strong className="text-gray-900">Sequential Stops &amp; Direction:</strong> Coastal Routes provides
                      the exact ordered stop list so you never catch a bus moving towards the opposite terminal.
                    </div>
                  </div>
                </div>
                <div className="pt-4">
                  <Link
                    href="/routes"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gray-900 hover:bg-black text-white text-sm font-bold transition shadow-xs"
                  >
                    Explore All Mangalore Routes <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-6 bg-gradient-to-br from-red-600 to-red-800 rounded-3xl p-8 sm:p-10 text-white shadow-xl">
                <h3 className="text-2xl font-black mb-4">
                  Key Transit Hubs in Mangaluru
                </h3>
                <p className="text-sm text-red-100 leading-relaxed mb-6">
                  Commuting across Dakshina Kannada? Here are the most prominent interchange points
                  for catching connecting private and city buses:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 rounded-xl bg-white/10 backdrop-blur-xs border border-white/20">
                    <div className="font-bold text-sm text-white mb-1">State Bank Terminal</div>
                    <p className="text-red-100">
                      Central hub for Surathkal, Ullal, Kankanady, Konaje &amp; Airport routes.
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-white/10 backdrop-blur-xs border border-white/20">
                    <div className="font-bold text-sm text-white mb-1">Kankanady &amp; Pumpwell</div>
                    <p className="text-red-100">
                      Gateway to national highways, Kasaragod, Mangalore University &amp; hospitals.
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-white/10 backdrop-blur-xs border border-white/20">
                    <div className="font-bold text-sm text-white mb-1">Jyothi (Ambedkar Circle)</div>
                    <p className="text-red-100">
                      Major educational corridor near KMC, St. Aloysius &amp; Bunts Hostel.
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-white/10 backdrop-blur-xs border border-white/20">
                    <div className="font-bold text-sm text-white mb-1">Surathkal Junction</div>
                    <p className="text-red-100">
                      Northern hub connecting NITK, Mukka, Mulki and industrial NMPT corridors.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
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
                Designed to give Mangalore bus commuters immediate answers in three simple steps.
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
                  Our engine handles common typos and alternative Mangalore stop names.
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

        {/* FAQS SECTION WITH RICH SCHEMA */}
        <FaqSection />

        {/* COMMUNITY BANNER */}
        <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-600 rounded-2xl p-8 sm:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-md">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Can&apos;t find your Mangalore bus stop?
              </h2>
              <p className="text-red-100 text-sm mt-2 max-w-xl">
                Suggest missing stops or let us know about newly created residential
                stops in Mangaluru. We review all submissions to keep schedules accurate.
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
