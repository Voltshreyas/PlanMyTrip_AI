// ===== LOGISTICS CONSTANTS =====
const LOGISTICS = {
    guideName: "Ravi Singh",
    guideRating: 4.92,
    carNumber: "MH 12 AB 3456",
    pickupSpot: "Terminal 2, Gate C (Near Parking P3)",
    safetyAct: "Monsoon Safety Protocol",
};

let logisticsInterval;

// ===== LOGISTICS HANDLING =====
function finalizeBooking() {
    switchView('upcoming-trips-view');

    if (!document.getElementById('logistics-demo')) {
        const section = document.createElement('section');
        section.id = 'logistics-demo';
        section.className = 'mt-8 panel bg-white p-5 md:p-7 animate-slide-up';
        section.innerHTML = `
            <h2 class="text-3xl font-black text-gray-800 mb-6 pb-4 border-b border-gray-200 flex items-center">
                <i data-lucide="map-route" class="w-7 h-7 mr-3 text-emerald-700"></i> Real-Time Trip Logistics
            </h2>

            <div class="mb-6 p-4 bg-emerald-50 border border-emerald-100 rounded-lg">
                <p id="safety-act-status" class="font-bold text-emerald-900 flex items-center">
                    <i data-lucide="alert-circle" class="w-5 h-5 mr-2"></i>
                    <span>Safety Protocol: Active</span>
                </p>
            </div>

            <div class="grid md:grid-cols-3 gap-6 mb-8">
                <div class="p-4 bg-emerald-50 rounded-lg border border-emerald-100">
                    <p class="text-xs font-bold text-emerald-700 uppercase tracking-wide mb-3">Tour Guide</p>
                    <div class="flex items-start mb-3">
                        <i data-lucide="user-circle" class="w-10 h-10 text-emerald-700 mr-3"></i>
                        <div>
                            <p id="guide-name" class="font-bold text-gray-800"></p>
                            <div class="flex items-center mt-1">
                                <i data-lucide="star" class="w-4 h-4 text-yellow-500 fill-yellow-500 mr-1"></i>
                                <span id="guide-rating" class="font-bold text-gray-700"></span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="p-4 bg-emerald-50 rounded-lg border border-emerald-100">
                    <p class="text-xs font-bold text-emerald-700 uppercase tracking-wide mb-3">Vehicle Info</p>
                    <div class="flex items-center mb-3">
                        <i data-lucide="car" class="w-10 h-10 text-emerald-700 mr-3"></i>
                        <span id="car-number" class="font-bold text-lg text-gray-800"></span>
                    </div>
                    <div class="flex items-start text-sm text-gray-700">
                        <i data-lucide="map-pin" class="w-4 h-4 text-emerald-700 mr-2 mt-0.5 flex-shrink-0"></i>
                        <span id="pickup-spot"></span>
                    </div>
                </div>

                <div class="p-4 bg-slate-50 rounded-lg border border-slate-200 md:col-span-1 col-span-full">
                    <p class="text-xs font-bold text-slate-700 uppercase tracking-wide mb-3">Live Status</p>
                    <div id="map-placeholder" class="w-full h-48 rounded-lg shadow-lg relative overflow-hidden bg-slate-200">
                        <div class="absolute inset-0 flex items-center justify-center z-10 pointer-events-none transition-opacity duration-500" id="map-overlay">
                            <span id="live-status" class="bg-black/70 text-white px-3 py-1 rounded-full text-sm font-bold backdrop-blur-sm">Initializing...</span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="bg-slate-50 p-4 rounded-lg border border-slate-200">
                <p class="text-sm text-slate-700">
                    <strong>Tip:</strong> Real-time tracking shows your vehicle location. Your guide will contact you 30 minutes before pickup.
                </p>
            </div>
        `;
        document.getElementById('logistics-placeholder').appendChild(section);
        lucide.createIcons();
    }

    document.getElementById('logistics-demo')?.classList.remove('hidden');
    updateLiveLogistics();
}

