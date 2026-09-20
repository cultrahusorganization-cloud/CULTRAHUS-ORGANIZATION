import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  Briefcase, 
  CheckCircle2, 
  Copy, 
  Printer, 
  AlertCircle, 
  Users, 
  Layers, 
  PenTool, 
  Share2, 
  Calculator 
} from 'lucide-react';
import { CultrahusLogo } from './CultrahusLogo';
import { SECRETARIAT_DEPTS } from '../data/sangamData';
import { registerSecretariat } from '../services/registrationService';
import { DigitalPassData, RegistrationRecord } from '../types';

interface JoinSecretariatProps {
  onPassGenerated: (passData: DigitalPassData) => void;
}

export const JoinSecretariat: React.FC<JoinSecretariatProps> = ({ onPassGenerated }) => {
  const [selectedDept, setSelectedDept] = useState<string>('MANAGEMENT');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    whatsappPhone: '',
    previousExperience: '',
    whyJoin: '',
    timeCommitment: '10-15 Hours / Week',
    referredBy: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [createdRecord, setCreatedRecord] = useState<RegistrationRecord | null>(null);
  const [copied, setCopied] = useState(false);

  const deptIcons: Record<string, React.ReactNode> = {
    MANAGEMENT: <Layers className="w-5 h-5 text-[#3b4928]" />,
    CONTENT: <PenTool className="w-5 h-5 text-[#3b4928]" />,
    GRAPHICS: <Briefcase className="w-5 h-5 text-[#3b4928]" />,
    OUTREACH: <Share2 className="w-5 h-5 text-[#3b4928]" />,
    FINANCE: <Calculator className="w-5 h-5 text-[#3b4928]" />,
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 10);
    setFormData(prev => ({ ...prev, whatsappPhone: val }));
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
      setErrorMsg('WhatsApp phone must be 10 digits.');
      return;
    }
    if (!formData.whyJoin.trim() || formData.whyJoin.trim().length < 20) {
      setErrorMsg('Please write a brief statement on why you wish to join (minimum 20 characters).');
      return;
    }

    setSubmitting(true);
    try {
      const record = await registerSecretariat({
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        whatsappPhone: formData.whatsappPhone,
        department: selectedDept,
        previousExperience: formData.previousExperience.trim(),
        whyJoin: formData.whyJoin.trim(),
        timeCommitment: formData.timeCommitment,
        referredBy: formData.referredBy.trim(),
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
      console.error('Secretariat application failed:', err);
      setErrorMsg('Failed to submit application. Please try again.');
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
      type: 'secretariat',
      code: createdRecord.uniqueCode,
      title: `Secretariat Candidate: ${createdRecord.department || selectedDept}`,
      fullName: createdRecord.name,
      email: createdRecord.email,
      phone: createdRecord.phone,
      detail1Label: 'Department Track',
      detail1Value: createdRecord.department || selectedDept,
      detail2Label: 'Weekly Commitment',
      detail2Value: createdRecord.timeCommitment || '10-15 Hours / Week',
      feePaid: 'Official Council Candidate',
      status: 'Application Under Review',
      issuedIst: new Date(createdRecord.createdAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto mb-10 flex flex-col items-center">
        <CultrahusLogo size="md" className="mb-3" />
        <span className="text-xs uppercase tracking-widest text-[#5b6e41] font-extrabold block mb-2">
          Leadership &amp; Directorate
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-[#242c18] leading-tight">
          Join the Secretariat
        </h1>
        <p className="mt-3 text-[#556345] text-sm sm:text-base">
          Work with India’s foremost dramaturges, stage designers, and youth leaders to organize Cultrahus Sangam 2026.
        </p>
      </div>

      {/* Success Notification */}
      {createdRecord && (
        <div className="mb-8 p-5 rounded-2xl bg-[#ebf0e2] border border-[#b8cbb0] text-[#242c18] flex items-start justify-between gap-4 shadow-sm animate-in fade-in-50 duration-300">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-6 h-6 text-[#475731] shrink-0 mt-0.5" />
            <div>
              <h3 className="font-serif font-bold text-lg text-[#242c18]">
                Secretariat Application Submitted!
              </h3>
              <p className="text-xs text-[#556345] mt-1">
                Your applicant reference code is{' '}
                <span className="font-mono font-bold text-[#242c18] bg-white px-2 py-0.5 rounded border border-[#b8cbb0]">
                  {createdRecord.uniqueCode}
                </span>
                . Saved to Firestore database under secretariat.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="copy-secretariat-code-btn"
              onClick={handleCopy}
              className="px-3 py-2 bg-white hover:bg-[#f4efe4] border border-[#cfc4ad] text-[#242c18] rounded-xl text-xs font-bold transition flex items-center gap-1"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{copied ? 'Copied!' : 'Copy Code'}</span>
            </button>
            <button
              id="view-secretariat-pass-btn"
              onClick={openBadgeModal}
              className="px-4 py-2 bg-[#364325] hover:bg-[#475731] text-[#d7c494] rounded-xl text-xs font-bold transition shadow flex items-center gap-1.5 border border-[#5b6e41]/50"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / View Credential</span>
            </button>
          </div>
        </div>
      )}

      {/* Department Selector */}
      <div className="mb-8">
        <label className="block text-xs font-bold uppercase tracking-wider text-[#43522f] mb-3 text-center">
          Choose Your Department of Focus
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {SECRETARIAT_DEPTS.map((dept) => {
            const isSelected = selectedDept === dept.id;
            return (
              <button
                key={dept.id}
                type="button"
                id={`dept-btn-${dept.id}`}
                onClick={() => setSelectedDept(dept.id)}
                className={`p-3 rounded-2xl border text-center transition-all ${
                  isSelected
                    ? 'bg-[#3b4928] text-[#f7f4ec] border-[#242c18] shadow-md'
                    : 'bg-[#faf8f5] text-[#242c18] border-[#cfc4ad] hover:border-[#8e9f73]'
                }`}
              >
                <div className="flex justify-center mb-1.5">
                  {React.cloneElement(deptIcons[dept.id] as React.ReactElement<any>, {
                    className: `w-5 h-5 ${isSelected ? 'text-[#e5d4aa]' : 'text-[#3b4928]'}`
                  })}
                </div>
                <div className="text-xs font-extrabold tracking-wide">{dept.label}</div>
              </button>
            );
          })}
        </div>
        <p className="text-center text-xs text-[#556345] mt-2">
          {SECRETARIAT_DEPTS.find(d => d.id === selectedDept)?.description}
        </p>
      </div>

      {/* Form */}
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
                id="sec-fullname-input"
                type="text"
                required
                placeholder="e.g. Aarav Mehta"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-white border border-[#cfc4ad] text-sm text-[#242c18] focus:outline-none focus:border-[#3b4928]"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#43522f] mb-1.5">
                Email Address *
              </label>
              <input
                id="sec-email-input"
                type="email"
                required
                placeholder="e.g. aarav@gmail.com"
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
                  id="sec-phone-input"
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

            {/* Time Commitment */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#43522f] mb-1.5">
                Availability Commitment
              </label>
              <select
                id="sec-commitment-select"
                value={formData.timeCommitment}
                onChange={(e) => setFormData({ ...formData, timeCommitment: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-white border border-[#cfc4ad] text-sm text-[#242c18] focus:outline-none focus:border-[#3b4928]"
              >
                <option value="5-10 Hours / Week">5-10 Hours / Week</option>
                <option value="10-15 Hours / Week">10-15 Hours / Week (Standard)</option>
                <option value="15-20 Hours / Week">15-20 Hours / Week (Core Team)</option>
                <option value="Full-Time Resident">Full-Time Resident Conclave Lead</option>
              </select>
            </div>
          </div>

          {/* Past Experience */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#43522f] mb-1.5">
              Relevant Experience (Collegiate Fests / MUNs / Stage Productions)
            </label>
            <input
              id="sec-experience-input"
              type="text"
              placeholder="e.g. Head of Production at DU Fest 2025; Graphic designer for theatre society..."
              value={formData.previousExperience}
              onChange={(e) => setFormData({ ...formData, previousExperience: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-white border border-[#cfc4ad] text-sm text-[#242c18] focus:outline-none focus:border-[#3b4928]"
            />
          </div>

          {/* Why Join */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#43522f] mb-1.5">
              Why do you want to join the Cultrahus Sangam Secretariat? *
            </label>
            <textarea
              id="sec-whyjoin-input"
              rows={3}
              required
              placeholder="Share what value you bring to the department and what motivates you to lead this conclave..."
              value={formData.whyJoin}
              onChange={(e) => setFormData({ ...formData, whyJoin: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-white border border-[#cfc4ad] text-sm text-[#242c18] focus:outline-none focus:border-[#3b4928]"
            />
          </div>

          {/* Referred By */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#43522f] mb-1.5">
              Referred By (Optional)
            </label>
            <input
              id="sec-referral-input"
              type="text"
              placeholder="Name of secretariat member or campus ambassador who referred you"
              value={formData.referredBy}
              onChange={(e) => setFormData({ ...formData, referredBy: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#cfc4ad] text-sm text-[#242c18] focus:outline-none focus:border-[#3b4928]"
            />
          </div>

          {/* Submit */}
          <button
            id="submit-sec-application-btn"
            type="submit"
            disabled={submitting}
            className="w-full py-4 rounded-xl bg-[#3b4928] hover:bg-[#485932] text-[#f7f4ec] font-bold text-sm shadow-lg shadow-black/10 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {submitting ? (
              <span>Submitting Application to Firestore...</span>
            ) : (
              <>
                <Briefcase className="w-4 h-4 text-[#e5d4aa]" />
                <span>Submit Secretariat Application</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
