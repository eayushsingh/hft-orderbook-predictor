import { describe, it, expect } from "vitest";
import {
  calculateGST,
  validateGSTIN,
  generateInvoiceHTML,
  InvoiceDetails,
} from "../subscription/invoiceGenerator";

/**
 * Humanized Explanation for Maintainers:
 * Unit test suite verifying GST tax math (18% inclusive calculation),
 * CGST + SGST vs IGST breakdown, valid/invalid GSTIN checksum regex,
 * and HTML tax invoice template generation.
 */
describe("GST Invoice Generator Utility", () => {
  it("should calculate 18% inclusive GST for intra-state purchases", () => {
    const gst = calculateGST(1180, false);
    expect(gst.taxableAmount).toBe(1000);
    expect(gst.totalTaxAmount).toBe(180);
    expect(gst.cgstAmount).toBe(90);
    expect(gst.sgstAmount).toBe(90);
    expect(gst.igstAmount).toBe(0);
    expect(gst.totalInvoiceAmount).toBe(1180);
  });

  it("should calculate 18% IGST for inter-state purchases", () => {
    const gst = calculateGST(1180, true);
    expect(gst.taxableAmount).toBe(1000);
    expect(gst.totalTaxAmount).toBe(180);
    expect(gst.cgstAmount).toBe(0);
    expect(gst.sgstAmount).toBe(0);
    expect(gst.igstAmount).toBe(180);
    expect(gst.totalInvoiceAmount).toBe(1180);
  });

  it("should validate standard Indian GSTIN formats", () => {
    expect(validateGSTIN("27AABCL8899Z1Z5")).toBe(true);
    expect(validateGSTIN("07AAAAA0000A1Z5")).toBe(true);
    expect(validateGSTIN("INVALID_GSTIN_123")).toBe(false);
    expect(validateGSTIN("")).toBe(false);
  });

  it("should render clean HTML tax invoice with SAC code 998313", () => {
    const details: InvoiceDetails = {
      invoiceNumber: "INV-LHFT-TEST-001",
      invoiceDate: "07/10/2026",
      planName: "Pro Quant Trader",
      customerName: "Test Trader",
      customerEmail: "test@quant.com",
      customerGSTIN: "27AABCL8899Z1Z5",
      paymentMethod: "BHIM UPI",
      currency: "INR",
      amountPaid: 1180,
      gstBreakdown: calculateGST(1180, false),
    };

    const html = generateInvoiceHTML(details);
    expect(html).toContain("INV-LHFT-TEST-001");
    expect(html).toContain("998313");
    expect(html).toContain("27AABCL8899Z1Z5");
    expect(html).toContain("Pro Quant Trader");
  });
});
