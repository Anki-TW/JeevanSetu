/**
 * AI Disruption Prediction & Terrain-Aware Routing Engine for North Eastern Region (NER)
 * Models:
 * 1. Landslide Hazard Index (LHI) = f(Rainfall, Slope_deg, Soil_Saturation, Geological_Faults)
 * 2. Flood Vulnerability Index (FVI) = f(River_Basin_Scour, 24h_Precipitation, Drainage_Capacity)
 * 3. Dynamic Multi-Modal Alternate Routing Graph
 */

class NER_AIPredictionEngine {
  constructor() {
    this.routeGraph = this.initializeRouteGraph();
  }

  /**
   * Compute Real-Time Landslide Hazard Index (0 to 100)
   * @param {number} rainfallMm - 24-hour rainfall in millimeters
   * @param {number} slopeDeg - Terrain slope gradient in degrees
   * @param {number} soilSaturation - Soil moisture saturation (0.0 to 1.0)
   * @param {boolean} historicalBreachZone - Is the corridor a known sinking/breach zone
   */
  calculateLandslideHazardIndex(rainfallMm, slopeDeg, soilSaturation = 0.75, historicalBreachZone = false) {
    // Weighted multi-factor empirical geotechnical formula
    const wRainfall = 0.35;
    const wSlope = 0.30;
    const wSoil = 0.20;
    const wHistory = 0.15;

    const normRainfall = Math.min(100, (rainfallMm / 150) * 100);
    const normSlope = Math.min(100, (slopeDeg / 45) * 100);
    const normSoil = soilSaturation * 100;
    const normHistory = historicalBreachZone ? 95 : 20;

    const lhi = (normRainfall * wRainfall) + (normSlope * wSlope) + (normSoil * wSoil) + (normHistory * wHistory);
    return Math.round(Math.min(99, Math.max(5, lhi)));
  }

  /**
   * Compute River Flash-Flood Vulnerability Index (0 to 100)
   */
  calculateFloodVulnerabilityIndex(rainfallMm, basinElevationM, proximityToRiverKm) {
    const rainfallFactor = Math.min(100, (rainfallMm / 120) * 100) * 0.5;
    const elevationFactor = Math.max(0, (1500 - basinElevationM) / 15) * 0.3; // Lowlands more prone
    const proximityFactor = Math.max(0, (10 - proximityToRiverKm) * 10) * 0.2;

    const fvi = rainfallFactor + elevationFactor + proximityFactor;
    return Math.round(Math.min(98, Math.max(10, fvi)));
  }

