/**
 * STATE METADATA & SATELLITE OBSERVATION SITES
 * =============================================
 * Geographic data for interactive map and satellite analysis panels.
 *
 * Coordinates: Standard WGS84 (lat/lng)
 * GeoJSON: India states boundary data loaded from GitHub CDN
 */

'use strict';

// =============================================================================
// MAP CONFIGURATION
// =============================================================================
const MAP_CONFIG = {
  indiaCenter: [20.5937, 78.9629],
  defaultZoom: 5,
  minZoom: 4,
  maxZoom: 18,

  // Base tile layers
  tileLayers: {
    osm: {
      name: 'OpenStreetMap',
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>',
      maxZoom: 19,
      subdomains: 'abc'
    },
    // ESRI World Imagery — free public tile service, no API key required
    esriSatellite: {
      name: '🛰️ Satellite Imagery (ESRI)',
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      attribution: 'Tiles &copy; Esri &mdash; Source: Esri, Maxar, Earthstar Geographics, and the GIS User Community',
      maxZoom: 18,
      acquisitionNote: 'ESRI World Imagery — multi-source satellite composite'
    },
    // Alias for backward compatibility
    sentinel2Cloudless: {
      name: '🛰️ Satellite Imagery (ESRI)',
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      attribution: 'Tiles &copy; Esri &mdash; Source: Esri, Maxar, Earthstar Geographics, and the GIS User Community',
      maxZoom: 18,
      acquisitionNote: 'ESRI World Imagery — high-resolution satellite composite'
    }
  },

  // India states GeoJSON (local copy with fallback)
  geoJsonUrl: 'js/data/india_state.geojson',
  geoJsonAttribution: 'State boundaries: <a href="https://github.com/geohacker/india">geohacker/india</a> (Public Domain) — based on Survey of India administrative boundaries'
};

