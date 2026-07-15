// backend/seed-products.js
// Ye script mockData.ts ke 8 products ko asli MongoDB "products" collection mein daal deta hai
//
// Chalane ka tareeqa:
//   cd backend
//   node seed-products.js

require('dotenv').config();
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/amazon_clone';

// Yehi schema jo server.js mein hai — dono jagah match hona zaroori hai
const ProductSchema = new mongoose.Schema({
  title: { type: String, required: true },
  brand: { type: String, default: '' },
  basePrice: { type: Number, required: true },
  salePrice: { type: Number },
  rating: { type: Number, default: 0 },
  totalReviews: { type: Number, default: 0 },
  image: { type: String, default: '' },
  isBestSeller: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  isDeleted: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

// mockData.ts ke 8 products ko naye schema ke shape mein convert kiya
const productsToSeed = [
  {
    title: 'Wireless Bluetooth Headphones - Premium Sound Quality with Active Noise Cancellation',
    brand: 'AudioTech',
    basePrice: 149.99,
    salePrice: 99.99,
    rating: 4.5,
    totalReviews: 2341,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
    isBestSeller: true,
  },
  {
    title: 'Ergonomic Aluminum Laptop Stand - Adjustable Holder for Desk Setup',
    brand: 'TechPro',
    basePrice: 79.99,
    salePrice: 59.99,
    rating: 4.3,
    totalReviews: 892,
    image: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=400&h=400&fit=crop',
    isBestSeller: false,
  },
  {
    title: '4K Webcam with Ring Light - Professional Streaming Camera',
    brand: 'StreamPro',
    basePrice: 129.99,
    salePrice: 89.99,
    rating: 4.7,
    totalReviews: 678,
    image: 'https://images.unsplash.com/photo-1587826080692-f439cd0b70da?w=400&h=400&fit=crop',
    isBestSeller: false,
  },
  {
    title: 'Digital Quran Pen Reader - Word-by-Word Recitation with Translation',
    brand: 'QuranTech',
    basePrice: 79.99,
    salePrice: 59.99,
    rating: 4.8,
    totalReviews: 3456,
    image: 'https://images.unsplash.com/photo-1589998059171-988d0df3a8b3?w=400&h=400&fit=crop',
    isBestSeller: true,
  },
  {
    title: 'Fast Wireless Charging Pad - 15W Qi Charger for iPhone & Android',
    brand: 'TechPro',
    basePrice: 29.99,
    salePrice: 19.99,
    rating: 4.4,
    totalReviews: 1567,
    image: 'https://images.unsplash.com/photo-1586816879360-004f5b0c51e5?w=400&h=400&fit=crop',
    isBestSeller: false,
  },
  {
    title: 'USB-C Hub 7-in-1 Adapter - HDMI 4K, USB 3.0, SD Card Reader',
    brand: 'TechPro',
    basePrice: 39.99,
    salePrice: 29.99,
    rating: 4.5,
    totalReviews: 2345,
    image: 'https://images.unsplash.com/photo-1625723044792-44de16ccb4e9?w=400&h=400&fit=crop',
    isBestSeller: true,
  },
  {
    title: 'Portable Bluetooth Speaker - Waterproof with 24hr Battery Life',
    brand: 'AudioTech',
    basePrice: 59.99,
    salePrice: 39.99,
    rating: 4.6,
    totalReviews: 1890,
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop',
    isBestSeller: false,
  },
  {
    title: 'Digital Note-Taking Tablet - 10.1" HD Display with Stylus Pen',
    brand: 'StreamPro',
    basePrice: 199.99,
    salePrice: 149.99,
    rating: 4.3,
    totalReviews: 890,
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=400&fit=crop',
    isBestSeller: false,
  },
];

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Pehle purane products (agar koi ho) hata dein taake duplicate na banein
    const deleted = await Product.deleteMany({});
    console.log(`🗑️  Removed ${deleted.deletedCount} existing product(s)`);

    const inserted = await Product.insertMany(productsToSeed);
    console.log(`✅ Successfully seeded ${inserted.length} products into MongoDB`);

    inserted.forEach((p) => console.log(`   - ${p.title} ($${p.salePrice})`));

    await mongoose.disconnect();
    console.log('✅ Done. Disconnected from MongoDB.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  }
}

seed();