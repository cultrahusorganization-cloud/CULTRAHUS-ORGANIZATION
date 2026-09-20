import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  Users, 
  CheckCircle2, 
  Copy, 
  Printer, 
  AlertCircle, 
  Theater, 
  Sparkles,
  FileText
} from 'lucide-react';
import { CultrahusLogo } from './CultrahusLogo';
import { registerTroupe } from '../services/registrationService';
import { DigitalPassData, RegistrationRecord } from '../types';

interface TroupeEntryProps {
  onPassGenerated: (passData: DigitalPassData) => void;
}

export const TroupeEntry: React.FC<TroupeEntryProps> = ({ onPassGenerated }) => {
  const [formData, setFormData] = useState({
    troupeName: '',
    playTitle: '',
    playwright: '',
    director: '',
    contactPerson: '',
    email: '',
    whatsappPhone: '',
    category: 'Proscenium Stage Drama',
    castCrewCount: 12,
    durationMinutes: 45,
    synopsis: '',
    technicalRider: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [createdRecord, setCreatedRecord] = useState<RegistrationRecord | null>(null);
  const [copied, setCopied] = useState(false);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 10);
    setFormData(prev => ({ ...prev, whatsappPhone: val }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!formData.troupeName.trim()) {
      setErrorMsg('Please enter the troupe or collegiate theatre society name.');
      return;
    }
    if (!formData.playTitle.trim()) {
      setErrorMsg('Please enter the title of the play/production.');
      return;
    }
    if (!formData.director.trim()) {
      setErrorMsg('Please enter the director / choreographer name.');
      return;
    }
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      setErrorMsg('Please enter a valid official email address.');
      return;
    }
    if (!/^\d{10}$/.test(formData.whatsappPhone)) {
      setErrorMsg('WhatsApp phone must be 10 digits.');
      return;
    }
    if (!formData.synopsis.trim() || formData.synopsis.trim().length < 30) {
      setErrorMsg('Please provide a synopsis of at least 30 characters.');
      return;
    }

    setSubmitting(true);
    try {
      const record = await registerTroupe({
        troupeName: formData.troupeName.trim(),
        playTitle: formData.playTitle.trim(),
        playwright: formData.playwright.trim(),
        director: formData.director.trim(),
        contactPerson: formData.contactPerson.trim() || formData.director.trim(),
        email: formData.email.trim(),
        whatsappPhone: formData.whatsappPhone,
        category: formData.category,
        castCrewCount: Number(formData.castCrewCount) || 10,
        durationMinutes: Number(formData.durationMinutes) || 45,
        synopsis: formData.synopsis.trim(),
        technicalRider: formData.technicalRider.trim(),
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
      console.error('Troupe registration failed:', err);
      setErrorMsg('Failed to submit troupe dossier. Please try again.');
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
      type: 'troupe',
      code: createdRecord.uniqueCode,
      title: `Troupe Dossier: ${createdRecord.troupeName || createdRecord.organization}`,
      fullName: `${createdRecord.director || createdRecord.name} (Director)`,
      email: createdRecord.email,
      phone: createdRecord.phone,
      detail1Label: 'Production Title',
      detail1Value: `"${createdRecord.playTitle}" (${createdRecord.participationCategory})`,
      detail2Label: 'Cast & Crew Size',
      detail2Value: `${createdRecord.castCrewCount || 10} Artists • ${createdRecord.durationMinutes || 45} Mins`,
      feePaid: 'Curated Selection (Review Underway)',
      status: 'Dossier Under Review',
      issuedIst: new Date(createdRecord.createdAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto mb-10 flex flex-col items-center">
        <CultrahusLogo size="md" className="mb-3" />
        <span className="text-xs uppercase tracking-widest text-[#5b6e41] font-extrabold block mb-2">
          Curated Showcase &amp; Competition
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-[#242c18] leading-tight">
          Troupe &amp; Play Registration
        </h1>
        <p className="mt-3 text-[#556345] text-sm sm:text-base">
          Submit your collegiate theatre society or proscenium ensemble dossier. 16 stage productions and 24 street plays will be curated for the National Championship.
        </p>
      </div>

      {/* Success Notification */}
      {createdRecord && (
        <div className="mb-8 p-5 rounded-2xl bg-[#ebf0e2] border border-[#b8cbb0] text-[#242c18] flex items-start justify-between gap-4 shadow-sm animate-in fade-in-50 duration-300">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-6 h-6 text-[#475731] shrink-0 mt-0.5" />
            <div>
              <h3 className="font-serif font-bold text-lg text-[#242c18]">
                Troupe Dossier Registered!
              </h3>
              <p className="text-xs text-[#556345] mt-1">
                Your official troupe tracking code is{' '}
                <span className="font-mono font-bold text-[#242c18] bg-white px-2 py-0.5 rounded border border-[#b8cbb0]">
                  {createdRecord.uniqueCode}
                </span>
                . Saved into Firestore database under plays/troupes.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="copy-troupe-code-btn"
              onClick={handleCopy}
              className="px-3 py-2 bg-white hover:bg-[#f4efe4] border border-[#cfc4ad] text-[#242c18] rounded-xl text-xs font-bold transition flex items-center gap-1"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{copied ? 'Copied!' : 'Copy Code'}</span>
            </button>
            <button
              id="view-troupe-dossier-btn"
              onClick={openBadgeModal}
              className="px-4 py-2 bg-[#364325] hover:bg-[#475731] text-[#d7c494] rounded-xl text-xs font-bold transition shadow flex items-center gap-1.5 border border-[#5b6e41]/50"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / View Dossier</span>
            </button>
          </div>
        </div>
      )}

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
            {/* Troupe Name */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#43522f] mb-1.5">
                Troupe / Society Name *
              </label>
              <input
                id="troupe-name-input"
                type="text"
                required
                placeholder="e.g. Shunya The Natya Society"
                value={formData.troupeName}
                onChange={(e) => setFormData({ ...formData, troupeName: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-white border border-[#cfc4ad] text-sm text-[#242c18] focus:outline-none focus:border-[#3b4928]"
              />
            </div>

            {/* Play Title */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#43522f] mb-1.5">
                Play / Production Title *
              </label>
              <input
                id="play-title-input"
                type="text"
                required
                placeholder="e.g. Ashadh Ka Ek Din (Adapter)"
                value={formData.playTitle}
                onChange={(e) => setFormData({ ...formData, playTitle: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-white border border-[#cfc4ad] text-sm text-[#242c18] focus:outline-none focus:border-[#3b4928]"
              />
            </div>

            {/* Playwright */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#43522f] mb-1.5">
                Original Playwright / Author
              </label>
              <input
                id="playwright-input"
                type="text"
                placeholder="e.g. Mohan Rakesh / Original Devised"
                value={formData.playwright}
                onChange={(e) => setFormData({ ...formData, playwright: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-white border border-[#cfc4ad] text-sm text-[#242c18] focus:outline-none focus:border-[#3b4928]"
              />
            </div>

            {/* Director */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#43522f] mb-1.5">
                Director / Choreographer *
              </label>
              <input
                id="director-input"
                type="text"
                required
                placeholder="e.g. Siddharth Sen"
                value={formData.director}
                onChange={(e) => setFormData({ ...formData, director: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-white border border-[#cfc4ad] text-sm text-[#242c18] focus:outline-none focus:border-[#3b4928]"
              />
            </div>

            {/* Contact Email */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#43522f] mb-1.5">
                Troupe Email *
              </label>
              <input
                id="troupe-email-input"
                type="email"
                required
                placeholder="e.g. society@college.edu"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-white border border-[#cfc4ad] text-sm text-[#242c18] focus:outline-none focus:border-[#3b4928]"
              />
            </div>

            {/* WhatsApp Phone */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#43522f] mb-1.5">
                WhatsApp Phone (Director / POC) *
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-3 text-sm font-mono text-[#71825e]">+91</span>
                <input
                  id="troupe-phone-input"
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

            {/* Performance Category */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#43522f] mb-1.5">
                Category
              </label>
              <select
                id="troupe-category-select"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-white border border-[#cfc4ad] text-sm text-[#242c18] focus:outline-none focus:border-[#3b4928]"
              >
                <option value="Proscenium Stage Drama">Proscenium Stage Drama</option>
                <option value="Street Play (Nukkad Natak)">Street Play (Nukkad Natak)</option>
                <option value="Contemporary Physical Theatre">Contemporary Physical Theatre</option>
                <option value="Classical / Folk Natya">Classical / Folk Natya</option>
              </select>
            </div>

            {/* Cast & Crew Count and Duration */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#43522f] mb-1.5">
                  Cast &amp; Crew
                </label>
                <input
                  id="troupe-cast-input"
                  type="number"
                  min={1}
                  max={60}
                  value={formData.castCrewCount}
                  onChange={(e) => setFormData({ ...formData, castCrewCount: Number(e.target.value) })}
                  className="w-full px-4 py-3 rounded-xl bg-white border border-[#cfc4ad] text-sm text-[#242c18] focus:outline-none focus:border-[#3b4928]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#43522f] mb-1.5">
                  Duration (Mins)
                </label>
                <input
                  id="troupe-duration-input"
                  type="number"
                  min={5}
                  max={120}
                  value={formData.durationMinutes}
                  onChange={(e) => setFormData({ ...formData, durationMinutes: Number(e.target.value) })}
                  className="w-full px-4 py-3 rounded-xl bg-white border border-[#cfc4ad] text-sm text-[#242c18] focus:outline-none focus:border-[#3b4928]"
                />
              </div>
            </div>
          </div>

          {/* Synopsis */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#43522f] mb-1.5">
              Production Synopsis &amp; Thematic Core *
            </label>
            <textarea
              id="troupe-synopsis-input"
              rows={3}
              required
              placeholder="Detail the narrative arc, central socio-political or aesthetic dialogue, and style of performance..."
              value={formData.synopsis}
              onChange={(e) => setFormData({ ...formData, synopsis: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-white border border-[#cfc4ad] text-sm text-[#242c18] focus:outline-none focus:border-[#3b4928]"
            />
          </div>

          {/* Technical Rider */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#43522f] mb-1.5">
              Technical Rider &amp; Stage Requirements (Optional)
            </label>
            <textarea
              id="troupe-rider-input"
              rows={2}
              placeholder="Number of lapels, hand mics, blackout cues, specific lighting colors, or props required..."
              value={formData.technicalRider}
              onChange={(e) => setFormData({ ...formData, technicalRider: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-white border border-[#cfc4ad] text-sm text-[#242c18] focus:outline-none focus:border-[#3b4928]"
            />
          </div>

          {/* Submit */}
          <button
            id="submit-troupe-dossier-btn"
            type="submit"
            disabled={submitting}
            className="w-full py-4 rounded-xl bg-[#3b4928] hover:bg-[#485932] text-[#f7f4ec] font-bold text-sm shadow-lg shadow-black/10 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {submitting ? (
              <span>Submitting Troupe Dossier to Firestore...</span>
            ) : (
              <>
                <FileText className="w-4 h-4 text-[#e5d4aa]" />
                <span>Submit Troupe Dossier for Curated Selection</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
