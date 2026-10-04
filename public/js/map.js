/**
 * INTERACTIVE INDIA FOREST MAP
 * =============================
 * Leaflet.js map with:
 *  - OpenStreetMap base layer (© OpenStreetMap contributors)
 *  - EOX Sentinel-2 Cloudless 2021 satellite layer
 *  - India states choropleth using verified FSI ISFR 2021 data
 *  - Click-to-popup with forest statistics per state
 *  - Legend
 *
 * Data: Forest Survey of India, ISFR 2021
 * Map tiles: OpenStreetMap / EOX IT Services GmbH (Sentinel-2 Cloudless CC BY 4.0)
 * State boundaries GeoJSON: geohacker/india (Public Domain)
 */

'use strict';

const ForestMap = (() => {
  let map = null;
  let statesLayer = null;
  let currentBaseLayer = null;
  let sentinel2Layer = null;
  let osmLayer = null;

  // Build a lookup from state name → ISFR data
  function buildStateLookup() {
    const lookup = {};
    ForestData.STATE_FOREST_DATA.states.forEach(s => {
      const key = s.state.toLowerCase().trim();
      lookup[key] = s;
    });
    return lookup;
  }

  // Fuzzy match GeoJSON "NAME_1" field to our data keys
  function matchState(geoName, lookup) {
    if (!geoName) return null;
    const normalized = geoName.toLowerCase().trim();

    // Direct match
    if (lookup[normalized]) return lookup[normalized];

    // Common name variations
    const aliases = {
      'jammu and kashmir':         'jammu & kashmir',
      'j&k':                       'jammu & kashmir',
      'andaman and nicobar':       'andaman & nicobar islands',
      'andaman & nicobar':         'andaman & nicobar islands',
      'daman and diu':             'dadra & nagar haveli and daman & diu',
      'dadra and nagar haveli':    'dadra & nagar haveli and daman & diu',
      'dadra & nagar haveli':      'dadra & nagar haveli and daman & diu',
      'uttaranchal':               'uttarakhand',
    };

    if (aliases[normalized]) return lookup[aliases[normalized]];

    // Partial match
    for (const [key, val] of Object.entries(lookup)) {
      if (key.includes(normalized) || normalized.includes(key)) return val;
    }

    return null;
  }

  function getForestPct(stateData) {
    if (!stateData) return 0;
    return parseFloat(((stateData.forestCoverSqKm / stateData.geoAreaSqKm) * 100).toFixed(1));
  }

  function styleFeature(feature, lookup) {
    const name = feature.properties.NAME_1 || feature.properties.name || '';
    const stateData = matchState(name, lookup);
    const pct = getForestPct(stateData);
    const color = StateData.CHOROPLETH_COLORS.getColor(pct);

    return {
      fillColor:   color,
      weight:      1.2,
      color:       '#2a4835',
      fillOpacity: stateData ? 0.72 : 0.2,
      opacity:     0.9
    };
  }

  function buildPopupHTML(stateName, stateData) {
    if (!stateData) {
      return `
        <div class="popup-state-name">${stateName}</div>
        <div class="popup-row"><span class="pk">Forest data</span><span class="pv">Not available</span></div>
        <div class="popup-source">Source: FSI ISFR 2021</div>
      `;
    }
    const pct = getForestPct(stateData);
    const fmtNum = n => n.toLocaleString('en-IN');
    return `
      <div class="popup-state-name">🌳 ${stateData.state}</div>
      <div class="popup-row"><span class="pk">Forest Cover</span><span class="pv">${fmtNum(stateData.forestCoverSqKm)} sq km</span></div>
      <div class="popup-row"><span class="pk">% of State Area</span><span class="pv">${pct}%</span></div>
      <div class="popup-row"><span class="pk">State Geo. Area</span><span class="pv">${fmtNum(stateData.geoAreaSqKm)} sq km</span></div>
      <div class="popup-row"><span class="pk">National Rank</span><span class="pv">#${stateData.rank} by area</span></div>
      <div class="popup-source">Source: FSI, India State of Forest Report 2021 · fsi.nic.in</div>
    `;
  }

  function updateInfoPanel(stateData, stateName) {
    const panel = document.getElementById('mapStateInfo');
    if (!panel) return;

    if (!stateData) {
      panel.innerHTML = `
        <div class="map-state-placeholder">
          <div class="placeholder-icon">🗺️</div>
          <div>Click a state to view forest data</div>
        </div>`;
      return;
    }

    const pct = getForestPct(stateData);
    const fmtNum = n => n.toLocaleString('en-IN');
    const maxArea = 77493; // MP — highest
    const barWidth = Math.min(100, Math.round((stateData.forestCoverSqKm / maxArea) * 100));

    panel.innerHTML = `
      <div style="margin-bottom:var(--space-md)">
        <div style="font-size:1.1rem;font-weight:700;color:var(--clr-forest-bright);margin-bottom:4px">
          🌳 ${stateData.state}
        </div>
        <div style="font-size:0.75rem;color:var(--clr-text-muted)">Selected State</div>
      </div>

      <div class="popup-row" style="padding:6px 0;border-bottom:1px solid var(--clr-border)">
        <span class="pk" style="color:var(--clr-text-muted);font-size:0.8rem">Forest Cover</span>
        <span class="pv" style="font-weight:700;font-size:1rem">${fmtNum(stateData.forestCoverSqKm)} km²</span>
      </div>
      <div class="popup-row" style="padding:6px 0;border-bottom:1px solid var(--clr-border)">
        <span class="pk" style="color:var(--clr-text-muted);font-size:0.8rem">% of State</span>
        <span class="pv" style="color:var(--clr-forest-bright);font-weight:700">${pct}%</span>
      </div>
      <div class="popup-row" style="padding:6px 0;border-bottom:1px solid var(--clr-border)">
        <span class="pk" style="color:var(--clr-text-muted);font-size:0.8rem">Geo. Area</span>
        <span class="pv">${fmtNum(stateData.geoAreaSqKm)} km²</span>
      </div>
      <div class="popup-row" style="padding:6px 0">
        <span class="pk" style="color:var(--clr-text-muted);font-size:0.8rem">National Rank</span>
        <span class="pv">#${stateData.rank} by area</span>
      </div>

      <div style="margin-top:var(--space-md)">
        <div style="font-size:0.72rem;color:var(--clr-text-muted);margin-bottom:4px">
          Forest cover vs. Madhya Pradesh (largest)
        </div>
        <div style="height:8px;background:var(--clr-border);border-radius:4px;overflow:hidden">
          <div style="height:100%;width:${barWidth}%;background:var(--clr-forest-bright);border-radius:4px;transition:width 0.5s ease"></div>
        </div>
      </div>

      <div style="margin-top:var(--space-md);font-size:0.7rem;color:var(--clr-text-muted);border-top:1px solid var(--clr-border);padding-top:var(--space-sm)">
        Source: FSI, India State of Forest Report 2021
      </div>
    `;
  }

  function initMap() {
    const el = document.getElementById('india-map');
    if (!el) return;

    const { indiaCenter, defaultZoom, minZoom, tileLayers } = StateData.MAP_CONFIG;

    map = L.map('india-map', {
      center: indiaCenter,
      zoom:   defaultZoom,
      minZoom,
      zoomControl: true,
      attributionControl: true
    });

    // ── Base Layers ──────────────────────────────────────────────────────────
    const satConfig = tileLayers.esriSatellite || tileLayers.sentinel2Cloudless;

    osmLayer = L.tileLayer(tileLayers.osm.url, {
      attribution: tileLayers.osm.attribution,
      maxZoom:     tileLayers.osm.maxZoom
    }).addTo(map);

    sentinel2Layer = L.tileLayer(satConfig.url, {
      attribution: satConfig.attribution,
      maxZoom:     satConfig.maxZoom,
      opacity:     0.9
    });

    const baseLayers = {
      '🗺️ OpenStreetMap': osmLayer,
      '🛰️ Satellite Imagery (ESRI)': sentinel2Layer
    };

    // Layer control
    L.control.layers(baseLayers, null, { position: 'topright', collapsed: false }).addTo(map);

    // Ensure Leaflet resizes correctly after layout/DOM render
    setTimeout(() => {
      if (map) map.invalidateSize();
    }, 250);

    // ── Load States GeoJSON ──────────────────────────────────────────────────
    loadStatesGeoJSON();

    // ── Legend ──────────────────────────────────────────────────────────────
    addLegend();
  }

  function loadStatesGeoJSON() {
    const lookup = buildStateLookup();
    const primaryUrl = StateData.MAP_CONFIG.geoJsonUrl;
    const fallbackUrl = 'https://raw.githubusercontent.com/geohacker/india/master/state/india_state.geojson';

    const loadingEl = document.getElementById('mapLoading');
    if (loadingEl) loadingEl.style.display = 'flex';

    function renderGeoJson(data) {
      if (loadingEl) loadingEl.style.display = 'none';
      statesLayer = L.geoJSON(data, {
        style: f => styleFeature(f, lookup),
        onEachFeature: (feature, layer) => {
          const name = feature.properties.NAME_1 || feature.properties.name || 'Unknown';
          const stateData = matchState(name, lookup);

          layer.bindPopup(buildPopupHTML(name, stateData), {
            maxWidth: 280,
            className: 'forest-popup'
          });

          layer.on({
            mouseover: e => {
              e.target.setStyle({ weight: 2.5, color: '#74c99a', fillOpacity: 0.85 });
              e.target.bringToFront();
            },
            mouseout: e => {
              statesLayer.resetStyle(e.target);
            },
            click: e => {
              updateInfoPanel(stateData, name);
            }
          });
        }
      }).addTo(map);
    }

    fetch(primaryUrl)
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then(data => renderGeoJson(data))
      .catch(err => {
        console.warn('Local GeoJSON fetch failed, trying fallback URL...', err);
        fetch(fallbackUrl)
          .then(r => r.json())
          .then(data => renderGeoJson(data))
          .catch(fallbackErr => {
            if (loadingEl) loadingEl.style.display = 'none';
            console.error('All GeoJSON load attempts failed:', fallbackErr);
            const errEl = document.getElementById('mapError');
            if (errEl) {
              errEl.style.display = 'block';
              errEl.textContent = '⚠️ State boundaries could not be loaded. Base satellite map tiles are still available.';
            }
          });
      });
  }

  function addLegend() {
    const legend = L.control({ position: 'bottomleft' });
    legend.onAdd = () => {
      const div = L.DomUtil.create('div', 'map-legend');
      div.innerHTML = `
        <h4>Forest Cover % of State Area</h4>
        ${StateData.CHOROPLETH_COLORS.legendBands.map(b => `
          <div class="legend-item">
            <div class="legend-swatch" style="background:${b.color}"></div>
            <span>${b.label}</span>
          </div>
        `).join('')}
        <div style="margin-top:8px;padding-top:8px;border-top:1px solid var(--clr-border);font-size:0.68rem;color:var(--clr-text-muted);line-height:1.4">
          Data: FSI ISFR 2021 · <a href="https://fsi.nic.in" target="_blank" rel="noopener" style="color:var(--clr-info)">fsi.nic.in</a>
        </div>
      `;
      return div;
    };
    legend.addTo(map);
  }

  function init() {
    initMap();
    // Set default info panel
    updateInfoPanel(null, '');
  }

  return { init };
})();

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', ForestMap.init);
} else {
  ForestMap.init();
}
