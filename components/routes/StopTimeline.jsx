import { MapPin, Navigation } from "lucide-react";

export default function StopTimeline({ stops = [] }) {
  if (!stops || stops.length === 0) {
    return (
      <div className="text-center py-8 text-gray-700 font-medium text-sm">
        No stops recorded for this route.
      </div>
    );
  }

  const total = stops.length;

  return (
    <div className="relative pl-6 py-2">
      {/* Main vertical track line */}
      <div className="absolute left-[23px] top-6 bottom-6 w-0.5 bg-gray-300" />

      <div className="space-y-6">
        {stops.map((stopItem, index) => {
          const isFirst = index === 0;
          const isLast = index === total - 1;

          const stopName = stopItem.stop?.name ?? stopItem.name;
          const stopDescription = stopItem.stop?.description ?? stopItem.description;
          const aliases = stopItem.stop?.aliases ?? stopItem.aliases ?? [];

          return (
            <div key={stopItem.id || index} className="relative flex items-start group">
              {/* Node Icon */}
              <div
                className={`relative z-10 flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all ${
                  isFirst
                    ? "bg-red-600 border-red-600 text-white shadow-xs font-bold"
                    : isLast
                    ? "bg-gray-950 border-gray-950 text-white shadow-xs font-bold"
                    : "bg-white border-gray-400 text-gray-900 group-hover:border-red-600 group-hover:text-red-600 font-bold"
                }`}
              >
                {isFirst ? (
                  <Navigation className="w-4 h-4" />
                ) : isLast ? (
                  <MapPin className="w-4 h-4" />
                ) : (
                  <span className="text-xs font-bold">{index + 1}</span>
                )}
              </div>

              {/* Stop Information */}
              <div className="ml-4 flex-1 pt-0.5">
                <div className="flex flex-wrap items-center gap-2">
                  <h4
                    className={`text-base font-bold tracking-tight ${
                      isFirst || isLast
                        ? "text-gray-950 text-lg font-black"
                        : "text-gray-900"
                    }`}
                  >
                    {stopName}
                  </h4>

                  {isFirst && (
                    <span className="text-xs font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-red-100 text-red-800 border border-red-200">
                      Starting Terminal
                    </span>
                  )}
                  {isLast && (
                    <span className="text-xs font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-gray-200 text-gray-900 border border-gray-300">
                      Final Destination
                    </span>
                  )}
                </div>

                {stopDescription && (
                  <p className="text-xs text-gray-700 font-medium mt-1 leading-relaxed">
                    {stopDescription}
                  </p>
                )}

                {aliases && aliases.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5 mt-2">
                    <span className="text-[11px] text-gray-600 font-bold uppercase tracking-wider">
                      Aliases:
                    </span>
                    {aliases.map((a, i) => (
                      <span
                        key={i}
                        className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-gray-100 text-gray-800 border border-gray-300"
                      >
                        {typeof a === "string" ? a : a.aliasName}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
