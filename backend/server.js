require('dotenv').config();
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const http = require('http');           // 👈 NAYA: Express ko http server mein wrap karne ke liye
const { Server } = require('socket.io'); // 👈 NAYA: Socket.io import

const app = express();
app.use(cors());
app.use(express.json());

// 👇 NAYA: Express app ko http server mein wrap kiya (Socket.io ko isi server ki zaroorat hoti hai)
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }, // production mein apna frontend URL yahan dalein
});

const JWT_SECRET = process.env.JWT_SECRET || 'my-secret-key-123';
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/amazon_clone';

// Connect to MongoDB — retry every 5 seconds instead of crashing
const connectDB = () => {
  mongoose.connect(MONGODB_URI)
    .then(() => console.log('✅ Successfully connected to MongoDB'))
    .catch((err) => {
      console.error('⚠️  MongoDB connection failed, retrying in 5s...', err.message);
      setTimeout(connectDB, 5000);
    });
};
connectDB();

// Helper: check if DB is ready before running DB queries
const requireDB = (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ success: false, message: 'Database not connected. Please wait and try again.' });
  }
  next();
};

// Define Mongoose User Schema
const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  firstName: { type: String, default: 'User' },
  lastName: { type: String, default: '' },
  role: { type: String, enum: ['CUSTOMER', 'SELLER', 'ADMIN'], default: 'CUSTOMER' },
  isActive: { type: Boolean, default: true },          // 👈 NAYA: dashboard "activeUsers" count ke liye
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const User = mongoose.model('User', UserSchema);

// 👇 NAYA: Order Schema (agar aapke paas already koi orders collection/model hai to uska structure yahan match kar lein)
const OrderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  items: [{
    productId: String,
    title: String,
    image: String,
    quantity: Number,
    price: Number,
  }],
  shippingAddress: {
    fullName: String,
    phoneNumber: String,
    streetAddress: String,
    city: String,
    state: String,
    zipCode: String,
    country: String,
  },
  subtotal: { type: Number, default: 0 },
  shippingCost: { type: Number, default: 0 },
  tax: { type: Number, default: 0 },
  total: { type: Number, default: 0 },
  status: {
    type: String,
    enum: ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'],
    default: 'PENDING',
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Order = mongoose.model('Order', OrderSchema);

// 👇 NAYA: Product Schema
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

// ===== NAYA: Dashboard stats calculate karne wala helper function =====
// Ye function admin.service.ts wale getDashboardOverview() ki jagah leta hai
const calculateDashboardStats = async () => {
  const [totalUsers, activeUsers, totalProducts, totalOrders, revenueResult] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ isActive: true }),
    Product.countDocuments({ isDeleted: false }),
    Order.countDocuments(),
    Order.aggregate([
      { $match: { status: { $ne: 'CANCELLED' } } },
      { $group: { _id: null, total: { $sum: '$total' } } },
    ]),
  ]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const newUsersToday = await User.countDocuments({ createdAt: { $gte: today } });
  const pendingOrders = await Order.countDocuments({ status: 'PENDING' });

  return {
    totalUsers,
    activeUsers,
    totalProducts,
    totalOrders,
    totalRevenue: revenueResult[0]?.total || 0,
    newUsersToday,
    pendingOrders,
  };
};

// ===== NAYA: Har admin-connected client ko fresh stats bhejne wala helper =====
const broadcastDashboardUpdate = async () => {
  try {
    const stats = await calculateDashboardStats();
    io.of('/admin').emit('dashboard:update', stats);
  } catch (err) {
    console.error('Broadcast error:', err.message);
  }
};

// ===== NAYA: Socket.io "/admin" namespace — sirf ADMIN role wale connect ho sakte hain =====
const adminNamespace = io.of('/admin');
adminNamespace.use((socket, next) => {
  try {
    const token = socket.handshake.auth?.token;
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.role !== 'ADMIN') {
      return next(new Error('Forbidden: Admins only'));
    }
    socket.user = decoded;
    next();
  } catch (err) {
    next(new Error('Invalid token'));
  }
});

