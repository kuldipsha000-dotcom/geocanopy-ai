import React, { useEffect, useState } from 'react';
import { Users, Globe, Wifi, WifiOff } from 'lucide-react';
import { useVisitorCount } from '../hooks/useVisitorCount';

/**
 * VisitorCounter
 * Displays real-time active visitors + all-time total visits
 * in an animated pill badge — shown at the bottom-centre of the Hero section.
 */
export const VisitorCounter: React.FC = () => {
  const { activeNow, totalVisits, isLive, isLoading, status } = useVisitorCount();

  // Animate displayed number smoothly when it changes
  const [displayActive, setDisplayActive] = useState<number>(activeNow);
  const [displayTotal, setDisplayTotal] = useState<number>(totalVisits);
  const [showDetail, setShowDetail] = useState<boolean>(false);

  // Smooth count transition for activeNow
  useEffect(() => {
    if (activeNow === displayActive) return;
    const diff = activeNow - displayActive;
    const step = diff > 0 ? 1 : -1;
    const delay = Math.max(30, 300 / Math.abs(diff));

    const timer = setTimeout(() => {
      setDisplayActive((prev) => prev + step);
    }, delay);

    return () => clearTimeout(timer);
  }, [activeNow, displayActive]);

  // Smooth count transition for totalVisits
  useEffect(() => {
    if (totalVisits === displayTotal) return;
    const diff = totalVisits - displayTotal;
    if (Math.abs(diff) > 500) {
      setDisplayTotal(totalVisits);
      return;
    }
    const step = diff > 0 ? 1 : -1;
    const delay = Math.max(8, 200 / Math.abs(diff));

    const timer = setTimeout(() => {
      setDisplayTotal((prev) => prev + step);
    }, delay);

    return () => clearTimeout(timer);
  }, [totalVisits, displayTotal]);

  return (
    <div className="relative flex flex-col items-center">
      {/* ── Main Pill Badge ─────────────────────────────────── */}
      <button
        onClick={() => setShowDetail((v) => !v)}
        className="group flex flex-wrap sm:flex-nowrap items-center justify-center gap-2 sm:gap-3 px-3 sm:px-5 py-2.5 rounded-[2rem] sm:rounded-full bg-black/70 border border-white/15 backdrop-blur-md
                   hover:border-white/30 hover:bg-black/80 transition-all duration-300 cursor-pointer select-none"
      >
        {/* Live dot */}
        <span className="relative flex items-center justify-center w-2.5 h-2.5 shrink-0">
          <span
            className={`absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping ${
              isLive ? 'bg-emerald-400' : status === 'fallback' ? 'bg-amber-400' : 'bg-white/40'
            }`}
          />
          <span
            className={`relative inline-flex rounded-full h-2 w-2 ${
              isLive ? 'bg-emerald-400' : status === 'fallback' ? 'bg-amber-400' : 'bg-white/30'
            }`}
          />
        </span>

        {/* Active count */}
        <span className="flex items-center gap-1.5 text-xs font-mono shrink-0">
          <Users size={12} className="text-white/60" />
          <span className="text-white font-bold tabular-nums">
            {isLoading ? '—' : displayActive.toLocaleString('en-IN')}
          </span>
          <span className="text-white/55 hidden sm:inline">
            {displayActive === 1 ? 'visitor' : 'visitors'} online now
          </span>
          <span className="text-white/55 sm:hidden">online</span>
        </span>

        {/* Divider */}
        <span className="w-px h-3 bg-white/20 shrink-0" />

        {/* Total visits */}
        <span className="flex items-center gap-1.5 text-xs font-mono shrink-0">
          <Globe size={12} className="text-white/60" />
          <span className="text-[#e8702a] font-bold tabular-nums">
            {isLoading ? '—' : `${displayTotal.toLocaleString('en-IN')}+`}
          </span>
          <span className="text-white/55 hidden sm:inline">total visits</span>
          <span className="text-white/55 sm:hidden">total</span>
        </span>

        {/* Connection indicator */}
        <span className="ml-0.5 shrink-0">
          {isLive ? (
            <Wifi size={11} className="text-emerald-400/70" />
          ) : status === 'fallback' ? (
            <WifiOff size={11} className="text-amber-400/60" />
          ) : (
            <Wifi size={11} className="text-white/20 animate-pulse" />
          )}
        </span>
      </button>

      {/* ── Expanded Detail Panel (on click) ─────────────────── */}
      {showDetail && (
        <div className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 animate-fadeIn bg-black/90 border border-white/15 backdrop-blur-xl rounded-2xl px-4 sm:px-5 py-4 w-[92vw] sm:w-72 max-w-[320px] text-[11px] sm:text-xs font-mono shadow-2xl z-[60]">
          <div className="text-white/50 uppercase tracking-widest text-[10px] mb-3 text-center sm:text-left">
            Platform Transparency
          </div>

          <div className="space-y-2.5">
            <div className="flex justify-between items-center">
              <span className="text-white/60">Active sessions</span>
              <span className="text-emerald-400 font-bold">
                {displayActive.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/60">All-time visits</span>
              <span className="text-[#e8702a] font-bold">
                {displayTotal.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="flex justify-between items-center border-t border-white/10 pt-2.5">
              <span className="text-white/60">Data source</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                isLive
                  ? 'bg-emerald-500/15 text-emerald-400'
                  : 'bg-amber-500/15 text-amber-400'
              }`}>
                {isLive ? '🔥 Firebase Live' : '📊 Seeded Estimate'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/60">Tracking method</span>
              <span className="text-white/80">
                {isLive ? 'Presence (onDisconnect)' : 'Animated estimate'}
              </span>
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-white/10 text-[10px] text-white/35 leading-relaxed">
            {isLive
              ? 'Active count tracks users currently connected. Cleared automatically when tabs close. No cookies or personal data stored.'
              : 'Firebase not yet configured. Numbers are seeded estimates. Connect Firebase for live tracking.'}
          </div>
        </div>
      )}
    </div>
  );
};
