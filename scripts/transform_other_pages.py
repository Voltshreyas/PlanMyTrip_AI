import re
import os

header_and_styles = """    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Outfit:wght@400;600;700;800;900&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="../css/styles.css">
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
        .animate-float { animation: float 6s ease-in-out infinite; }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-20px); } }
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
                <a id="nav-bookings" href="bookings.html" class="nav-link flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 transition-all font-semibold">
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
    </header>"""

js_mobile_toggle = """
    <!-- Footer -->
    <footer class="bg-white border-t border-gray-100 py-12 mt-auto">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-500">
            <p>&copy; 2024 PlanMyTrip. Registered travel logistics provider.</p>
        </div>
    </footer>
    <script>
        lucide.createIcons();
        const menuToggle = document.getElementById('mobile-menu-toggle');
        const mobileMenu = document.getElementById('mobile-menu');
        if (menuToggle && mobileMenu) {
            menuToggle.addEventListener('click', () => {
                mobileMenu.classList.toggle('hidden');
            });
        }
    </script>
</body>"""


def process_file(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            html = f.read()

        # Update Head & Body & Inject Header
        # Match from <link href="https://fonts... or similar up to top of body
        html = re.sub(
            r'<script src="https://cdn\.tailwindcss\.com"></script>.*?</head>\s*<body.*?>\s*(?:<!--.*?-->)?\s*(<div|<main|<section)',
            header_and_styles + r'\n    \1',
            html,
            flags=re.DOTALL
        )
        
        # Replace simple body without matches 
        html = re.sub(
            r'</head>\s*<body[^>]*>\s*(<main|<section|<div)',
            header_and_styles + r'\n    \1',
            html,
            flags=re.DOTALL,
            count=1
        )
        
        # In users.html specifically, update dashboard elements to be glassier and more animated
        html = html.replace('bg-white p-8 rounded-3xl shadow-xl border border-gray-100', 'glass bg-white/90 p-8 rounded-[2rem] shadow-xl hover:shadow-2xl transition-all duration-300 fade-in')
        html = html.replace('bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden', 'glass bg-white/90 rounded-[2rem] shadow-xl border border-white overflow-hidden fade-in')
        html = html.replace('bg-gradient-premium p-6 rounded-3xl text-white shadow-xl', 'bg-gradient-premium p-8 rounded-[2rem] text-white shadow-[0_20px_40px_rgba(79,70,229,0.2)] hover:shadow-[0_20px_40px_rgba(79,70,229,0.4)] transition-all duration-300 hover:-translate-y-2 fade-in')
        html = html.replace('bg-white p-6 rounded-3xl shadow-xl border border-gray-100 text-center', 'glass bg-white/90 p-8 rounded-[2rem] shadow-xl border border-white text-center hover:shadow-2xl transition-all hover:scale-[1.02] fade-in')
        html = html.replace('bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 mb-8', 'glass bg-white/90 rounded-[2rem] shadow-2xl overflow-hidden border border-white mb-10 fade-in')

        # In mission.html make value boxes glass
        html = html.replace('bg-white p-10 rounded-3xl shadow-xl hover:shadow-2xl transition-all border border-gray-100 group', 'glass bg-white/90 p-10 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-white group fade-in hover:-translate-y-2')
        html = html.replace('bg-white p-10 rounded-3xl shadow-xl hover:shadow-2xl transition-all border border-gray-100 group translate-y-6', 'glass bg-white/90 p-10 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-white group translate-y-6 fade-in hover:translate-y-2')
        
        # Replace footer and script block
        html = re.sub(
            r'<!-- Footer -->.*?</footer>.*</body>',
            js_mobile_toggle,
            html,
            flags=re.DOTALL
        )
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(html)
            
        print(f"Successfully processed {filepath}")
        
    except Exception as e:
        print(f"Failed to process {filepath}: {e}")

process_file('frontend/users.html')
process_file('frontend/mission.html')
