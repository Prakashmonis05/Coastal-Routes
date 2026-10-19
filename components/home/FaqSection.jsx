"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

import { FAQS } from "@/lib/constants/faqs";

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
