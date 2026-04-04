# 🚀 PlanMyTrip - Quick Start Guide

## ⚡ 5-Minute Setup

### Prerequisites Check
✅ Windows, Mac, or Linux  
✅ Node.js (download: https://nodejs.org/)  
✅ Modern web browser  
✅ Internet connection  

---

## 🎯 Step-by-Step Installation

### **Step 1: Open Terminal/Command Prompt**

**Windows:**
- Press `Win + R`
- Type `cmd` and press Enter

**Mac/Linux:**
- Press `Cmd + Space`
- Type `terminal` and press Enter

### **Step 2: Navigate to Project Folder**

```bash
cd "c:\Users\shrey\OneDrive\Desktop\project\college project for 3rd sem"
```

Or on Mac/Linux:
```bash
cd ~/Desktop/"college\ project\ for\ 3rd\ sem"
```

### **Step 3: Install Dependencies**

Run one of these:

**Automatic (Recommended):**
- Windows: Double-click `setup.bat`
- Mac/Linux: Run `bash setup.sh`

**Manual:**
```bash
npm install
```

You'll see packages being downloaded. Wait for it to complete.

### **Step 4: Start Backend Server**

```bash
npm start
```

You should see:
```
✅ PlanMyTrip Backend Server running on http://localhost:5000
📚 API Base URL: http://localhost:5000/api
```

**✅ Leave this terminal open!**

### **Step 5: Open Frontend (New Terminal)**

**Windows:** 
```bash
cd "c:\Users\shrey\OneDrive\Desktop\project\college project for 3rd sem"
python -m http.server 8000
```

**Mac/Linux:**
```bash
cd ~/Desktop/"college\ project\ for\ 3rd\ sem"
python3 -m http.server 8000
```

You'll see:
```
Serving HTTP on 0.0.0.0 port 8000
```

### **Step 6: Open in Browser**

Click here or type in address bar:  
**http://localhost:8000**

---

## 🎮 Testing the App

### **Test Registration**
- Phone: `9876543210` (any 10 digits)
- Email: `user@example.com`
- Password: `test123`

### **Test Destinations**
- Click on "Destinations" in navbar
- Browse and filter destinations
- Select any destination

### **Test Referral Code**
- Go to checkout
- Enter code: `TRIPWISE101` or `PLANMYTRIP-SHREYAS`
- Get ₹750 discount!

### **Test Social Sharing**
- At checkout, click social media buttons
- Share to Facebook, Twitter, WhatsApp, LinkedIn
- View referral program page

---

## 📱 Features to Try

### 🏠 Home Page
- Image carousel with destinations
- Testimonials scrolling carousel
- Login/Registration system
- Beautiful animations

### 🗺️ Destinations Page
- Browse 8+ curated destinations
- Filter by category (beaches, mountains, etc.)
- Search functionality
- Detailed destination info

### 💰 Trip Planning
- Select multiple destinations
- Customize travelers count
- Adjust trip duration
- Real-time price calculation with referral discount

### 💳 Checkout
- Multiple payment methods (Card, NetBanking, UPI)
- Real-time logistics tracking
- Social media sharing
- Payment confirmation

### 🎁 Referral Program
- Copy referral code
- Share on 5 social platforms
- View top referrers leaderboard
- Track earned discounts

---

## 🐛 Troubleshooting

### ❌ "npm: command not found"
**Solution:**
1. Download Node.js: https://nodejs.org/
2. Install it (default settings)
3. Restart terminal
4. Try `npm --version`

### ❌ "Port 5000 already in use"
**Solution:**
```bash
# Kill existing process
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :5000
kill -9 <PID>
```

### ❌ "Cannot find module 'express'"
**Solution:**
```bash
npm install
```

### ❌ Frontend shows blank page
**Solution:**
1. Check browser console (F12)
2. Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
3. Clear browser cache
4. Check http://localhost:8000 is correct

### ❌ Backend shows 404 error
**Solution:**
1. Ensure backend is running on port 5000
2. Check API URL in `api-utils.js`
3. Verify endpoint path is correct

---

## 🔄 Development Tips

### Useful Commands

**Start with auto-reload (development):**
```bash
npm run dev
```

**Check node version:**
```bash
node --version
```

**Check npm version:**
```bash
npm --version
```

**Clear node modules and reinstall:**
```bash
rm -rf node_modules package-lock.json
npm install
```

---

## 📂 Project Structure Quick Reference

```
project/
├── index.html          ← Main application
├── destination.html    ← Destinations page
├── server.js          ← Backend (5000)
├── api-utils.js       ← API connections
├── package.json       ← Dependencies
├── README.md          ← Full documentation
├── frontend/
│   └── referral.html  ← Referral page
└── backend/
    └── sdk.js         ← Firebase config
```

---

## 🚀 What's New & Improved

✨ **Beautiful UI/UX**
- Modern gradient designs
- Smooth animations
- Responsive layout for all devices

🔌 **Backend API**
- Express.js server on port 5000
- Complete REST API
- Data persistence

📱 **Responsive Design**
- Works on mobile, tablet, desktop
- Touch-friendly interface
- Optimized performance

🎁 **Referral System**
- Share on social media
- Track earnings
- Leaderboard system

📊 **Real-time Features**
- Live booking status
- Logistics tracking
- Instant price calculations

🔐 **Security**
- Firebase Authentication
- Input validation
- CORS protection

---

## 💡 Next Steps (Optional)

### Customize for Your Needs

**1. Change Pricing:**
- Edit `index.html`
- Find `const PRICING = {`
- Update values

**2. Add More Destinations:**
- Edit `index.html`
- Find `const DESTINATIONS = [`
- Add new destinations

**3. Modify Colors/Theme:**
- Edit Tailwind CSS classes
- Change from blue to your preferred color
- Update gradients

**4. Deploy to Production:**
- Backend: Heroku, Render
- Frontend: Vercel, Netlify
- See README.md for details

---

## 📞 Need Help?

1. Check browser console (F12 → Console tab)
2. Read README.md for complete documentation
3. Verify all commands are typed correctly
4. Try restarting both terminals
5. Clear browser cache and cookies

---

## 🎉 Ready to Go!

Your PlanMyTrip application is now:
- ✅ Beautiful & modern
- ✅ Fully responsive
- ✅ Socially integrated
- ✅ Backend connected
- ✅ Ready for production

**Start planning amazing trips! 🌍✈️**

---

## 📊 API Status Dashboard

Once running, check:
- Backend health: http://localhost:5000/api/health
- Frontend: http://localhost:8000

---

**Questions?** → Check README.md or browser console for error messages!
