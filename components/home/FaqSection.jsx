"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

export const FAQS = [
  {
    question: "How do I find Mangalore private bus routes and bus numbers?",
    answer:
      "You can search directly by entering any Mangalore city or private bus number (e.g. 2, 2A, 15, 27, 45, 51) in the search bar above, or enter your starting stop and destination (e.g. 'State Bank' to 'Surathkal'). Coastal Routes gives you full verified stop sequences, intermediate stops, and direction-aware schedules.",
  },
  {
    question: "Which private buses run from Mangalore State Bank to Surathkal / NITK?",
    answer:
      "Buses such as Route 2, 2A, 2B, 15, and fast private express buses frequently run between State Bank Terminal (Hampankatta) and Surathkal via Ladyhill, Urwa Stores, Kulur Bridge, and Panambur Beach. Buses depart every 2 to 5 minutes during peak hours.",
  },
  {
    question: "How does the private bus numbering system work in Mangalore?",
    answer:
      "Mangalore city and private buses operate under standardized route numbers established by local transport authorities. Main routes carry numbers from 1 to 60+ (e.g., 2 for Surathkal, 51 for Konaje / Mangalore University, 27 for Mangaladevi). Letter suffixes like A, B, or C indicate slight route deviations or extension stops.",
  },
  {
    question: "Where is the main private bus stand in Mangalore?",
    answer:
      "The primary city and private bus terminus is the State Bank Bus Stand located near Hampankatta and Mangalore Central Railway Station. Other crucial transit interchange hubs include Kankanady / Pumpwell Circle, Jyothi Circle (Ambedkar Circle), KSRTC Bejai Bus Stand, and Surathkal Junction.",
  },
  {
    question: "Are Mangalore private buses different from KSRTC buses?",
    answer:
      "Yes. While KSRTC operates government-run buses (primarily intercity and select city services), Mangalore's intra-city public transit is predominantly operated by private bus networks, known for their distinctive liveries, high frequencies, and connectivity across residential and coastal pockets.",
  },
  {
    question: "How can I report a missing bus stop or change in route?",
    answer:
      "Coastal Routes is community-driven. If a stop name has changed, a bus stop is missing, or a route detour exists, simply click 'Suggest a Bus Stop' or use the 'Send Feedback' button on any route page. All submissions are reviewed and verified.",
  },
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState(0);

  function toggleFaq(index) {
    setOpenIndex(openIndex === index ? null : index);
  }

  return (
    <section className="py-16 bg-white border-b border-gray-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-700 text-xs font-bold uppercase tracking-wider mb-3">
            <HelpCircle className="w-4 h-4" />
            Frequently Asked Questions
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Mangalore Bus Routes &amp; Private Buses FAQ
          </h2>
          <p className="mt-2 text-sm text-gray-600 max-w-xl mx-auto">
            Everything commuters and visitors need to know about navigating Mangaluru&apos;s
            private bus network.
          </p>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={faq.question}
                className="border border-gray-200 rounded-2xl overflow-hidden transition-colors bg-white hover:border-gray-300"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full flex items-center justify-between p-5 text-left font-bold text-gray-900 text-base focus:outline-hidden"
                  aria-expanded={isOpen}
                >
                  <span className="pr-4">{faq.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-500 transition-transform duration-200 shrink-0 ${
                      isOpen ? "rotate-180 text-red-600" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-sm text-gray-700 leading-relaxed border-t border-gray-100 pt-3">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
