# Finly — Finance Tracker Frontend

React + Vite + Tailwind CSS (v4) frontend for the FinanceTracker Spring Boot backend,
covering a public landing page, auth, transactions, category-wise budgets, analytics,
and AI insights.

## Design

"Ink wash" light theme — cream canvas (`#FFFFE3`), charcoal ink text (`#4A4A4A`), and a
slate-blue accent (`#6D8196`), with amber reserved only for "near limit" caution states
and sage/wax for positive/negative money signals. Headings use Montserrat, body text
uses Roboto, and currency figures use IBM Plex Mono for tabular alignment. Icons are
from `lucide-react` throughout.

## Setup

```bash
npm install
npm run dev
```

Runs at `http://localhost:5173` by default — this matches the CORS origin and JWT filter
allow-list already configured in the backend (`WebConfig`, `JwtAuthFilter`), so no backend
changes are needed to talk to it locally.

## Backend

The API base URL is set in `src/api/client.js` (`BASE_URL`), currently pointing at
`http://localhost:8080`. Update it there if your backend runs elsewhere.

Start the backend first (`./mvnw spring-boot:run` from the FinanceTracker project), then
run the frontend.

## Structure

- `src/api/` — one file per backend resource (auth, transactions, budgets, analytics, insights),
  each a thin wrapper around a shared axios instance with automatic JWT refresh.
- `src/context/` — `AuthContext` (session + profile) and `ToastContext` (notifications).
- `src/components/` — shared UI: `Layout` (authenticated nav shell), `Panel`, `Seal` (budget
  status stamp), `Amount` (currency formatting), `ProgressRule`, forms, etc.
- `src/pages/` — one component per route: Home, Login, Register, Dashboard, Transactions,
  Budgets, Analytics, Insights.

## Routes

- `/` — public landing page (marketing home), adaptive CTA based on auth state.
- `/login`, `/register` — auth.
- `/dashboard` — this month's income/expense/balance, category budget status at a glance,
  recent transactions. *(Protected)*
- `/transactions` — full CRUD with type/category filters. *(Protected)*
- `/budgets` — set, edit, and remove a monthly limit per category; live spend vs. limit.
  *(Protected)*
- `/analytics` — monthly summary, category breakdown (pie + bar), daily expense trend,
  with a month/year picker. *(Protected)*
- `/insights` — free-form AI question box, category trend check, monthly projection,
  and per-category budget suggestion — backed by `/api/ai/ask` and `/api/insights/*`.
  *(Protected)*
