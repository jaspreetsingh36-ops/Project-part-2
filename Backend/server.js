require("dotenv").config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 3000;

// ===== Environment Variables =====
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://autorent-user:Autorent2025@cluster0.avlirvg.mongodb.net/autorent?retryWrites=true&w=majority';
const JWT_SECRET = process.env.JWT_SECRET || 'autorent-secret-key-2025';

// ===== Middleware =====
app.use(cors());
app.use(express.json());

// ⭐ FIXED: Serve Frontend from correct path
app.use(express.static(path.join(__dirname, 'Frontend')));

// ===== MongoDB Connection =====
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
    console.log('🔄 Using in-memory storage as fallback');
    // Don't exit - use in-memory storage instead
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
    password: { type: String, required: true },
  },
  { timestamps: true }
);

const Car = mongoose.model('Car', carSchema);
const User = mongoose.model('User', userSchema);

// ===== In-memory storage for fallback =====
let usersMemory = [];
let carsMemory = [];

// ===== Connection Check =====
const isMongoConnected = () => mongoose.connection.readyState === 1;

// ===== Auth Middleware =====
const authMiddleware = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization header missing or invalid' });
  }

  const token = header.replace('Bearer ', '').trim();

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

// ===== API ROUTES =====

// Health check
app.get('/api/health', async (req, res) => {
  const state = mongoose.connection.readyState;
  res.json({
    status: 'OK',
    server: 'AutoRent API is running',
    database: state === 1 ? 'MongoDB (connected)' : 'In-Memory Storage',
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

    if (isMongoConnected()) {
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
    } else {
      // In-memory user storage
      const existing = usersMemory.find(u => u.email === email);
      if (existing) {
        return res.status(400).json({ message: 'User already exists' });
      }

      const hashed = await bcrypt.hash(password, 10);
      const user = { id: Date.now().toString(), email, password: hashed };
      usersMemory.push(user);

      const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

      return res.status(201).json({
        message: 'User created successfully (in-memory)',
        token,
        user: { id: user.id, email: user.email },
      });
    }
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

    if (isMongoConnected()) {
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
    } else {
      // In-memory login
      const user = usersMemory.find(u => u.email === email);
      if (!user) {
        return res.status(400).json({ message: 'Invalid email or password' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid email or password' });
      }

      const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

      return res.json({
        message: 'Login successful (in-memory)',
        token,
        user: { id: user.id, email: user.email },
      });
    }
  } catch (err) {
    console.error('❌ Error in /api/auth/login:', err);
    return res.status(500).json({ message: 'Error logging in', error: err.message });
  }
});

// ---- Car Routes ----

// Get all cars
app.get('/api/cars', async (req, res) => {
  try {
    if (isMongoConnected()) {
      const cars = await Car.find().sort({ createdAt: -1 });
      return res.json(cars);
    } else {
      return res.json(carsMemory);
    }
  } catch (err) {
    console.error('❌ Error fetching cars:', err);
    return res.status(500).json({ error: 'Error fetching cars' });
  }
});

// Get only available cars
app.get('/api/cars/available', async (req, res) => {
  try {
    if (isMongoConnected()) {
      const cars = await Car.find({ status: 'Available' }).sort({ createdAt: -1 });
      return res.json(cars);
    } else {
      const availableCars = carsMemory.filter(car => car.status === 'Available');
      return res.json(availableCars);
    }
  } catch (err) {
    console.error('❌ Error fetching available cars:', err);
    return res.status(500).json({ error: 'Error fetching available cars' });
  }
});

// Get a single car by ID
app.get('/api/cars/:id', async (req, res) => {
  try {
    if (isMongoConnected()) {
      const car = await Car.findById(req.params.id);
      if (!car) return res.status(404).json({ error: 'Car not found' });
      return res.json(car);
    } else {
      const car = carsMemory.find(c => c.id === req.params.id);
      if (!car) return res.status(404).json({ error: 'Car not found' });
      return res.json(car);
    }
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

    if (isMongoConnected()) {
      const car = new Car({ model, type, year, dailyRate, status, description });
      const saved = await car.save();
      return res.status(201).json(saved);
    } else {
      const car = {
        id: Date.now().toString(),
        model, type, year, dailyRate, status, description,
        createdAt: new Date()
      };
      carsMemory.push(car);
      return res.status(201).json(car);
    }
  } catch (err) {
    console.error('❌ Error creating car:', err);
    return res.status(400).json({ error: err.message });
  }
});

// Update car (protected)
app.put('/api/cars/:id', authMiddleware, async (req, res) => {
  try {
    if (isMongoConnected()) {
      const updated = await Car.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });
      if (!updated) return res.status(404).json({ error: 'Car not found' });
      return res.json(updated);
    } else {
      const carIndex = carsMemory.findIndex(c => c.id === req.params.id);
      if (carIndex === -1) return res.status(404).json({ error: 'Car not found' });
      carsMemory[carIndex] = { ...carsMemory[carIndex], ...req.body };
      return res.json(carsMemory[carIndex]);
    }
  } catch (err) {
    console.error('❌ Error updating car:', err);
    return res.status(400).json({ error: err.message });
  }
});

// Delete car (protected)
app.delete('/api/cars/:id', authMiddleware, async (req, res) => {
  try {
    if (isMongoConnected()) {
      const deleted = await Car.findByIdAndDelete(req.params.id);
      if (!deleted) return res.status(404).json({ error: 'Car not found' });
      return res.json({ message: 'Car deleted successfully' });
    } else {
      const carIndex = carsMemory.findIndex(c => c.id === req.params.id);
      if (carIndex === -1) return res.status(404).json({ error: 'Car not found' });
      carsMemory.splice(carIndex, 1);
      return res.json({ message: 'Car deleted successfully' });
    }
  } catch (err) {
    console.error('❌ Error deleting car:', err);
    return res.status(500).json({ error: err.message });
  }
});

// ===== Catch-all: send Frontend/index.html for any other route =====
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'Frontend', 'index.html'));
});

// ===== Start Server =====
app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n🎉 AutoRent server running on port ${PORT}`);
  console.log(`📍 API health: http://localhost:${PORT}/api/health`);
  console.log(`💾 Database: ${isMongoConnected() ? 'MongoDB ✅' : 'In-Memory Storage ⚠️'}`);
  console.log('📁 Serving static files from ./Frontend');
});