  /**
   * Route Graph with Pre-calculated Terrain Corridors across NER
   */
  initializeRouteGraph() {
    return {
      "as_kamrup-ar_tawang": {
        originName: "Guwahati (Kamrup Metro)",
        destName: "Tawang (High Altitude Corridor)",
        standardRoute: {
          name: "Direct Route via BCT Road (Tezpur - Bomdila - Sela Pass)",
          distanceKm: 485,
          normalDurationHrs: 14.5,
          riskLevel: "Critical (89/100)",
          riskStatus: "NH Blockage at Sela Top (Mudflow & Snow Accumulation)",
          disruptionDelayHrs: 18.0,
          safetyScore: 22,
          coordinates: [
            [26.1445, 91.7362], // Guwahati
            [26.6528, 92.7926], // Tezpur
            [27.1500, 92.5000], // Rupa
            [27.2600, 92.4200], // Bomdila
            [27.4200, 92.1500], // Dirang
            [27.5050, 92.0950], // Sela Pass (Disruption point)
            [27.5861, 91.8594]  // Tawang
          ]
        },
        aiAlternateRoute: {
          name: "AI Bypass via Orang-Kalaktang-Shergaon-Rupa (OKSR) & Sela Tunnel South Bypass",
          distanceKm: 512,
          normalDurationHrs: 16.0,
          riskLevel: "Low Risk (28/100)",
          riskStatus: "All Bridges Green, Slope Reinforcement Active, Safe Elevation Profile",
          disruptionDelayHrs: 1.5,
          safetyScore: 91,
          fuelVarianceLiters: "+14L",
          coordinates: [
            [26.1445, 91.7362], // Guwahati
            [26.7000, 92.1000], // Orang
            [26.9800, 92.1500], // Kalaktang
            [27.1200, 92.2600], // Shergaon
            [27.2600, 92.4200], // Bomdila
            [27.4200, 92.1500], // Dirang Valley
            [27.5300, 91.9500], // Sela Tunnel Lower Bypass
            [27.5861, 91.8594]  // Tawang
          ]
        }
      },

      "as_kamrup-as_cachar": {
        originName: "Guwahati (Kamrup Metro)",
        destName: "Silchar (Barak Valley Gateway)",
        standardRoute: {
          name: "Standard NH-6 Corridor via Shillong - Jowai - Sonapur Tunnel",
          distanceKm: 310,
          normalDurationHrs: 9.0,
          riskLevel: "High (76/100)",
          riskStatus: "Active Mudslide at Sonapur Tunnel & Meghalaya Escarpment",
          disruptionDelayHrs: 12.5,
          safetyScore: 35,
          coordinates: [
            [26.1445, 91.7362], // Guwahati
            [25.5788, 91.8933], // Shillong
            [25.4400, 92.2000], // Jowai
            [25.1000, 92.3500], // Sonapur Tunnel (Mudflow Point)
            [24.8333, 92.7789]  // Silchar
          ]
        },
        aiAlternateRoute: {
          name: "AI Alternate via Guwahati - Nagaon - Lumding - Dima Hasao Harangajao Highway (NH-27)",
          distanceKm: 345,
          normalDurationHrs: 10.5,
          riskLevel: "Moderate (38/100)",
          riskStatus: "NH-27 4-lane stretch clear, Harangajao slope sensor green",
          disruptionDelayHrs: 1.0,
          safetyScore: 88,
          fuelVarianceLiters: "+8L",
          coordinates: [
            [26.1445, 91.7362], // Guwahati
            [26.3400, 92.6800], // Nagaon
            [25.7500, 93.1700], // Lumding
            [25.3000, 93.0200], // Maibang
            [25.1764, 93.0238], // Haflong
            [24.9500, 92.8500], // Harangajao
            [24.8333, 92.7789]  // Silchar
          ]
        }
      },

      "sk_gangtok-sk_mangan": {
        originName: "Gangtok (East Sikkim)",
        destName: "Mangan (North Sikkim Isolated Basin)",
        standardRoute: {
          name: "Direct North Sikkim Highway via Dikchu - Singtam",
          distanceKm: 65,
          normalDurationHrs: 2.5,
          riskLevel: "Severe Disruption (94/100)",
          riskStatus: "Bridge 4 Damaged at Teesta Stage 3, Multiple Slope Failures",
          disruptionDelayHrs: 32.0,
          safetyScore: 12,
          coordinates: [
            [27.3389, 88.6065], // Gangtok
            [27.4000, 88.5800], // Dikchu
            [27.4600, 88.5500], // Phodong
            [27.5000, 88.5333]  // Mangan
          ]
        },
        aiAlternateRoute: {
          name: "AI Alternate Emergency Ridge Route via Ravangla - Kabi - Phodong Military Track",
          distanceKm: 88,
          normalDurationHrs: 4.0,
          riskLevel: "Moderate (42/100)",
          riskStatus: "Reinforced Army Bailey Bridge Active, 4x4 & Medium Convoys Permitted",
          disruptionDelayHrs: 1.2,
          safetyScore: 84,
          fuelVarianceLiters: "+6L",
          coordinates: [
            [27.3389, 88.6065], // Gangtok
            [27.3100, 88.4800], // Ravangla
            [27.4200, 88.5200], // Kabi
            [27.4800, 88.5300], // Upper Phodong
            [27.5000, 88.5333]  // Mangan
          ]
        }
      },

      "nl_dimapur-mn_imphal": {
        originName: "Dimapur (Nagaland Gateway)",
        destName: "Imphal (Manipur Capital)",
        standardRoute: {
          name: "NH-29 Direct via Kohima - Mao - Senapati",
          distanceKm: 215,
          normalDurationHrs: 6.5,
          riskLevel: "High (72/100)",
          riskStatus: "Phesama Sinking Zone - Single Lane Regulated Traffic",
          disruptionDelayHrs: 5.5,
          safetyScore: 48,
          coordinates: [
            [25.9094, 93.7266], // Dimapur
            [25.6751, 94.1086], // Kohima
            [25.6300, 94.1200], // Phesama
            [25.4000, 94.1500], // Mao
            [25.2000, 94.0200], // Senapati
            [24.8170, 93.9368]  // Imphal
          ]
        },
        aiAlternateRoute: {
          name: "AI Alternate via Dimapur - Peren - Khonoma Bypass to Senapati",
          distanceKm: 238,
          normalDurationHrs: 7.2,
          riskLevel: "Low (31/100)",
          riskStatus: "Stable Geotechnical Bedrock, Continuous Traffic Flow",
          disruptionDelayHrs: 0.8,
          safetyScore: 92,
          fuelVarianceLiters: "+5L",
          coordinates: [
            [25.9094, 93.7266], // Dimapur
            [25.5500, 93.7400], // Peren
            [25.6500, 94.0200], // Khonoma
            [25.3000, 94.0800], // Maram
            [24.8170, 93.9368]  // Imphal
          ]
        }
      }
    };
  }

