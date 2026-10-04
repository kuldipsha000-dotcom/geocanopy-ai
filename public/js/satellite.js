/**
 * SATELLITE ANALYSIS MODULE
 * ==========================
 * Manages Sentinel-2 satellite imagery panels.
 *
 * Imagery source: EOX Sentinel-2 Cloudless 2021 mosaic
 *   (Contains modified Copernicus Sentinel data 2021, processed by EOX IT Services GmbH)
 *   License: CC BY 4.0
 *   URL: https://s2maps.eu
 *
 * Live/interactive imagery: Copernicus Data Space Ecosystem Browser
 *   https://browser.dataspace.copernicus.eu/
 *   (Requires free Copernicus account for download; browser view is public)
 *
 * NDVI: Standard remote sensing vegetation index
 *   NDVI = (NIR - Red) / (NIR + Red)
 *   Sentinel-2 bands: B08 (NIR, 842nm) and B04 (Red, 665nm)
 */

'use strict';

const SatelliteAnalysis = (() => {
  let currentSite = null;
  let currentSiteIndex = 0;

  // ── Build site selector buttons ─────────────────────────────────────────
  function buildSiteSelector() {
    const container = document.getElementById('siteSelector');
    if (!container) return;

    StateData.SATELLITE_SITES.forEach((site, i) => {
      const btn = document.createElement('button');
      btn.className = `site-btn${i === 0 ? ' active' : ''}`;
      btn.dataset.siteId = site.id;
      btn.innerHTML = `
        <span class="site-btn-name">${site.shortName}</span>
        <span class="site-btn-type">${site.forestType}</span>
      `;
      btn.addEventListener('click', () => {
        container.querySelectorAll('.site-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        loadSite(site);
      });
      container.appendChild(btn);
    });
  }

  // ── Load a site into the viewer ─────────────────────────────────────────
  function loadSite(site) {
    currentSite = site;

    // Update site info
    const nameEl = document.getElementById('siteName');
    const typeEl = document.getElementById('siteType');
    const descEl = document.getElementById('siteDesc');
    const noteEl = document.getElementById('siteNote');

    if (nameEl) nameEl.textContent = site.name;
    if (typeEl) typeEl.textContent = site.forestType;
    if (descEl) descEl.textContent = site.description;
    if (noteEl) noteEl.textContent = site.significanceNote;

    // Update the Copernicus Browser header link
    const copLink = document.getElementById('copBrowserLink');
    if (copLink) {
      copLink.href = site.sentinelBrowserUrl;
    }

    // Update coordinate display
    const latEl = document.getElementById('siteLatLng');
    if (latEl) {
      latEl.textContent = `${site.lat.toFixed(4)}°N, ${site.lng.toFixed(4)}°E`;
    }

    // Update credit
    const creditEl = document.getElementById('siteCredit');
    if (creditEl) creditEl.textContent = site.imageCredit;

    // Update EOX WMS mini-map
    updateEOXMaplet(site);
  }

  // ── Mini maplet using EOX WMS tiles ─────────────────────────────────────
  let miniMap = null;
  let miniSentinelLayer = null;

  function updateEOXMaplet(site) {
    const container = document.getElementById('eoxMiniMap');
    if (!container) return;

    const satConfig = StateData.MAP_CONFIG.tileLayers.esriSatellite || StateData.MAP_CONFIG.tileLayers.sentinel2Cloudless;

    if (!miniMap) {
      miniMap = L.map('eoxMiniMap', {
        center: [site.lat, site.lng],
        zoom:   site.zoom,
        zoomControl: true,
        attributionControl: true
      });

      miniSentinelLayer = L.tileLayer(
        satConfig.url,
        {
          attribution: satConfig.attribution,
          maxZoom: satConfig.maxZoom || 18
        }
      ).addTo(miniMap);
    } else {
      miniMap.setView([site.lat, site.lng], site.zoom);
    }

    setTimeout(() => {
      if (miniMap) miniMap.invalidateSize();
    }, 250);

    // Marker
    if (miniMap._siteMarker) miniMap.removeLayer(miniMap._siteMarker);
    miniMap._siteMarker = L.circleMarker([site.lat, site.lng], {
      radius:      8,
      fillColor:   '#3db56c',
      color:       '#0d2818',
      weight:      2,
      fillOpacity: 0.9
    }).bindPopup(`<div class="popup-state-name" style="font-size:0.9rem">${site.shortName}</div>
      <div style="font-size:0.78rem;color:#9dc9af">${site.forestType}</div>`)
      .addTo(miniMap);
  }

  // ── NDVI explainer section ───────────────────────────────────────────────
  function buildNDVISection() {
    const container = document.getElementById('ndviExplainer');
    if (!container) return;

    container.innerHTML = `
      <div class="ndvi-panel">
        <h3 style="margin-bottom:var(--space-md)">🔬 NDVI — Normalized Difference Vegetation Index</h3>

        <div class="data-notice" style="margin-bottom:var(--space-md)">
          <span class="notice-icon">ℹ️</span>
          <div>NDVI is a standard remote-sensing metric derived from satellite spectral bands.
          It indicates the density and health of green vegetation. Values near +1 indicate dense,
          healthy vegetation; values near -1 indicate bare soil, water, or built surfaces.
          <br><br>
          <strong>For this dashboard:</strong> NDVI is computed from Sentinel-2 Band 8 (NIR) and Band 4 (Red).
          Live per-pixel NDVI calculation requires API integration (see AI Analysis section).
          </div>
        </div>

        <div class="ndvi-formula">NDVI = (B08<sub>NIR</sub> − B04<sub>Red</sub>) / (B08<sub>NIR</sub> + B04<sub>Red</sub>)</div>

        <div style="font-size:0.82rem;color:var(--clr-text-secondary);margin-bottom:var(--space-md)">
          <strong>Sentinel-2 bands used:</strong>
          <span style="color:var(--clr-forest-bright)">B08</span> — Near-Infrared (NIR) at 842 nm &nbsp;|&nbsp;
          <span style="color:var(--clr-warn)">B04</span> — Red at 665 nm
        </div>

        <h4 style="margin-bottom:var(--space-sm);font-size:0.85rem;color:var(--clr-text-secondary)">NDVI Value Scale</h4>
        <div class="ndvi-scale"><div class="ndvi-scale-bar"></div></div>
        <div class="ndvi-scale-labels">
          <span>−1.0<br><span style="font-size:0.65rem">Water / bare</span></span>
          <span style="text-align:center">0.0<br><span style="font-size:0.65rem">Sparse veg.</span></span>
          <span>+0.5<br><span style="font-size:0.65rem">Moderate</span></span>
          <span style="text-align:right">+1.0<br><span style="font-size:0.65rem">Dense forest</span></span>
        </div>

        <div style="margin-top:var(--space-lg)">
          <h4 style="margin-bottom:var(--space-sm);font-size:0.85rem">Typical NDVI Ranges (Reference Values)</h4>
          <div class="data-table-wrap" style="border-radius:var(--radius-md);margin-top:var(--space-sm)">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Land Cover Type</th>
                  <th>Typical NDVI Range</th>
                  <th>Interpretation</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>Dense forest / jungle</td><td class="pct-cell" style="color:var(--clr-forest-bright)">0.6 – 0.9</td><td>Healthy, dense canopy</td></tr>
                <tr><td>Moderate vegetation</td><td class="pct-cell" style="color:#74c99a">0.3 – 0.6</td><td>Shrubs, open forest, farmland</td></tr>
                <tr><td>Sparse vegetation</td><td class="pct-cell" style="color:var(--clr-warn)">0.1 – 0.3</td><td>Grasslands, scrubland</td></tr>
                <tr><td>Bare soil / rock</td><td class="pct-cell" style="color:#9dc9af">0.0 – 0.1</td><td>Little to no vegetation</td></tr>
                <tr><td>Water bodies</td><td class="pct-cell" style="color:var(--clr-info)">−0.1 – −0.5</td><td>Strong absorption of NIR</td></tr>
                <tr><td>Built-up / urban</td><td class="pct-cell" style="color:var(--clr-danger)">−0.3 – 0.1</td><td>Concrete, roads, buildings</td></tr>
              </tbody>
            </table>
          </div>
          <div style="font-size:0.72rem;color:var(--clr-text-muted);margin-top:8px">
            Reference values. Actual NDVI varies by season, region, and atmospheric conditions.
            Source: NASA Earth Observatory, ESA Sentinel-2 documentation.
          </div>
        </div>

        <div style="margin-top:var(--space-lg);padding:var(--space-md);background:var(--clr-bg-dark);border:1px solid var(--clr-border);border-radius:var(--radius-md)">
          <h4 style="margin-bottom:var(--space-sm);color:var(--clr-proto);font-size:0.85rem">⚙️ Live NDVI Integration (Prototype Note)</h4>
          <p style="font-size:0.82rem;color:var(--clr-text-secondary)">
            Live, per-pixel NDVI computation from Sentinel-2 imagery requires API access.
            With a <a href="https://dataspace.copernicus.eu/" target="_blank" rel="noopener">Copernicus Data Space Ecosystem</a>
            account or <a href="https://www.sentinel-hub.com/" target="_blank" rel="noopener">Sentinel Hub API key</a>,
            real-time NDVI maps can be generated using custom evalscripts.
            A FastAPI backend stub for this integration is described in the README.
          </p>
        </div>

        <div class="source-row" style="margin-top:var(--space-md)">
          <span class="source-badge">📡 Sentinel-2 Bands: Copernicus / ESA</span>
          <span class="source-badge">📚 NDVI formula: Rouse et al. (1974); NASA Earth Observatory</span>
        </div>
      </div>
    `;
  }

  function init() {
    buildSiteSelector();
    buildNDVISection();

    // Load first site by default
    if (StateData.SATELLITE_SITES.length > 0) {
      loadSite(StateData.SATELLITE_SITES[0]);
    }
  }

  return { init };
})();

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', SatelliteAnalysis.init);
} else {
  SatelliteAnalysis.init();
}
