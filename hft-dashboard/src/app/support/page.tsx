'use client';

import React from 'react';
import LalanSiteHeader from '@/components/LalanSiteHeader';
import LalanSiteFooter from '@/components/LalanSiteFooter';
import { ProductionGradeFAQHub } from '@/components/faq/ProductionGradeFAQHub';
import { ALL_FAQS } from '@/lib/faqData';
import { generateFAQJsonLdString } from '@/lib/faqSchemaGenerator';
import { Mail } from 'lucide-react';

export default function SupportPage() {
  const jsonLdData = generateFAQJsonLdString(ALL_FAQS);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#060609] text-slate-900 dark:text-[#e0e0e0] font-sans selection:bg-[#387ed1] selection:text-white flex flex-col transition-colors duration-200">
      <LalanSiteHeader />

      {/* SEO Schema.org Structured Microdata */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdData }}
      />

      <main className="flex-1 py-12 px-4 sm:px-8 max-w-[1150px] w-full mx-auto space-y-10">
        {/* Production Grade FAQ Hub */}
        <ProductionGradeFAQHub />

        {/* Direct Support Contact Banner */}
        <div className="p-8 sm:p-10 rounded-2xl bg-white dark:bg-[#0e0e14] border border-slate-200 dark:border-[#1f1f2c] text-center space-y-4 shadow-xl">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#387ed1]/10 border border-[#387ed1]/20 text-[#387ed1] mb-2">
            <Mail className="h-6 w-6" />
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">Have more questions or need HFT algorithm support?</h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-[#8a8d9b] max-w-lg mx-auto leading-relaxed">
            Our quant infrastructure engineering team provides 1-on-1 co-location server setup, API integration assistance, and priority support.
          </p>
          <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href="mailto:ayushsinghe07@gmail.com"
              className="inline-flex items-center space-x-2.5 bg-[#387ed1] hover:bg-[#306ec0] text-white font-mono text-xs sm:text-sm font-bold px-7 py-3 rounded-xl shadow-lg shadow-[#387ed1]/25 transition-all border border-[#387ed1]/40"
            >
              <Mail className="h-4 w-4 text-white" />
              <span>ayushsinghe07@gmail.com</span>
            </a>
          </div>
        </div>
      </main>

      <LalanSiteFooter />
    </div>
  );
}
