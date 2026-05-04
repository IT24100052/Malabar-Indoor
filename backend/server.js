require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { User, Booking, Pricing, Notice, Feedback, Gallery } = require('./models');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Serve static assets from the frontend directory
app.use(express.static(path.join(__dirname, '../frontend')));

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('✅ Connected to MongoDB');
    await seedDatabase();
  })
  .catch(err => {
    console.error('❌ MongoDB Connection Error:');
    console.error(err.message || err);
  });

async function seedDatabase() {
  const userCount = await User.countDocuments();
  if (userCount === 0) {
    const adminUser = new User({
      name: 'Admin Malli',
      username: 'admin',
      email: 'admin@malabar.com',
      password: 'adminpassword',
      role: 'admin'
    });
    await adminUser.save();
    console.log('✅ Admin user created (admin/adminpassword)');
  }

  const pricingCount = await Pricing.countDocuments();
  if (pricingCount === 0) {
    await Pricing.insertMany([
      { sport: 'cricket', day: 1200, night: 1500 },
      { sport: 'badminton', day: 800, night: 1000 }
    ]);
    console.log('✅ Initial pricing seeded');
  }
}

// Auth Routes
app.post('/api/register', async (req, res) => {
  try {
    const { name, username, email, password, phone } = req.body;
    const user = new User({ name, username, email, password, phone });
    await user.save();
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.status(201).send({ user, token });
  } catch (err) {
    res.status(400).send(err);
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const loginValue = (username || '').trim();
    const user = await User.findOne({
      $or: [{ username: loginValue }, { email: loginValue }]
    });
    if (!user || !await bcrypt.compare(password, user.password)) {
      return res.status(401).send({ error: 'Invalid login credentials' });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.send({ user, token });
  } catch (err) {
    res.status(400).send(err);
  }
});

// Bookings
app.get('/api/bookings', async (req, res) => {
  try {
    const bookings = await Booking.find({}).sort({ createdAt: -1 });
    res.send(bookings);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.post('/api/bookings', async (req, res) => {
  try {
    const booking = new Booking(req.body);
    await booking.save();
    res.status(201).send(booking);
  } catch (err) {
    res.status(400).send(err);
  }
});

app.put('/api/bookings/:id', async (req, res) => {
  try {
    const booking = await Booking.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
    res.send(booking);
  } catch (err) {
    res.status(400).send(err);
  }
});

// Pricing
app.get('/api/pricing', async (req, res) => {
  try {
    const pricing = await Pricing.find({});
    res.send(pricing);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.put('/api/pricing/:sport', async (req, res) => {
  try {
    const pricing = await Pricing.findOneAndUpdate({ sport: req.params.sport }, req.body, { new: true });
    res.send(pricing);
  } catch (err) {
    res.status(400).send(err);
  }
});

// Notices
app.get('/api/notices', async (req, res) => {
  try {
    const notices = await Notice.find({});
    res.send(notices);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.post('/api/notices', async (req, res) => {
  try {
    const notice = new Notice(req.body);
    await notice.save();
    res.status(201).send(notice);
  } catch (err) {
    res.status(400).send(err);
  }
});

app.delete('/api/notices/:id', async (req, res) => {
  try {
    await Notice.findByIdAndDelete(req.params.id);
    res.send({ message: 'Notice deleted' });
  } catch (err) {
    res.status(400).send(err);
  }
});

// Feedback
app.get('/api/feedback', async (req, res) => {
  try {
    const feedback = await Feedback.find({});
    res.send(feedback);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.post('/api/feedback', async (req, res) => {
  try {
    const feedback = new Feedback(req.body);
    await feedback.save();
    res.status(201).send(feedback);
  } catch (err) {
    res.status(400).send(err);
  }
});

// Gallery
app.get('/api/gallery', async (req, res) => {
  try {
    const gallery = await Gallery.find({});
    res.send(gallery);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.post('/api/gallery', async (req, res) => {
  try {
    const gallery = new Gallery(req.body);
    await gallery.save();
    res.status(201).send(gallery);
  } catch (err) {
    res.status(400).send(err);
  }
});

app.delete('/api/gallery/:id', async (req, res) => {
  try {
    await Gallery.findByIdAndDelete(req.params.id);
    res.send({ message: 'Gallery item deleted' });
  } catch (err) {
    res.status(400).send(err);
  }
});

// Root: Serve frontend
app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, '..', 'frontend', 'Copy.html'));
});

app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.send(users);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
