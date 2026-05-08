require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { User, Booking, Pricing, Notice, Feedback, Gallery } = require('./models');

const app = express();
const PORT = process.env.PORT || 5050;

app.use(cors());
app.use(express.json());

// Serve static assets from the root directory
app.use(express.static(path.join(__dirname, '..')));

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
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.status(201).send({ user, token });
  } catch (err) {
    res.status(400).send({ error: err.message });
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
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.send({ user, token });
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

app.post('/api/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send({ error: 'No account found with this email' });
    }
    console.log(`[PASS RECOVERY] Reset requested for: ${email}`);
    console.log(`[PASS RECOVERY] User: ${user.name} (@${user.username})`);
    console.log(`[PASS RECOVERY] Link: http://localhost:3001/reset-password?user=${user._id}`);
    res.send({ message: 'A recovery link has been sent to your email.' });
  } catch (err) {
    res.status(400).send({ error: 'Recovery failed' });
  }
});

// Bookings
app.get('/api/bookings', async (req, res) => {
  try {
    const bookings = await Booking.find({}).sort({ createdAt: -1 });
    res.send(bookings);
  } catch (err) {
    res.status(500).send({ error: 'Failed to fetch bookings' });
  }
});

app.post('/api/bookings', async (req, res) => {
  try {
    const booking = new Booking(req.body);
    await booking.save();
    res.status(201).send(booking);
  } catch (err) {
    res.status(400).send({ error: 'Failed to create booking' });
  }
});

app.put('/api/bookings/:id', async (req, res) => {
  try {
    const booking = await Booking.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
    if (!booking) {
      console.log(`Booking not found: ${req.params.id}`);
      return res.status(404).send({ error: 'Booking not found' });
    }
    console.log(`Booking updated: ${req.params.id}`);
    res.send(booking);
  } catch (err) {
    console.error(`Error updating booking: ${err.message}`);
    res.status(400).send({ error: 'Failed to update booking' });
  }
});

// Pricing
app.get('/api/pricing', async (req, res) => {
  try {
    const pricing = await Pricing.find({});
    res.send(pricing);
  } catch (err) {
    res.status(500).send({ error: 'Failed to fetch pricing' });
  }
});

app.put('/api/pricing/:sport', async (req, res) => {
  try {
    const pricing = await Pricing.findOneAndUpdate({ sport: req.params.sport }, req.body, { new: true });
    if (!pricing) {
      console.log(`Pricing sport not found: ${req.params.sport}`);
      return res.status(404).send({ error: 'Pricing not found' });
    }
    console.log(`Pricing updated for ${req.params.sport}`);
    res.send(pricing);
  } catch (err) {
    console.error(`Error updating pricing: ${err.message}`);
    res.status(400).send({ error: 'Failed to update pricing' });
  }
});

// Notices
app.get('/api/notices', async (req, res) => {
  try {
    const notices = await Notice.find({});
    res.send(notices);
  } catch (err) {
    res.status(500).send({ error: 'Failed to fetch notices' });
  }
});

app.post('/api/notices', async (req, res) => {
  try {
    const notice = new Notice(req.body);
    await notice.save();
    console.log(`New notice posted: ${notice._id}`);
    res.status(201).send(notice);
  } catch (err) {
    console.error(`Error posting notice: ${err.message}`);
    res.status(400).send({ error: 'Failed to create notice' });
  }
});

app.delete('/api/notices/:id', async (req, res) => {
  try {
    await Notice.findByIdAndDelete(req.params.id);
    res.send({ message: 'Notice deleted' });
  } catch (err) {
    res.status(400).send({ error: 'Failed to delete notice' });
  }
});

// Feedback
app.get('/api/feedback', async (req, res) => {
  try {
    const feedback = await Feedback.find({});
    res.send(feedback);
  } catch (err) {
    res.status(500).send({ error: 'Failed to fetch feedback' });
  }
});

app.post('/api/feedback', async (req, res) => {
  try {
    const feedback = new Feedback(req.body);
    await feedback.save();
    res.status(201).send(feedback);
  } catch (err) {
    res.status(400).send({ error: 'Failed to submit feedback' });
  }
});

// Gallery
app.get('/api/gallery', async (req, res) => {
  try {
    const gallery = await Gallery.find({});
    res.send(gallery);
  } catch (err) {
    res.status(500).send({ error: 'Failed to fetch gallery' });
  }
});

app.post('/api/gallery', async (req, res) => {
  try {
    const gallery = new Gallery(req.body);
    await gallery.save();
    res.status(201).send(gallery);
  } catch (err) {
    res.status(400).send({ error: 'Failed to add gallery item' });
  }
});

app.delete('/api/gallery/:id', async (req, res) => {
  try {
    await Gallery.findByIdAndDelete(req.params.id);
    res.send({ message: 'Gallery item deleted' });
  } catch (err) {
    res.status(400).send({ error: 'Failed to delete gallery item' });
  }
});

// Root: Serve frontend
app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, '..', 'frontend', 'index.html'));
});

app.put('/api/users/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select('-password');
    if (!user) {
      console.log(`User not found: ${req.params.id}`);
      return res.status(404).send({ error: 'User not found' });
    }
    console.log(`User profile updated: ${user.username}`);
    res.send(user);
  } catch (err) {
    console.error(`Error updating user: ${err.message}`);
    res.status(400).send({ error: 'Failed to update profile' });
  }
});

app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.send(users);
  } catch (err) {
    res.status(500).send({ error: 'Failed to fetch users' });
  }
});

app.delete('/api/users/:id', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.send({ message: 'User deleted' });
  } catch (err) {
    res.status(400).send({ error: 'Failed to delete user' });
  }
});

app.delete('/api/bookings/:id', async (req, res) => {
  try {
    await Booking.findOneAndDelete({ id: req.params.id });
    res.send({ message: 'Booking deleted' });
  } catch (err) {
    res.status(400).send({ error: 'Failed to delete booking' });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
  console.log(`📡 Local network access: http://${getIPAddress()}:${PORT}`);
});

function getIPAddress() {
  const interfaces = require('os').networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}
