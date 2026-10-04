# IndiaForestWatch — AI & Remote Sensing Forest Monitoring Dashboard

**College Project:** "Use of AI and Remote Sensing for Monitoring Afforestation Programs and Combating Deforestation in India"

---

## 🚀 Quick Start (No Build Step Required)

Open `index.html` in any modern browser — **that's it.**

```bash
# Option 1: Direct open
# Double-click index.html in File Explorer

# Option 2: Local dev server (recommended — avoids CORS for GeoJSON)
# Using Python:
python -m http.server 8080
# Then open: http://localhost:8080

# Using Node (if installed):
npx serve .
# Then open: http://localhost:3000
```

> **Note:** The India states GeoJSON loads from GitHub CDN. If you open `index.html` directly as a `file://` URL, the GeoJSON fetch may be blocked by browser CORS policy. Use a local server for the best experience.

---

## 📁 Project Structure

```
CA 1- che/
├── index.html                   ← Main single-page app (all 7 sections)
├── css/
│   └── style.css                ← Full professional dark/green theme
├── js/
│   ├── app.js                   ← Navigation, tabs, scroll, counters
│   ├── map.js                   ← Leaflet map, choropleth, popups
│   ├── charts.js                ← Chart.js visualisations (6 charts)
│   ├── satellite.js             ← Sentinel-2 imagery panels + NDVI
│   ├── ai-analysis.js           ← AI prototype interface + API stub
│   └── data/
│       ├── forest-data.js       ← Verified FSI ISFR 2021/2023 data
│       └── states.js            ← State metadata, map config, satellite sites
└── README.md                    ← This file
```

---

## 📊 Data Sources

All data used in this dashboard is from official, publicly available sources.
No values have been invented or fabricated.

### 1. Forest Survey of India (FSI) — Primary Data Source

| Detail | Value |
|---|---|
| Organisation | Forest Survey of India, Ministry of Environment, Forest & Climate Change, GoI |
| Report | India State of Forest Report (ISFR) — biennial series |
| Editions used | ISFR 2023 (national totals) + ISFR 2021 (state-wise data) |
| URL | https://fsi.nic.in/ |
| License | Government of India Open Data — attribution required |

**Data used:**
- National forest cover: 7,15,343 sq km (21.76%) — ISFR 2023
- Tree cover: 1,12,014 sq km (3.41%) — ISFR 2023
- Historical trend 2001–2023 (biennial)
- State-wise forest cover for all 36 states/UTs — ISFR 2021
- Forest cover change 2019→2021 (selected states)

### 2. Copernicus Sentinel-2 (ESA / European Union)

| Detail | Value |
|---|---|
| Organisation | European Space Agency (ESA) / European Union |
| Data | Sentinel-2 multispectral imagery, L2A |
| Browser | https://browser.dataspace.copernicus.eu/ |
| Data Space | https://dataspace.copernicus.eu/ |
| License | Copernicus Open Licence — free access with attribution |
| Attribution | "Contains modified Copernicus Sentinel data [year], processed by ESA" |

**Data used:** Satellite imagery for observation sites (via Copernicus Browser links); NDVI spectral band reference.

### 3. EOX IT Services GmbH — Sentinel-2 Cloudless

| Detail | Value |
|---|---|
| Organisation | EOX IT Services GmbH |
| Product | Sentinel-2 Cloudless 2021 mosaic |
| URL | https://s2maps.eu |
| WMTS tile URL | `https://tiles.maps.eox.at/wmts/1.0.0/s2cloudless-2021_3857/default/GoogleMapsCompatible/{z}/{y}/{x}.jpg` |
| License | Creative Commons Attribution 4.0 (CC BY 4.0) |
| Acquisition note | Cloud-free composite from 2021 Copernicus Sentinel-2 acquisitions |
| Attribution | "Sentinel-2 cloudless 2021 by EOX IT Services GmbH (CC BY 4.0)" |

**Data used:** Satellite base layer on interactive map and mini-map viewer.

### 4. OpenStreetMap

| Detail | Value |
|---|---|
| Organisation | OpenStreetMap contributors |
| URL | https://www.openstreetmap.org |
| Tile server | `https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png` |
| License | Open Database License (ODbL) |
| Attribution | "© OpenStreetMap contributors" |

**Data used:** Default geographic base map layer.

### 5. India States GeoJSON

| Detail | Value |
|---|---|
| Repository | geohacker/india (GitHub) |
| URL | https://github.com/geohacker/india |
| CDN URL | `https://raw.githubusercontent.com/geohacker/india/master/state/india_state.geojson` |
| License | Public Domain |
| Based on | Survey of India administrative boundaries |

**Data used:** State boundary polygons for choropleth forest cover overlay.

### 6. MoEFCC / CAMPA

| Detail | Value |
|---|---|
| Organisation | Ministry of Environment, Forest & Climate Change, GoI |
| URL | https://moef.gov.in/ |
| License | Government of India Open Data |

**Data used:** Afforestation scheme details, CAMPA fund corpus, Green India Mission targets (Section 5).

