"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Bus,
  Route,
  ArrowRight,
  ArrowRightLeft,
  Navigation,
  MapPin,
} from "lucide-react";
import PlaceAutocomplete from "@/components/search/PlaceAutocomplete";

export default function HeroSearch({ commonStops = [], popularRoutes = [] }) {
  const router = useRouter();
  const [searchMode, setSearchMode] = useState("busNo"); // "busNo" | "route"

  // Inputs
  const [busNo, setBusNo] = useState("");
  const [fromStop, setFromStop] = useState("");
  const [toStop, setToStop] = useState("");

  function handleBusSubmit(e) {
    e.preventDefault();
    if (!busNo.trim()) return;
    router.push(`/search?q=${encodeURIComponent(busNo.trim())}&mode=general`);
  }

  function handleRouteSubmit(e) {
    e.preventDefault();
    if (!fromStop.trim() || !toStop.trim()) return;
    router.push(
      `/search?from=${encodeURIComponent(fromStop.trim())}&to=${encodeURIComponent(
        toStop.trim()
      )}&mode=point-to-point`
    );
  }

  function handleSwapStops() {
    const temp = fromStop;
    setFromStop(toStop);
    setToStop(temp);
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Toggle Controls */}
      <div className="flex justify-center mb-4">
        <div className="inline-flex p-1 bg-gray-100/90 rounded-2xl border border-gray-200 shadow-2xs">
          <button
            type="button"
            onClick={() => setSearchMode("busNo")}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              searchMode === "busNo"
                ? "bg-red-600 text-white shadow-xs scale-100"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-200/60"
            }`}
          >
            <Bus className="w-4 h-4" />
            <span>Find by Bus No.</span>
          </button>

          <button
            type="button"
            onClick={() => setSearchMode("route")}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              searchMode === "route"
                ? "bg-red-600 text-white shadow-xs scale-100"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-200/60"
            }`}
          >
            <Route className="w-4 h-4" />
            <span>Find with Route</span>
          </button>
        </div>
      </div>

      {/* Mode 1: Find by Bus Number */}
      {searchMode === "busNo" ? (
        <div>
          <form
            onSubmit={handleBusSubmit}
            className="relative flex flex-col sm:flex-row items-center gap-2 bg-white p-2 sm:p-2.5 rounded-2xl shadow-lg border border-gray-200"
          >
            <div className="relative flex-1 w-full">
              <Bus className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                required
                placeholder="Enter Mangalore Bus No. (e.g. 2, 2A, 15, 27, 51)..."
                value={busNo}
                onChange={(e) => setBusNo(e.target.value)}
                className="w-full pl-12 pr-4 py-3 sm:py-3.5 bg-white text-black placeholder:text-gray-600 font-extrabold text-base sm:text-lg focus:outline-hidden"
              />
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 sm:py-3.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-xs transition"
            >
              <span>Search Bus</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Popular Bus Number quick chips */}
          {popularRoutes.length > 0 && (
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-gray-600">
              <span className="font-semibold text-gray-400">Popular buses:</span>
              {popularRoutes.map((r) => (
                <button
                  key={r.id}
                  onClick={() =>
                    router.push(
                      `/search?q=${encodeURIComponent(r.busNumber)}&mode=general`
                    )
                  }
                  className="px-3 py-1 rounded-full bg-white hover:bg-red-50 text-gray-700 hover:text-red-700 border border-gray-200 font-medium transition"
                >
                  Bus {r.busNumber}
                </button>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* Mode 2: Find with Route (Origin to Destination) */
        <div>
          <form
            onSubmit={handleRouteSubmit}
            className="bg-white p-3 sm:p-4 rounded-2xl shadow-lg border border-gray-200 space-y-3"
          >
            <div className="grid grid-cols-1 sm:grid-cols-11 gap-2 items-center">
              {/* Origin Stop Input with Autocomplete Suggestions */}
              <div className="sm:col-span-5 relative">
                <PlaceAutocomplete
                  value={fromStop}
                  onChange={setFromStop}
                  required
                  placeholder="Starting Stop (e.g. State Bank, Kankanady)..."
                  icon={
                    <div className="w-3.5 h-3.5 rounded-full border-2 border-red-600 bg-white" />
                  }
                  inputClassName="w-full pl-10 pr-9 py-3 bg-white text-black placeholder:text-gray-600 font-bold border border-gray-300 focus:border-red-500 rounded-xl text-sm sm:text-base focus:ring-1 focus:ring-red-500 focus:outline-hidden transition"
                />
              </div>

              {/* Swap Button */}
              <div className="sm:col-span-1 flex justify-center">
                <button
                  type="button"
                  onClick={handleSwapStops}
                  title="Swap Starting Point & Destination"
                  className="p-2.5 rounded-xl border border-gray-200 hover:bg-gray-100 text-gray-600 hover:text-red-600 transition"
                >
                  <ArrowRightLeft className="w-4 h-4" />
                </button>
              </div>

              {/* Destination Stop Input with Autocomplete Suggestions */}
              <div className="sm:col-span-5 relative">
                <PlaceAutocomplete
                  value={toStop}
                  onChange={setToStop}
                  required
                  placeholder="Destination Stop (e.g. Surathkal, Konaje)..."
                  icon={
                    <div className="w-3.5 h-3.5 rounded-full bg-red-600" />
                  }
                  inputClassName="w-full pl-10 pr-9 py-3 bg-white text-black placeholder:text-gray-600 font-bold border border-gray-300 focus:border-red-500 rounded-xl text-sm sm:text-base focus:ring-1 focus:ring-red-500 focus:outline-hidden transition"
                />
              </div>
            </div>

            <div className="flex justify-end pt-1">
              <button
                type="submit"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-xs transition"
              >
                <span>Find Connecting Routes</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Quick Hub Suggestions for Route search */}
          {commonStops.length > 0 && (
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-gray-600">
              <span className="font-semibold text-gray-400">Popular stops:</span>
              {commonStops.slice(0, 5).map((stop) => (
                <button
                  key={stop.id}
                  onClick={() => {
                    if (!fromStop) {
                      setFromStop(stop.name);
                    } else if (!toStop) {
                      setToStop(stop.name);
                    } else {
                      setFromStop(stop.name);
                    }
                  }}
                  className="px-2.5 py-1 rounded-full bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 transition"
                >
                  {stop.name}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
