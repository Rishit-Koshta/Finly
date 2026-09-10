# 💰 Finly — Personal Finance Tracker

**Finly** is a full-stack personal finance management application designed to help users track their income and expenses, manage category-wise budgets, analyze spending patterns, and receive AI-powered financial insights.

The application is built with a **React + Vite frontend** and a **Spring Boot backend**, with **MongoDB** for data persistence and **JWT-based authentication** for securing user accounts.

---

## ✨ Features

* 🔐 Secure user registration and login
* 🔑 JWT-based authentication
* 💰 Income and expense tracking
* 🧾 Complete transaction CRUD operations
* 🏷️ Transaction categorization
* 🎯 Category-wise monthly budgets
* 📊 Financial analytics dashboard
* 📈 Monthly income and expense analysis
* 📉 Daily expense trends
* 🥧 Category-wise spending visualization
* 🤖 AI-powered financial insights
* 🔮 Monthly spending projections
* 💡 AI-based budget suggestions
* 📱 Responsive user interface
* 🔔 Toast-based notifications
* 🛡️ Input validation and error handling

---

# 🏗️ Architecture

```
┌─────────────────────────────────────────┐
│              React Frontend             │
│             Vite + Tailwind              │
│                                         │
│  Landing │ Auth │ Dashboard │ Analytics │
│  Transactions │ Budgets │ AI Insights   │
└────────────────────┬────────────────────┘
                     │
                     │ REST API
                     │ JWT
                     ▼
┌─────────────────────────────────────────┐
│           Spring Boot Backend           │
│                                         │
│  Controllers → Services → Repositories  │
│       │           │            │         │
│       │           │            └──────┐  │
│       │           │                   │  │
│       │           ▼                   ▼  │
│       │      Business Logic         MongoDB
│       │                               │
│       ▼                               │
│  JWT Authentication                   │
│                                         │
│  Analytics │ AI │ Insights │ Validation │
└────────────────────┬────────────────────┘
                     │
          ┌──────────┴──────────┐
          ▼                     ▼
    ┌─────────────┐       ┌─────────────┐
    │   MongoDB   │       │  AI Services │
    │  Database   │       │   / APIs     │
    └─────────────┘       └─────────────┘
```

---

# 🧩 System Components

## Frontend

The frontend is developed using:

* React
* Vite
* Tailwind CSS
* Axios
* React Router
* Lucide React

It communicates with the Spring Boot backend through REST APIs.

The frontend is organized into API clients, contexts, reusable components, and page-level components.

---

## Backend

The backend is developed using **Spring Boot** and follows a layered architecture:

```
Controller
    │
    ▼
Service
    │
    ▼
Repository
    │
    ▼
MongoDB
```

Additional layers handle:

* Authentication
* JWT processing
* Validation
* DTOs
* Exception handling
* Analytics
* AI functionality
* Application configuration

The backend source is organized into dedicated packages for `controller`, `services`, `repository`, `entity`, `dto`, `security`, `analytics`, `ai`, `configs`, and `exceptions`.

---

# 🔐 Authentication

Finly uses **JWT-based authentication** to secure user-specific resources.

The authentication flow is:

```
User
  │
  │ Login / Register
  ▼
Authentication API
  │
  ▼
JWT Token
  │
  ▼
Frontend
  │
  │ Authorization: Bearer <token>
  ▼
Protected API
  │
  ▼
JWT Validation
  │
  ▼
Controller
  │
  ▼
User-specific Data
```

JWT functionality is implemented using the JJWT library, while Spring Security cryptography support is used for password/security-related operations.

---

# 💸 Transaction Management

Users can manage their financial transactions.

### Supported operations

* Create transaction
* View transactions
* Update transaction
* Delete transaction
* Filter transactions
* Categorize transactions
* Track income
* Track expenses

The transaction system forms the foundation for the application's analytics and AI insight features.

---

# 🎯 Budget Management

Finly allows users to create monthly spending limits for individual categories.

Example:

```
Food
├── Monthly Limit: ₹10,000
├── Current Spending: ₹7,500
└── Remaining: ₹2,500
```

Users can:

* Create budgets
* Update budgets
* Delete budgets
* Track spending against limits
* Monitor category-wise budget usage

---

# 📊 Financial Analytics

The analytics section converts raw transaction data into useful financial information.

### Analytics include

* Monthly income
* Monthly expenses
* Net balance
* Category-wise spending
* Daily expense trends
* Monthly comparisons
* Budget utilization

The frontend provides visualizations such as:

```
Income vs Expenses

Category Spending

Daily Expense Trend

Budget Utilization
```

The current frontend exposes a dedicated `/analytics` route with monthly summaries, category breakdowns, daily expense trends, and month/year selection.

---

# 🤖 AI-Powered Financial Insights

Finly includes an AI-powered insights section designed to help users understand their financial behavior.

The AI functionality includes:

