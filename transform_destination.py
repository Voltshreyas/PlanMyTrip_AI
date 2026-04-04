import re

filepath = 'destination.html'

with open(filepath, 'r', encoding='utf-8') as f:
    html = f.read()

# Define the new header and styles
header_replacement = """    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Outfit:wght@400;600;700;800;900&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="css/styles.css">
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/lucide@latest"></script>
    <style>
        body { font-family: 'Inter', sans-serif; }
        h1, h2, h3, h4, .font-outfit { font-family: 'Outfit', sans-serif; }
        .glass { background: rgba(255, 255, 255, 0.85); backdrop-filter: blur(16px); border: 1px solid rgba(255, 255, 255, 0.6); }
        .bg-gradient-premium { background: linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%); }
        
        .fade-in { animation: fadeIn 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        
        @keyframes slideDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-slide-down { animation: slideDown 0.3s ease-out forwards; }
        
        @keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        .animate-slide-up { animation: slideUp 0.6s ease-out forwards; }

        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: #94a3b8; }

        .destination-card {
            background: rgba(255,255,255,0.95);
            backdrop-filter: blur(10px);
            border-radius: 2rem;
            overflow: hidden;
            border: 1px solid rgba(255,255,255,0.5);
            box-shadow: 0 15px 35px rgba(15, 23, 42, 0.05);
            transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease, border-color 0.4s ease;
        }

        .destination-card:hover {
            transform: translateY(-12px);
            box-shadow: 0 30px 60px rgba(79, 70, 229, 0.15);
            border-color: rgba(79, 70, 229, 0.2);
        }

        .destination-image {
            width: 100%;
            height: 250px;
            object-fit: cover;
            transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .destination-card:hover .destination-image {
            transform: scale(1.08);
        }

        .filter-btn {
            padding: 12px 24px;
            border: 1px solid rgba(79, 70, 229, 0.2);
            border-radius: 999px;
            cursor: pointer;
            transition: all 0.3s ease;
            background: rgba(255,255,255,0.8);
            backdrop-filter: blur(8px);
            color: #4f46e5;
            font-weight: 700;
            box-shadow: 0 4px 6px rgba(79, 70, 229, 0.05);
        }

        .filter-btn.active {
            background: linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%);
            color: white;
            border-color: transparent;
            transform: translateY(-2px);
            box-shadow: 0 10px 20px -5px rgba(79, 70, 229, 0.3);
        }

        .filter-btn:hover:not(.active) {
            background: rgba(79, 70, 229, 0.05);
            transform: translateY(-2px);
        }

        .map-card {
            background: rgba(255,255,255,0.95);
            backdrop-filter: blur(16px);
            border-radius: 2rem;
            box-shadow: 0 20px 50px rgba(15, 23, 42, 0.08);
            overflow: hidden;
            border: 1px solid rgba(255,255,255,0.5);
            transition: transform 0.3s;
        }
        
        .map-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 30px 60px rgba(15, 23, 42, 0.12);
        }

        .map-card iframe {
            width: 100%;
            min-height: 340px;
            border: none;
        }

        .map-card .map-footer {
            padding: 1rem 1.5rem 1.25rem;
            background: rgba(248, 250, 252, 0.8);
            color: #475569;
            font-size: 0.95rem;
        }

        .price-tag {
            background: linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%);
            color: white;
            padding: 8px 16px;
            border-radius: 20px;
            font-weight: bold;
            display: inline-block;
            box-shadow: 0 4px 15px rgba(79, 70, 229, 0.3);
        }
    </style>
</head>
<body class="bg-indigo-50/20 min-h-screen flex flex-col relative overflow-x-hidden">
    <!-- Premium Header & Navigation -->
    <header class="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100/50 shadow-sm">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-3 flex items-center justify-between gap-4">
            <!-- Logo -->
            <a href="index.html" class="flex items-center gap-2.5 group flex-shrink-0">
                <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center shadow-md shadow-indigo-300/40 transition-transform group-hover:scale-110">
                    <i data-lucide="plane" class="w-5 h-5 text-white"></i>
                </div>
                <span class="text-xl font-extrabold" style="font-family:'Outfit',sans-serif;background:linear-gradient(135deg,#4f46e5,#06b6d4);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;">
                    PlanMyTrip
                </span>
            </a>

            <!-- Desktop Nav -->
            <nav class="hidden md:flex items-center gap-1">
                <a id="nav-home" href="index.html" class="nav-link flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 transition-all font-semibold">
                    <i data-lucide="home" class="w-4 h-4"></i> Home
                </a>
                <a id="nav-destinations" href="destination.html" class="nav-link flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-indigo-600 bg-indigo-50 font-semibold transition-all">
                    <i data-lucide="map-pin" class="w-4 h-4"></i> Destinations
                </a>
                <a id="nav-about" href="frontend/mission.html" class="nav-link flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 transition-all font-semibold">
                    <i data-lucide="info" class="w-4 h-4"></i> Mission
                </a>
                <a id="nav-bookings" href="frontend/bookings.html" class="nav-link flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 transition-all font-semibold">
                    <i data-lucide="calendar" class="w-4 h-4"></i> Bookings
                </a>
                <a id="nav-referrals" href="frontend/referral.html" class="nav-link flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 transition-all font-semibold">
                    <i data-lucide="gift" class="w-4 h-4"></i> Referrals
                </a>
                <a href="frontend/plannewtrip.html" class="ml-3 flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold text-white shadow-md shadow-indigo-300/40 transition-all hover:scale-105 bg-gradient-premium">
                    <i data-lucide="rocket" class="w-3.5 h-3.5"></i> Plan Trip
                </a>
            </nav>

            <!-- Right side -->
            <div class="flex items-center gap-2 sm:gap-3">
                <div class="hidden sm:flex items-center gap-2 bg-indigo-50 border border-indigo-100 px-3 py-1.5 rounded-xl">
                    <i data-lucide="user-circle" class="w-4 h-4 text-indigo-500"></i>
                    <span class="text-xs font-bold text-indigo-700 max-w-[80px] truncate" id="user-id-display">User</span>
                </div>
                <a href="frontend/logout.html" title="Logout" class="flex items-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-500 font-semibold py-1.5 px-3 rounded-xl transition-all text-sm border border-red-100">
                    <i data-lucide="log-out" class="w-3.5 h-3.5"></i>
                    <span class="hidden sm:inline">Logout</span>
                </a>
                <a href="frontend/users.html"><img class="user-avatar w-9 h-9 rounded-full object-cover cursor-pointer hover:ring-2 hover:ring-indigo-300 transition-all" src="https://placehold.co/40x40/4F46E5/FFFFFF?text=SR" alt="User Avatar" id="user-avatar-img"></a>
                <!-- Hamburger -->
                <button id="mobile-menu-toggle" class="md:hidden flex items-center justify-center w-9 h-9 rounded-xl text-gray-600" style="background:rgba(79,70,229,0.07);border:1.5px solid rgba(79,70,229,0.12);">
                    <i data-lucide="menu" class="w-5 h-5"></i>
                </button>
            </div>
        </div>

        <!-- Mobile Menu -->
        <div id="mobile-menu" class="md:hidden hidden animate-slide-down mx-4 mb-3 p-3 space-y-1" style="background:rgba(255,255,255,0.96);backdrop-filter:blur(16px);border-radius:1rem;border:1px solid rgba(79,70,229,0.1);box-shadow:0 8px 32px rgba(79,70,229,0.1);">
            <a id="nav-home-mobile" href="index.html" class="nav-link flex items-center gap-2.5 px-3 py-2.5 text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 rounded-lg transition-all font-semibold text-sm">
                <i data-lucide="home" class="w-4 h-4"></i> Home
            </a>
            <a id="nav-destinations-mobile" href="destination.html" class="nav-link flex items-center gap-2.5 px-3 py-2.5 text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 rounded-lg transition-all font-semibold text-sm">
                <i data-lucide="map-pin" class="w-4 h-4"></i> Destinations
            </a>
            <a id="nav-about-mobile" href="frontend/mission.html" class="nav-link flex items-center gap-2.5 px-3 py-2.5 text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 rounded-lg transition-all font-semibold text-sm">
                <i data-lucide="info" class="w-4 h-4"></i> Our Mission
            </a>
            <a id="nav-bookings-mobile" href="frontend/bookings.html" class="nav-link flex items-center gap-2.5 px-3 py-2.5 text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 rounded-lg transition-all font-semibold text-sm">
                <i data-lucide="calendar" class="w-4 h-4"></i> Bookings
            </a>
            <a id="nav-referrals-mobile" href="frontend/referral.html" class="nav-link flex items-center gap-2.5 px-3 py-2.5 text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 rounded-lg transition-all font-semibold text-sm">
                <i data-lucide="gift" class="w-4 h-4"></i> Referrals
            </a>
            <a href="frontend/plannewtrip.html" class="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white mt-1 bg-gradient-premium">
                <i data-lucide="rocket" class="w-4 h-4"></i> Start Planning
            </a>
        </div>
    </header>
"""

