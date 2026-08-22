/**
 * OpenStreetMap Nominatim Live Geocoding & Search API
 * 100% Free, Global & India Real-Time Geocoding (Zero API Key Needed)
 */

class NER_GeocodingAPI {
  constructor(gisMap) {
    this.gisMap = gisMap;
    this.debounceTimer = null;
    this.lastQuery = "";
  }

  init() {
    const searchInput = document.getElementById('global-search-input');
    if (!searchInput) return;

    // Create Search Dropdown Container if not exists
    let dropdown = document.getElementById('search-autocomplete-dropdown');
    if (!dropdown) {
      dropdown = document.createElement('div');
      dropdown.id = 'search-autocomplete-dropdown';
      dropdown.className = 'absolute top-full left-0 right-0 mt-1.5 bg-white border border-slate-200 rounded-xl shadow-2xl overflow-hidden z-[9999] hidden max-h-72 overflow-y-auto text-xs';
      searchInput.parentElement.appendChild(dropdown);
    }

    // Input listener with debounce (350ms)
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.trim();
      clearTimeout(this.debounceTimer);

      if (query.length < 2) {
        dropdown.classList.add('hidden');
        return;
      }

      this.debounceTimer = setTimeout(() => this.searchNominatim(query), 350);
    });

    // Close dropdown on outside click
    document.addEventListener('click', (e) => {
      if (!searchInput.contains(e.target) && !dropdown.contains(e.target)) {
        dropdown.classList.add('hidden');
      }
    });

    console.log("🌐 Nominatim Live Geocoding API initialized.");
  }

  async searchNominatim(query) {
    const dropdown = document.getElementById('search-autocomplete-dropdown');
    if (!dropdown) return;

    dropdown.innerHTML = `<div class="p-3 text-slate-400 text-center flex items-center justify-center gap-2"><span>🔍</span> Searching live OpenStreetMap for "${query}"...</div>`;
    dropdown.classList.remove('hidden');

    try {
      // Query Nominatim API biased towards India / North East Region
      const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&countrycodes=in&format=json&limit=5&addressdetails=1`;
      const res = await fetch(url, {
        headers: { 'Accept-Language': 'en' }
      });

      if (!res.ok) throw new Error('Nominatim query failed');
      const results = await res.json();

      if (!results || results.length === 0) {
        dropdown.innerHTML = `<div class="p-3 text-slate-500 text-center">No locations found. Try searching a town, district, or highway.</div>`;
        return;
      }

      dropdown.innerHTML = results.map(item => {
        const lat = parseFloat(item.lat);
        const lon = parseFloat(item.lon);
        const name = item.display_name.split(',')[0];
        const state = item.address?.state || item.address?.country || 'India';

        return `
          <div onclick="window.geocodingAPI.selectLocation(${lat}, ${lon}, '${name.replace(/'/g, "\\'")}', '${state}')" 
               class="p-2.5 hover:bg-slate-50 border-b border-slate-100 cursor-pointer flex items-start gap-2.5 transition">
            <span class="text-base text-cyan-600 mt-0.5">📍</span>
            <div class="flex-1 overflow-hidden">
              <b class="text-slate-800 text-xs block truncate">${name}</b>
              <p class="text-[10px] text-slate-500 truncate">${item.display_name}</p>
            </div>
            <span class="text-[10px] font-mono text-slate-400 shrink-0">${lat.toFixed(2)}, ${lon.toFixed(2)}</span>
          </div>
        `;
      }).join('');

    } catch (err) {
      console.warn("Nominatim Geocoding Error:", err);
      dropdown.innerHTML = `<div class="p-3 text-rose-500 text-center">Live search temporary error. Please try again.</div>`;
    }
  }

  selectLocation(lat, lng, name, state) {
    const dropdown = document.getElementById('search-autocomplete-dropdown');
    const searchInput = document.getElementById('global-search-input');

    if (dropdown) dropdown.classList.add('hidden');
    if (searchInput) searchInput.value = `${name}, ${state}`;

    // Fly map to exact coordinates
    if (this.gisMap && this.gisMap.map) {
      this.gisMap.map.flyTo([lat, lng], 11, { duration: 1.5 });

      // Add temporary marker
      L.popup()
        .setLatLng([lat, lng])
        .setContent(`
          <div class="p-2 text-xs">
            <b class="text-cyan-400 text-sm">📍 ${name}</b>
            <p class="text-[11px] text-gray-300 mt-1">${state}</p>
            <p class="text-[10px] font-mono text-slate-400 mt-1">${lat.toFixed(4)}°N, ${lng.toFixed(4)}°E</p>
          </div>
        `)
        .openOn(this.gisMap.map);
    }

    // Automatically update live satellite weather for this newly searched location
    if (window.weatherAPI) {
      window.weatherAPI.fetchRealTimeWeather(lat, lng, `${name}, ${state}`);
    }

    if (window.app) {
      window.app.showNotification(`📍 Found & Centered on: ${name} (${state})`, 'success');
    }
  }
}

window.NER_GeocodingAPI = NER_GeocodingAPI;
