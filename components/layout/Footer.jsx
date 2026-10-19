import Link from "next/link";
import { Bus, HeartHandshake, ShieldCheck } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-auto bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-md bg-red-600 flex items-center justify-center text-white">
                <Bus className="w-5 h-5" />
              </div>
              <span className="text-lg font-bold text-gray-900">
                Coastal Routes
              </span>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed max-w-md">
              The premier Mangalore bus routes and Mangalore private buses route finder.
              Making coastal public transit transparent, predictable, and easy
              for daily commuters and visitors across Dakshina Kannada.
            </p>
            <div className="flex items-center gap-2 text-xs text-gray-500 bg-white border border-gray-200 rounded-md p-3 max-w-md">
              <HeartHandshake className="w-4 h-4 text-red-600 shrink-0" />
              <span>
                Noticed a missing stop or altered Mangalore private bus route? Use our feedback form to
                help keep transit schedules accurate for everyone.
              </span>
            </div>
          </div>

          {/* Popular Corridors */}
          <div>
            <h3 className="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-4">
              Mangalore Routes
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/search?from=State+Bank&to=Surathkal&mode=point-to-point"
                  className="text-gray-600 hover:text-red-600 transition"
                >
                  State Bank ⇄ Surathkal
                </Link>
              </li>
              <li>
                <Link
                  href="/search?from=State+Bank&to=Mangalore+University&mode=point-to-point"
                  className="text-gray-600 hover:text-red-600 transition"
                >
                  State Bank ⇄ Konaje (MU)
                </Link>
              </li>
              <li>
                <Link
                  href="/search?from=State+Bank&to=Kankanady&mode=point-to-point"
                  className="text-gray-600 hover:text-red-600 transition"
                >
                  State Bank ⇄ Kankanady
                </Link>
              </li>
              <li>
                <Link
                  href="/search?from=State+Bank&to=Panambur&mode=point-to-point"
                  className="text-gray-600 hover:text-red-600 transition"
                >
                  State Bank ⇄ Panambur
                </Link>
              </li>
              <li>
                <Link
                  href="/search?from=State+Bank&to=Bajpe+Aerodrome&mode=point-to-point"
                  className="text-gray-600 hover:text-red-600 transition"
                >
                  State Bank ⇄ Bajpe Airport
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-4">
              Explore
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/"
                  className="text-gray-600 hover:text-red-600 transition"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/search"
                  className="text-gray-600 hover:text-red-600 transition"
                >
                  Search Buses
                </Link>
              </li>
              <li>
                <Link
                  href="/routes"
                  className="text-gray-600 hover:text-red-600 transition"
                >
                  All Mangalore Routes
                </Link>
              </li>
              <li>
                <Link
                  href="/suggest-stop"
                  className="text-gray-600 hover:text-red-600 transition"
                >
                  Suggest a Bus Stop
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-gray-600 hover:text-red-600 transition"
                >
                  About Mangalore Transit
                </Link>
              </li>
            </ul>
          </div>

          {/* Help & Feedback */}
          <div>
            <h3 className="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-4">
              Feedback & Staff
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/feedback"
                  className="text-gray-600 hover:text-red-600 transition"
                >
                  Suggest Route Changes
                </Link>
              </li>
              <li>
                <Link
                  href="/suggest-stop"
                  className="text-gray-600 hover:text-red-600 transition"
                >
                  Missing Stop Submission
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/login"
                  className="inline-flex items-center gap-1 text-gray-400 hover:text-gray-600 text-xs transition mt-4"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Staff Portal
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <p>© 2026 Coastal Routes - Mangalore Bus Routes &amp; Private Buses Guide. All rights reserved.</p>
          <p className="text-gray-400">
            Namma Kudla Transit • Mangaluru, Karnataka
          </p>
        </div>
      </div>
    </footer>
  );
}
