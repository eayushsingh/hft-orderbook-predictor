"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Receipt, X, Download, FileText } from "lucide-react";
import { useSubscription, PaymentRecord } from "@/context/SubscriptionContext";
import { printOrDownloadInvoice, calculateGST } from "@/lib/subscription/invoiceGenerator";

interface PaymentHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * LALAN HFT Payment & Transaction History Modal
 * 
 * Humanized Explanation for Maintainers:
 * Displays all past subscription charges, trial activations, and tax invoices.
 * Supports 1-click PDF/HTML Tax Invoice download and CSV transaction export.
 */
export default function PaymentHistoryModal({ isOpen, onClose }: PaymentHistoryModalProps) {
  const { paymentHistory, exportPaymentHistoryCSV } = useSubscription();

  if (!isOpen) return null;

  const handleDownloadInvoice = (record: PaymentRecord) => {
    const gstBreakdown = calculateGST(record.amount);
    printOrDownloadInvoice({
      invoiceNumber: record.invoiceNumber || `INV-${record.id}`,
      invoiceDate: new Date(record.date).toLocaleDateString("en-IN"),
      planName: record.planId === "institutional" ? "Institutional HFT" : record.planId === "pro" ? "Pro Quant Trader" : "Retail Free",
      customerName: "Valued Quant Trader",
      customerEmail: "trader@lalan-quant.com",
      customerGSTIN: record.gstin,
      paymentMethod: record.paymentMethod,
      currency: record.currency,
      amountPaid: record.amount,
      gstBreakdown,
    });
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 select-none font-sans overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="w-full max-w-3xl rounded-2xl bg-[#12131c] border border-[#262738] shadow-2xl overflow-hidden my-auto text-[#e0e0e0]"
        >
          {/* Header */}
          <div className="p-5 border-b border-[#242536] bg-[#0c0d14] flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#387ed1]/20 text-[#387ed1] border border-[#387ed1]/30">
                <Receipt className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold font-mono text-white flex items-center gap-2">
                  Payment History &amp; Tax Invoices
                </h3>
                <p className="text-xs text-[#747888] font-mono">
                  Official GST Tax Invoices (SAC 998313) &amp; Transaction Audit Logs
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={exportPaymentHistoryCSV}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#10b981]/15 text-[#10b981] border border-[#10b981]/30 text-xs font-mono font-bold hover:bg-[#10b981]/25 transition-all"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Export CSV</span>
              </button>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-[#747888] hover:text-white hover:bg-[#1a1b28] transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* History Table */}
          <div className="p-6 overflow-x-auto font-mono text-xs">
            {paymentHistory.length === 0 ? (
              <div className="py-8 text-center text-[#747888]">No transactions recorded yet.</div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#242536] text-[#747888] text-[11px] uppercase">
                    <th className="py-3 px-3">Date</th>
                    <th className="py-3 px-3">Plan / Description</th>
                    <th className="py-3 px-3">Amount</th>
                    <th className="py-3 px-3">Method</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3 text-right">Invoice</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1e1f2e]">
                  {paymentHistory.map((rec) => (
                    <tr key={rec.id} className="hover:bg-[#181926] transition-colors">
                      <td className="py-3.5 px-3 text-[#9a9db0]">
                        {new Date(rec.date).toLocaleDateString("en-IN")}
                      </td>
                      <td className="py-3.5 px-3 font-bold text-white uppercase">
                        {rec.planId} TIER
                      </td>
                      <td className="py-3.5 px-3 font-bold text-[#10b981]">
                        {rec.amount === 0 ? "FREE" : `₹${rec.amount.toLocaleString("en-IN")}`}
                      </td>
                      <td className="py-3.5 px-3 text-[#8a8d9b]">{rec.paymentMethod}</td>
                      <td className="py-3.5 px-3">
                        <span className="bg-[#10b981]/15 text-[#10b981] px-2 py-0.5 rounded text-[10px] font-bold">
                          {rec.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-right">
                        <button
                          onClick={() => handleDownloadInvoice(rec)}
                          className="inline-flex items-center gap-1 text-[#387ed1] hover:underline font-bold text-[11px]"
                        >
                          <FileText className="h-3.5 w-3.5" />
                          <span>PDF</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
