import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminRoutesList from "@/components/admin/AdminRoutesList";

export const metadata = {
  title: "Manage Routes - Coastal Routes Admin",
  description: "Create, edit, reorder, and configure city bus routes.",
};

export default async function AdminRoutesPage() {
  const admin = await getAdminSession();
  if (!admin) {
    redirect("/admin/login");
  }

  const [routes, pendingFeedbackCount] = await Promise.all([
    prisma.route.findMany({
      include: {
        startingPoint: true,
        destination: true,
        _count: { select: { routeStops: true } },
      },
      orderBy: { busNumber: "asc" },
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
              Route Management
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              Add new routes, reorder sequence stops, or temporarily deactivate
              lines.
            </p>
          </div>

          <AdminRoutesList initialRoutes={routes} />
        </main>
      </div>
    </div>
  );
}
