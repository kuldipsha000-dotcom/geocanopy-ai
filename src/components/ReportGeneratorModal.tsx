import React, { useState } from 'react';
import { FileText, Download, X, CheckCircle2, ShieldCheck } from 'lucide-react';
import { NATIONAL_STATS_2023 } from '../data/forestData';

interface ReportGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ReportGeneratorModal: React.FC<ReportGeneratorModalProps> = ({ isOpen, onClose }) => {
  const [reportType, setReportType] = useState<'national' | 'campa' | 'satellite'>('national');
  const [includeAIInsights, setIncludeAIInsights] = useState<boolean>(true);
  const [includeCampa, setIncludeCampa] = useState<boolean>(true);
  const [includeStateRankings, setIncludeStateRankings] = useState<boolean>(true);
  const [recipientName, setRecipientName] = useState<string>('Forest Policy & Regulatory Division');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  if (!isOpen) return null;

  const handlePrintDownload = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      // Open the dedicated, print-optimized white report in a new tab
      window.open('/GeoCanopy_AI_Project_Report.html', '_blank');
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-gray-950 border border-white/20 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl text-white">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10 bg-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#e8702a]/20 text-[#e8702a] border border-[#e8702a]/30 flex items-center justify-center">
              <FileText size={20} />
            </div>
            <div>
              <h3 className="text-xl font-bold font-playfair italic">Generate FSI Executive Summary PDF</h3>
              <p className="text-xs text-white/50 font-mono">Survey of India & FSI ISFR Data Standard</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Report Scope Selection */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-white/60 mb-2">
              Select Executive Report Scope
            </label>
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setReportType('national')}
                className={`p-3.5 rounded-2xl border text-left transition-all ${
                  reportType === 'national'
                    ? 'bg-[#e8702a]/20 border-[#e8702a] text-white'
                    : 'bg-white/5 border-white/10 text-white/70 hover:border-white/30'
                }`}
              >
                <div className="font-bold text-xs mb-1">National ISFR 2021/2023</div>
                <div className="text-[10px] text-white/50">Comprehensive Canopy & Carbon Stock</div>
              </button>

              <button
                type="button"
                onClick={() => setReportType('campa')}
                className={`p-3.5 rounded-2xl border text-left transition-all ${
                  reportType === 'campa'
                    ? 'bg-[#e8702a]/20 border-[#e8702a] text-white'
                    : 'bg-white/5 border-white/10 text-white/70 hover:border-white/30'
                }`}
              >
                <div className="font-bold text-xs mb-1">CAMPA Audit Report</div>
                <div className="text-[10px] text-white/50">Afforestation Fund & Plantation Metrics</div>
              </button>

              <button
                type="button"
                onClick={() => setReportType('satellite')}
                className={`p-3.5 rounded-2xl border text-left transition-all ${
                  reportType === 'satellite'
                    ? 'bg-[#e8702a]/20 border-[#e8702a] text-white'
                    : 'bg-white/5 border-white/10 text-white/70 hover:border-white/30'
                }`}
              >
                <div className="font-bold text-xs mb-1">Sentinel AI Alerts</div>
                <div className="text-[10px] text-white/50">Remote Sensing Deforestation Shifts</div>
              </button>
            </div>
          </div>

          {/* Prepared For / Recipient */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-white/60 mb-2">
              Prepared For (Agency / Recipient Title)
            </label>
            <input
              type="text"
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#e8702a] transition-colors"
              placeholder="e.g., MoEFCC / State Forest Department / Research Directorate"
            />
          </div>

          {/* Modular Content Checkboxes */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-white/60 mb-2">
              Include Custom Modules in PDF
            </label>
            <div className="space-y-2.5">
              <label className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10 cursor-pointer hover:bg-white/10 transition-colors">
                <input
                  type="checkbox"
                  checked={includeAIInsights}
                  onChange={(e) => setIncludeAIInsights(e.target.checked)}
                  className="w-4 h-4 accent-[#e8702a] rounded"
                />
                <div>
                  <div className="text-xs font-semibold">Gemini AI Ecological Insights</div>
                  <div className="text-[10px] text-white/50">Automated executive summary and regional anomaly breakdown</div>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10 cursor-pointer hover:bg-white/10 transition-colors">
                <input
                  type="checkbox"
                  checked={includeCampa}
                  onChange={(e) => setIncludeCampa(e.target.checked)}
                  className="w-4 h-4 accent-[#e8702a] rounded"
                />
                <div>
                  <div className="text-xs font-semibold">CAMPA State Target vs. Achievement Metrics</div>
                  <div className="text-[10px] text-white/50">Fund utilization rate & hectares planted per state</div>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10 cursor-pointer hover:bg-white/10 transition-colors">
                <input
                  type="checkbox"
                  checked={includeStateRankings}
                  onChange={(e) => setIncludeStateRankings(e.target.checked)}
                  className="w-4 h-4 accent-[#e8702a] rounded"
                />
                <div>
                  <div className="text-xs font-semibold">State & UT Forest Canopy Leaderboard</div>
                  <div className="text-[10px] text-white/50">28 States & 8 UTs ranked by canopy percentage</div>
                </div>
              </label>
            </div>
          </div>

          {/* Quick Telemetry Preview Box */}
          <div className="bg-black/60 border border-white/15 p-4 rounded-2xl text-xs space-y-2 font-mono">
            <div className="text-emerald-400 font-bold flex items-center gap-1.5">
              <ShieldCheck size={14} /> Verified FSI Key Statistics Summary:
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px] text-white/70">
              <div>• Forest Cover: <strong className="text-white">{NATIONAL_STATS_2023.forestCover.areaSqKm.toLocaleString()} sq km</strong></div>
              <div>• Tree Cover: <strong className="text-white">{NATIONAL_STATS_2023.treeCover.areaSqKm.toLocaleString()} sq km</strong></div>
              <div>• Total Canopy %: <strong className="text-white">{NATIONAL_STATS_2023.totalForestAndTreeCover.percentageOfGeoArea}%</strong></div>
              <div>• Carbon Stock: <strong className="text-white">{NATIONAL_STATS_2023.carbonStock.totalMillionTonnes.toLocaleString()} MT</strong></div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-white/10 bg-white/5 flex items-center justify-between">
          <div className="text-xs text-white/50 flex items-center gap-1 font-mono">
            <CheckCircle2 size={14} className="text-[#e8702a]" /> Ready to export high-res vector report
          </div>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium border border-white/20 hover:bg-white/10 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handlePrintDownload}
              disabled={isGenerating}
              className="px-6 py-2 rounded-xl text-xs font-semibold bg-[#e8702a] text-white hover:bg-[#d65f1a] shadow-lg shadow-[#e8702a]/30 transition-all flex items-center gap-2"
            >
              {isGenerating ? (
                <>Building PDF...</>
              ) : (
                <>
                  <Download size={14} /> Print / Download PDF Summary
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
