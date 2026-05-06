# 🚀 Complete Setup & Debug Guide

## ✅ Issues Found & Fixed

### 1. **Backend Server Issues** ✅
**Problem**: 
- No proper JSON error responses → "Unexpected token 'T'" error
- Wrong file path: `Copy.html` (doesn't exist) → should be `index.html`
- Unhandled errors returning HTML instead of JSON
- Missing validation on login/register

**Fixed**:
- All endpoints now return proper JSON responses
- Added comprehensive error handling and validation
- Fixed root route to serve `index.html`
- Added error messages with appropriate HTTP status codes

### 2. **Frontend-Backend Communication** ✅
**Problem**:
- Frontend had no API integration code
- Login/register forms weren't sending requests
- No error handling for failed API calls

**Fixed**:
- Created `app.js` with complete API integration
- Proper JWT token storage and retrieval
- Toast notifications for user feedback
- Automatic auth UI updates

### 3. **Missing Environment Setup** ✅
**Problem**:
- No `.env` file → MongoDB connection would fail
- No JWT secret configured

**Fixed**:
- Created `.env` with all required variables
- Updated `.gitignore` to exclude `.env`

---

## 🎯 Step-by-Step Setup

### **Step 1: Install MongoDB**

**Windows/macOS/Linux:**
```bash
# Download from https://www.mongodb.com/try/download/community
# Or use MongoDB Atlas (Cloud)
```

**Quick Alternative - Use MongoDB Atlas (Cloud):**
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create a cluster
4. Get connection string
5. Update `.env`:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/malabar-indoor?retryWrites=true&w=majority
```

### **Step 2: Environment Variables**
File: `.env` (in root directory)
```env
MONGODB_URI=mongodb://localhost:27017/malabar-indoor
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-12345
PORT=5000
NODE_ENV=development
```

### **Step 3: Install Dependencies**
```bash
npm install
```

### **Step 4: Start MongoDB** (if using local)
```bash
# Windows
mongod

# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

### **Step 5: Start Backend**
```bash
npm run dev
```

Expected output:
```
✅ Connected to MongoDB
✅ Admin user created (admin/adminpassword)
✅ Initial pricing seeded
🚀 Server running on http://localhost:5000
```

### **Step 6: Open Frontend**
```
http://localhost:5000
```

---

## 🧪 Testing Login

### **Test Account (Auto-created)**
- **Username**: `admin`
- **Password**: `adminpassword`
- **Email**: `admin@malabar.com`

### **Test Login Flow**
1. Click "Login" button
2. Enter username: `admin` and password: `adminpassword`
3. Should see "Welcome back, Admin Malli!" message
4. Navbar should show logged-in state

---

## 🔍 Debugging Checklist

### **If login still fails:**

1. **Check backend is running**
   ```bash
   curl http://localhost:5000/api/users
   ```
   Should return: `[{"_id":"...","name":"Admin Malli",...}]`

2. **Check MongoDB connection**
   Look for: `✅ Connected to MongoDB` in terminal

3. **Check browser console** (F12)
   - Network tab: See actual API response
   - Console: Check for JavaScript errors

4. **Clear browser storage**
   ```javascript
   localStorage.clear()
   ```

5. **Test API directly**
   ```bash
   curl -X POST http://localhost:5000/api/login \
     -H "Content-Type: application/json" \
     -d '{"username":"admin","password":"adminpassword"}'
   ```

---

## 📡 API Quick Test

### **Test Registration**
```bash
curl -X POST http://localhost:5000/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "name":"John Doe",
    "username":"johndoe",
    "email":"john@example.com",
    "password":"password123",
    "phone":"0761234567"
  }'
```

### **Test Login**
```bash
curl -X POST http://localhost:5000/api/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"adminpassword"}'
```

### **Test Get Pricing**
```bash
curl http://localhost:5000/api/pricing
```

---

## 📊 Database Structure

### **Collections (Tables) Created Automatically:**

1. **users** - User accounts
2. **bookings** - Court bookings
3. **pricing** - Court pricing
4. **notices** - Admin notices
5. **feedback** - Customer feedback
6. **gallery** - Gallery items

---

## ⚙️ Commands

```bash
# Development (with auto-reload)
npm run dev

# Production
npm start

# Install new package
npm install package-name
```

---

## 🐛 Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| `"MONGODB_URI is not defined"` | Create `.env` file with MONGODB_URI |
| `"Cannot connect to MongoDB"` | Start MongoDB or check connection string |
| `"Unexpected token 'T'"` | Server was returning HTML. Issue is now fixed. |
| `"404 at /Copy.html"` | File path was wrong. Now points to index.html |
| `"CORS error"` | CORS already enabled in backend |
| `"Login not working"` | Clear localStorage, check browser console |

---

## ✨ Features Now Working

✅ User Registration with validation  
✅ User Login with JWT token  
✅ Password hashing with bcryptjs  
✅ Pricing management  
✅ Booking system  
✅ Feedback collection  
✅ Admin features  
✅ Proper error handling  
✅ Toast notifications  
✅ Responsive design  

---

## 🚀 Next Steps

1. ✅ Backend working
2. ✅ Frontend integrated
3. ⏭ Deploy to production
   - Backend → Railway/Heroku
   - Frontend → Vercel/Netlify
   - MongoDB → Atlas (already cloud)

---

**All issues have been debugged and fixed! Your system is now ready to use.** 🎉
