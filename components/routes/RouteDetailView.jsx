"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Bus,
  MapPin,
  Clock,
  ArrowLeft,
  AlertTriangle,
  Calendar,
  Share2,
} from "lucide-react";
import { toast } from "sonner";
import StopTimeline from "./StopTimeline";
import ReportProblemModal from "@/components/feedback/ReportProblemModal";
import { formatDate } from "@/lib/utils/string";

export default function RouteDetailView({ route }) {
  const [modalOpen, setModalOpen] = useState(false);

  const stops = route.routeStops || [];
  const startStop = route.startingPoint?.name || "Starting Point";
  const destStop = route.destination?.name || "Destination";

  function handleShare() {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Route link copied to clipboard!");
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Back button */}
      <div className="mb-6">
        <Link
          href="/routes"
          className="inline-flex items-center gap-1.5 text-sm font-bold text-gray-800 hover:text-red-600 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to all routes
        </Link>
      </div>

      {/* Main Route Header Card */}
      <div className="bg-white border border-gray-300 rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-200">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-red-600 flex items-center justify-center text-white font-black text-2xl shadow-xs shrink-0">
              {route.busNumber}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold uppercase tracking-wider text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded-md">
                  Bus Route
                </span>
                {!route.isActive && (
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md">
                    Temporarily Inactive
                  </span>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-gray-950 mt-1">
                {route.routeName || `Bus ${route.busNumber}`}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center">
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-bold text-gray-800 hover:text-gray-950 bg-gray-100 hover:bg-gray-200 rounded-xl border border-gray-300 transition"
              title="Share route link"
            >
              <Share2 className="w-4 h-4" />
              Share
            </button>
            <button
              onClick={() => setModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-xs transition"
            >
              <AlertTriangle className="w-4 h-4" />
              Report a Problem
            </button>
          </div>
        </div>

        {/* Route Summary Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-6 border-b border-gray-200 text-sm">
          <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
            <span className="text-xs font-bold text-gray-600 uppercase tracking-wider block">
              Origin
            </span>
            <span className="text-base font-extrabold text-gray-950 mt-1 block">
              {startStop}
            </span>
          </div>

          <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
            <span className="text-xs font-bold text-gray-600 uppercase tracking-wider block">
              Destination
            </span>
            <span className="text-base font-extrabold text-gray-950 mt-1 block">
              {destStop}
            </span>
          </div>

          <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
            <span className="text-xs font-bold text-gray-600 uppercase tracking-wider block">
              Total Stops
            </span>
            <span className="text-base font-black text-red-600 mt-1 block">
              {stops.length} Stops in Sequence
            </span>
          </div>
        </div>

        {route.description && (
          <div className="py-4 text-sm font-medium text-gray-800 border-b border-gray-200 leading-relaxed">
            <p>{route.description}</p>
          </div>
        )}

        <div className="pt-4 flex items-center justify-between text-xs font-medium text-gray-600">
          <span className="inline-flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            Last updated: {formatDate(route.updatedAt)}
          </span>
          <span>Route ID: {route.id}</span>
        </div>
      </div>

      {/* Stop Sequence Section */}
      <div className="mt-8 bg-white border border-gray-300 rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="flex items-center justify-between pb-6 border-b border-gray-200 mb-6">
          <div>
            <h2 className="text-xl font-black text-gray-950">
              Complete Stop Sequence
            </h2>
            <p className="text-xs font-medium text-gray-700 mt-0.5">
              Follows the official travel order from origin to destination.
            </p>
          </div>
          <span className="text-xs font-bold bg-red-50 text-red-700 px-3 py-1 rounded-full border border-red-200">
            Direction: {startStop} → {destStop}
          </span>
        </div>

        <StopTimeline stops={stops} />
      </div>

      {/* Problem Report Modal */}
      <ReportProblemModal
        route={route}
        stops={stops}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
}
