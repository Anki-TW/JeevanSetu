/**
 * Main Application Orchestrator for Jeevan Setu - NER Logistics & Accessibility Platform
 */

class NER_App {
  constructor() {
    this.gisMap = null;
    this.aiEngine = null;
    this.fleetTracker = null;
    this.incidentReporter = null;
    this.alertsManager = null;
    this.currentView = 'dashboard';
  }

  init() {
    console.log("🚀 Initializing Jeevan Setu Platform...");

    // 1. Initialize Live Satellite Weather API
    this.weatherAPI = new window.NER_LiveWeatherAPI();
    this.weatherAPI.init();
    window.weatherAPI = this.weatherAPI;

    // 2. Initialize GIS Engine
    this.gisMap = new window.NER_GISMap('gis-map-canvas');
    this.gisMap.init();

    // 3. Initialize Nominatim Live Geocoding API
    this.geocodingAPI = new window.NER_GeocodingAPI(this.gisMap);
    this.geocodingAPI.init();
    window.geocodingAPI = this.geocodingAPI;

    // 4. Initialize OSRM Live Driving Directions API
    this.osrmRoutingAPI = new window.NER_OSRMRoutingAPI(this.gisMap);
    window.osrmRoutingAPI = this.osrmRoutingAPI;

    // 5. Initialize Jeevan AI Assistant Copilot
    this.aiAssistant = new window.NER_AIAssistant();
    this.aiAssistant.init();
    window.aiAssistant = this.aiAssistant;

    // 5. Initialize AI Routing Engine
    this.aiEngine = new window.NER_AIPredictionEngine();

    // 6. Initialize Fleet Tracker
    this.fleetTracker = new window.NER_FleetTracker(this.gisMap);
    this.fleetTracker.init();
    window.fleetTracker = this.fleetTracker;

    // 7. Initialize Incident Reporter
    this.incidentReporter = new window.NER_IncidentReporter(this.gisMap);
    window.incidentReporter = this.incidentReporter;

    // 8. Initialize Alerts Manager
    this.alertsManager = new window.NER_AlertsManager(this.gisMap);
    this.alertsManager.init();
    window.alertsManager = this.alertsManager;

    // 7. Setup Navigation, Theme Toggle, Live Clock & Accessibility Shortcuts
    this.setupNavigation();
    this.setupThemeToggle();
    this.startLiveClock();
    this.setupSearch();
    this.setupAccessibilityShortcuts();

    console.log("✅ Jeevan Setu Command Center fully operational with WCAG 2.1 AA Accessibility Engine.");
  }

  setupAccessibilityShortcuts() {
    // Keyboard Shortcut: Press '/' to focus global search bar
    document.addEventListener('keydown', (e) => {
      if (e.key === '/' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
        e.preventDefault();
        const searchInput = document.getElementById('global-search-input');
        if (searchInput) {
          searchInput.focus();
          this.announceToScreenReader("Search bar focused. Type a location, route, or incident.");
        }
      }
    });

    // Create Screen Reader Announcer region if not present
    if (!document.getElementById('a11y-announcer')) {
      const announcer = document.createElement('div');
      announcer.id = 'a11y-announcer';
      announcer.className = 'sr-only';
      announcer.setAttribute('aria-live', 'polite');
      announcer.setAttribute('aria-atomic', 'true');
      document.body.appendChild(announcer);
    }
  }

  announceToScreenReader(message) {
    const announcer = document.getElementById('a11y-announcer');
    if (announcer) {
      announcer.textContent = message;
    }
  }

  setFontScale(scale) {
    const html = document.documentElement;
    html.classList.remove('text-scaling-sm', 'text-scaling-base', 'text-scaling-lg');
    html.classList.add(`text-scaling-${scale}`);
    localStorage.setItem('a11y_font_scale', scale);
    this.showNotification(`🔤 Font size changed to ${scale.toUpperCase()}`, "info");
    this.announceToScreenReader(`Font size changed to ${scale}`);
  }

