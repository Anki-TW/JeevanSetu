/**
 * GIS Mapping & Spatial Analytics Engine for North Eastern Region (NER)
 * Uses Leaflet.js with Multiple Base Maps (Terrain, Dark Tactical, OpenStreetMap)
 * Layers: Highway Polylines, District Status Choropleth, Bridges, Fleet GPS, Incidents, Radar
 */

class NER_GISMap {
  constructor(mapContainerId) {
    this.containerId = mapContainerId;
    this.map = null;
    this.layers = {
      baseMaps: {},
      highways: null,
      districts: null,
      bridges: null,
      fleet: null,
      incidents: null,
      weatherRadar: null,
      activeRoute: null
    };
    this.markerRefs = {
      convoys: {},
      incidents: {},
      districts: {}
    };
  }

  init() {
    const config = window.NER_CONFIG.region;

    // Initialize Map with custom options
    this.map = L.map(this.containerId, {
      center: config.center,
      zoom: config.defaultZoom,
      minZoom: 6,
      maxZoom: 16,
      zoomControl: false,
      attributionControl: false
    });

    // Add Zoom Control to Top Right
    L.control.zoom({ position: 'topright' }).addTo(this.map);

    // Setup Base Maps
    this.setupBaseLayers();

    // Setup Feature Layer Groups
    this.layers.highways = L.layerGroup().addTo(this.map);
    this.layers.districts = L.layerGroup().addTo(this.map);
    this.layers.bridges = L.layerGroup().addTo(this.map);
    this.layers.fleet = L.layerGroup().addTo(this.map);
    this.layers.incidents = L.layerGroup().addTo(this.map);
    this.layers.weatherRadar = L.layerGroup().addTo(this.map);
    this.layers.activeRoute = L.layerGroup().addTo(this.map);

    // Render Data
    this.renderHighways();
    this.renderDistricts();
    this.renderBridges();
    this.renderFleetMarkers();
    this.renderIncidentMarkers();
    this.renderWeatherRadar();

    // Map Click Listener to help field reporting
    this.map.on('click', (e) => {
      const lat = e.latlng.lat.toFixed(4);
      const lng = e.latlng.lng.toFixed(4);
      const coordInput = document.getElementById('incident-coords');
      if (coordInput) {
        coordInput.value = `${lat}, ${lng}`;
        if (window.app) {
          window.app.showNotification(`📍 Coordinates selected from map: ${lat}, ${lng}`, 'info');
        }
      }
    });

    console.log("🗺️ NER GIS Engine successfully initialized.");
  }

