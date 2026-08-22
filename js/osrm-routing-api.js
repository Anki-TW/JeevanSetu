/**
 * OSRM (Open Source Routing Machine) & openrouteservice Live Directions API
 * Real-Time Driving Geometry & Turn-by-Turn Routing Engine (100% Free)
 */

class NER_OSRMRoutingAPI {
  constructor(gisMap) {
    this.gisMap = gisMap;
  }

  /**
   * Fetch real-time live driving route from OSRM API between two GPS points
   * @param {Array} startCoords - [lat, lng]
   * @param {Array} endCoords - [lat, lng]
   */
  async fetchLiveRoute(startCoords, endCoords) {
    // OSRM expects [lng, lat]
    const url = `https://router.project-osrm.org/route/v1/driving/${startCoords[1]},${startCoords[0]};${endCoords[1]},${endCoords[0]}?overview=full&geometries=geojson`;

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("OSRM Routing API request failed");

      const data = await response.json();
      if (!data.routes || data.routes.length === 0) {
        throw new Error("No route found between coordinates");
      }

      const route = data.routes[0];
      const distanceKm = (route.distance / 1000).toFixed(1);
      const durationHrs = (route.duration / 3600).toFixed(1);

      // Convert GeoJSON [lng, lat] to Leaflet [lat, lng]
      const leafletCoords = route.geometry.coordinates.map(coord => [coord[1], coord[0]]);

      const routeResult = {
        name: "Live OSRM Real-Time Navigation Route",
        distanceKm: parseFloat(distanceKm),
        normalDurationHrs: parseFloat(durationHrs),
        coordinates: leafletCoords
      };

      console.log(`✅ Live OSRM Route calculated: ${distanceKm} km, ${durationHrs} hrs`);
      return routeResult;

    } catch (err) {
      console.warn("⚠️ OSRM API fallback to internal graph:", err);
      return null;
    }
  }
}

window.NER_OSRMRoutingAPI = NER_OSRMRoutingAPI;
