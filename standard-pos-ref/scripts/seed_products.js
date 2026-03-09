/**
 * Seed Script for Standard POS
 * 
 * Usage: 
 * 1. Ensure Redis is running locally on port 6379 (or set REDIS_URL).
 * 2. npm install ioredis
 * 3. node seed_products.js
 */

const Redis = require('ioredis');
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

const products = [
  { id: 'prod_001', name: 'Espresso', price: 3.50, category: 'Coffee', stock: 100 },
  { id: 'prod_002', name: 'Latte', price: 4.50, category: 'Coffee', stock: 80 },
  { id: 'prod_003', name: 'Cappuccino', price: 4.50, category: 'Coffee', stock: 80 },
  { id: 'prod_004', name: 'Mocha', price: 5.00, category: 'Coffee', stock: 60 },
  { id: 'prod_005', name: 'Croissant', price: 3.00, category: 'Bakery', stock: 30 },
  { id: 'prod_006', name: 'Muffin', price: 3.50, category: 'Bakery', stock: 40 },
  { id: 'prod_007', name: 'Bagel', price: 2.50, category: 'Bakery', stock: 50 },
  { id: 'prod_008', name: 'Sandwich', price: 7.00, category: 'Food', stock: 20 },
  { id: 'prod_009', name: 'Salad', price: 8.50, category: 'Food', stock: 15 },
  { id: 'prod_010', name: 'Iced Tea', price: 3.00, category: 'Drinks', stock: 100 },
];

async function seed() {
  console.log('🌱 Seeding products...');

  for (const product of products) {
    const key = `pos:products:${product.id}`;
    const inventoryKey = `pos:inventory:${product.id}`;

    // Store product details
    await redis.hmset(key, {
      id: product.id,
      name: product.name,
      price: product.price,
      category: product.category,
    });

    // Set initial inventory
    await redis.set(inventoryKey, product.stock);
    
    console.log(`- Added ${product.name} ($${product.price}) with stock ${product.stock}`);
  }

  console.log('✅ Seeding complete!');
  process.exit(0);
}

seed().catch(err => {
  console.error('Error seeding data:', err);
  process.exit(1);
});
