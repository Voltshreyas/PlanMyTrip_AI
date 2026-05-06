// PlanMyTrip Backend Server - Node.js with Express
require('dotenv').config();
/**
 * =============================================================================
 * PROJECT: PlanMyTrip - Next-Gen Travel Booking Platform
 * VERSION: 3.0.0
 * AUTHOR:  Shreyas R.
 * MODULE:  Backend Server (Express.js)
 * DESCRIPTION: RESTful API server with security middleware, admin 
 *              authorization, and data persistence logic.
 * =============================================================================
 */

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const https = require('https');
const nodemailer = require('nodemailer');

const app = express();
const PORT = Number(process.env.PORT) || 5000;
const DATA_DIR = path.join(__dirname, 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const REFERRALS_FILE = path.join(DATA_DIR, 'referrals.json');
const BOOKINGS_FILE = path.join(DATA_DIR, 'bookings.json');
const ENQUIRIES_FILE = path.join(DATA_DIR, 'enquiries.json');
let enquiries = []; 

function loadEnquiries() {
    if (fs.existsSync(ENQUIRIES_FILE)) {
        try {
            enquiries = JSON.parse(fs.readFileSync(ENQUIRIES_FILE, 'utf8'));
        } catch (e) { enquiries = []; }
    }
}

function saveEnquiries() {
    try {
        fs.writeFileSync(ENQUIRIES_FILE, JSON.stringify(enquiries, null, 2));
    } catch (e) { console.error('Failed to save enquiries'); }
}

loadEnquiries();// New store for enquiries

// Middleware Configuration
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(express.static(path.join(__dirname)));

// In-memory storage (for demo purposes)
const users = new Map();
const bookings = new Map();
const referrals = new Map();
const otps = new Map(); // Store OTPs temporarily
let tripCounter = 1;

function getEmailTransport() {
    const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD } = process.env;
    if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASSWORD) {
        return null;
    }

    return nodemailer.createTransport({
        host: SMTP_HOST,
        port: Number(SMTP_PORT),
        secure: Number(SMTP_PORT) === 465,
        auth: {
            user: SMTP_USER,
            pass: SMTP_PASSWORD
        }
    });
}

function allowDevOtpFallback() {
    return process.env.NODE_ENV !== 'production' && process.env.ALLOW_DEV_OTP_FALLBACK !== 'false';
}

function normalizeSmsPhone(phone) {
    const digits = String(phone || '').replace(/\D/g, '');
    if (!digits) return '';
    if (digits.length === 10) {
        return `${process.env.DEFAULT_SMS_COUNTRY_CODE || '+91'}${digits}`;
    }
    return digits.startsWith('+') ? digits : `+${digits}`;
}

async function sendEmailOtp(email, otp) {
    const transport = getEmailTransport();
    if (!transport) {
        return { sent: false, channel: 'email', reason: 'SMTP is not configured' };
    }

    await transport.sendMail({
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to: email,
        subject: 'Your PlanMyTrip OTP',
        text: `Your PlanMyTrip verification code is ${otp}. It expires in 5 minutes.`,
        html: `<p>Your PlanMyTrip verification code is <strong>${otp}</strong>.</p><p>This code expires in 5 minutes.</p>`
    });

    return { sent: true, channel: 'email' };
}

