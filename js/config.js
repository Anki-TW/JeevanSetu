/**
 * North Eastern Region (NER) Logistics & Intelligence Platform Configuration
 * Geo-nodes, Highways, Strategic Bridges, Districts, and Simulation Datasets
 */

const NER_CONFIG = {
  region: {
    name: "North Eastern Region (NER), India",
    center: [26.2006, 92.9376],
    defaultZoom: 7,
    bounds: [
      [21.5, 87.5], // Southwest [lat, lng]
      [29.5, 97.5]  // Northeast [lat, lng]
    ]
  },

  // 8 NER States
  states: [
    { id: "AS", name: "Assam", capital: "Dispur (Guwahati)", districtsCount: 35, avgRainfallMm: 2200 },
    { id: "AR", name: "Arunachal Pradesh", capital: "Itanagar", districtsCount: 26, avgRainfallMm: 3000 },
    { id: "ML", name: "Meghalaya", capital: "Shillong", districtsCount: 12, avgRainfallMm: 2800 },
    { id: "MN", name: "Manipur", capital: "Imphal", districtsCount: 16, avgRainfallMm: 1600 },
    { id: "MZ", name: "Mizoram", capital: "Aizawl", districtsCount: 11, avgRainfallMm: 2500 },
    { id: "NL", name: "Nagaland", capital: "Kohima", districtsCount: 16, avgRainfallMm: 2000 },
    { id: "TR", name: "Tripura", capital: "Agartala", districtsCount: 8, avgRainfallMm: 2400 },
    { id: "SK", name: "Sikkim", capital: "Gangtok", districtsCount: 6, avgRainfallMm: 2700 }
  ],

  // Key Logistics Hubs & Remote Districts
  districts: [
    // ASSAM
    {
      id: "as_kamrup",
      name: "Guwahati (Kamrup Metro)",
      state: "Assam",
      coords: [26.1445, 91.7362],
      status: "normal", // normal, warning, critical
      vulnerabilityScore: 28,
      stockStatus: { medicine: 96, food: 92, fuel: 88 },
      rainfall24h: 18,
      landslideRisk: "Low",
      floodRisk: "Moderate (Brahmaputra Lowlands)",
      logisticsHub: true
    },
    {
      id: "as_cachar",
      name: "Silchar (Cachar / Barak Valley)",
      state: "Assam",
      coords: [24.8333, 92.7789],
      status: "warning",
      vulnerabilityScore: 68,
      stockStatus: { medicine: 58, food: 64, fuel: 50 },
      rainfall24h: 84,
      landslideRisk: "High (NH-6 Meghalaya corridor)",
      floodRisk: "High (Barak Basin)",
      logisticsHub: true
    },
    {
      id: "as_dima_hasao",
      name: "Haflong (Dima Hasao)",
      state: "Assam",
      coords: [25.1764, 93.0238],
      status: "critical",
      vulnerabilityScore: 88,
      stockStatus: { medicine: 32, food: 41, fuel: 28 },
      rainfall24h: 142,
      landslideRisk: "Severe (Hill Section)",
      floodRisk: "Moderate",
      logisticsHub: false
    },
    {
      id: "as_dibrugarh",
      name: "Dibrugarh",
      state: "Assam",
      coords: [27.4728, 94.9120],
      status: "normal",
      vulnerabilityScore: 34,
      stockStatus: { medicine: 89, food: 85, fuel: 90 },
      rainfall24h: 24,
      landslideRisk: "Low",
      floodRisk: "Moderate",
      logisticsHub: true
    },
    {
      id: "as_tezpur",
      name: "Tezpur (Sonitpur)",
      state: "Assam",
      coords: [26.6528, 92.7926],
      status: "normal",
      vulnerabilityScore: 30,
      stockStatus: { medicine: 91, food: 90, fuel: 85 },
      rainfall24h: 22,
      landslideRisk: "Low",
      floodRisk: "Low",
      logisticsHub: true
    },

    // ARUNACHAL PRADESH
    {
      id: "ar_tawang",
      name: "Tawang",
      state: "Arunachal Pradesh",
      coords: [27.5861, 91.8594],
      status: "critical",
      vulnerabilityScore: 89,
      stockStatus: { medicine: 24, food: 38, fuel: 20 },
      rainfall24h: 96,
      landslideRisk: "Severe (Sela Pass Mudslide)",
      floodRisk: "Low (High Altitude 3048m)",
      logisticsHub: false
    },
    {
      id: "ar_itanagar",
      name: "Itanagar (Papum Pare)",
      state: "Arunachal Pradesh",
      coords: [27.0844, 93.6053],
      status: "normal",
      vulnerabilityScore: 42,
      stockStatus: { medicine: 84, food: 82, fuel: 79 },
      rainfall24h: 38,
      landslideRisk: "Moderate",
      floodRisk: "Low",
      logisticsHub: true
    },
    {
      id: "ar_pasighat",
      name: "Pasighat (East Siang)",
      state: "Arunachal Pradesh",
      coords: [28.0667, 95.3333],
      status: "warning",
      vulnerabilityScore: 62,
      stockStatus: { medicine: 61, food: 55, fuel: 59 },
      rainfall24h: 78,
      landslideRisk: "Moderate",
      floodRisk: "High (Siang River Surge)",
      logisticsHub: false
    },
    {
      id: "ar_changlang",
      name: "Changlang",
      state: "Arunachal Pradesh",
      coords: [27.1500, 95.7333],
      status: "warning",
      vulnerabilityScore: 71,
      stockStatus: { medicine: 48, food: 52, fuel: 45 },
      rainfall24h: 65,
      landslideRisk: "High",
      floodRisk: "Moderate",
      logisticsHub: false
    },

    // MEGHALAYA
    {
      id: "ml_shillong",
      name: "Shillong (East Khasi Hills)",
      state: "Meghalaya",
      coords: [25.5788, 91.8933],
      status: "normal",
      vulnerabilityScore: 35,
      stockStatus: { medicine: 90, food: 88, fuel: 86 },
      rainfall24h: 52,
      landslideRisk: "Moderate (NH-6 Umiam)",
      floodRisk: "Low",
      logisticsHub: true
    },
    {
      id: "ml_cherrapunji",
      name: "Sohra / Cherrapunji",
      state: "Meghalaya",
      coords: [25.2700, 91.7300],
      status: "warning",
      vulnerabilityScore: 74,
      stockStatus: { medicine: 55, food: 60, fuel: 52 },
      rainfall24h: 210,
      landslideRisk: "Severe (Escarpment Slope)",
      floodRisk: "Moderate",
      logisticsHub: false
    },
    {
      id: "ml_tura",
      name: "Tura (West Garo Hills)",
      state: "Meghalaya",
      coords: [25.5138, 90.2033],
      status: "normal",
      vulnerabilityScore: 48,
      stockStatus: { medicine: 76, food: 74, fuel: 70 },
      rainfall24h: 44,
      landslideRisk: "Moderate",
      floodRisk: "Low",
      logisticsHub: false
    },

    // MANIPUR
    {
      id: "mn_imphal",
      name: "Imphal (West/East)",
      state: "Manipur",
      coords: [24.8170, 93.9368],
      status: "warning",
      vulnerabilityScore: 65,
      stockStatus: { medicine: 52, food: 58, fuel: 46 },
      rainfall24h: 62,
      landslideRisk: "Moderate (NH-37 & NH-29 Lifelines)",
      floodRisk: "Moderate (Imphal River Valley)",
      logisticsHub: true
    },
    {
      id: "mn_tamenglong",
      name: "Tamenglong",
      state: "Manipur",
      coords: [24.9833, 93.4833],
      status: "critical",
      vulnerabilityScore: 86,
      stockStatus: { medicine: 29, food: 35, fuel: 24 },
      rainfall24h: 118,
      landslideRisk: "Severe (NH-37 Highway Cut-off)",
      floodRisk: "Moderate",
      logisticsHub: false
    },
    {
      id: "mn_churachandpur",
      name: "Churachandpur",
      state: "Manipur",
      coords: [24.3333, 93.6833],
      status: "warning",
      vulnerabilityScore: 67,
      stockStatus: { medicine: 45, food: 51, fuel: 40 },
      rainfall24h: 58,
      landslideRisk: "High",
      floodRisk: "Low",
      logisticsHub: false
    },

    // MIZORAM
    {
      id: "mz_aizawl",
      name: "Aizawl",
      state: "Mizoram",
      coords: [23.7271, 92.7176],
      status: "normal",
      vulnerabilityScore: 45,
      stockStatus: { medicine: 82, food: 80, fuel: 76 },
      rainfall24h: 46,
      landslideRisk: "Moderate",
      floodRisk: "Low",
      logisticsHub: true
    },
    {
      id: "mz_saiha",
      name: "Saiha (South Mizoram)",
      state: "Mizoram",
      coords: [22.4833, 92.9667],
      status: "critical",
      vulnerabilityScore: 84,
      stockStatus: { medicine: 31, food: 40, fuel: 26 },
      rainfall24h: 130,
      landslideRisk: "Severe (Remote Ridge Roads)",
      floodRisk: "Low",
      logisticsHub: false
    },

    // NAGALAND
    {
      id: "nl_kohima",
      name: "Kohima",
      state: "Nagaland",
      coords: [25.6751, 94.1086],
      status: "warning",
      vulnerabilityScore: 69,
      stockStatus: { medicine: 56, food: 60, fuel: 52 },
      rainfall24h: 72,
      landslideRisk: "Severe (NH-29 Phesama Sinking Zone)",
      floodRisk: "Low",
      logisticsHub: true
    },
    {
      id: "nl_dimapur",
      name: "Dimapur (Gateway)",
      state: "Nagaland",
      coords: [25.9094, 93.7266],
      status: "normal",
      vulnerabilityScore: 32,
      stockStatus: { medicine: 94, food: 91, fuel: 89 },
      rainfall24h: 30,
      landslideRisk: "Low",
      floodRisk: "Moderate (Dhansiri River)",
      logisticsHub: true
    },
    {
      id: "nl_mon",
      name: "Mon (Northern Hills)",
      state: "Nagaland",
      coords: [26.7500, 95.1000],
      status: "critical",
      vulnerabilityScore: 82,
      stockStatus: { medicine: 33, food: 42, fuel: 30 },
      rainfall24h: 104,
      landslideRisk: "High",
      floodRisk: "Low",
      logisticsHub: false
    },

    // TRIPURA
    {
      id: "tr_agartala",
      name: "Agartala (West Tripura)",
      state: "Tripura",
      coords: [23.8315, 91.2868],
      status: "normal",
      vulnerabilityScore: 38,
      stockStatus: { medicine: 88, food: 86, fuel: 84 },
      rainfall24h: 40,
      landslideRisk: "Low",
      floodRisk: "Moderate (Howrah River Basin)",
      logisticsHub: true
    },
    {
      id: "tr_dharmanagar",
      name: "Dharmanagar (North Tripura)",
      state: "Tripura",
      coords: [24.3833, 92.1667],
      status: "warning",
      vulnerabilityScore: 59,
      stockStatus: { medicine: 64, food: 68, fuel: 62 },
      rainfall24h: 68,
      landslideRisk: "Moderate (NH-8 Highway)",
      floodRisk: "High (Juri River)",
      logisticsHub: false
    },

    // SIKKIM
    {
      id: "sk_gangtok",
      name: "Gangtok (East Sikkim)",
      state: "Sikkim",
      coords: [27.3389, 88.6065],
      status: "warning",
      vulnerabilityScore: 72,
      stockStatus: { medicine: 50, food: 58, fuel: 48 },
      rainfall24h: 90,
      landslideRisk: "Severe (NH-10 Teesta Corridor)",
      floodRisk: "Severe (Glacial / Flash Floods)",
      logisticsHub: true
    },
    {
      id: "sk_mangan",
      name: "Mangan (North Sikkim)",
      state: "Sikkim",
      coords: [27.5000, 88.5333],
      status: "critical",
      vulnerabilityScore: 92,
      stockStatus: { medicine: 18, food: 25, fuel: 15 },
      rainfall24h: 156,
      landslideRisk: "Critical (Multiple Breaches / Bridge Washouts)",
      floodRisk: "Critical (Lachen/Lachung Flooding)",
      logisticsHub: false
    }
  ],

  // Strategic Highway Corridors & Lifelines
  highways: [
    {
      id: "nh_10",
      name: "NH-10 (Siliguri - Gangtok Lifeline)",
      color: "#f43f5e", // Critical status
      status: "Disrupted (Active Landslides at 29th Mile & Teesta)",
      riskLevel: "Critical",
      lengthKm: 114,
      avgSpeedKmH: 22,
      path: [
        [26.7271, 88.3953], // Siliguri
        [26.9038, 88.4526], // Sevoke
        [27.0500, 88.5000], // Teesta Bazar
        [27.1400, 88.5400], // Rangpo
        [27.2300, 88.5800], // Singtam
        [27.3389, 88.6065]  // Gangtok
      ]
    },
    {
      id: "nh_27",
      name: "NH-27 (East-West Corridor / Guwahati - Nagaon)",
      color: "#10b981", // Clear
      status: "Operational / High Capacity",
      riskLevel: "Low",
      lengthKm: 180,
      avgSpeedKmH: 65,
      path: [
        [26.1445, 91.7362], // Guwahati
        [26.1800, 92.1500], // Jagiroad
        [26.3400, 92.6800], // Nagaon
        [26.5500, 93.1800]  // Kaziranga Bypass
      ]
    },
    {
      id: "nh_6",
      name: "NH-6 (Guwahati - Shillong - Silchar)",
      color: "#f59e0b", // Warning
      status: "Caution (Sonapur Tunnel Mudflow & Jowai Subsidence)",
      riskLevel: "High",
      lengthKm: 310,
      avgSpeedKmH: 35,
      path: [
        [26.1445, 91.7362], // Guwahati
        [25.9000, 91.8000], // Nongpoh
        [25.5788, 91.8933], // Shillong
        [25.4400, 92.2000], // Jowai
        [25.1000, 92.3500], // Sonapur Tunnel
        [24.8333, 92.7789]  // Silchar
      ]
    },
    {
      id: "nh_29",
      name: "NH-29 (Dimapur - Kohima - Imphal)",
      color: "#f59e0b", // Warning
      status: "Restricted Single Lane (Phesama Sinking Zone)",
      riskLevel: "High",
      lengthKm: 215,
      avgSpeedKmH: 30,
      path: [
        [25.9094, 93.7266], // Dimapur
        [25.7500, 93.9500], // Chumukedima
        [25.6751, 94.1086], // Kohima
        [25.4000, 94.1500], // Mao
        [25.2000, 94.0200], // Senapati
        [24.8170, 93.9368]  // Imphal
      ]
    },
    {
      id: "bct_road",
      name: "Balipara-Charduar-Tawang (BCT Road via Sela)",
      color: "#f43f5e", // Blocked
      status: "Severely Obstructed (Sela Tunnel approach debris)",
      riskLevel: "Critical",
      lengthKm: 320,
      avgSpeedKmH: 18,
      path: [
        [26.6528, 92.7926], // Tezpur
        [26.8500, 92.6500], // Balipara
        [27.1500, 92.5000], // Rupa
        [27.2600, 92.4200], // Bomdila
        [27.4200, 92.1500], // Dirang
        [27.5050, 92.0950], // Sela Pass (4170m)
        [27.5861, 91.8594]  // Tawang
      ]
    }
  ],

  // Strategic Bridges & Structural Health
  bridges: [
    {
      id: "br_01",
      name: "Saraighat Rail-cum-Road Bridge (Brahmaputra)",
      coords: [26.1287, 91.5976],
      status: "Operational",
      healthIndex: 94,
      sensorAlert: "Normal structural vibration"
    },
    {
      id: "br_02",
      name: "Bogibeel Bridge (Dibrugarh)",
      coords: [27.3995, 94.8165],
      status: "Operational",
      healthIndex: 98,
      sensorAlert: "Optimal stress metrics"
    },
    {
      id: "br_03",
      name: "Dhola-Sadiya / Bhupen Hazarika Setu (Lohit)",
      coords: [27.7961, 95.6675],
      status: "Operational",
      healthIndex: 96,
      sensorAlert: "Normal river current loads"
    },
    {
      id: "br_04",
      name: "Teesta Stage 3 River Span (Chungthang)",
      coords: [27.6010, 88.6480],
      status: "Damaged / Emergency Bailey Bridge",
      healthIndex: 42,
      sensorAlert: "High flood scouring risk - Heavy Vehicles Prohibited"
    },
    {
      id: "br_05",
      name: "Irang River Bridge (NH-37 Tamenglong)",
      coords: [24.7800, 93.4200],
      status: "Critical Monitoring",
      healthIndex: 58,
      sensorAlert: "Substructure tilt detected (+1.8 deg)"
    }
  ],

  // Active Critical Logistics Convoys (Simulated Live GPS)
  convoys: [
    {
      id: "CNV-NER-01",
      name: "Emergency Vaccine & Medical Cold-Chain",
      cargo: "Life-Saving Vaccines & Insulin (Cold-Chain 4°C)",
      cargoType: "medicine",
      driver: "Tenzing Norbu / Suresh Das",
      origin: "Guwahati Central Depot",
      destination: "Tawang District Civil Hospital",
      currentCoords: [27.2600, 92.4200], // Bomdila
      altitudeM: 2415,
      speedKmH: 28,
      cargoTempC: 3.8,
      tempStatus: "Optimal (Cold-Chain Active)",
      etaMinutes: 210,
      riskLevel: "High (Sela Pass approach ahead)",
      routeId: "bct_road"
    },
    {
      id: "CNV-NER-02",
      name: "FCI Essential Food Grain Fleet",
      cargo: "Wheat & Rice (PDS Buffer Stock - 40 MT)",
      cargoType: "food",
      driver: "Lalmuanpuia Ralte",
      origin: "Silchar Railway Freight Terminal",
      destination: "Saiha Remote Food Warehouse",
      currentCoords: [23.7271, 92.7176], // Aizawl
      altitudeM: 1132,
      speedKmH: 34,
      cargoTempC: 24.2,
      tempStatus: "Normal",
      etaMinutes: 340,
      riskLevel: "Moderate (Hilly descent)",
      routeId: "nh_6"
    },
    {
      id: "CNV-NER-03",
      name: "IOCL Petroleum & LPG Supply Convoy",
      cargo: "Diesel, Petrol & High-Altitude Fuel (6 Tankers)",
      cargoType: "fuel",
      driver: "Romen Singh / Bikash Gogoi",
      origin: "Numaligarh Refinery",
      destination: "Imphal Emergency POL Depot",
      currentCoords: [25.6751, 94.1086], // Kohima
      altitudeM: 1444,
      speedKmH: 22,
      cargoTempC: 21.0,
      tempStatus: "Normal (Hazmat Safety Active)",
      etaMinutes: 190,
      riskLevel: "High (Phesama landslide bypass)",
      routeId: "nh_29"
    },
    {
      id: "CNV-NER-04",
      name: "SDRF Disaster Relief & Prefab Shelter Materials",
      cargo: "Pre-fab Shelters, Water Purifiers & Bailey Parts",
      cargoType: "relief",
      driver: "Karma Bhutia",
      origin: "Siliguri Army Logistics Base",
      destination: "Mangan Disaster Response Post",
      currentCoords: [27.2300, 88.5800], // Singtam
      altitudeM: 820,
      speedKmH: 25,
      cargoTempC: 22.5,
      tempStatus: "Normal",
      etaMinutes: 145,
      riskLevel: "Critical (Teesta flood detour engaged)",
      routeId: "nh_10"
    }
  ],

  // Real-Time Active Field Incidents & Disruptions
  incidents: [
    {
      id: "INC-2026-081",
      title: "Massive Rockfall & Mudslide on NH-10",
      locationName: "29th Mile, near Teesta Bazar (Sikkim Lifeline)",
      coords: [27.0500, 88.5000],
      type: "Landslide",
      severity: "critical",
      reportedAt: "18 mins ago",
      reportedBy: "Sikkim Border Roads Organisation (BRO)",
      verified: true,
      estimatedClearanceHrs: 36,
      affectedHighway: "NH-10",
      details: "Over 800 cubic meters of heavy debris and rocks have blocked both lanes. Heavy earthmovers deployed."
    },
    {
      id: "INC-2026-082",
      title: "Flash Flood Overtopping Highway Culvert",
      locationName: "Sonapur Tunnel Approach, NH-6 (East Jaintia Hills)",
      coords: [25.1000, 92.3500],
      type: "Flood Inundation",
      severity: "high",
      reportedAt: "42 mins ago",
      reportedBy: "Meghalaya Traffic Police / Field Unit",
      verified: true,
      estimatedClearanceHrs: 12,
      affectedHighway: "NH-6",
      details: "Water level 2.5 ft above asphalt with high silt deposition. Small vehicles halted, multi-axle trucks cautiously routed."
    },
    {
      id: "INC-2026-083",
      title: "Highway Subsidence & Sinking Zone",
      locationName: "Phesama Village Stretch, NH-29 (Nagaland)",
      coords: [25.6300, 94.1200],
      type: "Road Damage / Sinking",
      severity: "warning",
      reportedAt: "2 hrs ago",
      reportedBy: "Nagaland State PWD",
      verified: true,
      estimatedClearanceHrs: 48,
      affectedHighway: "NH-29",
      details: "Active hillside creep caused 1.2m vertical crack. Single lane regulated traffic in effect."
    },
    {
      id: "INC-2026-084",
      title: "Sela Pass Snow Slump & Avalanche Warning",
      locationName: "Sela Top (Elevation 4,170m, West Kameng)",
      coords: [27.5050, 92.0950],
      type: "Snow & Ice Blockade",
      severity: "critical",
      reportedAt: "3 hrs ago",
      reportedBy: "Arunachal Disaster Management Authority",
      verified: true,
      estimatedClearanceHrs: 18,
      affectedHighway: "BCT Road",
      details: "Heavy sleet and slush accumulation. Chained-tyre military escorts prioritizing emergency medical convoys."
    }
  ]
};

// Make accessible in global window scope
if (typeof window !== 'undefined') {
  window.NER_CONFIG = NER_CONFIG;
}
