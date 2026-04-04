// ===== TRIP STATE MANAGEMENT =====
let tripState = {
    peopleCount: 1,
    nightsCount: 5,
    startDate: '2025-11-01',
    selectedDestinations: new Set(),
    isReferralApplied: false,
    selectedPayment: null,
};

let currentReferralDiscount = 0;

// ===== PRICING CONSTANTS =====
const PRICING = {
    GUIDE_FEE: 2500,
    PLATFORM_FEE: 1200,
    INCONVENIENCE_FEE: 500,
    GST_RATE: 0.18,
    REFERRAL_DISCOUNT_AMOUNT: 750,
    MINIMUM_BUDGET: 5000,
    MAXIMUM_BUDGET: 500000,
};

// Core Application Data
const VIEWS = ['home-view', 'about-us-view', 'upcoming-trips-view', 'registered-view', 'planning-view', 'checkout-view'];

const CAROUSEL_IMAGES = [
    'https://i0.wp.com/claudiosieberphotography.com/wp-content/uploads/2016/02/india-jammu-and-kashmir-leh-ladakh-34.jpg?ssl=1&fit=5760%2C2868',
    'https://c4.wallpaperflare.com/wallpaper/783/273/75/water-asia-india-andaman-wallpaper-preview.jpg',
    'https://images.pexels.com/photos/19160083/pexels-photo-19160083.jpeg',
    'https://thrillingtravel.in/wp-content/uploads/2017/04/IMG_6599-2.jpg',
    'https://assets.traveltriangle.com/blog/wp-content/uploads/2016/11/Living-root-bridge-6.jpg',
];

const REVIEWS = [
    { user: "Shreyas R.", text: "Outstanding! Saved us ₹5,000 with personalized budgeting. The app's smart filtering is incredible!", photo: "https://placehold.co/50x50/F97316/FFFFFF?text=SR" },
    { user: "Anuska S.", text: "Real-time tracking was spot-on! Car was exactly where the app said. Professional and reliable service.", photo: "https://placehold.co/50x50/34D399/FFFFFF?text=AS" },
    { user: "Amar R.", text: "Referral program is game-changing! Earned ₹2,500 simply by sharing with friends. Brilliant concept!", photo: "https://placehold.co/50x50/8B5CF6/FFFFFF?text=AR" },
    { user: "Saanvi B.", text: "Safety alerts during monsoon were lifesaving. This company truly prioritizes traveler wellness.", photo: "https://placehold.co/50x50/EC4899/FFFFFF?text=SB" },
    { user: "Saradiya R.", text: "Seamless from booking to checkout. Best travel booking experience I've had. 5 stars!", photo: "https://placehold.co/50x50/22C55E/FFFFFF?text=SR" }
];

const DESTINATIONS = [
    { id: 'goa', name: 'South Goa Beaches', costPerPerson: 4000, review: 4.8, weather: "Best enjoyed in afternoons when humidity is lower.", isHiddenGem: false, emoji: '🏖️' },
    { id: 'udaipur', name: 'Udaipur City Palace', costPerPerson: 5500, review: 4.6, weather: "Early morning visits offer cooler temperatures and fewer crowds.", isHiddenGem: false, emoji: '🏰' },
    { id: 'meghalaya', name: 'Meghalaya Living Bridges', costPerPerson: 8000, review: 4.9, weather: "Wear sturdy footwear for slippery trails after rain.", isHiddenGem: true, emoji: '🌿' },
    { id: 'hampi', name: 'Hampi Ruins & Temples', costPerPerson: 3000, review: 4.7, weather: "Early morning photography is absolutely stunning.", isHiddenGem: false, emoji: '⛩️' },
    { id: 'kashmir', name: 'Kashmir Valley', costPerPerson: 7500, review: 4.9, weather: "Spring tulips (April-May) create magical landscapes.", isHiddenGem: true, emoji: '🌸' },
    { id: 'leh', name: 'Leh-Ladakh', costPerPerson: 9000, review: 4.8, weather: "Acclimatize for altitude (11,500 ft). Best in summer.", isHiddenGem: false, emoji: '⛰️' },
    { id: 'kerala', name: 'Kerala Backwaters', costPerPerson: 6000, review: 4.7, weather: "Monsoon offers lush greenery and fewer tourists.", isHiddenGem: false, emoji: '🌊' },
    { id: 'varanasi', name: 'Varanasi Ghats', costPerPerson: 4500, review: 4.6, weather: "Sunrise boat rides are absolutely magical.", isHiddenGem: false, emoji: '🛕' },
    { id: 'andaman', name: 'Andaman Islands', costPerPerson: 8500, review: 4.8, weather: "Perfect for water sports during dry season (Nov-May).", isHiddenGem: true, emoji: '🏝️' },
    { id: 'rann', name: 'Rann of Kutch', costPerPerson: 5500, review: 4.7, weather: "Rann Utsav festival (Dec-Feb) is unmissable.", isHiddenGem: false, emoji: '🌈' },
    { id: 'coorg', name: 'Coorg Coffee Estates', costPerPerson: 5000, review: 4.8, weather: "Dec-Feb is perfect for coffee plantations.", isHiddenGem: true, emoji: '☕' },
    { id: 'kaziranga', name: 'Kaziranga National Park', costPerPerson: 7000, review: 4.7, weather: "Nov-Apr is best for rhino spotting.", isHiddenGem: false, emoji: '🦏' },
];

