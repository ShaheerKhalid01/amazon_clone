require('dotenv').config();
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/amazon_clone';

// Mongoose User Schema
const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  firstName: { type: String, default: 'User' },
  lastName: { type: String, default: '' },
  role: { type: String, enum: ['CUSTOMER', 'SELLER', 'ADMIN'], default: 'CUSTOMER' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', UserSchema);

// Default mock users to seed if json is empty or doesn't exist
const defaultMockUsers = [
  {
    email: 'admin@amazonclone.com',
    password: 'Admin@123',
    firstName: 'Admin',
    lastName: 'User',
    role: 'ADMIN'
  },
  {
    email: 'john@example.com',
    password: 'Password@123',
    firstName: 'John',
    lastName: 'Doe',
    role: 'CUSTOMER'
  },
  {
    email: 'jane@example.com',
    password: 'Password@123',
    firstName: 'Jane',
    lastName: 'Smith',
    role: 'CUSTOMER'
  },
  {
    email: 'seller@amazonclone.com',
    password: 'Password@123',
    firstName: 'Seller',
    lastName: 'One',
    role: 'SELLER'
  }
];

async function migrate() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Successfully connected to MongoDB.');

    // Look for JSON database in multiple possible locations
    const possiblePaths = [
      path.join(__dirname, 'data', 'users.json'),
      path.join(__dirname, 'dist', 'data', 'users.json'),
      path.join(__dirname, 'src', 'data', 'users.json'),
      path.join(__dirname, 'users.json')
    ];

    let jsonUsers = [];
    let foundPath = null;

    for (const p of possiblePaths) {
      if (fs.existsSync(p)) {
        try {
          const content = fs.readFileSync(p, 'utf8');
          jsonUsers = JSON.parse(content);
          foundPath = p;
          break;
        } catch (e) {
          console.error(`Failed to read/parse JSON from ${p}:`, e.message);
        }
      }
    }

    let usersToMigrate = [];

    if (foundPath && jsonUsers.length > 0) {
      console.log(`Found JSON database with ${jsonUsers.length} users at ${foundPath}`);
      usersToMigrate = jsonUsers.map(u => ({
        email: u.email,
        password: u.password || 'Password@123', // Ensure a password is set
        firstName: u.firstName || 'User',
        lastName: u.lastName || '',
        role: u.role || 'CUSTOMER',
        createdAt: u.createdAt ? new Date(u.createdAt) : new Date()
      }));
    } else {
      console.log('No JSON user database found. Using default mock users for seeding.');
      usersToMigrate = defaultMockUsers;
    }

    let insertedCount = 0;
    let skippedCount = 0;

    for (const userData of usersToMigrate) {
      const normalizedEmail = userData.email.toLowerCase().trim();
      const exists = await User.findOne({ email: normalizedEmail });

      if (exists) {
        skippedCount++;
      } else {
        const newUser = new User(userData);
        await newUser.save();
        insertedCount++;
        console.log(`Migrated/seeded user: ${normalizedEmail} (${userData.role})`);
      }
    }

    console.log('\n--- Migration/Seeding complete ---');
    console.log(`Successfully migrated/seeded: ${insertedCount} users`);
    console.log(`Skipped (already exists): ${skippedCount} users`);

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

migrate();
