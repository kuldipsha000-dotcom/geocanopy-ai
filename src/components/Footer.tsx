import React from 'react';
import { TreePine } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-black text-white/60 py-12 px-6 sm:px-12 border-t border-white/10 text-xs">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#e8702a]/20 border border-[#e8702a]/40 flex items-center justify-center text-[#e8702a]">
            <TreePine size={18} />
          </div>
          <div>
            <div className="font-playfair italic font-normal text-white text-base">
              GeoCanopy <span className="font-sans not-italic text-xs text-[#e8702a]">AI</span>
            </div>
            <div className="text-[10px] text-white/40">
              AI & Remote Sensing for Monitoring Afforestation Programs and Combating Deforestation in India
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-[11px] text-white/50">
          <a href="https://fsi.nic.in/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
            Forest Survey of India
          </a>
          <span>·</span>
          <a href="https://dataspace.copernicus.eu/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
            Copernicus Sentinel-2
          </a>
          <span>·</span>
          <a href="https://moef.gov.in/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
            MoEFCC GoI
          </a>
        </div>

        <div className="text-[10px] text-white/40 font-mono">
          © {new Date().getFullYear()} GeoCanopy AI · College Project Prototype
        </div>
      </div>
    </footer>
  );
};
