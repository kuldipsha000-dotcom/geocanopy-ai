import React, { useState } from 'react';
import { Target, TrendingUp, DollarSign, Award, Search, ArrowUpDown, CheckCircle, AlertCircle, ShieldAlert } from 'lucide-react';
import { useScrollReveal, useCountUp, useBatchReveal } from '../hooks/useAnimations';

interface CampaStateData {
  state: string;
  targetHa: number;
  achievedHa: number;
  fundReleasedCr: number;
  fundUtilizedPct: number;
  auditStatus: 'VERIFIED' | 'UNDER AUDIT' | 'ACTION REQUIRED';
  primarySpecies: string;
}

const CAMPA_DATA: CampaStateData[] = [
  { state: 'Madhya Pradesh', targetHa: 185000, achievedHa: 168200, fundReleasedCr: 5420, fundUtilizedPct: 92, auditStatus: 'VERIFIED', primarySpecies: 'Teak, Sal, Bamboo & Mixed Native Canopy' },
  { state: 'Odisha', targetHa: 160000, achievedHa: 147800, fundReleasedCr: 4890, fundUtilizedPct: 94, auditStatus: 'VERIFIED', primarySpecies: 'Coastal Mangrove & Coastal Belt Protection' },
  { state: 'Telangana', targetHa: 95000, achievedHa: 88350, fundReleasedCr: 2750, fundUtilizedPct: 91, auditStatus: 'VERIFIED', primarySpecies: 'Haritha Haram Urban Block Plantations' },
  { state: 'Chhattisgarh', targetHa: 140000, achievedHa: 119000, fundReleasedCr: 4120, fundUtilizedPct: 86, auditStatus: 'VERIFIED', primarySpecies: 'Hasdeo Corridor Restoration & Native Hardwood' },
  { state: 'Uttarakhand', targetHa: 75000, achievedHa: 66750, fundReleasedCr: 1980, fundUtilizedPct: 89, auditStatus: 'VERIFIED', primarySpecies: 'Oak, Deodar & Alpine Eco-Slope Stabilization' },
  { state: 'Uttar Pradesh', targetHa: 120000, achievedHa: 105600, fundReleasedCr: 3450, fundUtilizedPct: 86, auditStatus: 'VERIFIED', primarySpecies: 'Sub-Himalayan Terai & Sheesham Belts' },
  { state: 'Karnataka', targetHa: 105000, achievedHa: 91350, fundReleasedCr: 2980, fundUtilizedPct: 88, auditStatus: 'VERIFIED', primarySpecies: 'Western Ghats Shola & Deciduous Buffers' },
  { state: 'Gujarat', targetHa: 80000, achievedHa: 68000, fundReleasedCr: 2050, fundUtilizedPct: 84, auditStatus: 'VERIFIED', primarySpecies: 'Gir Grassland & Coastal Mangroves' },
  { state: 'Maharashtra', targetHa: 135000, achievedHa: 112050, fundReleasedCr: 3950, fundUtilizedPct: 81, auditStatus: 'UNDER AUDIT', primarySpecies: 'Teak, Anjan & Sahyadri Wildlife Corridors' },
  { state: 'Andhra Pradesh', targetHa: 90000, achievedHa: 73800, fundReleasedCr: 2400, fundUtilizedPct: 78, auditStatus: 'UNDER AUDIT', primarySpecies: 'Eastern Ghats Scrub & Red Sanders Conservation' },
  { state: 'Jharkhand', targetHa: 110000, achievedHa: 89100, fundReleasedCr: 3100, fundUtilizedPct: 79, auditStatus: 'UNDER AUDIT', primarySpecies: 'Sal Reserve Regeneration & Chota Nagpur Canopy' },
  { state: 'Rajasthan', targetHa: 85000, achievedHa: 63750, fundReleasedCr: 2150, fundUtilizedPct: 72, auditStatus: 'ACTION REQUIRED', primarySpecies: 'Khejri, Neem & Arid Canal-Bank Belts' },
];

