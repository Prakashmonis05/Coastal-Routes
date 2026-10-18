"use client";

import { useState } from "react";
import { toast } from "sonner";
import { PlusCircle, Send, CheckCircle2, MapPin } from "lucide-react";
import { submitFeedbackAction } from "@/app/actions/feedbackActions";

export default function SuggestStopForm({ routes = [], initialName = "" }) {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    suggestedStopName: initialName,
    routeId: "",
    landmark: "",
    alternativeSpelling: "",
    additionalNotes: "",
  });

  async function handleSubmit(e) {
    e.preventDefault();
    if (!formData.suggestedStopName.trim()) {
      toast.error("Please enter a proposed stop name.");
      return;
    }

    const description = [
      formData.landmark ? `Nearby Landmark: ${formData.landmark.trim()}` : "",
      formData.alternativeSpelling
        ? `Alternative / Local Spelling: ${formData.alternativeSpelling.trim()}`
        : "",
      formData.additionalNotes ? `Notes: ${formData.additionalNotes.trim()}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    setLoading(true);
    try {
      const res = await submitFeedbackAction({
        feedbackType: "MISSING_STOP",
        routeId: formData.routeId || null,
        suggestedStopName: formData.suggestedStopName.trim(),
        description: description || "User submitted a missing stop suggestion.",
      });

      if (res.success) {
        toast.success(res.message);
        setSubmitted(true);
      } else {
        toast.error(res.error || "Failed to submit stop suggestion.");
      }
    } catch (err) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="bg-white border border-gray-200 rounded-2xl p-8 sm:p-12 text-center max-w-xl mx-auto shadow-xs">
        <div className="w-16 h-16 rounded-full bg-green-50 text-green-600 flex items-center justify-center mx-auto mb-4 border border-green-100">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Stop Suggestion Received
        </h2>
        <p className="text-sm text-gray-600 mb-6">
          Thank you for helping improve our transit database. Your suggested bus
          stop has been logged and is awaiting administrative verification.
        </p>
        <button
          onClick={() => {
            setSubmitted(false);
            setFormData({
              suggestedStopName: "",
              routeId: "",
              landmark: "",
              alternativeSpelling: "",
              additionalNotes: "",
            });
          }}
          className="px-5 py-2.5 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-xs transition"
        >
          Suggest Another Stop
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-10 shadow-xs max-w-2xl mx-auto">
      <div className="flex items-center gap-3 pb-6 border-b border-gray-100 mb-6">
        <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
          <MapPin className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            Suggest a Missing Bus Stop
          </h2>
          <p className="text-xs text-gray-500">
            Couldn&apos;t find your bus stop? Submit the details below. Our transit
            moderators will inspect and link it to the relevant routes.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
            Proposed Bus Stop Name *
          </label>
          <input
            type="text"
            required
            placeholder="e.g. South Pier Gate, Old Lighthouse Cross"
            value={formData.suggestedStopName}
            onChange={(e) =>
              setFormData({ ...formData, suggestedStopName: e.target.value })
            }
            className="w-full px-3.5 py-2.5 bg-white text-black font-semibold placeholder:text-gray-600 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-red-500 focus:outline-hidden"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
            Relevant Bus Route (if known)
          </label>
          <select
            value={formData.routeId}
            onChange={(e) =>
              setFormData({ ...formData, routeId: e.target.value })
            }
            className="w-full px-3.5 py-2.5 bg-white text-black font-semibold border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-red-500 focus:outline-hidden"
          >
            <option value="">-- Select route if known --</option>
            {routes.map((r) => (
              <option key={r.id} value={r.id}>
                Bus {r.busNumber} {r.routeName ? `(${r.routeName})` : ""}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
            Nearby Landmark or Location Details
          </label>
          <input
            type="text"
            placeholder="e.g. Opposite Government Library, near West Traffic Signal"
            value={formData.landmark}
            onChange={(e) =>
              setFormData({ ...formData, landmark: e.target.value })
            }
            className="w-full px-3.5 py-2.5 bg-white text-black font-semibold placeholder:text-gray-600 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-red-500 focus:outline-hidden"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
            Alternative Local Name or Spelling (Optional)
          </label>
          <input
            type="text"
            placeholder="e.g. South Pier, Jetty Point"
            value={formData.alternativeSpelling}
            onChange={(e) =>
              setFormData({ ...formData, alternativeSpelling: e.target.value })
            }
            className="w-full px-3.5 py-2.5 bg-white text-black font-semibold placeholder:text-gray-600 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-red-500 focus:outline-hidden"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
            Additional Notes
          </label>
          <textarea
            rows={3}
            placeholder="Between which existing stops is this located? Any special notes?"
            value={formData.additionalNotes}
            onChange={(e) =>
              setFormData({ ...formData, additionalNotes: e.target.value })
            }
            className="w-full px-3.5 py-2.5 bg-white text-black font-semibold placeholder:text-gray-600 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-red-500 focus:outline-hidden"
          />
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl shadow-xs transition disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            {loading ? "Submitting..." : "Submit Stop Suggestion"}
          </button>
        </div>
      </form>
    </div>
  );
}