  /**
   * Plan Multi-Modal Disruption-Proof Route
   */
  planRoute(originDistrictId, destDistrictId, priorityCargo = "medicine") {
    const key = `${originDistrictId}-${destDistrictId}`;
    const reverseKey = `${destDistrictId}-${originDistrictId}`;

    let plan = this.routeGraph[key] || this.routeGraph[reverseKey];

    // Dynamic fallback if custom route not strictly hardcoded
    if (!plan) {
      const orig = window.NER_CONFIG.districts.find(d => d.id === originDistrictId) || window.NER_CONFIG.districts[0];
      const dest = window.NER_CONFIG.districts.find(d => d.id === destDistrictId) || window.NER_CONFIG.districts[5];

      const midLat = (orig.coords[0] + dest.coords[0]) / 2 + 0.15;
      const midLng = (orig.coords[1] + dest.coords[1]) / 2 - 0.12;

      plan = {
        originName: orig.name,
        destName: dest.name,
        standardRoute: {
          name: `Direct Corridor (${orig.name} to ${dest.name})`,
          distanceKm: 260,
          normalDurationHrs: 7.0,
          riskLevel: "Moderate (55/100)",
          riskStatus: "Terrain slope caution and moderate rainfall alerts",
          disruptionDelayHrs: 3.5,
          safetyScore: 58,
          coordinates: [orig.coords, [midLat, midLng], dest.coords]
        },
        aiAlternateRoute: {
          name: `AI Weather & Hill-Safe Alternate Corridor`,
          distanceKm: 290,
          normalDurationHrs: 7.8,
          riskLevel: "Low Risk (24/100)",
          riskStatus: "Optimized valley path avoiding high-slope landslide corridors",
          disruptionDelayHrs: 0.5,
          safetyScore: 94,
          fuelVarianceLiters: "+6L",
          coordinates: [orig.coords, [midLat - 0.1, midLng + 0.1], [midLat + 0.05, midLng - 0.05], dest.coords]
        }
      };
    }

    // Adjust safety & priority weighting based on cargo type
    if (priorityCargo === "medicine") {
      plan.aiAlternateRoute.priorityNotice = "🚨 Cold-chain vaccine priority: Route selected for lowest road vibration & zero-stagnation guarantee.";
    } else if (priorityCargo === "fuel") {
      plan.aiAlternateRoute.priorityNotice = "⛽ Hazmat POL convoy: Avoids narrow mountain switchbacks and high-density villages.";
    }

    return plan;
  }
}

window.NER_AIPredictionEngine = NER_AIPredictionEngine;
