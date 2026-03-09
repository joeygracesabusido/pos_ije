---
name: standard-pos
description: Build and manage a Point of Sale (POS) system with Next.js and Redis. Covers inventory, sales, reporting, and hardware integration. Use when creating or maintaining a POS application.
---

# Standard POS (Next.js + Redis)

This skill provides specialized workflows and resources for building a robust Point of Sale system. It leverages the speed of Redis for real-time inventory and sales tracking, combined with the flexibility of Next.js for the frontend.

## Core Workflows

### 1. Project Setup
Initialize a new Next.js project with Redis client configuration.

**Command:** `npx create-next-app@latest my-pos --typescript --tailwind --eslint`
**Redis Client:** Use `ioredis` or `@upstash/redis` for serverless environments.

### 2. Data Modeling (Redis)
Use the recommended Redis schema for high-performance POS operations.
See [REDIS_SCHEMA.md](references/REDIS_SCHEMA.md) for detailed key structures.

- **Products:** `pos:products:{id}` (Hash)
- **Inventory:** `pos:inventory:{id}` (String/Counter)
- **Carts:** `pos:carts:{sessionId}` (Hash)
- **Sales:** `pos:sales:{date}:{id}` (Hash)

### 3. Inventory Management
Manage products and stock levels.
- **Add Product:** Use `HMSET` to store product details.
- **Update Stock:** Use `INCRBY` / `DECRBY` for atomic inventory updates.

### 4. Sales & Checkout
Process transactions and generate receipts.
- **Add to Cart:** `HINCRBY` cart items.
- **Checkout:**
    1. Validate stock (`GET pos:inventory:{id}`).
    2. Create sale record (`HMSET pos:sales:...`).
    3. Decrement stock (`DECRBY`).
    4. Clear cart (`DEL`).

### 5. Hardware Integration
Integrate barcode scanners and receipt printers.
- **Scanners:** Most USB scanners act as keyboard input. Listen for `keydown` events with a specific prefix/suffix (often `Enter`).
- **Printers:** Use the WebUSB API or a local print server for thermal receipt printers.
See [HARDWARE.md](references/HARDWARE.md) for implementation details.

### 6. Reporting
Generate sales reports from Redis data.
- **Daily Sales:** `KEYS pos:sales:{date}:*` -> Aggregate totals.
- **Top Products:** specific sorted set `pos:stats:top_products` (`ZINCRBY` on sale).

## Templates & Assets
Use the provided templates in `assets/` to speed up development.
- **Product Card Component:** `assets/components/ProductCard.tsx`
- **POS Layout:** `assets/layouts/POSLayout.tsx`

## Troubleshooting
- **Redis Connection:** Ensure your `REDIS_URL` environment variable is set.
- **Scanner Input:** If scanner input is not detected, check focus on the input field or global event listeners.
