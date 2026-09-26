import React, { useState } from 'react';
import { 
  MapPin, 
  Compass, 
  ShieldCheck, 
  Users, 
  Sparkles, 
  Info,
  Calendar,
  Layers,
  Image as ImageIcon
} from 'lucide-react';
import { CultrahusLogo } from './CultrahusLogo';
import { GALLERY_ITEMS } from '../data/sangamData';

export const AboutVenue: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = ['All', 'Theatre', 'Street Play', 'Dance', 'Music', 'Dandiya & Finale'];

  const filteredGallery = activeCategory === 'All'
    ? GALLERY_ITEMS
    : GALLERY_ITEMS.filter(item => item.category === activeCategory);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto flex flex-col items-center">
        <CultrahusLogo size="md" className="mb-3" />
        <span className="text-xs uppercase tracking-widest text-[#5b6e41] font-extrabold block mb-2">
          Cultural Manifesto &amp; Guidelines
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-[#242c18] leading-tight">
          About Cultrahus Sangam
        </h1>
        <p className="mt-3 text-[#556345] text-sm sm:text-base leading-relaxed">
          Founded on the principle of "Vision to Realism", Cultrahus Sangam brings India’s theatre makers, classical practitioners, and youth delegates together to celebrate indigenous aesthetics and dialogue.
        </p>
      </div>

      {/* Manifesto Section */}
      <div className="bg-[#ede4d2] border-2 border-[#cfc4ad] rounded-3xl p-6 sm:p-10 shadow-sm">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="inline-block px-3 py-1 rounded-full bg-[#ebf0e2] text-[#344222] text-xs font-bold uppercase tracking-wider border border-[#b8cbb0]">
            The Sangam Creed
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#242c18]">
            Where Proscenium Art Meets Democratic Voice
          </h2>
          <p className="text-sm text-[#43522f] leading-relaxed">
            The Indian stage has forever been more than entertainment — it is an open assembly, a mirror to society, and a consecrated space for dialogue. Cultrahus Sangam bridges the rich dramaturgy of classical and proscenium theatres with the raw, acoustic pulse of collegiate street plays (Nukkad Natak).
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="bg-white/80 rounded-2xl p-4 border border-[#dfd7c3]">
              <h3 className="font-serif font-bold text-base text-[#242c18] mb-1">
                Rigorous Curation
              </h3>
              <p className="text-xs text-[#556345]">
                Only 16 proscenium productions and 24 street play finalists chosen across the country.
              </p>
            </div>
            <div className="bg-white/80 rounded-2xl p-4 border border-[#dfd7c3]">
              <h3 className="font-serif font-bold text-base text-[#242c18] mb-1">
                Policy Conclave
              </h3>
              <p className="text-xs text-[#556345]">
                Cultural Parliament where delegates debate the National Performing Arts Charter.
              </p>
            </div>
            <div className="bg-white/80 rounded-2xl p-4 border border-[#dfd7c3]">
              <h3 className="font-serif font-bold text-base text-[#242c18] mb-1">
                Inclusive Joy
              </h3>
              <p className="text-xs text-[#556345]">
                Every delegate and ticket holder celebrates together in the Grand Garba and DJ Finale.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Visual Retrospective Gallery */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs uppercase tracking-widest text-[#5b6e41] font-extrabold block mb-1">
              Visual Chronicles
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#242c18]">
              Glimpses of Past Editions
            </h2>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-1.5 bg-[#ede4d2] p-1 rounded-xl border border-[#cfc4ad]">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  activeCategory === cat
                    ? 'bg-[#3b4928] text-[#f7f4ec] shadow-xs'
                    : 'text-[#384626] hover:bg-[#dfd5bf]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredGallery.map((item) => (
            <div
              key={item.id}
              className="group rounded-2xl overflow-hidden bg-[#faf8f5] border border-[#cfc4ad] shadow-xs hover:shadow-md transition-all flex flex-col"
            >
              <div className="relative h-52 overflow-hidden bg-[#e8e2d4]">
                <img
                  src={item.url}
                  alt={item.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold uppercase tracking-wider">
                  {item.category}
                </span>
              </div>
              <div className="p-4 flex-1 flex items-center justify-between">
                <span className="font-serif font-bold text-sm text-[#242c18]">
                  {item.title}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Venue Information & Transit Guide */}
      <div className="bg-[#faf8f5] border-2 border-[#cfc4ad] rounded-3xl p-6 sm:p-10 shadow-sm space-y-8">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="w-6 h-6 text-[#3b4928]" />
            <h2 className="font-serif font-bold text-2xl sm:text-3xl text-[#242c18]">
              Official Venue &amp; Entry Protocol
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#556345]">
            Important location and transit guidelines for all accredited delegates, collegiate troupes, and ticket holders arriving on Sunday, 18 October 2026.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="p-5 rounded-2xl bg-white border border-[#dfd7c3] space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-[#242c18]">
              <Compass className="w-4 h-4 text-[#5b6e41]" />
              <span>Conclave Venue: TBA (To Be Announced)</span>
            </div>
            <p className="text-xs text-[#556345] leading-relaxed">
              Cultrahus Sangam 2026 venue will be announced shortly (<strong>TBA</strong>). The venue is being curated with dedicated proscenium stages, open-air cultural amphitheatres, and delegate dining pavilions.
            </p>
            <div className="pt-1 flex items-center gap-2 text-[11px] text-[#4a5e33] font-medium">
              <span className="px-2 py-0.5 rounded bg-[#ebf0e2] border border-[#c3d3b4]">Venue: TBA</span>
              <span>• Full location coordinates &amp; gate guidelines will be shared soon</span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-[#dfd7c3] space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-[#242c18]">
              <ShieldCheck className="w-4 h-4 text-[#5b6e41]" />
              <span>Security &amp; QR Wristband Check-in</span>
            </div>
            <p className="text-xs text-[#556345] leading-relaxed">
              Upon arrival at the conclave main entrance (Gate 1 for Delegates, Gate 2 for Audience), present your digital credential QR pass for fast scanning and receive your official access wristband.
            </p>
            <div className="pt-1 flex items-center gap-2 text-[11px] text-[#4a5e33] font-medium">
              <span className="px-2 py-0.5 rounded bg-[#ebf0e2] border border-[#c3d3b4]">RFID Wristbands</span>
              <span>• Gates open from 8:30 AM IST</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
