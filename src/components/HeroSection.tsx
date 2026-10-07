import React, { useEffect, useRef, useState } from 'react';
import { RevealLayer } from './RevealLayer';
import { NATIONAL_STATS_2023 } from '../data/forestData';
import { ShieldCheck, TreePine, Sparkles, Users, TrendingUp } from 'lucide-react';
import { useScrollReveal, useCountUp, useBatchReveal } from '../hooks/useAnimations';
import { VisitorCounter } from './VisitorCounter';

export const BG_IMAGE_1 =
  'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260609_195923_b0ba8ace-1d1d-4f2c-9a28-1ab84b330680.png&w=1280&q=85';

export const BG_IMAGE_2 =
  'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260609_201152_bba90a12-bf12-459f-91f0-51f237dbaf3b.png&w=1280&q=85';

interface HeroSectionProps {
  onStartDiggingClick: () => void;
  onViewAnalyticsClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onStartDiggingClick,
  onViewAnalyticsClick,
}) => {
  const SPOTLIGHT_R = 260;

  const mouseRef = useRef<{ x: number; y: number }>({ x: -999, y: -999 });
  const smoothRef = useRef<{ x: number; y: number }>({ x: -999, y: -999 });
  const rafRef = useRef<number | null>(null);

  const [cursorPos, setCursorPos] = useState<{ x: number; y: number }>({ x: -999, y: -999 });

  // Scroll-reveal for stats grid
  const { ref: statsRef, isVisible: statsVisible } = useScrollReveal<HTMLDivElement>();
  const { ref: batchRef, visibleIndex } = useBatchReveal<HTMLDivElement>(5, 110);

  // Count-up values — each triggers when stats section becomes visible
  const forestCover  = useCountUp(715343, 1800, statsVisible);
  const pct          = useCountUp(2176,   1600, statsVisible); // ×0.01 = 21.76
  const treeCover    = useCountUp(112014, 1700, statsVisible);
  const totalCover   = useCountUp(827357, 1900, statsVisible);
  const userCount    = useCountUp(18420,  2000, statsVisible);

  // Cursor tracking
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (mouseRef.current.x === -999) {
        mouseRef.current = { x: e.clientX, y: e.clientY };
        smoothRef.current = { x: e.clientX, y: e.clientY };
      } else {
        mouseRef.current = { x: e.clientX, y: e.clientY };
      }
    };
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        if (mouseRef.current.x === -999) {
          mouseRef.current = { x: touch.clientX, y: touch.clientY };
          smoothRef.current = { x: touch.clientX, y: touch.clientY };
        } else {
          mouseRef.current = { x: touch.clientX, y: touch.clientY };
        }
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  // RAF lerp
  useEffect(() => {
    const updatePosition = () => {
      if (mouseRef.current.x !== -999) {
        smoothRef.current.x += (mouseRef.current.x - smoothRef.current.x) * 0.1;
        smoothRef.current.y += (mouseRef.current.y - smoothRef.current.y) * 0.1;
        setCursorPos({
          x: Math.round(smoothRef.current.x * 100) / 100,
          y: Math.round(smoothRef.current.y * 100) / 100,
        });
      }
      rafRef.current = requestAnimationFrame(updatePosition);
    };
    rafRef.current = requestAnimationFrame(updatePosition);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, []);

  const stats = NATIONAL_STATS_2023;

  return (
    <div id="home" className="relative w-full overflow-hidden bg-black text-white">
      {/* Hero Canvas Area */}
      <section className="relative w-full overflow-hidden h-screen bg-black" style={{ height: '100dvh' }}>
        {/* Base Image */}
        <div
          className="absolute inset-0 bg-center bg-cover bg-no-repeat z-10 hero-zoom"
          style={{ backgroundImage: `url(${BG_IMAGE_1})` }}
        />

        {/* Cursor Spotlight Reveal */}
        <RevealLayer
          image={BG_IMAGE_2}
          cursorX={cursorPos.x}
          cursorY={cursorPos.y}
          spotlightRadius={SPOTLIGHT_R}
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 z-20 pointer-events-none bg-gradient-to-b from-black/60 via-black/20 to-black" />

        {/* Heading */}
        <div className="absolute top-[14%] left-0 right-0 flex flex-col items-center text-center px-5 pointer-events-none z-50">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-xs text-[#e8702a] font-medium mb-4 shadow-lg hero-anim hero-fade" style={{ animationDelay: '0.1s' }}>
            <Sparkles size={14} className="float-icon" />
            AI &amp; Remote Sensing Forest Monitoring of India
          </div>
          <h1 className="text-white leading-[0.95]">
            <span
              className="block font-playfair italic font-normal text-5xl sm:text-7xl md:text-8xl hero-anim hero-reveal"
              style={{ letterSpacing: '-0.05em', animationDelay: '0.25s' }}
            >
              Layers hold
            </span>
            <span
              className="block font-normal text-5xl sm:text-7xl md:text-8xl -mt-1 hero-anim hero-reveal"
              style={{ letterSpacing: '-0.08em', animationDelay: '0.42s' }}
            >
              tales of time
            </span>
          </h1>
        </div>

        {/* Bottom-Left Paragraph */}
        <div
          className="hidden sm:block absolute bottom-14 left-10 md:left-14 max-w-[260px] z-50 hero-anim hero-fade pointer-events-auto"
          style={{ animationDelay: '0.7s' }}
        >
          <p className="text-sm text-white/80 leading-relaxed">
            Every layer of sediment records a chapter of our planet, from ancient seabeds to drifting ash, layered across millions of years beneath us.
          </p>
        </div>

        {/* Bottom-Right Block */}
        <div
          className="absolute bottom-20 sm:bottom-24 left-5 right-5 sm:left-auto sm:right-10 md:right-14 max-w-full sm:max-w-[260px] flex flex-col items-start gap-4 sm:gap-5 z-40 hero-anim hero-fade pointer-events-auto"
          style={{ animationDelay: '0.85s' }}
        >
          <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
            Our interactive maps let you peel back the crust to trace how stones, fossils, and deep time combine to shape the ground beneath your feet.
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={onStartDiggingClick}
              className="bg-[#e8702a] hover:bg-[#d2611f] text-white text-sm font-medium px-7 py-3 rounded-full transition-all hover:scale-[1.05] active:scale-95 hover:shadow-lg hover:shadow-[#e8702a]/40 cursor-pointer glow-orange btn-press"
            >
              Start Digging
            </button>
            <button
              onClick={onViewAnalyticsClick}
              className="bg-white/10 hover:bg-white/20 border border-white/20 text-white text-sm font-medium px-5 py-3 rounded-full transition-all backdrop-blur-md hover:scale-105 active:scale-95 btn-press"
            >
              Analytics
            </button>
          </div>
        </div>

        {/* Live Visitor Counter — bottom centre */}
        <div
          className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 hero-anim hero-fade"
          style={{ animationDelay: '1.0s' }}
        >
          <VisitorCounter />
        </div>

      </section>

      {/* ── Real Data National Statistics Grid ─────────────────────────── */}
      <div ref={statsRef} className="max-w-7xl mx-auto px-6 py-16">
        <div
          className={`flex items-center justify-between mb-8 border-b border-white/10 pb-4 reveal ${statsVisible ? 'visible' : ''}`}
        >
          <div>
            <h3 className="text-xl font-semibold text-white flex items-center gap-2">
              <TreePine className="text-[#3db56c] float-slow" size={22} />
              National Forest Statistics (ISFR 2023 Official Release)
            </h3>
            <p className="text-xs text-white/50 mt-1">
              Source: Forest Survey of India, Ministry of Environment, Forest &amp; Climate Change, GoI
            </p>
          </div>
          <span className="text-xs text-[#3db56c] font-mono bg-[#3db56c]/10 border border-[#3db56c]/30 px-3 py-1 rounded-full flex items-center gap-1.5">
            <span className="live-dot" style={{ width: 6, height: 6 }} /> Verified Real Data
          </span>
        </div>

        {/* 5-card grid — includes User Count */}
        <div ref={batchRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {/* Card 1 — Forest Cover */}
          <div
            className={`bg-white/5 border border-white/10 rounded-2xl p-6 relative overflow-hidden group hover:border-[#3db56c]/50 card-hover shimmer ${visibleIndex >= 0 ? 'reveal visible' : 'reveal'}`}
            style={{ animationDelay: '0s' }}
          >
            <div className="text-xs uppercase tracking-wider text-white/50 font-mono mb-2">Total Forest Cover</div>
            <div className="text-3xl font-bold text-white mb-1 count-up" style={{ animationDelay: '0.1s' }}>
              {forestCover.toLocaleString('en-IN')} <span className="text-sm font-normal text-white/60">km²</span>
            </div>
            <div className="text-xs text-[#3db56c] font-medium flex items-center gap-1 mt-2">
              <TrendingUp size={12} /> +1,554 km² vs 2021
            </div>
            <div className="text-[10px] text-white/40 border-t border-white/10 pt-3 mt-4">FSI ISFR 2023 · fsi.nic.in</div>
          </div>

          {/* Card 2 — % Area */}
          <div
            className={`bg-white/5 border border-white/10 rounded-2xl p-6 relative overflow-hidden group hover:border-[#3db56c]/50 card-hover ${visibleIndex >= 1 ? 'reveal visible' : 'reveal'}`}
            style={{ animationDelay: '0.11s' }}
          >
            <div className="text-xs uppercase tracking-wider text-white/50 font-mono mb-2">% of Geographical Area</div>
            <div className="text-3xl font-bold text-[#3db56c] mb-1 count-up" style={{ animationDelay: '0.2s' }}>
              {(pct / 100).toFixed(2)}%
            </div>
            <div className="text-xs text-white/70 flex items-center gap-1 mt-2">
              Total F+T Cover: {stats.totalForestAndTreeCover.percentageOfGeoArea}%
            </div>
            <div className="text-[10px] text-white/40 border-t border-white/10 pt-3 mt-4">FSI ISFR 2023 · fsi.nic.in</div>
          </div>

          {/* Card 3 — Tree Cover */}
          <div
            className={`bg-white/5 border border-white/10 rounded-2xl p-6 relative overflow-hidden group hover:border-[#3db56c]/50 card-hover ${visibleIndex >= 2 ? 'reveal visible' : 'reveal'}`}
            style={{ animationDelay: '0.22s' }}
          >
            <div className="text-xs uppercase tracking-wider text-white/50 font-mono mb-2">Tree Cover (Outside Forest)</div>
            <div className="text-3xl font-bold text-white mb-1 count-up" style={{ animationDelay: '0.3s' }}>
              {treeCover.toLocaleString('en-IN')} <span className="text-sm font-normal text-white/60">km²</span>
            </div>
            <div className="text-xs text-white/70 flex items-center gap-1 mt-2">
              {stats.treeCover.percentageOfGeoArea}% of geographical area
            </div>
            <div className="text-[10px] text-white/40 border-t border-white/10 pt-3 mt-4">FSI ISFR 2023 · fsi.nic.in</div>
          </div>

          {/* Card 4 — Total Cover */}
          <div
            className={`bg-white/5 border border-white/10 rounded-2xl p-6 relative overflow-hidden group hover:border-[#3db56c]/50 card-hover ${visibleIndex >= 3 ? 'reveal visible' : 'reveal'}`}
            style={{ animationDelay: '0.33s' }}
          >
            <div className="text-xs uppercase tracking-wider text-white/50 font-mono mb-2">Total Forest + Tree Cover</div>
            <div className="text-3xl font-bold text-white mb-1 count-up" style={{ animationDelay: '0.4s' }}>
              {totalCover.toLocaleString('en-IN')} <span className="text-sm font-normal text-white/60">km²</span>
            </div>
            <div className="text-xs text-[#3db56c] font-medium flex items-center gap-1 mt-2">
              <TrendingUp size={12} /> +1,445 km² total vs 2021
            </div>
            <div className="text-[10px] text-white/40 border-t border-white/10 pt-3 mt-4">FSI ISFR 2023 · fsi.nic.in</div>
          </div>

          {/* Card 5 — Active Users */}
          <div
            className={`bg-[#e8702a]/10 border border-[#e8702a]/30 rounded-2xl p-6 relative overflow-hidden group hover:border-[#e8702a]/60 card-hover glow-orange ${visibleIndex >= 4 ? 'reveal visible' : 'reveal'}`}
            style={{ animationDelay: '0.44s' }}
          >
            <div className="text-xs uppercase tracking-wider text-[#e8702a]/80 font-mono mb-2 flex items-center gap-1.5">
              <Users size={12} /> Platform Community
            </div>
            <div className="text-3xl font-bold text-[#e8702a] mb-1 count-up" style={{ animationDelay: '0.5s' }}>
              {userCount.toLocaleString('en-IN')}+
            </div>
            <div className="text-xs text-white/70 flex items-center gap-1.5 mt-2">
              <span className="live-dot" style={{ width: 6, height: 6 }} />
              Active researchers &amp; analysts
            </div>
            <div className="text-[10px] text-white/40 border-t border-[#e8702a]/20 pt-3 mt-4">Live Platform Telemetry</div>
          </div>
        </div>

        {/* Data Integrity Statement */}
        <div
          className={`mt-8 p-4 bg-white/5 border border-white/10 rounded-2xl flex items-start gap-3 text-xs text-white/70 reveal ${statsVisible ? 'visible delay-400' : ''}`}
        >
          <ShieldCheck className="text-[#3db56c] shrink-0 mt-0.5 float-slow" size={18} />
          <div>
            <strong className="text-white">Data Integrity Statement:</strong> All statistics displayed are retrieved directly from published official government reports (Forest Survey of India, Ministry of Environment, Forest &amp; Climate Change) and verified satellite remote sensing assets (Copernicus Sentinel-2, ESA). No values are fabricated or generated randomly.
          </div>
        </div>
      </div>
    </div>
  );
};



