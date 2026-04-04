import React, { useState, useEffect, useMemo } from 'react';
import { Plane, Train, Car, Ship, MapPin, PlusCircle, CheckCircle, Clock, DollarSign, Menu, X } from 'lucide-react';

const initialStops = [
  { id: 1, city: "London, UK", transport: 'Plane', cost: 1200, duration: 180, notes: "Direct flight to Tokyo Haneda.", icon: Plane, status: 'Booked' },
  { id: 2, city: "Tokyo, Japan", transport: 'Train', cost: 150, duration: 90, notes: "Bullet train to Kyoto.", icon: Train, status: 'Planned' },
  { id: 3, city: "Kyoto, Japan", transport: 'Car', cost: 50, duration: 45, notes: "Rental car for local temples.", icon: Car, status: 'Planned' },
  { id: 4, city: "Osaka, Japan", transport: 'Ship', cost: 300, duration: 360, notes: "Ferry to Busan, S. Korea.", icon: Ship, status: 'Draft' },
  { id: 5, city: "Busan, S. Korea", transport: 'Plane', cost: 800, duration: 600, notes: "Return flight to London.", icon: Plane, status: 'Draft' },
];

const colors = {
  Booked: 'bg-green-500/10 text-green-400 border-green-400',
  Planned: 'bg-blue-500/10 text-blue-400 border-blue-400',
  Draft: 'bg-yellow-500/10 text-yellow-400 border-yellow-400',
};


