"use client";

import { useState } from "react";
import { toast } from "sonner";
import { AlertCircle, X, Send } from "lucide-react";
import { submitFeedbackAction } from "@/app/actions/feedbackActions";

export default function ReportProblemModal({
  route,
  stops = [],
  isOpen,
  onClose,
}) {
  const [loading, setLoading] = useState(false);
  const [feedbackType, setFeedbackType] = useState("INCORRECT_STOP_NAME");
  const [selectedStopId, setSelectedStopId] = useState("");
  const [description, setDescription] = useState("");
  const [suggestedStopName, setSuggestedStopName] = useState("");

  if (!isOpen) return null;

  async function handleSubmit(e) {
    e.preventDefault();
    if (!description.trim()) {
      toast.error("Please provide a description of the problem.");
      return;
    }

    setLoading(true);
    try {
      const res = await submitFeedbackAction({
        feedbackType,
        routeId: route?.id || null,
        stopId: selectedStopId || null,
        description: description.trim(),
        suggestedStopName: suggestedStopName.trim() || null,
      });

      if (res.success) {
        toast.success(res.message);
        setDescription("");
        setSuggestedStopName("");
        setSelectedStopId("");
        onClose();
      } else {
        toast.error(res.error || "Failed to submit report.");
      }
    } catch (err) {
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-xl border border-gray-200 max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <h3 className="text-base font-bold text-gray-900">
              Report Route Problem
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-md hover:bg-gray-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="p-3 bg-red-50/70 border border-red-100 rounded-lg text-xs text-red-800">
            Reporting for:{" "}
            <strong>
              Bus {route?.busNumber}
              {route?.routeName ? ` (${route.routeName})` : ""}
            </strong>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
              Issue Category *
            </label>
            <select
              value={feedbackType}
              onChange={(e) => setFeedbackType(e.target.value)}
              className="w-full px-3 py-2 bg-white text-black font-semibold border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:outline-hidden"
            >
              <option value="INCORRECT_STOP_NAME">Incorrect Stop Name</option>
              <option value="MISSING_STOP">Missing Bus Stop</option>
              <option value="INCORRECT_STOP_ORDER">Incorrect Stop Order</option>
              <option value="INCORRECT_START_DEST">
                Incorrect Starting Point / Destination
              </option>
              <option value="INCORRECT_ROUTE">Incorrect Route Details</option>
              <option value="OTHER">Other Issue</option>
            </select>
          </div>

          {stops && stops.length > 0 && (
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Specific Stop (Optional)
              </label>
              <select
                value={selectedStopId}
                onChange={(e) => setSelectedStopId(e.target.value)}
                className="w-full px-3 py-2 bg-white text-black font-semibold border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:outline-hidden"
              >
                <option value="">-- Route General / Not specific to one stop --</option>
                {stops.map((rs, idx) => {
                  const s = rs.stop || rs;
                  return (
                    <option key={s.id || idx} value={s.id}>
                      {idx + 1}. {s.name}
                    </option>
                  );
                })}
              </select>
            </div>
          )}

          {(feedbackType === "MISSING_STOP" ||
            feedbackType === "INCORRECT_STOP_NAME") && (
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Suggested Stop Name / Correction
              </label>
              <input
                type="text"
                placeholder="e.g. South Pier Gate"
                value={suggestedStopName}
                onChange={(e) => setSuggestedStopName(e.target.value)}
                className="w-full px-3 py-2 bg-white text-black font-semibold placeholder:text-gray-600 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:outline-hidden"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
              Description of the Issue *
            </label>
            <textarea
              rows={4}
              required
              placeholder="Describe the discrepancy clearly so administrators can verify..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 bg-white text-black font-semibold placeholder:text-gray-600 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:outline-hidden"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-xs transition disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              {loading ? "Submitting..." : "Submit Report"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
