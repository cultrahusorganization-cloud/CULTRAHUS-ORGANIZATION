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
  ShieldCheck,
  Utensils
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
  const [selectedTier, setSelectedTier] = useState<TicketTier['id']>('royal');
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

  const currentTier = TICKET_TIERS.find(t => t.id === selectedTier) || TICKET_TIERS[1];
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

    setSubmitting(true);
    try {
      const record = await registerParticipant({
        name: formData.fullName.trim(),
        email: formData.email.trim(),
        phone: formData.whatsappPhone,
        type: 'ticket',
        ticketTier: selectedTier,
        tierName: currentTier.name,
        quantity,
        foodAddon: currentTier.food,
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
    onPassGenerated({
      type: 'ticket',
      code: createdRecord.uniqueCode,
      title: createdRecord.tierName || `${currentTier.name} (${createdRecord.quantity || 1} Pass)`,
      fullName: createdRecord.name,
      email: createdRecord.email,
      phone: createdRecord.phone,
      detail1Label: 'Pass Quantity',
      detail1Value: `${createdRecord.quantity || 1} Pass(es)`,
      detail2Label: 'Festival Inclusions',
      detail2Value: createdRecord.ticketTier === 'sovereign'
        ? 'Royal Dining Included + Garba & DJ Night'
        : createdRecord.ticketTier === 'royal'
        ? 'High Tea Box + Garba & DJ Night Included'
        : 'Garba & DJ Night Included (No Food)',
      feePaid: `₹${(createdRecord.amountPaid || totalAmount).toLocaleString('en-IN')}`,
      status: 'Confirmed & Validated',
      issuedIst: new Date(createdRecord.createdAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto mb-8 flex flex-col items-center">
        <CultrahusLogo size="md" className="mb-3" />
        <span className="text-xs uppercase tracking-widest text-[#5b6e41] font-extrabold block mb-2">
          Auditorium &amp; Festival Conclave Passes
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-[#242c18] leading-tight">
          Book Conclave Passes
        </h1>
        <p className="mt-3 text-[#556345] text-sm sm:text-base">
          Choose your pass tier and select quantities. Every pass includes full access to <strong className="text-[#242c18]">Garba Night &amp; DJ Night</strong> celebrations!
        </p>
      </div>

      {/* Mode Tabs */}
      <div className="flex justify-center mb-10">
        <div className="inline-flex p-1 rounded-xl bg-[#ede4d2] border border-[#cfc4ad]">
          <button
            id="tab-book-ticket"
            onClick={() => { setActiveTab('book'); setErrorMsg(null); }}
            className={`px-5 py-2 rounded-lg text-xs font-bold transition-all ${
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
            className={`px-5 py-2 rounded-lg text-xs font-bold transition-all ${
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
          <div className="p-5 rounded-2xl bg-[#ebf0e2] border border-[#b8cbb0] text-[#242c18] flex items-start justify-between gap-4 shadow-sm">
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
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                id="copy-ticket-code-btn"
                onClick={handleCopy}
                className="px-3 py-2 bg-white hover:bg-[#f4efe4] border border-[#cfc4ad] text-[#242c18] rounded-xl text-xs font-bold transition flex items-center gap-1"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copied ? 'Copied!' : 'Copy Code'}</span>
              </button>
              <button
                id="view-ticket-pass-btn"
                onClick={openBadgeModal}
                className="px-4 py-2 bg-[#364325] hover:bg-[#475731] text-[#d7c494] rounded-xl text-xs font-bold transition shadow flex items-center gap-1.5 border border-[#5b6e41]/50"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print / View Pass</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'book' ? (
        <div className="space-y-10">
          {/* 3 Ticket Tier Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TICKET_TIERS.map((tier) => {
              const isSelected = selectedTier === tier.id;
              return (
                <div
                  key={tier.id}
                  id={`tier-card-${tier.id}`}
                  onClick={() => setSelectedTier(tier.id)}
                  className={`cursor-pointer rounded-3xl p-6 border-2 transition-all duration-200 relative flex flex-col justify-between ${
                    isSelected
                      ? 'bg-[#faf7f0] border-[#3b4928] shadow-lg ring-2 ring-[#3b4928]/20'
                      : 'bg-[#faf8f5] border-[#cfc4ad] hover:border-[#8e9f73] shadow-xs'
                  }`}
                >
                  {tier.badge && (
                    <div className="absolute -top-3 right-6 px-3 py-0.5 rounded-full bg-[#3b4928] text-[#e5d4aa] text-[10px] font-bold uppercase tracking-wider shadow">
                      {tier.badge}
                    </div>
                  )}

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-serif font-bold text-xl text-[#242c18]">
                        {tier.name}
                      </h3>
                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                          isSelected
                            ? 'bg-[#3b4928] border-[#3b4928] text-white'
                            : 'border-[#b8cbb0] bg-white'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5" />}
                      </div>
                    </div>

                    <div className="flex items-baseline gap-2 mb-3">
                      <span className="font-serif font-extrabold text-3xl text-[#242c18]">
                        ₹{tier.price}
                      </span>
                      <span className="text-xs text-[#8e9f73] line-through font-normal">
                        ₹{tier.originalPrice}
                      </span>
                      <span className="text-[10px] text-[#556345] uppercase font-bold">
                        / pass
                      </span>
                    </div>

                    <p className="text-xs text-[#556345] mb-5 leading-relaxed">
                      {tier.description}
                    </p>

                    <div className="pt-4 border-t border-[#dfd7c3] space-y-2">
                      {tier.features.map((feat, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs text-[#43522f]">
                          <Check className="w-3.5 h-3.5 text-[#5b6e41] shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-[#dfd7c3]">
                    <span className="text-[11px] font-bold text-[#3b4928] flex items-center gap-1.5">
                      <Utensils className="w-3.5 h-3.5" />
                      <span>{tier.food}</span>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Booking & Personal Details Form */}
          <div className="bg-[#faf8f5] border-2 border-[#cfc4ad] rounded-3xl p-6 sm:p-10 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-serif font-bold text-2xl text-[#242c18] mb-1">
              Pass Holder Information
            </h2>
            <p className="text-xs text-[#556345] mb-6">
              Selected: <strong className="text-[#242c18]">{currentTier.name} (₹{currentTier.price})</strong>
            </p>

            {errorMsg && (
              <div className="mb-6 p-4 rounded-xl bg-[#fde8e8] border border-[#f8b4b4] text-[#9b1c1c] text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
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
                        className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
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

              {/* Inclusions summary */}
              <div className="p-4 rounded-2xl bg-[#ede4d2] border border-[#dfd7c3] text-xs text-[#3b4928] space-y-1">
                <div className="font-bold text-[#242c18] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#5b6e41]" />
                  <span>Garba &amp; DJ Night Included Free</span>
                </div>
                <p className="text-[11px] text-[#556345]">
                  Your pass provides full admission to both evening highlights: the traditional Dandiya Raas and the Celebrity DJ EDM Finale.
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
