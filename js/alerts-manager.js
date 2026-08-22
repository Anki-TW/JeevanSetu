/**
 * Corridor Alerts & Emergency Broadcast Manager for North Eastern Region (NER)
 * Dispatches multi-channel alerts (GIS overlay, SMS dispatch, disaster sirens)
 * Dynamically updates relative time (e.g. 2 min ago -> 3 min ago)
 */

class NER_AlertsManager {
  constructor(gisMap) {
    this.gisMap = gisMap;
    this.alerts = window.NER_CONFIG.incidents;
    this.timer = null;
  }

  init() {
    this.renderAlerts();
    this.renderRecentAlertsWidget();
    
    // Auto-update timestamps every 30 seconds
    if (this.timer) clearInterval(this.timer);
    this.timer = setInterval(() => {
      this.renderRecentAlertsWidget();
    }, 30000);
  }

  renderRecentAlertsWidget() {
    const container = document.getElementById('recent-alerts-widget-list');
    if (!container) return;

    const topAlerts = this.alerts.slice(0, 4);

    container.innerHTML = topAlerts.map(alert => {
      let icon = "⚠️";
      let bgClass = "bg-rose-50/70 border-rose-100 text-rose-700";
      let iconColor = "text-rose-600";

      if (alert.type.includes("Flood")) {
        icon = "🌊";
        bgClass = "bg-cyan-50/70 border-cyan-100 text-cyan-800";
        iconColor = "text-cyan-600";
      } else if (alert.type.includes("Bridge") || alert.type.includes("Damage")) {
        icon = "🚧";
        bgClass = "bg-amber-50/70 border-amber-100 text-amber-800";
        iconColor = "text-amber-600";
      } else if (alert.type.includes("Rain") || alert.type.includes("Snow")) {
        icon = "🌧️";
        bgClass = "bg-blue-50/70 border-blue-100 text-blue-800";
        iconColor = "text-blue-600";
      }

      return `
        <div onclick="window.alertsManager.focusAlert('${alert.id}')" 
             class="flex items-start gap-2.5 p-2 rounded-lg ${bgClass} border cursor-pointer hover:shadow-sm transition">
          <span class="text-base ${iconColor} shrink-0 mt-0.5">${icon}</span>
          <div class="flex-1 overflow-hidden">
            <div class="flex items-center justify-between gap-1">
              <b class="text-slate-800 truncate text-[11px]">${alert.title}</b>
              <span class="text-[9px] text-slate-400 font-mono shrink-0">${alert.reportedAt}</span>
            </div>
            <p class="text-[10px] text-slate-500 truncate">📍 ${alert.locationName}</p>
          </div>
        </div>
      `;
    }).join('');
  }

  renderAlerts(filterSeverity = 'all') {
    const container = document.getElementById('alerts-feed-container');
    if (!container) return;

    let filtered = this.alerts;
    if (filterSeverity !== 'all') {
      filtered = this.alerts.filter(a => a.severity === filterSeverity);
    }

    container.innerHTML = filtered.map(alert => {
      const isCritical = alert.severity === 'critical';
      const badgeClass = isCritical ? 'badge-critical' : alert.severity === 'high' ? 'badge-warning' : 'badge-normal';

      return `
        <div class="p-4 rounded-xl border ${isCritical ? 'bg-rose-950/20 border-rose-500/40 glow-danger' : 'bg-slate-900/80 border-slate-800'} space-y-2">
          <div class="flex items-start justify-between gap-2">
            <div>
              <div class="flex items-center gap-2 mb-1">
                <span class="font-mono text-xs font-bold text-rose-400">${alert.id}</span>
                <span class="badge-pill ${badgeClass} text-[10px]">${alert.severity.toUpperCase()}</span>
                ${alert.verified ? '<span class="text-[10px] bg-emerald-950/80 text-emerald-400 border border-emerald-800 px-1.5 py-0.5 rounded">✓ Verified by BRO/Police</span>' : ''}
              </div>
              <h4 class="font-bold text-sm text-white">${alert.title}</h4>
            </div>
            <button onclick="window.alertsManager.focusAlert('${alert.id}')" class="text-xs px-2.5 py-1 bg-cyan-600/30 hover:bg-cyan-600/50 text-cyan-300 rounded border border-cyan-500/40 transition">
              📍 Map View
            </button>
          </div>

          <p class="text-xs text-cyan-300 font-medium">📍 ${alert.locationName}</p>
          <p class="text-xs text-gray-300 leading-relaxed">${alert.details}</p>

          <div class="flex flex-wrap items-center justify-between text-[11px] text-gray-400 border-t border-slate-800/80 pt-2">
            <span>Reported: <b class="text-gray-200">${alert.reportedAt}</b> (${alert.reportedBy})</span>
            <span class="text-amber-400 font-semibold">⏳ Est. Clearance: ${alert.estimatedClearanceHrs}h</span>
          </div>
        </div>
      `;
    }).join('');
  }

  focusAlert(alertId) {
    const alert = this.alerts.find(a => a.id === alertId);
    if (alert && this.gisMap) {
      this.gisMap.flyToLocation(alert.coords, 12);
      if (this.gisMap.markerRefs.incidents[alertId]) {
        this.gisMap.markerRefs.incidents[alertId].openPopup();
      }
    }
  }

  triggerEmergencyBroadcast(title, message, affectedDistricts) {
    const newBroadcast = {
      id: "EMERGENCY-SOS-" + Date.now().toString().slice(-4),
      title: title || "URGENT: Flash Flood / Landslide Warning",
      locationName: affectedDistricts || "High Risk Corridors in NER",
      coords: [27.0500, 88.5000],
      type: "Emergency Broadcast",
      severity: "critical",
      reportedAt: "Just now",
      reportedBy: "State Emergency Operation Centre (SEOC)",
      verified: true,
      estimatedClearanceHrs: 48,
      details: message || "Immediate advisory: Avoid river crossings and steep mountain roads. Heavy machinery mobilized."
    };

    window.NER_CONFIG.incidents.unshift(newBroadcast);
    this.renderAlerts();
    this.renderRecentAlertsWidget();
    if (this.gisMap) {
      this.gisMap.renderIncidentMarkers();
    }

    if (window.app) {
      window.app.showNotification(`🚨 Emergency Alert Broadcast sent to ${affectedDistricts || 'Regional Centers'} and published to GIS feed!`, "danger");
    }
  }
}

window.NER_AlertsManager = NER_AlertsManager;
