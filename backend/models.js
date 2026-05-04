const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  joined: { type: String, default: () => new Date().toLocaleDateString('en-LK', { day: 'numeric', month: 'short', year: 'numeric' }) }
}, { timestamps: true });

userSchema.pre('save', async function() {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 8);
  }
});

const bookingSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  courtId: { type: Number, required: true },
  date: { type: String, required: true },
  startH: { type: Number, required: true },
  dur: { type: Number, required: true },
  total: { type: Number, required: true },
  advance: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'pending' },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  notes: { type: String },
  code: { type: String, required: true },
  proof: { type: String },
  rescheduled: { type: Boolean, default: false },
  cancelledAt: { type: Date },
  canReschedule: { type: Boolean, default: true }
}, { timestamps: true });

const pricingSchema = new mongoose.Schema({
  sport: { type: String, required: true, unique: true }, // 'cricket', 'badminton'
  day: { type: Number, required: true },
  night: { type: Number, required: true }
});

const noticeSchema = new mongoose.Schema({
  text: { type: String, required: true },
  date: { type: String, required: true }
}, { timestamps: true });

const feedbackSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: { type: String, required: true },
  courtId: { type: Number, required: true },
  rating: { type: Number, required: true },
  text: { type: String, required: true },
  date: { type: String, required: true }
}, { timestamps: true });

const gallerySchema = new mongoose.Schema({
  icon: { type: String, required: true },
  name: { type: String, required: true }
});

module.exports = {
  User: mongoose.model('User', userSchema),
  Booking: mongoose.model('Booking', bookingSchema),
  Pricing: mongoose.model('Pricing', pricingSchema),
  Notice: mongoose.model('Notice', noticeSchema),
  Feedback: mongoose.model('Feedback', feedbackSchema),
  Gallery: mongoose.model('Gallery', gallerySchema)
};
