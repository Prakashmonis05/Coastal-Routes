import prisma from "@/lib/prisma";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SuggestStopForm from "@/components/feedback/SuggestStopForm";

export const metadata = {
  title: "Suggest a Missing Bus Stop - Coastal Routes",
  description:
    "Suggest a missing bus stop in the city bus transit network with landmark details.",
};

export default async function SuggestStopPage({ searchParams }) {
  const params = await searchParams;
  const initialName = params?.name || "";

  const routes = await prisma.route.findMany({
    where: { isActive: true },
    select: { id: true, busNumber: true, routeName: true },
    orderBy: { busNumber: "asc" },
  });

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <SuggestStopForm routes={routes} initialName={initialName} />
      </main>
      <Footer />
    </div>
  );
}
