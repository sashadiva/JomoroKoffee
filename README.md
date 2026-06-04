# JomoroKoffee
Tugas Software Architecture Lab

## Quick Start

### 1. Import Database
Run from the repo root to import all tables into a single database:

```bash
npm run db:import
```

This creates the `jomoro_koffee` database with all tables for Auth, Product, and Transaction services.

### 2. Install Dependencies
In each service folder:

```bash
cd auth-service && npm install
cd ../product-service && npm install
cd ../transaction-service && npm install
```

### 3. Start Services
Open three terminals and run:

```bash
# Terminal 1
cd auth-service && npm run start:dev

# Terminal 2
cd product-service && npm run start:dev

# Terminal 3
cd transaction-service && npm run start:dev
```

### 4. Access Swagger
- Auth Service: http://localhost:3001/api
- Product Service: http://localhost:3002/api
- Transaction Service: http://localhost:3003/api

## Database
All services use a single `jomoro_koffee` database with separate tables for each service domain.

Environment variables use:
- `DB_HOST` (default: `localhost`)
- `DB_PORT` (default: `3306`)
- `DB_USER` (default: `root`)
- `DB_PASSWORD` (default: `root`)
