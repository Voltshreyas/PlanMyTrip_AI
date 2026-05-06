// Curated high-quality travel images
const DESTINATION_GALLERY = [
    { title: 'Leh Ladakh', location: 'Jammu & Kashmir', img: 'assets/images/leh ladakh.jpg' },
    { title: 'Kedarnath Temple', location: 'Uttarakhand', img: 'assets/images/Kedarnath Temple.jpg' },
    { title: 'Varanasi Ghats', location: 'Uttar Pradesh', img: 'assets/images/Manikarnika Ghat.jpg' },
    { title: 'Darjeeling Tea Gardens', location: 'West Bengal', img: 'assets/images/Darjeling Tea Garden.jpg' },
    { title: 'Taj Mahal', location: 'Agra', img: 'assets/images/Taj Mahal.jpg' },
    { title: 'Hawa Mahal', location: 'Rajasthan', img: 'assets/images/Hawa Mahal.jpg' }
];

let imageIndex = 0;
let imageInterval;

function renderImageCarousel() {
    const container = document.getElementById('image-carousel');
    if (!container) return;
    
    container.innerHTML = '';

    // Render cards from the current index onwards
    for (let i = 0; i < DESTINATION_GALLERY.length; i++) {
        const item = DESTINATION_GALLERY[(imageIndex + i) % DESTINATION_GALLERY.length];
        
        const card = document.createElement('div');
        card.className = 'dest-card-premium group';
        card.innerHTML = `
            <img src="${item.img}" alt="${item.title}" class="group-hover:scale-110 transition-transform duration-700">
            <div class="dest-card-overlay">
                <div class="mb-1 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <span class="text-[10px] font-bold uppercase tracking-[2px] text-cyan-400">Hidden Gem</span>
                    <h4 class="text-xl font-black leading-tight">${item.title}</h4>
                    <p class="text-xs text-white/70 flex items-center gap-1 mt-1 font-medium">
                        <i data-lucide="map-pin" class="w-3 h-3"></i> ${item.location}
                    </p>
                </div>
            </div>
        `;
        container.appendChild(card);
    }
    lucide.createIcons();
}

function startImageSlider() {
    renderImageCarousel();
    clearInterval(imageInterval);
    imageInterval = setInterval(() => {
        imageIndex = (imageIndex + 1) % DESTINATION_GALLERY.length;
        renderImageCarousel();
    }, 5000); // 5 sec per slide
}

// ===== REVIEW CAROUSEL =====
let reviewCarouselIndex = 0;
let reviewCarouselInterval;

function renderReviews() {
    const container = document.getElementById('review-carousel-content');
    if (!container) return;
    
    container.innerHTML = '';
    
    const fullReviewList = [...REVIEWS, ...REVIEWS, ...REVIEWS];
    
    fullReviewList.forEach((review, idx) => {
        const div = document.createElement('div');
        div.className = 'review-card bg-white rounded-xl shadow-md flex-shrink-0 border border-gray-200 overflow-hidden group';
        div.classList.add(idx % 2 ? 'animate-slide-in-right' : 'animate-slide-in-left');
        
        div.innerHTML = `
            <div class="p-4">
                <div class="flex items-start mb-3">
                    <img src="${review.photo}" alt="${review.user}" class="w-12 h-12 rounded-full mr-3 border-2 border-blue-400 object-cover">
                    <div class="flex-1">
                        <p class="font-bold text-sm text-blue-800">${review.user}</p>
                        <div class="flex items-center text-yellow-500 text-xs">
                            <i data-lucide="star" class="w-3 h-3 fill-yellow-500 mr-1"></i>
                            <span>${review.rating || '4.8'}</span>
                        </div>
                    </div>
                </div>
                <p class="text-gray-700 text-sm leading-relaxed">${review.text}</p>
            </div>
        `;
        container.appendChild(div);
    });
    updateReviewActiveState();
    lucide.createIcons();
}

function updateReviewActiveState() {
    const items = document.querySelectorAll('.review-card');
    items.forEach((item, index) => {
        const isActive = index === reviewCarouselIndex + 1;
        item.classList.toggle('active', isActive);
        if (isActive) {
            item.classList.add('fade-in');
            setTimeout(() => item.classList.remove('fade-in'), 500);
        }
    });
}

function scrollReviews() {
    const content = document.getElementById('review-carousel-content');
    if (!content) return;
    
    const firstCard = content.children[0];
    const scrollDistance = firstCard ? firstCard.offsetWidth + 24 : 374;

    reviewCarouselIndex++;
    
    if (reviewCarouselIndex >= REVIEWS.length) {
        content.style.transition = 'none';
        content.style.transform = `translateX(-${scrollDistance * (REVIEWS.length - 1)}px)`;
        reviewCarouselIndex = 0;
        
        setTimeout(() => {
            content.style.transition = 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
            content.style.transform = 'translateX(0)';
            updateReviewActiveState();
        }, 50);
    } else {
        content.style.transition = 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
        content.style.transform = `translateX(-${reviewCarouselIndex * scrollDistance}px)`;
        updateReviewActiveState();
    }
}

function startReviewScroll() {
    clearInterval(reviewCarouselInterval);
    reviewCarouselInterval = setInterval(scrollReviews, 3000);
    updateReviewActiveState();
}

function pauseReviewScroll() {
    clearInterval(reviewCarouselInterval);
}

// ===== SWIPE SUPPORT =====
function addSwipeListener(elementId, onSwipeLeft, onSwipeRight) {
    const el = document.getElementById(elementId);
    if (!el) return;

    let touchStartX = 0;
    let touchEndX = 0;

    el.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
        if (elementId === 'review-carousel-window') pauseReviewScroll();
    }, { passive: true });

    el.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
        if (elementId === 'review-carousel-window') startReviewScroll();
    }, { passive: true });

    function handleSwipe() {
        const swipeThreshold = 50;
        if (touchEndX < touchStartX - swipeThreshold) {
            onSwipeLeft();
        }
        if (touchEndX > touchStartX + swipeThreshold) {
            onSwipeRight();
        }
    }
}

// Initialize swipe listeners when DOM is ready
window.addEventListener('DOMContentLoaded', () => {
    addSwipeListener('image-carousel', 
        () => { // Swipe Left -> Next
            imageIndex = (imageIndex + 1) % DESTINATION_GALLERY.length;
            renderImageCarousel();
        },
        () => { // Swipe Right -> Prev
            imageIndex = (imageIndex - 1 + DESTINATION_GALLERY.length) % DESTINATION_GALLERY.length;
            renderImageCarousel();
        }
    );

    addSwipeListener('review-carousel-window', 
        () => { // Swipe Left -> Next review
            scrollReviews();
        },
        () => { // Swipe Right -> Previous (simplified to just scrolling forward for now to maintain review index logic)
            reviewCarouselIndex = (reviewCarouselIndex - 2 + REVIEWS.length) % REVIEWS.length;
            scrollReviews();
        }
    );
});