* Natural-language financial questions
* Category trend analysis
* Monthly spending projections
* Budget recommendations
* Personalized financial insights

Example workflow:

```
User
  │
  │ "How much am I spending on food?"
  ▼
AI Insights API
  │
  ▼
Financial Data
  │
  ▼
Analysis
  │
  ▼
AI-generated Insight
  │
  ▼
React UI
```

The frontend currently exposes an `/insights` page backed by `/api/ai/ask` and `/api/insights/*`.

---

# 🛠️ Technology Stack

## Backend

| Technology          | Purpose                       |
| ------------------- | ----------------------------- |
| Java 17             | Programming Language          |
| Spring Boot         | Backend Framework             |
| Spring Web MVC      | REST APIs                     |
| Spring WebFlux      | Reactive HTTP support         |
| Spring Data MongoDB | Database Integration          |
| MongoDB             | Database                      |
| Spring Validation   | Input Validation              |
| JWT                 | Authentication                |
| JJWT                | JWT Token Handling            |
| Lombok              | Boilerplate Reduction         |
| Spring Mail         | Email Functionality           |
| Maven               | Build & Dependency Management |

The backend's Maven configuration currently targets Java 17 and includes MongoDB, web, validation, JWT, mail, Lombok, and related dependencies.

---

## Frontend

| Technology   | Purpose              |
| ------------ | -------------------- |
| React        | UI Framework         |
| Vite         | Frontend Build Tool  |
| Tailwind CSS | Styling              |
| Axios        | HTTP Client          |
| React Router | Client-side Routing  |
| Lucide React | Icons                |
| JavaScript   | Frontend Development |

---

# 📂 Project Structure

```
Finly/
│
├── Finly-backend/
│   │
│   ├── src/
│   │   ├── main/
│   │   │   └── java/
│   │   │       └── com/
│   │   │           └── rishit/
│   │   │               └── financetracker/
│   │   │                   ├── ai/
│   │   │                   ├── analytics/
│   │   │                   ├── configs/
│   │   │                   ├── controller/
│   │   │                   ├── dto/
│   │   │                   ├── entity/
│   │   │                   ├── exceptions/
│   │   │                   ├── repository/
│   │   │                   ├── security/
│   │   │                   ├── services/
│   │   │                   └── FinanceTrackerApplication.java
│   │   │
│   │   └── test/
│   │
│   ├── pom.xml
│   ├── mvnw
│   └── mvnw.cmd
│
├── Finly-frontend/
│   │
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   └── pages/
│   │
│   ├── package.json
│   ├── vite.config.js
│   └── index.html
│
└── README.md
```

---

# 📁 Frontend Structure

```
src/
│
├── api/
│   ├── auth
│   ├── transactions
│   ├── budgets
│   ├── analytics
│   └── insights
│
├── components/
│   ├── Layout
│   ├── Panel
│   ├── Amount
│   ├── ProgressRule
│   └── Forms
│
├── context/
│   ├── AuthContext
│   └── ToastContext
│
└── pages/
    ├── Home
    ├── Login
    ├── Register
    ├── Dashboard
    ├── Transactions
    ├── Budgets
    ├── Analytics
    └── Insights
```

The repository's frontend README describes these API, context, component, and page layers directly.

---

# 🌐 Application Routes

## Public Routes

| Route       | Description       |
| ----------- | ----------------- |
| `/`         | Landing Page      |
| `/login`    | User Login        |
| `/register` | User Registration |

## Protected Routes

| Route           | Description            |
| --------------- | ---------------------- |
| `/dashboard`    | Financial Overview     |
| `/transactions` | Transaction Management |
| `/budgets`      | Budget Management      |
| `/analytics`    | Financial Analytics    |
| `/insights`     | AI Financial Insights  |

The current frontend defines these routes and protects the user-specific application areas behind authentication.

---

# 📊 Dashboard

The dashboard provides an overview of the user's financial health.

It includes:

* Total income
* Total expenses
* Current balance
* Recent transactions
* Budget status
* Category spending information

Example:

```
┌──────────────────────────────────────────┐
│              FINANCIAL DASHBOARD         │
├──────────────────────────────────────────┤
│                                          │
│  Income        Expenses       Balance    │
│  ₹50,000       ₹32,000        ₹18,000    │
│                                          │
├──────────────────────────────────────────┤
│              Recent Transactions         │
│                                          │
│  Salary              +₹50,000            │
│  Food                 -₹2,000            │
│  Shopping             -₹5,000            │
│                                          │
└──────────────────────────────────────────┘
```

---

# 🔄 Application Flow

A typical authenticated request follows:

```
User
  │
  ▼
React Frontend
  │
  │ Axios + JWT
  ▼
Spring Boot REST API
  │
  ▼
Security / JWT Filter
  │
  ▼
Controller
  │
  ▼
Service Layer
  │
  ▼
Repository
  │
  ▼
MongoDB
```

