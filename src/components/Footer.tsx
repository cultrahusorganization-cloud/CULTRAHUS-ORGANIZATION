import React from 'react';
import { Mail, Phone, MapPin, ShieldCheck, Heart } from 'lucide-react';
import { CultrahusLogo } from './CultrahusLogo';

interface FooterProps {
  setActiveTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab }) => {
  const handleNav = (tab: string) => {
    setActiveTab(tab);
    try {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch {
      // ignore
    }
  };

  return (
    <footer className="bg-[#242c18] text-[#f4efe4] border-t border-[#3e4a2b] pt-14 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-[#3e4a2b]/70">
          {/* Brand Column */}
          <div className="space-y-4">
            <CultrahusLogo size="lg" showText textColor="light" />
            <p className="text-xs text-[#b8c5a8] leading-relaxed pt-2">
              India’s premier confluence of proscenium dramaturgy, collegiate theatre societies, classical choreography, and the national youth cultural parliament.
            </p>
            <div className="pt-2">
              <span className="inline-block px-3 py-1 rounded bg-[#3b4928] text-[#e5d4aa] text-[10px] font-bold uppercase tracking-wider border border-[#52653a]">
                Vision to Realism • 18 Oct 2026
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h3 className="font-serif font-bold text-sm text-[#e5d4aa] uppercase tracking-wider">
              Festival Access
            </h3>
            <ul className="space-y-2 text-xs text-[#c8d4bb]">
              <li>
                <button
                  id="footer-nav-home"
                  onClick={() => handleNav('home')}
                  className="hover:text-white hover:underline transition-colors"
                >
                  Conclave Overview
                </button>
              </li>
              <li>
                <button
                  id="footer-nav-delegate"
                  onClick={() => handleNav('delegate')}
                  className="hover:text-white hover:underline transition-colors"
                >
                  Delegate Accreditation (₹650)
                </button>
              </li>
              <li>
                <button
                  id="footer-nav-tickets"
                  onClick={() => handleNav('tickets')}
                  className="hover:text-white hover:underline transition-colors"
                >
                  Book Auditorium Passes (From ₹200)
                </button>
              </li>
              <li>
                <button
                  id="footer-nav-troupe"
                  onClick={() => handleNav('troupe')}
                  className="hover:text-white hover:underline transition-colors"
                >
                  Troupe &amp; Play Dossier Registration
                </button>
              </li>
              <li>
                <button
                  id="footer-nav-secretariat"
                  onClick={() => handleNav('secretariat')}
                  className="hover:text-white hover:underline transition-colors"
                >
                  Join Official Secretariat
                </button>
              </li>
            </ul>
          </div>

          {/* Partnerships & Information */}
          <div className="space-y-3">
            <h3 className="font-serif font-bold text-sm text-[#e5d4aa] uppercase tracking-wider">
              Partnerships &amp; Venue
            </h3>
            <ul className="space-y-2 text-xs text-[#c8d4bb]">
              <li>
                <button
                  id="footer-nav-sponsor"
                  onClick={() => handleNav('sponsor')}
                  className="hover:text-white hover:underline transition-colors"
                >
                  Sponsor Packages (From ₹25,000)
                </button>
              </li>
              <li>
                <button
                  id="footer-nav-about"
                  onClick={() => handleNav('about')}
                  className="hover:text-white hover:underline transition-colors"
                >
                  Cultural Manifesto &amp; Venue
                </button>
              </li>
              <li>
                <button
                  id="footer-nav-contact"
                  onClick={() => handleNav('contact')}
                  className="hover:text-white hover:underline transition-colors"
                >
                  Secretariat Helpdesk &amp; Inquiries
                </button>
              </li>
              <li>
                <button
                  id="footer-nav-admin"
                  onClick={() => handleNav('admin')}
                  className="inline-flex items-center gap-1.5 text-[#e5d4aa] hover:underline font-bold transition-colors"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Admin Registration Portal</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Official Secretariat Communications Desk */}
          <div className="space-y-3">
            <h3 className="font-serif font-bold text-sm text-[#e5d4aa] uppercase tracking-wider">
              Secretariat Desk
            </h3>
            <div className="space-y-2.5 text-xs text-[#c8d4bb]">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#e5d4aa] shrink-0 mt-0.5" />
                <span>Vedanta Farms, Bhiwadi, Rajasthan (NCR), India</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#e5d4aa] shrink-0" />
                <a
                  href="mailto:cultrahusorganization@gmail.com"
                  className="hover:text-white hover:underline"
                >
                  cultrahusorganization@gmail.com
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#e5d4aa] shrink-0" />
                <a href="tel:+919818561227" className="hover:text-white hover:underline">
                  +91 98185 61227
                </a>
              </div>
              <div className="pt-2 text-[11px] text-[#8e9f73]">
                Festival Date: Sunday, 18 October 2026
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#8e9f73]">
          <p>© 2026 Cultrahus Organisation. All rights reserved. Cultrahus Sangam 2026.</p>
          <div className="flex items-center gap-1">
            <span>Crafted for Indian Performing Arts &amp; Dramaturgy</span>
            <Heart className="w-3 h-3 text-[#c4a159] fill-current" />
          </div>
        </div>
      </div>
    </footer>
  );
};
