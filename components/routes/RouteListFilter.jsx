"use client";

import { useState } from "react";
import { Search, Filter, Bus } from "lucide-react";
import RouteCard from "./RouteCard";

export default function RouteListFilter({ initialRoutes = [] }) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredRoutes = initialRoutes.filter((r) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    const busMatch = r.busNumber?.toLowerCase().includes(term);
    const nameMatch = r.routeName?.toLowerCase().includes(term);
    const startMatch = r.startingPoint?.name?.toLowerCase().includes(term);
    const destMatch = r.destination?.name?.toLowerCase().includes(term);
    return busMatch || nameMatch || startMatch || destMatch;
  });

  return (
    <div>
      {/* Search Input Filter */}
      <div className="mb-8 max-w-md">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Filter by bus number, terminal, or route name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white text-black font-bold placeholder:text-gray-600 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-red-500 focus:outline-hidden shadow-2xs"
          />
        </div>
      </div>

      {/* Grid of routes */}
      {filteredRoutes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRoutes.map((route) => (
            <RouteCard key={route.id} route={route} />
          ))}
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center max-w-md mx-auto">
          <div className="w-12 h-12 rounded-xl bg-gray-100 text-gray-500 flex items-center justify-center mx-auto mb-3">
            <Bus className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-gray-900 mb-1">
            No matching routes found
          </h3>
          <p className="text-xs text-gray-500 mb-4">
            {searchTerm
              ? `No routes match "${searchTerm}". Try checking for spelling variations.`
              : "No active bus routes have been added to the system yet."}
          </p>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="text-xs font-medium text-red-600 hover:underline"
            >
              Clear filter
            </button>
          )}
        </div>
      )}
    </div>
  );
}
