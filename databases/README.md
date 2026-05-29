# Jomoro Koffee Database Setup

## Database Structure

This directory contains SQL files for three microservices:

### 1. **auth.sql** - Auth Service
- `users` table: User authentication data (first_name, last_name, email, password, role)
- Supports ADMIN and CUSTOMER roles

### 2. **products.sql** - Product Service
- `categories` table: Product categories
- `products` table: Product catalog with pricing and inventory

### 3. **transactions.sql** - Transaction Service
- `carts` table: Shopping carts for users
- `cart_items` table: Items in shopping carts
- `orders` table: User orders
- `order_details` table: Line items in orders

## Setup Instructions

### Step 1: Import SQL Files to MySQL

```bash
# Option 1: Using MySQL CLI
mysql -u root -p < databases/auth.sql
mysql -u root -p < databases/products.sql
mysql -u root -p < databases/transactions.sql

# Option 2: Using Docker
docker run --name mysql-jomoro -e MYSQL_ROOT_PASSWORD=root -p 3306:3306 -d mysql:8.0
docker exec -i mysql-jomoro mysql -uroot -proot < databases/auth.sql
docker exec -i mysql-jomoro mysql -uroot -proot < databases/products.sql
docker exec -i mysql-jomoro mysql -uroot -proot < databases/transactions.sql
```

### Step 2: Verify Databases Created

```sql
SHOW DATABASES;
-- Should show: jomoro_auth, jomoro_products, jomoro_transactions
```

## Next Steps

1. Create NestJS microservices for each service
2. In each service, initialize Prisma and introspect the database
3. Configure Prisma schemas based on introspection results
4. Generate Prisma Client models
5. Implement API endpoints with Swagger documentation
