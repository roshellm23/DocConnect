# DocConnect — Healthcare Appointment System

[![Node.js](https://img.shields.io/badge/Node.js-v20%2B-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-v19-blue.svg)](https://react.dev/)
[![Express](https://img.shields.io/badge/Express-v4.19-lightgrey.svg)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-17-blue.svg)](https://www.postgresql.org/)
[![Jest Tests](https://img.shields.io/badge/Jest%20Tests-35%2F35%20Passing-brightgreen.svg)]()
[![Selenium E2E](https://img.shields.io/badge/Selenium-Automated%20E2E-success.svg)]()

DocConnect enables patients to schedule consultations with certified medical specialists, manage bookings, and inspect live PostgreSQL records through a responsive React interface and an Express REST API with full Kubernetes/Nginx reverse-proxy support.

---

## 1. System Architecture

```text
       [ User / Browser ]
               │
               ▼
   [ React Frontend (Vite) / Nginx ]
               │
          HTTP REST (/api or direct)
               │
               ▼
   [ Node.js + Express API ]
   ├── Strict CORS Whitelist & Preflight Handler
   ├── Input Validation & Error Handling
   ├── Dual-Route Aliasing (/ and /api/*)
   └── Health Probes (/health and /api/health)
               │
          pg Client Pool
               │
               ▼
     [ PostgreSQL Database ]
   ├── `users` (Patients, Admins, Google OAuth)
   └── `appointments` (Relational bookings)
```

---

## 2. Person 1 Deliverables & Handover Package

This repository contains the completed, tested, and verified Phase 1 codebase ready for Person 2 containerization.

- **Dual-Route Compatibility**: All endpoints support both root paths (`/doctors`, `/auth`) and reverse-proxied paths (`/api/doctors`, `/api/auth`) forwarding correctly through Nginx.
- **Strict CORS & Preflight**: Whitelist-based origin security (`localhost:5173`, `localhost:3000`, `localhost`, etc.) and `204 No Content` preflight OPTIONS responses.
- **Dynamic Frontend Base URL**: `VITE_API_URL` defaults to relative path in production, preventing hardcoded `localhost:5000` failures across different laptops.
- **Automated Test Suites**: 35/35 passing unit & integration tests with machine-readable JUnit XML reports (`backend/reports/junit.xml`).
- **Selenium WebDriver E2E Suite**: Non-interactive headless browser tests in `e2e/run-e2e.js` generating `e2e/reports/junit-selenium.xml`.

---

## 3. Local Quickstart Guide

### Prerequisites
- **Node.js**: v18+ (tested on v24.19)
- **NPM**: v9+ (tested on v11.17)
- **PostgreSQL**: 14+ (tested on v17)
- **Google Chrome**: For headless Selenium E2E tests

---

### Step 1: Environment Configuration
Copy the provided `.env.example` templates:

```bash
# In backend/
cp .env.example .env

# In frontend/
cp .env.example .env
```

Ensure `backend/.env` has your PostgreSQL credentials:
```env
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173,http://localhost:3000,http://localhost
DB_HOST=localhost
DB_PORT=5432
DB_NAME=docconnect
DB_USER=postgres
DB_PASSWORD=postgres
DB_SSL=false
JWT_SECRET=docconnect-super-secret-jwt-key-2024-change-in-production
JWT_EXPIRES_IN=7d
```

> **Note**: Leave `VITE_API_URL=` blank in `frontend/.env` to use relative proxy routing.

---

### Step 2: Database Initialization & Repeatable Seed Data
To initialize the database schema and insert deterministic demo users:

```bash
cd backend
node src/config/initDb.js
```

This creates the tables (`users`, `appointments`), indexes, constraints, and inserts default accounts idempotently (`ON CONFLICT (email) DO NOTHING`):
- **Admin**: `admin@docconnect.com` / `password`
- **Patient**: `aarav.sharma@example.com` / `password`
- **Patient**: `priya.patel@example.com` / `password`

---

### Step 3: Run the Application Locally

#### Option A: One-Click Startup Script (PowerShell)
```powershell
.\start-all.ps1
```

#### Option B: Manual Execution
In Terminal 1 (Backend):
```bash
cd backend
npm install
npm run dev
```

In Terminal 2 (Frontend):
```bash
cd frontend
npm install
npm run dev
```

- **Frontend**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:5000](http://localhost:5000)
- **Health Check**: [http://localhost:5000/health](http://localhost:5000/health) or [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

## 4. API Route Summary

All routes are mounted with and without the `/api` prefix for seamless gateway/Nginx proxying.

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| **GET** | `/health`, `/api/health` | Public | Application & PostgreSQL database health probe |
| **GET** | `/`, `/api` | Public | API discovery & route catalog |
| **POST** | `/auth/signup`, `/api/auth/signup` | Public | Patient registration (validates email, password, name) |
| **POST** | `/auth/login`, `/api/auth/login` | Public | Patient/Admin login (returns JWT token) |
| **POST** | `/auth/google`, `/api/auth/google` | Public | Google OAuth 2.0 social sign-in |
| **GET** | `/auth/me`, `/api/auth/me` | Private | Current authenticated user profile |
| **GET** | `/doctors`, `/api/doctors` | Public | List all certified doctors & schedules |
| **GET** | `/doctors/:id`, `/api/doctors/:id` | Public | Get doctor profile by ID |
| **GET** | `/appointments`, `/api/appointments` | Private | List own appointments (patients) or all (admin) |
| **POST** | `/appointments`, `/api/appointments` | Private | Book new appointment (patient ID from JWT) |
| **GET** | `/appointments/:id`, `/api/appointments/:id` | Private | View appointment (ownership enforced) |
| **PATCH**| `/appointments/:id/status` | Admin | Update appointment status (scheduled/confirmed/completed/cancelled) |
| **DELETE**| `/appointments/:id` | Private | Cancel appointment (ownership enforced) |
| **GET** | `/admin/stats` | Admin | Overall appointment and system statistics |
| **GET** | `/admin/users` | Admin | Registered patient accounts directory |

---

## 5. Automated Test Suites

### Backend Unit & Integration Tests (Jest + Supertest)
```bash
cd backend
npm test
```
- **Assertions**: **35 / 35 Passing** across 3 test suites:
  - `tests/auth.test.js`: Registration, login, duplicate check, payload validation, token verification.
  - `tests/doctor.test.js`: Doctor catalog, individual retrieval, 404 handling, CORS & preflight OPTIONS.
  - `tests/appointment.test.js`: Appointment booking, day-of-week validation, ownership checks, status updates, deletion, `/api` proxying.
- **Reporting**: Automatically generates JUnit XML report at `backend/reports/junit.xml` for Jenkins test result publishing.

### Automated End-to-End Tests (Selenium WebDriver)
```bash
npm run test:e2e
# or
cd e2e
npm run test:e2e
```
- **Headless Execution**: Runs non-interactively using Chrome headless mode (`--headless=new`).
- **Flows Tested**:
  1. Patient Registration
  2. Patient Logout & Login
  3. Doctor Catalog & Specialties
  4. Appointment Booking Form
  5. Appointment History & Portal Retrieval
- **Reporting**: Generates machine-readable report at `e2e/reports/junit-selenium.xml`.

---

## 6. Known Limitations

1. **Email Delivery**: The backend simulates confirmation emails to the console when `EMAIL_USER` and `EMAIL_PASS` are unset in `.env`. Real SMTP requires a Gmail App Password.
2. **Google OAuth**: A valid Google OAuth Client ID is required for social login. Email/password authentication is fully standalone and operates independently without Google.
3. **Doctor Records**: Doctor availability data is managed in code as demo catalog models rather than dynamic DB tables to keep local setups lightweight.

---

## 7. Person 1 Acceptance Gate (Person 2 Verification)

Person 2 should verify this handover on their machine:
1. Clone repository branch `main`.
2. Copy `backend/.env.example` to `backend/.env` and fill PostgreSQL credentials.
3. Run `npm install` in `backend/` and `frontend/`.
4. Run `cd backend && npm test` — confirm **35/35 tests pass**.
5. Run `node src/config/initDb.js` in `backend/` — confirm tables created and seed data loaded.
6. Start backend (`npm run dev`) and frontend (`npm run dev`).
7. Complete the user journey:
   - Register a new patient account at `http://localhost:5173/signup`.
   - Log in and view the Doctors page at `http://localhost:5173/doctors`.
   - Book an appointment at `http://localhost:5173/book`.
   - Verify the booked appointment appears on `http://localhost:5173/appointments`.
