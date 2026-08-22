/**
 * Real-Time GPS Fleet & Essential Supply Tracker for North Eastern Region (NER)
 * Handles live convoy movement simulation, cold-chain telemetry, altitude & speed tracking
 */

class NER_FleetTracker {
  constructor(gisMap) {
    this.gisMap = gisMap;
    this.convoys = JSON.parse(JSON.stringify(window.NER_CONFIG.convoys));
    this.simulationInterval = null;
    this.activeConvoyId = this.convoys[0].id;
  }

  init() {
    this.renderFleetList();
    this.renderTelemetryHUD(this.convoys[0]);
    this.startLiveTelemetryStream();
  }

  renderFleetList() {
    const container = document.getElementById('fleet-list-container');
    if (!container) return;

    container.innerHTML = this.convoys.map(cnv => {
      let badgeColor = "bg-emerald-500/20 text-emerald-400 border-emerald-500/40";
      if (cnv.riskLevel.includes("Critical")) {
        badgeColor = "bg-rose-500/20 text-rose-400 border-rose-500/40";
      } else if (cnv.riskLevel.includes("High")) {
        badgeColor = "bg-amber-500/20 text-amber-400 border-amber-500/40";
      }

      const isSelected = cnv.id === this.activeConvoyId;

      return `
        <div onclick="window.fleetTracker.selectConvoy('${cnv.id}')" 
             class="p-3.5 rounded-xl border transition-all cursor-pointer ${isSelected ? 'bg-cyan-950/40 border-cyan-500/60 shadow-lg' : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'}">
          <div class="flex items-center justify-between mb-1.5">
            <div class="flex items-center gap-2">
              <span class="font-mono text-xs font-bold text-cyan-400">${cnv.id}</span>
              <span class="text-xs px-2 py-0.5 rounded border ${badgeColor}">${cnv.cargoType.toUpperCase()}</span>
            </div>
            <span class="text-[11px] font-mono text-gray-300">ETA: <b>${cnv.etaMinutes}m</b></span>
          </div>

          <h4 class="font-semibold text-sm text-white mb-1">${cnv.name}</h4>
          <p class="text-xs text-gray-300 mb-2 truncate">📦 ${cnv.cargo}</p>

          <div class="flex items-center justify-between text-[11px] text-gray-400 border-t border-slate-800/80 pt-2">
            <span>📍 ${cnv.origin.split(' ')[0]} ➔ ${cnv.destination.split(' ')[0]}</span>
            <span class="text-cyan-300 font-mono">⚡ ${cnv.speedKmH} km/h</span>
          </div>
        </div>
      `;
    }).join('');
  }

  selectConvoy(convoyId) {
    this.activeConvoyId = convoyId;
    const cnv = this.convoys.find(c => c.id === convoyId);
    if (cnv) {
      this.renderFleetList();
      this.renderTelemetryHUD(cnv);
      if (this.gisMap) {
        this.gisMap.flyToLocation(cnv.currentCoords, 11);
      }
    }
  }

