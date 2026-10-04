/**
 * AI FOREST ANALYSIS — PROTOTYPE INTERFACE
 * ==========================================
 *
 * ⚠️  IMPORTANT DISCLAIMER ⚠️
 * This interface is a PROTOTYPE. No real AI/ML model is connected.
 * All analysis output fields are clearly labelled as prototype placeholders.
 *
 * This module provides:
 *  1. Image upload UI (drag-and-drop)
 *  2. Prototype analysis output (clearly labelled)
 *  3. API integration stub — structure for connecting a real FastAPI/Flask backend
 *  4. Documentation of what a real integration would look like
 *
 * Real Integration Path:
 *  Backend: Python FastAPI (see README.md)
 *  Model: CNN / Random Forest trained on Sentinel-2 band data
 *  Input: Satellite image (GeoTIFF or PNG)
 *  Output: Land cover classification map + statistics
 *
 * API Endpoint (to be implemented):
 *  POST /api/analyze
 *  Body: multipart/form-data with 'image' field
 *  Response: { vegetationPct, changePct, coverageClass, ndviMean, timestamp }
 */

'use strict';

const AIAnalysis = (() => {
  let uploadedFile = null;
  let analysisState = 'idle'; // idle | uploaded | analyzing | done

  // ── Upload Zone ─────────────────────────────────────────────────────────
  function initUploadZone() {
    const zone = document.getElementById('aiUploadZone');
    const input = document.getElementById('aiFileInput');
    if (!zone || !input) return;

    zone.addEventListener('click', () => input.click());

    zone.addEventListener('dragover', e => {
      e.preventDefault();
      zone.classList.add('drag-over');
    });

    zone.addEventListener('dragleave', () => {
      zone.classList.remove('drag-over');
    });

    zone.addEventListener('drop', e => {
      e.preventDefault();
      zone.classList.remove('drag-over');
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    });

    input.addEventListener('change', e => {
      const file = e.target.files[0];
      if (file) handleFile(file);
    });
  }

  function handleFile(file) {
    const validTypes = ['image/png', 'image/jpeg', 'image/tiff', 'image/geotiff'];
    const ext = file.name.split('.').pop().toLowerCase();

    if (!validTypes.includes(file.type) && !['tif','tiff','png','jpg','jpeg'].includes(ext)) {
      showUploadError('Please upload a PNG, JPEG, or GeoTIFF satellite image.');
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      showUploadError('File size must be under 50 MB.');
      return;
    }

    uploadedFile = file;
    showUploadSuccess(file);
  }

  function showUploadError(msg) {
    const errorEl = document.getElementById('aiUploadError');
    if (errorEl) { errorEl.textContent = msg; errorEl.style.display = 'block'; }
    setTimeout(() => { if (errorEl) errorEl.style.display = 'none'; }, 4000);
  }

  function showUploadSuccess(file) {
    const zone = document.getElementById('aiUploadZone');
    if (!zone) return;

    const sizeKB = (file.size / 1024).toFixed(1);
    zone.innerHTML = `
      <div class="upload-icon">✅</div>
      <div class="upload-text" style="color:var(--clr-forest-bright)">${file.name}</div>
      <div class="upload-sub">${sizeKB} KB · ${file.type || 'image'}</div>
      <div style="margin-top:var(--space-md)">
        <button class="btn btn-primary" id="aiAnalyzeBtn">
          🧠 Run Prototype Analysis
        </button>
        <button class="btn btn-outline btn-sm" id="aiClearBtn" style="margin-left:8px">Clear</button>
      </div>
    `;

    document.getElementById('aiAnalyzeBtn')?.addEventListener('click', runPrototypeAnalysis);
    document.getElementById('aiClearBtn')?.addEventListener('click', resetUpload);
  }

  function resetUpload() {
    uploadedFile = null;
    analysisState = 'idle';
    const zone = document.getElementById('aiUploadZone');
    if (zone) {
      zone.innerHTML = `
        <div class="upload-icon">🛰️</div>
        <div class="upload-text">Drop a satellite image here</div>
        <div class="upload-sub">or click to browse · PNG, JPEG, GeoTIFF · max 50 MB</div>
        <div style="margin-top:var(--space-md);font-size:0.8rem;color:var(--clr-text-muted)">
          Supports Sentinel-2 exported images and standard satellite imagery
        </div>
      `;
    }
    const resultsEl = document.getElementById('aiResults');
    if (resultsEl) resultsEl.style.display = 'none';
  }

  // ── Prototype Analysis (no real model connected) ──────────────────────
  function runPrototypeAnalysis() {
    if (!uploadedFile) return;
    analysisState = 'analyzing';

    const btn = document.getElementById('aiAnalyzeBtn');
    if (btn) {
      btn.disabled = true;
      btn.innerHTML = '<span class="loader"></span> Processing…';
    }

    // Simulate processing time (UI only)
    setTimeout(() => {
      showPrototypeResults();
      analysisState = 'done';
    }, 2200);
  }

  function showPrototypeResults() {
    const resultsEl = document.getElementById('aiResults');
    if (!resultsEl) return;
    resultsEl.style.display = 'block';

    // Show image preview
    if (uploadedFile) {
      const reader = new FileReader();
      reader.onload = e => {
        const preview = document.getElementById('aiImagePreview');
        if (preview) {
          preview.style.backgroundImage = `url(${e.target.result})`;
          preview.style.backgroundSize  = 'cover';
          preview.style.backgroundPosition = 'center';
        }
      };
      reader.readAsDataURL(uploadedFile);
    }

    // Update metric placeholders
    const metrics = document.querySelectorAll('.ai-metric-pending');
    metrics.forEach(m => {
      m.textContent = '— awaiting model';
    });

    // Smooth scroll to results
    resultsEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  // ── Build the AI section HTML ──────────────────────────────────────────
  function buildAISection() {
    const container = document.getElementById('aiAnalysisContent');
    if (!container) return;

    container.innerHTML = `
      <!-- Prototype Warning Banner -->
      <div class="proto-banner">
        <div class="proto-icon">⚠️</div>
        <div>
          <h4>Prototype AI Analysis — Real ML Model Integration Required</h4>
          <p>
            This interface is a <strong>prototype</strong>. No trained machine-learning model is currently connected.
            All output fields shown below are placeholders to demonstrate the intended interface.
            A real backend API (Python FastAPI + CNN/Random Forest model) must be integrated
            to produce genuine classifications. See the API stub below and the README for integration instructions.
          </p>
        </div>
      </div>

      <!-- How it works -->
      <div class="panel" style="margin-bottom:var(--space-lg)">
        <div class="panel-header">
          <h3>🧠 Intended AI Pipeline</h3>
        </div>
        <div class="panel-body">
          <div style="display:flex;gap:var(--space-md);flex-wrap:wrap;align-items:flex-start">
            ${[
              { icon:'🛰️', step:'1. Input', desc:'Sentinel-2 multispectral image (GeoTIFF) with bands: B02, B03, B04, B08 (and optionally B05, B06, B07, B11, B12)' },
              { icon:'⚙️', step:'2. Preprocessing', desc:'Atmospheric correction (L2A), cloud masking, band normalization, NDVI calculation from B08 and B04' },
              { icon:'🤖', step:'3. Classification', desc:'CNN or Random Forest model trained on labelled Sentinel-2 data classifies each pixel as: Forest, Vegetation, Bare Soil, Water, Urban' },
              { icon:'📊', step:'4. Output', desc:'Per-class area statistics, change detection vs. reference date, forest cover percentage, potential loss/gain zones' }
            ].map(s => `
              <div style="flex:1;min-width:180px;background:var(--clr-bg-panel);border:1px solid var(--clr-border);border-radius:var(--radius-md);padding:var(--space-md)">
                <div style="font-size:1.5rem;margin-bottom:8px">${s.icon}</div>
                <div style="font-weight:700;font-size:0.85rem;color:var(--clr-forest-bright);margin-bottom:6px">${s.step}</div>
                <div style="font-size:0.8rem;color:var(--clr-text-secondary)">${s.desc}</div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>

      <!-- Upload Zone -->
      <div class="panel" style="margin-bottom:var(--space-lg)">
        <div class="panel-header">
          <h3>📂 Upload Satellite Image</h3>
          <span class="source-badge">PNG · JPEG · GeoTIFF · max 50 MB</span>
        </div>
        <div class="panel-body">
          <div id="aiUploadError" style="display:none;color:var(--clr-danger);font-size:0.85rem;margin-bottom:var(--space-sm)"></div>
          <div class="ai-upload-zone" id="aiUploadZone">
            <div class="upload-icon">🛰️</div>
            <div class="upload-text">Drop a satellite image here</div>
            <div class="upload-sub">or click to browse · PNG, JPEG, GeoTIFF · max 50 MB</div>
            <div style="margin-top:var(--space-md);font-size:0.8rem;color:var(--clr-text-muted)">
              Supports Sentinel-2 exported images and standard satellite imagery
            </div>
          </div>
          <input type="file" id="aiFileInput" accept=".png,.jpg,.jpeg,.tif,.tiff" class="sr-only">
        </div>
      </div>

      <!-- Results Panel (hidden until analysis run) -->
      <div id="aiResults" style="display:none">
        <div class="proto-banner" style="margin-bottom:var(--space-lg)">
          <div class="proto-icon">⚠️</div>
          <div>
            <h4>Prototype Output — Not Real AI Predictions</h4>
            <p>The values below are <strong>interface placeholders only</strong>.
            They represent the fields a connected ML model would populate.
            Connect the FastAPI backend to see real predictions.</p>
          </div>
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-lg);margin-bottom:var(--space-lg)">
          <!-- Image Preview -->
          <div>
            <h4 style="margin-bottom:var(--space-sm);font-size:0.85rem;color:var(--clr-text-muted)">Uploaded Image</h4>
            <div id="aiImagePreview" style="height:220px;background:var(--clr-bg-dark);border:1px solid var(--clr-border);border-radius:var(--radius-md);display:flex;align-items:center;justify-content:center;color:var(--clr-text-muted);font-size:0.85rem">
              Image preview
            </div>
          </div>
          <!-- Classification Output -->
          <div>
            <h4 style="margin-bottom:var(--space-sm);font-size:0.85rem;color:var(--clr-text-muted)">
              Classification Map
              <span class="ai-metric-proto" style="margin-left:8px">PROTOTYPE</span>
            </h4>
            <div style="height:220px;background:var(--clr-bg-dark);border:2px dashed var(--clr-border-lit);border-radius:var(--radius-md);display:flex;flex-direction:column;align-items:center;justify-content:center;color:var(--clr-text-muted);gap:var(--space-sm)">
              <div style="font-size:2rem">🗺️</div>
              <div style="font-size:0.83rem;text-align:center">
                Land cover classification map<br>
                <span style="color:var(--clr-proto);font-size:0.75rem">Model integration required</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Metric Cards -->
        <h4 style="margin-bottom:var(--space-md);color:var(--clr-text-secondary);font-size:0.85rem">
          Analysis Metrics
          <span class="ai-metric-proto" style="margin-left:8px">ALL PROTOTYPE</span>
        </h4>
        <div class="ai-output-grid">
          ${[
            { icon:'🌳', label:'Vegetation / Forest Area', field:'vegArea', unit:'% of image' },
            { icon:'📉', label:'Potential Vegetation Change', field:'vegChange', unit:'% change' },
            { icon:'🔴', label:'Potential Forest-Cover Loss', field:'coverLoss', unit:'sq km equivalent' },
            { icon:'🟢', label:'Potential Vegetation Growth', field:'coverGain', unit:'sq km equivalent' },
            { icon:'📊', label:'Mean NDVI (image)', field:'ndviMean', unit:'−1 to +1' },
            { icon:'🏷️', label:'Primary Land Cover Class', field:'coverClass', unit:'classification' }
          ].map(m => `
            <div class="ai-metric-card">
              <div class="ai-metric-proto">PROTOTYPE</div>
              <div class="ai-metric-label">${m.icon} ${m.label}</div>
              <div class="ai-metric-value" style="font-size:1.1rem">
                <span class="ai-metric-pending">— awaiting model</span>
              </div>
              <div style="font-size:0.72rem;color:var(--clr-text-muted);margin-top:4px">${m.unit}</div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- API Integration Stub -->
      <div class="api-integration-hint" style="margin-top:var(--space-xl)">
        <div style="font-size:0.85rem;font-weight:600;color:var(--clr-forest-bright);margin-bottom:var(--space-md)">
          🔌 Backend API Integration Stub (FastAPI)
        </div>
        <div><span class="code-comment"># ── Python FastAPI backend (backend/main.py) ──────────────────────</span></div>
        <div><span class="code-comment"># Run: uvicorn main:app --reload --port 8000</span></div>
        <br>
        <div><span class="code-keyword">from</span> fastapi <span class="code-keyword">import</span> FastAPI, UploadFile, File</div>
        <div><span class="code-keyword">from</span> fastapi.middleware.cors <span class="code-keyword">import</span> CORSMiddleware</div>
        <div><span class="code-keyword">import</span> numpy <span class="code-keyword">as</span> np</div>
        <div><span class="code-comment"># import your trained model here</span></div>
        <br>
        <div>app = <span class="code-func">FastAPI</span>(title=<span class="code-string">"Forest AI API"</span>)</div>
        <br>
        <div><span class="code-comment"># Allow browser to call this API</span></div>
        <div>app.<span class="code-func">add_middleware</span>(CORSMiddleware, allow_origins=[<span class="code-string">"*"</span>])</div>
        <br>
        <div><span class="code-keyword">@</span>app.<span class="code-func">post</span>(<span class="code-string">"/api/analyze"</span>)</div>
        <div><span class="code-keyword">async def</span> <span class="code-func">analyze_image</span>(image: UploadFile = <span class="code-func">File</span>(...)):</div>
        <div>&nbsp;&nbsp;&nbsp;&nbsp;<span class="code-comment"># 1. Read image bytes</span></div>
        <div>&nbsp;&nbsp;&nbsp;&nbsp;contents = <span class="code-keyword">await</span> image.<span class="code-func">read</span>()</div>
        <div>&nbsp;&nbsp;&nbsp;&nbsp;<span class="code-comment"># 2. Preprocess (band extraction, normalization)</span></div>
        <div>&nbsp;&nbsp;&nbsp;&nbsp;<span class="code-comment"># 3. Run your trained model</span></div>
        <div>&nbsp;&nbsp;&nbsp;&nbsp;<span class="code-comment"># 4. Calculate NDVI, land cover classes, change metrics</span></div>
        <div>&nbsp;&nbsp;&nbsp;&nbsp;<span class="code-keyword">return</span> {</div>
        <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="code-string">"vegetationPct"</span>: <span class="code-comment">...,</span></div>
        <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="code-string">"forestCoverLossSqKm"</span>: <span class="code-comment">...,</span></div>
        <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="code-string">"forestCoverGainSqKm"</span>: <span class="code-comment">...,</span></div>
        <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="code-string">"ndviMean"</span>: <span class="code-comment">...,</span></div>
        <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="code-string">"primaryClass"</span>: <span class="code-comment">...,</span></div>
        <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="code-string">"classificationMap"</span>: <span class="code-comment">... # base64 PNG</span></div>
        <div>&nbsp;&nbsp;&nbsp;&nbsp;}</div>
        <br>
        <div><span class="code-comment"># ── Frontend fetch (replace prototype display) ────────────────────</span></div>
        <div><span class="code-comment"># const API_BASE = 'http://localhost:8000'; // from env variable</span></div>
        <div><span class="code-comment"># const formData = new FormData();</span></div>
        <div><span class="code-comment"># formData.append('image', uploadedFile);</span></div>
        <div><span class="code-comment"># const response = await fetch(`${API_BASE}/api/analyze`, { method: 'POST', body: formData });</span></div>
        <div><span class="code-comment"># const result = await response.json();</span></div>
        <div><span class="code-comment"># // Populate metric cards with result.vegetationPct, etc.</span></div>
      </div>

      <div class="source-row" style="margin-top:var(--space-md)">
        <span class="source-badge" style="color:var(--clr-proto);border-color:rgba(224,123,57,0.4)">
          ⚠️ All analysis output: PROTOTYPE — no real model connected
        </span>
        <span class="source-badge">
          📚 Integration target: Python FastAPI + scikit-learn / TensorFlow
        </span>
      </div>
    `;

    // After building HTML, initialise the upload zone
    initUploadZone();
  }

  function init() {
    buildAISection();
  }

  return { init };
})();

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', AIAnalysis.init);
} else {
  AIAnalysis.init();
}
