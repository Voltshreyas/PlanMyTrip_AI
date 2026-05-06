import re

with open('frontend/bookings.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Update Head & Body & Header
head_replacement = """<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Bookings - PlanMyTrip</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Outfit:wght@400;600;700;800;900&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="../css/styles.css">
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/lucide@latest"></script>
    <style>
        body { font-family: 'Inter', sans-serif; }
        h1, h2, h3, h4, .font-outfit { font-family: 'Outfit', sans-serif; }
        .glass { background: rgba(255, 255, 255, 0.85); backdrop-filter: blur(16px); border: 1px solid rgba(255, 255, 255, 0.6); }
        .bg-gradient-premium { background: linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%); }
        .status-dot { width: 8px; height: 8px; border-radius: 50%; display: inline-block; }
        .animate-pulse-subtle { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: .7; } }
        .tab-content { display: none; }
        .tab-content.active { display: block; animation: fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1); }
        
        .booking-card { transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1); border: 1px solid rgba(255,255,255,0.8); }
        .booking-card:hover { transform: translateY(-8px); box-shadow: 0 30px 60px -10px rgba(79, 70, 229, 0.15); border-color: rgba(79, 70, 229, 0.1); }
        
        .fade-in { animation: fadeIn 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        
        @keyframes slideDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-slide-down { animation: slideDown 0.3s ease-out forwards; }

        .tab-btn { transition: all 0.3s ease; }
        .tab-btn.active { background: linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%); color: white; box-shadow: 0 10px 20px -5px rgba(79, 70, 229, 0.3); }
        .tab-btn:not(.active):hover { background: rgba(79, 70, 229, 0.05); color: #4f46e5; }

        /* Modal Animations */
        .modal-overlay { animation: fadeInOverlay 0.3s ease-out; }
        @keyframes fadeInOverlay { from { opacity: 0; } to { opacity: 1; } }
        .modal-content { animation: slideUpModal 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @keyframes slideUpModal { from { opacity: 0; transform: translateY(40px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
        
        /* Custom Scrollbar */
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
    </style>
</head>
<body class="bg-indigo-50/20 min-h-screen flex flex-col relative overflow-x-hidden">
    <!-- Premium Header & Navigation -->
    <header class="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100/50 shadow-sm">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-3 flex items-center justify-between gap-4">
            <!-- Logo -->
            <a href="../index.html" class="flex items-center gap-2.5 group flex-shrink-0">
                <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center shadow-md shadow-indigo-300/40 transition-transform group-hover:scale-110">
                    <i data-lucide="plane" class="w-5 h-5 text-white"></i>
                </div>
                <span class="text-xl font-extrabold" style="font-family:'Outfit',sans-serif;background:linear-gradient(135deg,#4f46e5,#06b6d4);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;">
                    PlanMyTrip
                </span>
            </a>

            <!-- Desktop Nav -->
            <nav class="hidden md:flex items-center gap-1">
                <a id="nav-home" href="../index.html" class="nav-link flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 transition-all font-semibold">
                    <i data-lucide="home" class="w-4 h-4"></i> Home
                </a>
                <a id="nav-destinations" href="../destination.html" class="nav-link flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 transition-all font-semibold">
                    <i data-lucide="map-pin" class="w-4 h-4"></i> Destinations
                </a>
                <a id="nav-about" href="mission.html" class="nav-link flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 transition-all font-semibold">
                    <i data-lucide="info" class="w-4 h-4"></i> Mission
                </a>
                <a id="nav-bookings" href="bookings.html" class="nav-link flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-indigo-600 bg-indigo-50 font-semibold transition-all">
                    <i data-lucide="calendar" class="w-4 h-4"></i> Bookings
                </a>
                <a id="nav-referrals" href="referral.html" class="nav-link flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 transition-all font-semibold">
                    <i data-lucide="gift" class="w-4 h-4"></i> Referrals
                </a>
                <a href="plannewtrip.html" class="ml-3 flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold text-white shadow-md shadow-indigo-300/40 transition-all hover:scale-105 bg-gradient-premium">
                    <i data-lucide="rocket" class="w-3.5 h-3.5"></i> Plan Trip
                </a>
            </nav>

            <!-- Right side -->
            <div class="flex items-center gap-2 sm:gap-3">
                <div class="hidden sm:flex items-center gap-2 bg-indigo-50 border border-indigo-100 px-3 py-1.5 rounded-xl">
                    <i data-lucide="user-circle" class="w-4 h-4 text-indigo-500"></i>
                    <span class="text-xs font-bold text-indigo-700 max-w-[80px] truncate" id="user-id-display">User</span>
                </div>
                <a href="logout.html" title="Logout" class="flex items-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-500 font-semibold py-1.5 px-3 rounded-xl transition-all text-sm border border-red-100">
                    <i data-lucide="log-out" class="w-3.5 h-3.5"></i>
                    <span class="hidden sm:inline">Logout</span>
                </a>
                <a href="users.html"><img class="user-avatar w-9 h-9 rounded-full object-cover cursor-pointer hover:ring-2 hover:ring-indigo-300 transition-all" src="https://placehold.co/40x40/4F46E5/FFFFFF?text=SR" alt="User Avatar" id="user-avatar-img"></a>
                <!-- Hamburger -->
                <button id="mobile-menu-toggle" class="md:hidden flex items-center justify-center w-9 h-9 rounded-xl text-gray-600" style="background:rgba(79,70,229,0.07);border:1.5px solid rgba(79,70,229,0.12);">
                    <i data-lucide="menu" class="w-5 h-5"></i>
                </button>
            </div>
        </div>

        <!-- Mobile Menu -->
        <div id="mobile-menu" class="md:hidden hidden animate-slide-down mx-4 mb-3 p-3 space-y-1" style="background:rgba(255,255,255,0.96);backdrop-filter:blur(16px);border-radius:1rem;border:1px solid rgba(79,70,229,0.1);box-shadow:0 8px 32px rgba(79,70,229,0.1);">
            <a id="nav-home-mobile" href="../index.html" class="nav-link flex items-center gap-2.5 px-3 py-2.5 text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 rounded-lg transition-all font-semibold text-sm">
                <i data-lucide="home" class="w-4 h-4"></i> Home
            </a>
            <a id="nav-destinations-mobile" href="../destination.html" class="nav-link flex items-center gap-2.5 px-3 py-2.5 text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 rounded-lg transition-all font-semibold text-sm">
                <i data-lucide="map-pin" class="w-4 h-4"></i> Destinations
            </a>
            <a id="nav-about-mobile" href="mission.html" class="nav-link flex items-center gap-2.5 px-3 py-2.5 text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 rounded-lg transition-all font-semibold text-sm">
                <i data-lucide="info" class="w-4 h-4"></i> Our Mission
            </a>
            <a id="nav-bookings-mobile" href="bookings.html" class="nav-link flex items-center gap-2.5 px-3 py-2.5 text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 rounded-lg transition-all font-semibold text-sm">
                <i data-lucide="calendar" class="w-4 h-4"></i> Bookings
            </a>
            <a id="nav-referrals-mobile" href="referral.html" class="nav-link flex items-center gap-2.5 px-3 py-2.5 text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 rounded-lg transition-all font-semibold text-sm">
                <i data-lucide="gift" class="w-4 h-4"></i> Referrals
            </a>
        </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
        <!-- Hero Section -->
        <div class="relative overflow-hidden mb-12 p-8 md:p-14 rounded-[2.5rem] shadow-2xl bg-gradient-to-br from-indigo-900 via-indigo-800 to-blue-900 text-white fade-in" style="border: 1px solid rgba(255,255,255,0.1);">
            <div class="absolute -top-32 -right-32 w-[30rem] h-[30rem] bg-cyan-400/20 rounded-full blur-[100px] pointer-events-none"></div>
            <div class="absolute -bottom-32 -left-32 w-[30rem] h-[30rem] bg-indigo-500/20 rounded-full blur-[100px] pointer-events-none"></div>
            
            <div class="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
                <div>
                    <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold mb-5 bg-white/10 border border-white/20 text-cyan-200">
                        <i data-lucide="sparkles" class="w-3.5 h-3.5"></i> Manage Your Journeys
                    </div>
                    <h1 class="text-4xl md:text-5xl lg:text-6xl font-black mb-4 tracking-tight" style="line-height:1.1;">Your Travel<br/><span class="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-indigo-300">Command Center</span></h1>
                    <p class="text-indigo-100 text-lg md:text-xl font-medium max-w-lg opacity-90">Review upcoming adventures, cherish past memories, and manage your travel history effortlessly.</p>
                </div>
                <div class="flex-shrink-0 animate-slide-down" style="animation-delay:0.3s;">
                    <a href="plannewtrip.html" class="group bg-white text-indigo-900 px-8 py-4 rounded-2xl font-black shadow-[0_15px_30px_rgba(0,0,0,0.2)] hover:shadow-[0_20px_40px_rgba(255,255,255,0.3)] transition-all hover:scale-105 flex items-center gap-3">
                        <div class="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center group-hover:rotate-90 transition-transform duration-500">
                            <i data-lucide="plus" class="w-5 h-5 text-indigo-600"></i>
                        </div>
                        Craft New Journey
                    </a>
                </div>
            </div>
        </div>

        <!-- Bookings Tabs -->
        <div class="flex gap-2 md:gap-4 mb-10 p-2 bg-white/60 backdrop-blur-xl shadow-xl shadow-indigo-100/50 rounded-[1.5rem] w-full md:w-fit overflow-x-auto border border-white fade-in" style="animation-delay: 0.1s;">
            <button class="tab-btn active px-6 md:px-8 py-3.5 rounded-xl font-bold whitespace-nowrap" data-tab="upcoming">
                <i data-lucide="clock" class="inline w-4 h-4 mr-2 mb-0.5"></i>Upcoming
            </button>
            <button class="tab-btn px-6 md:px-8 py-3.5 rounded-xl font-bold text-gray-500 whitespace-nowrap" data-tab="past">
                <i data-lucide="check-circle-2" class="inline w-4 h-4 mr-2 mb-0.5"></i>Past Trips
            </button>
            <button class="tab-btn px-6 md:px-8 py-3.5 rounded-xl font-bold text-gray-500 whitespace-nowrap" data-tab="cancelled">
                <i data-lucide="x-circle" class="inline w-4 h-4 mr-2 mb-0.5"></i>Cancelled
            </button>
        </div>"""

html = re.sub(
    r'<head>.*?</head>.*?<body class="bg-gray-50 min-h-screen">.*?<div class="flex gap-2 md:gap-4 mb-8 p-1 bg-gray-100 rounded-2xl w-full md:w-fit overflow-x-auto">.*?</div>',
    head_replacement,
    html,
    flags=re.DOTALL
)

# 2. Update Card styles (glassmorphism)
html = html.replace('bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 group fade-in', 'glass bg-white/80 rounded-3xl shadow-xl overflow-hidden group fade-in hover:bg-white/95')

# 3. Update Modals styles for backdrop blur & better overlay
html = html.replace('fixed inset-0 bg-black bg-opacity-50 hidden z-50', 'fixed inset-0 bg-[rgba(15,23,42,0.6)] backdrop-blur-md hidden z-50 modal-overlay')
html = html.replace('bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto', 'bg-white/95 backdrop-blur-xl rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto modal-content shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] border border-white/50')
html = html.replace('bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto', 'bg-white/95 backdrop-blur-xl rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto modal-content shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] border border-white/50')
html = html.replace('bg-white rounded-3xl max-w-2xl w-full', 'bg-white/95 backdrop-blur-xl rounded-3xl max-w-2xl w-full modal-content shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] border border-white/50')

# 4. Remove mobile menu JS implementation if there was an old one, or add it if missing.
script_replacement = """        // Mobile Menu Toggle
        const menuToggle = document.getElementById('mobile-menu-toggle');
        const mobileMenu = document.getElementById('mobile-menu');
        if (menuToggle && mobileMenu) {
            menuToggle.addEventListener('click', () => {
                mobileMenu.classList.toggle('hidden');
            });
        }

        // Tab functionality
        const tabButtons = document.querySelectorAll('.tab-btn');
        const tabContents = document.querySelectorAll('.tab-content');

        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Remove active class from all buttons
                tabButtons.forEach(btn => {
                    btn.classList.remove('active');
                    btn.classList.add('text-gray-500');
                });

                // Add active class to clicked button
                button.classList.add('active');
                button.classList.remove('text-gray-500');

                // Hide all tab contents
                tabContents.forEach(content => content.classList.remove('active'));

                // Show selected tab content
                const tabId = button.getAttribute('data-tab');
                document.getElementById(tabId).classList.add('active');
            });
        });"""

html = re.sub(
    r'// Tab functionality.*?document\.getElementById\(tabId\)\.classList\.add\(\'active\'\);\n\s*}\);\n\s*}\);',
    script_replacement,
    html,
    flags=re.DOTALL
)

with open('frontend/bookings.html', 'w', encoding='utf-8') as f:
    f.write(html)