  setupBaseLayers() {
    // 1. Dark Tactical Map (CartoDB Dark Matter)
    const darkMatter = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      subdomains: 'abcd'
    });

    // 2. OpenTopoMap (Terrain & Mountain Contours for NER Hills)
    const openTopo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
      maxZoom: 17
    });

    // 3. OpenStreetMap Standard
    const osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19
    });

    // Default to Dark Matter for Tactical Control Center look
    darkMatter.addTo(this.map);

    this.layers.baseMaps = {
      "Tactical Dark": darkMatter,
      "Terrain Contours (Topo)": openTopo,
      "Standard OSM": osm
    };
  }

  setBaseMap(layerName) {
    Object.values(this.layers.baseMaps).forEach(layer => this.map.removeLayer(layer));
    if (this.layers.baseMaps[layerName]) {
      this.layers.baseMaps[layerName].addTo(this.map);
    }
  }

  renderHighways() {
    this.layers.highways.clearLayers();
    const highways = window.NER_CONFIG.highways;

    highways.forEach(hw => {
      // Glow polyline underlay
      const glowLine = L.polyline(hw.path, {
        color: hw.color,
        weight: 8,
        opacity: 0.35,
        smoothFactor: 1
      }).addTo(this.layers.highways);

      // Core polyline
      const line = L.polyline(hw.path, {
        color: hw.color,
        weight: 3.5,
        opacity: 0.95,
        dashArray: hw.riskLevel === 'Critical' ? '8, 8' : null
      }).addTo(this.layers.highways);

      // Popup
      line.bindPopup(`
        <div class="p-3">
          <div class="flex items-center gap-2 mb-1">
            <span class="w-3 h-3 rounded-full" style="background-color: ${hw.color}"></span>
            <h4 class="font-bold text-sm text-cyan-400">${hw.name}</h4>
          </div>
          <p class="text-xs text-gray-300 mb-2"><b>Status:</b> ${hw.status}</p>
          <div class="grid grid-cols-2 gap-2 text-[11px] bg-slate-900/80 p-2 rounded border border-slate-700/50">
            <div><span class="text-gray-400">Length:</span> <b class="text-white">${hw.lengthKm} km</b></div>
            <div><span class="text-gray-400">Avg Speed:</span> <b class="text-white">${hw.avgSpeedKmH} km/h</b></div>
            <div class="col-span-2"><span class="text-gray-400">Risk Assessment:</span> <b class="${hw.riskLevel === 'Critical' ? 'text-rose-400 font-bold' : hw.riskLevel === 'High' ? 'text-amber-400' : 'text-emerald-400'}">${hw.riskLevel}</b></div>
          </div>
        </div>
      `);
    });
  }

  renderDistricts() {
    this.layers.districts.clearLayers();
    const districts = window.NER_CONFIG.districts;

    districts.forEach(district => {
      let fillColor = '#10b981'; // Green
      let strokeColor = '#34d399';
      let statusLabel = 'Normal Access';
      let badgeClass = 'badge-normal';

      if (district.status === 'warning') {
        fillColor = '#f59e0b'; // Amber
        strokeColor = '#fbbf24';
        statusLabel = 'Restricted / Caution';
        badgeClass = 'badge-warning';
      } else if (district.status === 'critical') {
        fillColor = '#f43f5e'; // Rose
        strokeColor = '#fb7185';
        statusLabel = 'Severe Disruption / Cut-Off';
        badgeClass = 'badge-critical';
      }

      // Circle representing accessibility zone
      const circle = L.circle(district.coords, {
        radius: district.logisticsHub ? 16000 : 12000,
        fillColor: fillColor,
        fillOpacity: 0.22,
        color: strokeColor,
        weight: district.status === 'critical' ? 2.5 : 1.5,
        dashArray: district.status === 'critical' ? '4, 4' : null
      }).addTo(this.layers.districts);

      // District Center Marker
      const centerMarker = L.circleMarker(district.coords, {
        radius: district.logisticsHub ? 6 : 4,
        fillColor: fillColor,
        fillOpacity: 0.9,
        color: '#ffffff',
        weight: 1.5
      }).addTo(this.layers.districts);

      // District Tooltip
      centerMarker.bindTooltip(`<b>${district.name}</b> (${district.state})`, {
        permanent: false,
        className: 'custom-leaflet-tooltip'
      });

      // Comprehensive District Inspection Popup
      const popupContent = `
        <div class="p-3 min-w-[260px]">
          <div class="flex items-center justify-between gap-2 mb-2">
            <h4 class="font-bold text-sm text-white">${district.name}</h4>
            <span class="badge-pill ${badgeClass} text-[10px]">${statusLabel}</span>
          </div>
          <p class="text-[11px] text-gray-400 mb-2">State: <b class="text-gray-200">${district.state}</b></p>
          
          <div class="space-y-1.5 text-xs bg-slate-900/90 p-2.5 rounded-lg border border-slate-800 mb-2">
            <div class="flex justify-between">
              <span class="text-gray-400">Vulnerability Index:</span>
              <b class="${district.vulnerabilityScore > 75 ? 'text-rose-400 font-bold' : district.vulnerabilityScore > 50 ? 'text-amber-400' : 'text-emerald-400'}">${district.vulnerabilityScore}/100</b>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-400">24h Rainfall:</span>
              <b class="text-cyan-400 font-mono">${district.rainfall24h} mm</b>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-400">Landslide Risk:</span>
              <span class="text-[11px] text-gray-200">${district.landslideRisk}</span>
            </div>
          </div>

          <div class="text-[11px]">
            <span class="text-gray-400 font-semibold block mb-1">Essential Stock Remaining:</span>
            <div class="space-y-1">
              <div>
                <div class="flex justify-between text-[10px] mb-0.5">
                  <span>Medicines / Vaccines:</span>
                  <span class="font-mono ${district.stockStatus.medicine < 40 ? 'text-rose-400 font-bold' : 'text-emerald-400'}">${district.stockStatus.medicine}%</span>
                </div>
                <div class="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div class="h-full ${district.stockStatus.medicine < 40 ? 'bg-rose-500' : 'bg-emerald-500'}" style="width: ${district.stockStatus.medicine}%"></div>
                </div>
              </div>
              <div>
                <div class="flex justify-between text-[10px] mb-0.5">
                  <span>Food Grains (PDS):</span>
                  <span class="font-mono ${district.stockStatus.food < 40 ? 'text-rose-400 font-bold' : 'text-emerald-400'}">${district.stockStatus.food}%</span>
                </div>
                <div class="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div class="h-full ${district.stockStatus.food < 40 ? 'bg-rose-500' : 'bg-amber-500'}" style="width: ${district.stockStatus.food}%"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;

      circle.bindPopup(popupContent);
      centerMarker.bindPopup(popupContent);

      this.markerRefs.districts[district.id] = { circle, centerMarker, coords: district.coords };
    });
  }

  renderBridges() {
    this.layers.bridges.clearLayers();
    const bridges = window.NER_CONFIG.bridges;

    bridges.forEach(br => {
      const isDamaged = br.healthIndex < 60;
      const iconHtml = `
        <div class="w-6 h-6 rounded-full flex items-center justify-center ${isDamaged ? 'bg-rose-600 animate-pulse text-white' : 'bg-indigo-600 text-white'} border border-white/40 shadow-lg text-[10px]">
          🌉
        </div>
      `;

      const customIcon = L.divIcon({
        html: iconHtml,
        className: 'custom-bridge-icon',
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });

      const marker = L.marker(br.coords, { icon: customIcon }).addTo(this.layers.bridges);
      marker.bindPopup(`
        <div class="p-3">
          <div class="flex items-center gap-1.5 mb-1">
            <span class="text-base">🌉</span>
            <h4 class="font-bold text-xs text-indigo-300">${br.name}</h4>
          </div>
          <div class="text-xs space-y-1 bg-slate-900/90 p-2 rounded border border-slate-800">
            <p><b>Status:</b> <span class="${isDamaged ? 'text-rose-400 font-bold' : 'text-emerald-400'}">${br.status}</span></p>
            <p><b>Structural Health Index:</b> <b class="font-mono ${isDamaged ? 'text-rose-400' : 'text-emerald-400'}">${br.healthIndex}/100</b></p>
            <p class="text-[11px] text-gray-300 border-t border-slate-700/50 pt-1 mt-1"><b class="text-cyan-400">Telemetry:</b> ${br.sensorAlert}</p>
          </div>
        </div>
      `);
    });
  }

  renderFleetMarkers() {
    this.layers.fleet.clearLayers();
    const convoys = window.NER_CONFIG.convoys;

    convoys.forEach(cnv => {
      let iconEmoji = "🚚";
      let bgClass = "bg-cyan-600";
      if (cnv.cargoType === "medicine") {
        iconEmoji = "💉";
        bgClass = "bg-rose-600";
      } else if (cnv.cargoType === "fuel") {
        iconEmoji = "⛽";
        bgClass = "bg-amber-600";
      } else if (cnv.cargoType === "relief") {
        iconEmoji = "🏕️";
        bgClass = "bg-emerald-600";
      }

      const iconHtml = `
        <div class="w-8 h-8 rounded-full ${bgClass} flex items-center justify-center text-white border-2 border-white shadow-xl glow-success text-sm cursor-pointer">
          ${iconEmoji}
        </div>
      `;

      const divIcon = L.divIcon({
        html: iconHtml,
        className: 'custom-vehicle-marker',
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      const marker = L.marker(cnv.currentCoords, { icon: divIcon }).addTo(this.layers.fleet);

      marker.bindPopup(`
        <div class="p-3 min-w-[250px]">
          <div class="flex items-center justify-between mb-2">
            <span class="font-mono text-xs font-bold text-cyan-400">${cnv.id}</span>
            <span class="badge-pill badge-normal text-[10px]">Live Telemetry</span>
          </div>
          <h4 class="font-bold text-xs text-white mb-1">${cnv.name}</h4>
          <p class="text-[11px] text-gray-300 mb-2"><b>Cargo:</b> ${cnv.cargo}</p>
          
          <div class="grid grid-cols-2 gap-1.5 text-[10px] bg-slate-900/90 p-2 rounded border border-slate-800 mb-2">
            <div><span class="text-gray-400">Speed:</span> <b class="text-white font-mono">${cnv.speedKmH} km/h</b></div>
            <div><span class="text-gray-400">Altitude:</span> <b class="text-cyan-400 font-mono">${cnv.altitudeM} m</b></div>
            <div><span class="text-gray-400">Cargo Temp:</span> <b class="text-rose-400 font-mono">${cnv.cargoTempC} °C</b></div>
            <div><span class="text-gray-400">Est. ETA:</span> <b class="text-amber-400 font-mono">${cnv.etaMinutes} mins</b></div>
          </div>
          
          <div class="text-[10px] text-gray-300">
            <p><b>Origin:</b> ${cnv.origin}</p>
            <p><b>Destination:</b> ${cnv.destination}</p>
            <p class="text-rose-400 font-semibold mt-1">⚠️ ${cnv.riskLevel}</p>
          </div>
        </div>
      `);

      this.markerRefs.convoys[cnv.id] = marker;
    });
  }

  renderIncidentMarkers() {
    this.layers.incidents.clearLayers();
    const incidents = window.NER_CONFIG.incidents;

    incidents.forEach(inc => {
      const isCritical = inc.severity === "critical";
      const iconHtml = `
        <div class="w-7 h-7 rounded-full ${isCritical ? 'bg-rose-600 glow-danger' : 'bg-amber-600'} flex items-center justify-center text-white border-2 border-white/80 shadow-2xl text-xs cursor-pointer">
          ⚠️
        </div>
      `;

      const divIcon = L.divIcon({
        html: iconHtml,
        className: 'custom-incident-marker',
        iconSize: [28, 28],
        iconAnchor: [14, 14]
      });

      const marker = L.marker(inc.coords, { icon: divIcon }).addTo(this.layers.incidents);

      marker.bindPopup(`
        <div class="p-3 min-w-[260px]">
          <div class="flex items-center justify-between mb-1.5">
            <span class="font-mono text-[10px] text-rose-400 font-bold">${inc.id}</span>
            <span class="badge-pill ${isCritical ? 'badge-critical' : 'badge-warning'} text-[10px]">${inc.severity.toUpperCase()}</span>
          </div>
          <h4 class="font-bold text-xs text-white mb-1">${inc.title}</h4>
          <p class="text-[11px] text-cyan-300 mb-1">📍 ${inc.locationName}</p>
          <p class="text-[11px] text-gray-300 bg-slate-900/90 p-2 rounded border border-slate-800 mb-2">${inc.details}</p>
          
          <div class="text-[10px] space-y-1 text-gray-400">
            <p><b>Reported:</b> ${inc.reportedAt} by <span class="text-gray-200">${inc.reportedBy}</span></p>
            <p><b>Est. Clearance Time:</b> <b class="text-amber-400 font-mono">${inc.estimatedClearanceHrs} Hours</b></p>
          </div>
        </div>
      `);

      this.markerRefs.incidents[inc.id] = marker;
    });
  }

  renderWeatherRadar() {
    this.layers.weatherRadar.clearLayers();
    // Simulate precipitation radar heat zones over heavy rainfall regions (Cherrapunji, North Sikkim, Dima Hasao, Tawang)
    const radarHotspots = [
      { center: [25.2700, 91.7300], radius: 45000, color: '#06b6d4', intensity: 'Heavy Monsoon Storm' }, // Sohra / Meghalaya
      { center: [27.5000, 88.5333], radius: 35000, color: '#3b82f6', intensity: 'Glacial Rain & Cloudburst Risk' }, // Sikkim
      { center: [25.1764, 93.0238], radius: 38000, color: '#06b6d4', intensity: 'Hill Section Rain Cell' }, // Haflong
      { center: [27.5861, 91.8594], radius: 30000, color: '#6366f1', intensity: 'Freezing Rain & Sleet' } // Tawang
    ];

    radarHotspots.forEach(radar => {
      L.circle(radar.center, {
        radius: radar.radius,
        color: radar.color,
        fillColor: radar.color,
        fillOpacity: 0.18,
        weight: 1.5,
        dashArray: '5, 5'
      }).bindTooltip(`🌧️ <b>${radar.intensity}</b>`, { className: 'custom-leaflet-tooltip' })
        .addTo(this.layers.weatherRadar);
    });
  }

  drawRoute(routeGeoJson, isAlternate = false) {
    this.layers.activeRoute.clearLayers();

    // Alternate route line
    const routeLine = L.polyline(routeGeoJson.coordinates, {
      color: isAlternate ? '#10b981' : '#38bdf8',
      weight: 5,
      opacity: 0.9,
      dashArray: isAlternate ? '8, 4' : null
    }).addTo(this.layers.activeRoute);

    // Zoom map to fit route
    this.map.fitBounds(routeLine.getBounds(), { padding: [50, 50] });

    console.log(`📍 Plotted ${isAlternate ? 'AI Alternate' : 'Direct'} Route on GIS Canvas.`);
  }

  flyToLocation(coords, zoomLevel = 10) {
    if (this.map && coords) {
      this.map.flyTo(coords, zoomLevel, {
        duration: 1.5
      });
    }
  }

  toggleLayer(layerKey, isVisible) {
    if (!this.layers[layerKey]) return;
    if (isVisible) {
      this.map.addLayer(this.layers[layerKey]);
    } else {
      this.map.removeLayer(this.layers[layerKey]);
    }
  }
}

window.NER_GISMap = NER_GISMap;
