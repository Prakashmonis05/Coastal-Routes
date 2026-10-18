"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import {
  ArrowLeft,
  ArrowUp,
  ArrowDown,
  Trash2,
  Plus,
  Bus,
  Save,
  MapPin,
  Sparkles,
} from "lucide-react";
import {
  createRouteAction,
  updateRouteAction,
} from "@/app/actions/routeActions";
import { createStopAction } from "@/app/actions/stopActions";

export default function RouteForm({ route = null, availableStops = [] }) {
  const router = useRouter();
  const isEditing = !!route;

  const [loading, setLoading] = useState(false);
  const [stopsList, setStopsList] = useState(availableStops);

  // Form Fields
  const [busNumber, setBusNumber] = useState(route?.busNumber || "");
  const [routeName, setRouteName] = useState(route?.routeName || "");
  const [description, setDescription] = useState(route?.description || "");
  const [isActive, setIsActive] = useState(
    route?.isActive !== undefined ? route.isActive : true
  );

  // Ordered stop IDs: initialized from route.routeStops ordered by stopOrder
  const initialSelectedStops = route?.routeStops
    ? route.routeStops.sort((a, b) => a.stopOrder - b.stopOrder).map((rs) => rs.stopId)
    : [];
  const [selectedStopIds, setSelectedStopIds] = useState(initialSelectedStops);

  // Quick Add Stop Modal / Inline state
  const [newStopToAdd, setNewStopToAdd] = useState("");
  const [quickStopName, setQuickStopName] = useState("");
  const [isQuickAdding, setIsQuickAdding] = useState(false);

  // Reordering helpers
  function moveStop(index, direction) {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= selectedStopIds.length) return;

    const updated = [...selectedStopIds];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    setSelectedStopIds(updated);
  }

  function removeStop(index) {
    const updated = selectedStopIds.filter((_, i) => i !== index);
    setSelectedStopIds(updated);
  }

  function addSelectedStop() {
    if (!newStopToAdd) return;
    setSelectedStopIds([...selectedStopIds, newStopToAdd]);
    setNewStopToAdd("");
  }

  // Quick create stop directly from route form
  async function handleQuickCreateStop() {
    if (!quickStopName.trim()) {
      toast.error("Please enter a stop name.");
      return;
    }

    setIsQuickAdding(true);
    try {
      const res = await createStopAction({
        name: quickStopName.trim(),
        description: "Created directly during route setup",
        aliases: [],
      });

      if (res.success && res.stop) {
        toast.success(`Stop "${res.stop.name}" created!`);
        setStopsList([...stopsList, res.stop]);
        setSelectedStopIds([...selectedStopIds, res.stop.id]);
        setQuickStopName("");
      } else {
        toast.error(res.error || "Failed to create stop.");
      }
    } catch {
      toast.error("Error creating stop.");
    } finally {
      setIsQuickAdding(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!busNumber.trim()) {
      toast.error("Bus number is required.");
      return;
    }

    if (selectedStopIds.length < 2) {
      toast.error(
        "A route must contain at least 2 stops: a starting point and a destination."
      );
      return;
    }

    setLoading(true);
    try {
      const payload = {
        busNumber: busNumber.trim(),
        routeName: routeName.trim() || null,
        description: description.trim() || null,
        isActive,
        stopIds: selectedStopIds,
      };

      let res;
      if (isEditing) {
        res = await updateRouteAction(route.id, payload);
      } else {
        res = await createRouteAction(payload);
      }

      if (res.success) {
        toast.success(
          isEditing
            ? "Route updated successfully!"
            : "New route created successfully!"
        );
        router.push("/admin/routes");
      } else {
        toast.error(res.error || "Failed to save route.");
      }
    } catch {
      toast.error("An error occurred while saving the route.");
    } finally {
      setLoading(false);
    }
  }

  // Lookup helper
  const stopMap = new Map(stopsList.map((s) => [s.id, s.name]));

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Link
          href="/admin/routes"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-red-600 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Routes
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Details */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-2xs space-y-4">
          <h2 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3">
            Route Identification
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Bus Number / Code *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. 101, 101R, 45A"
                value={busNumber}
                onChange={(e) => setBusNumber(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white text-black font-semibold placeholder:text-gray-600 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-red-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Route Name (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Coastal Express, Tech-Uni Link"
                value={routeName}
                onChange={(e) => setRouteName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white text-black font-semibold placeholder:text-gray-600 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-red-500 focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
              Route Description (Optional)
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Operating along Marine Drive with direct connection to Harbor Bay..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white text-black font-semibold placeholder:text-gray-600 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-red-500 focus:outline-hidden"
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              id="isActiveCheck"
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="w-4 h-4 text-red-600 rounded border-gray-300 focus:ring-red-500"
            />
            <label
              htmlFor="isActiveCheck"
              className="text-xs font-semibold text-gray-800 cursor-pointer"
            >
              Route is currently active and publicly visible
            </label>
          </div>
        </div>

        {/* Ordered Stops Management */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-2xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
            <div>
              <h2 className="text-base font-bold text-gray-900">
                Stop Sequence &amp; Ordering
              </h2>
              <p className="text-xs text-gray-500">
                The first stop is the origin terminal. The final stop is the
                destination.
              </p>
            </div>
            <span className="text-xs font-bold text-red-600 bg-red-50 px-2.5 py-1 rounded-md">
              {selectedStopIds.length} stops in sequence
            </span>
          </div>

          {/* Add Stop Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end p-4 bg-gray-50 rounded-xl border border-gray-200">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Select Existing Stop to Append
              </label>
              <select
                value={newStopToAdd}
                onChange={(e) => setNewStopToAdd(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-red-500 focus:outline-hidden bg-white text-black font-semibold"
              >
                <option value="">-- Choose a stop --</option>
                {stopsList.map((stop) => (
                  <option key={stop.id} value={stop.id}>
                    {stop.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <button
                type="button"
                onClick={addSelectedStop}
                disabled={!newStopToAdd}
                className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-gray-900 hover:bg-black text-white text-xs font-semibold rounded-xl shadow-xs transition disabled:opacity-50"
              >
                <Plus className="w-4 h-4" />
                Add to Sequence
              </button>
            </div>
          </div>

          {/* Quick Create Missing Stop Directly */}
          <div className="flex flex-col sm:flex-row items-center gap-2 p-3 bg-red-50/50 rounded-xl border border-red-100 text-xs">
            <span className="text-gray-700 font-semibold shrink-0">
              Need a stop that isn&apos;t in the list?
            </span>
            <input
              type="text"
              placeholder="Enter new stop name..."
              value={quickStopName}
              onChange={(e) => setQuickStopName(e.target.value)}
              className="flex-1 w-full px-3 py-1.5 bg-white text-black font-semibold placeholder:text-gray-600 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-red-500 focus:outline-hidden"
            />
            <button
              type="button"
              onClick={handleQuickCreateStop}
              disabled={isQuickAdding || !quickStopName.trim()}
              className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shrink-0 transition disabled:opacity-50"
            >
              {isQuickAdding ? "Creating..." : "Quick Add Stop"}
            </button>
          </div>

          {/* List of Ordered Stops */}
          {selectedStopIds.length > 0 ? (
            <div className="space-y-2 mt-4">
              {selectedStopIds.map((stopId, index) => {
                const isFirst = index === 0;
                const isLast = index === selectedStopIds.length - 1;
                const stopName = stopMap.get(stopId) || "Unknown Stop";

                return (
                  <div
                    key={`${stopId}-${index}`}
                    className={`flex items-center justify-between p-3 rounded-xl border transition ${
                      isFirst
                        ? "bg-red-50/40 border-red-200"
                        : isLast
                        ? "bg-gray-100/60 border-gray-300"
                        : "bg-white border-gray-200"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-gray-200 text-gray-700 font-bold text-xs flex items-center justify-center">
                        {index + 1}
                      </span>
                      <div>
                        <span className="font-semibold text-gray-900 text-sm">
                          {stopName}
                        </span>
                        {isFirst && (
                          <span className="ml-2 px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-red-600 text-white">
                            Origin
                          </span>
                        )}
                        {isLast && (
                          <span className="ml-2 px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-gray-900 text-white">
                            Destination
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => moveStop(index, "up")}
                        disabled={isFirst}
                        title="Move stop earlier"
                        className="p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-200 rounded-lg transition disabled:opacity-30"
                      >
                        <ArrowUp className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveStop(index, "down")}
                        disabled={isLast}
                        title="Move stop later"
                        className="p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-200 rounded-lg transition disabled:opacity-30"
                      >
                        <ArrowDown className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeStop(index)}
                        title="Remove from sequence"
                        className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition ml-2"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-8 text-center text-xs text-gray-400 border-2 border-dashed border-gray-200 rounded-xl">
              No stops added yet. Use the controls above to add stops to this
              route.
            </div>
          )}
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end gap-3">
          <Link
            href="/admin/routes"
            className="px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-200 rounded-xl transition"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-xl shadow-xs transition disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {loading
              ? "Saving Route..."
              : isEditing
              ? "Update Route"
              : "Create Route"}
          </button>
        </div>
      </form>
    </div>
  );
}
