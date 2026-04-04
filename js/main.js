// ===== VIEW MANAGEMENT =====
function switchView(viewId) {
    // hide all views then show the selected
    VIEWS.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.add('hidden');
    });

    const target = document.getElementById(viewId);
    if (target) {
        target.classList.remove('hidden');
        target.style.opacity = '0';
        setTimeout(() => {
            target.style.transition = 'opacity 0.3s ease-in';
            target.style.opacity = '1';
        }, 10);
    }

    // highlight active nav links (desktop + mobile)
    document.querySelectorAll('.nav-link').forEach(l => {
        l.classList.remove('text-indigo-600', 'text-blue-600', 'font-semibold', 'bg-indigo-50', 'active');
    });
    const map = {
        'home-view': ['nav-home','nav-home-mobile'],
        'planning-view': ['nav-plantrip','nav-plantrip-mobile'],
        'about-us-view': ['nav-about','nav-about-mobile'],
        'upcoming-trips-view': ['nav-bookings','nav-bookings-mobile'],
        'registered-view': ['nav-referrals','nav-referrals-mobile']
    };
    (map[viewId]||[]).forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.classList.add('text-indigo-600','font-semibold','bg-indigo-50','active');
        }
    });

    if (viewId === 'planning-view') {
        updateTripDetails();
        renderDestinations();
        clearInterval(logisticsInterval);
        const logisticsDemo = document.getElementById('logistics-demo');
        if (logisticsDemo) logisticsDemo.classList.add('hidden');
    }
}

// ===== INITIALIZATION =====
window.addEventListener('load', function() {
    lucide.createIcons();
    renderReviews();
    renderDestinations();
    selectPayment('card', false);
    updateTripDetails();

    // Remove login screen - app starts directly
    document.getElementById('main-app').classList.remove('hidden');

    const windowElement = document.getElementById('review-carousel-window');
    if (windowElement) {
        windowElement.addEventListener('mouseenter', pauseReviewScroll);
        windowElement.addEventListener('mouseleave', startReviewScroll);
    }

    // mobile menu toggle logic
    const menuToggle = document.getElementById('mobile-menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
            mobileMenu.classList.add('animate-slide-down');
        });
        // Close mobile menu when any mobile nav link is clicked
        mobileMenu.querySelectorAll('.nav-link').forEach(l => {
            l.addEventListener('click', () => mobileMenu.classList.add('hidden'));
        });
    }

    // carousel arrow controls
    const prevBtn = document.getElementById('prev-img');
    const nextBtn = document.getElementById('next-img');
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            imageIndex = (imageIndex - 1 + CAROUSEL_IMAGES.length) % CAROUSEL_IMAGES.length;
            renderImageCarousel();
        });
    }
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            imageIndex = (imageIndex + 1) % CAROUSEL_IMAGES.length;
            renderImageCarousel();
        });
    }

    // Display user info
    if (currentUser) {
        document.getElementById('user-id-display').textContent = `User ${currentUser.phone.slice(-4)}`;
    }

    // Start carousels
    startImageSlider();
    startReviewScroll();
    switchView('home-view');
});