The response then travels back through the same application layers to the frontend.

---

# 🗄️ Database

Finly uses **MongoDB** as its primary database.

MongoDB is accessed through **Spring Data MongoDB**.

The application follows a document-oriented persistence model suitable for storing:

* Users
* Transactions
* Budgets
* Financial information
* Analytics-related data

The backend Maven configuration explicitly includes Spring Boot MongoDB support and Spring Data MongoDB.

---

# ⚙️ Setup & Installation

## Prerequisites

Make sure you have installed:

* Java 17+
* Maven
* Node.js
* npm
* MongoDB

---

# 1. Clone the Repository

```
git clone https://github.com/Rishit-Koshta/Finly.git

cd Finly
```

---

# 2. Configure MongoDB

Make sure MongoDB is running locally or provide a MongoDB connection string for your environment.

Example:

```
mongodb://localhost:27017/finly
```

Configure the database connection in the backend application's configuration.

---

# 3. Start the Backend

Navigate to:

```
cd Finly-backend
```

Run using Maven:

```
./mvnw spring-boot:run
```

### Windows

```
mvnw.cmd spring-boot:run
```

The backend will start on its configured Spring Boot port.

---

# 4. Start the Frontend

Open another terminal:

```
cd Finly-frontend
```

Install dependencies:

```
npm install
```

Start the development server:

```
npm run dev
```

The frontend runs at:

```
http://localhost:5173
```

The frontend is configured to use `http://localhost:8080` as the default backend API base URL.

---

# 🔑 Environment Configuration

Do not commit sensitive credentials such as:

* JWT secrets
* MongoDB credentials
* Email credentials
* AI API keys
* Other private configuration

Use environment variables or local configuration files for secrets.

Example:

```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret
AI_API_KEY=your_api_key
```

---

# 🔒 Security Considerations

Finly implements authentication and authorization using JWT.

Important security practices include:

* Password hashing
* JWT-based authentication
* Protected API routes
* Token validation
* Input validation
* Exception handling
* Environment-based secrets

For production deployment, secrets should never be hardcoded in source code.

---

# 🧠 Core Concepts Demonstrated

This project demonstrates practical implementation of:

* Full-Stack Development
* REST API Design
* Spring Boot
* Spring Security Concepts
* JWT Authentication
* MongoDB
* Spring Data MongoDB
* Layered Architecture
* DTO Pattern
* Repository Pattern
* Service Layer
* Input Validation
* Exception Handling
* React
* API Integration
* Financial Analytics
* AI Integration
* Responsive UI Design

---

# 🎯 Learning Objectives

The project was developed to gain hands-on experience with:

* Building a complete full-stack application
* Designing REST APIs
* Implementing JWT authentication
* Working with MongoDB
* Building secure backend services
* Connecting React with Spring Boot
* Designing financial dashboards
* Performing financial data analysis
* Integrating AI-powered features
* Managing application state
* Structuring a scalable frontend
* Implementing clean backend architecture

---

# 🚀 Future Improvements

Potential improvements include:

* [ ] Redis caching
* [ ] Refresh token rotation
* [ ] Role-based access control
* [ ] Two-factor authentication
* [ ] Advanced financial reports
* [ ] Export transactions to CSV/PDF
* [ ] Recurring transactions
* [ ] Recurring budgets
* [ ] Investment portfolio tracking
* [ ] Bank account integration
* [ ] Email notifications
* [ ] Push notifications
* [ ] Advanced AI financial assistant
* [ ] AI-based anomaly detection
* [ ] Spending prediction
* [ ] Docker deployment
* [ ] CI/CD using GitHub Actions
* [ ] Cloud deployment
* [ ] Automated integration tests
* [ ] API documentation using Swagger/OpenAPI
* [ ] Production monitoring


---

# 🏆 Project Highlights

### 🔐 Secure Authentication

JWT-based authentication protects user-specific financial data.

### 📊 Data-Driven Dashboard

Users can quickly understand their income, expenses, balance, and budget utilization.

### 🎯 Budget Management

Category-based budgets help users control and monitor spending.

### 📈 Financial Analytics

Transaction data is transformed into meaningful visual analytics.

### 🤖 AI-Powered Insights

AI features provide users with natural-language financial analysis, projections, and budget recommendations.

### 🧱 Clean Architecture

The backend separates controllers, services, repositories, DTOs, entities, security, analytics, and AI functionality.

---

# 👨‍💻 Author

**Rishit Koshta**

B.Tech Computer Science & Engineering

* GitHub: [Rishit-Koshta](https://github.com/Rishit-Koshta)
* LinkedIn: [Rishit Koshta](https://linkedin.com/in/rishit-koshta)

---

# ⭐ Support

If you found this project useful, consider giving the repository a ⭐.

## Repository

https://github.com/Rishit-Koshta/Finly

---

# 📄 License

This project is intended for educational and personal use.
