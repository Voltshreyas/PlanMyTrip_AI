// ===== SESSION MANAGEMENT =====
// Check if user is logged in, redirect to login if not
function checkSession() {
    const user = localStorage.getItem('planmytrip_user');
    if (!user) {
        window.location.href = 'login.html';
        return null;
    }
    return JSON.parse(user);
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
