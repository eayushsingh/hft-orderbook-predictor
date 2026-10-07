/**
 * LALAN HFT Tax Invoice & GST Calculation Utility
 * 
 * Humanized Explanation for Maintainers:
 * Generates GST-compliant tax invoices for subscription purchases in India:
 * - HSN/SAC Code: 998313 (Information Technology Software Services)
 * - GST Rate: 18% (9% CGST + 9% SGST for intra-state, or 18% IGST for inter-state)
 * - Client-side HTML Print & Export trigger for Tax Invoices.
 */

export interface GSTBreakdown {
  taxableAmount: number;
  cgstAmount: number; // 9%
  sgstAmount: number; // 9%
  igstAmount: number; // 18%
  totalTaxAmount: number;
  totalInvoiceAmount: number;
}

export interface InvoiceDetails {
  invoiceNumber: string;
  invoiceDate: string;
  planName: string;
  customerName: string;
  customerEmail: string;
  customerGSTIN?: string;
  paymentMethod: string;
  currency: string;
  amountPaid: number;
  gstBreakdown: GSTBreakdown;
}

export function validateGSTIN(gstin: string): boolean {
  if (!gstin) return false;
  const regex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
  return regex.test(gstin.trim().toUpperCase());
}

export function calculateGST(amount: number, isInterState = false): GSTBreakdown {
  // Extract base taxable amount from gross price (inclusive of 18% GST)
  const taxableAmount = Math.round((amount / 1.18) * 100) / 100;
  const totalTaxAmount = Math.round((amount - taxableAmount) * 100) / 100;

  if (isInterState) {
    return {
      taxableAmount,
      cgstAmount: 0,
      sgstAmount: 0,
      igstAmount: totalTaxAmount,
      totalTaxAmount,
      totalInvoiceAmount: amount,
    };
  }

  const halfTax = Math.round((totalTaxAmount / 2) * 100) / 100;
  return {
    taxableAmount,
    cgstAmount: halfTax,
    sgstAmount: halfTax,
    igstAmount: 0,
    totalTaxAmount,
    totalInvoiceAmount: amount,
  };
}

export function generateInvoiceHTML(details: InvoiceDetails): string {
  const { customerGSTIN } = details;
  const { taxableAmount, cgstAmount, sgstAmount, totalInvoiceAmount } = details.gstBreakdown;

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Tax Invoice - ${details.invoiceNumber}</title>
        <style>
          body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background: #0b0c10; color: #e0e0e0; padding: 40px; margin: 0; }
          .container { max-width: 800px; margin: 0 auto; background: #12131c; border: 1px solid #242536; padding: 40px; border-radius: 16px; }
          .header { display: flex; justify-content: space-between; border-bottom: 2px solid #387ed1; padding-bottom: 20px; }
          .title { font-size: 24px; font-weight: bold; color: #387ed1; }
          .meta { font-size: 12px; color: #8a8d9b; font-family: monospace; text-align: right; }
          .section { margin-top: 30px; display: flex; justify-content: space-between; font-size: 13px; }
          .table { width: 100%; border-collapse: collapse; margin-top: 30px; }
          .table th, .table td { border: 1px solid #242536; padding: 12px; text-align: left; font-size: 13px; }
          .table th { background: #1a1b28; color: #387ed1; font-family: monospace; }
          .total { margin-top: 20px; text-align: right; font-size: 16px; font-weight: bold; color: #10b981; }
          .footer { margin-top: 40px; border-top: 1px solid #242536; pt: 20px; font-size: 11px; color: #6b6e7f; text-align: center; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div>
              <div class="title">LALAN HFT PREDICTOR</div>
              <div style="font-size: 12px; color: #8a8d9b; margin-top: 4px;">Tax Invoice / Official Receipt</div>
            </div>
            <div class="meta">
              <div><strong>INVOICE NO:</strong> ${details.invoiceNumber}</div>
              <div><strong>DATE:</strong> ${details.invoiceDate}</div>
              <div><strong>SAC CODE:</strong> 998313</div>
            </div>
          </div>

          <div class="section">
            <div>
              <strong style="color: #387ed1;">ISSUED BY:</strong><br />
              LALAN Quant Technologies Pvt Ltd<br />
              BKC Financial Centre, Mumbai, MH 400051<br />
              GSTIN: 27AABCL8899Z1Z5
            </div>
            <div>
              <strong style="color: #387ed1;">BILLED TO:</strong><br />
              ${details.customerName}<br />
              ${details.customerEmail}<br />
              ${customerGSTIN ? `GSTIN: ${customerGSTIN}` : "Retail / B2C User"}
            </div>
          </div>

          <table class="table">
            <thead>
              <tr>
                <th>Service Description</th>
                <th>SAC</th>
                <th>Taxable Val</th>
                <th>CGST (9%)</th>
                <th>SGST (9%)</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>${details.planName} Tier Subscription</td>
                <td>998313</td>
                <td>₹${taxableAmount.toLocaleString("en-IN")}</td>
                <td>₹${cgstAmount.toLocaleString("en-IN")}</td>
                <td>₹${sgstAmount.toLocaleString("en-IN")}</td>
                <td><strong>₹${totalInvoiceAmount.toLocaleString("en-IN")}</strong></td>
              </tr>
            </tbody>
          </table>

          <div class="total">
            TOTAL AMOUNT PAID: ₹${totalInvoiceAmount.toLocaleString("en-IN")} INR
          </div>

          <div class="footer">
            This is a computer-generated GST tax invoice. No signature required.<br />
            Need support? Email support@lalan-hft.com
          </div>
        </div>
      </body>
    </html>
  `;
}

export function printOrDownloadInvoice(details: InvoiceDetails): void {
  if (typeof window === "undefined") return;
  const html = generateInvoiceHTML(details);
  const printWindow = window.open("", "_blank");
  if (printWindow) {
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 500);
  }
}
