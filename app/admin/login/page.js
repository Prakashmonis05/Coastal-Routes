import { redirect } from "next/navigation";
import Link from "next/link";
import { getAdminSession } from "@/lib/auth";
import AdminLoginForm from "@/components/admin/AdminLoginForm";
import { Bus, ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Admin Sign In - Coastal Routes",
  description: "Secure administrator sign in for Coastal Routes moderation.",
};

export default async function AdminLoginPage() {
  const session = await getAdminSession();
  if (session) {
    redirect("/admin/dashboard");
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link
          href="/"
          className="inline-flex items-center gap-2 mb-4 group"
        >
          <div className="w-12 h-12 rounded-xl bg-red-600 flex items-center justify-center text-white shadow-xs group-hover:bg-red-700 transition">
            <Bus className="w-7 h-7" />
          </div>
        </Link>
        <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">
          Admin Portal Login
        </h2>
        <p className="mt-1 text-xs text-gray-500">
          Enter authorized administrative credentials to manage transit data.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-sm border border-gray-200 rounded-2xl">
          <AdminLoginForm />

          <div className="mt-6 pt-6 border-t border-gray-100 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-red-600 transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Return to Public Website
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
