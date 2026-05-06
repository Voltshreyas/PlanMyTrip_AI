/**
 * PlanMyTrip — Shared City & Airport Autocomplete
 * Used by: bus.html, flight.html, hotel.html, accomodation.html
 */

const CITIES = [
    { name: 'New Delhi', state: 'Delhi', airport: 'DEL', type: 'city' },
    { name: 'Mumbai', state: 'Maharashtra', airport: 'BOM', type: 'city' },
    { name: 'Bengaluru', state: 'Karnataka', airport: 'BLR', type: 'city' },
    { name: 'Chennai', state: 'Tamil Nadu', airport: 'MAA', type: 'city' },
    { name: 'Hyderabad', state: 'Telangana', airport: 'HYD', type: 'city' },
    { name: 'Kolkata', state: 'West Bengal', airport: 'CCU', type: 'city' },
    { name: 'Pune', state: 'Maharashtra', airport: 'PNQ', type: 'city' },
    { name: 'Ahmedabad', state: 'Gujarat', airport: 'AMD', type: 'city' },
    { name: 'Jaipur', state: 'Rajasthan', airport: 'JAI', type: 'city' },
    { name: 'Lucknow', state: 'Uttar Pradesh', airport: 'LKO', type: 'city' },
    { name: 'Chandigarh', state: 'Punjab', airport: 'IXC', type: 'city' },
    { name: 'Goa', state: 'Goa', airport: 'GOI', type: 'city' },
    { name: 'Kochi', state: 'Kerala', airport: 'COK', type: 'city' },
    { name: 'Thiruvananthapuram', state: 'Kerala', airport: 'TRV', type: 'city' },
    { name: 'Bhopal', state: 'Madhya Pradesh', airport: 'BHO', type: 'city' },
    { name: 'Indore', state: 'Madhya Pradesh', airport: 'IDR', type: 'city' },
    { name: 'Nagpur', state: 'Maharashtra', airport: 'NAG', type: 'city' },
    { name: 'Surat', state: 'Gujarat', airport: 'STV', type: 'city' },
    { name: 'Vadodara', state: 'Gujarat', airport: 'BDQ', type: 'city' },
    { name: 'Amritsar', state: 'Punjab', airport: 'ATQ', type: 'city' },
    { name: 'Agra', state: 'Uttar Pradesh', airport: 'AGR', type: 'city' },
    { name: 'Varanasi', state: 'Uttar Pradesh', airport: 'VNS', type: 'city' },
    { name: 'Kanpur', state: 'Uttar Pradesh', airport: null, type: 'city' },
    { name: 'Prayagraj', state: 'Uttar Pradesh', airport: 'IXD', type: 'city' },
    { name: 'Gorakhpur', state: 'Uttar Pradesh', airport: 'GOP', type: 'city' },
    { name: 'Patna', state: 'Bihar', airport: 'PAT', type: 'city' },
    { name: 'Ranchi', state: 'Jharkhand', airport: 'IXR', type: 'city' },
    { name: 'Bhubaneswar', state: 'Odisha', airport: 'BBI', type: 'city' },
    { name: 'Guwahati', state: 'Assam', airport: 'GAU', type: 'city' },
    { name: 'Haridwar', state: 'Uttarakhand', airport: null, type: 'city' },
    { name: 'Dehradun', state: 'Uttarakhand', airport: 'DED', type: 'city' },
    { name: 'Jodhpur', state: 'Rajasthan', airport: 'JDH', type: 'city' },
    { name: 'Udaipur', state: 'Rajasthan', airport: 'UDR', type: 'city' },
    { name: 'Jaisalmer', state: 'Rajasthan', airport: 'JSA', type: 'city' },
    { name: 'Ajmer', state: 'Rajasthan', airport: null, type: 'city' },
    { name: 'Jammu', state: 'J&K', airport: 'IXJ', type: 'city' },
    { name: 'Srinagar', state: 'J&K', airport: 'SXR', type: 'city' },
    { name: 'Leh', state: 'Ladakh', airport: 'IXL', type: 'city' },
    { name: 'Shimla', state: 'Himachal Pradesh', airport: 'SLV', type: 'city' },
    { name: 'Manali', state: 'Himachal Pradesh', airport: null, type: 'city' },
    { name: 'Visakhapatnam', state: 'Andhra Pradesh', airport: 'VTZ', type: 'city' },
    { name: 'Vijayawada', state: 'Andhra Pradesh', airport: 'VGA', type: 'city' },
    { name: 'Coimbatore', state: 'Tamil Nadu', airport: 'CJB', type: 'city' },
    { name: 'Madurai', state: 'Tamil Nadu', airport: 'IXM', type: 'city' },
    { name: 'Tiruchirappalli', state: 'Tamil Nadu', airport: 'TRZ', type: 'city' },
    { name: 'Mysuru', state: 'Karnataka', airport: 'MYQ', type: 'city' },
    { name: 'Mangaluru', state: 'Karnataka', airport: 'IXE', type: 'city' },
    { name: 'Hubballi', state: 'Karnataka', airport: 'HBX', type: 'city' },
    { name: 'Panaji', state: 'Goa', airport: 'GOI', type: 'city' },
    { name: 'Aurangabad', state: 'Maharashtra', airport: 'IXU', type: 'city' },
    { name: 'Nashik', state: 'Maharashtra', airport: null, type: 'city' },
    { name: 'Kolhapur', state: 'Maharashtra', airport: 'KLH', type: 'city' },
    { name: 'Raipur', state: 'Chhattisgarh', airport: 'RPR', type: 'city' },
    { name: 'Jabalpur', state: 'Madhya Pradesh', airport: 'JLR', type: 'city' },
    { name: 'Gwalior', state: 'Madhya Pradesh', airport: 'GWL', type: 'city' },
];

