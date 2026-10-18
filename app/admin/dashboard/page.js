import { redirect } from "next/navigation";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import {
  Route,
  MapPin,
  MessageSquareWarning,
  MessageSquare,
  Plus,
  ArrowRight,
  Clock,
  CheckCircle,
} from "lucide-react";
import { formatDate } from "@/lib/utils/string";

export const metadata = {
  title: "Admin Dashboard - Coastal Routes",
  description: "Transit administration overview and statistics.",
};

export default async function AdminDashboardPage() {
  const admin = await getAdminSession();
  if (!admin) {
    redirect("/admin/login");
  }

  // Fetch real statistics from PostgreSQL
  const [
    activeRoutesCount,
    activeStopsCount,
    pendingFeedbackCount,
    totalFeedbackCount,
    recentRoutes,
    recentFeedbacks,
  ] = await Promise.all([
    prisma.route.count({ where: { isActive: true } }),
    prisma.stop.count({ where: { isActive: true } }),
    prisma.feedback.count({ where: { status: "PENDING" } }),
    prisma.feedback.count(),
    prisma.route.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        startingPoint: true,
        destination: true,
        _count: { select: { routeStops: true } },
      },
    }),
    prisma.feedback.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        route: true,
        stop: true,
      },
    }),
  ]);

  return (
    <div className="min-h-screen flex bg-gray-100">
      <AdminSidebar pendingFeedbackCount={pendingFeedbackCount} />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader admin={admin} />

        <main className="flex-1 p-6 sm:p-8 space-y-8 overflow-y-auto">
          {/* Welcome & Quick Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                Transit Overview
              </h1>
              <p className="text-xs text-gray-500 mt-1">
                Monitor live bus network schedules, stops, and incoming rider
                reports.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/admin/stops/new"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-semibold rounded-lg shadow-2xs transition"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Stop
              </Link>
              <Link
                href="/admin/routes/new"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg shadow-2xs transition"
              >
                <Plus className="w-3.5 h-3.5" />
                Create New Route
              </Link>
            </div>
          </div>

          {/* 4 Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Active Routes
                </span>
                <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center">
                  <Route className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3 text-3xl font-black text-gray-900">
                {activeRoutesCount}
              </div>
              <div className="mt-2 text-[11px] text-gray-400">
                Live on public schedule
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Active Bus Stops
                </span>
                <div className="w-8 h-8 rounded-lg bg-gray-100 text-gray-800 flex items-center justify-center">
                  <MapPin className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3 text-3xl font-black text-gray-900">
                {activeStopsCount}
              </div>
              <div className="mt-2 text-[11px] text-gray-400">
                Registered stops &amp; hubs
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Pending Reports
                </span>
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                  <MessageSquareWarning className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3 text-3xl font-black text-amber-600">
                {pendingFeedbackCount}
              </div>
              <div className="mt-2 text-[11px] text-gray-400">
                Awaiting moderator review
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Total Submissions
                </span>
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <MessageSquare className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3 text-3xl font-black text-gray-900">
                {totalFeedbackCount}
              </div>
              <div className="mt-2 text-[11px] text-gray-400">
                Historical rider feedback
              </div>
            </div>
          </div>

          {/* Dual section: Recent Routes and Recent Feedback */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Routes */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-2xs overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-sm font-bold text-gray-900">
                  Recently Configured Routes
                </h3>
                <Link
                  href="/admin/routes"
                  className="text-xs font-semibold text-red-600 hover:text-red-700 flex items-center gap-1"
                >
                  Manage all <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="divide-y divide-gray-100">
                {recentRoutes.length > 0 ? (
                  recentRoutes.map((r) => (
                    <div
                      key={r.id}
                      className="p-4 flex items-center justify-between hover:bg-gray-50/60 transition text-sm"
                    >
                      <div className="flex items-center gap-3">
                        <span className="px-2.5 py-1 bg-red-600 text-white font-bold text-xs rounded-md">
                          {r.busNumber}
                        </span>
                        <div>
                          <p className="font-semibold text-gray-900 text-xs">
                            {r.routeName || `Bus ${r.busNumber}`}
                          </p>
                          <p className="text-[11px] text-gray-500">
                            {r.startingPoint.name} → {r.destination.name}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-gray-500 block">
                          {r._count.routeStops} stops
                        </span>
                        <Link
                          href={`/admin/routes/${r.id}/edit`}
                          className="text-[11px] font-semibold text-red-600 hover:underline"
                        >
                          Edit
                        </Link>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="p-6 text-xs text-gray-400 text-center">
                    No routes created yet.
                  </p>
                )}
              </div>
            </div>

            {/* Pending & Recent Feedback */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-2xs overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-sm font-bold text-gray-900">
                  Recent Rider Reports
                </h3>
                <Link
                  href="/admin/feedback"
                  className="text-xs font-semibold text-red-600 hover:text-red-700 flex items-center gap-1"
                >
                  Review all <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="divide-y divide-gray-100">
                {recentFeedbacks.length > 0 ? (
                  recentFeedbacks.map((f) => (
                    <div
                      key={f.id}
                      className="p-4 hover:bg-gray-50/60 transition text-xs"
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-bold text-gray-800">
                          {f.feedbackType.replace(/_/g, " ")}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            f.status === "PENDING"
                              ? "bg-amber-100 text-amber-800"
                              : f.status === "APPROVED"
                              ? "bg-green-100 text-green-800"
                              : f.status === "REJECTED"
                              ? "bg-red-100 text-red-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {f.status}
                        </span>
                      </div>
                      <p className="text-gray-600 line-clamp-2 mb-2">
                        {f.description}
                      </p>
                      <div className="flex items-center justify-between text-[11px] text-gray-400">
                        <span>{formatDate(f.createdAt)}</span>
                        {f.suggestedStopName && (
                          <span className="text-red-600 font-medium">
                            Suggested: {f.suggestedStopName}
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="p-6 text-xs text-gray-400 text-center">
                    No reports submitted yet.
                  </p>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