  toggleHighContrast() {
    const html = document.documentElement;
    const isHighContrast = html.classList.toggle('high-contrast');
    localStorage.setItem('a11y_high_contrast', isHighContrast ? 'true' : 'false');
    
    if (isHighContrast) {
      this.showNotification("👁️ High Contrast Mode Activated (WCAG AAA)", "info");
      this.announceToScreenReader("High Contrast Mode Activated");
    } else {
      this.showNotification("👁️ Standard Color Mode Restored", "info");
      this.announceToScreenReader("Standard Color Mode Restored");
    }
  }

  openAlertsModal() {
    let modal = document.getElementById('view-all-alerts-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'view-all-alerts-modal';
      modal.className = 'fixed inset-0 z-[10000] bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4';
      document.body.appendChild(modal);
    }

    const incidents = window.NER_CONFIG.incidents || [];

    modal.innerHTML = `
      <div class="bg-white border border-slate-200 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-150">
        <div class="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div class="flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse"></span>
            <h3 class="font-extrabold text-sm text-slate-900">🚨 All Active Regional Alerts & Incidents (${incidents.length})</h3>
          </div>
          <button onclick="document.getElementById('view-all-alerts-modal').classList.add('hidden')" class="text-slate-400 hover:text-slate-800 text-xl font-bold p-1">&times;</button>
        </div>

        <div class="p-4 overflow-y-auto space-y-3 flex-1 text-xs">
          ${incidents.map(inc => `
            <div class="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5 hover:border-slate-300 transition">
              <div class="flex items-center justify-between">
                <span class="font-bold text-slate-900 text-xs">${inc.title}</span>
                <span class="px-2 py-0.5 rounded-full text-[10px] font-bold ${inc.severity === 'critical' ? 'bg-rose-100 text-rose-700 border border-rose-200' : 'bg-amber-100 text-amber-700 border border-amber-200'}">${inc.severity.toUpperCase()}</span>
              </div>
              <p class="text-[11px] text-cyan-700 font-medium">📍 Location: ${inc.locationName}</p>
              <p class="text-[11px] text-slate-600">${inc.details || 'Active monitoring by SDRF/BRO teams.'}</p>
              <div class="flex items-center justify-between pt-1 text-[10px] text-slate-400 font-mono">
                <span>Reported: ${inc.reportedAt}</span>
                <button onclick="document.getElementById('view-all-alerts-modal').classList.add('hidden'); window.app.gisMap.flyToLocation([${inc.coords[0]}, ${inc.coords[1]}], 12)" class="text-indigo-600 font-bold hover:underline">📍 Fly to Map Location</button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    modal.classList.remove('hidden');
  }

  openWeatherModal() {
    let modal = document.getElementById('view-all-weather-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'view-all-weather-modal';
      modal.className = 'fixed inset-0 z-[10000] bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4';
      document.body.appendChild(modal);
    }

    const locations = [
      { name: "Shillong, Meghalaya", coords: [25.5788, 91.8933] },
      { name: "Guwahati, Assam", coords: [26.1445, 91.7362] },
      { name: "Tawang, Arunachal", coords: [27.5861, 91.8594] },
      { name: "Gangtok, Sikkim", coords: [27.3389, 88.6065] },
      { name: "Imphal, Manipur", coords: [24.8170, 93.9368] },
      { name: "Aizawl, Mizoram", coords: [23.7271, 92.7176] },
      { name: "Kohima, Nagaland", coords: [25.6751, 94.1086] },
      { name: "Agartala, Tripura", coords: [23.8315, 91.2868] }
    ];

    modal.innerHTML = `
      <div class="bg-white border border-slate-200 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-150">
        <div class="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div class="flex items-center gap-2">
            <span class="text-base">🌧️</span>
            <h3 class="font-extrabold text-sm text-slate-900">Live Satellite Weather Across All 8 North Eastern States</h3>
          </div>
          <button onclick="document.getElementById('view-all-weather-modal').classList.add('hidden')" class="text-slate-400 hover:text-slate-800 text-xl font-bold p-1">&times;</button>
        </div>

        <div class="p-4 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 flex-1 text-xs">
          ${locations.map(loc => `
            <div onclick="window.weatherAPI.fetchRealTimeWeather(${loc.coords[0]}, ${loc.coords[1]}, '${loc.name}'); document.getElementById('view-all-weather-modal').classList.add('hidden')" 
                 class="p-3 bg-slate-50 hover:bg-cyan-50/60 border border-slate-200 rounded-xl cursor-pointer transition space-y-1">
              <b class="text-slate-900 text-xs block truncate">${loc.name}</b>
              <span class="text-[10px] text-cyan-600 font-semibold block">Click to inspect on map ➔</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    modal.classList.remove('hidden');
  }