  renderTelemetryHUD(cnv) {
    const hudContainer = document.getElementById('convoy-telemetry-hud');
    if (!hudContainer) return;

    const isTempAlarm = cnv.cargoType === 'medicine' && (cnv.cargoTempC > 6.0 || cnv.cargoTempC < 2.0);

    hudContainer.innerHTML = `
      <div class="glass-panel p-4 rounded-xl border border-cyan-500/30">
        <div class="flex flex-wrap items-center justify-between gap-2 mb-3 pb-2 border-b border-slate-800">
          <div>
            <div class="flex items-center gap-2">
              <h3 class="font-bold text-base text-white">${cnv.name}</h3>
              <span class="font-mono text-xs text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800">${cnv.id}</span>
            </div>
            <p class="text-xs text-gray-400">Driver/Escort: <b class="text-gray-200">${cnv.driver}</b></p>
          </div>
          <div class="flex items-center gap-2">
            <button onclick="window.fleetTracker.focusActiveConvoy()" class="px-2.5 py-1 text-xs bg-cyan-600/30 hover:bg-cyan-600/50 text-cyan-300 rounded border border-cyan-500/50 transition">
              🎯 Center on Map
            </button>
            <button onclick="window.fleetTracker.pingConvoySOS('${cnv.id}')" class="px-2.5 py-1 text-xs bg-rose-600/30 hover:bg-rose-600/50 text-rose-300 rounded border border-rose-500/50 transition">
              🚨 Convoy SOS
            </button>
          </div>
        </div>

        <!-- Real-Time Telemetry Grid -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
          <div class="bg-slate-900/90 p-2.5 rounded-lg border border-slate-800">
            <span class="text-[10px] text-gray-400 uppercase tracking-wider block">Speed</span>
            <div class="flex items-baseline gap-1 mt-0.5">
              <span class="text-xl font-bold font-mono text-cyan-400">${cnv.speedKmH}</span>
              <span class="text-[10px] text-gray-400">km/h</span>
            </div>
            <div class="w-full bg-slate-800 h-1 rounded mt-1.5 overflow-hidden">
              <div class="bg-cyan-400 h-full" style="width: ${(cnv.speedKmH / 70) * 100}%"></div>
            </div>
          </div>

          <div class="bg-slate-900/90 p-2.5 rounded-lg border border-slate-800">
            <span class="text-[10px] text-gray-400 uppercase tracking-wider block">Altitude Profile</span>
            <div class="flex items-baseline gap-1 mt-0.5">
              <span class="text-xl font-bold font-mono text-indigo-400">${cnv.altitudeM}</span>
              <span class="text-[10px] text-gray-400">meters</span>
            </div>
            <span class="text-[10px] text-indigo-300/80">Mountain Ridge</span>
          </div>

          <div class="bg-slate-900/90 p-2.5 rounded-lg border border-slate-800 ${isTempAlarm ? 'glow-danger border-rose-500' : ''}">
            <span class="text-[10px] text-gray-400 uppercase tracking-wider block">Cargo Cold-Chain</span>
            <div class="flex items-baseline gap-1 mt-0.5">
              <span class="text-xl font-bold font-mono ${isTempAlarm ? 'text-rose-400' : 'text-emerald-400'}">${cnv.cargoTempC}°</span>
              <span class="text-[10px] text-gray-400">C</span>
            </div>
            <span class="text-[10px] ${isTempAlarm ? 'text-rose-400 font-bold' : 'text-emerald-400'}">${cnv.tempStatus}</span>
          </div>

          <div class="bg-slate-900/90 p-2.5 rounded-lg border border-slate-800">
            <span class="text-[10px] text-gray-400 uppercase tracking-wider block">Remaining ETA</span>
            <div class="flex items-baseline gap-1 mt-0.5">
              <span class="text-xl font-bold font-mono text-amber-400">${cnv.etaMinutes}</span>
              <span class="text-[10px] text-gray-400">minutes</span>
            </div>
            <span class="text-[10px] text-gray-300">To: ${cnv.destination.split(' ')[0]}</span>
          </div>
        </div>

        <div class="p-2.5 rounded bg-slate-950/80 border border-slate-800 flex items-center justify-between text-xs">
          <div class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span class="text-gray-300"><b>Current GPS:</b> <span class="font-mono text-cyan-300">${cnv.currentCoords[0].toFixed(4)}° N, ${cnv.currentCoords[1].toFixed(4)}° E</span></span>
          </div>
          <span class="text-[11px] font-semibold text-rose-400">${cnv.riskLevel}</span>
        </div>
      </div>
    `;
  }

  focusActiveConvoy() {
    const cnv = this.convoys.find(c => c.id === this.activeConvoyId);
    if (cnv && this.gisMap) {
      this.gisMap.flyToLocation(cnv.currentCoords, 12);
    }
  }

  pingConvoySOS(convoyId) {
    if (window.app) {
      window.app.showNotification(`🚨 Emergency SOS broadcast initiated for Convoy ${convoyId}! District Disaster Control alerted.`, 'danger');
    }
  }

  startLiveTelemetryStream() {
    if (this.simulationInterval) clearInterval(this.simulationInterval);

    this.simulationInterval = setInterval(() => {
      // Slightly jitter coordinates and update speed/temp for realistic live stream
      this.convoys.forEach(cnv => {
        // Subtle coordinate drift along road
        const latDrift = (Math.random() - 0.5) * 0.002;
        const lngDrift = (Math.random() - 0.5) * 0.002;
        cnv.currentCoords[0] += latDrift;
        cnv.currentCoords[1] += lngDrift;

        // Speed fluctuation
        cnv.speedKmH = Math.max(12, Math.min(65, Math.round(cnv.speedKmH + (Math.random() - 0.5) * 4)));
        
        // Altitude slight change
        cnv.altitudeM = Math.round(cnv.altitudeM + (Math.random() - 0.5) * 5);

        // Temp slight fluctuation
        if (cnv.cargoType === 'medicine') {
          cnv.cargoTempC = parseFloat((3.8 + (Math.random() - 0.5) * 0.4).toFixed(1));
        }

        // ETA decrement
        if (cnv.etaMinutes > 5 && Math.random() > 0.6) {
          cnv.etaMinutes -= 1;
        }
      });

      // Update map marker positions if map ready
      if (this.gisMap && this.gisMap.layers && this.gisMap.layers.fleet) {
        this.gisMap.renderFleetMarkers();
      }

      // Update HUD if visible
      const activeCnv = this.convoys.find(c => c.id === this.activeConvoyId);
      if (activeCnv) {
        this.renderTelemetryHUD(activeCnv);
      }
    }, 4000);
  }
}

window.NER_FleetTracker = NER_FleetTracker;
