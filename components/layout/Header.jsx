"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bus, Menu, X, MessageSquarePlus } from "lucide-react";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "All Routes", href: "/routes" },
    { name: "About", href: "/about" },
  ];

  const isActive = (path) => pathname === path;

  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-gray-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center text-white shadow-xs group-hover:bg-red-700 transition">
              <Bus className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-gray-900 group-hover:text-red-600 transition">
                Coastal Routes
              </span>
              <span className="block text-xs font-medium text-gray-500">
                City Bus Route Finder
              </span>
            </div>
          </Link>

          {/* Desktop Navigation: Home | All Routes | About | Suggest Changes */}
          <nav className="hidden md:flex items-center gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition ${
                  isActive(link.href)
                    ? "bg-red-50 text-red-700 font-bold"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                {link.name}
              </Link>
            ))}

            <div className="ml-3 pl-3 border-l border-gray-200">
              <Link
                href="/feedback"
                className={`inline-flex items-center gap-1.5 px-4 py-2 text-sm font-bold rounded-xl transition ${
                  isActive("/feedback")
                    ? "bg-red-700 text-white shadow-xs"
                    : "bg-red-600 hover:bg-red-700 text-white shadow-xs"
                }`}
              >
                <MessageSquarePlus className="w-4 h-4" />
                Suggest Changes
              </Link>
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              type="button"
              className="p-2 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-hidden"
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 px-4 pt-2 pb-4 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded-xl text-base font-semibold ${
                isActive(link.href)
                  ? "bg-red-50 text-red-700 font-bold"
                  : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-2">
            <Link
              href="/feedback"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 w-full px-4 py-2.5 text-base font-bold rounded-xl text-white bg-red-600 hover:bg-red-700 shadow-xs transition"
            >
              <MessageSquarePlus className="w-5 h-5" />
              Suggest Changes
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
