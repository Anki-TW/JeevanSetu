/**
 * Corridor Alerts & Emergency Broadcast Manager for North Eastern Region (NER)
 * Dispatches multi-channel alerts (GIS overlay, SMS dispatch, disaster sirens)
 */

class NER_AlertsManager {
  constructor(gisMap) {
    this.gisMap = gisMap;
    this.alerts = window.NER_CONFIG.incidents;
  }

  init() {
    this.renderAlerts();
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
      reportedAt: "Just now (HQ Broadcast)",
      reportedBy: "State Emergency Operation Centre (SEOC)",
      verified: true,
      estimatedClearanceHrs: 48,
      details: message || "Immediate advisory: Avoid river crossings and steep mountain roads. Heavy machinery mobilized."
    };

    window.NER_CONFIG.incidents.unshift(newBroadcast);
    this.renderAlerts();
    if (this.gisMap) {
      this.gisMap.renderIncidentMarkers();
    }

    if (window.app) {
      window.app.showNotification(`🚨 Emergency Alert Broadcast sent to ${affectedDistricts || 'Regional Centers'} and published to GIS feed!`, "danger");
    }
  }
}

window.NER_AlertsManager = NER_AlertsManager;
