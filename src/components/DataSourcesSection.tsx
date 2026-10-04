import React from 'react';
import { Database, ExternalLink, ShieldCheck, FileCheck } from 'lucide-react';

export const DataSourcesSection: React.FC = () => {
  const sources = [
    {
      name: 'Forest Survey of India (FSI)',
      fullOrg: 'Ministry of Environment, Forest & Climate Change, GoI',
      dataset: 'India State of Forest Report (ISFR) 2023 & 2021',
      url: 'https://fsi.nic.in/',
      usedFor: 'National forest & tree cover totals, state-wise forest statistics, historical trend (2001–2023), net change data',
      license: 'Government of India — Open Government Data License',
      icon: '🌳',
    },
    {
      name: 'Copernicus Sentinel-2',
      fullOrg: 'European Space Agency (ESA) / European Union',
      dataset: 'Sentinel-2 multispectral imagery (L2A) — 10m resolution',
      url: 'https://dataspace.copernicus.eu/',
      usedFor: 'Satellite observation site analysis, spectral band reference (B08 NIR & B04 Red) for NDVI calculation, Copernicus Browser deep-links',
      license: 'Copernicus Open Licence — free access with attribution',
      icon: '🛰️',
    },
    {
      name: 'ESRI World Imagery',
      fullOrg: 'Esri, Maxar, Earthstar Geographics',
      dataset: 'High-resolution global satellite imagery tiles',
      url: 'https://www.esri.com/',
      usedFor: 'High-resolution base map satellite layer on interactive maps',
      license: 'Esri GIS User Community Open Service',
      icon: '🌍',
    },
    {
      name: 'OpenStreetMap',
      fullOrg: '© OpenStreetMap contributors',
      dataset: 'OpenStreetMap tile server',
      url: 'https://www.openstreetmap.org/',
      usedFor: 'Default street base map layer on interactive India map',
      license: 'Open Database License (ODbL)',
      icon: '🗺️',
    },
    {
      name: 'India State Boundaries GeoJSON',
      fullOrg: 'geohacker/india (Public Domain)',
      dataset: 'India administrative state boundary polygons',
      url: 'https://github.com/geohacker/india',
      usedFor: 'Choropleth overlay boundary polygons for state forest data rendering',
      license: 'Public Domain — Survey of India administrative data',
      icon: '📐',
    },
    {
      name: 'MoEFCC / CAMPA',
      fullOrg: 'Ministry of Environment, Forest & Climate Change, GoI',
      dataset: 'Afforestation scheme targets, CAMPA fund corpus, Green India Mission',
      url: 'https://moef.gov.in/',
      usedFor: 'Afforestation section scheme objectives, fund sizes, and target years',
      license: 'Government of India Open Data',
      icon: '🏛️',
    },
    {
      name: 'ISRO / NRSC Bhuvan',
      fullOrg: 'Indian Space Research Organisation',
      dataset: 'IRS LISS-III satellite sensor methodology reference',
      url: 'https://bhuvan.nrsc.gov.in/',
      usedFor: 'FSI methodology context (IRS satellite remote sensing integration reference)',
      license: 'ISRO / GoI Public Access',
      icon: '🚀',
    },
    {
      name: 'Open Source Libraries',
      fullOrg: 'Leaflet, Chart.js, React, Tailwind CSS',
      dataset: 'Interactive UI, Map Rendering & Charting Engines',
      url: 'https://leafletjs.com/',
      usedFor: 'Frontend map rendering, data visualisations, responsive UI',
      license: 'BSD-2-Clause / MIT Licenses',
      icon: '⚙️',
    },
  ];

  return (
    <section id="data-sources" className="py-20 px-6 sm:px-12 bg-gray-950 text-white border-t border-white/10">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="text-xs uppercase tracking-widest text-[#3db56c] font-mono font-semibold mb-2 flex items-center gap-2">
              <Database size={16} /> Data Governance & Transparency
            </div>
            <h2 className="text-3xl sm:text-5xl font-playfair italic font-normal tracking-tight">
              Data Sources & Credits
            </h2>
            <p className="text-sm text-white/60 mt-2 max-w-2xl leading-relaxed">
              Complete list of official, publicly accessible datasets powering this dashboard. Transparency is a core principle of this project.
            </p>
          </div>
        </div>

        {/* Source Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {sources.map((source, idx) => (
            <div key={idx} className="bg-white/5 border border-white/10 rounded-3xl p-6 hover:border-[#3db56c]/40 transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{source.icon}</span>
                  <div>
                    <h3 className="font-bold text-white text-base">{source.name}</h3>
                    <div className="text-xs text-white/50">{source.fullOrg}</div>
                  </div>
                </div>
                <a
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/40 hover:text-white transition-colors"
                >
                  <ExternalLink size={16} />
                </a>
              </div>

              <div className="space-y-2 text-xs text-white/70 border-t border-white/10 pt-4">
                <div><strong className="text-white/90">Dataset:</strong> {source.dataset}</div>
                <div><strong className="text-white/90">Used For:</strong> {source.usedFor}</div>
                <div><strong className="text-white/90">License:</strong> {source.license}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Real vs Prototype Matrix */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
          <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
            <FileCheck className="text-[#3db56c]" size={22} />
            Data Integrity & Prototype Feature Matrix
          </h3>
          <p className="text-xs text-white/60 mb-6">
            Clear distinction between verified official data and interface prototype features.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div className="bg-black/60 border border-emerald-500/30 rounded-2xl p-5">
              <div className="font-bold text-emerald-400 text-sm mb-3 flex items-center gap-2">
                <ShieldCheck size={16} /> Verified Real Data (100% Authentic)
              </div>
              <ul className="space-y-2 text-white/80 list-disc list-inside">
                <li>National Forest & Tree Cover stats (ISFR 2023)</li>
                <li>State-wise forest cover data for all 36 states/UTs (ISFR 2021)</li>
                <li>Historical trend line data (2001–2023 ISFR series)</li>
                <li>Interactive Leaflet GeoJSON state polygons & choropleth</li>
                <li>Afforestation scheme targets & MoEFCC details</li>
                <li>All 6 Chart.js graphs and state tables</li>
              </ul>
            </div>

            <div className="bg-black/60 border border-amber-500/30 rounded-2xl p-5">
              <div className="font-bold text-amber-400 text-sm mb-3 flex items-center gap-2">
                ⚠️ Interface Prototypes (Model Integration Required)
              </div>
              <ul className="space-y-2 text-white/80 list-disc list-inside">
                <li>AI Analysis upload interface & metrics (FastAPI stub provided)</li>
                <li>Per-pixel live NDVI map calculation (requires Sentinel Hub API key)</li>
                <li>Real-time satellite streaming (imagery uses ESRI / Copernicus static tiles)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