# 1. Update <head> and <body> till just before Hero Section
html = re.sub(
    r'<link href="https://fonts\.googleapis\.com/.*?<div class="max-w-7xl mx-auto mb-12 animate-slide-up">',
    header_replacement + '\n    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1">\n        <!-- Hero Section -->\n        <div class="max-w-7xl mx-auto mb-16 animate-slide-up bg-white/70 backdrop-blur-md rounded-[3rem] p-12 shadow-xl border border-white/80">',
    html,
    flags=re.DOTALL
)

# 2. Update the Hero buttons with exact new gradients
html = html.replace('from-blue-600 to-indigo-600', 'from-indigo-600 to-cyan-500')
html = html.replace('text-blue-700 border border-blue-200 bg-white', 'text-indigo-600 border border-indigo-200 bg-white/80 backdrop-blur-sm')

# 3. Update the Search & Filter section bg
html = html.replace('bg-white p-6 rounded-2xl shadow-lg', 'glass bg-white/80 p-8 rounded-[2rem] shadow-xl border border-white/50')
html = html.replace('border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500', 'border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 bg-white/60')

# 4. Javascript updates to the generated cards
js_button_update = """<button onclick="bookDestination('${dest.id}')" class="w-full bg-gradient-premium hover:shadow-lg hover:-translate-y-1 text-white font-bold py-3 rounded-xl transition-all">"""
html = re.sub(r'<button onclick="bookDestination\([^"]+"\)" class="w-full [^>]+>', js_button_update, html)

# 5. Add footer script closing and structural tags
html = html.replace('<!-- Initial render', """        const menuToggle = document.getElementById('mobile-menu-toggle');
        const mobileMenu = document.getElementById('mobile-menu');
        if (menuToggle && mobileMenu) {
            menuToggle.addEventListener('click', () => {
                mobileMenu.classList.toggle('hidden');
            });
        }
        
        // Initial render""")

html = html.replace('</body>', '</main>\n</body>')

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(html)

print("destination.html successfully upgraded!")
