"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Search,
  ArrowRight,
  Bus,
  MapPin,
  ArrowRightLeft,
  HelpCircle,
  PlusCircle,
  Sparkles,
} from "lucide-react";
import PlaceAutocomplete from "@/components/search/PlaceAutocomplete";

export default function SearchClient({
  initialQuery = "",
  initialFrom = "",
  initialTo = "",
  initialMode = "general",
  busResults = [],
  pointToPointResults = [],
  stopResults = [],
  suggestions = [],
  hasSearched = false,
}) {
  const router = useRouter();
  const [mode, setMode] = useState(initialMode); // 'general' | 'point-to-point'
  const [generalQuery, setGeneralQuery] = useState(initialQuery);
  const [fromQuery, setFromQuery] = useState(initialFrom);
  const [toQuery, setToQuery] = useState(initialTo);

  function handleGeneralSearch(e) {
    e.preventDefault();
    if (!generalQuery.trim()) return;
    router.push(`/search?q=${encodeURIComponent(generalQuery.trim())}&mode=general`);
  }

  function handlePointSearch(e) {
    e.preventDefault();
    if (!fromQuery.trim() || !toQuery.trim()) return;
    router.push(
      `/search?from=${encodeURIComponent(fromQuery.trim())}&to=${encodeURIComponent(
        toQuery.trim()
      )}&mode=point-to-point`
    );
  }

  function handleSwap() {
    const temp = fromQuery;
    setFromQuery(toQuery);
    setToQuery(temp);
  }

  const noResultsFound =
    hasSearched &&
    busResults.length === 0 &&
    pointToPointResults.length === 0 &&
    stopResults.length === 0;

  return (
    <div className="space-y-8">
      {/* Search Mode Tabs */}
      <div className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-6 shadow-xs">
        <div className="flex items-center gap-2 border-b border-gray-100 pb-4 mb-6">
          <button
            type="button"
            onClick={() => setMode("general")}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
              mode === "general"
                ? "bg-red-600 text-white shadow-xs"
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            }`}
          >
            Bus Number or Stop Search
          </button>
          <button
            type="button"
            onClick={() => setMode("point-to-point")}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
              mode === "point-to-point"
                ? "bg-red-600 text-white shadow-xs"
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            }`}
          >
            Find Route Between Two Stops
          </button>
        </div>

        {/* General Form */}
        {mode === "general" && (
          <form onSubmit={handleGeneralSearch} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <PlaceAutocomplete
                value={generalQuery}
                onChange={setGeneralQuery}
                placeholder="Enter bus number (e.g. 2, 15) or stop name (e.g. State Bank, Surathkal, Kankanady)..."
                icon={<Search className="w-5 h-5 text-gray-500" />}
                inputClassName="w-full pl-11 pr-9 py-3 bg-white text-black font-bold placeholder:text-gray-600 border border-gray-300 rounded-xl text-base focus:ring-2 focus:ring-red-500 focus:outline-hidden"
              />
            </div>
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl shadow-xs transition shrink-0"
            >
              <Search className="w-5 h-5" />
              Search
            </button>
          </form>
        )}

        {/* Point-to-Point Form */}
        {mode === "point-to-point" && (
          <form onSubmit={handlePointSearch} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 items-center">
              <div className="sm:col-span-2 relative">
                <PlaceAutocomplete
                  value={fromQuery}
                  onChange={setFromQuery}
                  required
                  placeholder="Starting Stop (e.g. State Bank, Kankanady)..."
                  icon={
                    <div className="w-3 h-3 rounded-full border-2 border-red-600 bg-white" />
                  }
                  inputClassName="w-full pl-10 pr-9 py-3 bg-white text-black font-bold placeholder:text-gray-600 border border-gray-300 rounded-xl text-base focus:ring-2 focus:ring-red-500 focus:outline-hidden"
                />
              </div>

              <div className="sm:col-span-1 flex justify-center">
                <button
                  type="button"
                  onClick={handleSwap}
                  title="Swap directions"
                  className="p-2.5 rounded-xl border border-gray-200 hover:bg-gray-100 text-gray-600 transition"
                >
                  <ArrowRightLeft className="w-4 h-4" />
                </button>
              </div>

              <div className="sm:col-span-2 relative">
                <PlaceAutocomplete
                  value={toQuery}
                  onChange={setToQuery}
                  required
                  placeholder="Destination Stop (e.g. Surathkal, Konaje)..."
                  icon={
                    <div className="w-3 h-3 rounded-full bg-red-600" />
                  }
                  inputClassName="w-full pl-10 pr-9 py-3 bg-white text-black font-bold placeholder:text-gray-600 border border-gray-300 rounded-xl text-base focus:ring-2 focus:ring-red-500 focus:outline-hidden"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl shadow-xs transition"
              >
                <Search className="w-5 h-5" />
                Find Connecting Routes
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Spelling Suggestions Banner if any */}
      {suggestions.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <div className="flex items-center gap-2 text-amber-800 text-sm font-semibold mb-2">
            <Sparkles className="w-4 h-4 text-amber-600" />
            Did you mean one of these stops?
          </div>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((s) => (
              <button
                key={s.id}
                onClick={() => {
                  setGeneralQuery(s.name);
                  router.push(`/search?q=${encodeURIComponent(s.name)}&mode=general`);
                }}
                className="px-3 py-1 bg-white border border-amber-300 rounded-lg text-xs font-semibold text-amber-900 hover:bg-amber-100 transition"
              >
                {s.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Results Container */}
      {hasSearched && (
        <div className="space-y-8">
          {/* 1. Point to Point Results */}
          {pointToPointResults.length > 0 && (
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Bus className="w-5 h-5 text-red-600" />
                Connecting Routes ({pointToPointResults.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pointToPointResults.map((r) => (
                  <div
                    key={r.id}
                    className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs hover:border-red-300 transition"
                  >
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div>
                        <span className="inline-block px-3 py-1 rounded-md bg-red-600 text-white font-bold text-sm">
                          Bus {r.busNumber}
                        </span>
                        {r.routeName && (
                          <span className="ml-2 font-medium text-gray-800 text-sm">
                            {r.routeName}
                          </span>
                        )}
                      </div>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-green-50 text-green-700 font-semibold border border-green-200">
                        Direct
                      </span>
                    </div>

                    <div className="space-y-1.5 text-sm text-gray-700 mb-4">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full border-2 border-red-500 bg-white" />
                        <span>Board at: <strong>{r.matchedFromStop}</strong></span>
                      </div>
                      <div className="ml-1 pl-2 border-l border-dashed border-gray-300 text-xs text-gray-400 py-0.5">
                        {r.stopsInBetween} intermediate stops
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-600" />
                        <span>Alight at: <strong>{r.matchedToStop}</strong></span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        Total {r.stopCount} stops in route
                      </span>
                      <Link
                        href={`/routes/${r.id}`}
                        className="inline-flex items-center gap-1 text-sm font-semibold text-red-600 hover:text-red-700"
                      >
                        View Full Route <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 2. Routes Matching Bus Number */}
          {busResults.length > 0 && (
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Bus className="w-5 h-5 text-red-600" />
                Bus Number Matches ({busResults.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {busResults.map((r) => (
                  <div
                    key={r.id}
                    className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="px-3 py-1 bg-red-600 text-white font-extrabold text-sm rounded-lg">
                          Bus {r.busNumber}
                        </span>
                        <span className="text-xs text-gray-800 font-bold bg-gray-100 px-2 py-0.5 rounded-md">
                          {r.stopCount} stops
                        </span>
                      </div>
                      {r.routeName && (
                        <h4 className="text-base font-extrabold text-gray-950 mb-1">
                          {r.routeName}
                        </h4>
                      )}
                      <p className="text-xs font-semibold text-gray-800">
                        {r.startingPoint} → {r.destination}
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-gray-200">
                      <Link
                        href={`/routes/${r.id}`}
                        className="inline-flex items-center justify-between w-full text-xs font-bold text-red-600 hover:text-red-700"
                      >
                        <span>View Stops Sequence</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. Stop Matches & Serving Routes */}
          {stopResults.length > 0 && (
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-red-600" />
                Bus Stops ({stopResults.length})
              </h2>
              <div className="space-y-4">
                {stopResults.map((stop) => (
                  <div
                    key={stop.id}
                    className="bg-white border border-gray-200 rounded-xl p-6 shadow-xs"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-gray-100">
                      <div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-5 h-5 text-red-600" />
                          <h3 className="text-lg font-bold text-gray-900">
                            {stop.name}
                          </h3>
                        </div>
                        {stop.description && (
                          <p className="text-xs text-gray-500 mt-1">
                            {stop.description}
                          </p>
                        )}
                        {stop.aliases && stop.aliases.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2 text-xs text-gray-500">
                            <span className="text-gray-400">Aliases:</span>
                            {stop.aliases.map((a, i) => (
                              <span
                                key={i}
                                className="px-1.5 py-0.5 rounded bg-gray-100 text-gray-700 text-[11px]"
                              >
                                {a}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <span className="text-xs font-medium px-3 py-1 bg-gray-100 text-gray-700 rounded-full shrink-0">
                        Served by {stop.routes.length}{" "}
                        {stop.routes.length === 1 ? "route" : "routes"}
                      </span>
                    </div>

                    <div className="mt-4">
                      <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                        Routes passing through this stop:
                      </h4>
                      {stop.routes.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                          {stop.routes.map((rt) => (
                            <Link
                              key={rt.id}
                              href={`/routes/${rt.id}`}
                              className="p-3 border border-gray-200 rounded-lg hover:border-red-300 hover:bg-red-50/30 transition block"
                            >
                              <div className="flex items-center justify-between mb-1">
                                <span className="font-bold text-red-600 text-sm">
                                  Bus {rt.busNumber}
                                </span>
                                <span className="text-[11px] text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                                  Stop #{rt.stopPosition} of {rt.totalStops}
                                </span>
                              </div>
                              <p className="text-xs text-gray-700 truncate font-medium">
                                {rt.routeName || `${rt.startingPoint} → ${rt.destination}`}
                              </p>
                              <p className="text-[11px] text-gray-400 truncate">
                                {rt.startingPoint} to {rt.destination}
                              </p>
                            </Link>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-gray-400 italic">
                          No active routes currently schedule this stop.
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {noResultsFound && (
            <div className="bg-white border border-gray-200 rounded-2xl p-10 text-center max-w-lg mx-auto shadow-xs">
              <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-4 border border-red-100">
                <HelpCircle className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                We couldn&apos;t find this bus stop or route.
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                Try checking for spelling variations or common abbreviations (such
                as &quot;Stn&quot; for Station, &quot;CBS&quot; for Central Bus Stand).
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={() => {
                    setGeneralQuery("");
                    setFromQuery("");
                    setToQuery("");
                  }}
                  className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
                >
                  Try Another Spelling
                </button>
                <Link
                  href={`/suggest-stop?name=${encodeURIComponent(
                    generalQuery || fromQuery || toQuery
                  )}`}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-xs transition"
                >
                  <PlusCircle className="w-4 h-4" />
                  Suggest a Missing Stop
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
