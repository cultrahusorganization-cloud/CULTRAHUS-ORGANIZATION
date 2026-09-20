import React, { useState } from 'react';
import { registerParticipant } from '../services/registrationService';
import { RegistrationRecord, RegistrationType } from '../types';
import { useTheme } from '../context/ThemeContext';
import confetti from 'canvas-confetti';
import { 
  CheckCircle, 
  Copy, 
  Download, 
  QrCode, 
  Ticket, 
  UserCheck, 
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Building,
  Mail,
  User,
  Phone,
  Check
} from 'lucide-react';

interface Props {
  onRegisteredSuccess?: (record: RegistrationRecord) => void;
  defaultType?: RegistrationType;
  appSource?: 'vercel' | 'gemini_app' | 'direct';
}

export const RegistrationForm: React.FC<Props> = ({
  onRegisteredSuccess,
  defaultType = 'delegate',
  appSource = 'vercel'
}) => {
  const { theme, config } = useTheme();
  const [type, setType] = useState<RegistrationType>(defaultType);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [organization, setOrganization] = useState('');
  const [designation, setDesignation] = useState('');
  const [ticketTier, setTicketTier] = useState<'Standard' | 'VIP' | 'Speaker' | 'Student' | 'Executive'>('Standard');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successRecord, setSuccessRecord] = useState<RegistrationRecord | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [printNotice, setPrintNotice] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim() || !email.trim()) {
      setErrorMsg('Please enter your full name and email address.');
      return;
    }

    try {
      setIsSubmitting(true);
      const record = await registerParticipant({
        name,
        email,
        phone,
        organization,
        designation,
        type,
        ticketTier: type === 'ticket' ? ticketTier : undefined,
        amountPaid: type === 'ticket' ? (ticketTier === 'VIP' ? 99 : ticketTier === 'Executive' ? 149 : 49) : 0,
        source: appSource,
      });

      // Celebration confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {
        // silent if blocked
      }

      setSuccessRecord(record);
      if (onRegisteredSuccess) {
        onRegisteredSuccess(record);
      }
    } catch (err: any) {
      console.error('Registration failed:', err);
      setErrorMsg('Something went wrong during registration. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyCode = async (code: string) => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(code);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = code;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
    } catch {
      // Fallback
    }
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const handlePrint = () => {
    try {
      window.print();
    } catch {
      setPrintNotice('Direct print is restricted in the preview sandbox. You can copy your unique pass code above or open in a new tab.');
      setTimeout(() => setPrintNotice(null), 5000);
    }
  };

  const handleReset = () => {
    setSuccessRecord(null);
    setName('');
    setEmail('');
    setPhone('');
    setOrganization('');
    setDesignation('');
    setPrintNotice(null);
  };

  if (successRecord) {
    return (
      <div id="registration-success-card" className={`max-w-xl mx-auto rounded-2xl shadow-2xl border overflow-hidden transition-all duration-300 ${config.cardBg} ${config.cardBorder} ${config.textPrimary}`}>
        {/* Pass Top Banner */}
        <div className={`p-6 relative overflow-hidden text-white ${theme === 'light' ? 'bg-stone-900' : 'bg-zinc-900/90'}`}>
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <QrCode className="w-32 h-32" />
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase mb-2" style={{ color: config.dotColor }}>
            <Sparkles className="w-4 h-4" /> Registration Confirmed
          </div>
          <h2 className="text-2xl font-bold tracking-tight">Cultrahus Pass & Badge</h2>
          <p className="text-zinc-300 text-sm mt-1">
            Your unique code is generated and saved directly to the Firebase admin database.
          </p>
        </div>

        {/* Badge Body */}
        <div className="p-6 md:p-8 space-y-6">
          {/* Unique Code Showcase */}
          <div 
            className="border-2 border-dashed rounded-2xl p-5 text-center relative group"
            style={{ 
              borderColor: `${config.dotColor}60`, 
              backgroundColor: `${config.dotColor}12` 
            }}
          >
            <span className="text-xs font-bold uppercase tracking-widest block mb-1" style={{ color: config.dotColor }}>
              Your Unique Pass Code
            </span>
            <div className="text-3xl md:text-4xl font-mono font-black tracking-wider select-all py-1">
              {successRecord.uniqueCode}
            </div>
            <p className={`text-xs mt-1 ${config.textMuted}`}>
              Keep this code ready at the gate. Everyone receives a distinct code.
            </p>
            <button
              id="copy-code-btn"
              onClick={() => handleCopyCode(successRecord.uniqueCode)}
              className={`mt-3 inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold rounded-full shadow-sm transition-colors cursor-pointer ${config.primaryButton}`}
            >
              {copiedCode ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-300" /> Copied to Clipboard
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" /> Copy Pass Code
                </>
              )}
            </button>
          </div>

          {/* Attendee Details */}
          <div className={`grid grid-cols-2 gap-4 text-sm p-4 rounded-xl border ${config.inputBg}`}>
            <div>
              <span className={`text-xs block ${config.textMuted}`}>Attendee</span>
              <span className="font-semibold">{successRecord.name}</span>
            </div>
            <div>
              <span className={`text-xs block ${config.textMuted}`}>Category</span>
              <span className="inline-flex items-center gap-1 font-semibold capitalize">
                {successRecord.type === 'delegate' ? (
                  <UserCheck className="w-3.5 h-3.5" style={{ color: config.dotColor }} />
                ) : (
                  <Ticket className="w-3.5 h-3.5" style={{ color: config.dotColor }} />
                )}
                {successRecord.type} {successRecord.ticketTier ? `(${successRecord.ticketTier})` : ''}
              </span>
            </div>
            <div>
              <span className={`text-xs block ${config.textMuted}`}>Email</span>
              <span className="truncate block opacity-90">{successRecord.email}</span>
            </div>
            <div>
              <span className={`text-xs block ${config.textMuted}`}>Organization</span>
              <span className="truncate block opacity-90">
                {successRecord.organization || 'Independent'}
              </span>
            </div>
            <div>
              <span className={`text-xs block ${config.textMuted}`}>Database Status</span>
              <span className="inline-flex items-center gap-1 text-xs text-emerald-400 font-medium">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> Synced to Firebase
              </span>
            </div>
            <div>
              <span className={`text-xs block ${config.textMuted}`}>Channel Source</span>
              <span className="text-xs font-mono px-2 py-0.5 rounded border border-white/10 uppercase">
                {successRecord.source}
              </span>
            </div>
          </div>

          {printNotice && (
            <div className="p-3 bg-amber-500/10 border border-amber-500/30 text-amber-300 rounded-xl text-xs">
              {printNotice}
            </div>
          )}

          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <button
              id="register-another-btn"
              onClick={handleReset}
              className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-semibold transition cursor-pointer text-center ${config.primaryButton}`}
            >
              Register Another Person
            </button>
            <button
              id="print-pass-btn"
              onClick={handlePrint}
              className={`py-2.5 px-4 rounded-xl border text-sm font-medium transition flex items-center justify-center gap-2 cursor-pointer ${config.secondaryButton}`}
            >
              <Download className="w-4 h-4" /> Print Pass
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="registration-form-card" className={`max-w-xl mx-auto rounded-2xl shadow-xl border overflow-hidden transition-all duration-200 ${config.cardBg} ${config.cardBorder} ${config.textPrimary}`}>
      {/* Header */}
      <div className={`p-6 md:p-8 border-b ${config.cardBorder} ${theme === 'light' ? 'bg-stone-900 text-white' : 'bg-zinc-900/90 text-white'}`}>
        <div className="flex items-center justify-between">
          <div className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide uppercase border ${config.accentBadge}`}>
            <ShieldCheck className="w-3.5 h-3.5" /> Official Registration
          </div>
          <span className="text-xs text-zinc-400 font-mono">Real-time Firebase Sync</span>
        </div>
        <h2 className="text-2xl font-bold tracking-tight mt-3">Register for Cultrahus</h2>
        <p className="text-zinc-300 text-sm mt-1">
          Instant badge issuance. Every applicant gets a unique encrypted code synced with the Admin Portal.
        </p>

        {/* Type Switcher: Delegate vs Ticket */}
        <div className="mt-6 p-1 bg-zinc-950/60 rounded-xl grid grid-cols-2 gap-1 border border-zinc-800">
          <button
            type="button"
            id="tab-delegate-btn"
            onClick={() => setType('delegate')}
            className={`py-2 px-3 text-xs md:text-sm font-medium rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
              type === 'delegate'
                ? config.activeNavTab
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <UserCheck className="w-4 h-4" /> Delegate Pass
          </button>
          <button
            type="button"
            id="tab-ticket-btn"
            onClick={() => setType('ticket')}
            className={`py-2 px-3 text-xs md:text-sm font-medium rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
              type === 'ticket'
                ? config.activeNavTab
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Ticket className="w-4 h-4" /> Event Ticket
          </button>
        </div>
      </div>

      {/* Form Content */}
      <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-4">
        {errorMsg && (
          <div className="p-3 text-sm text-red-400 bg-red-950/40 rounded-xl border border-red-800">
            {errorMsg}
          </div>
        )}

        <div>
          <label className={`block text-xs font-semibold uppercase tracking-wider mb-1.5 ${config.textMuted}`}>
            Full Name *
          </label>
          <div className="relative">
            <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 opacity-50" />
            <input
              id="input-name"
              type="text"
              required
              placeholder="e.g. Maya Lin"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-sm transition outline-hidden border ${config.inputBg}`}
            />
          </div>
        </div>

        <div>
          <label className={`block text-xs font-semibold uppercase tracking-wider mb-1.5 ${config.textMuted}`}>
            Email Address *
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 opacity-50" />
            <input
              id="input-email"
              type="email"
              required
              placeholder="e.g. maya@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-sm transition outline-hidden border ${config.inputBg}`}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={`block text-xs font-semibold uppercase tracking-wider mb-1.5 ${config.textMuted}`}>
              Phone Number
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 opacity-50" />
              <input
                id="input-phone"
                type="tel"
                placeholder="+1 555-0199"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-sm transition outline-hidden border ${config.inputBg}`}
              />
            </div>
          </div>

          <div>
            <label className={`block text-xs font-semibold uppercase tracking-wider mb-1.5 ${config.textMuted}`}>
              Organization / Company
            </label>
            <div className="relative">
              <Building className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 opacity-50" />
              <input
                id="input-org"
                type="text"
                placeholder="Cultrahus Org / Agency"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-sm transition outline-hidden border ${config.inputBg}`}
              />
            </div>
          </div>
        </div>

        {type === 'delegate' ? (
          <div>
            <label className={`block text-xs font-semibold uppercase tracking-wider mb-1.5 ${config.textMuted}`}>
              Designation / Role
            </label>
            <input
              id="input-designation"
              type="text"
              placeholder="e.g. Lead Delegate, Speaker, Ambassador"
              value={designation}
              onChange={(e) => setDesignation(e.target.value)}
              className={`w-full px-4 py-2.5 rounded-xl text-sm transition outline-hidden border ${config.inputBg}`}
            />
          </div>
        ) : (
          <div>
            <label className={`block text-xs font-semibold uppercase tracking-wider mb-1.5 ${config.textMuted}`}>
              Ticket Tier
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['Standard', 'VIP', 'Executive'] as const).map((tier) => (
                <button
                  type="button"
                  key={tier}
                  onClick={() => setTicketTier(tier)}
                  className={`py-2 px-3 text-xs font-semibold rounded-xl border text-center transition cursor-pointer ${
                    ticketTier === tier
                      ? `${config.activeNavTab} ring-2 ring-white/20`
                      : `${config.secondaryButton} border-zinc-700/60`
                  }`}
                >
                  <div>{tier}</div>
                  <div className="opacity-70 text-[11px] font-normal">
                    {tier === 'Standard' ? '$49' : tier === 'VIP' ? '$99' : '$149'}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="pt-3">
          <button
            type="submit"
            id="submit-registration-btn"
            disabled={isSubmitting}
            className={`w-full py-3.5 px-6 rounded-xl font-bold transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 ${config.primaryButton}`}
          >
            {isSubmitting ? (
              <span>Generating Unique Badge & Syncing...</span>
            ) : (
              <>
                <span>Complete {type === 'delegate' ? 'Delegate' : 'Ticket'} Registration</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

        <p className={`text-center text-xs pt-1 ${config.textMuted}`}>
          Data stores directly into Firebase Firestore in real-time. Accessible globally on Vercel & Admin Portal.
        </p>
      </form>
    </div>
  );
};