function sendTwilioSmsOtp(phone, otp) {
    const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM_NUMBER } = process.env;
    if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_FROM_NUMBER || !phone) {
        return Promise.resolve({ sent: false, channel: 'sms', reason: 'SMS is not configured' });
    }

    const to = normalizeSmsPhone(phone);
    const postData = new URLSearchParams({
        To: to,
        From: TWILIO_FROM_NUMBER,
        Body: `Your PlanMyTrip OTP is ${otp}. It expires in 5 minutes.`
    }).toString();

    const auth = Buffer.from(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`).toString('base64');

    return new Promise((resolve, reject) => {
        const request = https.request({
            hostname: 'api.twilio.com',
            path: `/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`,
            method: 'POST',
            headers: {
                Authorization: `Basic ${auth}`,
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': Buffer.byteLength(postData)
            }
        }, (response) => {
            let body = '';
            response.on('data', chunk => {
                body += chunk;
            });
            response.on('end', () => {
                if (response.statusCode >= 200 && response.statusCode < 300) {
                    resolve({ sent: true, channel: 'sms' });
                } else {
                    reject(new Error(`SMS failed with status ${response.statusCode}: ${body}`));
                }
            });
        });

        request.on('error', reject);
        request.write(postData);
        request.end();
    });
}

async function sendOtpToUser(user, otp) {
    const results = await Promise.allSettled([
        sendEmailOtp(user.email, otp),
        sendTwilioSmsOtp(user.phone, otp)
    ]);

    const sentChannels = [];
    const errors = [];

    results.forEach((result) => {
        if (result.status === 'fulfilled' && result.value.sent) {
            sentChannels.push(result.value.channel);
        } else if (result.status === 'rejected') {
            errors.push(result.reason.message);
        } else if (result.value?.reason) {
            errors.push(result.value.reason);
        }
    });

    return { sentChannels, errors };
}

function ensureDataDir() {
    if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
    }
}

function loadMapFromFile(filePath) {
    try {
        if (!fs.existsSync(filePath)) {
            return [];
        }
        const raw = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(raw);
    } catch (error) {
        console.warn(`Failed to load ${filePath}:`, error.message);
        return [];
    }
}

function saveMapToFile(filePath, mapInstance) {
    try {
        ensureDataDir();
        fs.writeFileSync(filePath, JSON.stringify(Array.from(mapInstance.entries()), null, 2), 'utf8');
    } catch (error) {
        console.warn(`Failed to save ${filePath}:`, error.message);
    }
}

function loadPersistedAuthData() {
    ensureDataDir();

    const storedUsers = loadMapFromFile(USERS_FILE);
    storedUsers.forEach(([email, user]) => {
        users.set(email, user);
    });

    const storedReferrals = loadMapFromFile(REFERRALS_FILE);
    storedReferrals.forEach(([code, referral]) => {
        referrals.set(code, referral);
    });

    const storedBookings = loadMapFromFile(BOOKINGS_FILE);
    storedBookings.forEach(([email, userBookings]) => {
        bookings.set(email, userBookings);
    });
}

function persistAuthData() {
    saveMapToFile(USERS_FILE, users);
    saveMapToFile(REFERRALS_FILE, referrals);
    saveMapToFile(BOOKINGS_FILE, bookings);
}

loadPersistedAuthData();

// ===== AUTHENTICATION ROUTES =====

// Register user
app.post('/api/auth/register', (req, res) => {
    try {
        const name = String(req.body.name || '').trim().replace(/\s+/g, ' ');
        const email = String(req.body.email || '').trim().toLowerCase();
        const phone = String(req.body.phone || '').trim();
        const password = String(req.body.password || '');

        if (!name || !email || !phone || !password) {
            return res.status(400).json({ success: false, message: 'Missing required fields' });
        }

        if (name.length < 2) {
            return res.status(400).json({ success: false, message: 'Name must be at least 2 characters' });
        }

        if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
            return res.status(400).json({ success: false, message: 'Invalid email address' });
        }

        if (!/^\d{10}$/.test(phone.replace(/[^\d]/g, ''))) {
            return res.status(400).json({ success: false, message: 'Invalid phone number' });
        }

        if (password.length < 6) {
            return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
        }

        if (users.has(email)) {
            return res.status(409).json({ success: false, message: 'User already exists' });
        }

        const normalizedPhone = phone.replace(/[^\d]/g, '');
        const userId = `user_${Date.now()}`;
        const user = {
            userId,
            name,
            email,
            phone: normalizedPhone,
            password: Buffer.from(password).toString('base64'), // Simple encoding
            createdAt: new Date(),
            referralCode: `PLANMYTRIP-${normalizedPhone.slice(-4)}`,
            totalReferrals: 0,
            totalDiscount: 0
        };

        users.set(email, user);
        referrals.set(user.referralCode, { userId, count: 0, amount: 0 });
        persistAuthData();

        res.json({
            success: true,
            message: 'Registration successful',
            user: { userId, name, email, phone: normalizedPhone, referralCode: user.referralCode }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Login user
app.post('/api/auth/login', (req, res) => {
    try {
        const email = String(req.body.email || '').trim().toLowerCase();
        const password = String(req.body.password || '');

        const user = users.get(email);
        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const decodedPassword = Buffer.from(user.password, 'base64').toString();
        if (decodedPassword !== password) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        // Return user info but mark as "otp_required"
        res.json({
            success: true,
            message: 'Credentials verified',
            otpRequired: true,
            email: user.email
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Request OTP
app.post('/api/auth/request-otp', async (req, res) => {
    try {
        const email = String(req.body.email || '').trim().toLowerCase();
        if (!email) return res.status(400).json({ success: false, message: 'Email is required' });

        const user = users.get(email);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        otps.set(email, { otp, expires: Date.now() + 300000 }); // 5 min expiry

        const delivery = await sendOtpToUser(user, otp);
        if (delivery.sentChannels.length === 0) {
            console.warn(`[AUTH] OTP delivery failed for ${email}: ${delivery.errors.join('; ')}`);
            if (allowDevOtpFallback()) {
                console.warn(`[AUTH] Development OTP fallback for ${email}: ${otp}`);
                return res.json({
                    success: true,
                    message: 'OTP generated for local testing. Use the code shown on this page.',
                    channels: ['local test mode'],
                    devOtp: otp
                });
            }

            otps.delete(email);
            return res.status(500).json({
                success: false,
                message: 'OTP could not be sent. Configure SMTP email or SMS settings in your .env file.'
            });
        }

        console.log(`[AUTH] OTP sent to ${email} through: ${delivery.sentChannels.join(', ')}`);
        res.json({
            success: true,
            message: `OTP sent to your ${delivery.sentChannels.join(' and ')}.`,
            channels: delivery.sentChannels
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Verify OTP
app.post('/api/auth/verify-otp', (req, res) => {
    const email = String(req.body.email || '').trim().toLowerCase();
    const otp = String(req.body.otp || '').trim();

    const stored = otps.get(email);
    if (!stored || stored.otp !== otp || Date.now() > stored.expires) {
        return res.status(401).json({ success: false, message: 'Invalid or expired OTP' });
    }

    otps.delete(email); // One-time use
    const user = users.get(email);

    res.json({
        success: true,
        message: 'Login successful',
        user: {
            userId: user.userId,
            name: user.name || user.email.split('@')[0],
            email: user.email,
            phone: user.phone,
            referralCode: user.referralCode,
            totalReferrals: user.totalReferrals,
            totalDiscount: user.totalDiscount
        }
    });
});

// ===== DESTINATION ROUTES =====

// Get all destinations
app.get('/api/destinations', (req, res) => {
    const destinations = [
        { id: 'goa', name: 'South Goa Beaches', costPerPerson: 4000, review: 4.8, weather: "Best enjoyed in afternoons", emoji: '🏖️', description: 'Experience pristine beaches with crystal clear waters' },
        { id: 'udaipur', name: 'Udaipur City Palace', costPerPerson: 5500, review: 4.6, weather: "Early morning visits", emoji: '🏰', description: 'Majestic architecture and romantic lakeside views' },
        { id: 'meghalaya', name: 'Meghalaya Living Bridges', costPerPerson: 8000, review: 4.9, weather: "Wear sturdy footwear", emoji: '🌿', description: 'Explore the living root bridges of Cherrapunji' },
        { id: 'hampi', name: 'Hampi Ruins & Temples', costPerPerson: 3000, review: 4.7, weather: "Early morning photography", emoji: '⛩️', description: 'Ancient temples and historical ruins' },
        { id: 'kashmir', name: 'Kashmir Valley', costPerPerson: 7500, review: 4.9, weather: "Spring tulips", emoji: '🌸', description: 'Paradise on earth with snow-capped mountains' },
        { id: 'leh', name: 'Leh-Ladakh', costPerPerson: 9000, review: 4.8, weather: "Best in summer", emoji: '⛰️', description: 'High altitude adventure and breathtaking landscapes' },
        { id: 'kerala', name: 'Kerala Backwaters', costPerPerson: 6000, review: 4.7, weather: "Monsoon lush greenery", emoji: '🌊', description: 'Serene backwater cruises and houseboat experiences' },
        { id: 'varanasi', name: 'Varanasi Ghats', costPerPerson: 4500, review: 4.6, weather: "Sunrise boat rides", emoji: '🛕', description: 'Spiritual journey along the sacred Ganges' }
    ];
    res.json({ success: true, destinations });
});

// Get destination details
app.get('/api/destinations/:id', (req, res) => {
    const { id } = req.params;
    const allDestinations = [
        { id: 'goa', name: 'South Goa Beaches', costPerPerson: 4000, review: 4.8, fullDescription: 'Experience the best of Goa with pristine beaches, vibrant nightlife, and delicious seafood.' },
        { id: 'udaipur', name: 'Udaipur City Palace', costPerPerson: 5500, review: 4.6, fullDescription: 'Visit the majestic City Palace and enjoy romantic lakeside views.' }
    ];
    const destination = allDestinations.find(d => d.id === id);
    if (!destination) {
        return res.status(404).json({ success: false, message: 'Destination not found' });
    }
    res.json({ success: true, destination });
});

// ===== BOOKING ROUTES =====

// Create booking
app.post('/api/bookings', (req, res) => {
    try {
        const { userId, destinations, peopleCount, nightsCount, startDate, totalAmount, paymentMethod } = req.body;

        if (!userId || !destinations || destinations.length === 0) {
            return res.status(400).json({ success: false, message: 'Invalid booking data' });
        }

        const bookingId = `TRIP_${tripCounter++}`;
        const booking = {
            bookingId,
            userId,
            destinations,
            peopleCount,
            nightsCount,
            startDate,
            endDate: new Date(new Date(startDate).getTime() + nightsCount * 24 * 60 * 60 * 1000).toISOString(),
            totalAmount,
            paymentMethod,
            status: 'confirmed',
            bookingDate: new Date(),
            referralApplied: req.body.referralApplied || false
        };

        bookings.set(bookingId, booking);

        // Update user referral stats
        const user = Array.from(users.values()).find(u => u.userId === userId);
        if (user) {
            user.totalBookings = (user.totalBookings || 0) + 1;
        }

        res.json({
            success: true,
            message: 'Booking confirmed!',
            booking
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Get user bookings
app.get('/api/bookings/:userId', (req, res) => {
    try {
        const { userId } = req.params;
        const userBookings = Array.from(bookings.values()).filter(b => b.userId === userId);
        res.json({ success: true, bookings: userBookings });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ===== REFERRAL ROUTES =====

// Apply referral code
app.post('/api/referrals/apply', (req, res) => {
    try {
        const { referralCode, userId } = req.body;

        if (!referrals.has(referralCode)) {
            return res.status(400).json({ success: false, message: 'Invalid referral code' });
        }

        const referralData = referrals.get(referralCode);
        const discount = 750; // Standard discount

        // Update referral stats
        referralData.count++;
        referralData.amount += discount;

        // Update user stats
        const user = Array.from(users.values()).find(u => u.userId === userId);
        if (user) {
            user.totalDiscount = (user.totalDiscount || 0) + discount;
        }
        persistAuthData();

        res.json({
            success: true,
            message: 'Referral applied successfully',
            discount,
            totalDiscount: (user?.totalDiscount || 0)
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Get referral stats
app.get('/api/referrals/stats/:userId', (req, res) => {
    try {
        const { userId } = req.params;
        const user = Array.from(users.values()).find(u => u.userId === userId);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.json({
            success: true,
            referralCode: user.referralCode,
            totalReferrals: user.totalReferrals || 0,
            totalDiscount: user.totalDiscount || 0,
            friendsRegistered: user.totalReferrals || 0
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ===== PAYMENT ROUTES =====

// Process payment
app.post('/api/payments/process', (req, res) => {
    try {
        const { bookingId, paymentMethod, amount, paymentDetails } = req.body;

        if (!bookingId || !paymentMethod || !amount) {
            return res.status(400).json({ success: false, message: 'Missing payment details' });
        }

        // Simulate payment processing
        const paymentId = `PAY_${Date.now()}`;
        const payment = {
            paymentId,
            bookingId,
            amount,
            paymentMethod,
            status: 'success',
            timestamp: new Date(),
            transactionDetails: paymentDetails || {}
        };

        res.json({
            success: true,
            message: 'Payment processed successfully',
            payment
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ===== SOCIAL MEDIA SHARING ROUTES =====

// Get share content
app.get('/api/share/content/:tripId', (req, res) => {
    try {
        const { tripId } = req.params;
        const booking = bookings.get(tripId);

        if (!booking) {
            return res.status(404).json({ success: false, message: 'Trip not found' });
        }

        const shareContent = {
            title: 'I just booked an amazing trip on PlanMyTrip! 🌍',
            description: `Check out my ${booking.nightsCount}-night adventure starting from ₹${booking.totalAmount}!`,
            url: `https://planmytrip.com/trip/${tripId}`,
            hashtags: '#PlanMyTrip #TravelDiaries #IndiaTravel #WanderlustMode'
        };

        res.json({ success: true, shareContent });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ===== ANALYTICS ROUTES =====

