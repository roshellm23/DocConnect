# DocConnect — Backend REST API

Node.js and Express.js REST API providing healthcare appointment services backed by PostgreSQL.

## Features
- Modular MVC architecture (`config/`, `controllers/`, `models/`, `routes/`, `services/`, `middleware/`, `utils/`)
- Parameterized PostgreSQL queries with `pg` connection pool
- Robust validation for appointment scheduling inputs
- Centralized error handling
- `/health` endpoint for Kubernetes and container probes
- Jest and Supertest automated test suite

## Scripts
- `npm start` — Run in production mode (`node src/server.js`)
- `npm run dev` — Run with hot reload (`nodemon src/server.js`)
- `npm test` — Run automated test suite (`jest`)

## Configuration
See `.env.example` for all configurable environment variables.
