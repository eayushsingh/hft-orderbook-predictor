import { describe, it, expect } from "vitest";
import {
  exportTransactionsToCSV,
  PaymentTransactionRecord,
} from "../subscription/paymentReceiptExporter";

/**
 * Humanized Explanation for Maintainers:
 * Unit test suite verifying CSV formula injection protection, headers,
 * and column formatting for transaction export records.
 */
describe("Payment Receipt Exporter Utility", () => {
  it("should escape formula injection prefix characters (=, +, -, @)", () => {
    const maliciousRecords: PaymentTransactionRecord[] = [
      {
        id: "=cmd|' /C calc'!A0",
        timestamp: "2026-10-07T12:00:00Z",
        planId: "pro",
        planName: "+Pro Quant Trader",
        amount: 999,
        currency: "INR",
        paymentMethod: "@UPI",
        status: "COMPLETED",
        invoiceNumber: "-INV-MALICIOUS-01",
      },
    ];

    const csv = exportTransactionsToCSV(maliciousRecords);
    expect(csv).toContain("\"'=cmd|' /C calc'!A0\"");
    expect(csv).toContain("\"'+Pro Quant Trader\"");
    expect(csv).toContain("\"'@UPI\"");
    expect(csv).toContain("\"'-INV-MALICIOUS-01\"");
  });

  it("should generate valid CSV header and rows", () => {
    const records: PaymentTransactionRecord[] = [
      {
        id: "PAY-101",
        timestamp: "2026-10-07T14:00:00Z",
        planId: "pro",
        planName: "Pro Quant Trader",
        amount: 999,
        currency: "INR",
        paymentMethod: "BHIM UPI",
        status: "COMPLETED",
        invoiceNumber: "INV-LHFT-101",
        gstin: "27AABCL8899Z1Z5",
        promoCode: "QUANT20",
      },
    ];

    const csv = exportTransactionsToCSV(records);
    expect(csv).toContain("Transaction ID,Date & Time,Plan Name");
    expect(csv).toContain('"PAY-101"');
    expect(csv).toContain('"Pro Quant Trader"');
    expect(csv).toContain('"27AABCL8899Z1Z5"');
    expect(csv).toContain('"QUANT20"');
  });
});