  openDeliveriesModal() {
    let modal = document.getElementById('view-all-deliveries-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'view-all-deliveries-modal';
      modal.className = 'fixed inset-0 z-[10000] bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4';
      document.body.appendChild(modal);
    }

    modal.innerHTML = `
      <div class="bg-white border border-slate-200 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-150">
        <div class="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div class="flex items-center gap-2">
            <span class="text-base">📦</span>
            <h3 class="font-extrabold text-sm text-slate-900">Regional Essential Goods Delivery Ledger (367 Shipments)</h3>
          </div>
          <button onclick="document.getElementById('view-all-deliveries-modal').classList.add('hidden')" class="text-slate-400 hover:text-slate-800 text-xl font-bold p-1">&times;</button>
        </div>

        <div class="p-4 overflow-y-auto space-y-2 flex-1 text-xs">
          <div class="grid grid-cols-4 font-bold text-slate-500 border-b border-slate-200 pb-2 text-[10px]">
            <span>Shipment ID</span>
            <span>Cargo Category</span>
            <span>Route</span>
            <span>Status</span>
          </div>
          <div class="grid grid-cols-4 text-slate-800 py-1.5 border-b border-slate-100 text-[11px] items-center">
            <span class="font-mono font-bold">DEL-9841</span><span>Vaccines & Insulin</span><span>Guwahati ➔ Tawang</span><span class="text-emerald-600 font-bold">● Delivered</span>
          </div>
          <div class="grid grid-cols-4 text-slate-800 py-1.5 border-b border-slate-100 text-[11px] items-center">
            <span class="font-mono font-bold">DEL-9842</span><span>Rice & Wheat (FCI)</span><span>Silchar ➔ Aizawl</span><span class="text-amber-600 font-bold">● In Transit</span>
          </div>
          <div class="grid grid-cols-4 text-slate-800 py-1.5 border-b border-slate-100 text-[11px] items-center">
            <span class="font-mono font-bold">DEL-9843</span><span>Diesel & Petrol</span><span>Numaligarh ➔ Imphal</span><span class="text-amber-600 font-bold">● In Transit</span>
          </div>
          <div class="grid grid-cols-4 text-slate-800 py-1.5 border-b border-slate-100 text-[11px] items-center">
            <span class="font-mono font-bold">DEL-9844</span><span>Shelter Tarpaulins</span><span>Jorhat ➔ Mangan</span><span class="text-rose-600 font-bold">● Scheduled</span>
          </div>
        </div>
      </div>
    `;

    modal.classList.remove('hidden');
  }