adminNamespace.on('connection', (socket) => {
  console.log(`✅ Admin connected via socket: ${socket.id}`);
  socket.on('disconnect', () => console.log(`Admin disconnected: ${socket.id}`));
});

// ===== NAYA: Customer "/orders" namespace — koi bhi logged-in user apne orders ke updates sun sakta hai =====
const ordersNamespace = io.of('/orders');
ordersNamespace.use((socket, next) => {
  try {
    const token = socket.handshake.auth?.token;
    const decoded = jwt.verify(token, JWT_SECRET);
    socket.user = decoded;
    next();
  } catch (err) {
    next(new Error('Invalid token'));
  }
});

ordersNamespace.on('connection', (socket) => {
  // Har customer ko apne "room" mein daal dete hain (jiska naam unki user id hai)
  // Isse jab unka order update ho, sirf unhi ko notify hoga, baaki logged-in users ko nahi
  socket.join(`user_${socket.user.id}`);
  console.log(`✅ Customer connected to orders socket: ${socket.user.id}`);

  socket.on('disconnect', () => {
    console.log(`Customer disconnected from orders socket: ${socket.user.id}`);
  });
});

// ===== NAYA: Order update hone par sirf us customer ko notify karta hai jiska order hai =====
const notifyCustomerOrderUpdate = (order) => {
  if (order.userId) {
    ordersNamespace.to(`user_${order.userId}`).emit('order:update', order);
  }
};

// Registration Endpoint
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, confirmPassword, firstName, lastName, role } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({ success: false, message: 'Passwords do not match' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'Email already registered' });
    }

    const user = new User({
      email: normalizedEmail,
      password,
      firstName: firstName || 'User',
      lastName: lastName || '',
      role: role || 'CUSTOMER',
    });

    await user.save();

    broadcastDashboardUpdate();   // 👈 NAYA: naya user bana, admin dashboard ko turant update bhej do

    const token = jwt.sign({ id: user._id.toString(), email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ id: user._id.toString(), email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      success: true,
      data: {
        accessToken: token,
        refreshToken,
        expiresIn: 900,
        user: { id: user._id.toString(), email: user.email, firstName: user.firstName, lastName: user.lastName, role: user.role },
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ success: false, message: 'Server error during registration' });
  }
});

// Login Endpoint
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (email === 'admin@amazonclone.com' && password === 'Admin@123') {
      const token = jwt.sign({ id: 'admin-001', email, role: 'ADMIN' }, JWT_SECRET, { expiresIn: '15m' });
      const refreshToken = jwt.sign({ id: 'admin-001', email, role: 'ADMIN' }, JWT_SECRET, { expiresIn: '7d' });
      return res.json({
        success: true,
        data: {
          accessToken: token,
          refreshToken,
          expiresIn: 900,
          user: { id: 'admin-001', email, firstName: 'Admin', lastName: 'User', role: 'ADMIN' },
        },
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });
    if (!user || user.password !== password) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id.toString(), email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ id: user._id.toString(), email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      success: true,
      data: {
        accessToken: token,
        refreshToken,
        expiresIn: 900,
        user: { id: user._id.toString(), email: user.email, firstName: user.firstName, lastName: user.lastName, role: user.role },
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error during login' });
  }
});

// Health check Endpoint
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// Admin Middleware - verifies JWT and checks for ADMIN role
const adminAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }
  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.role !== 'ADMIN') {
      return res.status(403).json({ success: false, message: 'Forbidden: Admins only' });
    }
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }
};

// ===== NAYA: Customer Auth Middleware — koi bhi logged-in user (ADMIN ho ya CUSTOMER) =====
const customerAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }
  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }
};

