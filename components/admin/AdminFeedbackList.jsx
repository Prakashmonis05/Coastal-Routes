"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  MessageSquare,
  CheckCircle,
  XCircle,
  Copy,
  Clock,
  MapPin,
  Bus,
  PlusCircle,
  ChevronRight,
  Filter,
} from "lucide-react";
import {
  reviewFeedbackAction,
  applyMissingStopFeedbackAction,
} from "@/app/actions/feedbackActions";
import { formatDate } from "@/lib/utils/string";

export default function AdminFeedbackList({ initialFeedbacks = [] }) {
  const [feedbacks, setFeedbacks] = useState(initialFeedbacks);
  const [filter, setFilter] = useState("PENDING"); // 'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED' | 'DUPLICATE'
  const [processingId, setProcessingId] = useState(null);
  const [reviewNotes, setReviewNotes] = useState({});

  const filtered = feedbacks.filter((f) => {
    if (filter === "ALL") return true;
    return f.status === filter;
  });

  async function handleStatusChange(feedbackId, newStatus) {
    setProcessingId(feedbackId);
    const note = reviewNotes[feedbackId] || null;

    try {
      const res = await reviewFeedbackAction(feedbackId, {
        status: newStatus,
        reviewNote: note,
      });

      if (res.success) {
        setFeedbacks(
          feedbacks.map((f) =>
            f.id === feedbackId
              ? { ...f, status: newStatus, reviewNote: note, reviewedAt: new Date() }
              : f
          )
        );
        toast.success(`Marked report as ${newStatus}.`);
      } else {
        toast.error(res.error || "Failed to update report.");
      }
    } catch {
      toast.error("Error updating feedback.");
    } finally {
      setProcessingId(null);
    }
  }

  async function handleCreateSuggestedStop(feedback) {
    if (!feedback.suggestedStopName) {
      toast.error("No suggested stop name provided.");
      return;
    }

    setProcessingId(feedback.id);
    try {
      const res = await applyMissingStopFeedbackAction(feedback.id, {
        name: feedback.suggestedStopName,
        description: `Created from rider report: ${feedback.description}`,
      });

      if (res.success) {
        setFeedbacks(
          feedbacks.map((f) =>
            f.id === feedback.id
              ? {
                  ...f,
                  status: "APPROVED",
                  reviewNote: `Approved & created stop "${res.stop.name}".`,
                  stopId: res.stop.id,
                }
              : f
          )
        );
        toast.success(`Created bus stop "${res.stop.name}" and marked report APPROVED!`);
      } else {
        toast.error(res.error || "Failed to create stop.");
      }
    } catch {
      toast.error("Error applying stop creation.");
    } finally {
      setProcessingId(null);
    }
  }

  const counts = {
    ALL: feedbacks.length,
    PENDING: feedbacks.filter((f) => f.status === "PENDING").length,
    APPROVED: feedbacks.filter((f) => f.status === "APPROVED").length,
    REJECTED: feedbacks.filter((f) => f.status === "REJECTED").length,
    DUPLICATE: feedbacks.filter((f) => f.status === "DUPLICATE").length,
  };

  return (
    <div className="space-y-6">
      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-gray-200 pb-4">
        {["PENDING", "APPROVED", "REJECTED", "DUPLICATE", "ALL"].map((st) => (
          <button
            key={st}
            onClick={() => setFilter(st)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              filter === st
                ? "bg-red-600 text-white shadow-xs"
                : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
            }`}
          >
            <span>{st === "ALL" ? "All Reports" : st}</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                filter === st
                  ? "bg-white/20 text-white"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {counts[st]}
            </span>
          </button>
        ))}
      </div>

      {/* Reports Feed */}
      <div className="space-y-4">
        {filtered.length > 0 ? (
          filtered.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-gray-200 rounded-2xl p-6 shadow-2xs space-y-4"
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded bg-gray-100 text-gray-800 font-bold text-xs">
                    {item.feedbackType.replace(/_/g, " ")}
                  </span>
                  {item.route && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-red-50 text-red-700 font-bold text-xs">
                      <Bus className="w-3.5 h-3.5" />
                      Bus {item.route.busNumber}
                    </span>
                  )}
                  {item.stop && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-blue-50 text-blue-700 font-bold text-xs">
                      <MapPin className="w-3.5 h-3.5" />
                      {item.stop.name}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                      item.status === "PENDING"
                        ? "bg-amber-100 text-amber-800"
                        : item.status === "APPROVED"
                        ? "bg-green-100 text-green-800"
                        : item.status === "REJECTED"
                        ? "bg-red-100 text-red-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {item.status}
                  </span>
                  <span className="text-xs text-gray-400">
                    {formatDate(item.createdAt)}
                  </span>
                </div>
              </div>

              {/* Body */}
              <div className="space-y-2 text-sm text-gray-800">
                <p className="whitespace-pre-wrap">{item.description}</p>

                {item.suggestedStopName && (
                  <div className="p-3 bg-red-50/50 border border-red-100 rounded-xl text-xs text-red-900 flex items-center justify-between gap-3">
                    <div>
                      <span className="font-semibold block">
                        Suggested Stop Name:
                      </span>
                      <span className="text-base font-bold text-red-700">
                        {item.suggestedStopName}
                      </span>
                    </div>

                    {item.status === "PENDING" && (
                      <button
                        type="button"
                        onClick={() => handleCreateSuggestedStop(item)}
                        disabled={processingId === item.id}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-2xs text-xs transition disabled:opacity-50"
                      >
                        <PlusCircle className="w-3.5 h-3.5" />
                        Create &amp; Approve Stop
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Review notes if existing */}
              {item.reviewNote && (
                <div className="p-3 bg-gray-50 rounded-xl text-xs text-gray-600 border border-gray-100">
                  <span className="font-semibold text-gray-800">Admin Note: </span>
                  {item.reviewNote}
                </div>
              )}

              {/* Moderator Action Bar */}
              <div className="pt-3 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="w-full sm:w-auto flex-1 max-w-md">
                  <input
                    type="text"
                    placeholder="Add an internal review note..."
                    value={reviewNotes[item.id] || ""}
                    onChange={(e) =>
                      setReviewNotes({
                        ...reviewNotes,
                        [item.id]: e.target.value,
                      })
                    }
                    className="w-full px-3 py-1.5 bg-white text-black font-semibold placeholder:text-gray-600 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-red-500 focus:outline-hidden"
                  />
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  <button
                    type="button"
                    onClick={() => handleStatusChange(item.id, "APPROVED")}
                    disabled={processingId === item.id || item.status === "APPROVED"}
                    className="px-3 py-1.5 bg-green-50 hover:bg-green-100 text-green-700 border border-green-200 text-xs font-semibold rounded-lg transition disabled:opacity-40"
                  >
                    Approve
                  </button>
                  <button
                    type="button"
                    onClick={() => handleStatusChange(item.id, "REJECTED")}
                    disabled={processingId === item.id || item.status === "REJECTED"}
                    className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-semibold rounded-lg transition disabled:opacity-40"
                  >
                    Reject
                  </button>
                  <button
                    type="button"
                    onClick={() => handleStatusChange(item.id, "DUPLICATE")}
                    disabled={processingId === item.id || item.status === "DUPLICATE"}
                    className="px-3 py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200 text-xs font-semibold rounded-lg transition disabled:opacity-40"
                  >
                    Duplicate
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white border border-gray-200 rounded-2xl p-10 text-center text-xs text-gray-500">
            No feedback reports found under this filter.
          </div>
        )}
      </div>
    </div>
  );
}
