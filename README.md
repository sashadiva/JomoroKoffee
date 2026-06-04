# JomoroKoffee
Tugas Software Architecture Lab

## Database import helper

A root script is available to import the provided SQL files into MySQL.

Run from the repo root:

```bash
npm run db:import
```

Optional environment variables:

- `DB_HOST` (default: `localhost`)
- `DB_PORT` (default: `3306`)
- `DB_USER` (default: `root`)
- `DB_PASSWORD` (default: `root`)

The script executes:
- `databases/auth.sql`
- `databases/products.sql`
- `databases/transactions.sql`
