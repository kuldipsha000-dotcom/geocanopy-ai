import React from 'react';
import { Layers, Mountain, Compass, Radio, BookOpen, ArrowUpRight } from 'lucide-react';

interface FeatureCardsProps {
  onSelectFeature: (title: string) => void;
}

export const FeatureCards: React.FC<FeatureCardsProps> = ({ onSelectFeature }) => {
  const features = [
    {
      icon: <Layers className="w-6 h-6 text-[#e8702a]" />,
      title: '3D Stratigraphy Maps',
      desc: 'Peel back surface topographies to inspect folded bedrock, fault zones, and subterranean aquifers in millimeter precision.',
      tag: 'Interactive Models',
    },
    {
      icon: <Mountain className="w-6 h-6 text-[#e8702a]" />,
      title: 'Deep Time Timeline',
      desc: 'Travel 4.5 billion years from Hadean magmatic oceans to Holocene glacial retreats through interactive sedimentary cross-sections.',
      tag: 'Chronology Engine',
    },
    {
      icon: <Compass className="w-6 h-6 text-[#e8702a]" />,
      title: 'Field Expedition Guides',
      desc: 'Curated field logs detailing rock formations, fossil beds, and mineral veins across 120+ geological hotspots worldwide.',
      tag: 'Field Resources',
    },
    {
      icon: <Radio className="w-6 h-6 text-[#e8702a]" />,
      title: 'Seismic & Thermal Feeds',
      desc: 'Real-time telemetry tracking tectonic plate displacements, volcanic emissions, and regional fault line micro-strains.',
      tag: 'Live Telemetry',
    },
  ];

  return (
    <section className="bg-gray-950 text-white py-24 px-6 sm:px-12 border-t border-white/10 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#e8702a]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="text-xs uppercase tracking-widest text-[#e8702a] font-semibold mb-3">
              Geological Intelligence
            </div>
            <h2 className="text-3xl sm:text-5xl font-playfair italic font-normal tracking-tight">
              Unearthing the Earth&apos;s Memory
            </h2>
          </div>
          <p className="text-sm text-white/60 max-w-md leading-relaxed">
            Combining satellite synthetic aperture radar, radiometric dating datasets, and high-resolution LiDAR scans to model planetary history.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((item, idx) => (
            <div
              key={idx}
              onClick={() => onSelectFeature(item.title)}
              className="group bg-white/5 border border-white/10 hover:border-[#e8702a]/50 rounded-3xl p-6 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:bg-white/[0.07] cursor-pointer"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="p-3 bg-white/5 border border-white/10 rounded-2xl group-hover:bg-[#e8702a]/10 group-hover:border-[#e8702a]/30 transition-colors">
                    {item.icon}
                  </div>
                  <span className="text-[10px] font-mono text-white/40 uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/5 border border-white/10">
                    {item.tag}
                  </span>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white group-hover:text-[#e8702a] transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-white/60 leading-relaxed mb-6">
                  {item.desc}
                </p>
              </div>

              <div className="flex items-center text-xs font-medium text-[#e8702a] group-hover:translate-x-1 transition-transform">
                <span>Explore Dataset</span>
                <ArrowUpRight size={14} className="ml-1" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