  openVehiclesModal() {
    let modal = document.getElementById('view-all-vehicles-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'view-all-vehicles-modal';
      modal.className = 'fixed inset-0 z-[10000] bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4';
      document.body.appendChild(modal);
    }

    const convoys = window.NER_CONFIG.convoys || [];

    modal.innerHTML = `
      <div class="bg-white border border-slate-200 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-150">
        <div class="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div class="flex items-center gap-2">
            <span class="text-base">🚛</span>
            <h3 class="font-extrabold text-sm text-slate-900">Active Supply Convoys & Fleet Telemetry</h3>
          </div>
          <button onclick="document.getElementById('view-all-vehicles-modal').classList.add('hidden')" class="text-slate-400 hover:text-slate-800 text-xl font-bold p-1">&times;</button>
        </div>

        <div class="p-4 overflow-y-auto space-y-3 flex-1 text-xs">
          ${convoys.map(c => `
            <div class="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
              <div class="flex items-center justify-between">
                <b class="text-slate-900 text-xs font-mono">${c.id} (${c.type})</b>
                <span class="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold text-[10px] border border-emerald-200">Speed: ${c.speedKmH} km/h</span>
              </div>
              <p class="text-[11px] text-slate-600">Route: <b>${c.route}</b> | Cargo: <b>${c.cargo}</b></p>
              <p class="text-[10px] text-slate-500 font-mono">Cold-Chain Temp: ${c.coldChainTempC || 'Ambient'}°C | ETA: ${c.etaHrs} hrs</p>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    modal.classList.remove('hidden');
  }

  openDisruptedRoutesModal() {
    this.openAlertsModal();
  }

