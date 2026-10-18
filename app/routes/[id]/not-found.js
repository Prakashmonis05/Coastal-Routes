import Link from "next/link";
import { Bus, ArrowLeft, Search } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function RouteNotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50/50">
      <Header />
      <main className="flex-1 max-w-xl mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-4 border border-red-100">
          <Bus className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Route Not Found
        </h1>
        <p className="text-sm text-gray-600 mb-6">
          The bus route you are looking for does not exist or has been removed
          from the transit schedule.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/routes"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Browse All Routes
          </Link>
          <Link
            href="/search"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 shadow-xs transition"
          >
            <Search className="w-4 h-4" />
            Search Other Routes
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
