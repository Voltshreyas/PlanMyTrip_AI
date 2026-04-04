// PlanMyTrip Backend Server - Node.js with Express
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 5000;

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
let tripCounter = 1;

// ===== AUTHENTICATION ROUTES =====

// Register user
app.post('/api/auth/register', (req, res) => {
    try {
        const { email, phone, password } = req.body;

        if (!email || !phone || !password) {
            return res.status(400).json({ success: false, message: 'Missing required fields' });
        }

        if (users.has(email)) {
            return res.status(409).json({ success: false, message: 'User already exists' });
        }

        const userId = `user_${Date.now()}`;
        const user = {
            userId,
            email,
            phone,
            password: Buffer.from(password).toString('base64'), // Simple encoding
            createdAt: new Date(),
            referralCode: `PLANMYTRIP-${phone.slice(-4)}`,
            totalReferrals: 0,
            totalDiscount: 0
        };

        users.set(email, user);
        referrals.set(user.referralCode, { userId, count: 0, amount: 0 });

        res.json({
            success: true,
            message: 'Registration successful',
            user: { userId, email, phone, referralCode: user.referralCode }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Login user
app.post('/api/auth/login', (req, res) => {
    try {
        const { email, password } = req.body;

        const user = users.get(email);
        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const decodedPassword = Buffer.from(user.password, 'base64').toString();
        if (decodedPassword !== password) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        res.json({
            success: true,
            message: 'Login successful',
            user: {
                userId: user.userId,
                email: user.email,
                phone: user.phone,
                referralCode: user.referralCode,
                totalReferrals: user.totalReferrals,
                totalDiscount: user.totalDiscount
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
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