function _highlightCity(text, query) {
    if (!query) return text;
    const idx = text.toLowerCase().indexOf(query.toLowerCase());
    if (idx === -1) return text;
    return (
        text.substring(0, idx) +
        '<em style="font-style:normal;font-weight:800;">' +
        text.substring(idx, idx + query.length) +
        '</em>' +
        text.substring(idx + query.length)
    );
}

/**
 * Injects autocomplete styles once.
 */
function _injectCityAutocompleteStyles() {
    if (document.getElementById('__city-ac-styles')) return;
    const style = document.createElement('style');
    style.id = '__city-ac-styles';
    style.textContent = `
        .city-ac-wrapper { position: relative; }
        .city-ac-dropdown {
            display: none;
            position: absolute;
            top: calc(100% + 5px);
            left: 0; right: 0;
            background: #fff;
            border: 1px solid #e2e8f0;
            border-radius: 0.85rem;
            box-shadow: 0 22px 60px rgba(15,23,42,0.14), 0 4px 16px rgba(15,23,42,0.08);
            z-index: 9999;
            overflow: hidden;
            max-height: 340px;
            overflow-y: auto;
        }
        .city-ac-dropdown.open { display: block; animation: cityDropIn 0.18s ease; }
        @keyframes cityDropIn {
            from { opacity: 0; transform: translateY(-6px); }
            to   { opacity: 1; transform: translateY(0); }
        }
        .city-ac-header {
            display: block;
            padding: 0.5rem 1rem;
            font-size: 0.7rem;
            font-weight: 800;
            letter-spacing: 0.09em;
            color: #fff;
            text-align: center;
        }
        .city-ac-item {
            display: flex;
            align-items: center;
            gap: 0.8rem;
            padding: 0.7rem 1rem;
            cursor: pointer;
            border-bottom: 1px solid #f1f5f9;
            transition: background 0.12s ease;
        }
        .city-ac-item:last-child { border-bottom: none; }
        .city-ac-item:hover, .city-ac-item.active { background: #f0f9ff; }
        .city-ac-dot {
            width: 2rem; height: 2rem;
            border-radius: 0.5rem;
            display: flex; align-items: center; justify-content: center;
            flex-shrink: 0;
        }
        .city-ac-info { flex: 1; min-width: 0; }
        .city-ac-name {
            font-size: 0.88rem;
            font-weight: 700;
            color: #0f172a;
            line-height: 1.3;
        }
        .city-ac-badge {
            font-size: 0.7rem;
            font-weight: 700;
            color: #fff;
            padding: 1px 5px;
            border-radius: 4px;
            display: inline-block;
            margin-left: 4px;
            vertical-align: middle;
        }
        .city-ac-state {
            font-size: 0.73rem;
            font-weight: 600;
            color: #64748b;
            margin-top: 1px;
            text-transform: uppercase;
            letter-spacing: 0.04em;
        }
        .city-ac-no-result {
            padding: 1.5rem;
            text-align: center;
            color: #94a3b8;
            font-size: 0.875rem;
            font-weight: 600;
        }
    `;
    document.head.appendChild(style);
}

