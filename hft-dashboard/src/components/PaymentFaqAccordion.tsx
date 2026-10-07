"use client";

import React, { useState } from "react";
import { ChevronDown, HelpCircle, ShieldCheck, CreditCard, Gift, RefreshCw } from "lucide-react";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  icon: React.ReactNode;
}

const PAYMENT_FAQS: FAQItem[] = [
  {
    id: "free-trial",
    question: "How does the 14-Day Free Trial work?",
    answer: "All new traders get instant access to Pro Quant or Institutional features for 14 full days without entering credit card or payment details. If you choose not to upgrade after 14 days, your account seamlessly downgrades to the free Retail tier.",
    icon: <Gift className="h-4 w-4 text-[#10b981]" />,
  },
  {
    id: "gst-invoice",
    question: "Can I claim 18% GST Input Tax Credit (ITC) for my business?",
    answer: "Yes! During checkout, enter your company's 15-digit GSTIN number. We issue tax-compliant B2B invoices with SAC Code 998313 (Information Technology Software Services) allowing 100% GST ITC claim.",
    icon: <ShieldCheck className="h-4 w-4 text-[#387ed1]" />,
  },
  {
    id: "payment-methods",
    question: "Which Indian payment methods are accepted?",
    answer: "We support BHIM UPI (Google Pay, PhonePe, Paytm), Visa/Mastercard/RuPay credit & debit cards, and direct Netbanking via SBI, HDFC, ICICI, and Axis Bank.",
    icon: <CreditCard className="h-4 w-4 text-purple-400" />,
  },
  {
    id: "cancellation",
    question: "Can I cancel or switch subscription plans at any time?",
    answer: "Yes. You can switch between Monthly and Annual billing or cancel anytime with 1-click in your terminal. Unused days are credited on a pro-rata basis.",
    icon: <RefreshCw className="h-4 w-4 text-[#ff5722]" />,
  },
];

/**
 * Payment & Subscription FAQ Accordion Component
 * 
 * Humanized Explanation for Maintainers:
 * Frequently asked questions regarding subscription billing, 14-day free trials, 
 * 18% GST tax invoices, and Indian payment gateways (UPI / Cards / NetBanking).
 */
export default function PaymentFaqAccordion() {
  const [openId, setOpenId] = useState<string | null>("free-trial");

  const toggle = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className="rounded-2xl bg-[#0e0e14] border border-[#222230] p-6 space-y-4 font-sans text-xs text-[#e0e0e0] shadow-xl">
      <div className="flex items-center space-x-2 border-b border-[#20202e] pb-4">
        <HelpCircle className="h-5 w-5 text-[#387ed1]" />
        <div>
          <h3 className="text-base font-bold font-mono text-white">Payment &amp; Billing FAQ</h3>
          <p className="text-[11px] text-[#747888]">Everything you need to know about trials, GST tax invoices, and UPI checkout.</p>
        </div>
      </div>

      <div className="space-y-3 font-mono">
        {PAYMENT_FAQS.map((faq) => {
          const isOpen = openId === faq.id;
          return (
            <div key={faq.id} className="rounded-xl bg-[#14141e] border border-[#242434] overflow-hidden">
              <button
                onClick={() => toggle(faq.id)}
                className="w-full p-4 flex items-center justify-between text-left hover:bg-[#1a1a28] transition-colors"
              >
                <div className="flex items-center space-x-3">
                  {faq.icon}
                  <span className="font-bold text-white text-xs sm:text-sm">{faq.question}</span>
                </div>
                <ChevronDown className={`h-4 w-4 text-[#747888] transition-transform duration-200 ${isOpen ? "rotate-180 text-[#387ed1]" : ""}`} />
              </button>

              {isOpen && (
                <div className="px-4 pb-4 text-xs text-[#9a9db0] leading-relaxed font-sans border-t border-[#202030] pt-3 bg-[#11111a]">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
