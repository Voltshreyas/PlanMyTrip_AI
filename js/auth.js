// ===== SESSION MANAGEMENT =====
// Check if user is logged in. Public pages can call this without redirecting.
function checkSession(options = {}) {
    const { redirect = false, loginPath = 'login.html' } = options;
    const storedUser = localStorage.getItem('planmytrip_user');
    if (!storedUser) {
        if (redirect) window.location.href = loginPath;
        return null;
    }

    try {
        const user = JSON.parse(storedUser);
        if (!user || typeof user !== 'object' || !user.email) {
            localStorage.removeItem('planmytrip_user');
            if (redirect) window.location.href = loginPath;
            return null;
        }
        return user;
    } catch (error) {
        localStorage.removeItem('planmytrip_user');
        if (redirect) window.location.href = loginPath;
        return null;
    }
}

// Logout function
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('planmytrip_user');
        window.location.href = 'login.html';
    }
}

// ===== INPUT VALIDATION FUNCTIONS =====
const validatePhoneNumber = (phone) => /^[0-9]{10}$/.test(phone.replace(/[^\d]/g, ''));
const validateEmail = (email) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);

// Check session on page load
const currentUser = checkSession();
