"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  MapPin,
  CheckCircle,
  XCircle,
  AlertTriangle,
} from "lucide-react";
import {
  deleteStopAction,
  toggleStopStatusAction,
} from "@/app/actions/stopActions";

export default function AdminStopsList({ initialStops = [] }) {
  const [stops, setStops] = useState(initialStops);
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  const filtered = stops.filter((s) => {
    if (!search.trim()) return true;
    const term = search.toLowerCase();
    const nameMatch = s.name.toLowerCase().includes(term);
    const aliasMatch = s.aliases?.some((a) =>
      a.aliasName.toLowerCase().includes(term)
    );
    return nameMatch || aliasMatch;
  });

  async function handleToggleStatus(stopId) {
    try {
      const res = await toggleStopStatusAction(stopId);
      if (res.success) {
        setStops(
          stops.map((s) =>
            s.id === stopId ? { ...s, isActive: !s.isActive } : s
          )
        );
        toast.success("Stop status updated.");
      } else {
        toast.error(res.error || "Failed to update stop status.");
      }
    } catch {
      toast.error("Error updating stop status.");
    }
  }

  async function handleDelete(stop) {
    const routeCount = stop._count?.routeStops ?? 0;
    if (routeCount > 0) {
      alert(
        `Cannot delete "${stop.name}" because it is currently part of ${routeCount} active route(s). Remove it from those routes first or deactivate the stop.`
      );
      return;
    }

    if (
      !confirm(
        `Are you sure you want to delete "${stop.name}"? This action cannot be undone.`
      )
    ) {
      return;
    }

    setDeletingId(stop.id);
    try {
      const res = await deleteStopAction(stop.id);
      if (res.success) {
        setStops(stops.filter((s) => s.id !== stop.id));
        toast.success(`Stop "${stop.name}" deleted.`);
      } else {
        toast.error(res.error || "Failed to delete stop.");
      }
    } catch {
      toast.error("Error deleting stop.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative max-w-sm w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search stops by name or alias..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white text-black font-semibold placeholder:text-gray-600 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-red-500 focus:outline-hidden"
          />
        </div>

        <Link
          href="/admin/stops/new"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-xl shadow-xs transition self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Add Bus Stop
        </Link>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 border-b border-gray-200 text-xs font-semibold uppercase tracking-wider text-gray-500">
              <tr>
                <th className="px-6 py-3.5">Official Stop Name</th>
                <th className="px-6 py-3.5">Aliases / Alternative Names</th>
                <th className="px-6 py-3.5">Serving Routes</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length > 0 ? (
                filtered.map((stop) => {
                  const routeCount = stop._count?.routeStops ?? 0;
                  return (
                    <tr key={stop.id} className="hover:bg-gray-50/70 transition">
                      <td className="px-6 py-4 font-bold text-gray-900">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-red-600 shrink-0" />
                          <span>{stop.name}</span>
                        </div>
                        {stop.description && (
                          <p className="text-[11px] text-gray-400 font-normal mt-0.5 max-w-xs truncate">
                            {stop.description}
                          </p>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {stop.aliases && stop.aliases.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {stop.aliases.map((a) => (
                              <span
                                key={a.id || a.aliasName}
                                className="px-2 py-0.5 rounded text-[11px] font-medium bg-gray-100 text-gray-700 border border-gray-200"
                              >
                                {a.aliasName}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-gray-400 text-xs italic">
                            No aliases
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-xs font-semibold text-gray-700">
                        <span
                          className={`px-2.5 py-1 rounded-md ${
                            routeCount > 0
                              ? "bg-red-50 text-red-700"
                              : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          {routeCount} {routeCount === 1 ? "Route" : "Routes"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleToggleStatus(stop.id)}
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold transition ${
                            stop.isActive
                              ? "bg-green-100 text-green-800 hover:bg-green-200"
                              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                          }`}
                          title="Click to toggle active status"
                        >
                          {stop.isActive ? (
                            <>
                              <CheckCircle className="w-3 h-3 text-green-600" />
                              Active
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3 h-3 text-gray-400" />
                              Inactive
                            </>
                          )}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleDelete(stop)}
                            disabled={deletingId === stop.id}
                            className={`p-1.5 rounded-lg transition disabled:opacity-50 ${
                              routeCount > 0
                                ? "text-gray-300 hover:text-gray-400 cursor-not-allowed"
                                : "text-red-600 hover:text-red-800 hover:bg-red-50"
                            }`}
                            title={
                              routeCount > 0
                                ? "Used in routes - cannot delete"
                                : "Delete stop"
                            }
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-10 text-center text-xs text-gray-500"
                  >
                    No bus stops found matching search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
