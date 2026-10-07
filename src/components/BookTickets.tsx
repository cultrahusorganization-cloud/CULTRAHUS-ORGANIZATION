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
  Users,
  User,
  Heart
} from 'lucide-react';
import { CultrahusLogo } from './CultrahusLogo';
import { TICKET_TIERS, TicketTier } from '../data/sangamData';
import { registerParticipant, findByCode } from '../services/registrationService';
import { DigitalPassData, RegistrationRecord } from '../types';

interface BookTicketsProps {
  onPassGenerated: (passData: DigitalPassData) => void;
}

export const BookTickets: React.FC<BookTicketsProps> = ({ onPassGenerated }) => {
  const [activeTab, setActiveTab] = useState<'book' | 'lookup'>('book');
  const [selectedTier, setSelectedTier] = useState<string>('single_person');
  const [quantity, setQuantity] = useState<number>(1);
  const [formData, setFormData] = useState({
    fullName: '',
    partnerName: '',
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

    const tierDisplayName = selectedTier === 'couple' 
      ? '₹450 — Couple Entry (Garba Night & DJ Night)' 
      : '₹250 — Single Person Entry (Garba Night & DJ Night)';

    const chosenInclusions = selectedTier === 'couple'
      ? 'Couple Entry (2 Persons): Garba Night and DJ Night Included'
      : 'Single Person Entry (1 Person): Garba Night and DJ Night Included';

    setSubmitting(true);
    try {
      const record = await registerParticipant({
        name: formData.fullName.trim(),
        email: formData.email.trim(),
        phone: formData.whatsappPhone,
        type: 'ticket',
        ticketTier: selectedTier,
        tierName: tierDisplayName,
        partnerName: selectedTier === 'couple' ? formData.partnerName.trim() : '',
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
    const isCouple = createdRecord.ticketTier === 'couple' || createdRecord.tierName?.toLowerCase().includes('couple');
    const passCount = createdRecord.quantity || 1;

    onPassGenerated({
      type: 'ticket',
      code: createdRecord.uniqueCode,
      title: createdRecord.tierName || (isCouple ? '₹450 Couple Entry Pass' : '₹250 Single Person Entry Pass'),
      fullName: createdRecord.partnerName 
        ? `${createdRecord.name} & ${createdRecord.partnerName}` 
        : createdRecord.name,
      email: createdRecord.email,
      phone: createdRecord.phone,
      detail1Label: 'Pass Type & Persons',
      detail1Value: isCouple 
        ? `${passCount} Couple Pass (${passCount * 2} Persons)` 
        : `${passCount} Single Pass (${passCount} Person)`,
      detail2Label: 'Event Inclusions',
      detail2Value: 'Garba Night & DJ Night Included',
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
          Festive Night Passes
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-[#242c18] leading-tight">
          Book Garba &amp; DJ Night Passes
        </h1>
        <p className="mt-3 text-[#556345] text-sm sm:text-base">
          Choose your entry: <strong className="text-[#242c18]">₹250 Single Person Entry</strong> or <strong className="text-[#242c18]">₹450 Couple Entry</strong>. Both passes include complete access to <strong className="text-[#242c18]">Garba Night &amp; DJ Night</strong>!
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

      {/* TOP FESTIVAL HIGHLIGHT: GARBA NIGHT & DJ NIGHT IN BOTH */}
      <div className="mb-10 max-w-4xl mx-auto">
        <div className="bg-[#ede4d2] border-2 border-[#cfc4ad] rounded-3xl p-5 sm:p-7 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-5 border-b border-[#cfc4ad] gap-2">
            <div className="flex items-center gap-2.5">
              <Calendar className="w-5 h-5 text-[#5b6e41]" />
              <div>
                <span className="text-xs uppercase font-extrabold tracking-widest text-[#3b4928] block">
                  Event Highlights
                </span>
                <h2 className="font-serif font-bold text-xl sm:text-2xl text-[#242c18]">
                  Garba Night &amp; DJ Night
                </h2>
              </div>
            </div>
            <div className="text-[11px] font-bold text-[#3b4928] bg-white/80 px-3 py-1 rounded-full border border-[#cfc4ad] self-start sm:self-auto flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#b3832f]" />
              <span>Included in BOTH Passes</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {/* Garba Night Card */}
            <div className="p-5 rounded-2xl bg-white/90 border-2 border-[#e3cca1] shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="inline-block px-3 py-1 rounded-lg bg-[#b3832f] text-white text-xs font-extrabold uppercase tracking-wider shadow-xs">
                    GARBA NIGHT
                  </span>
                  <span className="text-[11px] font-bold text-[#b3832f] uppercase tracking-wide">
                    Dandiya Raas
                  </span>
                </div>
                <div className="font-serif font-bold text-base sm:text-lg text-[#242c18] mb-2 leading-snug">
                  Traditional Rhythms &amp; Dandiya Raas
                </div>
                <p className="text-xs text-[#556345] leading-relaxed">
                  Authentic folk beats, energetic open-air circles, vibrant festive attire, and non-stop celebration for all attendees.
                </p>
              </div>

              <div className="pt-3 mt-4 border-t border-[#dfd7c3] text-[11px] font-bold text-[#8e6822] flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-[#b3832f]" />
                <span>Full Entry Included in ₹250 &amp; ₹450 Passes</span>
              </div>
            </div>

            {/* DJ Night Card */}
            <div className="p-5 rounded-2xl bg-white/90 border-2 border-[#b8cbb0] shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="inline-block px-3 py-1 rounded-lg bg-[#3b4928] text-[#e5d4aa] text-xs font-extrabold uppercase tracking-wider shadow-xs">
                    DJ NIGHT
                  </span>
                  <span className="text-[11px] font-bold text-[#5b6e41] uppercase tracking-wide">
                    EDM Finale
                  </span>
                </div>
                <div className="font-serif font-bold text-base sm:text-lg text-[#242c18] mb-2 leading-snug">
                  Celebrity DJ &amp; Sound Extravaganza
                </div>
                <p className="text-xs text-[#556345] leading-relaxed">
                  High-octane electronic remixes, pulsating bass drops, light shows, and an unforgettable youth festival finale.
                </p>
              </div>

              <div className="pt-3 mt-4 border-t border-[#dfd7c3] text-[11px] font-bold text-[#3b4928] flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-[#5b6e41]" />
                <span>Full Entry Included in ₹250 &amp; ₹450 Passes</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {activeTab === 'book' ? (
        <div className="space-y-10">
          {/* 2 Ticket Options: ₹250 Single Person Entry & ₹450 Couple Entry */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* TICKET 1: ₹250 — SINGLE PERSON ENTRY */}
            <div
              id="tier-card-single_person"
              onClick={() => setSelectedTier('single_person')}
              className={`cursor-pointer rounded-3xl p-6 sm:p-7 border-2 transition-all duration-200 relative flex flex-col justify-between ${
                selectedTier === 'single_person'
                  ? 'bg-[#faf7f0] border-[#3b4928] shadow-lg ring-2 ring-[#3b4928]/20'
                  : 'bg-[#faf8f5] border-[#cfc4ad] hover:border-[#8e9f73] shadow-xs'
              }`}
            >
              <div className="absolute -top-3.5 right-6 px-3.5 py-1 rounded-full bg-[#3b4928] text-[#e5d4aa] text-[11px] font-extrabold uppercase tracking-wider shadow flex items-center gap-1">
                <User className="w-3 h-3 text-[#e5d4aa]" />
                <span>Single Person Entry</span>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h3 className="font-serif font-bold text-2xl text-[#242c18]">
                      Single Person Entry
                    </h3>
                    <span className="text-[11px] text-[#556345] font-semibold">
                      Individual Pass (1 Person)
                    </span>
                  </div>
                  <div
                    className={`w-6 h-6 rounded-full border flex items-center justify-center shrink-0 ${
                      selectedTier === 'single_person'
                        ? 'bg-[#3b4928] border-[#3b4928] text-white'
                        : 'border-[#b8cbb0] bg-white'
                    }`}
                  >
                    {selectedTier === 'single_person' && <Check className="w-4 h-4" />}
                  </div>
                </div>

                {/* Price Display */}
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="font-serif font-extrabold text-4xl text-[#242c18]">
                    ₹250
                  </span>
                  <span className="text-[10px] text-[#556345] uppercase font-bold">
                    / person
                  </span>
                </div>

                {/* Inclusions Pill */}
                <div className="mb-4 p-3 rounded-2xl bg-[#ebf0e2] border-2 border-[#b8cbb0] text-[#242c18] flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-[#3b4928] text-white flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-bold text-xs sm:text-sm text-[#242c18]">
                    ✓ Garba Night &amp; DJ Night Included
                  </span>
                </div>

                <p className="text-xs text-[#556345] mb-4 leading-relaxed font-medium">
                  Entry pass for 1 person including both Garba Night and DJ Night celebrations.
                </p>

                {/* Inclusions List */}
                <div className="pt-4 border-t border-[#dfd7c3] space-y-3">
                  <div className="text-[11px] font-extrabold uppercase tracking-wider text-[#43522f]">
                    Includes:
                  </div>

                  <div className="flex items-start gap-2.5 text-xs text-[#242c18]">
                    <Check className="w-4 h-4 text-[#3b4928] shrink-0 mt-0.5" />
                    <span className="font-semibold">
                      Entry for 1 Person (Single Entry)
                    </span>
                  </div>

                  <div className="flex items-start gap-2.5 text-xs text-[#43522f] pl-1">
                    <span className="w-2 h-2 rounded-full bg-[#b3832f] shrink-0 mt-1.5" />
                    <div>
                      <strong className="text-[#242c18]">Garba Night:</strong> Complete open-circle Dandiya Raas celebration
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 text-xs text-[#43522f] pl-1">
                    <span className="w-2 h-2 rounded-full bg-[#5b6e41] shrink-0 mt-1.5" />
                    <div>
                      <strong className="text-[#242c18]">DJ Night:</strong> Celebrity DJ &amp; EDM youth finale
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 text-xs text-[#43522f]">
                    <Check className="w-4 h-4 text-[#3b4928] shrink-0 mt-0.5" />
                    <span>Official Authenticated Pass with Unique Security Key Code</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-[#dfd7c3] flex items-center justify-between text-xs font-bold text-[#3b4928]">
                <span>Valid: 1 Person • Both Events</span>
                <span className="text-[10px] bg-[#3b4928] text-white px-2 py-0.5 rounded font-mono">
                  SINGLE PASS
                </span>
              </div>
            </div>

            {/* TICKET 2: ₹450 — COUPLE ENTRY */}
            <div
              id="tier-card-couple"
              onClick={() => setSelectedTier('couple')}
              className={`cursor-pointer rounded-3xl p-6 sm:p-7 border-2 transition-all duration-200 relative flex flex-col justify-between ${
                selectedTier === 'couple'
                  ? 'bg-[#faf7f0] border-[#b3832f] shadow-lg ring-2 ring-[#b3832f]/20'
                  : 'bg-[#faf8f5] border-[#cfc4ad] hover:border-[#c59a3f] shadow-xs'
              }`}
            >
              <div className="absolute -top-3.5 right-6 px-3.5 py-1 rounded-full bg-[#b3832f] text-white text-[11px] font-extrabold uppercase tracking-wider shadow flex items-center gap-1">
                <Heart className="w-3 h-3 text-white fill-white" />
                <span>Couple Entry (2 Persons)</span>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h3 className="font-serif font-bold text-2xl text-[#242c18]">
                      Couple Entry
                    </h3>
                    <span className="text-[11px] text-[#556345] font-semibold">
                      Couple Pass (Admits 2 Persons)
                    </span>
                  </div>
                  <div
                    className={`w-6 h-6 rounded-full border flex items-center justify-center shrink-0 ${
                      selectedTier === 'couple'
                        ? 'bg-[#b3832f] border-[#b3832f] text-white'
                        : 'border-[#dfd7c3] bg-white'
                    }`}
                  >
                    {selectedTier === 'couple' && <Check className="w-4 h-4" />}
                  </div>
                </div>

                {/* Price Display */}
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="font-serif font-extrabold text-4xl text-[#242c18]">
                    ₹450
                  </span>
                  <span className="text-[10px] text-[#556345] uppercase font-bold">
                    / couple
                  </span>
                </div>

                {/* Inclusions Pill */}
                <div className="mb-4 p-3 rounded-2xl bg-[#faf6eb] border-2 border-[#e3cca1] text-[#242c18] flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-[#b3832f] text-white flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-bold text-xs sm:text-sm text-[#242c18]">
                    ✓ Garba Night &amp; DJ Night Included (For 2 Persons)
                  </span>
                </div>

                <p className="text-xs text-[#556345] mb-4 leading-relaxed font-medium">
                  Entry pass for Couple (2 persons) including both Garba Night and DJ Night celebrations for both.
                </p>

                {/* Inclusions List */}
                <div className="pt-4 border-t border-[#dfd7c3] space-y-3">
                  <div className="text-[11px] font-extrabold uppercase tracking-wider text-[#43522f]">
                    Includes:
                  </div>

                  <div className="flex items-start gap-2.5 text-xs text-[#242c18]">
                    <Check className="w-4 h-4 text-[#b3832f] shrink-0 mt-0.5" />
                    <span className="font-semibold">
                      Entry for Couple (2 Persons Entry)
                    </span>
                  </div>

                  <div className="flex items-start gap-2.5 text-xs text-[#43522f] pl-1">
                    <span className="w-2 h-2 rounded-full bg-[#b3832f] shrink-0 mt-1.5" />
                    <div>
                      <strong className="text-[#242c18]">Garba Night:</strong> Full admission for both persons
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 text-xs text-[#43522f] pl-1">
                    <span className="w-2 h-2 rounded-full bg-[#5b6e41] shrink-0 mt-1.5" />
                    <div>
                      <strong className="text-[#242c18]">DJ Night:</strong> Full admission for both persons
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 text-xs text-[#43522f]">
                    <Check className="w-4 h-4 text-[#b3832f] shrink-0 mt-0.5" />
                    <span>Official Authenticated Pass with Unique Security Key Code</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-[#dfd7c3] flex items-center justify-between text-xs font-bold text-[#b3832f]">
                <span>Valid: Couple (2 Persons) • Both Events</span>
                <span className="text-[10px] bg-[#b3832f] text-white px-2 py-0.5 rounded font-mono">
                  COUPLE PASS
                </span>
              </div>
            </div>
          </div>

          {/* Booking & Personal Details Form with Live Pass Preview */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-5xl mx-auto items-start">
            
            {/* Form Column */}
            <div className="lg:col-span-7 bg-[#faf8f5] border-2 border-[#dfd7c3] rounded-3xl p-6 sm:p-9 shadow-sm">
              <h2 className="font-serif font-bold text-2xl text-[#1b2413] mb-1">
                Pass Holder Information
              </h2>
              <p className="text-xs text-[#556345] mb-6 flex flex-wrap items-center gap-2">
                <span>Selected:</span>
                <strong className="text-[#1b2413]">
                  {selectedTier === 'couple' ? '₹450 — Couple Entry (2 Persons)' : '₹250 — Single Person Entry (1 Person)'}
                </strong>
                <span className="px-2 py-0.5 rounded bg-[#ebf0e2] text-[#2c3d1d] border border-[#c4d2b5] text-[10px] font-extrabold uppercase tracking-wider">
                  Garba &amp; DJ Night Included
                </span>
              </p>

              {errorMsg && (
                <div className="mb-6 p-4 rounded-xl bg-[#fde8e8] border border-[#f8b4b4] text-[#9b1c1c] text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Pass Tier Toggle */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#3d5228] mb-2">
                    Select Ticket Type
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      id="select-single-tier-btn"
                      onClick={() => setSelectedTier('single_person')}
                      className={`p-3 rounded-2xl border-2 text-left transition-all flex items-center gap-2.5 cursor-pointer ${
                        selectedTier === 'single_person'
                          ? 'bg-[#253319] text-[#fbf8f1] border-[#253319] shadow-sm'
                          : 'bg-white text-[#242c18] border-[#dfd7c3] hover:border-[#8e9f73]'
                      }`}
                    >
                      <User className="w-4 h-4 shrink-0" />
                      <div>
                        <div className="text-xs font-bold">Single Person (₹250)</div>
                        <div className={`text-[10px] ${selectedTier === 'single_person' ? 'text-[#dfb752]' : 'text-[#607147]'}`}>
                          Admits 1 Person
                        </div>
                      </div>
                    </button>

                    <button
                      type="button"
                      id="select-couple-tier-btn"
                      onClick={() => setSelectedTier('couple')}
                      className={`p-3 rounded-2xl border-2 text-left transition-all flex items-center gap-2.5 cursor-pointer ${
                        selectedTier === 'couple'
                          ? 'bg-[#b88a24] text-white border-[#b88a24] shadow-sm'
                          : 'bg-white text-[#242c18] border-[#dfd7c3] hover:border-[#c99e3a]'
                      }`}
                    >
                      <Heart className="w-4 h-4 shrink-0 fill-current" />
                      <div>
                        <div className="text-xs font-bold">Couple Entry (₹450)</div>
                        <div className={`text-[10px] ${selectedTier === 'couple' ? 'text-white/90' : 'text-[#8e6822]'}`}>
                          Admits 2 Persons
                        </div>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Quantity Selector */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#3d5228] mb-2">
                    Number of Passes {selectedTier === 'couple' ? '(Each pass admits 1 Couple / 2 Persons)' : '(Each pass admits 1 Person)'}
                  </label>
                  <div className="flex items-center gap-3">
                    <div className="inline-flex rounded-xl bg-white border border-[#dfd7c3] p-1">
                      {[1, 2, 3, 4, 5, 10].map(q => (
                        <button
                          key={q}
                          type="button"
                          id={`qty-btn-${q}`}
                          onClick={() => setQuantity(q)}
                          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            quantity === q
                              ? selectedTier === 'couple' ? 'bg-[#b88a24] text-white' : 'bg-[#253319] text-[#fbf8f1]'
                              : 'text-[#384626] hover:bg-[#eae1cd]'
                          }`}
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                    <span className="text-xs text-[#556345] font-medium">
                      Total: <strong className="text-base text-[#1b2413]">₹{totalAmount.toLocaleString('en-IN')}</strong>
                    </span>
                  </div>
                </div>

                {/* Primary Full Name */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#3d5228] mb-1.5">
                    Primary Contact Full Name *
                  </label>
                  <input
                    id="ticket-fullname-input"
                    type="text"
                    required
                    placeholder="e.g. Rohan Verma"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white border border-[#dfd7c3] text-sm text-[#242c18] focus:outline-none focus:border-[#253319]"
                  />
                </div>

                {/* Partner Name (for Couple Pass) */}
                {selectedTier === 'couple' && (
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#3d5228] mb-1.5">
                      Partner / Companion Full Name (Optional)
                    </label>
                    <input
                      id="ticket-partner-input"
                      type="text"
                      placeholder="e.g. Ananya Sharma"
                      value={formData.partnerName}
                      onChange={(e) => setFormData({ ...formData, partnerName: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white border border-[#dfd7c3] text-sm text-[#242c18] focus:outline-none focus:border-[#b88a24]"
                    />
                    <span className="text-[11px] text-[#556345] mt-1 block">
                      Will be displayed on the Couple digital pass credential.
                    </span>
                  </div>
                )}

                {/* Email Address */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#3d5228] mb-1.5">
                    Email Address (Pass Delivery) *
                  </label>
                  <input
                    id="ticket-email-input"
                    type="email"
                    required
                    placeholder="e.g. rohan.verma@gmail.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white border border-[#dfd7c3] text-sm text-[#242c18] focus:outline-none focus:border-[#253319]"
                  />
                </div>

                {/* WhatsApp Phone */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#3d5228] mb-1.5">
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
                      className="w-full pl-12 pr-4 py-3 rounded-xl bg-white border border-[#dfd7c3] text-sm text-[#242c18] font-mono focus:outline-none focus:border-[#253319]"
                    />
                  </div>
                </div>

                {/* Inclusions summary banner */}
                <div className="p-4 rounded-2xl bg-[#ede4d2] border border-[#dfd7c3] text-xs text-[#334423] space-y-1.5">
                  <div className="font-bold text-[#1b2413] flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#b88a24]" />
                    <span>Garba Night &amp; DJ Night Included Free</span>
                  </div>
                  <p className="text-[11px] text-[#556345] leading-relaxed">
                    Your pass provides full admission to both evening highlights: the traditional Dandiya Raas and the Celebrity DJ EDM Finale.
                  </p>
                </div>

                {/* Submit Button */}
                <button
                  id="submit-ticket-booking-btn"
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 rounded-2xl bg-[#253319] hover:bg-[#344723] text-[#fbf8f1] font-bold text-sm shadow-lg shadow-black/10 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {submitting ? (
                    <span>Processing &amp; Synchronizing to Firestore...</span>
                  ) : (
                    <>
                      <Ticket className="w-4 h-4 text-[#dfb752]" />
                      <span>Confirm &amp; Book Passes (₹{totalAmount.toLocaleString('en-IN')})</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Live Pass Preview Column */}
            <div className="lg:col-span-5 sticky top-24 space-y-4">
              <div className="text-[11px] font-extrabold uppercase tracking-widest text-[#705315] flex items-center gap-1.5 px-1">
                <Sparkles className="w-3.5 h-3.5 text-[#c99e3a]" />
                <span>Live Digital Pass Preview</span>
              </div>

              {/* The Realistic Pass Card */}
              <div className="bg-[#fbf9f4] border-2 border-[#dfd4be] rounded-3xl overflow-hidden shadow-lg relative">
                {/* Gold Top Header Ribbon */}
                <div className={`p-4 text-center ${selectedTier === 'couple' ? 'bg-[#b88a24]' : 'bg-[#253319]'} text-white`}>
                  <span className="text-[10px] tracking-widest uppercase font-bold text-[#f7f2e4] block">
                    Cultrahus Sangam 2026
                  </span>
                  <div className="font-serif font-bold text-lg sm:text-xl">
                    {selectedTier === 'couple' ? '₹450 Couple Entry Pass' : '₹250 Single Person Pass'}
                  </div>
                  <span className="text-[10px] text-white/90 font-medium">
                    {selectedTier === 'couple' ? 'Admits 2 Persons' : 'Admits 1 Person'}
                  </span>
                </div>

                {/* Notch Holes Simulation */}
                <div className="relative border-b-2 border-dashed border-[#dfd4be] py-4 px-6 bg-white">
                  <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#faf7f0] border-r-2 border-[#dfd4be]" />
                  <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#faf7f0] border-l-2 border-[#dfd4be]" />

                  <div className="text-center space-y-1">
                    <span className="text-[10px] uppercase font-bold text-[#705315] tracking-wider block">
                      Pass Holder
                    </span>
                    <h4 className="font-serif font-extrabold text-xl text-[#1b2413] truncate">
                      {formData.fullName.trim() || 'Attendee Name'}
                    </h4>
                    {selectedTier === 'couple' && (
                      <p className="text-xs text-[#b88a24] font-semibold truncate">
                        &amp; {formData.partnerName.trim() || 'Companion Name'}
                      </p>
                    )}
                  </div>
                </div>

                {/* Pass Details Body */}
                <div className="p-5 space-y-3.5 text-xs text-[#242c18] bg-white">
                  <div className="flex items-center justify-between pb-2 border-b border-[#f0ebd9]">
                    <span className="text-[#637550] text-[11px]">Pass Quantity:</span>
                    <span className="font-bold text-[#1b2413]">
                      {quantity} Pass ({selectedTier === 'couple' ? quantity * 2 : quantity} Persons)
                    </span>
                  </div>

                  <div className="flex items-center justify-between pb-2 border-b border-[#f0ebd9]">
                    <span className="text-[#637550] text-[11px]">Events Included:</span>
                    <span className="font-bold text-[#334423]">Garba Night &amp; DJ Night</span>
                  </div>

                  <div className="flex items-center justify-between pb-2 border-b border-[#f0ebd9]">
                    <span className="text-[#637550] text-[11px]">Total Fee:</span>
                    <span className="font-mono font-extrabold text-sm text-[#1b2413]">
                      ₹{totalAmount.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[#637550] text-[11px]">Verification Status:</span>
                    <span className="px-2 py-0.5 rounded-full bg-[#ebf0e2] text-[#2c3d1d] font-bold text-[10px] uppercase border border-[#b8cbb0]">
                      Official Pass
                    </span>
                  </div>

                  {/* Unique Letter Code Mock graphic */}
                  <div className="mt-4 pt-4 border-t border-[#f0ebd9] space-y-2">
                    <div className="flex items-center justify-between text-[10px] text-[#705315] font-bold uppercase tracking-wider">
                      <span>Unique Security Pass Code</span>
                      <span className="text-[#334423]">Gate Verified</span>
                    </div>
                    <div className="p-3 rounded-xl bg-[#faf7f0] border-2 border-[#c99e3a] text-center shadow-xs">
                      <div className="font-mono font-black text-base text-[#1b2413] tracking-widest">
                        SNGM-TKT-XXXXX
                      </div>
                      <div className="text-[9px] text-[#71825e] mt-0.5">
                        Unique alphanumeric code assigned to each attendee
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Bar */}
                <div className="p-3 bg-[#f5eee1] text-center border-t border-[#dfd4be] text-[10px] text-[#705315] font-semibold">
                  Valid for Cultrahus Sangam • 18 Oct 2026 • Gurgaon University
                </div>
              </div>
            </div>

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
