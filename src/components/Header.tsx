import React, { useState } from 'react';
import { 
  Sparkles, 
  Award, 
  Ticket, 
  Users, 
  Briefcase, 
  Handshake, 
  MapPin, 
  Mail, 
  ShieldCheck, 
  Menu, 
  X,
  Calendar
} from 'lucide-react';
import { CultrahusLogo } from './CultrahusLogo';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Overview', icon: Sparkles },
    { id: 'delegate', label: 'Delegate Pass', icon: Award, badge: '₹650' },
    { id: 'tickets', label: 'Book Tickets', icon: Ticket, badge: 'Auditorium' },
    { id: 'troupe', label: 'Troupe Entry', icon: Users },
    { id: 'secretariat', label: 'Join Secretariat', icon: Briefcase },
    { id: 'sponsor', label: 'Sponsor Us', icon: Handshake, badge: 'Packages' },
    { id: 'about', label: 'About & Venue', icon: MapPin },
    { id: 'contact', label: 'Contact Us', icon: Mail },
  ];

  const handleNav = (tabId: string) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
    try {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch {
      // ignore
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-[#f6f2e9] border-b border-[#cfc4ad] text-[#242c18] shadow-md">
      {/* Top Announcement Bar */}
      <div className="bg-[#ede4d2] text-[11px] py-1 px-4 text-center font-semibold tracking-wider text-[#3d4c2a] uppercase border-b border-[#dfd6c3]">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 mx-auto sm:mx-0">
            <Calendar className="w-3 h-3 text-[#788e55]" />
            <span>Sunday, 18 October 2026 • Venue: TBA • Official Conclave Portal</span>
          </div>
          <button
            id="top-organizer-registry-btn"
            onClick={() => handleNav('admin')}
            className={`hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] lowercase font-mono transition-colors ${
              activeTab === 'admin'
                ? 'bg-[#3b4928] text-[#f7f4ec] font-bold'
                : 'text-[#4a5e33] hover:text-[#192111] hover:underline font-semibold'
            }`}
            title="Organizer Portal & Registration Registry"
          >
            <ShieldCheck className="w-3 h-3" />
            <span>organizer registry</span>
          </button>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between min-h-[4.75rem] py-2.5 gap-3">
          {/* Logo & Title */}
          <button
            id="brand-logo-btn"
            onClick={() => handleNav('home')}
            className="flex items-center gap-2.5 sm:gap-3 text-left group focus:outline-none shrink-0"
          >
            <CultrahusLogo size="sm" />
            <div className="flex flex-col justify-center min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="font-serif text-base sm:text-lg md:text-xl font-bold tracking-wide text-[#242c18] group-hover:text-[#4a5e33] transition-colors whitespace-nowrap">
                  Cultrahus Sangam
                </span>
                <span className="text-[10px] sm:text-[11px] px-1.5 py-0.5 rounded bg-[#ebf0e2] text-[#344222] font-semibold border border-[#c3d3b4] whitespace-nowrap">
                  2026
                </span>
              </div>
              <p className="text-[9.5px] sm:text-[10px] md:text-[11px] text-[#556345] tracking-wider uppercase font-medium whitespace-nowrap overflow-hidden text-ellipsis">
                National Theatre Conclave &amp; Cultural Parliament
              </p>
            </div>
          </button>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center space-x-0.5 xl:space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => handleNav(item.id)}
                  className={`relative px-2 py-1.5 xl:px-3 xl:py-2 rounded-md text-[11px] xl:text-xs font-semibold tracking-wide transition-all duration-150 flex items-center gap-1 xl:gap-1.5 whitespace-nowrap ${
                    isActive
                      ? 'bg-[#3b4928] text-[#f7f4ec] shadow-sm'
                      : 'text-[#384626] hover:text-[#192111] hover:bg-[#eae1cd]'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-[#e5d4aa]' : 'text-[#5d7143]'}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase ${
                        isActive
                          ? 'bg-[#e5d4aa] text-[#242c18]'
                          : 'bg-[#ebf0e2] text-[#344222] border border-[#c3d3b4]'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Desktop Action Buttons */}
          <div className="hidden sm:flex items-center gap-2 shrink-0">
            <button
              id="header-admin-btn"
              onClick={() => handleNav('admin')}
              className={`px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs border ${
                activeTab === 'admin'
                  ? 'bg-[#3b4928] text-[#f7f4ec] border-[#242c18]'
                  : 'bg-[#ede4d2] hover:bg-[#e1d5bd] text-[#242c18] border-[#c7bca5]'
              }`}
              title="Restricted Organizer Registration Registry - View all registered persons"
            >
              <ShieldCheck className={`w-3.5 h-3.5 ${activeTab === 'admin' ? 'text-[#e5d4aa]' : 'text-[#3b4928]'}`} />
              <span>Admin Portal</span>
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="lg:hidden flex items-center">
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Navigation Menu"
              className="p-2 rounded-md text-[#344222] hover:text-[#182010] hover:bg-[#eae1cd] focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#f6f2e9] border-t border-[#cfc4ad] px-4 pt-3 pb-6 space-y-1 shadow-xl">
          <div className="text-[11px] uppercase tracking-widest text-[#556345] px-3 pb-2 font-bold">
            Festival Portals &amp; Information
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`mobile-nav-${item.id}`}
                onClick={() => handleNav(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                  isActive ? 'bg-[#3b4928] text-[#f7f4ec]' : 'text-[#384626] hover:bg-[#eae1cd] hover:text-[#192111]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#e5d4aa]' : 'text-[#5d7143]'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#ebf0e2] text-[#344222] font-bold border border-[#c3d3b4]">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          <div className="pt-3">
            <button
              id="mobile-nav-admin-btn"
              onClick={() => handleNav('admin')}
              className="w-full py-2.5 rounded-lg text-xs font-bold text-[#f7f4ec] bg-[#3b4928] hover:bg-[#485932] border border-[#2e3a1f] flex items-center justify-center gap-2 transition shadow-sm"
            >
              <ShieldCheck className="w-4 h-4 text-[#e5d4aa]" />
              <span>Admin Portal (Registered Attendees Registry)</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
