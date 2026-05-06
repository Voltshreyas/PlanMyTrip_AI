// ===== VIEW MANAGEMENT =====
function switchView(viewId) {
    VIEWS.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.add('hidden');
    });

    const target = document.getElementById(viewId);
    if (target) {
        target.classList.remove('hidden');
        target.style.opacity = '0';
        window.setTimeout(() => {
            target.style.transition = 'opacity 0.25s ease';
            target.style.opacity = '1';
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 10);
    }

    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active', 'text-indigo-600', 'text-blue-600', 'font-semibold', 'bg-indigo-50');
    });

    const navMap = {
        'home-view': ['nav-home', 'nav-home-mobile'],
        'planning-view': ['nav-plantrip', 'nav-plantrip-mobile'],
        'about-us-view': ['nav-about', 'nav-about-mobile'],
        'upcoming-trips-view': ['nav-bookings', 'nav-bookings-mobile'],
        'registered-view': ['nav-referrals', 'nav-referrals-mobile']
    };

    (navMap[viewId] || []).forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.add('active');
    });

    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenu) mobileMenu.classList.add('hidden');

    if (viewId === 'planning-view') {
        updateTripDetails();
        renderDestinations();
        clearInterval(logisticsInterval);
        const logisticsDemo = document.getElementById('logistics-demo');
        if (logisticsDemo) logisticsDemo.classList.add('hidden');
    }
}

function getPlanMyTripUser() {
    try {
        const user = JSON.parse(localStorage.getItem('planmytrip_user') || 'null');
        return user && typeof user === 'object' && user.email ? user : null;
    } catch (error) {
        localStorage.removeItem('planmytrip_user');
        return null;
    }
}

function getUserLabel(user) {
    if (!user) return 'Traveler';
    if (user.name) return user.name;
    if (user.email) {
        return user.email
            .split('@')[0]
            .replace(/[._-]+/g, ' ')
            .replace(/\b\w/g, letter => letter.toUpperCase());
    }
    if (user.phone) return `User ${String(user.phone).slice(-4)}`;
    return 'Traveler';
}

function getUserInitials(user) {
    if (!user) return 'SR';
    const source = user.name || user.email?.split('@')[0] || 'SR';
    const parts = String(source).replace(/[^a-z0-9\s._-]/gi, '').split(/[\s._-]+/).filter(Boolean);
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return String(parts[0] || 'SR').slice(0, 2).toUpperCase();
}

function updateNavbarSession() {
    const user = getPlanMyTripUser();
    const userDisplay = document.getElementById('user-id-display');
    const accountWrap = document.getElementById('account-wrap');
    const accountMenuAvatar = document.getElementById('account-menu-avatar');
    const accountMenuName = document.getElementById('account-menu-name');
    const accountMenuEmail = document.getElementById('account-menu-email');
    const loginLink = document.getElementById('auth-login-link');
    const mobileUserLink = document.getElementById('mobile-user-link');
    const mobileLoginLink = document.getElementById('mobile-login-link');
    const referralBtn = document.getElementById('home-referral-code');

    const initials = getUserInitials(user);
    if (userDisplay) userDisplay.textContent = initials;
    if (accountMenuAvatar) accountMenuAvatar.textContent = initials;
    if (accountMenuName) accountMenuName.textContent = getUserLabel(user);
    if (accountMenuEmail) accountMenuEmail.textContent = user?.email || 'guest@planmytrip.com';
    if (referralBtn) {
        const codeText = referralBtn.querySelector('span');
        if (codeText) codeText.textContent = user?.referralCode || 'Login for Referral Code';
    }

    [accountWrap, mobileUserLink].forEach(el => {
        if (!el) return;
        el.classList.toggle('hidden', !user);
        if (el === accountWrap && user) el.classList.add('inline-flex');
    });

    [loginLink, mobileLoginLink].forEach(el => {
        if (!el) return;
        el.classList.toggle('hidden', Boolean(user));
    });
}

function copyHomeReferralCode() {
    const user = getPlanMyTripUser();
    if (!user?.referralCode) {
        window.location.href = 'login.html';
        return;
    }

    navigator.clipboard.writeText(user.referralCode).then(() => {
        const btn = document.getElementById('home-referral-code');
        const text = btn?.querySelector('span');
        if (!text) return;
        const original = text.textContent;
        text.textContent = 'Copied';
        window.setTimeout(() => {
            text.textContent = original;
        }, 1600);
    });
}

function attachNavbarClickAnimation() {
    document.querySelectorAll('.nav-link, .nav-cta, .auth-action').forEach(element => {
        element.addEventListener('click', event => {
            const rect = element.getBoundingClientRect();
            const ripple = document.createElement('span');
            ripple.className = 'nav-ripple';
            ripple.style.left = `${event.clientX - rect.left}px`;
            ripple.style.top = `${event.clientY - rect.top}px`;
            element.appendChild(ripple);
            ripple.addEventListener('animationend', () => ripple.remove());
        });
    });
}

function attachAccountMenu() {
    const trigger = document.getElementById('user-section-link');
    const menu = document.getElementById('account-menu');
    if (!trigger || !menu) return;

    const closeMenu = () => {
        menu.classList.remove('open');
        trigger.setAttribute('aria-expanded', 'false');
    };

    trigger.addEventListener('click', event => {
        event.preventDefault();
        event.stopPropagation();
        const isOpen = menu.classList.toggle('open');
        trigger.setAttribute('aria-expanded', String(isOpen));
    });

    menu.addEventListener('click', event => {
        event.stopPropagation();
    });

    document.addEventListener('click', closeMenu);
    document.addEventListener('keydown', event => {
        if (event.key === 'Escape') closeMenu();
    });
}

// ===== INITIALIZATION =====
window.addEventListener('load', () => {
    if (window.lucide) lucide.createIcons();

    renderReviews();
    renderDestinations();
    selectPayment('card', false);
    updateTripDetails();

    const mainApp = document.getElementById('main-app');
    if (mainApp) mainApp.classList.remove('hidden');

    const reviewWindow = document.getElementById('review-carousel-window');
    if (reviewWindow) {
        reviewWindow.addEventListener('mouseenter', pauseReviewScroll);
        reviewWindow.addEventListener('mouseleave', startReviewScroll);
    }

    const menuToggle = document.getElementById('mobile-menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', event => {
            event.stopPropagation();
            mobileMenu.classList.toggle('hidden');
        });

        document.addEventListener('click', event => {
            if (!mobileMenu.contains(event.target) && !menuToggle.contains(event.target)) {
                mobileMenu.classList.add('hidden');
            }
        });
    }

    const prevBtn = document.getElementById('prev-img');
    const nextBtn = document.getElementById('next-img');
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            imageIndex = (imageIndex - 1 + DESTINATION_GALLERY.length) % DESTINATION_GALLERY.length;
            renderImageCarousel();
        });
    }
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            imageIndex = (imageIndex + 1) % DESTINATION_GALLERY.length;
            renderImageCarousel();
        });
    }

    updateNavbarSession();
    attachNavbarClickAnimation();
    attachAccountMenu();

    startImageSlider();
    startReviewScroll();
    switchView('home-view');
});
