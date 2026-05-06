# Malabar Indoor Park — Complete System

Sri Lanka's premier indoor sports facility with online booking system. **4 courts for cricket, football & badminton.**

**Live Site**: https://malabar-indoor.vercel.app

---

## 🚀 Quick Start

### **1. Install Dependencies**
```bash
npm install
```

### **2. Configure Environment**
Create `.env` file:
```env
MONGODB_URI=mongodb://localhost:27017/malabar-indoor
JWT_SECRET=your-secret-key
PORT=5000
NODE_ENV=development
```

### **3. Start Backend**
```bash
npm run dev
```

Output:
```
✅ Connected to MongoDB
✅ Admin user created (admin/adminpassword)
✅ Initial pricing seeded
🚀 Server running on http://localhost:5000
```

### **4. Open Frontend**
```
http://localhost:5000
```

---

## 📋 API Documentation

### **Authentication Endpoints**

#### Register User
```bash
POST /api/register
{
  "name": "John Doe",
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "0761234567"
}
```

#### Login User
```bash
POST /api/login
{
  "username": "admin",
  "password": "adminpassword"
}
```

Response:
```json
{
  "user": { "_id": "...", "name": "Admin", "email": "admin@..." },
  "token": "eyJhbGc..."
}
```

### **Booking Endpoints**

#### Get Available Slots
```bash
GET /api/availability?date=2026-05-06&court=0
```

#### Create Booking (Protected)
```bash
POST /api/bookings
Headers: Authorization: Bearer <token>
{
  "court": 0,
  "date": "2026-05-06",
  "startTime": "10",
  "endTime": "11",
  "name": "Your Name",
  "phone": "0761234567",
  "totalAmount": 5000
}
```

#### Get User Bookings (Protected)
```bash
GET /api/bookings
Headers: Authorization: Bearer <token>
```

### **Pricing Endpoints**

#### Get All Pricing
```bash
GET /api/pricing
```

Response:
```json
[
  {
    "sport": "cricket",
    "day": 5000,
    "night": 6000
  },
  {
    "sport": "badminton",
    "day": 3000,
    "night": 4000
  }
]
```

---

## 🔐 Default Test Account

**Username**: `admin`  
**Password**: `adminpassword`  
**Email**: `admin@malabar.com`

---

## 🗂️ Project Structure

```
Malabar-Indoor/
├── backend/
│   ├── server.js          # Main server file
│   ├── models/            # Database schemas
│   ├── routes/            # API endpoints
│   └── middleware/        # Auth & validation
├── frontend/
│   ├── index.html         # Main HTML
│   ├── app.js             # JavaScript (API integration)
│   └── style.css          # (Built-in CSS)
├── .env                   # Environment config
├── package.json           # Dependencies
└── DEBUG_GUIDE.md         # Troubleshooting guide
```

---

## ✨ Features

✅ **User Authentication**  
- Register/Login with JWT
- Password hashing with bcryptjs
- Auto-logout on token expiry

✅ **Court Booking**
- Select date & court
- Choose hourly time slots
- Real-time availability
- Payment integration ready

✅ **Pricing Management**
- Day & night rates
- Per-sport pricing
- Admin edit capabilities

✅ **User Dashboard**
- View all bookings
- Cancel/reschedule
- Payment tracking

✅ **Responsive Design**
- Mobile-friendly UI
- Dark mode support
- Smooth animations

---

## 🧪 Test API

### **Test Login**
```bash
curl -X POST http://localhost:5000/api/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"adminpassword"}'
```

### **Test Pricing**
```bash
curl http://localhost:5000/api/pricing
```

### **Test Registration**
```bash
curl -X POST http://localhost:5000/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "name":"Test User",
    "username":"testuser",
    "email":"test@example.com",
    "password":"password123",
    "phone":"0761234567"
  }'
```

---

## 📱 Frontend Features

- **Modern UI** with glassmorphism design
- **Dark Mode** toggle
- **Toast Notifications** for feedback
- **Modal Forms** for auth
- **Real-time** availability checking
- **Responsive Layout** for all devices

---

## 🔧 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/malabar-indoor` |
| `JWT_SECRET` | JWT signing secret | `your-secret-key` |
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment | `development` |

---

## 🚨 Troubleshooting

**"MONGODB_URI is not defined"**
→ Create `.env` file with correct variables

**"Cannot connect to MongoDB"**
→ Start MongoDB or use MongoDB Atlas

**"Login not working"**
→ Clear browser storage: `localStorage.clear()`

**"API 404 errors"**
→ Ensure backend is running on http://localhost:5000

See **DEBUG_GUIDE.md** for complete troubleshooting.

---

## 📧 Contact

**Phone**: +94 076 622 0718  
**Email**: afathihas03@gmail.com  
**WhatsApp**: https://wa.me/940766220718

---

**© 2026 Malabar Indoor Park. All rights reserved.**  
Built with passion by Afathi Hasan
