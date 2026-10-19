import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SearchClient from "@/components/search/SearchClient";
import {
  searchByBusNumber,
  searchByStartAndDestination,
  searchByStopName,
} from "@/lib/services/search";
import { Search } from "lucide-react";

export const metadata = {
  title: "Search Mangalore Bus Routes & Private Buses | Coastal Routes",
  description:
    "Search Mangalore private bus routes by bus number, start and destination stops (e.g. State Bank to Surathkal), or bus stop names with typo tolerance.",
  keywords: [
    "search mangalore bus routes",
    "mangalore private buses search",
    "mangaluru city bus finder",
    "state bank bus route search",
    "mangalore bus timing search",
    "mangalore private bus numbers",
  ],
  alternates: {
    canonical: "/search",
  },
};

export default async function SearchPage({ searchParams }) {
  const params = await searchParams;
  const q = (params?.q || "").trim();
  const from = (params?.from || "").trim();
  const to = (params?.to || "").trim();
  const mode = params?.mode || (from && to ? "point-to-point" : "general");

  let busResults = [];
  let pointToPointResults = [];
  let stopResults = [];
  let suggestions = [];
  let hasSearched = false;

  if (mode === "point-to-point" && from && to) {
    hasSearched = true;
    pointToPointResults = await searchByStartAndDestination(from, to);
  } else if (q) {
    hasSearched = true;
    const [busMatches, stopData] = await Promise.all([
      searchByBusNumber(q),
      searchByStopName(q),
    ]);
    busResults = busMatches;
    stopResults = stopData.stops;
    suggestions = stopData.suggestions;
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <div className="flex items-center gap-2 text-red-600 font-bold text-xs uppercase tracking-wider mb-1">
            <Search className="w-4 h-4" />
            Mangalore Transit Search
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Search Mangalore Bus Routes &amp; Private Buses
          </h1>
          <p className="text-sm font-medium text-gray-700 mt-1">
            Look up routes by Mangalore bus number (e.g. 2, 15, 27, 51), origin &amp; destination terminals (e.g. State Bank to Surathkal), or any intermediate stop.
          </p>
        </div>

        <SearchClient
          initialQuery={q}
          initialFrom={from}
          initialTo={to}
          initialMode={mode}
          busResults={busResults}
          pointToPointResults={pointToPointResults}
          stopResults={stopResults}
          suggestions={suggestions}
          hasSearched={hasSearched}
        />
      </main>
      <Footer />
    </div>
  );
}
