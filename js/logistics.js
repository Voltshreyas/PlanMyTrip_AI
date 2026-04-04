// ===== LOGISTICS CONSTANTS =====
const LOGISTICS = {
    guideName: "Ravi Singh",
    guideRating: 4.92,
    carNumber: "MH 12 AB 3456",
    pickupSpot: "Terminal 2, Gate C (Near Parking P3)",
    safetyAct: "Monsoon Safety Act 🌧️",
};

let logisticsInterval;

// ===== LOGISTICS HANDLING =====
function finalizeBooking() {
    switchView('home-view');
    
    // Show logistics section
    const logisticsDemo = document.getElementById('logistics-demo');
    if (!logisticsDemo) {
        const section = document.createElement('section');
        section.id = 'logistics-demo';
        section.className = 'mt-12 step-card bg-white p-6 md:p-8 rounded-2xl shadow-lg border-t-4 border-red-500 animate-slide-up';
        section.innerHTML = `
            <h2 class="text-3xl font-bold text-gray-800 mb-6 pb-4 border-b-2 border-red-500 flex items-center">
                <i data-lucide="map-route" class="w-7 h-7 mr-3 text-red-600"></i> Real-Time Trip Logistics
            </h2>
            
            <div class="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded">
                <p id="safety-act-status" class="font-bold text-red-800 flex items-center">
                    <i data-lucide="alert-circle" class="w-5 h-5 mr-2"></i>
                    <span>Safety Protocol: Active</span>
                </p>
            </div>

            <div class="grid md:grid-cols-3 gap-6 mb-8">
                <div class="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                    <p class="text-xs font-bold text-blue-700 uppercase tracking-wide mb-3">Tour Guide</p>
                    <div class="flex items-start mb-3">
                        <i data-lucide="user-circle" class="w-10 h-10 text-blue-600 mr-3"></i>
                        <div>
                            <p id="guide-name" class="font-bold text-gray-800"></p>
                            <div class="flex items-center mt-1">
                                <i data-lucide="star" class="w-4 h-4 text-yellow-500 fill-yellow-500 mr-1"></i>
                                <span id="guide-rating" class="font-bold text-gray-700"></span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200">
                    <p class="text-xs font-bold text-green-700 uppercase tracking-wide mb-3">Vehicle Info</p>
                    <div class="flex items-center mb-3">
                        <i data-lucide="car" class="w-10 h-10 text-green-600 mr-3"></i>
                        <span id="car-number" class="font-bold text-lg text-gray-800"></span>
                    </div>
                    <div class="flex items-start text-sm text-gray-700">
                        <i data-lucide="map-pin" class="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0"></i>
                        <span id="pickup-spot"></span>
                    </div>
                </div>

                <div class="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-200 md:col-span-1 col-span-full">
                    <p class="text-xs font-bold text-purple-700 uppercase tracking-wide mb-3">Live Status</p>
                    <div id="map-placeholder" class="w-full h-24 rounded-lg flex items-center justify-center text-white font-bold text-center bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg">
                        <span id="live-status">Initializing...</span>
                    </div>
                </div>
            </div>

            <div class="bg-blue-50 p-4 rounded-xl border border-blue-200">
                <p class="text-sm text-blue-900">
                    <strong>💡 Tip:</strong> Real-time tracking shows your vehicle location. Your guide will contact you 30 minutes before pickup.
                </p>
            </div>
        `;
        document.getElementById('logistics-placeholder').appendChild(section);
        lucide.createIcons();
    }

    if (logisticsDemo) logisticsDemo.classList.remove('hidden');
    document.getElementById('checkout-view').classList.add('hidden');
    updateLiveLogistics();
}

function updateLiveLogistics() {
    clearInterval(logisticsInterval);
    
    const statuses = [
        { status: "🔄 Verifying Driver Details", color: "from-blue-400 to-blue-600" },
        { status: "🚗 Car is 15 mins away", color: "from-yellow-400 to-yellow-600" },
        { status: "📍 Car is 5 mins away", color: "from-orange-400 to-orange-600" },
        { status: "✅ Car Has Arrived!", color: "from-red-500 to-pink-600" },
        { status: "▶️ Trip in Progress", color: "from-indigo-400 to-indigo-600" },
        { status: "🏁 Safely Arrived!", color: "from-green-400 to-emerald-600" }
    ];

    let statusIndex = 0;
    const updateStatus = () => {
        const current = statuses[statusIndex % statuses.length];
        const mapPlaceholder = document.getElementById('map-placeholder');
        const liveStatusSpan = document.getElementById('live-status');
        
        if (mapPlaceholder && liveStatusSpan) {
            mapPlaceholder.className = `w-full h-24 rounded-lg flex items-center justify-center text-white font-bold text-center bg-gradient-to-r ${current.color} shadow-lg transition-all duration-1000`;
            liveStatusSpan.textContent = current.status;
        }
        statusIndex++;
    };

    updateStatus();
    logisticsInterval = setInterval(updateStatus, 4000);

    // Update logistics details
    const guideName = document.getElementById('guide-name');
    const guideRating = document.getElementById('guide-rating');
    const carNumber = document.getElementById('car-number');
    const pickupSpot = document.getElementById('pickup-spot');

    if (guideName) guideName.textContent = LOGISTICS.guideName;
    if (guideRating) guideRating.textContent = `${LOGISTICS.guideRating} / 5.0`;
    if (carNumber) carNumber.textContent = LOGISTICS.carNumber;
    if (pickupSpot) pickupSpot.textContent = LOGISTICS.pickupSpot;
}

function updateLogistics() {
    const stayToggle = document.getElementById('stay-together-toggle');
    const stayText = document.getElementById('stay-text');
    if (stayText) {
        stayText.textContent = stayToggle.checked ? 'Stay together' : 'Separate';
    }
}

// ===== SOCIAL MEDIA SHARING =====
function shareTrip(platform) {
    const destinations = Array.from(tripState.selectedDestinations)
        .map(id => DESTINATIONS.find(d => d.id === id)?.name)
        .join(', ');
    
    const messages = {
        facebook: `I just booked an amazing ${tripState.nightsCount}-night trip on PlanMyTrip! 🌍✈️ Destinations: ${destinations}. Use code PLANMYTRIP-SHREYAS for ₹750 discount!`,
        twitter: `Just booked my dream trip on @PlanMyTrip! ${tripState.nightsCount} nights to ${destinations} ✈️🌍 #TravelDiaries #IndiaTravel`,
        whatsapp: `Hey! Check out this amazing trip I booked! ${destinations} for ${tripState.nightsCount} nights. Use PlanMyTrip and my referral code for discounts! 🌍`,
        instagram: `Adventure awaits! ✈️🌍 Booking my next trip on PlanMyTrip #TravelAdventures #Wanderlust #ExploreIndia`,
        linkedin: `Excited to announce my upcoming business trip through PlanMyTrip! #Travel #Innovation`
    };

    const shareUrls = {
        facebook: `https://www.facebook.com/sharer/sharer.php?u=https://planmytrip.com&quote=${encodeURIComponent(messages.facebook)}`,
        twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(messages.twitter)}&url=https://planmytrip.com`,
        whatsapp: `https://wa.me/?text=${encodeURIComponent(messages.whatsapp)}`,
        instagram: 'https://www.instagram.com/',
        linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=https://planmytrip.com`
    };

    if (platform === 'instagram') {
        alert('📱 Open Instagram and share your trip photos with the hashtag #PlanMyTrip!');
    } else if (shareUrls[platform]) {
        window.open(shareUrls[platform], '_blank', 'width=600,height=400');
    }
}
