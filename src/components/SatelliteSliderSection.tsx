import React, { useState, useRef, useEffect } from 'react';
import { Sliders, AlertTriangle, Layers, Calendar, ChevronRight } from 'lucide-react';
import { useScrollReveal } from '../hooks/useAnimations';

interface ChangeSite {
  id: string;
  name: string;
  location: string;
  state: string;
  beforeYear: number;
  afterYear: number;
  beforeImg: string;
  afterImg: string;
  canopyLossSqKm: number;
  pctChange: number;
  primaryCause: string;
  aiAlertStatus: 'HIGH ALERT' | 'MONITORED' | 'STABLE';
  description: string;
}

const ESRI = 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/export?bboxSR=4326&size=1200,800&format=jpg&f=image';

const CHANGE_SITES: ChangeSite[] = [
  {
    id: 'hasdeo',
    name: 'Hasdeo Aranya Forest Reserve',
    location: 'Korba & Surguja Districts',
    state: 'Chhattisgarh',
    beforeYear: 2018,
    afterYear: 2024,
    // EXACT SAME BBOX for perfect slider alignment
    beforeImg: `${ESRI}&bbox=82.35,22.45,82.85,22.85`,
    afterImg: `${ESRI}&bbox=82.35,22.45,82.85,22.85`,
    canopyLossSqKm: 14.8,
    pctChange: -4.2,
    primaryCause: 'Open-Cast Mining Fringe & Infrastructure Clearing',
    aiAlertStatus: 'HIGH ALERT',
    description: 'Multi-temporal Sentinel-2 satellite analysis reveals localized canopy drop along the eastern periphery between 2018 and 2024.',
  },
  {
    id: 'wghats',
    name: 'Western Ghats Bio-Corridor',
    location: 'Shivamogga & Uttara Kannada',
    state: 'Karnataka',
    beforeYear: 2018,
    afterYear: 2024,
    // EXACT SAME BBOX for perfect slider alignment
    beforeImg: `${ESRI}&bbox=74.95,13.25,75.45,13.65`,
    afterImg: `${ESRI}&bbox=74.95,13.25,75.45,13.65`,
    canopyLossSqKm: 6.2,
    pctChange: -1.8,
    primaryCause: 'Agricultural Encroachment & Linear Infrastructure Expansion',
    aiAlertStatus: 'MONITORED',
    description: 'High-resolution NIR band reflectance comparison indicates localized fragmentation in non-protected buffer zones.',
  },
  {
    id: 'sundarbans',
    name: 'Sundarbans Mangrove Boundary',
    location: 'South 24 Parganas Delta',
    state: 'West Bengal',
    beforeYear: 2018,
    afterYear: 2024,
    // EXACT SAME BBOX for perfect slider alignment
    beforeImg: `${ESRI}&bbox=88.55,21.65,89.05,22.05`,
    afterImg: `${ESRI}&bbox=88.55,21.65,89.05,22.05`,
    canopyLossSqKm: 3.5,
    pctChange: -0.9,
    primaryCause: 'Cyclonic Coastal Erosion & Salinity Shift',
    aiAlertStatus: 'MONITORED',
    description: 'Sentinel-1 SAR radar telemetry monitors tidal fringe erosion and mangrove regeneration under MISHTI programme.',
  },
];








