const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'my-secret-key-123';
const DB_PATH = path.join(__dirname, 'data', 'users.json');

function loadUsers() {
  try {
    const dir = path.dirname(DB_PATH);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    if (fs.existsSync(DB_PATH)) return JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
    return [];
  } catch { return []; }
}

function saveUsers(users) {
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(DB_PATH, JSON.stringify(users, null, 2));
}

app.post('/api/auth/register', (req, res) => {
  const { email, password, confirmPassword, firstName, lastName, role } = req.body;
  if (password !== confirmPassword) return res.status(400).json({ success: false, message: 'Passwords do not match' });
  const users = loadUsers();
  if (users.find(u => u.email === email)) return res.status(409).json({ success: false, message: 'Email already registered' });
  
  const user = { id: 'user-' + Date.now(), email, password, firstName: firstName || 'User', lastName: lastName || '', role: role || 'CUSTOMER', createdAt: new Date().toISOString() };
  users.push(user);
  saveUsers(users);

  const token = jwt.sign({ id: user.id, email, role: user.role }, JWT_SECRET, { expiresIn: '15m' });
  const refreshToken = jwt.sign({ id: user.id, email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
  res.status(201).json({ success: true, data: { accessToken: token, refreshToken, expiresIn: 900, user: { id: user.id, email, firstName: user.firstName, lastName: user.lastName, role: user.role } } });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (email === 'admin@amazonclone.com' && password === 'Admin@123') {
    const token = jwt.sign({ id: 'admin-001', email, role: 'ADMIN' }, JWT_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ id: 'admin-001', email, role: 'ADMIN' }, JWT_SECRET, { expiresIn: '7d' });
    return res.json({ success: true, data: { accessToken: token, refreshToken, expiresIn: 900, user: { id: 'admin-001', email, firstName: 'Admin', lastName: 'User', role: 'ADMIN' } } });
  }
  const users = loadUsers();
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) return res.status(401).json({ success: false, message: 'Invalid credentials' });
  const token = jwt.sign({ id: user.id, email, role: user.role }, JWT_SECRET, { expiresIn: '15m' });
  const refreshToken = jwt.sign({ id: user.id, email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ success: true, data: { accessToken: token, refreshToken, expiresIn: 900, user: { id: user.id, email, firstName: user.firstName, lastName: user.lastName, role: user.role } } });
});

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server on port ${PORT}`));