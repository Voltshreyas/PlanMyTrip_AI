// API Utilities for Frontend
const API_BASE_URL = 'http://localhost:5000/api';

/**
 * Generic API fetch wrapper with error handling
 */
async function apiCall(endpoint, method = 'GET', data = null) {
    try {
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        };

        if (data) {
            options.body = JSON.stringify(data);
        }

        const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
        
        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('API Call Error:', error);
        return { success: false, message: error.message };
    }
}

/**
 * Authentication APIs
 */
const AuthAPI = {
    register: (email, phone, password) => 
        apiCall('/auth/register', 'POST', { email, phone, password }),
    
    login: (email, password) => 
        apiCall('/auth/login', 'POST', { email, password })
};

/**
 * Destination APIs
 */
const DestinationAPI = {
    getAll: () => apiCall('/destinations', 'GET'),
    
    getById: (id) => apiCall(`/destinations/${id}`, 'GET')
};

/**
 * Booking APIs
 */
const BookingAPI = {
    create: (bookingData) => 
        apiCall('/bookings', 'POST', bookingData),
    
    getUserBookings: (userId) => 
        apiCall(`/bookings/${userId}`, 'GET')
};

/**
 * Referral APIs
 */
const ReferralAPI = {
    apply: (referralCode, userId) => 
        apiCall('/referrals/apply', 'POST', { referralCode, userId }),
    
    getStats: (userId) => 
        apiCall(`/referrals/stats/${userId}`, 'GET')
};

/**
 * Payment APIs
 */
const PaymentAPI = {
    process: (bookingId, paymentMethod, amount, paymentDetails = {}) => 
        apiCall('/payments/process', 'POST', { bookingId, paymentMethod, amount, paymentDetails })
};

/**
 * Social Media APIs
 */
const SocialAPI = {
    getShareContent: (tripId) => 
        apiCall(`/share/content/${tripId}`, 'GET'),
    
    shareToSocial: (platform, tripId, content) => {
        const shareUrls = {
            facebook: `https://www.facebook.com/sharer/sharer.php?u=${content.url}`,
            twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(content.title)}&url=${content.url}&hashtags=${encodeURIComponent(content.hashtags)}`,
            whatsapp: `https://wa.me/?text=${encodeURIComponent(content.title + ' ' + content.url)}`,
            instagram: 'https://www.instagram.com/', // Instagram doesn't support share URLs
            linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${content.url}`
        };
        
        if (shareUrls[platform]) {
            window.open(shareUrls[platform], '_blank', 'width=600,height=400');
        }
    }
};

/**
 * Analytics APIs
 */
const AnalyticsAPI = {
    trackEvent: (userId, event, data = {}) => 
        apiCall('/analytics/track', 'POST', { userId, event, data })
};

/**
 * Health Check
 */
const HealthAPI = {
    check: () => apiCall('/health', 'GET')
};

// Export all APIs
window.APIs = {
    Auth: AuthAPI,
    Destination: DestinationAPI,
    Booking: BookingAPI,
    Referral: ReferralAPI,
    Payment: PaymentAPI,
    Social: SocialAPI,
    Analytics: AnalyticsAPI,
    Health: HealthAPI
};

// Check API connectivity on load
document.addEventListener('DOMContentLoaded', async () => {
    const health = await HealthAPI.check();
    if (health.success) {
        console.log('✅ Backend API Connected');
    } else {
        console.warn('⚠️ Backend API Offline - Running in demo mode');
    }
});
