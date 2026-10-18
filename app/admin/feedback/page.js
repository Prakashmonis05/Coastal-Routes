import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminFeedbackList from "@/components/admin/AdminFeedbackList";

export const metadata = {
  title: "Feedback Review - Coastal Routes Admin",
  description: "Review, approve, and moderate rider feedback and missing stop suggestions.",
};

export default async function AdminFeedbackPage() {
  const admin = await getAdminSession();
  if (!admin) {
    redirect("/admin/login");
  }

  const [feedbacks, pendingFeedbackCount] = await Promise.all([
    prisma.feedback.findMany({
      include: {
        route: true,
        stop: true,
      },
      orderBy: { createdAt: "desc" },
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
              Rider Feedback &amp; Reports
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              Review discrepancy reports, mark duplicates, or convert missing-stop
              suggestions into official transit stops.
            </p>
          </div>

          <AdminFeedbackList initialFeedbacks={feedbacks} />
        </main>
      </div>
    </div>
  );
}
