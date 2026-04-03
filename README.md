# FinFlow — Finance Dashboard

> **Zorvyn FinTech · Frontend Developer Intern Assessment**

A production-quality personal finance dashboard built with **Next.js 15 App Router**, **shadcn/ui**, **Recharts**, and **Tailwind CSS**.

---

## Quick Start

```bash
# 1. Clone / extract the project
cd finance-dashboard

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev

# 4. Open in browser
open http://localhost:3000
```

---

## Tech Stack

| Concern         | Choice                                      |
|-----------------|---------------------------------------------|
| Framework       | Next.js 15 (App Router, RSC)                |
| UI Primitives   | shadcn/ui (Radix UI)                        |
| Charts          | Recharts 2                                  |
| Styling         | Tailwind CSS v3                             |
| State           | React Context + useState + useMemo          |
| Typography      | Syne (display) + DM Sans (body) + DM Mono  |
| Language        | JavaScript (JSX)                            |

---

## Features

### Dashboard
- **4 stat cards** — Net Balance, Total Income, Total Expenses, Total Saved (with savings rate)
- **Area chart** — Income vs Expenses vs Savings monthly trend with gradient fills
- **Horizontal bar chart** — Expenses ranked by category with per-category colors
- **Progress bar breakdown** — Category share with animated fill bars
- **Monthly summary table** — Month-by-month income/expense/savings with totals footer

### Transactions
- **Sortable table** — Click column headers (Date, Description, Amount) to toggle asc/desc
- **Live search** — Searches across description, note, and category label
- **Quick filters** — Type (income/expense) and category dropdowns
- **Advanced filters** — Date range (from/to) and amount range (min/max) in collapsible panel
- **Filter summary** — Shows filtered income/expense/net totals in real time
- **Empty states** — Distinct states for "no data" vs "no filter results" with relevant actions
- **Table footer** — Running totals for visible rows
- **Admin: Add Transaction** — Full form with:
  - Type toggle (Income / Expense) that auto-filters category options
  - Description, amount, date with field-level validation
  - Category select filtered by transaction type
  - Optional note field
  - Loading state on submit

### Insights
- **Top spending category** — With icon, amount, percentage, and progress bar
- **Month-over-month comparison** — This month vs last month with trend badge (↑/↓/—)
- **Last month card** — Expenses and savings
- **Donut chart** — Full expense distribution by category with custom tooltip
- **Monthly savings bar chart** — Per-month savings with color-coded bars (blue = positive, red = negative)
- **Category breakdown list** — All categories with transaction counts, amounts, and animated progress bars
- **Smart observations** — Up to 5 auto-generated contextual insights:
  - Top spending area
  - Month-over-month trend (increase or decrease)
  - Consistent saving detection
  - Savings rate health check (vs 20% benchmark)
  - Spending concentration warning
- **Summary KPI row** — Savings rate, avg per transaction, transaction count, net savings

### Role-Based UI (RBAC)
Switch roles via the dropdown in the top-right navbar:

| Feature                   | Viewer | Admin |
|---------------------------|--------|-------|
| View all charts           | ✅     | ✅    |
| View transactions         | ✅     | ✅    |
| Filter & search           | ✅     | ✅    |
| Add Transaction button    | ❌     | ✅    |
| Add Transaction modal     | ❌     | ✅    |
| Admin badge in navbar     | ❌     | ✅    |

Role state is managed in React Context — no backend required.

---

## Project Structure

```
src/
├── app/
│   ├── layout.jsx              # Root layout — wraps AppProvider
│   ├── page.jsx                # Entry point → DashboardShell
│   └── globals.css             # Tailwind + shadcn CSS variables + Google Fonts
│
├── components/
│   ├── ui/                     # shadcn/ui primitives (source-owned)
│   │   ├── button.jsx
│   │   ├── card.jsx
│   │   ├── badge.jsx
│   │   ├── input.jsx
│   │   ├── label.jsx
│   │   ├── select.jsx
│   │   ├── dialog.jsx
│   │   ├── separator.jsx
│   │   ├── tabs.jsx
│   │   └── tooltip.jsx
│   │
│   ├── shared/                 # App-level reusable components
│   │   ├── index.jsx           # StatCard, EmptyState, ProgressBar, ObservationCard, etc.
│   │   └── ChartTooltip.jsx    # Recharts custom tooltips
│   │
│   ├── layout/
│   │   └── DashboardShell.jsx  # Sticky navbar + role switcher + tab routing
│   │
│   ├── dashboard/
│   │   └── Dashboard.jsx       # Stat cards + area chart + bar chart + monthly table
│   │
│   ├── transactions/
│   │   ├── Transactions.jsx    # Filter bar + sortable table + empty states
│   │   └── AddTransactionModal.jsx  # Admin-only add form
│   │
│   └── insights/
│       └── Insights.jsx        # KPI cards + donut + savings bar + observations
│
├── context/
│   └── AppContext.jsx          # Global state: role, transactions, filters + all actions
│
├── data/
│   └── transactions.js         # 40 mock transactions + CATEGORIES config
│
├── hooks/
│   └── useFinanceData.js       # Memoized derived data hooks
│
├── utils/
│   ├── analytics.js            # Pure functions: summaries, grouping, filtering, observations
│   └── format.js               # formatCurrency, formatDate, formatMonthYear, etc.
│
└── lib/
    └── utils.js                # shadcn cn() merge helper
```

---

## Architecture Decisions

### State Management
Single `AppContext` with `useState` + `useMemo`. This keeps state simple and avoids prop drilling without introducing Redux/Zustand. Derived data is computed in custom hooks using `useMemo` to prevent unnecessary recalculations.

### Data Layer Separation
All data computation (grouping, filtering, analytics) lives in `utils/analytics.js` as pure functions — fully testable, zero React coupling. Hooks in `useFinanceData.js` are thin wrappers that connect the pure functions to React state.

### shadcn/ui Approach
Components are source-owned (copy-paste), not imported from a black-box library. This means they're fully customisable and don't carry runtime overhead from unused primitives.

### RBAC Implementation
Role is a simple string in Context (`"viewer"` | `"admin"`). The `isAdmin` boolean derived from it is passed via context. UI conditionally renders admin controls — no routes, guards, or middleware needed for a frontend-only assessment.

### Filtering Architecture
All filter state lives in Context as a flat object. `filterTransactions()` in analytics.js accepts filters and returns a new sorted array — no mutations. This makes the filtered view reactive to any combination of filters without complex subscription logic.

---

## Demo Walkthrough

1. **Dashboard** — loads with real 3-month data, three charts, and a summary table
2. **Switch to Admin** via the top-right Role dropdown
3. **Transactions** tab — click "Add Transaction", fill the form, submit — charts update instantly
4. **Filter** by category (e.g. "Food & Dining") and see the table, totals, and empty state
5. **Advanced Filters** — expand to filter by date range or amount range
6. **Insights** tab — view observations, donut chart, and MoM comparison

---

*Built by Hamidur Rahman — April 2026 · Zorvyn FinTech Frontend Assessment*
