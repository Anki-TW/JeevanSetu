/**
 * Main Application Orchestrator for Bachao-Bachao NER Logistics & Accessibility Intelligence
 */

class NER_App {
  constructor() {
    this.gisMap = null;
    this.aiEngine = null;
    this.fleetTracker = null;
    this.incidentReporter = null;
    this.alertsManager = null;
    this.activeTab = 'gis';
  }

  init() {
    console.log("🚀 Initializing Bachao-Bachao NER Intelligence Platform...");

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

    // 6. Setup UI Event Handlers, KPI Stats & Live Clock
    this.setupUIEventListeners();
    this.updateKPICounters();
    this.populateDistrictSelectOptions();
    this.startLiveClock();

    // 7. Initialize i18n
    window.i18n.applyTranslations();
    const langSelect = document.getElementById('language-select');
    if (langSelect) {
      langSelect.value = window.i18n.currentLang;
      langSelect.addEventListener('change', (e) => {
        window.i18n.setLanguage(e.target.value);
      });
    }

    console.log("✅ Platform fully loaded and synchronized.");
  }

  setupUIEventListeners() {
    // Tab Switching
    document.querySelectorAll('.tab-button').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const tabKey = btn.getAttribute('data-tab');
        this.switchTab(tabKey);
      });
    });

    // Layer Checkboxes
    const layerToggles = [
      { id: 'layer-toggle-highways', key: 'highways' },
      { id: 'layer-toggle-districts', key: 'districts' },
      { id: 'layer-toggle-bridges', key: 'bridges' },
      { id: 'layer-toggle-fleet', key: 'fleet' },
      { id: 'layer-toggle-incidents', key: 'incidents' },
      { id: 'layer-toggle-radar', key: 'weatherRadar' }
    ];

    layerToggles.forEach(({ id, key }) => {
      const chk = document.getElementById(id);
      if (chk) {
        chk.addEventListener('change', (e) => {
          this.gisMap.toggleLayer(key, e.target.checked);
        });
      }
    });

    // Base Map Selector
    const baseMapSelector = document.getElementById('basemap-selector');
    if (baseMapSelector) {
      baseMapSelector.addEventListener('change', (e) => {
        this.gisMap.setBaseMap(e.target.value);
      });
    }

    // AI Route Calculate Button
    const calcRouteBtn = document.getElementById('btn-calculate-route');
    if (calcRouteBtn) {
      calcRouteBtn.addEventListener('click', () => this.handleCalculateRoute());
    }

    // Field Incident Form Submission
    const incidentForm = document.getElementById('field-incident-form');
    if (incidentForm) {
      incidentForm.addEventListener('submit', (e) => this.handleIncidentSubmit(e));
    }

    // Detect GPS Button
    const btnGetGps = document.getElementById('btn-detect-gps');
    if (btnGetGps) {
      btnGetGps.addEventListener('click', async () => {
        try {
          btnGetGps.disabled = true;
          btnGetGps.innerText = "⏳ Detecting...";
          const coords = await this.incidentReporter.getCurrentLocation();
          const coordInput = document.getElementById('incident-coords');
          if (coordInput) {
            coordInput.value = `${coords[0].toFixed(4)}, ${coords[1].toFixed(4)}`;
          }
          this.showNotification(`📍 Detected GPS Coordinates: ${coords[0].toFixed(4)}, ${coords[1].toFixed(4)}`, "success");
        } catch (err) {
          this.showNotification("Could not fetch GPS automatically. Please select on map.", "warning");
        } finally {
          btnGetGps.disabled = false;
          btnGetGps.innerText = "📍 Auto GPS";
        }
      });
    }

    // Manual Sync Button
    const btnSync = document.getElementById('btn-manual-sync');
    if (btnSync) {
      btnSync.addEventListener('click', () => {
        this.incidentReporter.syncPendingReports();
      });
    }

    // Emergency SOS Broadcast Trigger
    const btnSos = document.getElementById('btn-trigger-emergency-broadcast');
    if (btnSos) {
      btnSos.addEventListener('click', () => {
        const title = prompt("Enter Emergency Broadcast Title (e.g., NH-10 Flash Flood Red Alert):", "URGENT: Flash Flood & Landslide Warning on NH-10 & NH-6");
        if (title) {
          const districts = prompt("Affected Districts:", "East Sikkim, Dima Hasao, Tawang, Cachar");
          this.alertsManager.triggerEmergencyBroadcast(title, "Immediate evacuation / detour advisory issued by State Disaster Control.", districts);
        }
      });
    }

    // Global Search Bar
    const searchInput = document.getElementById('global-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        if (!query) return;

        // Search districts
        const matchDistrict = window.NER_CONFIG.districts.find(d => d.name.toLowerCase().includes(query) || d.state.toLowerCase().includes(query));
        if (matchDistrict) {
          this.gisMap.flyToLocation(matchDistrict.coords, 10);
          return;
        }

        // Search highways
        const matchHw = window.NER_CONFIG.highways.find(h => h.name.toLowerCase().includes(query));
        if (matchHw) {
          this.gisMap.flyToLocation(matchHw.path[0], 9);
          return;
        }
      });
    }
  }

  switchTab(tabKey) {
    this.activeTab = tabKey;
    document.querySelectorAll('.tab-button').forEach(b => {
      b.classList.toggle('active', b.getAttribute('data-tab') === tabKey);
    });

    document.querySelectorAll('.tab-content-panel').forEach(panel => {
      panel.classList.toggle('hidden', panel.id !== `tab-panel-${tabKey}`);
    });

    // If switching to GIS, ensure Leaflet recalculates size
    if (tabKey === 'gis' && this.gisMap && this.gisMap.map) {
      setTimeout(() => this.gisMap.map.invalidateSize(), 150);
    }
  }

  updateKPICounters() {
    const districts = window.NER_CONFIG.districts;
    const convoys = window.NER_CONFIG.convoys;
    const incidents = window.NER_CONFIG.incidents;

    const accessibleCount = districts.filter(d => d.status === 'normal').length;
    const highRiskCount = districts.filter(d => d.status === 'critical').length + incidents.filter(i => i.severity === 'critical').length;

    const elConvoys = document.getElementById('stat-active-convoys');
    const elAccessible = document.getElementById('stat-accessible-districts');
    const elHighRisk = document.getElementById('stat-high-risk');

    if (elConvoys) elConvoys.innerText = convoys.length;
    if (elAccessible) elAccessible.innerText = `${accessibleCount} / ${districts.length}`;
    if (elHighRisk) elHighRisk.innerText = highRiskCount;
  }

  populateDistrictSelectOptions() {
    const origSelect = document.getElementById('route-origin-select');
    const destSelect = document.getElementById('route-dest-select');
    if (!origSelect || !destSelect) return;

    const districts = window.NER_CONFIG.districts;
    const optionsHtml = districts.map(d => `<option value="${d.id}">${d.name} (${d.state})</option>`).join('');

    origSelect.innerHTML = optionsHtml;
    destSelect.innerHTML = optionsHtml;

    // Set smart defaults (Guwahati to Tawang)
    origSelect.value = "as_kamrup";
    destSelect.value = "ar_tawang";
  }

  handleCalculateRoute() {
    const origId = document.getElementById('route-origin-select').value;
    const destId = document.getElementById('route-dest-select').value;
    const cargoType = document.getElementById('route-cargo-priority').value;

    if (origId === destId) {
      this.showNotification("Origin and Destination cannot be the same.", "warning");
      return;
    }

    const plan = this.aiEngine.planRoute(origId, destId, cargoType);
    this.renderRouteComparisonUI(plan);

    // Plot AI Alternate route on GIS Map
    this.gisMap.drawRoute(plan.aiAlternateRoute, true);
    this.showNotification(`🤖 AI Disruption-Proof Route calculated for ${plan.destName}!`, "success");
  }

  renderRouteComparisonUI(plan) {
    const container = document.getElementById('route-comparison-result');
    if (!container) return;

    container.classList.remove('hidden');

    const std = plan.standardRoute;
    const alt = plan.aiAlternateRoute;

    container.innerHTML = `
      <div class="glass-panel p-4 rounded-xl border border-cyan-500/40 space-y-4">
        <div class="flex items-center justify-between border-b border-slate-800 pb-2">
          <h3 class="font-bold text-sm text-cyan-300">Route Analysis: ${plan.originName} ➔ ${plan.destName}</h3>
          <span class="badge-pill badge-normal text-[10px]">AI Optimization Engaged</span>
        </div>

        ${alt.priorityNotice ? `<div class="p-2.5 bg-cyan-950/60 border border-cyan-500/40 rounded-lg text-xs text-cyan-200">${alt.priorityNotice}</div>` : ''}

        <!-- Dual Route Cards Comparison -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <!-- Standard Route (Risk Flagged) -->
          <div class="p-3 bg-rose-950/20 border border-rose-500/30 rounded-xl space-y-2">
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold text-rose-400">Standard Direct Route</span>
              <span class="badge-pill badge-critical text-[10px]">High Disruption</span>
            </div>
            <p class="text-xs text-gray-300 font-medium">${std.name}</p>
            <p class="text-xs text-rose-300/90 bg-slate-900/80 p-2 rounded border border-rose-900/50">⚠️ <b>Risk:</b> ${std.riskStatus}</p>
            
            <div class="grid grid-cols-2 gap-2 text-[11px] text-gray-300 pt-1">
              <div><span>Distance:</span> <b class="text-white font-mono">${std.distanceKm} km</b></div>
              <div><span>Base Time:</span> <b class="text-white font-mono">${std.normalDurationHrs}h</b></div>
              <div><span>Expected Delay:</span> <b class="text-rose-400 font-mono font-bold">+${std.disruptionDelayHrs}h</b></div>
              <div><span>Safety Rating:</span> <b class="text-rose-400 font-mono font-bold">${std.safetyScore}%</b></div>
            </div>

            <button onclick="window.app.gisMap.drawRoute(window.app.currentPlan.standardRoute, false)" class="w-full mt-2 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-gray-300 rounded border border-slate-700 transition">
              Inspect Blocked Path on Map
            </button>
          </div>

          <!-- AI Predicted Alternate Route (Safe) -->
          <div class="p-3 bg-emerald-950/20 border border-emerald-500/40 rounded-xl space-y-2 glow-success">
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold text-emerald-400">AI Terrain-Safe Alternate</span>
              <span class="badge-pill badge-normal text-[10px]">Recommended</span>
            </div>
            <p class="text-xs text-gray-200 font-medium">${alt.name}</p>
            <p class="text-xs text-emerald-300/90 bg-slate-900/80 p-2 rounded border border-emerald-900/50">🛡️ <b>Assurance:</b> ${alt.riskStatus}</p>
            
            <div class="grid grid-cols-2 gap-2 text-[11px] text-gray-300 pt-1">
              <div><span>Distance:</span> <b class="text-white font-mono">${alt.distanceKm} km</b></div>
              <div><span>Base Time:</span> <b class="text-white font-mono">${alt.normalDurationHrs}h</b></div>
              <div><span>Expected Delay:</span> <b class="text-emerald-400 font-mono font-bold">+${alt.disruptionDelayHrs}h</b></div>
              <div><span>Safety Rating:</span> <b class="text-emerald-400 font-mono font-bold">${alt.safetyScore}%</b></div>
            </div>

            <button onclick="window.app.gisMap.drawRoute(window.app.currentPlan.aiAlternateRoute, true)" class="w-full mt-2 py-1 text-xs bg-emerald-600 hover:bg-emerald-500 text-white rounded font-medium transition shadow">
              ✓ View AI Safe Corridor on Map
            </button>
          </div>
        </div>
      </div>
    `;

    this.currentPlan = plan;
  }

  async handleIncidentSubmit(e) {
    e.preventDefault();

    const type = document.getElementById('incident-type').value;
    const severity = document.getElementById('incident-severity').value;
    const coordsStr = document.getElementById('incident-coords').value;
    const description = document.getElementById('incident-desc').value;
    const reporterName = document.getElementById('incident-reporter-name').value || "Field Officer";

    if (!coordsStr || !description) {
      this.showNotification("Please provide coordinates and a detailed description.", "warning");
      return;
    }

    const parts = coordsStr.split(',').map(s => parseFloat(s.trim()));
    if (parts.length !== 2 || isNaN(parts[0]) || isNaN(parts[1])) {
      this.showNotification("Invalid GPS format. Use: 26.1445, 91.7362", "warning");
      return;
    }

    const reportData = {
      type,
      severity,
      coords: parts,
      description,
      reporterName
    };

    await this.incidentReporter.saveReportLocally(reportData);

    // Reset form
    document.getElementById('incident-desc').value = "";
    this.showNotification("📝 Incident report recorded! Saved locally in IndexedDB queue.", "success");

    // If online, trigger immediate sync
    if (navigator.onLine) {
      setTimeout(() => this.incidentReporter.syncPendingReports(), 1000);
    }
  }

  showNotification(message, type = 'info') {
    const container = document.getElementById('toast-notification-container');
    if (!container) return;

    const toast = document.createElement('div');
    let borderClass = 'border-cyan-500/50 bg-slate-900/95 text-cyan-300';
    if (type === 'success') borderClass = 'border-emerald-500/50 bg-slate-900/95 text-emerald-300';
    if (type === 'warning') borderClass = 'border-amber-500/50 bg-slate-900/95 text-amber-300';
    if (type === 'danger') borderClass = 'border-rose-500/50 bg-slate-900/95 text-rose-300';

    toast.className = `p-3 rounded-xl border ${borderClass} shadow-2xl backdrop-blur text-xs flex items-center justify-between gap-3 min-w-[280px] max-w-[420px] transition-all transform duration-300 translate-y-2 opacity-0`;
    toast.innerHTML = `
      <span>${message}</span>
      <button class="text-gray-400 hover:text-white font-bold">&times;</button>
    `;

    container.appendChild(toast);

    // Animate in
    setTimeout(() => {
      toast.classList.remove('translate-y-2', 'opacity-0');
    }, 10);

    const closeToast = () => {
      toast.classList.add('opacity-0', '-translate-y-2');
      setTimeout(() => toast.remove(), 300);
    };

    toast.querySelector('button').addEventListener('click', closeToast);
    setTimeout(closeToast, 5000);
  }

  startLiveClock() {
    const clockEl = document.getElementById('live-ist-clock');
    if (!clockEl) return;

    const updateTime = () => {
      const now = new Date();
      clockEl.innerText = `${now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })} | ${now.toLocaleTimeString('en-US', { hour12: false })} IST`;
    };

    updateTime();
    setInterval(updateTime, 1000);
  }
}

// Global App Instance
window.addEventListener('DOMContentLoaded', () => {
  window.app = new NER_App();
  window.app.init();
});