// ===== UTILITY FUNCTIONS =====
const formatINR = (amount) => {
    return `₹ ${new Intl.NumberFormat('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount)}`;
};

const formatSimpleINR = (amount) => {
    return `₹ ${new Intl.NumberFormat('en-IN').format(Math.round(amount))}`;
};

const validateBudget = (budget) => budget >= PRICING.MINIMUM_BUDGET && budget <= PRICING.MAXIMUM_BUDGET;

// ===== DATE CALCULATIONS =====
function calculateEndDate() {
    const startDate = new Date(document.getElementById('start-date').value);
    const nights = parseInt(document.getElementById('nights-count').value) || 1;
    
    if (startDate instanceof Date && !isNaN(startDate)) {
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + nights);
        const options = { month: 'short', day: 'numeric', year: 'numeric' };
        document.getElementById('end-date').textContent = endDate.toLocaleDateString('en-US', options);
    }
}

function updateTripDetails() {
    tripState.peopleCount = Math.max(1, parseInt(document.getElementById('people-count').value) || 1);
    tripState.nightsCount = Math.max(1, parseInt(document.getElementById('nights-count').value) || 1);
    tripState.startDate = document.getElementById('start-date').value;
    
    document.getElementById('people-count').value = tripState.peopleCount;
    document.getElementById('nights-count').value = tripState.nightsCount;
    
    calculateEndDate();
    calculateTotal();
    renderSummary();
}

// ===== DESTINATION MANAGEMENT =====
function toggleDestination(id) {
    const checkbox = document.getElementById(`dest-check-${id}`);
    if (checkbox.checked) {
        tripState.selectedDestinations.add(id);
    } else {
        tripState.selectedDestinations.delete(id);
    }
    calculateTotal();
    renderDestinations();
    renderSummary();
}

function calculateBaseTripCost() {
    if (tripState.selectedDestinations.size === 0) return 0;
    
    let totalCostPerPerson = 0;
    tripState.selectedDestinations.forEach(id => {
        const dest = DESTINATIONS.find(d => d.id === id);
        if (dest) totalCostPerPerson += dest.costPerPerson;
    });

    const baseCost = totalCostPerPerson * tripState.peopleCount * (tripState.nightsCount / 5);
    return Math.round(baseCost);
}

// ===== PRICING CALCULATIONS =====
function calculateTotal() {
    const baseTripCost = calculateBaseTripCost();
    const feesTotal = PRICING.GUIDE_FEE + PRICING.PLATFORM_FEE + PRICING.INCONVENIENCE_FEE;
    const gstAmount = feesTotal * PRICING.GST_RATE;
    
    let preDiscountTotal = baseTripCost + feesTotal + gstAmount;

    if (tripState.isReferralApplied) {
        currentReferralDiscount = PRICING.REFERRAL_DISCOUNT_AMOUNT;
    } else {
        currentReferralDiscount = 0;
    }

    let grandTotal = Math.max(0, preDiscountTotal - currentReferralDiscount);

    // Update UI
    document.getElementById('base-trip-cost').textContent = formatSimpleINR(baseTripCost);
    document.getElementById('guide-fee').textContent = formatSimpleINR(PRICING.GUIDE_FEE);
    document.getElementById('platform-fee').textContent = formatSimpleINR(PRICING.PLATFORM_FEE);
    document.getElementById('inconvenience-fee').textContent = formatSimpleINR(PRICING.INCONVENIENCE_FEE);
    document.getElementById('gst-fee').textContent = formatSimpleINR(gstAmount);
    
    const discountElement = document.getElementById('referral-discount');
    discountElement.textContent = `${currentReferralDiscount > 0 ? '- ' : ''}${formatSimpleINR(currentReferralDiscount)}`;
    
    document.getElementById('grand-total').textContent = formatSimpleINR(grandTotal);
    const checkoutTotal = document.getElementById('final-total-checkout');
    if (checkoutTotal) checkoutTotal.textContent = formatSimpleINR(grandTotal);
}

