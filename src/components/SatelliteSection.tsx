import React, { useEffect, useRef, useState } from 'react';
import { SATELLITE_SITES, SatelliteSite } from '../data/forestData';
import { Satellite, ExternalLink, Activity, Info } from 'lucide-react';

declare const L: any;

export const SatelliteSection: React.FC = () => {
  const [activeSite, setActiveSite] = useState<SatelliteSite>(SATELLITE_SITES[0]);
  const miniMapRef = useRef<any>(null);
  const miniMapContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!miniMapContainerRef.current || typeof L === 'undefined') return;

    if (!miniMapRef.current) {
      const map = L.map(miniMapContainerRef.current, {
        center: [activeSite.lat, activeSite.lng],
        zoom: activeSite.zoom,
        zoomControl: true,
      });

      L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri',
        maxZoom: 18,
      }).addTo(map);

      miniMapRef.current = map;
    } else {
      miniMapRef.current.setView([activeSite.lat, activeSite.lng], activeSite.zoom);
    }

    // Add marker
    if (miniMapRef.current._marker) {
      miniMapRef.current.removeLayer(miniMapRef.current._marker);
    }

    const marker = L.circleMarker([activeSite.lat, activeSite.lng], {
      radius: 9,
      fillColor: '#3db56c',
      color: '#ffffff',
      weight: 2,
      fillOpacity: 0.9,
    }).addTo(miniMapRef.current);

    miniMapRef.current._marker = marker;
  }, [activeSite]);

  return (
    <section id="satellite" className="py-20 px-6 sm:px-12 bg-gray-950 text-white border-t border-white/10">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="text-xs uppercase tracking-widest text-[#3db56c] font-mono font-semibold mb-2 flex items-center gap-2">
              <Satellite size={16} /> Copernicus Sentinel-2 Remote Sensing
            </div>
            <h2 className="text-3xl sm:text-5xl font-playfair italic font-normal tracking-tight">
              Satellite Analysis & Observation Sites
            </h2>
            <p className="text-sm text-white/60 mt-2 max-w-2xl leading-relaxed">
              Explore key Indian forest ecosystems observed via Copernicus Sentinel-2 multispectral satellite imagery.
            </p>
          </div>

          <div className="text-xs text-white/50 bg-white/5 px-4 py-2 rounded-2xl border border-white/10">
            Source: European Space Agency (ESA) / Copernicus Data Space
          </div>
        </div>

        {/* Site Selector + Map Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-16 items-start">
          {/* Site Buttons */}
          <div className="space-y-3">
            <div className="text-xs uppercase tracking-wider text-white/40 font-mono mb-3">
              Observation Sites
            </div>
            {SATELLITE_SITES.map((site) => {
              const isActive = activeSite.id === site.id;
              return (
                <button
                  key={site.id}
                  onClick={() => setActiveSite(site)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all ${
                    isActive
                      ? 'bg-[#3db56c]/15 border-[#3db56c] text-white shadow-lg'
                      : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <div className="font-semibold text-sm mb-1">{site.shortName}</div>
                  <div className="text-xs text-white/50">{site.forestType}</div>
                </button>
              );
            })}
          </div>

          {/* Active Site Viewer */}
          <div className="lg:col-span-3 bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-white/10 mb-6 gap-4">
              <div>
                <h3 className="text-2xl font-bold text-[#3db56c] mb-1">{activeSite.name}</h3>
                <div className="text-xs text-white/60">{activeSite.forestType}</div>
              </div>
              <a
                href={activeSite.sentinelBrowserUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#e8702a] hover:bg-[#d2611f] text-white text-xs font-semibold px-5 py-2.5 rounded-full transition-all shadow-md shadow-[#e8702a]/20 shrink-0"
              >
                Open in Copernicus Browser <ExternalLink size={14} />
              </a>
            </div>

            <p className="text-sm text-white/80 leading-relaxed mb-6">
              {activeSite.description}
            </p>

            <div className="flex flex-wrap gap-4 text-xs mb-6">
              <span className="bg-white/10 px-3 py-1.5 rounded-full text-white/70">
                📍 Coordinates: {activeSite.lat}°N, {activeSite.lng}°E
              </span>
              <span className="bg-[#3db56c]/10 text-[#3db56c] border border-[#3db56c]/30 px-3 py-1.5 rounded-full font-medium">
                {activeSite.significanceNote}
              </span>
            </div>

            {/* Mini Map Preview */}
            <div className="relative rounded-2xl overflow-hidden border border-white/15 h-80 w-full mb-4">
              <div ref={miniMapContainerRef} className="h-full w-full" />
            </div>

            <div className="text-[11px] text-white/40 text-right">
              {activeSite.imageCredit}
            </div>
          </div>
        </div>

        {/* NDVI Vegetation Index Explainer */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-4 text-[#3db56c]">
            <Activity size={24} />
            <h3 className="text-2xl font-semibold text-white">NDVI — Normalized Difference Vegetation Index</h3>
          </div>

          <p className="text-sm text-white/70 leading-relaxed mb-6">
            NDVI is a standard satellite metric derived from NIR (Near-Infrared) and Red spectral bands. Healthy vegetation absorbs red light for photosynthesis and strongly reflects near-infrared light.
          </p>

          <div className="bg-black/60 border border-white/15 rounded-2xl p-6 text-center font-mono text-lg sm:text-xl text-[#3db56c] mb-6 tracking-wide">
            NDVI = (B08<sub>NIR</sub> − B04<sub>Red</sub>) / (B08<sub>NIR</sub> + B04<sub>Red</sub>)
          </div>

          {/* Color Scale Bar */}
          <div className="mb-8">
            <div className="text-xs text-white/50 mb-2">NDVI Index Color Gradient Scale</div>
            <div className="h-5 rounded-lg w-full bg-gradient-to-r from-red-600 via-yellow-400 to-green-600 mb-2" />
            <div className="flex justify-between text-[11px] font-mono text-white/60">
              <span>−1.0 (Water / Ice)</span>
              <span>0.0 (Bare Soil)</span>
              <span>+0.5 (Shrubland)</span>
              <span>+1.0 (Dense Forest)</span>
            </div>
          </div>

          {/* Reference Table */}
          <div className="overflow-x-auto border border-white/10 rounded-2xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-white/10 text-white/60 uppercase font-mono border-b border-white/10">
                <tr>
                  <th className="p-3">Land Cover Type</th>
                  <th className="p-3">Typical NDVI Range</th>
                  <th className="p-3">Interpretation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-white/80">
                <tr><td className="p-3 font-medium text-white">Dense Tropical Forest</td><td className="p-3 text-[#3db56c] font-bold">0.6 – 0.9</td><td className="p-3">High chlorophyll & dense canopy</td></tr>
                <tr><td className="p-3 font-medium text-white">Open Forest / Agriculture</td><td className="p-3 text-emerald-400 font-bold">0.3 – 0.6</td><td className="p-3">Moderate vegetation canopy</td></tr>
                <tr><td className="p-3 font-medium text-white">Scrubland / Grassland</td><td className="p-3 text-amber-400 font-bold">0.1 – 0.3</td><td className="p-3">Sparse green cover</td></tr>
                <tr><td className="p-3 font-medium text-white">Bare Soil / Sand</td><td className="p-3 text-white/60 font-bold">0.0 – 0.1</td><td className="p-3">Minimal vegetation reflection</td></tr>
                <tr><td className="p-3 font-medium text-white">Water Bodies</td><td className="p-3 text-sky-400 font-bold">−0.1 – −0.5</td><td className="p-3">Strong absorption of NIR wavelength</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};