// ===== NAYA: Customer — Place a new order (real checkout) =====
app.post('/api/orders', customerAuth, requireDB, async (req, res) => {
  try {
    const { items, shippingAddress, subtotal, shippingCost, tax, total } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Order must contain at least one item' });
    }

    // Hardcoded admin ka koi real Mongo _id nahi hota, is liye userId sirf real users ke liye set karein
    const orderData = {
      items,
      shippingAddress,
      subtotal,
      shippingCost,
      tax,
      total,
      status: 'PENDING',
    };
    if (mongoose.Types.ObjectId.isValid(req.user.id)) {
      orderData.userId = req.user.id;
    }

    const order = new Order(orderData);
    await order.save();

    broadcastDashboardUpdate();   // 👈 naya order bana, admin dashboard ko turant update bhej do

    res.status(201).json({ success: true, data: order });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ success: false, message: 'Server error while placing order' });
  }
});

// ===== NAYA: Customer — Get their own orders =====
app.get('/api/orders', customerAuth, requireDB, async (req, res) => {
  try {
    const filter = mongoose.Types.ObjectId.isValid(req.user.id) ? { userId: req.user.id } : {};
    const orders = await Order.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, data: { orders, total: orders.length } });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ===== NAYA: Admin Dashboard Overview Route =====
app.get('/api/admin/dashboard', adminAuth, requireDB, async (req, res) => {
  res.set('Cache-Control', 'no-store');   // 👈 NAYA: browser ko 304 dene se roka
  try {
    const stats = await calculateDashboardStats();
    res.json({ success: true, ...stats });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Admin: Get all users
app.get('/api/admin/users', adminAuth, requireDB, async (req, res) => {
  try {
    const users = await User.find({}, '-password').sort({ createdAt: -1 });
    res.json({ success: true, data: { users, total: users.length } });
  } catch (error) {
    console.error('Admin get users error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Admin: Delete a user by ID
app.delete('/api/admin/users/:id', adminAuth, requireDB, async (req, res) => {
  try {
    const { id } = req.params;
    if (id === req.user.id) {
      return res.status(400).json({ success: false, message: 'You cannot delete your own account' });
    }
    const deleted = await User.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    broadcastDashboardUpdate();   // 👈 NAYA: user delete hua, dashboard update karo
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    console.error('Admin delete user error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Admin: Update user role
app.patch('/api/admin/users/:id/role', adminAuth, requireDB, async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    if (!['CUSTOMER', 'SELLER', 'ADMIN'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role' });
    }
    const user = await User.findByIdAndUpdate(id, { role }, { new: true, select: '-password' });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, data: user });
  } catch (error) {
    console.error('Admin update role error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ===== NAYA: Admin — Order status update (jab order status change ho, dashboard ko batayein) =====
// ===== NAYA: Admin — Get all orders =====
app.get('/api/admin/orders', adminAuth, requireDB, async (req, res) => {
  try {
    const orders = await Order.find().populate('userId', 'email firstName lastName').sort({ createdAt: -1 });
    res.json({ success: true, data: { orders, total: orders.length } });
  } catch (error) {
    console.error('Admin get orders error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.patch('/api/admin/orders/:id/status', adminAuth, requireDB, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(id, { status, updatedAt: new Date() }, { new: true });
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    broadcastDashboardUpdate();   // 👈 NAYA: admin dashboard update
    notifyCustomerOrderUpdate(order);   // 👈 NAYA: us customer ko turant batayein jiska order hai
    res.json({ success: true, data: order });
  } catch (error) {
    console.error('Order status update error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ===== NAYA: PUBLIC — Get single product by ID (Product Detail page ke liye) =====
app.get('/api/products/:id', requireDB, async (req, res) => {
  res.set('Cache-Control', 'no-store');   // 👈 NAYA: same fix single product route ke liye bhi
  try {
    const product = await Product.findOne({ _id: req.params.id, isDeleted: false });
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, data: product });
  } catch (error) {
    console.error('Get product by id error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ===== NAYA: PUBLIC — Get all products (customers ke liye, koi auth nahi chahiye) =====
app.get('/api/products', requireDB, async (req, res) => {
  res.set('Cache-Control', 'no-store');   // 👈 NAYA: 304 empty-body issue se bachne ke liye
  try {
    const products = await Product.find({ isDeleted: false, isActive: true }).sort({ createdAt: -1 });
    res.json({ success: true, data: { products, total: products.length } });
  } catch (error) {
    console.error('Public get products error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ===== NAYA: Admin — Get all products =====
app.get('/api/admin/products', adminAuth, requireDB, async (req, res) => {
  try {
    const products = await Product.find({ isDeleted: false }).sort({ createdAt: -1 });
    res.json({ success: true, data: { products, total: products.length } });
  } catch (error) {
    console.error('Admin get products error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ===== NAYA: Admin — Create a product =====
app.post('/api/admin/products', adminAuth, requireDB, async (req, res) => {
  try {
    const { title, brand, basePrice, salePrice, image } = req.body;
    if (!title || !basePrice) {
      return res.status(400).json({ success: false, message: 'Title and basePrice are required' });
    }
    const product = new Product({ title, brand, basePrice, salePrice, image });
    await product.save();
    broadcastDashboardUpdate();   // 👈 naya product bana, dashboard update karo
    res.status(201).json({ success: true, data: product });
  } catch (error) {
    console.error('Admin create product error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ===== NAYA: Admin — Delete product (soft delete) =====
app.delete('/api/admin/products/:id', adminAuth, requireDB, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { isDeleted: true, isActive: false },
      { new: true }
    );
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    broadcastDashboardUpdate();   // 👈 product delete hua, dashboard update karo
    res.json({ success: true, message: 'Product deleted' });
  } catch (error) {
    console.error('Admin delete product error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ===== NAYA: Admin — Toggle featured (best-seller) status =====
app.patch('/api/admin/products/:id/toggle-featured', adminAuth, requireDB, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    product.isBestSeller = !product.isBestSeller;
    await product.save();
    res.json({ success: true, message: `Product ${product.isBestSeller ? 'featured' : 'unfeatured'}` });
  } catch (error) {
    console.error('Toggle featured error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ===== NAYA: AI Chatbot Route (Groq free tier — OpenAI-compatible API) =====
app.post('/api/chatbot', async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ success: false, message: 'Message is required' });
    }

    // 👇 NAYA: Live product count database se nikala, taake AI hamesha sahi number bataye
    let productCount = 'a small number of';
    try {
      productCount = await Product.countDocuments({ isDeleted: false });
    } catch (e) {
      // agar DB na chale to bhi chatbot generic answer de sake
    }

    // Groq OpenAI-style "messages" array expect karta hai
    const formattedHistory = (history || []).map((h) => ({
      role: h.role === 'user' ? 'user' : 'assistant',
      content: h.text,
    }));

    const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: `You are a helpful assistant for a small e-commerce demo project called "Amazon Clone" (a student portfolio project, not the real Amazon).
This store currently has exactly ${productCount} products in electronics category — do NOT claim it has "millions" of products, warehouses, or global logistics like the real Amazon. It is a single-seller demo store.
Be honest about it being a small demo store if asked. Keep answers concise and helpful.`,
          },
          ...formattedHistory,
          { role: 'user', content: message },
        ],
      }),
    });

    const data = await groqRes.json();

    if (!groqRes.ok) {
      console.error('Groq API error:', data);
      return res.status(500).json({ success: false, message: 'Chatbot is currently unavailable. Please try again.' });
    }

    const reply = data.choices?.[0]?.message?.content || 'Sorry, I could not generate a response.';
    res.json({ success: true, reply });
  } catch (error) {
    console.error('Chatbot error:', error.message);
    res.status(500).json({ success: false, message: 'Chatbot is currently unavailable. Please try again.' });
  }
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server on port ${PORT}`));   // 👈 CHANGE: app.listen ki jagah server.listen