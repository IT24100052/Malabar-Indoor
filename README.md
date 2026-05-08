# 🏟️ Malabar Indoor Park Management System

A premium, full-stack management platform for Malabar Indoor Park, designed to handle multi-sport court bookings (Cricket, Football, Badminton), user profiles, and administrative oversight.

## 🚀 Features

### For Users
- **Dynamic Booking**: Real-time slot availability for 4 different courts.
- **Auto-Cancellation**: Intelligent 15-minute window for advance payment verification.
- **Smart Rescheduling**: Policy-driven rescheduling for cancellations made with more than 12 hours notice.
- **Interactive Dashboard**: Personal booking history, activity stats, and profile management.
- **Mobile Responsive**: Fully optimized for smartphones and tablets.

### For Administrators
- **Comprehensive Overview**: Revenue charts, most booked time slots, and registration stats.
- **Booking Management**: Approve, cancel, or delete bookings with a single click.
- **Dynamic Pricing**: Update day/night rates for all sports in real-time.
- **Notice System**: Broadcast important park announcements via the global banner.
- **User Control**: Manage registered members and view their activity history.

## 🛠️ Tech Stack
- **Frontend**: HTML5, Vanilla CSS3 (Custom Design System), JavaScript (ES6+).
- **Backend**: Node.js, Express.js, JWT Authentication.
- **Database**: MongoDB (Mongoose).
- **Icons & UI**: Remix Icons, Google Fonts (Outfit & Inter).

## 📦 Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/IT24100052/Malabar-Indoor.git
cd Malabar-Indoor
```

### 2. Configure Environment
Create a `.env` file in the root directory:
```env
PORT=5050
MONGODB_URI=mongodb://localhost:27017/malabar-indoor
JWT_SECRET=your_super_secret_key
```

### 3. Install Dependencies
```bash
# Root (Backend)
npm install

# Frontend
cd frontend
npm install
```

### 4. Run the Application
You can run both the frontend and backend simultaneously using the combined dev command from the root:
```bash
npm run dev
```
- **Frontend**: `http://localhost:3001`
- **Backend API**: `http://localhost:5050`

## 🔑 Admin Credentials
By default, the system seeds an admin account on the first run:
- **Username**: `admin`
- **Password**: `adminpassword`

---
Built with ❤️ for Malabar Indoor Park.