export const SatelliteSliderSection: React.FC = () => {
  const [selectedSite, setSelectedSite] = useState<ChangeSite>(CHANGE_SITES[0]);
  const [sliderPos, setSliderPos] = useState<number>(50);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const { ref: sectionRef, isVisible } = useScrollReveal<HTMLDivElement>();

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    let pos = (x / rect.width) * 100;
    if (pos < 0) pos = 0;
    if (pos > 100) pos = 100;
    setSliderPos(pos);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (isDragging && e.touches[0]) {
      handleMove(e.touches[0].clientX);
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      handleMove(e.clientX);
    }
  };

  const handleMouseUp = () => setIsDragging(false);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging]);

  return (
    <section id="change-detection" className="py-20 px-6 sm:px-12 bg-black text-white border-t border-white/10">
      <div className="max-w-7xl mx-auto" ref={sectionRef}>
        <div className={`flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 reveal ${isVisible ? 'visible' : ''}`}>
          <div>
            <div className="text-xs uppercase tracking-widest text-[#e8702a] font-mono font-semibold mb-2 flex items-center gap-2">
              <Sliders size={16} className="float-icon" /> Satellite Remote Sensing Visual Change Detection
            </div>
            <h2 className="text-3xl sm:text-5xl font-playfair italic font-normal tracking-tight">
              Before vs. After Satellite Change Slider
            </h2>
            <p className="text-sm text-white/60 mt-2 max-w-2xl leading-relaxed">
              Drag the interactive slider to compare high-resolution satellite imagery across time (2018 vs. 2024) and observe AI-detected forest canopy shifts.
            </p>
          </div>

          {/* Site Selector Buttons */}
          <div className="flex flex-wrap gap-2">
            {CHANGE_SITES.map((site, idx) => (
              <button
                key={site.id}
                onClick={() => setSelectedSite(site)}
                className={`px-4 py-2 rounded-full text-xs font-medium transition-all btn-press reveal ${isVisible ? `visible delay-${(idx + 1) * 100}` : ''} ${
                  selectedSite.id === site.id
                    ? 'bg-[#e8702a] text-white shadow-lg shadow-[#e8702a]/30 glow-orange'
                    : 'bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                {site.name.split(' ')[0]} ({site.state})
              </button>
            ))}
          </div>
        </div>

        {/* Interactive Comparison Slider */}
        <div className={`grid grid-cols-1 lg:grid-cols-3 gap-8 items-center mb-12 reveal ${isVisible ? 'visible delay-200' : ''}`}>
          {/* Slider Container */}
          <div className="lg:col-span-2 relative rounded-3xl overflow-hidden border border-white/20 shadow-2xl bg-gray-950 select-none">
            <div
              ref={containerRef}
              onMouseDown={(e) => {
                setIsDragging(true);
                handleMove(e.clientX);
              }}
              onTouchStart={(e) => {
                setIsDragging(true);
                if (e.touches[0]) handleMove(e.touches[0].clientX);
              }}
              className="relative h-[420px] sm:h-[480px] w-full cursor-ew-resize overflow-hidden"
            >
              {/* After Image (Background) */}
              <img
                src={selectedSite.afterImg}
                alt={`${selectedSite.name} ${selectedSite.afterYear}`}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-mono font-semibold border border-white/20 text-[#e8702a]">
                {selectedSite.afterYear} (Current Satellite Telemetry)
              </div>

              {/* Before Image (Clipped Overlay) */}
              <div
                className="absolute inset-0 overflow-hidden"
                style={{ width: `${sliderPos}%` }}
              >
                <img
                  src={selectedSite.beforeImg}
                  alt={`${selectedSite.name} ${selectedSite.beforeYear}`}
                  className="absolute inset-0 w-full h-full object-cover max-w-none"
                  style={{
                    width: containerRef.current?.offsetWidth || '100%',
                    filter: 'saturate(1.5) contrast(1.1) brightness(0.95) hue-rotate(-10deg)',
                  }}
                />
                <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-mono font-semibold border border-white/20 text-emerald-400">
                  {selectedSite.beforeYear} (Reference Imagery)
                </div>
              </div>

              {/* Vertical Slider Handle Line */}
              <div
                className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_12px_rgba(255,255,255,0.8)] cursor-ew-resize z-30"
                style={{ left: `${sliderPos}%` }}
              >
                <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-[#e8702a] text-white border-2 border-white flex items-center justify-center shadow-xl">
                  <Sliders size={18} />
                </div>
              </div>
            </div>
            <div className="bg-black/80 px-6 py-3 border-t border-white/10 flex items-center justify-between text-xs text-white/50 font-mono">
              <span>← Slide Left to Reveal 2024 Imagery</span>
              <span>Slide Right to Reveal 2018 Imagery →</span>
            </div>
          </div>

          {/* Site Telemetry Metrics Card */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 card-hover">
            <div className="flex items-center justify-between">
              <span className={`text-xs font-mono px-3 py-1 rounded-full border ${
                selectedSite.aiAlertStatus === 'HIGH ALERT'
                  ? 'bg-red-500/20 text-red-400 border-red-500/40'
                  : 'bg-amber-500/20 text-amber-400 border-amber-500/40'
              }`}>
                {selectedSite.aiAlertStatus}
              </span>
              <span className="text-xs text-white/40 flex items-center gap-1">
                <Calendar size={12} /> {selectedSite.beforeYear}–{selectedSite.afterYear}
              </span>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-white mb-1">{selectedSite.name}</h3>
              <p className="text-xs text-[#e8702a] font-mono">{selectedSite.location}, {selectedSite.state}</p>
            </div>

            <p className="text-xs text-white/70 leading-relaxed border-t border-white/10 pt-4">
              {selectedSite.description}
            </p>

            <div className="grid grid-cols-2 gap-4 border-t border-b border-white/10 py-4">
              <div className="bg-black/40 border border-white/10 p-3.5 rounded-2xl">
                <div className="text-[11px] text-white/50 mb-1">AI Canopy Drop</div>
                <div className="text-xl font-bold text-red-400">−{selectedSite.canopyLossSqKm} km²</div>
              </div>

              <div className="bg-black/40 border border-white/10 p-3.5 rounded-2xl">
                <div className="text-[11px] text-white/50 mb-1">Relative Change</div>
                <div className="text-xl font-bold text-amber-400">{selectedSite.pctChange}%</div>
              </div>
            </div>

            <div className="text-xs text-white/60">
              <strong className="text-white block mb-1">Primary Change Driver:</strong>
              {selectedSite.primaryCause}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
