import React, { useState } from 'react';
import { FileText, Download, X, CheckCircle2, ShieldCheck } from 'lucide-react';
import { NATIONAL_STATS_2023 } from '../data/forestData';

interface ReportGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ReportGeneratorModal: React.FC<ReportGeneratorModalProps> = ({ isOpen, onClose }) => {
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

        {/* Form Body - Simplified Checkbox List */}
        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-white/60 mb-4">
              Select Topics to Include in Report
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { id: 'forestMap', label: 'Forest Map', desc: 'Interactive map and territorial data' },
                { id: 'satellite', label: 'Satellite', desc: 'High-res satellite telemetry' },
                { id: 'changeSlider', label: 'Change Slider', desc: 'Before vs. after canopy shifts' },
                { id: 'geminiAI', label: 'Gemini AI Insights', desc: 'AI-generated ecological analysis' },
                { id: 'afforestation', label: 'Afforestation', desc: 'Tree planting and land restoration' },
                { id: 'campa', label: 'CAMPA Progress', desc: 'Fund utilization metrics' },
                { id: 'analytics', label: 'Analytics', desc: 'National forest statistics' },
                { id: 'dataSources', label: 'Data Sources', desc: 'Citations and external API data' }
              ].map((topic) => (
                <label key={topic.id} className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10 cursor-pointer hover:bg-white/10 transition-colors">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="w-4 h-4 accent-[#e8702a] rounded cursor-pointer"
                  />
                  <div>
                    <div className="text-sm font-semibold">{topic.label}</div>
                    <div className="text-[10px] text-white/50">{topic.desc}</div>
                  </div>
                </label>
              ))}
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
