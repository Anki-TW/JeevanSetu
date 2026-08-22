/**
 * GIS Mapping & Spatial Analytics Engine for Jeevan Setu (North Eastern Region)
 * Supported Base Maps:
 * 1. Terrain Contours (Topo) - OpenTopoMap
 * 2. Tactical Dark - CartoDB Dark Matter
 * 3. Standard OSM - OpenStreetMap
 * 4. Satellite Imagery - Esri World Imagery
 */

class NER_GISMap {
  constructor(mapContainerId) {
    this.containerId = mapContainerId;
    this.map = null;
    this.currentBaseMapName = 'Terrain Contours (Topo)';
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
      center: [26.4, 93.0],
      zoom: 7,
      minZoom: 6,
      maxZoom: 17,
      zoomControl: false,
      attributionControl: false
    });

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

    // Render Geographic Data
    this.renderHighways();
    this.renderDistricts();
    this.renderBridges();
    this.renderFleetMarkers();
    this.renderIncidentMarkers();
    this.renderWeatherRadar();

    // Map Click Listener
    this.map.on('click', (e) => {
      const lat = e.latlng.lat.toFixed(4);
      const lng = e.latlng.lng.toFixed(4);
      if (window.app) {
        window.app.showNotification(`📍 Map Click: ${lat}° N, ${lng}° E`, 'info');
      }
    });

    // Ensure Leaflet recalculates layout size
    setTimeout(() => {
      if (this.map) {
        this.map.invalidateSize();
      }
    }, 200);

    console.log("🗺️ Jeevan Setu GIS Engine successfully initialized with Topo, Tactical Dark & OSM.");
  }

  setupBaseLayers() {
    // 1. OpenTopoMap (Terrain Contours for Himalayan Hills)
    const openTopo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
      maxZoom: 17,
      subdomains: 'abc'
    });

    // 2. Tactical Dark (CartoDB Dark Matter)
    const darkMatter = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      subdomains: 'abcd'
    });

    // 3. Standard OpenStreetMap
    const osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19
    });

    // 4. Satellite Imagery (Esri World Imagery)
    const satellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      maxZoom: 18
    });

    // 5. ISRO Bhuvan Indian Geospatial Service Layer
    const bhuvan = L.tileLayer('https://bhuvan-vec1.nrsc.gov.in/bhuvan/gwc/service/wmts?layer=india3&style=default&tilematrixset=EPSG%3A900913&Service=WMTS&Request=GetTile&Version=1.0.0&Format=image%2Fpng&TileMatrix=EPSG%3A900913%3A{z}&TileCol={x}&TileRow={y}', {
      maxZoom: 18,
      attribution: 'ISRO Bhuvan NRSC'
    });

    // 6. NASA Earthdata GIBS Live Precipitation & Cloud Overlay Layer
    const nasaEarthdata = L.tileLayer('https://gibs-{s}.earthdata.nasa.gov/wmts/epsg3857/best/MODIS_Terra_CorrectedReflectance_TrueColor/default/2026-08-20/GoogleMapsCompatible_Level9/{z}/{y}/{x}.jpg', {
      maxZoom: 9,
      subdomains: 'abc',
      attribution: 'NASA Earthdata GIBS'
    });

    this.layers.baseMaps = {
      "Terrain Contours (Topo)": openTopo,
      "Tactical Dark": darkMatter,
      "Standard OSM": osm,
      "Satellite Imagery": satellite,
      "ISRO Bhuvan (India)": bhuvan,
      "NASA Earthdata Satellite": nasaEarthdata
    };

    // Default to Terrain Topo
    openTopo.addTo(this.map);
  }

  setBaseMap(layerName) {
    if (!this.layers.baseMaps[layerName]) return;

    this.currentBaseMapName = layerName;

    // Remove current base layers
    Object.values(this.layers.baseMaps).forEach(layer => {
      if (this.map.hasLayer(layer)) {
        this.map.removeLayer(layer);
      }
    });

    // Add selected layer
    this.layers.baseMaps[layerName].addTo(this.map);

    // Sync Dropdown
    const selector = document.getElementById('basemap-selector');
    if (selector) selector.value = layerName;

    // Sync Top Header Button States
    const btnTopo = document.getElementById('btn-bm-topo');
    const btnDark = document.getElementById('btn-bm-dark');
    const btnOsm = document.getElementById('btn-bm-osm');

    if (btnTopo && btnDark && btnOsm) {
      [btnTopo, btnDark, btnOsm].forEach(b => {
        b.className = "px-2.5 py-1 rounded-lg font-semibold text-slate-600 hover:bg-white transition flex items-center gap-1";
      });

      if (layerName === 'Terrain Contours (Topo)') {
        btnTopo.className = "px-2.5 py-1 rounded-lg font-semibold text-slate-700 hover:bg-white transition flex items-center gap-1 bg-white shadow-xs";
      } else if (layerName === 'Tactical Dark') {
        btnDark.className = "px-2.5 py-1 rounded-lg font-semibold text-slate-700 hover:bg-white transition flex items-center gap-1 bg-white shadow-xs";
      } else if (layerName === 'Standard OSM') {
        btnOsm.className = "px-2.5 py-1 rounded-lg font-semibold text-slate-700 hover:bg-white transition flex items-center gap-1 bg-white shadow-xs";
      }
    }

    if (window.app) {
      window.app.showNotification(`🗺️ Map style changed to ${layerName}`, 'info');
    }
  }

  renderHighways() {
    this.layers.highways.clearLayers();
    const highways = window.NER_CONFIG.highways;

    highways.forEach(hw => {
      // Glow polyline underlay
      L.polyline(hw.path, {
        color: hw.color,
        weight: 6,
        opacity: 0.45,
        smoothFactor: 1
      }).addTo(this.layers.highways);

      // Core polyline
      const line = L.polyline(hw.path, {
        color: hw.color,
        weight: 3.5,
        opacity: 0.95,
        dashArray: hw.riskLevel === 'Critical' ? '8, 8' : null
      }).addTo(this.layers.highways);

      line.bindPopup(`
        <div class="p-3 font-sans">
          <div class="flex items-center gap-2 mb-1">
            <span class="w-3 h-3 rounded-full" style="background-color: ${hw.color}"></span>
            <h4 class="font-bold text-sm text-cyan-400">${hw.name}</h4>
          </div>
          <p class="text-xs text-gray-300 mb-2"><b>Status:</b> ${hw.status}</p>
          <div class="grid grid-cols-2 gap-2 text-[11px] bg-slate-900 p-2 rounded border border-slate-700">
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
      let fillColor = '#10b981';
      let strokeColor = '#34d399';

      if (district.status === 'warning') {
        fillColor = '#f59e0b';
        strokeColor = '#fbbf24';
      } else if (district.status === 'critical') {
        fillColor = '#ef4444';
        strokeColor = '#f87171';
      }

      // Circle representing accessibility zone
      const circle = L.circle(district.coords, {
        radius: district.logisticsHub ? 15000 : 10000,
        fillColor: fillColor,
        fillOpacity: 0.25,
        color: strokeColor,
        weight: district.status === 'critical' ? 2.5 : 1.5,
        dashArray: district.status === 'critical' ? '4, 4' : null
      }).addTo(this.layers.districts);

      // District Center Marker
      const centerMarker = L.circleMarker(district.coords, {
        radius: district.logisticsHub ? 6 : 4,
        fillColor: fillColor,
        fillOpacity: 0.95,
        color: '#ffffff',
        weight: 2
      }).addTo(this.layers.districts);

      centerMarker.bindTooltip(`<b>${district.name}</b> (${district.state})`, {
        permanent: false,
        className: 'custom-leaflet-tooltip'
      });

      this.markerRefs.districts[district.id] = { circle, centerMarker, coords: district.coords };
    });
  }

  renderBridges() {
    this.layers.bridges.clearLayers();
    const bridges = window.NER_CONFIG.bridges;

    bridges.forEach(br => {
      const isDamaged = br.healthIndex < 60;
      const iconHtml = `
        <div class="w-6 h-6 rounded-full flex items-center justify-center ${isDamaged ? 'bg-rose-600 animate-pulse text-white' : 'bg-indigo-600 text-white'} border border-white shadow-lg text-[11px]">
          🌉
        </div>
      `;

      const customIcon = L.divIcon({
        html: iconHtml,
        className: 'custom-bridge-icon',
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });

      L.marker(br.coords, { icon: customIcon })
        .bindTooltip(`🌉 <b>${br.name}</b> (${br.status})`, { className: 'custom-leaflet-tooltip' })
        .addTo(this.layers.bridges);
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
      }

      const iconHtml = `
        <div class="w-8 h-8 rounded-full ${bgClass} flex items-center justify-center text-white border-2 border-white shadow-xl text-sm cursor-pointer hover:scale-110 transition">
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
      marker.bindTooltip(`🚚 <b>${cnv.id}</b>: ${cnv.cargo}`, { className: 'custom-leaflet-tooltip' });
      this.markerRefs.convoys[cnv.id] = marker;
    });
  }

  renderIncidentMarkers() {
    this.layers.incidents.clearLayers();
    const incidents = window.NER_CONFIG.incidents;

    incidents.forEach(inc => {
      const isCritical = inc.severity === "critical";
      const iconHtml = `
        <div class="w-7 h-7 rounded-full ${isCritical ? 'bg-rose-600 pulse-hazard' : 'bg-amber-600'} flex items-center justify-center text-white border-2 border-white shadow-2xl text-xs cursor-pointer">
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
      marker.bindTooltip(`⚠️ <b>${inc.title}</b> (${inc.locationName})`, { className: 'custom-leaflet-tooltip' });
      this.markerRefs.incidents[inc.id] = marker;
    });
  }

  renderWeatherRadar() {
    this.layers.weatherRadar.clearLayers();
    const radarHotspots = [
      { center: [25.2700, 91.7300], radius: 45000, color: '#0284c7', intensity: 'Heavy Monsoon Storm' },
      { center: [27.5000, 88.5333], radius: 35000, color: '#2563eb', intensity: 'Glacial Rain & Cloudburst' },
      { center: [25.1764, 93.0238], radius: 38000, color: '#0284c7', intensity: 'Hill Section Rain' },
      { center: [27.5861, 91.8594], radius: 30000, color: '#7c3aed', intensity: 'Sleet & Freezing Rain' }
    ];

    radarHotspots.forEach(radar => {
      L.circle(radar.center, {
        radius: radar.radius,
        color: radar.color,
        fillColor: radar.color,
        fillOpacity: 0.22,
        weight: 1.5,
        dashArray: '5, 5'
      }).bindTooltip(`🌧️ <b>${radar.intensity}</b>`, { className: 'custom-leaflet-tooltip' })
        .addTo(this.layers.weatherRadar);
    });
  }

  drawRoute(routeGeoJson, isAlternate = false) {
    this.layers.activeRoute.clearLayers();

    const routeLine = L.polyline(routeGeoJson.coordinates, {
      color: isAlternate ? '#10b981' : '#0284c7',
      weight: 5,
      opacity: 0.95,
      dashArray: isAlternate ? '8, 4' : null
    }).addTo(this.layers.activeRoute);

    this.map.fitBounds(routeLine.getBounds(), { padding: [50, 50] });
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
