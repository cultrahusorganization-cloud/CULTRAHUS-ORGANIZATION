import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  Mail, 
  Phone, 
  MapPin, 
  CheckCircle2, 
  Send, 
  AlertCircle, 
  Clock, 
  ShieldCheck,
  MessageSquare
} from 'lucide-react';
import { CultrahusLogo } from './CultrahusLogo';
import { registerInquiry } from '../services/registrationService';
import { RegistrationRecord } from '../types';

export const ContactUs: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    whatsappPhone: '',
    category: 'Delegate Accreditation',
    subject: '',
    message: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [createdRecord, setCreatedRecord] = useState<RegistrationRecord | null>(null);

  const categories = [
    'Delegate Accreditation',
    'Ticket Booking & Seating',
    'Troupe / Play Selection',
    'Sponsorship & Brand',
    'Press & Media Access',
    'Other General Inquiry'
  ];

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 10);
    setFormData(prev => ({ ...prev, whatsappPhone: val }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!formData.fullName.trim()) {
      setErrorMsg('Please enter your name.');
      return;
    }
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    if (!formData.message.trim() || formData.message.trim().length < 15) {
      setErrorMsg('Please enter a message of at least 15 characters.');
      return;
    }

    setSubmitting(true);
    try {
      const record = await registerInquiry({
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        whatsappPhone: formData.whatsappPhone,
        category: formData.category,
        subject: formData.subject.trim(),
        message: formData.message.trim(),
      });

      setCreatedRecord(record);

      try {
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 }
        });
      } catch {
        // ignore
      }

      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error('Inquiry submission failed:', err);
      setErrorMsg('Failed to send message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto flex flex-col items-center">
        <CultrahusLogo size="md" className="mb-3" />
        <span className="text-xs uppercase tracking-widest text-[#5b6e41] font-extrabold block mb-2">
          Central Directorate Helpdesk
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-[#242c18] leading-tight">
          Contact Secretariat
        </h1>
        <p className="mt-3 text-[#556345] text-sm sm:text-base">
          Have questions about accreditation, troupe riders, ticketing, or brand sponsorships? Our team is at your disposal.
        </p>
      </div>

      {/* Success Notification */}
      {createdRecord && (
        <div className="p-5 rounded-2xl bg-[#ebf0e2] border border-[#b8cbb0] text-[#242c18] flex items-start gap-4 shadow-sm animate-in fade-in-50 duration-300 max-w-2xl mx-auto">
          <CheckCircle2 className="w-6 h-6 text-[#475731] shrink-0 mt-0.5" />
          <div>
            <h3 className="font-serif font-bold text-lg text-[#242c18]">
              Inquiry Dispatched Successfully!
            </h3>
            <p className="text-xs text-[#556345] mt-1">
              Your message reference code is{' '}
              <span className="font-mono font-bold text-[#242c18] bg-white px-2 py-0.5 rounded border border-[#b8cbb0]">
                {createdRecord.uniqueCode}
              </span>
              . Saved into Firestore database under inquiries. A secretariat officer will contact you within 24 hours.
            </p>
          </div>
        </div>
      )}

      {/* Grid: Left Contact Cards, Right Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Information Cards */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-[#ede4d2] border-2 border-[#cfc4ad] rounded-3xl p-6 shadow-sm space-y-5">
            <h3 className="font-serif font-bold text-xl text-[#242c18]">
              Official Secretariat Desk
            </h3>
            <p className="text-xs text-[#556345] leading-relaxed">
              Cultrahus Sangam 2026 Executive Office handles institutional delegations, jury briefings, and pass inquiries.
            </p>

            <div className="space-y-4 text-xs pt-2">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-white text-[#3b4928] border border-[#dfd7c3]">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-[#242c18] block">Email Communications</span>
                  <a
                    href="mailto:cultrahusorganization@gmail.com"
                    className="text-[#556345] hover:text-[#242c18] hover:underline"
                  >
                    cultrahusorganization@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-white text-[#3b4928] border border-[#dfd7c3]">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-[#242c18] block">WhatsApp &amp; Helpline</span>
                  <a
                    href="tel:+919818561227"
                    className="text-[#556345] hover:text-[#242c18] hover:underline font-mono"
                  >
                    +91 98185 61227
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-white text-[#3b4928] border border-[#dfd7c3]">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-[#242c18] block">Conclave Venue</span>
                  <span className="text-[#556345]">TBA (To Be Announced) • National Capital Region (NCR), India</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-white text-[#3b4928] border border-[#dfd7c3]">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-[#242c18] block">Helpdesk Hours</span>
                  <span className="text-[#556345]">Monday – Saturday: 10:00 AM – 8:00 PM IST</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Form */}
        <div className="lg:col-span-7 bg-[#faf8f5] border-2 border-[#cfc4ad] rounded-3xl p-6 sm:p-8 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <MessageSquare className="w-5 h-5 text-[#3b4928]" />
            <h2 className="font-serif font-bold text-2xl text-[#242c18]">
              Send an Official Message
            </h2>
          </div>
          <p className="text-xs text-[#556345] mb-6">
            Directly routed to the corresponding Secretariat desk.
          </p>

          {errorMsg && (
            <div className="mb-6 p-4 rounded-xl bg-[#fde8e8] border border-[#f8b4b4] text-[#9b1c1c] text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#43522f] mb-1">
                  Full Name *
                </label>
                <input
                  id="inq-fullname-input"
                  type="text"
                  required
                  placeholder="e.g. Priyanshu Sharma"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#cfc4ad] text-xs text-[#242c18] focus:outline-none focus:border-[#3b4928]"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#43522f] mb-1">
                  Email Address *
                </label>
                <input
                  id="inq-email-input"
                  type="email"
                  required
                  placeholder="e.g. priyanshu@gmail.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#cfc4ad] text-xs text-[#242c18] focus:outline-none focus:border-[#3b4928]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* WhatsApp Phone */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#43522f] mb-1">
                  WhatsApp Phone (Optional)
                </label>
                <input
                  id="inq-phone-input"
                  type="tel"
                  maxLength={10}
                  placeholder="9876543210"
                  value={formData.whatsappPhone}
                  onChange={handlePhoneChange}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#cfc4ad] text-xs text-[#242c18] font-mono focus:outline-none focus:border-[#3b4928]"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#43522f] mb-1">
                  Inquiry Topic
                </label>
                <select
                  id="inq-category-select"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#cfc4ad] text-xs text-[#242c18] focus:outline-none focus:border-[#3b4928]"
                >
                  {categories.map((cat, i) => (
                    <option key={i} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Subject */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#43522f] mb-1">
                Subject
              </label>
              <input
                id="inq-subject-input"
                type="text"
                placeholder="e.g. Delegation of 15 members from IIT Delhi"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#cfc4ad] text-xs text-[#242c18] focus:outline-none focus:border-[#3b4928]"
              />
            </div>

            {/* Message */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#43522f] mb-1">
                Message *
              </label>
              <textarea
                id="inq-message-input"
                rows={4}
                required
                placeholder="Write your query or institutional request..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#cfc4ad] text-xs text-[#242c18] focus:outline-none focus:border-[#3b4928]"
              />
            </div>

            {/* Submit */}
            <button
              id="submit-inquiry-btn"
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 rounded-xl bg-[#3b4928] hover:bg-[#485932] text-[#f7f4ec] font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {submitting ? (
                <span>Dispatching Message to Firestore...</span>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5 text-[#e5d4aa]" />
                  <span>Send Message to Secretariat</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
