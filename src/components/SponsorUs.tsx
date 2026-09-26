import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  Handshake, 
  Check, 
  CheckCircle2, 
  Copy, 
  Printer, 
  AlertCircle, 
  Sparkles, 
  Building2 
} from 'lucide-react';
import { CultrahusLogo } from './CultrahusLogo';
import { SPONSOR_TIERS, SponsorTier } from '../data/sangamData';
import { registerSponsor } from '../services/registrationService';
import { DigitalPassData, RegistrationRecord } from '../types';

interface SponsorUsProps {
  onPassGenerated: (passData: DigitalPassData) => void;
}

export const SponsorUs: React.FC<SponsorUsProps> = ({ onPassGenerated }) => {
  const [selectedTier, setSelectedTier] = useState<string>('Presenting Partner');
  const [formData, setFormData] = useState({
    brandName: '',
    contactPerson: '',
    email: '',
    whatsappPhone: '',
    cityState: '',
    proposalNotes: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [createdRecord, setCreatedRecord] = useState<RegistrationRecord | null>(null);
  const [copied, setCopied] = useState(false);

  const activeTierObj = SPONSOR_TIERS.find(t => t.name === selectedTier) || SPONSOR_TIERS[3];

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 10);
    setFormData(prev => ({ ...prev, whatsappPhone: val }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!formData.brandName.trim()) {
      setErrorMsg('Please enter your company or brand name.');
      return;
    }
    if (!formData.contactPerson.trim()) {
      setErrorMsg('Please enter the contact person / representative name.');
      return;
    }
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      setErrorMsg('Please enter a valid corporate email address.');
      return;
    }
    if (!/^\d{10}$/.test(formData.whatsappPhone)) {
      setErrorMsg('WhatsApp phone must be 10 digits.');
      return;
    }

    setSubmitting(true);
    try {
      const record = await registerSponsor({
        brandName: formData.brandName.trim(),
        contactPerson: formData.contactPerson.trim(),
        email: formData.email.trim(),
        whatsappPhone: formData.whatsappPhone,
        cityState: formData.cityState.trim() || 'NCR',
        sponsorTier: selectedTier,
        proposalNotes: formData.proposalNotes.trim(),
        amount: activeTierObj.amount,
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
      console.error('Sponsorship inquiry failed:', err);
      setErrorMsg('Failed to submit sponsorship request. Please try again.');
    } finally {
      setSubmitting(false);
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
      type: 'sponsor',
      code: createdRecord.uniqueCode,
      title: `Patronage: ${createdRecord.sponsorTier || selectedTier}`,
      fullName: createdRecord.name,
      email: createdRecord.email,
      phone: createdRecord.phone,
      detail1Label: 'Partner Brand',
      detail1Value: createdRecord.brandName || createdRecord.organization || 'Corporate Partner',
      detail2Label: 'Sponsorship Value',
      detail2Value: `${activeTierObj.rateLabel} Commitment`,
      feePaid: activeTierObj.rateLabel,
      status: 'Inquiry & Partnership Registered',
      issuedIst: new Date(createdRecord.createdAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto mb-12 flex flex-col items-center">
        <CultrahusLogo size="md" className="mb-3" />
        <span className="text-xs uppercase tracking-widest text-[#5b6e41] font-extrabold block mb-2">
          Corporate &amp; Cultural Patronage
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-[#242c18] leading-tight">
          Sponsor Sangam 2026
        </h1>
        <p className="mt-3 text-[#556345] text-sm sm:text-base">
          Position your brand at the premier cultural gathering of 1,200+ delegates, collegiate theatre society leaders, and distinguished dignitaries (Venue TBA).
        </p>
      </div>

      {/* Success Notification */}
      {createdRecord && (
        <div className="mb-10 max-w-3xl mx-auto p-5 rounded-2xl bg-[#ebf0e2] border border-[#b8cbb0] text-[#242c18] flex items-start justify-between gap-4 shadow-sm animate-in fade-in-50 duration-300">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-6 h-6 text-[#475731] shrink-0 mt-0.5" />
            <div>
              <h3 className="font-serif font-bold text-lg text-[#242c18]">
                Sponsorship Intent Registered!
              </h3>
              <p className="text-xs text-[#556345] mt-1">
                Your partnership tracking code is{' '}
                <span className="font-mono font-bold text-[#242c18] bg-white px-2 py-0.5 rounded border border-[#b8cbb0]">
                  {createdRecord.uniqueCode}
                </span>
                . The Secretariat Outreach directorate will initiate formal corporate deliverables.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="copy-sponsor-code-btn"
              onClick={handleCopy}
              className="px-3 py-2 bg-white hover:bg-[#f4efe4] border border-[#cfc4ad] text-[#242c18] rounded-xl text-xs font-bold transition flex items-center gap-1"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{copied ? 'Copied!' : 'Copy Code'}</span>
            </button>
            <button
              id="view-sponsor-dossier-btn"
              onClick={openBadgeModal}
              className="px-4 py-2 bg-[#364325] hover:bg-[#475731] text-[#d7c494] rounded-xl text-xs font-bold transition shadow flex items-center gap-1.5 border border-[#5b6e41]/50"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / View Intent</span>
            </button>
          </div>
        </div>
      )}

      {/* 4 Sponsor Packages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {SPONSOR_TIERS.map((tier) => {
          const isSelected = selectedTier === tier.name;
          return (
            <div
              key={tier.id}
              id={`sponsor-tier-${tier.id}`}
              onClick={() => setSelectedTier(tier.name)}
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
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#556345] block mb-1">
                  Patronage Package
                </span>
                <h3 className="font-serif font-bold text-xl text-[#242c18] mb-1">
                  {tier.name}
                </h3>
                <div className="font-serif font-extrabold text-2xl text-[#3b4928] mb-3">
                  {tier.rateLabel}
                </div>
                <p className="text-xs text-[#556345] mb-5 leading-relaxed">
                  {tier.headline}
                </p>

                <div className="pt-4 border-t border-[#dfd7c3] space-y-2">
                  {tier.features.map((f, i) => (
                    <div key={i} className="flex items-start gap-2 text-[11px] text-[#43522f]">
                      <Check className="w-3.5 h-3.5 text-[#5b6e41] shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-[#dfd7c3]">
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setSelectedTier(tier.name); }}
                  className={`w-full py-2.5 rounded-xl text-xs font-bold transition text-center ${
                    isSelected
                      ? 'bg-[#3b4928] text-[#f7f4ec]'
                      : 'bg-[#ede4d2] text-[#242c18] hover:bg-[#e2d6bf]'
                  }`}
                >
                  {isSelected ? 'Selected Package' : 'Select Package'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Inquiry Form */}
      <div className="bg-[#faf8f5] border-2 border-[#cfc4ad] rounded-3xl p-6 sm:p-10 shadow-sm max-w-2xl mx-auto">
        <div className="flex items-center gap-2 mb-2">
          <Building2 className="w-6 h-6 text-[#3b4928]" />
          <h2 className="font-serif font-bold text-2xl text-[#242c18]">
            Brand Sponsorship Dossier
          </h2>
        </div>
        <p className="text-xs text-[#556345] mb-6">
          Selected tier: <strong className="text-[#242c18]">{selectedTier} ({activeTierObj.rateLabel})</strong>
        </p>

        {errorMsg && (
          <div className="mb-6 p-4 rounded-xl bg-[#fde8e8] border border-[#f8b4b4] text-[#9b1c1c] text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Brand Name */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#43522f] mb-1.5">
                Brand / Organization Name *
              </label>
              <input
                id="sponsor-brand-input"
                type="text"
                required
                placeholder="e.g. FabIndia / Tata Tea"
                value={formData.brandName}
                onChange={(e) => setFormData({ ...formData, brandName: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-white border border-[#cfc4ad] text-sm text-[#242c18] focus:outline-none focus:border-[#3b4928]"
              />
            </div>

            {/* Contact Person */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#43522f] mb-1.5">
                Representative / Lead *
              </label>
              <input
                id="sponsor-contact-input"
                type="text"
                required
                placeholder="e.g. Vikram Malhotra"
                value={formData.contactPerson}
                onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-white border border-[#cfc4ad] text-sm text-[#242c18] focus:outline-none focus:border-[#3b4928]"
              />
            </div>

            {/* Corporate Email */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#43522f] mb-1.5">
                Corporate Email *
              </label>
              <input
                id="sponsor-email-input"
                type="email"
                required
                placeholder="e.g. partnerships@brand.com"
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
                  id="sponsor-phone-input"
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
          </div>

          {/* City & State */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#43522f] mb-1.5">
              Headquarters / City &amp; State
            </label>
            <input
              id="sponsor-city-input"
              type="text"
              placeholder="e.g. Mumbai, Maharashtra"
              value={formData.cityState}
              onChange={(e) => setFormData({ ...formData, cityState: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#cfc4ad] text-sm text-[#242c18] focus:outline-none focus:border-[#3b4928]"
            />
          </div>

          {/* Partnership Notes */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#43522f] mb-1.5">
              Brand Objectives &amp; Desired Activations
            </label>
            <textarea
              id="sponsor-notes-input"
              rows={3}
              placeholder="e.g. Sampling booth at promenade, co-branded stage award for Best Proscenium Director..."
              value={formData.proposalNotes}
              onChange={(e) => setFormData({ ...formData, proposalNotes: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#cfc4ad] text-sm text-[#242c18] focus:outline-none focus:border-[#3b4928]"
            />
          </div>

          {/* Submit */}
          <button
            id="submit-sponsor-dossier-btn"
            type="submit"
            disabled={submitting}
            className="w-full py-4 rounded-xl bg-[#3b4928] hover:bg-[#485932] text-[#f7f4ec] font-bold text-sm shadow-lg shadow-black/10 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {submitting ? (
              <span>Submitting Sponsorship Proposal to Firestore...</span>
            ) : (
              <>
                <Handshake className="w-4 h-4 text-[#e5d4aa]" />
                <span>Submit {selectedTier} ({activeTierObj.rateLabel}) Intent</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
