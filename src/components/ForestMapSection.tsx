import React, { useEffect, useRef, useState } from 'react';
import { STATE_FOREST_DATA, CHOROPLETH_COLORS, StateForestData } from '../data/forestData';
import { Map, MapPin, Globe } from 'lucide-react';

declare const L: any;

export const ForestMapSection: React.FC = () => {
  const mapRef = useRef<any>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const [selectedState, setSelectedState] = useState<StateForestData | null>(null);
  const [activeBaseLayer, setActiveBaseLayer] = useState<'osm' | 'esri'>('esri');
  const [loadingGeoJson, setLoadingGeoJson] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  // Map state name matching helper with official Survey of India boundary alias resolution
  const matchState = (geoName: string) => {
    if (!geoName) return null;
    const normalized = geoName.toLowerCase().trim();
    const state = STATE_FOREST_DATA.find((s) => s.state.toLowerCase().trim() === normalized);
    if (state) return state;

    const aliases: Record<string, string> = {
      'jammu and kashmir': 'jammu & kashmir',
      'j&k': 'jammu & kashmir',
      'jammu & kashmir': 'jammu & kashmir',
      'ladakh': 'ladakh',
      'union territory of ladakh': 'ladakh',
      'andaman and nicobar': 'andaman & nicobar islands',
      'andaman & nicobar': 'andaman & nicobar islands',
      'andaman and nicobar islands': 'andaman & nicobar islands',
      'daman and diu': 'dadra & nagar haveli and daman & diu',
      'dadra and nagar haveli': 'dadra & nagar haveli and daman & diu',
      'dadra & nagar haveli': 'dadra & nagar haveli and daman & diu',
      'dadra and nagar haveli and daman and diu': 'dadra & nagar haveli and daman & diu',
      'uttaranchal': 'uttarakhand',
      'orissa': 'odisha',
      'pondicherry': 'puducherry',
      'laccadive': 'lakshadweep',
      'lakshadweep islands': 'lakshadweep',
      'nct of delhi': 'delhi',
      'delhi nct': 'delhi',
      'telangana': 'telangana',
      'andhra pradesh': 'andhra pradesh',
      'arunachal pradesh': 'arunachal pradesh',
    };

    if (aliases[normalized]) {
      const aliasName = aliases[normalized];
      return STATE_FOREST_DATA.find((s) => s.state.toLowerCase().trim() === aliasName) || null;
    }

    return STATE_FOREST_DATA.find((s) => s.state.toLowerCase().includes(normalized) || normalized.includes(s.state.toLowerCase())) || null;
  };

  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (typeof L === 'undefined') {
      setErrorMsg('Leaflet map engine loading...');
      return;
    }

    if (mapRef.current) return; // already initialized

    // Center on India
    const map = L.map(mapContainerRef.current, {
      center: [20.5937, 78.9629],
      zoom: 5,
      minZoom: 4,
      maxZoom: 18,
      zoomControl: true,
    });

    mapRef.current = map;

    // Base Tile Layers
    const osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    });

    const esri = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      attribution: 'Tiles &copy; Esri &mdash; Source: Esri, Maxar, Earthstar Geographics',
      maxZoom: 18,
    });

    // Default to ESRI High-Resolution Satellite (satellite imagery 100% visible)
    esri.addTo(map);

    (map as any)._osmLayer = osm;
    (map as any)._esriLayer = esri;

    // Render State & UT Boundaries Colored with Respective Forest Density Colors
    const renderStateBoundaries = (data: any) => {
      setLoadingGeoJson(false);
      L.geoJSON(data, {
        style: (feature: any) => {
          const name = feature.properties?.NAME_1 || feature.properties?.name || '';
          const st = matchState(name);
          const pct = st ? parseFloat(((st.forestCoverSqKm / st.geoAreaSqKm) * 100).toFixed(1)) : 0;
          const stateColor = CHOROPLETH_COLORS.getColor(pct);

          return {
            fillColor: stateColor,
            fillOpacity: st ? 0.62 : 0.2, // Color filled inside state polygons
            weight: 1.5,
            color: '#0d2215', // Crisp boundary outline
            opacity: 0.95,
          };
        },
        onEachFeature: (feature: any, layer: any) => {
          const name = feature.properties?.NAME_1 || feature.properties?.name || 'Unknown';
          const st = matchState(name);

          const popupContent = st
            ? `<div style="color:#111827;font-family:sans-serif;padding:4px;min-width:160px">
                <div style="font-weight:bold;font-size:15px;color:#0b5c2a;margin-bottom:6px;border-bottom:1px solid #e5e7eb;padding-bottom:4px">🌳 ${st.state}</div>
                <div style="font-size:12px;color:#374151;margin-bottom:3px">Forest Cover: <b style="color:#0f172a">${st.forestCoverSqKm.toLocaleString('en-IN')} km²</b></div>
                <div style="font-size:12px;color:#374151;margin-bottom:3px">% of State Area: <b style="color:#057a37;font-size:13px">${((st.forestCoverSqKm / st.geoAreaSqKm) * 100).toFixed(1)}%</b></div>
                <div style="font-size:11px;color:#6b7280;margin-top:6px;font-weight:600">National Rank: #${st.rank} in India</div>
               </div>`
            : `<div style="font-size:12px;color:#111827;font-weight:600">${name}</div>`;

          layer.bindPopup(popupContent);

          layer.on({
            mouseover: (e: any) => {
              e.target.setStyle({ weight: 2.8, opacity: 1, fillOpacity: 0.82, color: '#ffffff' });
              e.target.bringToFront();
            },
            mouseout: (e: any) => {
              (e.target as any)._map.eachLayer((l: any) => {
                if (l.resetStyle) l.resetStyle(e.target);
              });
            },
            click: () => {
              if (st) setSelectedState(st);
            },
          });
        },
      }).addTo(map);
    };

    // Multi-candidate GeoJSON loading for Survey of India boundaries
    const geoJsonUrls = [
      'js/data/india_state.geojson',
      '/js/data/india_state.geojson',
      'js/data/india_states.geojson',
      '/js/data/india_states.geojson',
      'https://raw.githubusercontent.com/geohacker/india/master/state/india_state.geojson',
      'https://raw.githubusercontent.com/datasets/geo-boundaries/master/data/india_state.geojson',
    ];

    const loadGeoJsonSequence = async () => {
      let loadedData = null;
      for (const url of geoJsonUrls) {
        try {
          const res = await fetch(url);
          if (res.ok) {
            const data = await res.json();
            if (data && (data.features || data.type === 'FeatureCollection')) {
              loadedData = data;
              break;
            }
          }
        } catch (e) {
          console.warn(`GeoJSON fetch candidate ${url} failed...`);
        }
      }

      if (loadedData) {
        renderStateBoundaries(loadedData);
      } else {
        setLoadingGeoJson(false);
        setErrorMsg('State boundary GeoJSON could not be loaded. Base map satellite tiles are active.');
      }
    };

    loadGeoJsonSequence();

    setTimeout(() => {
      map.invalidateSize();
    }, 400);

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  const handleToggleBaseLayer = (layerType: 'osm' | 'esri') => {
    setActiveBaseLayer(layerType);
    const map = mapRef.current;
    if (!map) return;

    if (layerType === 'osm') {
      if (map.hasLayer(map._esriLayer)) map.removeLayer(map._esriLayer);
      if (!map.hasLayer(map._osmLayer)) map._osmLayer.addTo(map);
    } else {
      if (map.hasLayer(map._osmLayer)) map.removeLayer(map._osmLayer);
      if (!map.hasLayer(map._esriLayer)) map._esriLayer.addTo(map);
    }
  };

  return (
    <section id="map-section" className="py-20 px-6 sm:px-12 bg-black text-white border-t border-white/10">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div>
            <div className="text-xs uppercase tracking-widest text-[#3db56c] font-mono font-semibold mb-2 flex items-center gap-2">
              <Map size={16} /> GIS Remote Sensing & Satellite Map
            </div>
            <h2 className="text-3xl sm:text-5xl font-playfair italic font-normal tracking-tight">
              India State Forest Boundaries & Satellite Map
            </h2>
            <p className="text-sm text-white/60 mt-2 max-w-2xl leading-relaxed">
              High-resolution satellite imagery overlaid with Survey of India state & UT boundaries colored by official forest cover statistics.
            </p>
          </div>

          {/* Base Layer Switcher */}
          <div className="flex items-center bg-white/10 p-1.5 rounded-full border border-white/20">
            <button
              onClick={() => handleToggleBaseLayer('esri')}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                activeBaseLayer === 'esri'
                  ? 'bg-[#3db56c] text-white shadow-md'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              🛰️ ESRI Satellite
            </button>
            <button
              onClick={() => handleToggleBaseLayer('osm')}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                activeBaseLayer === 'osm'
                  ? 'bg-[#3db56c] text-white shadow-md'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              🗺️ OpenStreetMap
            </button>
          </div>
        </div>

        {/* Map + Sidebar Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          {/* Map Area */}
          <div className="lg:col-span-3 relative rounded-3xl overflow-hidden border border-white/15 shadow-2xl bg-gray-950">
            <div ref={mapContainerRef} className="h-[580px] w-full z-10" />

            {loadingGeoJson && (
              <div className="absolute inset-0 bg-black/75 backdrop-blur-sm z-20 flex flex-col items-center justify-center gap-3">
                <div className="w-8 h-8 border-2 border-[#3db56c] border-t-transparent rounded-full animate-spin" />
                <span className="text-xs text-white/70 font-mono">Loading Survey of India Boundaries...</span>
              </div>
            )}

            {errorMsg && (
              <div className="absolute bottom-4 left-4 right-4 z-20 bg-red-500/20 border border-red-500/40 p-3 rounded-xl text-xs text-red-300">
                {errorMsg}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Selected State Card */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
              <div className="text-xs uppercase tracking-wider text-white/40 font-mono mb-4 flex items-center gap-1.5">
                <MapPin size={14} className="text-[#3db56c]" /> Selected Region Profile
              </div>

              {selectedState ? (
                <div>
                  <h4 className="text-2xl font-bold text-[#3db56c] mb-1">
                    {selectedState.state}
                  </h4>
                  <div className="text-xs text-white/50 mb-6">National Rank #{selectedState.rank} by Area</div>

                  <div className="space-y-3 text-sm border-t border-b border-white/10 py-4 mb-6">
                    <div className="flex justify-between">
                      <span className="text-white/60">Forest Cover</span>
                      <span className="font-semibold text-white">{selectedState.forestCoverSqKm.toLocaleString('en-IN')} km²</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">% of State Area</span>
                      <span className="font-bold text-[#3db56c]">{((selectedState.forestCoverSqKm / selectedState.geoAreaSqKm) * 100).toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">Geographical Area</span>
                      <span className="text-white/80">{selectedState.geoAreaSqKm.toLocaleString('en-IN')} km²</span>
                    </div>
                  </div>

                  <div>
                    <div className="text-xs text-white/50 mb-2">Relative Cover vs. MP (Largest)</div>
                    <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-[#3db56c] h-full rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, Math.round((selectedState.forestCoverSqKm / 77493) * 100))}%` }}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-10 text-white/40">
                  <Map className="mx-auto mb-3 opacity-30" size={36} />
                  <p className="text-xs">Click any state boundary to view official FSI forest statistics.</p>
                </div>
              )}
            </div>

            {/* State Border Color Legend */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
              <div className="text-xs uppercase tracking-wider text-white/40 font-mono mb-4">
                State Border Color Scale (Forest %)
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs text-white/70">
                {CHOROPLETH_COLORS.legendBands.map((b, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="w-3.5 h-1 rounded-full shrink-0" style={{ backgroundColor: b.color }} />
                    <span className="text-[11px]">{b.label}</span>
                  </div>
                ))}
              </div>
              <div className="text-[10px] text-white/40 border-t border-white/10 pt-3 mt-4 flex items-center gap-1.5">
                <Globe size={12} className="text-[#3db56c]" /> FSI ISFR 2021 &amp; ESRI Satellite
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
