# LALAN HFT Payment & Subscription Architecture Documentation

## Executive Overview
The **LALAN HFT Payment & Subscription Subsystem** is an enterprise-grade, GST-compliant licensing and billing framework designed for Indian algorithmic traders, quantitative hedge funds, and retail investors. It supports a 14-day free trial launch offer, tier feature gating, BHIM UPI / Credit Card / NetBanking payment options, 18% GST tax invoice generation, coupon code validation, and CSV transaction log exporting.

---

## 1. System Architecture & Components

```
                                  ┌─────────────────────────────┐
                                  │   /pricing Page & Header    │
                                  └──────────────┬──────────────┘
                                                 │
                                  ┌──────────────▼──────────────┐
                                  │   SubscriptionContext.tsx   │
                                  └──────────────┬──────────────┘
                                                 │
           ┌─────────────────────────────────────┼─────────────────────────────────────┐
           │                                     │                                     │
┌──────────▼──────────┐               ┌──────────▼──────────┐               ┌──────────▼──────────┐
│ promoCodeEngine.ts  │               │ invoiceGenerator.ts │               │ receiptExporter.ts  │
└─────────────────────┘               └─────────────────────┘               └─────────────────────┘
```

### Core Components Summary:
1. **`SubscriptionContext.tsx`**: State provider managing active tier licensing (`retail`, `pro`, `institutional`), 14-day trial timers, promo code discounts, and payment history logs.
2. **`SubscriptionPricingModal.tsx`**: Interactive checkout modal with currency switching (INR/USD), annual billing discount (20%), promo code input, GSTIN tax validation, and simulated payment gateways.
3. **`invoiceGenerator.ts`**: GST 18% tax calculation utility (SAC Code 998313), GSTIN checksum validator, and client-side HTML/PDF tax invoice renderer.
4. **`promoCodeEngine.ts`**: Real-time discount validation engine with promo codes:
   - `QUANT20`: 20% launch discount on all plans
   - `HFTVIP`: 30% VIP discount on Institutional HFT
   - `ALPHA100`: 100% full promotional pass
   - `GSTFREE`: 18% GST tax relief discount
5. **`paymentReceiptExporter.ts`**: Transaction audit log exporter converting payment history to CSV/JSON with Formula Injection (`=`, `+`, `-`, `@`) sanitization.
6. **`EnterpriseQuoteModal.tsx`**: Custom inquiry modal for NSE/BSE co-location gateway racks and FPGA feed allocation.
7. **`TrialExtensionModal.tsx`**: 7-day complimentary free trial extension request workflow.
8. **`SubscriptionUsageMeter.tsx`**: Visual quota gauges showing API rate limits, order book depth levels, and watchlist capacities per tier.
9. **`PaymentFaqAccordion.tsx`**: Embedded FAQ section covering 14-day trial terms, GST ITC tax credits, and payment methods.

---

## 2. Statutory GST Compliance (India)
- **HSN/SAC Code**: `998313` (Information Technology Software Services)
- **Tax Rate**: 18% (9% CGST + 9% SGST for intra-state Maharashtra, 18% IGST for inter-state)
- **B2B Tax Credit**: Customers entering a valid 15-digit GSTIN (e.g. `27AABCL8899Z1Z5`) receive official Tax Invoices eligible for 100% Input Tax Credit (ITC).

---

## 3. Test Coverage & Verification
- **Vitest Unit Tests**: `src/lib/__tests__/promoCodeEngine.test.ts`, `src/lib/__tests__/invoiceGenerator.test.ts`, `src/lib/__tests__/paymentReceiptExporter.test.ts`
- **Playwright E2E Tests**: `e2e/subscription_flow.spec.ts`
- **TypeScript & ESLint**: 100% type-safe compilation (`npx tsc --noEmit`) with 0 lint errors and 0 warnings.