export const CampaProgressSection: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortBy, setSortBy] = useState<'achievement' | 'target' | 'fund'>('achievement');

  const { ref: headerRef, isVisible: headerVisible } = useScrollReveal<HTMLDivElement>();
  const { ref: kpiRef, isVisible: kpiVisible } = useScrollReveal<HTMLDivElement>();
  const { ref: cardsRef, visibleIndex } = useBatchReveal<HTMLDivElement>(12, 90);

  const campaTotalCr  = useCountUp(47436, 1800, kpiVisible);
  const targetHa      = useCountUp(185, 1600, kpiVisible);
  const completionPct = useCountUp(854, 1700, kpiVisible);
  const verifiedCount = useCountUp(8, 1000, kpiVisible);

  const filteredData = CAMPA_DATA.filter((item) =>
    item.state.toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a, b) => {
    if (sortBy === 'achievement') return (b.achievedHa / b.targetHa) - (a.achievedHa / a.targetHa);
    if (sortBy === 'target') return b.targetHa - a.targetHa;
    return b.fundReleasedCr - a.fundReleasedCr;
  });

  return (
    <section id="campa-dashboard" className="py-20 px-6 sm:px-12 bg-black text-white border-t border-white/10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div ref={headerRef} className={`flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 reveal ${headerVisible ? 'visible' : ''}`}>
          <div>
            <div className="text-xs uppercase tracking-widest text-[#e8702a] font-mono font-semibold mb-2 flex items-center gap-2">
              <Target size={16} className="float-icon" /> MoEFCC Compensatory Afforestation Fund Telemetry
            </div>
            <h2 className="text-3xl sm:text-5xl font-playfair italic font-normal tracking-tight">
              CAMPA State Afforestation Target vs. Achievement
            </h2>
            <p className="text-sm text-white/60 mt-2 max-w-2xl leading-relaxed">
              Track state-level compensatory afforestation targets (in Hectares), actual plantations achieved, fund releases (in ₹ Crores), and e-GREEN audit verification status.
            </p>
          </div>
          <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-2.5 rounded-full text-xs font-mono">
            <span className="live-dot" />
            <span>Live e-GREEN Portal Telemetry</span>
          </div>
        </div>

        {/* KPI Cards */}
        <div ref={kpiRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {[
            { label: 'Total CAMPA Fund Disbursed', value: `₹${campaTotalCr.toLocaleString('en-IN')} Cr`, sub: 'National Allocation Disbursed', icon: <DollarSign size={16} className="text-[#e8702a] float" />, color: 'text-emerald-400', delay: '' },
            { label: 'Total Afforestation Target', value: `${(targetHa / 100).toFixed(2)}M Ha`, sub: 'Total Target Area in Hectares', icon: <Target size={16} className="text-[#e8702a] float" />, color: 'text-white/50', delay: 'delay-150' },
            { label: 'National Completion Rate', value: `${(completionPct / 10).toFixed(1)}%`, sub: '1.58M Hectares Planted', icon: <Award size={16} className="text-[#e8702a] float" />, color: 'text-emerald-400', delay: 'delay-300' },
            { label: 'Audit Compliance', value: `${verifiedCount} of 12`, sub: 'Top States Fully Verified', icon: <CheckCircle size={16} className="text-emerald-400 float" />, color: 'text-white/50', delay: 'delay-400' },
          ].map(({ label, value, sub, icon, color, delay }) => (
            <div key={label} className={`bg-white/5 border border-white/10 rounded-2xl p-5 card-hover reveal ${kpiVisible ? `visible ${delay}` : ''}`}>
              <div className="flex items-center justify-between text-white/50 mb-2">
                <span className="text-xs font-mono">{label}</span>
                {icon}
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-white font-mono count-up">{value}</div>
              <div className={`text-[11px] mt-1 flex items-center gap-1 ${color}`}>
                {color === 'text-emerald-400' && <TrendingUp size={12} />}{sub}
              </div>
            </div>
          ))}
        </div>

        {/* Search & Sort Bar */}
        <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 bg-white/5 p-4 rounded-2xl border border-white/10 reveal ${headerVisible ? 'visible delay-200' : ''}`}>
          <div className="relative w-full sm:w-80">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              type="text"
              placeholder="Search State or UT..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-black/60 border border-white/15 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-white/40 focus:outline-none focus:border-[#e8702a] transition-colors"
            />
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <span className="text-xs font-mono text-white/50 flex items-center gap-1">
              <ArrowUpDown size={14} /> Sort By:
            </span>
            <div className="flex bg-black/60 border border-white/15 p-1 rounded-xl gap-1">
              {(['achievement', 'target', 'fund'] as const).map((key) => (
                <button
                  key={key}
                  onClick={() => setSortBy(key)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${sortBy === key ? 'bg-[#e8702a] text-white' : 'text-white/60 hover:text-white'}`}
                >
                  {key === 'achievement' ? '% Achieved' : key === 'target' ? 'Target Ha' : 'Fund (₹ Cr)'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* State Cards Grid */}
        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredData.map((item, idx) => {
            const pct = Math.round((item.achievedHa / item.targetHa) * 100);
            return (
              <div
                key={item.state}
                className={`bg-white/5 border border-white/10 hover:border-white/30 rounded-3xl p-6 card-hover reveal ${visibleIndex >= idx ? 'visible' : ''}`}
                style={{ animationDelay: `${idx * 0.07}s` }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-white transition-colors">{item.state}</h3>
                    <p className="text-[11px] text-white/50 font-mono mt-0.5">{item.primarySpecies}</p>
                  </div>
                  <span className={`text-[10px] font-mono px-2.5 py-1 rounded-full border flex items-center gap-1 ${
                    item.auditStatus === 'VERIFIED' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                    : item.auditStatus === 'UNDER AUDIT' ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                    : 'bg-red-500/10 text-red-400 border-red-500/30'
                  }`}>
                    {item.auditStatus === 'VERIFIED' ? <CheckCircle size={10} /> : item.auditStatus === 'UNDER AUDIT' ? <AlertCircle size={10} /> : <ShieldAlert size={10} />}
                    {item.auditStatus}
                  </span>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between text-xs font-mono mb-1.5">
                    <span className="text-white/60">Target Completion</span>
                    <span className={`font-bold ${pct >= 90 ? 'text-emerald-400' : pct >= 80 ? 'text-amber-400' : 'text-red-400'}`}>
                      {pct}% ({item.achievedHa.toLocaleString()} / {item.targetHa.toLocaleString()} Ha)
                    </span>
                  </div>
                  <div className="w-full h-3 bg-black/60 border border-white/10 rounded-full overflow-hidden p-0.5">
                    <div
                      className={`h-full rounded-full bar-fill ${pct >= 90 ? 'bg-emerald-400' : pct >= 80 ? 'bg-amber-400' : 'bg-red-400'}`}
                      style={{ '--bar-width': `${pct}%`, animationDelay: `${0.3 + idx * 0.07}s` } as React.CSSProperties}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 bg-black/40 border border-white/10 p-3 rounded-2xl text-xs">
                  <div>
                    <div className="text-[10px] text-white/50 mb-0.5">Fund Released</div>
                    <div className="font-mono font-bold text-white">₹{item.fundReleasedCr.toLocaleString()} Cr</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-white/50 mb-0.5">Fund Utilized</div>
                    <div className="font-mono font-bold text-emerald-400">{item.fundUtilizedPct}%</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
