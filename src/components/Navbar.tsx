import React, { useState } from 'react';
import { Menu, X, ChevronRight, Compass } from 'lucide-react';

interface NavbarProps {
  activeSection: string;
  onNavigate: (sectionId: string) => void;
  onExploreClick: () => void;
  onOpenReportModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeSection,
  onNavigate,
  onExploreClick,
  onOpenReportModal,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'map-section', label: 'Forest Map' },
    { id: 'satellite', label: 'Satellite' },
    { id: 'change-detection', label: 'Change Slider' },
    { id: 'ai-analysis', label: 'AI Assistant' },
    { id: 'afforestation', label: 'Afforestation' },
    { id: 'campa-dashboard', label: 'CAMPA Progress' },
    { id: 'analytics', label: 'Analytics' },
    { id: 'data-sources', label: 'Data Sources' },
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between p-4 sm:p-5 pointer-events-auto bg-black/80 backdrop-blur-xl border-b border-white/10">
        {/* Left: Brand Logo & Wordmark */}
        <div
          onClick={() => onNavigate('home')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-[#e8702a]/20 border border-[#e8702a]/40 flex items-center justify-center transition-transform group-hover:scale-105 shadow-md shadow-[#e8702a]/10">
            <svg
              width="22"
              height="22"
              viewBox="0 0 256 256"
              fill="#e8702a"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M 256 256 L 128 256 L 0 128 L 128 128 Z M 256 128 L 128 128 L 0 0 L 128 0 Z" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-white text-xl font-playfair italic tracking-wide select-none leading-none">
              GeoCanopy <span className="font-sans not-italic text-xs text-[#e8702a] font-semibold ml-1">AI</span>
            </span>
            <span className="text-[10px] text-white/50 tracking-wider uppercase font-mono">
              AI & Remote Sensing Platform
            </span>
          </div>
        </div>

        {/* Center Pill Navigation (Desktop) */}
        <div className="hidden xl:flex items-center bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-2 py-1.5 gap-1 shadow-lg shadow-black/40">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-[#e8702a] text-white shadow-md shadow-[#e8702a]/30'
                    : 'text-white/80 hover:bg-white/15 hover:text-white'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Right (Desktop): CTA Buttons */}
        <div className="hidden lg:flex items-center gap-3">
          <button
            onClick={onOpenReportModal}
            className="bg-[#e8702a]/20 border border-[#e8702a]/50 text-[#e8702a] hover:bg-[#e8702a] hover:text-white text-xs font-semibold px-4 py-2 rounded-full transition-all flex items-center gap-1.5"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            FSI Report PDF
          </button>
          <button
            onClick={onExploreClick}
            className="bg-white text-gray-900 text-xs font-semibold px-4 py-2 rounded-full hover:bg-gray-100 transition-all transform hover:scale-105 active:scale-95 shadow-lg shadow-black/30 flex items-center gap-1.5"
          >
            <Compass size={15} className="text-[#e8702a]" />
            Explore Map
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden text-white p-2 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all"
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[90] bg-black/95 backdrop-blur-xl lg:hidden pt-24 px-6 flex flex-col justify-between pb-10 transition-all duration-300 animate-in fade-in">
          <div className="flex flex-col gap-2">
            <div className="text-xs uppercase font-semibold text-white/40 tracking-wider mb-2">
              Navigation Menu
            </div>
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`flex items-center justify-between p-3.5 rounded-2xl text-left transition-all ${
                  activeSection === item.id
                    ? 'bg-[#e8702a]/20 text-[#e8702a] border border-[#e8702a]/30 font-medium'
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                <span className="text-base">{item.label}</span>
                <ChevronRight size={18} className="text-white/40" />
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-4">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onExploreClick();
              }}
              className="w-full bg-[#e8702a] text-white py-3.5 rounded-full font-medium text-center shadow-lg shadow-[#e8702a]/30 active:scale-95 transition-transform flex items-center justify-center gap-2"
            >
              <Compass size={18} />
              Explore Interactive Map
            </button>
            <p className="text-center text-xs text-white/40">
              © {new Date().getFullYear()} GeoCanopy AI · FSI ISFR Real Data
            </p>
          </div>
        </div>
      )}
    </>
  );
};
