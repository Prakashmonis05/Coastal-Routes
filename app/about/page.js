import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { Bus, ShieldCheck, HeartHandshake, MapPin, ArrowRight } from "lucide-react";

export const metadata = {
  title: "About Mangalore City & Private Bus Routes Transit | Coastal Routes",
  description:
    "Learn about Coastal Routes: Mangalore's dedicated private bus and city transit route mapping initiative for daily commuters and travelers across Dakshina Kannada.",
  keywords: [
    "about mangalore bus routes",
    "mangalore private buses",
    "mangaluru city bus network",
    "coastal routes mangalore",
    "state bank bus stand mangalore",
  ],
  alternates: {
    canonical: "/about",
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900">
      <Header />
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white border border-gray-300 rounded-3xl p-8 sm:p-12 shadow-sm space-y-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-100 text-red-700 text-xs font-bold uppercase tracking-wider mb-3">
              <Bus className="w-4 h-4" />
              About Coastal Routes
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-gray-950 tracking-tight">
              Making Mangalore Bus Routes &amp; Private Buses Accessible
            </h1>
            <p className="text-base text-gray-800 font-medium mt-4 leading-relaxed">
              <strong>Coastal Routes</strong> is a dedicated public transit initiative built to solve a fundamental
              commuter challenge in Mangaluru (Mangalore): knowing which bus to catch, where it stops, and
              whether it stops where you need to go. Mangalore is famous across coastal Karnataka for its
              dynamic, high-frequency <strong>private bus network</strong> operating from State Bank, Kankanady,
              Surathkal, and beyond.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-gray-200">
            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center font-bold">
                <Bus className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-gray-950 text-base">
                Sequential Stop Order
              </h3>
              <p className="text-xs text-gray-800 font-medium leading-relaxed">
                Every Mangalore route clearly shows stops from starting terminal to final
                destination so commuters never travel in the wrong direction.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-gray-900 text-white flex items-center justify-center font-bold">
                <MapPin className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-gray-950 text-base">
                Alias &amp; Fuzzy Search
              </h3>
              <p className="text-xs text-gray-800 font-medium leading-relaxed">
                Whether you search &quot;State Bank&quot;, &quot;SB&quot;, &quot;Suratkal&quot;, or have a spelling
                typo, our Mangalore transit search handles local aliases and similarity matching.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-gray-950 text-base">
                Verified Moderation
              </h3>
              <p className="text-xs text-gray-800 font-medium leading-relaxed">
                Public feedback, timetable corrections, and missing-stop suggestions are carefully
                reviewed by administrators before changes go live.
              </p>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-200 space-y-4 text-sm text-gray-800 font-medium leading-relaxed">
            <h2 className="text-xl font-extrabold text-gray-950">
              Community-Driven Transit Quality in Dakshina Kannada
            </h2>
            <p>
              Transit routes are only as good as the information commuters have.
              If a bus stop name has changed, a stop has been moved due to smart city road
              construction, or a new bus route is introduced, anyone can report
              it directly from any route page or our dedicated feedback section.
            </p>
          </div>

          <div className="pt-6 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <Link
              href="/routes"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-xs transition"
            >
              Browse All Routes <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/feedback"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-900 hover:bg-black text-white font-bold rounded-xl transition"
            >
              Suggest Changes
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
