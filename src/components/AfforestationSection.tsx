import React, { useState } from 'react';
import { AFFORESTATION_SCHEMES, STATE_FOREST_DATA } from '../data/forestData';
import { TreePine, Search, ShieldAlert, Check } from 'lucide-react';

export const AfforestationSection: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredStates = STATE_FOREST_DATA.filter((s) =>
    s.state.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const maxForestArea = STATE_FOREST_DATA[0].forestCoverSqKm;

  return (
    <section id="afforestation" className="py-20 px-6 sm:px-12 bg-gray-950 text-white border-t border-white/10">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="text-xs uppercase tracking-widest text-[#3db56c] font-mono font-semibold mb-2 flex items-center gap-2">
              <TreePine size={16} /> Afforestation Monitoring & Schemes
            </div>
            <h2 className="text-3xl sm:text-5xl font-playfair italic font-normal tracking-tight">
              Government Afforestation Programmes
            </h2>
            <p className="text-sm text-white/60 mt-2 max-w-2xl leading-relaxed">
              Official afforestation targets and schemes under the Ministry of Environment, Forest & Climate Change (MoEFCC).
            </p>
          </div>
        </div>

        {/* Scheme Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {AFFORESTATION_SCHEMES.map((scheme, idx) => (
            <div key={idx} className="bg-white/5 border border-white/10 rounded-3xl p-6 flex flex-col justify-between hover:border-[#3db56c]/40 transition-all">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono text-[#3db56c] bg-[#3db56c]/10 border border-[#3db56c]/30 px-3 py-1 rounded-full">
                    {scheme.status}
                  </span>
                  <span className="text-[10px] text-white/40">{scheme.ministry}</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{scheme.name}</h3>
                <p className="text-xs text-white/60 leading-relaxed mb-4">{scheme.objective}</p>
              </div>

              <div className="border-t border-white/10 pt-4 mt-2">
                {scheme.targetAreaHectares && (
                  <div className="text-xs text-emerald-400 font-semibold mb-1">
                    Target: {(scheme.targetAreaHectares / 1000000).toFixed(0)} million ha
                  </div>
                )}
                {scheme.fundSizeInr && (
                  <div className="text-xs text-amber-400 font-semibold mb-1">
                    Fund: {scheme.fundSizeInr}
                  </div>
                )}
                <div className="text-[10px] text-white/40">{scheme.sourceNote}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Complete State-wise Table */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
            <div>
              <h3 className="text-xl font-bold text-white">All 36 States & Union Territories — Forest Cover</h3>
              <p className="text-xs text-white/50 mt-1">
                Sorted by total forest cover area (ISFR 2021 Volume II).
              </p>
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-2.5 text-white/40" size={16} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search state..."
                className="w-full bg-black/60 border border-white/20 rounded-full pl-9 pr-4 py-2 text-xs text-white placeholder:text-white/40 focus:outline-none focus:border-[#3db56c]"
              />
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-white/10">
            <table className="w-full text-left text-xs">
              <thead className="bg-white/10 text-white/60 uppercase font-mono border-b border-white/10">
                <tr>
                  <th className="p-3">Rank</th>
                  <th className="p-3">State / Union Territory</th>
                  <th className="p-3">Forest Cover (sq km)</th>
                  <th className="p-3">Geo Area (sq km)</th>
                  <th className="p-3">% of State Area</th>
                  <th className="p-3 min-w-[120px]">Relative Coverage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-white/80">
                {filteredStates.map((st) => {
                  const pct = ((st.forestCoverSqKm / st.geoAreaSqKm) * 100).toFixed(1);
                  const barW = Math.round((st.forestCoverSqKm / maxForestArea) * 100);
                  return (
                    <tr key={st.state} className="hover:bg-white/5 transition-colors">
                      <td className="p-3 font-mono text-white/50">#{st.rank}</td>
                      <td className="p-3 font-semibold text-white">{st.state}</td>
                      <td className="p-3 font-mono text-[#3db56c] font-bold">{st.forestCoverSqKm.toLocaleString('en-IN')}</td>
                      <td className="p-3 text-white/60">{st.geoAreaSqKm.toLocaleString('en-IN')}</td>
                      <td className="p-3 font-bold">{pct}%</td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-[#3db56c] h-full rounded-full" style={{ width: `${barW}%` }} />
                          </div>
                          <span className="text-[10px] text-white/40 font-mono">{barW}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="text-[10px] text-white/40 mt-4">
            Source: Forest Survey of India, India State of Forest Report 2021 · fsi.nic.in
          </div>
        </div>
      </div>
    </section>
  );
};