function updateLiveLogistics() {
    clearInterval(logisticsInterval);

    const statuses = [
        { status: "Verifying driver details", color: "from-teal-500 to-emerald-600" },
        { status: "Car is 15 mins away", color: "from-amber-500 to-orange-600" },
        { status: "Car is 5 mins away", color: "from-orange-500 to-rose-600" },
        { status: "Car has arrived", color: "from-emerald-600 to-teal-700" },
        { status: "Trip in progress", color: "from-sky-600 to-teal-600" },
        { status: "Safely arrived", color: "from-green-600 to-emerald-700" }
    ];

    let statusIndex = 0;
    const updateStatus = () => {
        const current = statuses[statusIndex % statuses.length];
        const liveStatusSpan = document.getElementById('live-status');
        const mapOverlay = document.getElementById('map-overlay');

        if (liveStatusSpan) {
            liveStatusSpan.textContent = current.status;
            if (mapOverlay) {
                // Flash the background color of the overlay label to match status
                liveStatusSpan.className = `px-3 py-1 rounded-full text-sm font-bold backdrop-blur-md text-white shadow-lg bg-gradient-to-r ${current.color} transition-all duration-1000`;
            }
        }
        statusIndex++;
    };

    updateStatus();
    logisticsInterval = setInterval(updateStatus, 4000);

    const guideName = document.getElementById('guide-name');
    const guideRating = document.getElementById('guide-rating');
    const carNumber = document.getElementById('car-number');
    const pickupSpot = document.getElementById('pickup-spot');

    if (guideName) guideName.textContent = LOGISTICS.guideName;
    if (guideRating) guideRating.textContent = `${LOGISTICS.guideRating} / 5.0`;
    if (carNumber) carNumber.textContent = LOGISTICS.carNumber;
    if (pickupSpot) pickupSpot.textContent = LOGISTICS.pickupSpot;

    // Load Google Map dynamically
    initializeGoogleMap();
}

let mapInstance = null;
let markerInstance = null;

async function initializeGoogleMap() {
    try {
        await loadGoogleMapsApi();

        const mapElement = document.getElementById('map-placeholder');
        if (!mapElement || mapInstance) return;

        // Coordinates for a generic India central point or user's destination
        const mapCenter = { lat: 20.5937, lng: 78.9629 }; 
        
        mapInstance = new google.maps.Map(mapElement, {
            center: mapCenter,
            zoom: 5,
            mapTypeId: 'roadmap',
            disableDefaultUI: true,
            zoomControl: true,
            styles: [
                {
                    featureType: "all",
                    elementType: "geometry.fill",
                    stylers: [{ weight: "2.00" }]
                },
                {
                    featureType: "all",
                    elementType: "geometry.stroke",
                    stylers: [{ color: "#9c9c9c" }]
                },
                {
                    featureType: "all",
                    elementType: "labels.text",
                    stylers: [{ visibility: "on" }]
                },
                {
                    featureType: "landscape",
                    elementType: "all",
                    stylers: [{ color: "#f2f2f2" }]
                },
                {
                    featureType: "landscape",
                    elementType: "geometry.fill",
                    stylers: [{ color: "#ffffff" }]
                },
                {
                    featureType: "landscape.man_made",
                    elementType: "geometry.fill",
                    stylers: [{ color: "#ffffff" }]
                },
                {
                    featureType: "poi",
                    elementType: "all",
                    stylers: [{ visibility: "off" }]
                },
                {
                    featureType: "road",
                    elementType: "all",
                    stylers: [{ saturation: -100 }, { lightness: 45 }]
                },
                {
                    featureType: "road",
                    elementType: "geometry.fill",
                    stylers: [{ color: "#eeeeee" }]
                },
                {
                    featureType: "road",
                    elementType: "labels.text.fill",
                    stylers: [{ color: "#7b7b7b" }]
                },
                {
                    featureType: "road",
                    elementType: "labels.text.stroke",
                    stylers: [{ color: "#ffffff" }]
                },
                {
                    featureType: "road.highway",
                    elementType: "all",
                    stylers: [{ visibility: "simplified" }]
                },
                {
                    featureType: "road.arterial",
                    elementType: "labels.icon",
                    stylers: [{ visibility: "off" }]
                },
                {
                    featureType: "transit",
                    elementType: "all",
                    stylers: [{ visibility: "off" }]
                },
                {
                    featureType: "water",
                    elementType: "all",
                    stylers: [{ color: "#46bcec" }, { visibility: "on" }]
                },
                {
                    featureType: "water",
                    elementType: "geometry.fill",
                    stylers: [{ color: "#c8d7d4" }]
                },
                {
                    featureType: "water",
                    elementType: "labels.text.fill",
                    stylers: [{ color: "#070707" }]
                },
                {
                    featureType: "water",
                    elementType: "labels.text.stroke",
                    stylers: [{ color: "#ffffff" }]
                }
            ]
        });

        markerInstance = new google.maps.Marker({
            position: mapCenter,
            map: mapInstance,
            animation: google.maps.Animation.DROP,
            title: "Your Tour Guide",
            icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 10,
                fillColor: "#0f766e",
                fillOpacity: 1,
                strokeWeight: 2,
                strokeColor: "#ffffff"
            }
        });

        // Add a slight movement simulation to make it feel alive
        setInterval(() => {
            if (markerInstance && mapInstance) {
                const pos = markerInstance.getPosition();
                const newLat = pos.lat() + (Math.random() - 0.5) * 0.05;
                const newLng = pos.lng() + (Math.random() - 0.5) * 0.05;
                const newPos = new google.maps.LatLng(newLat, newLng);
                markerInstance.setPosition(newPos);
                mapInstance.panTo(newPos);
            }
        }, 5000);

    } catch (error) {
        console.error("Error initializing Google Maps:", error);
    }
}



