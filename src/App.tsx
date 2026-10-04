import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { ForestMapSection } from './components/ForestMapSection';
import { SatelliteSection } from './components/SatelliteSection';
import { SatelliteSliderSection } from './components/SatelliteSliderSection';
import { AIChatSection } from './components/AIChatSection';
import { AfforestationSection } from './components/AfforestationSection';
import { CampaProgressSection } from './components/CampaProgressSection';
import { AnalyticsSection } from './components/AnalyticsSection';
import { DataSourcesSection } from './components/DataSourcesSection';
import { Footer } from './components/Footer';
import { InteractiveModal } from './components/InteractiveModal';
import { ReportGeneratorModal } from './components/ReportGeneratorModal';

export const App: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('home');
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    type: 'signup' | 'digging' | 'tabInfo';
    tabName?: string;
  }>({
    isOpen: false,
    type: 'signup',
  });

  const handleNavigate = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleStartDigging = () => {
    handleNavigate('map-section');
  };

  const handleViewAnalytics = () => {
    handleNavigate('analytics');
  };

  const handleCloseModal = () => {
    setModalState((prev) => ({ ...prev, isOpen: false }));
  };

  // Section observer to update nav active state on scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = [
        'home',
        'map-section',
        'satellite',
        'change-detection',
        'ai-analysis',
        'afforestation',
        'campa-dashboard',
        'analytics',
        'data-sources',
      ];
      const scrollPosition = window.scrollY + 200;

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      className="min-h-screen bg-black text-white tracking-[-0.02em] selection:bg-[#e8702a] selection:text-white"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {/* Fixed Glassmorphism Navigation Bar */}
      <Navbar
        activeSection={activeSection}
        onNavigate={handleNavigate}
        onExploreClick={() => handleNavigate('map-section')}
        onOpenReportModal={() => setIsReportModalOpen(true)}
      />

      {/* Hero Section with Cursor Spotlight Reveal & Real Stat Cards */}
      <HeroSection
        onStartDiggingClick={handleStartDigging}
        onViewAnalyticsClick={handleViewAnalytics}
      />

      {/* Interactive Leaflet India Forest Map Section */}
      <ForestMapSection />

      {/* Satellite Analysis & NDVI Index Section */}
      <SatelliteSection />

      {/* Interactive Satellite Change Slider (2018 vs 2024) */}
      <SatelliteSliderSection />

      {/* AI Assistant & Explanation Generator Section */}
      <AIChatSection />

      {/* Afforestation Monitoring & State Table Section */}
      <AfforestationSection />

      {/* CAMPA Target vs Achievement Dashboard */}
      <CampaProgressSection />

      {/* Real-Data Analytics Visualisation Section */}
      <AnalyticsSection />

      {/* Data Sources & Transparency Section */}
      <DataSourcesSection />

      {/* Project Footer */}
      <Footer />

      {/* Executive Summary PDF Report Generator Modal */}
      <ReportGeneratorModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
      />

      {/* Interactive Modal */}
      <InteractiveModal
        isOpen={modalState.isOpen}
        onClose={handleCloseModal}
        type={modalState.type}
        tabName={modalState.tabName}
      />
    </div>
  );
};

export default App;
