"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Route,
  MapPin,
  MessageSquareWarning,
  LogOut,
  Bus,
  ExternalLink,
} from "lucide-react";
import { logoutAdminAction } from "@/app/actions/authActions";

export default function AdminSidebar({ pendingFeedbackCount = 0 }) {
  const pathname = usePathname();

  const links = [
    {
      name: "Dashboard",
      href: "/admin/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Manage Routes",
      href: "/admin/routes",
      icon: Route,
    },
    {
      name: "Manage Stops",
      href: "/admin/stops",
      icon: MapPin,
    },
    {
      name: "Feedback & Reports",
      href: "/admin/feedback",
      icon: MessageSquareWarning,
      badge: pendingFeedbackCount > 0 ? pendingFeedbackCount : null,
    },
  ];

  return (
    <aside className="w-64 bg-gray-900 text-gray-300 flex flex-col shrink-0 min-h-screen">
      {/* Brand */}
      <div className="p-5 border-b border-gray-800 flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-red-600 text-white flex items-center justify-center font-bold">
          <Bus className="w-5 h-5" />
        </div>
        <div>
          <span className="text-sm font-bold text-white block">
            Coastal Admin
          </span>
          <span className="text-[11px] text-gray-400 block">
            Transit Moderation
          </span>
        </div>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 p-4 space-y-1">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive =
            pathname === link.href ||
            (link.href !== "/admin/dashboard" && pathname.startsWith(link.href));

          return (
            <Link
              key={link.name}
              href={link.href}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition ${
                isActive
                  ? "bg-red-600 text-white shadow-xs font-semibold"
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className="w-4 h-4" />
                <span>{link.name}</span>
              </div>
              {link.badge && (
                <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-red-500 text-white">
                  {link.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer controls */}
      <div className="p-4 border-t border-gray-800 space-y-2">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-gray-400 hover:text-white rounded-lg hover:bg-gray-800 transition"
        >
          <ExternalLink className="w-4 h-4" />
          <span>View Public Site</span>
        </Link>

        <form action={logoutAdminAction}>
          <button
            type="submit"
            className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-red-400 hover:text-red-300 rounded-lg hover:bg-red-950/40 transition"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </form>
      </div>
    </aside>
  );
}
