# REST API & IoT Telemetry Specification - NER Logistics Platform

## 1. REST Endpoints

### `GET /api/v1/districts`
Retrieves accessibility and vulnerability scores for all 8 NER states.

**Response Schema:**
```json
[
  {
    "id": "ar_tawang",
    "name": "Tawang",
    "state": "Arunachal Pradesh",
    "coords": [27.5861, 91.8594],
    "status": "critical",
    "vulnerabilityScore": 89,
    "stockStatus": {
      "medicine": 24,
      "food": 38,
      "fuel": 20
    },
    "rainfall24h": 96
  }
]
```

### `POST /api/v1/route/optimize`
Calculates AI terrain-weighted alternate routing bypassing landslide and flood zones.

**Request Payload:**
```json
{
  "originDistrictId": "as_kamrup",
  "destinationDistrictId": "ar_tawang",
  "priorityCargo": "medicine"
}
```

### `POST /api/v1/incidents/report`
Accepts field-level incident reports with offline timestamp metadata.

**Request Payload:**
```json
{
  "reporterName": "Officer T. Norbu",
  "type": "Landslide & Rockfall",
  "severity": "critical",
  "coords": [27.5050, 92.0950],
  "description": "800m3 boulder slide on Sela top",
  "clientTimestamp": "2026-08-23T00:30:00Z"
}
```

---

## 2. IoT Telemetry WebSocket Protocol

**Endpoint:** `wss://ner-logistics.gov.in/ws/telemetry/fleet`

**Sample Telemetry Packet (Broadcast every 3s):**
```json
{
  "convoyId": "CNV-NER-01",
  "currentCoords": [27.2600, 92.4200],
  "altitudeM": 2415,
  "speedKmH": 28,
  "cargoTempC": 3.8,
  "tempAlarm": false,
  "etaMinutes": 210
}
```
