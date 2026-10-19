export default function manifest() {
  return {
    name: "Coastal Routes - Mangalore Bus Routes & Private Buses",
    short_name: "Mangalore Bus",
    description:
      "Find Mangalore city bus routes, Mangalore private buses, bus numbers, intermediate stop sequences, and schedules.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#dc2626",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
