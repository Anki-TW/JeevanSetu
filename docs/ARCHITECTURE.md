# System Architecture - AI-Based Smart Logistics & Accessibility Intelligence Platform (NER)

**Problem Statement ID:** 26002  
**Target Region:** North Eastern Region (Assam, Arunachal Pradesh, Meghalaya, Manipur, Mizoram, Nagaland, Tripura, Sikkim)

---

## 1. High-Level Architecture Overview

```
+-----------------------------------------------------------------------------------+
|                           PRESENTATION & CLIENT LAYER (PWA)                       |
|  - Modern Dark Tactical HUD (Tailwind CSS)                                         |
|  - GIS Spatial Mapping Engine (Leaflet.js + OpenTopoMap Terrain Contours)          |
|  - Multilingual Engine (English, Assamese, Bengali, Hindi, Meitei)                |
|  - IndexedDB Local Storage Queue for Zero-Connectivity Valleys                     |
+-----------------------------------------+-----------------------------------------+
                                          |
                                          v
+-----------------------------------------------------------------------------------+
|                           LOGIC & INTELLIGENCE ENGINES                            |
|                                                                                   |
|  +---------------------------+  +----------------------------+  +--------------+  |
|  | AI Disruption Predictor   |  | Multi-Modal Route Engine   |  | GPS Telemetry|  |
|  | - Landslide Hazard (LHI)  |  | - Terrain-Aware Dijkstra   |  | - Cold-Chain |  |
|  | - Flood Vulnerability     |  | - Elevation Slope Weight   |  | - Altitudes  |  |
|  | - Bridge Structural Health|  | - Detour Delay Forecasting |  | - Speed/ETA  |  |
|  +---------------------------+  +----------------------------+  +--------------+  |
+-----------------------------------------+-----------------------------------------+
                                          |
                                          v
+-----------------------------------------------------------------------------------+
|                        OFFLINE SYNC & DATA AGGREGATION                            |
|  - Service Worker Caching (PWA Cache-First)                                       |
|  - Background Sync API (`window.addEventListener('online')`)                      |
|  - Geo-tagged Crowd/Official Incident Verification Pipeline                       |
+-----------------------------------------------------------------------------------+
```

---

## 2. Mathematical Models for AI Disruption Prediction

### A. Landslide Hazard Index ($LHI$)
The $LHI$ quantifies slope instability along mountainous corridors (e.g. Sela Pass on BCT Road, NH-10 Teesta Gorge, NH-6 Meghalaya Escarpment):

$$LHI = w_r \cdot \frac{R_{24h}}{R_{crit}} + w_s \cdot \frac{\theta_{slope}}{\theta_{max}} + w_m \cdot S_{soil} + w_h \cdot H_{breach}$$

Where:
- $R_{24h}$: 24-hour cumulative precipitation ($mm$)
- $\theta_{slope}$: Terrain incline angle ($^\circ$)
- $S_{soil}$: Soil moisture saturation ratio ($0.0 \to 1.0$)
- $H_{breach}$: Historical breach coefficient ($0.2 \to 1.0$)
- Weightings: $w_r = 0.35, w_s = 0.30, w_m = 0.20, w_h = 0.15$

### B. Flood Vulnerability Index ($FVI$)
Calculated for low-lying river valleys (Brahmaputra, Barak, Teesta, Siang):

$$FVI = 0.50 \cdot \left(\frac{R_{24h}}{120}\right) + 0.30 \cdot \max\left(0, \frac{1500 - E_{elev}}{15}\right) + 0.20 \cdot \max(0, (10 - D_{river}) \cdot 10)$$

---

## 3. Offline-First Synchronization Protocol

1. **Disconnected Field Operation**:
   - Field officer / citizen submits an incident report with GPS coordinates and photo.
   - If network status is offline, report is written directly to local **IndexedDB** (`incident_queue` object store).
2. **Connectivity Recovery**:
   - Application listens to `online` DOM events.
   - Background worker drains the IndexedDB queue and transmits payload to regional central server.
   - GIS markers and corridor alerts refresh dynamically without requiring page reload.
