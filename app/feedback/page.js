import prisma from "@/lib/prisma";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import FeedbackForm from "@/components/feedback/FeedbackForm";
import { MessageSquarePlus } from "lucide-react";

export const metadata = {
  title: "Suggest Changes & Feedback for Mangalore Bus Routes | Coastal Routes",
  description:
    "Report incorrect Mangalore private bus routes, missing intermediate stops, wrong stop order, or suggest updates to city bus schedules.",
  keywords: [
    "mangalore bus feedback",
    "mangalore bus route correction",
    "mangalore private bus suggestions",
  ],
  alternates: {
    canonical: "/feedback",
  },
};

export default async function FeedbackPage() {
  const [routes, stops] = await Promise.all([
    prisma.route.findMany({
      where: { isActive: true },
      select: { id: true, busNumber: true, routeName: true },
      orderBy: { busNumber: "asc" },
    }),
    prisma.stop.findMany({
      where: { isActive: true },
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
  ]);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <FeedbackForm routes={routes} stops={stops} />
      </main>
      <Footer />
    </div>
  );
}
