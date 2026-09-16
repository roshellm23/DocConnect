# DocConnect — Healthcare Appointment System

[![Node.js](https://img.shields.io/badge/Node.js-v20%2B-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-v19-blue.svg)](https://react.dev/)
[![Express](https://img.shields.io/badge/Express-v4.19-lightgrey.svg)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-17-blue.svg)](https://www.postgresql.org/)
[![Branch](https://img.shields.io/badge/Branch-development-orange.svg)]()


DocConnect enables patients to seamlessly schedule consultations with certified medical specialists, manage bookings, and inspect live PostgreSQL records through a modern, responsive React interface and a modular Express REST API.

---

## 1. System Architecture

```text
       [ User / Patient ]
               │
               ▼
   [ React Frontend (Vite) ]
               │
          HTTP REST
               │
               ▼
[ Node.js + Express.js API ]
   ├── Input Validation Middleware
   ├── Centralized Error Handling
   └── Health Probes (/health)
               │
         pg Pool Client
               │
               ▼
     [ PostgreSQL Database ]
   └── Table: `appointments`
```

---

## 2. Repository Structure

```text
DocConnect/
├── frontend/                     # React 19 + Vite Frontend
│   ├── public/                   # Static assets & SVG favicon
│   ├── src/
│   │   ├── components/           # Reusable UI (Navbar, Footer, Cards, Modal, Badge)
│   │   ├── layouts/              # App layout wrappers
│   │   ├── pages/                # Home, Booking, Appointment List, Details pages
│   │   ├── services/             # API client layer (api.js)
│   │   ├── utils/                # Date/time formatters, constants
│   │   ├── styles/               # Modern healthcare SaaS design tokens
│   │   ├── App.jsx               # React Router configuration
│   │   └── main.jsx              # React DOM mounting
│   ├── package.json
│   ├── vite.config.js
│   └── README.md
│
├── backend/                      # Node.js + Express REST API
│   ├── src/
│   │   ├── config/               # PostgreSQL pool connection (database.js)
│   │   ├── controllers/          # Request handling (appointmentController.js)
│   │   ├── models/               # Parameterized SQL queries (appointmentModel.js)
│   │   ├── routes/               # Express endpoints (appointmentRoutes.js)
│   │   ├── middleware/           # Validation & error middlewares
│   │   ├── services/             # Business logic layer
│   │   ├── utils/                # Standardized JSON response helpers
│   │   └── server.js             # Express app entrypoint & health probe
│   ├── tests/                    # Automated Jest + Supertest suites
│   ├── package.json
│   └── README.md
│
├── database/                     # Database scripts & migrations
│   ├── schema.sql                # Table definitions, constraints, indexes
│   ├── seed.sql                  # Synthetic healthcare demonstration data
│   └── README.md
│
├── docker/                       # Reserved for Person 2 (Dockerfiles)
├── jenkins/                      # Reserved for Person 2 (Jenkinsfile)
├── terraform/                    # Reserved for Person 3 (IaC manifests)
├── k8s/                          # Reserved for Person 4 (Kubernetes manifests)
│
├── .gitignore                    # Comprehensive exclusion (node_modules, .env, secrets)
├── .env.example                  # Environment variable blueprint
└── README.md                     # Project documentation
```

---

## 3. Local Quickstart Guide

### Prerequisites
- **Node.js**: v18+ (tested on v24.19)
- **NPM**: v9+ (tested on v11.17)
- **PostgreSQL**: 14+ (tested on v17)
- **Git**: 2.x

---

### Step 1: Clone Repository & Checkout Development Branch
```bash
git clone <repository-url>
cd DocConnect
git checkout development
```

---

### Step 2: Database Setup (PostgreSQL)

1. Open a terminal or `psql` shell:
   ```bash
   psql -U postgres
   ```
2. Create the `docconnect` database:
   ```sql
   CREATE DATABASE docconnect;
   \c docconnect
   ```
3. Execute the schema file:
   ```bash
   psql -U postgres -d docconnect -f database/schema.sql
   ```
4. (Optional) Load synthetic demo data:
   ```bash
   psql -U postgres -d docconnect -f database/seed.sql
   ```

---

### Step 3: Configure Environment Variables

Copy `.env.example` to create `.env` files:

```bash
# In backend/
cp .env.example backend/.env

# In frontend/
cp .env.example frontend/.env
```

Edit `backend/.env` with your local PostgreSQL password:
```env
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173,http://localhost:3000

DB_HOST=localhost
DB_PORT=5432
DB_NAME=docconnect
DB_USER=postgres
DB_PASSWORD=your_actual_postgres_password
DB_SSL=false
```

---

### Step 4: Install Dependencies & Run

#### Terminal 1 — Backend API
```bash
cd backend
npm install
npm run dev
```
Backend will start on: `http://localhost:5000`  
Health check: `http://localhost:5000/health`

#### Terminal 2 — React Frontend
```bash
cd frontend
npm install
npm run dev
```
Frontend will start on: `http://localhost:5173`

---

## 4. REST API Documentation

### Base URL: `http://localhost:5000`

### 1. Health Probe
- **Endpoint**: `GET /health`
- **Description**: Returns server state and verifies live PostgreSQL connectivity (designed for Kubernetes probes).
- **Response `200 OK`**:
  ```json
  {
    "service": "docconnect-backend",
    "status": "healthy",
    "timestamp": "2026-09-09T15:35:00.000Z",
    "database": "connected",
    "version": "1.0.0"
  }
  ```

---

### 2. Retrieve All Appointments
- **Endpoint**: `GET /appointments`
- **Response `200 OK`**:
  ```json
  {
    "success": true,
    "data": [
      {
        "id": 1,
        "patient_name": "Aarav Sharma",
        "patient_email": "aarav.sharma@example.com",
        "doctor_name": "Dr. Ananya Mehta — General Physician",
        "appointment_date": "2026-09-10",
        "appointment_time": "10:00 AM",
        "reason": "Annual wellness checkup",
        "status": "scheduled",
        "created_at": "2026-09-09T15:00:00.000Z",
        "updated_at": "2026-09-09T15:00:00.000Z"
      }
    ]
  }
  ```

---

### 3. Create Appointment
- **Endpoint**: `POST /appointments`
- **Headers**: `Content-Type: application/json`
- **Request Body**:
  ```json
  {
    "patient_name": "Priya Patel",
    "patient_email": "priya.patel@example.com",
    "doctor_name": "Dr. Rahul Shah — Cardiologist",
    "appointment_date": "2026-09-12",
    "appointment_time": "11:30 AM",
    "reason": "Routine cardiovascular consultation and ECG"
  }
  ```
- **Response `201 Created`**:
  ```json
  {
    "success": true,
    "message": "Appointment created successfully",
    "data": {
      "id": 2,
      "patient_name": "Priya Patel",
      "patient_email": "priya.patel@example.com",
      "doctor_name": "Dr. Rahul Shah — Cardiologist",
      "appointment_date": "2026-09-12",
      "appointment_time": "11:30 AM",
      "reason": "Routine cardiovascular consultation and ECG",
      "status": "scheduled"
    }
  }
  ```

---

### 4. Delete Appointment
- **Endpoint**: `DELETE /appointments/:id`
- **Response `200 OK`**:
  ```json
  {
    "success": true,
    "message": "Appointment deleted successfully",
    "data": {
      "id": 2,
      "patient_name": "Priya Patel",
      "doctor_name": "Dr. Rahul Shah — Cardiologist",
      "appointment_date": "2026-09-12",
      "appointment_time": "11:30 AM"
    }
  }
  ```
- **Response `404 Not Found`**:
  ```json
  {
    "success": false,
    "message": "Appointment with ID 999 was not found or already deleted."
  }
  ```

---

## 6. Testing

The backend includes an automated test suite verifying all endpoints, parameter parsing, and validation constraints.

To execute tests:
```bash
cd backend
npm test
```

Or from the workspace root:
```bash
npm test
```

**Results:**
- 12/12 test assertions passing across `GET`, `POST`, `DELETE`, validation filters, and error handlers.

---
