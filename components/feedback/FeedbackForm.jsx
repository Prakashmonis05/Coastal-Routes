"use client";

import { useState } from "react";
import { toast } from "sonner";
import { MessageSquarePlus, Send, CheckCircle2 } from "lucide-react";
import { submitFeedbackAction } from "@/app/actions/feedbackActions";

export default function FeedbackForm({ routes = [], stops = [] }) {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    feedbackType: "GENERAL_FEEDBACK",
    routeId: "",
    stopId: "",
    suggestedStopName: "",
    description: "",
  });

  async function handleSubmit(e) {
    e.preventDefault();
    if (!formData.description.trim()) {
      toast.error("Please enter a description.");
      return;
    }

    setLoading(true);
    try {
      const res = await submitFeedbackAction({
        feedbackType: formData.feedbackType,
        routeId: formData.routeId || null,
        stopId: formData.stopId || null,
        suggestedStopName: formData.suggestedStopName || null,
        description: formData.description.trim(),
      });

      if (res.success) {
        toast.success(res.message);
        setSubmitted(true);
      } else {
        toast.error(res.error || "Failed to submit feedback.");
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
          Feedback Submitted
        </h2>
        <p className="text-sm text-gray-600 mb-6">
          Thank you for helping improve our bus route information. Your report has
          been submitted for review by the administrative team.
        </p>
        <button
          onClick={() => {
            setSubmitted(false);
            setFormData({
              feedbackType: "GENERAL_FEEDBACK",
              routeId: "",
              stopId: "",
              suggestedStopName: "",
              description: "",
            });
          }}
          className="px-5 py-2.5 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-xs transition"
        >
          Submit Another Report
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-10 shadow-xs max-w-2xl mx-auto">
      <div className="flex items-center gap-3 pb-6 border-b border-gray-100 mb-6">
        <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
          <MessageSquarePlus className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            Suggest Changes &amp; Route Feedback
          </h2>
          <p className="text-xs text-gray-500">
            Suggest corrections, report discrepancies, or propose route updates. Submissions are
            reviewed by moderators before updating public schedules.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
            Feedback Category *
          </label>
          <select
            value={formData.feedbackType}
            onChange={(e) =>
              setFormData({ ...formData, feedbackType: e.target.value })
            }
            className="w-full px-3.5 py-2.5 bg-white text-black font-semibold border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-red-500 focus:outline-hidden"
          >
            <option value="GENERAL_FEEDBACK">General Feedback / Comment</option>
            <option value="INCORRECT_ROUTE">Incorrect Route Information</option>
            <option value="INCORRECT_STOP_NAME">Incorrect Stop Name</option>
            <option value="INCORRECT_STOP_ORDER">Incorrect Stop Sequence / Order</option>
            <option value="INCORRECT_START_DEST">Incorrect Starting Point or Destination</option>
            <option value="MISSING_STOP">Missing Bus Stop</option>
            <option value="OTHER">Other Issue</option>
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
              Related Bus Route (Optional)
            </label>
            <select
              value={formData.routeId}
              onChange={(e) =>
                setFormData({ ...formData, routeId: e.target.value })
              }
              className="w-full px-3.5 py-2.5 bg-white text-black font-semibold border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-red-500 focus:outline-hidden"
            >
              <option value="">-- None / General --</option>
              {routes.map((r) => (
                <option key={r.id} value={r.id}>
                  Bus {r.busNumber} {r.routeName ? `(${r.routeName})` : ""}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
              Related Bus Stop (Optional)
            </label>
            <select
              value={formData.stopId}
              onChange={(e) =>
                setFormData({ ...formData, stopId: e.target.value })
              }
              className="w-full px-3.5 py-2.5 bg-white text-black font-semibold border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-red-500 focus:outline-hidden"
            >
              <option value="">-- None / General --</option>
              {stops.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {(formData.feedbackType === "MISSING_STOP" ||
          formData.feedbackType === "INCORRECT_STOP_NAME") && (
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
              Suggested Stop Name
            </label>
            <input
              type="text"
              placeholder="e.g. West Coast Junction"
              value={formData.suggestedStopName}
              onChange={(e) =>
                setFormData({ ...formData, suggestedStopName: e.target.value })
              }
              className="w-full px-3.5 py-2.5 bg-white text-black font-semibold placeholder:text-gray-600 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-red-500 focus:outline-hidden"
            />
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
            Detailed Description *
          </label>
          <textarea
            required
            rows={5}
            placeholder="Please describe the issue or suggestion with specific details..."
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
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
            {loading ? "Submitting..." : "Submit Feedback"}
          </button>
        </div>
      </form>
    </div>
  );
}
