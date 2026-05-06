# ✈️ PlanMyTrip - Next-Gen Travel Booking Platform

> **Modern, Professional, and Feature-Rich** travel planning application built with a focus on premium UI/UX, real-time logistics, and high-performance animations.

[![Version](https://img.shields.io/badge/version-3.0-blue.svg)](https://github.com/)
[![Status](https://img.shields.io/badge/status-production--ready-brightgreen.svg)](https://github.com/)
[![Tech Stack](https://img.shields.io/badge/stack-Node.js%20%7C%20Express%20%7C%20Tailwind%20%7C%20Anime.js-blueviolet.svg)](https://github.com/)
[![License](https://img.shields.io/badge/license-MIT-orange.svg)](https://github.com/)

---

## 🌟 Key Highlights

### 🚀 High-Performance Motion Design
Integrated **Anime.js** for a buttery-smooth user experience. The landing page features staggered entrance animations, scroll reveals, and high-fps transitions that make the platform feel alive.

### 🛡️ Secure Developer Console
A restricted administrative dashboard accessible only to authorized personnel (`shreyasroy2023@gmail.com`). It provides real-time insights into bookings, user metrics, and platform health.

### 🎥 Cinematic Hero Experience
A high-impact Hero section featuring **cinematic background videos**, sophisticated glassmorphism overlays, and vibrant typography gradients.

### 🎁 Referral & Rewards Engine
Built-in referral system where users can earn ₹750 discounts. Includes social sharing integration for WhatsApp, Instagram, and LinkedIn.

---

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3 (Custom Glassmorphism), JavaScript (ES6+ Modular)
- **Frameworks**: Tailwind CSS, Anime.js, Lucide Icons
- **Backend**: Node.js, Express.js
- **Auth**: Firebase Authentication & Custom Admin Middleware
- **Persistence**: LocalStorage & In-Memory Data store (Scalable to MongoDB)

---

## 📂 Project Structure

The project follows a **clean, modular architecture** designed for scalability:

```text
PlanMyTrip/
├── 📁 backend/                ← Core server logic & middleware
├── 📁 frontend/               ← Service modules (Flights, Hotels, etc.)
├── 📁 css/                    ← Design system & premium styles
├── 📁 js/                     ← Modular JS controllers (Auth, Trip, etc.)
├── 📁 docs/                   ← Detailed documentation & guides
├── 📁 scripts/                ← Utility & migration scripts
├── 📄 index.html              ← Cinematic Landing Page
├── 📄 login.html              ← Secure Auth Gateway
├── 📄 server.js               ← Production-ready Express Server
└── 📄 package.json            ← Dependencies & scripts
```

---

## 🚀 Quick Start

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v14.x or higher)
- [NPM](https://www.npmjs.com/)

### 2. Setup
```bash
# Clone the repository
git clone https://github.com/your-repo/PlanMyTrip.git
cd PlanMyTrip

# Install dependencies
npm install
```

### 3. Launch
```bash
# Start the backend server
npm run dev

# Open index.html in your browser or use a live server
npx http-server ./
```

---

## 🔒 Administrative Access

The **Developer Console** (`frontend/dashboard.html`) is strictly restricted.
- **Authorized Admin**: `shreyasroy2023@gmail.com`
- **Security**: Protected by both Frontend redirect logic and Backend `adminAuth` middleware.

---

## 📈 Roadmap

- [x] Modernize Home Page with Anime.js
- [x] Secure Admin Dashboard
- [x] Background Video Integration
- [ ] MongoDB Data Persistence Integration
- [ ] Real-time Chat Support with Socket.io
- [ ] PWA (Progressive Web App) Support

---

## 🎓 Academic Context
This project was developed for the **3rd Semester College Project** as a demonstration of:
- Full-stack development patterns
- Advanced CSS techniques (Glassmorphism, Flex/Grid)
- Security middleware implementation
- High-performance web animations

---

## 📝 License
Distributed under the MIT License. See `LICENSE` for more information.

---

**Developed with ❤️ by Shreyas R.**