  openAnalyticsModal() {
    let modal = document.getElementById('view-analytics-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'view-analytics-modal';
      modal.className = 'fixed inset-0 z-[10000] bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4';
      document.body.appendChild(modal);
    }

    modal.innerHTML = `
      <div class="bg-white border border-slate-200 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-150">
        <div class="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div class="flex items-center gap-2">
            <span class="text-base">📈</span>
            <h3 class="font-extrabold text-sm text-slate-900">Regional Analytics, Performance Reports & AI Vulnerability Matrix</h3>
          </div>
          <button onclick="document.getElementById('view-analytics-modal').classList.add('hidden')" class="text-slate-400 hover:text-slate-800 text-xl font-bold p-1">&times;</button>
        </div>

        <div class="p-4 overflow-y-auto space-y-4 flex-1 text-xs">
          <div class="grid grid-cols-3 gap-3">
            <div class="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-center">
              <span class="text-[10px] text-emerald-700 font-bold uppercase">Delivery Success Rate</span>
              <div class="text-2xl font-black text-emerald-800 font-mono mt-1">94.2%</div>
              <span class="text-[10px] text-emerald-600">↑ +3.8% from last month</span>
            </div>
            <div class="p-3 bg-cyan-50 border border-cyan-200 rounded-xl text-center">
              <span class="text-[10px] text-cyan-700 font-bold uppercase">Avg Transit Delay Reduction</span>
              <div class="text-2xl font-black text-cyan-800 font-mono mt-1">-35.4%</div>
              <span class="text-[10px] text-cyan-600">Via AI Dynamic Rerouting</span>
            </div>
            <div class="p-3 bg-purple-50 border border-purple-200 rounded-xl text-center">
              <span class="text-[10px] text-purple-700 font-bold uppercase">High Risk Corridors</span>
              <div class="text-2xl font-black text-purple-800 font-mono mt-1">3 / 28</div>
              <span class="text-[10px] text-purple-600">NH-29, SH-10, Sonapur</span>
            </div>
          </div>

          <div class="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <b class="text-slate-900 text-xs block">Top Vulnerable Districts (Monsoon Risk Index):</b>
            <div class="space-y-1.5 text-[11px]">
              <div class="flex justify-between items-center">
                <span>1. East Khasi Hills (Meghalaya)</span>
                <span class="text-rose-600 font-bold font-mono">Risk Index: 88/100 (Critical)</span>
              </div>
              <div class="flex justify-between items-center">
                <span>2. North Sikkim / Mangan (Sikkim)</span>
                <span class="text-rose-600 font-bold font-mono">Risk Index: 82/100 (High)</span>
              </div>
              <div class="flex justify-between items-center">
                <span>3. Dima Hasao / Haflong (Assam)</span>
                <span class="text-amber-600 font-bold font-mono">Risk Index: 74/100 (Medium)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    modal.classList.remove('hidden');
  }

  openGovDashboardModal() {
    let modal = document.getElementById('view-gov-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'view-gov-modal';
      modal.className = 'fixed inset-0 z-[10000] bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4';
      document.body.appendChild(modal);
    }

    modal.innerHTML = `
      <div class="bg-white border border-slate-200 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-150">
        <div class="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white">
          <div class="flex items-center gap-2">
            <span class="text-base">🏛️</span>
            <h3 class="font-extrabold text-sm text-white">Government of India - Executive Nodal Command (MoDoNER & NEC)</h3>
          </div>
          <button onclick="document.getElementById('view-gov-modal').classList.add('hidden')" class="text-slate-400 hover:text-white text-xl font-bold p-1">&times;</button>
        </div>

        <div class="p-4 overflow-y-auto space-y-3 flex-1 text-xs text-slate-800">
          <div class="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <b class="text-slate-900 text-xs">Executive Readiness Overview:</b>
            <p class="text-slate-600 leading-relaxed">
              All 8 North Eastern States (Assam, Meghalaya, Arunachal Pradesh, Sikkim, Manipur, Mizoram, Nagaland, Tripura) are connected with live satellite telemetry and automated disaster response queues.
            </p>
          </div>

          <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-[11px]">
            <div class="p-2 bg-slate-100 rounded-lg"><span class="text-slate-500 block">SDRF Convoys:</span><b class="text-emerald-700 font-mono">48 Active</b></div>
            <div class="p-2 bg-slate-100 rounded-lg"><span class="text-slate-500 block">BRO Clearance Teams:</span><b class="text-cyan-700 font-mono">14 Mobilized</b></div>
            <div class="p-2 bg-slate-100 rounded-lg"><span class="text-slate-500 block">Cold-Chain Storage:</span><b class="text-emerald-700 font-mono">100% Operational</b></div>
            <div class="p-2 bg-slate-100 rounded-lg"><span class="text-slate-500 block">Emergency SOS Status:</span><b class="text-slate-700 font-mono">Standby</b></div>
          </div>
        </div>
      </div>
    `;

    modal.classList.remove('hidden');
  }

  openSettingsModal() {
    let modal = document.getElementById('view-settings-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'view-settings-modal';
      modal.className = 'fixed inset-0 z-[10000] bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4';
      document.body.appendChild(modal);
    }

    const currentKey = localStorage.getItem('gemini_api_key') || '';

    modal.innerHTML = `
      <div class="bg-white border border-slate-200 rounded-2xl shadow-2xl w-full max-w-md flex flex-col overflow-hidden animate-in fade-in zoom-in duration-150">
        <div class="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div class="flex items-center gap-2">
            <span class="text-base">⚙️</span>
            <h3 class="font-extrabold text-sm text-slate-900">System Preferences & API Configurations</h3>
          </div>
          <button onclick="document.getElementById('view-settings-modal').classList.add('hidden')" class="text-slate-400 hover:text-slate-800 text-xl font-bold p-1">&times;</button>
        </div>

        <div class="p-4 overflow-y-auto space-y-4 flex-1 text-xs text-slate-800">
          <div class="space-y-1.5">
            <label class="font-bold text-slate-900 block">Google Gemini API Key (Optional Live AI Key):</label>
            <input type="password" id="gemini-key-input" value="${currentKey}" placeholder="AIzaSy..." 
                   class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono text-slate-800">
            <p class="text-[10px] text-slate-500">Leave blank to use Jeevan AI built-in zero-key high-intelligence engine.</p>
          </div>

          <div class="space-y-1.5">
            <label class="font-bold text-slate-900 block">Offline Cache & Database Reset:</label>
            <button onclick="localStorage.clear(); window.location.reload()" class="w-full py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold border border-rose-200 rounded-xl text-xs transition">
              🗑️ Clear Local Cache & Reset PWA Storage
            </button>
          </div>

          <button onclick="localStorage.setItem('gemini_api_key', document.getElementById('gemini-key-input').value.trim()); document.getElementById('view-settings-modal').classList.add('hidden'); window.app.showNotification('✅ Settings & API Configurations Saved!', 'success')" 
                  class="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shadow transition">
            Save Settings & Close
          </button>
        </div>
      </div>
    `;

    modal.classList.remove('hidden');
  }

  openProfileModal() {
    let modal = document.getElementById('view-officer-profile-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'view-officer-profile-modal';
      modal.className = 'fixed inset-0 z-[10000] bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4';
      document.body.appendChild(modal);
    }

    modal.innerHTML = `
      <div class="bg-white border border-slate-200 rounded-2xl shadow-2xl w-full max-w-md flex flex-col overflow-hidden animate-in fade-in zoom-in duration-150">
        <div class="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white">
          <div class="flex items-center gap-2.5">
            <div class="w-9 h-9 rounded-full bg-emerald-500 text-slate-950 font-black text-sm flex items-center justify-center shadow">
              AO
            </div>
            <div>
              <h3 class="font-extrabold text-sm text-white">Admin Officer (MDONER)</h3>
              <p class="text-[10px] text-emerald-400 font-semibold uppercase tracking-wider">Ministry of Development of North Eastern Region</p>
            </div>
          </div>
          <button onclick="document.getElementById('view-officer-profile-modal').classList.add('hidden')" class="text-slate-400 hover:text-white text-xl font-bold p-1">&times;</button>
        </div>

        <div class="p-5 space-y-4 text-xs text-slate-800">
          <div class="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <div class="flex justify-between items-center">
              <span class="text-slate-500 font-medium">Nodal Agency:</span>
              <b class="text-slate-900 font-bold">MoDoNER / Govt of India</b>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-slate-500 font-medium">Security Clearance:</span>
              <span class="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full text-[10px] border border-emerald-200">Level 1 - Executive Command</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-slate-500 font-medium">Regional Jurisdiction:</span>
              <b class="text-indigo-700 font-bold">8 North Eastern States (25+ Districts)</b>
            </div>
          </div>

          <div class="space-y-1.5">
            <b class="text-xs text-slate-900 block">Administrative Privileges:</b>
            <ul class="space-y-1 text-[11px] text-slate-600 list-disc pl-4">
              <li>Authorize priority clearance for medical & food convoys</li>
              <li>Issue Emergency SOS Broadcasts to State Disaster Management Authorities</li>
              <li>Inspect real-time vehicle GPS & cold-chain temperature telemetry</li>
              <li>Access AI Geotechnical Landslide & Flood Hazard Indices</li>
            </ul>
          </div>

          <button onclick="document.getElementById('view-officer-profile-modal').classList.add('hidden'); window.app.showNotification('✅ Admin Credentials Authenticated - Session Active', 'success')" class="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs shadow transition">
            Close & Return to Command Center
          </button>
        </div>
      </div>
    `;

    modal.classList.remove('hidden');
  }

  async handleWeatherLocationChange(value) {
    if (value === 'gps') {
      if (navigator.geolocation) {
        this.showNotification("📍 Detecting your live GPS location...", "info");
        navigator.geolocation.getCurrentPosition(
          async (pos) => {
            const lat = pos.coords.latitude;
            const lng = pos.coords.longitude;
            await this.weatherAPI.fetchRealTimeWeather(lat, lng, "My Live Location");
            this.gisMap.flyToLocation([lat, lng], 10);
          },
          (err) => {
            this.showNotification("Could not fetch GPS permission. Showing Shillong.", "warning");
            this.weatherAPI.fetchRealTimeWeather(25.5788, 91.8933, "Shillong, Meghalaya");
          }
        );
      }
      return;
    }

    const parts = value.split(',');
    if (parts.length >= 3) {
      const lat = parseFloat(parts[0]);
      const lng = parseFloat(parts[1]);
      const name = parts.slice(2).join(',');

      await this.weatherAPI.fetchRealTimeWeather(lat, lng, name);
      this.gisMap.flyToLocation([lat, lng], 10);
    }
  }

  setupNavigation() {
    // Sidebar Item Click Handlers
    document.querySelectorAll('.nav-item').forEach(item => {
      item.addEventListener('click', () => {
        const view = item.getAttribute('data-view');
        this.switchView(view);
      });
    });

    // Layer Checkboxes
    const layerToggles = [
      { id: 'layer-toggle-highways', key: 'highways' },
      { id: 'layer-toggle-traffic', key: 'highways' },
      { id: 'layer-toggle-radar', key: 'weatherRadar' },
      { id: 'layer-toggle-incidents', key: 'incidents' },
      { id: 'layer-toggle-fleet', key: 'fleet' },
      { id: 'layer-toggle-bridges', key: 'bridges' }
    ];

    layerToggles.forEach(({ id, key }) => {
      const chk = document.getElementById(id);
      if (chk) {
        chk.addEventListener('change', (e) => {
          this.gisMap.toggleLayer(key, e.target.checked);
        });
      }
    });
  }

  switchView(viewName) {
    this.currentView = viewName;

    // Highlight active nav item
    document.querySelectorAll('.nav-item').forEach(el => {
      el.classList.remove('active');
      if (el.getAttribute('data-view') === viewName) {
        el.classList.add('active');
      }
    });

    // Handle view actions cleanly
    switch (viewName) {
      case 'dashboard':
        window.scrollTo({ top: 0, behavior: 'smooth' });
        this.showNotification("📊 Main Command Center Dashboard Active", "info");
        break;
      case 'gis':
        const mapCanvas = document.getElementById('gis-map-canvas');
        if (mapCanvas) mapCanvas.scrollIntoView({ behavior: 'smooth' });
        this.showNotification("🗺️ Full GIS Map view activated. Click any highway or district marker.", "info");
        break;
      case 'road-accessibility':
        this.openAlertsModal();
        break;
      case 'vehicles':
        this.openVehiclesModal();
        break;
      case 'deliveries':
        this.openDeliveriesModal();
        break;
      case 'alerts':
        this.openAlertsModal();
        break;
      case 'weather':
        this.openWeatherModal();
        break;
      case 'essential-supplies':
        this.openSuppliesModal();
        break;
      case 'analytics':
        this.openAnalyticsModal();
        break;
      case 'gov-dashboard':
        this.openGovDashboardModal();
        break;
      case 'settings':
        this.openSettingsModal();
        break;
      default:
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    if (this.gisMap && this.gisMap.map) {
      setTimeout(() => this.gisMap.map.invalidateSize(), 150);
    }
  }

  toggleMobileDrawer(open) {
    const drawer = document.getElementById('mobile-drawer');
    const overlay = document.getElementById('mobile-drawer-overlay');

    if (!drawer || !overlay) return;

    if (open) {
      drawer.classList.remove('-translate-x-full');
      overlay.classList.remove('hidden');
    } else {
      drawer.classList.add('-translate-x-full');
      overlay.classList.add('hidden');
    }
  }

  toggleMapLayersPanel() {
    const panel = document.getElementById('map-layers-floating-panel');
    const btn = document.getElementById('map-layers-minimize-btn');
    if (!panel) return;

    if (panel.classList.contains('layers-collapsed')) {
      panel.classList.remove('layers-collapsed');
      if (btn) btn.innerText = "−";
    } else {
      panel.classList.add('layers-collapsed');
      if (btn) btn.innerText = "+";
    }
  }

  setupThemeToggle() {
    const btn = document.getElementById('theme-toggle-btn');
    const html = document.documentElement;

    // Load saved theme preference
    const savedTheme = localStorage.getItem('theme') || 'light';
    if (savedTheme === 'dark') {
      html.classList.add('dark');
      html.classList.remove('light');
      if (btn) btn.innerText = "🌙";
    } else {
      html.classList.add('light');
      html.classList.remove('dark');
      if (btn) btn.innerText = "☀️";
    }

    if (!btn) return;

    btn.addEventListener('click', () => {
      if (html.classList.contains('dark')) {
        html.classList.remove('dark');
        html.classList.add('light');
        btn.innerText = "☀️";
        localStorage.setItem('theme', 'light');
        if (this.gisMap) this.gisMap.setBaseMap('Terrain Contours (Topo)');
        this.showNotification("☀️ Switched to Light Command Center Theme", "info");
      } else {
        html.classList.add('dark');
        html.classList.remove('light');
        btn.innerText = "🌙";
        localStorage.setItem('theme', 'dark');
        if (this.gisMap) this.gisMap.setBaseMap('Tactical Dark');
        this.showNotification("🌙 Switched to Tactical Dark Command Center Theme", "info");
      }
    });
  }

  setupSearch() {
    const searchInput = document.getElementById('global-search-input');
    if (!searchInput) return;

    searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        const query = e.target.value.toLowerCase().trim();
        if (!query) return;

        // Search districts
        const matchDistrict = window.NER_CONFIG.districts.find(d => d.name.toLowerCase().includes(query) || d.state.toLowerCase().includes(query));
        if (matchDistrict) {
          this.gisMap.flyToLocation(matchDistrict.coords, 10);
          this.showNotification(`📍 Centered on ${matchDistrict.name} (${matchDistrict.state})`, "success");
          return;
        }

        // Search highways
        const matchHw = window.NER_CONFIG.highways.find(h => h.name.toLowerCase().includes(query));
        if (matchHw) {
          this.gisMap.flyToLocation(matchHw.path[0], 9);
          this.showNotification(`🛣️ Centered on Highway ${matchHw.name}`, "info");
          return;
        }

        this.showNotification(`No specific match found for "${query}". Try "Tawang", "Shillong", or "NH-29".`, "warning");
      }
    });
  }

  startLiveClock() {
    const clockEl = document.getElementById('live-ist-date');
    if (!clockEl) return;

    const updateTime = () => {
      const now = new Date();
      const options = { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true };
      clockEl.innerText = `${now.toLocaleDateString('en-GB', options).replace(',', ' |')}`;
    };

    updateTime();
    setInterval(updateTime, 1000);
  }

  showNotification(message, type = 'info') {
    const container = document.getElementById('toast-notification-container');
    if (!container) return;

    const toast = document.createElement('div');
    let borderClass = 'border-cyan-500/40 bg-white text-slate-800 shadow-xl';
    if (type === 'success') borderClass = 'border-emerald-500/40 bg-white text-emerald-800 shadow-xl';
    if (type === 'warning') borderClass = 'border-amber-500/40 bg-white text-amber-800 shadow-xl';
    if (type === 'danger') borderClass = 'border-rose-500/40 bg-white text-rose-800 shadow-xl';

    toast.className = `p-3.5 rounded-xl border ${borderClass} text-xs flex items-center justify-between gap-3 min-w-[280px] max-w-[420px] transition-all transform duration-300 translate-y-2 opacity-0 font-medium`;
    toast.innerHTML = `
      <span>${message}</span>
      <button class="text-slate-400 hover:text-slate-700 font-bold">&times;</button>
    `;

    container.appendChild(toast);

    setTimeout(() => toast.classList.remove('translate-y-2', 'opacity-0'), 10);

    const closeToast = () => {
      toast.classList.add('opacity-0', '-translate-y-2');
      setTimeout(() => toast.remove(), 300);
    };

    toast.querySelector('button').addEventListener('click', closeToast);
    setTimeout(closeToast, 4000);
  }
}

// Initialize on DOM Load
window.addEventListener('DOMContentLoaded', () => {
  window.app = new NER_App();
  window.app.init();
});
