import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ToastProvider from "@/components/ui/ToastProvider";
import { DEFAULT_SEO, SITE_URL } from "@/lib/constants/seo";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: DEFAULT_SEO.defaultTitle,
    template: DEFAULT_SEO.titleTemplate,
  },
  description: DEFAULT_SEO.defaultDescription,
  keywords: DEFAULT_SEO.keywords,
  authors: [{ name: "Coastal Routes Team", url: SITE_URL }],
  creator: "Coastal Routes",
  publisher: "Coastal Routes",
  formatDetection: {
    email: false,
    address: true,
    telephone: false,
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: DEFAULT_SEO.defaultTitle,
    description: DEFAULT_SEO.defaultDescription,
    url: SITE_URL,
    siteName: "Coastal Routes - Mangalore Bus Routes",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: DEFAULT_SEO.defaultTitle,
    description: DEFAULT_SEO.defaultDescription,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  category: "Transportation & Transit",
};

export default function RootLayout({ children }) {
  const globalSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: "Coastal Routes - Mangalore Bus Routes & Private Buses",
        description:
          "Comprehensive guide and route finder for Mangalore city bus routes, private buses, bus timings, and stop schedules.",
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
        inLanguage: "en-IN",
      },
      {
        "@type": "TransitSystem",
        "@id": `${SITE_URL}/#transit-system`,
        name: "Mangalore City & Private Bus Transit Network",
        alternateName: [
          "Mangalore Bus Routes",
          "Mangalore Private Buses",
          "Mangaluru City Bus Guide",
          "Dakshina Kannada City Buses",
        ],
        areaServed: {
          "@type": "AdministrativeArea",
          name: "Mangaluru (Mangalore), Dakshina Kannada, Karnataka, India",
        },
        description:
          "Transit route directory and stop sequence finder for Mangalore private buses and city buses operating from State Bank, Kankanady, Surathkal, and regional hubs.",
      },
    ],
  };

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(globalSchema) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-white text-gray-900 selection:bg-red-500 selection:text-white">
        <ToastProvider />
        {children}
      </body>
    </html>
  );
}