/**
 * Initialise city autocomplete on an input.
 * @param {string} inputId - ID of the <input> element
 * @param {object} opts
 *   opts.accentColor  - hex color for header bar & badge (default '#0f766e')
 *   opts.accentDot    - hex color for the dot icon bg (default same as accentColor)
 *   opts.label        - header label text (default 'Cities')
 *   opts.showAirport  - show airport code badge (default true)
 */
function initCityAutocomplete(inputId, opts = {}) {
    _injectCityAutocompleteStyles();

    const input = document.getElementById(inputId);
    if (!input) return;

    const accentColor = opts.accentColor || '#0f766e';
    const label       = opts.label       || 'Cities';
    const showAirport = opts.showAirport !== false;

    // Wrap input in a position:relative container
    const wrapper = document.createElement('div');
    wrapper.className = 'city-ac-wrapper';
    wrapper.style.cssText = 'position:relative; display:block;';
    input.parentNode.insertBefore(wrapper, input);
    wrapper.appendChild(input);
    input.setAttribute('autocomplete', 'off');

    // Dropdown
    const dropdown = document.createElement('div');
    dropdown.className = 'city-ac-dropdown';
    dropdown.innerHTML = `<span class="city-ac-header" style="background:${accentColor};">----- ${label} -----</span>`;
    const list = document.createElement('div');
    list.className = 'city-ac-list';
    dropdown.appendChild(list);
    wrapper.appendChild(dropdown);

    let activeIdx = -1;
    let currentResults = [];

    function render(query) {
        const q = query.trim().toLowerCase();
        list.innerHTML = '';
        activeIdx = -1;

        currentResults = q.length === 0 ? [] : CITIES.filter(c =>
            c.name.toLowerCase().includes(q) ||
            c.state.toLowerCase().includes(q) ||
            (c.airport && c.airport.toLowerCase().includes(q))
        ).slice(0, 10);

        if (currentResults.length === 0) {
            list.innerHTML = `<div class="city-ac-no-result">No cities found for "${query}"</div>`;
            dropdown.classList.add('open');
            return;
        }

        currentResults.forEach((c, i) => {
            const item = document.createElement('div');
            item.className = 'city-ac-item';
            const airportBadge = (showAirport && c.airport)
                ? `<span class="city-ac-badge" style="background:${accentColor};">${c.airport}</span>`
                : '';
            item.innerHTML = `
                <div class="city-ac-dot" style="background:linear-gradient(135deg,${accentColor}cc,${accentColor});">
                    <svg width="13" height="13" fill="none" stroke="white" stroke-width="2.5" viewBox="0 0 24 24">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                        <circle cx="12" cy="9" r="2.5"/>
                    </svg>
                </div>
                <div class="city-ac-info">
                    <div class="city-ac-name">${_highlightCity(c.name, query)}${airportBadge}</div>
                    <div class="city-ac-state">${c.state}</div>
                </div>
            `;
            item.addEventListener('mousedown', (e) => {
                e.preventDefault();
                input.value = c.name;
                input.dataset.cityAirport = c.airport || '';
                dropdown.classList.remove('open');
            });
            list.appendChild(item);
        });

        dropdown.classList.add('open');

        // Keyboard navigation handler
        input._kbHandler && input.removeEventListener('keydown', input._kbHandler);
        input._kbHandler = function(e) {
            const items = list.querySelectorAll('.city-ac-item');
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                if (activeIdx < items.length - 1) {
                    if (activeIdx >= 0) items[activeIdx].classList.remove('active');
                    activeIdx++;
                    items[activeIdx].classList.add('active');
                    items[activeIdx].scrollIntoView({ block: 'nearest' });
                }
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                if (activeIdx > 0) {
                    items[activeIdx].classList.remove('active');
                    activeIdx--;
                    items[activeIdx].classList.add('active');
                    items[activeIdx].scrollIntoView({ block: 'nearest' });
                }
            } else if (e.key === 'Enter') {
                if (activeIdx >= 0) {
                    e.preventDefault();
                    const c = currentResults[activeIdx];
                    input.value = c.name;
                    input.dataset.cityAirport = c.airport || '';
                    dropdown.classList.remove('open');
                }
            } else if (e.key === 'Escape') {
                dropdown.classList.remove('open');
            }
        };
        input.addEventListener('keydown', input._kbHandler);
    }

    input.addEventListener('input', () => {
        if (input.value.trim().length >= 1) render(input.value.trim());
        else dropdown.classList.remove('open');
    });

    input.addEventListener('focus', () => {
        if (input.value.trim().length >= 1) render(input.value.trim());
    });

    document.addEventListener('click', (e) => {
        if (!wrapper.contains(e.target)) dropdown.classList.remove('open');
    });
}
