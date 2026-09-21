import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Calendar, 
  MapPin, 
  Award, 
  Ticket, 
  ChevronDown, 
  ChevronUp, 
  Users, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { 
  FESTIVAL_PILLARS, 
  FESTIVAL_FAQS 
} from '../data/sangamData';

interface OverviewProps {
  setActiveTab: (tab: string) => void;
}

export const Overview: React.FC<OverviewProps> = ({ setActiveTab }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [openFaq, setOpenFaq] = useState<string>('faq-1');

  useEffect(() => {
    const target = new Date('2026-10-18T16:00:00+05:30').getTime();

    const updateTimer = () => {
      const now = new Date().getTime();
      const diff = target - now;

      if (diff > 0) {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((diff % (1000 * 60)) / 1000),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleNav = (tab: string) => {
    setActiveTab(tab);
    try {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch {
      // ignore
    }
  };

  return (
    <div className="space-y-16 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#f7f3ea] via-[#ede4d2] to-[#f6f1e8] text-[#242c18] py-16 sm:py-24 border-b border-[#cfc4ad]">
        <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#4d5f35_1px,transparent_1px)] [background-size:24px_24px]" />
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-[#d8cfbe]/30 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-[#cad5bc]/25 blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-8 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#ebf0e2] border border-[#b8cbb0] text-[#364426] text-xs font-semibold mb-6 shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-[#5b6e41]" />
                <span>National Theatre Conclave &amp; Cultural Parliament 2026</span>
              </div>

              <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-[#222b17] leading-tight">
                Cultrahus <span className="text-[#4b5d36]">Sangam</span> 2026
              </h1>

              <p className="mt-5 text-lg sm:text-xl text-[#536243] font-normal leading-relaxed max-w-2xl">
                India’s premier confluence of proscenium dramaturgy, street theatre, classical choreography, indie folk fusion, and the national youth cultural parliament.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3.5 text-sm font-medium text-[#242c18]">
                <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/90 backdrop-blur-sm border border-[#cfc4ad] shadow-sm">
                  <Calendar className="w-4 h-4 text-[#4b5d36]" />
                  <span>Sunday, 18 October 2026</span>
                </div>
                <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/90 backdrop-blur-sm border border-[#cfc4ad] shadow-sm">
                  <MapPin className="w-4 h-4 text-[#4b5d36]" />
                  <span className="font-semibold text-[#242c18]">Vedanta Farms, Bhiwadi</span>
                </div>
              </div>

              <div className="mt-10 flex flex-wrap items-center gap-4">
                <button
                  id="hero-delegate-btn"
                  onClick={() => handleNav('delegate')}
                  className="px-6 py-3.5 rounded-xl text-sm font-bold bg-[#3b4928] hover:bg-[#485932] text-[#f7f4ec] font-sans shadow-lg shadow-black/10 transition-all transform hover:-translate-y-0.5 flex items-center gap-2"
                >
                  <Award className="w-4 h-4 text-[#e5d4aa]" />
                  <span>Accredited Delegate (₹650)</span>
                </button>

                <button
                  id="hero-tickets-btn"
                  onClick={() => handleNav('tickets')}
                  className="px-6 py-3.5 rounded-xl text-sm font-bold bg-[#ede4d2] hover:bg-[#e2d6bf] text-[#242c18] border border-[#c5b9a1] transition-all flex items-center gap-2 shadow-sm"
                >
                  <Ticket className="w-4 h-4 text-[#3b4928]" />
                  <span>Book Passes (From ₹200)</span>
                </button>
              </div>
            </div>

            {/* Right Countdown Column */}
            <div className="lg:col-span-4">
              <div className="p-6 sm:p-7 rounded-3xl bg-[#ede4d2] border-2 border-[#cfc4ad] shadow-xl text-center">
                <span className="text-[11px] uppercase tracking-widest font-extrabold text-[#5b6e41] block mb-1">
                  Conclave Countdown
                </span>
                <h3 className="font-serif font-bold text-xl text-[#242c18] mb-4">
                  18 October 2026
                </h3>

                <div className="grid grid-cols-4 gap-2 text-center">
                  <div className="bg-white rounded-xl p-3 border border-[#cfc4ad] shadow-xs">
                    <span className="font-serif font-extrabold text-2xl sm:text-3xl text-[#242c18] block">
                      {timeLeft.days}
                    </span>
                    <span className="text-[9px] uppercase tracking-wider text-[#738260] font-bold">
                      Days
                    </span>
                  </div>

                  <div className="bg-white rounded-xl p-3 border border-[#cfc4ad] shadow-xs">
                    <span className="font-serif font-extrabold text-2xl sm:text-3xl text-[#242c18] block">
                      {timeLeft.hours}
                    </span>
                    <span className="text-[9px] uppercase tracking-wider text-[#738260] font-bold">
                      Hours
                    </span>
                  </div>

                  <div className="bg-white rounded-xl p-3 border border-[#cfc4ad] shadow-xs">
                    <span className="font-serif font-extrabold text-2xl sm:text-3xl text-[#242c18] block">
                      {timeLeft.minutes}
                    </span>
                    <span className="text-[9px] uppercase tracking-wider text-[#738260] font-bold">
                      Mins
                    </span>
                  </div>

                  <div className="bg-white rounded-xl p-3 border border-[#cfc4ad] shadow-xs">
                    <span className="font-serif font-extrabold text-2xl sm:text-3xl text-[#4b5d36] block">
                      {timeLeft.seconds}
                    </span>
                    <span className="text-[9px] uppercase tracking-wider text-[#738260] font-bold">
                      Secs
                    </span>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-[#dfd7c3] text-xs text-[#556345] space-y-1 text-left">
                  <div className="flex items-center gap-1.5 font-medium text-[#242c18]">
                    <Users className="w-3.5 h-3.5 text-[#5b6e41]" />
                    <span>National Cultural Gathering</span>
                  </div>
                  <p className="text-[11px] text-[#71825e]">
                    Over 1,200 delegates, university theatre societies, and classical artists.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5 Festival Pillars */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-widest text-[#5b6e41] font-extrabold block mb-2">
            Five Grand Pillars
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#242c18]">
            The Sangam Experience
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#556345]">
            From introspective proscenium stages to heart-pumping Dandiya circles and electronic folk fusion.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FESTIVAL_PILLARS.map((pillar, idx) => (
            <div
              key={idx}
              className={`rounded-2xl p-6 border transition-all duration-200 hover:shadow-md ${pillar.color}`}
            >
              <div className="inline-block px-2.5 py-1 rounded-full bg-white/80 border border-black/10 text-[10px] font-bold uppercase tracking-wider text-[#242c18] mb-3">
                {pillar.badge}
              </div>
              <h3 className="font-serif font-bold text-xl text-[#242c18] mb-1">
                {pillar.title}
              </h3>
              <p className="text-xs font-semibold text-[#5b6e41] mb-3">
                {pillar.tagline}
              </p>
              <p className="text-xs text-[#445037] leading-relaxed">
                {pillar.description}
              </p>
            </div>
          ))}

          {/* 6th Interactive Promo Card */}
          <div className="rounded-2xl p-6 border border-[#cfc4ad] bg-[#ede4d2] flex flex-col justify-between">
            <div>
              <div className="inline-block px-2.5 py-1 rounded-full bg-white text-[10px] font-bold uppercase tracking-wider text-[#3b4928] mb-3 border border-[#c4b9a1]">
                Youth Parliament
              </div>
              <h3 className="font-serif font-bold text-xl text-[#242c18] mb-1">
                Cultural Senate &amp; Policy
              </h3>
              <p className="text-xs font-semibold text-[#5b6e41] mb-3">
                Deliberations on National Performing Arts Policy
              </p>
              <p className="text-xs text-[#445037] leading-relaxed">
                Ratifying the 2026 National Youth Performing Arts Charter with accredited delegate voting rights.
              </p>
            </div>

            <button
              id="pillars-delegate-btn"
              onClick={() => handleNav('delegate')}
              className="mt-5 w-full py-2.5 rounded-xl bg-[#3b4928] hover:bg-[#485932] text-[#f7f4ec] text-xs font-bold transition flex items-center justify-center gap-1.5"
            >
              <span>Accredit as Delegate</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs uppercase tracking-widest text-[#5b6e41] font-extrabold block mb-2">
            Conclave Helpdesk
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#242c18]">
            Frequently Asked Questions
          </h2>
          <p className="mt-2 text-sm text-[#556345]">
            Essential details regarding accreditation, ticket tiers, venue protocols, and troupes.
          </p>
        </div>

        <div className="space-y-3">
          {FESTIVAL_FAQS.map((faq) => {
            const isOpen = openFaq === faq.id;
            return (
              <div
                key={faq.id}
                className="rounded-2xl border border-[#cfc4ad] bg-[#faf8f5] overflow-hidden transition-all shadow-2xs"
              >
                <button
                  id={`faq-toggle-${faq.id}`}
                  onClick={() => setOpenFaq(isOpen ? '' : faq.id)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 focus:outline-none"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="px-2 py-0.5 rounded bg-[#ebf0e2] text-[#344222] font-semibold text-[10px] uppercase border border-[#c3d3b4]">
                      {faq.category}
                    </span>
                    <span className="font-serif font-bold text-sm sm:text-base text-[#242c18]">
                      {faq.question}
                    </span>
                  </div>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-[#5b6e41] shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[#5b6e41] shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-[#445037] leading-relaxed border-t border-[#dfd7c3]">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#242c18] text-[#f4efe4] rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden border border-[#3e4a2b] shadow-xl">
          <div className="max-w-2xl mx-auto relative z-10 space-y-4">
            <span className="text-xs uppercase tracking-widest text-[#e5d4aa] font-bold block">
              Join the National Theatre Conclave
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-white">
              Be Part of India's Great Stage Confluence
            </h2>
            <p className="text-xs sm:text-sm text-[#b8c5a8] leading-relaxed">
              Whether you are an individual delegate, collegiate theatre troupe, or cultural enthusiast, secure your official registration code today.
            </p>
            <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
              <button
                id="bottom-delegate-btn"
                onClick={() => handleNav('delegate')}
                className="px-6 py-3 rounded-xl bg-[#e5d4aa] text-[#242c18] font-bold text-xs hover:bg-[#d8c392] transition shadow-sm"
              >
                Accreditation (₹650)
              </button>
              <button
                id="bottom-tickets-btn"
                onClick={() => handleNav('tickets')}
                className="px-6 py-3 rounded-xl bg-[#3b4928] text-[#f7f4ec] font-bold text-xs hover:bg-[#485932] border border-[#5b6e41] transition"
              >
                Book Passes (From ₹200)
              </button>
              <button
                id="bottom-admin-btn"
                onClick={() => handleNav('admin')}
                className="px-6 py-3 rounded-xl bg-white/10 text-white font-bold text-xs hover:bg-white/20 transition flex items-center gap-1.5"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#e5d4aa]" />
                <span>Admin Portal</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