### 7. ISRO / NRSC Bhuvan

| Detail | Value |
|---|---|
| Organisation | Indian Space Research Organisation — National Remote Sensing Centre |
| Bhuvan | https://bhuvan.nrsc.gov.in/ |
| Bhoonidhi | https://bhoonidhi.nrsc.gov.in/ |

**Referenced as:** ISRO's IRS LISS-III sensor is used by FSI for biennial forest assessments (methodology reference).
Direct API integration from Bhuvan/Bhoonidhi is a planned future enhancement.

---

## ⚠️ Prototype Features

These features demonstrate the intended interface but do **not** use real/live data:

| Feature | Status | Notes |
|---|---|---|
| AI Analysis (Section 4) | ⚠️ PROTOTYPE | No ML model connected; output fields are placeholders |
| Live NDVI map | ⚠️ PROTOTYPE | Needs Sentinel Hub API key for per-pixel computation |
| Real-time satellite imagery | ℹ️ NOT REAL-TIME | EOX mosaic is a 2021 static composite |

**All statistics, charts, and table data are from verified official publications — NOT prototypes.**

---

## 🤖 AI Backend Integration Guide

To connect a real ML model to the AI Analysis section:

### 1. Backend Setup (Python FastAPI)

```bash
pip install fastapi uvicorn python-multipart pillow numpy rasterio
```

Create `backend/main.py`:

```python
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import numpy as np
# from your_model import load_model, predict  # your trained model

app = FastAPI(title="Forest AI API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080"],  # your frontend URL
    allow_methods=["POST"],
    allow_headers=["*"]
)

@app.post("/api/analyze")
async def analyze_image(image: UploadFile = File(...)):
    contents = await image.read()
    # 1. Load image (PIL or rasterio for GeoTIFF)
    # 2. Extract bands
    # 3. Compute NDVI = (NIR - Red) / (NIR + Red)
    # 4. Run classifier
    return {
        "vegetationPct": ...,
        "forestCoverLossSqKm": ...,
        "forestCoverGainSqKm": ...,
        "ndviMean": ...,
        "primaryClass": ...,
        "classificationMap": ...,  # base64 PNG
        "modelVersion": "1.0",
        "isPrototype": False
    }
```

```bash
uvicorn main:app --reload --port 8000
```

### 2. Frontend Connection

In `js/ai-analysis.js`, replace the `runPrototypeAnalysis()` function with:

```javascript
const API_BASE = 'http://localhost:8000';  // or env variable
const formData = new FormData();
formData.append('image', uploadedFile);
const response = await fetch(`${API_BASE}/api/analyze`, {
  method: 'POST',
  body: formData
});
const result = await response.json();
// Populate metric cards with real values
```

### 3. Recommended Models for Forest Classification

- **Random Forest** (scikit-learn) — excellent for multispectral band classification
- **U-Net CNN** (PyTorch/TF) — pixel-wise segmentation from satellite images
- **Training data** — Sen2-Agri, Eurosat, Global Forest Watch datasets

---

## 🛰️ Sentinel Hub API Integration (Live NDVI)

For live, per-pixel NDVI maps:

1. Register free at https://www.sentinel-hub.com/
2. Create an OAuth client (Client ID + Secret)
3. Store credentials as environment variables — **never in frontend code**
4. Call the Process API with an evalscript:

```javascript
// NEVER put API keys in frontend code
// Use a backend proxy instead:
// POST /api/ndvi-proxy → backend calls Sentinel Hub with your key
```

---

## 📋 Setup Instructions

### Prerequisites
- Modern web browser (Chrome 90+, Firefox 88+, Edge 90+)
- Internet connection (for CDN libraries and tile layers)

### Running
```bash
# Clone or download project
cd "CA 1- che"

# Start local server (Python 3)
python -m http.server 8080

# Open browser
# http://localhost:8080
```

### Offline Mode
If internet is unavailable:
- Map base tiles and Sentinel-2 satellite layer will not load
- All statistics, charts, and table data will still display (hardcoded from FSI)
- GeoJSON state boundaries will not load (requires internet)

---

## 🔒 API Key Security

**IMPORTANT:** Never put API keys in frontend JavaScript files.

- Sentinel Hub credentials → backend environment variables (`SENTINEL_HUB_CLIENT_ID`, `SENTINEL_HUB_CLIENT_SECRET`)
- Copernicus credentials → backend only
- Use a FastAPI/Flask proxy endpoint that calls external APIs server-side

Example `.env` (backend only, never committed to git):
```
SENTINEL_HUB_CLIENT_ID=your_client_id
SENTINEL_HUB_CLIENT_SECRET=your_secret
```

---

## 📱 Browser Compatibility

Tested with: Chrome 120+, Firefox 120+, Edge 120+, Safari 16+

Responsive: Works on desktop, tablet, and mobile screens.

---

*Last updated: September 2026 · Data: FSI ISFR 2023 (forest cover) / FSI ISFR 2021 (state data)*
