import React, { useState, useEffect } from 'react';
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
  Calendar,
  ChevronRight,
  LayoutDashboard
} from 'lucide-react';
import { CultrahusLogo } from './CultrahusLogo';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  const [dashboardOpen, setDashboardOpen] = useState(false);

  // Close dashboard on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && dashboardOpen) {
        setDashboardOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [dashboardOpen]);

  // Lock body scroll when dashboard is open on small viewports
  useEffect(() => {
    if (dashboardOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [dashboardOpen]);

  const navItems = [
    { 
      id: 'home', 
      label: 'Overview', 
      desc: 'Festival schedule, thematic sessions & conclave vision',
      icon: Sparkles 
    },
    { 
      id: 'delegate', 
      label: 'Delegate Pass', 
      desc: 'Accreditation badges, conclave kit & networking access',
      icon: Award, 
      badge: '₹650' 
    },
    { 
      id: 'tickets', 
      label: 'Book Tickets', 
      desc: 'Auditorium admission, tiered seating & dramatic showcases',
      icon: Ticket, 
      badge: 'Auditorium' 
    },
    { 
      id: 'troupe', 
      label: 'Troupe Entry', 
      desc: 'Theatre group submissions, cast details & play staging',
      icon: Users 
    },
    { 
      id: 'secretariat', 
      label: 'Join Secretariat', 
      desc: 'Organizing committee, volunteer wings & campus ambassadors',
      icon: Briefcase 
    },
    { 
      id: 'sponsor', 
      label: 'Sponsor Us', 
      desc: 'Brand partnerships, patron tiers & cultural branding',
      icon: Handshake, 
      badge: 'Packages' 
    },
    { 
      id: 'about', 
      label: 'About & Venue', 
      desc: 'Vedanta Farms, Bhiwadi facility, stages, gates & heritage',
      icon: MapPin 
    },
    { 
      id: 'contact', 
      label: 'Contact Us', 
      desc: 'Official secretariat helpline, inquiries & support',
      icon: Mail 
    },
  ];

  const handleNav = (tabId: string) => {
    setActiveTab(tabId);
    setDashboardOpen(false);
    try {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch {
      // ignore
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#f6f2e9] border-b border-[#cfc4ad] text-[#242c18] shadow-sm">
      {/* Top Announcement Bar */}
      <div className="bg-[#ede4d2] text-[11px] py-1 px-4 text-center font-semibold tracking-wider text-[#3d4c2a] uppercase border-b border-[#dfd6c3]">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 mx-auto sm:mx-0">
            <Calendar className="w-3 h-3 text-[#788e55]" />
            <span>Sunday, 18 October 2026 • Vedanta Farms, Bhiwadi • Official Conclave Portal</span>
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

      {/* Main Bar with Logo & 3-Line Dashboard Trigger */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between min-h-[4.5rem] py-2.5 gap-3">
          {/* Brand Logo & Title */}
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

          {/* Right: Admin Portal & 3-Line Dashboard Trigger Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Admin Portal Button */}
            <button
              id="header-admin-portal-btn"
              onClick={() => handleNav('admin')}
              title="Admin Portal - Registered Attendees Registry (Password: cultrahus11!!2026)"
              className={`px-3 sm:px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 sm:gap-2 shadow-xs border cursor-pointer ${
                activeTab === 'admin'
                  ? 'bg-[#242c18] text-[#e5d4aa] border-[#181f10] shadow-sm ring-2 ring-[#c4a159]/40'
                  : 'bg-[#ede4d2] hover:bg-[#e1d5bd] text-[#242c18] border-[#c7bca5]'
              }`}
            >
              <ShieldCheck className={`w-4 h-4 shrink-0 ${activeTab === 'admin' ? 'text-[#c4a159]' : 'text-[#3b4928]'}`} />
              <span className="whitespace-nowrap">Admin Portal</span>
            </button>

            {/* The "3 Line Dashboard" Button */}
            <button
              id="dashboard-menu-toggle-btn"
              onClick={() => setDashboardOpen(!dashboardOpen)}
              aria-label="Open 3-Line Conclave Dashboard"
              title="Open Navigation Dashboard"
              className="px-3.5 sm:px-4 py-2 rounded-xl bg-[#3b4928] hover:bg-[#485932] text-[#f7f4ec] font-bold text-xs sm:text-sm transition-all shadow-md flex items-center gap-2.5 cursor-pointer border border-[#2e3b1e] active:scale-95"
            >
              {/* 3 Line Hamburger Icon */}
              <div className="flex flex-col justify-center items-center gap-1 w-4 h-4">
                <span className="block w-4 h-[2px] bg-[#e5d4aa] rounded-full transition-transform" />
                <span className="block w-4 h-[2px] bg-[#e5d4aa] rounded-full transition-transform" />
                <span className="block w-4 h-[2px] bg-[#e5d4aa] rounded-full transition-transform" />
              </div>
              <span className="tracking-wide">Dashboard</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3-LINE DASHBOARD SLIDE-OVER DRAWER & OVERLAY */}
      {dashboardOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop Blur/Dim */}
          <div 
            id="dashboard-backdrop"
            onClick={() => setDashboardOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
          />

          {/* Slide-out Dashboard Panel */}
          <div className="relative w-full max-w-md sm:max-w-lg bg-[#f7f4ec] text-[#242c18] h-full shadow-2xl flex flex-col border-l border-[#cfc4ad] z-10 overflow-hidden animate-in slide-in-from-right duration-250">
            {/* Dashboard Header */}
            <div className="p-5 sm:p-6 bg-[#242c18] text-white flex items-center justify-between border-b border-[#3b4728] shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-[#344222] border border-[#5b6e41] text-[#e5d4aa]">
                  <LayoutDashboard className="w-5 h-5 text-[#c4a159]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-serif font-extrabold text-lg sm:text-xl text-white tracking-wide">
                      Conclave Dashboard
                    </h2>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#3b4928] text-[#e5d4aa] border border-[#52653a]">
                      3-LINE MENU
                    </span>
                  </div>
                  <p className="text-xs text-[#b8c5a8] mt-0.5">
                    Cultrahus Sangam 2026 Navigation &amp; Portals
                  </p>
                </div>
              </div>

              {/* Close Button */}
              <button
                id="close-dashboard-btn"
                onClick={() => setDashboardOpen(false)}
                aria-label="Close Dashboard"
                className="p-2 rounded-xl bg-[#344222] hover:bg-[#44552c] text-[#e5d4aa] hover:text-white transition border border-[#52653a] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Dashboard Body / Items Grid */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-2.5">
              <div className="text-[11px] uppercase tracking-widest text-[#556345] px-2 font-bold flex items-center justify-between">
                <span>Select Section or Service</span>
                <span className="text-[10px] text-[#7a8a68] font-mono">9 Portals</span>
              </div>

              {/* Grid of Navigation Portals */}
              <div className="grid grid-cols-1 gap-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      id={`dashboard-item-${item.id}`}
                      onClick={() => handleNav(item.id)}
                      className={`w-full p-3.5 rounded-2xl text-left transition-all flex items-start gap-3.5 border cursor-pointer group ${
                        isActive
                          ? 'bg-[#3b4928] text-white border-[#242c18] shadow-md'
                          : 'bg-white hover:bg-[#ede4d2]/70 text-[#242c18] border-[#dfd7c3] hover:border-[#c5ba9f]'
                      }`}
                    >
                      <div className={`p-2 rounded-xl shrink-0 transition-colors ${
                        isActive 
                          ? 'bg-[#28331b] text-[#e5d4aa] border border-[#4d5e35]' 
                          : 'bg-[#f4efe4] text-[#4a5e33] border border-[#dfd7c3] group-hover:bg-[#eae1cd]'
                      }`}>
                        <Icon className="w-4 h-4" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className={`font-bold text-sm truncate ${isActive ? 'text-white' : 'text-[#242c18]'}`}>
                            {item.label}
                          </span>
                          {item.badge && (
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase shrink-0 ${
                              isActive
                                ? 'bg-[#e5d4aa] text-[#242c18]'
                                : 'bg-[#ebf0e2] text-[#344222] border border-[#c3d3b4]'
                            }`}>
                              {item.badge}
                            </span>
                          )}
                        </div>
                        <p className={`text-xs mt-0.5 line-clamp-1 ${isActive ? 'text-[#d6dec7]' : 'text-[#617150]'}`}>
                          {item.desc}
                        </p>
                      </div>

                      <ChevronRight className={`w-4 h-4 shrink-0 self-center transition-transform group-hover:translate-x-0.5 ${
                        isActive ? 'text-[#e5d4aa]' : 'text-[#a1b08f]'
                      }`} />
                    </button>
                  );
                })}
              </div>

              {/* Administrative Secretariat Portal Section */}
              <div className="pt-2">
                <div className="text-[11px] uppercase tracking-widest text-[#556345] px-2 pb-2 font-bold">
                  Administrative Control
                </div>
                <button
                  id="dashboard-item-admin"
                  onClick={() => handleNav('admin')}
                  className={`w-full p-4 rounded-2xl text-left transition-all flex items-start gap-3.5 border cursor-pointer group ${
                    activeTab === 'admin'
                      ? 'bg-[#242c18] text-white border-[#52653a] shadow-lg ring-2 ring-[#c4a159]/40'
                      : 'bg-[#2a351d] hover:bg-[#344224] text-white border-[#44552e] shadow-sm'
                  }`}
                >
                  <div className="p-2.5 rounded-xl bg-[#1a2112] text-[#c4a159] border border-[#485930] shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-serif font-bold text-sm text-[#e5d4aa] flex items-center gap-1.5">
                        <span>Admin Portal</span>
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-900/60 text-amber-200 border border-amber-700/60 font-mono">
                          PASSWORD PROTECTED
                        </span>
                      </span>
                    </div>
                    <p className="text-xs text-[#b8c5a8] mt-1">
                      Accreditation dossiers, real-time Firebase registries &amp; live attendee check-in console.
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#c4a159] shrink-0 self-center transition-transform group-hover:translate-x-0.5" />
                </button>
              </div>
            </div>

            {/* Dashboard Drawer Footer */}
            <div className="p-4 bg-[#ede4d2] border-t border-[#dfd7c3] shrink-0 flex items-center justify-between text-xs text-[#556345]">
              <div className="flex items-center gap-1.5 font-medium">
                <Calendar className="w-3.5 h-3.5 text-[#5b6e41]" />
                <span>18 Oct 2026 • Vedanta Farms, Bhiwadi</span>
              </div>
              <button
                onClick={() => setDashboardOpen(false)}
                className="px-3 py-1 rounded-lg bg-[#dfd7c3] hover:bg-[#d0c6af] text-[#242c18] font-bold text-xs transition"
              >
                Close Menu
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

