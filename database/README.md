# DocConnect Database

This folder contains PostgreSQL schema definitions, migration scripts, and synthetic seed data.

## Files
- `schema.sql` — Defines the `appointments` table with constraints, timestamps, and indexes.
- `seed.sql` — Synthetic demo healthcare appointment records and fictional doctors.

## Initialization
To initialize locally:
```bash
# Connect to PostgreSQL and create database
psql -U postgres -c "CREATE DATABASE docconnect;"

# Apply schema
psql -U postgres -d docconnect -f schema.sql

# Optional: Load seed data
psql -U postgres -d docconnect -f seed.sql
```
