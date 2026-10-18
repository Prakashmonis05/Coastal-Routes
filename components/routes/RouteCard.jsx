import Link from "next/link";
import { ArrowRight, Bus } from "lucide-react";

export default function RouteCard({ route }) {
  const stopCount =
    route._count?.routeStops ?? route.stopCount ?? route.routeStops?.length ?? 0;
  const startName =
    route.startingPoint?.name ?? route.startingPoint ?? "Starting Point";
  const destName =
    route.destination?.name ?? route.destination ?? "Destination";

  return (
    <div className="bg-white border border-gray-300 rounded-2xl p-5 shadow-xs hover:shadow-md hover:border-red-400 transition-all flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600 text-white font-extrabold text-sm tracking-wide shadow-2xs">
              <Bus className="w-4 h-4" />
              {route.busNumber}
            </span>
            {route.routeName && (
              <span className="text-sm font-bold text-gray-900 truncate max-w-[180px]">
                {route.routeName}
              </span>
            )}
          </div>
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-gray-100 text-gray-800 border border-gray-200 shrink-0">
            {stopCount} {stopCount === 1 ? "Stop" : "Stops"}
          </span>
        </div>

        {/* Origin to Destination */}
        <div className="mt-4 space-y-1.5 bg-gray-50/80 p-3 rounded-xl border border-gray-200">
          <div className="flex items-center gap-2.5 text-sm">
            <div className="w-3 h-3 rounded-full border-2 border-red-600 bg-white shrink-0" />
            <span className="font-semibold text-gray-900 truncate">{startName}</span>
          </div>
          <div className="ml-1.5 pl-3 border-l-2 border-dashed border-gray-400 text-xs font-bold text-gray-500 uppercase tracking-wider">
            to
          </div>
          <div className="flex items-center gap-2.5 text-sm">
            <div className="w-3 h-3 rounded-full bg-red-600 shrink-0" />
            <span className="font-bold text-gray-900 truncate">
              {destName}
            </span>
          </div>
        </div>

        {route.description && (
          <p className="mt-3 text-xs text-gray-700 leading-relaxed line-clamp-2">
            {route.description}
          </p>
        )}
      </div>

      <div className="mt-5 pt-4 border-t border-gray-200">
        <Link
          href={`/routes/${route.id}`}
          className="inline-flex items-center justify-between w-full px-4 py-2.5 text-sm font-bold text-red-700 bg-red-50 hover:bg-red-600 hover:text-white rounded-xl transition-all"
        >
          <span>View Complete Route</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
