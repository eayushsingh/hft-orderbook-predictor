# Institutional Robo-Advisor Engine Architecture & Technical Reference

## 1. Executive Summary

The **Robo-Advisor Engine** is an institutional-grade, autonomous portfolio management and quantitative wealth advisory platform. It builds, monitors, rebalances, and tax-optimizes multi-asset portfolios with zero human intervention.

Key features include:
- **Algorithmic Risk Profiling & Goal Discovery**: Weighted score algorithm (1–100 scale) mapping investor questionnaire metrics to risk categories (`CONSERVATIVE`, `BALANCED`, `GROWTH`, `AGGRESSIVE_GROWTH`).
- **Black-Litterman & Modern Portfolio Theory (MPT) Target Allocation**: Generates optimal asset weights across 10 asset categories using low-cost index benchmark ETFs.
- **Continuous Portfolio Drift Radar**: Real-time weight tracking, computing absolute drift score and single-asset deviation bounds (`minWeightPct` / `maxWeightPct`).
- **Automated Rebalancer**: Generates minimal-cost buy/sell trade order plans while maintaining cash buffers and enforcing minimum trade slice values ($50 threshold).
- **Tax-Loss Harvesting (TLH) with Wash-Sale Guard**: Scans tax lots for unrealized losses, harvesting capital losses and immediately routing substitute correlation ETF swaps (`VOO` -> `SCHX`, `BND` -> `AGG`) to avoid 30-day wash-sale violations.
- **Stochastic Monte Carlo Goal Simulation**: Executes 1,000 geometric Brownian motion trajectories with annual inflation adjustment to project 10th, 50th, and 90th percentile wealth growth and goal success probability.

---

## 2. Mathematical Models & Core Algorithms

### 2.1 Risk Profile Score Formula
$$\text{Risk Score} = \text{HorizonPts} + \text{TolerancePts} + \text{DropReactionPts} + \text{ObjectivePts} + \text{AgeAdjustment}$$

- **HorizonPts**: 5 to 25 points based on investment years (1–40).
- **TolerancePts**: $5 \times \text{RiskToleranceLevel}$ (1–5 scale).
- **DropReactionPts**: 3 points (`SELL_ALL`) to 25 points (`BUY_MORE`).
- **ObjectivePts**: 8 points (`CAPITAL_PRESERVATION`), 18 points (`BALANCED_GROWTH`), 25 points (`MAXIMIZE_RETURNS`).

### 2.2 Portfolio Drift Score
$$\text{Drift Score} = \frac{1}{2} \sum_{i=1}^{N} \left| w_{i,\text{current}} - w_{i,\text{target}} \right|$$

Rebalance triggers when:
1. $\text{Drift Score} \ge 5.0\%$ OR
2. Any asset weight $w_{i,\text{current}}$ breaches $[w_{i,\text{min}}, w_{i,\text{max}}]$.

### 2.3 Tax Loss Harvest Replacement Taxonomy
| Primary Holding | Replacement ETF | Asset Class | Primary Index |
| :--- | :--- | :--- | :--- |
| **VOO** (Vanguard S&P 500) | **SCHX** (Schwab Large-Cap) | US Large Cap Equity | S&P 500 / Dow Jones Large |
| **VB** (Vanguard Small-Cap) | **SCHA** (Schwab Small-Cap) | US Small Cap Equity | CRSP US Small Cap |
| **VEA** (Vanguard Developed) | **IEFA** (iShares MSCI EAFE) | Intl Developed Equity | FTSE Developed |
| **VWO** (Vanguard Emerging) | **IEMG** (iShares Emerging) | Emerging Markets | FTSE Emerging |
| **BND** (Vanguard Total Bond) | **AGG** (iShares Agg Bond) | Core Fixed Income | Bloomberg US Aggregate |
| **VNQ** (Vanguard Real Estate)| **SCHH** (Schwab REIT) | Real Estate (REITs) | MSCI US REIT Index |

---

## 3. REST API Specification

### 3.1 Assess Risk
`POST /api/robo-advisor/assess-risk`
- **Request Body**: `RiskQuestionnaire`
- **Response**: `{ success: true, riskProfile: RiskProfile }`

### 3.2 Generate Target Portfolio
`POST /api/robo-advisor/generate-portfolio`
- **Request Body**: `{ questionnaire: RiskQuestionnaire, goalType: GoalType }`
- **Response**: `{ success: true, riskProfile, targetAllocations: TargetAllocation[] }`

### 3.3 Fetch Rebalance Plan
`GET /api/robo-advisor/rebalance`
- **Response**: `{ success: true, driftScore, rebalancePlan: RebalanceExecutionPlan }`

### 3.4 Execute Tax-Loss Harvesting
`GET /api/robo-advisor/tax-harvest`
- **Response**: `{ success: true, summary: TaxHarvestSummary }`

### 3.5 Run Monte Carlo Forecast
`POST /api/robo-advisor/simulate`
- **Request Body**: `{ goal: Partial<InvestorGoal> }`
- **Response**: `{ success: true, simulationResult: SimulationResult }`

---

## 4. Codebase Directory Structure

```
hft-dashboard/
├── src/
│   ├── app/
│   │   ├── api/robo-advisor/          # REST API endpoints
│   │   │   ├── assess-risk/
│   │   │   ├── generate-portfolio/
│   │   │   ├── rebalance/
│   │   │   ├── simulate/
│   │   │   └── tax-harvest/
│   │   └── robo-advisor/               # Main UI Page Route (/robo-advisor)
│   ├── components/robo-advisor/        # Interactive Frontend Components
│   │   ├── RiskProfileWizard.tsx
│   │   ├── PortfolioAllocationView.tsx
│   │   ├── DriftAndRebalanceRadar.tsx
│   │   ├── TaxHarvestingDashboard.tsx
│   │   └── GoalSimulationChart.tsx
│   └── lib/robo-advisor/               # Quantitative Engines & Core Logic
│       ├── types.ts
│       ├── riskEngine.ts
│       ├── allocationEngine.ts
│       ├── assetUniverse.ts
│       ├── driftEngine.ts
│       ├── rebalanceEngine.ts
│       ├── taxHarvestingEngine.ts
│       ├── simulationEngine.ts
│       └── storage.ts
└── e2e/robo-advisor.spec.ts            # Playwright End-to-End Test Suite
```

---

## 5. Verification & Testing

- **TypeScript Compilation**: `npx tsc --noEmit` (0 errors)
- **ESLint Standard**: `npm run lint` (0 errors)
- **Unit Engine Tests**: `npx vitest run src/lib/robo-advisor/__tests__/roboAdvisorEngines.test.ts`
- **E2E Playwright Suite**: `npx playwright test e2e/robo-advisor.spec.ts`
