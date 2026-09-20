import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Overview } from './components/Overview';
import { DelegatePass } from './components/DelegatePass';
import { BookTickets } from './components/BookTickets';
import { TroupeEntry } from './components/TroupeEntry';
import { JoinSecretariat } from './components/JoinSecretariat';
import { SponsorUs } from './components/SponsorUs';
import { AboutVenue } from './components/AboutVenue';
import { ContactUs } from './components/ContactUs';
import { OrganizerPortal } from './components/OrganizerPortal';
import { DigitalPassModal } from './components/DigitalPassModal';
import { DigitalPassData } from './types';
import { ensureInitialCollectionsAndData } from './services/registrationService';

export function App() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [digitalPassData, setDigitalPassData] = useState<DigitalPassData | null>(null);

  // Initialize and verify collections on startup
  useEffect(() => {
    ensureInitialCollectionsAndData().catch(err => {
      console.warn('Startup collection check notice:', err);
    });

    // Hash based routing support
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '').trim();
      if (['home', 'delegate', 'tickets', 'troupe', 'secretariat', 'sponsor', 'about', 'contact', 'admin'].includes(hash)) {
        setActiveTab(hash);
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    window.location.hash = tab;
  };

  return (
    <div className="min-h-screen bg-[#faf7f0] text-[#242c18] flex flex-col font-sans selection:bg-[#3b4928] selection:text-[#f7f4ec]">
      {/* Navigation Header */}
      <Header activeTab={activeTab} setActiveTab={handleTabChange} />

      {/* Main Content View */}
      <main className="flex-1">
        {activeTab === 'home' && <Overview setActiveTab={handleTabChange} />}
        {activeTab === 'delegate' && <DelegatePass onPassGenerated={setDigitalPassData} />}
        {activeTab === 'tickets' && <BookTickets onPassGenerated={setDigitalPassData} />}
        {activeTab === 'troupe' && <TroupeEntry onPassGenerated={setDigitalPassData} />}
        {activeTab === 'secretariat' && <JoinSecretariat onPassGenerated={setDigitalPassData} />}
        {activeTab === 'sponsor' && <SponsorUs onPassGenerated={setDigitalPassData} />}
        {activeTab === 'about' && <AboutVenue />}
        {activeTab === 'contact' && <ContactUs />}
        {activeTab === 'admin' && <OrganizerPortal onPassGenerated={setDigitalPassData} />}
      </main>

      {/* Footer */}
      <Footer setActiveTab={handleTabChange} />

      {/* Modal for Verifiable Digital Credential / Pass */}
      <DigitalPassModal
        passData={digitalPassData}
        onClose={() => setDigitalPassData(null)}
      />
    </div>
  );
}

export default App;
