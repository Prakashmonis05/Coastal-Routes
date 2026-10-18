import { notFound, redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import RouteForm from "@/components/admin/RouteForm";

export const metadata = {
  title: "Edit Bus Route - Coastal Routes Admin",
  description: "Update bus route details and modify ordered stop sequences.",
};

export default async function EditRoutePage({ params }) {
  const admin = await getAdminSession();
  if (!admin) {
    redirect("/admin/login");
  }

  const { id } = await params;

  const [route, availableStops, pendingFeedbackCount] = await Promise.all([
    prisma.route.findUnique({
      where: { id },
      include: {
        startingPoint: true,
        destination: true,
        routeStops: {
          include: { stop: true },
          orderBy: { stopOrder: "asc" },
        },
      },
    }),
    prisma.stop.findMany({
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
    prisma.feedback.count({ where: { status: "PENDING" } }),
  ]);

  if (!route) {
    notFound();
  }

  return (
    <div className="min-h-screen flex bg-gray-100">
      <AdminSidebar pendingFeedbackCount={pendingFeedbackCount} />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader admin={admin} />

        <main className="flex-1 p-6 sm:p-8 space-y-6 overflow-y-auto">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
              Edit Bus Route {route.busNumber}
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              Modify stop order, add/remove stops, or change route properties.
            </p>
          </div>

          <RouteForm route={route} availableStops={availableStops} />
        </main>
      </div>
    </div>
  );
}
