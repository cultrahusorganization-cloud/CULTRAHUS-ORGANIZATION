import React, { useState } from 'react';
import { 
  MapPin, 
  Compass, 
  ShieldCheck, 
  Calendar, 
  Clock, 
  Navigation, 
  Car, 
  Train, 
  CheckCircle2,
  Sparkles,
  Music,
  Flame,
  Volume2
} from 'lucide-react';
import { CultrahusLogo } from './CultrahusLogo';

export const AboutVenue: React.FC = () => {
  const [activeZone, setActiveZone] = useState<string>('dj');

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto flex flex-col items-center">
        <CultrahusLogo size="md" className="mb-3" />
        <span className="text-xs uppercase tracking-widest text-[#5b6e41] font-extrabold block mb-2">
          Official Venue &amp; Campus Guide
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-[#242c18] leading-tight">
          Gurgaon University Campus
        </h1>
        <p className="mt-3 text-[#556345] text-sm sm:text-base leading-relaxed">
          The mega convergence of <strong className="text-[#242c18]">Garba Night</strong> &amp; <strong className="text-[#242c18]">Celebrity DJ Night</strong> is happening exclusively on <strong className="text-[#242c18]">Sunday, 18 October 2026</strong> at the open-air campus grounds of Gurgaon University, Gurugram.
        </p>
      </div>

      {/* Key Venue Highlights Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl bg-[#faf7f0] border-2 border-[#cfc4ad] shadow-sm hover:border-[#b88a24] transition-all flex flex-col">
          <div className="w-12 h-12 rounded-2xl bg-[#ebf0e2] text-[#3b4928] flex items-center justify-center mb-4">
            <MapPin className="w-6 h-6" />
          </div>
          <h2 className="font-serif font-bold text-lg text-[#242c18] mb-1">
            Gurgaon University
          </h2>
          <p className="text-xs text-[#556345] leading-relaxed mb-4 flex-1">
            Sector 51, Gurugram, Haryana 122003. Centrally located in NCR with wide campus access and extensive parking spaces.
          </p>
          <div className="text-[11px] font-semibold text-[#4a5e33] flex items-center gap-1.5 pt-2 border-t border-[#dfd7c3]">
            <Compass className="w-3.5 h-3.5" />
            <span>Sector 51 Main Campus Gate</span>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-[#faf7f0] border-2 border-[#cfc4ad] shadow-sm hover:border-[#b88a24] transition-all flex flex-col">
          <div className="w-12 h-12 rounded-2xl bg-[#fbf2da] text-[#b88a24] flex items-center justify-center mb-4">
            <Calendar className="w-6 h-6" />
          </div>
          <h2 className="font-serif font-bold text-lg text-[#242c18] mb-1">
            Sunday, 18 October 2026
          </h2>
          <p className="text-xs text-[#556345] leading-relaxed mb-4 flex-1">
            Single-day festival extravaganza featuring Grand Garba &amp; Dandiya Raas and Celebrity DJ Night at Gurgaon University.
          </p>
          <div className="text-[11px] font-semibold text-[#b88a24] flex items-center gap-1.5 pt-2 border-t border-[#dfd7c3]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Garba &amp; DJ Night</span>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-[#faf7f0] border-2 border-[#cfc4ad] shadow-sm hover:border-[#b88a24] transition-all flex flex-col">
          <div className="w-12 h-12 rounded-2xl bg-[#253319] text-[#dfb752] flex items-center justify-center mb-4">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="font-serif font-bold text-lg text-[#242c18] mb-1">
            Letter Code Verification
          </h2>
          <p className="text-xs text-[#556345] leading-relaxed mb-4 flex-1">
            Fast-track gate check-in using your unique letter pass code (e.g. SNGM-TKT-XXXXX). No QR code required. Instant RFID wristband allocation upon entry.
          </p>
          <div className="text-[11px] font-semibold text-[#3b4928] flex items-center gap-1.5 pt-2 border-t border-[#dfd7c3]">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Single (₹250) &amp; Couple (₹400) Passes</span>
          </div>
        </div>
      </div>

      {/* Interactive Animated Arena Floor Plan (NO PHOTOS) */}
      <div className="bg-[#1b2413] rounded-3xl p-6 sm:p-10 border-2 border-[#c99e3a]/40 shadow-xl text-[#f7f4ec] relative overflow-hidden">
        {/* Ambient Glows */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#c99e3a]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#475e31]/20 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#dfb752] mb-1">
              <Sparkles className="w-4 h-4" />
              <span>Interactive Campus Layout</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#fdfbf7]">
              Festival Arenas at Gurgaon University
            </h2>
            <p className="text-xs sm:text-sm text-[#b2c39e] mt-1">
              Click any arena to see features, stage facilities, and arena details.
            </p>
          </div>

          {/* Zone Selector Buttons */}
          <div className="flex items-center gap-2 p-1.5 bg-[#253319] border border-[#43552d] rounded-2xl">
            <button
              onClick={() => setActiveZone('garba')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeZone === 'garba'
                  ? 'bg-[#c99e3a] text-[#1b2413] shadow-md'
                  : 'text-[#d7e5c5] hover:text-white'
              }`}
            >
              Garba Raas Arena
            </button>
            <button
              onClick={() => setActiveZone('dj')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeZone === 'dj'
                  ? 'bg-[#c99e3a] text-[#1b2413] shadow-md'
                  : 'text-[#d7e5c5] hover:text-white'
              }`}
            >
              DJ Concert Stage
            </button>
            <button
              onClick={() => setActiveZone('gates')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeZone === 'gates'
                  ? 'bg-[#c99e3a] text-[#1b2413] shadow-md'
                  : 'text-[#d7e5c5] hover:text-white'
              }`}
            >
              Entry &amp; Food Courtyard
            </button>
          </div>
        </div>

        {/* Dynamic Interactive Arena Display */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#253319]/70 rounded-2xl p-6 sm:p-8 border border-[#3f522b]">
          {/* Animated Vector Schematic */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center p-6 bg-[#161f0f] rounded-2xl border border-[#334423] relative min-h-[280px]">
            {activeZone === 'dj' && (
              <div className="flex flex-col items-center text-center space-y-4">
                {/* Animated DJ Graphic */}
                <div className="relative w-36 h-36 flex items-center justify-center">
                  {/* Rotating Vinyl Record */}
                  <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-[#111] via-[#222] to-[#111] border-4 border-[#333] shadow-2xl flex items-center justify-center animate-spin-slow">
                    <div className="w-12 h-12 rounded-full bg-[#c99e3a] border-2 border-white flex items-center justify-center">
                      <Volume2 className="w-5 h-5 text-[#1b2413]" />
                    </div>
                  </div>
                  {/* Glowing Laser Sweep */}
                  <div className="absolute top-0 right-0 w-24 h-1 bg-gradient-to-r from-transparent via-[#dfb752] to-transparent animate-laser transform origin-left" />
                </div>
                {/* Animated Equalizer Waveform */}
                <div className="flex items-end gap-1.5 h-10">
                  <div className="w-2.5 bg-[#dfb752] rounded-t animate-eq-1" />
                  <div className="w-2.5 bg-[#c99e3a] rounded-t animate-eq-2" />
                  <div className="w-2.5 bg-[#dfb752] rounded-t animate-eq-3" />
                  <div className="w-2.5 bg-[#789c4a] rounded-t animate-eq-4" />
                  <div className="w-2.5 bg-[#c99e3a] rounded-t animate-eq-1" />
                  <div className="w-2.5 bg-[#dfb752] rounded-t animate-eq-3" />
                </div>
                <span className="text-[11px] font-mono uppercase tracking-widest text-[#dfb752]">
                  Central Concert Amphitheatre
                </span>
              </div>
            )}

            {activeZone === 'garba' && (
              <div className="flex flex-col items-center text-center space-y-4">
                {/* Animated Dandiya Clash Graphic */}
                <div className="relative w-36 h-36 flex items-center justify-center">
                  <div className="w-28 h-28 rounded-full border-2 border-dashed border-[#c99e3a]/60 animate-spin-slow flex items-center justify-center">
                    <div className="w-20 h-20 rounded-full border border-[#dfb752]/40 animate-spin-reverse" />
                  </div>
                  {/* Clashing Dandiya Sticks */}
                  <div className="absolute w-2 h-20 bg-gradient-to-b from-[#dfb752] via-[#c99e3a] to-[#705315] rounded-full animate-dandiya-left shadow-lg" />
                  <div className="absolute w-2 h-20 bg-gradient-to-b from-[#dfb752] via-[#c99e3a] to-[#705315] rounded-full animate-dandiya-right shadow-lg" />
                  {/* Spark Center */}
                  <div className="w-3 h-3 rounded-full bg-white shadow-[0_0_12px_#dfb752] animate-ping" />
                </div>
                <span className="text-[11px] font-mono uppercase tracking-widest text-[#dfb752]">
                  Open-Air Raas Promenade
                </span>
              </div>
            )}

            {activeZone === 'gates' && (
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="w-20 h-20 rounded-3xl bg-[#334423] border-2 border-[#dfb752] flex items-center justify-center shadow-lg">
                  <ShieldCheck className="w-10 h-10 text-[#dfb752]" />
                </div>
                <div className="font-mono text-xs text-[#d7e5c5] bg-[#1b2413] px-3 py-1.5 rounded-lg border border-[#43552d]">
                  RAPID CHECK-IN • GATE 1
                </div>
                <p className="text-[11px] text-[#9eb586] max-w-xs">
                  Letter security code validation, wristband issue counter &amp; refreshments.
                </p>
              </div>
            )}
          </div>

          {/* Zone Details */}
          <div className="lg:col-span-6 space-y-4 text-xs">
            {activeZone === 'dj' && (
              <>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1b2413] text-[#dfb752] font-mono text-[11px] border border-[#dfb752]/30">
                  <Music className="w-3.5 h-3.5" />
                  <span>CELEBRITY DJ CONCERT STAGE</span>
                </div>
                <h3 className="font-serif text-2xl font-bold text-white">
                  Celebrity DJ Night Concert Stage
                </h3>
                <p className="text-[#c1d1b0] leading-relaxed">
                  Located at the main Gurgaon University amphitheatre. Equipped with concert-grade JBL line arrays, bass subwoofers, dynamic moving head lighting, and multi-beam lasers. Headlined by celebrity guest DJ spinning nonstop party anthems.
                </p>
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="p-3 bg-[#1c2712] rounded-xl border border-[#3b4d24]">
                    <span className="block text-[#dfb752] font-bold">Bass Sound System</span>
                    <span className="text-[11px] text-[#9eb586]">Subwoofer Line Array</span>
                  </div>
                  <div className="p-3 bg-[#1c2712] rounded-xl border border-[#3b4d24]">
                    <span className="block text-[#dfb752] font-bold">Concert Visuals</span>
                    <span className="text-[11px] text-[#9eb586]">Lasers &amp; Stage Projections</span>
                  </div>
                </div>
              </>
            )}

            {activeZone === 'garba' && (
              <>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1b2413] text-[#dfb752] font-mono text-[11px] border border-[#dfb752]/30">
                  <Flame className="w-3.5 h-3.5" />
                  <span>GRAND GARBA &amp; DANDIYA ARENA</span>
                </div>
                <h3 className="font-serif text-2xl font-bold text-white">
                  Grand Garba &amp; Dandiya Raas Arena
                </h3>
                <p className="text-[#c1d1b0] leading-relaxed">
                  Spacious open lawn illuminated with warm festival fairy lights and traditional dholak percussion risers. Featuring multi-circle Dandiya Raas choreography, live folk singing, and complimentary Dandiya sticks provided with passes.
                </p>
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="p-3 bg-[#1c2712] rounded-xl border border-[#3b4d24]">
                    <span className="block text-[#dfb752] font-bold">Live Dhol Troupes</span>
                    <span className="text-[11px] text-[#9eb586]">Authentic Gujarati Beats</span>
                  </div>
                  <div className="p-3 bg-[#1c2712] rounded-xl border border-[#3b4d24]">
                    <span className="block text-[#dfb752] font-bold">Dandiya Sticks</span>
                    <span className="text-[11px] text-[#9eb586]">Complimentary at Entry</span>
                  </div>
                </div>
              </>
            )}

            {activeZone === 'gates' && (
              <>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1b2413] text-[#dfb752] font-mono text-[11px] border border-[#dfb752]/30">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>MAIN ENTRY &amp; FOOD COURTYARD</span>
                </div>
                <h3 className="font-serif text-2xl font-bold text-white">
                  Security Check-In &amp; Food Street
                </h3>
                <p className="text-[#c1d1b0] leading-relaxed">
                  Entry through Main Gate 1 of Gurgaon University. Show your Unique Letter Pass Code (e.g. SNGM-TKT-XXXXX) for instant validation. Enjoy delicious food stalls featuring street chaat, rolls, soft drinks, mocktails, and sweet treats throughout the evening.
                </p>
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="p-3 bg-[#1c2712] rounded-xl border border-[#3b4d24]">
                    <span className="block text-[#dfb752] font-bold">RFID Wristbands</span>
                    <span className="text-[11px] text-[#9eb586]">Fast-Track Gate 1</span>
                  </div>
                  <div className="p-3 bg-[#1c2712] rounded-xl border border-[#3b4d24]">
                    <span className="block text-[#dfb752] font-bold">Food Courtyard</span>
                    <span className="text-[11px] text-[#9eb586]">Chaat, Mocktails &amp; Snacks</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Transit & Commute Information */}
      <div className="bg-[#faf8f5] border-2 border-[#cfc4ad] rounded-3xl p-6 sm:p-10 shadow-sm space-y-6">
        <div>
          <h2 className="font-serif font-bold text-2xl text-[#242c18] mb-1">
            How to Reach Gurgaon University
          </h2>
          <p className="text-xs sm:text-sm text-[#556345]">
            Convenient transit options from Gurgaon, Delhi, Noida, and Faridabad.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 rounded-2xl bg-white border border-[#dfd7c3] space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-[#242c18]">
              <Train className="w-4 h-4 text-[#5b6e41]" />
              <span>By Metro / Rapid Metro</span>
            </div>
            <p className="text-xs text-[#556345] leading-relaxed">
              Nearest Yellow Line station is <strong>Millennium City Centre (HUDA City Centre)</strong>. Rapid Metro stations at <strong>Sector 54/55 Chowk</strong> are approximately 10 minutes by auto or cab.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-[#dfd7c3] space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-[#242c18]">
              <Car className="w-4 h-4 text-[#5b6e41]" />
              <span>By Cab &amp; Ride-Hail</span>
            </div>
            <p className="text-xs text-[#556345] leading-relaxed">
              Search for "Gurgaon University, Sector 51" on Uber or Ola. Dedicated drop-off and pick-up zones are designated right outside Main Gate 1.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-[#dfd7c3] space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-[#242c18]">
              <Navigation className="w-4 h-4 text-[#5b6e41]" />
              <span>Self-Drive &amp; Parking</span>
            </div>
            <p className="text-xs text-[#556345] leading-relaxed">
              Ample designated 2-wheeler and 4-wheeler parking space is available inside and adjacent to the campus perimeter with security guards on duty.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
