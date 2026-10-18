"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  ExternalLink,
  Power,
  Bus,
  CheckCircle,
  XCircle,
} from "lucide-react";
import {
  deleteRouteAction,
  toggleRouteStatusAction,
} from "@/app/actions/routeActions";

export default function AdminRoutesList({ initialRoutes = [] }) {
  const [routes, setRoutes] = useState(initialRoutes);
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  const filtered = routes.filter((r) => {
    if (!search.trim()) return true;
    const term = search.toLowerCase();
    return (
      r.busNumber.toLowerCase().includes(term) ||
      (r.routeName && r.routeName.toLowerCase().includes(term)) ||
      r.startingPoint.name.toLowerCase().includes(term) ||
      r.destination.name.toLowerCase().includes(term)
    );
  });

  async function handleToggleStatus(routeId) {
    try {
      const res = await toggleRouteStatusAction(routeId);
      if (res.success) {
        setRoutes(
          routes.map((r) =>
            r.id === routeId ? { ...r, isActive: !r.isActive } : r
          )
        );
        toast.success("Route status updated.");
      } else {
        toast.error(res.error || "Failed to update route status.");
      }
    } catch {
      toast.error("Error toggling status.");
    }
  }

  async function handleDelete(routeId, busNumber) {
    if (
      !confirm(
        `Are you sure you want to delete Bus Route ${busNumber}? This action cannot be undone.`
      )
    ) {
      return;
    }

    setDeletingId(routeId);
    try {
      const res = await deleteRouteAction(routeId);
      if (res.success) {
        setRoutes(routes.filter((r) => r.id !== routeId));
        toast.success(`Route ${busNumber} deleted successfully.`);
      } else {
        toast.error(res.error || "Failed to delete route.");
      }
    } catch {
      toast.error("Error deleting route.");
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
            placeholder="Search routes by bus number or stop..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white text-black font-semibold placeholder:text-gray-600 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-red-500 focus:outline-hidden"
          />
        </div>

        <Link
          href="/admin/routes/new"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-xl shadow-xs transition self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Create New Route
        </Link>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 border-b border-gray-200 text-xs font-semibold uppercase tracking-wider text-gray-500">
              <tr>
                <th className="px-6 py-3.5">Bus Number</th>
                <th className="px-6 py-3.5">Route Name</th>
                <th className="px-6 py-3.5">Origin &amp; Destination</th>
                <th className="px-6 py-3.5">Stops</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length > 0 ? (
                filtered.map((route) => (
                  <tr key={route.id} className="hover:bg-gray-50/70 transition">
                    <td className="px-6 py-4 font-bold text-gray-900 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-red-50 text-red-700 font-bold text-xs border border-red-100">
                        <Bus className="w-3.5 h-3.5" />
                        {route.busNumber}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-800">
                      {route.routeName || "—"}
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-600">
                      <div className="font-medium text-gray-900">
                        {route.startingPoint.name}
                      </div>
                      <div className="text-gray-400">to {route.destination.name}</div>
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-600 font-medium">
                      {route._count?.routeStops ?? route.routeStops?.length ?? 0} stops
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleToggleStatus(route.id)}
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold transition ${
                          route.isActive
                            ? "bg-green-100 text-green-800 hover:bg-green-200"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                        title="Click to toggle active status"
                      >
                        {route.isActive ? (
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
                        <Link
                          href={`/routes/${route.id}`}
                          target="_blank"
                          className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition"
                          title="View on public site"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                        <Link
                          href={`/admin/routes/${route.id}/edit`}
                          className="p-1.5 text-blue-600 hover:text-blue-800 rounded-lg hover:bg-blue-50 transition"
                          title="Edit Route"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(route.id, route.busNumber)}
                          disabled={deletingId === route.id}
                          className="p-1.5 text-red-600 hover:text-red-800 rounded-lg hover:bg-red-50 transition disabled:opacity-50"
                          title="Delete Route"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-xs text-gray-500">
                    No matching routes found.
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
