import { Shield, User } from "lucide-react";

export default function AdminHeader({ admin }) {
  return (
    <header className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
          Admin Portal
        </span>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-50 border border-gray-200 text-xs font-medium text-gray-700">
          <Shield className="w-3.5 h-3.5 text-red-600" />
          <span>Logged in as <strong>{admin?.username || "Admin"}</strong></span>
        </div>
      </div>
    </header>
  );
}
