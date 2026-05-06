// maps.js - Centralized Google Maps Utility

const MapsConfig = {
    apiKey: null,
    isLoaded: false,
    loadingPromise: null
};

/**
 * Dynamically fetches the API key and loads the Google Maps JavaScript API.
 * Ensures the script is only loaded once.
 */
async function loadGoogleMapsApi() {
    if (MapsConfig.isLoaded) return Promise.resolve();
    
    if (MapsConfig.loadingPromise) return MapsConfig.loadingPromise;

    MapsConfig.loadingPromise = new Promise(async (resolve, reject) => {
        try {
            // Check if google maps is already loaded
            if (window.google && window.google.maps) {
                MapsConfig.isLoaded = true;
                return resolve();
            }

            const res = await fetch('/api/config/maps');
            const data = await res.json();
            
            if (data.success && data.key) {
                MapsConfig.apiKey = data.key;
                
                const script = document.createElement('script');
                script.src = `https://maps.googleapis.com/maps/api/js?key=${data.key}&libraries=places,geometry`;
                script.async = true;
                script.defer = true;
                
                script.onload = () => {
                    MapsConfig.isLoaded = true;
                    resolve();
                };
                script.onerror = (err) => {
                    console.error("Failed to load Google Maps script", err);
                    reject(err);
                };
                
                document.head.appendChild(script);
            } else {
                console.warn('Could not fetch Google Maps API key from backend');
                reject(new Error('API key not found'));
            }
        } catch (error) {
            console.error("Error loading Google Maps API:", error);
            reject(error);
        }
    });

    return MapsConfig.loadingPromise;
}

/**
 * Initializes Google Places Autocomplete on a given input element.
 * @param {string} inputId - The ID of the input element
 * @param {object} options - Autocomplete options (e.g., types: ['(cities)'])
 */
async function initAutocomplete(inputId, options = { types: ['(cities)'] }) {
    try {
        await loadGoogleMapsApi();
        const input = document.getElementById(inputId);
        if (input) {
            const autocomplete = new google.maps.places.Autocomplete(input, options);
            
            // Prevent form submission on enter key
            input.addEventListener('keydown', function(e) {
                if (e.key === 'Enter') {
                    e.preventDefault();
                }
            });
            
            return autocomplete;
        }
    } catch (err) {
        console.error("Autocomplete init failed for", inputId, err);
    }
}
