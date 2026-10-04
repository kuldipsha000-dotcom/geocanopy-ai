import React, { useState } from 'react';
import { X, CheckCircle, Sparkles, MapPin, Layers as LayersIcon } from 'lucide-react';

interface InteractiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'signup' | 'digging' | 'tabInfo';
  title?: string;
  tabName?: string;
}

export const InteractiveModal: React.FC<InteractiveModalProps> = ({
  isOpen,
  onClose,
  type,
  title,
  tabName,
}) => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setEmail('');
        onClose();
      }, 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-gray-950 border border-white/20 rounded-3xl p-6 sm:p-8 text-white shadow-2xl overflow-hidden">
        {/* Decorative ambient background glow */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#e8702a]/20 rounded-full blur-3xl pointer-events-none" />

        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-white/50 hover:text-white p-1 rounded-full hover:bg-white/10 transition-all"
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        {type === 'signup' && (
          <div>
            <div className="w-12 h-12 rounded-2xl bg-[#e8702a]/20 border border-[#e8702a]/30 flex items-center justify-center mb-4 text-[#e8702a]">
              <Sparkles size={24} />
            </div>
            <h3 className="text-2xl font-semibold mb-2">Join GeoCanopy AI</h3>
            <p className="text-sm text-white/70 mb-6 leading-relaxed">
              Subscribe to access high-resolution forest canopy maps, remote sensing telemetry, and AI classification datasets.
            </p>

            {submitted ? (
              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-4 flex items-center gap-3 text-emerald-400">
                <CheckCircle size={22} className="flex-shrink-0" />
                <div className="text-sm">
                  <div className="font-semibold">Welcome to GeoCanopy AI!</div>
                  <div className="text-xs text-emerald-400/80">Check your inbox for platform updates.</div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                  className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-[#e8702a] transition-all"
                />
                <button
                  type="submit"
                  className="w-full bg-[#e8702a] hover:bg-[#d2611f] text-white text-sm font-medium py-3.5 rounded-xl transition-all shadow-lg shadow-[#e8702a]/30 active:scale-95"
                >
                  Create Free Account
                </button>
              </form>
            )}
          </div>
        )}

        {type === 'digging' && (
          <div className="text-center py-2">
            <div className="w-16 h-16 rounded-full bg-[#e8702a]/20 border border-[#e8702a]/30 flex items-center justify-center mx-auto mb-4 text-[#e8702a]">
              <MapPin size={30} />
            </div>
            <h3 className="text-2xl font-semibold mb-2">Stratigraphic Explorer</h3>
            <p className="text-sm text-white/70 mb-6 leading-relaxed">
              Moving your cursor reveals the underlying <strong>metamorphic bedrock layer</strong> formed 450 million years ago during the Ordovician period.
            </p>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-xs text-white/80 mb-6 space-y-2 text-left">
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-white/40">Current Formation</span>
                <span className="font-semibold text-amber-400">Gneiss & Mica Schist</span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-white/40">Depth Range</span>
                <span className="font-semibold">1,200m – 4,800m</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/40">Spotlight Diameter</span>
                <span className="font-semibold text-[#e8702a]">520px (260px Radius)</span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-full bg-white text-gray-900 text-sm font-semibold py-3 rounded-xl hover:bg-gray-100 transition-all active:scale-95"
            >
              Continue Exploring
            </button>
          </div>
        )}

        {type === 'tabInfo' && (
          <div>
            <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center mb-4 text-white">
              <Sparkles size={24} />
            </div>
            <h3 className="text-2xl font-semibold mb-2">{tabName || title}</h3>
            <p className="text-sm text-white/70 mb-6 leading-relaxed">
              You selected <strong>{tabName}</strong>. Explore subterranean cross-sections, structural fault lines, and mineral deposits mapped by satellite remote sensing.
            </p>
            <button
              onClick={onClose}
              className="w-full bg-[#e8702a] text-white text-sm font-medium py-3 rounded-xl hover:bg-[#d2611f] transition-all"
            >
              Got It
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
