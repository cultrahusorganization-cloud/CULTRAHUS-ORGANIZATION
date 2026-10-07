import React, { useState } from 'react';
import { 
  X, 
  Printer, 
  ShieldCheck, 
  CheckCircle2, 
  Calendar, 
  MapPin, 
  Sparkles,
  Copy,
  Check,
  Key,
  Lock
} from 'lucide-react';
import { CultrahusLogo } from './CultrahusLogo';
import { DigitalPassData } from '../types';

interface DigitalPassModalProps {
  passData: DigitalPassData | null;
  onClose: () => void;
}

export const DigitalPassModal: React.FC<DigitalPassModalProps> = ({ passData, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!passData) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyCode = () => {
    if (!passData.code) return;
    navigator.clipboard.writeText(passData.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#faf7f0] text-[#1b2413] rounded-3xl shadow-2xl border-2 border-[#dfd4be] overflow-hidden my-4 sm:my-8 animate-in zoom-in-95 duration-200">
        
        {/* Modal Controls Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-3.5 sm:py-4 bg-[#1b2413] text-[#fbf8f1] print:hidden gap-3 border-b border-[#334423]">
          <div className="flex items-center gap-2 min-w-0">
            <ShieldCheck className="w-5 h-5 text-[#dfb752] shrink-0" />
            <span className="font-serif font-bold text-sm sm:text-base tracking-wide truncate">
              Official Pass Credential
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-[#334423] text-[#dfb752] font-mono border border-[#485e33]">
              Security Code Verified
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              id="copy-pass-code-modal-btn"
              onClick={handleCopyCode}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#253319] hover:bg-[#334423] text-[#dfb752] text-xs font-bold rounded-xl transition-colors border border-[#485e33] cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Code Copied' : 'Copy Code'}</span>
            </button>

            <button
              id="print-pass-btn"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#c99e3a] hover:bg-[#dfb752] text-[#1b2413] text-xs font-bold rounded-xl transition-colors shadow cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>

            <button
              id="close-pass-modal-btn"
              onClick={onClose}
              className="p-1.5 text-[#c8d4bc] hover:text-white rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Pass Canvas */}
        <div id="printable-pass" className="p-4 sm:p-6 md:p-8 bg-[#faf7f0] bg-pattern-jaali">
          <div className="border-2 sm:border-3 border-[#c99e3a]/60 rounded-2xl sm:rounded-3xl p-5 sm:p-7 relative bg-white shadow-md">
            
            {/* Top Pass Brand Banner */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between border-b-2 border-[#ede4d2] pb-4 mb-5 gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="shrink-0">
                  <CultrahusLogo size="md" />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] tracking-widest uppercase font-extrabold text-[#705315] block">
                    Cultrahus Festive Conclave • Official Directorate
                  </span>
                  <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#1b2413] leading-tight truncate">
                    Cultrahus Sangam 2026
                  </h2>
                  <p className="text-xs text-[#556345] font-semibold">
                    Garba Night &amp; Celebrity DJ Night • Gurgaon University
                  </p>
                </div>
              </div>

              {/* Status Badge */}
              <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-1 shrink-0">
                <div className="text-[10px] font-bold text-[#253319] bg-[#ebf0e2] px-3 py-1 rounded-full border border-[#b8cbb0] flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#475e31]" />
                  <span>Authenticated Delegate Entry</span>
                </div>
                <span className="text-[10px] text-[#869675] font-mono mt-0.5">
                  Serial #{passData.code.replace(/[^0-9]/g, '').slice(0, 5) || '89421'}
                </span>
              </div>
            </div>

            {/* Credential Title Ribbon */}
            <div className="bg-[#253319] text-[#fbf8f1] px-4 py-2.5 rounded-2xl mb-5 flex items-center justify-between shadow-sm gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <Sparkles className="w-4 h-4 text-[#dfb752] shrink-0" />
                <span className="font-serif font-bold text-sm sm:text-base tracking-wide truncate">
                  {passData.title}
                </span>
              </div>
              <span className="text-[10px] font-mono uppercase tracking-widest bg-[#c99e3a] text-[#1b2413] px-2.5 py-0.5 rounded-lg font-extrabold shrink-0">
                {passData.type.toUpperCase()}
              </span>
            </div>

            {/* Holder & Unique Letter Code Security Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              
              {/* Left Details (7 Columns) */}
              <div className="md:col-span-7 space-y-3.5 text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#705315] block">
                    Accredited Pass Holder
                  </span>
                  <p className="font-serif font-extrabold text-xl text-[#1b2413]">
                    {passData.fullName}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[#705315] block">
                      Registered Contact
                    </span>
                    <p className="font-medium text-[#1b2413] truncate">{passData.email}</p>
                    {passData.phone && (
                      <p className="text-[#556345] font-mono">{passData.phone}</p>
                    )}
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[#705315] block">
                      Fee / Status
                    </span>
                    <p className="font-bold text-[#1b2413] text-sm">{passData.feePaid || 'Confirmed'}</p>
                    <p className="text-[10px] text-[#475e31] font-semibold">{passData.status || 'Verified'}</p>
                  </div>
                </div>

                {(passData.detail1Label || passData.detail2Label) && (
                  <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[#ede4d2]">
                    {passData.detail1Label && (
                      <div>
                        <span className="text-[10px] uppercase font-bold tracking-wider text-[#705315] block">
                          {passData.detail1Label}
                        </span>
                        <p className="font-semibold text-[#1b2413]">{passData.detail1Value}</p>
                      </div>
                    )}

                    {passData.detail2Label && (
                      <div>
                        <span className="text-[10px] uppercase font-bold tracking-wider text-[#705315] block">
                          {passData.detail2Label}
                        </span>
                        <p className="font-semibold text-[#334423]">{passData.detail2Value}</p>
                      </div>
                    )}
                  </div>
                )}

                <div className="flex items-center gap-4 text-[11px] text-[#556345] pt-2">
                  <div className="flex items-center gap-1.5 font-medium">
                    <Calendar className="w-3.5 h-3.5 text-[#c99e3a]" />
                    <span>Sunday, 18 Oct 2026</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-[#475e31]" />
                    <span>Gurgaon University, Gurugram</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Prominent Unique Letter Code Security Box (5 Columns) */}
              <div className="md:col-span-5 bg-[#faf7f0] rounded-2xl border-2 border-[#dfd4be] p-4 flex flex-col items-center justify-center text-center shadow-inner relative overflow-hidden">
                <div className="w-full bg-[#1b2413] text-[#dfb752] py-1.5 px-3 rounded-xl mb-3 flex items-center justify-between text-[10px] font-mono font-bold tracking-wider">
                  <span className="flex items-center gap-1">
                    <Lock className="w-3 h-3" /> PASS KEY
                  </span>
                  <span>SECURITY CODE</span>
                </div>

                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#705315] mb-1">
                  Unique Access Code
                </span>

                {/* THE PROMINENT UNIQUE LETTER CODE */}
                <div 
                  onClick={handleCopyCode}
                  title="Click to copy code"
                  className="w-full py-3 px-2 rounded-xl bg-white border-2 border-[#c99e3a] shadow-sm my-1 cursor-pointer hover:border-[#1b2413] transition-all group"
                >
                  <div className="font-mono font-black text-xl sm:text-2xl text-[#1b2413] tracking-widest select-all">
                    {passData.code}
                  </div>
                  <span className="text-[9px] text-[#869675] group-hover:text-[#1b2413] flex items-center justify-center gap-1 mt-1 font-semibold">
                    <Copy className="w-3 h-3" /> Click to copy unique code
                  </span>
                </div>

                {/* Security Verification Barcode Strip (Graphical Barcode, Not QR) */}
                <div className="w-full mt-3 pt-2.5 border-t border-[#dfd4be] flex flex-col items-center">
                  <div className="h-6 w-36 flex items-center justify-between opacity-80">
                    {/* Simulated security barcode pattern lines */}
                    {[3, 1, 4, 1, 2, 5, 1, 3, 2, 4, 1, 2, 5, 2, 3, 1, 4].map((width, i) => (
                      <span 
                        key={i} 
                        className="bg-[#1b2413] h-full inline-block" 
                        style={{ width: `${width * 1.5}px` }} 
                      />
                    ))}
                  </div>
                  <span className="text-[9px] font-mono text-[#556345] tracking-widest mt-1 uppercase font-bold">
                    Official Gate Passcode
                  </span>
                  <span className="text-[8px] text-[#869675]">
                    Show this code at gate check-in
                  </span>
                </div>

              </div>
            </div>

            {/* Bottom Pass Footer Notice */}
            <div className="mt-5 pt-3 border-t border-[#ede4d2] flex flex-col sm:flex-row items-center justify-between text-[10px] text-[#637550] gap-1">
              <div>
                Issued by Cultrahus Sangam Directorate • Authenticated unique credential.
              </div>
              <div className="font-mono text-[#705315] font-semibold">
                Issued: {passData.issuedIst || new Date().toLocaleDateString('en-IN')}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