// ===== REFERRAL CODE HANDLING =====
function applyReferral(fromSwitch) {
    const codeInput = document.getElementById('referral-code').value.toUpperCase().trim();
    const referralSwitch = document.getElementById('referral-switch');
    
    if (codeInput === 'TRIPWISE101' || codeInput === 'PLANMYTRIP-SHREYAS') {
        if (!fromSwitch) {
            referralSwitch.disabled = false;
            referralSwitch.checked = true;
        }
        tripState.isReferralApplied = referralSwitch.checked;
    } else {
        referralSwitch.checked = false;
        referralSwitch.disabled = true;
        tripState.isReferralApplied = false;
    }
    calculateTotal();
}

function toggleReferral() {
    applyReferral(true);
}

// ===== DESTINATION RENDERING =====
function renderDestinations() {
    const container = document.getElementById('destination-options');
    if (!container) return;
    
    container.innerHTML = '';

    DESTINATIONS.forEach(dest => {
        const checked = tripState.selectedDestinations.has(dest.id);
        const card = document.createElement('div');
        card.className = `p-4 rounded-lg border-2 transition cursor-pointer card-hover ${checked ? 'bg-green-100 border-green-500 shadow-md' : 'bg-gray-50 border-gray-300 hover:border-gray-400'}`;
        card.onclick = () => {
            document.getElementById(`dest-check-${dest.id}`).click();
        };
        
        card.innerHTML = `
            <div class="flex items-start justify-between mb-2">
                <div class="flex items-center space-x-2">
                    <input type="checkbox" id="dest-check-${dest.id}" class="w-5 h-5 text-green-600 rounded cursor-pointer"
                        onclick="event.stopPropagation(); toggleDestination('${dest.id}')" ${checked ? 'checked' : ''}>
                    <div>
                        <label for="dest-check-${dest.id}" class="font-bold text-gray-800 cursor-pointer flex items-center">
                            <span class="mr-2">${dest.emoji}</span> ${dest.name}
                        </label>
                        <div class="flex items-center mt-1">
                            <i data-lucide="star" class="w-3 h-3 text-yellow-500 fill-yellow-500 mr-1"></i>
                            <span class="text-xs text-gray-600">${dest.review}</span>
                        </div>
                    </div>
                </div>
                <span class="text-sm font-bold text-gray-700 bg-white px-2 py-1 rounded">${formatSimpleINR(dest.costPerPerson)}</span>
            </div>
            <div class="text-xs text-blue-700 bg-blue-50 p-2 rounded mt-2 flex items-start">
                <i data-lucide="info" class="w-4 h-4 mr-2 flex-shrink-0 mt-0.5"></i>
                <span><strong>Tip:</strong> ${dest.weather}</span>
            </div>
        `;
        container.appendChild(card);
    });
    lucide.createIcons();
}

// ===== SUMMARY RENDERING =====
function renderSummary() {
    const summaryList = document.getElementById('itinerary-summary');
    if (!summaryList) return;
    
    summaryList.innerHTML = '';
    
    if (tripState.selectedDestinations.size === 0) {
        summaryList.innerHTML = '<li class="text-gray-600 font-medium">Select destinations to begin</li>';
        return;
    }

    tripState.selectedDestinations.forEach(id => {
        const dest = DESTINATIONS.find(d => d.id === id);
        if (dest) {
            const li = document.createElement('li');
            li.className = 'flex justify-between items-center p-2 bg-gray-50 rounded hover:bg-gray-100 transition';
            li.innerHTML = `
                <span class="font-medium text-gray-800">${dest.emoji} ${dest.name}</span>
                <span class="text-xs text-gray-600">${formatSimpleINR(dest.costPerPerson)}</span>
            `;
            summaryList.appendChild(li);
        }
    });
}
