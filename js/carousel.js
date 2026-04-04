// ===== CAROUSEL FUNCTIONS =====
let imageIndex = 0;
let imageInterval;

function renderImageCarousel() {
    const container = document.getElementById('image-carousel');
    if (!container) return;
    
    container.innerHTML = '';

    const imagesToShow = [];
    for (let i = -1; i <= 1; i++) {
        let index = (imageIndex + i + CAROUSEL_IMAGES.length) % CAROUSEL_IMAGES.length;
        imagesToShow.push({ index: index, src: CAROUSEL_IMAGES[index], active: i === 0 });
    }

    imagesToShow.forEach(imgData => {
        const img = document.createElement('img');
        img.src = imgData.src;
        img.alt = 'Destination';
        img.className = `carousel-item h-full object-cover rounded-lg w-40 sm:w-1/2 md:w-1/3 lg:w-1/4 ${imgData.active ? 'active' : ''}`;
        container.appendChild(img);
    });
}

function startImageSlider() {
    renderImageCarousel();
    clearInterval(imageInterval);
    imageInterval = setInterval(() => {
        imageIndex = (imageIndex + 1) % CAROUSEL_IMAGES.length;
        renderImageCarousel();
    }, 4000);
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
