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

    // 1. Initialize GIS Engine
    this.gisMap = new window.NER_GISMap('gis-map-canvas');
    this.gisMap.init();

    // 2. Initialize AI Engine
    this.aiEngine = new window.NER_AIPredictionEngine();

    // 3. Initialize Fleet Tracker
    this.fleetTracker = new window.NER_FleetTracker(this.gisMap);
    this.fleetTracker.init();
    window.fleetTracker = this.fleetTracker;

    // 4. Initialize Incident Reporter
    this.incidentReporter = new window.NER_IncidentReporter(this.gisMap);
    window.incidentReporter = this.incidentReporter;

    // 5. Initialize Alerts Manager
    this.alertsManager = new window.NER_AlertsManager(this.gisMap);
    this.alertsManager.init();
    window.alertsManager = this.alertsManager;

    // 6. Setup Navigation, Theme Toggle, & Live Clock
    this.setupNavigation();
    this.setupThemeToggle();
    this.startLiveClock();
    this.setupSearch();

    console.log("✅ Jeevan Setu Command Center fully operational.");
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

    // Update Sidebar Active state
    document.querySelectorAll('.nav-item').forEach(item => {
      item.classList.toggle('active', item.getAttribute('data-view') === viewName);
    });

    // Handle view actions
    if (viewName === 'gis') {
      this.gisMap.map.flyTo([26.2006, 92.9376], 8, { duration: 1.5 });
      this.showNotification("🗺️ Full GIS Map view activated. Click any highway or district marker.", "info");
    } else if (viewName === 'road-accessibility') {
      this.gisMap.flyToLocation([25.6300, 94.1200], 9);
      this.showNotification("🚧 Highlighting disrupted highways (NH-29, SH-10, NH-6).", "warning");
    } else if (viewName === 'vehicles') {
      if (this.fleetTracker && this.fleetTracker.convoys.length > 0) {
        this.fleetTracker.focusActiveConvoy();
      }
      this.showNotification("🚛 Centered on Live GPS Supply Convoys.", "info");
    } else if (viewName === 'alerts') {
      this.gisMap.flyToLocation([27.0500, 88.5000], 9);
      this.showNotification("🚨 Displaying Active Disruption Hazards across North East.", "danger");
    } else if (viewName === 'weather') {
      this.gisMap.flyToLocation([25.2700, 91.7300], 8);
      this.showNotification("🌧️ Weather Radar: Heavy precipitation zone over Meghalaya & Sikkim.", "info");
    } else if (viewName === 'ai-route') {
      const plan = this.aiEngine.planRoute('as_kamrup', 'ar_tawang', 'medicine');
      this.gisMap.drawRoute(plan.aiAlternateRoute, true);
      this.showNotification("🤖 AI Disruption Rerouting: Terrain-Safe alternate path engaged!", "success");
    } else {
      this.showNotification(`Switched to ${viewName.replace('-', ' ').toUpperCase()} view.`, "info");
    }

    if (this.gisMap && this.gisMap.map) {
      setTimeout(() => this.gisMap.map.invalidateSize(), 150);
    }
  }

  setupThemeToggle() {
    const btn = document.getElementById('theme-toggle-btn');
    if (!btn) return;

    btn.addEventListener('click', () => {
      const html = document.documentElement;
      if (html.classList.contains('dark')) {
        html.classList.remove('dark');
        btn.innerText = "☀️";
        this.gisMap.setBaseMap('Terrain Contours (Topo)');
      } else {
        html.classList.add('dark');
        btn.innerText = "🌙";
        this.gisMap.setBaseMap('Tactical Dark');
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
