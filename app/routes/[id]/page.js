import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import RouteDetailView from "@/components/routes/RouteDetailView";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const route = await prisma.route.findUnique({
    where: { id },
    include: { startingPoint: true, destination: true },
  });

  if (!route) {
    return {
      title: "Route Not Found - Coastal Routes",
      description: "The requested bus route could not be found.",
    };
  }

  const title = `Bus ${route.busNumber}${
    route.routeName ? ` - ${route.routeName}` : ""
  } (${route.startingPoint.name} to ${route.destination.name}) | Coastal Routes`;

  return {
    title,
    description: `Complete route and stop sequence for Bus ${route.busNumber} from ${route.startingPoint.name} to ${route.destination.name}.`,
  };
}

export default async function RouteDetailsPage({ params }) {
  const { id } = await params;

  const route = await prisma.route.findUnique({
    where: { id },
    include: {
      startingPoint: true,
      destination: true,
      routeStops: {
        include: {
          stop: {
            include: {
              aliases: true,
            },
          },
        },
        orderBy: {
          stopOrder: "asc",
        },
      },
    },
  });

  if (!route) {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-1">
        <RouteDetailView route={route} />
      </main>
      <Footer />
    </div>
  );
}