// Track user activity
app.post('/api/analytics/track', (req, res) => {
    try {
        const { userId, event, data } = req.body;
        console.log(`📊 Analytics - User: ${userId}, Event: ${event}`, data);
        res.json({ success: true, message: 'Event tracked' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ===== CONFIGURATION ROUTES =====

app.get('/api/config/maps', (req, res) => {
    res.json({ success: true, key: process.env.GOOGLE_MAPS_API_KEY });
});

// ===== BOOKINGS ROUTES =====

app.post('/api/bookings', (req, res) => {
    try {
        const { email, booking } = req.body;
        console.log(`📥 New Booking Request for: ${email}`);
        
        if (!email || !booking) {
            console.error('❌ Missing email or booking details');
            return res.status(400).json({ success: false, message: 'Email and booking details required' });
        }
        
        let userBookings = bookings.get(email) || [];
        const newBooking = {
            ...booking,
            timestamp: new Date().toISOString()
        };
        userBookings.push(newBooking);
        bookings.set(email, userBookings);
        
        console.log(`✅ Saving ${userBookings.length} bookings for ${email}`);
        persistAuthData();
        
        res.json({ success: true, message: 'Booking saved', bookings: userBookings });
    } catch (error) {
        console.error('❌ Booking Error:', error.message);
        res.status(500).json({ success: false, message: error.message });
    }
});

app.get('/api/bookings/:email', (req, res) => {
    try {
        const email = req.params.email;
        const userBookings = bookings.get(email) || [];
        res.json({ success: true, bookings: userBookings });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

app.post('/api/bookings/cancel', (req, res) => {
    try {
        const { email, id } = req.body;
        if (!email || !id) {
            return res.status(400).json({ success: false, message: 'Email and booking ID required' });
        }

        let userBookings = bookings.get(email) || [];
        const idx = userBookings.findIndex(b => b.id === id);
        if (idx !== -1) {
            userBookings[idx].status = 'Cancelled';
            bookings.set(email, userBookings);
            persistAuthData();
            res.json({ success: true, message: 'Booking cancelled', bookings: userBookings });
        } else {
            res.status(404).json({ success: false, message: 'Booking not found' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

app.post('/api/bookings/list-for-sale', (req, res) => {
    try {
        const { email, id, price, notes } = req.body;
        if (!email || !id || !price) {
            return res.status(400).json({ success: false, message: 'Email, ID and price required' });
        }

        let userBookings = bookings.get(email) || [];
        const idx = userBookings.findIndex(b => b.id === id);
        if (idx !== -1) {
            userBookings[idx].forSale = true;
            userBookings[idx].askingPrice = price;
            userBookings[idx].saleNotes = notes || '';
            bookings.set(email, userBookings);
            persistAuthData();
            res.json({ success: true, message: 'Ticket listed for sale' });
        } else {
            res.status(404).json({ success: false, message: 'Booking not found' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

app.get('/api/bookings/marketplace', (req, res) => {
    try {
        let allListings = [];
        for (let [email, userBookings] of bookings.entries()) {
            if (Array.isArray(userBookings)) {
                const listings = userBookings
                    .filter(b => b.forSale === true && b.status === 'Upcoming')
                    .map(b => ({ ...b, sellerEmail: email }));
                allListings = allListings.concat(listings);
            }
        }
        res.json({ success: true, listings: allListings });
    } catch (error) {
        console.error('Marketplace Error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// ===== ADMIN / DEVELOPER ENDPOINTS =====
const adminAuth = (req, res, next) => {
    const adminEmail = req.headers['x-admin-email'];
    if (adminEmail === 'shreyasroy2023@gmail.com') {
        next();
    } else {
        res.status(403).json({ success: false, message: 'Unauthorized: Admin access only' });
    }
};

app.get('/api/admin/stats', adminAuth, (req, res) => {
    try {
        let totalBookings = 0;
        let totalRevenue = 0;
        let typeCounts = { flight: 0, train: 0, bus: 0, hotel: 0, stay: 0, trip: 0 };
        let enquiryTypeCounts = { General: 0, Flight: 0, Train: 0, Bus: 0, Hotel: 0, Accommodation: 0, Payment: 0, Technical: 0 };
        
        for (let [email, userBookings] of bookings.entries()) {
            if (Array.isArray(userBookings)) {
                totalBookings += userBookings.length;
                userBookings.forEach(b => {
                    const amountStr = String(b.amount || '0');
                    const amount = parseFloat(amountStr.replace(/[^\d.]/g, '')) || 0;
                    totalRevenue += amount;
                    if (typeCounts[b.type] !== undefined) typeCounts[b.type]++;
                });
            }
        }

        enquiries.forEach(e => {
            if (enquiryTypeCounts[e.type] !== undefined) enquiryTypeCounts[e.type]++;
        });

        res.json({
            success: true,
            stats: {
                totalBookings,
                totalRevenue: Math.round(totalRevenue),
                totalUsers: users.size,
                totalEnquiries: enquiries.length,
                typeCounts,
                enquiryTypeCounts
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

app.get('/api/admin/all-bookings', adminAuth, (req, res) => {
    try {
        let all = [];
        for (let [email, userBookings] of bookings.entries()) {
            if (Array.isArray(userBookings)) {
                all.push(...userBookings.map(b => ({ ...b, userEmail: email })));
            }
        }
        // Sort by date (newest first)
        all.sort((a, b) => new Date(b.date) - new Date(a.date));
        res.json({ success: true, bookings: all });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

app.post('/api/enquiry', (req, res) => {
    try {
        const { name, email, subject, message, type } = req.body;
        console.log('New Enquiry received:', { name, email, type });
        const newEnquiry = {
            id: 'ENQ-' + Date.now(),
            name,
            email,
            subject,
            message,
            type: type || 'General',
            status: 'Pending',
            response: '',
            createdAt: new Date().toISOString()
        };
        enquiries.push(newEnquiry);
        saveEnquiries();
        res.json({ success: true, message: 'Enquiry submitted successfully' });
    } catch (error) {
        console.error('Enquiry Error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

app.get('/api/admin/enquiries', adminAuth, (req, res) => {
    res.json({ success: true, enquiries: enquiries.slice().reverse() });
});

app.get('/api/admin/users', adminAuth, (req, res) => {
    try {
        const allUsers = Array.from(users.values()).map(u => ({
            name: u.name,
            email: u.email,
            phone: u.phone,
            createdAt: u.createdAt,
            referralCode: u.referralCode
        }));
        res.json({ success: true, users: allUsers });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

app.post('/api/admin/enquiry/resolve', adminAuth, (req, res) => {
    const { id, response } = req.body;
    const enq = enquiries.find(e => e.id === id);
    if (enq) {
        enq.status = 'Resolved';
        if (response) enq.response = response;
        saveEnquiries();
        return res.json({ success: true });
    }
    res.status(404).json({ success: false, message: 'Enquiry not found' });
});

app.post('/api/bookings/buy', (req, res) => {
    try {
        const { buyerEmail, sellerEmail, bookingId } = req.body;
        if (!buyerEmail || !sellerEmail || !bookingId) {
            return res.status(400).json({ success: false, message: 'Missing purchase details' });
        }

        // Remove from seller
        let sellerBookings = bookings.get(sellerEmail) || [];
        const bookingIdx = sellerBookings.findIndex(b => b.id === bookingId);
        
        if (bookingIdx === -1) {
            return res.status(404).json({ success: false, message: 'Listing no longer available' });
        }

        const bookingToTransfer = sellerBookings.splice(bookingIdx, 1)[0];
        bookingToTransfer.forSale = false; // Reset sale flag
        bookingToTransfer.transferredFrom = sellerEmail;
        
        // Add to buyer
        let buyerBookings = bookings.get(buyerEmail) || [];
        buyerBookings.push(bookingToTransfer);

        bookings.set(sellerEmail, sellerBookings);
        bookings.set(buyerEmail, buyerBookings);
        
        persistAuthData();
        res.json({ success: true, message: 'Purchase successful! Ticket transferred.' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ===== HEALTH CHECK =====

app.get('/api/health', (req, res) => {
    res.json({ success: true, message: 'Server is running', timestamp: new Date() });
});

// Start Server
app.listen(PORT, () => {
    console.log(`✅ PlanMyTrip Backend Server running on http://localhost:${PORT}`);
    console.log(`📚 API Base URL: http://localhost:${PORT}/api`);
});

// Export for testing
module.exports = app;