const formatDuration = (minutes) => {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}h ${m}m`;
};


const StopCard = ({ stop, index, onSelect }) => {
  const Icon = stop.icon;
  const statusClasses = colors[stop.status] || 'bg-gray-500/10 text-gray-400 border-gray-400';

  return (
    <div
      onClick={() => onSelect(stop.id)}
      className="flex items-start p-4 mb-4 rounded-xl shadow-lg border-l-4 border-l-indigo-500 hover:bg-gray-800 transition duration-200 cursor-pointer bg-gray-900"
    >
      <div className={`p-2 rounded-full ${statusClasses} mr-4 flex-shrink-0`}>
        <Icon size={20} />
      </div>
      <div className="flex-grow">
        <h3 className="text-xl font-semibold text-white truncate">{index + 1}. {stop.city}</h3>
        <p className={`text-sm font-medium mt-1 inline-flex items-center px-2 py-0.5 rounded-full border ${statusClasses}`}>
          {stop.status}
        </p>
        <p className="text-gray-400 text-sm mt-1">{stop.notes}</p>
      </div>
      <div className="text-right flex-shrink-0 ml-4 hidden sm:block">
        <div className="flex items-center text-indigo-400 text-sm font-bold">
          <DollarSign size={14} className="mr-1" /> ${stop.cost.toLocaleString()}
        </div>
        <div className="flex items-center text-gray-400 text-sm mt-1">
          <Clock size={14} className="mr-1" /> {formatDuration(stop.duration)}
        </div>
      </div>
    </div>
  );
};

// --- Component: Detail/Map Panel (Adaptive Content) ---
const DetailPanel = ({ selectedStop, totalCost, totalDuration }) => {
  if (!selectedStop) {
    return (
      <div className="p-8 text-center bg-gray-800 rounded-xl h-full flex flex-col items-center justify-center">
        <MapPin size={48} className="text-indigo-500 mb-4" />
        <h2 className="text-2xl font-bold text-white">The Adaptive Traveler</h2>
        <p className="text-gray-400 mt-2 max-w-sm">
          Select a stop on the timeline to view the Real-Time Data Palette, or start adding your journey points!
        </p>

        {/* Global Trip Summary for Mobile Dashboard */}
        <div className="mt-8 p-4 bg-gray-900 rounded-xl w-full max-w-xs shadow-inner">
          <h4 className="text-lg font-semibold text-white mb-2">Trip Summary</h4>
          <div className="flex justify-between text-sm text-gray-300 border-b border-gray-700 pb-1 mb-1">
            <span>Total Stops:</span>
            <span className="font-bold text-indigo-400">5</span>
          </div>
          <div className="flex justify-between text-sm text-gray-300 border-b border-gray-700 pb-1 mb-1">
            <span>Total Budget:</span>
            <span className="font-bold text-indigo-400">${totalCost.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-300">
            <span>Total Travel Time:</span>
            <span className="font-bold text-indigo-400">{formatDuration(totalDuration)}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 h-full overflow-y-auto">
      <h2 className="text-3xl font-extrabold text-white mb-4">{selectedStop.city}</h2>
      <p className="text-indigo-400 font-medium mb-6 flex items-center">
        <CheckCircle size={18} className="mr-2" /> Current Status: {selectedStop.status}
      </p>

      {/* Real-Time Data Palette */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <div className="p-4 bg-gray-900 rounded-lg shadow-inner">
          <p className="text-sm text-gray-400">Transport Mode</p>
          <p className="text-xl font-bold text-white flex items-center mt-1">
            {/** dynamically render the transport icon component */}
            {selectedStop && selectedStop.icon ? (
              React.createElement(selectedStop.icon, { size: 20, className: "mr-2 text-indigo-300" })
            ) : null} {selectedStop.transport}
          </p>
        </div>
        <div className="p-4 bg-gray-900 rounded-lg shadow-inner">
          <p className="text-sm text-gray-400">Estimated Cost</p>
          <p className="text-xl font-bold text-white mt-1">
            ${selectedStop.cost.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Map Placeholder */}
      <div className="h-64 w-full bg-gray-900 rounded-xl flex items-center justify-center mb-6 border border-gray-700">
        <MapPin size={32} className="text-indigo-500" />
        <span className="text-white ml-3">Infinite Canvas Map Placeholder</span>
      </div>

      {/* Community Insight Panel */}
      <div className="bg-gray-800 p-4 rounded-xl border border-gray-700">
        <h4 className="text-lg font-semibold text-white mb-2">Community Insight: Tokyo</h4>
        <ul className="text-gray-300 text-sm space-y-2">
          <li className="flex items-start"><CheckCircle size={16} className="text-yellow-500 mr-2 mt-1 flex-shrink-0" /> Local Tip: The subway is efficient, but buy the Suica card immediately.</li>
          <li className="flex items-start"><CheckCircle size={16} className="text-yellow-500 mr-2 mt-1 flex-shrink-0" /> Top Activity: Ghibli Museum (book 3 months in advance!).</li>
        </ul>
      </div>

      <button className="mt-6 w-full py-3 bg-indigo-600 hover:bg-indigo-700 rounded-xl text-white font-bold transition duration-200 shadow-lg">
        View Optimization Options
      </button>
    </div>
  );
};

// --- Main Application Component ---
const App = () => {
  const [stops, setStops] = useState(initialStops);
  const [selectedStopId, setSelectedStopId] = useState(initialStops[0].id);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Computed Values for Summary
  const { totalCost, totalDuration } = useMemo(() => {
    return stops.reduce((acc, stop) => {
      acc.totalCost += stop.cost;
      acc.totalDuration += stop.duration;
      return acc;
    }, { totalCost: 0, totalDuration: 0 });
  }, [stops]);

  const selectedStop = stops.find(s => s.id === selectedStopId) || null;

  // Use this state to track if the detail panel is being viewed on mobile
  const [isDetailView, setIsDetailView] = useState(false);

  // Handle mobile selection logic
  const handleSelectStop = (id) => {
    setSelectedStopId(id);
    setIsDetailView(true); // Switch to detail view on mobile
  };

  const handleBackToTimeline = () => {
    setIsDetailView(false); // Switch back to timeline on mobile
    setSelectedStopId(null);
  };

  // Set the first stop as default on load
  useEffect(() => {
    // Set Firestore logging level to Debug (Required for compliance)
    console.log("Firestore Debugging is enabled for compliance.");
  }, []);


  return (
    <div className="min-h-screen bg-gray-950 font-sans antialiased text-gray-100">
      
      {/* --- Top Navigation (Always visible) --- */}
      <header className="bg-gray-900 border-b border-gray-800 shadow-xl p-4 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-extrabold text-indigo-400">The Adaptive Traveler</h1>
          
          {/* Mobile Menu Button */}
          <button
            className="p-2 lg:hidden text-white rounded-lg hover:bg-gray-700 transition"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          
          {/* Desktop Navigation (Hidden on mobile) */}
          <nav className="hidden lg:flex space-x-6 text-gray-300">
            <a href="#" className="hover:text-indigo-400 transition font-medium">Dashboard</a>
            <a href="#" className="hover:text-indigo-400 transition font-medium">Document Wallet</a>
            <a href="#" className="hover:text-indigo-400 transition font-medium">Community Insights</a>
            <a href="#" className="hover:text-indigo-400 transition font-medium">Profile</a>
          </nav>
        </div>
      </header>

      {/* --- Main Content Area --- */}
      <div className="max-w-7xl mx-auto p-4 lg:p-8">
        
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-6 border-b border-indigo-500 pb-2">
          Multi-Modal Journey Builder
        </h2>

        {/* The Grid: Switches layout based on screen size */}
        <div className="grid lg:grid-cols-12 gap-8 h-[calc(100vh-180px)]">

          {/* 1. Timeline / Itinerary Column (Mobile: Shows only if NOT in detail view) */}
          <div className={`lg:col-span-5 xl:col-span-4 overflow-y-auto ${isDetailView ? 'hidden lg:block' : 'block'} relative`}>
            <div className="p-4 bg-gray-800 rounded-xl shadow-2xl">
              <h3 className="text-xl font-bold text-white mb-4 flex justify-between items-center">
                Itinerary Timeline (5 Stops)
                <button
                  className="p-2 bg-indigo-600 hover:bg-indigo-700 rounded-full text-white"
                  aria-label="Add new stop"
                >
                  <PlusCircle size={20} />
                </button>
              </h3>
              
              {stops.map((stop, index) => (
                <StopCard key={stop.id} stop={stop} index={index} onSelect={handleSelectStop} />
              ))}
            </div>
          </div>

          {/* 2. Detail / Map Column (Mobile: Shows only if in detail view) */}
          <div className={`lg:col-span-7 xl:col-span-8 bg-gray-800 rounded-xl shadow-2xl ${isDetailView ? 'block' : 'hidden lg:block'}`}>
            
            {/* Back Button for Mobile Detail View */}
            {isDetailView && (
              <button
                className="lg:hidden p-3 m-4 bg-gray-700 rounded-lg text-white font-medium flex items-center"
                onClick={handleBackToTimeline}
              >
                <X size={18} className="mr-2" /> Back to Timeline
              </button>
            )}

            <DetailPanel
              selectedStop={selectedStop}
              totalCost={totalCost}
              totalDuration={totalDuration}
            />
          </div>

        </div>
      </div>
    </div>
  );
};
export default App;

// Render the App
ReactDOM.render(<App />, document.getElementById('root'));