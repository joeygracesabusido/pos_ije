# Redis Schema for POS

This document outlines the recommended Redis key structures for a high-performance Point of Sale system.

## Keys

### Products (`pos:products:{id}`)
**Type:** Hash
**Description:** Stores product details.
**Example:**
```redis
HMSET pos:products:prod_123 
    name "Espresso Machine" 
    price 499.99 
    category "Appliances" 
    barcode "890123456789"
```

### Inventory (`pos:inventory:{id}`)
**Type:** String (Counter)
**Description:** Tracks current stock levels. Supports atomic increments/decrements.
**Example:**
```redis
SET pos:inventory:prod_123 50
INCRBY pos:inventory:prod_123 10  # Add stock
DECRBY pos:inventory:prod_123 1   # Sale
```

### Carts (`pos:carts:{sessionId}`)
**Type:** Hash
**Description:** Stores items currently in a user's cart. Field is product ID, value is quantity.
**Example:**
```redis
HINCRBY pos:carts:session_abc prod_123 1  # Add 1 Espresso Machine
HINCRBY pos:carts:session_abc prod_456 2  # Add 2 Coffee Beans
HDEL pos:carts:session_abc prod_123       # Remove item
DEL pos:carts:session_abc                 # Clear cart
```

### Sales (`pos:sales:{date}:{transactionId}`)
**Type:** Hash
**Description:** Stores completed transaction details.
**Example:**
```redis
HMSET pos:sales:2023-10-27:tx_999
    total 519.99
    items "[{\"id\":\"prod_123\",\"qty\":1},{\"id\":\"prod_456\",\"qty\":2}]"
    customer "cust_001"
    timestamp 1698412800
```

### Daily Sales Summary (`pos:stats:daily:{date}`)
**Type:** String (Counter) / Sorted Set for specific metrics
**Description:** Aggregates total sales for quick reporting.
**Example:**
```redis
INCRBYFLOAT pos:stats:daily:2023-10-27 519.99
```

### Top Products (`pos:stats:top_products`)
**Type:** Sorted Set
**Description:** Tracks most sold products. Score is total quantity sold.
**Example:**
```redis
ZINCRBY pos:stats:top_products 1 "Espresso Machine"
ZINCRBY pos:stats:top_products 2 "Coffee Beans"
```

## Workflows

### Processing a Sale
1.  **Start Transaction:** `MULTI`
2.  **Verify Stock:** `WATCH pos:inventory:{id}` (Optional for strict consistency)
3.  **Decrement Inventory:** `DECRBY pos:inventory:{id} {qty}`
4.  **Create Sale Record:** `HMSET pos:sales:...`
5.  **Update Stats:** `INCRBYFLOAT pos:stats:daily:...` & `ZINCRBY pos:stats:top_products ...`
6.  **Clear Cart:** `DEL pos:carts:{sessionId}`
7.  **Commit:** `EXEC`
