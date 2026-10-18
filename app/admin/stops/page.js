import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminStopsList from "@/components/admin/AdminStopsList";

export const metadata = {
  title: "Manage Stops - Coastal Routes Admin",
  description: "View and manage city bus stops and alternative names.",
};

export default async function AdminStopsPage() {
  const admin = await getAdminSession();
  if (!admin) {
    redirect("/admin/login");
  }

  const [stops, pendingFeedbackCount] = await Promise.all([
    prisma.stop.findMany({
      include: {
        aliases: true,
        _count: { select: { routeStops: true } },
      },
      orderBy: { name: "asc" },
    }),
    prisma.feedback.count({ where: { status: "PENDING" } }),
  ]);

  return (
    <div className="min-h-screen flex bg-gray-100">
      <AdminSidebar pendingFeedbackCount={pendingFeedbackCount} />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader admin={admin} />

        <main className="flex-1 p-6 sm:p-8 space-y-6 overflow-y-auto">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
              Bus Stop Management
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              Add new stops, manage aliases, check route associations, or
              safely deactivate outdated hubs.
            </p>
          </div>

          <AdminStopsList initialStops={stops} />
        </main>
      </div>
    </div>
  );
}
