# Jomoro Koffee Database Setup

## Database Structure

All services share a single `jomoro_koffee` database containing:

### Auth Service Tables
- `users` table: User authentication data (first_name, last_name, email, password, role)
- Supports ADMIN and CUSTOMER roles

### Product Service Tables
- `categories` table: Product categories
- `products` table: Product catalog with pricing and inventory

### Transaction Service Tables
- `carts` table: Shopping carts for users
- `cart_items` table: Items in shopping carts
- `orders` table: User orders
- `order_details` table: Line items in orders

## Setup Instructions

### Step 1: Import SQL File to MySQL

```bash
# Option 1: Using the provided Node import script (recommended)
npm run db:import

# Option 2: Using MySQL CLI
mysql -u root -p < database/jomoro_koffee.sql

# Option 3: Using Docker
docker run --name mysql-jomoro -e MYSQL_ROOT_PASSWORD=root -p 3306:3306 -d mysql:8.0
docker exec -i mysql-jomoro mysql -uroot -proot < database/jomoro_koffee.sql
```

The import script uses these environment variables if set:

- `DB_HOST` (default: `localhost`)
- `DB_PORT` (default: `3306`)
- `DB_USER` (default: `root`)
- `DB_PASSWORD` (default: `root`)

### Step 2: Verify Database Created

```sql
SHOW DATABASES;
-- Should show: jomoro_koffee

USE jomoro_koffee;
SHOW TABLES;
-- Should show: users, categories, products, carts, cart_items, orders, order_details
```

## Configuration

Each service's `.env` file points to the same database:

```
DATABASE_URL=mysql://root@localhost:3306/jomoro_koffee
```

## Next Steps

1. Run `npm run db:import` from the repo root
2. In each service, run `npm install`
2. In each service, run `npx prisma generate`
4. Start the services with `npm run start:dev`
