// backend/referralRoutes.js - All Referral API Routes
const express  = require('express');
const { ObjectId } = require('mongodb');
const { getDB } = require('./db');

const router = express.Router();

// ─────────────────────────────────────────────────────────────────────────────
// HELPER: generate a unique referral code from user details
// ─────────────────────────────────────────────────────────────────────────────
function generateReferralCode(name, phone) {
    const prefix = (name || 'USER').toUpperCase().replace(/\s+/g, '').slice(0, 5);
    const suffix = (phone || Date.now().toString()).slice(-4);
    return `PLANMYTRIP-${prefix}${suffix}`;
}

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/referrals/stats/:userId
// Returns the referral dashboard data for a logged-in user
// ─────────────────────────────────────────────────────────────────────────────
router.get('/stats/:userId', async (req, res) => {
    try {
        const db = getDB();
        const { userId } = req.params;

        const user = await db.collection('users').findOne({ userId });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Count how many people this user referred (and they booked at least once)
        const successfulReferrals = await db.collection('referrals').countDocuments({
            referrerId: userId,
            status: 'completed'
        });

        // Count how many people used this referral code at all (signed up)
        const totalSignups = await db.collection('referrals').countDocuments({
            referrerId: userId
        });

        // Count how many bookings the current user has made
        const tripsBooked = await db.collection('bookings').countDocuments({ userId });

        // Total earnings = successfulReferrals * 750
        const totalEarned = successfulReferrals * 750;

        // Average savings percentage (computed from bookings)
        const bookings = await db
            .collection('bookings')
            .find({ userId })
            .toArray();
        const avgSavings =
            bookings.length > 0
                ? Math.round(
                      bookings.reduce((acc, b) => acc + (b.savingsPercent || 0), 0) /
                          bookings.length
                  )
                : 0;

        // List of friends who signed up (most recent 20)
        const referralDocs = await db
            .collection('referrals')
            .find({ referrerId: userId })
            .sort({ createdAt: -1 })
            .limit(20)
            .toArray();

        const friends = await Promise.all(
            referralDocs.map(async (r) => {
                const friend = await db
                    .collection('users')
                    .findOne({ userId: r.referredUserId }, { projection: { name: 1, email: 1 } });
                return {
                    name:      friend ? friend.name  : 'Anonymous',
                    email:     friend ? friend.email : '',
                    status:    r.status,
                    joinedAt:  r.createdAt,
                    discount:  r.status === 'completed' ? 750 : 0
                };
            })
        );

        res.json({
            success: true,
            referralCode:       user.referralCode,
            totalReferrals:     successfulReferrals,
            totalSignups,
            totalEarned,
            tripsBooked,
            avgSavings,
            friends
        });
    } catch (err) {
        console.error('[GET /stats] Error:', err);
        res.status(500).json({ success: false, message: err.message });
    }
});

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/referrals/leaderboard
// Returns top-10 referrers (public leaderboard)
// ─────────────────────────────────────────────────────────────────────────────
router.get('/leaderboard', async (req, res) => {
    try {
        const db = getDB();

        // Aggregate: join referrals → users, count completed referrals, compute earnings
        const leaders = await db
            .collection('referrals')
            .aggregate([
                { $match: { status: 'completed' } },
                {
                    $group: {
                        _id:            '$referrerId',
                        totalReferrals: { $sum: 1 },
                        totalEarned:    { $sum: 750 }
                    }
                },
                { $sort: { totalReferrals: -1 } },
                { $limit: 10 },
                {
                    $lookup: {
                        from:         'users',
                        localField:   '_id',
                        foreignField: 'userId',
                        as:           'userInfo'
                    }
                },
                { $unwind: { path: '$userInfo', preserveNullAndEmpty: true } },
                {
                    $project: {
                        _id:            0,
                        userId:         '$_id',
                        name:           { $ifNull: ['$userInfo.name', 'Anonymous'] },
                        totalReferrals: 1,
                        totalEarned:    1
                    }
                }
            ])
            .toArray();

        // Add rank numbers
        const ranked = leaders.map((l, idx) => ({ rank: idx + 1, ...l }));

        res.json({ success: true, leaderboard: ranked });
    } catch (err) {
        console.error('[GET /leaderboard] Error:', err);
        res.status(500).json({ success: false, message: err.message });
    }
});

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/referrals/apply
// Body: { referralCode, userId }  — called when a new user signs up with a code
// ─────────────────────────────────────────────────────────────────────────────
router.post('/apply', async (req, res) => {
    try {
        const db = getDB();
        const { referralCode, userId } = req.body;

        if (!referralCode || !userId) {
            return res.status(400).json({ success: false, message: 'referralCode and userId are required' });
        }

        // Find the owner of the referral code
        const referrer = await db.collection('users').findOne({ referralCode });
        if (!referrer) {
            return res.status(400).json({ success: false, message: 'Invalid referral code' });
        }

        // Prevent self-referral
        if (referrer.userId === userId) {
            return res.status(400).json({ success: false, message: 'You cannot use your own referral code' });
        }

        // Check if this user already used a referral code
        const existing = await db.collection('referrals').findOne({ referredUserId: userId });
        if (existing) {
            return res.status(409).json({ success: false, message: 'You have already used a referral code' });
        }

        // Record the referral (pending — becomes "completed" on first booking)
        const referralDoc = {
            referrerId:     referrer.userId,
            referralCode,
            referredUserId: userId,
            status:         'pending',   // pending → completed on first booking
            discount:       750,
            createdAt:      new Date(),
            completedAt:    null
        };

        await db.collection('referrals').insertOne(referralDoc);

        res.json({
            success:  true,
            message:  'Referral code applied! You\'ll earn ₹750 discount on first booking.',
            discount: 750,
            referrerId: referrer.userId
        });
    } catch (err) {
        console.error('[POST /apply] Error:', err);
        res.status(500).json({ success: false, message: err.message });
    }
});

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/referrals/complete
// Body: { userId }  — called when a referred user completes their first booking
// ─────────────────────────────────────────────────────────────────────────────
router.post('/complete', async (req, res) => {
    try {
        const db = getDB();
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({ success: false, message: 'userId is required' });
        }

        // Mark the referral as completed
        const result = await db.collection('referrals').findOneAndUpdate(
            { referredUserId: userId, status: 'pending' },
            {
                $set: {
                    status:      'completed',
                    completedAt: new Date()
                }
            },
            { returnDocument: 'after' }
        );

        if (!result) {
            // No pending referral found — that's okay, not an error
            return res.json({ success: true, message: 'No pending referral found', credited: false });
        }

        // Credit ₹750 discount to the referrer
        await db.collection('users').updateOne(
            { userId: result.referrerId },
            {
                $inc: {
                    totalReferrals: 1,
                    totalDiscount:  750
                }
            }
        );

        res.json({
            success:  true,
            message:  'Referral completed! ₹750 discount credited to referrer.',
            credited: true,
            referrerId: result.referrerId
        });
    } catch (err) {
        console.error('[POST /complete] Error:', err);
        res.status(500).json({ success: false, message: err.message });
    }
});

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/referrals/track-share
// Body: { userId, platform, referralCode }  — tracks social sharing events
// ─────────────────────────────────────────────────────────────────────────────
router.post('/track-share', async (req, res) => {
    try {
        const db = getDB();
        const { userId, platform, referralCode } = req.body;

        if (!userId || !platform) {
            return res.status(400).json({ success: false, message: 'userId and platform are required' });
        }

        await db.collection('share_events').insertOne({
            userId,
            platform,
            referralCode: referralCode || null,
            sharedAt: new Date()
        });

        // Update user's share count
        await db.collection('users').updateOne(
            { userId },
            { $inc: { shareCount: 1 } }
        );

        res.json({ success: true, message: `Share tracked on ${platform}` });
    } catch (err) {
        console.error('[POST /track-share] Error:', err);
        res.status(500).json({ success: false, message: err.message });
    }
});

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/referrals/code/:referralCode
// Validates a referral code (e.g., while typing during sign-up)
// ─────────────────────────────────────────────────────────────────────────────
router.get('/code/:referralCode', async (req, res) => {
    try {
        const db = getDB();
        const { referralCode } = req.params;

        const user = await db.collection('users').findOne(
            { referralCode },
            { projection: { name: 1, email: 1, referralCode: 1 } }
        );

        if (!user) {
            return res.status(404).json({ success: false, valid: false, message: 'Invalid referral code' });
        }

        res.json({
            success:  true,
            valid:    true,
            referrer: {
                name:         user.name,
                referralCode: user.referralCode
            },
            discount: 750
        });
    } catch (err) {
        console.error('[GET /code] Error:', err);
        res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = router;
