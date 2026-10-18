import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import RouteForm from "@/components/admin/RouteForm";

export const metadata = {
  title: "Create Bus Route - Coastal Routes Admin",
  description: "Create and order new city bus route stop sequences.",
};

export default async function NewRoutePage() {
  const admin = await getAdminSession();
  if (!admin) {
    redirect("/admin/login");
  }

  const [availableStops, pendingFeedbackCount] = await Promise.all([
    prisma.stop.findMany({
      where: { isActive: true },
      select: { id: true, name: true },
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
              Create New Bus Route
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              Specify bus number, starting point, ordered intermediate stops, and destination.
            </p>
          </div>

          <RouteForm availableStops={availableStops} />
        </main>
      </div>
    </div>
  );
}
