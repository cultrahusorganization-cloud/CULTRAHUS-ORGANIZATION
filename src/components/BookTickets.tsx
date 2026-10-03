import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  Ticket, 
  Check, 
  Search, 
  Copy, 
  Printer, 
  Sparkles, 
  AlertCircle, 
  CheckCircle2, 
  Calendar,
  Layers,
  Music,
  Radio
} from 'lucide-react';
import { CultrahusLogo } from './CultrahusLogo';
import { TICKET_TIERS, SANGAM_SCHEDULE, TicketTier } from '../data/sangamData';
import { registerParticipant, findByCode } from '../services/registrationService';
import { DigitalPassData, RegistrationRecord } from '../types';

interface BookTicketsProps {
  onPassGenerated: (passData: DigitalPassData) => void;
}

export const BookTickets: React.FC<BookTicketsProps> = ({ onPassGenerated }) => {
  const [activeTab, setActiveTab] = useState<'book' | 'lookup'>('book');
  const [selectedTier, setSelectedTier] = useState<string>('two_day');
  const [selectedDay, setSelectedDay] = useState<'Day 1' | 'Day 2'>('Day 1');
  const [quantity, setQuantity] = useState<number>(1);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    whatsappPhone: '',
  });

  const [lookupCode, setLookupCode] = useState('');
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupError, setLookupError] = useState<string | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [createdRecord, setCreatedRecord] = useState<RegistrationRecord | null>(null);
  const [copied, setCopied] = useState(false);

  const currentTier: TicketTier = TICKET_TIERS.find(t => t.id === selectedTier) || TICKET_TIERS[0];
  const totalAmount = currentTier.price * quantity;

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 10);
    setFormData(prev => ({ ...prev, whatsappPhone: val }));
    if (errorMsg && errorMsg.toLowerCase().includes('phone')) setErrorMsg(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!formData.fullName.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    if (!/^\d{10}$/.test(formData.whatsappPhone)) {
      setErrorMsg('WhatsApp phone must be exactly 10 digits.');
      return;
    }

    const tierDisplayName = selectedTier === 'two_day' 
      ? '₹700 — 2-Day Pass (Limited Time Offer • Both Days Included)' 
      : `₹400 — Single-Day Pass (Limited Time Offer • ${selectedDay})`;

    const chosenDayValue = selectedTier === 'two_day'
      ? 'Both Days (Day 1 & Day 2)'
      : selectedDay;

    const chosenInclusions = selectedTier === 'two_day'
      ? 'Entry on Day 1 AND Day 2 (Day 1: Dance Competition, Music Competition, Singers’ Performance and Big Programme; Day 2: Garba Night, Dandiya Night and DJ Night)'
      : selectedDay === 'Day 1'
      ? 'Day 1 Entry: Dance Competition, Music Competition, Singers’ Performance and Big Programme'
      : 'Day 2 Entry: Garba Night, Dandiya Night and DJ Night';

    setSubmitting(true);
    try {
      const record = await registerParticipant({
        name: formData.fullName.trim(),
        email: formData.email.trim(),
        phone: formData.whatsappPhone,
        type: 'ticket',
        ticketTier: selectedTier,
        tierName: tierDisplayName,
        selectedDay: chosenDayValue,
        quantity,
        foodAddon: chosenInclusions,
        amountPaid: totalAmount,
        source: 'vercel',
      });

      setCreatedRecord(record);

      try {
        confetti({
          particleCount: 90,
          spread: 80,
          origin: { y: 0.6 }
        });
      } catch {
        // ignore
      }

      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error('Ticket booking failed:', err);
      setErrorMsg('Failed to book tickets. Please verify your connection and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    const q = lookupCode.trim().toUpperCase();
    if (!q) {
      setLookupError('Please enter a ticket code (e.g. SNGM-TKT-XXXXX) or 10-digit WhatsApp number.');
      return;
    }

    setLookupLoading(true);
    setLookupError(null);
    try {
      const found = await findByCode(q);
      if (found) {
        setCreatedRecord(found);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setLookupError(`No ticket found for "${q}". Please check the code.`);
      }
    } catch {
      setLookupError('Failed to lookup ticket. Please try again.');
    } finally {
      setLookupLoading(false);
    }
  };

  const handleCopy = () => {
    if (!createdRecord?.uniqueCode) return;
    navigator.clipboard.writeText(createdRecord.uniqueCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const openBadgeModal = () => {
    if (!createdRecord) return;
    const isTwoDay = createdRecord.ticketTier === 'two_day' || createdRecord.tierName?.includes('2-Day');
    const dayLabel = createdRecord.selectedDay || (isTwoDay ? 'Both Days' : selectedDay);

    onPassGenerated({
      type: 'ticket',
      code: createdRecord.uniqueCode,
      title: createdRecord.tierName || (isTwoDay ? '₹700 — 2-Day Pass (Both Days Included)' : `₹400 — Single-Day Pass (${dayLabel})`),
      fullName: createdRecord.name,
      email: createdRecord.email,
      phone: createdRecord.phone,
      detail1Label: 'Pass Quantity & Day',
      detail1Value: `${createdRecord.quantity || 1} Pass(es) • ${dayLabel}`,
      detail2Label: 'Festival Inclusions',
      detail2Value: isTwoDay
        ? 'Both Days: Day 1 (Dance, Music, Singers, Big Programme) & Day 2 (Garba, Dandiya & DJ Night)'
        : (dayLabel === 'Day 2' || selectedDay === 'Day 2')
        ? 'Day 2: Garba Night, Dandiya Night and DJ Night'
        : 'Day 1: Dance Competition, Music Competition, Singers’ Performance and Big Programme',
      feePaid: `₹${(createdRecord.amountPaid || totalAmount).toLocaleString('en-IN')}`,
      status: 'Confirmed & Validated',
      issuedIst: new Date(createdRecord.createdAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Title Header */}
      <div className="text-center max-w-3xl mx-auto mb-8 flex flex-col items-center">
        <CultrahusLogo size="md" className="mb-3" />
        <span className="text-xs uppercase tracking-widest text-[#5b6e41] font-extrabold block mb-2">
          Auditorium &amp; Festival Conclave Passes
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-[#242c18] leading-tight">
          Book Conclave Passes
        </h1>
        <p className="mt-3 text-[#556345] text-sm sm:text-base">
          Experience the national conclave with full access passes: 2-Day all-access or Single-Day pass with day selection.
        </p>
      </div>

      {/* Mode Tabs */}
      <div className="flex justify-center mb-8">
        <div className="inline-flex p-1 rounded-xl bg-[#ede4d2] border border-[#cfc4ad]">
          <button
            id="tab-book-ticket"
            onClick={() => { setActiveTab('book'); setErrorMsg(null); }}
            className={`px-5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'book'
                ? 'bg-[#3b4928] text-[#f7f4ec] shadow-sm'
                : 'text-[#384626] hover:text-[#192111]'
            }`}
          >
            Book Passes
          </button>
          <button
            id="tab-lookup-ticket"
            onClick={() => { setActiveTab('lookup'); setLookupError(null); }}
            className={`px-5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'lookup'
                ? 'bg-[#3b4928] text-[#f7f4ec] shadow-sm'
                : 'text-[#384626] hover:text-[#192111]'
            }`}
          >
            Lookup Existing Ticket
          </button>
        </div>
      </div>

      {/* Success Notification */}
      {createdRecord && (
        <div className="mb-10 space-y-6 animate-in fade-in-50 duration-300 max-w-3xl mx-auto">
          <div className="p-5 rounded-2xl bg-[#ebf0e2] border border-[#b8cbb0] text-[#242c18] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-6 h-6 text-[#475731] shrink-0 mt-0.5" />
              <div>
                <h3 className="font-serif font-bold text-lg text-[#242c18]">
                  Passes Booked &amp; Confirmed!
                </h3>
                <p className="text-xs text-[#556345] mt-1">
                  Your ticket reference code is{' '}
                  <span className="font-mono font-bold text-[#242c18] bg-white px-2 py-0.5 rounded border border-[#b8cbb0]">
                    {createdRecord.uniqueCode}
                  </span>
                  . Saved in Firestore database and immediately visible in the Admin Portal.
                </p>
                <p className="text-[11px] text-[#475731] font-semibold mt-1">
                  Pass: {createdRecord.tierName || 'Confirmed Ticket'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
              <button
                id="copy-ticket-code-btn"
                onClick={handleCopy}
                className="px-3 py-2 bg-white hover:bg-[#f4efe4] border border-[#cfc4ad] text-[#242c18] rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copied ? 'Copied!' : 'Copy Code'}</span>
              </button>
              <button
                id="view-ticket-pass-btn"
                onClick={openBadgeModal}
                className="px-4 py-2 bg-[#364325] hover:bg-[#475731] text-[#d7c494] rounded-xl text-xs font-bold transition shadow flex items-center gap-1.5 border border-[#5b6e41]/50 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print / View Pass</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TOP OF THE TICKET SECTION: DAY 1 & DAY 2 SCHEDULE BANNER */}
      <div className="mb-10 max-w-4xl mx-auto">
        <div className="bg-[#ede4d2] border-2 border-[#cfc4ad] rounded-3xl p-5 sm:p-7 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-5 border-b border-[#cfc4ad] gap-2">
            <div className="flex items-center gap-2.5">
              <Calendar className="w-5 h-5 text-[#5b6e41]" />
              <div>
                <span className="text-xs uppercase font-extrabold tracking-widest text-[#3b4928] block">
                  Event Schedule
                </span>
                <h2 className="font-serif font-bold text-xl sm:text-2xl text-[#242c18]">
                  Cultrahus Sangam 2026 Lineup
                </h2>
              </div>
            </div>
            <div className="text-[11px] font-bold text-[#556345] bg-white/70 px-3 py-1 rounded-full border border-[#cfc4ad] self-start sm:self-auto">
              2 Grand Days of Culture &amp; Celebration
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {/* DAY 1 Card */}
            <div className="p-5 rounded-2xl bg-white/90 border-2 border-[#b8cbb0] shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="inline-block px-3 py-1 rounded-lg bg-[#3b4928] text-[#e5d4aa] text-xs font-extrabold uppercase tracking-wider shadow-xs">
                    DAY 1
                  </span>
                  <span className="text-[11px] font-bold text-[#5b6e41] uppercase tracking-wide">
                    Stage &amp; Conclave
                  </span>
                </div>
                <div className="font-serif font-bold text-base sm:text-lg text-[#242c18] mb-3 leading-snug">
                  Dance Competition • Music Competition • Singers’ Performance • Big Programme
                </div>
              </div>

              <div className="pt-3 border-t border-[#dfd7c3] space-y-1.5 text-xs text-[#3b4928]">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#5b6e41]" />
                  <span className="font-semibold">Dance Competition</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#5b6e41]" />
                  <span className="font-semibold">Music Competition</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#5b6e41]" />
                  <span className="font-semibold">Singers’ Performance</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#5b6e41]" />
                  <span className="font-semibold">Big Programme</span>
                </div>
              </div>
            </div>

            {/* DAY 2 Card */}
            <div className="p-5 rounded-2xl bg-white/90 border-2 border-[#e3cca1] shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="inline-block px-3 py-1 rounded-lg bg-[#b3832f] text-white text-xs font-extrabold uppercase tracking-wider shadow-xs">
                    DAY 2
                  </span>
                  <span className="text-[11px] font-bold text-[#b3832f] uppercase tracking-wide">
                    Festive &amp; DJ Extravaganza
                  </span>
                </div>
                <div className="font-serif font-bold text-base sm:text-lg text-[#242c18] mb-3 leading-snug">
                  Garba Night • Dandiya Night • DJ Night
                </div>
              </div>

              <div className="pt-3 border-t border-[#dfd7c3] space-y-1.5 text-xs text-[#8e6822]">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#b3832f]" />
                  <span className="font-semibold">Garba Night</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#b3832f]" />
                  <span className="font-semibold">Dandiya Night</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#b3832f]" />
                  <span className="font-semibold">DJ Night</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {activeTab === 'book' ? (
        <div className="space-y-10">
          {/* HIGHLIGHTED LIMITED TIME OFFER CALLOUT BANNER */}
          <div className="max-w-4xl mx-auto">
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#fef3c7] via-[#fde68a]/50 to-[#fef3c7] border-2 border-[#b45309] shadow-md flex flex-col md:flex-row items-center justify-between gap-3 text-center md:text-left">
              <div className="flex items-center gap-3">
                <span className="px-3.5 py-1.5 rounded-full bg-[#b45309] text-white text-xs font-extrabold uppercase tracking-wider shadow flex items-center gap-1.5 shrink-0 animate-pulse">
                  <Sparkles className="w-4 h-4 text-[#fde68a]" />
                  <span>LIMITED TIME OFFER</span>
                </span>
                <div>
                  <h3 className="font-serif font-extrabold text-base sm:text-lg text-[#78350f] leading-tight">
                    Special Conclave Ticket Prices Slashed!
                  </h3>
                  <p className="text-xs text-[#92400e] font-semibold mt-0.5">
                    Single-Day Pass cut down from <span className="line-through text-[#b45309] font-bold">₹600</span> to <strong className="text-[#78350f] text-sm font-extrabold">₹400</strong> • 2-Day Pass cut down from <span className="line-through text-[#b45309] font-bold">₹1,000</span> to <strong className="text-[#78350f] text-sm font-extrabold">₹700</strong>!
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="px-3.5 py-1.5 bg-[#b45309] text-[#fef3c7] rounded-xl text-xs font-extrabold uppercase tracking-wide shadow-xs border border-[#92400e]">
                  🔥 Save up to ₹300 per pass
                </span>
              </div>
            </div>
          </div>

          {/* 2 Ticket Tier Cards: ₹700 (2-Day Pass) & ₹400 (Single-Day Pass) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* TICKET 1: ₹700 — 2-DAY PASS (CUT FROM ₹1,000) */}
            <div
              id="tier-card-two_day"
              onClick={() => setSelectedTier('two_day')}
              className={`cursor-pointer rounded-3xl p-6 sm:p-7 border-2 transition-all duration-200 relative flex flex-col justify-between ${
                selectedTier === 'two_day'
                  ? 'bg-[#faf7f0] border-[#b45309] shadow-lg ring-2 ring-[#b45309]/20'
                  : 'bg-[#faf8f5] border-[#cfc4ad] hover:border-[#8e9f73] shadow-xs'
              }`}
            >
              <div className="absolute -top-3.5 right-6 px-3.5 py-1 rounded-full bg-[#b45309] text-white text-[11px] font-extrabold uppercase tracking-wider shadow flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#fde68a]" />
                <span>LIMITED TIME OFFER • 2-DAY PASS</span>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h3 className="font-serif font-bold text-2xl text-[#242c18]">
                      2-Day Pass
                    </h3>
                    <span className="text-[11px] text-[#556345] font-semibold">
                      Complete Conclave Experience
                    </span>
                  </div>
                  <div
                    className={`w-6 h-6 rounded-full border flex items-center justify-center shrink-0 ${
                      selectedTier === 'two_day'
                        ? 'bg-[#3b4928] border-[#3b4928] text-white'
                        : 'border-[#b8cbb0] bg-white'
                    }`}
                  >
                    {selectedTier === 'two_day' && <Check className="w-4 h-4" />}
                  </div>
                </div>

                {/* Price with Cut */}
                <div className="flex items-baseline gap-2 mb-1.5">
                  <span className="font-serif font-extrabold text-4xl text-[#242c18]">
                    ₹700
                  </span>
                  <span className="text-base text-[#b45309] line-through font-extrabold">
                    ₹1,000
                  </span>
                  <span className="text-[10px] text-[#556345] uppercase font-bold">
                    / person
                  </span>
                </div>

                {/* Highlighted Cut Badge */}
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#fef3c7] text-[#92400e] border border-[#fde68a] text-[10px] font-extrabold uppercase tracking-wider mb-3">
                  <span>⚡ ₹1,000 CUT TO ₹700 • LIMITED TIME OFFER</span>
                </div>

                {/* Clearly Show: Both Days Included */}
                <div className="mb-4 p-3 rounded-2xl bg-[#ebf0e2] border-2 border-[#b8cbb0] text-[#242c18] flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-[#3b4928] text-white flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-bold text-xs sm:text-sm text-[#242c18]">
                    ✓ Both Days Included
                  </span>
                </div>

                <p className="text-xs text-[#556345] mb-4 leading-relaxed font-medium">
                  Entry on Day 1 AND Day 2. Unrestricted admission across both festival days.
                </p>

                {/* Inclusions List */}
                <div className="pt-4 border-t border-[#dfd7c3] space-y-3">
                  <div className="text-[11px] font-extrabold uppercase tracking-wider text-[#43522f]">
                    Includes:
                  </div>

                  <div className="flex items-start gap-2.5 text-xs text-[#242c18]">
                    <Check className="w-4 h-4 text-[#3b4928] shrink-0 mt-0.5" />
                    <span className="font-semibold">
                      Entry on Day 1 AND Day 2
                    </span>
                  </div>

                  <div className="flex items-start gap-2.5 text-xs text-[#43522f] pl-1">
                    <span className="w-2 h-2 rounded-full bg-[#5b6e41] shrink-0 mt-1.5" />
                    <div>
                      <strong className="text-[#242c18]">Day 1:</strong> Dance Competition, Music Competition, Singers’ Performance and Big Programme
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 text-xs text-[#43522f] pl-1">
                    <span className="w-2 h-2 rounded-full bg-[#b3832f] shrink-0 mt-1.5" />
                    <div>
                      <strong className="text-[#242c18]">Day 2:</strong> Garba Night, Dandiya Night and DJ Night
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 text-xs text-[#43522f]">
                    <Check className="w-4 h-4 text-[#3b4928] shrink-0 mt-0.5" />
                    <span>Official Authenticated Digital Pass with QR Code</span>
                  </div>

                  <div className="flex items-start gap-2.5 text-xs text-[#43522f]">
                    <Check className="w-4 h-4 text-[#3b4928] shrink-0 mt-0.5" />
                    <span>Priority Auditorium &amp; Amphitheatre Entry</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-[#dfd7c3] flex items-center justify-between text-xs font-bold text-[#3b4928]">
                <span>Validity: Full 2 Days (Day 1 &amp; Day 2)</span>
                <span className="text-[10px] bg-[#3b4928] text-white px-2 py-0.5 rounded font-mono">
                  ALL-ACCESS
                </span>
              </div>
            </div>

            {/* TICKET 2: ₹400 — SINGLE-DAY PASS (CUT FROM ₹600) */}
            <div
              id="tier-card-single_day"
              onClick={() => setSelectedTier('single_day')}
              className={`cursor-pointer rounded-3xl p-6 sm:p-7 border-2 transition-all duration-200 relative flex flex-col justify-between ${
                selectedTier === 'single_day'
                  ? 'bg-[#faf7f0] border-[#b45309] shadow-lg ring-2 ring-[#b45309]/20'
                  : 'bg-[#faf8f5] border-[#cfc4ad] hover:border-[#8e9f73] shadow-xs'
              }`}
            >
              <div className="absolute -top-3.5 right-6 px-3.5 py-1 rounded-full bg-[#b45309] text-white text-[11px] font-extrabold uppercase tracking-wider shadow flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#fde68a]" />
                <span>LIMITED TIME OFFER • SINGLE-DAY</span>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h3 className="font-serif font-bold text-2xl text-[#242c18]">
                      Single-Day Pass
                    </h3>
                    <span className="text-[11px] text-[#556345] font-semibold">
                      Customer can select either Day 1 OR Day 2
                    </span>
                  </div>
                  <div
                    className={`w-6 h-6 rounded-full border flex items-center justify-center shrink-0 ${
                      selectedTier === 'single_day'
                        ? 'bg-[#3b4928] border-[#3b4928] text-white'
                        : 'border-[#b8cbb0] bg-white'
                    }`}
                  >
                    {selectedTier === 'single_day' && <Check className="w-4 h-4" />}
                  </div>
                </div>

                {/* Price with Cut */}
                <div className="flex items-baseline gap-2 mb-1.5">
                  <span className="font-serif font-extrabold text-4xl text-[#242c18]">
                    ₹400
                  </span>
                  <span className="text-base text-[#b45309] line-through font-extrabold">
                    ₹600
                  </span>
                  <span className="text-[10px] text-[#556345] uppercase font-bold">
                    / person
                  </span>
                </div>

                {/* Highlighted Cut Badge */}
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#fef3c7] text-[#92400e] border border-[#fde68a] text-[10px] font-extrabold uppercase tracking-wider mb-3">
                  <span>⚡ ₹600 CUT TO ₹400 • LIMITED TIME OFFER</span>
                </div>

                {/* CLEAR SELECTION OPTION: ○ Day 1  ○ Day 2 */}
                <div className="mb-4 p-3.5 rounded-2xl bg-white border-2 border-[#cfc4ad] space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-extrabold uppercase tracking-wider text-[#384626]">
                    <span>Select Day:</span>
                    <span className="text-[10px] text-[#5b6e41] font-bold">Required Choice</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {/* Day 1 Option */}
                    <button
                      type="button"
                      id="card-select-day-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedTier('single_day');
                        setSelectedDay('Day 1');
                      }}
                      className={`p-2.5 rounded-xl text-left border-2 transition-all flex items-center gap-2 cursor-pointer ${
                        selectedDay === 'Day 1'
                          ? 'bg-[#3b4928] text-white border-[#3b4928] shadow-sm'
                          : 'bg-[#faf8f5] text-[#242c18] border-[#cfc4ad] hover:border-[#8e9f73]'
                      }`}
                    >
                      <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                        selectedDay === 'Day 1'
                          ? 'border-white bg-white text-[#3b4928]'
                          : 'border-[#71825e] bg-white'
                      }`}>
                        {selectedDay === 'Day 1' && (
                          <span className="w-2 h-2 rounded-full bg-[#3b4928]" />
                        )}
                      </span>
                      <div className="min-w-0">
                        <div className="text-xs font-extrabold">○ Day 1</div>
                        <div className={`text-[10px] truncate ${selectedDay === 'Day 1' ? 'text-[#e5d4aa]' : 'text-[#607147]'}`}>
                          Competitions &amp; Show
                        </div>
                      </div>
                    </button>

                    {/* Day 2 Option */}
                    <button
                      type="button"
                      id="card-select-day-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedTier('single_day');
                        setSelectedDay('Day 2');
                      }}
                      className={`p-2.5 rounded-xl text-left border-2 transition-all flex items-center gap-2 cursor-pointer ${
                        selectedDay === 'Day 2'
                          ? 'bg-[#3b4928] text-white border-[#3b4928] shadow-sm'
                          : 'bg-[#faf8f5] text-[#242c18] border-[#cfc4ad] hover:border-[#8e9f73]'
                      }`}
                    >
                      <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                        selectedDay === 'Day 2'
                          ? 'border-white bg-white text-[#3b4928]'
                          : 'border-[#71825e] bg-white'
                      }`}>
                        {selectedDay === 'Day 2' && (
                          <span className="w-2 h-2 rounded-full bg-[#3b4928]" />
                        )}
                      </span>
                      <div className="min-w-0">
                        <div className="text-xs font-extrabold">○ Day 2</div>
                        <div className={`text-[10px] truncate ${selectedDay === 'Day 2' ? 'text-[#e5d4aa]' : 'text-[#607147]'}`}>
                          Garba &amp; DJ Night
                        </div>
                      </div>
                    </button>
                  </div>
                </div>

                <p className="text-xs text-[#556345] mb-4 leading-relaxed font-medium">
                  Customer can select either Day 1 OR Day 2. Pass is authenticated for entry on the chosen day.
                </p>

                {/* Inclusions List for Single-Day Pass */}
                <div className="pt-4 border-t border-[#dfd7c3] space-y-3">
                  <div className="text-[11px] font-extrabold uppercase tracking-wider text-[#43522f]">
                    Includes:
                  </div>

                  <div className="flex items-start gap-2.5 text-xs text-[#242c18]">
                    <Check className="w-4 h-4 text-[#3b4928] shrink-0 mt-0.5" />
                    <span className="font-semibold">
                      Customer can select either Day 1 OR Day 2
                    </span>
                  </div>

                  <div className={`p-2.5 rounded-xl border transition-all ${
                    selectedDay === 'Day 1'
                      ? 'bg-[#ebf0e2] border-[#b8cbb0] text-[#242c18] font-bold'
                      : 'bg-[#faf8f5] border-transparent text-[#607147]'
                  }`}>
                    <div className="flex items-start gap-2 text-xs">
                      <span className="w-2 h-2 rounded-full bg-[#5b6e41] shrink-0 mt-1" />
                      <div>
                        <strong>If Day 1 is selected:</strong> Dance Competition, Music Competition, Singers’ Performance and Big Programme.
                      </div>
                    </div>
                  </div>

                  <div className={`p-2.5 rounded-xl border transition-all ${
                    selectedDay === 'Day 2'
                      ? 'bg-[#fbf4e4] border-[#e3cca1] text-[#242c18] font-bold'
                      : 'bg-[#faf8f5] border-transparent text-[#607147]'
                  }`}>
                    <div className="flex items-start gap-2 text-xs">
                      <span className="w-2 h-2 rounded-full bg-[#b3832f] shrink-0 mt-1" />
                      <div>
                        <strong>If Day 2 is selected:</strong> Garba Night, Dandiya Night and DJ Night.
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 text-xs text-[#43522f]">
                    <Check className="w-4 h-4 text-[#3b4928] shrink-0 mt-0.5" />
                    <span>Official Authenticated Digital Pass with QR Code</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-[#dfd7c3] flex items-center justify-between text-xs font-bold text-[#3b4928]">
                <span>Currently Selected: {selectedDay}</span>
                <span className="text-[10px] bg-[#627349] text-white px-2 py-0.5 rounded font-mono">
                  SINGLE DAY
                </span>
              </div>
            </div>
          </div>

          {/* Booking & Personal Details Form */}
          <div className="bg-[#faf8f5] border-2 border-[#cfc4ad] rounded-3xl p-6 sm:p-10 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-serif font-bold text-2xl text-[#242c18] mb-1">
              Pass Holder Information
            </h2>
            <p className="text-xs text-[#556345] mb-6 flex flex-wrap items-center gap-2">
              <span>Selected:</span>
              <strong className="text-[#242c18]">
                {selectedTier === 'two_day' ? '₹700 — 2-Day Pass (Both Days Included)' : `₹400 — Single-Day Pass (${selectedDay})`}
              </strong>
              <span className="px-2 py-0.5 rounded bg-[#fef3c7] text-[#92400e] border border-[#fde68a] text-[10px] font-extrabold uppercase tracking-wider">
                Limited Time Offer
              </span>
            </p>

            {errorMsg && (
              <div className="mb-6 p-4 rounded-xl bg-[#fde8e8] border border-[#f8b4b4] text-[#9b1c1c] text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Day Selection in Form (Required for ₹600 Pass) */}
              {selectedTier === 'single_day' ? (
                <div className="p-4 rounded-2xl bg-[#ede4d2] border border-[#dfd7c3]">
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-[#384626] mb-2">
                    Select Your Single-Day Pass Date: *
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <label
                      id="form-radio-day-1"
                      onClick={() => setSelectedDay('Day 1')}
                      className={`p-3 rounded-xl border-2 flex items-start gap-3 cursor-pointer transition-all ${
                        selectedDay === 'Day 1'
                          ? 'bg-[#3b4928] text-white border-[#3b4928] shadow-sm'
                          : 'bg-white text-[#242c18] border-[#cfc4ad] hover:border-[#8e9f73]'
                      }`}
                    >
                      <input
                        type="radio"
                        name="passDay"
                        value="Day 1"
                        checked={selectedDay === 'Day 1'}
                        onChange={() => setSelectedDay('Day 1')}
                        className="mt-1"
                      />
                      <div className="text-xs">
                        <div className="font-extrabold">○ Day 1</div>
                        <div className={`text-[11px] mt-0.5 ${selectedDay === 'Day 1' ? 'text-[#e5d4aa]' : 'text-[#556345]'}`}>
                          Dance Competition, Music Competition, Singers’ Performance &amp; Big Programme
                        </div>
                      </div>
                    </label>

                    <label
                      id="form-radio-day-2"
                      onClick={() => setSelectedDay('Day 2')}
                      className={`p-3 rounded-xl border-2 flex items-start gap-3 cursor-pointer transition-all ${
                        selectedDay === 'Day 2'
                          ? 'bg-[#3b4928] text-white border-[#3b4928] shadow-sm'
                          : 'bg-white text-[#242c18] border-[#cfc4ad] hover:border-[#8e9f73]'
                      }`}
                    >
                      <input
                        type="radio"
                        name="passDay"
                        value="Day 2"
                        checked={selectedDay === 'Day 2'}
                        onChange={() => setSelectedDay('Day 2')}
                        className="mt-1"
                      />
                      <div className="text-xs">
                        <div className="font-extrabold">○ Day 2</div>
                        <div className={`text-[11px] mt-0.5 ${selectedDay === 'Day 2' ? 'text-[#e5d4aa]' : 'text-[#556345]'}`}>
                          Garba Night, Dandiya Night and DJ Night
                        </div>
                      </div>
                    </label>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-[#ebf0e2] border border-[#b8cbb0] text-xs text-[#242c18] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-[#3b4928] shrink-0" />
                    <div>
                      <span className="font-bold text-sm block">✓ Both Days Included</span>
                      <span className="text-[#556345] text-[11px]">
                        Grants entry to Day 1 (Competitions &amp; Big Programme) AND Day 2 (Garba, Dandiya &amp; DJ Night).
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-[#3b4928] text-white px-2.5 py-1 rounded-md shrink-0">
                    Day 1 + Day 2
                  </span>
                </div>
              )}

              {/* Quantity Selector */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#43522f] mb-2">
                  Number of Passes
                </label>
                <div className="flex items-center gap-3">
                  <div className="inline-flex rounded-xl bg-white border border-[#cfc4ad] p-1">
                    {[1, 2, 3, 4, 5, 10].map(q => (
                      <button
                        key={q}
                        type="button"
                        id={`qty-btn-${q}`}
                        onClick={() => setQuantity(q)}
                        className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          quantity === q
                            ? 'bg-[#3b4928] text-[#f7f4ec]'
                            : 'text-[#384626] hover:bg-[#eae1cd]'
                        }`}
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                  <span className="text-xs text-[#556345] font-medium">
                    Total: <strong className="text-base text-[#242c18]">₹{totalAmount.toLocaleString('en-IN')}</strong>
                  </span>
                </div>
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#43522f] mb-1.5">
                  Full Name (Primary Contact) *
                </label>
                <input
                  id="ticket-fullname-input"
                  type="text"
                  required
                  placeholder="e.g. Rohan Verma"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white border border-[#cfc4ad] text-sm text-[#242c18] focus:outline-none focus:border-[#3b4928]"
                />
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#43522f] mb-1.5">
                  Email Address (Pass Delivery) *
                </label>
                <input
                  id="ticket-email-input"
                  type="email"
                  required
                  placeholder="e.g. rohan.verma@gmail.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white border border-[#cfc4ad] text-sm text-[#242c18] focus:outline-none focus:border-[#3b4928]"
                />
              </div>

              {/* WhatsApp Phone */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#43522f] mb-1.5">
                  WhatsApp Phone (10 Digits) *
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-3 text-sm font-mono text-[#71825e]">+91</span>
                  <input
                    id="ticket-phone-input"
                    type="tel"
                    required
                    maxLength={10}
                    placeholder="9876543210"
                    value={formData.whatsappPhone}
                    onChange={handlePhoneChange}
                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-white border border-[#cfc4ad] text-sm text-[#242c18] font-mono focus:outline-none focus:border-[#3b4928]"
                  />
                </div>
              </div>

              {/* Inclusions summary banner */}
              <div className="p-4 rounded-2xl bg-[#ede4d2] border border-[#dfd7c3] text-xs text-[#3b4928] space-y-1.5">
                <div className="font-bold text-[#242c18] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#5b6e41]" />
                  <span>
                    {selectedTier === 'two_day'
                      ? '✓ Both Days Included (Day 1 & Day 2)'
                      : `Selected: Single-Day Pass (${selectedDay})`}
                  </span>
                </div>
                <p className="text-[11px] text-[#556345] leading-relaxed">
                  {selectedTier === 'two_day'
                    ? 'Grants full admission on Day 1 (Dance Competition, Music Competition, Singers’ Performance & Big Programme) and Day 2 (Garba Night, Dandiya Night & DJ Night).'
                    : selectedDay === 'Day 1'
                    ? 'Day 1 Included: Full entry to Dance Competition, Music Competition, Singers’ Performance and Big Programme.'
                    : 'Day 2 Included: Full entry to Garba Night, Dandiya Night and DJ Night.'}
                </p>
              </div>

              {/* Submit Button */}
              <button
                id="submit-ticket-booking-btn"
                type="submit"
                disabled={submitting}
                className="w-full py-4 rounded-xl bg-[#3b4928] hover:bg-[#485932] text-[#f7f4ec] font-bold text-sm shadow-lg shadow-black/10 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {submitting ? (
                  <span>Processing &amp; Synchronizing to Firestore...</span>
                ) : (
                  <>
                    <Ticket className="w-4 h-4 text-[#e5d4aa]" />
                    <span>Confirm &amp; Book Passes (₹{totalAmount.toLocaleString('en-IN')})</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      ) : (
        /* Lookup Ticket Pass */
        <div className="bg-[#faf8f5] border-2 border-[#cfc4ad] rounded-3xl p-6 sm:p-10 shadow-sm max-w-xl mx-auto">
          <div className="text-center mb-6">
            <Search className="w-8 h-8 text-[#5b6e41] mx-auto mb-2" />
            <h2 className="font-serif font-bold text-xl text-[#242c18]">
              Find Your Ticket Pass
            </h2>
            <p className="text-xs text-[#556345] mt-1">
              Enter the pass code (e.g. SNGM-TKT-XXXXX) or registered 10-digit WhatsApp number.
            </p>
          </div>

          {lookupError && (
            <div className="mb-4 p-3.5 rounded-xl bg-[#fde8e8] border border-[#f8b4b4] text-[#9b1c1c] text-xs">
              {lookupError}
            </div>
          )}

          <form onSubmit={handleLookup} className="space-y-4">
            <input
              id="lookup-ticket-input"
              type="text"
              required
              placeholder="e.g. SNGM-TKT-29402 or 9818561227"
              value={lookupCode}
              onChange={(e) => setLookupCode(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white border border-[#cfc4ad] text-sm text-[#242c18] font-mono focus:outline-none focus:border-[#3b4928]"
            />

            <button
              id="submit-ticket-lookup-btn"
              type="submit"
              disabled={lookupLoading}
              className="w-full py-3 rounded-xl bg-[#3b4928] hover:bg-[#485932] text-[#f7f4ec] text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {lookupLoading ? 'Searching Firestore Records...' : 'Retrieve Ticket Pass'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
