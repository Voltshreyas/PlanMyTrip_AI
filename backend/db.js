// backend/db.js - MongoDB Connection Module
const { MongoClient } = require('mongodb');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017';
const DB_NAME   = process.env.DB_NAME   || 'planmytrip';

let client = null;
let db     = null;

/**
 * Connect to MongoDB (singleton pattern - reuses the same connection).
 * @returns {Promise<Db>} The MongoDB database instance.
 */
async function connectDB() {
    if (db) return db; // Return cached connection

    try {
        client = new MongoClient(MONGO_URI, {
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 5000,
            connectTimeoutMS: 10000,
        });

        await client.connect();
        db = client.db(DB_NAME);

        console.log(`✅ [MongoDB] Connected to database: "${DB_NAME}"`);

        // Create indexes for performance
        await createIndexes(db);

        // Graceful shutdown
        process.on('SIGINT',  () => closeDB());
        process.on('SIGTERM', () => closeDB());

        return db;
    } catch (err) {
        console.error('❌ [MongoDB] Connection failed:', err.message);
        throw err;
    }
}

/**
 * Create necessary indexes for performance.
 */
async function createIndexes(database) {
    try {
        // Users collection indexes
        await database.collection('users').createIndex({ email: 1 }, { unique: true });
        await database.collection('users').createIndex({ referralCode: 1 }, { unique: true });
        await database.collection('users').createIndex({ userId: 1 });

        // Referrals collection indexes
        await database.collection('referrals').createIndex({ referralCode: 1 }, { unique: true });
        await database.collection('referrals').createIndex({ referrerId: 1 });
        await database.collection('referrals').createIndex({ referredUserId: 1 });
        await database.collection('referrals').createIndex({ createdAt: -1 });

        // Leaderboard view - sort by totalReferrals desc
        await database.collection('users').createIndex({ totalReferrals: -1 });

        console.log('✅ [MongoDB] Indexes created successfully');
    } catch (err) {
        // Indexes may already exist – not a fatal error
        console.warn('⚠️ [MongoDB] Index creation warning:', err.message);
    }
}

/**
 * Get the active database instance.
 * Throws if connectDB() hasn't been called yet.
 */
function getDB() {
    if (!db) throw new Error('Database not initialized. Call connectDB() first.');
    return db;
}

/**
 * Close the MongoDB connection gracefully.
 */
async function closeDB() {
    if (client) {
        await client.close();
        db     = null;
        client = null;
        console.log('🔌 [MongoDB] Connection closed.');
    }
}

module.exports = { connectDB, getDB, closeDB };
