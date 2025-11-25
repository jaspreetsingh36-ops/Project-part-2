require("dotenv").config();

const MONGODB_URI = process.env.MONGODB_URI;
const JWT_SECRET = process.env.JWT_SECRET;


const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 3000;

// ===== Middleware =====
app.use(cors());
app.use(express.json());

// ⭐ IMPORTANT: serve /Frontend as static
app.use(express.static(path.join(__dirname, '../Frontend')));

// ===== MongoDB Connection =====
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://autorent-user:Autorent2025@cluster0.avlirvg.mongodb.net/autorent?retryWrites=true&w=majority';


console.log('🚗 Starting AutoRent Server...');
console.log('🔗 Connecting to MongoDB...');

mongoose
  .connect(MONGODB_URI, {
    serverSelectionTimeoutMS: 10000,
  })
  .then(() => {
    console.log('✅ MongoDB connected successfully');
  })
  .catch((err) => {
    console.error('❌ MongoDB connection failed:', err.message);
    console.error('🛑 Cannot continue without a database. Exiting.');
    process.exit(1);
  });

// ===== Mongoose Models =====

const carSchema = new mongoose.Schema(
  {
    model: { type: String, required: true },
    type: { type: String, required: true },
    year: { type: Number, required: true },
    dailyRate: { type: Number, required: true },
    status: { type: String, required: true, enum: ['Available', 'Rented', 'Maintenance'] },
    description: { type: String, default: '' },
  },
  { timestamps: true }
);

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // hashed
  },
  { timestamps: true }
);

const Car = mongoose.model('Car', carSchema);
const User = mongoose.model('User', userSchema);

// ===== Auth / JWT =====

const JWT_SECRET = process.env.JWT_SECRET || 'autorent-secret-key-2025';

const authMiddleware = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization header missing or invalid' });
  }

  const token = header.replace('Bearer ', '').trim();

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // { userId, email }
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

// ===== API ROUTES =====

// Health check
app.get('/api/health', async (req, res) => {
  const state = mongoose.connection.readyState; // 0=disconnected,1=connected,2=connecting,3=disconnecting
  res.json({
    status: 'OK',
    server: 'AutoRent API is running',
    database: state === 1 ? 'MongoDB (connected)' : 'MongoDB (not connected)',
    dbState: state,
    timestamp: new Date().toISOString(),
  });
});

// ---- Auth Routes ----

// Register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashed });
    await user.save();

    const token = jwt.sign({ userId: user._id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

    return res.status(201).json({
      message: 'User created successfully',
      token,
      user: { id: user._id, email: user.email },
    });
  } catch (err) {
    console.error('❌ Error in /api/auth/register:', err);
    return res.status(500).json({ message: 'Error creating user', error: err.message });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ userId: user._id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

    return res.json({
      message: 'Login successful',
      token,
      user: { id: user._id, email: user.email },
    });
  } catch (err) {
    console.error('❌ Error in /api/auth/login:', err);
    return res.status(500).json({ message: 'Error logging in', error: err.message });
  }
});

// ---- Car Routes ----

// Get all cars
app.get('/api/cars', async (req, res) => {
  try {
    const cars = await Car.find().sort({ createdAt: -1 });
    return res.json(cars);
  } catch (err) {
    console.error('❌ Error fetching cars:', err);
    return res.status(500).json({ error: 'Error fetching cars' });
  }
});

// Get only available cars
app.get('/api/cars/available', async (req, res) => {
  try {
    const cars = await Car.find({ status: 'Available' }).sort({ createdAt: -1 });
    return res.json(cars);
  } catch (err) {
    console.error('❌ Error fetching available cars:', err);
    return res.status(500).json({ error: 'Error fetching available cars' });
  }
});

// Get a single car by ID
app.get('/api/cars/:id', async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) return res.status(404).json({ error: 'Car not found' });
    return res.json(car);
  } catch (err) {
    console.error('❌ Error fetching car:', err);
    return res.status(500).json({ error: 'Error fetching car' });
  }
});

// Add new car (protected)
app.post('/api/cars', authMiddleware, async (req, res) => {
  try {
    const { model, type, year, dailyRate, status, description } = req.body;

    if (!model || !type || !year || !dailyRate || !status) {
      return res.status(400).json({ error: 'Missing required car fields' });
    }

    const car = new Car({ model, type, year, dailyRate, status, description });
    const saved = await car.save();
    return res.status(201).json(saved);
  } catch (err) {
    console.error('❌ Error creating car:', err);
    return res.status(400).json({ error: err.message });
  }
});

// Update car (protected)
app.put('/api/cars/:id', authMiddleware, async (req, res) => {
  try {
    const updated = await Car.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated) return res.status(404).json({ error: 'Car not found' });
    return res.json(updated);
  } catch (err) {
    console.error('❌ Error updating car:', err);
    return res.status(400).json({ error: err.message });
  }
});

// Delete car (protected)
app.delete('/api/cars/:id', authMiddleware, async (req, res) => {
  try {
    const deleted = await Car.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Car not found' });
    return res.json({ message: 'Car deleted successfully' });
  } catch (err) {
    console.error('❌ Error deleting car:', err);
    return res.status(500).json({ error: err.message });
  }
});

// ===== Catch-all: send Frontend/index.html for any other route =====
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../Frontend/index.html'));
});

// ===== Start Server =====
app.listen(PORT, () => {
  console.log(`\n🎉 AutoRent server running at http://localhost:${PORT}`);
  console.log(`📍 API health: http://localhost:${PORT}/api/health`);
  console.log('📁 Serving static files from ../Frontend');
});