// =============================================================================
// SATELLITE OBSERVATION SITES
// Key Indian forest/vegetation regions for Sentinel-2 analysis
// Coordinates verified from geographic reference sources
// =============================================================================
const SATELLITE_SITES = [
  {
    id: 'western-ghats',
    name: 'Western Ghats — Karnataka / Kerala',
    shortName: 'Western Ghats',
    lat: 12.5,
    lng: 75.8,
    zoom: 10,
    description: 'UNESCO World Heritage Site; one of the world\'s eight "hottest hotspots" of biological diversity. Dense evergreen and semi-evergreen forests.',
    forestType: 'Tropical Evergreen / Semi-Evergreen',
    significanceNote: 'Biodiversity hotspot; critical water catchment area for peninsular India',
    sentinelBrowserUrl: 'https://browser.dataspace.copernicus.eu/?zoom=10&lat=12.5&lng=75.8&themeId=DEFAULT-THEME&visualizationUrl=https%3A%2F%2Fsh.dataspace.copernicus.eu%2Fogc%2Fwms%2Fa91f72b5-f393-4320-bc0f-990129bd9e63&evalscript=&datasetId=S2L2A&fromTime=2024-01-01T00%3A00%3A00.000Z&toTime=2024-12-31T23%3A59%3A59.999Z&layerId=2_FALSE_COLOR',
    imageCredit: 'Copernicus Sentinel-2, ESA/EU — via Copernicus Data Space Ecosystem'
  },
  {
    id: 'sundarbans',
    name: 'Sundarbans Mangroves — West Bengal',
    shortName: 'Sundarbans',
    lat: 21.9497,
    lng: 89.1833,
    zoom: 10,
    description: 'World\'s largest mangrove forest; UNESCO World Heritage Site and Ramsar Wetland. Significant carbon sink and tiger habitat.',
    forestType: 'Mangrove',
    significanceNote: 'Critical coastal protection; habitat for Bengal tigers; major carbon sequestration site',
    sentinelBrowserUrl: 'https://browser.dataspace.copernicus.eu/?zoom=10&lat=21.9497&lng=89.1833&themeId=DEFAULT-THEME&visualizationUrl=https%3A%2F%2Fsh.dataspace.copernicus.eu%2Fogc%2Fwms%2Fa91f72b5-f393-4320-bc0f-990129bd9e63&evalscript=&datasetId=S2L2A&fromTime=2024-01-01T00%3A00%3A00.000Z&toTime=2024-12-31T23%3A59%3A59.999Z&layerId=2_FALSE_COLOR',
    imageCredit: 'Copernicus Sentinel-2, ESA/EU — via Copernicus Data Space Ecosystem'
  },
  {
    id: 'northeast-india',
    name: 'Northeast India — Arunachal Pradesh',
    shortName: 'Northeast India',
    lat: 27.0,
    lng: 93.0,
    zoom: 9,
    description: 'India\'s second-largest state by forest cover (66,431 sq km). Dense sub-tropical and temperate forests part of Indo-Burma biodiversity hotspot.',
    forestType: 'Sub-tropical Broadleaf / Temperate',
    significanceNote: 'Second highest forest cover in India; mega-biodiversity region',
    sentinelBrowserUrl: 'https://browser.dataspace.copernicus.eu/?zoom=9&lat=27.0&lng=93.0&themeId=DEFAULT-THEME&visualizationUrl=https%3A%2F%2Fsh.dataspace.copernicus.eu%2Fogc%2Fwms%2Fa91f72b5-f393-4320-bc0f-990129bd9e63&evalscript=&datasetId=S2L2A&fromTime=2024-01-01T00%3A00%3A00.000Z&toTime=2024-12-31T23%3A59%3A59.999Z&layerId=2_FALSE_COLOR',
    imageCredit: 'Copernicus Sentinel-2, ESA/EU — via Copernicus Data Space Ecosystem'
  },
  {
    id: 'central-india',
    name: 'Central Indian Highlands — Madhya Pradesh',
    shortName: 'Central India (MP)',
    lat: 22.5,
    lng: 78.5,
    zoom: 9,
    description: 'India\'s largest state by forest cover (77,493 sq km as per ISFR 2021). Sal and teak forests; habitat for tigers and leopards.',
    forestType: 'Tropical Dry Deciduous / Moist Deciduous',
    significanceNote: 'Largest forest cover of any Indian state; major tiger reserve network',
    sentinelBrowserUrl: 'https://browser.dataspace.copernicus.eu/?zoom=9&lat=22.5&lng=78.5&themeId=DEFAULT-THEME&visualizationUrl=https%3A%2F%2Fsh.dataspace.copernicus.eu%2Fogc%2Fwms%2Fa91f72b5-f393-4320-bc0f-990129bd9e63&evalscript=&datasetId=S2L2A&fromTime=2024-01-01T00%3A00%3A00.000Z&toTime=2024-12-31T23%3A59%3A59.999Z&layerId=2_FALSE_COLOR',
    imageCredit: 'Copernicus Sentinel-2, ESA/EU — via Copernicus Data Space Ecosystem'
  },
  {
    id: 'himalayan-foothills',
    name: 'Himalayan Foothills — Uttarakhand',
    shortName: 'Uttarakhand Himalayas',
    lat: 30.0,
    lng: 79.5,
    zoom: 9,
    description: 'Temperate and sub-alpine forests in the Garhwal Himalaya. Forest cover: 24,305 sq km (ISFR 2021). Critical watershed for Ganga river system.',
    forestType: 'Temperate / Sub-Alpine',
    significanceNote: 'Critical watershed; alpine vegetation monitoring; climate-sensitive zone',
    sentinelBrowserUrl: 'https://browser.dataspace.copernicus.eu/?zoom=9&lat=30.0&lng=79.5&themeId=DEFAULT-THEME&visualizationUrl=https%3A%2F%2Fsh.dataspace.copernicus.eu%2Fogc%2Fwms%2Fa91f72b5-f393-4320-bc0f-990129bd9e63&evalscript=&datasetId=S2L2A&fromTime=2024-01-01T00%3A00%3A00.000Z&toTime=2024-12-31T23%3A59%3A59.999Z&layerId=2_FALSE_COLOR',
    imageCredit: 'Copernicus Sentinel-2, ESA/EU — via Copernicus Data Space Ecosystem'
  }
];

// =============================================================================
// CHOROPLETH COLOR SCALE for forest cover percentage
// =============================================================================
const CHOROPLETH_COLORS = {
  getColor: (pct) => {
    if (pct > 75) return '#1a7c3e';
    if (pct > 60) return '#238b45';
    if (pct > 45) return '#41ab5d';
    if (pct > 30) return '#74c476';
    if (pct > 20) return '#a1d99b';
    if (pct > 10) return '#c7e9c0';
    if (pct > 5)  return '#e5f5e0';
    return '#f7fcf5';
  },
  legendBands: [
    { min: 75, max: 100, color: '#1a7c3e', label: '> 75%' },
    { min: 60, max: 75,  color: '#238b45', label: '60–75%' },
    { min: 45, max: 60,  color: '#41ab5d', label: '45–60%' },
    { min: 30, max: 45,  color: '#74c476', label: '30–45%' },
    { min: 20, max: 30,  color: '#a1d99b', label: '20–30%' },
    { min: 10, max: 20,  color: '#c7e9c0', label: '10–20%' },
    { min: 5,  max: 10,  color: '#e5f5e0', label: '5–10%' },
    { min: 0,  max: 5,   color: '#f7fcf5', label: '< 5%' }
  ]
};

window.StateData = {
  MAP_CONFIG,
  SATELLITE_SITES,
  CHOROPLETH_COLORS
};
