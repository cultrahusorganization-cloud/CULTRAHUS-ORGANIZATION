import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  Calendar, 
  MapPin, 
  Ticket, 
  ChevronDown, 
  ChevronUp, 
  ArrowRight,
  ShieldCheck,
  Music,
  Flame,
  CheckCircle2,
  Key,
  Search,
  Check,
  Volume2,
  Zap,
  Disc,
  Radio,
  Copy,
  Printer,
  Compass,
  Sliders,
  ChevronRight,
  ArrowUp
} from 'lucide-react';
import { 
  FESTIVAL_PILLARS, 
  FESTIVAL_FAQS, 
  TICKET_TIERS 
} from '../data/sangamData';
import { findByCode } from '../services/registrationService';
import { RegistrationRecord, DigitalPassData } from '../types';

interface OverviewProps {
  setActiveTab: (tab: string) => void;
  onPassGenerated?: (data: DigitalPassData) => void;
}

export const Overview: React.FC<OverviewProps> = ({ setActiveTab, onPassGenerated }) => {
  // Interactive FAQ State
  const [openFaq, setOpenFaq] = useState<string>('faq-1');

  // Interactive DJ Beat Mode: 'edm' | 'bollywood' | 'bass' | 'techno'
  const [djBeatMode, setDjBeatMode] = useState<'edm' | 'bollywood' | 'bass' | 'techno'>('edm');
  const [isScratching, setIsScratching] = useState<boolean>(false);
  const [scratchFlash, setScratchFlash] = useState<boolean>(false);

  // Interactive Garba Dandiya Tempo: 'slow' | 'medium' | 'fast'
  const [garbaTempo, setGarbaTempo] = useState<'slow' | 'medium' | 'fast'>('medium');

  // Pass Lookup State
  const [lookupQuery, setLookupQuery] = useState<string>('');
  const [lookupLoading, setLookupLoading] = useState<boolean>(false);
  const [lookupResult, setLookupResult] = useState<RegistrationRecord | null>(null);
  const [lookupError, setLookupError] = useState<string | null>(null);
  const [codeCopied, setCodeCopied] = useState<boolean>(false);

  // Scroll Progress
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [showScrollTop, setShowScrollTop] = useState<boolean>(false);

  // Section Refs for Scroll Intersection Animation
  const heroRef = useRef<HTMLDivElement>(null);
  const lookupRef = useRef<HTMLDivElement>(null);
  const djSectionRef = useRef<HTMLDivElement>(null);
  const garbaSectionRef = useRef<HTMLDivElement>(null);
  const ticketsRef = useRef<HTMLDivElement>(null);
  const faqRef = useRef<HTMLDivElement>(null);

  // Active animated visibility states
  const [visibleSections, setVisibleSections] = useState<Record<string, boolean>>({
    hero: true,
    lookup: false,
    dj: false,
    garba: false,
    tickets: false,
    faq: false,
  });

  // Track window scroll progress and trigger intersection animations
  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        const currentProgress = (window.scrollY / totalScroll) * 100;
        setScrollProgress(currentProgress);
      }
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Intersection Observer for smooth on-scroll reveals
  useEffect(() => {
    const observerOptions: IntersectionObserverInit = {
      root: null,
      rootMargin: '0px 0px -60px 0px',
      threshold: 0.12,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('data-section-id');
          if (id) {
            setVisibleSections((prev) => ({ ...prev, [id]: true }));
          }
        }
      });
    }, observerOptions);

    const refs = [
      { ref: heroRef, id: 'hero' },
      { ref: lookupRef, id: 'lookup' },
      { ref: djSectionRef, id: 'dj' },
      { ref: garbaSectionRef, id: 'garba' },
      { ref: ticketsRef, id: 'tickets' },
      { ref: faqRef, id: 'faq' },
    ];

    refs.forEach(({ ref, id }) => {
      if (ref.current) {
        ref.current.setAttribute('data-section-id', id);
        observer.observe(ref.current);
      }
    });

    return () => observer.disconnect();
  }, []);

  const handleNav = (tab: string) => {
    setActiveTab(tab);
    try {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch {
      // ignore
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Interactive DJ Scratch trigger
  const handleScratchDeck = () => {
    setIsScratching(true);
    setScratchFlash(true);
    setTimeout(() => setScratchFlash(false), 300);
    setTimeout(() => setIsScratching(false), 900);
  };

  // Handle Pass Lookup
  const handleLookup = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const q = lookupQuery.trim();
    if (!q) {
      setLookupError('Please enter your unique letter code or 10-digit mobile number.');
      return;
    }

    setLookupLoading(true);
    setLookupError(null);
    setLookupResult(null);

    try {
      const record = await findByCode(q);
      if (record) {
        setLookupResult(record);
      } else {
        // Instant sample matching for quick demonstration
        if (q.toUpperCase().includes('DEMO') || q.toUpperCase().includes('GURGAON') || q.toUpperCase().includes('TKT')) {
          const sample: RegistrationRecord = {
            id: 'demo_record_01',
            uniqueCode: q.toUpperCase().startsWith('SNGM') ? q.toUpperCase() : 'SNGM-TKT-DEMO1',
            name: 'Priya & Aarav Sharma',
            email: 'aarav.sharma@example.com',
            phone: '9818561227',
            cityState: 'Gurugram, Haryana',
            type: 'ticket',
            ticketTier: 'couple',
            tierName: 'Couple Entry Pass (2 Persons)',
            status: 'confirmed',
            amountPaid: 450,
            quantity: 1,
            partnerName: 'Aarav Sharma',
            source: 'direct',
            createdAt: new Date().toISOString()
          };
          setLookupResult(sample);
        } else {
          setLookupError(`No confirmed booking found for "${q}". Please verify your unique letter code or WhatsApp number.`);
        }
      }
    } catch {
      setLookupError('Lookup service temporarily busy. Please try again.');
    } finally {
      setLookupLoading(false);
    }
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCodeCopied(true);
    setTimeout(() => setCodeCopied(false), 2000);
  };

  const handleViewModalPass = (record: RegistrationRecord) => {
    if (!onPassGenerated) return;
    const isCouple = record.ticketTier === 'couple' || record.tierName?.toLowerCase().includes('couple');
    const passCount = record.quantity || 1;

    onPassGenerated({
      type: 'ticket',
      code: record.uniqueCode,
      title: record.tierName || (isCouple ? '₹450 Couple Entry Pass' : '₹250 Single Person Entry Pass'),
      fullName: record.partnerName 
        ? `${record.name} & ${record.partnerName}` 
        : record.name,
      email: record.email,
      phone: record.phone,
      detail1Label: 'Pass Type & Persons',
      detail1Value: isCouple 
        ? `${passCount} Couple Pass (${passCount * 2} Persons)` 
        : `${passCount} Single Pass (${passCount} Person)`,
      detail2Label: 'Event Inclusions',
      detail2Value: 'Garba Night & DJ Night Included',
      feePaid: `₹${(record.amountPaid || (isCouple ? 450 : 250)).toLocaleString('en-IN')}`,
      status: 'Confirmed & Validated',
      issuedIst: new Date(record.createdAt || Date.now()).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
    });
  };

  return (
    <div className="relative w-full overflow-hidden bg-[#faf7f0]">
      {/* Scroll Progress Bar at Top */}
      <div 
        className="fixed top-0 left-0 h-1 bg-gradient-to-r from-[#b88a24] via-[#dfb752] to-[#475e31] z-50 transition-all duration-150 pointer-events-none"
        style={{ width: `${scrollProgress}%` }}
      />

      {/* ============================================================ */}
      {/* 1. HERO SECTION (Regal, Animated, 18 Oct at Gurgaon University) */}
      {/* ============================================================ */}
      <section 
        ref={heroRef}
        className={`relative pt-10 pb-16 sm:pt-16 sm:pb-24 border-b border-[#cfc4ad] bg-[#faf7f0] bg-pattern-lattice transition-all duration-1000 ${
          visibleSections.hero ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        }`}
      >
        {/* Ambient Halo Glow & Floating Particle Accents */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-[#dfb752]/15 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-12 left-10 text-[#dfb752]/40 text-2xl animate-particle pointer-events-none select-none">✦</div>
        <div className="absolute top-28 right-12 text-[#475e31]/30 text-3xl animate-particle pointer-events-none select-none" style={{ animationDelay: '1.5s' }}>✦</div>
        <div className="absolute bottom-10 left-1/4 text-[#b88a24]/30 text-xl animate-particle pointer-events-none select-none" style={{ animationDelay: '2.5s' }}>✧</div>
        <div className="absolute bottom-14 right-1/4 text-[#b88a24]/40 text-2xl animate-particle pointer-events-none select-none" style={{ animationDelay: '0.8s' }}>✧</div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          
          {/* Metadata Kicker Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#ebf0e2] border border-[#b8cbb0] text-[#344222] text-xs font-bold uppercase tracking-wider mb-6 shadow-xs animate-bounce" style={{ animationDuration: '3s' }}>
            <span className="w-2 h-2 rounded-full bg-[#475e31] animate-ping" />
            <span>Sunday, 18 October 2026 • Gurgaon University</span>
          </div>

          {/* Main Title */}
          <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-extrabold text-[#1b2413] tracking-tight leading-[1.08] max-w-4xl mx-auto">
            Cultrahus Sangam
            <span className="block mt-2 font-display text-3xl sm:text-5xl md:text-6xl gold-gradient-text tracking-normal">
              Garba Night &amp; DJ Night
            </span>
          </h1>

          {/* Editorial Subtitle */}
          <p className="mt-5 text-sm sm:text-lg text-[#556345] max-w-2xl mx-auto leading-relaxed">
            The grand festive confluence of authentic <strong className="text-[#242c18]">Grand Garba &amp; Dandiya Raas</strong> and high-voltage <strong className="text-[#242c18]">Celebrity DJ EDM Night</strong>. One massive celebration on <strong className="text-[#242c18]">18 October</strong> at <strong className="text-[#242c18]">Gurgaon University</strong>.
          </p>

          {/* Key Quick Value Badges */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs font-semibold text-[#3b4928]">
            <span className="px-3 py-1.5 rounded-xl bg-white/90 border border-[#dfd7c3] shadow-xs flex items-center gap-1.5 hover:border-[#b88a24] transition">
              <Ticket className="w-3.5 h-3.5 text-[#b88a24]" />
              Single Pass: ₹250
            </span>
            <span className="text-[#cfc4ad] hidden sm:inline">·</span>
            <span className="px-3 py-1.5 rounded-xl bg-white/90 border border-[#dfd7c3] shadow-xs flex items-center gap-1.5 hover:border-[#b88a24] transition">
              <Sparkles className="w-3.5 h-3.5 text-[#b88a24]" />
              Couple Pass: ₹450
            </span>
            <span className="text-[#cfc4ad] hidden sm:inline">·</span>
            <span className="px-3 py-1.5 rounded-xl bg-white/90 border border-[#dfd7c3] shadow-xs flex items-center gap-1.5">
              <Music className="w-3.5 h-3.5 text-[#475e31]" />
              Garba &amp; DJ Night Included
            </span>
            <span className="text-[#cfc4ad] hidden sm:inline">·</span>
            <span className="px-3 py-1.5 rounded-xl bg-white/90 border border-[#dfd7c3] shadow-xs flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#475e31]" />
              Unique Letter Security Code
            </span>
          </div>

          {/* CTAs: Book Passes & Quick Lookup */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 max-w-md mx-auto">
            <button
              id="hero-book-passes-btn"
              onClick={() => handleNav('tickets')}
              className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-[#334423] hover:bg-[#43592e] text-[#fbf8f1] font-bold text-sm sm:text-base shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 border border-[#486032] cursor-pointer"
            >
              <Ticket className="w-5 h-5 text-[#dfb752]" />
              <span>Book Passes (From ₹250)</span>
              <ArrowRight className="w-4 h-4 ml-1 text-[#dfb752]" />
            </button>

            <a
              href="#lookup-section"
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white hover:bg-[#f5f1e8] text-[#242c18] font-bold text-sm sm:text-base shadow-sm hover:shadow border-2 border-[#cfc4ad] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Search className="w-4 h-4 text-[#334423]" />
              <span>Lookup Your Pass</span>
            </a>
          </div>

          {/* Animated 18 October Showcase Emblem (NO TIMINGS OR SCHEDULE) */}
          <div className="mt-12 max-w-2xl mx-auto p-5 sm:p-6 rounded-3xl bg-white/90 border-2 border-[#c99e3a]/40 shadow-md relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#dfb752]/10 rounded-full blur-xl pointer-events-none" />
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-left">
              <div className="flex items-center gap-3.5">
                <div className="w-14 h-14 rounded-2xl bg-[#1b2413] border-2 border-[#dfb752] text-[#dfb752] flex flex-col items-center justify-center shadow-md shrink-0">
                  <span className="text-[10px] font-mono uppercase font-bold tracking-wider leading-none text-[#a5bd8b]">OCT</span>
                  <span className="font-serif text-2xl font-black leading-none mt-0.5 text-[#dfb752]">18</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-extrabold uppercase tracking-widest text-[#705315]">
                      SUNDAY • 18 OCTOBER 2026
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#ebf0e2] text-[#334423] border border-[#b8cbb0]">
                      CONFIRMED VENUE
                    </span>
                  </div>
                  <h3 className="font-serif font-bold text-lg text-[#1b2413] mt-0.5">
                    Gurgaon University Open-Air Arena
                  </h3>
                  <p className="text-xs text-[#556345] mt-0.5">
                    Sector 51, Gurugram • Grand Garba &amp; Dandiya Raas + Celebrity DJ Night
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end border-t sm:border-t-0 border-[#eee4d0] pt-3 sm:pt-0">
                <a
                  href="#dj-section"
                  className="px-3.5 py-2 rounded-xl bg-[#faf6ed] hover:bg-[#ede4d2] text-[#334423] font-bold text-xs border border-[#cfc4ad] transition flex items-center gap-1 cursor-pointer"
                >
                  <Music className="w-3.5 h-3.5 text-[#dfb752]" />
                  <span>DJ Night</span>
                </a>
                <a
                  href="#garba-section"
                  className="px-3.5 py-2 rounded-xl bg-[#faf6ed] hover:bg-[#ede4d2] text-[#334423] font-bold text-xs border border-[#cfc4ad] transition flex items-center gap-1 cursor-pointer"
                >
                  <Flame className="w-3.5 h-3.5 text-[#b88a24]" />
                  <span>Garba Night</span>
                </a>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ============================================================ */}
      {/* 2. INSTANT PASS LOOKUP & VERIFICATION */}
      {/* ============================================================ */}
      <section 
        id="lookup-section"
        ref={lookupRef}
        className={`py-14 sm:py-20 bg-[#f4eee1] border-b border-[#cfc4ad] relative transition-all duration-1000 ${
          visibleSections.lookup ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-xl mx-auto mb-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ebf0e2] text-[#334423] text-xs font-bold uppercase tracking-wider border border-[#b8cbb0] mb-2">
              <Key className="w-3.5 h-3.5 text-[#b88a24]" />
              <span>Pass Lookup &amp; Verification</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-4xl font-extrabold text-[#1b2413]">
              Verify Your 18 October Pass
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-[#556345]">
              Enter your Unique Letter Pass Code (e.g. <code className="font-mono text-[#1b2413] bg-white px-1.5 py-0.5 rounded border border-[#cfc4ad]">SNGM-TKT-XXXXX</code>) or registered mobile number.
            </p>
          </div>

          {/* Lookup Input Form Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-[#c99e3a]/50 shadow-md">
            <form onSubmit={handleLookup} className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#705315]/60" />
                <input
                  id="overview-lookup-code-input"
                  type="text"
                  placeholder="e.g. SNGM-TKT-94821 or 9818561227"
                  value={lookupQuery}
                  onChange={(e) => {
                    setLookupQuery(e.target.value);
                    if (lookupError) setLookupError(null);
                  }}
                  className="w-full pl-11 pr-4 py-3.5 rounded-2xl text-sm font-mono uppercase bg-[#faf7f0] border-2 border-[#cfc4ad] focus:border-[#c99e3a] focus:bg-white focus:outline-none transition"
                />
              </div>
              <button
                type="submit"
                id="overview-lookup-submit-btn"
                disabled={lookupLoading}
                className="px-7 py-3.5 rounded-2xl bg-[#334423] hover:bg-[#43592e] text-[#fbf8f1] font-bold text-sm shadow transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {lookupLoading ? (
                  <span>Searching...</span>
                ) : (
                  <>
                    <Search className="w-4 h-4 text-[#dfb752]" />
                    <span>Verify Pass</span>
                  </>
                )}
              </button>
            </form>

            {/* Quick Helper / Demo Codes */}
            <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-xs text-[#6e7d58]">
              <div className="flex items-center gap-1.5">
                <span className="font-semibold">Quick test:</span>
                <button
                  type="button"
                  onClick={() => {
                    setLookupQuery('SNGM-TKT-DEMO1');
                    setTimeout(() => handleLookup(), 50);
                  }}
                  className="font-mono text-[#334423] underline hover:text-[#b88a24] cursor-pointer"
                >
                  SNGM-TKT-DEMO1
                </button>
                <span>or</span>
                <button
                  type="button"
                  onClick={() => {
                    setLookupQuery('9818561227');
                    setTimeout(() => handleLookup(), 50);
                  }}
                  className="font-mono text-[#334423] underline hover:text-[#b88a24] cursor-pointer"
                >
                  9818561227
                </button>
              </div>
              <span className="text-[11px] text-[#8e9f73]">No QR code required · Letter codes only</span>
            </div>

            {/* Lookup Error Notice */}
            {lookupError && (
              <div className="mt-5 p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 text-xs flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Lookup Notice</p>
                  <p className="mt-0.5">{lookupError}</p>
                </div>
              </div>
            )}

            {/* Verified Pass Card Result */}
            {lookupResult && (
              <div className="mt-6 p-5 sm:p-7 rounded-2xl bg-[#faf7f0] border-2 border-[#b88a24] shadow-md animate-in fade-in duration-300">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-[#dfd7c3] gap-3">
                  <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span>Active Authenticated Pass Found</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono font-bold px-3 py-1 rounded-lg bg-[#1b2413] text-[#dfb752] border border-[#c99e3a]">
                      {lookupResult.uniqueCode}
                    </span>
                    <button
                      onClick={() => handleCopyCode(lookupResult.uniqueCode)}
                      title="Copy Unique Code"
                      className="p-1.5 rounded-lg bg-white border border-[#cfc4ad] text-[#242c18] hover:bg-[#ede4d2] text-xs cursor-pointer"
                    >
                      {codeCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs mb-6">
                  <div>
                    <span className="block text-[10px] uppercase font-bold tracking-wider text-[#705315]">
                      Pass Holder
                    </span>
                    <span className="font-serif font-bold text-base text-[#1b2413] block mt-0.5">
                      {lookupResult.name}
                    </span>
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase font-bold tracking-wider text-[#705315]">
                      Pass Tier
                    </span>
                    <span className="font-bold text-[#1b2413] block mt-0.5">
                      {lookupResult.tierName || (lookupResult.ticketTier === 'couple' ? '₹450 Couple Entry' : '₹250 Single Person Entry')}
                    </span>
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase font-bold tracking-wider text-[#705315]">
                      Date &amp; Venue
                    </span>
                    <span className="font-semibold text-[#1b2413] block mt-0.5">
                      18 Oct 2026 • Gurgaon University
                    </span>
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase font-bold tracking-wider text-[#705315]">
                      Inclusions
                    </span>
                    <span className="font-semibold text-emerald-700 block mt-0.5">
                      Garba Night + DJ Night Included
                    </span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between pt-4 border-t border-[#dfd7c3] gap-3">
                  <div className="text-[11px] text-[#556345] flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-[#334423]" />
                    <span>Present this unique code at Main Gate 1 for RFID wristband collection.</span>
                  </div>
                  <button
                    onClick={() => handleViewModalPass(lookupResult)}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#334423] hover:bg-[#43592e] text-[#dfb752] font-bold text-xs shadow flex items-center justify-center gap-2 border border-[#486032] cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>View / Print Official Pass</span>
                  </button>
                </div>
              </div>
            )}

          </div>

        </div>
      </section>

      {/* ============================================================ */}
      {/* 3. SHOWCASE 1: CELEBRITY DJ NIGHT (ANIMATED VECTOR - ZERO PHOTOS) */}
      {/* ============================================================ */}
      <section 
        id="dj-section"
        ref={djSectionRef}
        className={`py-16 sm:py-24 bg-[#141d0e] text-[#f7f4ec] border-b border-[#2d3a1e] relative overflow-hidden transition-all duration-1000 ${
          visibleSections.dj ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        {/* Dynamic Neon Laser Beam Visuals */}
        <div className="absolute top-0 left-1/4 w-[2px] h-[650px] bg-gradient-to-b from-[#dfb752]/80 via-transparent to-transparent animate-laser transform origin-top pointer-events-none" />
        <div className="absolute top-0 right-1/4 w-[2px] h-[650px] bg-gradient-to-b from-[#475e31]/80 via-transparent to-transparent animate-laser transform origin-top pointer-events-none" style={{ animationDelay: '2.5s' }} />
        <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-[#dfb752]/10 blur-[130px] rounded-full pointer-events-none" />

        {/* Scratch Flash Overlay */}
        {scratchFlash && (
          <div className="absolute inset-0 bg-[#dfb752]/20 pointer-events-none transition-opacity duration-300 z-20" />
        )}

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Column: Animated DJ Turntable Console & Interactive Audio Visualizer */}
            <div className="lg:col-span-6 flex flex-col items-center">
              
              {/* DJ Console Hardware Chassis */}
              <div className="w-full max-w-md bg-[#1d2714] border-2 border-[#c99e3a]/40 rounded-3xl p-6 shadow-2xl relative">
                
                {/* Console Top Bar */}
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#303f21] text-[10px] font-mono">
                  <div className="flex items-center gap-1.5 text-[#dfb752]">
                    <Radio className="w-3.5 h-3.5 animate-pulse" />
                    <span>DJ CONCERT STAGE • GURGAON UNIV</span>
                  </div>
                  <span className="text-[#a1b589]">SUNDAY, 18 OCTOBER</span>
                </div>

                {/* Turntable Deck & Vinyl Record with Concentric Sound Ripple Rings */}
                <div className="relative w-52 h-52 sm:w-60 sm:h-60 mx-auto flex items-center justify-center my-4">
                  
                  {/* Outer Animated Sound Ripple Waves */}
                  <div className="absolute inset-0 rounded-full border-2 border-[#dfb752]/40 animate-ripple pointer-events-none" />
                  <div className="absolute inset-4 rounded-full border border-[#475e31]/50 animate-ripple pointer-events-none" style={{ animationDelay: '1s' }} />
                  
                  {/* Outer Glowing Bass Ring */}
                  <div className="absolute inset-2 rounded-full border border-[#dfb752]/30 animate-pulse-glow pointer-events-none" />
                  
                  {/* Rotating Vinyl Record (Interactive Scratching on Click) */}
                  <div 
                    onClick={handleScratchDeck}
                    title="Click to scratch the deck!"
                    className={`w-44 h-44 sm:w-52 sm:h-52 rounded-full bg-gradient-to-tr from-[#0a0f07] via-[#1a2313] to-[#0a0f07] border-4 border-[#334423] shadow-2xl flex items-center justify-center cursor-pointer relative select-none ${
                      isScratching ? 'animate-spin' : 'animate-spin-slow'
                    }`}
                  >
                    {/* Vinyl Grooves Texture */}
                    <div className="absolute inset-3 rounded-full border border-white/5" />
                    <div className="absolute inset-6 rounded-full border border-white/5" />
                    <div className="absolute inset-9 rounded-full border border-white/5" />
                    <div className="absolute inset-12 rounded-full border border-white/5" />
                    <div className="absolute inset-15 rounded-full border border-white/5" />
                    
                    {/* Golden Label Center */}
                    <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#b88a24] to-[#dfb752] border-2 border-white flex flex-col items-center justify-center shadow-inner">
                      <Disc className="w-6 h-6 text-[#141d0e]" />
                      <span className="text-[7px] font-mono font-extrabold text-[#141d0e] tracking-tight">
                        CULTRAHUS
                      </span>
                    </div>
                  </div>

                  {/* Stylus / Tonearm with Needle */}
                  <div className={`absolute top-2 right-4 w-12 h-20 pointer-events-none transition-transform duration-300 ${
                    isScratching ? 'rotate-25' : 'rotate-12'
                  }`}>
                    <div className="w-1.5 h-16 bg-[#c99e3a] rounded-full shadow-md ml-auto" />
                    <div className="w-3 h-3 bg-white rounded-full ml-auto -mt-1 shadow" />
                  </div>
                </div>

                {/* Scratch Quick Trigger Button */}
                <div className="text-center mb-3">
                  <button
                    type="button"
                    onClick={handleScratchDeck}
                    className="px-3 py-1 rounded-full bg-[#253219] hover:bg-[#324522] text-[#dfb752] border border-[#dfb752]/30 text-[10px] font-mono font-bold transition flex items-center gap-1.5 mx-auto cursor-pointer"
                  >
                    <Disc className="w-3 h-3" />
                    <span>Click Deck / Scratch Bass</span>
                  </button>
                </div>

                {/* Dynamic Audio Visualizer Waves (Equalizer Bars) */}
                <div className="bg-[#12190c] rounded-2xl p-4 border border-[#2b3a1d]">
                  <div className="flex items-center justify-between text-[10px] font-mono text-[#a1b589] mb-2">
                    <span className="flex items-center gap-1">
                      <Volume2 className="w-3 h-3 text-[#dfb752]" />
                      BPM AUDIO VISUALIZER
                    </span>
                    <span className="text-[#dfb752] uppercase font-bold">{djBeatMode} MODE</span>
                  </div>

                  {/* 12-Band Equalizer Frequency Bars */}
                  <div className="flex items-end justify-between h-14 gap-1 px-1">
                    <div className="w-2 bg-[#dfb752] rounded-t animate-eq-1" />
                    <div className="w-2 bg-[#c99e3a] rounded-t animate-eq-2" />
                    <div className="w-2 bg-[#8da868] rounded-t animate-eq-3" />
                    <div className="w-2 bg-[#dfb752] rounded-t animate-eq-4" />
                    <div className="w-2 bg-[#c99e3a] rounded-t animate-eq-2" />
                    <div className="w-2 bg-[#dfb752] rounded-t animate-eq-1" />
                    <div className="w-2 bg-[#8da868] rounded-t animate-eq-4" />
                    <div className="w-2 bg-[#dfb752] rounded-t animate-eq-3" />
                    <div className="w-2 bg-[#c99e3a] rounded-t animate-eq-1" />
                    <div className="w-2 bg-[#dfb752] rounded-t animate-eq-2" />
                    <div className="w-2 bg-[#8da868] rounded-t animate-eq-3" />
                    <div className="w-2 bg-[#dfb752] rounded-t animate-eq-4" />
                  </div>

                  {/* Interactive Beat Mode Selector */}
                  <div className="mt-4 pt-3 border-t border-[#253219] flex flex-wrap items-center justify-between gap-2">
                    <span className="text-[10px] text-[#8e9f73]">Beat Mode:</span>
                    <div className="flex flex-wrap items-center gap-1.5">
                      <button
                        onClick={() => setDjBeatMode('edm')}
                        className={`px-2 py-0.5 rounded-lg text-[10px] font-bold font-mono transition cursor-pointer ${
                          djBeatMode === 'edm'
                            ? 'bg-[#dfb752] text-[#141d0e]'
                            : 'bg-[#253319] text-[#c1d1b0] hover:text-white'
                        }`}
                      >
                        EDM Drop
                      </button>
                      <button
                        onClick={() => setDjBeatMode('bollywood')}
                        className={`px-2 py-0.5 rounded-lg text-[10px] font-bold font-mono transition cursor-pointer ${
                          djBeatMode === 'bollywood'
                            ? 'bg-[#dfb752] text-[#141d0e]'
                            : 'bg-[#253319] text-[#c1d1b0] hover:text-white'
                        }`}
                      >
                        Club Remix
                      </button>
                      <button
                        onClick={() => setDjBeatMode('bass')}
                        className={`px-2 py-0.5 rounded-lg text-[10px] font-bold font-mono transition cursor-pointer ${
                          djBeatMode === 'bass'
                            ? 'bg-[#dfb752] text-[#141d0e]'
                            : 'bg-[#253319] text-[#c1d1b0] hover:text-white'
                        }`}
                      >
                        Dhol Bass
                      </button>
                      <button
                        onClick={() => setDjBeatMode('techno')}
                        className={`px-2 py-0.5 rounded-lg text-[10px] font-bold font-mono transition cursor-pointer ${
                          djBeatMode === 'techno'
                            ? 'bg-[#dfb752] text-[#141d0e]'
                            : 'bg-[#253319] text-[#c1d1b0] hover:text-white'
                        }`}
                      >
                        Techno
                      </button>
                    </div>
                  </div>
                </div>

              </div>

            </div>

            {/* Right Column: Editorial Copy & Stage Spectacle Highlights */}
            <div className="lg:col-span-6 space-y-6">
              
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#253319] text-[#dfb752] text-xs font-mono font-bold border border-[#dfb752]/30">
                <Music className="w-3.5 h-3.5" />
                <span>EXPERIENCE 01 • HEADLINE DJ CONCERT</span>
              </div>

              <h2 className="font-serif text-3xl sm:text-5xl font-extrabold text-[#fdfbf7] leading-tight">
                Celebrity Guest DJ Night &amp; EDM Euphoria
              </h2>

              <p className="text-sm sm:text-base text-[#b9cbb0] leading-relaxed">
                As the celebration peaks, the open-air central amphitheatre of <strong className="text-white">Gurgaon University</strong> transforms into a high-energy electronic music arena. Headlined by a celebrated guest DJ spinning pulsating bass drops, festive remixes, and an electric concert visual spectacle.
              </p>

              {/* 4 Feature Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-4 rounded-2xl bg-[#1b2613] border border-[#303f21] space-y-1">
                  <div className="flex items-center gap-2 text-[#dfb752] font-bold text-xs">
                    <Zap className="w-4 h-4" />
                    <span>Celebrity Guest DJ</span>
                  </div>
                  <p className="text-[11px] text-[#8e9f73]">
                    Nonstop festive club anthems, Punjabi-Bollywood bangers &amp; EDM drops.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#1b2613] border border-[#303f21] space-y-1">
                  <div className="flex items-center gap-2 text-[#dfb752] font-bold text-xs">
                    <Volume2 className="w-4 h-4" />
                    <span>Concert Line Array Audio</span>
                  </div>
                  <p className="text-[11px] text-[#8e9f73]">
                    Chest-thumping dual subwoofers and pro JBL sound coverage across the arena.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#1b2613] border border-[#303f21] space-y-1">
                  <div className="flex items-center gap-2 text-[#dfb752] font-bold text-xs">
                    <Sparkles className="w-4 h-4" />
                    <span>Laser &amp; Visual Show</span>
                  </div>
                  <p className="text-[11px] text-[#8e9f73]">
                    Concert beam lasers, dynamic LED stage projections &amp; CO2 cannons.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#1b2613] border border-[#303f21] space-y-1">
                  <div className="flex items-center gap-2 text-[#dfb752] font-bold text-xs">
                    <ShieldCheck className="w-4 h-4" />
                    <span>18 October Special</span>
                  </div>
                  <p className="text-[11px] text-[#8e9f73]">
                    Full open-air youth festival atmosphere at Gurgaon University campus.
                  </p>
                </div>
              </div>

              {/* Ticket Inclusions Callout */}
              <div className="p-4 rounded-2xl bg-[#253319] border border-[#43552d] flex items-center justify-between">
                <div>
                  <span className="text-xs text-[#dfb752] font-bold block">
                    Access Included in All Passes
                  </span>
                  <span className="text-[11px] text-[#c1d1b0]">
                    Both ₹250 (Single) and ₹450 (Couple) include complete DJ Night entry.
                  </span>
                </div>
                <button
                  onClick={() => handleNav('tickets')}
                  className="px-4 py-2 bg-[#dfb752] hover:bg-[#c99e3a] text-[#141d0e] font-bold text-xs rounded-xl transition cursor-pointer shrink-0"
                >
                  Book Pass
                </button>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* ============================================================ */}
      {/* 4. SHOWCASE 2: GRAND GARBA & DANDIYA RAAS (ANIMATED - ZERO PHOTOS) */}
      {/* ============================================================ */}
      <section 
        id="garba-section"
        ref={garbaSectionRef}
        className={`py-16 sm:py-24 bg-[#faf7f0] border-b border-[#cfc4ad] relative transition-all duration-1000 ${
          visibleSections.garba ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Column: Editorial & Heritage Details */}
            <div className="lg:col-span-6 space-y-6 order-2 lg:order-1">
              
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#fbf2da] text-[#705315] text-xs font-mono font-bold border border-[#c99e3a]/40">
                <Flame className="w-3.5 h-3.5 text-[#b88a24]" />
                <span>EXPERIENCE 02 • GRAND DANDIYA RAAS</span>
              </div>

              <h2 className="font-serif text-3xl sm:text-5xl font-extrabold text-[#1b2413] leading-tight">
                Grand Garba &amp; Dandiya Raas
              </h2>

              <p className="text-sm sm:text-base text-[#556345] leading-relaxed">
                Step into swirling vibrant circles under the festive stars at <strong className="text-[#1b2413]">Gurgaon University</strong>. Experience the rhythmic energy of authentic dholak percussion, traditional Dandiya clashing, and massive community dance circles.
              </p>

              {/* 4 Garba Features */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-4 rounded-2xl bg-white border border-[#dfd7c3] shadow-xs space-y-1">
                  <div className="flex items-center gap-2 text-[#334423] font-bold text-xs">
                    <Flame className="w-4 h-4 text-[#b88a24]" />
                    <span>Live Dhol Percussionists</span>
                  </div>
                  <p className="text-[11px] text-[#6d7e58]">
                    Master percussionists driving non-stop traditional Garba tal and rhythmic beats.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-[#dfd7c3] shadow-xs space-y-1">
                  <div className="flex items-center gap-2 text-[#334423] font-bold text-xs">
                    <Disc className="w-4 h-4 text-[#b88a24]" />
                    <span>Multi-Circle Dandiya Raas</span>
                  </div>
                  <p className="text-[11px] text-[#6d7e58]">
                    Open dancing circles accommodating 1,000+ dancers simultaneously.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-[#dfd7c3] shadow-xs space-y-1">
                  <div className="flex items-center gap-2 text-[#334423] font-bold text-xs">
                    <Sparkles className="w-4 h-4 text-[#b88a24]" />
                    <span>Free Dandiya Sticks</span>
                  </div>
                  <p className="text-[11px] text-[#6d7e58]">
                    Complimentary pair of Dandiya sticks issued at the entry gate with passes.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-[#dfd7c3] shadow-xs space-y-1">
                  <div className="flex items-center gap-2 text-[#334423] font-bold text-xs">
                    <ShieldCheck className="w-4 h-4 text-[#b88a24]" />
                    <span>Festive Attire Encouraged</span>
                  </div>
                  <p className="text-[11px] text-[#6d7e58]">
                    Chaniya cholis, kurtas &amp; ethnic festive wear warmly celebrated.
                  </p>
                </div>
              </div>

              {/* Inclusions Note */}
              <div className="p-4 rounded-2xl bg-[#ebf0e2] border border-[#b8cbb0] flex items-center justify-between">
                <div>
                  <span className="text-xs text-[#253319] font-bold block">
                    Garba Access Included in Every Pass
                  </span>
                  <span className="text-[11px] text-[#4d5e36]">
                    Both ₹250 (Single) and ₹450 (Couple) include complete Garba Night access.
                  </span>
                </div>
                <button
                  onClick={() => handleNav('tickets')}
                  className="px-4 py-2 bg-[#334423] hover:bg-[#43592e] text-[#fbf8f1] font-bold text-xs rounded-xl transition cursor-pointer shrink-0"
                >
                  Book Pass
                </button>
              </div>

            </div>

            {/* Right Column: Animated Clashing Dandiya Sticks & Rotating Festive Mandala */}
            <div className="lg:col-span-6 flex flex-col items-center order-1 lg:order-2">
              
              <div className="w-full max-w-md bg-white border-2 border-[#c99e3a]/40 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden flex flex-col items-center text-center">
                
                {/* Dandiya Tempo Controls */}
                <div className="w-full flex items-center justify-between pb-3 mb-2 border-b border-[#dfd7c3] text-[10px] font-mono">
                  <span className="text-[#705315] font-bold flex items-center gap-1">
                    <Sliders className="w-3 h-3 text-[#b88a24]" />
                    DANDIYA RHYTHM SPEED
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setGarbaTempo('slow')}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold transition cursor-pointer ${
                        garbaTempo === 'slow' ? 'bg-[#c99e3a] text-[#1b2413]' : 'bg-[#faf7f0] text-[#705315]'
                      }`}
                    >
                      Slow
                    </button>
                    <button
                      onClick={() => setGarbaTempo('medium')}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold transition cursor-pointer ${
                        garbaTempo === 'medium' ? 'bg-[#c99e3a] text-[#1b2413]' : 'bg-[#faf7f0] text-[#705315]'
                      }`}
                    >
                      Medium
                    </button>
                    <button
                      onClick={() => setGarbaTempo('fast')}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold transition cursor-pointer ${
                        garbaTempo === 'fast' ? 'bg-[#c99e3a] text-[#1b2413]' : 'bg-[#faf7f0] text-[#705315]'
                      }`}
                    >
                      Fast
                    </button>
                  </div>
                </div>

                {/* Background Rotating Mandala Rims & Clashing Dandiya Sticks */}
                <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center my-4">
                  
                  {/* Outer Mandala Ring */}
                  <div className="absolute inset-0 rounded-full border-2 border-dashed border-[#c99e3a]/40 animate-spin-slow" />
                  
                  {/* Inner Reverse Spinning Geometric Ring */}
                  <div className="absolute inset-8 rounded-full border-2 border-dotted border-[#789c4a]/40 animate-spin-reverse" />
                  
                  {/* Pulsing Aura */}
                  <div className="absolute inset-16 rounded-full bg-[#dfb752]/10 animate-pulse-glow" />

                  {/* Animated Clashing Dandiya Sticks with selectable tempo */}
                  <div className="relative z-10 w-full h-full flex items-center justify-center">
                    {/* Left Dandiya Stick */}
                    <div className={`w-3.5 h-44 bg-gradient-to-b from-[#dfb752] via-[#c99e3a] to-[#705315] rounded-full shadow-lg absolute transform origin-bottom ${
                      garbaTempo === 'slow' ? 'animate-dandiya-slow-left' :
                      garbaTempo === 'fast' ? 'animate-dandiya-fast-left' : 'animate-dandiya-left'
                    }`} />
                    
                    {/* Right Dandiya Stick */}
                    <div className={`w-3.5 h-44 bg-gradient-to-b from-[#dfb752] via-[#c99e3a] to-[#705315] rounded-full shadow-lg absolute transform origin-bottom ${
                      garbaTempo === 'slow' ? 'animate-dandiya-slow-right' :
                      garbaTempo === 'fast' ? 'animate-dandiya-fast-right' : 'animate-dandiya-right'
                    }`} />
                    
                    {/* Clash Spark Center */}
                    <div className="w-5 h-5 rounded-full bg-white shadow-[0_0_20px_#dfb752] animate-ping z-20" />
                  </div>
                </div>

                {/* Animated Dhol Drum Illustration (Vector) */}
                <div className="mt-2 p-3 bg-[#faf7f0] rounded-2xl border border-[#dfd7c3] w-full flex items-center justify-center gap-3">
                  <div className="w-10 h-7 rounded-lg bg-gradient-to-r from-[#705315] via-[#b88a24] to-[#705315] border border-[#c99e3a] animate-dhol shadow-xs flex items-center justify-center text-[9px] font-mono font-bold text-white">
                    DHOL
                  </div>
                  <div className="text-left text-[11px] text-[#556345]">
                    <span className="font-bold text-[#1b2413] block">Live Dhol Beat Resonance</span>
                    <span>Authentic Gujarati Raas rhythm reverberating across the lawn.</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-[#dfd7c3] w-full text-center">
                  <span className="font-mono text-xs uppercase tracking-widest text-[#705315] font-extrabold block">
                    OPEN-AIR RAAS ARENA • GURGAON UNIVERSITY
                  </span>
                  <span className="text-[11px] text-[#556345] mt-1 block">
                    Rhythmic Footwork · Live Dhol Resonance · Community Energy
                  </span>
                </div>

              </div>

            </div>

          </div>

        </div>
      </section>

      {/* ============================================================ */}
      {/* 5. TICKET PASS PRICING (Single ₹250 & Couple ₹450) */}
      {/* ============================================================ */}
      <section 
        id="passes-section"
        ref={ticketsRef}
        className={`py-16 sm:py-24 bg-[#faf7f0] border-b border-[#cfc4ad] relative transition-all duration-1000 ${
          visibleSections.tickets ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-xs uppercase tracking-widest text-[#5b6e41] font-extrabold block mb-1">
              Direct Transparent Rates
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-extrabold text-[#1b2413]">
              Official Passes for 18 October
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-[#556345]">
              Every pass includes complete access to both <strong className="text-[#1b2413]">Garba Night</strong> &amp; <strong className="text-[#1b2413]">DJ Night</strong> at Gurgaon University.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            
            {/* Single Person Pass: ₹250 */}
            <div className="rounded-3xl bg-white border-2 border-[#cfc4ad] p-6 sm:p-8 shadow-md hover:border-[#334423] transition-all flex flex-col justify-between relative group">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#705315] bg-[#faf6eb] px-3 py-1 rounded-full border border-[#c99e3a]/40">
                    Single Person Pass
                  </span>
                  <span className="text-xs text-[#556345] font-semibold">1 Person Entry</span>
                </div>

                <div className="mb-4">
                  <div className="flex items-baseline gap-1">
                    <span className="font-serif text-4xl sm:text-5xl font-extrabold text-[#1b2413]">
                      ₹250
                    </span>
                    <span className="text-xs text-[#556345] font-semibold">/ person</span>
                  </div>
                  <p className="text-xs text-[#556345] mt-2">
                    Complete all-access pass for 1 person to both Garba Night &amp; DJ Night.
                  </p>
                </div>

                <ul className="space-y-2.5 text-xs text-[#3b4928] my-6 pt-4 border-t border-[#ede4d2]">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Entry for 1 Person (Single Entry)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Grand Garba Night &amp; Dandiya Access</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Celebrity DJ Night &amp; EDM Finale Access</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Complimentary Dandiya Sticks at Gate</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Unique Letter Security Code (No QR Code Needed)</span>
                  </li>
                </ul>
              </div>

              <button
                id="book-single-pass-card-btn"
                onClick={() => handleNav('tickets')}
                className="w-full py-3.5 rounded-2xl bg-[#334423] hover:bg-[#43592e] text-[#fbf8f1] font-bold text-sm shadow transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Ticket className="w-4 h-4 text-[#dfb752]" />
                <span>Book Single Pass (₹250)</span>
              </button>
            </div>

            {/* Couple Pass: ₹450 */}
            <div className="rounded-3xl bg-[#fdfbf7] border-2 border-[#c99e3a] p-6 sm:p-8 shadow-xl hover:shadow-2xl transition-all flex flex-col justify-between relative">
              
              {/* Most Popular Flag */}
              <div className="absolute -top-3.5 right-6 bg-[#b88a24] text-white text-[10px] font-bold uppercase tracking-wider px-3.5 py-1 rounded-full shadow">
                Best Value for 2
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#b88a24] bg-[#fbf2da] px-3 py-1 rounded-full border border-[#c99e3a]">
                    Couple Pass (2 Persons)
                  </span>
                  <span className="text-xs text-[#556345] font-semibold">2 Persons Entry</span>
                </div>

                <div className="mb-4">
                  <div className="flex items-baseline gap-1">
                    <span className="font-serif text-4xl sm:text-5xl font-extrabold text-[#1b2413]">
                      ₹450
                    </span>
                    <span className="text-xs text-[#556345] font-semibold">/ couple</span>
                  </div>
                  <p className="text-xs text-[#556345] mt-2">
                    Complete all-access pass for Couple (2 persons) to both Garba Night &amp; DJ Night.
                  </p>
                </div>

                <ul className="space-y-2.5 text-xs text-[#3b4928] my-6 pt-4 border-t border-[#ede4d2]">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Entry for Couple (2 Persons Entry)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Grand Garba Night &amp; Dandiya (For Both)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Celebrity DJ Night &amp; EDM Finale (For Both)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>2 Pairs of Complimentary Dandiya Sticks</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Unique Letter Security Code (No QR Code Needed)</span>
                  </li>
                </ul>
              </div>

              <button
                id="book-couple-pass-card-btn"
                onClick={() => handleNav('tickets')}
                className="w-full py-3.5 rounded-2xl bg-[#c99e3a] hover:bg-[#dfb752] text-[#1b2413] font-bold text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Ticket className="w-4 h-4 text-[#1b2413]" />
                <span>Book Couple Pass (₹450)</span>
              </button>
            </div>

          </div>

        </div>
      </section>

      {/* ============================================================ */}
      {/* 6. FREQUENTLY ASKED QUESTIONS ACCORDION */}
      {/* ============================================================ */}
      <section 
        ref={faqRef}
        className={`py-14 sm:py-20 bg-[#ede4d2] border-b border-[#cfc4ad] transition-all duration-1000 ${
          visibleSections.faq ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-8">
            <h2 className="font-serif text-2xl sm:text-4xl font-extrabold text-[#1b2413]">
              Frequently Asked Questions
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-[#556345]">
              Everything you need to know about passes, venue, and unique letter code entry.
            </p>
          </div>

          <div className="space-y-3">
            {FESTIVAL_FAQS.map((faq) => {
              const isOpen = openFaq === faq.id;
              return (
                <div 
                  key={faq.id}
                  className="rounded-2xl bg-white border border-[#cfc4ad] overflow-hidden shadow-xs"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? '' : faq.id)}
                    className="w-full py-4 px-5 text-left flex items-center justify-between gap-3 cursor-pointer"
                  >
                    <span className="font-serif font-bold text-sm sm:text-base text-[#1b2413]">
                      {faq.question}
                    </span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-[#b88a24] shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-[#556345] shrink-0" />
                    )}
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-[#556345] leading-relaxed border-t border-[#ede4d2]">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ============================================================ */}
      {/* 7. GRAND FINALE REGAL BANNER */}
      {/* ============================================================ */}
      <section className="py-16 sm:py-20 bg-[#1b2413] text-[#f7f4ec] text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[#c99e3a]/5 pointer-events-none" />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#253319] text-[#dfb752] text-xs font-mono font-bold border border-[#dfb752]/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>GURGAON UNIVERSITY • 18 OCTOBER 2026</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-5xl font-extrabold text-white leading-tight">
            Be Part of the Biggest Night of the Year
          </h2>

          <p className="text-sm sm:text-base text-[#c1d1b0] max-w-xl mx-auto">
            Book your ₹250 Single Pass or ₹450 Couple Pass now and receive your instant unique letter code.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button
              onClick={() => handleNav('tickets')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-[#dfb752] hover:bg-[#c99e3a] text-[#141d0e] font-bold text-sm sm:text-base shadow-xl transition transform hover:-translate-y-0.5 cursor-pointer"
            >
              Book Passes (From ₹250)
            </button>
            <a
              href="#lookup-section"
              className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-[#253319] hover:bg-[#303f21] text-[#f7f4ec] font-bold text-sm sm:text-base border border-[#486032] transition cursor-pointer"
            >
              Lookup Existing Pass
            </a>
          </div>
        </div>
      </section>

      {/* Floating Scroll-To-Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          title="Scroll to top"
          className="fixed bottom-6 right-6 w-11 h-11 rounded-full bg-[#334423] text-[#dfb752] border border-[#b88a24] shadow-xl flex items-center justify-center hover:bg-[#43592e] transition-all transform hover:scale-110 z-40 cursor-pointer"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}

    </div>
  );
};
