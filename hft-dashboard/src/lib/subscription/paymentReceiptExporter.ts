/**
 * LALAN HFT Payment History & Receipt Exporter
 * 
 * Humanized Explanation for Maintainers:
 * Utility for exporting transaction history, tax receipts, and payment logs 
 * to CSV and JSON formats. Sanitizes CSV outputs to prevent CSV Formula Injection
 * and handles browser Blob downloads gracefully.
 */

export interface PaymentTransactionRecord {
  id: string;
  timestamp: string;
  planId: string;
  planName: string;
  amount: number;
  currency: string;
  paymentMethod: string;
  status: "COMPLETED" | "PENDING" | "FAILED" | "REFUNDED";
  invoiceNumber: string;
  gstin?: string;
  promoCode?: string;
}

/**
 * Escapes fields to prevent CSV Injection (Formula Injection vulnerability).
 * Prefix dangerous characters (=, +, -, @) with a single quote.
 */
function sanitizeCSVField(val: string | number | undefined): string {
  if (val === undefined || val === null) return '""';
  const str = String(val);
  const sanitized = str.replace(/"/g, '""');
  if (/^[=+\-@]/.test(sanitized)) {
    return `"'${sanitized}"`;
  }
  return `"${sanitized}"`;
}

/**
 * Converts transaction records array to a formatted CSV string.
 */
export function exportTransactionsToCSV(records: PaymentTransactionRecord[]): string {
  const headers = [
    "Transaction ID",
    "Date & Time",
    "Plan Name",
    "Amount",
    "Currency",
    "Payment Method",
    "Status",
    "Invoice Number",
    "GSTIN",
    "Promo Code"
  ];

  const csvRows: string[] = [headers.join(",")];

  for (const record of records) {
    const row = [
      sanitizeCSVField(record.id),
      sanitizeCSVField(record.timestamp),
      sanitizeCSVField(record.planName),
      sanitizeCSVField(record.amount),
      sanitizeCSVField(record.currency),
      sanitizeCSVField(record.paymentMethod),
      sanitizeCSVField(record.status),
      sanitizeCSVField(record.invoiceNumber),
      sanitizeCSVField(record.gstin || "N/A"),
      sanitizeCSVField(record.promoCode || "NONE")
    ];
    csvRows.push(row.join(","));
  }

  return csvRows.join("\n");
}

/**
 * Triggers a browser file download of CSV or JSON transaction records.
 */
export function triggerFileDownload(content: string, filename: string, mimeType: string): void {
  if (typeof window === "undefined") return;

  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Convenient wrapper to export payment history to CSV download.
 */
export function downloadTransactionsAsCSV(records: PaymentTransactionRecord[]): void {
  const csvContent = exportTransactionsToCSV(records);
  const timestamp = new Date().toISOString().slice(0, 10);
  triggerFileDownload(csvContent, `lalan_hft_payment_history_${timestamp}.csv`, "text/csv;charset=utf-8;");
}

/**
 * Convenient wrapper to export payment history to JSON download.
 */
export function downloadTransactionsAsJSON(records: PaymentTransactionRecord[]): void {
  const jsonContent = JSON.stringify(records, null, 2);
  const timestamp = new Date().toISOString().slice(0, 10);
  triggerFileDownload(jsonContent, `lalan_hft_payment_history_${timestamp}.json`, "application/json");
}