function updateLogistics() {
    const stayToggle = document.getElementById('stay-together-toggle');
    const stayText = document.getElementById('stay-text');
    if (stayText && stayToggle) {
        stayText.textContent = stayToggle.checked ? 'Stay together' : 'Separate';
    }
}

// ===== SOCIAL MEDIA SHARING =====
function shareTrip(platform) {
    const destinations = Array.from(tripState.selectedDestinations)
        .map(id => DESTINATIONS.find(d => d.id === id)?.name)
        .filter(Boolean)
        .join(', ') || 'India';

    const messages = {
        facebook: `I just booked an amazing ${tripState.nightsCount}-night trip on PlanMyTrip. Destinations: ${destinations}. Use code PLANMYTRIP-SHREYAS for Rs 750 discount!`,
        twitter: `Just booked my dream trip on @PlanMyTrip: ${tripState.nightsCount} nights to ${destinations}. #TravelDiaries #IndiaTravel`,
        whatsapp: `Hey! Check out this amazing trip I booked: ${destinations} for ${tripState.nightsCount} nights. Use PlanMyTrip and my referral code for discounts.`,
        instagram: `Adventure awaits. Booking my next trip on PlanMyTrip #TravelAdventures #Wanderlust #ExploreIndia`,
        linkedin: `Excited to announce my upcoming business trip through PlanMyTrip. #Travel #Innovation`
    };

    const shareUrls = {
        facebook: `https://www.facebook.com/sharer/sharer.php?u=https://planmytrip.com&quote=${encodeURIComponent(messages.facebook)}`,
        twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(messages.twitter)}&url=https://planmytrip.com`,
        whatsapp: `https://wa.me/?text=${encodeURIComponent(messages.whatsapp)}`,
        instagram: 'https://www.instagram.com/',
        linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=https://planmytrip.com`
    };

    if (platform === 'instagram') {
        alert('Open Instagram and share your trip photos with the hashtag #PlanMyTrip!');
    } else if (shareUrls[platform]) {
        window.open(shareUrls[platform], '_blank', 'width=600,height=400');
    }
}
