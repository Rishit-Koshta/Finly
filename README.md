# FinanceTracker

A full-stack personal finance tracker for logging transactions, managing category-wise budgets, and catching overspending before it gets out of hand — with an AI assistant built in for when you'd rather just ask a question than dig through charts.

**Live Demo:** [link] · **Backend Repo:** [link] · **Frontend Repo:** [link]

---

## Features

- **Transaction tracking** — log income and expenses with categories, dates, and notes
- **Category-wise budgeting** — set monthly limits per category, not just an overall balance
- **Automated overspend alerts** — get an email the moment a category's budget is crossed, powered by Spring Mail
- **JWT authentication** — access/refresh token rotation with silent refresh on the frontend via an axios interceptor, so sessions don't randomly log you out
- **Analytics dashboard** — monthly income/expense summaries, category breakdowns, and daily spending trends, built on MongoDB aggregation pipelines and visualized with Recharts
- **AI financial assistant** — ask questions in plain language and get budget suggestions, powered by a RAG pipeline over the Groq LLM API

---

## Tech Stack

**Backend:** Java, Spring Boot, MongoDB, Spring Security, Spring Mail
**Frontend:** React, Vite, Tailwind CSS, Recharts, Axios
**AI:** Groq LLM API, Retrieval-Augmented Generation (RAG)
**Auth:** JWT with refresh token rotation

---

## Architecture

The backend follows a layered structure: controllers → services → repositories, with DTOs at the boundary. Modules are split by domain — auth, transactions, budgets, analytics, and AI — rather than dumped into one monolithic service layer.



---

## Getting Started

### Prerequisites
- Java 17+
- Node.js 18+
- MongoDB (local or Atlas)
- Groq API key

### Backend

```bash
cd backend
# add your MongoDB URI, JWT secret, and Groq API key to application.properties
./mvnw spring-boot:run
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The app runs on `http://localhost:5173` by default, with the backend on `http://localhost:8080`.

---

## API Overview

| Module | Endpoints |
|---|---|
| Auth | `/api/auth/register`, `/api/auth/login`, `/api/auth/refresh` |
| Transactions | `/api/transactions` (CRUD) |
| Budgets | `/api/budgets` (CRUD, category limits) |
| Analytics | `/api/analytics/summary`, `/api/analytics/trends` |
| AI Assistant | `/api/assistant/query` |

---

## Roadmap

- [ ] Load testing on transaction and budget endpoints
- [ ] Recurring transaction support
- [ ] Multi-currency support
- [ ] Shared/family budgets

---

## License

MIT
