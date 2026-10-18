import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import StopForm from "@/components/admin/StopForm";

export const metadata = {
  title: "New Bus Stop - Coastal Routes Admin",
  description: "Create a new bus stop with alternative names and aliases.",
};

export default async function NewStopPage() {
  const admin = await getAdminSession();
  if (!admin) {
    redirect("/admin/login");
  }

  const pendingFeedbackCount = await prisma.feedback.count({
    where: { status: "PENDING" },
  });

  return (
    <div className="min-h-screen flex bg-gray-100">
      <AdminSidebar pendingFeedbackCount={pendingFeedbackCount} />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader admin={admin} />

        <main className="flex-1 p-6 sm:p-8 space-y-6 overflow-y-auto">
          <StopForm />
        </main>
      </div>
    </div>
  );
}
