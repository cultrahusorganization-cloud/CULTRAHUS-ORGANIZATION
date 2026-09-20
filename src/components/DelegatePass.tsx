import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  Award, 
  Search, 
  CheckCircle2, 
  Copy, 
  Printer, 
  ArrowRight, 
  ShieldCheck, 
  AlertCircle,
  Tag
} from 'lucide-react';
import { CultrahusLogo } from './CultrahusLogo';
import { PARLIAMENT_TRACKS, PARTICIPATION_CATEGORIES } from '../data/sangamData';
import { registerParticipant, findByCode } from '../services/registrationService';
import { DigitalPassData, RegistrationRecord } from '../types';

interface DelegatePassProps {
  onPassGenerated: (passData: DigitalPassData) => void;
}

export const DelegatePass: React.FC<DelegatePassProps> = ({ onPassGenerated }) => {
  const [activeTab, setActiveTab] = useState<'register' | 'lookup'>('register');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    whatsappPhone: '',
    institution: '',
    cityState: '',
    participationCategory: PARTICIPATION_CATEGORIES[0],
    parliamentTrack: PARLIAMENT_TRACKS[0],
    priorExperience: '',
    accessCode: '',
  });

  const [lookupCode, setLookupCode] = useState('');
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupError, setLookupError] = useState<string | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [createdRecord, setCreatedRecord] = useState<RegistrationRecord | null>(null);
  const [copied, setCopied] = useState(false);

  // Promo code calculation
  const cleanCode = formData.accessCode.trim().toUpperCase();
  const isFullWaiver = ['SECRETARIAT', 'VIP2026', 'CULTRAHUS', 'FREEPASS', 'GUEST', 'COLLEGE100', 'SPECIAL'].includes(cleanCode);
  const isHalfDiscount = ['SANGAM50', 'STUDENT50', 'HALF50'].includes(cleanCode);
  const calculatedFee = isFullWaiver ? 0 : isHalfDiscount ? 325 : 650;

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 10);
    setFormData(prev => ({ ...prev, whatsappPhone: val }));
    if (errorMsg && errorMsg.toLowerCase().includes('phone')) setErrorMsg(null);
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^a-zA-Z\s,.-]/g, '');
    setFormData(prev => ({ ...prev, cityState: val }));
    if (errorMsg && errorMsg.toLowerCase().includes('city')) setErrorMsg(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!formData.fullName.trim()) {
      setErrorMsg('Please enter your full legal name.');
      return;
    }
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    if (!/^\d{10}$/.test(formData.whatsappPhone)) {
      setErrorMsg('WhatsApp phone must be exactly 10 digits without spaces or country code.');
      return;
    }
    if (!formData.cityState.trim()) {
      setErrorMsg('Please enter your city and state.');
      return;
    }

    setSubmitting(true);
    try {
      const record = await registerParticipant({
        name: formData.fullName.trim(),
        email: formData.email.trim(),
        phone: formData.whatsappPhone,
        organization: formData.institution.trim() || 'Independent Artist',
        cityState: formData.cityState.trim(),
        type: 'delegate',
        participationCategory: formData.participationCategory,
        parliamentTrack: formData.parliamentTrack,
        priorExperience: formData.priorExperience.trim(),
        accessCode: formData.accessCode.trim(),
        amountPaid: calculatedFee,
        source: 'vercel',
      });

      setCreatedRecord(record);

      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {
        // ignore
      }

      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error('Registration failed:', err);
      setErrorMsg('An unexpected error occurred during registration. Please verify your connection.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    const q = lookupCode.trim().toUpperCase();
    if (!q) {
      setLookupError('Please enter an accreditation code (e.g. SNGM-DEL-XXXXX) or 10-digit WhatsApp phone.');
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
        setLookupError(`No accreditation found for "${q}". Please check your code or register anew.`);
      }
    } catch {
      setLookupError('Failed to lookup record. Please try again.');
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
      type: 'delegate',
      code: createdRecord.uniqueCode,
      title: `Accredited Delegate: ${createdRecord.participationCategory || 'Performing Arts'}`,
      fullName: createdRecord.name,
      email: createdRecord.email,
      phone: createdRecord.phone,
      detail1Label: 'Institution / College',
      detail1Value: createdRecord.organization || 'Independent Artist',
      detail2Label: 'Parliament Track',
      detail2Value: createdRecord.parliamentTrack || 'National Performing Arts Policy',
      feePaid: createdRecord.amountPaid === 0 ? '₹0 (Waived with Code)' : `₹${createdRecord.amountPaid} (Accredited)`,
      status: 'Accredited & Confirmed',
      issuedIst: new Date(createdRecord.createdAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-10 flex flex-col items-center">
        <CultrahusLogo size="md" className="mb-3" />
        <span className="text-xs uppercase tracking-widest text-[#5b6e41] font-extrabold block mb-2">
          Cultural Parliament &amp; Conclave
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-[#242c18] leading-tight">
          Delegate Accreditation
        </h1>
        <p className="mt-3 text-[#556345] text-sm sm:text-base">
          Accreditation pass grants you all-day VIP access to all 5 festival stages, Conclave Monograph kit, voting rights in the Cultural Parliament, and certificate of representation.
        </p>
      </div>

      {/* Mode Tabs */}
      <div className="flex justify-center mb-8">
        <div className="inline-flex p-1 rounded-xl bg-[#ede4d2] border border-[#cfc4ad]">
          <button
            id="tab-register-delegate"
            onClick={() => { setActiveTab('register'); setErrorMsg(null); }}
            className={`px-5 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'register'
                ? 'bg-[#3b4928] text-[#f7f4ec] shadow-sm'
                : 'text-[#384626] hover:text-[#192111]'
            }`}
          >
            Register New (₹650)
          </button>
          <button
            id="tab-lookup-delegate"
            onClick={() => { setActiveTab('lookup'); setLookupError(null); }}
            className={`px-5 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'lookup'
                ? 'bg-[#3b4928] text-[#f7f4ec] shadow-sm'
                : 'text-[#384626] hover:text-[#192111]'
            }`}
          >
            Lookup Existing Pass
          </button>
        </div>
      </div>

      {/* Success Notification & Pass Display */}
      {createdRecord && (
        <div className="mb-8 space-y-6 animate-in fade-in-50 duration-300">
          <div className="p-5 rounded-2xl bg-[#ebf0e2] border border-[#b8cbb0] text-[#242c18] flex items-start justify-between gap-4 shadow-sm">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-6 h-6 text-[#475731] shrink-0 mt-0.5" />
              <div>
                <h3 className="font-serif font-bold text-lg text-[#242c18]">
                  Accreditation Confirmed &amp; Synchronized!
                </h3>
                <p className="text-xs text-[#556345] mt-1">
                  Your unique tracking code is{' '}
                  <span className="font-mono font-bold text-[#242c18] bg-white px-2 py-0.5 rounded border border-[#b8cbb0]">
                    {createdRecord.uniqueCode}
                  </span>
                  . Saved in Firestore database and immediately visible in the Admin Portal.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                id="copy-delegate-code-btn"
                onClick={handleCopy}
                className="px-3 py-2 bg-white hover:bg-[#f4efe4] border border-[#cfc4ad] text-[#242c18] rounded-xl text-xs font-bold transition flex items-center gap-1 shadow-2xs"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copied ? 'Copied!' : 'Copy Code'}</span>
              </button>
              <button
                id="view-delegate-pass-btn"
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

      {/* Main Form Container */}
      {activeTab === 'register' ? (
        <div className="bg-[#faf8f5] border-2 border-[#cfc4ad] rounded-3xl p-6 sm:p-10 shadow-sm">
          {errorMsg && (
            <div className="mb-6 p-4 rounded-xl bg-[#fde8e8] border border-[#f8b4b4] text-[#9b1c1c] text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#43522f] mb-1.5">
                  Full Legal Name *
                </label>
                <input
                  id="delegate-fullname-input"
                  type="text"
                  required
                  placeholder="e.g. Ananya Sharma"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white border border-[#cfc4ad] text-sm text-[#242c18] focus:outline-none focus:border-[#3b4928] focus:ring-1 focus:ring-[#3b4928]"
                />
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#43522f] mb-1.5">
                  Email Address *
                </label>
                <input
                  id="delegate-email-input"
                  type="email"
                  required
                  placeholder="e.g. ananya@university.edu"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white border border-[#cfc4ad] text-sm text-[#242c18] focus:outline-none focus:border-[#3b4928] focus:ring-1 focus:ring-[#3b4928]"
                />
              </div>

              {/* WhatsApp Phone */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#43522f] mb-1.5">
                  WhatsApp Mobile (10 Digits) *
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-3 text-sm font-mono text-[#71825e]">+91</span>
                  <input
                    id="delegate-phone-input"
                    type="tel"
                    required
                    maxLength={10}
                    placeholder="9876543210"
                    value={formData.whatsappPhone}
                    onChange={handlePhoneChange}
                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-white border border-[#cfc4ad] text-sm text-[#242c18] focus:outline-none focus:border-[#3b4928] focus:ring-1 focus:ring-[#3b4928] font-mono"
                  />
                </div>
              </div>

              {/* City and State */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#43522f] mb-1.5">
                  City &amp; State (Alphabets Only) *
                </label>
                <input
                  id="delegate-city-input"
                  type="text"
                  required
                  placeholder="e.g. Bhiwadi, Rajasthan"
                  value={formData.cityState}
                  onChange={handleCityChange}
                  className="w-full px-4 py-3 rounded-xl bg-white border border-[#cfc4ad] text-sm text-[#242c18] focus:outline-none focus:border-[#3b4928] focus:ring-1 focus:ring-[#3b4928]"
                />
              </div>

              {/* Institution / College */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#43522f] mb-1.5">
                  College / Theatre Institution / Society
                </label>
                <input
                  id="delegate-institution-input"
                  type="text"
                  placeholder="e.g. National School of Drama or Delhi University"
                  value={formData.institution}
                  onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white border border-[#cfc4ad] text-sm text-[#242c18] focus:outline-none focus:border-[#3b4928] focus:ring-1 focus:ring-[#3b4928]"
                />
              </div>

              {/* Participation Category */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#43522f] mb-1.5">
                  Artistic / Participation Category
                </label>
                <select
                  id="delegate-category-select"
                  value={formData.participationCategory}
                  onChange={(e) => setFormData({ ...formData, participationCategory: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white border border-[#cfc4ad] text-sm text-[#242c18] focus:outline-none focus:border-[#3b4928] focus:ring-1 focus:ring-[#3b4928]"
                >
                  {PARTICIPATION_CATEGORIES.map((cat, i) => (
                    <option key={i} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Cultural Parliament Track */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#43522f] mb-1.5">
                Cultural Parliament Deliberation Track
              </label>
              <select
                id="delegate-track-select"
                value={formData.parliamentTrack}
                onChange={(e) => setFormData({ ...formData, parliamentTrack: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-white border border-[#cfc4ad] text-sm text-[#242c18] focus:outline-none focus:border-[#3b4928] focus:ring-1 focus:ring-[#3b4928]"
              >
                {PARLIAMENT_TRACKS.map((track, i) => (
                  <option key={i} value={track}>{track}</option>
                ))}
              </select>
            </div>

            {/* Prior Experience / Statement */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#43522f] mb-1.5">
                Prior Stage Experience / Statement of Intent (Optional)
              </label>
              <textarea
                id="delegate-experience-input"
                rows={2}
                placeholder="Briefly state your theatre/dance background or purpose of attendance..."
                value={formData.priorExperience}
                onChange={(e) => setFormData({ ...formData, priorExperience: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#cfc4ad] text-sm text-[#242c18] focus:outline-none focus:border-[#3b4928] focus:ring-1 focus:ring-[#3b4928]"
              />
            </div>

            {/* Access / Waiver Code */}
            <div className="p-4 rounded-2xl bg-[#ede4d2] border border-[#dfd7c3]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#242c18]">
                    <Tag className="w-3.5 h-3.5 text-[#5b6e41]" />
                    <span>Secretariat / Promo Code (Optional)</span>
                  </div>
                  <p className="text-[11px] text-[#556345] mt-0.5">
                    Valid codes: <code className="font-mono font-bold text-[#3b4928]">SECRETARIAT</code>, <code className="font-mono font-bold text-[#3b4928]">VIP2026</code>, <code className="font-mono font-bold text-[#3b4928]">SANGAM50</code>
                  </p>
                </div>

                <div className="sm:w-64">
                  <input
                    id="delegate-promocode-input"
                    type="text"
                    placeholder="Enter Code (e.g. VIP2026)"
                    value={formData.accessCode}
                    onChange={(e) => setFormData({ ...formData, accessCode: e.target.value.toUpperCase() })}
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#cfc4ad] text-xs font-mono uppercase text-[#242c18] focus:outline-none focus:border-[#3b4928]"
                  />
                </div>
              </div>

              {cleanCode && (
                <div className="mt-3 pt-2 border-t border-[#dfd7c3] text-xs font-semibold flex items-center justify-between">
                  <span className="text-[#3b4928]">
                    {isFullWaiver
                      ? '✓ 100% Institutional Waiver Applied'
                      : isHalfDiscount
                      ? '✓ 50% Student Discount Applied'
                      : 'Standard Accreditation Rate'}
                  </span>
                  <span className="font-mono text-sm font-bold text-[#242c18]">
                    Registration Fee: ₹{calculatedFee}
                  </span>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                id="submit-delegate-btn"
                type="submit"
                disabled={submitting}
                className="w-full py-4 rounded-xl bg-[#3b4928] hover:bg-[#485932] text-[#f7f4ec] font-bold text-sm shadow-lg shadow-black/10 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {submitting ? (
                  <span>Registering &amp; Synchronizing to Firestore...</span>
                ) : (
                  <>
                    <Award className="w-4 h-4 text-[#e5d4aa]" />
                    <span>Complete Delegate Accreditation ({calculatedFee === 0 ? 'Free with Code' : `₹${calculatedFee}`})</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* Lookup Form */
        <div className="bg-[#faf8f5] border-2 border-[#cfc4ad] rounded-3xl p-6 sm:p-10 shadow-sm max-w-xl mx-auto">
          <div className="text-center mb-6">
            <Search className="w-8 h-8 text-[#5b6e41] mx-auto mb-2" />
            <h2 className="font-serif font-bold text-xl text-[#242c18]">
              Lookup Your Pass Code
            </h2>
            <p className="text-xs text-[#556345] mt-1">
              Enter the unique reference code (e.g. SNGM-DEL-XXXXX) or registered 10-digit WhatsApp number.
            </p>
          </div>

          {lookupError && (
            <div className="mb-4 p-3.5 rounded-xl bg-[#fde8e8] border border-[#f8b4b4] text-[#9b1c1c] text-xs">
              {lookupError}
            </div>
          )}

          <form onSubmit={handleLookup} className="space-y-4">
            <input
              id="lookup-code-input"
              type="text"
              required
              placeholder="e.g. SNGM-DEL-8801A or 9818561227"
              value={lookupCode}
              onChange={(e) => setLookupCode(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white border border-[#cfc4ad] text-sm text-[#242c18] font-mono focus:outline-none focus:border-[#3b4928]"
            />

            <button
              id="submit-lookup-btn"
              type="submit"
              disabled={lookupLoading}
              className="w-full py-3 rounded-xl bg-[#3b4928] hover:bg-[#485932] text-[#f7f4ec] text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {lookupLoading ? 'Searching Firestore Records...' : 'Verify & Retrieve Pass'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
