# 🛠️ Malabar Indoor Park - Debugging & Troubleshooting Guide

Use this guide to resolve common issues encountered during development and deployment of the Malabar Indoor Park management system.

## 🚩 Common Issues & Solutions

### 1. "Failed to Fetch" Error
**Symptoms**: The frontend loads but actions like login, signup, or booking show a "Failed to fetch" error.
**Cause**: The frontend cannot connect to the backend API.
**Solutions**:
- **Check Backend**: Ensure the backend is running (`npm run backend`). You should see `🚀 Server running on http://localhost:5050`.
- **CORS Configuration**: Ensure `app.use(cors())` is present in `server.js`.
- **IP Mismatch**: If accessing the site via a local IP (e.g., `192.168.x.x`), the browser may block requests to `localhost`. The system now uses dynamic host detection, but ensure the port `5050` is open.

### 2. Port Conflicts (EADDRINUSE)
**Symptoms**: The terminal shows `Error: listen EADDRINUSE: address already in use :::5050`.
**Cause**: Another process is already using the port.
**Solutions**:
- **Change Port**: Update the `PORT` in your `.env` file to a different number (e.g., `5051`).
- **Kill Process**: Use `npx kill-port 5050` to force stop the previous process.

### 3. MongoDB Connection Issues
**Symptoms**: Terminal shows `❌ MongoDB Connection Error`.
**Cause**: The MongoDB service is not running or the URI is incorrect.
**Solutions**:
- **Start Service**: Ensure MongoDB Compass or the MongoDB Community Server is active.
- **Check URI**: Verify `MONGODB_URI` in `.env` matches your local setup (usually `mongodb://127.0.0.1:27017/malabar-indoor`).

### 4. Database Schema Mismatch
**Symptoms**: Errors when rendering the dashboard or blank fields in tables.
**Cause**: Old data in the database doesn't match the new 1-based court indexing or missing fields like `endH`.
**Solutions**:
- **Clear Data**: In MongoDB Compass, delete the `bookings` collection to let the system start fresh.
- **Seeding**: The system automatically seeds an admin user if none exists.

## 🛡️ Security Notes
- **JWT**: Ensure `JWT_SECRET` in `.env` is long and unique.
- **Passwords**: The system uses `bcryptjs` for hashing; never store raw passwords.
- **Environment**: Always include `.env` in `.gitignore` to prevent leaking credentials.

## 📈 Performance Monitoring
- Use the **Admin Overview** tab to monitor real-time booking statistics.
- If charts aren't updating, ensure bookings are set to `confirmed` status in the database.
